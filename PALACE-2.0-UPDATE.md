# Palace 2.0 web update

Upload this ZIP’s contents to the root of your existing GitHub **testing** branch. Keep `public/...` and `server/...` paths intact. Commit the whole patch together so browser and server game rules agree. No SQL or schema changes are needed. Wait for Vercel’s Preview deployment, test with 123, then merge **base main ← compare testing** when ready.

This patch omits personalized `public/content/site-text.json`, `public/content/weekly-notes.json`, `public/settings.js`, and `public/assets/js/code-login.js`. Keep your current versions. It adds `public/content/palace-update.json`, which overrides only the updated brand/clicker/upgrade strings after the base text loads. For those labels edit palace-update.json. Existing notes and login-screen wording remain where they were.

## What changes

- The testing profile automatically sees reset/unlock tools. Her profile hides/disables them and click handlers also check the profile. These are UI testing controls, not a replacement for server authentication.
- Sunday’s quiet sanctuary joins Lavender, 7 Brew, lily-of-the-valley garden, Pokémon card shop and Pop Mart. It unlocks at **bestBank ≥ 1000**. The Sunday outfit remains at 200.
- Best Buy and Under Our Stars are removed from choices. Existing selected retired rooms normalize to Lavender; other progress remains.
- Room collectibles rest on styled stands in the web room, exported PNG and updated native widget. Export button is **Save image of room**.
- Squishy Clicker has seven toys: Peanut 0, Butter 250, Cube 1,500, Kitty 6,000, Bunny 15,000, Berry 50,000, Cloud 125,000 lifetime squishes. Each shares the same balance, upgrades and progress; changing toy changes appearance and sound.
- Hearts, crumbs, combos, occasional golden peanuts and milestone celebrations add feedback. Existing upgrade economics/passive production and four-hour offline cap are retained. PJs unlock at 500 and Ada at 100,000 lifetime squishes.
- Weekly box/maze limits and rewards remain as before.

## Editing new names and goals

Room names/hints and squishy names/thresholds are in `public/assets/js/game-rules.js`, mirrored exactly in `server/game-rules.js`. Change both together for rules. Human-facing clicker/upgrade copy is in `public/content/palace-update.json`. Main page text still comes from site-text.json unless specifically overridden there. Weekly love notes stay in weekly-notes.json. Keep valid JSON: line breaks inside a message use `\n`, not raw newlines.

## Android

Install the new 2.0 APK over the current app for widget behavior, bundled Sunday artwork, Gallery PNG saves, installed name and the testing-profile-only Main/Testing selector. Sign in with 123 to reveal that native selector, paste the stable testing branch Preview URL once, and sign into that site with 123. The app remembers it. When ready, select Main while still on 123, then sign out and use 956. See START-HERE-ANDROID.md.

Site and save are separate: testing the Preview with 956 can still write her save if both environments use the same Supabase project. Use 123 for testing. No new Vercel project is needed.

## Compatibility

Save version/key are retained. New skin field is optional for old saves, and retired rooms are accepted on input then normalized. Balances, lifetime totals, prizes, weekly claims, maze claims, upgrades and existing outfit progress are preserved. Keep future personal JSON edits in your own repository; do not replace them with the full reference ZIP just to apply this update.

Checked: rules migration, thresholds, weekly limits, asset paths, production build, JS syntax, browser room/export/mobile layouts and testing/main UI. The new Android widget still needs physical-phone/launcher verification.
