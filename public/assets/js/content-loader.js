// Text is intentionally separate from layout and game rules.
import { PRIZES, OUTFITS, UPGRADES } from './game-rules.js';
import {ensureCodeLogin} from './code-login.js';
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
    try {const r=await fetch('content/wardrobe-update.json',{cache:'no-store'});if(r.ok){const extra=await r.json();content={...content,wardrobe:{...content.wardrobe,...extra.wardrobe},outfits:{...content.outfits,...extra.outfits},journey:extra.journey||{}};}} catch {}
    if(content.games?.manor)content.games.manor={...content.games.manor,title:'IDV Hunt',intro:'A new hunter, a moonlit map, and your outfit’s little power. One adventure each week.',action:'Enter this week’s hunt →'};
    const mondayCopy=v=>typeof v==='string'?v.replaceAll('Wednesday','Monday'):Array.isArray(v)?v.map(mondayCopy):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,mondayCopy(x)])):v;content=mondayCopy(content);
    document.querySelectorAll('[data-copy]').forEach(node => { const value = text(node.dataset.copy); if (value !== node.dataset.copy)
        node.textContent = value; });
    PRIZES.forEach(p => { const key='collection.names.'+p.id;if(text(key)!==key)p.name=text(key); });
    const rulesCopy=OUTFITS.map(o=>({id:o.id,name:o.name,hint:o.hint}));
    OUTFITS.forEach(o => { const nameKey='outfits.'+o.id+'.name',hintKey='outfits.'+o.id+'.hint';if(text(nameKey)!==nameKey)o.name=text(nameKey);if(text(hintKey)!==hintKey)o.hint=text(hintKey); });
    OUTFITS.forEach(o=>{o.hint=o.hint.replaceAll('Ann’s weekly maze','the weekly hunt').replaceAll('visit Ann','join the hunt').replaceAll('Visit Ann','Join the hunt')});if(content.journey?.labels)content.journey.labels.mazeWeeks='Weeks joining the hunt';
    UPGRADES.forEach(u => { u.name = text('upgrades.' + u.id + '.name'); u.detail = text('upgrades.' + u.id + '.detail'); });
    OUTFITS.forEach(o=>{const rules=rulesCopy.find(x=>x.id===o.id);o.hint=rules.hint;if(o.id==='reze')o.name='Reze';});
    content.wardrobe.journeyIntro='Open your Palace once a day to collect a login day. Days don’t need to be in a row ♡';
    content.journey={intro:'Open your Palace once a day to collect a login day. Days don’t need to be in a row ♡',labels:{}};
    document.querySelectorAll('[data-copy="journey.intro"]').forEach(n=>n.textContent=content.journey.intro);
    return true;
}
export async function readNotes() {
    await ensureCodeLogin();
    const response = await fetch('api/weekly-notes', { cache: 'no-store' });
    if (!response.ok)
        throw new Error('The scrapbook couldn’t load.');
    const data = await response.json();
    if (!Array.isArray(data.notes))
        throw new Error('Your scrapbook couldn’t open just now. Please try again soon.');
    const notes = data.notes.filter(n => Number.isInteger(n.week) && n.week >= 1 && n.week <= 52).map(n => ({ ...n, emoji: typeof n.emoji === 'string' ? n.emoji : '💜', title: typeof n.title === 'string' ? n.title : '', message: typeof n.message === 'string' ? n.message : [n.highlight, n.detail, n.lookingForward].filter(Boolean).join('\n\n'), published: n.published === true }));
    return { startDate: data.startDate || '2026-11-18', notes };
}
