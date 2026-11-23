# 5.7.6 combined update — build 27 (Testing)

This replaces the earlier 5.7.6 patch and build 26. It includes all of their Advent, music and performance changes, plus the login reset and Princess Drop fixes. You only need this combined website update and APK.

1. In GitHub Desktop choose **testing**, Fetch/Pull, then **Repository → Show in Explorer**.
2. Extract `Nayleen-Palace-5.7.6-Web-Update.zip`. Copy its contents directly into the repository root. Merge folders and replace matching files. The patch contains `public/`, `server/` and `api/` directly at the root; do not copy an outer patch folder into the repository. Alternatively use the complete Testing ZIP.
3. Check GitHub Desktop shows changes under `public/`, `server/` and `api/`. Commit to **testing**, Push origin, and wait for its Vercel deployment.
4. Install **Nayleen-Palace-5.7.6-build27.apk** over the existing app. Do not uninstall. Open Testing and reload Room after the website deployment. The APK alone cannot install the remotely hosted game changes.
5. **No new Supabase SQL is needed** if you already ran the 5.7.3 backup migration. The existing atomic recovery function supports the corrected Testing reset.

## Login reset explained

Normal opening counts one distinct Central Time date, including opening from the app or widget. Reopening on the same date adds nothing. A new date starts at 12:00 AM Central Time.

The old Reset my progress cleared the local history, but ordinary server saves intentionally merged the account's older login dates back in. That caused the five dates to return. Reset now uses a Testing-only, server-authorized atomic reset, with revision protection. **After a deliberate Testing reset, today is day 1.** Reopening today stays at 1; opening on the next Central date becomes 2. The reset requires a connection and tells you if it failed. It creates a safety backup and keeps personal notes, calendar and music data. Stale pre-reset windows cannot restore their old dates. Reset waits for any in-flight account save before choosing its revision, and duplicate reset taps are blocked. Legacy gameplay days no longer create login credits.

Installing the patch does not reset either account automatically. Only use Reset my progress if you want to clear the Testing game save. Nayleen's account cannot call this reset route.

## Princess Drop performance

- Drops and merges update the score, prizes and resumable basket immediately in memory. Their local checkpoints share a bounded 200ms write window, instead of serializing the entire account on every collision. Backgrounding or closing immediately flushes the latest basket.
- Game cloud checkpoints are grouped to about once every five seconds during continuous action, plus normal finish/close saves. This reduces repeated requests while preserving local progress and the existing account conflict protection.
- The hidden room/wardrobe is refreshed once when the game closes, instead of rebuilding it during drops, merges and save acknowledgements.
- The basket backdrop and shaded treasure sprites are cached. A regression test renders 100 frames using one background gradient and nine shaded sprites, instead of recreating their shading every frame. Small treasure tiers load gallery art; large tiers keep original art. The backing canvas is capped at 2x logical resolution (800×1300), retaining sharp small-screen artwork while painting about 56% fewer pixels than the previous 3x canvas.
- The same basket melody is pre-rendered and looped by the audio clock. Main-thread animation delays cannot delay every note as they did with the old timer. Music pauses in the background, resumes on return, stops on closing, and reuses one audio context. Sound effects and separate mute settings remain.
- Five attempts per week, the first 1,500-point weekly collectible and the immediate 3,200-point Sunday room are unchanged. Real physics collision, milestone and eight-seed balance simulations pass.

## Casino and treasure pickers

The wishing cabinet and Princess roulette now have **one vertical scrollbar for the dialog**, with no separate fake rail or nested treasure scrolling. Cards use four columns on typical phones, three on very narrow screens, and five on larger screens. Rules remain under “How this wish works.” Images load lazily from thumbnails, and selections retain their existing cards. Roulette still shows its exchange review before spending anything. Blackjack's board and controls are unchanged.

## Included from the earlier 5.7.6 update

- Shared date/progress calculations across the wardrobe and rooms; smaller gallery images (about 78% fewer corresponding image bytes) with full originals retained for the main room, export and widget.
- Coalesced rapid squish updates, bounded particles, change-driven native room inspection, rounded widget fingerprints and a bounded 6MiB native artwork cache that clears under memory pressure.
- Ribboned pastel Advent doors, snowy Espurr artwork and the new locally hosted stereo Christmas bell/piano arrangement. All 25 doors are intentionally empty and openable for testing. No Updates tab was added.
- All existing eight weather outfits, room placements, favorites, calendar, widget seeking and backup functionality remain included. Original uploaded music files/catalog, personal site text, letters, dates and sayings are preserved byte for byte.

## Validation and limits

34 web suites pass, including actual Matter.js physics, audio lifecycle, checkpoint/cache checks, reset authorization and one-credit-per-date tests. Native Java/profile/widget/snapshot checks and APK compilation/signature checks pass. Isolated PostgreSQL tests verify that the reset clears old dates, repeated native opens add no duplicates, stale saves cannot restore pre-reset history, personal data survives, and backups retain five copies on the existing three-day cadence.

Browser visual testing could not run because this execution environment blocks Chromium's required process socket. No Samsung frame-rate claim is made. Please playtest Drop with music and scroll both selectors after installing the APK and deploying the website update.

No live database, GitHub branch, deployment or account save was changed while preparing these files.
