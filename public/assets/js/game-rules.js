export const ROOMS = [
 {id:'lavender',name:'Lavender daydream',hint:'Your first little room',wall:'#e5cef1',floor:'#c3a1d8'},
 {id:'cafe',name:'7 Brew coffee stop',hint:'Own all seven squishies',wall:'#c2d6eb',floor:'#b2b2c8',image:'assets/images/rooms/brew.webp'},
 {id:'garden',name:'Lily-of-the-valley garden',hint:'Play Ann’s weekly maze at least once',wall:'#d1e7dc',floor:'#8cb6a0',image:'assets/images/rooms/lilies.webp'},
 {id:'cards',name:'Pokémon card shop',hint:'Make 1,000,000 lifetime squishes',wall:'#dbc8ed',floor:'#af8dbd',image:'assets/images/rooms/cards.webp'},
 {id:'popmart',name:'Pop Mart date',hint:'Open 3 weekly blind boxes',wall:'#efd0e3',floor:'#c8a2b9',image:'assets/images/rooms/popmart.webp'},
 {id:'sunday',name:'Sunday’s quiet sanctuary',hint:'Reach a best table score of 1,000',wall:'#d9dfef',floor:'#c3b4d2',image:'assets/images/rooms/sunday.webp'}
];
export function unlockedRooms(s){return ROOMS.filter(r=>r.id==='lavender'||r.id==='cafe'&&unlockedSquishies(s).length>=SQUISHIES.length||r.id==='garden'&&((s.mazeWeeks||[]).length>=1||s.stats.manorWins>=1||!!s.manorRun)||r.id==='cards'&&s.clicker.lifetime>=1000000||r.id==='popmart'&&s.stats.boxes>=3||r.id==='sunday'&&s.stats.bestBank>=1000).map(r=>r.id)}
export const SQUISHIES = [
 {id:'peanut',name:'Peanut Crunchy',goal:0,image:'assets/images/crunchy-peanut.svg',color:'#bd8c52',sound:'crunch'},
 {id:'butter',name:'Butter Baby',goal:250000,image:'assets/images/squishies/butter.webp',color:'#e9c963',sound:'butter'},
 {id:'cube',name:'Dream Cube',goal:1500000,image:'assets/images/squishies/cube.webp',color:'#a68ad2',sound:'gel'},
 {id:'cat',name:'Mochi Kitty',goal:6000000,image:'assets/images/squishies/cat.webp',color:'#bf8ac9',sound:'meep'},
 {id:'bao',name:'Bao Bun',goal:15000000,image:'assets/images/squishies/bao.webp',color:'#d6ac89',sound:'puff'},
 {id:'berry',name:'Berry Blush',goal:50000000,image:'assets/images/squishies/berry.webp',color:'#e18ca9',sound:'pop'},
 {id:'cloud',name:'Cloud Nine',goal:125000000,image:'assets/images/squishies/cloud.webp',color:'#8bb8dc',sound:'chime'}
];
export function unlockedSquishies(s){return [...new Set(['peanut',...(s.clicker.ownedSkins||[])])]}

