import {cleanCompanion, validCompanion} from './companion-model.js';
import {weeklyHunt, normalizeHunt} from './hunt-config.js';
export const ROOMS = [
 {id:'lavender',name:'Lavender daydream',hint:'Your first little room',wall:'#e5cef1',floor:'#c3a1d8'},
 {id:'cafe',name:'7 Brew coffee stop',hint:'Own all seven squishies',wall:'#c2d6eb',floor:'#b2b2c8',image:'assets/images/rooms/brew.webp'},
 {id:'garden',name:'Lily-of-the-valley garden',hint:'Join IDV Hunt once',wall:'#d1e7dc',floor:'#8cb6a0',image:'assets/images/rooms/lilies.webp'},
 {id:'cards',name:'Pokémon card shop',hint:'Make 1,000,000 lifetime squishes',wall:'#dbc8ed',floor:'#af8dbd',image:'assets/images/rooms/cards.webp'},
 {id:'popmart',name:'Pop Mart date',hint:'Open 3 weekly blind boxes',wall:'#efd0e3',floor:'#c8a2b9',image:'assets/images/rooms/popmart.webp'},
 {id:'sunday',name:'Sunday’s quiet sanctuary',hint:'Reach 3,500 in Princess Drop',wall:'#d9dfef',floor:'#c3b4d2',image:'assets/images/rooms/sunday.webp'},
{id:'gambit',name:'Gambit’s card lounge',hint:'Finish 150 blackjack hands and reach a best table score of 500',wall:'#dcc9e9',floor:'#b49ac4',image:'assets/images/rooms/gambit.webp'},{id:'minecraft',name:'Block-built daydream',hint:'Log in on 15 days',wall:'#dcc9e9',floor:'#b49ac4',image:'assets/images/rooms/minecraft.webp'},{id:'manor',name:'Moonlit manor',hint:'Join IDV Hunt 12 times',wall:'#dcc9e9',floor:'#b49ac4',image:'assets/images/rooms/manor.webp'},{id:'restaurant',name:'Dinner date at P.F. Chang’s',hint:'Log in on 30 days',wall:'#dcc9e9',floor:'#b49ac4',image:'assets/images/rooms/restaurant.webp'},
 {id:'hotpot',name:'A cozy hotpot date',hint:'Play Princess Drop once',wall:'#f1d2e4',floor:'#cba5cb',image:'assets/images/rooms/hotpot.webp'}
];
export function unlockedRooms(s,counts=journeyCounts(s)){return ROOMS.filter(r=>(s.grantedRooms||[]).includes(r.id)||roomProgress(s,r.id,counts).every(g=>g.value>=g.goal)).map(r=>r.id).filter(id=>!(s.tradedRooms||[]).includes(id)&&!sacrificeLocked(s,'room',id));}
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
    ['blondie', 'Blondie coffee'], ['rafayel', 'Rafayel plushie'], ['mitski', 'Mitski record'], ['rogue', 'Pocket Rogue Espurr'], ['furina', 'Furina plushie'], ['emil', 'Emil plushie'],
    ['creeper', 'Creeper plushie'], ['laufey', 'Laufey album'], ['ascended-heroes', 'Ascended Heroes ETB'], ['water', 'A little glass of water'], ['ada-plush', 'Ada plushie'], ['dior', 'Dior blush & lipstick kit'], ['skims-calendar', 'SKIMS advent calendar'], ['melon', 'A sweet little melon'], ['flowerknows', 'Flower Knows advent calendar'], ['akali-tokidoki', 'POP/STARS Akali tokidoki'], ['akali-firestarter-tokidoki', 'FIRESTARTER Akali tokidoki'], ['mimikyu', 'Mimikyu plushie'], ['hotpot-ramen', 'Cozy ramen hotpot'], ['sylveon-plush', 'Sylveon plushie'], ['espeon-plush', 'Espeon plushie'], ['pecans', 'Buc-ee’s roasted pecans'], ['denji', 'Denji plushie'], ['tacobell', 'Taco Bell treat box']
].map(([id, name]) => ({ id, name, image: id === 'espurr' ? 'assets/images/espurr-princess.webp' : `assets/images/collectibles/${id}.${['pokemon','gambit','mew'].includes(id) ? 'svg' : 'webp'}` }));
export const WEATHER_KEYS=["sun", "cloud", "rain", "storm", "wind", "cold", "snow", "night"];
export const WEATHER_NAMES=["Sunbeam princess", "Cloud cuddle cardigan", "Rainy-day ribbon", "Thunderlight cape", "Little breeze explorer", "Frosty rose coat", "Snowflake princess", "Moonbeam dreamer"];
export const OUTFITS = [
    { id: 'royal', name: 'My little princess', hint: 'Yours from the beginning', icon: '♛', image: 'assets/images/espurr-princess.webp' },
    { id: 'sunday', name: 'Sunday’s little angel', hint: 'Reach a best card-table score of 200', icon: '☀', image: 'assets/images/outfits/sunday.webp' },
    { id: 'cozy', name: 'Peanut crunchy PJs', hint: 'Make 500 lifetime crunches', icon: '🥜', image: 'assets/images/outfits/cozy.webp' },
    { id: 'espeon', name: 'Espeon daydream', hint: 'Open your first weekly blind box', icon: '🔮', image: 'assets/images/outfits/espeon.webp' },
    { id: 'akali', name: 'Akali’s little rogue', hint: 'Escape IDV Hunt once', icon: '✦', image: 'assets/images/outfits/akali.webp' },
    { id: 'kda', name: 'K/DA princess', hint: 'Escape IDV Hunt 5 times', icon: '♫', image: 'assets/images/outfits/kda.webp' },
    { id: 'furina', name: 'Furina cosplay', hint: 'Play the card table at least once', icon: '♧', image: 'assets/images/outfits/furina.webp' },
    { id: 'rogue', name: 'Rogue cosplay', hint: 'Open 5 weekly blind boxes', icon: '✦', image: 'assets/images/outfits/rogue.webp' },
    { id: 'ada', name: 'Ada Mesmer cosplay', hint: 'Make 1,000,000 lifetime squishes', icon: '♡', image: 'assets/images/outfits/ada.webp' },
    {"id": "jubilee", "name": "Jubilee · Sparkle princess", "hint": "Log in on 15 days", "icon": "✧", "image": "assets/images/outfits/jubilee.webp"},
    {"id": "jubilee-midnight", "name": "Jubilee · Midnight Mutant", "hint": "Log in on 30 days", "icon": "☾", "image": "assets/images/outfits/jubilee-midnight.webp"},
    {"id": "rafayel", "name": "Rafayel’s little artist", "hint": "Reach 2,000 sparkle points in Princess Drop", "icon": "🎨", "image": "assets/images/outfits/rafayel.webp"},
    {"id": "pokemon-pack", "name": "Princess booster pack", "hint": "Open 10 weekly blind boxes", "icon": "◇", "image": "assets/images/outfits/pokemon-pack.webp"},
    {"id": "firestarter", "name": "K/DA Firestarter", "hint": "Own all seven squishies and log in on 15 days", "icon": "🔥", "image": "assets/images/outfits/firestarter.webp"},
    {"id": "reze", "name": "Reze", "hint": "Escape IDV Hunt 10 times", "icon": "☂", "image": "assets/images/outfits/reze.webp"},
    {"id": "cissia", "name": "Cissia · Little case specialist", "hint": "Make 5 cabinet wishes and 3 roulette wishes", "icon": "✦", "image": "assets/images/outfits/cissia.webp"}
].concat(WEATHER_KEYS.map((key,i)=>({id:'weather-'+key,name:WEATHER_NAMES[i],hint:'Unlocks automatically when Espurr checks '+(key==='night'?'nighttime':key==='sun'?'sunny':key==='cloud'?'cloudy':key==='cold'?'cold (below 46°F / 8°C)':key==='wind'?'windy (22 mph / 35 km/h or more)':key==='snow'?'snowy':key==='storm'?'thunderstorm':'rainy')+' weather',icon:'☁',image:'assets/images/outfits/weather-'+key+'.webp'})));
export const ADVENT_GIFTS={"1": {"kind": "outfit", "id": "weather-night", "name": "Moonbeam dreamer", "ready": true}, "2": {"kind": "room", "id": "christmas-room", "name": "Christmas at the Palace", "ready": true}, "3": {"kind": "collectible", "id": "brew-mug", "name": "7 Brew keepsake mug", "ready": true}, "4": {"kind": "collectible", "id": "miku-xmas", "name": "Christmas Miku plushie", "ready": true}, "5": {"kind": "collectible", "id": "mimikyu-xmas", "name": "Christmas Mimikyu plushie", "ready": true}, "6": {"kind": "outfit", "id": "espurr-xmas", "name": "Christmas princess", "ready": true}, "8": {"kind": "collectible", "id": "nightcrawler", "name": "Nightcrawler plushie", "ready": true}, "9": {"kind": "collectible", "id": "sunday-xmas", "name": "Christmas Sunday plushie", "ready": true}, "10": {"kind": "collectible", "id": "damon-plush", "name": "Damon Salvatore plushie", "ready": true}, "11": {"kind": "room", "id": "damon-room", "name": "Salvatore fireside", "ready": true}, "12": {"kind": "outfit", "id": "damon-outfit", "name": "Mystic Falls princess", "ready": true}, "13": {"kind": "collectible", "id": "butter-gift", "name": "Butter squishy keepsake", "ready": true}, "15": {"kind": "collectible", "id": "jack-meal", "name": "Chicken Jr & cheesy curly fries", "ready": true}, "16": {"kind": "collectible", "id": "cloak-dagger", "name": "Cloak & Dagger dreamy duo plushies", "ready": true}, "18": {"kind": "collectible", "id": "sombr-album", "name": "sombr vinyl keepsake", "ready": true}, "19": {"kind": "collectible", "id": "varesa", "name": "Varesa plushie", "ready": true}, "20": {"kind": "collectible", "id": "cartman-plush", "name": "Cartman plushie", "ready": true}, "21": {"kind": "room", "id": "cartman-room", "name": "A little South Park winter", "ready": true}, "22": {"kind": "outfit", "id": "cartman-outfit", "name": "South Park snow day", "ready": true}, "23": {"kind": "room", "id": "german-command-bunker", "name": "WWII War Room · Nazi Germany", "ready": true, "description": "A fictionalized German command bunker from World War II."}, "25": {"kind": "outfit", "id": "hitler-espurr", "name": "Espurr · Hitler period costume", "ready": true, "description": "An Espurr costume based on Hitler’s wartime clothing."}, "24": {"kind": "collectible", "id": "hitler-plush", "name": "Adolf Hitler plushie", "ready": true, "description": "A fabric interpretation of Adolf Hitler, dictator of Nazi Germany."}};
for(const [day,g]of Object.entries(ADVENT_GIFTS)){if(!g.ready)continue;const items=g.kind==='outfit'?OUTFITS:g.kind==='room'?ROOMS:PRIZES;const old=items.find(x=>x.id===g.id);if(old){old.adventDay=Number(day);old.hint='Winter 2026 · December '+day;}else items.push({...g,adventDay:Number(day),hint:'Winter 2026 · December '+day,image:'assets/images/'+(g.kind==='outfit'?'outfits':g.kind==='room'?'rooms':'collectibles')+'/'+g.id+'.webp',wall:'#e5cef1',floor:'#c3a1d8'});}
export const GAME_PRIZES=PRIZES.filter(x=>!x.adventDay);
const TRADABLE_PRIZES = new Set(GAME_PRIZES.map(item => item.id));
export const ADVENT_NOTE_DAYS = [7, 14, 17];
const ADVENT_ORDER = 2;

