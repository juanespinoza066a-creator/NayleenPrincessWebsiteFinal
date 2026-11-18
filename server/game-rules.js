// Game rules only. Edit display text in content/site-text.json.
export const SAVE_KEY = 'nayleen-carnival-room-v2';
export const PRIZES = [
    ['espurr', 'Pocket Espurr'], ['peanut', 'Crunchy companion'], ['frog', 'Our Build-A-Bear frog'], ['rose', 'Forever rose'], ['cat', 'Ann’s tiny cat'],
    ['sunday', 'Sunday plushie'], ['bunny', 'Sleepy bunny'], ['duck', 'Little duck'], ['akali', 'Akali plushie'], ['pokemon', 'Pokémon card pack'],
    ['pterodactyl', 'Pterodactyl plushie'], ['gambit', 'Maid Gambit figure'], ['lilies', 'Lily-of-the-valley bouquet'], ['mew', 'Bubble Mew card'], ['coach', 'Coach bag'],
    ['blondie', 'Blondie coffee'], ['rafayel', 'Rafayel plushie'], ['stitch', 'Stitch plushie'], ['mitski', 'Mitski record']
].map(([id, name]) => ({ id, name, image: id === 'espurr' ? 'princess-espurr.webp' : id === 'peanut' ? 'crunchy-peanut.svg' : `assets/images/collectibles/${id}.svg` }));
export const OUTFITS = [
    { id: 'royal', name: 'My little princess', hint: 'Yours from the beginning', icon: '♛', image: 'princess-espurr.webp' },
    { id: 'sunday', name: 'Sunday’s little angel', hint: 'Reach a best card-table score of 200', icon: '☀', image: 'assets/images/outfits/sunday.webp' },
    { id: 'cozy', name: 'Peanut crunchy PJs', hint: 'Make 50 lifetime crunches', icon: '🥜', image: 'assets/images/outfits/cozy.webp' },
    { id: 'espeon', name: 'Espeon daydream', hint: 'Open your first weekly blind box', icon: '🔮', image: 'assets/images/outfits/espeon.webp' },
    { id: 'akali', name: 'Akali’s little rogue', hint: 'Escape Ann’s weekly maze once', icon: '✦', image: 'assets/images/outfits/akali.webp' }
];
export const UPGRADES = [
    { id: 'fingers', name: 'Extra-squishy fingers', detail: '+1 crunch per tap', base: 15, icon: '☝' },
    { id: 'helpers', name: 'Tiny peanut helper', detail: '+1 crunch every second', base: 30, icon: '🐥' },
    { id: 'press', name: 'Royal crunch press', detail: '+7 crunches every second', base: 175, icon: '⚙' },
    { id: 'factory', name: 'The peanut palace', detail: '+40 crunches every second', base: 1000, icon: '♛' }
];
const LEGACY = { bear: 'frog', sylveon: 'akali', moon: 'sunday', compact: 'coach', star: 'pokemon', tea: 'blondie', cake: 'stitch', book: 'gambit', shell: 'pterodactyl', flower: 'lilies', crystal: 'rafayel', heart: 'mew', music: 'mitski' };
const OLD_IDS = new Set(['espurr', 'sylveon', 'bear', 'peanut', 'moon', 'rose', 'compact', 'cat', 'star', 'bunny', 'tea', 'cake', 'book', 'shell', 'flower', 'duck', 'crystal', 'heart', 'music']);
const prizeID = id => typeof id === 'string' ? (PRIZES.some(p => p.id === id) ? id : Object.hasOwn(LEGACY, id) ? LEGACY[id] : undefined) : undefined;
const number = (v, max = 1e9) => Number.isFinite(v) && v >= 0 ? Math.min(max, v) : 0;
const integer = (v, max = 1e9) => Math.floor(number(v, max));
const weeks = v => [...new Set(Array.isArray(v) ? v.filter(n => Number.isInteger(n) && n >= 1 && n <= 52) : [])];
export const MAX_CRUNCHES = 1e12;
export function freshState(now = Date.now()) {
    return { version: 3, chips: 100, prizes: [], shelf: [null, null, null, null], outfit: 'royal', weeklyClaims: [], mazeWeeks: [], weeklyBox: null, manorRun: null, stats: { rounds: 0, cardWins: 0, boxes: 0, manorWins: 0, bestBank: 100 }, clicker: { balance: 0, lifetime: 0, manual: 0, upgrades: { fingers: 0, helpers: 0, press: 0, factory: 0 }, lastTick: now } };
}
export function unlockedOutfits(s) { return OUTFITS.filter(o => o.id === 'royal' || o.id === 'sunday' && s.stats.bestBank >= 200 || o.id === 'cozy' && s.clicker.lifetime >= 50 || o.id === 'espeon' && s.stats.boxes >= 1 || o.id === 'akali' && s.stats.manorWins >= 1).map(o => o.id); }
export function normalizeState(raw, now = Date.now()) {
    const s = freshState(now);
    if (!raw || typeof raw !== 'object')
        return s;
    s.chips = Number.isSafeInteger(raw.chips) ? integer(raw.chips, 1e6) : 100;
    s.prizes = [...new Set((Array.isArray(raw.prizes) ? raw.prizes : []).map(prizeID).filter(Boolean))];
    s.shelf = Array.from({ length: 4 }, (_, i) => { const id = prizeID(raw.shelf?.[i]); return s.prizes.includes(id) ? id : null; });
    for (const k of Object.keys(s.stats))
        s.stats[k] = integer(raw.stats?.[k]);
    s.stats.bestBank = Math.max(100, s.chips, s.stats.bestBank);
    for (const k of ['balance', 'lifetime', 'manual'])
        s.clicker[k] = number(raw.clicker?.[k], MAX_CRUNCHES);
    for (const u of UPGRADES)
        s.clicker.upgrades[u.id] = integer(raw.clicker?.upgrades?.[u.id], 50);
    s.clicker.lastTick = Math.min(now, number(raw.clicker?.lastTick, now) || now);
    s.weeklyClaims = weeks(raw.weeklyClaims);
    s.mazeWeeks = weeks(raw.mazeWeeks);
    if (raw.weeklyBox && weeks([raw.weeklyBox.week]).length && prizeID(raw.weeklyBox.id))
        s.weeklyBox = { week: raw.weeklyBox.week, id: prizeID(raw.weeklyBox.id), revealed: raw.weeklyBox.revealed === true };
    if (raw.manorRun && weeks([raw.manorRun.week]).length && ['active', 'won', 'lost'].includes(raw.manorRun.status)) {
        s.manorRun = { week: raw.manorRun.week, status: raw.manorRun.status, loot: (Array.isArray(raw.manorRun.loot) ? raw.manorRun.loot : []).filter((x, i, all) => all.some(y => y?.claimed) ? x === all.find(y => y?.claimed) : i === 0).slice(0, 1).map(x => ({ id: prizeID(x.id) || 'espurr', claimed: x.claimed === true })), checkpoint: normalizeCheckpoint(raw.manorRun.checkpoint) };
    }
    if (s.weeklyBox && !s.weeklyClaims.includes(s.weeklyBox.week)) s.weeklyClaims.push(s.weeklyBox.week);
    if (s.manorRun && !s.mazeWeeks.includes(s.manorRun.week)) s.mazeWeeks.push(s.manorRun.week);
    const oldOutfit = { ribbon: 'sunday', hearts: 'sunday', garden: 'espeon', moon: 'akali', starlight: 'cozy' }[raw.outfit] || raw.outfit;
    s.outfit = unlockedOutfits(s).includes(oldOutfit) && OUTFITS.find(o => o.id === oldOutfit)?.image ? oldOutfit : 'royal';
    return s;
}
export function normalizeCheckpoint(c) {
    if (!c || typeof c !== 'object')
        return null;
    const position = p => ({ x: Math.max(50, Math.min(950, number(p?.x, 1000) || 100)), y: Math.max(50, Math.min(710, number(p?.y, 760) || 380)), facing: p?.facing === -1 ? -1 : 1, facingY: p?.facingY === -1 ? -1 : 0 });
    return { player: position(c.player), hunter: position(c.hunter), hp: Math.max(1, Math.min(3, integer(c.hp) || 3)), stamina: number(c.stamina, 100), charges: integer(c.charges, 3), elapsed: number(c.elapsed, 86400), rescued: c.rescued === true, machines: Array.from({ length: 3 }, (_, i) => number(c.machines?.[i], 40)), pallets: Array.from({ length: 3 }, (_, i) => c.pallets?.[i] === true) };
}
export function validState(raw) {
    if (!raw || typeof raw !== 'object' || !Number.isSafeInteger(raw.chips) || raw.chips < 0 || raw.chips > 1e6 || !Array.isArray(raw.prizes) || raw.prizes.length > 19 || new Set(raw.prizes).size !== raw.prizes.length || !raw.prizes.every(id => PRIZES.some(p => p.id === id) || OLD_IDS.has(id)) || !Array.isArray(raw.shelf) || raw.shelf.length !== 4 || !raw.shelf.every(id => id === null || raw.prizes.includes(id)))
        return false;
    if (![2, 3].includes(raw.version))
        return true;
    const statKeys = raw.version === 3 ? ['rounds', 'cardWins', 'boxes', 'manorWins', 'bestBank'] : ['rounds', 'cardWins', 'boxes', 'manorWins'];
    for (const k of statKeys)
        if (!Number.isSafeInteger(raw.stats?.[k]) || raw.stats[k] < 0 || raw.stats[k] > 1e9)
            return false;
    for (const k of ['balance', 'lifetime', 'manual', 'lastTick'])
        if (!Number.isFinite(raw.clicker?.[k]) || raw.clicker[k] < 0 || raw.clicker[k] > (k === 'lastTick' ? 1e14 : MAX_CRUNCHES))
            return false;
    for (const u of UPGRADES)
        if (!Number.isInteger(raw.clicker?.upgrades?.[u.id]) || raw.clicker.upgrades[u.id] < 0 || raw.clicker.upgrades[u.id] > 50)
            return false;
    if (!Array.isArray(raw.weeklyClaims) || raw.weeklyClaims.length > 52 || raw.weeklyClaims.some(n => !Number.isInteger(n) || n < 1 || n > 52))
        return false;
    if (raw.version === 3) {
        if (!OUTFITS.some(o => o.id === raw.outfit) || !Array.isArray(raw.mazeWeeks) || raw.mazeWeeks.length > 52 || raw.mazeWeeks.some(n => !Number.isInteger(n) || n < 1 || n > 52))
            return false;
        if (raw.weeklyBox && (!weeks([raw.weeklyBox.week]).length || !PRIZES.some(p => p.id === raw.weeklyBox.id) || typeof raw.weeklyBox.revealed !== 'boolean'))
            return false;
        if (raw.manorRun && (!weeks([raw.manorRun.week]).length || !['active', 'won', 'lost'].includes(raw.manorRun.status) || !Array.isArray(raw.manorRun.loot) || raw.manorRun.loot.length > 5 || raw.manorRun.loot.some(x => !x || !PRIZES.some(p => p.id === x.id) || typeof x.claimed !== 'boolean') || (JSON.stringify(raw.manorRun.checkpoint) || '').length > 4000))
            return false;
    }
    return true;
}
export function passiveRate(s) { return s.clicker.upgrades.helpers + s.clicker.upgrades.press * 7 + s.clicker.upgrades.factory * 40; }
export function tapPower(s) { return 1 + s.clicker.upgrades.fingers; }
export function upgradeCost(s, id) { const u = UPGRADES.find(u => u.id === id); return Math.ceil(u.base * Math.pow(1.5, s.clicker.upgrades[id])); }
export function addCrunches(s, amount) { const n = Math.max(0, Math.min(amount, MAX_CRUNCHES - s.clicker.lifetime, MAX_CRUNCHES - s.clicker.balance)); s.clicker.balance += n; s.clicker.lifetime += n; return n; }
export function tick(s, now = Date.now()) { const sec = Math.min(14400, Math.max(0, (now - s.clicker.lastTick) / 1000)); s.clicker.lastTick = now; return addCrunches(s, sec * passiveRate(s)); }
export function buyUpgrade(s, id) { const cost = upgradeCost(s, id); if (s.clicker.balance < cost || s.clicker.upgrades[id] >= 50)
    return false; s.clicker.balance -= cost; s.clicker.upgrades[id]++; return true; }
