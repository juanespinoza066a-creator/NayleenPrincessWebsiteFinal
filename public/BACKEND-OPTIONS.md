# Choose how her progress is saved

## GitHub Pages ZIP

Works without login. Progress belongs to that browser at that website address. Backup and restore transfer it between devices. It does not sync with your ChatGPT profile or automatically with another browser.

## Current hosted ChatGPT Site

Uses ChatGPT sign-in and saves each visitor’s own account progress. Its existing visit permissions still apply. Reset/unlock testing controls affect the signed-in account save when connected, plus its browser cache. A deployment or text update does not reset that save.

## Separate Vercel + Code Login ZIP

Prepared with a code-entry screen, server-only code check, session cookies, cloud load/save, and a Supabase SQL setup file. Follow its root `START-HERE-VERCEL.md`. This edition runs one shared Nayleen profile: the same code on different devices opens the same save. Anyone knowing the code can change that progress. You choose the code in Vercel’s server environment variables; no code or database secret is embedded in the browser scripts.

You still need to create your Vercel and Supabase projects, run the included SQL, and set the three server variables. No external accounts or live database were configured for you. Backend handlers were checked against a simulated database; finish with a real two-device test after setup.

To remove reset/unlock tools before gifting, set `testingTools: false` in `settings.js` (or `public/settings.js` in the Vercel edition) and publish again. Notes remain JSON-edited and read-only on her end. The published JSON/assets are public files; the code protects the save service, not confidential notes. Game rules use saved weekly history and the device clock, so this is not a tamper-proof multiplayer backend.

Vercel hosts the website/backend. Supabase stores the save/session data. GitHub stores the source files you edit. Your previous Vercel hosting did not by itself imply a database or login.