function cleanAdvent(saved) {
    const days = Array.isArray(saved?.days) ? saved.days : [];
    const updated = days.filter(day => Number.isInteger(day) && day >= 1 && day <= 25)
        .map(day => saved.order === ADVENT_ORDER ? day : day === 23 ? 24 : day === 24 ? 23 : day);
    return { year: 2026, order: ADVENT_ORDER, days: [...new Set(updated)].sort((a, b) => a - b) };
}

export function adventAvailable(day, preview = false, now = Date.now()) {
    if (!Number.isInteger(day) || day < 1 || day > 25) return false;
    const date = dayKey(now);
    return preview || (date >= '2026-12-' + String(day).padStart(2, '0') && date <= '2026-12-31');
}

export function claimAdvent(s, day, preview = false, now = Date.now()) {
    const gift = ADVENT_GIFTS[day];
    if ((!gift?.ready && !ADVENT_NOTE_DAYS.includes(day)) || !adventAvailable(day, preview, now)) return null;
    s.advent = cleanAdvent(s.advent);
    if (s.advent.days.includes(day)) return null;
    s.advent.days.push(day);
    s.advent.days.sort((a, b) => a - b);
    if (gift) grantItem(s, gift.kind, gift.id);
    return gift || { kind: 'note' };
}

export function keepAdventClaims(target, previous) {
    const days = [...cleanAdvent(target.advent).days, ...cleanAdvent(previous?.advent).days];
    target.advent = cleanAdvent({ order: ADVENT_ORDER, days });
    for (const day of target.advent.days) {
        const gift = ADVENT_GIFTS[day];
        if (gift?.ready) grantItem(target, gift.kind, gift.id);
    }
}

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
    return { version: 3, advent:cleanAdvent(), companion:cleanCompanion(), roomDesigns: [], tradedRooms: [], tradedOutfits: [], sacrificeUntil:{}, cabinetWeeks:{}, rouletteWeeks: {}, rouletteResult: null, dropRuns: {}, grantedRooms: [], grantedOutfits: [], journey: freshJourney(), room: 'lavender', chips: 100, prizes: [], shelf: [null, null, null, null], outfit: 'royal', tradeWeeks: [], collectionHistory: [], weeklyClaims: [], mazeWeeks: [], weeklyBox: null, manorRun: null, manorPeanut: {found: false, count: 0}, stats: { rounds: 0, cardRounds: 0, cardWins: 0, boxes: 0, manorWins: 0, bestBank: 100, bestDrop:0, wishes:0,roulette:0,hunts:0,dropPlays:0,blackjackHands:0 }, clicker: { balance: 0, lifetime: 0, manual: 0, skin: 'peanut', ownedSkins: ['peanut'], upgrades: { fingers: 0, helpers: 0, press: 0, factory: 0, roaster: 0, caramel: 0, delivery: 0, musicbox: 0 }, lastTick: now } };
}
export function unlockedOutfits(s,counts=journeyCounts(s)) { return OUTFITS.filter(o => (s.grantedOutfits||[]).includes(o.id) || o.id === 'royal' || o.id === 'sunday' && s.stats.bestBank >= 200 || o.id === 'cozy' && s.clicker.lifetime >= 500 || o.id === 'espeon' && s.stats.boxes >= 1 || o.id === 'akali' && s.stats.manorWins >= 1 || o.id === 'kda' && s.stats.manorWins >= 5 || o.id === 'furina' && s.stats.cardRounds >= 1 || o.id === 'rogue' && s.stats.boxes >= 5 || o.id === 'ada' && s.clicker.lifetime >= 1000000 || OUTFIT_CHALLENGES[o.id] && ((s.journey?.earnedOutfits||[]).includes(o.id) || outfitProgress(s,o.id,counts).every(g=>g.value>=g.goal))).map(o => o.id).filter(id=>!(s.tradedOutfits||[]).includes(id)&&!sacrificeLocked(s,'outfit',id)); }
export function normalizeState(raw, now = Date.now()) {
    const s = freshState(now);
    s.advent = cleanAdvent(raw?.advent);
    if (!raw || typeof raw !== 'object')
        return s;
    s.companion=cleanCompanion(raw.companion);
    s.manorPeanut = {found: raw.manorPeanut?.found === true, count: integer(raw.manorPeanut?.count)};
    s.chips = Number.isSafeInteger(raw.chips) ? integer(raw.chips, 1e6) : 100;
    s.sacrificeUntil = cleanSacrifices(raw.sacrificeUntil, now);
    s.prizes = [...new Set((Array.isArray(raw.prizes) ? raw.prizes : []).map(prizeID).filter(Boolean))];
    s.shelf = Array.from({ length: 4 }, (_, i) => { const id = prizeID(raw.shelf?.[i]); return s.prizes.includes(id) ? id : null; });
    for (const k of Object.keys(s.stats))
        s.stats[k] = integer(raw.stats?.[k]);
    // Old saves lack cardRounds; a recorded win proves the table has been played.
    if(raw.stats?.blackjackHands===undefined)s.stats.blackjackHands=Math.min(integer(raw.stats?.cardRounds),Math.max(0,integer(raw.stats?.rounds)-integer(raw.stats?.boxes)-Math.max(0,weeks(raw.mazeWeeks).length-(raw.manorRun?.status==='active'?1:0))));
    s.stats.cardRounds = Math.max(s.stats.cardRounds, s.stats.cardWins > 0 ? 1 : 0);
    s.stats.bestDrop=integer(raw.stats?.bestDrop,1e6);
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
        s.manorRun = { peanutSeed:integer(raw.manorRun.peanutSeed,1e6), hunt: normalizeHunt(raw.manorRun.hunt), outfit: OUTFITS.some(o=>o.id===raw.manorRun.outfit)?raw.manorRun.outfit:raw.outfit||'royal', week: raw.manorRun.week, status: raw.manorRun.status, loot: (Array.isArray(raw.manorRun.loot) ? raw.manorRun.loot : []).filter((x, i, all) => all.some(y => y?.claimed) ? x === all.find(y => y?.claimed) : i === 0).slice(0, 1).map(x => ({ id: prizeID(x.id) || 'espurr', claimed: x.claimed === true })), checkpoint: normalizeCheckpoint(raw.manorRun.checkpoint) };
    }
    if (s.weeklyBox && !s.weeklyClaims.includes(s.weeklyBox.week)) s.weeklyClaims.push(s.weeklyBox.week);
    if (s.manorRun && !s.mazeWeeks.includes(s.manorRun.week)) s.mazeWeeks.push(s.manorRun.week);
    s.roomDesigns=cleanDesigns(raw.roomDesigns);
    s.cabinetWeeks = cleanWeekMap(raw.cabinetWeeks, n=>integer(n,2));
    s.stats.wishes=Math.max(s.stats.wishes,s.tradeWeeks.length);
    s.rouletteWeeks = cleanWeekMap(raw.rouletteWeeks, n=>integer(n,3));
    s.rouletteResult = cleanRoulette(raw.rouletteResult);
    s.dropRuns = cleanWeekMap(raw.dropRuns, cleanDrop);s.stats.bestDrop=Math.max(s.stats.bestDrop,...Object.values(s.dropRuns).map(r=>integer(r.score,1e6)));const activeWeeks=Object.keys(s.dropRuns).filter(k=>s.dropRuns[k].status==='active').sort();for(const old of activeWeeks.slice(0,-1)){s.dropRuns[old].status='lost';s.dropRuns[old].pieces=[];}
    s.tradedRooms=cleanGrants(raw.tradedRooms,ROOMS).filter(id=>id!=='lavender');s.tradedOutfits=cleanGrants(raw.tradedOutfits,OUTFITS).filter(id=>id!=='royal');
    s.grantedRooms = cleanGrants(raw.grantedRooms,ROOMS).filter(id=>!sacrificeLocked(s,'room',id,now));
    s.grantedOutfits = cleanGrants(raw.grantedOutfits,OUTFITS).filter(id=>!sacrificeLocked(s,'outfit',id,now));
    keepAdventClaims(s);
    s.journey = normalizeJourney(raw.journey,now);
    const counts = journeyCounts(s);
    claimJourneyRewards(s, counts);
    if (s.journey.earnedOutfits.includes('jubilee')) counts.jubilee = 1;
    const outfits = unlockedOutfits(s, counts);
    const oldOutfit = { ribbon: 'sunday', hearts: 'sunday', garden: 'espeon', moon: 'akali', starlight: 'cozy' }[raw.outfit] || raw.outfit;
    s.outfit = outfits.includes(oldOutfit) && OUTFITS.find(o => o.id === oldOutfit)?.image ? oldOutfit : 'royal';
    s.room = unlockedRooms(s, counts).includes(raw.room) ? raw.room : 'lavender';
    if (s.manorRun?.status === 'active' && !outfits.includes(s.manorRun.outfit)) s.manorRun.outfit = s.outfit;
    return s;
}
export function cleanDesigns(value){return (Array.isArray(value)?value:[]).slice(0,6).filter(d=>d&&typeof d.id==='string'&&d.id.length<=80&&typeof d.name==='string'&&ROOMS.some(r=>r.id===d.room)&&OUTFITS.some(o=>o.id===d.outfit)&&Array.isArray(d.shelf)&&d.shelf.length===4&&d.shelf.every(id=>id===null||PRIZES.some(p=>p.id===id))).map(d=>({id:d.id,name:d.name.trim().slice(0,40),room:d.room,outfit:d.outfit,shelf:[...d.shelf]})).filter((d,i,a)=>d.name&&a.findIndex(x=>x.id===d.id)===i);}
export function normalizeCheckpoint(c) {
    if (!c || typeof c !== 'object')
        return null;
    const position = p => ({ x: Math.max(50, Math.min(950, number(p?.x, 1000) || 100)), y: Math.max(50, Math.min(710, number(p?.y, 760) || 380)), facing: p?.facing === -1 ? -1 : 1, facingY: p?.facingY === -1 ? -1 : 0,travelX:Math.max(-1,Math.min(1,Number(p?.travelX)||0)),travelY:Math.max(-1,Math.min(1,Number(p?.travelY)||0)) });
    const caps={hiddenTime:8,swiftTime:8,decodeTime:10,snareTime:3,photoTime:2,rootTime:2,waterTime:1,invincible:7,stunned:5,hazardClock:13,calmTime:6,searchTime:5,noiseTime:5};
    const timers=Object.fromEntries(Object.entries(caps).map(([key,max])=>[key,number(c.timers?.[key]??(key==='hazardClock'?7:key==='calmTime'?6:0),max)]));
    const hazards=(Array.isArray(c.hazards)?c.hazards:[]).slice(0,4).filter(h=>['ann','antonio','joseph','grace'].includes(h?.kind)).map(h=>({...position(h),kind:h.kind,t:number(h.t,9),warmup:1.8,duration:h.kind==='grace'?8.5:4.5,r:h.kind==='grace'?84:h.kind==='joseph'?68:h.kind==='antonio'?64:52,triggered:h.triggered===true,exposure:number(h.exposure,2)}));
    return {timers,hazards,decoy:c.decoy?{...position(c.decoy),life:number(c.decoy.life,8)}:null,lastSeen:c.lastSeen?position(c.lastSeen):null,noiseTarget:c.noiseTarget?position(c.noiseTarget):null,locks:Array.from({length:3},(_,i)=>number(c.locks?.[i],3)),checks:Array.from({length:3},(_,i)=>number(c.checks?.[i]??8,12)), player: position(c.player), hunter: position(c.hunter), hp: Math.max(1, Math.min(3, integer(c.hp) || 3)), stamina: number(c.stamina, 100), charges: integer(c.charges, 3), elapsed: number(c.elapsed, 86400), rescued: c.rescued === true, peanutFound:c.peanutFound===true, machines: Array.from({ length: 3 }, (_, i) => number(c.machines?.[i], 40)), pallets: Array.from({ length: 3 }, (_, i) => c.pallets?.[i] === true) };
}
export function validState(raw) {
    if(raw?.advent!==undefined&&(raw.advent?.year!==2026||raw.advent.order!==undefined&&raw.advent.order!==ADVENT_ORDER||!Array.isArray(raw.advent.days)||raw.advent.days.length>25||new Set(raw.advent.days).size!==raw.advent.days.length||raw.advent.days.some(d=>!Number.isInteger(d)||d<1||d>25)))return false;
    if(raw?.companion!==undefined&&!validCompanion(raw.companion))return false;
    if (!raw || typeof raw !== 'object' || !Number.isSafeInteger(raw.chips) || raw.chips < 0 || raw.chips > 1e6 || !Array.isArray(raw.prizes) || raw.prizes.length > PRIZES.length + 1 || new Set(raw.prizes).size !== raw.prizes.length || !raw.prizes.every(id => knownPrize(id) || OLD_IDS.has(id)) || !Array.isArray(raw.shelf) || raw.shelf.length !== 4 || !raw.shelf.every(id => id === null || raw.prizes.includes(id)))
        return false;
    if(raw.roomDesigns!==undefined&&(!Array.isArray(raw.roomDesigns)||raw.roomDesigns.length>6||cleanDesigns(raw.roomDesigns).length!==raw.roomDesigns.length))return false;
    for(const key of ['wishes','roulette','hunts','dropPlays','blackjackHands'])if(raw.stats?.[key]!==undefined&&(!Number.isSafeInteger(raw.stats[key])||raw.stats[key]<0||raw.stats[key]>1e9))return false;
    if (raw.stats?.bestDrop !== undefined && (!Number.isSafeInteger(raw.stats.bestDrop) || raw.stats.bestDrop < 0 || raw.stats.bestDrop > 1e6)) return false;
    if (!validWeeklyGames(raw)) return false;
    if (raw.journey !== undefined && !validJourney(raw.journey)) return false;
    if (raw.manorPeanut && (typeof raw.manorPeanut.found !== 'boolean' || !Number.isSafeInteger(raw.manorPeanut.count) || raw.manorPeanut.count < 0 || raw.manorPeanut.count > 1e9)) return false;
    if (![2, 3].includes(raw.version))
        return true;
    if (raw.stats?.cardRounds !== undefined && (!Number.isSafeInteger(raw.stats.cardRounds) || raw.stats.cardRounds < 0 || raw.stats.cardRounds > 1e9)) return false;
    if (raw.room !== undefined && !ROOMS.some(r => r.id === raw.room) && !['bestbuy','moon'].includes(raw.room)) return false;
    if (raw.clicker?.skin !== undefined && raw.clicker.skin!=='bunny' && !SQUISHIES.some(x=>x.id===raw.clicker.skin)) return false;
    if(raw.clicker?.ownedSkins!==undefined&&(!Array.isArray(raw.clicker.ownedSkins)||raw.clicker.ownedSkins.length>7||raw.clicker.ownedSkins.some(x=>!SQUISHIES.some(y=>y.id===x))))return false;
    if(raw.tradeWeeks!==undefined&&(!Array.isArray(raw.tradeWeeks)||raw.tradeWeeks.some(x=>!Number.isInteger(x)||x<1||x>52)))return false;
    if(raw.collectionHistory!==undefined&&(!Array.isArray(raw.collectionHistory)||raw.collectionHistory.length>PRIZES.length+1||raw.collectionHistory.some(x=>!knownPrize(x))))return false;
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
const centralFormatter=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'});
export function centralDate(now=Date.now()){const parts=centralFormatter.formatToParts(new Date(now)),p=t=>Number(parts.find(x=>x.type===t).value);return Date.UTC(p('year'),p('month')-1,p('day'));}
export function weekNumber(now=Date.now()){return Math.max(1,Math.min(52,2+Math.floor((centralDate(now)-Date.UTC(2026,10,23))/604800000)));}
export function buySquishy(s,id){const toy=SQUISHIES.find(x=>x.id===id);if(!toy||unlockedSquishies(s).includes(id)||s.clicker.balance<toy.goal)return false;s.clicker.balance-=toy.goal;s.clicker.ownedSkins??=['peanut'];s.clicker.ownedSkins.push(id);s.clicker.skin=id;return true;}
const SACRIFICE_MS = 14 * 86400000;
const tradeKey=(kind,id)=>kind+':'+id;
const validSacrificeKey=(key,allowLegacyCollectibles=false)=>{
 const [kind,id]=key.split(':');
 return key===tradeKey(kind,id) && (kind==='collectible' ? allowLegacyCollectibles&&TRADABLE_PRIZES.has(id)
    : kind==='room' ? id!=='lavender' && ROOMS.some(x=>x.id===id&&!x.adventDay)
    : kind==='outfit' && id!=='royal' && OUTFITS.some(x=>x.id===id&&!x.adventDay));
};
function cleanSacrifices(raw,now=Date.now()){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return {};
 return Object.fromEntries(Object.entries(raw).filter(([key,until])=>validSacrificeKey(key)&&Number.isSafeInteger(until)&&until>now).map(([key,until])=>[key,Math.min(until,now+SACRIFICE_MS)]));
}
export function sacrificeLocked(s,kind,id,now=Date.now()){return (kind==='room'||kind==='outfit')&&(s.sacrificeUntil?.[tradeKey(kind,id)]||0)>now;}
function sacrifice(s,kind,id){
 if(kind==='collectible'){
  s.collectionHistory=[...new Set([...(s.collectionHistory||[]),id])];
  s.prizes=s.prizes.filter(x=>x!==id);
  s.shelf=s.shelf.map(x=>x===id?null:x);
 }else{
  s.sacrificeUntil=cleanSacrifices(s.sacrificeUntil);
  s.sacrificeUntil[tradeKey(kind,id)]=Date.now()+SACRIFICE_MS;
  const grants=kind==='room'?'grantedRooms':'grantedOutfits';
  s[grants]=(s[grants]||[]).filter(x=>x!==id);
 }
}
function randomItem(items,random){return items[Math.min(items.length-1,Math.floor(random()*items.length))];}
const availablePrizes=(s,excluding=[])=>GAME_PRIZES.filter(x=>!excluding.includes(x.id));
const cabinetWeekKey=week=>typeof week==='number'?new Date(Date.UTC(2026,10,16)+(week-1)*604800000).toISOString().slice(0,10):week;
export function tradeCollectibles(s,ids,week=mondayKey(),random=Math.random){
 const {used,left}=cabinetStatus(s,week);
 if(!left||!Array.isArray(ids)||ids.length!==3||new Set(ids).size!==3||!ids.every(id=>TRADABLE_PRIZES.has(id)&&s.prizes.includes(id)))return null;
 const item=randomItem(availablePrizes(s,ids),random);
 if(!item)return null;
 for(const id of ids)sacrifice(s,'collectible',id);
 s.cabinetWeeks??={};
 s.cabinetWeeks[cabinetWeekKey(week)]=used+1;
 s.stats.wishes=(s.stats.wishes||0)+1;
 const isNew=awardPrize(s,item.id);
 recordJourney(s,'wish');
 return {id:item.id,isNew};
}
export function awardPrize(s,id){
 s.collectionHistory=[...new Set([...(s.collectionHistory||[]),id])];
 if(s.prizes.includes(id))return false;
 s.prizes.push(id);
 const slot=s.shelf.indexOf(null);
 if(slot>=0)s.shelf[slot]=id;
 return true;
}
export function startBox(s,week,random=Math.random){
 if(s.weeklyBox&&!s.weeklyBox.revealed)return s.weeklyBox;
 if(s.weeklyClaims.includes(week))return null;
 const item=randomItem(availablePrizes(s),random);
 if(!item)return null;
 s.weeklyClaims.push(week);
 return s.weeklyBox={week,id:item.id,revealed:false};
}
export function revealBox(s){
 const box=s.weeklyBox;
 if(!box||box.revealed)return null;
 box.revealed=true;
 s.stats.boxes++;s.stats.rounds++;
 recordJourney(s,'box');
 return {id:box.id,isNew:awardPrize(s,box.id)};
}
export function huntOutfit(s,id){
 const owned=unlockedOutfits(s);
 return owned.includes(id)?id:owned.includes(s.outfit)?s.outfit:'royal';
}
export function beginMaze(s,week,random=Math.random){
 if(s.manorRun?.status==='active'){
  s.manorRun.outfit=huntOutfit(s,s.manorRun.outfit);
  return s.manorRun;
 }
 if(s.mazeWeeks.includes(week))return null;
 const peanutSeed=Math.floor(random()*1e6),item=randomItem(availablePrizes(s),random);
 s.mazeWeeks.push(week);
 s.stats.hunts=(s.stats.hunts||0)+1;
 s.manorRun={peanutSeed,hunt:weeklyHunt(week),outfit:huntOutfit(s,s.outfit),week,status:'active',loot:item?[{id:item.id,claimed:false}]:[],checkpoint:null};
 recordJourney(s,'maze-start');
 return s.manorRun;
}
export function claimMazePrize(s,index){
 const loot=s.manorRun?.status==='active'&&s.manorRun.loot[index];
 if(!loot||loot.claimed||s.manorRun.loot.some(x=>x.claimed))return null;
 loot.claimed=true;
 return {id:loot.id,isNew:awardPrize(s,loot.id)};
}
export function handTotal(cards) { let n = cards.reduce((n, c) => n + Math.min(c.rank, 10), 0); if (cards.some(c => c.rank === 1) && n + 10 <= 21)
    n += 10; return n; }

export function testingState(now = Date.now()) { const s = freshState(now); s.grantedRooms=ROOMS.map(r=>r.id);s.grantedOutfits=OUTFITS.map(o=>o.id);s.chips = s.stats.bestBank = 1000; s.stats.boxes = 5; s.stats.manorWins = 5; s.stats.cardRounds = 10; s.stats.cardWins = 30; s.clicker.ownedSkins=SQUISHIES.map(x=>x.id); s.clicker.balance = s.clicker.lifetime = s.clicker.manual = 250000000; s.manorPeanut.found = true; s.clicker.upgrades.helpers = 10; s.prizes = PRIZES.map(p => p.id); s.shelf = s.prizes.slice(0, 4);claimJourneyRewards(s);return s; }

// A new collection may enter the cabinet, but needs three different treasures to wish.
export function cabinetStatus(s,week=mondayKey()){
 const key=cabinetWeekKey(week),legacy=(s.tradeWeeks||[]).some(n=>cabinetWeekKey(n)===key)?1:0;
 const used=Math.max(legacy,Math.min(2,s.cabinetWeeks?.[key]||0)),left=2-used;
 const owned=new Set((s.prizes||[]).filter(id=>TRADABLE_PRIZES.has(id))).size;
 return {used,left,owned,canEnter:left>0,canExchange:left>0&&owned>=3,needed:Math.max(0,3-owned)};
}

// Long-term rewards use non-consecutive Central-time days and Monday weeks.
export function unlockTestingItems(s){s.grantedRooms=ROOMS.map(r=>r.id);s.grantedOutfits=OUTFITS.map(o=>o.id);s.tradedRooms=[];s.tradedOutfits=[];s.prizes=PRIZES.map(p=>p.id);s.clicker.ownedSkins=SQUISHIES.map(x=>x.id);return s;}
export const LOGIN_START='2026-11-18';
export function loginDates(j,now=Date.now()){const today=dayKey(now);return [...new Set([...(Array.isArray(j?.loginDays)?j.loginDays:[])].filter(d=>dateKey(d)&&d>=LOGIN_START&&d<=today))].sort().slice(-400);}
// Future outfits/rooms can reuse challengeProgress with their own requirement list.
export const OUTFIT_CHALLENGES = {
 royal:[['welcome',1]], sunday:[['bestBank',200]], cozy:[['squishes',500]], espeon:[['boxes',1]], akali:[['escapes',1]], kda:[['escapes',5]], furina:[['cardStarts',1]], rogue:[['boxes',5]], ada:[['squishes',1000000]],
 jubilee:[['loginDays',15]], 'jubilee-midnight':[['loginDays',30]], rafayel:[['bestDrop',2000]], 'pokemon-pack':[['boxes',10]], firestarter:[['squishies',7],['loginDays',15]], reze:[['escapes',10]], cissia:[['wishes',5],['roulette',3]]
};
for(const key of WEATHER_KEYS.filter(k=>k!=='night'))OUTFIT_CHALLENGES['weather-'+key]=[['weather-'+key,1]];

export const ROOM_CHALLENGES={lavender:[['welcome',1]],cafe:[['squishies',7]],garden:[['hunts',1]],cards:[['squishes',1000000]],popmart:[['boxes',3]],sunday:[['bestDrop',3500]],gambit:[['hands',150],['bestBank',500]],minecraft:[['loginDays',15]],manor:[['hunts',12]],restaurant:[['loginDays',30]],hotpot:[['dropPlays',1]]};
for(const [day,g]of Object.entries(ADVENT_GIFTS)){if(g.kind==='outfit')OUTFIT_CHALLENGES[g.id]=[['advent-'+day,1]];else if(g.kind==='room')ROOM_CHALLENGES[g.id]=[['advent-'+day,1]];}
export const JOURNEY_LABELS = {welcome:'A little welcome',loginDays:'Login days',bestBank:'Best table score',squishes:'Lifetime squishes',boxes:'Blind boxes opened',escapes:'Hunts escaped',cardStarts:'Blackjack hands played',squishies:'Squishies owned',bestDrop:'Best Princess Drop score',wishes:'Cabinet wishes',roulette:'Roulette wishes',hunts:'Hunts joined',hands:'Blackjack hands finished',dropPlays:'Princess Drop baskets played',sparkleDays:'Days with five hands',cozyDays:'Cozy squishy days',playDays:'Login days',escapeWeeks:'Weeks with an escape',boxWeeks:'Weeks with a box opened',mazeWeeks:'Weeks joining the hunt',tableWeeks:'Weeks with five hands',wins:'Hands won',jubilee:'Jubilee outfit earned'};
export function freshJourney(){return {version:1,cardDays:{},squishDays:{},playDays:[],loginDays:[],boxWeeks:[],mazeWeeks:[],escapeWeeks:[],earnedOutfits:[]};}
export function dayKey(now=Date.now()){return new Date(centralDate(now)).toISOString().slice(0,10);}
function mondayOfDate(day){
 const offset = (new Date(day).getUTCDay() + 6) % 7;
 return day - offset * 86400000;
}
export function mondayKey(now=Date.now()){
 return new Date(mondayOfDate(centralDate(now))).toISOString().slice(0,10);
}
const dateKey=value=>typeof value==='string'&&/^20\d\d-\d\d-\d\d$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
function validJourney(j){if(!j||typeof j!=='object'||Array.isArray(j)||j.version!==1)return false;for(const [key,max] of [['cardDays',5],['squishDays',100]]){const map=j[key];if(!map||typeof map!=='object'||Array.isArray(map)||Object.keys(map).length>400||Object.entries(map).some(([d,n])=>!dateKey(d)||!Number.isInteger(n)||n<0||n>max))return false;}for(const key of ['playDays','boxWeeks','mazeWeeks','escapeWeeks'])if(!Array.isArray(j[key])||j[key].length>400||j[key].some(d=>!dateKey(d)))return false;if(j.loginDays!==undefined&&(!Array.isArray(j.loginDays)||j.loginDays.length>400||j.loginDays.some(d=>!dateKey(d))))return false;return Array.isArray(j.earnedOutfits)&&j.earnedOutfits.length<=Object.keys(OUTFIT_CHALLENGES).length&&j.earnedOutfits.every(id=>Object.hasOwn(OUTFIT_CHALLENGES,id));}
function normalizeJourney(raw,now){const j=freshJourney();if(!raw||typeof raw!=='object')return j;const today=dayKey(now),clean=list=>[...new Set((Array.isArray(list)?list:[]).filter(d=>dateKey(d)&&d<=today))].sort().slice(-400);for(const [key,max] of [['cardDays',5],['squishDays',100]]){const input=raw[key];if(input&&typeof input==='object'&&!Array.isArray(input))for(const day of Object.keys(input).filter(d=>dateKey(d)&&d<=today).sort().slice(-400))j[key][day]=integer(input[day],max);}j.playDays=clean(raw.playDays);j.loginDays=loginDates(raw,now);for(const key of ['boxWeeks','mazeWeeks','escapeWeeks'])j[key]=clean(raw[key]).filter(d=>new Date(d).getUTCDay()===1);j.earnedOutfits=[...new Set((Array.isArray(raw.earnedOutfits)?raw.earnedOutfits:[]).filter(id=>Object.hasOwn(OUTFIT_CHALLENGES,id)))];return j;}
export function journeyCounts(s){const j=s.journey||freshJourney(),cards=Object.values(j.cardDays),weekly={};for(const [day,count] of Object.entries(j.cardDays)) {/* Saved card-day keys already represent Central calendar dates. */ const week=mondayOfDate(Date.parse(day));weekly[week]=(weekly[week]||0)+count;}const sparkleDays=cards.filter(n=>n>=5).length;return {...Object.fromEntries((s.advent?.days||[]).map(d=>['advent-'+d,1])),...Object.fromEntries(WEATHER_KEYS.map(k=>['weather-'+k,(s.companion?.settings?.value?.weatherSeen||[]).includes(k)?1:0])),welcome:1,loginDays:loginDates(j).length,bestBank:s.stats.bestBank,squishes:s.clicker.lifetime,boxes:s.stats.boxes,escapes:s.stats.manorWins,cardStarts:s.stats.cardRounds,squishies:unlockedSquishies(s).length,bestDrop:Math.max(s.stats.bestDrop||0,...Object.values(s.dropRuns||{}).map(r=>r.score||0)),wishes:Math.max(s.stats.wishes||0,(s.tradeWeeks||[]).length),roulette:Math.max(s.stats.roulette||0,Object.values(s.rouletteWeeks||{}).reduce((a,n)=>a+n,0)),hunts:Math.max(s.stats.hunts||0,(s.mazeWeeks||[]).length,s.stats.manorWins||0),hands:s.stats.blackjackHands||0,dropPlays:Math.max(s.stats.dropPlays||0,Object.values(s.dropRuns||{}).reduce((a,r)=>a+dropAttempts(r),0)),sparkleDays,cozyDays:Object.values(j.squishDays).filter(n=>n>=100).length,playDays:j.playDays.length,tableWeeks:Object.values(weekly).filter(n=>n>=5).length,boxWeeks:j.boxWeeks.length,mazeWeeks:j.mazeWeeks.length,escapeWeeks:j.escapeWeeks.length,wins:s.stats.cardWins,jubilee:sparkleDays>=7||j.earnedOutfits.includes('jubilee')||(s.grantedOutfits||[]).includes('jubilee')?1:0};}
export function challengeProgress(s,requirements,counts=journeyCounts(s)){return requirements.map(([metric,goal])=>({metric,goal,value:Math.min(goal,counts[metric]||0),label:metric.startsWith('advent-')?'Advent gift opened':metric.startsWith('weather-')?'Matching forecast seen':JOURNEY_LABELS[metric]}));}
export function outfitProgress(s,id,counts){return challengeProgress(s,OUTFIT_CHALLENGES[id]||[],counts).map(g=>(s.grantedOutfits||[]).includes(id)?{...g,value:g.goal}:g);}
export function roomProgress(s,id,counts){return challengeProgress(s,ROOM_CHALLENGES[id]||[],counts).map(g=>(s.grantedRooms||[]).includes(id)?{...g,value:g.goal}:g);}
export function recordLogin(s,now=Date.now()){s.journey??=freshJourney();s.journey.loginDays=loginDates(s.journey,now);const d=dayKey(now);if(s.journey.loginDays.includes(d))return false;s.journey.loginDays.push(d);s.journey.loginDays=s.journey.loginDays.sort().slice(-400);claimJourneyRewards(s);return true;}
export const WEEKLY_RESET='Weekly games and blind boxes reset Monday at 12:00 AM (Central Time) ♡';
function claimJourneyRewards(s,counts=journeyCounts(s)){s.journey??=freshJourney();for(const [id,requirements] of Object.entries(OUTFIT_CHALLENGES).filter(([id])=>!['royal','sunday','cozy','espeon','akali','kda','furina','rogue','ada'].includes(id)))if(!s.journey.earnedOutfits.includes(id)&&challengeProgress(s,requirements,counts).every(g=>g.value>=g.goal))s.journey.earnedOutfits.push(id);}
export function recordJourney(s,event,now=Date.now()){
 if(!['card','squish','box','maze-start','maze-win','maze-loss','wish'].includes(event))return;
 s.journey??=freshJourney();const j=s.journey,day=dayKey(now),week=mondayKey(now),mark=(key,value)=>{if(!j[key].includes(value)){j[key].push(value);j[key].sort();if(j[key].length>400)j[key].shift();}};
 if(event==='card'){s.stats.blackjackHands=(s.stats.blackjackHands||0)+1;j.cardDays[day]=Math.min(5,(j.cardDays[day]||0)+1);if(j.cardDays[day]>=3)mark('playDays',day);}
 if(event==='squish'){if(j.squishDays[day]>=100)return;j.squishDays[day]=Math.min(100,(j.squishDays[day]||0)+1);if(j.squishDays[day]>=100)mark('playDays',day);}
 if(event==='box'){mark('boxWeeks',week);mark('playDays',day);}
 if(event==='maze-start')mark('mazeWeeks',week);
 if(event==='maze-win'){mark('escapeWeeks',week);mark('playDays',day);}
 if(event==='maze-loss'||event==='wish')mark('playDays',day);
 for(const key of ['cardDays','squishDays']){const dates=Object.keys(j[key]).sort();for(const old of dates.slice(0,Math.max(0,dates.length-400)))delete j[key][old];}
 claimJourneyRewards(s);
}

// Palace 5: weekly plays use Monday dates and survive reloads.
const cleanGrants=(v,items)=>[...new Set((Array.isArray(v)?v:[]).filter(id=>items.some(x=>x.id===id)))];
function cleanWeekMap(raw,clean){const out={};if(raw&&typeof raw==='object'&&!Array.isArray(raw))for(const key of Object.keys(raw).filter(dateKey).sort().slice(-104)){const value=clean(raw[key]);if(value!==null)out[key]=value;}return out;}
function cleanRoulette(r){return r&&dateKey(r.week)&&Number.isInteger(r.number)&&r.number>=0&&r.number<=36&&['rose','violet'].includes(r.color)&&knownPrize(r.wager)&&Array.isArray(r.prizes)&&r.prizes.length<=2&&r.prizes.every(knownPrize)?{week:r.week,number:r.number,color:r.color,wager:r.wager,prizes:[...r.prizes],won:r.won===true,...(r.reward&&['collectible','room','outfit'].includes(r.reward.kind)&&(r.reward.kind==='collectible'?PRIZES:r.reward.kind==='room'?ROOMS:OUTFITS).some(x=>x.id===r.reward.id)?{reward:{kind:r.reward.kind,id:r.reward.id}}:{}),...(Array.isArray(r.offerings)?{offerings:r.offerings.filter(x=>x&&['collectible','room','outfit'].includes(x.kind)).slice(0,2).map(x=>({kind:x.kind,id:x.id}))}:{})}:null;}
export const ROULETTE_ODDS={collectible:.85,room:.10,outfit:.05};
export function ownedTradeItems(s) {
    const ownedRooms = new Set(unlockedRooms(s));
    const ownedOutfits = new Set(unlockedOutfits(s));
    return [
        ...GAME_PRIZES.filter(item => s.prizes.includes(item.id))
            .map(item => ({ ...item, kind: 'collectible', protected: false })),
        ...ROOMS.filter(item => !item.adventDay && ownedRooms.has(item.id))
            .map(item => ({ ...item, kind: 'room', protected: item.id === 'lavender' || item.id === s.room })),
        ...OUTFITS.filter(item => !item.adventDay && ownedOutfits.has(item.id))
            .map(item => ({ ...item, kind: 'outfit', protected: item.id === 'royal' || item.id === s.outfit }))
    ].map(item => ({ ...item, key: item.kind + ':' + item.id }));
}
export function rouletteStatus(s, week = mondayKey()) {
    const used = Math.min(1, s.rouletteWeeks?.[week] || 0);
    const offerings = ownedTradeItems(s).filter(item => !item.protected);
    return { used, left: 1-used, canEnter: used === 0,
        canSpin: used === 0 && offerings.length >= 2 && offerings.some(item => item.kind !== 'collectible') };
}
export function grantItem(s,kind,id){if(sacrificeLocked(s,kind,id))return false;if(kind==='collectible')return awardPrize(s,id);const retired=kind==='room'?'tradedRooms':'tradedOutfits',grants=kind==='room'?'grantedRooms':'grantedOutfits';s[retired]=(s[retired]||[]).filter(x=>x!==id);s[grants]??=[];if(!s[grants].includes(id))s[grants].push(id);return true;}
export function spinRoulette(s,offerings,color,random=Math.random,week=mondayKey()){
 if(!Array.isArray(offerings)||offerings.length!==2||!rouletteStatus(s,week).canSpin)return null;
 const items=offerings.map(x=>typeof x==='string'?{kind:'collectible',id:x}:x),owned=ownedTradeItems(s);if(!items.some(x=>['room','outfit'].includes(x?.kind))||new Set(items.map(x=>x?.kind+':'+x?.id)).size!==2||!items.every(x=>owned.some(y=>!y.protected&&y.kind===x?.kind&&y.id===x?.id)))return null;
 // Decide the prize before taking either offering.
 const roll=random(),kind=roll<.85?'collectible':roll<.95?'room':'outfit';
 const pool=kind==='collectible'?GAME_PRIZES:kind==='room'?ROOMS:OUTFITS;
 const prize=randomItem(pool.filter(x=>!x.adventDay&&!sacrificeLocked(s,kind,x.id)&&!items.some(y=>y.kind===kind&&y.id===x.id)),random);
 if(!prize)return null;
 const {id}=prize;
 for(const item of items)sacrifice(s,item.kind,item.id);
 s.rouletteWeeks??={};s.rouletteWeeks[week]=1;s.stats.roulette=(s.stats.roulette||0)+1;grantItem(s,kind,id);
 s.rouletteResult={week,number:Math.min(36,Math.floor(random()*37)),color:'rose',wager:items.find(x=>x.kind==='collectible')?.id||'espurr',prizes:kind==='collectible'?[id]:[],won:true,offerings:items.map(x=>({kind:x.kind,id:x.id})),reward:{kind,id}};return structuredClone(s.rouletteResult);
}

export const DROP_GOAL=1500;
export const DROP_TRIES=5;
export const dropAttempts=run=>run?Math.max(1,Math.min(DROP_TRIES,Number.isInteger(run.attempts)?run.attempts:1)):0;
export const DROP_FINAL_TIER=8;
export function cleanDrop(r){
 if(!r||!['active','won','lost'].includes(r.status))return null;
 const out={attempts:dropAttempts(r),layout:r.layout===2?2:1,status:r.status,score:integer(r.score,1e6),bestTier:integer(r.bestTier,8),next:integer(r.next,3),held:integer(r.held,3),pieces:[],reward:null,weeklyReward:null};
 if(r.status==='active'&&Array.isArray(r.pieces))out.pieces=r.pieces.slice(0,100).filter(p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y)).map(p=>({tier:integer(p.tier,8),x:Math.max(10,Math.min(390,p.x)),y:Math.max(-100,Math.min(680,p.y)),vx:Math.max(-20,Math.min(20,Number(p.vx)||0)),vy:Math.max(-20,Math.min(20,Number(p.vy)||0)),angle:Number.isFinite(p.angle)?p.angle:0}));
 if(r.reward&&['collectible','room','outfit'].includes(r.reward.kind)){const items=r.reward.kind==='collectible'?PRIZES:r.reward.kind==='room'?ROOMS:OUTFITS;if(items.some(x=>x.id===r.reward.id))out.reward={kind:r.reward.kind,id:r.reward.id};}
 const claimed=r.weeklyReward||out.reward;if(claimed&&['collectible','room','outfit'].includes(claimed.kind)){const catalog=claimed.kind==='collectible'?PRIZES:claimed.kind==='room'?ROOMS:OUTFITS;if(catalog.some(p=>p.id===claimed.id))out.weeklyReward={kind:claimed.kind,id:claimed.id};}
 out.bestTier=Math.max(out.bestTier,...out.pieces.map(p=>p.tier));return out;
}
export function beginDrop(s,random=Math.random,week=mondayKey()){
 s.dropRuns??={};for(const [key,old] of Object.entries(s.dropRuns))if(key<week&&old.status==='active'){old.status='lost';old.pieces=[];}const previous=s.dropRuns[week];if(previous?.status==='active')return previous;if(dropAttempts(previous)>=DROP_TRIES)return null;s.stats.bestDrop=Math.max(s.stats.bestDrop||0,previous?.score||0);
 s.stats.dropPlays=(s.stats.dropPlays||0)+1;return s.dropRuns[week]={attempts:dropAttempts(previous)+1,layout:2,status:'active',score:0,bestTier:0,held:Math.min(3,Math.floor(random()*4)),next:Math.min(3,Math.floor(random()*4)),pieces:[],reward:null,weeklyReward:previous?.weeklyReward||previous?.reward||null};
}
export function claimDropPrize(s,random=Math.random,week=mondayKey()){
 const run=s.dropRuns?.[week];if(!run||run.status!=='active'||run.score<DROP_GOAL||run.reward||run.weeklyReward)return null;
 const item=randomItem(availablePrizes(s),random);if(!item)return null;run.reward={kind:'collectible',id:item.id};run.weeklyReward={...run.reward};grantItem(s,'collectible',item.id);return {...run.reward,name:item.name,won:true};
}
export function finishDrop(s,won,random=Math.random,week=mondayKey()){
 const run=s.dropRuns?.[week];if(!run||run.status!=='active'||won&&run.score<DROP_GOAL)return null;
 const reward=claimDropPrize(s,random,week);s.stats.bestDrop=Math.max(s.stats.bestDrop||0,run.score);run.status=run.score>=DROP_GOAL?'won':'lost';run.pieces=[];
 return reward||(run.reward?{...run.reward,name:PRIZES.find(x=>x.id===run.reward.id)?.name||'Your treasure',won:true}:{won:run.score>=DROP_GOAL,alreadyClaimed:!!run.weeklyReward});
}
function validWeeklyGames(s){
 for(const [key,items] of [['grantedRooms',ROOMS],['grantedOutfits',OUTFITS],['tradedRooms',ROOMS],['tradedOutfits',OUTFITS]])if(s[key]!==undefined&&(!Array.isArray(s[key])||s[key].length>items.length||s[key].some(id=>!items.some(x=>x.id===id))))return false;
 for(const key of ['cabinetWeeks','rouletteWeeks','dropRuns']){const v=s[key];if(v!==undefined&&(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).length>104||Object.keys(v).some(k=>!dateKey(k))))return false;}
 if(Object.values(s.cabinetWeeks||{}).some(n=>!Number.isInteger(n)||n<0||n>2))return false;
 if(s.sacrificeUntil!==undefined&&(!s.sacrificeUntil||typeof s.sacrificeUntil!=='object'||Array.isArray(s.sacrificeUntil)||Object.entries(s.sacrificeUntil).some(([key,n])=>!validSacrificeKey(key,true)||!Number.isSafeInteger(n)||n<0)))return false;
 if(Object.values(s.rouletteWeeks||{}).some(n=>!Number.isInteger(n)||n<0||n>3))return false;
 if(Object.values(s.dropRuns||{}).some(r=>!cleanDrop(r)||r.attempts!==undefined&&(!Number.isInteger(r.attempts)||r.attempts<1||r.attempts>DROP_TRIES)||!Array.isArray(r.pieces)||r.pieces.length>100))return false;
 if(s.rouletteResult!==undefined&&s.rouletteResult!==null&&!cleanRoulette(s.rouletteResult))return false;
 return true;
}
export function keepWeeklyUses(restored,current){
 restored.cabinetWeeks??={};
 for(const [week,n] of Object.entries(current.cabinetWeeks||{}))restored.cabinetWeeks[week]=Math.max(restored.cabinetWeeks[week]||0,n);
 restored.cabinetWeeks=cleanWeekMap(restored.cabinetWeeks,n=>integer(n,2));
 restored.stats.wishes=Math.max(restored.stats.wishes||0,current.stats.wishes||0);
 const active={...cleanSacrifices(restored.sacrificeUntil)};
 for(const [key,until] of Object.entries(cleanSacrifices(current.sacrificeUntil)))active[key]=Math.max(until,active[key]||0);
 restored.sacrificeUntil=active;
 restored.shelf=restored.shelf.map(id=>restored.prizes.includes(id)?id:null);
 restored.grantedRooms=restored.grantedRooms.filter(id=>!sacrificeLocked(restored,'room',id));
 restored.grantedOutfits=restored.grantedOutfits.filter(id=>!sacrificeLocked(restored,'outfit',id));
 for(const [week,n] of Object.entries(current.rouletteWeeks||{}))restored.rouletteWeeks[week]=Math.max(restored.rouletteWeeks[week]||0,n);
 for(const [week,run] of Object.entries(current.dropRuns||{})){const claimed=run.weeklyReward||run.reward||restored.dropRuns[week]?.weeklyReward||restored.dropRuns[week]?.reward;if(dropAttempts(run)>=dropAttempts(restored.dropRuns[week]))restored.dropRuns[week]=structuredClone(run);if(claimed)restored.dropRuns[week].weeklyReward=structuredClone(claimed);}
 restored.tradedRooms=[...new Set([...(restored.tradedRooms||[]),...(current.tradedRooms||[])])];restored.tradedOutfits=[...new Set([...(restored.tradedOutfits||[]),...(current.tradedOutfits||[])])];restored.rouletteWeeks=cleanWeekMap(restored.rouletteWeeks,n=>integer(n,3));restored.dropRuns=cleanWeekMap(restored.dropRuns,cleanDrop);return restored;
}
