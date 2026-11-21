import {updateProgress} from './progress-view.js';
import {openDrop} from './princess-drop.js';
import {openRoulette} from './roulette.js';
import {HUNTERS,weeklyHunt} from './hunt-config.js';
import { openTable } from './table21.js';
import { makeStudio, resetEstimate } from './room-studio.js';
import { freshState, testingState, PRIZES, OUTFITS, unlockedOutfits, weekNumber, startBox, revealBox, handTotal, validState, normalizeState, tradeCollectibles, cabinetStatus, outfitProgress, journeyCounts, mondayKey, rouletteStatus, keepWeeklyUses,dropAttempts,DROP_TRIES, WEEKLY_RESET } from './game-rules.js';
import {attachRecovery} from './recovery-panel.js';
import { CarnivalStore, STATIC, downloadJSON } from './save-manager.js';
import { loadContent, text as t, readNotes } from './content-loader.js';
import { playBoxSound } from './box-audio.js';
const $ = id => document.getElementById(id), store = new CarnivalStore(), prize = id => PRIZES.find(p => p.id === id);
const dialog = $('game-dialog'), body = $('game-body'), result = $('game-result');
let roomSignature = '', wardrobeSignature='', collectionSignature='', toastTimer;
const renderStudio = makeStudio(store);
const resetNote = document.createElement('p'); resetNote.className='section-copy'; resetNote.id='weekly-reset-estimate'; $('weekly-box').parentElement.prepend(resetNote);
const mazeReset = document.createElement('small'); mazeReset.id='maze-reset-estimate'; $('manor-open').append(mazeReset);
function el(tag, text, className) { const n = document.createElement(tag); if (text !== undefined)
    n.textContent = text; if (className)
    n.className = className; return n; }
function image(item, className = 'collectible-image') { const img = el('img', undefined, className); img.src = item.image; img.alt = item.name; img.loading = 'lazy';img.decoding='async'; return img; }
function button(text, fn, parent = body) { const b = el('button', text, 'button'); b.onclick = fn; parent.append(b); return b; }
function p(text) { const n = el('p', text, 'rules'); body.append(n); return n; }
function actions() { const n = el('div', undefined, 'game-actions'); body.append(n); return n; }
function open(title) { $('game-title').textContent = title; body.classList.remove('wishing-cabinet','royal-table-body','drop-playing');body.replaceChildren(); result.textContent = ''; if (!dialog.open)
    dialog.showModal(); const friend=el('img',undefined,'game-host');friend.src=OUTFITS.find(o=>o.id===store.state.outfit)?.image||OUTFITS[0].image;friend.alt='Your little Espurr host';if(/blind box|princess drop|gambling|roulette|cabinet|blackjack|table/i.test(title))body.append(el('p',WEEKLY_RESET,'weekly-reset-note'));body.append(friend); }