export function weekNumber(now = Date.now()) { const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(now)), p = t => Number(parts.find(p => p.type === t).value); return Math.max(1, Math.min(52, Math.floor((Date.UTC(p('year'), p('month') - 1, p('day')) - Date.UTC(2026, 10, 18)) / 604800000) + 1)); }
export function awardPrize(s, id) { if (s.prizes.includes(id))
    return false; s.prizes.push(id); const slot = s.shelf.indexOf(null); if (slot >= 0)
    s.shelf[slot] = id; return true; }
export function startBox(s, week, random = Math.random) { if (s.weeklyBox && !s.weeklyBox.revealed)
    return s.weeklyBox; if (s.weeklyClaims.includes(week))
    return null; s.weeklyClaims.push(week); s.weeklyBox = { week, id: PRIZES[Math.min(PRIZES.length - 1, Math.floor(random() * PRIZES.length))].id, revealed: false }; return s.weeklyBox; }
export function revealBox(s) { const box = s.weeklyBox; if (!box || box.revealed)
    return null; box.revealed = true; s.stats.boxes++; s.stats.rounds++; return { id: box.id, isNew: awardPrize(s, box.id) }; }
export function beginMaze(s, week, random = Math.random) { if (s.manorRun?.status === 'active')
    return s.manorRun; if (s.mazeWeeks.includes(week))
    return null; s.mazeWeeks.push(week); s.manorRun = { week, status: 'active', loot: Array.from({ length: 1 }, () => ({ id: PRIZES[Math.min(PRIZES.length - 1, Math.floor(random() * PRIZES.length))].id, claimed: false })), checkpoint: null }; return s.manorRun; }
export function claimMazePrize(s, index) { const loot = s.manorRun?.status === 'active' && s.manorRun.loot[index]; if (!loot || loot.claimed || s.manorRun.loot.some(x => x.claimed))
    return null; loot.claimed = true; return { id: loot.id, isNew: awardPrize(s, loot.id) }; }
export function handTotal(cards) { let n = cards.reduce((n, c) => n + Math.min(c.rank, 10), 0); if (cards.some(c => c.rank === 1) && n + 10 <= 21)
    n += 10; return n; }

export function testingState(now = Date.now()) { const s = freshState(now); s.chips = s.stats.bestBank = 250; s.stats.boxes = 1; s.stats.manorWins = 1; s.clicker.balance = s.clicker.lifetime = s.clicker.manual = 1000; s.prizes = PRIZES.map(p => p.id); s.shelf = s.prizes.slice(0, 4); return s; }