// Game rules only. Edit display text in content/site-text.json.
export const SAVE_KEY = 'nayleen-carnival-room-v2';
export const PRIZES = [
    ['espurr', 'Pocket Espurr'], ['peanut', 'Crunchy companion'], ['frog', 'Our Build-A-Bear frog'], ['rose', 'Forever rose'], ['cat', 'Ann’s tiny cat'],
    ['sunday', 'Sunday plushie'], ['bunny', 'Sleepy bunny'], ['duck', 'Little duck'], ['akali', 'Akali plushie'], ['pokemon', 'Pokémon card pack'],
    ['pterodactyl', 'Pterodactyl plushie'], ['gambit', 'Maid Gambit figure'], ['lilies', 'Lily-of-the-valley bouquet'], ['mew', 'Bubble Mew card'], ['coach', 'Coach bag'],
    ['blondie', 'Blondie coffee'], ['rafayel', 'Rafayel plushie'], ['mitski', 'Mitski record'], ['rogue', 'Pocket Rogue Espurr'], ['furina', 'Furina plushie'], ['emil', 'Emil plushie']
].map(([id, name]) => ({ id, name, image: id === 'espurr' ? 'assets/images/espurr-princess.webp' : `assets/images/collectibles/${id}.${['pokemon','gambit','mew'].includes(id) ? 'svg' : 'webp'}` }));
export const OUTFITS = [
    { id: 'royal', name: 'My little princess', hint: 'Yours from the beginning', icon: '♛', image: 'assets/images/espurr-princess.webp' },
    { id: 'sunday', name: 'Sunday’s little angel', hint: 'Reach a best card-table score of 200', icon: '☀', image: 'assets/images/outfits/sunday.webp' },
    { id: 'cozy', name: 'Peanut crunchy PJs', hint: 'Make 500 lifetime crunches', icon: '🥜', image: 'assets/images/outfits/cozy.webp' },
    { id: 'espeon', name: 'Espeon daydream', hint: 'Open your first weekly blind box', icon: '🔮', image: 'assets/images/outfits/espeon.webp' },
    { id: 'akali', name: 'Akali’s little rogue', hint: 'Escape Ann’s weekly maze once', icon: '✦', image: 'assets/images/outfits/akali.webp' },
    { id: 'kda', name: 'K/DA princess', hint: 'Escape Ann’s weekly maze 5 times', icon: '♫', image: 'assets/images/outfits/kda.webp' },
    { id: 'furina', name: 'Furina cosplay', hint: 'Play the card table at least once', icon: '♧', image: 'assets/images/outfits/furina.webp' },
    { id: 'rogue', name: 'Rogue cosplay', hint: 'Open 5 weekly blind boxes', icon: '✦', image: 'assets/images/outfits/rogue.webp' },
    { id: 'ada', name: 'Ada Mesmer cosplay', hint: 'Make 1,000,000 lifetime squishes', icon: '♡', image: 'assets/images/outfits/ada.webp' },
    {"id": "jubilee", "name": "Jubilee · Sparkle princess", "hint": "Finish 5 hands on 7 different days", "icon": "✧", "image": "assets/images/outfits/jubilee.webp"},
    {"id": "jubilee-midnight", "name": "Jubilee · Midnight Mutant", "hint": "Escape in 8 different weeks, enjoy 21 play days & earn Jubilee", "icon": "☾", "image": "assets/images/outfits/jubilee-midnight.webp"},
    {"id": "rafayel", "name": "Rafayel’s little artist", "hint": "Enjoy 14 play days and 6 cozy squishy days", "icon": "🎨", "image": "assets/images/outfits/rafayel.webp"},
    {"id": "pokemon-pack", "name": "Princess booster pack", "hint": "Open boxes in 4 different weeks & enjoy 14 play days", "icon": "◇", "image": "assets/images/outfits/pokemon-pack.webp"},
    {"id": "firestarter", "name": "K/DA Firestarter", "hint": "Finish 5 hands in each of 5 weeks & win 30 hands", "icon": "🔥", "image": "assets/images/outfits/firestarter.webp"},
    {"id": "reze", "name": "Reze · Rainy-day ribbon", "hint": "Enjoy 10 cozy squishy days & visit Ann in 2 weeks", "icon": "☂", "image": "assets/images/outfits/reze.webp"},
    {"id": "cissia", "name": "Cissia · Little case specialist", "hint": "Visit Ann in 4 different weeks & enjoy 12 play days", "icon": "✦", "image": "assets/images/outfits/cissia.webp"}
];
export const UPGRADES = [
    { id: 'fingers', name: 'Extra-squishy fingers', detail: '+1 crunch per tap', base: 15, icon: '☝' },
    { id: 'helpers', name: 'Tiny peanut helper', detail: '+1 crunch every second', base: 30, icon: '🐥' },
    { id: 'press', name: 'Royal crunch press', detail: '+7 crunches every second', base: 175, icon: '⚙' },
    { id: 'factory', name: 'The peanut palace', detail: '+40 crunches every second', base: 1000, icon: '♛' },
    { id: 'roaster', name: 'Midnight peanut roaster', detail: '+15 crunches per second', base: 500, icon: '🔥' },
    { id: 'caramel', name: 'Caramel-coated fingers', detail: '+8 crunches per tap', base: 1200, icon: '🍯' },
    { id: 'delivery', name: 'Tiny delivery ducks', detail: '+60 crunches per second', base: 3000, icon: '🦆' },
    { id: 'musicbox', name: 'Princess music box', detail: '+10% to all automatic production', base: 8000, icon: '🎵' }
];
const LEGACY = { bear: 'frog', sylveon: 'akali', moon: 'sunday', compact: 'coach', star: 'pokemon', tea: 'blondie', book: 'gambit', shell: 'pterodactyl', flower: 'lilies', crystal: 'rafayel', heart: 'mew', music: 'mitski' };
const OLD_IDS = new Set(['espurr', 'sylveon', 'bear', 'peanut', 'moon', 'rose', 'compact', 'cat', 'star', 'bunny', 'tea', 'cake', 'book', 'shell', 'flower', 'duck', 'crystal', 'heart', 'music']);
// Accept retired IDs in old saves; omit them from the collection and prize pool.
const retiredPrize = id => id === 'stitch' || id === 'cake';
const knownPrize = id => id === 'stitch' || PRIZES.some(p => p.id === id);
const prizeID = id => typeof id === 'string' ? (PRIZES.some(p => p.id === id) ? id : Object.hasOwn(LEGACY, id) ? LEGACY[id] : undefined) : undefined;
const number = (v, max = 1e9) => Number.isFinite(v) && v >= 0 ? Math.min(max, v) : 0;
const integer = (v, max = 1e9) => Math.floor(number(v, max));
const weeks = v => [...new Set(Array.isArray(v) ? v.filter(n => Number.isInteger(n) && n >= 1 && n <= 52) : [])];
export const MAX_CRUNCHES = 1e12;
export function freshState(now = Date.now()) {
    return { version: 3, journey: freshJourney(), room: 'lavender', chips: 100, prizes: [], shelf: [null, null, null, null], outfit: 'royal', tradeWeeks: [], collectionHistory: [], weeklyClaims: [], mazeWeeks: [], weeklyBox: null, manorRun: null, manorPeanut: {found: false, count: 0}, stats: { rounds: 0, cardRounds: 0, cardWins: 0, boxes: 0, manorWins: 0, bestBank: 100 }, clicker: { balance: 0, lifetime: 0, manual: 0, skin: 'peanut', ownedSkins: ['peanut'], upgrades: { fingers: 0, helpers: 0, press: 0, factory: 0, roaster: 0, caramel: 0, delivery: 0, musicbox: 0 }, lastTick: now } };
}
export function unlockedOutfits(s) { return OUTFITS.filter(o => o.id === 'royal' || o.id === 'sunday' && s.stats.bestBank >= 200 || o.id === 'cozy' && s.clicker.lifetime >= 500 || o.id === 'espeon' && s.stats.boxes >= 1 || o.id === 'akali' && s.stats.manorWins >= 1 || o.id === 'kda' && s.stats.manorWins >= 5 || o.id === 'furina' && s.stats.cardRounds >= 1 || o.id === 'rogue' && s.stats.boxes >= 5 || o.id === 'ada' && s.clicker.lifetime >= 1000000 || OUTFIT_CHALLENGES[o.id] && ((s.journey?.earnedOutfits||[]).includes(o.id) || outfitProgress(s,o.id).every(g=>g.value>=g.goal))).map(o => o.id); }
export function normalizeState(raw, now = Date.now()) {
    const s = freshState(now);
    if (!raw || typeof raw !== 'object')
        return s;
    s.manorPeanut = {found: raw.manorPeanut?.found === true, count: integer(raw.manorPeanut?.count)};
    s.chips = Number.isSafeInteger(raw.chips) ? integer(raw.chips, 1e6) : 100;
    s.prizes = [...new Set((Array.isArray(raw.prizes) ? raw.prizes : []).map(prizeID).filter(Boolean))];
    s.shelf = Array.from({ length: 4 }, (_, i) => { const id = prizeID(raw.shelf?.[i]); return s.prizes.includes(id) ? id : null; });
    for (const k of Object.keys(s.stats))
        s.stats[k] = integer(raw.stats?.[k]);
    // Old saves lack cardRounds; a recorded win proves the table has been played.
    s.stats.cardRounds = Math.max(s.stats.cardRounds, s.stats.cardWins > 0 ? 1 : 0);
    s.stats.bestBank = Math.max(100, s.chips, s.stats.bestBank);
    for (const k of ['balance', 'lifetime', 'manual'])
        s.clicker[k] = number(raw.clicker?.[k], MAX_CRUNCHES);
    for (const u of UPGRADES)
        s.clicker.upgrades[u.id] = integer(raw.clicker?.upgrades?.[u.id], 50);
    s.clicker.ownedSkins = [...new Set(['peanut',...(Array.isArray(raw.clicker?.ownedSkins)?raw.clicker.ownedSkins: SQUISHIES.filter(x=>s.clicker.lifetime>=({butter:250,cube:1500,cat:6000,bao:15000,berry:50000,cloud:125000}[x.id]||0)).map(x=>x.id))].map(x=>x==='bunny'?'bao':x).filter(x=>SQUISHIES.some(y=>y.id===x)))];
    s.clicker.skin = unlockedSquishies(s).includes(raw.clicker?.skin==='bunny'?'bao':raw.clicker?.skin) ? (raw.clicker.skin==='bunny'?'bao':raw.clicker.skin) : 'peanut';
    s.clicker.lastTick = Math.min(now, number(raw.clicker?.lastTick, now) || now);
    s.tradeWeeks=weeks(raw.tradeWeeks);s.collectionHistory=[...new Set([...(raw.collectionHistory||[]),...s.prizes])].filter(knownPrize);
    s.weeklyClaims = weeks(raw.weeklyClaims);
    s.mazeWeeks = weeks(raw.mazeWeeks);
    if (raw.weeklyBox && weeks([raw.weeklyBox.week]).length && (prizeID(raw.weeklyBox.id) || retiredPrize(raw.weeklyBox.id)))
        s.weeklyBox = { week: raw.weeklyBox.week, id: prizeID(raw.weeklyBox.id) || 'espurr', revealed: raw.weeklyBox.revealed === true };
    if (raw.manorRun && weeks([raw.manorRun.week]).length && ['active', 'won', 'lost'].includes(raw.manorRun.status)) {
        s.manorRun = { week: raw.manorRun.week, status: raw.manorRun.status, loot: (Array.isArray(raw.manorRun.loot) ? raw.manorRun.loot : []).filter((x, i, all) => all.some(y => y?.claimed) ? x === all.find(y => y?.claimed) : i === 0).slice(0, 1).map(x => ({ id: prizeID(x.id) || 'espurr', claimed: x.claimed === true })), checkpoint: normalizeCheckpoint(raw.manorRun.checkpoint) };
    }
    if (s.weeklyBox && !s.weeklyClaims.includes(s.weeklyBox.week)) s.weeklyClaims.push(s.weeklyBox.week);
    if (s.manorRun && !s.mazeWeeks.includes(s.manorRun.week)) s.mazeWeeks.push(s.manorRun.week);
    s.journey = normalizeJourney(raw.journey,now);
    claimJourneyRewards(s);
    const oldOutfit = { ribbon: 'sunday', hearts: 'sunday', garden: 'espeon', moon: 'akali', starlight: 'cozy' }[raw.outfit] || raw.outfit;
    s.outfit = unlockedOutfits(s).includes(oldOutfit) && OUTFITS.find(o => o.id === oldOutfit)?.image ? oldOutfit : 'royal';
    s.room = unlockedRooms(s).includes(raw.room) ? raw.room : 'lavender';
    return s;
}
export function normalizeCheckpoint(c) {
    if (!c || typeof c !== 'object')
        return null;
    const position = p => ({ x: Math.max(50, Math.min(950, number(p?.x, 1000) || 100)), y: Math.max(50, Math.min(710, number(p?.y, 760) || 380)), facing: p?.facing === -1 ? -1 : 1, facingY: p?.facingY === -1 ? -1 : 0 });
    return { player: position(c.player), hunter: position(c.hunter), hp: Math.max(1, Math.min(3, integer(c.hp) || 3)), stamina: number(c.stamina, 100), charges: integer(c.charges, 3), elapsed: number(c.elapsed, 86400), rescued: c.rescued === true, machines: Array.from({ length: 3 }, (_, i) => number(c.machines?.[i], 40)), pallets: Array.from({ length: 3 }, (_, i) => c.pallets?.[i] === true) };
}
export function validState(raw) {
    if (!raw || typeof raw !== 'object' || !Number.isSafeInteger(raw.chips) || raw.chips < 0 || raw.chips > 1e6 || !Array.isArray(raw.prizes) || raw.prizes.length > PRIZES.length + 1 || new Set(raw.prizes).size !== raw.prizes.length || !raw.prizes.every(id => knownPrize(id) || OLD_IDS.has(id)) || !Array.isArray(raw.shelf) || raw.shelf.length !== 4 || !raw.shelf.every(id => id === null || raw.prizes.includes(id)))
        return false;
    if (raw.journey !== undefined && !validJourney(raw.journey)) return false;
    if (raw.manorPeanut && (typeof raw.manorPeanut.found !== 'boolean' || !Number.isSafeInteger(raw.manorPeanut.count) || raw.manorPeanut.count < 0 || raw.manorPeanut.count > 1e9)) return false;
    if (![2, 3].includes(raw.version))
        return true;
    if (raw.stats?.cardRounds !== undefined && (!Number.isSafeInteger(raw.stats.cardRounds) || raw.stats.cardRounds < 0 || raw.stats.cardRounds > 1e9)) return false;
    if (raw.room !== undefined && !ROOMS.some(r => r.id === raw.room) && !['bestbuy','moon'].includes(raw.room)) return false;
    if (raw.clicker?.skin !== undefined && raw.clicker.skin!=='bunny' && !SQUISHIES.some(x=>x.id===raw.clicker.skin)) return false;
    if(raw.clicker?.ownedSkins!==undefined&&(!Array.isArray(raw.clicker.ownedSkins)||raw.clicker.ownedSkins.length>7||raw.clicker.ownedSkins.some(x=>!SQUISHIES.some(y=>y.id===x))))return false;
    if(raw.tradeWeeks!==undefined&&(!Array.isArray(raw.tradeWeeks)||raw.tradeWeeks.some(x=>!Number.isInteger(x)||x<1||x>52)))return false;
    if(raw.collectionHistory!==undefined&&(!Array.isArray(raw.collectionHistory)||raw.collectionHistory.length>22||raw.collectionHistory.some(x=>!knownPrize(x))))return false;
    const statKeys = raw.version === 3 ? ['rounds', 'cardWins', 'boxes', 'manorWins', 'bestBank'] : ['rounds', 'cardWins', 'boxes', 'manorWins'];
    for (const k of statKeys)
        if (!Number.isSafeInteger(raw.stats?.[k]) || raw.stats[k] < 0 || raw.stats[k] > 1e9)
            return false;
    for (const k of ['balance', 'lifetime', 'manual', 'lastTick'])
        if (!Number.isFinite(raw.clicker?.[k]) || raw.clicker[k] < 0 || raw.clicker[k] > (k === 'lastTick' ? 1e14 : MAX_CRUNCHES))
            return false;
    for (const u of UPGRADES)
        if (!(['roaster','caramel','delivery','musicbox'].includes(u.id) && raw.clicker?.upgrades?.[u.id] === undefined) && (!Number.isInteger(raw.clicker?.upgrades?.[u.id]) || raw.clicker.upgrades[u.id] < 0 || raw.clicker.upgrades[u.id] > 50))
            return false;
    if (!Array.isArray(raw.weeklyClaims) || raw.weeklyClaims.length > 52 || raw.weeklyClaims.some(n => !Number.isInteger(n) || n < 1 || n > 52))
        return false;
    if (raw.version === 3) {
        if (!OUTFITS.some(o => o.id === raw.outfit) || !Array.isArray(raw.mazeWeeks) || raw.mazeWeeks.length > 52 || raw.mazeWeeks.some(n => !Number.isInteger(n) || n < 1 || n > 52))
            return false;
        if (raw.weeklyBox && (!weeks([raw.weeklyBox.week]).length || !knownPrize(raw.weeklyBox.id) || typeof raw.weeklyBox.revealed !== 'boolean'))
            return false;
        if (raw.manorRun && (!weeks([raw.manorRun.week]).length || !['active', 'won', 'lost'].includes(raw.manorRun.status) || !Array.isArray(raw.manorRun.loot) || raw.manorRun.loot.length > 5 || raw.manorRun.loot.some(x => !x || !knownPrize(x.id) || typeof x.claimed !== 'boolean') || (JSON.stringify(raw.manorRun.checkpoint) || '').length > 4000))
            return false;
    }
    return true;
}
export function passiveRate(s) { const u=s.clicker.upgrades; return (u.helpers + u.press*7 + u.factory*40 + (u.roaster||0)*15 + (u.delivery||0)*60)*(1+(u.musicbox||0)*.1); }
export function tapPower(s) { return 1 + s.clicker.upgrades.fingers + (s.clicker.upgrades.caramel||0)*8; }
export function upgradeCost(s, id) { const u = UPGRADES.find(u => u.id === id); return Math.ceil(u.base * Math.pow(1.5, s.clicker.upgrades[id])); }
export function addCrunches(s, amount) { const n = Math.max(0, Math.min(amount, MAX_CRUNCHES - s.clicker.lifetime, MAX_CRUNCHES - s.clicker.balance)); s.clicker.balance += n; s.clicker.lifetime += n; return n; }
export function tick(s, now = Date.now()) { const sec = Math.min(14400, Math.max(0, (now - s.clicker.lastTick) / 1000)); s.clicker.lastTick = now; return addCrunches(s, sec * passiveRate(s)); }
export function buyUpgrade(s, id) { const cost = upgradeCost(s, id); if (s.clicker.balance < cost || s.clicker.upgrades[id] >= 50)
    return false; s.clicker.balance -= cost; s.clicker.upgrades[id]++; return true; }
