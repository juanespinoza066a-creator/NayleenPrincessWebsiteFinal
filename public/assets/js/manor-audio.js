// Original synthesized music and effects: no downloads or third-party music.
(() => {
    const $ = id => document.getElementById(id);
    let audio, musicBus, effectsBus, music = true, effects = true;
    let noteClock = 0, beat = 0, stepClock = 0, decodeClock = 0, heartClock = 0;
    try { music = localStorage.getItem('manor-music') !== 'off'; effects = localStorage.getItem('manor-effects') !== 'off'; } catch {}
    function labels() {
        $('maze-music').textContent = music ? '♫ Music on' : '♫ Music off';
        $('maze-music').setAttribute('aria-pressed', String(music));
        $('maze-sfx').textContent = effects ? '♪ Effects on' : '♪ Effects off';
        $('maze-sfx').setAttribute('aria-pressed', String(effects));
    }
    function unlock() {
        try {
            const Audio = window.AudioContext || window.webkitAudioContext;
            if (!Audio) return;
            if (!audio) {
                audio = new Audio(); musicBus = audio.createGain(); effectsBus = audio.createGain();
                musicBus.gain.value = 0; effectsBus.gain.value = effects ? .32 : 0;
                musicBus.connect(audio.destination); effectsBus.connect(audio.destination);
            }
            void audio.resume().catch(() => {});
        } catch {}
    }
    function tone(hz, duration, bus, volume = .12, type = 'sine', offset = 0, endHz) {
        if (!audio || audio.state !== 'running') return;
        const at = audio.currentTime + offset, oscillator = audio.createOscillator(), gain = audio.createGain();
        oscillator.type = type; oscillator.frequency.setValueAtTime(hz, at);
        if (endHz) oscillator.frequency.exponentialRampToValueAtTime(endHz, at + duration);
        gain.gain.setValueAtTime(0, at); gain.gain.linearRampToValueAtTime(volume, at + .012);
        gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
        oscillator.connect(gain); gain.connect(bus); oscillator.start(at); oscillator.stop(at + duration + .02);
        oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    }
    function noise(duration, frequency, volume) {
        if (!audio || audio.state !== 'running') return;
        const buffer = audio.createBuffer(1, Math.ceil(audio.sampleRate * duration), audio.sampleRate);
        const samples = buffer.getChannelData(0);
        for (let i = 0; i < samples.length; i++) samples[i] = (Math.random() * 2 - 1) * (1 - i / samples.length) ** 2;
        const source = audio.createBufferSource(), filter = audio.createBiquadFilter(), gain = audio.createGain();
        source.buffer = buffer; filter.type = 'lowpass'; filter.frequency.value = frequency; gain.gain.value = volume;
        source.connect(filter); filter.connect(gain); gain.connect(effectsBus); source.start();
        source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
    }
    function effect(kind) {
        if (!audio || !effects || document.hidden) return;
        const sound = (hz, d, v = .16, type = 'sine', offset = 0, end) => tone(hz,d,effectsBus,v,type,offset,end);
        if (kind === 'step') noise(.07, 650, .13);
        else if (kind === 'decode') sound(460,.045,.05,'triangle');
        else if (kind === 'warning') { sound(660,.12); sound(880,.15,.16,'sine',.16); }
        else if (kind === 'miss' || kind === 'hit' || kind === 'lose') { noise(.3,1300,.3); sound(180,.45,.3,'triangle',0,65); }
        else if (kind === 'pallet') { noise(.3,900,.65); sound(100,.2,.2,'triangle',0,45); }
        else if (kind === 'stun') { sound(180,.55,.2,'sine',0,1100); sound(720,.7,.13,'triangle',.1); }
        else if (kind === 'heart') { sound(65,.13,.3); sound(55,.16,.2,'sine',.18); }
        else { const notes = kind === 'win' ? [392,494,587,784] : [523,659,784]; notes.forEach((hz,i)=>sound(hz,.45,.18,'sine',i*.12)); }
    }
    const melody = [0,7,12,10,7,3,5,7,0,7,15,12,10,7,5,3];
    function update(dt, scene) {
        if (!audio) return;
        const active = scene.playing && !document.hidden;
        musicBus.gain.setTargetAtTime(active && music ? .28 : 0,audio.currentTime,.12);
        effectsBus.gain.setTargetAtTime(active && effects ? .32 : 0,audio.currentTime,.04);
        if (!active || audio.state !== 'running') return;
        noteClock -= dt;
        if (noteClock <= 0) {
            noteClock = scene.chase ? .4 : .65;
            if (music) {
                const root = [146.83,130.81,174.61,130.81][Math.floor(beat / 8) % 4];
                tone(root * 2 ** (melody[beat % 16]/12), .9, musicBus, .13,'sine');
                if (beat % 4 === 0) { tone(root/2,2,musicBus,.13,'triangle'); tone(root*1.5,1.8,musicBus,.055); }
            }
            beat++;
        }
        stepClock -= dt; decodeClock -= dt; heartClock -= dt;
        if (scene.moving && stepClock <= 0) { effect('step'); stepClock = .33; }
        if (scene.decoding && decodeClock <= 0) { effect('decode'); decodeClock = .42; }
        if (scene.chase && heartClock <= 0) { effect('heart'); heartClock = .9; }
    }
    for (const [id,key] of [['maze-music','music'],['maze-sfx','effects']]) $(id).addEventListener('click',()=>{
        unlock(); if(key==='music') music=!music; else effects=!effects;
        try { localStorage.setItem('manor-'+key,(key==='music'?music:effects)?'on':'off'); } catch {}
        labels();
    });
    document.addEventListener('visibilitychange',()=>{ if(document.hidden && audio) void audio.suspend().catch(()=>{}); });
    window.ManorAudio = {unlock,update,effect}; labels();
})();
