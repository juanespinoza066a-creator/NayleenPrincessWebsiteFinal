import {api,downloadJSON,STATIC} from './save-manager.js';
import {validState,normalizeState} from './game-rules.js';
export function attachRecovery(store,{open,close,body}){
 const $=id=>document.getElementById(id),status=$('backup-status');
 const notice=text=>status.textContent=text;
 const button=(text,fn)=>{const b=document.createElement('button');b.className='button';b.textContent=text;b.onclick=async()=>{b.disabled=true;try{await fn();}catch(e){notice(e.message||'Please try again.');}finally{b.disabled=false;}};body.append(b);return b;};
 const paragraph=text=>{const p=document.createElement('p');p.textContent=text;body.append(p);};
 const file=()=>({kind:'nayleen-carnival-backup',version:3,profile:store.profile,exportedAt:new Date().toISOString(),state:structuredClone(store.state)});
 $('export-save').onclick=()=>{if(!store.ready)return;downloadJSON('palace-account-'+new Date().toISOString().slice(0,10)+'.json',file());notice('Your treasures are ready to keep ♡');};
 $('import-trigger').onclick=()=>{if(store.ready)$('import-save').click();};
 $('backup-list').onclick=async()=>{
  if(!store.ready)return;if(STATIC){notice('You can download a copy of your progress on this device ♡');return;}
  try{const data=await api('api/backups');open('Your saved treasures ♡');
   if(!data.backups.length)paragraph('Your first backup will appear after your next successful save.');
   for(const item of data.backups){const date=new Date(item.created_at).toLocaleString();paragraph(date+(item.reason==='before-recovery'?' · Before recovery':''));
    button('Download this backup',async()=>{const copy=await api('api/backups?id='+item.id);downloadJSON('palace-backup-'+item.id+'.json',copy);notice('Backup downloaded ♡');});
    button('Remove this backup',async()=>{open('Remove this saved copy?');paragraph('Your current progress and other saved copies will stay.');button('Remove copy',async()=>{await api('api/backups?id='+item.id,{method:'DELETE'});notice('Saved copy removed. Your current progress is unchanged ♡');close();});button('Keep it',close);});
   }button('Done',close);
  }catch(e){notice(e.message||'Your backups couldn’t be reached. Try again shortly.');}
 };
 $('import-save').onchange=async event=>{
  const uploaded=event.target.files[0];event.target.value='';if(!uploaded)return;
  try{if(uploaded.size>100000)throw Error('Choose a Palace backup smaller than 100 KB.');const backup=JSON.parse(await uploaded.text());
   if(backup.kind!=='nayleen-carnival-backup'||!validState(backup.state))throw Error('This file isn’t a Palace backup. Your progress has not changed.');
   if(backup.profile&&backup.profile!==store.profile)throw Error('This backup belongs to a different Palace profile.');
   open('Bring your treasures back ♡');paragraph(`This copy has ${backup.state.prizes.length} collectibles. It replaces your current game progress. Used weekly turns stay used. A safety copy is saved first.`);
   button('Restore this account data',async()=>{
    if(STATIC)throw Error('Sign in to restore your account progress.');await store.save();
    if(!store.online||store.conflict||store.dirty||store.saving)throw Error('Let your current progress finish saving first, then try again.');
    store.saving=true;
    try{const data=await api('api/backups',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({backup,revision:store.revision})});
     store.state=normalizeState(data.state);store.revision=data.revision;store.dirty=false;store.conflict=false;store.lastSync=Date.now();store.status='Restored and saved ♡';store.remember();store.emit();notice('Your treasures are back and saved ♡');close();
    }finally{store.saving=false;}
   });button('Keep current progress',close);
  }catch(e){notice(e instanceof SyntaxError?'This file isn’t a readable Palace backup. Your progress has not changed.':e.message||'Your file couldn’t be read. Your progress has not changed.');}
 };
}
