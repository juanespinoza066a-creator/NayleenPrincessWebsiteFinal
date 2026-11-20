import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {parseHTML} from 'linkedom';import {HUNTERS,POWERS,huntMap} from '../server/hunt-config.js';import {normalizeCheckpoint} from '../server/game-rules.js';
const html=fs.readFileSync(new URL('../public/escape.html',import.meta.url),'utf8'),code=fs.readFileSync(new URL('../public/assets/js/manor-game.js',import.meta.url),'utf8');
function game(hunter,map){
 const {document}=parseHTML(html);const window={addEventListener(){}};for(const id of ['overlay','peanut-dialog']){const d=document.getElementById(id);d.showModal=()=>d.open=true;d.close=()=>d.open=false;}document.getElementById('world').getContext=()=>({});document.getElementById('world').focus=()=>{};
 let saved=null,finished=null;const bridge={outfit:'royal',powers:POWERS,loot:[{id:'frog',claimed:false}],map:huntMap({hunter,map}),peanut:{},begin:async()=>({peanutSeed:900,checkpoint:saved}),checkpoint:c=>saved=normalizeCheckpoint(c),finish:won=>finished=won,claim:()=>({id:'frog',name:'Frog'})};window.CarnivalManor=bridge;
 const ctx=vm.createContext({window,document,console,Math,requestAnimationFrame(){},drawManor(){},location:{href:''},Image:class{},setTimeout,clearTimeout});vm.runInContext(code+';globalThis.api={reset,update,power,interact,pause,saveCheckpoint,resolveCalibration};',ctx);
 const exec=s=>vm.runInContext(s,ctx),get=s=>JSON.parse(exec('JSON.stringify('+s+')'));return {window,document,bridge,api:ctx.api,exec,get,get saved(){return saved},get finished(){return finished},tick(seconds){for(let n=0;n<Math.ceil(seconds/.04);n++)ctx.api.update(.04);}};
}
let powers=0,hazards=0,routes=0;
for(const hunter of HUNTERS)for(let map=0;map<3;map++){
 const g=game(hunter.id,map);await g.api.reset();g.tick(8.85);
 assert.equal(g.get('hazards.length'),1,hunter.id+' spawns a warning');
 if(hunter.id==='ann'){assert(g.get('rootTime')>0);g.exec("keys.add('ArrowRight')");const x=g.get('player.x');g.tick(.2);assert.equal(g.get('player.x'),x,'Ann actually freezes movement');assert.equal(g.get('hp'),3);}
 if(hunter.id==='antonio'){assert.equal(g.get('hp'),2,'the full note circle takes a heart');assert(g.get('snareTime')>0);}
 if(hunter.id==='joseph'){assert.equal(g.get('hp'),2,'camera flash takes a heart');assert(g.get('photoTime')>0);assert(g.get('searchTime')>0);}
 if(hunter.id==='grace'){assert.equal(g.get('hp'),3,'water first builds up');g.tick(1.9);assert.equal(g.get('hp'),2,'staying in water takes a heart');assert(g.get('stamina')<65,'water drains energy instead of being canceled by regeneration');}
 hazards++;
 // Shape and shield checks use the same runtime collision function.
 g.exec("state='playing';hp=3;invincible=0;hazards=[{kind:huntConfig.hunter,x:100,y:380,t:1.7,warmup:1.8,duration:8.5,r:64,exposure:0}];player={x:100,y:430};hunter={x:860,y:420};hazardClock=99;rootTime=waterTime=photoTime=snareTime=0;keys.clear();");
 if(hunter.id==='antonio'){g.tick(.2);assert.equal(g.get('hp'),2,'off the old thin line but inside the visible circle is still hit');}
 g.exec("hp=3;invincible=7;hazards[0].triggered=false;hazards[0].exposure=0;hazards[0].t=1.7;player={x:100,y:380};");g.tick(2.2);assert.equal(g.get('hp'),3,'shield protects against '+hunter.id);
 g.exec("invincible=0;hazards[0].t=1.7;hazards[0].triggered=false;hazards[0].exposure=0;player={x:300,y:380};");g.tick(2.2);assert.equal(g.get('hp'),3,'outside warning area is safe');
 for(const [id,power] of Object.entries(POWERS)){
  g.bridge.outfit=id;g.exec("state='playing';hp=1;stamina=10;charges=3;hiddenTime=swiftTime=decodeTime=invincible=stunned=snareTime=photoTime=rootTime=waterTime=0;hazards=[];decoy=null;player={x:100,y:380,facing:1};hunter={x:140,y:380};action=null;repairing=machines[0];machines.forEach(m=>{m.progress=0;m.completed=false;m.lockRemaining=0});lastSeen={x:100,y:380};searchTime=2;chase=true;");g.api.power();assert.equal(g.get('charges'),2,hunter.id+map+id);
  const got=g.get('({hp,stamina,hiddenTime,swiftTime,decodeTime,invincible,stunned,decoy,player,searchTime,effects})');assert(got.effects.some(e=>e.kind==='ability'&&e.ability===power.type),id+' has a visible effect');
  switch(power.type){case 'stun':assert.equal(got.stunned,5);break;case 'heal':assert.equal(got.hp,2);assert.equal(got.invincible,4);break;case 'energy':assert.equal(got.stamina,100);assert.equal(got.swiftTime,6);break;case 'blink':case 'dash':assert(got.player.x>100);assert(g.get('canStand(player.x,player.y,player)'));break;case 'smoke':assert.equal(got.hiddenTime,8);assert.equal(got.searchTime,0);break;case 'cleanse':assert.equal(got.invincible,6);break;case 'borrow':assert.equal(got.stunned,3);assert.equal(got.swiftTime,6);break;case 'focus':assert.equal(got.hp,2);assert.equal(got.decodeTime,10);break;case 'fireworks':assert.equal(got.stunned,4);break;case 'veil':assert.equal(got.hiddenTime,5);assert.equal(got.invincible,7);break;case 'paint':assert.equal(got.stunned,4);assert.equal(got.decodeTime,8);break;case 'luck':assert(g.get('machines.some(m=>m.progress===10)'));break;case 'warm':assert.equal(got.swiftTime,8);assert.equal(got.searchTime,0);break;case 'decoy':assert(got.decoy);assert(g.get('findPath(hunter,decoy).length')>0);g.api.update(.04);assert(g.get('path.length')>0);break;case 'case':assert.equal(g.get('machines[0].progress'),6);assert.equal(got.hiddenTime,4);break;}
  powers++;
 }
 // Runtime collision/pathfinding checks to every objective and patrol target,
 // both before and after pallets are dropped.
 g.exec("player=center(2,9);hunter=center(21,10);pallets.forEach(p=>p.down=true)");
 const targets=g.get('[...machines,gate,...patrol].map(p=>({x:p.x,y:p.y}))');
 for(const target of targets){g.exec('hunter=center(21,10)');const route=g.get('findPath(hunter,'+JSON.stringify(target)+')');assert(route.length||target.x===860&&target.y===420,hunter.id+map+' objective reachable with pallets');
  for(const next of route){g.exec('move(hunter,'+(next.x-g.get('hunter.x'))+','+(next.y-g.get('hunter.y'))+')');assert.equal(g.get('hunter.x'),next.x);assert.equal(g.get('hunter.y'),next.y);}
  routes++;
 }
}
const g=game('antonio',0);await g.api.reset();
// A real movement update follows the active hunter path rather than a drawn-only marker.
g.exec("hazardClock=999;hiddenTime=999;calmTime=999;invincible=999;hunter=center(21,10);player=center(2,9)");const before=g.get('hunter');g.tick(6);assert.notDeepEqual(g.get('hunter'),before,'hunter actually patrols');
// Rejected range casts, controls, cipher locks and completion from powers.
g.bridge.outfit='royal';g.exec('charges=3;hunter=center(21,10);player=center(2,9)');g.api.power();assert.equal(g.get('charges'),3,'too-far stun keeps its charge');
g.exec("repairing=machines[0];repairing.completed=false;repairing.progress=20;calibration={phase:'active'};hazardClock=999;keys.clear()");g.api.resolveCalibration(false);const jammed=g.get('machines[0].progress');g.tick(2.5);assert.equal(g.get('machines[0].progress'),jammed,'missed calibration stops decoding');g.tick(.7);assert(g.get('machines[0].progress')>jammed,'decoding resumes after the lock');
g.bridge.outfit='pokemon-pack';g.exec('machines.forEach(m=>{m.progress=40;m.completed=true});machines[0].progress=35;machines[0].completed=false;charges=1;player={...machines[0]};repairing=null');g.api.power();assert.equal(g.get('machines[0].progress'),40);assert.equal(g.get('charges'),1,'finishing with Lucky pull restores a charge');assert(g.get('exitUnlocked()'));
g.bridge.outfit='cissia';g.exec('state="playing";charges=3;action={type:"pallet",item:pallets[0],duration:.55,elapsed:0};pallets[0].down=false;hunter={...pallets[0]}');g.api.power();assert(g.get('pallets[0].down'),'Case closed completes the action immediately');
// Hazard/buff/jam state survives normalization and reopening the weekly run.
g.exec("state='playing';hp=2;charges=1;hiddenTime=3;swiftTime=4;invincible=2;rootTime=1;hazardClock=9;hazards=[{kind:'antonio',x:100,y:380,t:1,warmup:1.8,duration:4.5,r:64,exposure:0}];machines[1].lockRemaining=2;machines[1].nextCheck=5;decoy={x:260,y:420,life:4};");g.api.saveCheckpoint();assert(JSON.stringify(g.saved).length<4000);await g.api.reset();for(const [key,value]of [['hiddenTime',3],['swiftTime',4],['invincible',2],['rootTime',1],['hazardClock',9]])assert.equal(g.get(key),value,'resume '+key);assert.equal(g.get('machines[1].lockRemaining'),2);assert.equal(g.get('hazards[0].t'),1);assert.equal(g.get('decoy.life'),4);
g.api.pause();const frozen=g.get('elapsed');g.tick(10);assert.equal(g.get('elapsed'),frozen,'pause stops the game clock');
console.log(`PASS: ${hazards} hunter/map hazard effects, shields and escape checks; ${powers} outfit/hunter/map powers; ${routes} live path/collision routes with pallets; range rejection, cipher locks/completion, immediate actions and full checkpoint recovery.`);

