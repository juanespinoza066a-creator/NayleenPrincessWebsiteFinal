import { thumbnail } from './artwork.js';
import {attachTradeScroll} from './trade-scroll.js';
import {attachAdvent} from './winter-advent.js';
import {attachPalaceNews} from './palace-news.js';
import {updateProgress,updateSacrificeBars} from './progress-view.js';
import {openDrop} from './princess-drop.js';
import {openRoulette} from './roulette.js';
import {HUNTERS,weeklyHunt} from './hunt-config.js';
import { openTable } from './table21.js';
import { makeStudio, resetEstimate } from './room-studio.js';
import { freshState, unlockTestingItems, PRIZES, GAME_PRIZES, OUTFITS, unlockedOutfits, weekNumber, startBox, revealBox, handTotal, validState, normalizeState, tradeCollectibles, cabinetStatus, outfitProgress, journeyCounts, mondayKey, rouletteStatus, keepWeeklyUses,dropAttempts,DROP_TRIES, WEEKLY_RESET } from './game-rules.js';
import {attachRecovery} from './recovery-panel.js';
import { CarnivalStore, STATIC, downloadJSON } from './save-manager.js';
import { loadContent, text as t, readNotes } from './content-loader.js';
import { playBoxSound } from './box-audio.js';
const $ = id => document.getElementById(id), store = new CarnivalStore(), prize = id => PRIZES.find(p => p.id === id);
const dialog = $('game-dialog'), body = $('game-body'), result = $('game-result');
const syncProgress = $('sync-progress');
let roomSignature = '', wardrobeSignature='', collectionSignature='', toastTimer;
const renderStudio = makeStudio(store);
const resetNote = document.createElement('p'); resetNote.className='section-copy'; resetNote.id='weekly-reset-estimate'; $('weekly-box').parentElement.prepend(resetNote);
const mazeReset = document.createElement('small'); mazeReset.id='maze-reset-estimate'; $('manor-open').append(mazeReset);
function el(tag, text, className) { const n = document.createElement(tag); if (text !== undefined)
    n.textContent = text; if (className)
    n.className = className; return n; }
function image(item, className = 'collectible-image') { const img = el('img', undefined, className); img.loading = 'lazy'; img.decoding = 'async'; img.src = className.includes('thumbnail') ? thumbnail(item.image) : item.image; img.alt = item.name; return img; }
function button(text, fn, parent = body) { const b = el('button', text, 'button'); b.onclick = fn; parent.append(b); return b; }
function p(text) { const n = el('p', text, 'rules'); body.append(n); return n; }
function actions() { const n = el('div', undefined, 'game-actions'); body.append(n); return n; }
function open(title) { $('game-title').textContent = title; body.classList.remove('wishing-cabinet','royal-table-body','drop-playing');dialog.classList.remove('treasure-dialog');body.replaceChildren(); result.textContent = ''; if (!dialog.open)
    dialog.showModal(); const friend=el('img',undefined,'game-host');friend.src=OUTFITS.find(o=>o.id===store.state.outfit)?.image||OUTFITS[0].image;friend.alt='Your little Espurr host';if(/blind box|princess drop|gambling|roulette|cabinet|blackjack|table/i.test(title))body.append(el('p',WEEKLY_RESET,'weekly-reset-note'));body.append(friend); }
