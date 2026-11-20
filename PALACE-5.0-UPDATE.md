# Nayleen’s Palace 5.0 — Games, weather & a livelier Espurr

## Install and test in this order

1. Download **Nayleen-Palace-5.0-Web-Update.zip** and extract it.
2. On GitHub, select **testing**, open the repository ROOT (where `public`, `api`, `server`, `database` and `vercel.json` already live), then **Add file → Upload files**. Upload the patch’s extracted folders/files together, preserving their paths. Upload their contents, not the ZIP. Commit the upload to **testing**. Do not put `public` inside your existing `public` folder.
3. Wait for Vercel’s **Preview / testing** deployment to say **Ready**. Use your existing working testing URL. Sign in with **123**. No new Vercel project, environment variable or SQL is needed.
4. Install **Nayleen-Carnival-Android.apk** (**5.0 / versionCode 11**) OVER your installed app. **Do not uninstall.** The same application ID and signing key preserve your app settings, notes and widget picture. In the app, use your existing owner-only Main/Testing switch and test the Preview with 123.
5. Open your room once. Visit **Widgets → Weather** to choose a city or enable approximate location if desired. On Home, the widget now has Room, Calendar, Notes and Weather tabs. It uses a new layout resource to refresh the old layout. If your launcher keeps an old view, remove/re-add ONLY the widget.
6. When happy, merge **testing → main** and wait for the Production deployment. Use the existing Main switch to return to the live site. The installed 5.0 APK will load that updated website; no second APK is needed for this merge.

**Use the small Web Update ZIP for your existing repository.** It excludes `server/weekly-notes.json`, `server/special-dates.json` and `public/content/site-text.json`, so your personalized notes/dates/text are not replaced. The full `NayleenPrincessWebsiteFinal-main.zip` is a complete reference copy from the supplied project; avoid replacing newer personal writing in GitHub with that reference.

Upload the web patch’s client and server files together. Testing and main can share Supabase: signing in with the SAME code across them uses the SAME profile. Use **123 for this preview**; do not use 956 to try resets/new progress before both branches run this version. Older website versions do not know the new game fields. No deployment or live-data change has been performed for you.

## What changed

| Place | New behavior |
| --- | --- |
| Game buttons | Dark purple means ready; light purple means resting/unavailable. |
| Gambling Paradise | Blackjack, Wishing Cabinet, and Princess Roulette, each with Espurr present. |
| Roulette | Offer one owned collectible, choose rose or violet, then spin. Correct color awards two random collectible draws; wrong color/green zero loses the offering. Three spins weekly. Duplicates are possible; ownership remains one copy per collectible. |
| Weekly blind box | One permanent, larger home-page strip, with Espurr and a cuter reveal. The duplicate game-card entry is removed. |
| Princess Drop | A physics-based treasure basket: aim and drop, merge equal collectibles into larger ones, avoid overflowing the ribbon, reach **1,400 sparkle points**. One run per week, resumable. A win immediately grants one random collectible, room, or outfit. |
| IDV Hunt | A weekly rotation through Ann, Antonio the Violinist, Joseph the Photographer, and Grace the Naiad. Three layouts per hunter, twelve in total. |
| Hunt powers | Every current outfit has its own ability; the opening tutorial and help explain the current power. |
| Room widget | Larger composition, theme ornaments, more gentle poses, stretching, little hops, pet hearts and a collectible-holding pose. The scene is recomposed uniformly with its background so furniture and collectibles stay aligned. |
| Calendar | Arrows sit outside the calendar card with a visible gap. Compact calendars use clear day numbers with special-date/holiday colors. |
| Notes | Full wrapped paragraphs in a vertically scrolling widget list. Checkbox, × removal, bulk removal and Undo remain available. |
| Weather | A fourth widget tab and in-app section, with a raincoat/umbrella for rain, sun/cold accents, weather particles, local temperature and forecast age. |
| Sayings | Editable in one private JSON file, with longer time slots so rapid tapping doesn’t cycle through everything. |

### Weekly play and prizes

