# Day 1 clarity — local preview, October 30, 2026

Implemented locally for user testing. Not committed or published. This supersedes the earlier paused prototype and draft-only statuses; those reports retain historical wording and are not the runtime authority.

All first 250 typed headword prompts now use the reviewed definitions and contextual cues. There are 76 cards with explicit additional answers (98 assignments). Acceptance is local to the full prompt; no synonym inference or transitive expansion occurs. Sentence-context answer banks and later-day typed policies are unchanged. Recognition uses the teaching card’s meaning, including the corrected/expanded meanings below; it does not accept Spanish synonym answers.

One-word instructions are visible. Verbs request the infinitive; a Spanish blank requests the form that fits it. Other prompts use the dictionary form unless specified. Correct alternatives receive “Also correct” and identify the card’s target word. A valid alternative still counts as correct under the existing pass rules; this is translation correctness, not proof of separately recalling both synonyms. Existing queues, drafts, first-pass scores and submitted feedback are preserved rather than retroactively rescored. Reload to get new prompts; restart only if you want a fresh pass.

## Pues resolution

The university-hosted [Miche paper](https://www.unige.ch/clf/fichiers/pdf/03-Miche_nclf15.pdf), pp. 52–53, §1.1, was downloaded and extracted locally with PDFKit. It explicitly marks the fronted causal construction unacceptable. Thus row 18 excludes causal pues from the reason-first blank, while retaining porque. This does not forbid sentence-initial discourse pues, discussed separately by the paper. Retrieval and file hash are recorded in the alignment evidence. The former unresolved-source status is closed.

## Teaching alignment

The combined rendered meanings, patterns and tips for all 250 cards were reviewed against the selected uses. Every card now has selected-use guidance under a compact **Meaning & usage** disclosure, available on study/search cards, standalone notes and More info. This guidance remains outside recall until after submission. It contains the selected sense, contextual usage and relevant overlap explanation; it is not a new scored lesson or sentence-chunk bank.

Fourteen main meanings were corrected/expanded: suyo, saber, hablar, creer, llamar, tuyo, caso, vivir, punto, presentar, mientras, nivel, lograr and información. Broader senses are retained. Explicit construction examples cover know-how, debt, speaking a language, belief in existence, telephone calls, police cases, federal states, residence, dots, introductions, waiting, sporting matches, beginning, bank accounts, levels and lograr + infinitive (e.g. lograr terminar).

The frozen deck, base notes and sentence-context files remain byte-for-byte unchanged. A curated overlay in `day1-teaching-data.js` aligns the combined teaching layer. Before values and applied supplements are recorded for every row in `data/spanish-lemmas/day1-teaching-alignment.json`. Runtime prompt data is `recall-policy-data.js`; the reviewed proposal JSON records the final local wording.

Teaching-contrast follow-up: the initial overlay explained accepted overlap but omitted explicit comparisons on several distinct-answer cards. All 60 reviewed groups now have source-linked comparison text in `data/spanish-lemmas/day1-teaching-contrasts.json`, rendered on each of their 212 member cards under Meaning & usage. This covers practical tendencies, shared uses and distinct constructions; the remaining 38 cards retain selected-use guidance. Accepted answers are unchanged by this follow-up. Regression coverage checks both data membership and rendered comparison text.

## Local testing

Open <http://127.0.0.1:5183/lemmas/> and reload.

1. Search for **ser**, **saber**, **por**, **dejar** or **tras**. Open Meaning & usage and check the explicit comparison with related words. Also check **lograr** for overlap with conseguir/obtener. The existing forms and examples remain available.
2. Continue the Day 1 typed test. Check the short contextual line and one-word instruction. On a matching prompt, try **solamente** for only, **enseñar** for show, or **conseguir** for manage to. Expect Also correct and the target lemma.
3. Check real distinctions: **pues** should not pass the reason-first como blank; **obtener** should not pass the direct-infinitive lograr prompt; **estar** should not pass the identity ser prompt.
4. Reload an unfinished test to confirm it resumes. Existing scores are retained, not recalculated.

Validation: the full suite initially passed 408/409; the sole failure was the old “long form” wording assertion, updated to the reviewed “stressed form” wording. The affected eight tests then passed. Content/syntax checks and diff whitespace checks passed. Browser verification covered preserved test feedback, Also correct with the target lemma, search, expanded main meanings and usage details. No microphone or real-account progress was modified for verification.

Static build validation passed using the existing production audio-host setting; packaged prompt and teaching modules match their sources. The initial full-audio copy was stopped and replaced by this standard lightweight build. Local preview audio configuration is unchanged.

Teaching-contrast follow-up validation: all six Day 1 regression tests passed, including rendered coverage for every member of the 60 groups; syntax and whitespace checks passed. Browser verification confirmed the new ser/estar comparison in the expanded Meaning & usage disclosure on the local search card.
