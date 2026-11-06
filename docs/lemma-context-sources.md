# Course-wide lemma contexts

Status: local preview, October 26, 2026. No publication or new commit is implied.

## What is covered

The unchanged 1,500-card deck has exactly one contextual exercise per lemma/POS identity, in six groups of 250. There are **537 distinct authored Spanish sentences**, including the retained first-set examples. A sentence can support several cards, with a different single-word blank for each card. The shared sentence is visible in each relevant card’s notes. Original casa/depender/música examples remain available as additional examples.

Each exercise includes an English translation, explicitly segmented Spanish chunks with English glosses, a target word and exact position, word-level hover meanings, and feedback about the target form. The first 50 exercises retain their original source-compared content. New target grammar links explain the actual displayed form; other chunk links explain the general construction. Surrounding hover meanings are dictionary-style word meanings plus an authored phrase gloss, not a claim that every word translates literally in isolation.

This is **one use/form per card**, not all senses, all conjugations, or unseen-sentence mastery. Several examples use common secondary senses (papel = role, seguro = sure, aplicación = software application). Repeated sentences provide useful scaffolding but can also be memorized. Scoring checks the authored target or an exact matching target-bearing span, not arbitrary Spanish synonyms or all grammatically possible alternatives. No corpus coverage percentage follows from this bank.

## Authoring and evidence

The sentences and translations were authored for this course, not quoted from CORPES or claimed as naturally occurring corpus examples. The existing dictionary-backed lexical notes supplied headword identity, grammatical role and forms. Source comparison used the frozen `dictionary-extract.json` at Doozan revision `b8ed076b4faea26a0985ee46ca736771c2e62dc4`, the prior lexical audits, and the checked form tables. Attribution and reuse terms remain on the deck’s Sources page.

Every new target must be either its headword, an exact form already present in that card’s checked table, or one of seven explicit grammatical exceptions in `form-exceptions.json`. The existing full-note tests separately verify those tables against frozen lemma/POS/form evidence. Membership checks establish that a form belongs to the lemma; they cannot prove agreement, sentence naturalness, the English translation, or the correctness of its contextual sense.

The sentence pass checked the target’s role, noun/adjective agreement, verbal construction, English alignment, and chunk boundaries. It corrected absent/mismatched targets, feminine and plural forms, ambiguous repeated occurrences, shortened determiners, and some awkward or overly loose translations. The underlying deck, rankings and lexical notes were not rewritten. These are editorial/source checks by the authoring assistant, **not an independent native-speaker review or a guarantee of error-free content**.

Targeted comparisons:

