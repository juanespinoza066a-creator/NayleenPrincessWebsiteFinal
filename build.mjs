import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await rm('dist/content/weekly-notes.json', { force: true });

// Publish the sorted catalog without editing imported songs or playlist order.
const catalog = 'dist/music/library.json';
const library = JSON.parse(await readFile(catalog, 'utf8'));
const label = value => typeof value === 'string' ? value.trim() : '';
const alphabet = new Intl.Collator('en', { sensitivity: 'base' });
library.tracks.sort((a, b) => {
    const artistA = label(a.artist);
    const artistB = label(b.artist);
    return Number(!artistA) - Number(!artistB) ||
        alphabet.compare(artistA, artistB) ||
        alphabet.compare(label(a.title), label(b.title));
});
await writeFile(catalog, JSON.stringify(library, null, 2) + '\n');
