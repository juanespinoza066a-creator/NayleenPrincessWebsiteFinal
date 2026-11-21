import {updateProgress} from './progress-view.js';
import {designTools} from './room-designs.js';
import {galleryPager} from './gallery-pager.js';
import {ROOMS, unlockedRooms, roomProgress} from './game-rules.js';
export {ROOMS, unlockedRooms, roomProgress};
export function resetEstimate(now=Date.now()){
 const fmt=new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',year:'numeric',month:'numeric',day:'numeric',hour:'numeric',hourCycle:'h23',minute:'numeric',second:'numeric'});
 const parts=at=>{const a=fmt.formatToParts(at);return Object.fromEntries(a.filter(x=>x.type!=='literal').map(x=>[x.type,+x.value]))};
 const d=parts(now),day=new Date(Date.UTC(d.year,d.month-1,d.day)).getUTCDay(),days=(1-day+7)%7||7,utc=Date.UTC(d.year,d.month-1,d.day+days);
 let target=utc;for(let i=0;i<3;i++){const p=parts(target);target=utc-(Date.UTC(p.year,p.month-1,p.day,p.hour,p.minute,p.second)-target)}
 const hours=(target-now)/3600000;return hours>24?'About '+Math.ceil(hours/24)+' days until Monday’s reset':'About '+Math.max(1,Math.ceil(hours/4)*4)+' hours until reset';
}
export function makeStudio(store){
 const wardrobe=document.getElementById('wardrobe'),collection=document.querySelector('.collection-panel'),studio=document.createElement('section');studio.className='room-studio';wardrobe.before(studio);
 const controls=document.createElement('div');controls.className='studio-tabs';controls.setAttribute('role','tablist');controls.setAttribute('aria-label','Design Espurr’s room');studio.append(controls);
 const rooms=document.createElement('section');rooms.className='wardrobe room-options';rooms.id='rooms-panel';
 const panes=[wardrobe,collection,rooms];
 ['Outfits','Collectibles','Rooms'].forEach((name,i)=>{const b=document.createElement('button');b.textContent=name;b.setAttribute('role','tab');b.id='studio-tab-'+i;b.setAttribute('aria-controls',panes[i].id||'collection-panel');if(!panes[i].id)panes[i].id='collection-panel';b.onclick=()=>{panes.forEach((p,j)=>{p.hidden=j!==i;controls.children[j].setAttribute('aria-selected',String(j===i));controls.children[j].tabIndex=j===i?0:-1})};b.onkeydown=e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:2))%3;controls.children[next].click();controls.children[next].focus()}};controls.append(b)});
 panes.forEach((p,i)=>{p.setAttribute('role','tabpanel');p.setAttribute('aria-labelledby','studio-tab-'+i);studio.append(p)});controls.children[0].click();
 const backdrop=document.createElement('img');backdrop.className='room-backdrop';backdrop.alt='';backdrop.setAttribute('aria-hidden','true');document.querySelector('.espurr-room').prepend(backdrop);
 const heading=document.createElement('h2');heading.textContent='A place for my princess';const options=document.createElement('div');options.className='outfits';rooms.append(heading,options);galleryPager(document.getElementById('outfits'),'outfits');galleryPager(document.getElementById('collection'),'collectibles');galleryPager(options,'rooms');
 const exportButton=document.createElement('button');exportButton.className='button soft';exportButton.textContent='Save image of room';const feedback=document.createElement('p');feedback.setAttribute('role','status');feedback.className='section-copy';const roomHead=document.createElement('div');roomHead.className='room-export-head';document.querySelector('.espurr-room').before(roomHead);roomHead.append(exportButton,feedback);const renderDesigns=designTools(store,studio);
 exportButton.onclick=async()=>{exportButton.disabled=true;try{const room=document.querySelector('.espurr-room'),rect=room.getBoundingClientRect(),theme=ROOMS.find(r=>r.id===store.state.room)||ROOMS[0],canvas=document.createElement('canvas');canvas.width=1000;canvas.height=Math.round(1000*rect.height/rect.width);const c=canvas.getContext('2d'),sx=1000/rect.width,sy=canvas.height/rect.height;
 if(theme.image){const bg=new Image();bg.src=theme.image;await bg.decode();const k=Math.max(canvas.width/bg.naturalWidth,canvas.height/bg.naturalHeight);c.drawImage(bg,(canvas.width-bg.naturalWidth*k)/2,(canvas.height-bg.naturalHeight*k)/2,bg.naturalWidth*k,bg.naturalHeight*k)}else{c.fillStyle=theme.wall;c.fillRect(0,0,canvas.width,canvas.height);c.fillStyle=theme.floor;c.fillRect(0,canvas.height*.76,1000,canvas.height*.24);c.fillStyle='#f9efff';c.beginPath();c.ellipse(500,canvas.height*.84,290,40,0,0,Math.PI*2);c.fill();c.font='80px Georgia';c.fillText(theme.id==='garden'?'❀':theme.id==='cafe'?'♡':'☾',800,160);}

 // Paint the same grounded displays as the website, before their items and Espurr.
 for(const stand of room.querySelectorAll('.display-plinth')){if(getComputedStyle(stand).display==='none')continue;
   const b=stand.getBoundingClientRect(),x=(b.left-rect.left)*sx,y=(b.top-rect.top)*sy,w=b.width*sx,h=b.height*sy;
   const fill=getComputedStyle(stand).getPropertyValue('--plinth-color').trim()||'#cfb4df';
   c.fillStyle='#3f245b25';c.beginPath();c.ellipse(x+w/2,y+h,w*.64,h*.19,0,0,Math.PI*2);c.fill();
   const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#fff5ff');g.addColorStop(.45,fill);g.addColorStop(1,'#927caa');
   c.fillStyle=g;c.beginPath();c.roundRect(x,y+h*.12,w,h*.83,w*.1);c.fill();
   c.fillStyle=fill;c.beginPath();c.ellipse(x+w/2,y+h*.15,w/2,h*.16,0,0,Math.PI*2);c.fill();
 }
 const portrait=room.querySelector('#espurr-portrait');
 const images=[portrait,...room.querySelectorAll('.stage-slot img')].filter(Boolean);
 for(const img of images){await img.decode();const b=img.getBoundingClientRect();const fit=Math.min(b.width/img.naturalWidth,b.height/img.naturalHeight),w=img.naturalWidth*fit,h=img.naturalHeight*fit;
   const offsetY=img===portrait?(b.height-h)/2:b.height-h;
   c.drawImage(img,(b.left-rect.left+(b.width-w)/2)*sx,(b.top-rect.top+offsetY)*sy,w*sx,h*sy);
 }
 c.fillStyle='#513563';c.font='22px Georgia';c.textAlign='center';c.fillText('Nayleen’s Palace ♡',500,canvas.height-12);

 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error();const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='nayleens-palace-room.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);feedback.textContent='Your room portrait is ready to keep. ♡';}catch{feedback.textContent='The images are still loading. Try saving again in a moment.'}finally{exportButton.disabled=!store.ready}};
 let last='',sceneRoom='';return s=>{renderDesigns(s);const owned=unlockedRooms(s),id=owned.includes(s.room)?s.room:'lavender';document.querySelector('.espurr-room').dataset.room=id;const theme=ROOMS.find(r=>r.id===id);for(const slot of document.querySelectorAll('.stage-slot')){if(!slot.querySelector('.display-plinth')){const stand=document.createElement('span');stand.className='display-plinth';stand.setAttribute('aria-hidden','true');slot.prepend(stand)}}backdrop.hidden=!theme.image;if(theme.image && !backdrop.src.endsWith(theme.image))backdrop.src=theme.image;exportButton.disabled=!store.ready;const key=JSON.stringify([owned,id,store.ready]);if(key===last){updateProgress(options,ROOMS,r=>roomProgress(s,r.id));return;}last=key;options.replaceChildren(...ROOMS.map(r=>{const b=document.createElement('button');b.className='outfit room-option'+(owned.includes(r.id)?'':' locked');b.disabled=!store.ready||!owned.includes(r.id);b.setAttribute('aria-pressed',String(id===r.id));const preview=document.createElement('span');preview.className='room-preview';preview.style.background=r.image?`url('${r.image}') center/cover`:'linear-gradient('+r.wall+' 75%,'+r.floor+' 75%)';preview.textContent=r.image?'':r.id==='garden'?'❀':r.id==='cafe'?'☕':'☾';const name=document.createElement('strong');name.textContent=r.name;const hint=document.createElement('small');hint.textContent=id===r.id?'Living here ♡':owned.includes(r.id)?'Move in':r.hint;b.append(preview,name,hint);const goals=document.createElement('span');goals.className='outfit-goals';for(const goal of roomProgress(s,r.id)){const line=document.createElement('span'),meter=document.createElement('progress');line.textContent=goal.label+' · '+goal.value+' / '+goal.goal;meter.max=goal.goal;meter.value=goal.value;meter.setAttribute('aria-label',goal.label);goals.append(line,meter);}b.append(goals);b.onclick=()=>store.change(s=>s.room=r.id);return b}));};
}
