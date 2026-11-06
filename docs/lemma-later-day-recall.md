# Days 2–6: similar words and typed recall

Status: content committed as `38f9e7ce6c` on November 5, 2026. Prerecorded audio is now complete locally as a separate, uncommitted change; nothing has been pushed or published. See [audio completion](lemma-later-day-audio.md).

The review covers all 1,250 lemma/POS cards at ranks 251–1,500. It adds 547 explicit typed policies, including 457 cards with alternatives (637 answer assignments), and 431 comparison topics displayed across 554 later-day cards. Eight cards receive comparisons without a prompt change; 695 retain their previous prompt and acceptance. Retained does **not** mean that a word has no synonyms. This is a finite review of selected-use overlap and likely learner confusion, not an exhaustive thesaurus or an independent linguistic certification.

## Behavior

Typed batches and day tests use the explicit prompt, cue and alternatives. Comparison membership never implies acceptance and there is no transitive synonym expansion. Examples include utilizar/usar/emplear for using a tool; responder/contestar for answering; médico/doctor for a physician. Distinct senses stay separate: jugar/tocar, libre/gratis, planta/piso, firma/empresa and médico as an adjective versus a noun.

Usage tendencies are not hidden rejection rules. In particular, both escuchar and oír are accepted for the selected hearing/listening cues: [RAE's DPD](https://www.rae.es/dpd/escuchar) explicitly recognizes their overlap. Source limitations and register notes belong in explanations, rather than silently invalidating a translation that fits the cue.

The existing More info component displays comparison topics and, inside Usage notes, the selected meaning, cue and explicit alternatives. Standalone notes include the same later-day comparisons and selected meaning. Twenty-one teaching meanings are supplemented or corrected to include the selected sense and remove unsupported usage restrictions, including enseñar (teach/show), manejar (handle/manage/drive), suelo (ground/soil/floor), detener (stop/detain), and facilitar (make easier/provide). Broader lexical senses, forms and existing main-card examples remain available; the selected typed use need not be the sense of every reference example. Added comparison examples are whole-sentence reference examples, not new scored cloze sentences or automatically parsed learning chunks.

Day 1 policies and comparisons are unchanged. Sentence-cloze answers and the frozen deck/base-note files are unchanged. Four shared context examples (12 cards) have coordinated translation/chunk or construction corrections; the reversible context audit preserves the earlier audit fingerprints. Recognition still uses the teaching meaning, including the teaching corrections; its existing stale-option check refreshes choices when the correct meaning changes. No Spanish alternatives are added to recognition grading. Previously submitted feedback, first-pass scores, queues and progress are not retroactively rescored. Reload for the new local content; restarting is optional.

## Sources and maintenance

- `data/spanish-lemmas/later-day-recall-review.json`: every later-day card, baseline, disposition, explicit changed policy, teaching expansion and comparison membership.
- `data/spanish-lemmas/later-day-usage.json`: authored comparisons, reference examples and source links. This is the editable teaching source.
- `data/spanish-lemmas/later-day-source-evidence.json`: exact stored dictionary-entry hashes, stored synonym references and targeted RAE pages inspected during this task. A synonym reference supports a candidate; the authored cue determines whether it is accepted. No fresh retrieval of all dictionary entries is claimed.
- `scripts/build-later-recall.mjs`: validates membership and answer-source presence and builds `later-recall-data.js`, `later-usage-data.js`, and `later-teaching-data.js`. Run with `--check` to detect stale generated files. The data do not depend on an online service at runtime.

For future corrections, update the source review/usage/evidence together, regenerate, and add a regression for the relevant meaning or construction. Do not broaden acceptance merely because two words share a comparison topic.

## Audio boundary

The exact typed alternatives are included in the pronunciation inventory. The pre-generation gap of 395 texts per voice has been filled: 177 comparison sentences, one revised context sentence, and 217 answer words, totaling 3,160 clips across eight voices. Existing recordings are reused. `later-day-audio-gap.json` preserves the original requested texts; `audio/inventory.json` now records current coverage. See [generation, validation and preview](lemma-later-day-audio.md).

Device speech remains available for playback/network failures. Local prerecorded coverage no longer depends on that fallback. Audio upload, publication and the audio commit remain separate from the committed curriculum.

## Local review

Open http://127.0.0.1:5173/lemmas/ and reload.

1. Search **utilizar**, then More info. Expand utilizar · usar · emplear and Usage notes. The explanation, example and accepted alternatives should agree.
2. Search **escuchar** and **oír** to check the overlapping-usage explanation; search **jugar**, **planta**, **firma** and **libre** for distinctions.
3. Search **enseñar**, **suelo**, **manejar** or **facilitar** to inspect the expanded short meaning and selected-use note. Forms, tense examples and pronunciation preferences retain their existing behavior.
4. In a later-day typed test, when the matching cue appears, try **emplear** for utilizar, **contestar** for responder, **mandar** for enviar, or **doctor** for the physician médico card. Expect “Also correct” and the card headword. A similar spelling still gets the existing retry flow. Do not expect the same synonyms to fill an unrelated sentence-cloze blank.
5. Reload an unfinished test and confirm the queue and existing feedback remain. No saved progress was modified for browser verification.

Validation and the final audit disposition are recorded in [the resolution report](lemma-later-day-resolution.md). Regressions cover all 1,250 dispositions, accepted alternatives, selected-sense rejection cases, valid spelling variants, POS boundaries, non-retroactive feedback, spelling retries, source hashes, teaching/rendered membership, and separation from recognition/cloze grading. Prerecorded completion is recorded in the audio report.

## Earlier second correctness audit — November 5 (historical)

Reread the 444 originally changed policies and all 291 comparison topics, and screened retained prompts for omissions. Targeted primary-source checks found false rejections: suelo for soil; riesgo/peligro for the ordinary-language cues; asumir for supposing something true; examinar/estudiar for detailed analysis; and list-addition alternatives including sumar. The previously retained luchar card now accepts combatir for opposing the spread of disease. The medición cue now selects the act of measuring rather than every resulting dimension. One English example translation was corrected to match the Spanish subject and possessive. Source records and explanations were updated together, and semantic regressions cover both accepted overlap and distinct senses that remain rejected.

The assumption sense of asumir is explicitly recognized by [RAE DPD](https://www.rae.es/dpd/asumir); [suelo](https://dle.rae.es/suelo) includes soil supporting plant life, and [sumar](https://dle.rae.es/sumar) includes adding things or people, not only arithmetic. Full primary-source links and the correction log are in the evidence JSON. Tests verify curated decisions, not linguistic exhaustiveness; unchanged cards are not certified synonym-free.

Preview the corrections by reloading /lemmas/ and opening More info for tierra, suponer, agregar, analizar and luchar. Their Usage notes should show the corrected selected-use alternatives. The soil alternative does not transfer to suelo's indoor-floor cue, and suponer does not transfer to asumir's responsibility cue. No progress was modified for this audit.

At that stage, the proposed $2 was a maximum budget for a new incremental recording batch, not a charge already made or a rerun of existing audio. The then-current inventory added one word (combatir): 177 comparison sentences and 102 accepted-answer words per voice. Using the previously documented rate gives an illustrative total near $0.60. Paid generation remains paused while content is reviewed.

Full Claude + Codex cross-check, November 5: all 1,250 later-day cards and 291 groups accounted for. Remaining answer omissions, valid-spelling retry friction, one confirmed translation distinction and source-link mismatches were identified. [Original reconciled audit and evidence](lemma-later-day-claude-audit.md). That audit stage made no curriculum edits. Its findings are now resolved in the [content resolution](lemma-later-day-resolution.md); recording generation remains deferred.

### 6 November 2026 — identical-cue consistency

The básico, cuarto and incremento policies now also accept esencial, pieza and subida/alza respectively, matching the existing fundamental, habitación and aumento policies with identical prompts and cues. Their selected-use notes are updated in the authored review JSON and regenerated runtime policy. Sources: [RAE esencial](https://dle.rae.es/esencial), [pieza](https://dle.rae.es/pieza), [alza](https://dle.rae.es/alza). Sentence acceptance is separately reviewed and now expanded as described in [the context review](lemma-context-sources.md#sentence-answer-review--6-november-2026); those additions must fit sentence agreement and sense. This supersedes earlier statements that context answers remain unchanged. Presentar/introducir, other audit findings and multiple-choice behavior are outside this correction's scope.

### 6 November 2026 — recognition follow-up

The preceding acceptance correction is committed as `27c492567d`. The separate [MCQ correction](lemma-choice-review.md) replaces unrestricted distractors with reviewed question sets. Alimento's learning/recognition definition is now **food; nourishment**, removing an inaccurate solid-only restriction. The [DLE entry](https://dle.rae.es/alimento) includes substances received for nutrition and the nutritive value of milk. The existing comida/alimento comparison already covers nourishment; its typed policy and audio are unchanged. The new teaching-meaning override is authored in the review JSON and compiled by `build-later-recall.mjs`.
