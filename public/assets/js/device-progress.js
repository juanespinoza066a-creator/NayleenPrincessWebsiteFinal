import { DEVICE_BACKUP_MS, DEVICE_PROTOCOL, deviceSaveKey, readDeviceData,
    rememberIdentity, requestDeviceAccount } from './device-mode.js';
import { normalizeState, validState, recordLogin, tick, dayKey } from './game-rules.js';

function verifiedSave(identity, profile) {
    const save = identity.save;
    // Never accept a profile change, a partial response, or the older site's schema.
    if (identity.profile !== profile || identity.offlineProtocol !== DEVICE_PROTOCOL ||
        !save || save.userId !== profile + '-code-profile' ||
        !Number.isSafeInteger(save.revision) || save.revision < 0 ||
        (save.state === null ? save.revision !== 0 : !validState(save.state))) {
        throw new Error('The account save could not be verified.');
    }
    return save;
}

export function writeDevice(store) {
    localStorage.setItem(deviceSaveKey(store.profile), JSON.stringify({
        state: store.state, revision: store.revision, userId: store.userId,
        dirty: store.dirty, conflict: store.conflict, lastSync: store.lastSync,
        acknowledgedProgress: store.acknowledgedProgress, attempt: store.deviceAttempt
    }));
}

export async function loadDevice(store, identity) {
    const saved = readDeviceData(deviceSaveKey(store.profile));
    if (saved && saved.userId === store.profile + '-code-profile' &&
        Number.isSafeInteger(saved.revision) && saved.revision >= 0 && validState(saved.state)) {
        Object.assign(store, {
            state: normalizeState(saved.state), revision: saved.revision, userId: saved.userId,
            dirty: saved.dirty === true, conflict: saved.conflict === true,
            lastSync: Number.isFinite(saved.lastSync) ? Math.min(saved.lastSync, Date.now()) : 0,
            acknowledgedProgress: saved.acknowledgedProgress ?? null, deviceAttempt: saved.attempt ?? null,
            online: true, compactSaves: true
        });
    } else {
        // Keep the former WebView cache until the cloud copy has been verified.
        identity = identity.save ? identity : await requestDeviceAccount(true);
        const remote = verifiedSave(identity, store.profile);
        store.adventEnabled = identity.adventEnabled !== false;
        store.adventPreview = identity.adventPreview === true;
        const legacy = store.pending;
        if (legacy?.dirty && legacy.userId === remote.userId) {
            store.conflict = legacy.revision !== remote.revision &&
                (!remote.state || store.progressFingerprint(store.state) !== store.progressFingerprint(normalizeState(remote.state)));
        } else {
            store.state = normalizeState(remote.state);
            store.dirty = remote.state === null;
        }
        store.userId = remote.userId;
        store.revision = store.conflict ? legacy.revision : remote.revision;
        store.acknowledgedProgress = remote.state ? store.progressFingerprint(normalizeState(remote.state)) : null;
        store.lastSync = Date.now();
        store.online = true;
        store.compactSaves = true;
    }
    // Local access is armed only after the durable copy exists.
    writeDevice(store);
    rememberIdentity({ ...identity, profile: store.profile });
    store.status = store.conflict ? 'Another device saved a different copy. Your phone’s progress is safe.' : deviceStatus(store);
}

export function deviceStatus(store) {
    return store.lastSync
        ? 'Saved on this phone ♡ · Cloud checked ' + new Date(store.lastSync).toLocaleDateString()
        : 'Saved on this phone ♡';
}

export function scheduleDevice(store) {
    if (!store.ready || !store.dirty || store.conflict || store.deviceSyncTask ||
        store.deviceTimer != null || document.hidden || window.navigator?.onLine === false) return;
    const delay = Math.max(0, store.lastSync + DEVICE_BACKUP_MS - Date.now(), store.retryAfter - Date.now());
    store.deviceTimer = setTimeout(() => {
        store.deviceTimer = null;
        if (!document.hidden) void store.syncDevice();
    }, delay);
}

