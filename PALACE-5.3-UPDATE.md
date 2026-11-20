# Palace 5.3 — A working hunt, a trickier basket and little room details

## Install

1. Extract **Nayleen-Palace-5.3-Web-Update.zip**. Upload its extracted folders and files to the ROOT of your GitHub **testing** branch, keeping their paths. This small patch is against **5.2**. Install 5.2 first if you have not already done so. Do not upload the ZIP itself or nest public inside public.
2. Wait for Vercel Preview to be Ready, then open your existing testing URL with **123**. No SQL or environment changes are needed.
3. Install **Nayleen-Carnival-Android.apk**, version **5.3 / code 14**, OVER your existing app. **Do not uninstall.** The app is still Nayleen’s Palace; the package and signing certificate are unchanged.
4. Visit **Room once** to refresh the widget. Check the widget at small and large sizes. The owner-only Main/Testing switch is preserved.
5. After testing, merge testing into main and switch back to Main. Use 123 for tests. If both branches share the same backend, 956 accesses her real save on both branches.

The patch excludes personal weekly notes, special dates, site wording and Espurr’s sayings. Existing progress and consumed weekly turns are kept. The full website ZIP is a complete reference copy; prefer the small patch for your repository so newer personal writing stays intact.

## Room, controls and widget

- The room’s collectible picker returns to light cards with dark, readable names. The dark-purple action style no longer overrides those cards.
- Princess Drop’s entry icon uses a contained basket with all three little friends inside it.
- Game action rows wrap with visible gaps. Roulette’s submit area, filters and exchange-review buttons are separated; the other game controls have spacing too.
- The widget has a separate native ornament layer behind the room. Hearts, flowers, cards, stars and other room-themed symbols fill the surrounding space even when the room picture is narrower than the widget. More symbols are added as the widget grows.
- The widget image size is reduced uniformly to its pixel budget, keeping its aspect ratio. Portrait and landscape size bounds are selected separately. The whole room stays visible.
- Espurr stays centered and still in the website/in-app Palace Room. Her room movement and emotes remain in the native widget.
- Weather, notes, calendar, personal dates and notifications are preserved. The working weather classes are unchanged.

## IDV Hunt: mechanics review and fixes

The hunter drawings are retained. Their warning areas now show a clear countdown and active state, with the collision area matching what is drawn.

| Hunter | What the warning does |
| --- | --- |
| Ann | After the circle fills, the cat spell briefly freezes Espurr’s movement and interrupts her action. |
| Antonio | After the music circle fills, standing anywhere inside it takes one heart, drains sprint energy and briefly slows Espurr. |
| Joseph | After the camera frame fills, its flash takes one heart, briefly slows Espurr and reveals her hiding place. |
| Grace | After the water rises, staying inside builds the tide. About 1.8 seconds of exposure takes a heart; the water also slows movement and drains energy. Leaving lets the buildup fall. |

Every area warns for about 1.8 seconds before becoming active. A successful damaging hit grants the usual seven safe seconds, preventing an immediate stack of heart losses. Ann’s spell freezes rather than taking a heart. Each individual hazard applies its main effect once. Grace’s water can keep slowing Espurr until she leaves or gains protection.

### Problems found and corrected

- Antonio previously drew a circle but only checked a narrow horizontal strip. His visible area and actual effect now agree, and a hit clearly removes a heart.
- Grace’s old energy drain was nearly canceled by normal energy regeneration. The water now drains energy while Espurr is wet, with visible tide buildup and a meaningful consequence for staying.
- Ann’s spell now truly freezes movement instead of only slightly slowing it. Damage and control effects interrupt actions consistently.
- Smoke Ribbon, Midnight Veil, Warm Encore and Case Closed clear the hunter’s remembered trail when they conceal Espurr. Existing spells can still affect a concealed Espurr; concealment is not a shield.
- Bubble Curtain clears hazards and frees frozen, tangled or wet steps, in addition to its shield.
- Painted Tide freezes a nearby hunter and boosts decoding. It can still give the decoding boost when the hunter is too far away to freeze.
- Lucky Pull can actually finish its nearest cipher. Case Closed can finish its current treasure/pallet/gate action immediately or boost an unjammed cipher. Finishing a cipher through either power restores a charge and opens the gate when all three are complete.
- Hunter routing now updates when its destination changes, including noise distractions. The ribbon decoy remains a reachable target with a visible lure.
- Cipher jams, power durations, protection, hunter stun, warnings, water buildup, lure state and chase memory now survive a normal match save/reopen. Reopening no longer clears a three-second cipher jam or active warning. Old checkpoints without these fields still load.
- Warning rings, status text, tide percentage, movement trails and hit effects make the outcome visible. Help text explains the hazards in ordinary play terms.

