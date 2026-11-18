// Gift-paper crackle followed by a little music-box reveal. Starts only after a tap.
let audio;
export function playBoxSound() {
 try { const Audio = window.AudioContext || window.webkitAudioContext; if(!Audio)return;
 audio ??= new Audio(); void audio.resume(); const t=audio.currentTime;
 const buffer=audio.createBuffer(1,audio.sampleRate*.28,audio.sampleRate),data=buffer.getChannelData(0);
 for(let i=0;i<data.length;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/data.length*9)*(.4+.6*Math.max(0,Math.sin(i*.17)));
 const noise=audio.createBufferSource(), filter=audio.createBiquadFilter(), gain=audio.createGain();noise.buffer=buffer;filter.type='highpass';filter.frequency.value=1600;gain.gain.value=.16;noise.connect(filter).connect(gain).connect(audio.destination);noise.start(t);
 [659.25,830.61,987.77,1318.51].forEach((hz,i)=>{const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=hz;g.gain.setValueAtTime(0,t+.15+i*.09);g.gain.linearRampToValueAtTime(.055,t+.17+i*.09);g.gain.exponentialRampToValueAtTime(.0001,t+.85+i*.09);o.connect(g).connect(audio.destination);o.start(t+.15+i*.09);o.stop(t+.9+i*.09);});
 }catch{} }
