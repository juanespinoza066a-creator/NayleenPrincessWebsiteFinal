import assert from 'node:assert/strict';
import { mock } from 'node:test';

globalThis.window = {};
globalThis.document = { hidden: false };
const cache = new Map();
globalThis.localStorage = {
    getItem(key) { return cache.get(key) ?? null; },
    setItem(key, value) { cache.set(key, value); }
};
const { CarnivalStore } = await import('../public/assets/js/save-manager.js');

mock.timers.enable({ apis: ['setTimeout', 'Date'], now: Date.parse('2026-11-23T18:00:00Z') });
const writes = [];
let fail = false;
let hold = false;
let release;
let cloud;
let cloudReads = 0;
globalThis.fetch = async (path, options) => {
    assert.equal(path, 'api/player');
    if (!options.method) {
        cloudReads++;
        return { ok: true, json: async () => cloud };
    }
    assert.equal(options.method, 'PUT');
    const request = JSON.parse(options.body);
    writes.push({ ...request, keepalive: options.keepalive });
    if (hold) await new Promise(resolve => { release = resolve; });
    return {
        ok: !fail,
        status: fail ? 503 : 200,
        json: async () => fail ? { error: 'Offline' } : { revision: request.revision + 1 }
    };
};
const store = new CarnivalStore();
store.ready = true;
store.online = true;
store.lastRemember = Date.now();
store.updateClock();
await store.save(); // First login is an important event.
writes.length = 0;

async function advance(ms) {
    mock.timers.tick(ms);
    if (store.saving && !hold) await store.saveTask;
}

for (let i = 0; i < 10; i++) {
    await advance(1000);
    store.updateClock();
}
assert.equal(writes.length, 0, 'idle account without passive income stays quiet');

for (let i = 0; i < 75; i++) {
    store.change(s => { s.stats.bestDrop++; }, { game: true });
    for (let second = 0; second < 8; second++) await advance(1000);
}
assert.equal(writes.length, 0, 'routine checkpoints make no writes in a ten-minute game');
await advance(30 * 60 * 1000 - 610000);
assert.equal(writes.length, 1, 'the first routine save runs after 30 minutes');
assert.equal(writes.at(-1).state.stats.bestDrop, 75);
store.change(s => { s.stats.bestDrop += 10; }, { game: true });
await store.flushGame();
assert.equal(writes.length, 2, 'exiting flushes only the unsynced tail');
assert.equal(writes.at(-1).state.stats.bestDrop, 85);
assert.equal(writes.at(-1).keepalive, true);

store.change(s => { s.clicker.manual++; }, { rapid: true });
await advance(250);
assert.equal(JSON.parse(cache.get(store.storageKey)).clicker.manual, 1, 'rapid taps are saved locally first');
assert.equal(writes.length, 2);
store.change(s => { s.chips += 25; });
await advance(750);
assert.equal(writes.length, 3, 'meaningful actions still save promptly');
assert.equal(writes.at(-1).state.clicker.manual, 1);
assert.equal(writes.at(-1).state.chips, 125);

hold = true;
store.change(s => { s.stats.bestDrop++; }, { game: true });
await advance(30 * 60 * 1000);
assert.equal(writes.length, 4);
store.change(s => { s.stats.bestDrop++; }, { game: true });
hold = false;
release();
await store.saveTask;
assert.equal(writes.length, 4, 'a checkpoint during a PUT does not trigger a second immediate PUT');
assert.equal(JSON.parse(cache.get(store.storageKey)).stats.bestDrop, 87);
assert(store.dirty);

fail = true;
await advance(30 * 60 * 1000);
assert(store.dirty);
assert.equal(writes.length, 5);
for (let i = 0; i < 10; i++) {
    store.change(s => { s.clicker.manual++; }, { rapid: true });
    await advance(1000);
}
assert.equal(writes.length, 5, 'connection failures do not produce rapid retries');
fail = false;
await advance(20000);
assert.equal(writes.length, 6);
assert(!store.dirty);
assert.equal(writes.at(-1).state.clicker.manual, 11);
assert.equal(writes.at(-1).state.stats.bestDrop, 87);


store.change(s => { s.chips += 25; }, { game: true });
await store.syncProgress();
assert.equal(writes.length, 7, 'manual sync pushes pending progress immediately');
assert.equal(writes.at(-1).state.chips, 150);
assert.equal(cloudReads, 0);

cloud = { userId: 'palace-profile', revision: store.revision + 1, state: structuredClone(store.state) };
cloud.state.chips = 250;
await store.syncProgress();
assert.equal(cloudReads, 1);
assert.equal(writes.length, 7, 'manual sync reads newer progress without writing an unchanged copy');
assert.equal(store.state.chips, 250);
assert.equal(store.revision, cloud.revision);

let deliverCloud;
const fastFetch = globalThis.fetch;
globalThis.fetch = (path, options) => options.method ? fastFetch(path, options) :
    new Promise(resolve => { deliverCloud = resolve; });
const downloading = store.syncProgress();
store.change(s => { s.chips = 275; }, { game: true });
deliverCloud({ ok: true, json: async () => ({ ...cloud, revision: cloud.revision + 1 }) });
await downloading;
assert.equal(store.state.chips, 275, 'in-flight manual pull preserves an edit made on this device');
assert(store.dirty);
