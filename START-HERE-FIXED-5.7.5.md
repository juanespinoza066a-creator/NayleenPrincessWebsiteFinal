# Fixed installation —5.7.5 build25

Your uploaded ZIP had the patch inside Website-update/, while the live public/ and server/ files were still5.7.4. This corrected complete ZIP has already applied that patch to the correct files and removed the redundant nested folder. Your songs and personal content are retained.

1. GitHub Desktop: select **testing**, then Fetch/Pull. Choose Repository → Show in Explorer (Ctrl+Shift+F).
2. Extract this corrected complete ZIP. Open the extracted folder until you can see **public**, **server**, **api** and **package.json** together.
3. Select all those files/folders and paste them DIRECTLY into the repository folder opened in step1. Merge folders and replace matching files. Do not paste the outer ZIP folder or a Website-update folder into the repository.
4. If the old extra Website-update folder is still inside your repository, remove only that unused folder. Keep the real public/server/api folders.
5. GitHub Desktop should show changes to **public/assets/js/carnival.js**, **public/assets/js/game-rules.js**, **server/game-rules.js**, plus new weather assets/modules. If it only shows Website-update/... paths, the files are still nested incorrectly. Commit to testing, then Push origin.
6. Wait for the Testing Vercel deployment to finish. In the app select **Testing** and reload the Room page. The wardrobe should say24 total outfits and show a Winter2026 tab at the website header. Changes do not appear before the testing deployment succeeds.
7. The verified APK is5.7.5 / build25 and includes the music seek popup, lightweight widget timer, native calendar fixes and all8 weather outfits. Install it OVER the existing app if unsure which build is installed. Do not uninstall.

No new Supabase SQL. Main remains unchanged. The downloadable APK was read back and its bytes match the verified build (SHA256:75cd2282ec545fd7902a980a9079bde0a32bf7d3543e841d13f8f12c615ff65d). A phone's installed APK cannot be verified from this ZIP alone.

