// Only the APK's packaged settings enable this mode.
export const DEVICE_MODE = globalThis.window?.CARNIVAL_CONFIG?.deviceMode === true;
export const DEVICE_BACKUP_MS = 3 * 24 * 60 * 60 * 1000;
export const DEVICE_PROTOCOL = 1;
const identityKey = 'palace-device-identity-v1';

export function readDeviceData(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
}

export function deviceSaveKey(profile) {
    return 'palace-device-save-v1-' + profile;
}

export function rememberedIdentity() {
    const identity = readDeviceData(identityKey);
    if (!['nayleen', 'testing'].includes(identity?.profile)) return null;
    const saved = readDeviceData(deviceSaveKey(identity.profile));
    if (!saved || saved.userId !== identity.profile + '-code-profile' || typeof saved.state !== 'object') return null;
    return identity;
}

export function rememberIdentity(identity) {
    if (identity?.offlineProtocol !== DEVICE_PROTOCOL) return;
    const { profile, adventEnabled, adventPreview, offlineProtocol } = identity;
    localStorage.setItem(identityKey, JSON.stringify({ profile, adventEnabled, adventPreview, offlineProtocol }));
}

export function forgetIdentity() {
    localStorage.removeItem(identityKey);
}

export async function requestDeviceAccount(progress = false) {
    const response = await fetch('api/code-session', {
        cache: 'no-store', signal: AbortSignal.timeout(8000),
        headers: progress ? { 'X-Palace-Load': 'progress', 'X-Palace-Device': '1' } : {}
    });
    if (!response.ok) throw Object.assign(new Error('Palace could not reach your account.'), { status: response.status });
    const identity = await response.json();
    if (!identity.signedIn) throw Object.assign(new Error('Sign in again to sync progress.'), { status: 401 });
    if (identity.offlineProtocol !== DEVICE_PROTOCOL) throw new Error('This Palace needs the website update before it can sync.');
    return identity;
}

if(DEVICE_MODE)window.addEventListener('pageshow',event=>{if(event.persisted)location.reload();});
