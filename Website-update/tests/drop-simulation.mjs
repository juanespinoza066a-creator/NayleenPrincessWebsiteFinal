import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {parseHTML} from 'linkedom';import * as r from '../server/game-rules.js';import {openDrop,overflowing} from '../public/assets/js/princess-drop.js';
const vendor=fs.readFileSync(new URL('../public/assets/vendor/matter.min.js',import.meta.url),'utf8');let results=[];const random=Math.random;
try{for(let seed=1;seed<=40;seed++){
 let rng=seed;Math.random=()=>{rng=(rng*1664525+1013904223)>>>0;return rng/4294967296};
 const sandbox={module:{exports:{}},exports:{},console};vm.runInNewContext(vendor,sandbox);const Matter=sandbox.module.exports;
 const {window,document}=parseHTML('<dialog open><div id="body"></div><p id="result"></p></dialog>');let frame,engine;const createEngine=Matter.Engine.create;Matter.Engine.create=(...args)=>engine=createEngine(...args);
 const gradient={addColorStop(){}};const context=new Proxy({createLinearGradient:()=>gradient},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 Object.assign(globalThis,{window,document,Image:class{complete=false},requestAnimationFrame:fn=>frame=fn});window.Matter=Matter;window.devicePixelRatio=3;
 const create=document.createElement.bind(document);document.createElement=tag=>{const n=create(tag);if(tag==='canvas'){n.getContext=()=>context;n.focus=()=>{};n.getBoundingClientRect=()=>({left:0,width:400});}return n;};
 window.HTMLElement.prototype.scrollIntoView=function(){};const body=document.getElementById('body'),result=document.getElementById('result');document.querySelector('dialog').open=true;const store={state:r.freshState(),change(fn){fn(this.state);this.state=r.normalizeState(this.state);}};const button=(text,fn)=>{const b=create('button');b.textContent=text;b.onclick=fn;body.append(b);return b;};
 openDrop(store,{open(){},body,result,button,p(){}});[...body.querySelectorAll('button')].find(b=>b.textContent.startsWith('Begin my weekly basket')).click();const drop=[...body.querySelectorAll('button')].find(b=>b.textContent==='Drop treasure ♡');const canvas=body.querySelector('canvas');
 let lastDrop=0,drops=0;
 const pick=()=>{const run=store.state.dropRuns[r.mondayKey()],held=run.held,rr=[15,22,31,42,55,70,88,108,130][held],pieces=Matter.Composite.allBodies(engine.world).filter(b=>b.label==='treasure');let best=-Infinity,aim=200;
 for(let x=42+rr;x<=358-rr;x+=7){let contact=null,y=600-rr;for(const b of pieces){const dx=x-b.position.x,rs=rr+b.circleRadius;if(Math.abs(dx)>=rs)continue;const landing=b.position.y-Math.sqrt(rs*rs-dx*dx);if(landing<y){y=landing;contact=b;}}
 let value=y*.8+(contact?.plugin.tier===held?300:0);for(const b of pieces){if(b.plugin.tier===held)value+=Math.max(0,100-Math.abs(x-b.position.x))*.08;}value-=Math.abs(x-(held<=1?300:100))*.08;if(y<145+rr)value-=1000;if(value>best){best=value;aim=x;}}
 return aim;};
 for(let n=1;n<=36000&&store.state.dropRuns[r.mondayKey()].status==='active';n++){frame(n*20);if(n-lastDrop>=110){canvas.onpointermove({buttons:1,clientX:pick()});if(!drop.disabled){drop.click();lastDrop=n;drops++;}}}
 const run=store.state.dropRuns[r.mondayKey()];assert.notEqual(run.status,'active','runs must end');assert(body.querySelector('.drop-finale'),'terminal notice appears directly on the basket');assert(body.querySelector('.drop-finale').textContent.includes('basket is full')||run.status==='won');if(run.status==='won'){assert(run.score>=r.DROP_GOAL);assert(run.reward?.kind==='collectible');}results.push({seed,status:run.status,score:run.score,tier:run.bestTier,drops});
}}
finally{Math.random=random;}
fs.writeFileSync(new URL('../../drop-simulations.json',import.meta.url),JSON.stringify(results,null,2));console.log(JSON.stringify(results));console.log('Summary',JSON.stringify({runs:results.length,prize:results.filter(x=>x.score>=1500).length,sunday:results.filter(x=>x.score>=3200).length,median:results.map(x=>x.score).sort((a,b)=>a-b)[Math.floor(results.length/2)],best:Math.max(...results.map(x=>x.score))}));
