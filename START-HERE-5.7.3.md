# Nayleen’s Palace 5.7.3 — Testing update

Apply this update to the **testing branch and its Testing deployment**. Your restored main website stays at its pre-app version. Do not merge this patch into main yet. No live repository, website or database was changed while preparing these files.

## Install in this order

1. In Supabase, select the project used by the **Testing deployment**. Open SQL Editor → New query. Paste **PALACE-5.7.3-SETUP.sql**, then click Run. This is additive and keeps current saves and login sessions. It needs the existing setup.sql and backups.sql that you already ran. For a brand-new project, run those two first, then this patch SQL.
2. In GitHub Desktop choose **testing**, then Fetch/Pull. Extract **Nayleen-Palace-5.7.3-Web-Update.zip** and copy its `Website-update` contents into your website repository, replacing matching files. Commit and Push on testing. Wait for the Testing deployment to finish. Keep main unchanged.
3. The patch deliberately omits your song list, MP3 files, personalized site text, calendar configuration, Espurr sayings and weekly notes. Keep those existing files in your repository. Nothing needs to be re-added with the song uploader.
4. Install **Nayleen-Carnival-Android.apk** over the existing app. Do not uninstall first, because notes, dates and playlists from older app versions need to be imported from this phone. Version is **5.7.3 / code 22**, with the existing signing certificate.
5. Open the app, choose Testing with the owner code, and visit the Room page. Let Saved appear. Open Widgets once. Existing notes, personal dates, and playlists are imported to the signed-in account automatically. The date editor shows account-save status; offline edits stay on the phone and retry when you return connected.
6. The existing single Palace widget keeps Room, Calendar, Notes, Weather and Music. If Samsung still shows an old layout after updating, switch away from Music and back. Re-add the widget only if the launcher keeps an old cached layout; re-adding a widget does not uninstall the app or erase its data.

## Saving and recovery

The live save remains in Supabase `carnival_saves`. Its `state.companion` also includes personal notes, calendar dates/reminder choices, custom playlists, selected playlist and weather preferences. The game state already includes outfits, rooms, collectibles, favorite room designs, all scores and weekly limits. Existing owner-written content and music files stay in your Git repository; they are not duplicated in account backups.

Private recovery copies live in `carnival_backups`. **Five total per profile** are kept, including safety copies made before recovery. An automatic copy is made on the first successful save; after three days, the next successful save creates another. It is not a phone download or an unattended timer when nobody uses the app. Older copies are removed automatically. The migration trims the existing ten to the newest five.

At the bottom of the Palace choose Saved backups → a dated copy → Restore this copy. It restores the complete account bundle and creates a safety copy first. Already-used weekly turns remain used. Newer edits from other devices are checked before saving. Personal data syncs back to the phone the next time you visit the Room/Widgets page. A backup from before 5.7.3 has no personal-data bundle, so it keeps the current saved notes, dates and playlists rather than clearing them.

Recovery restores progress, not the login code or ownership of GitHub/Supabase. Keep your login code somewhere safe. Do not uninstall the older app before its phone-local data has successfully synced.

## What changed

- Larger DJ Espurr portrait, rendered at a suitable pixel size with filtered scaling; song details and playlist picker share the artwork row so playback controls do not squeeze Espurr into a tiny strip. Everything remains in the same Palace widget.
- Playlist creation has a visible Create playlist button under a bounded scrolling list. Refresh wording is now “Click when Juan says he added new music to load”.
- In-app calendar uses full date numbers and colored special-day cells. The already-working home-screen calendar, forecast layout and note layout are retained. Separate calendar backup/import buttons are removed.
- One daily app opening/sign-in counts as one Login day in Central Time. Old recorded play days carry over. Days need not be consecutive, and changing the day during an open session also counts once.
- Every outfit and room shows progress bars. Existing explicitly earned/gifted outfits stay unlocked. Responsive headings and counts wrap inside their panels.
- Weekly game screens show **Monday, 12:00 AM Central Time**. Roulette/cabinet can be opened before you own enough offerings; exchange buttons still enforce their costs and weekly limits.
- 18 requested collectibles added, for **39 total**. No extra filler items. New hotpot restaurant room.
- Princess Drop keeps **five weekly tries** and **one collectible at 1,500**; you can continue the basket toward the room goal.

## Updated outfit goals

| Outfit | Requirement |
|---|---|
| Jubilee | 15 login days |
| Jubilee · Midnight Mutant | 30 login days |
| Rafayel’s little artist | Best Princess Drop score 2,000 |
| Princess booster pack | Open 10 weekly blind boxes |
| K/DA Firestarter | Own all seven squishies AND 15 login days |
| Reze | Escape IDV Hunt 10 times |
| Cissia | Make 5 cabinet wishes AND 3 roulette wishes |

Other existing outfit goals remain as before, with their own progress bars.

## Updated room goals

| Room | Requirement |
|---|---|
| Lily-of-the-valley garden | Join IDV Hunt once |
| Gambit’s card lounge | Finish 150 blackjack hands AND best table score 500 |
| Block-built daydream | 15 login days |
| Moonlit manor | Join IDV Hunt 12 times |
| Dinner date at P.F. Chang’s | 30 login days |
| Sunday’s quiet sanctuary | Best Princess Drop score 3,200 AND 30 login days |
| A cozy hotpot date | Start Princess Drop once |

Older blackjack totals are carried forward only from recorded evidence of completed hands; box openings and completed hunts are excluded.

## Quick phone checks

- Music widget: DJ portrait is larger at your usual widget size; song, playlist button and transport remain readable. Try Create playlist with enough songs to scroll, then choose it in the widget.
- Calendar: check November’s 11, 12 and 26 and a six-row month. Add a date, close/reopen and confirm it is retained. Notes and Weather should behave as before.
- Visit Room after connecting, then inspect `carnival_saves → state → companion` in the Testing Supabase project: notes/calendar/music values should match your phone. Do not edit those rows by hand.
- Use Saved backups to restore a copy made after your personal-data import. Confirm the safety copy appears and the five-copy cap remains. Very old copies will not contain newly imported personal data.
- Try a fresh Testing save: roulette and cabinet open without treasures, but the final trade stays disabled until the requirements are met. Login days count only once per Central date.

## Verification completed

24 web test suites pass, including real page startup, all unlock thresholds, game flows, assets, complete account recovery, private access and conflicts. PostgreSQL integration checks pass for three-day cadence, five-copy retention, concurrent native/game saves, login-day union, atomic recovery and recovery epochs. Eleven native Java model tests, scene-capture/site-switch tests, widget resource checks, web build, APK build, alignment and signing checks pass. The APK uses the same certificate as 5.7.2.

No physical Samsung or emulator session was available. Please check the phone layout and a real signed-in sync on your device before considering a future main merge.
