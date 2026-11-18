import { freshState, testingState, PRIZES, OUTFITS, unlockedOutfits, weekNumber, startBox, revealBox, handTotal, validState, normalizeState } from './game-rules.js';
import { CarnivalStore, STATIC, downloadJSON } from './save-manager.js';
import { loadContent, text as t, readNotes } from './content-loader.js';
import { playBoxSound } from './box-audio.js';
const $ = id => document.getElementById(id), store = new CarnivalStore(), prize = id => PRIZES.find(p => p.id === id);
const dialog = $('game-dialog'), body = $('game-body'), result = $('game-result');
let roomSignature = '', toastTimer;
function el(tag, text, className) { const n = document.createElement(tag); if (text !== undefined)
    n.textContent = text; if (className)
    n.className = className; return n; }
function image(item, className = 'collectible-image') { const img = el('img', undefined, className); img.src = item.image; img.alt = item.name; img.loading = 'lazy'; return img; }
function button(text, fn, parent = body) { const b = el('button', text, 'button'); b.onclick = fn; parent.append(b); return b; }
function p(text) { const n = el('p', text, 'rules'); body.append(n); return n; }
function actions() { const n = el('div', undefined, 'game-actions'); body.append(n); return n; }
function open(title) { $('game-title').textContent = title; body.replaceChildren(); result.textContent = ''; if (!dialog.open)
    dialog.showModal(); }
function close() { dialog.close(); }
$('game-close').onclick = close;
function render(s, event = {}) {
    $('save-status').textContent = event.status || store.status;
    $('sync-retry').hidden = STATIC || (!store.conflict && (store.online && !store.dirty || !store.ready));
    const week = weekNumber(), pending = s.weeklyBox && !s.weeklyBox.revealed, claimed = s.weeklyClaims.includes(week);
    $('weekly-label').textContent = t('weekly.eyebrow', { week: String(pending ? s.weeklyBox.week : week).padStart(2, '0') });
    $('weekly-copy').textContent = t(pending ? 'weekly.resumeCopy' : claimed ? 'weekly.doneCopy' : 'weekly.intro');
    $('weekly-box').disabled = $('blind-open').disabled = !store.ready || claimed && !pending;
    $('weekly-box').textContent = t(pending ? 'weekly.resume' : claimed ? 'weekly.done' : 'weekly.open');
    $('blind-action').textContent = t(pending ? 'weekly.resume' : claimed ? 'weekly.done' : 'games.blind.action');
    $('cards-open').disabled = !store.ready;
    $('test-reset').disabled = $('test-unlock').disabled = !store.ready;
    $('manor-availability').textContent = s.manorRun?.status === 'active' ? 'Resume your weekly run →' : s.mazeWeeks.includes(week) ? 'This week’s run is complete ♡' : t('games.manor.action');
    const unlocked = unlockedOutfits(s), signature = JSON.stringify([s.prizes, s.shelf, s.outfit, unlocked, store.ready]);
    if (signature !== roomSignature) {
        roomSignature = signature;
        const outfit = OUTFITS.find(o => o.id === s.outfit) || OUTFITS[0];
        $('espurr-portrait').src = outfit.image || OUTFITS[0].image;
        $('espurr-portrait').alt = `Princess Espurr · ${outfit.name}`;
        $('outfit-caption').textContent = outfit.name;
        $('outfit-count').textContent = t('wardrobe.count', { owned: unlocked.length, total: OUTFITS.length });
        $('prize-count').textContent = t('collection.count', { count: s.prizes.length });
        $('collection-total').textContent = `${s.prizes.length} / ${PRIZES.length}`;
        $('stage-shelves').replaceChildren(...s.shelf.map((id, index) => { const b = el('button', id ? undefined : '+', 'stage-slot'); if (id)
            b.append(image(prize(id))); b.setAttribute('aria-label', `Decorate shelf ${index + 1}${id ? `, ${prize(id).name}` : ''}`); b.disabled = !store.ready; b.onclick = () => decorate(index); return b; }));
        $('outfits').replaceChildren(...OUTFITS.map(o => { const owned = unlocked.includes(o.id), b = el('button', undefined, `outfit${s.outfit === o.id ? ' equipped' : ''}${owned ? '' : ' locked'}`); const thumbnail = o.image ? image(o, 'outfit-thumbnail') : el('span', o.icon, 'outfit-icon'); b.append(thumbnail, el('strong', o.name), el('small', owned && !o.image ? t('wardrobe.pending') : s.outfit === o.id ? t('wardrobe.wearing') : owned ? t('wardrobe.wear') : o.hint)); b.disabled = !store.ready || !owned || !o.image; b.setAttribute('aria-pressed', String(s.outfit === o.id)); b.onclick = () => store.change(s => { s.outfit = o.id; }); return b; }));
        $('collection').replaceChildren(...PRIZES.map(item => { const card = el('div', undefined, `inventory-item${s.prizes.includes(item.id) ? '' : ' locked'}`); card.append(image(item), el('span', item.name)); if (!s.prizes.includes(item.id)) {
            const lock = el('small', 'Not found yet');
            card.append(lock);
        } return card; }));
    }
    if (event.unlocked?.length) {
        $('unlock-toast').textContent = t('wardrobe.unlock', { names: event.unlocked.map(id => OUTFITS.find(o => o.id === id).name).join(' · ') });
        $('unlock-toast').hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { $('unlock-toast').hidden = true; }, 6500);
    }
}
function decorate(index) { open(t('collection.choose')); p(t('collection.chooseIntro')); if (!store.state.prizes.length)
    p(t('collection.empty')); const row = actions(); store.state.prizes.forEach(id => { const item = prize(id), b = button('', () => { store.change(s => { s.shelf[index] = id; }); close(); }, row); b.classList.add('soft', 'prize-choice'); b.append(image(item), el('small', item.name)); b.setAttribute('aria-label', `Place ${item.name}`); }); button(t('collection.clear'), () => { store.change(s => { s.shelf[index] = null; }); close(); }).classList.add('soft'); }
