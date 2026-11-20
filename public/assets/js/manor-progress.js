import {HUNTERS,POWERS,weeklyHunt,huntMap} from './hunt-config.js';
import { CarnivalStore } from './save-manager.js';
import { PRIZES, OUTFITS, weekNumber, beginMaze,recordJourney, claimMazePrize } from './game-rules.js';
import { loadContent, text } from './content-loader.js';
import { playBoxSound } from './box-audio.js';
const store = new CarnivalStore(), images = new Map();
PRIZES.forEach(item => { const image = new Image(); image.src = item.image; images.set(item.id, image); });
const bridge = {
    outfit: 'royal', loot: [], images, hunt:weeklyHunt(weekNumber()), practice:false, practiceRun:null, powers:POWERS, get map(){return huntMap(this.hunt)},
    get peanut() { return this.practice?{found:false,count:0}:store.state.manorPeanut; },
    savePeanut(found, count) { if(this.practice)return;store.change(s => { s.manorPeanut = {found, count}; }); },
    async begin() { await ready;this.practice=store.profile==='testing'&&document.getElementById('practice-toggle')?.checked;if(this.practice){this.hunt={hunter:document.getElementById('hunter-select').value,map:Number(document.getElementById('map-select').value)};this.outfit=document.getElementById('power-select').value;this.practiceRun={week:weekNumber(),hunt:this.hunt,outfit:this.outfit,status:'active',loot:[{id:'frog',claimed:false}],checkpoint:null};this.loot=this.practiceRun.loot;document.querySelector('.player-card img').src=OUTFITS.find(o=>o.id===this.outfit)?.image||OUTFITS[0].image;return structuredClone(this.practiceRun);}let run; store.change(s => { run = beginMaze(s, weekNumber()); }); if(run){this.hunt=run.hunt;this.outfit=run.outfit||store.state.outfit;}return run ? structuredClone(run) : null; },
    checkpoint(checkpoint) { if(this.practice)return; if (store.state.manorRun?.status === 'active')
        store.change(s => { s.manorRun.checkpoint = checkpoint; }); },
    claim(index) { if(this.practice){const x=this.practiceRun?.loot[index];if(!x||x.claimed)return null;x.claimed=true;return {id:x.id,isNew:false,name:'A practice treasure'};}let reward; store.change(s => { reward = claimMazePrize(s, index); }); if (reward) playBoxSound(); return reward ? { ...reward, name: PRIZES.find(p => p.id === reward.id).name } : null; },
    finish(won) { if(this.practice)return; if (store.state.manorRun?.status !== 'active')
        return; store.change(s => { s.manorRun.status = won ? 'won' : 'lost'; s.manorRun.checkpoint = null; s.stats.rounds++; if (won)
        s.stats.manorWins++; recordJourney(s,won?'maze-win':'maze-loss'); }); }
};
window.CarnivalManor = bridge;
store.subscribe(s => { if(!bridge.practice){bridge.outfit = s.manorRun?.status==='active'?s.manorRun.outfit||s.outfit:s.outfit; bridge.hunt=s.manorRun?.status==='active'?s.manorRun.hunt:weeklyHunt(weekNumber());} if(!bridge.practice)bridge.loot = s.manorRun?.loot || []; });
const ready = (async () => { await loadContent(); window.CarnivalText = text; await store.load(); setupHunt();document.querySelector('.player-card img').src=OUTFITS.find(o=>o.id===bridge.outfit)?.image||OUTFITS[0].image;document.querySelector('.espurr-portrait img').src=OUTFITS.find(o=>o.id===bridge.outfit)?.image||OUTFITS[0].image;const button = document.getElementById('start'); button.disabled = false; const active = store.state.manorRun?.status === 'active', used = store.state.mazeWeeks.includes(weekNumber()); button.textContent = active ? 'Resume this week’s adventure →' : used ? 'See this week’s result →' : 'Enter this week’s gardens →';if(document.getElementById('practice-toggle')?.checked)button.textContent='Explore this adventure →'; })();

function setupHunt(){
 const section=document.createElement('div');section.className='hunt-ability';section.id='hunt-ability';document.getElementById('overlay-copy').after(section);
 const show=()=>{const power=POWERS[document.getElementById('power-select')?.value||bridge.outfit]||POWERS.royal;section.textContent=power.name+' · '+power.hint+' Three charges. Finish a cipher to restore one.';};
 const hunter=HUNTERS.find(h=>h.id===bridge.hunt.hunter);document.querySelector('.heading h1').textContent='IDV Hunt · '+hunter.name;document.querySelector('.location-tag').textContent=huntMap(bridge.hunt).name;
 const portrait=document.querySelector('.ann-portrait img');if(portrait){portrait.src='assets/images/hunters/'+hunter.id+'.svg';portrait.alt=hunter.name;}
 const copy=document.getElementById('overlay-copy');copy.replaceChildren();for(const line of [hunter.name+' is looking for you. '+hunter.tip,'Repair three ciphers, then open the moon gate. One hidden treasure awaits. One run each week; return any time to resume.','Move with the stick or WASD. Tap Interact near a cipher, treasure, pallet, or exit. Stay still while its little bar fills.','Tap during the gold calibration arc. Missing locks that cipher for 3 seconds. Use hedges, sprint, pallets, and your outfit power to escape.']){const p=document.createElement('p');p.textContent=line;copy.append(p);}
 if(store.profile==='testing'){
 const box=document.createElement('div');box.className='hunt-options';
 const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.id='practice-toggle';checkbox.checked=true;const label=document.createElement('label');label.append(checkbox,document.createTextNode('Choose an adventure · no prizes or weekly turn used'));box.append(label);
 const make=(id,title,items)=>{const label=document.createElement('label');label.textContent=title;const select=document.createElement('select');select.id=id;for(const [value,name] of items){const o=document.createElement('option');o.value=value;o.textContent=name;select.append(o);}label.append(select);box.append(label);return select;};
 const h=make('hunter-select','Hunter',HUNTERS.map(x=>[x.id,x.name+' · '+x.title]));h.value=bridge.hunt.hunter;const m=make('map-select','Garden',[]);const maps=()=>{m.replaceChildren();HUNTERS.find(x=>x.id===h.value).maps.forEach((name,i)=>{const o=document.createElement('option');o.value=i;o.textContent=name;m.append(o)});};h.onchange=()=>{maps();if(portrait){portrait.src='assets/images/hunters/'+h.value+'.svg';portrait.alt=HUNTERS.find(x=>x.id===h.value).name;}};maps();
 const ability=make('power-select','Outfit power',Object.entries(POWERS).map(([id,p])=>[id,(OUTFITS.find(x=>x.id===id)?.name||id)+' · '+p.name]));ability.value=bridge.outfit;ability.onchange=show;const summary=document.createElement('p');summary.className='section-copy';box.append(summary);const preview=()=>{const hunter=HUNTERS.find(x=>x.id===h.value);summary.textContent=hunter.maps[Number(m.value)||0]+' · '+hunter.tip;};const previous=h.onchange;h.onchange=()=>{previous();preview();};m.onchange=preview;preview();checkbox.onchange=()=>{for(const select of [h,m,ability])select.disabled=!checkbox.checked;document.getElementById('start').textContent=checkbox.checked?'Explore this adventure →':'Enter my weekly adventure →';};section.before(box);
 }show();
}