New game weeks reset Monday at midnight **America/Chicago** (Central local time, including daylight saving). Roulette’s three spins and Drop’s one run persist through reload/sign-in. Starting Drop spends that week’s run; leaving pauses/resumes it rather than granting another attempt. Keep treasures below the ribbon; a settled overflow ends the run after a short grace period. Use the Drop button or tap/release on the basket; arrow keys aim and Space/Enter drops on a keyboard.

A Princess Drop room/outfit prize is immediately owned even if its normal long-term quest is unfinished. The existing quests still work. Collectible prizes can be duplicates. A finished run awards only once. There are no real-money purchases or wagers. Reset progress clears these new game limits and reward grants too; it does not erase your phone’s Princess Notes or weather preferences.

### Hunters, maps and practice

| Hunter | Three gardens | Little trick |
| --- | --- | --- |
| Ann · Disciple | Lavender Abbey, Cat Courtyard, Moonlit Hedges | A cat circle briefly tangles your steps. |
| Antonio · Violinist | Rose Conservatory, Backstage Waltz, String Garden | Glowing strings drain sprint energy if crossed. |
| Joseph · Photographer | Portrait Gallery, Mirror Courtyard, Clockwork Studio | A camera frame gives away your hiding place and briefly slows your steps. |
| Grace · Naiad | Tidal Garden, Fountain Courtyard, Moonwater Grotto | Water pools slow you and drain sprint energy. |

The hunter changes weekly; returning hunters cycle through their three maps over twelve weeks. Existing unfinished maze saves retain their original Ann layout. Each run keeps the outfit power it started with.

With **123**, the hunt’s opening screen offers a **Choose an adventure** option. Pick the hunter, garden, and outfit power before starting. This practice grants no prizes, progress, peanut counts or weekly use. Turn it off to enter the normal scheduled weekly adventure. These controls are not offered to 956. To choose another practice, return to the Palace and re-enter the hunt.

| Outfit | Power |
| --- | --- |
| Royal | Psychic stun: freeze a nearby hunter for 5 seconds. |
| Sunday | Quiet sanctuary: restore one heart and gain 4 safe seconds. |
| Peanut PJs | Cozy recharge: refill sprint energy and gain 6 swift seconds. |
| Espeon | Dream blink: move forward through an open path. |
| Akali | Smoke ribbon: hide for 8 seconds. |
| K/DA | Encore dash: dash and briefly stun a nearby hunter. |
| Furina | Bubble curtain: clear hazards and gain 6 safe seconds. |
| Rogue | Borrowed courage: freeze the hunter and borrow swift steps. |
| Ada | Gentle focus: heal and decode faster for 10 seconds. |
| Jubilee | Sparkle burst: longer-range, 4-second stun. |
| Midnight Mutant | Midnight veil: hide and gain a protective shield. |
| Rafayel | Painted tide: stop the hunter while decoding faster. |
| Booster pack | Lucky pull: add 10 points to the nearest unfinished cipher. |
| Firestarter | Warm encore: swift movement and a brief escape from sight. |
| Reze | Ribbon surprise: send a sparkle decoy away from you. |
| Cissia | Case closed: speed your current interaction and briefly hide. |

Three charges per run; finishing a cipher restores one. Moving still cancels collection/pallet/exit interactions. Missed calibrations still lock decoding for three seconds.

## Personalize Espurr’s words

Edit **`server/espurr-lines.json`** in GitHub. Keep valid JSON: double quotes, commas between entries, no literal unescaped line breaks inside a quoted string. Use `\n` for a line break.

- `thoughts`, `morning`, `afternoon`, `evening`: room greetings and little thoughts.
- `headpats`, `wantsHeadpats`: pet responses and headpat requests.
- `sleep`, `noon`: nighttime sleep and the little noon nap.
- `rain`, `sun`, `cold`, `cloud`, `wind`: weather sayings.
- `squishy`: the three existing Squishy Clicker encouragement messages.

