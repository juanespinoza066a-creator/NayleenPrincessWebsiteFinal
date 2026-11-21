// Bounded, profile-owned native data. Audio files remain in the music catalog.
const bytes=v=>new TextEncoder().encode(JSON.stringify(v)).length;
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const str=(v,n)=>typeof v==='string'&&v.length<=n;
export const COMPANION_PARTS=['notes','calendar','music','settings'];
export function validPart(key,v){
 if(key==='notes')return Array.isArray(v)&&v.length<=100&&v.every(n=>obj(n)&&str(n.id,100)&&str(n.text,500)&&typeof n.done==='boolean')&&new Set(v.map(n=>n.id)).size===v.length&&bytes(v)<=65000;
 if(key==='calendar')return Array.isArray(v)&&v.length<=100&&new Set(v.map(n=>n.id)).size===v.length&&bytes(v)<=30000&&v.every(n=>{if(!obj(n)||!/^personal-[a-zA-Z0-9-]{1,60}$/.test(n.id)||!str(n.title,80)||!n.title.trim()||typeof n.notify!=='boolean')return false;const y=n.year??2000;if(!Number.isInteger(y)||y<1900||y>2200||!Number.isInteger(n.month)||!Number.isInteger(n.day))return false;const d=new Date(Date.UTC(y,n.month-1,n.day));return d.getUTCFullYear()===y&&d.getUTCMonth()===n.month-1&&d.getUTCDate()===n.day;});
 if(key==='music')return obj(v)&&str(v.selected,120)&&Array.isArray(v.playlists)&&v.playlists.length<=20&&new Set(v.playlists.map(p=>p.id)).size===v.playlists.length&&v.playlists.every(p=>obj(p)&&str(p.id,80)&&str(p.name,50)&&p.name.trim()&&Array.isArray(p.trackIds)&&p.trackIds.length<=300&&p.trackIds.every(id=>str(id,100)))&&bytes(v)<=50000;
 if(key==='settings')return obj(v)&&Object.keys(v).every(k=>['weatherPlace','widgetTab','sound','vibration','celsius'].includes(k))&&bytes(v)<=5000&&(!v.weatherPlace||obj(v.weatherPlace)&&str(v.weatherPlace.name,100)&&Number.isFinite(v.weatherPlace.lat)&&Math.abs(v.weatherPlace.lat)<=90&&Number.isFinite(v.weatherPlace.lon)&&Math.abs(v.weatherPlace.lon)<=180)&&(!v.widgetTab||['room','calendar','notes','weather','music'].includes(v.widgetTab))&&['sound','vibration','celsius'].every(k=>v[k]===undefined||typeof v[k]==='boolean');
 return false;
}
export function cleanCompanion(raw){const out={version:1,epoch:Number.isSafeInteger(raw?.epoch)&&raw.epoch>=0?raw.epoch:0};for(const key of COMPANION_PARTS){const part=raw?.[key],fallback=key==='music'?{playlists:[],selected:'all'}:key==='settings'?{}:[];out[key]={revision:Number.isSafeInteger(part?.revision)&&part.revision>=0?part.revision:0,value:validPart(key,part?.value)?structuredClone(part.value):fallback};}return out;}
export function validCompanion(raw){return obj(raw)&&raw.version===1&&Number.isSafeInteger(raw.epoch)&&raw.epoch>=0&&COMPANION_PARTS.every(key=>obj(raw[key])&&Number.isSafeInteger(raw[key].revision)&&raw[key].revision>=0&&validPart(key,raw[key].value));}
