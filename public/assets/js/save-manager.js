import { DEVICE_MODE } from './device-mode.js';
import { loadDevice, writeDevice, deviceStatus, scheduleDevice, syncDevice } from './device-progress.js';
import {cleanCompanion} from './companion-model.js';
import {CODE_LOGIN,ensureCodeLogin,onCodeLogout} from './code-login.js';
import { SAVE_KEY, freshState, normalizeState, validState, tick, unlockedOutfits, recordLogin, dayKey, passiveRate, MAX_CRUNCHES } from './game-rules.js';
export const STATIC = window.CARNIVAL_CONFIG?.mode === 'static';
const ROUTINE_SYNC_MS = 30 * 60 * 1000;
const EDIT_SYNC_MS = 5000;
const FAILED_SYNC_RETRY_MS = 30000;
const KEEPALIVE_LIMIT = 60 * 1024;

export async function api(path, options = {}) {
    const response = await fetch(CODE_LOGIN && path === 'api/player' ? 'api/code-save' : path, { cache: 'no-store', signal: AbortSignal.timeout(10000), ...options });
    let data;
    try {
        data = await response.json();
    }
    catch {
        throw Object.assign(new Error('The save service is unavailable.'), { status: response.status });
    }
    if (!response.ok)
        throw Object.assign(new Error(data.error || 'Please try again.'), { status: response.status });
    return data;
}
export class CarnivalStore {
    constructor() {
        this.state = freshState();
        this.listeners = new Set();
        this.revision = 0;
        this.online = false;
        this.dirty = false;
        this.saving = false;
        this.conflict = false;
        this.ready = false;
        this.status = 'Opening your little carnival…';
        this.lastSync = Date.now();
        this.lastRemember = 0;
        this.retryAfter = 0;
        this.lastLoginDay = null;
        this.storageKey = CODE_LOGIN ? null : SAVE_KEY;
        try {
            if (CODE_LOGIN) return;
            this.state = normalizeState(JSON.parse(localStorage.getItem(SAVE_KEY) || localStorage.getItem('nayleen-carnival-room-v1') || 'null'));
            this.pending = JSON.parse(localStorage.getItem(SAVE_KEY + '-pending') || 'null');
            this.userId = this.pending?.userId;
            this.revision = this.pending?.revision || 0;
        }
        catch { }
    }
    subscribe(fn) { this.listeners.add(fn); fn(this.state, { status: this.status }); return () => this.listeners.delete(fn); }
    emit(extra = {}) { for (const fn of this.listeners)
        fn(this.state, { status: this.status, ...extra }); }
    persistDevice() {
        if (this.pageGone || !this.userId) return false;
        try { writeDevice(this); return true; }
        catch { this.status = 'Phone storage is full or unavailable. Download a backup before leaving.'; return false; }
    }
    syncDevice(options) {
        if (!this.deviceSyncTask) {
            this.deviceSyncTask = syncDevice(this, api, options).finally(() => {
                this.deviceSyncTask = null;
                scheduleDevice(this);
            });
        }
        return this.deviceSyncTask;
    }
    remember() { try {
        if (DEVICE_MODE) return this.persistDevice();
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        localStorage.setItem(this.storageKey + '-pending', JSON.stringify({ dirty: this.dirty || this.saving, revision: this.revision, userId: this.userId }));
        return true;
    }
    catch {
        this.status = 'Browser storage is unavailable. Download a backup before leaving.';
        return false;
    } }
    async load() {
        const identity = await ensureCodeLogin();
        this.profile = CODE_LOGIN ? identity.profile : 'local';
        this.adventEnabled = identity?.adventEnabled !== false;
        this.adventPreview = identity?.adventPreview === true;
        if (CODE_LOGIN) {
            this.storageKey = SAVE_KEY + '-code-' + identity.profile;
            try {
                let raw = localStorage.getItem(this.storageKey), pending = localStorage.getItem(this.storageKey + '-pending');
                // Migrate only the identifiable old Nayleen cache; never copy it into testing.
                if (!raw && identity.profile === 'nayleen') {
                    const oldPending = JSON.parse(localStorage.getItem(SAVE_KEY + '-pending') || 'null');
                    if (oldPending?.userId === 'nayleen-code-profile') { raw = localStorage.getItem(SAVE_KEY); pending = JSON.stringify(oldPending); }
                }
                this.state = normalizeState(JSON.parse(raw || 'null'));
                this.pending = JSON.parse(pending || 'null');
                this.userId = this.pending?.userId; this.revision = this.pending?.revision || 0;
                this.dirty = Boolean(this.pending?.dirty);
            } catch { this.state = freshState(); this.pending = null; }
            onCodeLogout(() => this.save());
        }
        if (DEVICE_MODE) {
            try { await loadDevice(this, identity); }
            catch (error) {
                this.status = identity.offlineProtocol !== 1
                    ? 'Install the Palace website update before opening your existing save.'
                    : 'Connect to the internet, then reopen Palace to bring your save onto this phone.';
                this.emit();
                return this;
            }
        }
        else if (STATIC) {
            this.status = 'Saved in this browser. Use a backup to move your progress to another device.';
        }
        else
            try {
                const data = identity?.save ?? await api('api/player');
                let pending = this.pending?.dirty && this.pending.userId === data.userId;
                if (pending && this.pending.revision !== data.revision && data.state) {
                    // The last write may have reached the server as the page closed.
                    // Only adopt a newer revision automatically when its state matches.
                    if (JSON.stringify(this.state) === JSON.stringify(normalizeState(data.state))) pending = false;
                }
                if (!pending) this.state = normalizeState(data.state);
                this.conflict = Boolean(pending && this.pending.revision !== data.revision);
                this.userId = data.userId;
                this.revision = data.revision;
                this.online = true;
                this.compactSaves = Boolean(identity?.save);
                this.acknowledgedProgress = data.state ? this.progressFingerprint(data.state) : null;
                this.dirty = Boolean(pending || !data.state);
                this.status = this.conflict ? 'Another window saved newer progress. Download a backup before reloading the account save.' : 'Room, outfits, and squishes are saved to your account.';
            }
            catch (error) {
                this.status = error.status === 401 ? 'Saved in this browser. Account sync needs sign-in.' : 'Account save couldn’t load. Playing on this device until you retry.';
            }
        const now = Date.now();
        this.lastLoginDay = dayKey(now);
        if (recordLogin(this.state, now)) this.dirty = true;
        const earned = tick(this.state, now);
        this.offlineEarnings = earned;
        this.ready = true;

        let companionRefresh;
        window.addEventListener('palace-companion-refresh', event => {
            if (DEVICE_MODE && !event.palaceReset) return;
            clearTimeout(companionRefresh);
            companionRefresh = setTimeout(() => void this.refreshCompanion(), 2000);
            // A testing reset may finish updating the native widget after the first read.
            if (event.palaceReset) setTimeout(() => void this.refreshCompanion(), 6000);
        });
        if (DEVICE_MODE) window.addEventListener('palace-local-weather', ({detail}) => {
            if (detail?.[0] !== this.profile || !Array.isArray(detail[1]) || this.resetting) return;
            const settings = this.state.companion.settings.value;
            const weather = new Set(settings.weatherSeen || []);
            const before = weather.size;
            for (const kind of detail[1])
                if (['sun','cloud','rain','storm','wind','cold','snow','night'].includes(kind)) weather.add(kind);
            if (weather.size !== before) this.change(() => { settings.weatherSeen = [...weather]; });
        });
        const saveOnOpen = this.dirty;
        if (earned > 0) this.dirty = true;
        this.remember();
        this.emit({ offlineEarnings: earned });
        this.schedule(!saveOnOpen);
        this.timer = setInterval(() => this.updateClock(), 1000);
        const flush = () => {
            if (!this.dirty && !this.saving) return;
            this.remember();
            // A game can capture its final checkpoint in this same browser event.
            if (!DEVICE_MODE) queueMicrotask(() => void this.save({ keepalive: true }));
        };
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) flush();
            else { this.updateClock(); this.schedule(true); }
        });
        window.addEventListener('pagehide', () => {
            if (DEVICE_MODE) {
                clearTimeout(this.deviceTimer);
                this.remember();
                this.pageGone = true;
            } else flush();
        });
        if (DEVICE_MODE) window.addEventListener('online', () => this.schedule(true));
        return this;
    }
    updateClock() {
        if (!this.ready || this.resetting || document.hidden) return;
        const now = Date.now();
        const day = dayKey(now);
        if (day !== this.lastLoginDay) {
            this.lastLoginDay = day;
            if (recordLogin(this.state, now)) {
                this.dirty = true;
                this.rememberSoon();
                this.emit();
                this.schedule();
            }
        }
        // Only take an outfit snapshot when passive income can change progression.
        const earns = this.state.clicker.lifetime < MAX_CRUNCHES && passiveRate(this.state) > 0;
        const before = earns ? new Set(unlockedOutfits(this.state)) : null;
        if (tick(this.state, now) <= 0) return;
        this.dirty = true;
        if (now - this.lastRemember >= 5000) {
            this.remember();
            this.lastRemember = now;
        }
        this.emit({ unlocked: unlockedOutfits(this.state).filter(id => !before?.has(id)) });
        this.schedule(true);
    }
    rememberSoon(){if(this.rememberTimer)return;this.rememberTimer=setTimeout(()=>{this.rememberTimer=null;this.remember();},200);}
    emitFrame(extra){this.frameExtra??={unlocked:[]};this.frameExtra.unlocked.push(...(extra.unlocked||[]));if(this.frame)return;if(typeof requestAnimationFrame!=='function'){const event=this.frameExtra;this.frameExtra=null;this.emit(event);return;}this.frame=requestAnimationFrame(()=>{this.frame=null;const event=this.frameExtra;this.frameExtra=null;this.emit(event);});}
    change(fn,options={}) { if (!this.ready)
        return;
        if(options.game){fn(this.state);this.dirty=true;this.rememberSoon();this.schedule(true);return;}
        tick(this.state); const before = unlockedOutfits(this.state); fn(this.state); this.dirty = true; this.status = DEVICE_MODE ? deviceStatus(this) : this.online ? 'Saving your treasures…' : 'Kept on this device. Try saving again when you’re connected.'; const event={unlocked:unlockedOutfits(this.state).filter(id=>!before.includes(id))};if(options.rapid){this.rememberSoon();this.emitFrame(event);}else{this.remember();this.emit(event);}this.schedule(Boolean(options.rapid)); }
    schedule(routine = false) {
        if (DEVICE_MODE) { scheduleDevice(this); return; }
        if (!this.online || this.conflict || !this.dirty) return;
        if (this.debounce != null || (routine && (document.hidden || this.gameSaveTimer != null))) return;
        const delay = routine ? Math.max(0, this.lastSync + ROUTINE_SYNC_MS - Date.now()) : EDIT_SYNC_MS;
        const wait = Math.max(delay, this.retryAfter - Date.now());
        const timer = routine ? 'gameSaveTimer' : 'debounce';
        clearTimeout(this[timer]);
        this[timer] = setTimeout(() => {
            this[timer] = null;
            if (!routine || !document.hidden) void this.save({ routine });
        }, wait);
    }
    save({ routine = false, keepalive = false } = {}) {
        if (DEVICE_MODE) { this.remember(); return Promise.resolve(); }
        if (this.saving) {
            if (!routine && this.dirty) {
                this.saveAgain = true;
                this.keepaliveSave ||= keepalive;
            }
            return this.saveTask;
        }
        if (!this.online || this.conflict || !this.dirty) return Promise.resolve();
        this.saving = true;
        this.keepaliveSave = keepalive;
        this.saveTask = this.writePending();
        return this.saveTask;
    }
    progressFingerprint(state) {
        const { companion, clicker, ...progress } = state;
        const { lastTick, ...clickerProgress } = clicker;
        return JSON.stringify({ ...progress, clicker: clickerProgress });
    }
    cloudSnapshot() {
        const { companion, ...progress } = this.state;
        if (!this.compactSaves || this.revision < 1 || !companion) return this.state;
        // The save RPC retains companion data. Weather settings are included for
        // outfit validation, while notes, dates and playlists use their own sync.
        return { ...progress, companion: {
            ...cleanCompanion(),
            epoch: companion.epoch,
            settings: companion.settings
        } };
    }
    async writePending() {
        // Clear the scheduled write when an explicit save already covers its changes.
        clearTimeout(this.debounce);
        clearTimeout(this.gameSaveTimer);
        this.debounce = this.gameSaveTimer = null;
        do {
            this.saveAgain = false;
            this.dirty = false;
            try {
                const fingerprint = this.progressFingerprint(this.state);
                if (fingerprint === this.acknowledgedProgress) {
                    this.status = 'Saved ♡';
                    this.retryAfter = 0;
                    break;
                }
                const body = JSON.stringify({ state: this.cloudSnapshot(), revision: this.revision });
                const canKeepalive = this.keepaliveSave && new TextEncoder().encode(body).byteLength <= KEEPALIVE_LIMIT;
                this.keepaliveSave = false;
                const data = await api('api/player', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body,
                    keepalive: canKeepalive
                });
                this.revision = data.revision;
                this.acknowledgedProgress = fingerprint;
                this.lastSync = Date.now();
                this.retryAfter = 0;
                this.status = 'Saved ♡';
            } catch (error) {
                this.dirty = true;
                this.conflict = error.status === 409;
                this.retryAfter = Date.now() + FAILED_SYNC_RETRY_MS;
                this.status = this.conflict ? 'Another window saved newer progress. Download this device’s backup before reloading the account save.' : 'Account save didn’t finish. Your progress is kept in this browser.';
                break;
            }
        } while (this.dirty && this.saveAgain);
        this.saving = false;
        this.remember();
        this.emit();
        // Changes made during the request can wait for the next routine save.
        if (this.dirty && !this.retryAfter) {
            clearTimeout(this.gameSaveTimer);
            this.gameSaveTimer = null;
            this.schedule(true);
        }
    }
    flushGame() {
        clearTimeout(this.rememberTimer);
        this.rememberTimer = null;
        this.remember();
        this.schedule(true);
    }
    async resetTesting(){
        if(this.profile!=='testing'||!this.online||STATIC)throw new Error('Open your Palace before resetting.');
        if(this.resetting)throw new Error('Your Palace is already resetting.');
        if (DEVICE_MODE && !await this.syncDevice({manual:true})) throw new Error('Sync your testing Palace before resetting.');
        this.resetting=true;
        try{
            clearTimeout(this.debounce);
            clearTimeout(this.gameSaveTimer);
            this.debounce = this.gameSaveTimer = null;
            // Let an acknowledged in-flight write finish before choosing a revision.
            while(this.saving)await new Promise(resolve=>setTimeout(resolve,25));
            await this.save();
            if(this.conflict||this.dirty)throw new Error('Finish syncing this device before resetting.');
            const data=await api('api/player',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'reset-testing',revision:this.revision})});
            this.state=normalizeState(data.state);this.revision=data.revision;this.dirty=false;this.acknowledgedProgress=this.progressFingerprint(this.state);
            this.status='A fresh start ♡ Today is login day 1.';this.remember();this.emit();
            window.dispatchEvent(Object.assign(new Event('palace-companion-refresh'),{palaceReset:true}));
        }finally{this.resetting=false;}
    }
    async refreshCompanion(){if(!this.ready||!this.online||STATIC||!CODE_LOGIN)return;try{const profile=this.profile,data=await api('api/companion');if(profile!==this.profile||data.profile!==profile)return;this.state.companion=cleanCompanion(data.companion);this.remember();this.emit();}catch{}}
    async syncProgress() {
        if (DEVICE_MODE) return this.syncDevice({manual:true});
        if (!this.ready || STATIC || this.conflict || this.resetting) return;
        if (this.dirty || this.saving) {
            if (this.online) return this.save();
            return this.retry();
        }

        const revision = this.revision;
        const state = this.state;
        try {
            const data = await api('api/player');
            // A game action or save started while the download was in flight.
            if (this.dirty || this.saving || this.resetting || this.conflict ||
                this.revision !== revision || this.state !== state) return;
            if (!Number.isSafeInteger(data.revision) || data.revision < revision ||
                (this.userId && data.userId !== this.userId) ||
                (data.state && !validState(data.state))) throw new Error('Invalid account save');

            if (data.state && data.revision > revision) {
                this.state = normalizeState(data.state);
                this.acknowledgedProgress = this.progressFingerprint(this.state);
                const now = Date.now();
                const loggedIn = recordLogin(this.state, now);
                this.dirty = tick(this.state, now) > 0 || loggedIn;
                this.lastLoginDay = dayKey(now);
            }
            this.revision = data.revision;
            this.userId = data.userId;
            this.online = true;
            this.status = 'Saved ♡';
            this.remember();
            this.emit();
            if (this.dirty) await this.save();
        } catch {
            this.status = 'Try saving again in a moment.';
            this.emit();
        }
    }
    async retry() {
        if (DEVICE_MODE) return this.syncDevice({manual:true, replace:this.conflict});
        if (this.online && !this.conflict)
            return this.save();
        try {
            const data = await api('api/player');
            if (this.dirty && !this.conflict) {
                if (data.userId !== this.userId || data.revision !== this.revision) {
                    this.conflict = true;
                    this.status = 'Another device saved newer progress. Keep a backup before choosing which copy to use.';
                    this.emit(); return;
                }
                this.online = true; await this.save(); return;
            }
            if (!data.state || validState(data.state)) {
                // Keep a recovery copy before the visitor explicitly reloads the account save.
                try {
                    localStorage.setItem(this.storageKey + '-before-reload', JSON.stringify(this.state));
                }
                catch { }
                this.state = normalizeState(data.state);
                tick(this.state);
            }
            this.revision = data.revision;
            this.acknowledgedProgress = null;
            this.userId = data.userId;
            this.online = true;
            this.conflict = false;
            this.dirty = true;
            this.remember();
            this.emit();
            await this.save();
        }
        catch {
            this.status = 'The account save is still unavailable. Your browser progress is kept here.';
            this.emit();
        }
    }
}
export function downloadJSON(name, data) { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
