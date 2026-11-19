// Text is intentionally separate from layout and game rules.
import { PRIZES, OUTFITS, UPGRADES } from './game-rules.js';
import { DEFAULT_TEXT } from './default-text.js';
let content = DEFAULT_TEXT;
export function text(key, values = {}) { let value = key.split('.').reduce((v, k) => v?.[k], content); if (typeof value !== 'string')
    value = key.split('.').reduce((v, k) => v?.[k], DEFAULT_TEXT); if (typeof value !== 'string')
    value = key; return value.replace(/\{\{(\w+)\}\}/g, (_, k) => String(values[k] ?? '')); }
export async function loadContent() {
    try {
        const r = await fetch('content/site-text.json', { cache: 'no-store' });
        if (!r.ok)
            throw new Error();
        content = await r.json();
    }
    catch {
        document.documentElement.dataset.copyError = 'true';
        content = DEFAULT_TEXT;
    }
    try { const r = await fetch('content/palace-update.json', {cache:'no-store'}); if(r.ok) { const merge=(a,b)=>{for(const [k,v] of Object.entries(b)){if(v&&typeof v==='object'&&!Array.isArray(v)){a[k]={...(a[k]||{})};merge(a[k],v)}else a[k]=v}return a}; content=merge(structuredClone(content),await r.json()); } } catch {}
    document.querySelectorAll('[data-copy]').forEach(node => { const value = text(node.dataset.copy); if (value !== node.dataset.copy)
        node.textContent = value; });
    PRIZES.forEach(p => { p.name = text('collection.names.' + p.id); });
    OUTFITS.forEach(o => { o.name = text('outfits.' + o.id + '.name'); o.hint = text('outfits.' + o.id + '.hint'); });
    UPGRADES.forEach(u => { u.name = text('upgrades.' + u.id + '.name'); u.detail = text('upgrades.' + u.id + '.detail'); });
    return true;
}
export async function readNotes() {
    const response = await fetch('content/weekly-notes.json', { cache: 'no-store' });
    if (!response.ok)
        throw new Error('The scrapbook couldn’t load.');
    const data = await response.json();
    if (!Array.isArray(data.notes))
        throw new Error('The notes file needs a notes list.');
    const notes = data.notes.filter(n => Number.isInteger(n.week) && n.week >= 1 && n.week <= 52).map(n => ({ ...n, emoji: typeof n.emoji === 'string' ? n.emoji : '💜', title: typeof n.title === 'string' ? n.title : '', message: typeof n.message === 'string' ? n.message : [n.highlight, n.detail, n.lookingForward].filter(Boolean).join('\n\n'), published: n.published === true }));
    return { startDate: data.startDate || '2026-11-18', notes };
}
