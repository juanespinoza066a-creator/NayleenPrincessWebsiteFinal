# Fixed installation —5.7.5 build25

Your uploaded ZIP had the patch inside Website-update/, while the live public/ and server/ files were still5.7.4. This corrected complete ZIP has already applied that patch to the correct files and removed the redundant nested folder. Your songs and personal content are retained.

1. GitHub Desktop: select **testing**, then Fetch/Pull. Choose Repository → Show in Explorer (Ctrl+Shift+F).
2. Extract this corrected complete ZIP. Open the extracted folder until you can see **public**, **server**, **api** and **package.json** together.
3. Select all those files/folders and paste them DIRECTLY into the repository folder opened in step1. Merge folders and replace matching files. Do not paste the outer ZIP folder or a Website-update folder into the repository.
4. If the old extra Website-update folder is still inside your repository, remove only that unused folder. Keep the real public/server/api folders.
5. GitHub Desktop should show changes to **public/assets/js/carnival.js**, **public/assets/js/game-rules.js**, **server/game-rules.js**, plus new weather assets/modules. If it only shows Website-update/... paths, the files are still nested incorrectly. Commit to testing, then Push origin.
6. Wait for the Testing Vercel deployment to finish. In the app select **Testing** and reload the Room page. The wardrobe should say24 total outfits and show a Winter2026 tab at the website header. Changes do not appear before the testing deployment succeeds.
7. The verified APK is5.7.5 / build25 and includes the music seek popup, lightweight widget timer, native calendar fixes and all8 weather outfits. Install it OVER the existing app if unsure which build is installed. Do not uninstall.

No new Supabase SQL. Main remains unchanged. The downloadable APK was read back and its bytes match the verified build (SHA256:75cd2282ec545fd7902a980a9079bde0a32bf7d3543e841d13f8f12c615ff65d). A phone's installed APK cannot be verified from this ZIP alone.


# Palace 5.7.5 — Testing patch

1. In GitHub Desktop select **testing**, then Fetch/Pull.
2. Extract **Nayleen-Palace-5.7.5-Web-Update.zip**. Open the extracted patch folder and copy **the public and server folders plus the other files directly into your repository folder**, merging folders and replacing matching files. Commit to testing and Push origin. This patch does not include your music catalog/audio, letters, personal dates or personalized site text.
3. Wait for the Testing Vercel deployment, then install the **5.7.5 APK** over your existing app. Do not uninstall it. The version code is 25 and its signing identity matches your current app.
4. Open Testing and visit the Room page once so its new furniture positions reach the widget. The native calendar, weather outfits and seek popup need the new APK.

**No new Supabase SQL.** Continue using your current 5.7.3 setup: account data and favorites save to the existing Supabase project. Automatic backups keep five copies, approximately one every three days when saves occur. This does not change main or publish anything for you.

The complete corrected Testing ZIP is available as an alternative. The smaller patch above is recommended when your repository already has 5.7.4, because it leaves your current songs and personal content alone.

## What to check on the phone

- Play a song, go Home and choose Music. The timer/progress should advance about once a second with the screen on. Android/launcher scheduling can affect the exact cadence. There are no additional Vercel/Supabase requests for these ticks.
- Tap the progress bar OR its time to open the small native drag slider. Drag/release to seek; a paused song stays paused. Android RemoteViews widgets cannot embed a draggable SeekBar directly, so this popup provides precise scrubbing. The normal music screen stays closed.
- Save a named favorite, close/reopen the app, and check the same account on another device after saving. Unlock Everything must not delete favorites or inflate real activity counts. Explicit gift/test unlock bars still show completion; naturally earned login progress counts one unique Central-time date, regardless of how many times the app opens that day. Old synthetic prelaunch test dates are excluded from login goals; owned outfits remain owned.
- Weather now has eight exclusive wardrobe outfits: Sunbeam princess (sun), Cloud cuddle cardigan (clouds/fog), Rainy-day ribbon (rain), Thunderlight cape (storms), Little breeze explorer (wind at least35km/h), Frosty rose coat (below8°C), Snowflake princess (snow), and Moonbeam dreamer (nighttime). No weather uses existing superhero costumes or peanut pajamas. A matching real forecast unlocks its costume permanently on that account; past discoveries remain when the weather changes or the location is cleared. Nighttime can be discovered along with the current weather condition. The wardrobe now has24 outfits, with a matching-forecast progress bar for each new one. Configure a city and open Weather; fresh cached forecasts also count. Weather discoveries sync through the existing account settings and automatic backups. Return to Room after syncing to wear your new outfit, use it in games, and save it in favorite designs. The provider button and prominent credit text are removed; attribution is available from the small Data sources entry in Weather.
- In-app Calendar now shares the widget's layout insets and backdrop. Today is dark purple; another selected date receives the widget's pale-purple highlight and readable dark text. All dates must fit. The actual home calendar code/layout is unchanged.
- Check furniture placements in all eleven rooms. Item anchors are room-specific and feed both the exported room image and native widget snapshot. Espurr remains centered.
- Wishing cabinet and roulette show a scroll hint, a persistent side rail and More treasures button when the list overflows. Blackjack is unchanged.
- Princess Drop has **five attempts/week** and one collectible for the first **1,500-point win/week**. Later wins are still playable and cannot grant another weekly collectible. The **Sunday room opens immediately at 3,200**, with no additional login-day gate. Resume/recovery preserve used attempts and prize claims.
- Open **Winter 2026** in the Palace header (or the app menu). All 25 December doors open now for testing; each is intentionally empty. Day 25 has a Christmas frame. Existing outfits/rooms/collectibles decorate the doors. Christmas music has an on/off button, stops on close/background and resumes when returning. If Android blocks automatic music after opening from the app menu, tap a door to start it.

## Development notes, not an Updates tab

The eventual release is **Version 1 — New Horizons**, an app-focused complete experience. Do not create the recipient-facing Updates tab until Juan asks. The Winter 2026 preview will later become a December 1–25 mix of collectibles, a few outfits/rooms, personal messages and tiny games, with a special Christmas surprise. No rewards/messages/games have been inserted into the Advent doors yet.
