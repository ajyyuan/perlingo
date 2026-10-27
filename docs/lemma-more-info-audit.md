# More info audit — 27 October 2026

Scope: the local replacement of study/lookup-card Full notes with supplemental More info, across all 1,500 merged course notes. This is a UI/content-retention audit, not a fresh linguistic certification of the Spanish course.

## Findings and fixes

The initial compact popup omitted the original example list. Retaining only the top-level grammar tags did not retain all sentence-specific explanations: 6,286 chunk references across the merged examples point to concepts outside their note's top-level tag list. All 369 verbs also have an original contextual example without a top-level tagged concept in that sentence. Those explanations/examples still existed in standalone notes, but the compact popup no longer exposed them.

Restored all original examples in a collapsed Usage in context disclosure, with word meanings, course-card links, contextual Grammar actions and whole-sentence pronunciation. This avoids a permanently repeated example list while retaining access to the original teaching material. Kept the supplemental popup's pronunciation status quiet; its word heading remains a clickable pronunciation control.

## Checks and limits

- Rendered supplemental markup for every merged note: 1,500 records, including 369 verbs.
- Verified every top-level and sentence-level grammar reference resolves, every original example retains its translation and sentence speaker, and extra usage prose is preserved. Original verb patterns/tips remain in More info; nonverb patterns/tips remain on the main card.
- Confirmed no definition block, conjugation table, tense selector or legacy musical-note speaker is present in supplemental markup. No notes lacked both extra prose and grammar tags. Exact duplicate prose is suppressed; this is not a claim that semantically similar prose has been exhaustively rewritten.
- Verified personal-note markup escapes user text. The existing storage key, per-word IDs, merge-before-save logic and error handling are unchanged. Browser verification opened My note without changing the user's notes; persistence was inspected in code, not tested by overwriting user data.
- Browser checks: nonverb se popup, both disclosures, word help via keyboard, sentence-specific Grammar action, correct explanatory dialog. Earlier prototype checks covered hacer and its top-level grammar link. Found and fixed a focus-return issue: closing sentence grammar tried to focus its link inside a hidden word popup. It now returns focus to the visible sentence word; top-level grammar still returns to its originating button. Responsive sizing is unchanged (viewport-limited width/height with scrolling); no claim of exhaustive device testing.
- Original four assessments, progress and source datasets are unchanged. Standalone notes and the separate forms prototype retain their comprehensive views.

Regression coverage: tests/lemma-more-info.test.js renders all course popups and checks retention, valid grammar links, nonduplicated forms, source URL and safe personal-note output. Run npm test and npm run check. Approved and committed locally; not published.
