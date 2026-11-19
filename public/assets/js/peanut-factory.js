import {UPGRADES,OUTFITS,SQUISHIES,unlockedSquishies,passiveRate,tapPower,upgradeCost,buyUpgrade,addCrunches} from './game-rules.js';
import {loadContent,text as t} from './content-loader.js';
import {playSquish} from './squishy-audio.js';
import {CarnivalStore} from './save-manager.js';
const $=id=>document.getElementById(id),store=new CarnivalStore(),format=n=>Math.floor(n).toLocaleString();
await loadContent();
let sound=true,haptics=false,combo=0,lastTap=0,goldenTimer,toastTimer,lastShelf='',baseline=null;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,vibrationSupported=typeof navigator.vibrate==='function';
try{sound=localStorage.getItem('nayleen-peanut-sound')!=='off';haptics=localStorage.getItem('nayleen-peanut-haptics')==='on'}catch{}
function labels(){$('sound-toggle').textContent=sound?'Sound on ♪':'Sound off';$('sound-toggle').setAttribute('aria-pressed',sound);$('haptic-toggle').textContent=vibrationSupported?(haptics?'Vibration on':'Vibration off'):'Vibration unavailable';$('haptic-toggle').disabled=!vibrationSupported;$('haptic-toggle').setAttribute('aria-pressed',haptics&&vibrationSupported)}
$('sound-toggle').onclick=()=>{sound=!sound;try{localStorage.setItem('nayleen-peanut-sound',sound?'on':'off')}catch{}labels()};
$('haptic-toggle').onclick=()=>{haptics=!haptics;try{localStorage.setItem('nayleen-peanut-haptics',haptics?'on':'off')}catch{}labels();vibrate(10)};labels();
function vibrate(pattern){if(haptics&&vibrationSupported)try{navigator.vibrate(pattern)}catch{}}
const skin=()=>SQUISHIES.find(x=>x.id===store.state.clicker.skin)||SQUISHIES[0];
function toast(message){$('factory-toast').textContent=message;$('factory-toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('factory-toast').hidden=true,5500)}
function particles(big=false){if(reduced)return;for(let i=0;i<(big?18:5);i++){const e=document.createElement('span');e.className='peanut-crumb';e.textContent=big?['♡','✦','♥'][i%3]:'♡';e.style.color=skin().color;e.style.setProperty('--dx',Math.random()*240-120+'px');e.style.setProperty('--dy',-35-Math.random()*150+'px');$('crunch-particles').append(e);setTimeout(()=>e.remove(),850)}}
const upgradeButtons=new Map();
for(const u of UPGRADES){const b=document.createElement('button');b.className='upgrade-buy';b.disabled=true;
 const icon=document.createElement('span');icon.className='upgrade-symbol';icon.textContent=u.icon;icon.setAttribute('aria-hidden','true');
 const copy=document.createElement('span');copy.className='upgrade-copy';const name=document.createElement('strong'),detail=document.createElement('small');name.textContent=u.name;detail.textContent=u.detail;copy.append(name,detail);
 const price=document.createElement('span');price.className='upgrade-price';const cost=document.createElement('strong'),owned=document.createElement('small');price.append(cost,owned);b.append(icon,copy,price);
 b.onclick=()=>{let bought=false;store.change(s=>{bought=buyUpgrade(s,u.id)});if(bought){if(!reduced)b.animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}],{duration:260});playSquish(skin().sound,sound);vibrate(10)}};
 $('upgrades').append(b);upgradeButtons.set(u.id,{b,cost,owned});}
function shelf(s){const unlocked=unlockedSquishies(s),key=JSON.stringify([unlocked,s.clicker.skin,store.ready]);if(key===lastShelf)return;lastShelf=key;
 $('squishy-count').textContent=unlocked.length+' / '+SQUISHIES.length;
 $('squishy-options').replaceChildren(...SQUISHIES.map(x=>{const b=document.createElement('button');b.className='squishy-option'+(unlocked.includes(x.id)?'':' locked');b.disabled=!store.ready||!unlocked.includes(x.id);b.setAttribute('aria-pressed',s.clicker.skin===x.id);const img=document.createElement('img');img.src=x.image;img.alt=x.name;const name=document.createElement('strong');name.textContent=x.name;const hint=document.createElement('small');hint.textContent=unlocked.includes(x.id)?(s.clicker.skin===x.id?'Squishing this ♡':'Try this texture'):format(x.goal)+' lifetime squishes';b.append(img,name,hint);b.onclick=()=>{store.change(s=>s.clicker.skin=x.id);playSquish(x.sound,sound);particles(true)};return b}));
 const active=skin();$('crunch-button').querySelector('img').src=active.image;$('crunch-button').setAttribute('aria-label','Squish '+active.name);$('squishy-name').textContent=active.name;document.querySelector('.crunch-workshop').style.setProperty('--squishy-color',active.color);
 const next=SQUISHIES.find(x=>!unlocked.includes(x.id));$('squishy-info').textContent=next?'Next texture: '+next.name+' at '+format(next.goal)+' lifetime squishes.':'Every little texture is yours ♡';}
