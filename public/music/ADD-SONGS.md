# Add songs for DJ Espurr

1. Put MP3 files in `public/music/tracks/`. Use simple filenames such as `our-song.mp3`.
2. Edit `public/music/library.json`. Add a unique id, title, artist and relative file for each song:

```json
{"id":"our-song","title":"Our song","artist":"My favorite artist","file":"tracks/our-song.mp3"}
```

Keep the entries inside `tracks`, separated by commas. Remove the comma after the last entry. Do not put a literal line break inside quoted text.

3. Optional: add a playlist in the same file:

```json
{"id":"our-playlist","name":"Our little playlist","trackIds":["our-song","espurr-welcome"]}
```

4. Upload to testing, wait for Vercel, then open Widgets → Music → Refresh songs in the app. Songs follow the phone’s Main/Testing selection. After you merge to main, refresh there too. No new APK is needed for song additions.

Playlists can also be created on the phone with New playlist. Those personal playlists stay on that phone and profile. The library playlists come from this file. Song IDs should stay the same when you rename a title.

Tracks are ordinary website files. Streaming needs internet; the included original welcome mix is also bundled in the APK for an offline first test. Personal MP3s are not automatically downloaded for offline playback. Upload audio you have permission to include.

The Music widget offers play/pause, previous/next and 10-second backward/forward controls. Open Music for the draggable song-position bar and playlist editing. Android’s media controls also support seeking with the screen locked.
