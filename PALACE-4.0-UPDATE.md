# Palace4.0 — Widgets, Princess Notes & Calendar

## Install in this order

1. Upload the CONTENTS of **Nayleen-Palace-4.0-Web-Update.zip** to your existing GitHub **testing** branch, preserving public, server and api paths. Commit the browser and server changes together and wait for Vercel Preview.
2. Keep your existing server/weekly-notes.json, public/content/site-text.json and public/settings.js. They are omitted from the patch so personal messages and settings are not overwritten. No SQL, new Supabase project, environment variables or paid notification service is needed.
3. Download **Nayleen-Carnival-Android.apk**, version4.0 / versionCode7, and install it OVER the existing app. Do not uninstall. The package/signing key is unchanged.
4. Use123 on the app’s Testing site. Visit Room and let it sync. Tap the native **Widgets ♡** button for Room, Calendar and Notes. The native ⋮ menu also has widget setup/sync help.
5. Add or refresh the home-screen widget. There are now **Room / Calendar / Notes** tabs. Resize to at least4×3, preferably4×4 for a readable month calendar. Very small old widgets need resizing; if the launcher keeps a stale layout remove/re-add only the widget, not the app.
6. Enable notifications in **⋮ → Notifications ♡ → Turn on** and allow Android notification permission if needed.
7. After testing, merge base:main / compare:testing. While signed into123 switch the app back to Main, then sign out and use956. The website selector remains local to each phone; with the same Supabase project956 changes her same save from either site.123 stays separate.

## The two bug fixes

Garden unlocks after any recorded maze attempt, an active/completed saved run, or a recorded maze win. It also recognizes the testing unlock-all save. The previous check saw only the attempt-week list, while unlock-all populated wins instead. Both client and server rules are updated.

Reset all now clears the wishing cabinet’s weekly-use list and discovery history explicitly, including older saves. Reset also replaces all existing state keys so fields added in later releases are not accidentally kept. The previous fresh-state object omitted tradeWeeks, so Object.assign left it behind. Unlock-all supplies a fresh weekly-use list too. Browser testing confirmed a claimed cabinet becomes available after reset + unlock-all, gives exactly one reward, and locks again across reload.

The casino has a simple crown/lucky-token graphic matching the other game cards. The cabinet now has a themed wishing altar, live offering count, highlighted selections and a reward reveal. No change to one-exchange-per-week, the three-owned-items cost, confirmation or duplicate/no-reroll rules.

## Room widget

- Clock centered at the TOP. The old bottom-left “A little moment for you” row is gone.
- Room-colored background, matching clock ink, and repeating themed decorations fill the surrounding canvas. The actual painted room preserves its proportions and high-resolution render cap; it is not stretched/cropped to fill an arbitrary widget shape.
- Room-specific ornaments: flowers/leaves for the garden, coffee symbols for7Brew, music/sun for Sunday, card symbols for the card shop, gift/ribbon decorations for PopMart, moon/hearts/crown for Lavender.
- Automatic frames now include a small wandering pose and carrying the first displayed collectible. These are launcher-friendly pose frames with fades, not a continuously running physics game. They do not move items in your real room or alter inventory. The resting frame uses the existing collectible positions.
- Sayings are fixed to time-of-day periods, with sleep/headpat status messages. They no longer live in a swipeable/rapidly advancing text flipper. Petting changes hearts/pose without spending all the day’s text. Sleep remains midnight–7am plus a noon nap in phone-local time.
- Navigation uses three TAP tabs. Android widgets have restricted gestures; horizontal swiping can conflict with home-screen navigation. Taps are used for reliable page changes.

Android/launchers may pause frame animation or delay sleep/wake refresh while hidden or under battery restrictions. Native TextClock continues following the phone’s clock. Physical-phone behavior still needs verification after this larger widget layout change.

## Princess Calendar

Both the widget Calendar tab and the in-app Widgets → Calendar screen use the chosen room’s colors and currently dressed Espurr. The widget has month arrows; tap the month to open the full calendar at that month. The app lets you tap each date to read its labels and shows the month’s event list.

Hearts mark your special dates. Stars mark major US federal holidays on their actual calendar dates, plus Valentine’s Day and Halloween; these are not a university-office closure calendar. Holiday labels NEVER generate reminders by themselves.

Included recurring special dates:

