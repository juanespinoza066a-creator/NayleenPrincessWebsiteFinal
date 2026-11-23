import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import * as r from '../server/game-rules.js';
import { recoveryState } from '../server/recovery.js';
import { attachAdvent } from '../public/assets/js/winter-advent.js';

const older = r.freshState();
older.advent = { year: 2026, days: [23] };
older.prizes.push('hitler-plush');
const migrated = r.normalizeState(older);
assert.deepEqual(migrated.advent.days, [24]);
assert.equal(r.ADVENT_GIFTS[23].id, 'german-command-bunker');
assert.equal(r.ADVENT_GIFTS[24].id, 'hitler-plush');
assert(!r.unlockedRooms(migrated).includes('german-command-bunker'));
assert.deepEqual(r.normalizeState(migrated).advent.days, [24]);
r.claimAdvent(migrated, 23, true);
r.claimAdvent(migrated, 25, true);
const recovered = recoveryState({ kind: 'nayleen-carnival-backup', profile: 'testing', state: r.freshState() }, migrated, 'testing');
assert.deepEqual(recovered.advent.days, [23, 24, 25]);
assert(recovered.prizes.includes('hitler-plush'));
assert(r.unlockedRooms(recovered).includes('german-command-bunker'));
assert(r.unlockedOutfits(recovered).includes('hitler-espurr'));

const trade = r.testingState();
const protectedItems = [
    { kind: 'collectible', id: 'hitler-plush' },
    { kind: 'outfit', id: 'hitler-espurr' },
    { kind: 'room', id: 'german-command-bunker' }
];
for (const gift of protectedItems) {
    assert(!r.ownedTradeItems(trade).some(x => x.kind === gift.kind && x.id === gift.id));
    const mate = gift.kind === 'room' || gift.kind === 'outfit' ? {kind:'collectible', id:'frog'} : {kind:'outfit', id:'cozy'};
    assert.equal(r.spinRoulette(trade, [gift, mate], 'rose', () => .99), null);
}
assert.equal(r.tradeCollectibles(trade, ['hitler-plush','frog','rose']), null);
const onlyGifts = r.freshState();
onlyGifts.prizes = r.PRIZES.filter(x => x.adventDay).map(x => x.id);
assert.equal(r.cabinetStatus(onlyGifts).owned, 0);
for (const value of [0, .86, .96, .999]) {
    const sample = r.testingState();
    const outcome = r.spinRoulette(sample, ['frog',{kind:'outfit',id:'cozy'}], 'rose', () => value);
    const catalog = outcome.reward.kind === 'room' ? r.ROOMS : outcome.reward.kind === 'outfit' ? r.OUTFITS : r.PRIZES;
    assert(!catalog.find(x => x.id === outcome.reward.id).adventDay);
}

const {window,document} = parseHTML('<header><nav></nav></header>');
Object.assign(globalThis, {window,document,location:{hash:''}});
window.HTMLElement.prototype.scrollIntoView = () => {};
let state = r.normalizeState(JSON.parse(JSON.stringify(recovered)));
const store = {profile:'testing',get state(){return state;},change(fn){fn(state);}};
const ui = attachAdvent(store);
ui.modal.showModal = () => { ui.modal.open = true; };
const doors = [...ui.modal.querySelectorAll('.winter-door')];
assert.equal(doors.filter(door => door.dataset.opened === 'true').length,3);
assert(doors[22].querySelector('img').src.endsWith('german-command-bunker.webp'));
doors[0].click();
doors[1].click();
assert.equal(doors[0].dataset.opened,'true');
assert.equal(doors[1].dataset.opened,'true');
state = r.normalizeState(JSON.parse(JSON.stringify(state)));
ui.tab.click();
assert.equal(doors.filter(door => door.dataset.opened === 'true').length,5);
console.log('PASS: build 30 claim migration, recovery, all three protected gift types, and opened-door state after reload.');