export async function syncDevice(store, api, {manual = false, replace = false} = {}) {
    if (!store.ready || store.resetting || store.saving || (store.conflict && !replace)) return false;
    clearTimeout(store.deviceTimer);
    store.deviceTimer = null;
    if (window.navigator?.onLine === false) {
        if (manual) { store.status = 'Saved on this phone. Connect to sync ♡'; store.emit(); }
        return false;
    }
    if (!manual && (!store.dirty || Date.now() < Math.max(store.lastSync + DEVICE_BACKUP_MS, store.retryAfter))) return false;
    if (!store.persistDevice()) { store.emit(); return false; }
    store.syncNeedsSignIn = false;
    try {
        const identity = await requestDeviceAccount(true);
        const remote = verifiedSave(identity, store.profile);
        const cloudState = remote.state && normalizeState(remote.state);
        const cloud = cloudState && store.progressFingerprint(cloudState);
        const local = store.progressFingerprint(store.state);
        if (store.pageGone) return false;
        if (remote.revision < store.revision) throw new Error('The account save could not be verified.');
        // A response may have been lost after a successful write. Only accept
        // that newer revision if it matches the saved attempted upload.
        const ownWrite = remote.revision === store.revision + 1 && cloud &&
            cloud === store.deviceAttempt?.fingerprint && store.deviceAttempt.revision === store.revision;
        if (!replace && remote.revision > store.revision && store.dirty &&
            !ownWrite && cloud !== local && cloud !== store.acknowledgedProgress) {
            store.conflict = true;
            store.status = 'Another device saved a different copy. Your phone’s progress is safe.';
            return false;
        }
        if (replace && !cloudState) throw new Error("There is no cloud copy to reload.");
        if (replace) localStorage.setItem(store.storageKey + '-before-reload', JSON.stringify(store.state));
        if (cloudState && (replace || (!store.dirty && remote.revision > store.revision))) {
            store.state = cloudState;
            store.dirty = recordLogin(store.state) || store.dirty && !replace;
            if (tick(store.state) > 0) store.dirty = true;
            store.lastLoginDay = dayKey();
        } else if (cloud !== null && cloud === local) {
            store.dirty = false;
        }
        store.revision = remote.revision;
        store.acknowledgedProgress = cloud;
        store.deviceAttempt = null;
        if (store.dirty && !replace) {
            const fingerprint = store.progressFingerprint(store.state);
            const body = JSON.stringify({ state: store.cloudSnapshot(), revision: store.revision });
            store.deviceAttempt = { revision: store.revision, fingerprint };
            if (!store.persistDevice()) throw new Error('Could not keep a local recovery copy before syncing.');
            const result = await api('api/player', {
                method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Palace-Profile': store.profile }, body
            });
            if (store.pageGone) return false;
            if (!Number.isSafeInteger(result.revision) || result.revision <= store.revision)
                throw new Error('The cloud did not confirm the save.');
            store.revision = result.revision;
            store.dirty = store.progressFingerprint(store.state) !== fingerprint;
            store.acknowledgedProgress = fingerprint;
            store.deviceAttempt = null;
        }
        rememberIdentity(identity);
        store.adventEnabled = identity.adventEnabled !== false;
        store.adventPreview = identity.adventPreview === true;
        store.conflict = false;
        store.lastSync = Date.now();
        store.retryAfter = 0;
        store.status = deviceStatus(store);
        return true;
    } catch (error) {
        store.syncNeedsSignIn = error.status === 401;
        // Re-read on the next attempt so a racing cloud update is checked by revision.
        store.retryAfter = Date.now() + 5 * 60 * 1000;
        store.status = store.syncNeedsSignIn
            ? 'Saved on this phone. Sign in again to sync ♡'
            : 'Saved on this phone. Cloud sync can try again later ♡';
        return false;
    } finally {
        if (!store.pageGone) { store.persistDevice(); store.emit(); }
    }
}
