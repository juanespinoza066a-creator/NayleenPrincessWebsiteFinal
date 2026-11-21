import {api,STATIC} from './save-manager.js';
import {validState,normalizeState} from './game-rules.js';
export function attachRecovery(store,{open,close,body}){
 const status=document.getElementById('backup-status');
 const paragraph=text=>{const p=document.createElement('p');p.textContent=text;body.append(p);};
 const button=(text,fn)=>{const b=document.createElement('button');b.className='button';b.textContent=text;b.onclick=async()=>{b.disabled=true;try{await fn();}catch(e){const message=e.message||'Please try again.';status.textContent=message;paragraph(message);}finally{b.disabled=false;}};body.append(b);return b;};
 document.getElementById('backup-list').onclick=async()=>{
  if(!store.ready)return;if(STATIC){status.textContent='Sign in to see your saved treasures ♡';return;}
  try{const data=await api('api/backups');open('Saved backups ♡');paragraph('Your room, games, notes, dates, and playlists save automatically. A recovery copy is kept every three days when you visit and save. Use an older copy only if something is missing. The newest five copies are kept for you.');
   if(!data.backups.length)paragraph('Your first backup will appear after your next successful save.');
   for(const item of data.backups){const date=new Date(item.created_at).toLocaleString();button(date+(item.reason==='before-recovery'?' · Before recovery':''),async()=>{
    const backup=await api('api/backups?id='+item.id);
    if(backup.kind!=='nayleen-carnival-backup'||!validState(backup.state)||backup.profile!==store.profile)throw Error('That saved copy couldn’t be opened. Your progress has not changed.');
    open('Restore this saved copy?');paragraph(date+' · '+backup.state.prizes.length+' collectibles');paragraph('This brings back your saved progress, notes, dates, and playlists. A safety copy is saved first. Weekly turns already used stay used.');
    button('Restore this copy',async()=>{
     await store.save();if(!store.online||store.conflict||store.dirty||store.saving)throw Error('Let your current progress finish saving, then try again.');store.saving=true;
     try{const result=await api('api/backups',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({backup,revision:store.revision})});store.state=normalizeState(result.state);store.revision=result.revision;store.dirty=false;store.conflict=false;store.lastSync=Date.now();store.status='Restored and saved ♡';store.remember();store.emit();status.textContent='Your treasures are back and saved ♡';close();}finally{store.saving=false;}
    });button('Keep my current progress',close);
   });}button('Done',close);
  }catch(e){status.textContent=e.message||'Your saved copies couldn’t be reached. Try again shortly.';}
 };
}
