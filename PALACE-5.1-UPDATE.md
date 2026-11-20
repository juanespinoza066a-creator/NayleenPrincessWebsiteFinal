# Palace 5.1 — Hunt polish, four rooms, weather reliability

1. Extract **Nayleen-Palace-5.1-Web-Update.zip**. In GitHub select **testing**, then upload its extracted folders/files from the repository ROOT, preserving paths. Do not upload the ZIP itself or nest public inside public. The patch is against 5.0; install the earlier 5.0 web patch first if you have not installed it yet.
2. Wait for Vercel Preview to be Ready. Open your working testing URL with **123**. No SQL or environment changes are needed.
3. Install **Nayleen-Carnival-Android.apk**, version **5.1 / code12**, OVER the existing app. Do not uninstall. The signing key and package identity are unchanged.
4. Visit your room, then review Room/Calendar/Notes/Weather from the widget. Use your existing owner-only Main/Testing switch. When satisfied, merge testing into main and switch back to Main. Use 123 during preview; 956 shares her real save across branches if both connect to the same backend.

The patch excludes your `public/content/site-text.json`, `server/weekly-notes.json`, and `server/special-dates.json`. It keeps existing progress and consumed weekly turns. Reset on 123 is available when you want fresh weekly tests. The full website ZIP is a reference copy; use the small patch for your existing repository to preserve newer personal writing.

## Changes

- Show more expands the whole outfit/collectible/room gallery once. Show less collapses it. Expanding stays expanded through save updates.
- Espurr stays still in the website/in-app Palace room. Widget poses continue. Save image of room is centered above the room.
- Four new room illustrations: Gambit’s card lounge, Block-built daydream, Moonlit manor, A little dinner date. All have foreground floor placements for collectibles. Native widget artwork is included.
- “Weekly blind box” replaces the “Her…” label. Princess Drop’s tiny collectibles sit side by side.
- Game entry cards return to light, readable backgrounds. Casino choices/actions stay dark purple when available and light purple when unavailable.
- Roulette now exchanges TWO different owned collectibles for ONE random collectible. No color guessing or losing spin; duplicates remain possible. Three exchanges per Monday week. The submit control and prize result sit directly below the wheel.
- Actual Ann/Antonio/Joseph/Grace portrait icons come from the official Identity V character roster. Their original attribution/source list is in `PALACE-5.1-ARTWORK.md`.
- IDV Hunt retains its twelve layouts and weekly rotation, with official character illustrations for Antonio/Joseph/Grace, richer fallback silhouettes/accessories, readable power bursts, healing hearts, active buff auras, translucent concealment and a duration label. Ann’s established animated character is retained.
- Ribbon Surprise now places a visible, reachable decoy and ribbon trail. The hunter actively follows that lure without the old attention-distance restriction. Reaching it causes a short startled pause. Normal practice still grants no prizes or weekly use.

## New room quests

| Room | Requirement |
| --- | --- |
| Gambit’s card lounge | Finish 5 card hands in each of 8 different weeks |
| Block-built daydream | 18 cozy squishy days (100 hands-on squishes per day) |
| Moonlit manor | Join the hunt in 12 different weeks |
| A little dinner date | 28 play days and boxes opened in 6 different weeks |

These reuse existing recorded journey progress. Unlock everything on 123 includes all four. Princess Drop can award these rooms immediately, just like the other rooms.

## Weather changes and phone check

Weather now uses one bounded illustration per view instead of repeatedly allocating three large pictures. Widget frames reuse one bitmap. Rendering has a small friendly fallback, scheduling/callback errors are contained, and forecast retry timing stays bounded.

Choose a city, or **Use my location**. Android can offer approximate or precise location; GPS is available if you allow precise access. Location is requested only while that settings screen is open, with a timeout and a city fallback. Make sure phone Location is enabled. The saved forecast area is still rounded before being sent to Open-Meteo. There is no background-location permission. If you prefer not to allow location, city search works independently.

These address likely failure paths; no Samsung crash log or physical-device reproduction was available, so the reported crash is not confirmed resolved on your specific phone. Please test repeated Weather open/close, city search, permission denied, approximate permission, precise permission, Location switched off, offline refresh, and widget resizing. If it still closes unexpectedly, report whether it happens before or after choosing a place and which permission option was selected.

Weather remains optional and phone-local. Princess Notes, profile separation, sign-in, existing outfits and collectibles are preserved. Espurr’s editable speech remains in `server/espurr-lines.json`.

## Validation

All 10 web test files passed: save API round trips, corrected roulette limits and offerings, all gallery expansion states, 12 reachable maps, 16 ability behaviors, a reachable decoy followed by the hunter, canvas effect paths, practice isolation and existing game regressions. Native resource/Java/D8 compilation, signature/alignment checks and weather model tests passed. The APK is signed with the existing certificate. Physical phone/launcher behavior still needs review.

Source build: SDK35, Java17+, from NayleenAndroid run `./gradlew assembleDebug` or `gradlew.bat assembleDebug`. Future codes must exceed12. Keep the Android source ZIP/signing key private. Website checks: Node22+, `npm ci`, `npm test`, `npm run build`.
