# Content maintenance

## Accepted authoring process

On 2026-10-18, the user accepted the initial work and authorized continued curriculum authoring with roughly the same source-comparison method, without reviewing every batch. Use lexical references to check intended senses, gender, plural forms and conjugations; check construction rules against grammatical references. Author contextual explanations and examples, and record exactly which claims have been checked. Do not describe generated candidates as corpus-attested or independently reviewed. Independent linguistic review can improve confidence but does not block local authoring under this authorization.

The full 16-unit content draft is authored; evidence, sentence/component checks and release review remain incomplete. Acceptance of the method does not establish linguistic accuracy by itself. The existing `approvedEntries` release gate and explicit commit/publication permissions are unchanged. Docs must distinguish authoring status, evidence status, and deployment status.

## Reporting an issue

`src/reports.js` provides local issue capture for starter and foundation lessons:

- Learning: open a translation popover, choose **More**, then **Report an issue** in the details overlay. The compact dropdown contains no report action.
- Recall: check or skip an answer first, then choose **Report an issue with this answer**. No report action reveals the answer before it is scored. Reporting does not undo a mistake or alter progress.
- Describe a suspected translation, explanation, form, or missing accepted-answer problem. **Save locally** appends the report in localStorage under `perlingo-content-reports-v1`. The store is shared across packs on the same origin, separate from learning progress.
- **Export this report** works without saving. Settings → **Content reports** → **Export saved reports** downloads all saved reports. Share the JSON file with the maintainer to request review. Nothing is automatically sent; there is no server inbox or cross-device synchronization.

Each report records a UUID, creation timestamp, open status, note, entry ID, language, pack ID/version (null version for legacy starter records), English prompt, taught answer, phase, and submitted answer when applicable. Structured entries retain translation/explanation and linked lexical snapshots; learning reports also retain the selected chunk. Snapshots preserve the reported values if content changes later. Reports can contain what a learner typed; avoid personal information and inspect exports before sharing.

A storage failure keeps the current note in the dialog and offers export. Invalid existing storage is not overwritten. Closing an unsaved report discards that draft. Saved reports remain saved after export; there is no deletion/resolution interface yet. Clearing browser storage removes them. Exporting learning progress does not include these separate reports.

## Correction process

1. Reproduce the issue from the report's entry, language, version, and snapshot. Distinguish a wrong answer from an unlisted valid alternative, regional variant, ambiguous prompt, or misleading explanation.
2. Compare the relevant lexical/grammar references; record the result and scope. A user report is a lead, not an automatic replacement value.
3. Correct every affected translation, word note, chunk, paradigm and accepted-answer list. Keep IDs for the same meaning; use a new ID if the sense changes so unrelated progress is not inherited.
4. Bump affected pack versions when content changes, update evidence snapshots only after rechecking changed facts, and add a targeted regression check. Update current documentation in the same change.
5. Run tests and content validation and present the local correction for approval. Record resolution against the report ID when maintaining an external issue record. Commit and publication still require the user's authorization.

Unchanged meanings keep browser progress; content corrections do not currently invalidate or reschedule it automatically. A future migration must handle meaning changes explicitly.
