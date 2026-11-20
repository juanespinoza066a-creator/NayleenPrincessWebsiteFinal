# Palace 5.2 — Centered rooms, animated hunters and a royal exchange

## Install the update

1. Extract **Nayleen-Palace-5.2-Web-Update.zip**. In GitHub select **testing**, then upload its extracted files and folders at your repository ROOT, keeping the paths. Do not upload the ZIP itself or put public inside public. This is a patch against 5.1: install the 5.1 web update first if you have not already done so.
2. Wait for Vercel Preview to say Ready. Open your working testing URL with **123**. No SQL or environment changes are needed.
3. Install **Nayleen-Carnival-Android.apk**, version **5.2 / code 13**, OVER your existing app. Do not uninstall. The app name is still Nayleen’s Palace; the download filename is retained for continuity. The package identity and signing certificate are unchanged.
4. Visit Room once after both updates. This refreshes the saved room geometry for the widget. Check your widget at its usual size and after resizing. Keep using the owner-only Main/Testing switch.
5. When you are satisfied, merge testing into main and switch back to Main. Use **123** for tests: if testing and main use the same backend, **956 accesses her same real save on both**.

The small web patch preserves `public/content/site-text.json`, `server/weekly-notes.json`, and `server/special-dates.json`. It also leaves the editable `server/espurr-lines.json` unchanged. Use the patch for your existing repository so newer personal writing is kept. The full website ZIP is included as a complete reference, not a reason to overwrite your personal writing.

## What changed

- **Centered, still room:** Espurr is centered again in the website and the in-app Palace Room. Her room movement and idle poses remain in the native home-screen widget only. Save image of room stays centered above the room.
- **Whole room in the widget:** the extra zoom based on the positions of individual items is removed. The entire captured room is fitted and centered without stretching it. Themed decorations still fill the surrounding space. Different widget shapes can have extra space so the whole room stays visible.
- **Room refresh:** changing Espurr’s position or an item’s placement now refreshes the widget even when the selected outfit and room have not changed. Visit Room once after updating.
- **IDV hunters:** Ann’s established animated puppet is retained. Antonio, Joseph and Grace now use articulated drawings with layered clothing, faces, moving hair and their violin, camera and harpoon details. Gameplay no longer uses their flat portrait PNGs as actors. Actual character portraits remain on the game icons.
- **A hidden peanut:** the Find peanut prompt is gone. A peanut can appear at a new reachable location in each match, including after you found one in an earlier hunt. Resuming keeps that match’s location and discovery state. Once found, My peanut opens the pocket toy.
- **Sharper Princess Drop:** the basket now renders at the phone’s pixel density (up to 3×), rather than stretching a 400-pixel drawing buffer. Physics and touch coordinates stay unchanged. A warmer gradient, drifting hearts/stars, shiny treasure bubbles, shadows and a separate next-treasure preview make the basket clearer.
- **Princess roulette:** the wheel has a pointer, glow, Espurr cheering and a prize arrival animation. The exchange review stays inside the app; it does not open a browser-style confirmation with a website address. Selection scrolls back to the wheel and submit area, with the prize shown there.

The previous 5.1 fixes remain: show more expands all items at once; readable light game cards; dark purple available casino actions and light purple unavailable actions; four new rooms; weekly blind box wording; Ribbon Surprise’s visible lure and other power effects.

## Roulette rules

**Offer TWO different eligible owned items for ONE guaranteed random prize. Once per Monday week.** The prize category is selected first using these chances, then an item is selected from that category.

| Prize category | Chance |
| --- | --- |
| Collectible | 85% |
| Room | 10% |
| Outfit | 5% |

- Offerings can be collectibles, rooms or outfits, including a mixed pair.
- Both offerings leave your owned collection. Offered shelf collectibles are cleared from the room.
- The starter room, starter outfit, currently selected room and currently worn outfit cannot be offered.
- Traded rooms and outfits stay removed even if you already fulfilled their original quest. They can return as random prizes. Your historical quest progress stays recorded.
- A prize is always awarded. Duplicates are possible; there is no reroll for an already owned prize. A prize can also be one of the two offered items.
- Any exchanges already used this week count as used after the update. This update does not grant another turn. **Reset all on 123** gives you a fresh test. Never reset 956 to test this.
- The normal weekly boundary remains Monday at midnight Central Time, including daylight saving time.

## Weather

Your working 5.1 weather implementation is preserved unchanged. The earlier update reduced repeated large-image allocations, bounded the rendered image sizes, reused widget pictures, improved location-provider and permission handling, and added timeout/fallback/error handling. Those address likely failure paths; without a Samsung crash log we cannot identify one proven original cause. This update does not alter location permissions or forecast behavior.

## Phone review

Check Room centering and the exported PNG, then visit Room to refresh the widget. Confirm the whole scene is visible at small and large widget sizes and that idle motion stays in the widget. Try each hunter/map in 123 practice and discover the hidden peanut; resume the match and confirm it stays found. Review Princess Drop sharpness, aim/drop/merge and resume. For roulette test a mixed pair, protected items, the category result, save/reopen, and the weekly lock. Keep testing weather as you normally use it.

Automated checks passed: all 12 web test files, including the exact 85/10/5 split, guaranteed prizes, offering removal/reacquisition, legacy weekly use, save API round trips, 12 reachable maps, all 16 powers, 192 hunter/map/outfit drawing combinations, peanut persistence and 3× canvas density. Native checks passed for 36 full-room size/aspect combinations, geometry refresh, notes, calendar, personality, weather models, snapshot/profile gates, compilation, resource alignment and the existing APK signature. These are source, model and build checks; physical Samsung launcher appearance and live rendering still need your review.

## Source and editable files

- Personal weekly notes: `server/weekly-notes.json` (kept behind the existing login).
- Espurr’s sayings: `server/espurr-lines.json`.
- Special dates: `server/special-dates.json`.
- Visible wording: `public/content/site-text.json`.
- Roulette odds/rules: `server/game-rules.js` and its matching `public/assets/js/game-rules.js` copy. Keep these copies identical when editing.

Website: Node22+, `npm ci`, `npm test`, `npm run build`.
Android source: SDK35 and Java17+, from NayleenAndroid run `./gradlew assembleDebug` or `gradlew.bat assembleDebug`. Future version codes must exceed13. Keep the Android source ZIP and signing key private.
