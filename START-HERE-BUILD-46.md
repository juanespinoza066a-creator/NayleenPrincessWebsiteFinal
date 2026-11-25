# Palace 5.7.7 · Build 46

## Install over Build 44

1. Apply this website patch to the current **Build 44 testing branch**. Copy the files into the repository root, commit, push, and wait for Testing to deploy. The patch leaves your letters, photos, music, calendar settings and saved progress in place.
2. Install Build 46 over your existing app and open **Other Palace** online. Confirm that your test profile’s progress and music are present. Then close the app, turn on airplane mode, reopen it, play a game, and equip an outfit. Close and reopen to confirm the changes stayed on the phone. Reconnect and tap **Sync Progress** at the bottom of the Room page.
3. Turn on **Palace notifications** in the app menu and allow Android notifications. Use **Send a test notification** in the testing tools. For a weekly note, first let a signed-in online check establish the current note version. Publish a change to a released week and allow time for Android’s next background check.
4. Before updating Nayleen’s phone, merge the verified testing branch into Main, preserving any letters, photos, songs, and settings edited on Main. Main needs the current saved-progress, companion, and backup backend. If the Main Supabase project still has only the original setup, apply the existing additive `database/backups.sql`, then `database/patch-5.7.3.sql`, from the merged site before deploying the update. Keep the app installed and open it once online after installing Build 46 so it can verify and import her save.

## Edit Winter 2026

On the deployed testing website, sign in with your testing code and select **Edit Winter 2026** near the bottom of the Room page, or open `/advent-editor.html`. Use the switches for calendar visibility and early access on the testing profile. The three editable letters are December 7, 14 and 19. Download the settings or notes file, replace the corresponding file in `server/` in GitHub, then commit and push to publish. The app checks for calendar setting changes when it’s online. Regular doors open at midnight Central Time on their December dates and stay open once claimed. The private letters require internet to read.

## What uses the internet

- First sign-in and the one-time import of an existing save.
- Progress and personal-data backups about every three days when pending changes can be sent, **Sync Progress**, and online backup restoration.
- Fresh weather and forecasts, the weekly scrapbook and photos, private Advent letters, and newly published calendar settings.
- New song listings and songs that aren’t bundled with this APK. The bundled tracks play directly from the phone.
- Notifications for newly published website content. Weekly game resets, saved special-date reminders, and the in-app notification test are scheduled locally or shown by the app.

Rooms, outfits, collectibles, games, Advent gifts, personal notes and dates, and the bundled music work offline after setup. A remote edit made from another device only appears after sync. If both devices changed game progress independently, the app offers a backup of the phone’s progress before loading the account copy.
