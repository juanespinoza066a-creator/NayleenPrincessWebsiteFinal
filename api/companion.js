import {db,reply,sameOrigin,body,session} from '../server/common.js';
import {dayKey} from '../server/game-rules.js';
import {COMPANION_PARTS,validPart,cleanCompanion} from '../server/companion-model.js';
export default async function handler(req,res){try{
 if(!['GET','PUT','POST'].includes(req.method))return reply(res,405,{error:'Method not allowed.'});
 if(req.method!=='GET'&&!sameOrigin(req))return reply(res,403,{error:'Open your Palace to save.'});
 const auth=await session(req);if(!auth)return reply(res,401,{error:'Open your room and sign in to save your lovely things ♡'});
 const expected=req.headers['x-palace-profile'];
 if(expected!==undefined&&expected!==auth.profile)return reply(res,409,{error:'The signed-in Palace changed. Reopen your room before syncing.'});
 if(req.method==='GET'){const rows=await db(`carnival_saves?profile=eq.${auth.profile}&select=state&limit=1`);return reply(res,200,{profile:auth.profile,companion:cleanCompanion(rows[0]?.state?.companion)});}
 const d=await body(req);if(req.method==='POST'){if(d.action!=='login')return reply(res,400,{error:'Please open your room again.'});await db('rpc/carnival_login_day',{method:'POST',body:{p_profile:auth.profile,p_day:dayKey()}});return reply(res,200,{profile:auth.profile,saved:true});}if(!COMPANION_PARTS.includes(d.part)||!validPart(d.part,d.value)||!Number.isSafeInteger(d.revision)||d.revision<0||!Number.isSafeInteger(d.epoch)||d.epoch<0)return reply(res,400,{error:'This change is too large or could not be saved.'});
 const rows=await db('rpc/carnival_write_companion',{method:'POST',body:{p_profile:auth.profile,p_part:d.part,p_value:d.value,p_revision:d.revision,p_epoch:d.epoch}});
 if(!rows?.length)return reply(res,409,{error:'A newer copy is saved. Your phone keeps its changes until it can sync.'});
 return reply(res,200,{profile:auth.profile,companion:cleanCompanion(rows[0].companion)});
}catch(e){return reply(res,503,{error:'Your changes are safe on this phone. We’ll try saving again soon ♡'});}}