Each outfit’s current power is shown before a run and in Help. The twelve maps, weekly hunter rotation, three starting charges, cipher charge restoration and reward-free 123 practice choices remain.

## Princess Drop: difficulty

**Win by reaching 3,000 sparkle points AND making the biggest treasure, Emil’s plushie.** A little merge ladder shows the order. Pieces are larger and drops have a slightly longer cooldown.

The important overflow bug is fixed: the old game restarted the pile’s safety grace every time you dropped another piece. Rapid tapping could therefore keep an overflowing basket alive indefinitely. Pieces now have individual settling time, so a new drop cannot reset an older settled piece’s overflow clock. A pile remaining over the ribbon loses the run even if you keep tapping.

The game remains one adventure per Monday week. An unfinished basket can be resumed; old completed runs remain completed. Existing active baskets keep their score and pieces, but now need the new win conditions. Reset all on 123 is available for fresh tests. The 5.2 sharp canvas rendering is retained.

Roulette is unchanged: two different eligible owned items for one guaranteed prize, once a week, with 85% collectible / 10% room / 5% outfit chances. Duplicates remain possible; starter and currently equipped room/outfit stay protected.

## Validation and phone review

All 14 web test files passed, including:

- Real hunter effects, protection and escaping the warning areas on all 12 hunter/map combinations.
- All 16 outfit powers on each of those maps: 192 combinations, including rejection of out-of-range stuns, visible power events, reachable lures and actual state changes.
- 180 routes through runtime pathfinding/collision checks to ciphers, the gate and patrol points with pallets dropped.
- Missed calibration stopping decoding for three seconds, cipher completion from powers, immediate interactions, melee loss, gate escape and checkpoint recovery of warnings, buffs and jams.
- Eight repeatable same-column rapid-tap Princess Drop runs: seven overflowed and one legitimately reached both win goals. This is a small regression sample, not a general win-rate estimate. Actual Matter.js merge/reward tests and overflow-clock checks passed too.
- Roulette odds, offering removal, save round trips, gallery expansion, collectible-picker content, private notes, weekly resets and existing progression checks.

Android compilation, resource alignment and the existing APK signature passed. Native model checks passed for room fitting, 36 widget size/density pairs, scaling decorations, geometry refresh, notes, calendar, weather, personality and owner-only site switching.

These checks exercise code and models, not a physical Samsung launcher. On your A54, review collectible names, button gaps, the Drop icon, a new basket’s difficulty, visible hunter effects and the ornament layer after resizing the widget. Try a real 123 weekly match as well as practice, close/reopen with an active warning or cipher jam, and confirm it resumes. Do not reset 956 to test.

## Editable files and source

- Private weekly notes: `server/weekly-notes.json`.
- Espurr’s sayings: `server/espurr-lines.json`.
- Special dates: `server/special-dates.json`.
- Personal wording: `public/content/site-text.json`.
- Hunter/power descriptions and maps: `server/hunt-config.js` and matching `public/assets/js/hunt-config.js`.
- Game rules: `server/game-rules.js` and matching `public/assets/js/game-rules.js`.

Keep each server/browser pair identical when editing it. Website checks: Node22+, `npm ci`, `npm test`, `npm run build`. Android source: SDK35 and Java17+, then `./gradlew assembleDebug` or `gradlew.bat assembleDebug` from NayleenAndroid. Future codes must exceed14. Keep the Android source ZIP and signing key private.
