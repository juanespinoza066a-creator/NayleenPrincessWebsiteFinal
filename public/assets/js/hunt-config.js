// Edit map names, hints, and outfit powers here. Coordinates are 40-pixel tiles.
export const HUNTERS=[
 {id:'ann',name:'Ann',title:'The Disciple',color:'#9b79ad',floor:'#d1c6da',tip:'Step away from her cat’s circle before it closes.',maps:['Lavender Abbey','Cat Courtyard','Moonlit Hedges']},
 {id:'antonio',name:'Antonio',title:'The Violinist',color:'#8b5275',floor:'#d9bdc9',tip:'Leave the music circle before it strikes for one heart.',maps:['Rose Conservatory','Backstage Waltz','String Garden']},
 {id:'joseph',name:'Joseph',title:'The Photographer',color:'#6788ac',floor:'#c7d5e3',tip:'Leave the camera frame; its flash takes one heart and reveals you.',maps:['Portrait Gallery','Mirror Courtyard','Clockwork Studio']},
 {id:'grace',name:'Grace',title:'The Naiad',color:'#408e9c',floor:'#c6e5df',tip:'Step out of the water. Staying in it fills the tide and takes a heart.',maps:['Tidal Garden','Fountain Courtyard','Moonwater Grotto']}
];
export const POWERS={
 royal:{name:'Psychic stun',hint:'Freeze a nearby hunter for 5 seconds.',type:'stun'},
 sunday:{name:'Quiet sanctuary',hint:'Restore one heart and enjoy 4 safe seconds.',type:'heal'},
 cozy:{name:'Cozy recharge',hint:'Refill sprint energy and run faster for 6 seconds.',type:'energy'},
 espeon:{name:'Dream blink',hint:'Blink forward through an open path.',type:'blink'},
 akali:{name:'Smoke ribbon',hint:'Hide from the hunter for 8 seconds.',type:'smoke'},
 kda:{name:'Encore dash',hint:'Dash forward and stun a nearby hunter for 2 seconds.',type:'dash'},
 furina:{name:'Bubble curtain',hint:'Clear the warning areas, free your steps and gain 6 safe seconds.',type:'cleanse'},
 rogue:{name:'Borrowed courage',hint:'Freeze the hunter and borrow 6 seconds of swift steps.',type:'borrow'},
 ada:{name:'Gentle focus',hint:'Heal one heart and decode faster for 10 seconds.',type:'focus'},
 jubilee:{name:'Sparkle burst',hint:'Stun the hunter from farther away for 4 seconds.',type:'fireworks'},
 'jubilee-midnight':{name:'Midnight veil',hint:'Hide for 5 seconds and gain a protective shield.',type:'veil'},
 rafayel:{name:'Painted tide',hint:'Freeze a nearby hunter for 4 seconds and decode faster for 8 seconds.',type:'paint'},
 'pokemon-pack':{name:'Lucky pull',hint:'Give your nearest unfinished cipher 10 decoding points.',type:'luck'},
 firestarter:{name:'Warm encore',hint:'Run fast for 8 seconds and shake off a chase.',type:'warm'},
 reze:{name:'Ribbon surprise',hint:'Send a sparkle decoy away from you for 8 seconds.',type:'decoy'},
 cissia:{name:'Case closed',hint:'Finish a treasure, pallet or gate action, or boost a cipher by 6 points. Hide for 4 seconds.',type:'case'}
};
for(const [key,base] of Object.entries({sun:'firestarter',cloud:'akali',rain:'furina',storm:'royal',wind:'kda',cold:'cozy',snow:'sunday',night:'jubilee-midnight'}))POWERS['weather-'+key]={...POWERS[base]};
for(const [id,base] of Object.entries({'espurr-xmas':'sunday','damon-outfit':'jubilee-midnight','cartman-outfit':'cozy','hitler-espurr':'royal'}))POWERS[id]={...POWERS[base]};
const BASE=[[4,3,1,6],[8,1,1,5],[8,8,5,1],[13,3,1,5],[17,5,5,1],[18,9,1,5],[3,12,5,1],[10,12,1,5],[13,15,5,1],[21,13,1,4]];
const PATTERNS=[BASE,[[5,2,1,5],[9,4,5,1],[16,2,1,6],[3,11,5,1],[12,8,1,6],[18,11,4,1],[7,14,1,3]],[[3,5,5,1],[10,2,1,5],[15,4,5,1],[6,9,1,6],[11,10,6,1],[20,8,1,7],[12,15,5,1]],[[5,3,1,5],[9,7,7,1],[18,2,1,5],[3,12,6,1],[12,11,1,5],[17,14,5,1]],[[3,4,7,1],[12,2,1,5],[17,7,5,1],[7,8,1,6],[11,12,6,1],[20,12,1,5]],[[5,2,1,6],[9,5,6,1],[18,3,1,6],[3,13,5,1],[11,9,1,6],[15,15,5,1]],[[3,5,6,1],[11,2,1,5],[15,8,7,1],[7,10,1,5],[11,13,5,1],[20,11,1,4]],[[6,2,1,5],[10,4,6,1],[19,3,1,5],[3,11,6,1],[12,8,1,6],[16,15,5,1]],[[4,3,1,5],[8,7,8,1],[18,2,1,5],[3,12,6,1],[11,11,1,5],[16,14,6,1]],[[5,2,1,5],[9,5,6,1],[18,3,1,6],[3,11,5,1],[11,10,1,6],[16,14,5,1]],[[3,5,6,1],[11,2,1,5],[16,7,6,1],[6,10,1,6],[10,12,6,1],[20,11,1,5]],[[5,3,1,5],[9,6,7,1],[18,2,1,5],[3,12,6,1],[12,10,1,6],[17,14,5,1]]];
const fixed=[[2,9],[21,10],[3,3],[21,3],[14,13],[23,16],[6,6],[6,10],[5,9],[15,8],[18,15],[15,2],[11,5],[6,3],[2,7],[5,15],[12,17],[16,12],[22,16],[22,8]];
export function normalizeHunt(h){return {hunter:HUNTERS.some(x=>x.id===h?.hunter)?h.hunter:'ann',map:Number.isInteger(h?.map)?Math.max(0,Math.min(2,h.map)):0};}
export function weeklyHunt(week){const n=Math.max(0,week-1);return {hunter:HUNTERS[n%4].id,map:Math.floor(n/4)%3};}
export function huntMap(h){const choice=normalizeHunt(h),index=HUNTERS.findIndex(x=>x.id===choice.hunter)*3+choice.map,walls=new Set();for(let x=0;x<25;x++){walls.add(x+',0');walls.add(x+',18');}for(let y=0;y<19;y++){walls.add('0,'+y);walls.add('24,'+y);}for(const [x,y,w,h] of PATTERNS[index])for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)walls.add(a+','+b);for(const [x,y] of fixed)walls.delete(x+','+y);return {...choice,name:HUNTERS[Math.floor(index/3)].maps[choice.map],walls};}
