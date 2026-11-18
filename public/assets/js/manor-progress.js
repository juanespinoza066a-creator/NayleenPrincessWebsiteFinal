import { CarnivalStore } from './save-manager.js';
import { PRIZES, weekNumber, beginMaze, claimMazePrize } from './game-rules.js';
import { loadContent, text } from './content-loader.js';
import { playBoxSound } from './box-audio.js';
const store = new CarnivalStore(), images = new Map();
PRIZES.forEach(item => { const image = new Image(); image.src = item.image; images.set(item.id, image); });
const bridge = {
    outfit: 'royal', loot: [], images,
    async begin() { await ready; let run; store.change(s => { run = beginMaze(s, weekNumber()); }); return run ? structuredClone(run) : null; },
    checkpoint(checkpoint) { if (store.state.manorRun?.status === 'active')
        store.change(s => { s.manorRun.checkpoint = checkpoint; }); },
    claim(index) { let reward; store.change(s => { reward = claimMazePrize(s, index); }); if (reward) playBoxSound(); return reward ? { ...reward, name: PRIZES.find(p => p.id === reward.id).name } : null; },
    finish(won) { if (store.state.manorRun?.status !== 'active')
        return; store.change(s => { s.manorRun.status = won ? 'won' : 'lost'; s.manorRun.checkpoint = null; s.stats.rounds++; if (won)
        s.stats.manorWins++; }); }
};
window.CarnivalManor = bridge;
store.subscribe(s => { bridge.outfit = s.outfit; bridge.loot = s.manorRun?.loot || []; });
const ready = (async () => { await loadContent(); window.CarnivalText = text; await store.load(); const button = document.getElementById('start'); button.disabled = false; const active = store.state.manorRun?.status === 'active', used = store.state.mazeWeeks.includes(weekNumber()); button.textContent = active ? 'Resume this week’s adventure →' : used ? 'See this week’s result →' : 'Enter this week’s gardens →'; })();
