import {db,reply,sameOrigin,body,session,matchesCode,attempt,setCookie,token,hash} from '../server/common.js';
export default async function handler(req,res) {
 try {
  if(req.method==='GET')return reply(res,200,{signedIn:Boolean(await session(req))});
  if(!['POST','DELETE'].includes(req.method))return reply(res,405,{error:'Method not allowed.'});
  if(!sameOrigin(req))return reply(res,403,{error:'Please use the carnival website to sign in.'});
  if(req.method==='DELETE'){const raw=await session(req);if(raw)await db(`carnival_sessions?token_hash=eq.${hash(raw)}`,{method:'DELETE'});setCookie(res,'',0);return reply(res,200,{signedIn:false});}
  const data=await body(req);
  if(!await attempt(req))return reply(res,429,{error:'Too many tries. Please wait 15 minutes before trying again.'});
  if(!matchesCode(data.code))return reply(res,401,{error:'That isn’t the carnival code. Try again.'});
  const raw=token();await db('carnival_sessions',{method:'POST',body:{token_hash:hash(raw),expires_at:new Date(Date.now()+604800000).toISOString()}});setCookie(res,raw);return reply(res,200,{signedIn:true});
 }catch(error){return reply(res,503,{error:error.message||'Login is unavailable.'});}
}
