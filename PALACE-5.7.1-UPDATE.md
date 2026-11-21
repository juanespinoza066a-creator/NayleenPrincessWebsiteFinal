# Palace 5.7.1 — Personal calendar dates and Princess Drop

Install the APK over the current app; do not uninstall (version code 20).
Use the 5.7.1 web patch instead of 5.7: it includes the backup/recovery changes
from 5.7 plus the Princess Drop changes. Your song list/audio are not included
in the patch and will not be overwritten.

## Calendar

In Widgets → Calendar, tap **My dates · add or edit ♡**, then **Add a date**.
Enter a title, pick a date, and optionally choose Repeat every year and reminders.
Tap an existing personal date to edit/remove it. Built-in owner dates and holidays
remain protected. Calendar widget has a **+** button opening the same editor over
Home, without opening the main Palace screen. Dates show in both views immediately.

Personal dates are stored on this phone, separately for Testing and Nayleen, with
a cap of 100. They are NOT included in the automatic game-progress backups.
Use **Keep a copy of my dates** and **Bring my dates back** in the calendar editor
for a separate JSON backup. Importing asks for confirmation and replaces only
personal dates; it rejects another profile's file. Keep a copy before uninstalling
or moving phones. There is no automatic calendar sync between different phones.

Reminders are optional. When enabled, these dates use the existing day-before and
day-of reminder system, normally from 9 AM in the calendar timezone. Android
notification permission must be enabled; background delivery timing depends on the
phone. Holidays do not gain notifications. Existing special-date settings remain.

## Princess Drop — final requested rules

- Five attempts per week. A try is used when a fresh basket starts. Resuming an
  unfinished basket does not spend another try. Each completed old weekly run
  migrates as one used attempt, leaving four more available for that week.
- **1,500 points: one random collectible per basket.** The final Emil treasure
  is no longer required. The prize is granted immediately and will not repeat
  when the basket resumes or gains more points.
- The basket keeps going after the prize so she can reach **3,200 points for
  Sunday's room**. The room is a separate unlock, not a second random prize.
- After earning a prize, **Finish this basket** lets her stop early. Otherwise
  play continues until overflow. Overflow does not take away an earned prize.
- Restore preserves the highest used-attempt count from both copies, so backups
  cannot give extra tries. The best Drop score remains saved.
- Sunday's outfit still uses its original card-table requirement.

## Setup and checks

If you have not installed the 5.7 backup setup yet, first run the existing
PALACE-BACKUPS-SETUP.sql in Supabase SQL Editor (Testing first), then deploy this
5.7.1 web patch. If that SQL has already been applied, there is no additional SQL
change for 5.7.1. Install the new APK for calendar editing. The 5.7 music importer
remains the latest importer; it does not need replacing again for this update.

21 web suites passed, including immediate collectible award, separate Sunday room
threshold, continued basket play, five attempts/resume, recovery preservation and
actual physics simulations. Android personal-date tests verify one-off/yearly
visibility, reminder opt-out, validation, protected built-ins and the cap. Existing
calendar reminder, music, widget XML and signed APK checks passed. No physical-phone
UI/notification test was available; please check the date editor and a test event
on your phone before handing over the app.

---

# Palace 5.7 — Save confidence

## Install in this order

1. Open Supabase → your Testing project → SQL Editor. Run the contents of
   **PALACE-BACKUPS-SETUP.sql** once. This is the same file as
   `database/backups.sql` in the website patch. It is additive and does not reset
   account progress or sessions. Do NOT rerun the original setup.sql for this update.
2. Extract **Nayleen-Palace-5.7-Web-Update.zip** into your existing website clone.
   Commit/push to Testing, then wait for deployment. The patch deliberately excludes
   music/library.json and all audio, so your recently added songs stay untouched.
3. Install the new **Nayleen-Carnival-Android.apk** over the current app (version
   5.7, code 19). Do not uninstall. This removes the permanent Palace mix from the
   music selector. All songs and your custom playlists remain available.
4. Replace the desktop importer with **Palace-Music-Importer-Windows.zip**.
   All songs only is now the default. On the next successful song addition it removes
   the old palace-mix entry from library.json while preserving tracks and custom
   playlists. It never deletes audio files. Pull your GitHub changes first.
5. After testing, run the same additive SQL in your main Supabase project if it is
   separate, then merge the website patch to main. If both deployments share a
   Supabase project, running the SQL once is sufficient. Profiles remain separate.

The full website/source ZIPs are reference copies, not an instruction to overwrite
your newer song list. Use the small web patch above for your current repository.

## What Nayleen sees

At the very bottom of her Palace:

- **Download account data** downloads the current game progress as JSON, including
  progress that is still waiting to sync from this device.
- **Saved backups** lists the saved copies with dates. Each has Download and Remove.
  Removing one copy does not delete current progress or the other copies.
- **Upload account data** opens a file picker and shows a review before restoring.
  The account is replaced only after confirmation and a successful server response.
  A copy of the previous account progress is saved in the same transaction first.
- Saving shows a simple status. Conflicting device saves are kept for review rather
  than silently overwritten. Download the local copy before choosing the account copy.

## Automatic backups and storage

Backups happen on the first successful progress save after three days have passed,
not from a phone background timer. The first save after installation also creates
the initial copy. Before changing an existing save, its previous stored state is
captured. If she is away for a week, a copy is created when she next saves; no
identical copies are generated while the account is inactive.

Only the latest **10 copies per profile** are retained, including pre-recovery copies.
Older copies are deleted automatically. Downloaded files remain on your device until
you remove them. Manual deletion is optional; storage does not grow without bound.
The backup table caps each state at 200 KB: at most about 4 MB of state payload across
two profiles, plus normal database/index overhead. Typical game saves are much smaller.
No songs or image files are duplicated, and there is no GitHub backup commit per save.

These backups live in a private Supabase database table, not a public GitHub folder.
List/download/delete/restore require a current Palace login and are profile-scoped.
The browser never receives a database secret. Testing backups cannot replace Nayleen's
profile when their exported profile label is present. Legacy unlabeled Palace files
are still accepted after an explicit review.

## Recovery scope

The file covers room, outfit, collection, clicker/upgrades, scores, unlock progress,
saved room designs and weekly game state. Used weekly turns are preserved against
the current account so restoration does not grant extra plays.

It does NOT include native Princess Notes, phone settings, personal music playlists,
MP3 files, images, server login codes or login credentials. It restores game progress;
it does not bypass sign-in. Keep her login code separately. If a code is forgotten,
the owner can change the configured login code for the same profile; progress stays
associated with that profile.

Download a copy occasionally and keep it outside the account—for example on your
computer. Copies stored in the same database cannot protect against losing that
entire database or access to the hosting account.

## Validation

19 web suites passed. PostgreSQL tests executed the real schema/functions and checked
three-day cadence, ten-copy retention, profile isolation, permission denial, atomic
pre-recovery snapshots, stale-revision rejection and safe migration reruns. API/UI
checks cover wrong-profile files, confirmation, server acknowledgement and deletion.
Ten importer tests passed, including MP3 conversion and isolated Git publishing.
Android music-model, widget structure, compilation, APK resource and signature checks
passed. No live account migration or physical-phone restore was performed here.

Before relying on it, use Testing: make progress, download the JSON, change progress,
upload the JSON, verify recovery, and check that a Before recovery copy appears.
