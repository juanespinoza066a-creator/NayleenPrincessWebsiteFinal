import { UPGRADES, OUTFITS, passiveRate, tapPower, upgradeCost, buyUpgrade, addCrunches } from './game-rules.js';
import { loadContent, text as t } from './content-loader.js';
import { createCrunchBuffer } from './peanut-audio.js';
import { CarnivalStore } from './save-manager.js';
const $ = id => document.getElementById(id), store = new CarnivalStore(), format = n => Math.floor(n).toLocaleString();
await loadContent();
let audio, buffer, sound = true, combo = 0, lastTap = 0, toastTimer;
try {
    sound = localStorage.getItem('nayleen-peanut-sound') !== 'off';
}
catch { }
function soundLabel() { $('sound-toggle').textContent = sound ? 'Sound on ♪' : 'Sound off'; $('sound-toggle').setAttribute('aria-pressed', String(sound)); }
soundLabel();
$('sound-toggle').onclick = () => { sound = !sound; soundLabel(); try {
    localStorage.setItem('nayleen-peanut-sound', sound ? 'on' : 'off');
}
catch { } };
function crunchSound() {
    if (!sound)
        return;
    try {
        const Audio = window.AudioContext || window.webkitAudioContext;
        audio ||= new Audio();
        if (audio.state === 'suspended')
            void audio.resume();
        buffer = createCrunchBuffer(audio);
        const source = audio.createBufferSource(), lowpass = audio.createBiquadFilter(), gain = audio.createGain(), compressor = audio.createDynamicsCompressor();
        source.buffer = buffer;
        source.playbackRate.value = .96 + Math.random() * .08;
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 9000;
        gain.gain.value = .48;
        compressor.threshold.value = -17;
        compressor.ratio.value = 3;
        source.connect(lowpass);
        lowpass.connect(gain);
        gain.connect(compressor);
        compressor.connect(audio.destination);
        source.start();
    }
    catch { }
}
const upgradeButtons = new Map();
UPGRADES.forEach(u => {
    const b = document.createElement('button');
    b.className = 'upgrade-buy';
    b.disabled = true;
    const icon = document.createElement('span');
    icon.className = 'upgrade-symbol';
    icon.textContent = u.icon;
    icon.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('span');
    copy.className = 'upgrade-copy';
    const name = document.createElement('strong');
    name.textContent = u.name;
    const detail = document.createElement('small');
    detail.textContent = u.detail;
    copy.append(name, detail);
    const price = document.createElement('span');
    price.className = 'upgrade-price';
    const cost = document.createElement('strong'), owned = document.createElement('small');
    price.append(cost, owned);
    b.append(icon, copy, price);
    b.onclick = () => store.change(s => { buyUpgrade(s, u.id); });
    $('upgrades').append(b);
    upgradeButtons.set(u.id, { b, cost, owned });
});
store.subscribe((s, event) => {
    $('crunch-balance').textContent = format(s.clicker.balance);
    $('tap-rate').textContent = `${tapPower(s)} per squish`;
    $('auto-rate').textContent = `${passiveRate(s)} every second`;
    $('lifetime-crunches').textContent = `${format(s.clicker.lifetime)} lifetime crunches`;
    $('factory-save-status').textContent = event.status || store.status;
    $('crunch-button').disabled = !store.ready;
    UPGRADES.forEach(u => { const { b, cost, owned } = upgradeButtons.get(u.id), price = upgradeCost(s, u.id); cost.textContent = s.clicker.upgrades[u.id] >= 50 ? 'Maxed out ♡' : `${format(price)} crunches`; owned.textContent = `${s.clicker.upgrades[u.id]} owned`; b.disabled = !store.ready || s.clicker.balance < price || s.clicker.upgrades[u.id] >= 50; });
    $('cozy-progress').value = Math.min(500, s.clicker.lifetime);
    $('star-progress').value = Math.min(1000, s.clicker.lifetime);
    $('cozy-goal').textContent = t(s.clicker.lifetime >= 500 ? 'peanut.cozyDone' : 'peanut.cozyGoal');
    $('star-goal').textContent = t(s.clicker.lifetime >= 1000 ? 'peanut.masteryDone' : 'peanut.mastery');
    if (event.offlineEarnings >= 1) {
        $('offline-earnings').hidden = false;
        $('offline-earnings').textContent = `Your little helpers made ${format(event.offlineEarnings)} crunches while you were away!`;
    }
    $('espurr-encouragement').textContent = t(s.clicker.lifetime >= 1000 ? 'peanut.proud' : passiveRate(s) > 0 ? 'peanut.working' : 'peanut.encouragement');
    if (event.unlocked?.length) {
        $('factory-toast').textContent = `New outfit! ${event.unlocked.map(id => OUTFITS.find(o => o.id === id).name).join(' · ')}. Try it on back in Espurr’s room. ♡`;
        $('factory-toast').hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { $('factory-toast').hidden = true; }, 6500);
    }
});
$('crunch-button').onclick = () => {
    const now = performance.now();
    combo = now - lastTap < 800 ? combo + 1 : 1;
    lastTap = now;
    let amount = tapPower(store.state);
    const bonus = combo % 10 === 0 ? 10 : 0;
    amount += bonus;
    store.change(s => { s.clicker.manual++; addCrunches(s, amount); });
    $('combo-copy').textContent = t(bonus ? 'peanut.bonus' : 'peanut.combo', { count: combo, left: 10 - combo % 10 });
    const shell = $('crunch-button');
    shell.animate([{ transform: 'scale(1.22,.76) rotate(-3deg)' }, { transform: 'scale(.94,1.06)' }, { transform: 'scale(1)' }], { duration: 220 });
    const particle = document.createElement('span');
    particle.className = 'crunch-particle';
    particle.textContent = `+${amount}`;
    particle.style.setProperty('--drift', `${Math.random() * 80 - 40}px`);
    $('crunch-particles').append(particle);
    setTimeout(() => particle.remove(), 850);
    crunchSound();
};
void store.load();
