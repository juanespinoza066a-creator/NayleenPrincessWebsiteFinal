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
  // Wet filtered air, rubber friction and release pops instead of melodic beeps.
  const recipes={butter:[280,700,.42],gel:[1600,350,.36],meep:[950,2800,.28],puff:[380,1200,.55],pop:[2400,500,.24],chime:[500,1700,.46]};
  const [start,end,duration]=recipes[kind]||recipes.gel;
  const buffer=audio.createBuffer(1,Math.floor(audio.sampleRate*duration),audio.sampleRate),data=buffer.getChannelData(0);
  let smooth=0;for(let i=0;i<data.length;i++){smooth=.78*smooth+.22*(Math.random()*2-1);const phase=i/data.length;data[i]=smooth*Math.sin(Math.PI*phase)*(kind==='puff'?.9:1.8)*(1+.35*Math.sin(phase*65));}
  const src=audio.createBufferSource(),filter=audio.createBiquadFilter();src.buffer=buffer;filter.type='bandpass';filter.Q.value=kind==='gel'?5:1.5;filter.frequency.setValueAtTime(start,at);filter.frequency.exponentialRampToValueAtTime(end,at+duration);src.connect(filter);filter.connect(output);src.start(at);src.onended=()=>{src.disconnect();filter.disconnect()};
  if(['gel','pop','meep'].includes(kind))tone(kind==='meep'?290:160,45,at+duration*.65,.10,'sine',output);
  setTimeout(()=>output.disconnect(),900);
 }catch{}
}
function tone(from,to,at,duration,wave,output){const o=audio.createOscillator(),g=audio.createGain();o.type=wave;o.frequency.setValueAtTime(from,at);o.frequency.exponentialRampToValueAtTime(to,at+duration);g.gain.setValueAtTime(.001,at);g.gain.exponentialRampToValueAtTime(.5,at+.015);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g);g.connect(output);o.start(at);o.stop(at+duration+.02);o.onended=()=>{o.disconnect();g.disconnect()};}