// A matching warning is escapable; standing in it and a final melee hit can end a run.
const water=game('grace',1);await water.api.reset();water.exec("hazardClock=999;hazards=[{kind:'grace',x:100,y:380,t:1.8,warmup:1.8,duration:8.5,r:84,exposure:0}]");water.tick(1);water.exec('player=center(12,17)');water.tick(2);assert.equal(water.get('hp'),3,'escaping water before buildup prevents damage');
g.exec("state='playing';hp=1;invincible=stunned=rootTime=0;hazards=[];hazardClock=999;player=center(2,9);hunter=center(2,9);action=repairing=null;calibration=null;keys.clear();path=[];pathClock=0;decoy=null");g.api.update(.04);assert.equal(g.finished,false);assert.equal(g.get('state'),'lost');assert.equal(g.get('hp'),0);
g.exec("state='playing';hp=3;invincible=7;hazardClock=999;hunter=center(21,10);player={...gate};machines.forEach(m=>{m.progress=40;m.completed=true});action=null;repairing=null;keys.clear();");g.api.interact();assert.equal(g.get('action.type'),'gate');g.tick(5.1);assert.equal(g.finished,true);assert.equal(g.get('state'),'won');
console.log('PASS: escaping the tide prevents its damage, melee can finish a run, and the timed gate action completes an escape.');
