# Frequency-informed verb examples — local pilot

Current app behavior is now described in [Interactive verb-row examples](lemma-row-examples.md). The balanced/frequency modes below are retained comparison history, not the current main-app behavior.


Status: implemented locally for review, not committed or published. Expanded October 28, 2026 from the reviewed 25-verb pilot to all 369 verbs. This changes optional tense examples, not assessment questions; it is not an automatic frequency optimizer.

## Try it

- [Side-by-side comparison](http://localhost:5173/lemmas/example-pilot.html): all 369 verbs, paginated in groups of 25, a verb filter, tense selection, optional evidence and links to full cards. Starting examples compare the balanced present with the pilot’s selected starting tense; mirar starts with its command. Selecting a particular tense compares that same tense on both sides.
- [Frequency-informed app](http://localhost:5173/lemmas/?examples=frequency): study and lookup cards use the pilot examples for all 369 verbs. Mirar starts on Commands; all other pilot verbs start on Present.
- [Balanced app](http://localhost:5173/lemmas/?examples=balanced): the complete stable subject-balanced version remains available unchanged. This is also the default with no query parameter.

The mode is URL-scoped, not a saved preference. Standalone notes retain it when choosing another word and returning to cards. Search and word-help fallback links also preserve an explicit mode when opened in another tab. The comparison page does not write study progress. Ordinary study/test interactions in either app URL continue using the same existing progress store. The 1,500 assessment sentences, accepted answers, scores and frozen conjugation tables are unchanged; examples do not replace assessment content.

## Evidence and limits

The pilot uses the researchers’ [TUBELEX Spanish default frequency list](https://github.com/naist-nlp/tubelex/blob/main/frequencies/tubelex-es.tsv.xz), retrieved October 27, 2026, from a YouTube-subtitle corpus. It contains 170,983,317 tokens across 106,625 videos and 38,943 channels. The [COLING 2025 paper](https://aclanthology.org/2025.coling-main.641/) evaluates these frequencies as a proxy for spoken vocabulary exposure. This is not a representative sample of spontaneous conversation, and it is not geographically balanced learner guidance.

The raw file hash, source URL, corpus totals, all selected counts, per-verb decisions and six present-form candidates are retained in `data/spanish-lemmas/tense-examples/frequency-pilot.json`. `frequency-observations.tsv` contains the observed rows used for the analysis. These are lowercased spelling counts: no grammatical sense, person or mood disambiguation is claimed. Channel counts provide a second view of how widely a spelling appears; they are not normalized frequencies. Missing counts would be unavailable, not zero. The public preview includes the original BSD-3-Clause license at `/lemmas/tubelex-LICENSE.txt`; attribution and license are also retained with the authoring data.

SUBTLEX-ESP’s old authors page and ZIP returned HTTP 404. They were investigated but were not used as count evidence. TUBELEX was retrieved successfully from the research authors’ repository. No corpus sentences were copied: the examples are original course-authored material using the existing reviewed conjugation tables.

## Decisions

The original 25 verbs were ser, estar, tener, ir, haber, hacer, poder, decir, dar, ver, saber, querer, pasar, llegar, dejar, llevar, seguir, encontrar, poner, quedar, hablar, parecer, pensar, creer and mirar.

The present spellings vamos, sé, quiero and creo support first-person/shared-action examples. Pasa, queda and parece motivate everyday event, availability and appearance examples. These construction choices are editorial: the data cannot establish that a particular sense is the most frequent one. Examples retain a stable subject across seven non-command tenses where natural; those other tenses are not separately frequency-ranked. Tener, poder, encontrar and poner deliberately use well-attested forms below the raw maximum to retain useful personal requests/actions and variety. There is no claim of a calibrated sampling probability or optimal teaching mix.

Hay has 452,965 occurrences, versus 144,633 for he. Hay remains the existential example in both versions; this comparison does not merge existential haber with the auxiliary he + participle. Mira has 69,788 occurrences, but that total combines uses. Featuring “Mira el mapa” as a starting command is an editorial choice, not a measured imperative share. Other ambiguities are recorded per verb, including sé/ser, creo/crear, habla/noun, ve/ir, and present/preterite encontramos. Where both versions already select the same useful example (e.g. haber and llegar), the comparison shows that honestly.

Command text and translations remain the reviewed existing examples; they can use another sense of a verb, as in pasar through a park versus something happening. Person does not mechanically carry into commands. Full notes retain other original course contexts, so a pilot’s starting example is not an exhaustive sense inventory.

## Expansion to all 369 verbs

The original 25 decisions are preserved in `pilot-25.json`. For the other 344 verbs, `frequency-selection-review.json` records exclusions and editorial exceptions. Eligible present spellings are ranked by token count, then channel count, excluding vosotros from selection. The balanced person is retained when it has at least 65% of the leading eligible spelling’s occurrences and 55% of its channel coverage. These thresholds retain some variety; they are editorial choices, not validated learning weights.

Known homographs such as como (comer), para (parar), uno (unir), caso (casar), and creo (crear) are excluded from automatic ranking. Their counts remain visible and labeled in the comparison. This conservative screen is not exhaustive grammatical tagging. The original 25 choices retain their individual ambiguity disclosures. Twenty fixed-subject constructions retain their number; haber remains existential, and soler uses explicitly authored third-person examples while retaining its tense restrictions. Commands retain their existing text and translations. The selected subject carries through other available non-command tenses, whose frequencies have not been measured separately.

Most added verbs retain their existing sentence frame and sense. For example, importar still illustrates importing coffee, rather than claiming its raw count proves that sense more common than mattering. Sense limitations and regional usage are recorded in the review file and per-verb explanations. This expansion selects frequency-informed forms; it does not claim a comprehensive ranking of conversational senses or phrases.

## Implementation and checks

`build-lemma-tense-examples.mjs` exports a shared offline builder. It still writes the balanced bank to `lemmas/tense-examples-data.js`. `build-lemma-frequency-pilot.mjs` applies the explicit pilot decisions and writes all 369 groups plus evidence to `lemmas/frequency-pilot-data.js`. `example-variants.js` selects the requested version, with balanced fallback for any future verb without frequency data. The shared tense picker, full notes and study/lookup cards use the same resolver. No new UI controls are inserted into the main study flow; comparison controls live on the dedicated pilot page.

Reproduce expanded decisions with `python3 scripts/expand-lemma-frequency-evidence.py /path/to/tubelex-es.tsv.xz`, then reproduce the counts from the downloaded original using `python3 scripts/extract-lemma-frequency-evidence.py /path/to/tubelex-es.tsv.xz`; the extractor requires the recorded SHA-256. Rebuild examples with `node scripts/build-lemma-tense-examples.mjs` and `node scripts/build-lemma-frequency-pilot.mjs`. Builds and tests require no network access.

Tests cover full 369-verb scope, preservation of the original 25 decisions, homograph exclusions, exceptional verbs, selected conjugations, complete word glosses, evidence/excerpt agreement, ambiguity disclosures, deterministic rebuilding, preserved balanced data and unchanged assessment/source hashes. Browser checks confirm the comparison, the mirar command starting view, and access to the full card with the pilot mode.

Validation: all 360 tests, syntax/content checks and whitespace checks pass. The balanced generated bank matches the saved pre-expansion snapshot byte-for-byte. The original 25-verb browser review covered comparison and full-card modes. Browser verification succeeded on retry: pagination advanced from 1–25 to 26–50, filtering showed comer with como explicitly excluded in its evidence, and soler switched correctly between its present examples and future usage notices. The side-by-side layout was visually inspected. These checks are scoped content and implementation validation, not independent linguistic certification.

## Full-change audit — October 28, 2026

`expansion-audit.json` records full-bank counts and hashes, the command comparison commit and scoped browser checks. Each bank contains 3,252 examples plus 69 notices (369 × 9 records). All 1,476 command/negative records across both banks retain the committed text, translation and notices. Both modes retain identical conjugation rows; selected anchors match the displayed example target. Regression checks independently recompute eligible rankings and variety thresholds. Re-extraction from the hash-verified source reproduces the retained evidence exactly.

The audit fixed fallback navigation that dropped the selected mode in search and word-help links. The context evidence ledger was regenerated for the changed link-helper hash; assessment content itself is unchanged. Browser checks traversed all 15 comparison pages with 369 unique verbs and a disabled final Next button, and exercised command-first mirar plus completed-past switching in the actual lookup card.

A material teaching limitation remains: frequency-mode present slots are I 26, tú 1, third-person singular 290, we 24, third-person plural 27, plus impersonal haber. Third-person spellings may also be commands, and counts do not distinguish senses. This distribution is not a measured conversational person distribution. Balanced remains the default; broader use should be judged against that comparison before changing the default. The audit checks grammatical templates, sourced forms and implementation exhaustively where machine-checkable; it does not claim independent linguistic review of every sentence.

Final validation: 360/360 tests pass, along with content, syntax and whitespace checks. The documented external-audio static release builds successfully (202 files, 30.1 MiB); the default build including the complete local audio archive exceeds the asset-count cap. No publication was performed. Standalone notes also retain frequency mode when selecting another word and returning to Cards.
