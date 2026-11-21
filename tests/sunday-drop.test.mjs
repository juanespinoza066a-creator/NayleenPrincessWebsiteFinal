import assert from 'node:assert/strict';
import {freshState,unlockedRooms,unlockedOutfits,normalizeState,validState,beginDrop,finishDrop} from '../server/game-rules.js';
const s=freshState();s.stats.bestBank=3200;
assert(!unlockedRooms(s).includes('sunday'),'table score does not unlock Sunday room');
assert(unlockedOutfits(s).includes('sunday'),'Sunday outfit keeps its existing card requirement');
const week='2026-11-16';const run=beginDrop(s,()=>0,week);run.score=3199;
assert(!unlockedRooms(s).includes('sunday'));
run.score=3200;assert(!unlockedRooms(s).includes('sunday'),'30 login days are also required');s.journey.loginDays=Array.from({length:30},(_,i)=>new Date(Date.UTC(2026,9,i+1)).toISOString().slice(0,10));assert(unlockedRooms(s).includes('sunday'));
finishDrop(s,false,()=>0,week);assert.equal(s.stats.bestDrop,3200,'a qualifying score counts even on overflow');
delete s.dropRuns[week];const kept=normalizeState(s);assert.equal(kept.stats.bestDrop,3200);assert(unlockedRooms(kept).includes('sunday'));
assert(validState(kept));kept.tradedRooms=['sunday'];assert(!unlockedRooms(kept).includes('sunday'),'exchanging a room still removes it');
const old=freshState();delete old.stats.bestDrop;beginDrop(old,()=>0,week).score=3200;
assert.equal(normalizeState(old).stats.bestDrop,3200,'existing Drop history migrates');
const gift=freshState();gift.grantedRooms=['sunday'];assert(unlockedRooms(gift).includes('sunday'),'prize grants and unlock all remain valid');
for(const n of [-1,3200.5,1000001,NaN]){const bad=freshState();bad.stats.bestDrop=n;assert(!validState(bad));}
console.log('PASS: Sunday room requires 3200 Drop points, migrates and remembers scores, preserves grants/exchanges and leaves Sunday outfit unchanged.');
