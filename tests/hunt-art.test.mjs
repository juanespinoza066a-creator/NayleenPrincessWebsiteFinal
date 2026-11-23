import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {HUNTERS,huntMap} from '../server/hunt-config.js';import {OUTFITS} from '../server/game-rules.js';
const gradient={addColorStop(){}},ctx=new Proxy({createRadialGradient:()=>gradient,createLinearGradient:()=>gradient,measureText:()=>({width:20})},{get:(o,k)=>k in o?o[k]:(()=>{}),set:(o,k,v)=>(o[k]=v,true)});const canvas={getContext:()=>ctx,getBoundingClientRect:()=>({width:800,height:600}),width:0,height:0};const window={devicePixelRatio:1,CarnivalManor:{outfit:'royal',images:new Map()}};const context=vm.createContext({window,Math,console,Image:class{complete=true;naturalWidth=1920;set src(v){}}});for(const file of ['espurr-renderer.js','manor-art.js'])vm.runInContext(fs.readFileSync(new URL('../public/assets/js/'+file,import.meta.url),'utf8'),context);
for(const hunter of HUNTERS)for(let map=0;map<3;map++)for(const outfit of OUTFITS){window.CarnivalManor.outfit=outfit.id;context.drawManor({canvas,player:{x:300,y:400,facing:1,moving:true,walk:2},hunter:{x:400,y:400,walk:1},machines:[{x:140,y:140,progress:0},{x:860,y:140,progress:40},{x:580,y:540,progress:20}],pallets:[],walls:huntMap({hunter:hunter.id,map}).walls,gate:{x:940,y:660},elapsed:2,stunned:0,invincible:0,calibration:null,repairing:null,chase:false,effects:[{kind:"ability",ability:outfit.id==="reze"?"decoy":"heal",label:"Little power",x:300,y:400,life:1,duration:2.5}],decoy:{x:400,y:300,life:5},buffs:{hidden:1,swift:1,decode:1,shield:1},peanut:{x:260,y:260},peanutFound:false,treasures:[],T:40,COLS:25,ROWS:19,huntConfig:{hunter:hunter.id,map},hazards:[{kind:hunter.id,t:2.5,x:310,y:420,r:50}]});}
assert(canvas.width>0);console.log('PASS: all current hunter/map/outfit canvas combinations with animated Espurr costumes render without JavaScript errors, including articulated hunter puppets and hazard shapes.');


function recordingCanvas(){
 const operations=[];
 const context=new Proxy({createLinearGradient:()=>gradient},{
  get:(target,key)=>key in target?target[key]:(...args)=>operations.push([key,...args]),
  set:(target,key,value)=>{operations.push([key,value]);target[key]=value;return true;}
 });
 return {operations,getContext:()=>context};
}

const mockDocument={createElement(tag){assert.equal(tag,'canvas');return recordingCanvas();}};
context.document=mockDocument;
const paint=recordingCanvas();
const puppet={x:30,y:62,facing:1,moving:true,walk:2};
const models=new Set();
for(const outfit of OUTFITS){
 paint.operations.length=0;
 context.drawPrincessEspurr(paint.getContext(),puppet,2,outfit.id);
 const frame=paint.operations.find(([kind])=>kind==='drawImage')?.[1];
 assert(frame,'animated pose is drawn for '+outfit.id);
 assert(frame.operations.length>30,'pose contains detailed vector artwork for '+outfit.id);
 models.add(JSON.stringify(frame.operations));
 paint.operations.length=0;
 context.drawPrincessEspurr(paint.getContext(),{...puppet,x:60},2,outfit.id);
 assert.equal(paint.operations.find(([kind])=>kind==='drawImage')?.[1],frame,'repeat pose reuses its drawing');
 for(const variant of [{...puppet,walk:-2},{...puppet,facingY:-1}]){
  paint.operations.length=0;
  context.drawPrincessEspurr(paint.getContext(),variant,2,outfit.id,true);
  assert.notDeepEqual(paint.operations.find(([kind])=>kind==='drawImage')?.[1]?.operations,frame.operations,'walking and rear poses differ for '+outfit.id);
 }
}
assert.equal(models.size,OUTFITS.length,'all available costumes have distinct animated art');
assert.equal(vm.runInContext('espurrPoses.size',context),80,'pose cache stays bounded');
console.log('PASS: every costume has distinct artwork, walk and rear poses differ, identical poses reuse the canvas, and the cache stays within its limit.');
