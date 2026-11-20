# Palace 5.0 artwork

The new rainy-weather Espurr was made with the built-in image-generation tool, using the existing `public/assets/images/espurr-princess.webp` as the character/style reference and requesting a transparent background.

Final prompt:

> A cute lavender Espurr Pokémon mascot wearing a pastel yellow raincoat and holding a purple umbrella. Soft storybook game illustration, large purple eyes, small paws, full body, centered on a transparent background. Match the supplied character reference. No text.

Project asset: `public/assets/images/weather/rain.webp`; native copy: `NayleenAndroid/app/src/main/assets/weather/rain.webp`. Transparency is retained. The generated source is converted to WebP for the app/site packages.

Sunny-day hat, cold-weather scarf, gentle posing, weather particles, room ornaments and hunter portraits are drawn by the app/game code. Existing outfit, collectible and room art is retained. Hunter portraits and canvas actors use the same simple vector vocabulary; they are adaptations for this little maze, not official game renders.

Game references checked:

- [Suika Game — Aladdin X](https://suikagame.jp/)
- [Official Suika Game listing](https://apps.apple.com/us/app/suika-game-aladdin-x/id6469114836)
- [Identity V official hunter roster](https://www.identityvgame.com/character/)
- [Official Naiad announcement](https://www.identityvgame.com/en/news/announcement/20210628/35288_956484.html)

Princess Drop uses locally bundled [Matter.js 0.20.0](https://brm.io/matter-js/). Its MIT license is included at `public/assets/vendor/MATTER-LICENSE.txt`. It uses Palace collectible artwork rather than copying Suika artwork or code.
