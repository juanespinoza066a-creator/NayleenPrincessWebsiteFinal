# Palace 4.1 — Little wishes, calendar & widget notes

## Upload and install

1. Extract **Nayleen-Palace-4.1-Web-Update.zip**. Upload its CONTENTS to the root of your existing GitHub **testing** branch. Keep public/server paths intact, commit together, and wait for Vercel Preview to finish.
2. This patch is for your existing Palace 4.0 setup. It does NOT include or replace public/content/site-text.json, public/settings.js, server/weekly-notes.json or server/special-dates.json. Keep your own text, letters, dates and settings. No SQL or environment changes are needed.
3. Install **Nayleen-Carnival-Android.apk**, version **4.1 / versionCode 8**, OVER your existing APK. Do not uninstall. Same application ID and signing key; notes and settings stay on this phone.
4. In your app, use 123 on Testing. Visit the Room page and wait a moment. Existing widgets refresh after installation; if your launcher keeps an old layout, remove/re-add ONLY the widget.
5. Resize the widget to about 4×3 or larger; 4×4 gives longer date labels more room. The minimum resize dimensions are now 220×220dp to keep the interactive grid readable. Exact launcher cell counts vary by phone.
6. After testing, merge testing into main. In the app, use the testing profile’s Main/Testing selector to return to Main. Website selection is still local to each phone. Code 123 and code 956 keep their own game saves.

## Wishing cabinet — why it looked locked

Reset was clearing the weekly wish, but it also removed ALL collectibles. The old lobby disabled the cabinet when you owned fewer than three, so it still LOOKED used after reset. Unlock-all supplied enough collectibles and made the button work.

The cabinet now opens even with zero collectibles after reset. It shows 0 / 3 and tells you to find treasures. Entering the cabinet and spending three treasures are separate requirements. Once you own three DIFFERENT collectibles, select them to wish. The action still needs confirmation; sacrificed items leave the collection/room; duplicates get no extra roll. A USED weekly wish stays disabled until Monday midnight Central as before. No free replacement collectibles or extra weekly chances were added.

The altar now says: **Sacrifice three collectibles, get one muahahah**.

## Widget changes

- Espurr’s Room, Princess Calendar and Princess Notes titles are centered. The top-left caption / duplicate headings are gone. The clock remains centered above.
- Actual room artwork and themed side ornaments decorate the calendar’s background. A light paper panel keeps dates readable, with dressed Espurr in the corner.
- Calendar arrows are in the MIDDLE of the left and right edges. Tap any day to read its details INSIDE the widget. It does not open the app. Unused sixth rows disappear for months that need fewer rows; type size adapts to widget height. Tap the centered widget title only when you WANT the full app screen.
- Notes show little circle checkboxes. Tap one to check/uncheck directly on the widget. Use arrows to browse longer lists. Completed notes are crossed out.
- Tap + A little reminder, or tap an existing note’s text, to open a SMALL themed editor over the home screen. Type, save, cancel or remove a note, then return to your widget. It does not open the full Palace. Android RemoteViews widgets do not support an embedded EditText/keyboard; this floating editor is the supported alternative. It is a tiny Activity window, not a website or full-screen app navigation.
- Existing notes are migrated to stable IDs without changing their text/completion. If a note is removed while an old edit/tap is pending, that action cannot change a different note. Editors also check the active notes profile before saving.
- Widget room scaling, resting collectible placement, automatic pose frames and limited daily sayings are preserved. The new grid/arrows are buttons, not swipe pages.

## Returning to the Palace

The Palace button previously called finish(). Opening Widgets from Home could create a task with no Palace underneath, so it closed to Home. It now explicitly opens/brings back the Palace Room screen, whether the app is already open or not. This uses the currently selected Main/Testing site and keeps the existing login.

## Room changes and saving

Changes to room/outfit/placed collectibles made on the Room page IN THE APP automatically update the widget after a brief moment; there is no need to press Sync for every change. The existing read-only two-second snapshot/fingerprint mechanism is preserved. For changes made on a computer, revisit/reload Room in this app first to load the latest appearance. The widget displays the last room seen in this app while offline; it does not fetch your entire game save by itself.

Daily Princess Notes remain phone-local, separate for testing and main. They are not Supabase-synced and are separate from Juan’s weekly letters. This technical explanation appears only in this guide, not in the app. Use the notes backup export before uninstalling or clearing app data. Installing this update over the old app preserves notes. Website Reset progress does not erase Princess Notes.

Calendar dates are still edited in **server/special-dates.json**. No new date file or reminder rules were introduced. Optional reminders remain day-before/day-of SPECIAL dates only; holidays have no alerts. The existing notification permission/background scheduling behavior remains unchanged.

## User-facing wording

Removed Supabase/profile/storage explanations from Princess Notes and room help. Simplified loading, reminder and preview messages. The app shows short, friendly instructions and keeps necessary actions such as sign-in, testing site selection, notification permission and backup export.

## Verification

Passed: garden and cabinet rules, cabinet empty/two/three-item eligibility, reset and saved API round trip without unlock-all, one wish per week across normalized saves, client/server rule parity, existing save migrations, website JavaScript/build, room snapshot/site-switch tests, special-date reminder regression checks, note ID migration/stale-tap/edit/delete/limits tests, Android compilation, resource-table alignment, APK v2/v3 signature verification and same signer.

I could not complete a fresh browser walkthrough because browser access to the local test page was blocked. The native widget/calendar/editor/task-return changes have NOT been exercised on a physical Samsung or emulator here. Test with 123 first, especially month/date taps, checkbox taps, typing/cancelling/saving a note from Home, resizing, and Palace when opened from the widget with the app previously closed. A successful build alone does not prove Samsung launcher behavior.

## Files

The small website ZIP contains only changes after Palace 4.0. Prefer it for your current repository. The full website ZIP in Website-Reference is an installation reference and may not contain newer edits made by you on GitHub; do not overwrite your personalized files with it.

Android source: extract Nayleen-Android-App-and-Widget.zip, open NayleenAndroid in Android Studio. SDK 35 / BuildTools 35.0.0 / Java 17+, existing AGP 8.9.2 and Gradle 8.11.1. Windows: .\gradlew.bat :app:assembleDebug. Future versionCode must exceed 8. The signing key is unchanged; keep signing/nayleen-development.keystore private and backed up. Do not commit it. Date/text edits use GitHub/Vercel; changes to native widget layouts/behavior require another APK.
