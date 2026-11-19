# Future reward pacing

Keep earned rewards, existing outfits and existing room requirements intact. New reward journeys should use challengeProgress and meaningful play across DIFFERENT Central-time days or Monday weeks rather than only a large currency total.

- Early new outfits: about 7–14 qualifying days. Later variants: several different weeks (current long goal: 8 escape weeks).
- Future rooms: favor a multi-week journey plus varied active play; avoid a one-session score-only unlock. Do not introduce an automatic currency-spend cost unless the user asks.
- Do not require consecutive-day streaks. Missing a day/week loses nothing. Show visible per-requirement progress and permanently retain earned long-term outfit IDs.
- A play day is 3 completed table hands, 100 MANUAL squishes, a weekly box reveal, a wish, or a completed maze. Opening pages/dealing then abandoning hands/offline production alone do not count.
- All dates use America/Chicago; weeks start Monday at midnight with DST handled by Intl. Do not multiply week credit for duplicate actions or resumed runs.
- Add future outfits to OUTFITS and OUTFIT_CHALLENGES. New rooms can reuse challengeProgress, but must also be integrated in unlockedRooms and earn persistence when implemented.
- Client and server game-rules.js must match exactly. Keep optional journey migration for older saves and Reset/Unlock-everything behavior. New fields cannot require a SQL migration because saves are JSON.
- Text goes in public/content/wardrobe-update.json; never replace personalized site-text.json or weekly letters just to add a reward.
- Gallery pagers are shared by outfits, collectibles and rooms. Keep initial galleries at six entries and reveal six more per click. Preserve expanded state during save/progress redraws and use the existing silhouette styling for locked artwork.
- Add new artwork to the Android artwork catalog so the room, calendar, notes portraits and widget renderer recognize it. Preserve native layout, scaling and item placement unless that is requested.
