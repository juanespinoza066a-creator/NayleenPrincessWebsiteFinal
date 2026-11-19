# Palace 3.0 — install and publish

## Do this on testing first

1. Before replacing files, copy your CURRENT `public/content/weekly-notes.json` in GitHub to a new file at `server/weekly-notes.json`. Keep its contents exactly as you wrote them. Future note edits happen in **server/weekly-notes.json**. This file must exist before testing the notes API.
2. Upload the contents of `Nayleen-Palace-3.0-Web-Update.zip` to your repository root on the testing branch. Preserve the public, api and server paths and include build.mjs and vercel.json. Commit all code changes together.
3. Delete the old public/content/weekly-notes.json from GitHub after copying it. The new build also removes it from the deployed output even if an old copy remains in public. **Keep the GitHub repository private**: server files in a public repository are still publicly readable on GitHub. Website authentication cannot conceal public GitHub source or old commit history. Protect/remove older Vercel deployments that still contain public notes. Previously downloaded copies cannot be recalled.
4. Wait for the Preview deployment. Sign in with 123 on your app's Testing site and test notes, squishy purchases, room PNG, 21 and the wishing cabinet. No SQL or Supabase schema changes are needed. Existing Vercel environment variables remain.
5. Install `Nayleen-Carnival-Android.apk` version **3.0 / versionCode 5** over the existing app, without uninstalling. It retains the same application ID and signing key. Native Main/Testing and Return to Main recovery remain.
6. Enable optional alerts in **⋮ → Notifications ♡ → Turn on**, and allow Android's notification permission. Android Settings can also block notifications. Existing notifications are off by default.
7. After testing, merge with **base main / compare testing**. While signed in with123, return the app to Main, sign out and use956. The selected website stays local to each phone. The code selects the cloud save. Using956 on Preview can still change her real save.

The patch intentionally omits your base site-text.json, settings.js and private weekly-notes.json so newer personal edits are not overwritten. The full website ZIP includes the last supplied notes under server as a reference; do not overwrite newer notes with that copy. The new login text is exactly “Your Princess Palace” / “Enter the code I gave you.” The old “Our carnival code” label is visually removed. Other personalized base text is unchanged; palace-update.json supplies only the requested overrides. Wednesday reset copy is changed to Monday on display.

## Rooms and PNG

Floating generic stands are removed in every room. Four display slots use different room-specific furniture/ground positions, such as the garden bench, café counter/chair, shop counter and Sunday sofa/painted stone seats. Backgrounds retain their 4:3 proportions so placement stays aligned across screen sizes. Room PNG and widget read the same displayed positions. On Android10+, Save image of room writes to Pictures/NayleensPalace; older Android uses a file picker.

## Squishy purchases

New toys are purchased with saved squishes, not granted automatically by lifetime score:

| Toy | Cost |
| --- | ---: |
| Peanut Crunchy | Free |
| Butter Baby | 250,000 |
| Dream Cube | 1,500,000 |
| Mochi Kitty | 6,000,000 |
| Bao Bun | 15,000,000 |
| Berry Blush | 50,000,000 |
| Cloud Nine | 125,000,000 |

Previously earned toys are retained when an old save first migrates. The old Bunny Bun becomes Bao Bun. If your testing save already has everything unlocked, it will still have them; use the123 reset tool to see fresh costs. Buying a toy spends balance but does not reduce lifetime totals or upgrades. Ada now requires **1,000,000 lifetime squishes**. Sound designs now use filtered air/rubber/suction textures; the crunchy peanut retains its crunch.

## Casino

Nayleen's Gambling Paradise opens a lobby with 21 and The Wishing Cabinet. 21 includes opt-in original procedural lounge music, independent sound toggle and an on-table score display. Music stops when closing or hiding the game.

The Wishing Cabinet is optional, once weekly: choose three DIFFERENT owned collectibles, confirm consuming them, receive one random collectible. A duplicate is possible and gives no reroll. Selected items leave owned inventory and displayed slots. Previously discovered items remain in discovery history for the garden's collect-10 quest. Weekly trade claims survive reload and backup restore merges. All stakes and rewards are fictional game items; no money or purchases.

