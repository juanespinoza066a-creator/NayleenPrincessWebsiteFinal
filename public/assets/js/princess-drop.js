import {dropAudio} from './drop-audio.js';
import {dropRenderer} from './drop-renderer.js';
import {OUTFITS,PRIZES,ROOMS,DROP_GOAL,DROP_FINAL_TIER,DROP_TRIES,dropAttempts,claimDropPrize,beginDrop,finishDrop,mondayKey} from './game-rules.js';
import {playBoxSound} from './box-audio.js';
const IDS=['duck','peanut','frog','rose','espurr','sunday','rafayel','furina','emil'];
export const mergePoints=tier=>7*2**(tier-1);
export const RADII=[15,22,31,42,55,70,88,108,130];
export const mergeTier=(a,b)=>a===b&&a<8?a+1:null;
export function overflowing(pieces,age){return pieces.some(b=>age-(b.plugin?.bornAt??0)>1.5&&b.position.y-b.circleRadius<145&&Math.hypot(b.velocity.x||0,b.velocity.y)<1.5);}
export function openDrop(store,{open,body,result,button,p}){
 open('Princess Drop');body.querySelector('.game-host')?.remove();p('Drop little treasures into the basket. Matching treasures join into a bigger one! Reach 1,500 sparkle points for one surprise collectible on your first win each week. Sunday’s room opens as soon as you reach 3,200 points. Keep the pile below the ribbon. Five attempts each week; you can return to an unfinished basket without using another try.');
 const audio=dropAudio(),tools=document.createElement('div');tools.className='game-actions drop-tools';body.append(tools);const music=button('',()=>{audio.toggleMusic();labels()},tools),sfx=button('',()=>{audio.toggleSfx();labels()},tools);function labels(){music.textContent=audio.music?'♫ Basket music on':'♫ Basket music off';sfx.textContent=audio.sfx?'♪ Little sounds on':'♪ Little sounds off';}labels();const stopAudio=()=>audio.stop();body.closest('dialog')?.addEventListener('close',stopAudio,{once:true});window.addEventListener('pagehide',stopAudio,{once:true});
 const week=mondayKey(),used=store.state.dropRuns?.[week];
 if(used&&used.status!=='active'&&dropAttempts(used)>=DROP_TRIES){const notice=document.createElement('div');notice.className='drop-end-card';notice.innerHTML='<strong></strong><p></p>';notice.querySelector('strong').textContent=used.status==='won'?'A royal surprise is yours! ♡':'Your basket is full ♡';notice.querySelector('p').textContent=used.score.toLocaleString()+' sparkle points · A fresh basket opens Monday.';body.append(notice);return;}
 const welcome=document.createElement('div');welcome.className='drop-welcome';welcome.innerHTML='<img src="assets/images/espurr-princess.webp" alt="Espurr cheering beside your basket"><span>Little treasures, big hugs ♡</span>';body.append(welcome);const ladder=document.createElement('div');ladder.className='drop-ladder';ladder.setAttribute('aria-label','Merge matching treasures from duck to Emil plushie');for(const id of IDS){const image=document.createElement('img');const item=PRIZES.find(p=>p.id===id);image.src=item.image;image.alt=item.name;ladder.append(image);}body.append(ladder);welcome.querySelector('img').src=OUTFITS.find(o=>o.id===store.state.outfit)?.image||OUTFITS[0].image;
 const start=button(used?.status==='active'?'Resume my basket ♡':'Begin my weekly basket ♡',()=>{let run;store.change(s=>{run=beginDrop(s)});if(!run)return;start.remove();play(run);});
 function play(run){body.classList.add('drop-playing');audio.start();
 const {Engine,Bodies,Body,Composite,Events}=window.Matter,engine=Engine.create({enableSleeping:true});engine.gravity.y=1;
 const canvas=document.createElement('canvas');const pixelRatio=Math.min(2,Math.max(1,window.devicePixelRatio||1));canvas.width=Math.round(400*pixelRatio);canvas.height=Math.round(650*pixelRatio);canvas.style.aspectRatio='400 / 650';canvas.className='princess-drop';canvas.setAttribute('aria-label','Treasure basket. Drag to aim, then release or tap Drop treasure.');canvas.tabIndex=0;const arena=document.createElement('div');arena.className='drop-arena';body.append(arena);arena.append(canvas);
 const nextCard=document.createElement('div');nextCard.className='drop-next';nextCard.innerHTML='<span>Next little treasure ♡</span><img alt="Next treasure">';arena.before(nextCard);
 const meter=document.createElement('p');meter.className='drop-score';meter.setAttribute('aria-live','polite');body.append(meter);
 let finishBasket;let aim=200,score=run.score,bestTier=run.bestTier||0,gameTime=2,held=run.held,next=run.next,active=true,last=0,acc=0,cooldown=0,overflow=0,saveAt=0,bursts=[];
 const context=canvas.getContext('2d'),images=IDS.map((id,tier)=>{const i=new Image(),src=PRIZES.find(p=>p.id===id).image;i.src=tier<6?src.replace('assets/images/','assets/images/thumbs/'):src;return i;});
 const renderer=dropRenderer(context,images,RADII,pixelRatio),nextImage=nextCard.querySelector('img');let shownNext=-1,shownMeter='';
 const spawn=(tier,x,y,saved)=>{const b=Bodies.circle(x,y,RADII[tier],{restitution:.12,friction:.2,frictionStatic:.5,frictionAir:.008,label:'treasure',plugin:{tier,bornAt:saved?0:gameTime}});if(saved){Body.setVelocity(b,{x:saved.vx,y:saved.vy});Body.setAngle(b,saved.angle);}Composite.add(engine.world,b);return b;};
 Composite.add(engine.world,[Bodies.rectangle(25,370,30,540,{isStatic:true}),Bodies.rectangle(375,370,30,540,{isStatic:true}),Bodies.rectangle(200,615,360,30,{isStatic:true})]);
 for(const b of run.pieces){const r=RADII[b.tier],x=run.layout===2?b.x:40+(b.x-5)*320/390,y=run.layout===2?b.y:145+(b.y-90)*455/545;spawn(b.tier,Math.max(40+r,Math.min(360-r,x)),Math.min(600-r,y),b);}
 const treasures=()=>Composite.allBodies(engine.world).filter(b=>b.label==='treasure');
 const checkpoint=(flush=false)=>{if(!active)return;let awarded;store.change(s=>{const r=s.dropRuns?.[week];if(!r||r.status!=='active')return;Object.assign(r,{layout:2,score,bestTier,held,next,pieces:treasures().map(b=>({tier:b.plugin.tier,x:b.position.x,y:b.position.y,vx:b.velocity.x,vy:b.velocity.y,angle:b.angle}))});awarded=claimDropPrize(s,Math.random,week);},{game:true});if(awarded){result.textContent=awarded.name+' is yours ♡ Keep going! Sunday’s room opens at 3,200 points.';audio.effect('win');welcome.classList.add('drop-celebrate');}if(flush)store.flushGame?.();if(score>=DROP_GOAL&&!finishBasket)finishBasket=button('Finish this basket ♡',()=>end(false,'finished'));};
 const end = (won, reason = 'overflow') => {
    if (!active) return;
    checkpoint();
    active = false;
    store.change(state => finishDrop(state, won, Math.random, week));
    const completed = store.state.dropRuns[week];
    const lost = reason === 'overflow';
    const weekly = completed.weeklyReward;
    const prize = weekly && (weekly.kind === 'room' ? ROOMS : weekly.kind === 'outfit' ? OUTFITS : PRIZES)
        .find(item => item.id === weekly.id);
    const remaining = DROP_TRIES - dropAttempts(completed);
    const headline = lost ? 'You lost · Basket full' : 'Basket complete ♡';
    const scoreLine = score.toLocaleString() + ' points · ' +
        (remaining ? remaining + (remaining === 1 ? ' try left this week.' : ' tries left this week.') : 'A fresh basket opens Monday.');
    const prizeLine = prize ? 'Your weekly ' + weekly.kind + ': ' + prize.name + ' ♡'
        : 'Reach 1,500 points to earn this week’s collectible.';
    drop.disabled = true;
    if (finishBasket) finishBasket.disabled = true;
    result.textContent = headline + '. ' + scoreLine + ' ' + prizeLine;
    audio.effect(lost ? 'lose' : 'win');
    audio.stop();
    arena.classList.add(lost ? 'drop-lost' : 'drop-won');
    welcome.classList.add(lost ? 'drop-sorry' : 'drop-celebrate');
    const notice = document.createElement('div');
    notice.className = 'drop-finale';
    notice.setAttribute('role', 'alert');
    const title = document.createElement('strong');
    title.textContent = headline;
    const summary = document.createElement('p');
    summary.textContent = scoreLine;
    const reward = document.createElement('p');
    reward.textContent = prizeLine;
    notice.append(title, summary, reward);
    button('Back to my games ♡', () => document.getElementById('game-close')?.click(), notice);
    arena.append(notice);
    notice.scrollIntoView({ block: 'center', behavior: 'smooth' });
    cleanup();
 };
 Events.on(engine,'collisionStart',event=>{const merges=[],seen=new Set();for(const {bodyA:a,bodyB:b} of event.pairs){if(a.label!=='treasure'||b.label!=='treasure'||seen.has(a.id)||seen.has(b.id)||a.plugin.merging||b.plugin.merging)continue;const tier=mergeTier(a.plugin.tier,b.plugin.tier);if(tier===null)continue;seen.add(a.id);seen.add(b.id);a.plugin.merging=b.plugin.merging=true;merges.push({a,b,tier,x:(a.position.x+b.position.x)/2,y:(a.position.y+b.position.y)/2});}for(const m of merges){Composite.remove(engine.world,[m.a,m.b]);spawn(m.tier,m.x,m.y);score+=mergePoints(m.tier);bestTier=Math.max(bestTier,m.tier);if(bursts.length<16)bursts.push({x:m.x,y:m.y,t:1,tier:m.tier});audio.effect('merge',m.tier);}if(merges.length){checkpoint();}});
 const drop=button('Drop treasure ♡',()=>{if(!active||cooldown>0||document.hidden)return;spawn(held,Math.max(40+RADII[held]+2,Math.min(358-RADII[held],aim)),92);held=next;next=Math.floor(Math.random()*4);cooldown=1.1;audio.effect('drop');checkpoint();});
 arena.before(drop);drop.classList.add('drop-control');arena.before(meter);
 const point=e=>{const r=canvas.getBoundingClientRect();aim=Math.max(55,Math.min(345,(e.clientX-r.left)*400/r.width));};canvas.onpointerdown=e=>{point(e);canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(e.buttons)point(e)};canvas.onpointerup=()=>drop.click();canvas.onkeydown=e=>{if(['ArrowLeft','ArrowRight',' ','Enter'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')aim=Math.max(55,aim-16);if(e.key==='ArrowRight')aim=Math.min(345,aim+16);if(e.key===' '||e.key==='Enter')drop.click();};
 const onHide=()=>{if(document.hidden){checkpoint(true);last=0;acc=0;}},onClose=()=>{checkpoint(true);active=false;audio.stop();cleanup();};const dialog=body.closest('dialog');
 document.addEventListener('visibilitychange',onHide);window.addEventListener('pagehide',checkpoint);dialog?.addEventListener('close',onClose,{once:true});
 function cleanup(){document.removeEventListener('visibilitychange',onHide);window.removeEventListener('pagehide',checkpoint);dialog?.removeEventListener('close',onClose);Engine.clear(engine);}
 function draw(now){if(!active)return;if(!canvas.isConnected||!dialog?.open){onClose();return;}const dt=document.hidden?0:Math.min(.05,last?(now-last)/1000:0);last=now;acc+=dt;gameTime+=dt;while(acc>=1/60&&active){Engine.update(engine,1000/60);acc-=1/60;}if(!active)return;cooldown=Math.max(0,cooldown-dt);drop.disabled=cooldown>0;overflow=overflowing(treasures(),gameTime)?overflow+dt:0;if(overflow>2){end(false);return;}saveAt+=dt;if(saveAt>4){checkpoint();saveAt=0;}
 renderer.background(overflow);if(shownNext!==next){shownNext=next;nextImage.src=images[next].src;}
 const paint=renderer.paint;
 for(const b of treasures())paint(b.plugin.tier,b.position.x,b.position.y,b.angle);paint(held,Math.max(40+RADII[held]+2,Math.min(358-RADII[held],aim)),70);
 for(const b of bursts){b.t-=dt;context.globalAlpha=Math.max(0,b.t);context.font=(20+b.t*12)+'px serif';context.fillText('♡ ✧ +'+mergePoints(b.tier),b.x-22,b.y-(1-b.t)*65);}context.globalAlpha=1;bursts=bursts.filter(b=>b.t>0);const meterText=`✧ ${score.toLocaleString()} · ${store.state.dropRuns[week]?.weeklyReward?'Weekly collectible earned ♡':'Prize at 1,500'} · ${score>=3200?'Sunday room unlocked ♡':'Sunday room at 3,200'}`;if(meterText!==shownMeter){shownMeter=meterText;meter.textContent=meterText;}requestAnimationFrame(draw);}
 requestAnimationFrame(draw);canvas.focus();
 }
}
