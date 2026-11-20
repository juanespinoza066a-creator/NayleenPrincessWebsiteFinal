# Palace 5.4 — DJ Espurr, favorite rooms and a trickier little basket

## Install on testing

1. Extract **Nayleen-Palace-5.4-Web-Update.zip** and upload its extracted folders/files at the ROOT of your GitHub **testing** branch. Keep their paths. This patch is against **5.3**. Install 5.3 first if needed. Do not upload the ZIP itself or nest public inside public.
2. Wait for Vercel Preview to be Ready. Open your existing working testing address with **123**. No SQL or environment changes are needed.
3. Install **Nayleen-Carnival-Android.apk**, version **5.4 / code 15**, OVER the current app. **Do not uninstall.** The app remains Nayleen’s Palace and uses the existing package and signing certificate.
4. Visit **Room once**. Open **Widgets → Music**, tap the welcome mix and Play. Use **Add DJ Espurr widget** there, or long-press Home → Widgets → Nayleen’s Palace → DJ Espurr.
5. Test on 123. When satisfied, merge testing into main and switch the APK back to Main. If both branches share a backend, 956 accesses her real save on both. Do not reset 956 for tests.

Private weekly notes, personal site wording and Espurr’s sayings are unchanged. The patch updates `server/special-dates.json` only to correct RGV ComicCon. If you have added other personal dates since 5.3, keep your current file and update just the event with id `rgv-comicon`: title `RGV ComicCon`, year `2027`, month `4`, day `23`, endDay `25`. Keep your other events. The APK also migrates the earlier recurring default event in its calendar cache.

Use the small patch for your existing repository. The full website ZIP is a reference copy, so it should not overwrite newer personal writing. Existing progress and consumed weekly turns remain.

## Princess Drop

- The overlapping corner heart is removed; the basket and its three little friends stay inside their icon.
- The play container is now 320 logical units wide and about 455 high, with a larger final treasure. The final treasure’s diameter is 260 units, taking up most of the basket width. Small treasures remain small, so larger merges put much more pressure on the pile, as in the supplied references.
- Winning still requires **3,000 sparkle points AND the biggest treasure, Emil’s plushie**. The challenge comes from the new proportions and overflow behavior, rather than just a higher point count.
- A large notice appears directly OVER the basket when it overflows, with a shake, a sympathetic Espurr, your score and a Back to my games button. A completed run shows a notice when reopened too.
- New original basket music, drop plops, tiered merge chimes, floating merge-point effects, win notes and a descending loss sound. Music and effects have independent saved on/off controls. They start after a tap and stop when the game closes. The sounds default on unless you have switched them off.
- The Drop button is above the basket and stays near the top while scrolling. Touch aiming/drop on the basket still works. The sharp phone-density canvas is retained.
- An older unfinished basket keeps its score and pieces, remapped into the new container. For a fresh comparison, reset 123. Old completed weekly runs do not reopen automatically.

## Gambling and controls

**Roulette requires at least one outfit or room among your two offerings.** Two collectibles no longer qualify. A collectible plus an outfit/room, two outfits, two rooms, or an outfit plus a room can qualify. Starter and currently equipped outfit/room remain protected.

The result remains one guaranteed random prize, once weekly: **85% collectible, 10% room, 5% outfit**. Duplicates remain possible. The wishing cabinet keeps its separate three-collectible-for-one rule.

The wishing cabinet’s submit control is above its selection grid. Selecting all three scrolls back to it. Its exchange review is inside the game and names the permanent exchange and duplicate possibility. Roulette’s controls are above the wheel/grid, and blackjack’s actions are above the table and stay near the top while scrolling. Game results appear near the top of the dialog.

There are no remaining browser `confirm()` calls in the website. The APK also handles future JavaScript alerts, confirmations and prompts with a Palace title rather than the browser’s “The page at https://…” heading. Confirmations and the protections against leaving the trusted site are retained.

Empty room decoration spots now have a light background, dashed border and a visible purple +. Equipped collectibles retain their normal placement.

## Saved room designs

Open **My favorite rooms ♡** above the wardrobe tabs. Name the current design and save it. You can keep **six** combinations of room, outfit and the four collectible placements. Tap **Use this room** to apply one. Remove a favorite to make room for another.

Favorites save with the existing progress for that login code and sync through the same save system. They do not grant items. If a design uses something you traded away, it stays unavailable until you own those items again. Reset all clears the favorite designs along with progress. Your PNG export remains separate.

## DJ Espurr music player and widget

