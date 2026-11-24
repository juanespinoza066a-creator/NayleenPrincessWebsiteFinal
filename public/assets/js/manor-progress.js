import { huntFreePlay } from './hunt-mode.js';
import {HUNTERS,POWERS,weeklyHunt,huntMap} from './hunt-config.js';
import { CarnivalStore } from './save-manager.js';
import { PRIZES, OUTFITS, weekNumber, beginMaze,recordJourney, WEEKLY_RESET, claimMazePrize, huntOutfit, unlockedOutfits } from './game-rules.js';
import { loadContent, text } from './content-loader.js';
import { playBoxSound } from './box-audio.js';
class HuntArt extends Map {constructor(catalog){super();this.catalog=catalog;}get(id){if(!this.has(id)){const item=this.catalog.find(x=>x.id===id);if(!item?.image)return;const image=new Image();image.src=item.image.endsWith('.webp')?item.image.replace('assets/images/','assets/images/thumbs/'):item.image;this.set(id,image);}return super.get(id);}}
const store=new CarnivalStore(),images=new HuntArt(PRIZES);
const bridge = {
    outfit: 'royal', loot: [], images, hunt:weeklyHunt(weekNumber()), practice:false, practiceRun:null, powers:POWERS, get map(){return huntMap(this.hunt)},
    get peanut() { return this.practice?{found:false,count:0}:store.state.manorPeanut; },
    savePeanut(found, count) { if(this.practice)return;store.change(s => { s.manorPeanut = {found, count}; }); },
    async begin() { await ready;this.practice=huntFreePlay(store.profile)&&document.getElementById('practice-toggle')?.checked;if(this.practice){this.hunt={hunter:document.getElementById('hunter-select').value,map:Number(document.getElementById('map-select').value)};this.outfit=huntOutfit(store.state,document.getElementById('power-select').value);this.practiceRun={peanutSeed:Math.floor(Math.random()*1e6),week:weekNumber(),hunt:this.hunt,outfit:this.outfit,status:'active',loot:[{id:'frog',claimed:false}],checkpoint:null};this.loot=this.practiceRun.loot;document.querySelector('.player-card img').src=OUTFITS.find(o=>o.id===this.outfit)?.image||OUTFITS[0].image;return structuredClone(this.practiceRun);}let run; store.change(s => { run = beginMaze(s, weekNumber()); }); if(run){this.hunt=run.hunt;this.outfit=run.outfit||store.state.outfit;}return run ? structuredClone(run) : null; },
    checkpoint(checkpoint) { if(this.practice)return; if (store.state.manorRun?.status === 'active')
        store.change(s => { s.manorRun.checkpoint = checkpoint; }, {game:true}); },
    flush() { if (!this.practice) void store.flushGame(); },
    claim(index) { if(this.practice){const x=this.practiceRun?.loot[index];if(!x||x.claimed)return null;x.claimed=true;return {id:x.id,isNew:false,name:'A little treasure'};}let reward; store.change(s => { reward = claimMazePrize(s, index); }); if (reward) { playBoxSound(); void store.flushGame(); } return reward ? { ...reward, name: PRIZES.find(p => p.id === reward.id).name } : null; },
    finish(won) { if(this.practice)return; if (store.state.manorRun?.status !== 'active')
        return; store.change(s => { s.manorRun.status = won ? 'won' : 'lost'; s.manorRun.checkpoint = null; s.stats.rounds++; if (won)
        s.stats.manorWins++; recordJourney(s,won?'maze-win':'maze-loss'); }); void store.flushGame(); }
};
window.CarnivalManor = bridge;
store.subscribe(s => { if(!bridge.practice){bridge.outfit = huntOutfit(s,s.manorRun?.status==='active'?s.manorRun.outfit:s.outfit); bridge.hunt=s.manorRun?.status==='active'?s.manorRun.hunt:weeklyHunt(weekNumber());} if(!bridge.practice)bridge.loot = s.manorRun?.loot || []; });
const ready = (async () => { await loadContent(); window.CarnivalText = text; await store.load(); setupHunt();document.querySelector('.player-card img').src=OUTFITS.find(o=>o.id===bridge.outfit)?.image||OUTFITS[0].image;document.querySelector('.espurr-portrait img').src=OUTFITS.find(o=>o.id===bridge.outfit)?.image||OUTFITS[0].image;const button = document.getElementById('start'); button.disabled = false; const active = store.state.manorRun?.status === 'active', used = store.state.mazeWeeks.includes(weekNumber()); button.textContent = active ? 'Resume this week’s adventure →' : used ? 'See this week’s result →' : 'Enter this week’s gardens →';if(document.getElementById('practice-toggle')?.checked)button.textContent='Explore this adventure →'; })();

