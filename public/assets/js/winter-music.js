// Pre-rendered, locally hosted arrangement: no live oscillator/timer loop.
export function winterMusic(){let audio=null,muted=false;try{muted=localStorage.getItem('palace-winter-music')==='off';}catch{}
 const start=()=>{if(muted||document.hidden)return;try{audio??=new Audio('assets/audio/palace-winter-waltz.mp3');audio.loop=true;audio.preload='none';audio.volume=.42;const p=audio.play();p?.catch(()=>{});}catch{}};
 const stop=()=>audio?.pause();return{get enabled(){return !muted;},start,stop,resumeFromGesture:start,toggle(){muted=!muted;try{localStorage.setItem('palace-winter-music',muted?'off':'on');}catch{}if(muted)stop();else start();return !muted;},dispose(){stop();if(audio){audio.removeAttribute('src');audio.load();audio=null;}}};
}