Open **Widgets → Music** for DJ Espurr wearing your current outfit, her little turntables, playback controls, song-position slider and playlists. The dedicated **DJ Espurr** home-screen widget has play/pause, previous/next song, −10s/+10s, song title and progress. Open Music for the draggable slider and playlist editing. The widget progress refreshes periodically; Android’s media controls track playback separately.

The player uses a native media-playback foreground service, media session, audio focus and playback wake management. It is designed to keep playing when the screen is off or the Palace page closes. Android gets media controls for playback and seeking. Calls or another app taking audio focus pause/duck the player; temporary focus loss can resume when focus returns. It never starts music automatically at boot. Stop my music ends playback immediately. A paused service winds down after a few minutes; the last track and approximate position are kept for the next start.

An original 24-second **Espurr’s little welcome mix** is included, also bundled in the APK for an offline first test. The queue repeats. You can make up to 20 personal playlists on the phone by naming one and selecting its songs, or choose a playlist from the website library. Personal playlists stay on that phone/profile. Website library playlists come from the JSON file below.

### Add your MP3 songs later — no new APK needed

1. Upload files into **`public/music/tracks/`**. Use simple filenames such as `our-song.mp3`.
2. Add entries to **`public/music/library.json`**. For example:

```json
{
  "version": 1,
  "tracks": [
    {"id":"our-song","title":"Our song","artist":"My favorite artist","file":"tracks/our-song.mp3"}
  ],
  "playlists": [
    {"id":"our-playlist","name":"Our little playlist","trackIds":["our-song"]}
  ]
}
```

You can keep the demo entry and add more entries separated by commas. Keep song IDs stable when changing titles. File paths are relative to `public/music/`.

3. Deploy your testing branch, then tap **Refresh songs** in Widgets → Music. It follows that phone’s selected Main/Testing site. After merging into main, refresh there too.

A separate **`public/music/ADD-SONGS.md`** is included beside the song list. Audio files are served as ordinary website assets; use recordings you have permission to include. Uploaded MP3s stream and need internet; they are not automatically downloaded for offline use. The bundled welcome mix is the offline exception.

## Calendar

The event is now **RGV ComicCon**, **April 23–25, 2027 only**. It is not marked on other Aprils. Its existing special-day reminder timing remains the day before the first day and on the first day. Birthdays, anniversary, holiday markings and the rule against holiday notifications are preserved. Use Refresh my dates in Calendar after deploying for the new server copy.

## Validation and phone review

All **15 web test files** passed: new roulette offering rule and exact prize odds, reversible reviews, the cabinet exchange UI, saved room designs and save API round trips, favorite limits and missing-item protection, Drop audio controls, new basket physics, canvas density, loss notices and the existing IDV/progression tests. All eight repeatable same-column rapid-tap Drop trials overflowed under the new proportions. This is a regression sample, not a general win-rate estimate; deliberate merge tests still reach the win and grant only one prize.

Android resource/Java/D8 compilation, signing and alignment checks passed. Native model checks cover the MP3 catalog and demo, playlist filtering, unsafe file paths, queue wrap, seek bounds, the one-year ComicCon date and the existing room, notes, calendar, personality, weather, capture and owner-only site-switching behavior. The working Weather classes are unchanged.

A physical A54 was not available here. Please play the demo with the screen off, use notification and widget controls, seek, change songs, make/select a playlist, pause/resume, close the Palace page, and test a call/another music app interrupting playback. Then try one uploaded MP3 from testing. Launcher sizing, actual audio output, background survival and device-specific interruptions need that phone check; model/build checks cannot prove them.

Also check the top submit controls, cabinet exchange review, Drop’s visible loss notice and sound toggles, a saved room applied from another device, empty + spots and April 2026/2027/2028 in Calendar. Your normal weekly reset remains Monday at midnight Central Time.

## Source

Website: Node22+, `npm ci`, `npm test`, `npm run build`.
Android: SDK35 and Java17+, `./gradlew assembleDebug` or `gradlew.bat assembleDebug` from NayleenAndroid. Future version codes must exceed15. Keep the Android source ZIP/signing key private.

Private notes: `server/weekly-notes.json`. Sayings: `server/espurr-lines.json`. Dates: `server/special-dates.json`. Personal wording: `public/content/site-text.json`. Song list: `public/music/library.json`. Keep matching server/browser game-rules and hunt-config copies identical.

Android implementation references: [media playback foreground services](https://developer.android.com/develop/background-work/services/fgs/service-types#media), [audio focus](https://developer.android.com/media/optimize/audio-focus), [MediaSession](https://developer.android.com/reference/android/media/session/MediaSession).
