import {db,reply,sameOrigin,body,session} from '../server/common.js';
import {validState,normalizeState,freshState,recordLogin} from '../server/game-rules.js';
export default async function handler(req,res) {
 try {
  if(!['GET','PUT'].includes(req.method))return reply(res,405,{error:'Method not allowed.'});
  if(req.method==='PUT'&&!sameOrigin(req))return reply(res,403,{error:'Please save from the carnival website.'});
  const auth=await session(req);
  if(!auth)return reply(res,401,{error:'Enter your carnival code to load the cloud save.'});
  if(req.method==='GET'){const rows=await db(`carnival_saves?profile=eq.${auth.profile}&select=state,revision&limit=1`);const row=rows[0];return reply(res,200,{userId:auth.profile+'-code-profile',state:row?.state?normalizeState(row.state):null,revision:row?.revision||0});}
  const data=await body(req);
  if(data.action==='reset-testing'){
   if(auth.profile!=='testing')return reply(res,403,{error:'Reset is available only in the Testing account.'});
   if(!Number.isSafeInteger(data.revision)||data.revision<0)return reply(res,400,{error:'Reload Testing before resetting.'});
   const current=(await db('carnival_saves?profile=eq.testing&select=state,revision&limit=1'))[0];
   if(!current||current.revision!==data.revision)return reply(res,409,{error:'Another device saved newer progress. Reload Testing before resetting.'});
   const state=freshState();state.companion=normalizeState(current.state).companion;recordLogin(state);
   const rows=await db('rpc/carnival_restore_save',{method:'POST',body:{p_state:state,p_revision:data.revision,p_profile:'testing'}});
   if(!rows.length)return reply(res,409,{error:'Another device saved newer progress. Reload Testing before resetting.'});
   return reply(res,200,{state:normalizeState(rows[0].state),revision:rows[0].revision});
  }
  if(!validState(data.state)||!Number.isSafeInteger(data.revision)||data.revision<0)return reply(res,400,{error:'That save could not be accepted.'});
  const rows=await db('rpc/carnival_write_save',{method:'POST',body:{p_state:normalizeState(data.state),p_revision:data.revision,p_profile:auth.profile}});
  if(!rows.length)return reply(res,409,{error:'Another device saved newer progress. Download this device’s backup, then reload the cloud save.'});
  return reply(res,200,{revision:rows[0].revision});
 }catch(error){return reply(res,503,{error:error.message||'Cloud saving is unavailable.'});}
}
