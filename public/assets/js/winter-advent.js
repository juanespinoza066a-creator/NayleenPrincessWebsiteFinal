import { DEVICE_MODE, rememberIdentity, rememberedIdentity } from './device-mode.js';
import { winterMusic } from './winter-music.js';
import { OUTFITS, ROOMS, PRIZES, ADVENT_GIFTS, ADVENT_NOTE_DAYS, claimAdvent, adventAvailable } from './game-rules.js';

const LETTER_IMAGE = 'assets/images/advent-letter.webp';

export const ADVENT_YEAR = 2026;
export const ADVENT_DAYS = Array.from({ length: 25 }, (_, i) => i + 1);

function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    if (tag === 'button') element.type = 'button';
    return element;
}

function giftImage(gift) {
    if (!gift?.ready) return '';
    const catalog = gift.kind === 'outfit' ? OUTFITS : gift.kind === 'room' ? ROOMS : PRIZES;
    return catalog.find(item => item.id === gift.id)?.image || '';
}

export function attachAdvent(store) {
    const nav = document.querySelector('header nav');
    if (!nav) return;
    const tab = node('button', 'advent-tab', '❄ Winter 2026');
    nav.append(tab);
    const modal = node('dialog', 'winter-advent');
    modal.setAttribute('aria-label', 'Winter 2026 Advent calendar');
    const close = node('button', 'button soft winter-close', '‹ Palace');
    const music = node('button', 'button soft', '♫ Christmas music on');
    const actions = node('div', 'winter-actions');
    actions.append(close, music);
    const hero = node('div', 'winter-mantel');
    hero.innerHTML = '<span aria-hidden="true">✧ ❄ ✧</span><img src="assets/images/thumbs/outfits/weather-snow.webp" alt="Espurr dressed for a Palace Christmas"><span aria-hidden="true">♡ ❄ ♡</span>';
    const notice = node('p', 'winter-preview');
    const grid = node('div', 'winter-doors');
    const detail = node('section', 'winter-day');
    detail.hidden = true;
    detail.setAttribute('aria-live', 'polite');
    const doors = [];
    const preview = () => store?.profile === 'testing' && store.adventPreview === true;
    const visible = () => store?.ready !== false && (store?.adventEnabled !== false || preview());
    let audio = null;
    let checkingSwitches = false;
    let checkedSwitches = 0;

    async function refreshSwitches() {
        if (!DEVICE_MODE || !store?.ready || navigator.onLine === false ||
            checkingSwitches || Date.now() - checkedSwitches < 60 * 60 * 1000) return;
        checkingSwitches = true;
        checkedSwitches = Date.now();
        try {
            const response = await fetch('content/winter-2026.json', {signal: AbortSignal.timeout(5000)});
            if (!response.ok) return;
            const flags = await response.json();
            if (typeof flags.enabled !== 'boolean' || typeof flags.previewForTesting !== 'boolean') return;
            store.adventEnabled = flags.enabled;
            store.adventPreview = store.profile === 'testing' && flags.previewForTesting;
            const identity = rememberedIdentity();
            if (identity?.profile === store.profile) rememberIdentity({
                ...identity, adventEnabled: store.adventEnabled, adventPreview: store.adventPreview
            });
            updateAccess();
        } catch {
            // Keep the last settings when the connection drops.
        } finally { checkingSwitches = false; }
    }

    async function readAdventNote(day, line) {
        try {
            const response = await fetch('api/advent-note?day=' + day, {cache: 'no-store'});
            if (!response.ok) throw new Error();
            const {message} = await response.json();
            line.textContent = message || 'A note from Juan is being written for this day ♡';
        } catch {
            line.textContent = 'Your note couldn’t open just now. Reopen this door to try again ♡';
        }
    }

    function refreshDoors() {
        const opened = new Set(store?.state?.advent?.days || []);
        for (const { day, button, label, art } of doors) {
            const saved = opened.has(day);
            const locked = !saved && !!store && !adventAvailable(day, preview());
            button.dataset.opened = String(saved);
            if (ADVENT_NOTE_DAYS.includes(day)) button.dataset.letterVisible = String(!locked);
            button.disabled = !!store && store.ready === false;
            const title = saved ? 'Opened' : locked ? 'Opens December ' + day : 'Open';
            label.textContent = saved ? 'Opened ♡' : locked ? 'Locked' : day === 25 ? '✧ Christmas ✧' : 'Open ♡';
            button.setAttribute('aria-label', 'December ' + day + ' · ' + title);
            const thumb = ADVENT_NOTE_DAYS.includes(day) ? (locked ? '' : LETTER_IMAGE) : saved
                ? giftImage(ADVENT_GIFTS[day]).replace('assets/images/', 'assets/images/thumbs/')
                : '';
            if (thumb) {
                if (art.getAttribute('src') !== thumb) art.src = thumb;
            } else art.removeAttribute('src');
        }
    }

    for (const day of ADVENT_DAYS) {
        const button = node('button', 'winter-door' + (day === 25 ? ' christmas-door' : ''));
        const art = node('img');
        art.alt = '';
        const isLetter = ADVENT_NOTE_DAYS.includes(day);
        art.loading = 'lazy';
        art.decoding = 'async';
        const ribbon = node('i', 'winter-ribbon', '୨୧');
        ribbon.setAttribute('aria-hidden', 'true');
        const label = node('span');
        button.append(node('strong', '', String(day)), ribbon, art, label);
        button.onclick = () => {
            audio?.resumeFromGesture();
            const gift = ADVENT_GIFTS[day];
            const saved = store?.state?.advent?.days?.includes(day);
            const eligible = saved || adventAvailable(day, preview());
            let message;
            detail.replaceChildren(node('h2', '', 'December ' + day));
            if (!store) message = 'An empty little door, waiting for its surprise ♡';
            else if (!eligible) message = 'Your surprise opens December ' + day + ' ♡';
            else {
                if (!saved) store.change(state => claimAdvent(state, day, preview()));
                const src = isLetter ? LETTER_IMAGE : giftImage(gift);
                if (src) {
                    const reveal = node('img', 'winter-gift-art');
                    reveal.src = src;
                    reveal.alt = isLetter ? 'Sealed letter' : gift.name;
                    detail.append(reveal);
                    message = isLetter ? 'Opening your note ♡' :
                        saved ? gift.name + ' · Already opened ♡' : gift.name + ' is yours ♡';
                } else message = 'Opening your note ♡';
            }
            const line = node('p', '', message);
            detail.append(line);
            if (store && eligible && ADVENT_NOTE_DAYS.includes(day)) {
                line.style.whiteSpace = 'pre-wrap';
                void readAdventNote(day, line);
            }
            if (eligible && gift?.description && store) detail.append(node('p', '', gift.description));
            const back = node('button', 'button soft', 'Back to the calendar');
            back.onclick = () => { detail.hidden = true; button.focus(); };
            detail.append(back);
            detail.hidden = false;
            refreshDoors();
            detail.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        };
        doors.push({ day, button, label, art });
        grid.append(button);
    }
    modal.append(actions, hero, node('h1', '', 'A little Palace Christmas'),
        node('p', '', 'Winter 2026 · December 1–25'),
        node('p', 'winter-whisper', 'Twenty-five little doors. A whole lot of love.'), notice, detail, grid);
    document.body.append(modal);
    const musicLabel = () => {
        music.textContent = audio?.enabled ? '♫ Christmas music on' : '♫ Christmas music off';
        music.setAttribute('aria-pressed', String(!!audio?.enabled));
    };
    tab.onclick = () => {
        if (!visible()) return;
        void refreshSwitches();
        notice.textContent = preview()
            ? 'Testing only · You can preview every door.'
            : 'December 1–25 · A little surprise each day ♡';
        refreshDoors();
        if (!modal.open) modal.showModal();
        audio?.dispose();
        audio = winterMusic();
        musicLabel();
        audio.start();
    };
    close.onclick = () => modal.close();
    music.onclick = () => { audio?.toggle(); musicLabel(); };
    modal.addEventListener('close', () => {
        audio?.dispose();
        audio = null;
        detail.hidden = true;
        if (location.hash === '#winter-2026') window.history?.replaceState(null, '', location.pathname + location.search);
        tab.focus();
    });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) audio?.stop();
        else {
            void refreshSwitches();
            if (modal.open) { refreshDoors(); audio?.start(); }
        }
    });
    window.addEventListener('pagehide', () => audio?.dispose());
    const fromHash = () => { if (location.hash === '#winter-2026' && !modal.open && visible()) tab.click(); };
    const updateAccess = () => {
        tab.hidden = !visible();
        if (modal.open && tab.hidden) modal.close();
        else if (modal.open) refreshDoors();
        else fromHash();
    };
    store?.subscribe?.(() => { updateAccess(); void refreshSwitches(); });
    window.addEventListener('online', () => void refreshSwitches());
    window.addEventListener('hashchange', fromHash);
    refreshDoors();
    updateAccess();
    return { tab, modal };
}
