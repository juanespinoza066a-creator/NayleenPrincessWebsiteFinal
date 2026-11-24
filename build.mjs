import { createHash } from 'node:crypto';
import { dirname } from 'node:path';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('public', 'dist', { recursive: true });
await rm('dist/content/weekly-notes.json', { force: true });

// Publish the sorted catalog without editing imported songs or playlist order.
const catalog = 'dist/music/library.json';
const library = JSON.parse(await readFile(catalog, 'utf8'));
for (const song of library.tracks) {
    if (song.file === 'tracks/we-never-dated-8d6d6f8692.mp3') {
        song.title = 'We Never Dated';
        song.artist = 'Sombr';
    }
}
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

// Keep public release copy separate from authenticated notes and personal dates.
const release = JSON.parse(await readFile('server/update-info.json', 'utf8'));
const espurrLines = JSON.parse(await readFile('server/espurr-lines.json', 'utf8'));
await writeFile('dist/content/release.json', JSON.stringify({
    releaseVersion: String(release.version || ''),
    espurrLines
}) + '\n');

// Version gallery images by content so a new illustration gets a fresh URL.
const art = {};
async function versionArtwork(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const path = directory + '/' + entry.name;
        if (entry.isDirectory()) {
            await versionArtwork(path);
            continue;
        }
        if (!entry.name.endsWith('.webp')) continue;
        const bytes = await readFile(path);
        const version = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
        const relative = path.slice('dist/assets/images/thumbs/'.length);
        const target = 'assets/versioned-art/' + version + '/' + relative;
        await mkdir(dirname('dist/' + target), { recursive: true });
        await writeFile('dist/' + target, bytes);
        art['assets/images/thumbs/' + relative] = target;
    }
}
await versionArtwork('dist/assets/images/thumbs');
await writeFile('dist/assets/js/artwork-versions.js', 'export default ' + JSON.stringify(art) + ';\n');