| Date | Label |
| --- | --- |
| February28 | Princess’ birthday |
| July6 | Juan’s birthday |
| August2 | Our anniversary |
| September29 | Buns’ birthday |
| April23–25 | RGV Comicon |

The Comicon dates are the dates you supplied, not independently verified event dates. They recur annually by default; add a year if intended as one specific year.

### Edit dates without a new APK

Edit **server/special-dates.json** in GitHub and deploy. It is served through the authenticated updates endpoint. Keep the repository private. The APK also has a fallback at **NayleenAndroid/app/src/main/assets/special-dates.json** for offline first use.

The file is ordinary JSON. Add objects inside events, separated by commas. Example:

```json
{
  "timeZone": "America/Chicago",
  "reminderHour": 9,
  "events": [
    {"id":"princess-birthday","title":"Princess’ birthday","month":2,"day":28,"notify":true},
    {"id":"comicon","title":"RGV Comicon","month":4,"day":23,"endDay":25,"year":2027,"notify":true}
  ]
}
```

Omit year for yearly recurrence. endDay/endMonth define a same-year range. Set notify:false to keep a calendar mark without reminders. Keep IDs unique and stable. Dates are numeric, months1–12. Do not put raw line breaks inside JSON strings.

Open Room in the signed-in Palace to sync config, or use **Widgets → Calendar → Refresh special dates from Palace**. Background checks also refresh dates when notifications are enabled. Automatic config checks are throttled to about once an hour; the Refresh button requests a fresh check. Valid login and internet are needed for remote changes; cached dates still work offline. If sign-in has expired, sign into the Palace again.

### Special-date reminders

Only objects in special-dates.json with notify:true get a reminder one day BEFORE the start date and ON the start date. For Comicon this means April22 and April23; the calendar still marks23–25. Dates are checked around9am America/Chicago by default, or later when Android runs the hourly job. Alerts are deduplicated by event/date/stage. Holidays generate no alerts. Newly enabled alerts do not replay dates that have already passed. Android battery restrictions, force-stop or lack of notification permission can delay/prevent delivery; these are best-effort local alerts, not exact alarms. Existing weekly reset, new-letter, release and7/14-day check-in alerts remain.

## Princess Notes

In Widgets → Notes add bullet notes, tap text to edit, check off completed notes, or remove a note with confirmation. Up to100 notes,500 characters each. The widget previews the first six and opens the full list when tapped. Both views use the selected room theme and dressed Espurr.

**Daily Princess Notes are saved locally on this phone, separately for testing and main profiles. They do not sync through Supabase or become Juan’s52weekly letters.** They work offline after Room has been synced. Signing out hides notes previews until a room/profile is synced again. Use Export my notes backup before uninstalling/clearing app data. Installing this APK over the current version preserves local storage. Website Reset progress does not erase these separate daily notes.

## Things preserved

Squishy Clicker code, sounds and CSS; room placement/export code; personalized base text/settings; private weekly letters; existing app identity/signing key and cloud login/save system. Weekly game/letter resets remain Monday midnight America/Chicago. No production account was reset during testing; the browser checks used isolated local fixtures.

## Verification and limits

Passed: web syntax/build, browser/server parity, garden legacy-attempt/win/unlock-all rules, cabinet reset/reuse/one-reward/reload limit, existing-save migration, special-date quiet hours/day-before/day-of/year rollover/range handling/opt-out, no holiday alerts, Android compile/resource alignment and APK v2/v3 signature checks. Browser QA also exercised the actual reset/unlock/exchange UI.

The new native screens, editing/exports, Android background notification delivery, widget taps/poses and Samsung launcher/lock-screen behavior have NOT been exercised on a physical phone here. Test with123 first. Samsung lock-screen availability is still controlled by OneUI/GoodLock/LockStar; declaring keyguard support does not force Samsung to expose the widget.

## Android source

Extract Nayleen-Android-App-and-Widget.zip, open NayleenAndroid in Android Studio, use SDK35/BuildTools35.0.0/Java17+ and the included Gradle wrapper. Windows build: .\gradlew.bat :app:assembleDebug. The project uses AGP8.9.2/Gradle8.11.1. Future versionCode must exceed7.

Keep the included development signing key privately backed up: signing/nayleen-development.keystore, alias androiddebugkey, password android. It is excluded by .gitignore; never commit it. New date changes can use the server config without rebuilding; native behavior/art changes require a new APK. Website-Reference contains a complete snapshot for reference; use the small patch for your existing repository to preserve newer personal edits.
