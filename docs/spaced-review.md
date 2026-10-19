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

For example, learned on day 1 → review on day 5 → review on day 37 → graduate. Gaps are measured from the actual day of the attempt, including delayed reviews. First-attempt statistics are retained for new material, but scheduling starts at +4 after its required perfect pass regardless of earlier misses. After submission, the revealed correct answer offers Quick meaning and pronunciation/grammar help without changing the recorded result. Any future help before submission must count as assisted, equivalent to a miss.

## Persistence and migration

The plan freezes when started. The active phase, shuffled queue, position, typed input, feedback, first attempts and round statistics are saved in the bank's existing guest localStorage key, or an isolated account/pack draft when signed in. Reload or exit offers Resume day. Settings/unit changes apply to the next plan, not an unfinished batch. Completing a phase applies its scheduling once and records a session; finishing all planned phases advances the day once. Review and new phases have separate history records. Session accuracy includes new-material retries.

Existing elapsed-time history migrates once to `srsVersion: 2`, starting at app-day 1. Original pair records are retained as `legacyHistory` in storage and exports. Already overdue pairs become due on app-day 1; others on day 5. All start at stage 0, with counts preserved and no inferred graduation. Settings and completed session records remain. Clock time is used only for this migration and journal dates/durations, not ongoing due scheduling. Legacy elapsed-time helpers in `engine.js` are retained for compatibility/tests but are not used by the app.

Guest storage is browser-local and origin-specific. The local C8 integration optionally syncs signed-in progress once Supabase is configured; [live setup and validation](accounts.md) remain pending. The course, foundation and starter retain separate histories and app-day counters. The active batch is saved on each answer/input/navigation; unavailable browser storage shows a warning.

## Verification and acceptance

Automated tests cover the complete 4/32/graduation lifecycle, misses at either stage, overdue overflow, the 108 limit, whole-concept admission, nine-concept maximum, selected units/languages, migration preservation and serialization.

Browser smoke testing on an isolated local origin confirmed: a missed Spanish review completes without retry; reloading restores its feedback; only unseen German receives learning cards; a missed German answer requires another round; a perfect second round advances day 10 to day 11. Real user progress was not changed by the fixture.

Acceptance steps:
1. Start a due review. Miss an answer: see the correction and “Returns in 4 app-days”; finish without a retry round.
2. Continue to new material. Only unseen languages receive learning cards. Miss one recall answer and verify the whole new-material round repeats until perfect.
3. Reload mid-question or after feedback. Resume day should restore the same position and answer state.
4. Finish both phases: advance exactly one app-day. A review-only day also advances; calendar waiting does not.
5. With more than 108 due pairs, admit exactly 108 and no new material; remaining reviews carry over.

The original SRS flow is published. Local C7 feedback/help and C7.5 restart behavior are not yet included in `dist/`.


## Restart day (C7.5)

Implemented and approved for publication on 2026-10-19; included in the release package. **Restart day** in the header is available while a production app-day is unfinished, including its resume/home screen and the pause after completing reviews. It is hidden during optional contrast/transfer practice and after a day is fully completed. The confirmation explicitly says today's answers and completed review results will be cleared; Cancel leaves them intact.

Confirming restores the starting history for the frozen day's planned pairs, removes that day's production phase journal entries, and resets its answers, draft input, feedback, first attempts, round counts, and timer. It retains the same review/new pairs, selected languages, unit, overflow, and app-day number. Review days begin again in recall; new-only days return to the first learning card, followed by the existing Ready screen. Recall order may reshuffle. Earlier days, other pairs, settings, and optional practice journal entries remain intact. Restarting or reloading repeatedly does not count completed reviews twice. Current audio and overlays close on restart.

`planDay` saves `restartHistory` for its planned pairs, including null entries for unseen pairs. This checkpoint persists with the unfinished day and is discarded when the day finishes. Existing saved days gain a checkpoint when still in review or when they contain only new material. If an old day already completed its reviews without a checkpoint, the restart control is withheld: the original SRS records cannot be reconstructed reliably. Finish that day normally; subsequent days support restart. Completed days are not reopened by this feature.

Validation adds regression coverage for rolling back a completed review phase, retaining the frozen batch and earlier/optional practice history, replay scoring without double counting, repeated restart, serialization, new-only/review-only days, and safe handling of older saved batches.

Local testing at http://127.0.0.1:5173:
1. Start or resume a day, answer a question, then choose Restart day → Cancel. The question and answer should remain unchanged.
2. Choose Restart day and confirm. Expect the first learning card for a new-only day, or the beginning of review recall when reviews are scheduled. The day number and material should be unchanged.
3. Reload and resume: the restarted state should persist, without old feedback or attempts.
4. On a mixed day, finish reviews, then restart before completing new material. Reviews should be due again, and their superseded journal entry should disappear. Complete them again and verify only one set of review results is recorded.
5. Finish the whole day. Restart day should disappear until another day is started. Verify Settings and earlier progress remain intact.

These actions intentionally replace the current unfinished day's attempt; test on a disposable browser profile if you want to preserve that attempt.
