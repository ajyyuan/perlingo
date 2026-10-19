# Perlingo

A browser app for learning Spanish, French, and German in parallel.

Run `npm run dev`, then open http://127.0.0.1:5173. No install or API key required.
Run `npm test` and `npm run check` for validation.

The home screen opens on one concept. Use Settings to choose languages; persistent concept counts are tucked under the collapsed Session structure section. Study translations side by side, then type each translation from an English prompt in shuffled language/concept order. A single perfect round completes the session. A missed answer or “I don’t know” displays the expected form and requires another full round after the current one.

Typed recall compares against the taught form and any explicitly authored accepted alternatives, ignoring capitalization, whitespace, sentence punctuation, and curly versus straight apostrophes. Articles, accents, and spelling still matter; accented-letter buttons are provided. This is a deterministic starter-bank checker, not a general translation evaluator: unlisted valid alternatives are not accepted. The course preview includes a limited set of explicit alternatives; the starter bank still has one taught answer. Enter checks the answer, then continues after feedback. Blank submissions are not scored. Pronunciation uses browser speech synthesis and available device voices.

The starter bank has 34 concepts with 102 translations. It is finite, manually authored content, not an automatically generated curriculum. Verbs start with infinitives; sentences provide selected conjugated examples. Review selection includes all due concepts before adding unseen concepts to fill the requested counts. There is not yet a configurable new/review percentage.

Progress and settings are saved to localStorage on the current browser and origin, without cross-device sync. Export progress downloads JSON. The simple review scheduler tracks each concept/language pair, doubles intervals on a correct first answer, and resets to one day on an incorrect first answer. Each pair is scheduled at most once per session, and future-due pairs included for comparison do not advance. Since learning precedes recall, the session accuracy is not a delayed-retention measurement.

Source: `src/content.js` (curriculum), `src/engine.js` (selection and review), `src/app.js` (interface), `src/style.css` (design). `dist` holds the static publication copy. No server-side application data is stored.

Interaction design: [Learning chunks and contextual explanations](docs/learning-chunks.md) defines translation grouping, contextual glosses, popover behavior, and future extensions.

During learning, click a grammatical learning chunk to pronounce it and open a contextual popover. Articles stay with nouns, multiword verb constructions stay together, and fixed expressions remain intact. More opens a details sidebar with sentence context and selectable individual words; the lesson does not move. The structured packs include word roles, base forms, gender, singular/plural forms, and conjugation tables with supplied tense selection and the selected person highlighted; legacy entries explicitly identify missing word-level data. Speaker buttons play the full translation. Escape, outside click, or the close button dismiss the popover. This help is not available during recall.

Development workflow: follow [AGENTS.md](AGENTS.md). Keep documentation synchronized with each meaningful change, provide local checks and testing steps, and wait for explicit approval before committing. Publishing or pushing requires a separate request. Local source and the published `dist/` copy can differ; these learning-chunk changes are local until explicitly published.

Content foundation: [C1 data model and review workflow](docs/content-model.md). Three existing concepts now come from `src/content/reading-pilot.js`; the remaining 31 use the legacy bank. The pilot records meanings, word forms, grammar links, sources, and **draft** review status. No independent linguistic approval is claimed. Inspect the [local content review page](http://127.0.0.1:5173/content-review.html). `npm run check` includes structural content validation; release validation intentionally rejects this draft pilot.

Next steps and status: [C1–C5 roadmap](docs/roadmap.md).

C3 draft expansion: [50 new concepts](http://127.0.0.1:5173/?pack=foundation), with [a separate review page](http://127.0.0.1:5173/content-review.html?pack=foundation) and isolated preview progress. All 114 lexical records now have source comparisons and scoped references; sentence/prose checks and independent review remain pending. They are not approved additions to the regular bank. See the [scope, confidence limits, and expansion plan](docs/content-expansion.md). “Available forms” has been replaced with present-tense conjugation tables and singular/plural noun tables.

Grammar exercises have [structured topic metadata](docs/grammar-topics.md) and a muted topic label above the prompt in learning and recall. The four main categories remain unchanged. Topic filters and broader curriculum progression are future work.

Curriculum planning: [proposed 16-unit core and extension](docs/curriculum.md), including language-specific targets, vocabulary budgets, exercise requirements, and current coverage gaps. Continuous local authoring is authorized. The course preview now has unit selection and coverage reporting; all 16 units now have authored inventories and examples; prerequisite-aware progression and mastery checkpoints remain future work.

Content maintenance: the user has accepted the source-comparison method for continued curriculum authoring without batch approval pauses. [Reports and corrections](docs/content-maintenance.md) preserve content snapshots. Use **Report an issue** in the **More** sidebar, or after checking a recall answer. The compact translation dropdown has no report action. Reports save locally; export and share the JSON with the maintainer to request a correction. Settings → Content reports exports all saved reports. There is no automatic submission or remote inbox.

Course authoring preview: [practice](http://127.0.0.1:5173/?pack=course), [content review](http://127.0.0.1:5173/content-review.html?pack=course-u16), and [exact scope, counts, evidence and testing steps](docs/course-authoring.md). All 16 units are drafted: **1,755 Spanish / 1,743 French / 1,730 German unique lexical items**, plus **397 contextual examples per language** (384 new, 13 retained). Course offers learn-first production, two-choice meaning contrasts, and transfer recall without a learning pass. More includes additional sourced forms where available. These are draft teaching records, not independently verified or frequency-ranked vocabulary. `node scripts/check-course.mjs --complete` still fails on incomplete source coverage; strict release approval remains pending. No content is pushed or published by local previewing.
