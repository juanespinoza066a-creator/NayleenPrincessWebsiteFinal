import {adventOptions} from '../server/advent-settings.js';
import { readFile } from 'node:fs/promises';
import { session, reply } from '../server/common.js';
import { ADVENT_NOTE_DAYS, dayKey } from '../server/game-rules.js';

export default async function handler(req, res) {
    res.setHeader('Vary', 'Cookie');
    if (req.method !== 'GET') return reply(res, 405, {error: 'Method not allowed.'});
    try {
        const account = await session(req);
        if (!account) return reply(res, 401, {error: 'Sign in to read your note.'});
        const requested = new URL(req.url || '/', 'https://palace.invalid').searchParams.get('day');
        const day = Number(requested);
        const released = dayKey() >= '2026-12-' + String(day).padStart(2, '0');
        const {adventEnabled, adventPreview} = adventOptions(account.profile);
        if (String(day) !== requested || !ADVENT_NOTE_DAYS.includes(day) ||
            (!adventPreview && (!adventEnabled || !released))) {
            return reply(res, 404, {error: 'This door is still closed.'});
        }
        const notes = JSON.parse(await readFile(new URL('../server/advent-notes.json', import.meta.url), 'utf8'));
        return reply(res, 200, { message: typeof notes[day] === 'string' ? notes[day].trim() : '' });
    } catch { return reply(res, 503, {error: 'The note could not load.'}); }
}