export function centralDate(now=Date.now()){const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(now)),p=t=>Number(parts.find(x=>x.type===t).value);return Date.UTC(p('year'),p('month')-1,p('day'));}
export function weekNumber(now=Date.now()){return Math.max(1,Math.min(52,2+Math.floor((centralDate(now)-Date.UTC(2026,10,23))/604800000)));}
export function buySquishy(s,id){const toy=SQUISHIES.find(x=>x.id===id);if(!toy||unlockedSquishies(s).includes(id)||s.clicker.balance<toy.goal)return false;s.clicker.balance-=toy.goal;s.clicker.ownedSkins??=['peanut'];s.clicker.ownedSkins.push(id);s.clicker.skin=id;return true;}
export function tradeCollectibles(s,ids,week=weekNumber(),random=Math.random){if((s.tradeWeeks||[]).includes(week)||ids.length!==3||new Set(ids).size!==3||!ids.every(x=>s.prizes.includes(x)))return null;
 s.collectionHistory=[...new Set([...(s.collectionHistory||[]),...s.prizes])];s.prizes=s.prizes.filter(x=>!ids.includes(x));s.shelf=s.shelf.map(x=>ids.includes(x)?null:x);s.tradeWeeks??=[];s.tradeWeeks.push(week);const id=PRIZES[Math.min(PRIZES.length-1,Math.floor(random()*PRIZES.length))].id;const isNew=awardPrize(s,id);recordJourney(s,'wish');return {id,isNew};}