function setupHunt(){
 const section=document.createElement('div');section.className='hunt-ability';section.id='hunt-ability';document.getElementById('overlay-copy').after(section);
 const heading=document.querySelector('.heading');
 const portrait=document.querySelector('.ann-portrait img');
 const copy=document.getElementById('overlay-copy');
 const start=document.getElementById('start');
 const weeklyHuntHint='Fix three machines, then open the moon gate. There’s a treasure hidden in the garden. You get one adventure a week and can come back where you left off.';
 const hunterTip=document.createElement('p');
 const modeHint=document.createElement('p');
 copy.replaceChildren(hunterTip,modeHint);
 for(const line of ['Drag the on-screen stick to move. Tap Interact when you’re close to a machine, treasure, pallet, or gate. Stay still while its little bar fills.','Tap when the needle crosses the gold part of the circle. If you miss, the machine jams for 3 seconds. Use hedges, sprint, pallets, and your outfit power to escape.']){
  const p=document.createElement('p');p.textContent=line;copy.append(p);
 }
 if(!heading.querySelector('.weekly-reset-note')){
  const reset=document.createElement('p');reset.className='weekly-reset-note';reset.textContent=WEEKLY_RESET;heading.prepend(reset);
 }
 const show=(hunt,outfit,practice)=>{
  const hunter=HUNTERS.find(h=>h.id===hunt.hunter);
  const power=POWERS[outfit]||POWERS.royal;
  heading.querySelector('h1').textContent='IDV Hunt · '+hunter.name;
  document.querySelector('.location-tag').textContent=hunter.maps[hunt.map];
  if(portrait){portrait.src='assets/images/hunters/'+hunter.id+'.png';portrait.alt=hunter.name;}
  hunterTip.textContent=hunter.name+' is looking for you. '+hunter.tip;
  modeHint.textContent=practice
    ? 'Fix three machines, then open the moon gate. Free play keeps your weekly adventure and rewards separate.'
    : weeklyHuntHint;
  section.textContent=power.name+' · '+power.hint+' Use it three times. Fix a machine to get one use back.';
 };
 if(huntFreePlay(store.profile)){
 const box=document.createElement('div');box.className='hunt-options';
 const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.id='practice-toggle';checkbox.checked=true;const label=document.createElement('label');label.append(checkbox,document.createTextNode('Free play · Save your weekly adventure for later'));box.append(label);
 const make=(id,title,items)=>{const label=document.createElement('label');label.textContent=title;const select=document.createElement('select');select.id=id;for(const [value,name] of items){const o=document.createElement('option');o.value=value;o.textContent=name;select.append(o);}label.append(select);box.append(label);return select;};
 const h=make('hunter-select','Hunter',HUNTERS.map(x=>[x.id,x.name+' · '+x.title]));h.value=bridge.hunt.hunter;
 const m=make('map-select','Garden',[]);
 const maps=(initial=0)=>{
  m.replaceChildren();
  HUNTERS.find(x=>x.id===h.value).maps.forEach((name,i)=>{
   const option=document.createElement('option');option.value=i;option.textContent=name;m.append(option);
  });
  m.value=String(initial);
 };
 maps(bridge.hunt.map);
 const ownedOutfits=new Set(unlockedOutfits(store.state));
 const ability=make('power-select','Outfit power',Object.entries(POWERS).filter(([id])=>ownedOutfits.has(id)).map(([id,p])=>[id,(OUTFITS.find(x=>x.id===id)?.name||id)+' · '+p.name]));ability.value=bridge.outfit;
 const preview=()=>{
  const practice=checkbox.checked;
  for(const select of [h,m,ability])select.disabled=!practice;
  show(practice?{hunter:h.value,map:Number(m.value)}:bridge.hunt,practice?ability.value:bridge.outfit,practice);
  if(practice)start.textContent='Explore this adventure →';
  else {
   const active=store.state.manorRun?.status==='active';
   const used=store.state.mazeWeeks.includes(weekNumber());
   start.textContent=active?'Resume this week’s adventure →':used?'See this week’s result →':'Enter this week’s gardens →';
  }
 };
 h.onchange=()=>{maps();preview();};
 m.onchange=ability.onchange=checkbox.onchange=preview;
 section.before(box);preview();
 }else show(bridge.hunt,bridge.outfit,false);
}
