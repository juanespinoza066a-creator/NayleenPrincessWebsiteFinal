import {readFile} from 'node:fs/promises';
import {session,reply} from '../server/common.js';
import {weekNumber} from '../server/game-rules.js';
export default async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Cookie');
 if(req.method!=='GET')return reply(res,405,{error:'Method not allowed.'});
 try{if(!await session(req))return reply(res,401,{error:'Sign in to read your notes.'});
 const data=JSON.parse(await readFile(new URL('../server/weekly-notes.json',import.meta.url),'utf8'));
 return reply(res,200,{startDate:data.startDate,notes:data.notes.filter(n=>n.published===true&&n.week<=weekNumber())});
 }catch{return reply(res,503,{error:'The notes could not load.'});}}
