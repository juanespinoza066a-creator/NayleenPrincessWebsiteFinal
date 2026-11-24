// Read-only on purpose. Juan publishes by editing server/weekly-notes.json in GitHub.
import {weekNumber} from './game-rules.js';
import { loadContent, text, readNotes } from './content-loader.js';
const $ = id => document.getElementById(id);
let start = '2026-11-18';
function dates(week) { const first = new Date(week===1?'2026-11-18T12:00:00Z':'2026-11-23T12:00:00Z'); if(week>1)first.setUTCDate(first.getUTCDate()+(week-2)*7); const last = new Date(+first + (week===1?4:6)*86400000), format = d => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(d); return `${format(first)} – ${format(last)}`; }
function openNote(note) { $('note-emoji').textContent = note.emoji; $('read-week').textContent = `WEEK ${note.week} · ${dates(note.week)}`; $('read-title').textContent = note.title || text('scrapbook.heading'); $('read-copy').textContent = note.message; renderNotePhoto(note); $('note-dialog').showModal(); }
function renderNotePhoto(note) {
    const container = $('note-photo');
    container.replaceChildren();
    if (!note.hasImage) return;
    const photo = document.createElement('img');
    photo.alt = typeof note.imageAlt === 'string' ? note.imageAlt : 'Photo from week ' + note.week;
    photo.decoding = 'async';
    photo.addEventListener('error', () => photo.remove(), { once: true });
    photo.src = 'api/weekly-notes?image=' + note.week;
    container.append(photo);
}
async function load() {
    $('retry-load').hidden = true;
    try {
        const data = await readNotes();
        if (!Number.isNaN(Date.parse(data.startDate + 'T12:00:00Z')))
            start = data.startDate;
        const notes = new Map(data.notes.map(n => [n.week, n]));
        $('published-count').textContent = `${data.notes.filter(n => n.published).length} / 52 memories`;
        $('weeks').replaceChildren(...Array.from({ length: 52 }, (_, i) => {
            const n = i + 1, note = notes.get(n), b = document.createElement('button');
            b.className = 'week-card';
            const emoji = document.createElement('span');
            emoji.className = 'week-emoji';
            emoji.textContent = note?.emoji || '💜';
            emoji.setAttribute('aria-hidden', 'true');
            const title = document.createElement('strong');
            title.textContent = `Week ${String(n).padStart(2, '0')}`;
            const date = document.createElement('small');
            date.textContent = dates(n);
            const copy = document.createElement('span');
            copy.textContent = note?.published ? (note.title || 'A little memory of us ♡') : text('scrapbook.empty');
            b.append(emoji, title, date, copy);
            if (note?.published) {
                b.classList.add('has-note');
                b.onclick = () => openNote(note);
            }
            else
                b.disabled = true;
            return b;
        }));
        $('reader').hidden = false;
        $('journal-status').textContent = '';
    }
    catch {
        $('journal-status').textContent = 'Our scrapbook couldn’t load just yet. Please try again.';
        $('retry-load').hidden = false;
    }
}
$('note-close').onclick = () => $('note-dialog').close();
$('retry-load').onclick = load;
await loadContent();
await load();
