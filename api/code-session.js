import {adventOptions} from '../server/advent-settings.js';
import {loadPlayer} from '../server/player-save.js';
import {db,reply,sameOrigin,body,session,profileForCode,attempt,setCookie,token,hash} from '../server/common.js';
export default async function handler(req,res) {
 try {
  if(req.method==='GET'){
   const auth=await session(req);
   const response={signedIn:Boolean(auth),profile:auth?.profile||null};
   if(auth)Object.assign(response,adventOptions(auth.profile));
   if(auth&&req.headers['x-palace-load']==='progress'){
    try{response.save=await loadPlayer(auth.profile);}catch{}
   }
   return reply(res,200,response);
  }
  if(!['POST','DELETE'].includes(req.method))return reply(res,405,{error:'Method not allowed.'});
  if(!sameOrigin(req))return reply(res,403,{error:'Please use the carnival website to sign in.'});
  if(req.method==='DELETE'){const raw=await session(req);if(raw)await db(`carnival_sessions?token_hash=eq.${hash(raw.token)}`,{method:'DELETE'});setCookie(res,'',0);return reply(res,200,{signedIn:false});}
  const data=await body(req);
  if(!await attempt(req)){res.setHeader('Retry-After','60');return reply(res,429,{error:'Too many tries. Please wait one minute before trying again.'});}
  const profile=profileForCode(data.code);
  if(!profile)return reply(res,401,{error:'That isn’t the carnival code. Try again.'});
  const raw=token();await db('carnival_sessions',{method:'POST',body:{token_hash:hash(raw),profile,expires_at:new Date(Date.now()+604800000).toISOString()}});setCookie(res,raw);return reply(res,200,{signedIn:true,profile,...adventOptions(profile)});
 }catch(error){return reply(res,503,{error:error.message||'Login is unavailable.'});}
}
