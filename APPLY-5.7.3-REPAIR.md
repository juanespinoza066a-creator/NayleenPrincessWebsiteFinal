# Apply the complete 5.7.3 Testing repair

The ZIP you uploaded still had 5.7.2 game rules, wardrobe requirements, page scripts and CSS. It was missing the new account-data endpoint/models and 18 collectible images. The installed APK supplies the native music screen, while the website supplies these game/content updates.

This repair starts with YOUR uploaded Testing ZIP and overlays all missing 5.7.3 website changes. Your 13 song catalog entries, 13 audio files, weekly notes, site text, Espurr sayings and special-date configuration are preserved byte for byte. It does not change your Supabase save data.

1. Download and extract NayleenPrincessWebsiteFinal-testing.zip again from the new download link.
2. In GitHub Desktop select NayleenPrincessWebsiteFinal and CURRENT BRANCH testing. Fetch/Pull first.
3. Open the extracted NayleenPrincessWebsiteFinal-testing folder. Copy everything INSIDE it into your existing local repository folder (the one containing package.json, public, server and api). Merge folders and replace matching files. Do not copy the outer folder inside the repository, and do not delete your repository folder.
4. Back in GitHub Desktop review changes, Commit to testing, then Push origin. Main stays unchanged.
5. Wait for the Testing Vercel deployment to succeed. In the app, use the owner code and the Testing website selector. Confirm its URL is your current Testing deployment, not the main website. Close/reopen the app after deployment if needed.
6. Quick check: Collectibles should show a total of 39. Reze should be named Reze with a ten-escape goal; Jubilee should say fifteen login days. Check a cozy hotpot date appears in Rooms.

Keep the existing 5.7.3 APK. No APK rebuild is needed for these missing website files. The 5.7.3 SQL you already ran is also the right migration; no need to create another Supabase project or rerun it for this repair.

The separate 5.7.3-Missing-Files.zip is an optional smaller patch containing the same 49 changed/added files relative to your upload. Use either the complete corrected ZIP OR that smaller patch, not both. It omits music files and personalized content entirely.

Verified: all 24 web test suites and the production web build pass using your actual uploaded content plus this repair. No live deployment or GitHub branch was changed here.
