# Publish Nayleen’s carnival with cloud saves

Use the **Vercel + Code Login ZIP**. It includes the website, code-entry screen, server login/save endpoints, database SQL, profile isolation, and automatic saves. You still need to create your own projects and enter the server settings. No external Vercel or Supabase backend has been configured for you.

## What goes where

| Service | Its job |
| --- | --- |
| GitHub private repository | Stores the website files you edit |
| Vercel | Publishes the website and runs login/save endpoints |
| Supabase | Stores game saves, sessions, and login attempt limits |

## 1. Upload the files to GitHub

1. Extract the Vercel ZIP on your computer.
2. At github.com choose **New repository**, name it `nayleen-carnival`, and choose **Private**.
3. Choose **Add file → Upload files**. Upload the extracted contents, not the ZIP itself.
4. At the repository root you should see `api`, `server`, `database`, `public`, `package.json`, `build.mjs`, and `vercel.json`. Commit the upload.

Your wording is in `public/content/site-text.json`. The 52 read-only weekly memories are in `public/content/weekly-notes.json`.

## 2. Create the Supabase database

1. Sign in at https://supabase.com/dashboard and create a project. Save its database password in your password manager; this is not her carnival code.
2. Open **SQL Editor → New query**.
3. Open the included `database/setup.sql` file. Copy its entire contents into the query and click **Run**.
4. The SQL creates the save/session/attempt tables, enables Row Level Security, and allows only the server’s privileged role to use them. Do not add public read/write policies.
5. Find the **Project URL** and **Secret API key** in the project/API settings. The key normally starts `sb_secret_`. Keep it for Vercel; never upload it to GitHub, browser scripts, or chat.

If you already ran an older carnival setup, run this updated SQL on that same project. It upgrades the old single-profile tables without clearing existing Nayleen progress. Use the matching updated backend files too.

## 3. Publish with Vercel

