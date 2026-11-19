# Palace 4.2 — A wardrobe worth coming back to

## Upload and install

1. Extract **Nayleen-Palace-4.2-Web-Update.zip**. Upload its CONTENTS to your current GitHub **testing** branch at the repository root. Keep public/server paths intact; commit client/server game rules together, then wait for Vercel Preview.
2. Use **123** for testing. The patch is for the existing 4.1 setup and does NOT overwrite public/content/site-text.json, public/content/palace-update.json, public/settings.js, server/weekly-notes.json or server/special-dates.json. Keep your own text, letters, dates and environment variables. No SQL/database migration is needed.
3. Install **Nayleen-Carnival-Android.apk**, version **4.2 / versionCode 9**, OVER the existing app. Do not uninstall. Same package/signing key, saved notes, widget setup and Main/Testing selector.
4. Open the Room page in the app. New outfit portraits can now be synced to the widget, calendar and notes screens. Existing widget layout/scaling, calendar interactions, notes editor and item placement are unchanged.
5. After testing, merge testing into main. Keep 956 on the live site during testing: older website/server versions do not know the new journey fields and can drop those fields if the same save is used there. Once both deployments use 4.2, the usual shared save behavior applies. Testing with 123 keeps her game progress separate.

## Seven outfits added (sixteen total)

All are original Espurr costume illustrations matching the existing watercolor/plush mascot, with transparent backgrounds. Existing outfit images are unchanged. Midnight Mutant uses the corrected purple-fur version and a smooth fully covered chest panel; the earlier rounded cup shapes/pale chest opening are removed.

| New outfit | Journey |
| --- | --- |
| Jubilee · Sparkle princess | Finish 5 table hands on each of 7 different days. |
| Jubilee · Midnight Mutant | Escape Ann in 8 different weeks, collect 21 play days, and earn normal Jubilee. |
| Rafayel’s little artist | Collect 14 play days and 6 cozy squishy days. |
| Princess booster pack | Open weekly boxes in 4 different weeks and collect 14 play days. |
| K/DA Firestarter | Finish at least 5 hands in each of 5 different weeks, plus 30 lifetime hand wins. |
| Reze · Rainy-day ribbon | Collect 10 cozy squishy days and visit Ann in 2 different weeks. |
| Cissia · Little case specialist | Visit Ann in 4 different weeks and collect 12 play days. |

A **cozy day** is 100 actual squishy-button taps, regardless of tap strength. Offline/helper production and golden bonuses do not count as manual taps. A **play day** is any day with 3 completed table hands, 100 manual squishes, a weekly box reveal, a wishing-cabinet exchange, or a completed maze (win OR loss). Visiting Ann counts when starting that week’s new maze; resuming an old run does not add another visit week. Escape weeks count successful finishes.

These days/weeks do NOT need to be consecutive. Missing a day loses nothing. Only finished hands count toward table journeys; dealing and leaving does not. Repeating the same event in a week never creates another week. Weeks start Monday midnight America/Chicago with daylight-saving behavior; distinct weeks are the requirement, not an exact seven-day wait after each action.

New day/week journey progress starts with this update. Previous game totals cannot retroactively invent dates. Firestarter can use existing lifetime hand wins, but still needs its new five-week table journey. Existing nine outfits and six rooms keep their requirements; already earned long-term outfits stay earned. Your game save syncs the journey fields with your account. Reset clears journey progress; Unlock everything includes all sixteen outfits. Both actions keep the cabinet reset fix.

Locked new outfit cards show a progress bar for each requirement. Artwork keeps the existing silhouette treatment until unlocked.

## Less scrolling

Outfits, collectibles and rooms initially show six entries. **Show more** reveals six more at a time; **Show less** returns to six. Expanded galleries stay expanded during progress/save/equipment redraws. Small galleries hide the pager automatically, so the current six rooms do not get an unnecessary extra button. This continues to work when more rooms or collectibles are added.

## Edit text and future requirements

- Names, hints, journey labels and the short wardrobe explanation: **public/content/wardrobe-update.json**.
- Actual new unlock goals: **OUTFIT_CHALLENGES** in **server/game-rules.js** AND its identical **public/assets/js/game-rules.js** copy. A text hint does not change a goal.
- Future reward pacing: **PROGRESSION-GUIDELINES.md**. The reusable challengeProgress helper supports new outfit and room journeys. Favor several meaningful days/weeks; do not raise existing goals or add punishing streak resets.
- Outfit art files: **public/assets/images/outfits/**. Corresponding native assets/index are included in this APK. Artwork descriptions/prompts and checked online reference links are in **ARTWORK-PROMPTS.md**.
- Your own base text, weekly letters and special-date file remain in their existing locations.

## Preserved

Squishy Clicker gameplay, prices, sounds and animations are preserved; its script adds only a manual-tap progress hook. Blackjack adds only a finished-hand hook, maze adds journey hooks, and studio adds shared gallery pagers. Room art/export/placement, all native widget Java/layout code, notifications, special dates, Princess Notes and login behavior are unchanged from 4.1.

## Verification

Passed: new nonconsecutive day/week gates, Central/DST/Monday boundaries, same-day/week deduplication, no passive tap credit, old-save migration and old outfit retention, earned reward persistence, reset/unlock-all, cabinet saved reset/eligibility, previous game/letter/auth regressions, gallery six/more/less/retained expansion, and a DOM integration test executing the real page module with isolated mock saves. That test rendered sixteen named outfits and seven progress cards, used Unlock everything, equipped Midnight Mutant, and opened the empty cabinet after Reset.

Also passed: every web/native artwork path, transparent alpha on all seven new images, JavaScript syntax, website build, Android compile/resources/alignment, APK v2/v3 signature and same signer. Native layout/behavior did not change; new artwork still needs checking on your Samsung. No physical-phone or fresh visual-browser check was performed here. No production save was reset and nothing was pushed/deployed to GitHub or Vercel.

## Source / full reference

Use the small website patch for your existing repository. The full website ZIP in Website-Reference is a reference snapshot and may not contain newer personal edits you made on GitHub.

Android source builds with the same Java17+/SDK35/BuildTools35.0.0, AGP8.9.2 and Gradle8.11.1. Windows: .\gradlew.bat :app:assembleDebug. Future versionCode must exceed9. Keep signing/nayleen-development.keystore private and backed up; do not commit it. Website/game/text updates use GitHub/Vercel; the APK is updated here to include the seven new widget artwork assets.
