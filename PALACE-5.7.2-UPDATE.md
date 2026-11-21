# Palace 5.7.2 — Simple saved backups

The account section at the bottom now shows only **Saved backups**, with a short
message that progress saves automatically. Account download/upload controls and
manual backup deletion are no longer displayed there.

Tap Saved backups, choose a dated copy, and confirm Restore this copy. The app
retrieves it directly from the signed-in account. It keeps a safety snapshot in
Supabase before replacing progress, rejects a conflicting newer save, preserves
used weekly attempts, and shows success only after the restore is acknowledged.
No downloaded/uploaded file is needed for this flow. Cancel leaves progress alone.

## Install

1. Deploy **Nayleen-Palace-5.7.2-Web-Update.zip** to Testing. It includes the earlier
   5.7/5.7.1 changes, so use this cumulative patch instead of applying older patches.
   It excludes music/library.json and tracks, preserving your newer song additions.
2. Install the APK over the current app; do not uninstall. Version 5.7.2/code 21.
   The backup screen is served by the website, so the website patch is necessary.
3. Your already-applied backup SQL is unchanged. There is no SQL to rerun.
   If setting up a new Supabase project later, use database/backups.sql once after
   the original project setup. It is included in the patch for that purpose.
4. Test: change an outfit, wait for Saved, open Saved backups, choose a copy and
   confirm recovery. Check a Before recovery copy appears. Then merge to main.

## Where data lives

Game progress is saved automatically to Supabase's carnival_saves table. Automatic
recovery copies live in its private carnival_backups table. The first successful
save creates the initial copy; after three days, the next successful save creates
another. Only the newest ten per profile stay. Restoring also makes a safety copy;
all copies share that same ten-copy cap. Downloads onto the phone are not automatic
and are no longer part of the normal recovery screen.

The existing login code is still needed to sign in. Backups restore game progress,
not login credentials. Keep the code separately. Supabase copies cannot protect
against loss of the entire Supabase project or hosting account; owners can manage
rows in the dashboard if needed. Removing backup rows does not remove the live save.

Princess Notes, personal calendar dates and custom music playlists remain phone-local
and are not in these game backups. Their separate in-app features are unchanged.
Personal calendar Add/edit/reminders and its separate date backup controls remain.
Princess Drop remains five weekly attempts, one collectible at 1500 points, continued
play after the prize, and Sunday room at 3200. Palace mix stays removed.

## Validation

All 21 web suites pass, including the simplified UI, restore confirmation, conflict
blocking, profile-scoped access and weekly-use preservation. The APK builds, has the
existing signing identity, and passes resource packaging/signature checks. Android
code other than version metadata is unchanged from 5.7.1. No physical-device restore
was performed here. Native phone UI should still be checked on your device.
