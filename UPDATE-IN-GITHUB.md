# Apply the art and settings update

Use a `testing` branch first, then merge into `main` when you like the preview. One Vercel project can deploy both branches: `main` is Production, other branches are Preview. GitHub sends changes to Vercel; Vercel does not upload your edits back into GitHub.

The small Art-and-Settings Update ZIP contains only the website files changed in this update. Upload its `public` folder contents at the same paths in your existing repository. Keep the folder structure. It does not include or overwrite your personalized `public/content` text or your server secrets. The full Vercel ZIP also contains the updated artwork for future installs.

## Hide or show the controls

Open `public/settings.js` in GitHub and edit:

```js
window.CARNIVAL_CONFIG = {
  mode: 'code',
  saveTools: false,
  testingTools: false
};
```

- `saveTools: false` hides Download save backup, Restore a backup, and Reload account save.
- `testingTools: false` hides Reset progress and Unlock everything.
- Change a flag to `true` to show those controls again, then commit and wait for deployment.
- Automatic saving and the quiet save-status message remain active when the buttons are hidden.
- Sign out remains available at the bottom; it does not delete progress.

Keep an occasional backup yourself. Cloud saving is convenient, but an extra copy helps if a save is reset by mistake. If syncing reports a conflict, you can temporarily enable `saveTools` and use Reload account save after saving a recovery backup. The testing controls are convenience buttons, not an admin security boundary.

## Where to change words

| Text | File |
| --- | --- |
| Main headings, personal message, game descriptions, outfit and item names, most labels | `public/content/site-text.json` |
| Weekly memories and emojis | `public/content/weekly-notes.json` |
| Remaining card/blind-box dialog sentences and testing dialog text | `public/assets/js/carnival.js` |
| Remaining maze messages, tutorial dialog and action labels | `public/assets/js/manor-game.js` and `public/escape.html` |
| Remaining peanut status and sound labels | `public/assets/js/peanut-factory.js` and `public/peanut.html` |
| Login wording | `public/assets/js/code-login.js` |
| Save/sync status wording | `public/assets/js/save-manager.js` |
| Remaining scrapbook status/date labels | `public/assets/js/scrapbook.js` |

Change ordinary wording in the JSON first. Keep keys, braces, commas, and {{placeholders}}. In advanced JavaScript edits change only the displayed strings, preserving IDs and logic. The layout wraps ordinary text changes, but check very long wording in the phone preview.

## Data and deployment

Changing images, headings, and these display flags does not reset database saves. This update preserves collectible/outfit IDs and save format. It requires no new SQL and no environment-variable changes.

The testing code opens a separate save; the testing branch opens a separate version of the website. Preview and Production can still use the same Supabase project, so do not run schema-changing experiments on the shared database without planning them separately.
