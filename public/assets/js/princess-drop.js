import {OUTFITS,PRIZES,DROP_GOAL,beginDrop,finishDrop,mondayKey} from './game-rules.js';
import {playBoxSound} from './box-audio.js';
const IDS=['duck','peanut','frog','rose','espurr','sunday','rafayel','furina','emil'];
export const RADII=[15,19,24,30,37,45,54,64,76];
export const mergeTier=(a,b)=>a===b&&a<8?a+1:null;
export function overflowing(pieces,age){return age>2&&pieces.some(b=>b.position.y-b.circleRadius<90&&Math.abs(b.velocity.y)<1);}
export function openDrop(store,{open,body,result,button,p}){
 open('Princess Drop');body.querySelector('.game-host')?.remove();p('Drop little treasures into the basket. Matching treasures join into a bigger one! Reach 1,400 sparkle points to win a surprise collectible, room, or outfit. Keep the pile below the ribbon. One adventure each week; you can return to an unfinished basket.');
 const week=mondayKey(),used=store.state.dropRuns?.[week];
 if(used&&used.status!=='active'){p(used.status==='won'?'This week’s surprise is yours ♡':'Your basket is resting until Monday ♡');return;}
 const welcome=document.createElement('div');welcome.className='drop-welcome';welcome.innerHTML='<img src="assets/images/espurr-princess.webp" alt="Espurr cheering beside your basket"><span>Little treasures, big hugs ♡</span>';body.append(welcome);welcome.querySelector('img').src=OUTFITS.find(o=>o.id===store.state.outfit)?.image||OUTFITS[0].image;
 const start=button(used?'Resume my basket ♡':'Begin my weekly basket ♡',()=>{let run;store.change(s=>{run=beginDrop(s)});if(!run)return;start.remove();play(run);});
 function play(run){
 const {Engine,Bodies,Body,Composite,Events}=window.Matter,engine=Engine.create({enableSleeping:true});engine.gravity.y=1;
 const canvas=document.createElement('canvas');canvas.width=400;canvas.height=650;canvas.className='princess-drop';canvas.setAttribute('aria-label','Treasure basket. Move left or right, then press Drop.');canvas.tabIndex=0;body.append(canvas);
 const meter=document.createElement('p');meter.className='drop-score';meter.setAttribute('aria-live','polite');body.append(meter);
 let aim=200,score=run.score,held=run.held,next=run.next,active=true,last=0,acc=0,cooldown=0,overflow=0,saveAt=0,age=3,bursts=[];
 const context=canvas.getContext('2d'),images=IDS.map(id=>{const i=new Image();i.src=PRIZES.find(p=>p.id===id).image;return i;});
 const spawn=(tier,x,y,saved)=>{const b=Bodies.circle(x,y,RADII[tier],{restitution:.12,friction:.2,frictionStatic:.5,frictionAir:.008,label:'treasure',plugin:{tier}});if(saved){Body.setVelocity(b,{x:saved.vx,y:saved.vy});Body.setAngle(b,saved.angle);}Composite.add(engine.world,b);return b;};
 Composite.add(engine.world,[Bodies.rectangle(-10,350,30,720,{isStatic:true}),Bodies.rectangle(410,350,30,720,{isStatic:true}),Bodies.rectangle(200,650,430,30,{isStatic:true})]);
 for(const b of run.pieces)spawn(b.tier,b.x,b.y,b);
 const treasures=()=>Composite.allBodies(engine.world).filter(b=>b.label==='treasure');
 const checkpoint=()=>{if(!active)return;store.change(s=>{const r=s.dropRuns?.[week];if(!r||r.status!=='active')return;Object.assign(r,{score,held,next,pieces:treasures().map(b=>({tier:b.plugin.tier,x:b.position.x,y:b.position.y,vx:b.velocity.x,vy:b.velocity.y,angle:b.angle}))});});};
 const end=won=>{if(!active)return;checkpoint();active=false;let reward;store.change(s=>{reward=finishDrop(s,won,Math.random,week)});drop.disabled=true;result.textContent=won&&reward?`A royal surprise! ${reward.name} is yours ♡`:'A lovely little pile ♡ A new basket opens Monday.';if(won)playBoxSound();cleanup();};
 Events.on(engine,'collisionStart',event=>{const merges=[],seen=new Set();for(const {bodyA:a,bodyB:b} of event.pairs){if(a.label!=='treasure'||b.label!=='treasure'||seen.has(a.id)||seen.has(b.id)||a.plugin.merging||b.plugin.merging)continue;const tier=mergeTier(a.plugin.tier,b.plugin.tier);if(tier===null)continue;seen.add(a.id);seen.add(b.id);a.plugin.merging=b.plugin.merging=true;merges.push({a,b,tier,x:(a.position.x+b.position.x)/2,y:(a.position.y+b.position.y)/2});}for(const m of merges){Composite.remove(engine.world,[m.a,m.b]);spawn(m.tier,m.x,m.y);score+=2**(m.tier+1);bursts.push({x:m.x,y:m.y,t:1});}if(merges.length){if(score>=DROP_GOAL)end(true);else checkpoint();}});
 const drop=button('Drop treasure ♡',()=>{if(!active||cooldown>0||document.hidden)return;spawn(held,Math.max(RADII[held]+7,Math.min(393-RADII[held],aim)),60);held=next;next=Math.floor(Math.random()*4);cooldown=.65;age=0;checkpoint();});
 const point=e=>{const r=canvas.getBoundingClientRect();aim=Math.max(25,Math.min(375,(e.clientX-r.left)*400/r.width));};canvas.onpointerdown=e=>{point(e);canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(e.buttons)point(e)};canvas.onpointerup=()=>drop.click();canvas.onkeydown=e=>{if(['ArrowLeft','ArrowRight',' ','Enter'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')aim=Math.max(25,aim-16);if(e.key==='ArrowRight')aim=Math.min(375,aim+16);if(e.key===' '||e.key==='Enter')drop.click();};
 const onHide=()=>{if(document.hidden){checkpoint();last=0;acc=0;}},onClose=()=>{checkpoint();active=false;cleanup();};const dialog=body.closest('dialog');
 document.addEventListener('visibilitychange',onHide);window.addEventListener('pagehide',checkpoint);dialog?.addEventListener('close',onClose,{once:true});
 function cleanup(){document.removeEventListener('visibilitychange',onHide);window.removeEventListener('pagehide',checkpoint);dialog?.removeEventListener('close',onClose);Engine.clear(engine);}
 function draw(now){if(!active)return;if(!canvas.isConnected||!dialog?.open){onClose();return;}const dt=document.hidden?0:Math.min(.05,last?(now-last)/1000:0);last=now;acc+=dt;while(acc>=1/60){Engine.update(engine,1000/60);acc-=1/60;}age+=dt;cooldown=Math.max(0,cooldown-dt);drop.disabled=cooldown>0;overflow=overflowing(treasures(),age)?overflow+dt:0;if(overflow>2){end(false);return;}saveAt+=dt;if(saveAt>4){checkpoint();saveAt=0;}
 context.clearRect(0,0,400,650);context.fillStyle='#f4e5fa';context.fillRect(0,0,400,650);context.fillStyle='#ead0f2';context.fillRect(5,90,390,545);context.strokeStyle=overflow>0?'#be507a':'#9870af';context.setLineDash([8,7]);context.beginPath();context.moveTo(5,90);context.lineTo(395,90);context.stroke();context.setLineDash([]);context.font='14px sans-serif';context.fillStyle='#573466';context.fillText('Keep treasures below the ribbon ♡',14,112);context.fillText('Next',325,22);
 const paint=(tier,x,y,angle=0)=>{context.save();context.translate(x,y);context.rotate(angle);context.fillStyle=['#f4c4d8','#e8d0b5','#c3dbba','#eebbd2','#d7c4eb','#d7dced','#bcd7ec','#c1ddf5','#ded5df'][tier];context.beginPath();context.arc(0,0,RADII[tier],0,Math.PI*2);context.fill();context.strokeStyle='#a07bab';context.stroke();const im=images[tier];if(im.complete&&im.naturalWidth){const k=Math.min((RADII[tier]*1.65)/im.naturalWidth,(RADII[tier]*1.65)/im.naturalHeight);context.drawImage(im,-im.naturalWidth*k/2,-im.naturalHeight*k/2,im.naturalWidth*k,im.naturalHeight*k);}context.restore();};
 for(const b of treasures())paint(b.plugin.tier,b.position.x,b.position.y,b.angle);paint(held,Math.max(RADII[held]+7,Math.min(393-RADII[held],aim)),55);paint(next,350,51);
 for(const b of bursts){b.t-=dt;context.globalAlpha=Math.max(0,b.t);context.font='25px serif';context.fillText('♡ ✧',b.x-15,b.y-(1-b.t)*60);}context.globalAlpha=1;bursts=bursts.filter(b=>b.t>0);meter.textContent=`✧ ${score} / ${DROP_GOAL} sparkle points`;requestAnimationFrame(draw);}
 requestAnimationFrame(draw);canvas.focus();
 }
}
