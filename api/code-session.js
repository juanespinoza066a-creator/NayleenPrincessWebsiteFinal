import {adventOptions} from '../server/advent-settings.js';
import {loadPlayer} from '../server/player-save.js';
import {db,reply,sameOrigin,body,session,profileForCode,attempt,setCookie,token,hash} from '../server/common.js';
export default async function handler(req,res) {
 try {
  if(req.method==='GET'){
   const auth=await session(req);
   const response={signedIn:Boolean(auth),profile:auth?.profile||null};
   if(auth)Object.assign(response,adventOptions(auth.profile),{offlineProtocol:1});
   if(auth&&req.headers['x-palace-load']==='progress'){
    try{response.save=await loadPlayer(auth.profile);}catch{}
    if(response.save&&req.headers['x-palace-device']==='1'&&Date.parse(auth.expiresAt)-Date.now()<4*86400000){
     try{
      const expires=new Date(Date.now()+7*86400000).toISOString();
      const renewed=await db(`carnival_sessions?token_hash=eq.${hash(auth.token)}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}`,
       {method:'PATCH',prefer:'return=representation',body:{expires_at:expires}});
      if(renewed?.length)setCookie(res,auth.token);
     }catch{}
    }
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
  const raw=token();await db('carnival_sessions',{method:'POST',body:{token_hash:hash(raw),profile,expires_at:new Date(Date.now()+604800000).toISOString()}});setCookie(res,raw);return reply(res,200,{signedIn:true,profile,offlineProtocol:1,...adventOptions(profile)});
 }catch(error){return reply(res,503,{error:error.message||'Login is unavailable.'});}
}
