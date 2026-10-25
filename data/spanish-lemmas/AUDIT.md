# Integration audit — October 25, 2026

**Resolved by user choice:** build a transparently edited 1,500-card deck. These findings remain limitations, not claims of corrected corpus counts. See [the implemented editing policy](../../docs/lemmas.md). The raw table is not presented as 1,500 verified lexical lemmas.

The previous checks established exact extraction and reproducibility, not the meaning of the source's lexical units. Matching the entries to dictionary senses exposed a more substantial limitation than the earlier report conveyed. The original ranking is preserved; no guessed count splits, substitutions, or translations have been applied to the UI.

## Findings

| Source entry | Dictionary evidence | Consequence |
| --- | --- | --- |
| músico / N, selected rank 300 | [RAE músico, ca](https://dle.rae.es/músico) includes musician and feminine music senses within one dictionary article. | Translating the corpus label only as “musician” may omit a major distinct meaning. The table alone does not reveal the allocation of counts. |
| característico / N, rank 814 | [RAE característico, ca](https://dle.rae.es/característico) includes feminine característica for a distinguishing feature, alongside other uses. | A dictionary heading is not necessarily the surface lemma to teach for every noun sense. |
| salido / N, rank 920 | [RAE salido, da](https://dle.rae.es/salido) primarily describes adjectival senses. | Possible annotation or lemma mapping issue; do not silently substitute salida or teach it as “exit” without evidence. |
| listo / N, rank 928 | [RAE listo, ta](https://dle.rae.es/listo) allows nominalized clever-person senses. | Noun category is not itself proof of an error. Whether the count includes lista cannot be established from this table. |
| perspectivo / N, rank 1241 | [RAE perspectivo, va](https://dle.rae.es/perspectivo) includes feminine perspectiva (viewpoint/perspective) and an uncommon person sense. | An exact-headword English dictionary match yields the misleadingly narrow “perspectivist.” |
| interés / N, rank 383, and intereses / N, rank 1251 | [RAE interés](https://dle.rae.es/interés) includes plural-specific senses. | Distinct source entries need an explicit lexical counting decision; spelling/POS uniqueness alone does not establish distinct lemmas. |
| deudo / N, rank 1335 | [RAE deudo, da](https://dle.rae.es/deudo) distinguishes kinship meanings from an obsolete debt sense. | Do not rename it deuda or equate its count with debt on intuition alone. |

These are **review findings**, not proven token-level corrections. The dictionary evidence confirms semantic distinctions, not which tokens CORPES counted in each row. Some are dictionary-heading conventions; others may be annotation errors or lexicalized uses. Renaming or splitting the rows cannot recover frequency counts absent the underlying form/context breakdown.

## Work completed

- Extracted the matching entries from the existing frozen Wiktionary-derived dictionary; `dictionary-extract.json` contains 1,453 headwords. Missing exact entries: a and intereses.
- Ran a POS/category comparison over all 1,500 source entries; see `dictionary-audit.json`. Cross-dictionary category mismatches are investigation flags, not automatic rejection rules.
- Examined candidate glosses for common function words, POS duplicates, noun-heading issues, unwanted specialist senses and unresolved markup. Automatic first-gloss selection is insufficient: examples include qué/interrogative being matched to an adverbial sense and perspectivo/noun to “perspectivist.” No candidate glosses were promoted to the application.
- Checked the seven dictionary articles linked above. No claim of independent linguistic review or verification of all corpus token assignments.
- Attempted the separate CORPES press dictionary download for comparison; direct access returned HTTP 403. Its published method describes press-only material; it cannot be assumed interchangeable with this table.

## Dictionary snapshot and reuse

`dictionary-extract.json` is a headword-subset adaptation of `es-en.data` from [Jeff Doozan's spanish_data](https://github.com/doozan/spanish_data/tree/b8ed076b4faea26a0985ee46ca736771c2e62dc4), revision `b8ed076b4faea26a0985ee46ca736771c2e62dc4`. Original dictionary SHA-256: `7cb53827e68a6d8fabcc40c3072adf25c6279500d116bafd3c4a7aad70a0347f`. The upstream README credits English Wiktionary under CC BY-SA. Attribution: [Wiktionary contributors](https://en.wiktionary.org/), with each headword's source/history at `https://en.wiktionary.org/wiki/<headword>#Spanish`. This extract is provided under CC BY-SA 4.0, preserving those notices; changes are selection and JSON wrapping. It does not supply frequency evidence or replace the RAE attribution for the ranking.

Reproduce the category audit with `python3 scripts/audit-corpes-lemmas.py`. It operates locally and does not alter the source selection or application deck. The user subsequently chose the edited deck. `teaching-edits.json` records the resulting choices; raw source rows remain intact.

The dictionary extract was subsequently extended with the seven chosen feminine display headwords and religioso for the edited deck. The audit above describes the initial extraction; current extraction counts may be larger.
