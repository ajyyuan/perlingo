# Multiple-choice answer review — 6 November 2026

Published in Sites version 45 on 6 November 2026. The preceding typed/context acceptance patch was committed as `27c492567d`; the separate MCQ change is committed as `f197a017ae`. Both are included in this release.

## Problem and behavior

Set tests show a Spanish headword and its part of speech, then ask for its English meaning. Previously, `optionsFor` drew arbitrary definitions from the current set, then the whole deck, excluding only identical strings. It could put two valid translations together and grade one as wrong: fin with two versions of “end,” terminar with two versions of “to finish; to end,” and agregar with “to add” alongside “to add; to aggregate.”

All 1,500 cards now have an explicit correct meaning and three reviewed distractors. The four positions still shuffle, but the distractor identities remain fixed on later attempts. This trades unrestricted variation for a finite, inspectable question bank. The three wrong choices normally come from the same 50-word set; safety takes precedence over matching the set or part of speech. No runtime semantic inference or arbitrary fallback is used.

An unanswered resumed question keeps its existing order if its four options match the reviewed set. Otherwise, only its options refresh. Checked feedback, recorded scores, pass number, repair queue and completed stages remain historical. This does not retroactively credit or erase earlier misses. Changes take effect after reloading the app.

## Authored data and maintenance

`data/spanish-lemmas/choice-review.json` records the exact target ID, spelling, rank, correct meaning, and the IDs/spellings/full meanings of its three distractors. `scripts/build-lemma-choices.mjs` validates all 1,500 rows against the same hydrated note library used by the app and generates `lemmas/choice-data.js`. It rejects missing rows, changed definitions, unknown IDs, duplicate options and self-distractors. Editing a meaning requires re-reviewing every affected question, including uses as a distractor.

Run `node scripts/build-lemma-choices.mjs` after an authored review update, or add `--check` to verify generated output without writing it. The automated suite runs the deterministic check. The runtime rejects an unknown or stale target instead of inventing unreviewed choices. `assessment.js` supplies both shuffled options and resumed-option validation; `app.js` uses that validation before rendering a choice question.

## Linguistic review

Initial proposals used existing course meanings, frozen dictionary glosses, typed alternatives and comparison-group membership to avoid obvious overlap. That screen is not semantic proof: different English words can name the same sense, and headwords have additional meanings. Codex read all 1,500 full question rows and replaced questionable distractors conservatively. These replacements include potential ambiguity, not just proven translation errors; avoiding a distractor does not declare the underlying definition wrong.

Examples grounded in primary dictionary entries include [observar](https://dle.rae.es/observar), which can mean obeying/complying with rules; [droga](https://dle.rae.es/droga), which includes medicinal drugs; and [estimar](https://dle.rae.es/estimar), which includes evaluating value. Their overlapping definitions are not wrong options for those headwords. The original fin/final, terminar/acabar and agregar/añadir collisions are also excluded in both directions.

The recognition/learning definition of [alimento](https://dle.rae.es/alimento) is corrected to **food; nourishment**. The earlier “solid substance” restriction was false: the DLE nutrition senses are not restricted to solids and include an example about milk. Its existing typed prompt, accepted Spanish answers, example sentences and audio are unchanged. The authored correction and source reason live in `later-day-recall-review.json`, with regenerated `later-teaching-data.js`; the comparison already describes nourishment correctly.

Claude reported reading all 1,500 initial proposal rows and then rechecked all 64 revised rows in the authorized [audit conversation](https://claude.ai/chat/48fcb02c-8f55-434e-a287-42efeb1e083e). Seven of its eight confirmed collisions were already excluded in the independent Codex pass; the remaining distinto/claro pairing was verified against [DLE distinto](https://dle.rae.es/distinto) and removed. All reported weaker overlaps were also excluded conservatively. In total, 60 rows received 61 distractor replacements; four other rows received the alimento wording correction. Claude found no new conflicting option in the revised rows and no remaining MCQ ambiguity to report. Of the final 4,500 distractors, 4,496 are from the same 50-word set and four are cross-set.

The [dated evidence record](../data/spanish-lemmas/choice-audit-2026-11-06.json) records every replacement, source and file hashes, dispositions, coverage, and Claude’s final response. Sanitario = sanitary remains a valid narrower adjective sense, supported by [DLE sanitario](https://dle.rae.es/sanitario); the coger usage warning is retained. Remote compound/contextual parallels (equipo/system, simple/normal, pretender/state) were judged not to create competing standalone answers. This is source-informed editorial review, not native-speaker certification or an assertion about every conceivable figurative use.

## Local preview

Open [MCQ review](http://127.0.0.1:5173/tests/browser/choice-answers.html). The isolated page reads the actual runtime bank and grader and does not read or write saved progress.

1. Select **256 · fin**, **264 · terminar**, and **509 · agregar**. Each has one matching meaning; choose it to check scoring.
2. Select **650 · alimento** and verify **food; nourishment**.
3. Click **Check old-question refresh**. The simulated old fin question loses its duplicate “end” option while retaining Pass 3 and its first score.
4. In the normal app, reload `/lemmas/` and resume a set test. Four choices, A–D/1–4 controls, feedback and passing rules retain their existing UI.

The preview checks all 1,500 questions and all 6,000 option scores. Automated tests additionally cover all 24 orderings for every question, invalid/legacy option refresh, historical feedback preservation, deterministic generation, and regression exclusions. Mechanical checks establish implementation consistency; they do not independently prove Spanish semantics.

Final validation: **470/470 tests passed**, as did `npm run check`, both generated-data checks and the changed runtime/preview syntax checks. The Codex browser confirmed all 1,500 question sets and 6,000 answer scores; manual interactions verified terminar/agregar credit, alimento correction and wrong-answer feedback, and the fin legacy refresh preserving Pass 3 and the recorded first score. No complete set test was manually finished. The user approved commit, push and publication after these checks. Publication succeeded as recorded below; no new audio generation was needed.

Publication completed November 6, 2026: Sites version **45**, deployment `appgdep_6aee646c6c288191a9b7d7fcef2fc503`, succeeded. GitHub application source `f197a017ae36a1427a537b0defe92f388dc6cd5f` maps to Sites source `ca89443eae07044240726194e0e0015972924cfb`. This publishes the approved recall/context corrections (`27c492567d`) and the reviewed 1,500-question MCQ bank, including the alimento definition correction and safe refresh of unanswered saved choices. All 470 tests, content checks, deterministic generation checks and the hosted production build passed; packaged curriculum/runtime assets match source. Public access, perlingo.app, existing audio hosting and runtime environment revision 2 were retained. No new audio was generated. This supersedes the pending/local-only publication status of these November 6 changes.
