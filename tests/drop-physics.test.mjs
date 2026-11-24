import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';import {parseHTML} from 'linkedom';import * as r from '../server/game-rules.js';import {openDrop} from '../public/assets/js/princess-drop.js';
const sandbox={module:{exports:{}},exports:{},console};vm.runInNewContext(fs.readFileSync(new URL('../public/assets/vendor/matter.min.js',import.meta.url),'utf8'),sandbox);const Matter=sandbox.module.exports;const {window,document}=parseHTML('<dialog open><div id="body"></div><p id="result"></p></dialog>');Object.assign(globalThis,{window,document,Image:class{set src(v){}},requestAnimationFrame:()=>{},localStorage:{getItem:()=> 'off'}});let engine;const create=Matter.Engine.create;Matter.Engine.create=(...args)=>engine=create(...args);window.Matter=Matter;const original=document.createElement.bind(document);document.createElement=tag=>{const n=original(tag);if(tag==='canvas'){n.getContext=()=>({});n.focus=()=>{};}return n;};window.HTMLElement.prototype.scrollIntoView=function(){};const body=document.getElementById('body'),result=document.getElementById('result'),dialog=document.querySelector('dialog');dialog.open=true;const store={state:r.freshState(),change(fn){fn(this.state);this.state=r.normalizeState(this.state);}};const button=(text,fn,parent=body)=>{const b=document.createElement('button');b.textContent=text;b.onclick=fn;parent.append(b);return b;};openDrop(store,{open:()=>{},body,result,button,p:()=>{}});[...body.querySelectorAll('button')].find(b=>b.textContent.startsWith('Begin my weekly basket')).click();assert(engine);for(let n=0;n<7;n++){for(const b of Matter.Composite.allBodies(engine.world).filter(x=>x.label==='treasure'))Matter.Composite.remove(engine.world,b);for(const x of [170,200])Matter.Composite.add(engine.world,Matter.Bodies.circle(x,450,64,{label:'treasure',plugin:{tier:7}}));Matter.Engine.update(engine,1000/60);}
const run=store.state.dropRuns[r.mondayKey()];assert.equal(run.status,'active');assert.equal(run.score,6272);assert(run.reward);assert(result.textContent.includes('is yours'));const saved=JSON.stringify(run.reward);Matter.Engine.update(engine,1000/60);assert.equal(JSON.stringify(store.state.dropRuns[r.mondayKey()].reward),saved);
const finishBasket = () => [...body.querySelectorAll('button')].find(b=>b.textContent.startsWith('Finish this basket')).click();
finishBasket();
assert.match(body.querySelector('.drop-finale').textContent, /Earned in this basket:/);
const week = r.mondayKey();
const prize = r.PRIZES.find(p=>p.id===run.reward.id);
store.state.prizes = store.state.prizes.filter(id=>id!==prize.id);
store.state.shelf = store.state.shelf.map(id=>id===prize.id?null:id);
body.replaceChildren();
result.textContent='';
openDrop(store,{open:()=>{},body,result,button,p:()=>{}});
[...body.querySelectorAll('button')].find(b=>b.textContent.startsWith('Begin my weekly basket')).click();
for(let n=0;n<2;n++){
    for(const b of Matter.Composite.allBodies(engine.world).filter(x=>x.label==='treasure')) Matter.Composite.remove(engine.world,b);
    for(const x of [170,200]) Matter.Composite.add(engine.world,Matter.Bodies.circle(x,450,64,{label:'treasure',plugin:{tier:7}}));
    Matter.Engine.update(engine,1000/60);
}
assert.equal(store.state.dropRuns[week].reward,null);
assert.equal(store.state.dropRuns[week].weeklyReward.id,prize.id);
assert(!store.state.prizes.includes(prize.id));
finishBasket();
const repeat = body.querySelector('.drop-finale').textContent;
assert.match(repeat,/Weekly reward already claimed/);
assert(!repeat.includes(prize.name));
store.state.dropRuns[week].attempts=r.DROP_TRIES;
body.replaceChildren();
openDrop(store,{open:()=>{},body,result,button,p:()=>{}});
assert.match(body.querySelector('.drop-end-card').textContent,/Weekly reward already claimed/);
assert.doesNotMatch(body.querySelector('.drop-end-card').textContent,/is yours/);
console.log('PASS: live physics awards one weekly collectible, keeps the room goal playable, and later baskets and the weekly summary show the reward was already claimed.');

