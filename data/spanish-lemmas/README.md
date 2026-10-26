# Spanish frequency selection: CORPES

**Current decision:** the user chose an explicitly edited CORPES deck after reviewing the [audit](AUDIT.md). The application now uses `lemmas/data/deck.json`; [teaching-edits.json](teaching-edits.json) records its changes. The files below remain the unedited research selection and must not be confused with the teaching deck. See [current implementation](../../docs/lemmas.md).

Prepared 2026-10-25. CORPES is now the ranking input for the edited teaching deck. This directory preserves the independent source-selection work. The edited implementation is approved for commit; it has not been published.

## Inspect the actual list

- [1,500 entries, readable text](corpes-1500.txt)
- [Same entries as JSON](corpes-1500.json)
- [Original 5,000-row table](corpes-5000-source.tsv)
- [109 excluded rows before the cutoff, with reasons](exclusions.json)
- [Provenance, checksum and counting summary](provenance.json)

There are **1,500 lemma/POS entries and 1,455 distinct spellings**. For example, *poder* (verb) and *poder* (noun) retain separate counts and ranks, as do relative and conjunction *que*. This is a corpus lemma/POS convention, not 1,500 distinct printed words. Conjugated forms are not separate cards. No counts from different grammatical categories have been combined. A future interface may group identical spellings, but must retain this distinction and must not label 1,455 grouped cards as 1,500 headwords.

Selection preserves source order, including ties. It skips punctuation, unknown tokens, affixes, capitalized entries, multiword expressions, numeric/symbol entries, al/del, and single-letter entries except a/preposition, y/conjunction and o/conjunction. Capitalization is an explicit heuristic, not full proper-name detection: this table supplies only coarse POS codes. Spelled-out numerals remain. Phrases are excluded only to keep the challenge single-word; this is not a judgment of their learning value. The 1,500th selected entry is **gas**, source row 1,609, count 29,272.

This is **the top 1,500 eligible single-word lemma/POS entries in the frozen RAE table under those filters**, not the unmodified RAE top 1,500. There are no invented replacement counts, respellings, dictionary-gloss-based omissions, or merges of partial frequency totals.

## Why this source

The [official RAE / ASALE CORPES table](https://www.rae.es/corpes/assets/rae/files/corpes/5000_lemas.html) publishes lemma, grammatical category, absolute count and normalized frequencies. Its page explicitly licenses the content under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The frozen PRE text is attributed to RAE / ASALE; the filtered list and added annotations are adaptations distributed under the same license. No RAE endorsement is implied.

[CORPES](https://www.rae.es/corpes/contenidos/datos) covers contemporary Spanish across countries and includes written and oral material. This general top-5,000 table is distinct from the older **press-only** CORPES frequency dictionary and its geographic-dispersion downloads. Do not transfer that dataset's exact counts or methodology to this table. The current website's corpus release is also not proof of the static table's release: the table does not state its extraction date/version. The exact frozen bytes and SHA-256 provide reproducibility despite that gap.

The [annotation documentation](https://www.rae.es/corpes/contenidos/etiq-descripcion) describes automatic annotation; the [official tag inventory](https://www.rae.es/corpes/assets/rae/etiquetario/etiquetario_general.pdf) defines the category codes. Institutional provenance and traceable counts make this a stronger baseline than the earlier third-party merged ranking. They do not guarantee perfect disambiguation. This pass verified extraction, selection and category labels, not every contextual token assignment or all 1,500 dictionary senses.

Other sources considered:

- [Davies & Davies, A Frequency Dictionary of Spanish, second edition](https://www.routledge.com/A-Frequency-Dictionary-of-Spanish-Core-Vocabulary-for-Learners/Davies-Davies/p/book/9781138686540): strong learner-oriented alternative, based on a large multinational web corpus. Its official supplementary download requires book ownership; it was not accessed. The separate [commercial frequency files](https://www.wordfrequency.info/spanish.asp) have distribution restrictions. Neither was silently substituted or scraped from an unofficial mirror.
- [EsPal](https://www.bcbl.eu/databases/espal/): useful research source with written/subtitle and lemma information; not used to mix counts into this ranking.
- Doozan: rejected as the primary ranking for this challenge because its aggregation and omissions required ad hoc repairs. Comparing distinct spellings, the two local lists overlap on 1,106; CORPES adds 349 and the old draft has 394 not in this selection. Those differences alone do not prove individual words wrong: corpora and counting units differ.

## What this does not establish

There is no corpus-independent “actual” top 1,500. Genre, country, period, tokenization and lemma conventions change rankings. This selection does **not** establish 90% spoken coverage, reading comprehension, or recognition of inflections after studying isolated headwords. Do not transfer a Davies coverage estimate to this CORPES selection, or sum its normalized frequencies to claim conversational coverage.

The edited deck has dictionary-backed meanings and selected verb forms with scoped editorial checks; it is not a complete sense or inflection inventory. Source annotation errors, lowercase names, and lexicalized participles remain possible review issues; edits must preserve source evidence and explicitly record their reason.

## Reproduce and review

Run `python3 scripts/select-corpes-lemmas.py`. It reads only the frozen source and checks its hash, 5,000 unique lemma/POS rows, descending source counts, 1,500 selected entries and essential-function-word regressions. Generated output is deterministic. No network or package installation is needed.

For local review, open `corpes-1500.txt`: inspect the first 50 rows, search for both *poder* entries, confirm *no*, *ser*, *estar* and *haber*, then inspect rank 1,500. Use source row numbers to compare against `corpes-5000-source.tsv`; every skipped row up to the cutoff appears in `exclusions.json`. These checks passed on October 25, including byte-identical regeneration. They validate the data pipeline, not linguistic perfection.

## Full lexical notes (local)

The current local preview has lexical notes for every card, with 53 separately authored sentence examples. `full-notes-gloss-review.json` records the 104-entry wording/sense audit; `notes-usage.json` holds construction notes. `notes-inflection-evidence.json` and `notes-manual-evidence.json` support the inflection/gender workflow, with unresolved candidates explicitly omitted in `notes-build-report.json`. Rebuild with `python3 scripts/build-corpes-deck.py` then `python3 scripts/build-lemma-notes.py`. [Current scope and checks](../../docs/lemmas.md). The user requested local preview first; this expansion is approved for commit but is not published.

`second-pass-audit.json` separately records the October 25 second-pass baseline/result hashes, ten field-level changes with sources, and 17 explicit retain decisions. It distinguishes screening all entries from targeted additional-reference checks. Do not describe unchanged entries as independently verified. See [the readable report](../../docs/lemma-notes-second-pass.md).