Add/remove array entries freely; retain at least one per category. The sayings use daily/four-hour slots, and repeated headpats keep the current slot’s response. The widget’s gentle pose frames change on their own. Petting has no effect on game progress. Espurr keeps the existing midnight–7am sleep and noon nap.

The website and app fetch sayings through the signed-in updates endpoint. The file is outside the public website. After deploying a sayings edit, revisit your room; **Widgets → Calendar → Refresh my dates** also refreshes the cached sayings. Offline, the APK retains its bundled/cached words. For changing the APK’s initial offline fallback itself, edit `NayleenAndroid/app/src/main/assets/espurr-lines.json` and rebuild. Keep your source repository/private downloads private if you put personal writing in them.

Other text: `public/content/site-text.json`, with existing overrides in `public/content/palace-update.json` and `public/content/wardrobe-update.json`. Notes stay in `server/weekly-notes.json`; special dates stay in `server/special-dates.json`. New hunt map names, hints, powers and layout coordinates are in the matching **`public/assets/js/hunt-config.js`** and **`server/hunt-config.js`** files. Keep the client/server rule/config copies identical.

## Weather and privacy

Weather is optional. Choose a city without granting location, or tap **Use approximate location** and accept Android’s permission. Location is requested while that small settings screen is open; no background-location permission is added. Your saved area is rounded to roughly a few kilometers and kept on the phone. Coordinates are sent to Open-Meteo to get the forecast; your Palace code, notes and game saves are not sent with that request. **Forget my weather location** clears it and stops its refresh job.

The chosen area stays until you change it; tap **Use approximate location** again after traveling to a new city. Fahrenheit is the default; the in-app weather page can switch to Celsius. The weather tab refreshes when stale and has a manual Refresh button. Android may delay periodic background refreshes while sleeping, offline or saving battery. The last successful update time remains visible; a forecast is an estimate. Rain/storm uses the new umbrella artwork; sunshine adds a little sun hat, cold/snow adds a scarf, and precipitation has gentle moving frames. Weather art is separate from your earned outfit and does not change it.

Forecast/geocoding: [Open-Meteo](https://open-meteo.com/), [terms](https://open-meteo.com/en/terms), [forecast docs](https://open-meteo.com/en/docs), [city search docs](https://open-meteo.com/en/docs/geocoding-api), weather data under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). The free endpoint suits this personal, noncommercial gift app; check the provider’s terms if you later distribute it commercially. No weather key is required for this version.

## Source, checks and phone review

**Nayleen-Android-App-and-Widget.zip** contains the updated Android Studio/Gradle project and a matching full website reference. Keep its signing key private and backed up; do not upload the Android ZIP or its key to GitHub. Future APK version codes must exceed **11**. Build with SDK/Build Tools 35, Java 17+, `./gradlew assembleDebug` (Windows: `gradlew.bat assembleDebug`) from `NayleenAndroid`.

Website checks: Node 22+, `npm ci`, `npm test`, `npm run build`. Matter.js is bundled locally with its MIT license. LinkeDOM is a development-only DOM test dependency. Artwork details and the final rain-art prompt are in **PALACE-5.0-ARTWORK.md**.

Passed: all ten web test files, including real Matter collisions and one-time rewards; roulette wager/weekly limits; Drop resume/grants/reset/save API round trips; all twelve map paths; all sixteen ability behaviors; owner practice isolation; existing progress/gallery/garden/cabinet regressions; login-protected notes/updates; notes migration and Undo; special-date reminders; weather code mapping and saying time slots; Java/resource compilation; APK alignment and matching v2/v3 signing certificate.

A physical Samsung/launcher test was not available here. Before giving her the update, check with 123: each new game, returning to a saved Drop run, hunter/map/power practice, weekly exhaustion and Reset, a long paragraph note and its scrolling/checkbox/×/Undo, all four widget pages at your chosen sizes, calendar-arrow spacing, weather with city search and optional permission denied/allowed, Open app only when deliberately pressed, room sync after changing outfits/rooms, and install-over-existing keeping notes/settings. The new native widget layout must also be reviewed on your phone; compilation alone cannot confirm its final launcher rendering.