function close() { dialog.close(); }
$('game-close').onclick = close;
function render(s, event = {}) {
    $('save-status').textContent = event.status || store.status;
    $('sync-retry').hidden = STATIC || (!store.conflict && (store.online && !store.dirty || !store.ready));
    renderStudio(s);
    const estimate = weekNumber() >= 52 ? 'The final week of this year’s carnival ♡' : resetEstimate();
    resetNote.textContent = WEEKLY_RESET+' '+estimate; mazeReset.textContent = WEEKLY_RESET;
    const week = weekNumber(), pending = s.weeklyBox && !s.weeklyBox.revealed, claimed = s.weeklyClaims.includes(week);
    $('weekly-label').textContent = t('weekly.eyebrow', { week: String(pending ? s.weeklyBox.week : week).padStart(2, '0') });
    $('weekly-copy').textContent = t(pending ? 'weekly.resumeCopy' : claimed ? 'weekly.doneCopy' : 'weekly.intro');
    $('weekly-box').disabled = !store.ready || claimed && !pending;
    $('weekly-box').textContent = t(pending ? 'weekly.resume' : claimed ? 'weekly.done' : 'weekly.open');
    $('weekly-label').textContent='WEEKLY BLIND BOX';
    const dropRun=s.dropRuns?.[mondayKey()];$('drop-open').disabled=!store.ready||!!dropRun&&dropRun.status!=='active'&&dropAttempts(dropRun)>=DROP_TRIES;$('drop-action').textContent=dropRun?.status==='active'?'Resume your basket →':dropAttempts(dropRun)>=DROP_TRIES?'A fresh basket opens Monday ♡':(DROP_TRIES-dropAttempts(dropRun))+' tries left · Drop a treasure →';
    const host=HUNTERS.find(h=>h.id===(s.manorRun?.status==='active'?s.manorRun.hunt?.hunter:weeklyHunt(week).hunter))||HUNTERS[0];$('hunt-name').textContent=host.name+' is looking for you';const portrait=$('manor-open').querySelector('img');portrait.src='assets/images/hunters/'+host.id+'.png';portrait.alt=host.name;
    $('cards-open').disabled = !store.ready;
    const canTest = store.profile === 'testing' || (STATIC && window.CARNIVAL_CONFIG?.testingTools === true);
    $('test-tools').hidden = !canTest;
    $('test-reset').disabled = $('test-unlock').disabled = !store.ready || !canTest;
    const mazeActive = s.manorRun?.status === 'active';
    const mazeUnavailable = !mazeActive && s.mazeWeeks.includes(week);
    $('manor-open').disabled = !store.ready || mazeUnavailable&&store.profile!=='testing';
    $('manor-open').title = mazeUnavailable ? 'A new maze adventure opens next Monday.' : '';
    $('manor-availability').textContent = s.manorRun?.status === 'active' ? 'Resume your weekly run →' : s.mazeWeeks.includes(week) ? 'This week’s run is complete ♡' : t('games.manor.action');
    const unlocked = unlockedOutfits(s), signature = JSON.stringify([s.prizes,s.shelf,s.outfit,store.ready]);
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
    const nextWardrobe=JSON.stringify([s.outfit,unlocked,store.ready]);
    if(nextWardrobe!==wardrobeSignature){wardrobeSignature=nextWardrobe;
        $('outfit-count').textContent=t('wardrobe.count',{owned:unlocked.length,total:OUTFITS.length});
        $('outfits').replaceChildren(...OUTFITS.map(o => { const owned = unlocked.includes(o.id), b = el('button', undefined, `outfit${s.outfit === o.id ? ' equipped' : ''}${owned ? '' : ' locked'}`); const thumbnail = o.image ? image(o, 'outfit-thumbnail') : el('span', o.icon, 'outfit-icon'); b.append(thumbnail, el('strong', o.name), el('small', owned && !o.image ? t('wardrobe.pending') : s.outfit === o.id ? t('wardrobe.wearing') : owned ? t('wardrobe.wear') : o.hint)); {const goals=outfitProgress(s,o.id);if(goals.length){const list=el('span',undefined,'outfit-goals');for(const goal of goals){const label=goal.label,line=el('span',label+' · '+goal.value+' / '+goal.goal),meter=el('progress');meter.max=goal.goal;meter.value=goal.value;meter.setAttribute('aria-label',label);list.append(line,meter);}b.append(list);}} b.disabled = !store.ready || !owned || !o.image; b.setAttribute('aria-pressed', String(s.outfit === o.id)); b.onclick = () => store.change(s => { s.outfit = o.id; }); return b; }));
    }
    updateProgress($('outfits'),OUTFITS,o=>outfitProgress(s,o.id));
    const nextCollection=JSON.stringify(s.prizes);
    if(nextCollection!==collectionSignature){collectionSignature=nextCollection;
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
    p(t('collection.empty')); const row = actions(); row.classList.add('collectible-picker'); store.state.prizes.forEach(id => { const item = prize(id), b = button('', () => { store.change(s => { s.shelf[index] = id; }); close(); }, row); b.classList.add('soft', 'prize-choice'); b.append(image(item), el('small', item.name)); b.setAttribute('aria-label', `Place ${item.name}`); }); button(t('collection.clear'), () => { store.change(s => { s.shelf[index] = null; }); close(); }).classList.add('soft'); }
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
 const trade=button('✦ The wishing cabinet · Weekly 3-for-1',()=>{
  open('The wishing cabinet');body.classList.add('wishing-cabinet');const cabinet=el('div',undefined,'wish-altar');cabinet.innerHTML='<span aria-hidden="true">✧ ♛ ✧</span><strong>Sacrifice three collectibles, get one muahahah</strong><small>Choose your offerings below</small>';body.append(cabinet);p('Offer 3 different owned collectibles for 1 random collectible. The offered items leave your collection and room. Duplicates are possible, with no reroll. Once per week.');
  const selected=new Set(),grid=el('div',undefined,'trade-grid');body.append(grid);const review=el('div',undefined,'exchange-review');review.hidden=true;review.setAttribute('role','alertdialog');review.append(el('p','These three collectibles will leave your room for one random collectible. Duplicates are possible.'));body.insertBefore(review,grid);button('Keep my treasures',()=>{review.hidden=true;delete go.dataset.review;},review);button('Make my wish ♡',()=>go.click(),review);
  const available=cabinetStatus(store.state);
  if(available.needed){const empty=el('div',undefined,'wish-empty');empty.append(el('span','✧ ♡ ✧'),el('strong',available.owned+' / 3 collectibles ready'),el('p','Find treasures in the weekly blind box or Ann’s garden. Your wish will be waiting here.'));grid.append(empty);}
  const go=button('Choose 3 treasures',()=>{
   if(selected.size!==3)return;
   if(!go.dataset.review){go.dataset.review='yes';review.hidden=false;review.scrollIntoView({block:'nearest',behavior:'smooth'});return;}
   let reward;store.change(s=>reward=tradeCollectibles(s,[...selected]));if(!reward)return;review.hidden=true;
   grid.replaceChildren();cabinet.classList.add('wish-granted');cabinet.querySelector('small').textContent='Your wish has arrived ♡';go.disabled=true;go.textContent='This week’s wish is complete ♡';const item=prize(reward.id);grid.append(image(item));p(item.name+(reward.isNew?' · A new treasure!':' · A duplicate, no extra roll.'));playBoxSound('reveal');
  });
  body.insertBefore(go,review);
  const refresh=()=>{review.hidden=true;delete go.dataset.review;cabinet.querySelector('small').textContent=selected.size+' / 3 offerings chosen · one surprise awaits';go.disabled=selected.size!==3||(store.state.tradeWeeks||[]).includes(weekNumber());go.textContent=(store.state.tradeWeeks||[]).includes(weekNumber())?'This week’s wish is complete ♡':'Wish with '+selected.size+' / 3 treasures';};
  for(const item of PRIZES.filter(x=>store.state.prizes.includes(x.id))){const b=el('button',undefined,'trade-choice');b.append(image(item),el('span',item.name));b.setAttribute('aria-pressed','false');b.onclick=()=>{if(selected.has(item.id))selected.delete(item.id);else if(selected.size<3)selected.add(item.id);b.setAttribute('aria-pressed',String(selected.has(item.id)));refresh();if(selected.size===3)go.scrollIntoView({block:'nearest',behavior:'smooth'});};grid.append(b)}refresh();
 },seats);
 const wheel=button('♡ Princess roulette · '+rouletteStatus(store.state).left+' / 1 weekly wish',()=>openRoulette(store,{open,body,result,button,p}),seats);wheel.disabled=!rouletteStatus(store.state).canEnter;wheel.title=rouletteStatus(store.state).left===0?'A fresh wheel opens Monday ♡':rouletteStatus(store.state).canSpin?'Offer two treasures for one surprise.':'Choose two treasures, including an outfit or room ♡';
 const cabinetState=cabinetStatus(store.state);
 trade.disabled=!store.ready||!cabinetState.canEnter;
 trade.title=cabinetState.used?'Your next wish opens Monday.':cabinetState.needed?'Come peek inside! Collect '+cabinetState.needed+' more treasure'+(cabinetState.needed===1?'':'s')+' to make a wish.':'Choose three collectibles for your wish.';
 if(cabinetState.used)p('This week’s wish is complete ♡ A fresh wish opens Monday.');
 else if(cabinetState.needed)p('Your cabinet is open ♡ Find '+cabinetState.needed+' more collectible'+(cabinetState.needed===1?'':'s')+' before making a wish.');
 p(WEEKLY_RESET);
}
$('cards-open').onclick = cards;
$('sync-retry').onclick = () => { if(!store.conflict)return store.retry();open('Choose your saved progress');p('Another device saved a different copy. Download this device’s progress before loading the account copy.');button('Download this device’s copy',()=>downloadJSON('palace-device-backup.json',{kind:'nayleen-carnival-backup',version:3,profile:store.profile,state:store.state}));button('Load account copy',async()=>{await store.retry();close();});button('Keep this device’s copy',close); };
attachRecovery(store,{open,close,body});
$('test-tools').hidden = true;
const canUseTestingTools = () => store.ready && (store.profile === 'testing' || (STATIC && window.CARNIVAL_CONFIG?.testingTools === true));
$('test-reset').onclick = () => {
    if (!canUseTestingTools()) return;
    open('Reset this testing save?'); p('This clears outfits, collections, scores, crunches, and weekly limits for the current browser/profile. Download a backup first.');
    button('Download backup first', () => downloadJSON('nayleen-before-test-reset.json', {kind:'nayleen-carnival-backup', version:3, state:store.state}));
    button('Reset my progress', async () => { store.change(s => (Object.keys(s).forEach(k=>delete s[k]),Object.assign(s, freshState()))); try { localStorage.removeItem('nayleen-manor-peanut'); localStorage.removeItem('nayleen-princess-arcade-stamps'); } catch {} await store.save(); $('test-status').textContent='A fresh start ♡ Weekly games are ready. Find three collectibles to make a wish.'; close(); });
    button('Cancel', close).classList.add('soft');
};
$('test-unlock').onclick = () => { if (!canUseTestingTools()) return; open('Unlock this testing save?'); p('This marks all outfit goals complete and adds all current collectibles. Weekly games stay available.'); button('Unlock everything', async () => {store.change(s => Object.assign(s, testingState())); await store.save(); $('test-status').textContent='All outfits and collectibles unlocked for testing.';close();}); button('Cancel',close).classList.add('soft'); };
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
