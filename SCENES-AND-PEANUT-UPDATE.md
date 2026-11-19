# Ada, Emil, rooms, and game update

## Upload this update

1. Extract `Princess-Scenes-and-Peanut-Update.zip`.
2. On GitHub choose the `testing` branch of your existing repository.
3. From the repository root, use Add file → Upload files. Drag in the extracted `public` and `server` folders together, keeping their paths. Commit all files in one update.
4. Wait for the Vercel Preview deployment. Test using your testing profile code, 123, rather than her 956 profile.
5. When happy, open a pull request with base `main` and compare `testing`, then merge. If there are conflicts, keep your personalized text and the newer game changes.

The small update ZIP contains 17 changed website/server files and this guide. It does not replace your `public/content` JSON, weekly notes, login text, settings, API routes, SQL, or environment variables. It assumes you already installed the previous room-design update. The full ZIP is also included separately for a complete checkout; it reflects the latest uploaded source, so preserve any newer GitHub edits if using the full ZIP.

Upload **both** public and server: the new upgrade and room rules are shared by the browser and save server. No new SQL or Vercel variables are needed for this update. Existing saves migrate the four new upgrade levels to zero. Saved outfits, collectibles, weekly claims, and current progress remain compatible.

## What changed

- Ada's portrait now uses her gray high-neck dress, dark belt, chain, brown braids, and boots. Emil has dark messy hair, green goggles, gray patient clothes, wraps, and forearm braces.
- All seven scenes appear under Rooms. Existing room IDs are retained. Collectibles use room-specific positions, and Save room PNG exports the chosen illustrated background, outfit, and placed collectibles.
- Locked outfit, room, and collectible previews retain their silhouettes.
- Weekly availability estimates remain in place.

| Room | Unlock |
| --- | --- |
| Lavender daydream | Available from the beginning |
| 7 Brew coffee stop | Buy 10 peanut upgrades in total |
| Lily-of-the-valley garden | Collect 10 different treasures |
| Under our stars | Find the peanut in Ann's garden |
| Pokémon card shop | Play 10 hands at the card table |
| Best Buy card campers | Reach a best card-table score of 500 |
| Pop Mart date | Open 3 weekly blind boxes |

## Peanut Factory

Ada replaces the old peanut-master milestone at **100,000 lifetime crunches**. Spending crunches does not reduce lifetime progress. Peanut crunchy PJs stay at 500.

- Midnight peanut roaster: +15 per second, starting cost 500.
- Caramel-coated fingers: +8 per tap, starting cost 1,200.
- Tiny delivery ducks: +60 per second, starting cost 3,000.
- Princess music box: +10% to all automatic production per level, starting cost 8,000.
- Prices grow by 1.5 per purchase, with a 50-level cap. Existing upgrades and four-hour offline earnings remain.
- Moving conveyor, crumb bursts, squish animation, a visible crunch streak, and worker status.
- Ten rapid taps grant a bonus. Every 25 manual taps, a golden peanut appears for ten seconds; catching it gives one bonus.
- Vibration is optional and off initially. Enable it in the peanut page header. Unsupported browsers show Vibration unavailable. Hardware, browser, and phone settings may prevent vibration even if the API exists. Physical phone vibration was not tested here.

## 21 table

The purple/gold table keeps Espurr in her selected outfit. Cards have corner ranks and suit pips, a patterned deck, shuffle/deal/chip/outcome sounds, paced dealer reveals, win sparkles and a cheer animation, a bust shake, and a session hand/streak display. Existing scoring, outfit goals, and between-hand reset are retained. All currency is pretend.

## Where to edit wording

- Your existing site and game copy: `public/content/site-text.json`.
- The 52 weekly notes: `public/content/weekly-notes.json` (unchanged by this patch).
- Login sentence: `public/assets/js/code-login.js` (unchanged by this patch).
- New room names/hints: `ROOMS` in `public/assets/js/room-studio.js`; keep room definitions in browser/server `game-rules.js` consistent if editing unlock rules.
- New peanut labels and effects: `public/assets/js/peanut-factory.js`; upgrade defaults in `public/assets/js/default-text.js` and `game-rules.js`.
- New card-table labels: `public/assets/js/table21.js`.

Keep IDs such as `cafe`, `ada`, and `emil` unchanged when renaming things; these identify items in saved progress.

## Phone notifications: possible next update

Notifications are **not configured or sent by this ZIP**. The existing stack can support Web Push: Supabase would store opted-in device subscriptions; a protected Vercel endpoint would send notifications; a service worker would display them even when the page is closed. This needs a web-app manifest, service worker, subscription table, VAPID keys, opt-in/unsubscribe controls, and a sending endpoint. Weekly reminders additionally need a scheduled sender; new-note alerts could be sent manually after publishing a note.

On iPhone/iPad with iOS/iPadOS 16.4 or later, she would add the web app to the Home Screen, open it there, and tap an opt-in button to allow notifications. Browser and OS notification settings still apply.

Official references:
- https://webkit.org/blog/13878/web-push-for-web-apps-on-ios-and-ipados/
- https://developer.mozilla.org/en-US/docs/Web/API/Push_API
- https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate

## Verification

Checked syntax/build, old-save normalization, matching browser/server rules, upgrade costs/rates, Ada's threshold, room unlocks, and local asset paths. In-browser checks covered room selection, placing Emil, a PNG export, peanut upgrades and a golden bonus, a complete 21 hand, and narrow layouts at 340 CSS pixels. No live Supabase save or production deployment was changed.
