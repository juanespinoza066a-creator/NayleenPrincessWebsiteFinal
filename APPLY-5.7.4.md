# Palace 5.7.4 — Performance and progress repair (Testing)

1. In GitHub Desktop choose testing, Fetch/Pull. Extract the complete corrected Testing ZIP and copy everything INSIDE its folder into your repository folder. Merge folders and replace matching files. Commit to testing and Push origin. Keep main unchanged. Alternatively use the smaller 5.7.4 web patch's Website-update contents.
2. Wait for the Testing Vercel deployment to finish.
3. Install the new 5.7.4 APK over your existing app WITHOUT uninstalling. Version code 23 uses the same signing certificate. Select Testing in the app and reopen the room. This update needs both the website changes and the APK.
4. No new Supabase SQL is required. Keep your existing 5.7.3 setup.

## Changes

- Unlock Everything now fills every outfit and room progress bar, including Gambit, Reze, Rafayel, booster pack, Cissia and hotpot. Explicit gifts and already-earned permanent outfits display complete bars. Natural progression still measures the real goals. Unlock Everything does not spend weekly turns or make up scores/play counts.
- Passive income no longer rebuilds the entire wardrobe, collection and room shelf every second. These displays update independently and only when their relevant values change. Live progress bars update in place, without replacing cards or decoding their images again.
- Passive local-storage checkpoints run every five seconds instead of every second. User actions, explicit saves and leaving the page still save immediately; cloud save timing is retained.
- Offscreen cards skip unnecessary layout/painting where supported. Images decode asynchronously.
- Android room inspection is reduced from every two seconds to every five; capture on page load and manual widget syncing remain immediate.
- Personal-data checks do not redraw all widgets when their data is unchanged. Music artwork stays still while paused and refreshes less often while playing. Large room artwork is decoded at a size suited to the widget instead of full source resolution, reducing decoded image memory while preserving source proportions.
- New soft fleece Mimikyu plushie illustration with embroidered details and a lavender bow replaces the product photo. Same collectible ID, so owned copies and favorite designs are preserved. Artwork was generated with the built-in image tool using a whole centered cream-fleece Mimikyu plush, lavender bow, dimensional toy shading and a transparent background; saved in public/assets/images/collectibles/mimikyu.webp and the matching Android artwork folder.
- Favorite rooms are already part of the account state (roomDesigns), automatic backups and recovery. Verified using real save-handler and recovery tests. Saving a favorite now requests a cloud save immediately and shows account acknowledgement or an offline message.

## Data preserved

The complete ZIP starts with the latest Testing ZIP you supplied and preserves all 13 songs, their catalog, weekly notes, special dates, Espurr sayings and personalized site text. The small web patch excludes those files entirely. No reset or live deployment was performed. Existing Supabase progress and the five-backup policy stay.

## Verification

All 26 web suites and the web build pass, including every changed natural unlock threshold, complete grant progress, complete source/startup, favorite-design save and recovery, weekly-use preservation and hunter mechanics. A real-page regression verifies 100 passive-income changes cause ZERO wardrobe/collection/shelf replacements, while equipping still updates immediately. Android compiles, passes widget/resource alignment checks, and uses the existing APK signing identity.

No physical Samsung timing or scrolling benchmark was available, so check responsiveness on your device after both updates. This fixes measured redundant work; it does not promise a particular FPS.
