import {CODE_LOGIN,ensureCodeLogin,onCodeLogout} from './code-login.js';
import { SAVE_KEY, freshState, normalizeState, validState, tick, unlockedOutfits } from './game-rules.js';
export const STATIC = window.CARNIVAL_CONFIG?.mode === 'static';
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
    remember() { try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.state));
        localStorage.setItem(this.storageKey + '-pending', JSON.stringify({ dirty: this.dirty, revision: this.revision, userId: this.userId }));
        return true;
    }
    catch {
        this.status = 'Browser storage is unavailable. Download a backup before leaving.';
        return false;
    } }
    async load() {
        const identity = await ensureCodeLogin();
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
            } catch { this.state = freshState(); this.pending = null; }
            onCodeLogout(() => this.save());
        }
        if (STATIC) {
            this.status = 'Saved in this browser. Use a backup to move your progress to another device.';
        }
        else
            try {
                const data = await api('api/player');
                const pending = this.pending?.dirty && this.pending.userId === data.userId;
                if (!pending) this.state = normalizeState(data.state);
                this.conflict = Boolean(pending && this.pending.revision !== data.revision);
                this.userId = data.userId;
                this.revision = data.revision;
                this.online = true;
                this.dirty = Boolean(pending || !data.state);
                this.status = this.conflict ? 'Another window saved newer progress. Download a backup before reloading the account save.' : 'Room, outfits, and crunches are saved to your account.';
            }
            catch (error) {
                this.status = error.status === 401 ? 'Saved in this browser. Account sync needs sign-in.' : 'Account save couldn’t load. Playing on this device until you retry.';
            }
        const earned = tick(this.state);
        this.offlineEarnings = earned;
        this.ready = true;
        if (earned > 0)
            this.dirty = true;
        this.remember();
        this.emit({ offlineEarnings: earned });
        this.schedule();
        this.timer = setInterval(() => {
            if (!this.ready)
                return;
            const previous = unlockedOutfits(this.state), amount = tick(this.state);
            if (amount > 0)
                this.dirty = true;
            this.remember();
            if (amount > 0) {
                this.emit({ unlocked: unlockedOutfits(this.state).filter(id => !previous.includes(id)) });
                if (Date.now() - this.lastSync > 30000)
                    void this.save();
            }
        }, 1000);
        document.addEventListener('visibilitychange', () => { if (document.hidden) {
            this.remember();
            void this.save();
        } });
        return this;
    }
    change(fn) { if (!this.ready)
        return; tick(this.state); const before = unlockedOutfits(this.state); fn(this.state); this.dirty = true; this.remember(); this.emit({ unlocked: unlockedOutfits(this.state).filter(id => !before.includes(id)) }); this.schedule(); }
    schedule() { clearTimeout(this.debounce); this.debounce = setTimeout(() => void this.save(), 750); }
    async save() {
        if (!this.online || this.saving || this.conflict || !this.dirty)
            return;
        this.saving = true;
        while (this.dirty && !this.conflict) {
            this.dirty = false;
            const snapshot = structuredClone(this.state);
            try {
                const data = await api('api/player', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ state: snapshot, revision: this.revision }) });
                this.revision = data.revision;
                this.lastSync = Date.now();
                this.status = 'Room, outfits, and crunches are saved to your account.';
                this.remember();
            }
            catch (error) {
                this.dirty = true;
                this.conflict = error.status === 409;
                this.status = this.conflict ? 'Another window saved newer progress. Download this device’s backup before reloading the account save.' : 'Account save didn’t finish. Your progress is kept in this browser.';
                this.emit();
                break;
            }
        }
        this.saving = false;
        this.emit();
    }
    async retry() {
        if (this.online && !this.conflict)
            return this.save();
        try {
            const data = await api('api/player');
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
