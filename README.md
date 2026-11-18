# Put Nayleen’s carnival online with code login and cloud saves

Use the **Vercel + Code Login ZIP** for this guide. This is a separate prepared edition from the GitHub Pages ZIP. It includes the login screen, server endpoints, database SQL, conflict handling, and automatic saves. You still need to create your own projects and enter the server settings. Nothing needs to be installed on her phone.

## What goes where

| Service | Its job |
| --- | --- |
| GitHub, preferably a private repository | Stores your website files so you can edit them |
| Vercel | Publishes the website and runs the small code-login/save backend |
| Supabase | Stores the shared Nayleen save, login sessions, and attempt limits |

You are using a **shared code**, not separate email accounts. The same code on her phone and computer opens the same Nayleen profile. If you use that code too, you share her progress. Three digits are easy to guess; a longer private code is better. The code is checked on the server, with five attempts per network address per 15 minutes. Never use this little gift login for sensitive records.

## 1. Create the GitHub repository

1. Extract the Vercel ZIP on your computer.
2. At github.com choose **New repository**, name it `nayleen-carnival`, and choose **Private**.
3. Choose **Add file → Upload files**. Upload the extracted contents, not the ZIP itself. At the repository root you should see `api`, `server`, `database`, `public`, `package.json`, `build.mjs`, and `vercel.json`.
4. Commit the upload. Your text is under `public/content/site-text.json`; weekly memories are under `public/content/weekly-notes.json`.

## 2. Create the database in Supabase

1. Sign in at https://supabase.com/dashboard and create a new project. Give its database a strong password and keep it in your password manager. The database password is **not** her carnival code.
2. When the project is ready, open **SQL Editor → New query**.
3. Open the included `database/setup.sql` file, copy its entire contents into the query, and click **Run**.
4. This creates the save/session/attempt tables, enables Row Level Security, and only allows the server’s privileged role to use them. Do not add public read/write policies.
5. Find the project’s **Project URL** and **Secret API key** in its project/API settings. The secret key normally begins `sb_secret_`. You need them for Vercel. Do not upload the key into GitHub, `settings.js`, or this chat.

## 3. Publish through Vercel

1. Go to https://vercel.com/new and choose **Import Git Repository**. Connect GitHub if needed and select `nayleen-carnival`.
2. Set **Framework Preset: Other** and keep the **Root Directory** at the repository root.
3. The included `vercel.json` sets the build to `node build.mjs` and output to `dist`. Leave those settings intact.
4. Add these **Environment Variables** for Production (and Preview too if you want preview links to use the same save):

| Name | Value |
| --- | --- |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SECRET_KEY` | Your Supabase Secret API key |
| `CARNIVAL_LOGIN_CODE` | Your chosen code, such as the three-digit code you suggested |

5. Click **Deploy**. Vercel installs/builds the files and provides your website URL.
6. If you add/change environment variables after the deployment, redeploy to apply them.

No Supabase Auth user, email address, redirect URL, or password-reset flow is needed for this shared-code edition. The Vercel server checks the code and gives the browser a secure, HTTP-only session cookie for up to seven days. Supabase stores a hash of that random session token. Signing out invalidates that session; the save stays in the database.

## 4. Test before gifting

1. Open the Vercel URL and enter your chosen code.
2. For a clean start, use **Reset progress for testing**, then confirm in the website. This replaces the shared cloud save too.
3. Play a little, leave the page open long enough to sync, and open the same URL on your phone with the same code. Check that the score/outfits/collection match.
4. Test **Unlock everything for testing** if you want to inspect every outfit. Those changes also sync.
5. If two devices play at once, a stale save is blocked instead of silently overwriting the newer one. Download a backup on the conflicting device, then choose **Reload account save** to use the database version.
6. To move your older GitHub Pages progress, download its JSON backup first. Sign in on Vercel, then use **Restore a backup** there.

No production Vercel or Supabase project was created or connected by this download. Its handlers are locally tested with a simulated database; do the two-device test after your real setup. Weekly rewards are saved, but this is not a tamper-proof online game: deliberately editing the local save/clock or using testing buttons can bypass local game rules.

## 5. Remove testing tools and give her the URL

In `public/settings.js`, change `testingTools: true` to `testingTools: false`. Commit. Vercel automatically redeploys connected GitHub changes. The reset and unlock-all buttons disappear. They are convenience tools, not an admin permission boundary.

Before that final change, reset once more if you want her to start fresh. Download a backup if you want to keep your test collection. Do not use the code yourself afterward unless you intend to play on her shared profile.

## Each week afterward

Edit `public/content/weekly-notes.json` in GitHub. Fill that week’s emoji, title and message; set `published` to `true`; commit. Vercel publishes the update. The database save is separate from the website files, so updating your words does not reset her games. Her scrapbook has no writing form.

The notes JSON and website assets are public files on the deployed URL, even though your GitHub repository is private and the game has a code screen. The code protects the cloud save, not confidential letters. Keep private drafts out of the published JSON.

## If something does not work

- Login service not configured: check all three Vercel variables and redeploy.
- Database unavailable: confirm the full SQL ran successfully and the Project URL and Secret key belong to that same Supabase project.
- Too many tries: wait 15 minutes; changing browser tabs does not reset the server limit.
- Changed code: existing sessions can last seven days. To sign out every device, run `delete from public.carnival_sessions;` in Supabase SQL Editor, then use the new code.
- GitHub Pages URL: that separate edition is browser-only. Use the Vercel URL for code login/cloud saving.

Official references: https://vercel.com/docs/deployments/git ; https://vercel.com/docs/environment-variables ; https://supabase.com/docs/guides/getting-started/api-keys ; https://supabase.com/docs/guides/database/postgres/row-level-security
