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
  const recipes={butter:[130,55,.30,'triangle'],gel:[400,110,.24,'sine'],meep:[520,760,.15,'triangle'],puff:[180,65,.25,'sine'],pop:[800,90,.12,'sine'],chime:[880,1320,.30,'sine']};
  const [from,to,duration,wave]=recipes[kind]||recipes.gel;
  tone(from,to,at,duration,wave,output);
  if(kind==='meep')tone(700,350,at+.12,.12,'sine',output);
  if(kind==='chime')tone(1320,1760,at+.10,.32,'sine',output);
  if(['butter','puff'].includes(kind)){
   const b=audio.createBuffer(1,Math.floor(audio.sampleRate*.18),audio.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2)*.3;
   const src=audio.createBufferSource(),filter=audio.createBiquadFilter();filter.type='lowpass';filter.frequency.value=kind==='puff'?800:380;src.buffer=b;src.connect(filter);filter.connect(output);src.start(at);src.onended=()=>{src.disconnect();filter.disconnect()};
  }
  setTimeout(()=>output.disconnect(),900);
 }catch{}
}
function tone(from,to,at,duration,wave,output){const o=audio.createOscillator(),g=audio.createGain();o.type=wave;o.frequency.setValueAtTime(from,at);o.frequency.exponentialRampToValueAtTime(to,at+duration);g.gain.setValueAtTime(.001,at);g.gain.exponentialRampToValueAtTime(.5,at+.015);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g);g.connect(output);o.start(at);o.stop(at+duration+.02);o.onended=()=>{o.disconnect();g.disconnect()};}
