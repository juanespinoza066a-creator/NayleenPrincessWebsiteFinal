import assert from 'node:assert/strict';import * as r from '../server/game-rules.js';import {recoveryState} from '../server/recovery.js';
import fs from 'node:fs';
const completedDays=[5,6,8,12,16,20,22,23,24,25];
const artIndexURL=new URL('../../android/NayleenAndroid/app/src/main/assets/artwork-index.json',import.meta.url);
const artworkIndex=fs.existsSync(artIndexURL)?JSON.parse(fs.readFileSync(artIndexURL,'utf8')):null;
const owned=(s,g)=>g.kind==='outfit'?r.unlockedOutfits(s).includes(g.id):g.kind==='room'?r.unlockedRooms(s).includes(g.id):s.prizes.includes(g.id);
for(const day of completedDays){
 const gift=r.ADVENT_GIFTS[day];assert(gift.ready,`December ${day} ready`);
 const catalog=gift.kind==='outfit'?r.OUTFITS:gift.kind==='room'?r.ROOMS:r.PRIZES,item=catalog.find(x=>x.id===gift.id);assert(item,`${gift.id} catalog entry`);assert.equal(item.adventDay,day);
 const before=r.freshState();assert(!owned(before,gift));if(gift.kind==='outfit')assert.equal(r.outfitProgress(before,gift.id)[0].value,0);
 const localMidnight=Date.parse(`2026-12-${String(day).padStart(2,'0')}T06:00:00Z`);
 assert.equal(r.claimAdvent(before,day,false,localMidnight-1),null,'production door stays closed before Central midnight');
 const production=r.freshState();assert(r.claimAdvent(production,day,false,localMidnight));assert(owned(production,gift));
 assert(r.claimAdvent(before,day,true));assert(!r.claimAdvent(before,day,true),'cannot award twice');
 const saved=r.normalizeState(JSON.parse(JSON.stringify(before)));assert(r.validState(saved));assert(saved.advent.days.includes(day));
 assert(owned(saved,gift));if(gift.kind==='outfit')assert(r.outfitProgress(saved,gift.id).every(x=>x.value===x.goal));
 const web=fs.readFileSync(new URL('../public/'+item.image,import.meta.url)),thumb=fs.readFileSync(new URL('../public/'+item.image.replace('assets/images/','assets/images/thumbs/'),import.meta.url));
 assert(web.length>1000&&web.length<(gift.kind==='room'?500000:200000));assert(thumb.length>1000&&thumb.length<150000);
 if(artworkIndex){const native=fs.readFileSync(new URL(artworkIndex[item.image],artIndexURL));assert.deepEqual(native,web,'native widget art matches web sprite');}
}
assert.equal(Object.values(r.ADVENT_GIFTS).filter(x=>x.ready).length,22);
let s=r.freshState();assert(!r.claimAdvent(s,1,false,Date.parse('2026-11-30T18:00Z')));assert(r.claimAdvent(s,1,false,Date.parse('2026-12-01T18:00Z')));assert(!r.claimAdvent(s,1,true));for(const [day,g]of Object.entries(r.ADVENT_GIFTS)){const result=r.claimAdvent(s,Number(day),true);if(Number(day)!==1)assert.equal(!!result,g.ready);assert(!r.GAME_PRIZES.some(x=>x.id===g.id));}const round=r.normalizeState(JSON.parse(JSON.stringify(s)));assert.deepEqual(round.advent,s.advent);assert(r.validState(round));const restored=recoveryState({kind:'nayleen-carnival-backup',profile:'testing',state:round},r.freshState(),'testing');assert.deepEqual(restored.advent,s.advent);for(let i=0;i<100;i++){const fresh=r.freshState();r.beginDrop(fresh,()=>i/100).score=1500;const prize=r.claimDropPrize(fresh,()=>i/100);assert(!r.PRIZES.find(x=>x.id===prize.id).adventDay);}for(const day of [7,14,19]){assert.equal(r.claimAdvent(s,day,true).kind,'note');assert(!r.claimAdvent(s,day,true));}const cloudy=r.freshState();cloudy.companion.settings.value.weatherSeen=['cloud'];assert(r.unlockedOutfits(cloudy).includes('weather-cloud'));assert(!r.unlockedOutfits(cloudy).includes('weather-sun'));assert(!r.unlockedOutfits(cloudy).includes('weather-night'));console.log('PASS: December timing, Testing previews, idempotent gifts, save and recovery, zero Advent gifts in 100 Drop awards, waiting note doors, and independent cloudy/sunny/nightwear conditions.');

const priorOrder=r.freshState();
priorOrder.advent={year:2026,order:2,days:[19,23]};
assert(r.validState(priorOrder),'existing Advent saves accepted');
const moved=r.normalizeState(priorOrder);
assert.deepEqual(moved.advent.days,[17,23]);
assert(moved.prizes.includes('varesa'));
assert.deepEqual(r.normalizeState(moved).advent,moved.advent);
priorOrder.advent.days=[17];
assert.deepEqual(r.normalizeState(priorOrder).advent.days,[19]);
