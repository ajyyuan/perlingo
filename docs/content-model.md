# Content foundation (C1)

## Scope and current state

C1 establishes a versioned, browser-readable content pack and validation/review workflow. The pilot migrates three **existing** concepts across Spanish, French, and German: book (`c3`), to read (`c19`), and I read a book (`c26`). The app still has 34 concepts / 102 translations. Lesson order, taught strings, answer checking, and browser progress IDs are unchanged.

The pilot is draft, authored by Codex, with no independent linguistic reviewer. Lexical reference URLs are attached; this is not a claim that every sentence or explanation has been verified. Grammar evidence is explicitly pending. Passing automated validation establishes structural integrity, not linguistic truth.

## Files and data flow

- `src/content/reading-pilot.js`: single source for the pilot's lesson text, chunks, explanations, lexical forms, grammar references, and provenance.
- `src/content/model.js`: schema-v1 validator, migration adapter (`lessonEntries`), and strict release gate (`approvedEntries`).
- `src/content.js`: retains the remaining 31 legacy concepts; slots for c3/c19/c26 resolve from the pilot. The fixed slots preserve historical IDs.
- `src/explanations.js`: uses pilot chunks for the migrated concepts; retains legacy authored explanations for other concepts.
- `scripts/check-content.mjs`: command-line validation. `npm run check` includes this check.
- `content-review.html` and `src/content/review.js`: read-only local review page at http://127.0.0.1:5173/content-review.html. Displays the actual pack, lexical references, selected forms, grammar links, and release blockers. No edits or approvals are saved there.

The app does not fetch sources at runtime. Reference links open external dictionary pages only when clicked. Pronunciation remains browser speech synthesis, including the Thomas preference.

## Schema version 1

| Record | Fields and purpose |
| --- | --- |
| Pack | `schemaVersion`, stable `id`, positive integer `version`, origin note, source/lexeme/grammar registries, entries |
| Entry | Stable progress `id`, `senseId`, English `prompt`, disambiguating `definition`, lesson `type`, translations for es/fr/de |
| Translation | Exact taught `text`, lexeme/grammar/source IDs, review metadata, ordered chunks |
| Chunk | Exact `text`; clickable chunks also have contextual `meaning`, `summary`, `detail`, lexeme/grammar IDs. Non-clickable spans contain only punctuation/spacing. |
| Lexeme | ID, language, lemma, part of speech, sense ID, noun gender when applicable, selected forms, source IDs, review metadata |
| Form | `text` plus applicable number, verb form, mood, tense, and person. The pilot has noun singular/plural and verb infinitive/first-person singular present only. |
| Grammar reference | ID, language, description, source IDs, review metadata. Pilot targets present first-person agreement and an indefinite direct object. |
| Source | Title, URL, access date, attribution, reuse/license note, evidence scope. Release requires explicit `reuseReviewed: true`. |
| Review | `draft`, `in-review`, or `approved`; author, reviewer, review date, notes. Approval requires reviewer and date. |

Sense IDs distinguish meanings rather than assuming English words have one-to-one translations. Chunk references connect to the relevant noun or verb. Standalone pronoun chunks retain contextual prose but have no lexical record in this small pilot. Full function-word records and complete paradigms can be added later; they are not implied by C1.

## Evidence and licensing

Six Wiktionary entries are attached as lexical references: Spanish libro/leer, French livre/lire, German Buch/lesen. They are live URLs with access dates, not pinned source revisions or imported dictionary dumps. Teaching prose was authored for Perlingo; it is not presented as a dictionary quotation. References are scoped to vocabulary/forms, not approval of sentence naturalness, grammar, or all acceptable answers.

Source reuse terms are recorded as pending inspection and are not marked reviewed. Before a future approved release, confirm the exact reused material and applicable attribution/license obligations, and pin source revisions or retain evidence snapshots when establishing the reviewed version. No downloaded corpus is bundled by this change.

## Review and release workflow

1. Draft or migrate an entry with a specific meaning, language-specific forms, chunks, sources, and explicit review gaps.
2. Run `npm run check:content` and `npm test`. Inspect the local review page.
3. Move records to `in-review` when a reviewer takes them up. Reviewers check meaning, naturalness, grammar, chunk boundaries, usage/region, and answer expectations. Attach missing evidence and resolve reuse terms.
4. Only after actual review, set each translation, lexeme, and grammar record to `approved`, recording reviewer and date. Structural tests cannot supply this approval. A user approving the code commit does not automatically approve linguistic content.
5. `node scripts/check-content.mjs --release` and `approvedEntries(pack)` reject any unapproved records, missing evidence, or unreviewed source reuse terms. This gate currently fails **by design** for the pilot. There is no deployment/export pipeline in C1; future pack release tooling must call this gate.
6. Any material edit to reviewed text, facts, forms, or supporting evidence must reset affected review metadata to draft and increment the pack version before release. This reset is an authoring requirement, not an automatic content-hash enforcement mechanism in C1.

The existing local game uses `lessonEntries` as an explicit **migration adapter**, which validates structure but allows draft content. This preserves access to three lessons already present before C1; it does not certify them, and must not become the default admission path for newly imported C3 material. The remaining legacy bank is also not independently reviewed. `dist/` stays unchanged.

## Validation and testing

Validation checks required identities, three-language coverage, duplicate IDs, reference existence and language, noun gender, presence of forms, review metadata, chunk reconstruction, and explained-word coverage. Release validation adds review/evidence/reuse requirements. It does not check whether an inflection is linguistically correct, a source supports a claim, or a reviewer is qualified; those need review.

Run:

```sh
npm test
npm run check
node scripts/check-content.mjs --release  # expected failure until actual review
```

Manual checks: open the local content review page, inspect each of the three concepts, expand word forms/grammar references, and examine release blockers. Return to learning and check that “Leo” and “un libro” still open separate popovers and pronunciation works. Existing progress and session settings should remain intact.