export function awardPrize(s, id) { s.collectionHistory=[...new Set([...(s.collectionHistory||[]),id])];if (s.prizes.includes(id))
    return false; s.prizes.push(id); const slot = s.shelf.indexOf(null); if (slot >= 0)
    s.shelf[slot] = id; return true; }
export function startBox(s, week, random = Math.random) { if (s.weeklyBox && !s.weeklyBox.revealed)
    return s.weeklyBox; if (s.weeklyClaims.includes(week))
    return null; s.weeklyClaims.push(week); s.weeklyBox = { week, id: PRIZES[Math.min(PRIZES.length - 1, Math.floor(random() * PRIZES.length))].id, revealed: false }; return s.weeklyBox; }
export function revealBox(s) { const box = s.weeklyBox; if (!box || box.revealed)
    return null; box.revealed = true; s.stats.boxes++; s.stats.rounds++; recordJourney(s,'box'); return { id: box.id, isNew: awardPrize(s, box.id) }; }
export function beginMaze(s, week, random = Math.random) { if (s.manorRun?.status === 'active')
    return s.manorRun; if (s.mazeWeeks.includes(week))
    return null; s.mazeWeeks.push(week); s.manorRun = { week, status: 'active', loot: Array.from({ length: 1 }, () => ({ id: PRIZES[Math.min(PRIZES.length - 1, Math.floor(random() * PRIZES.length))].id, claimed: false })), checkpoint: null }; recordJourney(s,'maze-start'); return s.manorRun; }
