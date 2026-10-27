# Verb tense examples — local implementation, 27 October 2026

The shared picker now changes its short Spanish example and English translation when the selected tense changes. Study cards, lookup cards, Full notes and standalone notes use the same data. Individual words retain contextual meanings, course-card links and pronunciation; the speaker plays the whole sentence. On study and lookup cards, the selected example replaces the left-hand Uses content; no example is duplicated beneath the forms. Original patterns, examples and tips remain available in Full notes, which retains its inline tense example. Nonverb Uses, the original four tests, accepted answers and progress remain unchanged.

## Coverage and exceptions

All 369 verbs have nine option records: 3,252 translated examples and 69 notice-only records. Most examples keep one lexical setting across tenses to make the grammatical contrast visible. Typically they demonstrate informal singular tú; subject-specific constructions use appropriate third-person subjects. They illustrate one selected sense and person, not every meaning or every conjugation. Tener retains its original nine examples.

Notice-only records chiefly concern commands that are not natural everyday instructions for the selected meaning (for example, a clock functioning or something costing money). Such notices do not claim that those verbs can never occur in imperatives. Existing restrictions on impersonal verbs remain. Soler additionally omits future, conditional and command tables, and uses a notice instead of a preterite teaching example for ordinary habits. Its present-perfect example is explicitly marked uncommon. The frozen source extraction is preserved; display restrictions are applied in verb-forms.js.

## Authoring and evidence

The editable sources are data/spanish-lemmas/tense-examples/frames.txt (lexical settings), words.txt (context glosses), and special.json (explicit exceptions). scripts/build-lemma-tense-examples.mjs combines them with the existing frozen, sourced conjugation tables to produce lemmas/tense-examples-data.js offline. These are authored teaching sentences, not corpus quotations. English inflection and person agreement are handled separately, with special treatment for constructions such as gustar and meaning shifts such as supiste (found out).

All 369 lexical frames and their English present/past/perfect phrases were screened, with targeted review of commands and exceptional constructions. This is editorial review and automated consistency checking, not independent linguistic certification or a claim that every generated sentence was independently sourced.

Targeted references consulted:

- [RAE: soler](https://www.rae.es/dpd/soler): defective usage, absent future/conditional/imperative, uncommon compound forms. The preterite teaching omission is an editorial choice, not a claim that the source bans it.
- [RAE: imperative](https://www.rae.es/gtg/modo-imperativo) and [subjunctive](https://www.rae.es/gtg/modo-subjuntivo): commands, negative-command forms and subordinate uses.
- RAE sense checks: [tender](https://www.rae.es/dpd/tender), [importar](https://dle.rae.es/importar), [disponer](https://dle.rae.es/disponer), [referir](https://dle.rae.es/referir). These support selected lexical uses, not blanket verification of the whole bank.

## Validation and preview

Run node scripts/build-lemma-tense-examples.mjs to rebuild. The regression tests verify all 369 × 9 records, distinct examples per verb, complete word glosses, each target against its sourced tense/person form, exceptional constructions, preserved tener examples, and deterministic rebuilding. All 321 tests and npm run check passed. Existing assessment-data regression checks remain in place.

Browser verification used hacer: Present showed “Haces la comida.”, Past showed “Ayer hiciste la comida.”, and Full notes Future showed “Después harás la comida.” with the corresponding English translations. Bracket navigation updated the active overlay. No answers were submitted or course progress advanced during these checks.

Preview at http://127.0.0.1:5173/lemmas/. Press Command/Ctrl+K, search hacer, open the card and use [ / ] to switch tenses. Open Full notes and repeat. Search gustar, haber and soler to inspect the exceptional constructions and usage notices. Approved and committed locally; not published.