store.subscribe((s,event)=>{
 $('crunch-balance').textContent=format(s.clicker.balance);$('tap-rate').textContent=tapPower(s)+' per squish';$('auto-rate').textContent=Math.round(passiveRate(s)*10)/10+' every second';$('lifetime-crunches').textContent=format(s.clicker.lifetime)+' lifetime squishes';$('factory-save-status').textContent=event.status||store.status;$('crunch-button').disabled=!store.ready;
 for(const u of UPGRADES){const {b,cost,owned}=upgradeButtons.get(u.id),price=upgradeCost(s,u.id);cost.textContent=s.clicker.upgrades[u.id]>=50?'Maxed out ♡':format(price)+' squishes';owned.textContent=s.clicker.upgrades[u.id]+' owned';b.disabled=!store.ready||s.clicker.balance<price||s.clicker.upgrades[u.id]>=50}
 $('cozy-progress').value=Math.min(500,s.clicker.lifetime);$('star-progress').value=Math.min(100000,s.clicker.lifetime);$('cozy-goal').textContent=t(s.clicker.lifetime>=500?'peanut.cozyDone':'peanut.cozyGoal');$('star-goal').textContent=s.clicker.lifetime>=100000?'Ada Mesmer cosplay unlocked ♡':format(s.clicker.lifetime)+' / 100,000 squishes · Ada Mesmer cosplay';
 document.querySelector('.crunch-workshop').classList.toggle('factory-running',passiveRate(s)>0);$('factory-activity').textContent=passiveRate(s)>0?'Your tiny workshop is making softness, even between taps.':'Wake up the workshop with a little squish.';
 if(event.offlineEarnings>=1){$('offline-earnings').hidden=false;$('offline-earnings').textContent='Your helpers made '+format(event.offlineEarnings)+' squishes while you were away!'}
 $('espurr-encouragement').textContent=t(s.clicker.lifetime>=1000?'peanut.proud':passiveRate(s)>0?'peanut.working':'peanut.encouragement');shelf(s);
 if(store.ready){if(baseline===null)baseline=s.clicker.lifetime;else{const crossed=[100,250,500,1000,1500,6000,15000,50000,100000,125000].filter(n=>baseline<n&&s.clicker.lifetime>=n);if(crossed.length){toast(format(crossed.at(-1))+' lifetime squishes! A little celebration for my princess ♡');particles(true);playSquish(skin().sound,sound,true);vibrate([12,30,12]);}baseline=s.clicker.lifetime;}}
 if(event.unlocked?.length)toast('New outfit! '+event.unlocked.map(id=>OUTFITS.find(o=>o.id===id).name).join(' · ')+' ♡');
});
$('crunch-button').onclick=()=>{
 if(!store.ready)return;const now=performance.now();combo=now-lastTap<800?combo+1:1;lastTap=now;
 const bonus=combo%10===0?10+(store.state.clicker.upgrades.musicbox||0)*2:0,amount=tapPower(store.state)+bonus;
 store.change(s=>{s.clicker.manual++;addCrunches(s,amount)});$('combo-heat').value=combo%10||10;vibrate(bonus?[12,24,12]:8);
 if(store.state.clicker.manual%25===0){clearTimeout(goldenTimer);$('golden-peanut').hidden=false;goldenTimer=setTimeout(()=>$('golden-peanut').hidden=true,10000)}
 particles(!!bonus);$('combo-copy').textContent=t(bonus?'peanut.bonus':'peanut.combo',{count:combo,left:10-combo%10});
 if(!reduced)$('crunch-button').animate([{transform:'scale(1.18,.78) rotate(-3deg)'},{transform:'scale(.94,1.06)'},{transform:'scale(1)'}],{duration:260});
 const e=document.createElement('span');e.className='crunch-particle';e.textContent='+'+amount;e.style.setProperty('--drift',Math.random()*80-40+'px');$('crunch-particles').append(e);setTimeout(()=>e.remove(),850);playSquish(skin().sound,sound);
};
$('golden-peanut').onclick=()=>{if(!store.ready||$('golden-peanut').hidden)return;$('golden-peanut').hidden=true;clearTimeout(goldenTimer);const amount=Math.max(25,tapPower(store.state)*5);store.change(s=>addCrunches(s,amount));$('combo-copy').textContent='Golden peanut! +'+format(amount)+' bonus squishes ♡';particles(true);playSquish('chime',sound);vibrate([15,30,15])};
setInterval(()=>{if(combo&&performance.now()-lastTap>800){combo=0;$('combo-heat').value=0}},500);
void store.load();
