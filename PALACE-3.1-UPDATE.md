# Palace 3.1 update

## Apply this small update

Upload the CONTENTS of Nayleen-Palace-3.1-Web-Update.zip to your existing GitHub testing branch at the repository root, preserving public/... and server/... paths. Upload browser and server rules together. Your site-text.json, settings.js and server/weekly-notes.json are omitted, so personal text, login settings and notes remain as you edited them. No SQL or environment-variable changes are needed. Wait for Vercel Preview, test with123, then merge to main when ready.

Install the new Nayleen-Carnival-Android.apk over the existing app. Version3.1 / versionCode6 retains the same app ID and signing key. Do not uninstall. The APK change improves widget rendering; the casino/art/audio/quest changes are in the website patch. If notes already work from server/weekly-notes.json, you do not need to repeat the3.0 migration below.

## Changes

- Casino artwork replaces the card fan. The card says DAILY + WEEKLY PLAY. The blackjack and wishing-cabinet buttons are separate full-width tiles with an18px gap and contrasting styles.
- Save image of room is a small button immediately above the room, including on phones. Android Gallery export remains.
- Non-peanut squishy sounds now use real recorded rubber/stress-toy foley by MrFossy, licensed CC0 on Freesound. Five short MP3 recordings are bundled locally, with differing pitch/playback for textures and a short recording for Mochi Kitty. There is no synthesized wind/noise layer or windy fallback. Peanut's original crunchy sound is unchanged. See public/assets/audio/squishies/CREDITS.txt for all author/source/license links. Files are hosted on your own site; no third-party audio request is needed during play.
- Music/effects default ON for a new device. Saved mute choices remain respected. Table music now remembers its own preference and begins on entering21 unless muted. Browser/Android media rules still require a user tap before audio starts; the app does not bypass those rules. Music stops when the table closes or page hides.
- Widget rendering uses its displayed width and phone pixel density to choose a320–768px scene resolution. Resizing triggers rerendering. Aspect ratio and emote proportions are preserved. The memory cap avoids unbounded three-frame images. Higher rendering resolution reduces scaling blur but cannot invent detail absent from the original portrait/collectible files. Physical Samsung resize/quality testing is still required.

## Room goals now

| Room | Requirement |
| --- | --- |
| Lily-of-the-valley garden | Start Ann's weekly maze at least once; winning is not required |
| 7Brew | Own all seven squishies |
| Pokémon card shop | 1,000,000 lifetime squishes |
| PopMart | Unchanged:3weekly boxes |
| Sunday | Unchanged:best table score1,000 |

Balances, items, upgrades, weekly claims and notes are preserved. An equipped room whose new requirement isn't met can fall back to Lavender until earned. The card-shop goal uses the explicit one-million-squishes instruction; no additional25-play condition was added.

## Testing and Main saves

If both Vercel environments use the same Supabase project and profile mapping,123 uses the testing save and956 uses Nayleen's save on either website. Playing with956 on Testing can immediately change the save loaded on Main. Merging changes only publishes code; it does not copy/transfer saves. Continue using123 for testing. The native website selector remains local to each phone.

## Verification

Passed: new room boundaries, shared browser/server rules, existing-save migration, Monday/DST behavior, private-note access checks, JS syntax, production build, MP3 format/duration checks, browser casino/button/export position and default table music state, native compilation, uncompressed/aligned resource table and APK v2/v3 signatures with the existing key. Peanut sound code is byte-identical to3.0. Actual Samsung widget rendering/notifications and subjective audio quality should be checked on your phone.

## Earlier3.0 setup reference (only if needed)