## Monday schedule

The current first week is shortened to Nov18–22,2026. Week2 starts **Monday Nov23,2026 at00:00 America/Chicago** (CST then). All later weekly boxes, maze attempts, cabinet exchanges and notes use Monday midnight in that zone; daylight-saving changes are handled. Notes require published:true AND their week to have arrived. Unpublished/future note bodies are not returned by the authenticated endpoint. The schedule is shared in the client/server rules for future weekly features too. Existing first-week claims are retained rather than cleared early.

## Widget

The room is compact and proportionate again, with decorative hearts/stars at the sides rather than stretched to fill the widget. Its palette follows the room. The title is always **Espurr’s Room ♡**. A live TextClock replaces the stopwatch and follows the phone's clock/12-or24-hour setting. There is no timer action.

Emote frames change every90seconds and sayings every5minutes when the launcher allows it. Petting still gives hearts. Espurr has overnight sleep mode midnight–7am and a noon nap12pm–1pm in the phone's local time, with sleepy Zs/rest messages. “Espurr wants headpats” appears when she has not been petted for a while. Android's periodic widget updates may delay a sleep/wake transition; it does not run an exact background alarm. The clock updates natively. These are widget bubbles, not disruptive push alerts.

The widget caches the last room seen in the app. Open/reload Room after changing it on another device. It does not continuously read Supabase while closed. If the launcher retains an old layout, remove/re-add only the widget, not the app.

## Notifications — no paid push service

The phone runs a best-effort hourly Android background job after opt-in:

- New weekly box/maze/cabinet reset since the last check.
- A newly published or edited due weekly note.
- General website releases: change the version string in **server/update-info.json** when publishing a release you want to announce. First observed version only establishes a baseline.
- A gentle check-in after7days away, then14days away, once at each threshold until the app opens again.

Boxes currently reset weekly; no new daily box was added. Notes/release alerts need internet and the app's valid carnival login cookie. The metadata endpoint is authenticated and returns version hashes, not note text. When the session expires, open/sign in again to resume those checks. The first successful check establishes the note baseline, so existing notes don't immediately spam alerts. Android Doze/battery restrictions or force-stop can delay/stop jobs; these are NOT instant server push notifications or exact-midnight alarms. Notifications open the app on tap. Turn off through the same menu or Android Settings. No Firebase/OneSignal or new subscription is configured.

## Samsung lock screen

The provider declares home-screen AND keyguard compatibility, but Samsung decides which widgets it exposes. Its normal compact lock-screen picker may omit arbitrary third-party Android widgets. Try Samsung's **Good Lock** app from Galaxy Store → **LockStar** → lock-screen editing/widget picker → Nayleen's Palace / Espurr widget → place/resize/save. Exact controls and support depend on One UI, device and module version. If LockStar has no third-party picker, the APK alone cannot force Samsung to offer one. Home-screen support remains. Device unlocking may be required for app-opening actions. Test on your A54; lock-screen placement is not verified here.

Samsung reference: https://www.samsung.com/uk/mobile-phone-buying-guide/what-are-widgets/

## Source and verification

The Android source ZIP includes the updated reference website and project. Android Studio: open NayleenAndroid, SDK35, BuildTools35.0.0, Java17+, Gradle8.11.1/AGP8.9.2. Windows build: .\gradlew.bat :app:assembleDebug. Preserve signing/nayleen-development.keystore privately (development-only alias/password androiddebugkey/android); future versionCode must exceed5. Never commit the key. It is included for your own APK updates and excluded by .gitignore.

Passed: JS syntax, production build, client/server parity, paid skin/migration rules, one-million Ada goal, weekly exchange rules/history, Monday/DST boundaries, authenticated notes/updates access and no unauthenticated note bodies, artwork paths, native compilation/resource alignment and APK v2/v3 signatures. Browser checks covered room placement, casino/music controls and Bao selection. The APK, background notifications, widget animations and Samsung lock-screen support still require physical-phone checks. No production account or cloud save was reset here.
