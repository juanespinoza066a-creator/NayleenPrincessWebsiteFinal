import {db} from './common.js';
import {normalizeState} from './game-rules.js';

export async function loadPlayer(profile) {
    const rows = await db(`carnival_saves?profile=eq.${profile}&select=state,revision&limit=1`);
    const row = rows[0];
    return {
        userId: profile + '-code-profile',
        state: row?.state ? normalizeState(row.state) : null,
        revision: row?.revision || 0
    };
}
