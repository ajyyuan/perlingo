# Claude audit of the Day 1 preview

Completed October 31, 2026 using the signed-in Claude web session, with Opus 5.5 Medium as displayed by the service. The user requested this external audit. The reviewed snapshot contains all 250 resolved preview cards, 99 topics and 175 sections. The November 1 follow-up below addresses form guidance and retries. Broader content corrections remain pending.

[Claude conversation](https://claude.ai/chat/1563c01d-70f3-4033-a6fc-2c0daa6498ba) · [Revised report](https://claude.ai/artifact/HYLMxKkA9qqudwjn3NwQLC)

## Findings after challenge and revision

Claude originally labelled ten findings as clear errors. After comparison with current primary references and a challenge to the grading threshold, its revised report retains four priority issues.

| Finding | Observed behavior | Correction to review |
| --- | --- | --- |
| E1, rank 165, presidente | The teaching example uses presidenta, while the generic president prompt accepts only presidente. | Accept the valid feminine answer or make the requested form explicit. |
| E3, rank 171, pues | The meaning and test select a conclusion, while the single main example illustrates a cause. | Align the main example with the selected sense and teach the other use in the overlay. |
| E5, rank 53, primero | The example uses primer and the cue asks for masculine singular, while only primero passes. | Specify the full headword or accommodate the shortened form. |
| E8, rank 40, sobre | The test selects about a topic, but the quick meaning lists spatial uses only. | Include the tested sense in the quick meaning and illustrate it. |

Claude also identifies 24 cards whose main example shows a different sense from the selected test sense. These are listed under I1 in the report. Its revised totals are four demonstrated errors, sixteen clarity improvements, fifteen optional suggestions and eight unresolved questions. Coverage tables account for 250 unique ranks and 99 unique topic IDs, with no omitted ranks.

## Evidence and disputed recommendations

The report's source coverage is partial. Claude says it directly fetched the DPD luego entry and the Krohn article, used search-indexed copies for other references, and relied on model judgment for many lexical claims. The revised report distinguishes these bases. A complete content read-through does not establish that every linked source was checked.

The following challenges informed the revision.

- E4 was withdrawn. The current DLE gives presentar a manifestation/presentation sense broad enough to fit the visible show cue. Its other senses do not justify an automatic rejection here. [DLE presentar](https://dle.rae.es/presentar)
- E10 was withdrawn. The current DLE explicitly lists the promptly sense in Chile, Mexico and the Canary Islands, among other places. The entry retrieved here identifies itself as the 24th edition. The regional label attached to luego que in Claude's indexed text was also absent from that retrieved entry. [DLE luego](https://dle.rae.es/luego)
- E2 was reclassified as an incomplete explanation. The existing word commonly is compatible with negative expressions other than no. A replacement must state the negative-clause rule with appropriate scope. [RAE on negation](https://www.rae.es/libro-estilo-lengua-espa%C3%B1ola/la-negaci%C3%B3n)
- E6 and E7 were reclassified as ambiguous teaching examples. The lamp translation permits the above reading, and the bien sentence permits more than one analysis.
- E9 was reclassified as unresolved. Stylistic awkwardness alone does not establish that a broadly prompted answer is invalid.
- O2, O6 and O8 were qualified after challenging blanket claims about introducir, adjective position and the gender of nouns after algún/ningún. The DLE includes social admission among introducir's senses, and the DPD agua entry explicitly permits algún agua and ningún agua. [DLE introducir](https://dle.rae.es/introducir), [DPD agua](https://www.rae.es/dpd/agua)

One remaining recommendation needs further correction before adoption. I10 calls the existing después de effort example merely literal and proposes replacing it with después de todo. The DLE explicitly records the concessive después de construction illustrated by an effort followed by an unwelcome response. Adding an after all example can be considered separately. The existing example has direct source support. [DLE después](https://dle.rae.es/despu%C3%A9s)

The DPD also directly supports presidenta as the established feminine form. [DPD presidente](https://www.rae.es/dpd/presidente)

## Saved evidence

`data/spanish-lemmas/claude-day1-audit/` holds the exact input snapshot, initial request, follow-up challenge, initial report, revised report, extracted report links and provenance. The report files preserve Claude's wording, including its remaining judgments. This document records the narrower conclusions adopted during triage.

No additional software tests were needed for this audit-only work. The resolved current preview content was compared with the input snapshot, and the report coverage tables were checked for unique ranks and topic IDs. The prior preview validation is recorded in `docs/lemma-usage-preview.md`.


## Follow-up on expected forms — November 1, 2026

The user chose generous, score-free correction attempts while retaining dictionary-form recall. The local prototype now explicitly requests that form. Presidenta and primer trigger a correction opportunity for presidente and primero, respectively, with full credit after correction. This addresses the grading interaction in E1 and E5 through form guidance. Their teaching examples retain the audited values. E3, E8 and the broader example-alignment work remain pending.

## Local resolution — November 4, 2026

This supersedes the pending-content status above. The audit is triaged; this is not a claim that every Spanish statement or all 1,500 entries have received an independent linguistic certification.

- E1/E5 and I8: retain explicit dictionary-form guidance and score-free form correction. No grading changes in this pass.
- E3/E8: a concluding pues example now leads; sobre includes “about” and a topic example. Other uses remain in the overlay.
- I1: all 24 listed ranks receive sense-aligned authored examples in `lemmas/day1-examples.js`. Identity includes POS: the generic uno is rank 199, not numeral uno at rank 46. The prototype uses these as its main examples. Main-app notes put them first; verb cards still display their independently authored, person/tense-selected examples, and expose the aligned example under More info → Usage in context.
- E2: scope negation guidance to ordinary negative statements and allow preceding negatives besides no.
- E6/E7, I2/I9/I11: clarify the hanging lamp, bien/antes, habitual cuando, simultaneous mientras and near-completion casi examples.
- I3: identify salgas as subjunctive in the existing temporal example; avoid extending a source about construction choice into an unqualified universal mood rule.
- I4/I5: add masculine día/sistema/tema and conmigo/contigo, with scoped entre/según examples.
- I6/I7: retain the existing broad prompts and legitimate alternatives. The audit's proposed narrower también blank is a possible future test design, not grounds for rejecting an answer to today's prompt. Existing accepted-alternative feedback still identifies the taught headword.
- I10: retain the sourced concessive después de example. The live DLE's luego luego entry has no regional restriction; do not add an unsupported Mexico-only label.
- I12/I13: include desde's spatial starting point; replace the absolute obtener construction prohibition with positive construction guidance.
- O7: move Te quiero to the affection section rather than the section about another person acting.
- O1–O6, O8–O15: optional expansions or qualified suggestions, not outstanding demonstrated defects. No new blanket synonym bans, register claims, regional restrictions or alternative-answer expansions were introduced. Meaningful accents/ñ and existing retry behavior remain unchanged.
- E4/E10: withdrawn findings stay withdrawn. E9 and U1–U5 do not establish invalid accepted answers; retain current boundaries, with no invented frequency claims. U6 is verified: the live DLE lists Argentina, Mexico and the Dominican Republic for luego de. U7 describes the external auditor's access limits, not a content correction.

Primary checks used the live RAE DLE entries for the changed I1 senses, plus [pues](https://dle.rae.es/pues), [sobre](https://dle.rae.es/sobre), [luego](https://dle.rae.es/luego), [antes](https://www.rae.es/dpd/antes), [negation](https://www.rae.es/libro-estilo-lengua-española/la-negación) and [stressed pronouns](https://www.rae.es/dpd/pronombres%20personales%20tónicos). Example sentences and English glosses are authored, not dictionary quotations. Per-example sense references are retained alongside the examples. The earlier audit snapshots remain immutable.

Main `/lemmas/` cards now show a translation and one example, with forms where available. Pattern/tip prose, additional examples and sourced comparison topics live under More info. The después/luego deep comparison is shared with the prototype. This is local and uncommitted; grading and saved progress are unchanged.

Known release follow-up: new authored sentences and newly exposed comparison audio are not all in the prerecorded eight-voice library. Playback retains the existing device-voice fallback. The audio inventory now includes the comparison sentences, and its strict coverage test intentionally remains red until those recordings are supplied. No paid synthesis or upload was performed.

Validation: 427 of 428 tests pass; the sole failure is the strict prerecorded-audio coverage assertion (455 newly exposed texts missing in the first Spanish voice checked). `npm run check` and `git diff --check` pass. The regression verifies all 24 audited ranks by exact ID, all 30 replacement examples, complete word glosses, shared main/prototype resolution, retained grading boundaries and the detailed temporal overlay. Browser verification opened sobre in the actual main app, checked its corrected translation/example and expanded sourced comparison; no test answer was submitted or progress changed.

Local review: reload `/lemmas/`, search sobre or pues, inspect the short card, then open More info and expand a comparison topic. For tener, check the existing tense/person selector and Verb guide; those examples continue to follow their selected form. Screenshot: `/tmp/perlingo-clean-card.png`.
