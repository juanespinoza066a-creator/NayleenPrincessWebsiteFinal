import assert from 'node:assert/strict';
import { mock } from 'node:test';
import { parseHTML } from 'linkedom';

const nav = {onLine: true};
globalThis.window = Object.assign(new EventTarget(), {
    CARNIVAL_CONFIG: { mode:'code', deviceMode:true }, navigator:nav
});
const {document} = parseHTML('<html><body></body></html>');
Object.defineProperty(document,'hidden',{value:false});
globalThis.document = document;
let cache = new Map();
globalThis.localStorage = {
    getItem: key => cache.get(key) ?? null,
    setItem: (key, value) => cache.set(key, value),
    removeItem: key => cache.delete(key)
};
const { DEVICE_BACKUP_MS, deviceSaveKey, rememberedIdentity } = await import('../public/assets/js/device-mode.js');
const { loadDevice } = await import('../public/assets/js/device-progress.js');
const { freshState, normalizeState, recordLogin, claimAdvent } = await import('../public/assets/js/game-rules.js');
const now = Date.parse('2026-12-10T17:00:00Z');
mock.timers.enable({apis:['Date','setTimeout'],now});
let remote = {profile:'nayleen', offlineProtocol:1, signedIn:true, adventEnabled:true, adventPreview:false};
let reads = 0, writes = 0, loseAck = false, hold;
const state = freshState(now);
state.chips = 150;
state.prizes = ['frog'];
state.stats.bestDrop = 3700;
recordLogin(state, now);
remote.save = { userId:'nayleen-code-profile',revision:17,state };
globalThis.fetch = async (path, options) => {
    if (!nav.onLine) assert.fail('Offline use attempted to reach ' + path);
    if (path === 'api/code-session') {
        reads++;
        if (hold) await new Promise(resolve => { hold.release = resolve; });
        return {ok:true, json:async () => structuredClone(remote)};
    }
    assert.equal(path,'api/code-save');
    assert.equal(options.method,'PUT');
    const request = JSON.parse(options.body);
    assert.equal(request.revision, remote.save.revision);
    writes++;
    remote.save.state = normalizeState({...request.state,companion:remote.save.state.companion});
    remote.save.revision++;
    if (loseAck) throw new Error('Lost response');
    return {ok:true,json:async () => ({revision:remote.save.revision})};
};
cache.set(deviceSaveKey('nayleen'), JSON.stringify({state,userId:'nayleen-code-profile'}));
cache.set('palace-device-identity-v1',JSON.stringify(remote));
const { CarnivalStore } = await import('../public/assets/js/save-manager.js');
cache.clear();
function newStore(profile = 'nayleen') {
    return Object.assign(new CarnivalStore(), {profile,storageKey:'legacy-'+profile});
}
async function arm(store, identity = remote) {
    await loadDevice(store, identity);
    store.ready = true;
}

const primary = newStore();
await arm(primary);
assert.equal(primary.state.chips, 150);
assert.equal(primary.state.stats.bestDrop, 3700);
assert.deepEqual(primary.state.prizes, ['frog']);
assert.equal(rememberedIdentity().profile, 'nayleen');
assert.equal(reads, 0);
nav.onLine = false;
primary.change(s => {s.chips += 25;});
primary.change(s => claimAdvent(s, 1, false, now));
const restarted = newStore();
await arm(restarted,rememberedIdentity());
assert.equal(restarted.state.chips,175);
assert(restarted.state.advent.days.includes(1));
assert.equal(await restarted.syncProgress(),false);
assert.equal(writes,0);
assert.equal(reads,0);
assert.equal(JSON.parse(cache.get(deviceSaveKey('nayleen'))).state.chips,175);
nav.onLine = true;
restarted.schedule();
mock.timers.tick(DEVICE_BACKUP_MS - 1);
assert.equal(reads,0);
mock.timers.tick(1);
await restarted.deviceSyncTask;
assert.equal(writes,1);
assert.equal(remote.save.state.chips,175);
assert.equal(remote.save.revision,18);
assert.equal(restarted.dirty,false);
assert.equal(await restarted.syncProgress(),true);
assert.equal(writes,1,'unchanged manual progress skips upload');

loseAck = true;
restarted.change(s => {s.chips += 50;});
assert.equal(await restarted.syncProgress(),false);
assert.equal(remote.save.state.chips,225);
assert.equal(JSON.parse(cache.get(deviceSaveKey('nayleen'))).attempt.revision,18);
restarted.pageGone = true;
const recovered = newStore();
await arm(recovered,rememberedIdentity());
loseAck = false;
assert.equal(await recovered.syncProgress(),true);
assert.equal(writes,2,'lost response is recognized after reopening');
assert.equal(recovered.state.chips,225);
assert.equal(recovered.revision,19);
hold = {};
const inFlight = recovered.syncProgress();
recovered.change(s => {s.chips = 255;});
remote.save = {...remote.save, revision:20,state:{...remote.save.state,chips:650}};
hold.release();
hold = null;
assert.equal(await inFlight,false);
assert(recovered.conflict);
assert.equal(recovered.state.chips,255);
assert.equal(remote.save.state.chips,650);
assert.equal(writes,2);
assert.equal(await recovered.retry(),true);
assert.equal(recovered.state.chips,650);
assert.equal(JSON.parse(cache.get(recovered.storageKey+'-before-reload')).chips,255);

nav.onLine = false;
const stale = newStore('testing');
assert.notEqual(stale.state.chips,650);
await assert.rejects(loadDevice(stale, { ...remote,profile:'testing' }), /could not be verified/);
assert.equal(cache.has(deviceSaveKey('testing')),false);

cache = new Map();
nav.onLine = true;
const legacy = newStore();
legacy.state = {...state,chips:321};
legacy.pending = {userId:'nayleen-code-profile', revision:17, dirty:true};
legacy.dirty = true;
await arm(legacy);
assert(legacy.conflict);
assert.equal(legacy.state.chips,321);
assert.equal(remote.save.state.chips,650);
cache = new Map();
await assert.rejects(loadDevice(newStore(), {...remote, offlineProtocol:undefined}), /could not be verified/);
assert.equal(rememberedIdentity(),null);
console.log('PASS: signed migration, ineligible backend, profile isolation, offline Advent and restart, exact backup interval, manual sync, lost acknowledgement, and cross-device edits.');

const juanIdentity = {...remote,profile:'juan',save:{userId:'juan-code-profile',revision:0,state:null}};
const juan = newStore('juan');
await arm(juan,juanIdentity);
assert.equal(juan.state.chips,freshState().chips,'Juan starts without Nayleen’s progress');
juan.change(s => {s.chips=412;});
nav.onLine = false;
assert.equal(rememberedIdentity().profile,'juan');
const offlineJuan = newStore('juan');
await arm(offlineJuan,rememberedIdentity());
assert.equal(offlineJuan.state.chips,412);
assert.equal(cache.has(deviceSaveKey('nayleen')),false);
nav.onLine = true;
assert.equal(await offlineJuan.syncProgress(),false,'a Nayleen session cannot upload the Juan save');
assert.equal(offlineJuan.state.chips,412);
assert.equal(remote.save.state.chips,650);
console.log('PASS: Juan starts fresh, resumes offline and cannot upload to a different profile.');
