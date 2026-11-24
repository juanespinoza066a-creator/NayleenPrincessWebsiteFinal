import { readFile } from 'node:fs/promises';
import { session, reply } from '../server/common.js';
import { weekNumber } from '../server/game-rules.js';

const IMAGE_TYPES = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif'
};
function imageType(file) {
    if (typeof file !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,95}\.(jpe?g|png|webp|avif)$/i.test(file)) return '';
    return IMAGE_TYPES[file.split('.').at(-1).toLowerCase()];
}

export default async function handler(req, res) {
    res.setHeader('Cache-Control', 'private, no-store');
    res.setHeader('Vary', 'Cookie');
    if (req.method !== 'GET') return reply(res, 405, {error: 'Method not allowed.'});
    try {
        if (!await session(req)) return reply(res, 401, {error: 'Sign in to read your notes.'});
        const data = JSON.parse(await readFile(new URL('../server/weekly-notes.json', import.meta.url), 'utf8'));
        const currentWeek = weekNumber();
        const notes = data.notes.filter(note => note.published === true &&
            Number.isInteger(note.week) && note.week >= 1 && note.week <= currentWeek);
        const week = new URL(req.url || '/', 'https://palace.invalid').searchParams.get('image');
        if (week !== null) {
            const note = /^[1-9][0-9]?$/.test(week) && notes.find(item => item.week === Number(week));
            const type = imageType(note?.image);
            if (!type) return reply(res, 404, {error: 'Photo unavailable.'});
            let photo;
            try { photo = await readFile(new URL('../server/weekly-images/' + note.image, import.meta.url)); }
            catch (error) {
                if (error.code === 'ENOENT') return reply(res, 404, {error: 'Photo unavailable.'});
                throw error;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', type);
            res.setHeader('X-Content-Type-Options', 'nosniff');
            return res.end(photo);
        }
        return reply(res, 200, { startDate: data.startDate, notes: notes.map(note => {
            const {image, ...message} = note;
            return { ...message, hasImage: Boolean(imageType(image)) };
        }) });
    } catch { return reply(res, 503, {error: 'The notes could not load.'}); }
}