export function claimMazePrize(s, index) { const loot = s.manorRun?.status === 'active' && s.manorRun.loot[index]; if (!loot || loot.claimed || s.manorRun.loot.some(x => x.claimed))
    return null; loot.claimed = true; return { id: loot.id, isNew: awardPrize(s, loot.id) }; }
export function handTotal(cards) { let n = cards.reduce((n, c) => n + Math.min(c.rank, 10), 0); if (cards.some(c => c.rank === 1) && n + 10 <= 21)
    n += 10; return n; }

export function testingState(now = Date.now()) { const s = freshState(now); s.chips = s.stats.bestBank = 1000; s.stats.boxes = 5; s.stats.manorWins = 5; s.stats.cardRounds = 10; s.stats.cardWins = 30; s.clicker.ownedSkins=SQUISHIES.map(x=>x.id); s.clicker.balance = s.clicker.lifetime = s.clicker.manual = 250000000; s.manorPeanut.found = true; s.clicker.upgrades.helpers = 10; s.prizes = PRIZES.map(p => p.id); s.shelf = s.prizes.slice(0, 4); for(let i=55;i>=0;i--){const at=centralDate(now)-i*86400000,day=dayKey(at+43200000);s.journey.cardDays[day]=5;s.journey.squishDays[day]=100;s.journey.playDays.push(day);if(i%7===0){const week=mondayKey(at+43200000);for(const key of ['boxWeeks','mazeWeeks','escapeWeeks'])s.journey[key].push(week)}}claimJourneyRewards(s);return s; }

