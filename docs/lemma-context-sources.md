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
