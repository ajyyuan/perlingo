# Later-day content audit resolution — November 5, 2026

All findings from the Claude + Codex review of the 1,250 later-day cards have an explicit correction or a justified no-change disposition. The content is implemented locally for user review, not committed or published. Audio generation is deferred to the next task.

## What changed

- Corrected 140 answer policies against the actual written cues, including the 11 initially reproduced false-rejection cases and the subsequent candidate lists. Explicit regional alternatives, pronominal infinitives and valid spelling variants now receive credit. Added corresponding explanations; comparison membership still never grants credit automatically.
- Resolved the deferred cases: **guardar** now explicitly asks for the file-menu construction *Guardar como*; **actuación** selects an actor's performance and accepts *interpretación*; **investigar** accepts *averiguar* with a process/result explanation; **complejo** accepts *complicado* for its many-parts sense.
- Corrected unsupported teaching labels, clarified the numeral **medio litro**, removed the unsupported absolute about **obtener**, clarified the **el alma** construction, and repaired three mismatched source links.
- Corrected four shared context examples across 12 cards: *el final* means the tournament's **end**, *aseguramos que* is translated **we assure you that**, **medical student** replaces “medicine student,” and **Durante el acto** explicitly selects the ceremony context. Shared translations, chunks and concept records are synchronized. Targets and accepted cloze answers are unchanged.

The resulting bank has 547 explicit policies, alternatives on 457 cards (637 assignments), 431 comparison topics across 554 cards, and 21 teaching-meaning supplements/corrections. The remaining baseline entries have a review disposition, not a claim that no other Spanish synonym exists.

## Decisions and evidence

[Resolution ledger](../data/spanish-lemmas/claude-later-audit/resolution-policies.json) preserves the 140 policy before/after records and a disposition for each reported finding, including deliberate no-change decisions. Valid sibling answers, legitimate broader reference-example senses, the noun **ciento** versus numeral **cien**, and intentional stable IDs were retained. Stylistic preferences were not treated as factual errors.

The [original audit](lemma-later-day-claude-audit.md), Claude reports, coverage ledger and pre-correction runtime reproductions remain historical evidence. Claude reviewed the original snapshot, not these final edits. Targeted primary entries and stored dictionary comparisons support the decisions; neither model freshly verified every entry or every possible synonym. Source records distinguish direct primary-entry checks from reviewer sense comparisons. This closes the finite audit's findings, not an exhaustive linguistic certification.

The [context correction record](../data/spanish-lemmas/later-context-correction-audit.json) records exact before/after contexts and concepts. Tests reverse only those documented corrections and recover the prior file and assessment fingerprints; older audit records were not rewritten or their guards removed.

## Validation and local review

All 43 targeted curriculum/form/integrity tests pass. Full-suite results: 449 tests, 448 passing; the sole failure is the existing strict eight-voice audio-coverage check. `npm run check` and the offline generated-artifact check pass. Runtime regressions verify accepted alternatives, negative sense boundaries, immediate credit for valid variants, retry behavior for actual misspellings, and untouched sentence-cloze answer lists.

In the Codex browser, reloaded the local app and confirmed **miedo · temor** displays the explanation and “For this meaning: miedo / temor.” No assessment response or saved progress was submitted during preview verification.

Reload [the local preview](http://127.0.0.1:5173/lemmas/), search **miedo**, and open More info → Similar words and Usage notes. Also inspect **fútbol**, **guardar**, **actuación**, and **final**: explanations, selected cues, valid variants and the end/final-match distinction should agree. In a typed test, **futbol** for fútbol receives credit immediately; a genuine misspelling still offers a correction attempt.

## Audio handoff

The refreshed offline inventory contains **395 missing texts per Spanish voice**: 177 comparison sentences, one revised context sentence and 217 accepted-answer words. Across eight voices, that is 3,160 clips and 47,464 characters. Existing recordings are reused; the earlier completed audio banks are not being regenerated. See [exact missing texts](../data/spanish-lemmas/later-day-audio-gap.json).

No synthesis, spending, manifest change or upload occurred. The earlier $2 proposal concerned a ceiling for the incremental recording batch, not a charge incurred by the audit. Audio completion, decoding/volume validation and coverage verification remain the next separate task.