1. Go to https://vercel.com/new and import your GitHub repository.
2. Choose **Framework Preset: Other** and keep the **Root Directory** at the repository root.
3. The included `vercel.json` sets build command `node build.mjs` and output directory `dist`. Leave those settings intact.
4. Add these environment variables for Production. Also add them for Preview if you want preview deployments to connect to that database:

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SECRET_KEY` | Your Supabase Secret API key |
| `CARNIVAL_LOGIN_CODE` | Her main private code |
| `CARNIVAL_TEST_CODE` | Optional different private code for your testing profile |

5. Click **Deploy**, open the resulting Vercel URL, and enter a code.
6. Adding or changing environment variables requires a redeployment to apply them.

No Supabase Auth user, email address, or auth redirect URL is needed for this shared-code edition. The server checks the code and creates a secure, HTTP-only session cookie for up to seven days. Supabase stores a hash of the random session token, never the login code. Three digits are easy to guess; a longer private code is better.

## Main code versus testing code

- `CARNIVAL_LOGIN_CODE` always opens the **Nayleen** profile. Her phone and computer use the same code and get the same save.
- `CARNIVAL_TEST_CODE` opens the separate **testing** profile. The page labels it “Testing profile · separate save”. Your scores, wardrobe, collectibles, weekly limits, and manor peanut progress stay separate from hers, including in the browser cache.
- Sign out before switching codes in the same browser. Use the testing code for experiments and reset/unlock tools.
- Both profiles use the same Supabase project, so you do not need two projects or two subscriptions.
- An arbitrary new code does not create an account. Only the configured codes work. They must be different.
- Changing her main code does not reset or create a save; it still opens Nayleen. Changing the testing code still opens the same testing profile.
- Everyone using a given code shares that profile. These are two shared profiles, not email-based personal accounts.

To disable testing-code login later, remove `CARNIVAL_TEST_CODE` in Vercel and redeploy. Her progress is unaffected. To invalidate every active session immediately, run `delete from public.carnival_sessions;` in the SQL Editor; each device will need to enter a valid code again.

## 4. Test across devices

1. Enter the testing code and use **Unlock everything for testing** to inspect all six portraits, or **Reset progress for testing** for a fresh run.
2. Play a little, wait for the save status, and open the same Vercel URL on another device with that testing code. Confirm the progress matches.
3. Sign out and use her main code. It should have its own fresh or existing progress.
4. To import an older browser save intentionally, download a backup from that old site first, sign into the desired profile, and use **Restore a backup**.
5. Two devices saving at once can produce a conflict. Download a backup on the conflicting device, then use **Reload account save** to load the newer database version.

Backend handlers and browser-cache separation are locally tested with a simulated database. Finish with the real two-device test after you create your projects. This is a personal game, not a tamper-proof multiplayer backend: editing the device clock/save or using testing tools can bypass local game rules.

## Reset her progress

No reset has been performed on her real save for you.

1. Ask her to close the site on other devices so they cannot keep playing on an older save.
2. Sign in with her **main code**. Confirm you are on Nayleen’s cloud save, not the testing profile.
3. Download a backup if you may want to undo the reset.
4. Click **Reset progress for testing**, then confirm **Reset my progress** inside the dialog.
5. Wait for the cloud save status. Scores, outfits, collectibles, crunches, manor peanut progress, and used weekly games start fresh for that profile. Weekly love-note JSON is unaffected.
6. Refresh or sign in again on her other devices. If a device has unsynced old changes, use **Reload account save**; do not restore its old backup over the reset unless you mean to.

If the buttons have already been hidden, temporarily set `testingTools: true` in `public/settings.js`, commit, and wait for Vercel to redeploy. Reset as above, then set it back to `false` and commit. These buttons are testing conveniences, not secure owner-only admin controls; hide them before gifting.

## 5. Final handoff and weekly updates

Set `testingTools: false` in `public/settings.js` to hide reset/unlock controls. Commit; Vercel redeploys connected GitHub updates. Keep the testing code for your separate testing profile if desired, or remove it from Vercel.

Send her the Vercel URL and her main code. She does not need a Vercel, GitHub, Supabase, or ChatGPT account to enter the code-login version.

Each week, edit `public/content/weekly-notes.json` in GitHub, fill that week’s emoji/title/message, set `published` to `true`, and commit. Vercel publishes the update. The database is separate from those files, so text updates do not reset progress. Her scrapbook has no note-writing form.

The published notes JSON and image files are public assets even though the GitHub repository is private. The code protects the save service, not confidential letters. Keep private drafts elsewhere.

## Approximate costs, checked November 18, 2026

- **Vercel Hobby:** $0/month, intended for personal non-commercial projects, subject to its usage limits.
- **Supabase Free:** $0/month, including a 500 MB database. Two small game profiles should comfortably fit; that is an estimate, not a usage guarantee.
- **Expected total for this gift:** $0/month within the free limits, using the included Vercel address.
- **Free database caveat:** Supabase can pause a project after about a week of low activity. Restore it from the dashboard if needed. Keep save backups.
- **Optional paid database:** Supabase Pro starts at $25/month; one small project is included in that base estimate. It avoids inactivity pausing. Vercel can remain on Hobby if eligible.
- **Optional paid hosting:** Vercel Pro starts at $20/month plus applicable usage. Both paid base plans together start around $45/month before tax/extra usage. Neither upgrade is needed just to have separate main/testing saves.

Check current allowances before upgrading. A custom domain is optional; the included Vercel address needs no domain purchase.

Official references: https://vercel.com/pricing ; https://supabase.com/pricing ; https://supabase.com/docs/guides/platform/free-project-pausing ; https://vercel.com/docs/environment-variables ; https://supabase.com/docs/guides/getting-started/api-keys

## Troubleshooting

- Login unavailable: check the variables, confirm main/test codes are different, and redeploy.
- Database unavailable: check the SQL completed and that the URL/key belong to that project. If upgrading, rerun the updated SQL.
- Too many tries: wait one minute; the server limits attempts per network address.
- Wrong progress: sign out, then use the intended profile’s code. Main and testing are labeled separately.
- GitHub Pages URL: that separate ZIP is browser-only; use the Vercel edition and URL for code-based cloud saves.

## New art and control visibility

See UPDATE-IN-GITHUB.md for the artwork-only update, text locations, branch workflow, and the saveTools/testingTools settings. Both tools are now hidden by default; automatic saving remains active.