function blind() {
    let box;
    store.change(s => { box = startBox(s, weekNumber()); });
    if (!box)
        return;
    open(t('games.blind.title'));
    p(t('games.blind.rules'));
    const cube = el('div', '?', 'blind-cube');
    body.append(cube);
    const clue = el('p', t('games.blind.initial'), 'blind-clue');
    body.append(clue);
    let shakes = 0, unwrapped = false, finished = false;
    const row = actions();
    const shake = button(t('games.blind.shake'), () => { if (finished)
        return; shakes++; cube.animate([{ transform: 'rotate(-10deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(0)' }], { duration: 450, iterations: 2 }); clue.textContent = t('games.blind.shaken'); shake.textContent = t('games.blind.shakeAgain'); unwrap.disabled = false; }, row);
    const unwrap = button(t('games.blind.unwrap'), () => {
        if (finished)
            return;
        if (!unwrapped) {
            unwrapped = true;
            cube.textContent = '🎀';
            clue.textContent = t('games.blind.ribbon');
            unwrap.textContent = t('games.blind.reveal');
            return;
        }
        let reward;
        store.change(s => { reward = revealBox(s); });
        if (!reward)
            return;
        finished = true;
        playBoxSound();
        const item = prize(reward.id);
        cube.replaceChildren(image(item));
        cube.classList.add('revealed');
        clue.textContent = item.name;
        result.textContent = t(reward.isNew ? 'games.blind.new' : 'games.blind.duplicate', { name: item.name });
        shake.remove();
        unwrap.remove();
        button('Back to Espurr ♡', close);
    }, row);
    unwrap.disabled = true;
}
$('blind-open').onclick = blind;
$('weekly-box').onclick = blind;
function cards() {
    open(t('games.cards.title'));
    p(t('games.cards.rules'));
    const score = p('');
    score.classList.add('table-bank');
    const select = el('select');
    select.setAttribute('aria-label', t('games.cards.bet'));
    [5, 10, 20, 50].forEach(n => { const o = el('option', `${n} pretend chips`); o.value = n; select.append(o); });
    body.append(select);
    const table = el('div', undefined, 'card-table');
    body.append(table);
    const dealerTitle = el('h3', t('games.cards.dealer')), dealerRow = el('div', undefined, 'card-hand'), dealerScore = el('p', '', 'card-score'), yourTitle = el('h3', t('games.cards.player')), yourRow = el('div', undefined, 'card-hand'), yourScore = el('p', '', 'card-score');
    table.append(dealerTitle, dealerRow, dealerScore, yourTitle, yourRow, yourScore);
    const row = actions();
    let deck = [], hand = [], dealer = [], active = false, wager = 0;
    function paint() { const card = (c, hidden = false) => el('span', hidden ? '♛' : `${({ 1: 'A', 11: 'J', 12: 'Q', 13: 'K' })[c.rank] || c.rank}${c.suit}`, 'playing-card' + (hidden ? ' back' : ['♥', '♦'].includes(c.suit) ? ' red' : '')); dealerRow.replaceChildren(...dealer.map((c, i) => card(c, active && i > 0))); yourRow.replaceChildren(...hand.map(c => card(c))); dealerScore.textContent = dealer.length ? (active ? 'One card is still a secret' : `${handTotal(dealer)} points`) : ''; yourScore.textContent = hand.length ? `${handTotal(hand)} points · ${wager} on the table` : ''; score.textContent = t('games.cards.bank', { score: store.state.chips, best: store.state.stats.bestBank }); deal.disabled = active || store.state.chips < Number(select.value); select.disabled = active; hit.disabled = stand.disabled = !active; double.disabled = !active || hand.length !== 2 || store.state.chips < wager * 2; reset.disabled = active; }
    function finish() { if (!active)
        return; active = false; const yours = handTotal(hand), theirs = handTotal(dealer), win = yours <= 21 && (theirs > 21 || yours > theirs), tie = yours <= 21 && yours === theirs; store.change(s => { s.chips = Math.max(0, Math.min(1e6, s.chips + (win ? wager : tie ? 0 : -wager))); s.stats.bestBank = Math.max(s.stats.bestBank, s.chips); s.stats.rounds++; if (win)
        s.stats.cardWins++; }); result.textContent = t(win ? 'games.cards.win' : tie ? 'games.cards.tie' : yours > 21 ? 'games.cards.bust' : 'games.cards.lose'); deal.textContent = t('games.cards.again'); paint(); }
    function dealerTurn() { while (handTotal(dealer) < 17)
        dealer.push(deck.pop()); finish(); }
    const deal = button(t('games.cards.deal'), () => { wager = Number(select.value); if (store.state.chips < wager) {
        result.textContent = t('games.cards.low');
        return;
    } deck = Array.from({ length: 52 }, (_, i) => ({ rank: i % 13 + 1, suit: ['♠', '♥', '♣', '♦'][Math.floor(i / 13)] })); for (let i = 51; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    } hand = [deck.pop(), deck.pop()]; dealer = [deck.pop(), deck.pop()]; active = true; result.textContent = ''; paint(); if (handTotal(hand) === 21 || handTotal(dealer) === 21)
        dealerTurn(); }, row);
    const hit = button(t('games.cards.hit'), () => { if (!active)
        return; hand.push(deck.pop()); if (handTotal(hand) > 21)
        finish();
    else if (handTotal(hand) === 21)
        dealerTurn();
    else
        paint(); }, row), stand = button(t('games.cards.stay'), () => { if (active)
        dealerTurn(); }, row), double = button(t('games.cards.double'), () => { if (!active || hand.length !== 2 || store.state.chips < wager * 2)
        return; wager *= 2; hand.push(deck.pop()); if (handTotal(hand) > 21)
        finish();
    else
        dealerTurn(); }, row);
    const reset = button(t('games.cards.reset'), () => { if (active)
        return; store.change(s => { s.chips = 100; }); hand = []; dealer = []; wager = 0; deal.textContent = t('games.cards.deal'); result.textContent = 'A fresh little start. Your best score and outfits are safe. ♡'; paint(); });
    reset.classList.add('soft');
    p(t('games.cards.resetHint'));
    select.onchange = paint;
    paint();
}
$('cards-open').onclick = cards;
$('sync-retry').onclick = () => store.retry();
$('export-save').onclick = () => { downloadJSON('nayleen-carnival-save.json', { kind: 'nayleen-carnival-backup', version: 3, exportedAt: new Date().toISOString(), state: store.state }); $('backup-status').textContent = t('backup.downloaded'); };
$('import-trigger').onclick = () => $('import-save').click();
$('import-save').onchange = async (event) => { const file = event.target.files[0]; event.target.value = ''; if (!file)
    return; try {
    if (file.size > 200000)
        throw new Error('That file is too large to be a carnival save.');
    const data = JSON.parse(await file.text());
    if (data.kind !== 'nayleen-carnival-backup' || !validState(data.state))
        throw new Error('That file isn’t a valid carnival backup.');
    open('Bring your treasures back');
    p(`This backup has ${data.state.prizes.length} collectibles. Restoring it replaces your current progress. Weekly openings already used on this device stay used.`);
    button('Restore this backup', () => { const restored = normalizeState(data.state), current = store.state; restored.weeklyClaims = [...new Set([...restored.weeklyClaims, ...current.weeklyClaims])]; restored.mazeWeeks = [...new Set([...restored.mazeWeeks, ...current.mazeWeeks])]; if (current.weeklyBox && (!restored.weeklyBox || current.weeklyBox.week >= restored.weeklyBox.week))
        restored.weeklyBox = current.weeklyBox; if (current.manorRun && (!restored.manorRun || current.manorRun.week >= restored.manorRun.week))
        restored.manorRun = current.manorRun; restored.clicker.lastTick = Date.now(); store.change(s => Object.assign(s, restored)); $('backup-status').textContent = t('backup.restored'); close(); });
    button('Keep my current progress', close).classList.add('soft');
}
catch (error) {
    $('backup-status').textContent = error.message || 'Your backup couldn’t be read. Your progress hasn’t changed.';
} };
$('test-tools').hidden = window.CARNIVAL_CONFIG?.testingTools !== true;
$('test-reset').onclick = () => {
    open('Reset this testing save?'); p('This clears outfits, collections, scores, crunches, and weekly limits for the current browser/profile. Download a backup first.');
    button('Download backup first', () => downloadJSON('nayleen-before-test-reset.json', {kind:'nayleen-carnival-backup', version:3, state:store.state}));
    button('Reset my progress', async () => { store.change(s => Object.assign(s, freshState())); try { localStorage.removeItem('nayleen-manor-peanut'); localStorage.removeItem('nayleen-princess-arcade-stamps'); } catch {} await store.save(); $('test-status').textContent='Fresh testing save. All four games are ready.'; close(); });
    button('Cancel', close).classList.add('soft');
};
$('test-unlock').onclick = () => { open('Unlock this testing save?'); p('This marks all outfit goals complete and adds all 19 collectibles. Weekly games stay available.'); button('Unlock everything', async () => {store.change(s => Object.assign(s, testingState())); await store.save(); $('test-status').textContent='All outfits and collectibles unlocked for testing.';close();}); button('Cancel',close).classList.add('soft'); };
await loadContent();
store.subscribe(render);
await store.load();
readNotes().then(data => { const latest = data.notes.filter(n => n.published).sort((a, b) => a.week - b.week).at(-1); if (latest)
    $('latest-note').textContent = `${latest.emoji} Week ${latest.week} · ${latest.title} — ${latest.message.slice(0, 160)}`; }).catch(() => { });
