# Palace 5.7.7 — Winter gifts, weather and Hunt polish (build 29)

Apply the website patch AND install the APK. This replaces the earlier 5.7.7 download and includes all its fixes plus the final seven illustrations. The web ZIP opens directly to everything to copy: public/, api/, server/, tests/ and these notes. Copy its contents into your existing repository root on the **testing** branch, merge folders, replace matching files, commit, Push origin and wait for the Testing Vercel deployment. Install Nayleen-Palace-5.7.7-build29.apk over the existing app. Do not uninstall. No new Supabase SQL is needed if the earlier 5.7.3 backup migration is already installed. Live main and account data were not changed while preparing this update.

The patch excludes your music files/catalog, weekly notes, special dates, sayings and personalized site-text files. Keep your current versions. A complete source ZIP is available for reference; use the incremental patch if you have added music since the last uploaded source.

## Weather and sleepwear

- The existing Cloud Cuddle Cardigan is the dedicated Soft cloudy skies outfit. Sunbeam belongs to clear/mainly clear conditions, while rain, storms, snow, cold and wind have their own outfits. Viewing cloudy conditions alone does not unlock Sunbeam. Weather discoveries are lifetime account history, so seeing sun earlier and clouds later legitimately unlocks both.
- Testing reset now also clears the saved weather discoveries while retaining location, units, notes, calendar and music. The current observed weather may then immediately unlock its matching outfit again. That is expected. It does not grant both sun and cloud from one observation.
- Moonbeam Dreamer is now December 1's Advent gift. Nighttime alone no longer unlocks it. Previously owned outfits remain owned; installing this patch does not take away progress.
- From **2:00 AM up to 10:00 AM, device local time**, widget mascot art uses Moonbeam regardless of the outfit chosen in the app room. This is a rendering-only override for native widget tabs; the app room, wardrobe, and in-app weather outfit remain separate. Tests check all 24 hours and confirm the app is not overridden.
- Automatic network weather refresh runs approximately every 30 minutes, with cached forecasts between refreshes. Android may delay background jobs under battery/network restrictions. Opening weather checks for stale data as well. Refresh buttons were removed. Existing attribution remains under Data sources.
- Hourly precipitation probability and weather codes provide an estimated future rain/storm window and chance, when available; this is a forecast rather than a guaranteed start time.

## Games and galleries

- The room's “Nayleen's room / collectibles unlocked” overlay is hidden.
- Outfits, rooms and collectibles use four columns. Initial gallery pages show eight cards; Show more remains available. Text and requirement bars wrap inside the cards. Unopened Advent items stay out of galleries until owned.
- Princess Drop still allows five attempts per week, grants one random normal collectible on the first 1,500-point milestone, and keeps playing toward 3,200. A full basket now explicitly says “Basket full — try again”, shows the score and tries remaining, and explains that the earned weekly collectible is retained. Choosing Finish is distinct from topping out.
- The Flower Knows advent calendar in your screenshot is a normal beauty-calendar collectible. It was not a claim from the December Advent feature. New December gifts are excluded from normal blind box, Hunt, cabinet, Drop and roulette prize pools.
- Hunt draws the selected outfit's actual image, including weather/Moonbeam art, with the old puppet as a loading fallback. Collectible and outfit image caches are separate, avoiding name collisions. Art loads on demand at gallery size instead of preloading the full collection at Hunt startup.
- The earlier 5.7.6 basket caching, coalesced saves and deferred hidden-screen rendering remain. Those removed the expensive work that was interrupting drops and music.

## Advent 2026

All 25 doors can be opened in Testing. Before opening, gifts are secret. Ready gifts grant once and persist in the account save/backups. Production gift claims are date-gated to their December day in Central Time. Note days are waiting for Juan's text; undecided days grant nothing.

All 19 configured item gifts are ready: 1 Moonbeam outfit; 2 Christmas room; 3 7 Brew mug; 4 Christmas Miku plushie; 5 Christmas Mimikyu plushie; 6 Christmas Espurr outfit; 8 Nightcrawler plushie; 9 Christmas Sunday plushie; 10 Damon Salvatore plushie; 11 Salvatore room; 12 Damon outfit; 13 butter squishy keepsake; 15 Chicken Jr with cheesy curly fries; 16 Cloak & Dagger Dreamy Duo plushies; 18 sombr vinyl; 19 Varesa plushie; 20 Santa Cartman plushie; 21 South Park room; 22 Cartman outfit. The seven previously blocked illustrations are now included, optimized for the web, Hunt and native widgets. They grant once through their Advent door and remain excluded from random game rewards.

7, 14, 17: notes to write later. 23, 24, 25: undecided. No extra filler gifts were added. Ian Somerhalder gifts were interpreted as Damon Salvatore themed.

## Verification and release work

Web suites cover save/recovery, once-only Advent claims and date gates, isolated weather conditions, normal-prize exclusion, five Drop attempts and first weekly reward, real Matter.js collisions/balance, and normal UI behavior. Native checks cover weather forecast windows, all 24 sleep boundaries, widget-only overrides, artwork paths and APK signature. Existing isolated PostgreSQL checks verify account/backups with five retained copies and the three-day cadence.

Hunt checks cover 12 hunter/map configurations, 324 outfit/hunter/map power combinations, 180 live path/collision routes with pallets, cipher calibration/locks, all 16 power types, hazards, losing/escaping, checkpoints and recovery. Selected-outfit rendering is exercised with ready sprites. These checks are not a substitute for playing on the Samsung: controls, visual readability, audio mix and difficulty still need a physical-device playtest. No measured Android FPS claim is made.

Before Version 1 — New Horizons: finish the notes and final three days; play every Hunt hunter/map on the phone; verify favorites/notes/calendar/music and claimed gifts after sign-out/reopen and on a second device; test a backup recovery on Testing; test an APK upgrade and fresh install; then prepare the final Updates tab and production release. No Updates tab was added here.

Recommendation: pause new outfits after these planned gifts. Use personal messages, photos, a date invitation or a shared memory for the remaining days; Christmas can be the most personal surprise.
