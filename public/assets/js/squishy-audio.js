import {createCrunchBuffer} from './peanut-audio.js';
let audio,crunch;
export function playSquish(kind,enabled=true,celebrate=false){
 if(!enabled)return;
 try{
  audio??=new(window.AudioContext||window.webkitAudioContext)();void audio.resume();
  const at=audio.currentTime,output=audio.createGain();output.gain.value=.24;output.connect(audio.destination);
  if(celebrate){[523,659,784,1047].forEach((hz,i)=>tone(hz,hz,at+i*.085,.18,'sine',output));setTimeout(()=>output.disconnect(),1000);return;}
  if(kind==='crunch'){
   crunch??=createCrunchBuffer(audio);const src=audio.createBufferSource();src.buffer=crunch;src.playbackRate.value=.94+Math.random()*.12;src.connect(output);src.start(at);src.onended=()=>{src.disconnect();output.disconnect()};return;
  }
  output.disconnect();
  const sounds={butter:[589561,1.1],gel:[589540,1.1],meep:[589612,1.18],puff:[589557,1.12],pop:[589614,1.12],chime:[589540,.86]};
  const [id,rate]=sounds[kind]||sounds.gel;
  void recorded(id,rate);

 }catch{}
}
function tone(from,to,at,duration,wave,output){const o=audio.createOscillator(),g=audio.createGain();o.type=wave;o.frequency.setValueAtTime(from,at);o.frequency.exponentialRampToValueAtTime(to,at+duration);g.gain.setValueAtTime(.001,at);g.gain.exponentialRampToValueAtTime(.5,at+.015);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g);g.connect(output);o.start(at);o.stop(at+duration+.02);o.onended=()=>{o.disconnect();g.disconnect()};}

const fileCache=new Map(),decoded=new Map(),playing=[];
function bytes(id){if(!fileCache.has(id))fileCache.set(id,fetch(new URL('../audio/squishies/'+id+'.mp3',import.meta.url)).then(r=>{if(!r.ok)throw Error('Sound unavailable');return r.arrayBuffer()}));return fileCache.get(id);}
// Actual rubber/stress-toy foley, not a generated air/noise layer. Peanut remains original.
async function recorded(id,rate){try{
 if(!decoded.has(id))decoded.set(id,bytes(id).then(b=>audio.decodeAudioData(b.slice(0))));
 const buffer=await decoded.get(id),src=audio.createBufferSource(),gain=audio.createGain();src.buffer=buffer;src.playbackRate.value=rate*(.98+Math.random()*.04);gain.gain.value=.5;src.connect(gain);gain.connect(audio.destination);
 while(playing.length>=6){try{playing.shift().stop()}catch{}}
 playing.push(src);src.start();src.onended=()=>{const i=playing.indexOf(src);if(i>=0)playing.splice(i,1);src.disconnect();gain.disconnect()};
 }catch{ /* No windy fallback. The next tap can retry a failed file. */ decoded.delete(id);fileCache.delete(id);}}
for(const id of [589540,589612,589561,589614,589557])void bytes(id).catch(()=>fileCache.delete(id));
