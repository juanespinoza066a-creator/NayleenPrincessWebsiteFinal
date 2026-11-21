import {db,reply,sameOrigin,body,session} from '../server/common.js';
import {recoveryState} from '../server/recovery.js';
export default async function handler(req,res){
 try{
  if(!['GET','POST','DELETE'].includes(req.method))return reply(res,405,{error:'Please try another action.'});
  if(req.method!=='GET'&&!sameOrigin(req))return reply(res,403,{error:'Please use the Palace to manage your backups.'});
  const auth=await session(req);if(!auth)return reply(res,401,{error:'Sign in to keep your treasures safe.'});
  const id=new URL(req.url||'/api/backups','https://palace.invalid').searchParams.get('id');
  if(id&&!/^[1-9][0-9]{0,18}$/.test(id))return reply(res,400,{error:'Choose a saved backup.'});
  const filter=`profile=eq.${auth.profile}`;
  if(req.method==='GET'){
   const rows=await db(`carnival_backups?${filter}${id?'&id=eq.'+id:''}&select=${id?'id,state,revision,created_at,reason':'id,revision,created_at,reason'}&order=created_at.desc,id.desc&limit=${id?1:5}`);
   if(!id)return reply(res,200,{backups:rows,profile:auth.profile});
   if(!rows.length)return reply(res,404,{error:'That backup is no longer here.'});
   return reply(res,200,{kind:'nayleen-carnival-backup',version:3,profile:auth.profile,exportedAt:rows[0].created_at,state:rows[0].state});
  }
  if(req.method==='DELETE'){
   if(!id)return reply(res,400,{error:'Choose a backup to remove.'});
   await db(`carnival_backups?${filter}&id=eq.${id}`,{method:'DELETE'});return reply(res,200,{deleted:true});
  }
  const data=await body(req);
  if(!Number.isSafeInteger(data.revision)||data.revision<0)return reply(res,400,{error:'Please reload your saved progress first.'});
  const rows=await db(`carnival_saves?${filter}&select=state,revision&limit=1`),current=rows[0];
  if((current?.revision||0)!==data.revision)return reply(res,409,{error:'Another device saved newer progress. Reload it before restoring.'});
  let restored;try{restored=recoveryState(data.backup,current?.state,auth.profile);}catch(e){return reply(res,400,{error:e.message});}
  const result=await db('rpc/carnival_restore_save',{method:'POST',body:{p_state:restored,p_revision:data.revision,p_profile:auth.profile}});
  if(!result.length)return reply(res,409,{error:'Another device saved newer progress. Your progress has not been replaced.'});
  return reply(res,200,{state:result[0].state,revision:result[0].revision});
 }catch{return reply(res,503,{error:'Your backups couldn’t be reached. Your current progress is still safe to keep on this device.'});}
}
