# Perlingo

A browser app for learning Spanish, French, and German in parallel.

Run `npm run dev`, then open http://127.0.0.1:5173. No install or API key required.
Run `npm test` and `npm run check` for validation.

Choose languages and concept counts, study translations side by side, and answer shuffled multiple-choice questions until you achieve three consecutive perfect rounds. One error invalidates that round. Pronunciation uses browser speech synthesis and available device voices. Focus mode narrows the layout for recordings.

The starter bank has 34 concepts with 102 translations. It is finite, manually authored content, not an automatically generated curriculum. Verbs start with infinitives; sentences provide selected conjugated examples. Review selection includes all due concepts before adding unseen concepts to fill the requested counts. There is not yet a configurable new/review percentage.

Progress and settings are saved to localStorage on the current browser and origin, without cross-device sync. Export progress downloads JSON. The simple review scheduler tracks each concept/language pair, doubles intervals on a correct first answer, and resets to one day on an incorrect first answer. Each pair is scheduled at most once per session, and future-due pairs included for comparison do not advance. Since learning precedes recall, the session accuracy is not a delayed-retention measurement.

Source: `src/content.js` (curriculum), `src/engine.js` (selection and review), `src/app.js` (interface), `src/style.css` (design). `dist` holds the static publication copy. No server-side application data is stored.
