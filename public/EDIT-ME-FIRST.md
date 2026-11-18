# Edit your words here

You can change the wording without touching the page layout or game code.

| What you want to change | File |
| --- | --- |
| Main heading, love note, game titles, outfit names, collectible names, buttons | `content/site-text.json` |
| Weekly memories and each week’s cute emoji | `content/weekly-notes.json` |
| Outfit portraits | `assets/images/outfits/` |
| Collectible illustrations | `assets/images/collectibles/` |
| Layout and colours, if you eventually want to change them | `assets/css/` |
| Game rules and save code, if you eventually want to change them | `assets/js/` |

## Change a title or message

Open `content/site-text.json` in GitHub, click the pencil, and change only the words between quotation marks. Keep the keys, punctuation, and `{{placeholders}}` intact.

For example, change `home.subtitle` from `All for Nayleen.` to `For my favorite princess.` You can also rename each collectible under `collection.names` or each outfit under `outfits`.

Words are inserted as plain text. Long headings and paragraphs wrap and their sections grow. Adding HTML won’t alter the layout; it will display as text. Use `\n` inside a string for a line break. If you need a quote inside a message, write `\"`. Avoid deleting commas or braces. A valid but incomplete text file falls back to default wording for missing keys.

## Add this week’s memory

All 52 weeks are already in `content/weekly-notes.json`. Find the week you want and fill in its three editable strings. Set `published` to `true` when it is ready.

```json
{
  "week": 1,
  "emoji": "🌷",
  "title": "A title only we understand",
  "message": "Write your memory here.\n\nYou can add another paragraph like this.",
  "published": true
}
```

Leave the other weeks in place so earlier memories stay available. Set `published` to `false` to hide an entry from her scrapbook. On GitHub Pages this file itself is public, so do not keep private drafts in it—write drafts somewhere private and paste them in when ready. There is no writing page, edit link, or note form on her website. Even the old `?edit=1` URL opens the read-only scrapbook.

Commit your file change in GitHub. After Pages finishes publishing, she can refresh and read it. Updating words and notes at the same website address does not reset game progress.

## Images and outfits

My little princess is the original portrait. Sunday, peanut PJs, and Espeon each have a complete painted costume portrait, replacing the whole image rather than adding a clothing layer.

Akali now has a complete painted costume portrait too, at `assets/images/outfits/akali.webp`. Each of the four games earns one distinct outfit: cards → Sunday at best score 200; Peanut Factory → PJs at 50 lifetime crunches; first weekly blind box → Espeon; first maze escape → Akali. The normal little princess outfit is available from the start. The bonus K/DA Akali outfit unlocks at 10 card wins and has its own complete portrait at `assets/images/outfits/kda.webp`.

The inventory uses editable stylized SVG illustrations. Pocket Espurr and the crunchy companion use their original images. You can replace any collectible image while keeping its filename. Name changes belong in the JSON file, not inside the layout.

## Keep these things stable

Do not rename item IDs, outfit IDs, or file paths just to change visible names. Saves refer to those IDs. Use the wording fields above instead. Keep a downloaded save backup before moving the website to a different address.

## Temporary testing buttons

Set `testingTools: false` in root `settings.js` before gifting. While true, the main page offers reset and unlock-all dialogs. Reset clears this browser/profile’s progress, including weekly limits, and syncs the reset when a backend is connected. Unlock-all marks the four outfit goals complete and adds all collectibles; it does not consume the weekly games. These are testing conveniences, not secure admin controls.
