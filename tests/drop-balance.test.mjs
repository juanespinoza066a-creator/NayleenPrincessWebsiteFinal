import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {parseHTML} from 'linkedom';import * as r from '../server/game-rules.js';import {openDrop,overflowing} from '../public/assets/js/princess-drop.js';
const vendor=fs.readFileSync(new URL('../public/assets/vendor/matter.min.js',import.meta.url),'utf8');let results=[];const random=Math.random;
try{for(let seed=1;seed<=8;seed++){
 let rng=seed;Math.random=()=>{rng=(rng*1664525+1013904223)>>>0;return rng/4294967296};
 const sandbox={module:{exports:{}},exports:{},console};vm.runInNewContext(vendor,sandbox);const Matter=sandbox.module.exports;
 const {window,document}=parseHTML('<dialog open><div id="body"></div><p id="result"></p></dialog>');let frame,engine;const createEngine=Matter.Engine.create;Matter.Engine.create=(...args)=>engine=createEngine(...args);
 const gradient={addColorStop(){}};const context=new Proxy({createLinearGradient:()=>gradient},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 Object.assign(globalThis,{window,document,Image:class{complete=false},requestAnimationFrame:fn=>frame=fn});window.Matter=Matter;window.devicePixelRatio=3;
 const create=document.createElement.bind(document);document.createElement=tag=>{const n=create(tag);if(tag==='canvas'){n.getContext=()=>context;n.focus=()=>{};n.getBoundingClientRect=()=>({left:0,width:400});}return n;};
 window.HTMLElement.prototype.scrollIntoView=function(){};const body=document.getElementById('body'),result=document.getElementById('result');document.querySelector('dialog').open=true;const store={state:r.freshState(),change(fn){fn(this.state);this.state=r.normalizeState(this.state);}};const button=(text,fn)=>{const b=create('button');b.textContent=text;b.onclick=fn;body.append(b);return b;};
 openDrop(store,{open(){},body,result,button,p(){}});[...body.querySelectorAll('button')].find(b=>b.textContent.startsWith('Begin my weekly basket')).click();const drop=[...body.querySelectorAll('button')].find(b=>b.textContent==='Drop treasure ♡');const canvas=body.querySelector('canvas');canvas.onpointermove({buttons:1,clientX:200});
 // Repeatedly tap the same spot at 50 taps/sec, just as the reported easy strategy.
 for(let n=1;n<=15000&&store.state.dropRuns[r.mondayKey()].status==='active';n++){frame(n*20);drop.click();}
 const run=store.state.dropRuns[r.mondayKey()];assert.notEqual(run.status,'active','runs must end');assert(body.querySelector('.drop-finale'),'terminal notice appears directly on the basket');assert(body.querySelector('.drop-finale').textContent.includes('basket is full')||run.status==='won');if(run.status==='won'){assert(run.score>=r.DROP_GOAL);assert(run.reward?.kind==='collectible');}results.push({seed,status:run.status,score:run.score,tier:run.bestTier});
}}
finally{Math.random=random;}
const settled={position:{y:95},circleRadius:20,velocity:{x:0,y:0},plugin:{bornAt:0}},newDrop={position:{y:60},circleRadius:18,velocity:{x:0,y:3},plugin:{bornAt:10}};assert(overflowing([settled,newDrop],10),'new piece cannot reset an older settled piece’s overflow clock');
console.log('Rapid-tap balance results:',JSON.stringify(results));assert.equal(results.length,8,'all eight seeded baskets were simulated to completion');console.log('PASS: 8 deterministic rapid-tap baskets end, overflow notice remains visible, and awarded prizes require the point goal.');
