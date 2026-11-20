# Palace 5.5 — Music on your existing widget and comfortable game controls

## Install

1. Extract **Nayleen-Palace-5.5-Web-Update.zip** and upload its folders/files at the ROOT of your GitHub **testing** branch, preserving paths. This patch is against **5.4**. Install 5.4 first if needed. Do not upload the ZIP itself or put public inside public.
2. Wait for Vercel Preview to be Ready. Open your working testing URL with **123**. No SQL or environment changes are needed.
3. Install **Nayleen-Carnival-Android.apk**, **5.5 / code 16**, OVER the current app. **Do not uninstall.** Package identity and signing certificate are unchanged.
4. Visit Room once, then open **Widgets → Music → Refresh songs**. Your existing home-screen widget now has **Room, Calendar, Notes, Weather, Music**. Tap Music there for the player. The dedicated DJ Espurr widget remains available too.
5. If your launcher still shows only four tabs, remove just that home-screen widget and add it again. Keep the app installed so its notes, playlists and settings remain.
6. After testing, merge testing into main and switch back to Main. Keep tests on 123. If the branches use the same backend, 956 accesses her real save on both.

**Use the small web patch to preserve your added songs.** It does not replace `public/music/library.json` or any audio files. It also preserves private notes, personal wording, sayings and special dates. The full website/source ZIPs are reference copies containing the bundled demo library, not the personal song files that were absent from the uploaded ZIP. Retain your existing music folder if you use a full reference copy.

## Why a new song might not appear

The uploaded `NayleenPrincessWebsiteFinal-main (4).zip` has no `public/music/` directory, no song list and no MP3. It is an older site copy, so it cannot show what is currently deployed on your testing site. No actual A Pearl audio file was available here to verify playback.

I found and addressed these player issues:

- Songs previously updated only after a manual refresh. The app and Music widget now check for a refreshed library automatically, with a retry interval to avoid request loops.
- A playlist containing only the demo could hide a newly added song even when the full library contained it. **All songs ♫** is now prominent. Manual **Refresh songs** also selects All Songs so new entries are visible. You can select a playlist again afterward.
- The old filename validator rejected spaces and square brackets. The new player accepts names such as **`A Pearl [_lYA3i3QkWM].mp3`** and safely encodes their URL path for playback. Simple names such as `a-pearl.mp3` remain convenient.
- Library refresh bypasses stale caches, keeps the last usable list on errors, reports the library song count on success, and uses a friendly failure message rather than claiming a refresh succeeded.

### Check A Pearl on the selected Testing site

Both files must be in that branch and deployed:

- **`public/music/tracks/a-pearl.mp3`** — the actual audio file.
- **`public/music/library.json`** — a song entry pointing to that exact filename.

```json
{
  "id": "a-pearl",
  "title": "A Pearl",
  "artist": "Mitski",
  "file": "tracks/a-pearl.mp3"
}
```

Put this object inside the existing `tracks` array, with commas between entries. If you kept the original filename, use this instead for its file field:

```json
"file": "tracks/A Pearl [_lYA3i3QkWM].mp3"
```

Match capitalization and the actual filename. A file uploaded without an entry is not automatically listed. Adding an entry without uploading its file can show a song that cannot play. To include it in a particular playlist, add `"a-pearl"` to that playlist’s `trackIds`, or choose All Songs in the app.

After Vercel finishes deploying, open **Widgets → Music → Refresh songs**, then All Songs. Main and Testing have separate deployed files; refresh the same site where you uploaded the song. The standalone `public/music/ADD-SONGS.md` from 5.4 still describes the general upload process. No APK rebuild is needed for later song additions.

## The player and widget

Music is now a fifth page of the **existing Palace widget**, retaining the same clock, room colors and navigation. The separate DJ Espurr widget remains available. Both share the same native player, track, position and controls, and active playback refreshes the music page.

The presentation is simpler: a room-inspired cover with Espurr and a little record, separate title/artist, progress and transport controls. The app has a larger cover, a draggable song-position bar, previous/play/next, −10s/+10s and playlists. The widget has the same basic transport controls; Open app opens the Music section when you are on its Music tab.

Background playback, Android media controls, audio focus, the bundled offline demo, personal playlists and phone-local playback state remain. The service is unchanged apart from refreshing both widget types and safely encoding song paths. Personal uploaded songs still stream from the website and need internet; they are not automatically downloaded for offline use.

## In-app Widgets pages

The cramped five equal-width buttons are replaced by a horizontally scrolling row of rounded chips. Calendar and Weather stay on one line. The selected chip is dark purple with white text; other chips have clear dark text on light backgrounds. The selected tab scrolls into view.

A compact Palace/clock header, room-colored background, rounded content panel, softer controls and shorter Room copy make the pages closer to the widget’s style. The Room preview remains still. Calendar, Notes and Weather keep their current functionality. Weather data/location code is unchanged.

## Games and visible controls

The previous sticky blackjack panel was covering the cards. It is removed.

- Blackjack now uses a compact, flexible play view: table score, house hand, a smaller Espurr beside your hand, a separate wager/reset row and four actions beneath the table. **Deal, Hit, Stay and Double** do not float over the board. Instructions are under a small expandable How to play section. Extra hands can scroll within the available space if needed.
- Reset is a smaller **Fresh 100** action beside the wager, not a fifth large button over the game. It remains unavailable during a hand; earned progress/best score stay safe.
- Princess Drop’s button no longer sticks over the canvas. During play, its long intro and merge ladder move out of the way, and the basket scales to the available height so the score, basket and button are easier to view together. Its physics proportions are unchanged from 5.4.
- Roulette and the wishing cabinet have bounded, scrollable selection grids, leaving more space for the wheel/review/submit controls. Their buttons stay in the document flow rather than covering play.

Very small windows or large accessibility fonts may still need scrolling. The layout is designed to keep content reachable rather than covering it with floating controls.

Princess Drop’s win goal is now **3,500 sparkle points AND the biggest plushie**. Its difficulty proportions, sounds, animations, visible loss notice and weekly limit are kept. An existing finished weekly game stays finished; use 123 reset for a fresh test.

Roulette still needs at least one outfit or room among its two offerings. Its once-weekly limit and 85% collectible / 10% room / 5% outfit chances are unchanged. Favorites, private weekly notes, room placement, IDV powers, the Monday reset and RGV ComicCon’s April 2027-only date are preserved.

## Validation and phone review

All **16 web test files** passed. These include the real blackjack deal/house/close path, four controls outside the board, separate wager/reset, the 3,500-point reward threshold, Drop merge/overflow/loss UI, roulette rules, favorites and save API, private notes and the existing hunter/map/power regression checks.

Android Java/resource/D8 compilation, APK signing and alignment passed. Native model checks include the original A Pearl filename and its URL encoding, safe path rejection, playlist filtering/seek bounds, five-page widget routing, room geometry/scaling, notes, calendar, weather and owner-only site switching. Native layout checks confirm the shared Music view is present in both widget layouts and the new navigation labels are single-line.

A physical Samsung A54 was not available here. Please verify the five tabs on your launcher, All Songs after a refresh, the actual MP3 playing with the screen off, room-themed artwork, readable in-app chips, and the table/Drop controls at your normal text size. The supplied ZIP did not contain the added song, so successful live playback of that specific file could not be checked here.

## Source

Website: Node22+, `npm ci`, `npm test`, `npm run build`.
Android: SDK35 and Java17+, then `./gradlew assembleDebug` or `gradlew.bat assembleDebug` in NayleenAndroid. Future version codes must exceed16. Keep the source ZIP and signing key private.
