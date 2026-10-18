# Perlingo

A browser app for learning Spanish, French, and German in parallel.

Run `npm run dev`, then open http://127.0.0.1:5173. No install or API key required.
Run `npm test` and `npm run check` for validation.

The home screen opens on one concept. Use Settings to choose languages; persistent concept counts are tucked under the collapsed Session structure section. Study translations side by side, then type each translation from an English prompt in shuffled language/concept order. A single perfect round completes the session. A missed answer or “I don’t know” displays the expected form and requires another full round after the current one.

Typed recall compares against the exact form taught, ignoring capitalization, whitespace, sentence punctuation, and curly versus straight apostrophes. Articles, accents, and spelling still matter; accented-letter buttons are provided. This is a deterministic starter-bank checker, not a general translation evaluator: unlisted valid alternatives are not accepted. Enter checks the answer, then continues after feedback. Blank submissions are not scored. Pronunciation uses browser speech synthesis and available device voices.

The starter bank has 34 concepts with 102 translations. It is finite, manually authored content, not an automatically generated curriculum. Verbs start with infinitives; sentences provide selected conjugated examples. Review selection includes all due concepts before adding unseen concepts to fill the requested counts. There is not yet a configurable new/review percentage.

Progress and settings are saved to localStorage on the current browser and origin, without cross-device sync. Export progress downloads JSON. The simple review scheduler tracks each concept/language pair, doubles intervals on a correct first answer, and resets to one day on an incorrect first answer. Each pair is scheduled at most once per session, and future-due pairs included for comparison do not advance. Since learning precedes recall, the session accuracy is not a delayed-retention measurement.

Source: `src/content.js` (curriculum), `src/engine.js` (selection and review), `src/app.js` (interface), `src/style.css` (design). `dist` holds the static publication copy. No server-side application data is stored.
