# First-set word-note evidence

Local draft, October 25, 2026. Fifty notes cover exactly the first 50 **card IDs**, including distinct relative/conjunction que. They add teaching explanations without altering deck order, counts, headwords or ratings. Examples, translations and explanatory prose are authored for this interface, not quoted corpus sentences. This is scoped source comparison, not independent linguistic certification or an exhaustive dictionary.

## References checked

The frozen [dictionary extract](../data/spanish-lemmas/dictionary-extract.json), from the already credited Doozan/Wiktionary revision `b8ed076b4faea26a0985ee46ca736771c2e62dc4`, supplies senses and usage for the first-set headwords other than a. Each note links to the corresponding English Wiktionary Spanish entry. Its POS distinctions were checked when selecting examples: notably más modifies an adjective here, como is causal, que has separate relative/conjunction examples, and uno is numeral. The online a page returned an English-only extract, so it was not treated as Spanish evidence.

Additional primary references read on October 25:

| Reference | Scope used |
| --- | --- |
| [RAE/ASALE DPD: a](https://www.rae.es/dpd/a) | Personal a, including named people as direct objects; the de/el dictionary entries also document the al/del contractions. |
| [RAE/ASALE DPD: unstressed personal pronouns](https://www.rae.es/dpd/pronombres%20personales%20%C3%A1tonos) | Object/reflexive roles; le/les → se before another object pronoun; neuter lo. |
| [RAE/ASALE DPD: haber](https://www.rae.es/dpd/haber) | Impersonal existence versus auxiliary usage; possession uses tener in current ordinary Spanish. |
| [RAE/ASALE DPD: ser](https://www.rae.es/dpd/ser), [estar](https://www.rae.es/dpd/estar) | Origin/description versus state; frozen ser entry also explains location and why permanence alone is insufficient. |
| [RAE/ASALE DPD: y, section y²](https://www.rae.es/dpd/y) | y → e before /i/, with exceptions; sound rather than spelling. |
| [RAE/ASALE DPD: o, section o²](https://www.rae.es/dpd/o) | Alternatives, o → u before /o/, no written accent. |

The frozen dictionary's entre entry supports tú/yo in the ordinary “between” construction and cautions against generalizing to every expression with entre. Its el/un entries support the stressed-a exception without changing the noun's gender. The possessive and pronoun entries distinguish owner, possessed noun, subject and object. Explanations intentionally present one contextual use at a time, with alternatives in More.

## Inflections

[notes-form-evidence.json](../data/spanish-lemmas/notes-form-evidence.json) records 60 present-indicative form-to-lemma matches for ten verbs against the frozen `es_allforms.csv`, with source SHA-256. This verifies membership, not the person labels; those were manually checked while authoring. It does not certify full paradigms or every word in the examples. The haber table is explicitly auxiliary (he/has/ha/hemos/habéis/han); impersonal hay is taught in the example. Tables include tú and vosotros, and explain ustedes; voseo paradigms are not supplied.

## Validation and limits

`tests/first-set-notes.test.js` checks exact first-set identity/order, explained chunks, original-text reconstruction, punctuation outside buttons, important contrast regressions, all table rows against evidence, and shortcut ownership. The pilot and session tests remain applicable. Current browser checks cover Notes & examples, popover → dialog → Escape, no grading while help is open, typed/choice grading, personal-note persistence, and navigation cleanup.

The first-set prose and examples remain a local review draft. No claim is made that 50 examples cover every sense or that 1,500 cards yield a measured text-coverage percentage. Attribution and licensing follow the [existing deck sources](../lemmas/sources.html); source-derived teaching adaptations retain CC BY-SA 4.0.

## Full lexical dataset expansion — October 25

The lexical build covers all 1,500 IDs. At its October 25 checkpoint, 53 entries had authored examples. The October 26 context expansion now supplies sentence examples to all 1,500 entries, preserving those original examples. The new source scope and checks are recorded in [lemma-context-sources.md](lemma-context-sources.md); no exhaustive sense or inflection mastery is claimed.

The entire displayed gloss list was read. `full-notes-gloss-review.json` records 104 changes checked against the frozen dictionary senses, including several misleadingly narrow first-sense extractions. `notes-usage.json` adds selected construction and contrast notes from the same entries. The dataset does not claim to cover every sense.

`notes-inflection-evidence.json` records 3,381 exact lemma/POS/form matches from the pinned allforms CSV. Present forms are proposed by ordinary conjugation patterns or explicit irregular paradigms and accepted only on an exact source match. All 369 resulting verb tables were read; ocurrir/suceder/consistir are restricted to third-person forms for the taught meanings. This map alone does not label tense/person: the rules, authored exceptions and review supply those labels. Nominal/adjectival plurals use ordinary morphology plus accent exceptions, likewise gated by same-POS matches. Three missing noun plurals are omitted, not guessed. The build report lists them.

Additional references checked: [RAE plural](https://www.rae.es/dpd/plural), [RAE género](https://www.rae.es/dpd/g%C3%A9nero), [RAE el](https://www.rae.es/dpd/el). These support the grammar rules, not each generated lexical item independently. Gender metadata comes from matching noun sections, with explicit sense-specific choices for multi-gender entries. The source mapping omitted bueno’s agreement forms; its [Spanish headword line, pinned revision](https://en.wiktionary.org/w/index.php?title=bueno&oldid=93385478#Spanish) explicitly lists buena/buenos/buenas. This exception is recorded in `notes-manual-evidence.json`.

`tests/full-lemma-notes.test.js` validates coverage, example-layer counts, concept namespace isolation, every non-headword generated form against source/manual evidence, important gender/verb regressions, audit/deck consistency, and deterministic offline regeneration. User feedback is for usability; responsibility for source checks and correction remains with authoring. This is not independent certification, exhaustive semantic annotation or a coverage measurement.

## Separately recorded second pass

See [the second-pass report](lemma-notes-second-pass.md) and [field-level evidence](../data/spanish-lemmas/second-pass-audit.json). Ten entries changed, while 1,490 stayed identical. The second pass found real errors missed by membership checks, including los mes/los gas and the feminine of español. It adds DLE/DPD comparisons for specific decisions, including correct variants retained unchanged; it does not retroactively turn the first pass into independent validation. The 3,381 mapping matches remain membership evidence only.

## Course-wide recheck — 27 October 2026

See [the complete review and its limits](lemma-course-audit-2026-10-27.md). The later pass corrects the don title table, one shared English translation and 41 contextual word-hover hints. The selected deck and all accepted answers remain unchanged. The current generated form evidence has 3,380 matches after removing the gift-sense plural from the don title card.
