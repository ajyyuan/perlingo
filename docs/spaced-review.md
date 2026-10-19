# App-day spaced review

## Day planning

`src/app-days.js` plans each production day. An app-day advances only when its planned review and new-learning phases finish, including review-only days. Calendar time does not advance it. Empty days offer an explicit Finish day action, so future reviews remain reachable after exhausting new material. Contrast and transfer practice do not advance app-days or change review schedules.

Each day has at most **108 planned concept/language answers**. Spanish water and French water count separately. Due reviews take priority across all units, oldest due first (then concept ID and language for ties). Overflow remains due for the next app-day. Remaining capacity admits up to nine new concepts from the selected unit, using category targets and authored noun/verb/grammar/sentence order. All unseen enabled languages for a concept must fit together. New material shrinks or pauses under review pressure. Disabled languages retain their progress but are omitted from new plans.

Review starts directly in recall, with no translations or learning cards beforehand. Each pair gets one attempt; a miss shows its correction and never triggers another review round. After reviews, the learner explicitly continues to learning cards for the day's new pairs, then the Ready screen and recall. New material requires one perfect whole round; any miss requires another shuffled full round of only the new material. Thus **108 limits planned questions, not total attempts including new-material retries**.

## Schedule

Schedules are independent per concept/language:

| Event | Result |
| --- | --- |
| Finish new learning with a perfect round | First review in 4 app-days (stage 0) |
| Correct first review | Next review in 32 more app-days (stage 1) |
| Correct second review | Graduate (stage 2); no further automatic reviews |
| Miss either review, including I don’t know | Reset to stage 0; review in 4 app-days |

For example, learned on day 1 → review on day 5 → review on day 37 → graduate. Gaps are measured from the actual day of the attempt, including delayed reviews. First-attempt statistics are retained for new material, but scheduling starts at +4 after its required perfect pass regardless of earlier misses. Recall has no help popovers; any future help must count as assisted, equivalent to a miss.

## Persistence and migration

The plan freezes when started. The active phase, shuffled queue, position, typed input, feedback, first attempts and round statistics are saved in the bank's existing localStorage key. Reload or exit offers Resume day. Settings/unit changes apply to the next plan, not an unfinished batch. Completing a phase applies its scheduling once and records a session; finishing all planned phases advances the day once. Review and new phases have separate history records. Session accuracy includes new-material retries.

Existing elapsed-time history migrates once to `srsVersion: 2`, starting at app-day 1. Original pair records are retained as `legacyHistory` in storage and exports. Already overdue pairs become due on app-day 1; others on day 5. All start at stage 0, with counts preserved and no inferred graduation. Settings and completed session records remain. Clock time is used only for this migration and journal dates/durations, not ongoing due scheduling. Legacy elapsed-time helpers in `engine.js` are retained for compatibility/tests but are not used by the app.

Storage is browser-local and origin-specific, without account sync. The course, foundation and starter retain separate histories and app-day counters. The active batch is saved on each answer/input/navigation; unavailable browser storage shows a warning.

## Verification and acceptance

Automated tests cover the complete 4/32/graduation lifecycle, misses at either stage, overdue overflow, the 108 limit, whole-concept admission, nine-concept maximum, selected units/languages, migration preservation and serialization.

Browser smoke testing on an isolated local origin confirmed: a missed Spanish review completes without retry; reloading restores its feedback; only unseen German receives learning cards; a missed German answer requires another round; a perfect second round advances day 10 to day 11. Real user progress was not changed by the fixture.

Acceptance steps:
1. Start a due review. Miss an answer: see the correction and “Returns in 4 app-days”; finish without a retry round.
2. Continue to new material. Only unseen languages receive learning cards. Miss one recall answer and verify the whole new-material round repeats until perfect.
3. Reload mid-question or after feedback. Resume day should restore the same position and answer state.
4. Finish both phases: advance exactly one app-day. A review-only day also advances; calendar waiting does not.
5. With more than 108 due pairs, admit exactly 108 and no new material; remaining reviews carry over.

Approved for production publication. `dist/` mirrors the application source.