- [RAE primero](https://www.rae.es/dpd/primero), [tercero](https://www.rae.es/dpd/tercero), and [ninguno](https://www.rae.es/dpd/ninguno): shortened forms before masculine singular nouns. The exercises use primer tren, tercer libro and ningún nombre.
- [RAE alguno](https://www.rae.es/dpd/alguno), [mucho](https://www.rae.es/dpd/mucho), and [possessives](https://www.rae.es/gtg/posesivo): determiner/possessive forms and agreement. The added forms are algunos pasajeros, mucha gente, nuestra casa and ciertas familias (the latter’s determiner sense is in the frozen cierto entry).
- [RAE tal](https://www.rae.es/dpd/tal): the adverbial tal como construction is distinct from demonstrative tal especie. The two words remain one explanatory chunk.
- [Diccionario del español de México: claro](https://dem.colmex.mx/ver/claro): hablar claro supports the contextual adverb sense “speak clearly.” This supplements the frozen entry’s “certainly/of course” gloss; the deck gloss is unchanged.
- Frozen entries for papel, próximo, seguro, referir, aumentar, sostener, detener, acto, vuelta, echar, suelo, superar, superior, lanzar, operación, aplicación, apuntar, ubicar, estrella, gusto and adoptar were consulted for the secondary senses used here. Examples include echar un vistazo, referirse a, sostener an assertion, and adoptar a method. The contemplate example was narrowed to contemplating a landscape rather than relying on the frozen entry’s disputed administrative sense.
- The noun/adverb and noun/adjective identities remain separate: poco, más, hasta, según, político, tal, público, primero, medio, cuarto and others. The adverb según uses a short question/reply context; it is not silently replaced with prepositional según.

The source-hash manifest records which files produced the bank, not a new claim of linguistic verification. Hover glosses outside the existing dictionary tables are explicit editorial entries in `word-glosses.json`; unresolved words or ambiguous dictionary matches fail the build instead of receiving an invented automatic fallback.

## Format and regeneration

`data/spanish-lemmas/context/day1.txt` through `day5.txt` contain one authored sentence per line:

```text
rank:surface,rank:surface|English translation|n:Noun phrase=gloss / v:verb construction=gloss / p:connecting phrase=gloss
```

Ranks refer to the unchanged course order. Types are `n` noun phrase, `v` verb construction, `p` connecting phrase, `s` reference, `c` connector, `a` description and `r` contextual modifier. These are teaching chunks, not a complete syntactic parse. Keep determiners with nouns and multiword constructions together. Preserve punctuation in the chunk text; the current renderer supplies the final period. Every target must occur exactly once as a complete Spanish word. Its actual capitalization is taken from the sentence.

Run:

```sh
node scripts/build-lemma-context.mjs
node --test tests/lemma-course-context.test.js tests/full-lemma-notes.test.js
npm test
npm run check
```

The builder writes `lemmas/data/context.json` and `data/spanish-lemmas/context/coverage.json`. It does not generate Spanish prose, English translations or chunk boundaries. It compiles authored rows, resolves explicit glosses and existing dictionary entries, and rejects missing targets, wrong-day ranks, duplicate IDs, unsupported forms and missing word meanings.

The course-context tests check exact 6×250 coverage; preservation of the first 50; reconstruction; one non-leaking blank; hover coverage; word, phrase and whole-sentence acceptance; dictated-text normalization; wrong-target rejection; all 250 answers in each perfect pass; repairs and frozen first scores; and restoration/migration. A deterministic rebuild check catches stale generated data. Grammar and punctuation tests preserve modal keyboard behavior and punctuation outside clickable chunks.

## Saved progress and local preview

Context tests now use version 3. Version-2 50-card pilot sessions are archived under `previousContext` with version/count keys; they cannot satisfy a 250-card pass. Existing batch and set tests are preserved; old 300-word day tests and reviews are archived separately. Every active review validates its exact day membership. Reload resumes its queue, feedback and draft.

Days 2–6 expose the previous day’s review above the sets. Every day has its own review below its typed day test, including Day 6. The notes route now defaults to all 1,500 words, without requiring `?set=1`. The older five-word prototype remains source material, not the default experience.

Historical verification (prior schedule): Local browser verification covers the Day 5 300-card entry, target-bearing phrase submission, Enter-to-continue focus, reload with draft, and the final word’s example → contextual grammar dialog. Automated completion checks cover every question in all five days; browser checks are not a claim of manually completing 1,500 questions or re-testing live microphone recognition.

## Course-wide recheck — 27 October 2026

See [the complete review and its limits](lemma-course-audit-2026-10-27.md). The later pass corrects the don title table, one shared English translation and 41 contextual word-hover hints. The selected deck and all accepted answers remain unchanged. The current generated form evidence has 3,380 matches after removing the gift-sense plural from the don title card.

### Six-day schedule

Runtime review membership and generated `perDay` coverage now use six groups of 250. The five `day1.txt`–`day5.txt` source files intentionally retain the original 300-card authoring groups and line references; their names are historical source partitions, not current study days. No sentences or target answers changed for this pacing update. Historical browser verification above refers to the prior schedule; use the current preview steps in `docs/lemmas.md` for six-day pacing.

## Sentence answer review — 6 November 2026

Sentence recall now accepts **501 explicitly reviewed alternatives across 349 cards**, in addition to the original answer lists. The review used the complete Spanish sentence, English translation, agreement and construction; alternatives are not inherited automatically from typed recall. `context/answer-alternatives.json` records the exact reviewed sentence, translation and target for every addition. The builder rejects stale sentence/translation/target references, duplicate answers and non-single-word entries; its coverage manifest includes this source. Original sentences, audio texts, target positions and grammar explanations remain unchanged.

Examples include usar/emplear for utilizar, contestar for responder, mandar for enviar, comprender for entender, and inflected regresa/retorna for vuelve. Answers must fit the existing surrounding words: mi cuarto permits habitación/pieza, whereas la habitación permits pieza but not cuarto. The typed price-increase cue permits subida, but the sentence's un aumento permits incremento/alza, not subida. Tengo veinte años does not accept poseo; operación in a bank does not accept cirugía; enseñar a cantar does not accept mostrar; citar translated as “quote” does not accept mencionar. These exclusions are intentional.

The seven affected variant cards accept periodo, quizás/quizá, futbol, setiembre, vídeo and consciencia for the awareness sense. Primary references: [período](https://www.rae.es/dpd/período), [quizá](https://www.rae.es/dpd/quizá), [fútbol](https://www.rae.es/dpd/fútbol), [septiembre](https://www.rae.es/dpd/septiembre), [video](https://www.rae.es/dpd/video), [conciencia](https://www.rae.es/dpd/conciencia). Accents remain significant elsewhere; conciencia/consciencia is not generalized to the moral sense.

Lexical comparison draws on the existing frozen dictionary and typed-recall source evidence. Sentence fit and alternative surface forms received editorial review; this is a finite acceptance list, not exhaustive semantic grading or independent native-speaker certification. No synonym inference or accent-stripping was added. This section supersedes the earlier target-only scoring description. Multiple-choice distractors are unchanged and their known ambiguity remains deferred. Previously submitted feedback is not retroactively rescored.

Regression checks in `tests/lemma-context-alternatives.test.js` exercise every addition alone and inside the full sentence through submitAnswer, including immediate credit, no spelling/form retry, feedback identity, perfect-pass completion, altered surroundings and meaning/form/gender counterexamples. Historical source hashes are preserved by reversing only the documented answer additions before checking older context corrections.

Local preview: reload `/lemmas/`, open Day 2's sentence review and submit usar for the utilizar blank, or contestar for responder. Both should earn credit immediately. In Day 3's review, periodo and quizás should earn credit without an accent/spelling retry. On the later typed cards, esencial for the “fundamental” cue, pieza for the “room” cue, and subida/alza for the price-increase cue should earn credit. The selected card still teaches its original target and example.

Earlier patch validation: the full 461-test suite and `npm run check` passed. After the final agreement exclusions, all 362 root JS/MJS tests passed again, including every added answer and deterministic regeneration. The later-policy generated-file check also passed. Browser exam completion was not performed; the local preview steps above are for user review. No commit or publication.


## Cross-audit resolution — 6 November 2026

All 40 flagged additions, 60 omission candidates, 12 related-card alternatives and three base-sentence comments now have explicit dispositions in the [resolution ledger](../data/spanish-lemmas/context/answer-review-2026-11-06.json). The [pre-correction report](../data/spanish-lemmas/context/cross-audit-2026-11-06.txt) is retained as historical evidence; its “correction needed” statements describe the earlier snapshot, not the current bank.

The confirmed wrong-person answer **escaparse** is replaced with **escaparte** in the sentence addressed to tú. Dictionary-form escaparse remains valid in typed recall. Of the 60 omission candidates, 59 are accepted; **presta** is intentionally excluded from “offers his help” because giving help does not preserve the offer/provision distinction. All 12 related alternatives are accepted, including docente on both teacher cards and desplazar on both physical-movement cards. This adds 71 valid answer assignments and removes one invalid assignment from the earlier 431, yielding 501.

Sources were compared against the exact unchanged sentence and English translation. Important checks include [RAE pronominal agreement](https://www.rae.es/gtg/verbo-pronominal), [DEM frenar](https://dem.colmex.mx/ver/frenar) and [recabar](https://dem.colmex.mx/ver/recabar), [RAE básico](https://dle.rae.es/básico), [alza](https://www.rae.es/dpd/alza), and [Argentine government data-entry usage](https://www.argentina.gob.ar/sites/default/files/anexo_res_sma_42_2019.pdf). The latter was retrieved directly by Codex; Claude could not retrieve it. [Research on measure complements](https://dialnet.unirioja.es/descarga/articulo/3115656.pdf) supports retaining aumentar la longitud medio metro without requiring en. These sources establish senses or constructions; applying them to each exercise is an editorial judgment.

Codex reread the 537 unique base sentences with all 1,500 blanks and checked identical typed prompts/cues across the full bank. Claude rechecked the original 344-row patch and adjudicated every omission and related candidate in the [audit conversation](https://claude.ai/chat/48fcb02c-8f55-434e-a287-42efeb1e083e). This is not a claim that Claude newly reviewed every typed policy or usage overlay, or that the finite lists enumerate every valid Spanish synonym. No confirmed finding remains open in this audit. Multiple-choice work remains deferred.

Regression checks now also cover subject-specific pronominal alternatives, negative agreement examples, every recorded accept/exclude disposition, and duplicate typed-prompt consistency. The test cards hydrate their meanings from the note library exactly as the app does. Original sentences, translations, audio, teaching targets and saved scores are unchanged. A rejected near spelling can still receive a retry; that is not credit.

Local review: open [the isolated answer preview](http://127.0.0.1:5173/tests/browser/context-answers.html). It runs the 112 recorded answer decisions through the browser’s actual grading modules without reading or writing progress. On escapar, try escaparte (immediate credit) and escaparse (no credit). Select cierto → verdad, efecto → impacto, recoger → recopilar, and ambiente → atmósfera (no credit because tranquilo is masculine). For ordinary study, reload [Perlingo](http://127.0.0.1:5173/lemmas/).

Final resolution validation: all **465 tests passed**, as did `npm run check`, the later-policy generated-file check and the preview module syntax check. In the Codex browser, all **112 recorded answer decisions passed**; manual submissions confirmed immediate credit for escaparte, verdad, impacto and recopilar, no credit with a retry for escaparse, and rejection of atmósfera in the masculine-agreement sentence. These checks verify implementation of the reviewed decisions, not linguistic correctness by themselves. No full exam was manually completed, no audio was regenerated, and nothing was committed or published.

Subsequent status: the user approved this resolution, committed as `27c492567d`. MCQ work is now authorized and implemented separately in the [recognition review](lemma-choice-review.md); the earlier deferral statements above describe the preceding audit's scope. Its dated JSON hashes remain evidence of that committed snapshot, not a moving assertion about later curriculum revisions.

Publication completed November 6, 2026: Sites version **45**, deployment `appgdep_6aee646c6c288191a9b7d7fcef2fc503`, succeeded. GitHub application source `f197a017ae36a1427a537b0defe92f388dc6cd5f` maps to Sites source `ca89443eae07044240726194e0e0015972924cfb`. This publishes the approved recall/context corrections (`27c492567d`) and the reviewed 1,500-question MCQ bank, including the alimento definition correction and safe refresh of unanswered saved choices. All 470 tests, content checks, deterministic generation checks and the hosted production build passed; packaged curriculum/runtime assets match source. Public access, perlingo.app, existing audio hosting and runtime environment revision 2 were retained. No new audio was generated. This supersedes the pending/local-only publication status of these November 6 changes.
