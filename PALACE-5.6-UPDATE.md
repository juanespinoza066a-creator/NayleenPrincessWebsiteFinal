# Nayleen’s Palace 5.6

Install the APK over your existing app; **do not uninstall it**. This release has
the same app identity/signature and version code 17. Update both the website and
Android app for all changes below.

## Website update

1. Extract **Nayleen-Palace-5.6-Web-Update.zip** over the existing 5.5 website source.
2. Keep your existing `public/music/tracks/A Pearl [_lYA3i3QkWM].mp3` file in Git.
3. Commit the changed files to Testing and wait for deployment. Refresh the music
   list in the app. Merge to your main branch when you are happy with the update.

The patch includes a two-song `public/music/library.json` with the welcome WAV
and A Pearl MP3. If you added more songs since that list, preserve those entries
when applying it. The full website ZIP is also supplied as a reference. Neither
archive supplies the Mitski audio file; retain your existing uploaded file.
Your weekly notes, personalized sayings, site text and weather implementation
are unchanged. No account progress was reset or changed on the live site.

## A Pearl playback

The song list previously requested `tracks/a-pearl.mp3`, while the uploaded file
was `tracks/A Pearl [_lYA3i3QkWM].mp3`. Those are different paths. The list now uses:

```json
{"id":"a-pearl","title":"A Pearl","artist":"Mitski","file":"tracks/A Pearl [_lYA3i3QkWM].mp3"}
```

MP3 is correct for this song. The `.wav` entry is the separate welcome track.
The player accepts the original spaces/brackets and encodes them for playback.
Testing and main must each deploy the audio and matching list before that site
can play the song. Check filename capitalization too.

## Changes

- Blackjack score stays on the board. Wager/reset and all four play buttons are
  also on the board below Espurr and the hand, in normal layout flow. They no
  longer float over the cards when scrolling. Short screens can scroll normally.
- Sunday’s quiet sanctuary now requires **3,500 Princess Drop points**. The best
  Drop score is remembered, including qualifying overflow/lost games. Existing
  Drop history migrates when the save loads. The Sunday **outfit** still uses
  its existing card-table requirement. Explicit prizes/Unlock everything grants
  remain valid; an exchanged room still needs to be earned back.
- Music widget artwork is larger and centered above centered song/artist text.
  Its bitmap is drawn at higher resolution with a consistent aspect ratio.
  Very small widgets hide the secondary artist/time rows to preserve artwork
  space; transport controls and the song title remain visible.
- Headphones fit around Espurr’s head, with rounded cups and outfit-sensitive
  colors. The other widget pages and room layouts stay as before.
- The new widget layout forces a fresh view after upgrading. If a launcher keeps
  showing an old cached layout, remove/re-add the widget (keep the app installed).

## Easier additions

The separate **Palace-Music-Importer-Windows.zip** lets you choose the local
website folder once, paste a song link, and add the MP3 plus matching library
entry together. It can optionally commit and push the addition to your current
Git branch. It also imports existing audio files. Read its START-HERE.md for setup.

## Checks and limits

All 17 web suites passed, including real deal/house resolution and the Sunday
room boundary/migration checks. Android Java/model, calendar/notes/weather,
snapshot, widget XML and APK packaging/signature checks passed. The importer has
10 passing checks, including real WAV-to-MP3 conversion and isolated Git pushes.

The new APK was compiled and signed; no physical Samsung A54 or launcher was
available for a visual/device run. Your actual A Pearl MP3 and deployed URL were
not supplied in this turn, so actual remote playback was not verified. The exact
filename mismatch was fixed; if playback still fails after deployment, check the
audio file itself and that the correct site has both files.
