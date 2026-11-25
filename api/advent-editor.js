import { readFile } from 'node:fs/promises';
import { session, reply } from '../server/common.js';
import { ADVENT_NOTE_DAYS } from '../server/game-rules.js';

export default async function handler(req, res) {
    res.setHeader('Vary', 'Cookie');
    if (req.method !== 'GET') return reply(res, 405, {error: 'Method not allowed.'});
    try {
        const account = await session(req);
        if (!account) return reply(res, 401, {error: 'Sign in to edit the calendar.'});
        if (account.profile !== 'testing') return reply(res, 403, {error: 'This page is for the calendar editor.'});
        const load = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
        const [settings, notes] = await Promise.all([
            load('../server/advent-settings.json'), load('../server/advent-notes.json')
        ]);
        return reply(res, 200, {settings, notes, noteDays: ADVENT_NOTE_DAYS});
    } catch {
        return reply(res, 503, {error: 'The calendar editor couldn’t load. Try again shortly.'});
    }
}
