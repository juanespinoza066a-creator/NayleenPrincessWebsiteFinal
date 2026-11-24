import {readUpdates} from './content-loader.js';
// Editable sayings are in server/espurr-lines.json.
export async function attachEspurr(){
 let lines;try{lines=(await readUpdates()).espurrLines;}catch{return;}if(!lines)return;
 const doll=document.getElementById('espurr-doll'),room=document.querySelector('.espurr-room');if(!doll||!room)return;const speech=document.createElement('p');speech.className='espurr-thought';speech.setAttribute('role','status');room.after(speech);let lastPet=0;
 const say=key=>{const a=lines[key]||lines.thoughts||[];if(a.length)speech.textContent=a[(Math.floor(Date.now()/14400000)+Math.floor(Date.now()/86400000))%a.length];};
 const update=()=>{
  const hour=new Date().getHours();
  const sleeping=hour>=2&&hour<10;
  say(sleeping?'sleep':hour===12?'noon':hour<12?'morning':hour<18?'thoughts':'evening');
  doll.classList.toggle('espurr-napping',sleeping||hour===12);
 };
 update();setInterval(update,60000);doll.tabIndex=0;doll.setAttribute('role','button');doll.setAttribute('aria-label','Give Espurr a headpat');const pet=()=>{if(Date.now()-lastPet<3000)return;lastPet=Date.now();say('headpats');doll.classList.remove('espurr-petted');void doll.offsetWidth;};doll.onclick=pet;doll.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pet();}};
}
