import assert from 'node:assert/strict';
import * as rules from '../server/game-rules.js';
import { recoveryState } from '../server/recovery.js';

const clock = Date.now;
let time = Date.parse('2026-11-29T18:00:00Z');
Date.now = () => time;
try {
    const previous = rules.testingState();
    previous.tradeWeeks = [2];
    const save = rules.normalizeState(previous);
    const week = rules.mondayKey();
    const offerings = ['espurr', 'frog', 'rose'];
    assert.equal(rules.cabinetStatus(save).left, 1);
    assert(rules.tradeCollectibles(save, offerings, week, () => 0));
    assert.equal(rules.cabinetStatus(save).left, 0);
    for (const id of offerings) assert.equal(rules.awardPrize(save, id), false);
    assert.equal(rules.tradeCollectibles(save, ['mimikyu', 'sunday', 'peanut']), null);

    const coolOutfit = 'weather-cloud';
    save.companion.settings.value.weatherSeen = ['cloud'];
    save.outfit = coolOutfit;
    rules.beginMaze(save, rules.weekNumber(), () => 0);
    save.outfit = 'royal';
    save.manorRun.loot = [{ id: 'frog', claimed: false }];
    save.weeklyBox = { id: 'rose', week: 2, revealed: false };
    assert(rules.spinRoulette(save, [
        { kind: 'outfit', id: coolOutfit },
        { kind: 'room', id: 'cafe' }
    ], null, () => 0.99, week));
    assert.equal(rules.rouletteStatus(save).left, 0);
    assert(!rules.unlockedOutfits(save).includes(coolOutfit));
    assert(!rules.grantItem(save, 'room', 'cafe'));
    assert.equal(rules.beginMaze(save, rules.weekNumber()).outfit, 'royal');
    assert(!offerings.includes(rules.claimMazePrize(save, 0, () => 0).id));
    assert(!offerings.includes(rules.revealBox(save, () => 0).id));
    rules.beginDrop(save, () => 0, week).score = 1500;
    assert(!offerings.includes(rules.claimDropPrize(save, () => 0, week).id));

    const restored = recoveryState({ kind: 'nayleen-carnival-backup', state: previous }, save, 'testing');
    assert.equal(rules.cabinetStatus(restored).left, 0);
    assert.equal(rules.rouletteStatus(restored).left, 0);
    assert(!restored.prizes.includes('frog'));
    assert(!rules.unlockedRooms(restored).includes('cafe'));
    assert(!rules.unlockedOutfits(restored).includes(coolOutfit));
    time += 86400000;
    assert.equal(rules.cabinetStatus(restored).left, 2);
    assert.equal(rules.rouletteStatus(restored).left, 1);
    time += 13 * 86400000 - 1;
    assert(!rules.awardPrize(save, 'frog'));
    assert(!rules.unlockedOutfits(save).includes(coolOutfit));
    time++;
    assert(rules.awardPrize(save, 'frog'));
    assert(rules.unlockedOutfits(save).includes(coolOutfit));
    assert(rules.grantItem(save, 'room', 'cafe'));
    assert(rules.unlockedRooms(save).includes('cafe'));
    assert.deepEqual(rules.normalizeState(save).sacrificeUntil, {});
    assert(rules.validState(save));
} finally {
    Date.now = clock;
}
console.log('PASS: two cabinet wishes, a legacy wish carries over, weekly exchanges reset, pending drops reroll, recovery preserves cooldowns, Hunt uses owned outfits, and all three categories can return at 14 days.');

const {parseHTML} = await import('linkedom');
const {updateSacrificeBars} = await import('../public/assets/js/progress-view.js');
const {document} = parseHTML('<div id="items"><button></button><button></button></div>');
globalThis.document = document;
const cards = document.getElementById('items');
const now = Date.parse('2026-11-23T12:00:00Z');
for (const kind of ['room','outfit']) {
    const items = [{id:'first'}, {id:'second'}];
    const state = {sacrificeUntil: {[kind+':first']: now + 14*86400000}};
    updateSacrificeBars(cards, items, state, kind, now);
    assert.equal(cards.querySelector('.sacrifice-days').textContent,'Locked for 14 more days');
    assert.equal(cards.querySelector('progress').value,14);
    assert.equal(cards.children[1].querySelector('progress'),null);
    updateSacrificeBars(cards, items, state, kind, now + 13*86400000);
    assert.equal(cards.querySelector('.sacrifice-days').textContent,'Locked for 1 more day');
    updateSacrificeBars(cards, items, state, kind, now + 14*86400000);
    assert.equal(cards.querySelector('.sacrifice-days'),null);
}