function close() { dialog.close(); }
$('game-close').onclick = close;
dialog.addEventListener('close',()=>{dialog.classList.remove('treasure-dialog');queueMicrotask(()=>render(store.state));});
function render(s, event = {}) {
    if(dialog.open)return; // Game UI updates itself; paint the room once on closing.
    const counts=journeyCounts(s);
    $('save-status').textContent = event.status || store.status;
    syncProgress.hidden = STATIC || !store.ready;
    $('sync-retry').hidden = STATIC || !store.ready || (!store.conflict && store.online && !store.retryAfter);
    const estimate = weekNumber() >= 52 ? 'The final week of this year’s carnival ♡' : resetEstimate();
    resetNote.textContent = WEEKLY_RESET+' '+estimate; mazeReset.textContent = WEEKLY_RESET;
    const week = weekNumber(), pending = s.weeklyBox && !s.weeklyBox.revealed, claimed = s.weeklyClaims.includes(week);
    $('weekly-label').textContent = t('weekly.eyebrow', { week: String(pending ? s.weeklyBox.week : week).padStart(2, '0') });
    $('weekly-copy').textContent = t(pending ? 'weekly.resumeCopy' : claimed ? 'weekly.doneCopy' : 'weekly.intro');
    $('weekly-box').disabled = !store.ready || claimed && !pending;
    $('weekly-box').textContent = t(pending ? 'weekly.resume' : claimed ? 'weekly.done' : 'weekly.open');
    $('weekly-label').textContent='WEEKLY BLIND BOX';
    const dropRun=s.dropRuns?.[mondayKey()];$('drop-open').disabled=!store.ready||!!dropRun&&dropRun.status!=='active'&&dropAttempts(dropRun)>=DROP_TRIES;$('drop-action').textContent=dropRun?.status==='active'?'Resume your basket →':dropAttempts(dropRun)>=DROP_TRIES?'A fresh basket opens Monday ♡':(DROP_TRIES-dropAttempts(dropRun))+' tries left · Drop a treasure →';
    const host=HUNTERS.find(h=>h.id===(s.manorRun?.status==='active'?s.manorRun.hunt?.hunter:weeklyHunt(week).hunter))||HUNTERS[0];$('hunt-name').textContent=host.name+' is looking for you';const portrait=$('manor-open').querySelector('img');const hunterImage='assets/images/hunters/'+host.id+'.png';if(portrait.getAttribute('src')!==hunterImage)portrait.src=hunterImage;if(portrait.alt!==host.name)portrait.alt=host.name;
    $('cards-open').disabled = !store.ready;
    const canTest = store.profile === 'testing' || (STATIC && window.CARNIVAL_CONFIG?.testingTools === true);
    $('test-tools').hidden = !canTest;
    $('test-reset').disabled = $('test-unlock').disabled = !store.ready || !canTest;
    const mazeActive = s.manorRun?.status === 'active';
    const mazeUnavailable = !mazeActive && s.mazeWeeks.includes(week);
    $('manor-open').disabled = !store.ready || mazeUnavailable&&store.profile!=='testing';
    $('manor-open').title = mazeUnavailable ? 'A new maze adventure opens next Monday.' : '';
    $('manor-availability').textContent = s.manorRun?.status === 'active' ? 'Resume your weekly run →' : s.mazeWeeks.includes(week) ? 'This week’s run is complete ♡' : t('games.manor.action');
    const unlocked = unlockedOutfits(s,counts), signature = JSON.stringify([s.prizes,s.shelf,s.outfit,store.ready]);
    if (signature !== roomSignature) {
        roomSignature = signature;
        const outfit = OUTFITS.find(o => o.id === s.outfit) || OUTFITS[0];
        $('espurr-portrait').src = outfit.image || OUTFITS[0].image;document.querySelector('.weekly-espurr').src=outfit.image||OUTFITS[0].image;
        $('espurr-portrait').alt = `Princess Espurr · ${outfit.name}`;
        $('outfit-caption').textContent = outfit.name;
        $('outfit-count').textContent = t('wardrobe.count', { owned: unlocked.length, total: OUTFITS.length });
        $('prize-count').textContent = t('collection.count', { count: s.prizes.length });
        $('collection-total').textContent = `${s.prizes.length} / ${PRIZES.length}`;
        $('stage-shelves').replaceChildren(...s.shelf.map((id, index) => { const b = el('button', id ? undefined : '+', 'stage-slot'); const plinth=el('span',undefined,'display-plinth');plinth.setAttribute('aria-hidden','true');b.append(plinth); if (id)
            b.append(image(prize(id))); b.setAttribute('aria-label', `Decorate shelf ${index + 1}${id ? `, ${prize(id).name}` : ''}`); b.disabled = !store.ready; b.onclick = () => decorate(index); return b; }));
    }
    renderStudio(s,counts);
    const nextWardrobe=JSON.stringify([s.outfit,unlocked,store.ready]);
    if(nextWardrobe!==wardrobeSignature){wardrobeSignature=nextWardrobe;
        $('outfit-count').textContent=t('wardrobe.count',{owned:unlocked.length,total:OUTFITS.length});
        $('outfits').replaceChildren(...OUTFITS.filter(o=>!o.adventDay||unlocked.includes(o.id)).map(o => { const owned = unlocked.includes(o.id), b = el('button', undefined, `outfit${s.outfit === o.id ? ' equipped' : ''}${owned ? '' : ' locked'}`); const thumbnail = o.image ? image(o, 'outfit-thumbnail') : el('span', o.icon, 'outfit-icon'); b.append(thumbnail, el('strong', o.name), el('small', owned && !o.image ? t('wardrobe.pending') : s.outfit === o.id ? t('wardrobe.wearing') : owned ? t('wardrobe.wear') : o.hint)); {const goals=outfitProgress(s,o.id,counts);if(goals.length){const list=el('span',undefined,'outfit-goals');for(const goal of goals){const label=goal.label,line=el('span',label+' · '+goal.value+' / '+goal.goal),meter=el('progress');meter.max=goal.goal;meter.value=goal.value;meter.setAttribute('aria-label',label);list.append(line,meter);}b.append(list);}} b.disabled = !store.ready || !owned || !o.image; b.setAttribute('aria-pressed', String(s.outfit === o.id)); b.onclick = () => store.change(s => { s.outfit = o.id; }); return b; }));
    }
    const visibleOutfits = OUTFITS.filter(o=>!o.adventDay||unlocked.includes(o.id));
    updateProgress($('outfits'),visibleOutfits,o=>outfitProgress(s,o.id,counts));
    updateSacrificeBars($('outfits'),visibleOutfits,s,'outfit');
    const nextCollection=JSON.stringify(s.prizes);
    if(nextCollection!==collectionSignature){collectionSignature=nextCollection;
        $('collection').replaceChildren(...PRIZES.filter(item=>!item.adventDay||s.prizes.includes(item.id)).map(item => { const card = el('div', undefined, `inventory-item${s.prizes.includes(item.id) ? '' : ' locked'}`); card.append(image(item,'collectible-image inventory-thumbnail'), el('span', item.name)); if (!s.prizes.includes(item.id)) {
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
    p(t('collection.empty')); const row = actions(); row.classList.add('collectible-picker'); store.state.prizes.forEach(id => { const item = prize(id), b = button('', () => { store.change(s => { s.shelf[index] = id; }); close(); }, row); b.classList.add('soft', 'prize-choice'); b.append(image(item,'collectible-image inventory-thumbnail'), el('small', item.name)); b.setAttribute('aria-label', `Place ${item.name}`); }); button(t('collection.clear'), () => { store.change(s => { s.shelf[index] = null; }); close(); }).classList.add('soft'); }
function blind() {
    let box;
    store.change(s => { box = startBox(s, weekNumber()); });
    if (!box)
        return;
    open('Weekly blind box');body.querySelector('.game-host')?.remove();
    p(t('games.blind.rules'));
    const friend=el('img',undefined,'game-espurr');friend.src=OUTFITS.find(o=>o.id===store.state.outfit)?.image||OUTFITS[0].image;friend.alt='Espurr is excited for your surprise';body.append(friend);
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
$('drop-open').onclick=()=>openDrop(store,{open,body,result,button,p});
$('weekly-box').onclick = blind;
function cards(){
 open(t('games.cards.title'));p('A little luck, a little sparkle. Choose your table.');
 const seats=document.createElement('div');seats.className='casino-seats';body.append(seats);button('♠ 21 · Princess blackjack',()=>openTable(store,{open,body,result,t}),seats);
 const cabinetState=cabinetStatus(store.state);
 const trade=button('✦ The wishing cabinet · '+cabinetState.left+' / 2 wishes left',()=>{
  open('The wishing cabinet');
  body.classList.add('wishing-cabinet');
  const cabinet=el('div',undefined,'wish-altar');
  const count=el('small');
  count.setAttribute('role','status');
  cabinet.append(el('span','✧ ♛ ✧'),el('strong','Sacrifice three collectibles, get one muahahah'),count);
  body.append(cabinet);
  p('Offer three different collectibles for one random collectible. It might be one you already own. You can earn the collectibles you give up again right away.');
  const selected=new Set(),notice=el('div'),grid=el('div',undefined,'trade-grid'),review=el('div',undefined,'exchange-review');
  notice.setAttribute('role','status');
  review.hidden=true;
  review.setAttribute('role','alertdialog');
  review.setAttribute('aria-label','Confirm your wish');
  body.append(notice);
  const go=button('Choose 3 treasures',()=>{
   if(selected.size!==3||!cabinetStatus(store.state).canExchange)return;
   review.hidden=false;
   review.scrollIntoView({block:'nearest',behavior:'smooth'});
  });
  body.append(review,grid);
  review.append(el('p','Give up these three treasures for one random collectible?'));
  button('Keep my treasures',()=>{review.hidden=true;},review);
  button('Make my wish ♡',()=>{
   let reward;
   store.change(s=>{reward=tradeCollectibles(s,[...selected]);});
   if(!reward){renderChoices();return;}
   const item=prize(reward.id);
   notice.replaceChildren(el('p',item.name+(reward.isNew?' · A new treasure!':' · Already in your collection.')));
   cabinet.classList.add('wish-granted');
   selected.clear();
   renderChoices();
   playBoxSound('reveal');
  },review);
  function refreshSelection(){
   review.hidden=true;
   const state=cabinetStatus(store.state);
   count.textContent=state.left+' / 2 wishes left this week';
   go.disabled=selected.size!==3||!state.canExchange;
   go.textContent=state.left===0?'A fresh wish opens Monday ♡':'Wish with '+selected.size+' / 3 treasures';
  }
  function renderChoices(){
   grid.replaceChildren();
   const state=cabinetStatus(store.state),items=GAME_PRIZES.filter(x=>store.state.prizes.includes(x.id));
   for(const id of selected)if(!items.some(x=>x.id===id))selected.delete(id);
   if(!state.left){refreshSelection();return;}
   if(state.needed){
    const empty=el('div',undefined,'wish-empty');
    empty.append(el('span','✧ ♡ ✧'),el('strong',state.owned+' / 3 collectibles ready'),el('p','Find more treasures in the weekly blind box or Ann’s garden.'));
    grid.append(empty);
   }
   for(const item of items){
    const choice=el('button',undefined,'trade-choice');
    choice.append(image(item,'collectible-image inventory-thumbnail'),el('span',item.name));
    choice.setAttribute('aria-pressed',String(selected.has(item.id)));
    choice.onclick=()=>{
     if(selected.has(item.id))selected.delete(item.id);else if(selected.size<3)selected.add(item.id);
     choice.setAttribute('aria-pressed',String(selected.has(item.id)));
     refreshSelection();
     if(selected.size===3)go.scrollIntoView({block:'nearest',behavior:'smooth'});
    };
    grid.append(choice);
   }
   grid.scrollTop=0;
   refreshSelection();
  }
  attachTradeScroll(grid);
  renderChoices();
 },seats);
 const roulette=rouletteStatus(store.state);
 const wheel=button('♡ Princess roulette · '+roulette.left+' / 1 wish left',()=>openRoulette(store,{open,body,result,button,p}),seats);
 wheel.disabled=!roulette.canEnter;
 wheel.title=roulette.left===0?'A fresh wish opens Monday ♡':'Offer two treasures, including an outfit or room.';
 trade.disabled=!store.ready||!cabinetState.canEnter;
 trade.title=cabinetState.left===0?'Fresh wishes open Monday.':'Choose three collectibles for your wish.';
 if(cabinetState.left>0&&cabinetState.needed)p('Find '+cabinetState.needed+' more collectible'+(cabinetState.needed===1?'':'s')+' to make a cabinet wish.');
 p(WEEKLY_RESET);
}
$('cards-open').onclick = cards;
$('sync-retry').onclick = () => { if(!store.conflict)return store.retry();open('Choose your saved progress');p('Another device saved a different copy. Download this device’s progress before loading the account copy.');button('Download this device’s copy',()=>downloadJSON('palace-device-backup.json',{kind:'nayleen-carnival-backup',version:3,profile:store.profile,state:store.state}));button('Load account copy',async()=>{await store.retry();close();});button('Keep this device’s copy',close); };
syncProgress.onclick = async () => {
    if (syncProgress.disabled) return;
    syncProgress.disabled = true;
    try {
        await store.syncProgress();
        if (!store.conflict) document.documentElement.dataset.palaceSyncRequested = 'true';
        if (store.conflict) $('sync-retry').onclick();
    } finally {
        syncProgress.disabled = false;
    }
};
attachRecovery(store,{open,close,body});
$('test-tools').hidden = true;
const canUseTestingTools = () => store.ready && (store.profile === 'testing' || (STATIC && window.CARNIVAL_CONFIG?.testingTools === true));
$('test-reset').onclick = () => {
    if (!canUseTestingTools()) return;
    open('Reset this Palace?'); p('This clears outfits, collections, scores, crunches, and weekly limits for the current account. Download a backup first.');
    button('Download backup first', () => downloadJSON('nayleen-before-test-reset.json', {kind:'nayleen-carnival-backup', version:3, state:store.state}));
    button('Reset my progress', async () => { try { await store.resetTesting(); localStorage.removeItem('nayleen-manor-peanut'); localStorage.removeItem('nayleen-princess-arcade-stamps'); $('test-status').textContent='A fresh start ♡ Today is login day 1. Weekly games are ready.'; close(); } catch(error){result.textContent=error.message;} });
    button('Cancel', close).classList.add('soft');
};
$('test-unlock').onclick = () => { if (!canUseTestingTools()) return; open('Open the whole wardrobe?'); p('This unlocks outfits and rooms as little gifts and completes their bars. Your real login/game counts, saved favorites and weekly turns stay as they are.'); button('Unlock everything', async () => {store.change(s => unlockTestingItems(s)); await store.save(); $('test-status').textContent='All outfits and collectibles are ready ♡';close();}); button('Cancel',close).classList.add('soft'); };
attachAdvent(store);
attachPalaceNews();
await loadContent();
const journeyIntro=el('p',t('wardrobe.journeyIntro'),'section-copy journey-intro');$('outfits').before(journeyIntro);
store.subscribe(render);
await store.load();
void import('./espurr-personality.js').then(m=>m.attachEspurr());
setInterval(() => render(store.state), 60000);
readNotes().then(data => { const latest = data.notes.filter(n => n.published).sort((a, b) => a.week - b.week).at(-1); if (latest)
    $('latest-note').textContent = `${latest.emoji} Week ${latest.week} · ${latest.title} — ${latest.message.slice(0, 160)}`; }).catch(() => { });

$('manor-open').onclick = () => { if (!$('manor-open').disabled) location.href = 'escape.html'; };

export {store};
