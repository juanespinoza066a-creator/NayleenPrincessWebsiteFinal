# Palace 5.7.7 — Winter gifts, weather and Hunt polish (build 31)

Apply the website patch AND install the APK. This replaces the earlier 5.7.7 download and includes all earlier fixes and the New Horizons testing changes. The web ZIP opens directly to everything to copy: public/, api/, server/, tests/ and these notes. Copy its contents into your existing repository root on the **testing** branch, merge folders, replace matching files, commit, Push origin and wait for the Testing Vercel deployment. Install Nayleen-Palace-5.7.7-build31.apk over the existing app. Do not uninstall. No new Supabase SQL is needed if the earlier 5.7.3 backup migration is already installed. Live main and account data were not changed while preparing this update.

The patch excludes your music files/catalog, weekly notes, special dates, sayings and personalized site-text files. Keep your current versions. A complete source ZIP is available for reference; use the incremental patch if you have added music since the last uploaded source.

## Weather and sleepwear

- The existing Cloud Cuddle Cardigan is the dedicated Soft cloudy skies outfit. Sunbeam belongs to sunny or mostly clear daytime conditions, while rain, storms, snow, cold and wind have their own outfits. Viewing cloudy conditions alone does not unlock Sunbeam. Weather discoveries are lifetime account history, so seeing sun earlier and clouds later legitimately unlocks both.
- Testing reset now also clears the saved weather discoveries while retaining location, units, notes, calendar and music. The current observed weather may then immediately unlock its matching outfit again. That is expected. It does not grant both sun and cloud from one observation.
- Moonbeam Dreamer is now December 1's Advent gift. Nighttime alone no longer unlocks it. Previously owned outfits remain owned; installing this patch does not take away progress.
- From **2:00 AM up to 10:00 AM, device local time**, widget mascot art uses Moonbeam regardless of the outfit chosen in the app room. This is a rendering-only override for native widget tabs; the app room, wardrobe, and in-app weather outfit remain separate. Tests check all 24 hours and confirm the app is not overridden.
- Weather aims to refresh every 15 minutes, with a five-minute retry cooldown after a failed request. Opening the Palace checks for stale data. Android can delay background refreshes. Weather outfits unlock automatically as matching current conditions are observed at your saved location. Looking at a future forecast does not give an outfit.
- Weather in the app and the widget shows today and the next seven days. Tap Forecast on the widget. Near-term rain timing uses 15-minute forecast data when available, with hourly timing and precipitation probabilities as a fallback. The display uses the forecast city’s local time.

## Games and galleries

- The room's “Nayleen's room / collectibles unlocked” overlay is hidden.
- Outfits, rooms and collectibles use wider cards on phones so names stay intact. Initial gallery pages show eight cards; Show more remains available. Text and requirement bars wrap inside the cards. Unopened Advent items stay out of galleries until owned.
- Princess Drop still allows five attempts per week, grants one random normal collectible on the first 1,500-point milestone, and keeps playing toward 3,200. A full basket explicitly says “You lost · Basket full” and shows the score, tries remaining and the exact weekly collectible already earned. Choosing Finish is distinct from topping out.
- The Flower Knows advent calendar in your screenshot is a normal beauty-calendar collectible. It was not a claim from the December Advent feature. New December gifts are excluded from normal blind box, Hunt, cabinet, Drop and roulette prize pools.
- Hunt draws the selected outfit's actual image, including weather/Moonbeam art, with the old puppet as a loading fallback. Collectible and outfit image caches are separate, avoiding name collisions. Art loads on demand at gallery size instead of preloading the full collection at Hunt startup.
- The earlier 5.7.6 basket caching, coalesced saves and deferred hidden-screen rendering remain. Those removed the expensive work that was interrupting drops and music.

## Advent 2026

All 25 doors are available on the Testing profile. Opened doors stay visible after reloading the app and each item grants once. The release profile follows the December calendar in Central Time. Days 7, 14 and 17 show placeholders for Juan’s notes.

The first 19 item gifts are ready: 1 Moonbeam outfit; 2 Christmas room; 3 7 Brew mug; 4 Christmas Miku plushie; 5 Christmas Mimikyu plushie; 6 Christmas Espurr outfit; 8 Nightcrawler plushie; 9 Christmas Sunday plushie; 10 Damon Salvatore plushie; 11 Salvatore room; 12 Damon outfit; 13 butter squishy keepsake; 15 Chicken Jr with cheesy curly fries; 16 Cloak & Dagger Dreamy Duo plushies; 18 sombr vinyl; 19 Varesa plushie; 20 Santa Cartman plushie; 21 South Park room; 22 Cartman outfit. The seven previously blocked illustrations are now included, optimized for the web, Hunt and native widgets. They grant once through their Advent door and stay out of random game rewards and cannot be offered in the Wishing Cabinet or Princess Roulette.

23: WWII War Room · Nazi Germany, a fictionalized German command bunker. 24: Adolf Hitler plushie. 25: Espurr’s Hitler period costume. These bring the total to 22 item gifts.

7, 14, 17: notes to write later. Ian Somerhalder gifts were interpreted as Damon Salvatore themed.

## Verification and release work

Web suites cover save/recovery, once-only Advent claims and date gates, isolated weather conditions, normal-prize exclusion, five Drop attempts and first weekly reward, real Matter.js collisions/balance, and normal UI behavior. Native checks cover weather forecast windows, all 24 sleep boundaries, widget-only overrides, artwork paths and APK signature. Existing isolated PostgreSQL checks verify account/backups with five retained copies and the three-day cadence.

Hunt checks cover 12 hunter/map configurations, 336 outfit/hunter/map power combinations, 180 live path/collision routes with pallets, cipher calibration/locks, all 16 power types, hazards, losing/escaping, checkpoints and recovery. Selected-outfit rendering is exercised with ready sprites. These checks are not a substitute for playing on the Samsung: controls, visual readability, audio mix and difficulty still need a physical-device playtest. No measured Android FPS claim is made.

Before Version 1 — New Horizons: finish the three notes; play every Hunt hunter/map on the phone; verify favorites/notes/calendar/music and claimed gifts after sign-out/reopen and on a second device; test a backup recovery on Testing; test an APK upgrade and fresh install; then prepare the production release. The Updates tab is titled Version 1.0 · New Horizons. The Testing APK still loads the hosted app screens and saves progress to the existing account.

Recommendation: pause new outfits after these planned gifts. Use personal messages, photos, a date invitation or a shared memory for the remaining days; Christmas can be the most personal surprise.