// A new collection may enter the cabinet, but needs three different treasures to wish.
export function cabinetStatus(s,week=weekNumber()) {
 const used=(s.tradeWeeks||[]).includes(week),owned=new Set((s.prizes||[]).filter(id=>PRIZES.some(p=>p.id===id))).size;
 return {used,owned,canEnter:!used,canExchange:!used&&owned>=3,needed:Math.max(0,3-owned)};
}

// Long-term rewards use non-consecutive Central-time days and Monday weeks.
// Future outfits/rooms can reuse challengeProgress with their own requirement list.
export const OUTFIT_CHALLENGES = {
 'jubilee': [['sparkleDays',7]],
 'jubilee-midnight': [['escapeWeeks',8],['playDays',21],['jubilee',1]],
 'rafayel': [['playDays',14],['cozyDays',6]],
 'pokemon-pack': [['boxWeeks',4],['playDays',14]],
 'firestarter': [['tableWeeks',5],['wins',30]],
 'reze': [['cozyDays',10],['mazeWeeks',2]],
 'cissia': [['mazeWeeks',4],['playDays',12]]
};
export const JOURNEY_LABELS = {sparkleDays:'Sparkle days · finish 5 hands',cozyDays:'Cozy days · 100 hands-on squishes',playDays:'Play days',escapeWeeks:'Weeks with an escape',boxWeeks:'Weeks with a box opened',mazeWeeks:'Weeks visiting Ann',tableWeeks:'Weeks with 5 finished hands',wins:'Hands won',jubilee:'Jubilee outfit earned'};
export function freshJourney(){return {version:1,cardDays:{},squishDays:{},playDays:[],boxWeeks:[],mazeWeeks:[],escapeWeeks:[],earnedOutfits:[]};}
export function dayKey(now=Date.now()){return new Date(centralDate(now)).toISOString().slice(0,10);}
export function mondayKey(now=Date.now()){const day=centralDate(now),dow=new Date(day).getUTCDay();return new Date(day-((dow+6)%7)*86400000).toISOString().slice(0,10);}
const dateKey=value=>typeof value==='string'&&/^20\d\d-\d\d-\d\d$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
function validJourney(j){if(!j||typeof j!=='object'||Array.isArray(j)||j.version!==1)return false;for(const [key,max] of [['cardDays',5],['squishDays',100]]){const map=j[key];if(!map||typeof map!=='object'||Array.isArray(map)||Object.keys(map).length>400||Object.entries(map).some(([d,n])=>!dateKey(d)||!Number.isInteger(n)||n<0||n>max))return false;}for(const key of ['playDays','boxWeeks','mazeWeeks','escapeWeeks'])if(!Array.isArray(j[key])||j[key].length>400||j[key].some(d=>!dateKey(d)))return false;return Array.isArray(j.earnedOutfits)&&j.earnedOutfits.length<=Object.keys(OUTFIT_CHALLENGES).length&&j.earnedOutfits.every(id=>Object.hasOwn(OUTFIT_CHALLENGES,id));}
function normalizeJourney(raw,now){const j=freshJourney();if(!raw||typeof raw!=='object')return j;const today=dayKey(now),clean=list=>[...new Set((Array.isArray(list)?list:[]).filter(d=>dateKey(d)&&d<=today))].sort().slice(-400);for(const [key,max] of [['cardDays',5],['squishDays',100]]){const input=raw[key];if(input&&typeof input==='object'&&!Array.isArray(input))for(const day of Object.keys(input).filter(d=>dateKey(d)&&d<=today).sort().slice(-400))j[key][day]=integer(input[day],max);}j.playDays=clean(raw.playDays);for(const key of ['boxWeeks','mazeWeeks','escapeWeeks'])j[key]=clean(raw[key]).filter(d=>new Date(d).getUTCDay()===1);j.earnedOutfits=[...new Set((Array.isArray(raw.earnedOutfits)?raw.earnedOutfits:[]).filter(id=>Object.hasOwn(OUTFIT_CHALLENGES,id)))];return j;}
export function journeyCounts(s){const j=s.journey||freshJourney(),cards=Object.values(j.cardDays),weekly={};for(const [day,count] of Object.entries(j.cardDays)) {const week=mondayKey(Date.parse(day)+43200000);weekly[week]=(weekly[week]||0)+count;}const sparkleDays=cards.filter(n=>n>=5).length;return {sparkleDays,cozyDays:Object.values(j.squishDays).filter(n=>n>=100).length,playDays:j.playDays.length,tableWeeks:Object.values(weekly).filter(n=>n>=5).length,boxWeeks:j.boxWeeks.length,mazeWeeks:j.mazeWeeks.length,escapeWeeks:j.escapeWeeks.length,wins:s.stats.cardWins,jubilee:sparkleDays>=7||j.earnedOutfits.includes('jubilee')?1:0};}
export function challengeProgress(s,requirements){const counts=journeyCounts(s);return requirements.map(([metric,goal])=>({metric,goal,value:Math.min(goal,counts[metric]||0),label:JOURNEY_LABELS[metric]}));}
export function outfitProgress(s,id){return challengeProgress(s,OUTFIT_CHALLENGES[id]||[]);}
function claimJourneyRewards(s){s.journey??=freshJourney();for(const [id,requirements] of Object.entries(OUTFIT_CHALLENGES))if(!s.journey.earnedOutfits.includes(id)&&challengeProgress(s,requirements).every(g=>g.value>=g.goal))s.journey.earnedOutfits.push(id);}
export function recordJourney(s,event,now=Date.now()){
 if(!['card','squish','box','maze-start','maze-win','maze-loss','wish'].includes(event))return;
 s.journey??=freshJourney();const j=s.journey,day=dayKey(now),week=mondayKey(now),mark=(key,value)=>{if(!j[key].includes(value)){j[key].push(value);j[key].sort();if(j[key].length>400)j[key].shift();}};
 if(event==='card'){j.cardDays[day]=Math.min(5,(j.cardDays[day]||0)+1);if(j.cardDays[day]>=3)mark('playDays',day);}
 if(event==='squish'){if(j.squishDays[day]>=100)return;j.squishDays[day]=Math.min(100,(j.squishDays[day]||0)+1);if(j.squishDays[day]>=100)mark('playDays',day);}
 if(event==='box'){mark('boxWeeks',week);mark('playDays',day);}
 if(event==='maze-start')mark('mazeWeeks',week);
 if(event==='maze-win'){mark('escapeWeeks',week);mark('playDays',day);}
 if(event==='maze-loss'||event==='wish')mark('playDays',day);
 for(const key of ['cardDays','squishDays']){const dates=Object.keys(j[key]).sort();for(const old of dates.slice(0,Math.max(0,dates.length-400)))delete j[key][old];}
 claimJourneyRewards(s);
}
