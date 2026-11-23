import assert from 'node:assert/strict';import * as r from '../server/game-rules.js';import {recoveryState} from '../server/recovery.js';
import fs from 'node:fs';
const completedDays=[5,6,8,12,16,20,22];
const artworkIndex=JSON.parse(fs.readFileSync(new URL('../../android/NayleenAndroid/app/src/main/assets/artwork-index.json',import.meta.url),'utf8'));
for(const day of completedDays){
 const gift=r.ADVENT_GIFTS[day];assert(gift.ready,`December ${day} ready`);
 const catalog=gift.kind==='outfit'?r.OUTFITS:r.PRIZES,item=catalog.find(x=>x.id===gift.id);assert(item,`${gift.id} catalog entry`);assert.equal(item.adventDay,day);
 const before=r.freshState();if(gift.kind==='outfit'){assert(!r.unlockedOutfits(before).includes(gift.id));assert.equal(r.outfitProgress(before,gift.id)[0].value,0);}else assert(!before.prizes.includes(gift.id));
 assert(r.claimAdvent(before,day,true));assert(!r.claimAdvent(before,day,true),'cannot award twice');
 const saved=r.normalizeState(JSON.parse(JSON.stringify(before)));assert(r.validState(saved));assert(saved.advent.days.includes(day));
 if(gift.kind==='outfit'){assert(r.unlockedOutfits(saved).includes(gift.id));assert(r.outfitProgress(saved,gift.id).every(x=>x.value===x.goal));}else assert(saved.prizes.includes(gift.id));
 const web=fs.readFileSync(new URL('../public/'+item.image,import.meta.url)),thumb=fs.readFileSync(new URL('../public/'+item.image.replace('assets/images/','assets/images/thumbs/'),import.meta.url));
 assert(web.length>1000&&web.length<200000);assert(thumb.length>1000&&thumb.length<150000);
 const native=fs.readFileSync(new URL('../../android/NayleenAndroid/app/src/main/assets/'+artworkIndex[item.image],import.meta.url));assert.deepEqual(native,web,'native widget art matches web sprite');
}
assert.equal(Object.values(r.ADVENT_GIFTS).filter(x=>x.ready).length,19);
let s=r.freshState();assert(!r.claimAdvent(s,1,false,Date.parse('2026-11-30T18:00Z')));assert(r.claimAdvent(s,1,false,Date.parse('2026-12-01T18:00Z')));assert(!r.claimAdvent(s,1,true));for(const [day,g]of Object.entries(r.ADVENT_GIFTS)){const result=r.claimAdvent(s,Number(day),true);if(Number(day)!==1)assert.equal(!!result,g.ready);assert(!r.GAME_PRIZES.some(x=>x.id===g.id));}const round=r.normalizeState(JSON.parse(JSON.stringify(s)));assert.deepEqual(round.advent,s.advent);assert(r.validState(round));const restored=recoveryState({kind:'nayleen-carnival-backup',profile:'testing',state:round},r.freshState(),'testing');assert.deepEqual(restored.advent,s.advent);for(let i=0;i<100;i++){const fresh=r.freshState();r.beginDrop(fresh,()=>i/100).score=1500;const prize=r.claimDropPrize(fresh,()=>i/100);assert(!r.PRIZES.find(x=>x.id===prize.id).adventDay);}assert(!r.claimAdvent(s,7,true));assert(!r.claimAdvent(s,23,true));assert(!r.claimAdvent(s,25,true));const cloudy=r.freshState();cloudy.companion.settings.value.weatherSeen=['cloud'];assert(r.unlockedOutfits(cloudy).includes('weather-cloud'));assert(!r.unlockedOutfits(cloudy).includes('weather-sun'));assert(!r.unlockedOutfits(cloudy).includes('weather-night'));console.log('PASS: December timing, Testing previews, idempotent gifts, save and recovery, zero Advent gifts in 100 Drop awards, waiting note/final doors, and independent cloudy/sunny/nightwear conditions.');
