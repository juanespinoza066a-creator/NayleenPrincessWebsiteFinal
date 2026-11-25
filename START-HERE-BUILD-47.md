# Palace Build 47 · Juan profile

Juan is a separate player save with the same view, unlock rules, dates and reminders as Nayleen. The existing Testing profile keeps its testing tools. Juan starts with fresh progress. The backend creates his cloud save on the first successful sync.

## Enable Juan on the Testing branch

1. Open the Supabase project used by the Testing deployment. Run **database/patch-juan-profile.sql** in SQL Editor. Run this after the existing backup and 5.7.3 patches. This migration retains existing saves and sessions. If Main and Testing share Supabase, the migration is needed only once.
2. In Vercel, add **CARNIVAL_JUAN_CODE** to the **Preview** environment for the **testing** branch. Use a private numeric code different from both existing codes. Keep it in Vercel and out of GitHub. The Juan code works only on deployments that have this setting.
3. Extract this patch into the root of the current **testing** branch, commit, and push. It is based on the uploaded Testing export. Wait for the preview deployment to finish.
4. Install Build 47 over the existing APK. In the app, open **Other Palace** using your Testing profile if you are not already there. At the bottom of the Room page, tap **Sign out**, then enter your new Juan code. Juan sees the recipient layout without Testing controls or the Testing prefix on weekly notes. To regain the testing controls on the preview, sign out and reenter the existing Testing code.
5. Check Juan’s room, make a small change, and tap **Sync Progress**. Open the app in airplane mode to verify your Juan progress stays on the phone. Sign out and back into your usual profile to check its progress independently.

When you promote the tested website to Main, you can leave the Juan code scoped to Preview. Set it for Production as well only if you want to sign in as Juan directly on the Main URL. The label under Juan stays the same as on Nayleen’s profile so you can check the actual player presentation.
