# Content maintenance

## Accepted authoring process

On 2026-10-18, the user accepted the initial work and authorized continued curriculum authoring with roughly the same source-comparison method, without reviewing every batch. Use lexical references to check intended senses, gender, plural forms and conjugations; check construction rules against grammatical references. Author contextual explanations and examples, and record exactly which claims have been checked. Do not describe generated candidates as corpus-attested or independently reviewed. Independent linguistic review can improve confidence but does not block local authoring under this authorization.

The full 16-unit content draft is authored; evidence, sentence/component checks and release review remain incomplete. Acceptance of the method does not establish linguistic accuracy by itself. The existing `approvedEntries` release gate and explicit commit/publication permissions are unchanged. Docs must distinguish authoring status, evidence status, and deployment status.

## Reporting an issue

`src/reports.js` captures content snapshots and submits reports to the private Supabase inbox. Sign-in is required to send; learning remains available to guests.

- Open **Report an issue** from Grammar, or after checking/skipping a recall answer. Reporting does not change scoring or progress.
- **Send report** submits the note and snapshot to the server. Success appears only after an acknowledged report ID. Failed requests keep the draft in the dialog for retry; retries reuse the same ID and frozen note to avoid duplicate or changed submissions. Closing the dialog discards the draft. **Export this report** remains available as a fallback.
- New reports are not saved to localStorage. Settings → Content reports → **Export older local reports** preserves access to legacy reports; these are not automatically uploaded.
- Reports include a UUID, note, content version, entry, taught answer, selected chunk, explanation/lexical snapshot, and submitted learner answer when applicable. Avoid personal information. The server records the authenticated reporter ID and receipt time.
- The owner opens **Settings → Account → Content inbox**. The inbox shows 25 reports per page, newest first, with full snapshots and Open/Reviewed/Resolved controls. These statuses track investigation, not automatic content corrections.

### Access and setup

`supabase/content-reports.sql` was applied to Perlingo on 2026-10-19. Reports and admin membership have RLS enabled and no direct learner read/write grants. Authenticated submission uses a security-definer RPC with payload limits, ten reports per account per hour, an atomic per-account lock, and UUID deduplication. Admin listing/status RPCs check the private `report_admins` table on every request. UI visibility is not the security boundary. Admin access is granted only to the verified owner account `efbdb8cb-d187-4a9d-81dd-02be20f40162` (Google-linked andrewjyuan@gmail.com). An unrelated Apple private-relay account does not inherit admin rights.

`supabase/verify-content-reports.sql` passed live for submission, retry deduplication, status updates, non-admin isolation, direct-table denial, and guest denial. Its test reports were rolled back. The owner’s existing Google session was restored in the local preview and Settings → Account → Content inbox successfully loaded the empty live inbox. Email notifications are configured as described below; full report contents remain in the private inbox. The frontend is a local preview until approved for publication.

## Correction process

1. Reproduce the issue from the report's entry, language, version, and snapshot. Distinguish a wrong answer from an unlisted valid alternative, regional variant, ambiguous prompt, or misleading explanation.
2. Compare the relevant lexical/grammar references; record the result and scope. A user report is a lead, not an automatic replacement value.
3. Correct every affected translation, word note, chunk, paradigm and accepted-answer list. Keep IDs for the same meaning; use a new ID if the sense changes so unrelated progress is not inherited.
4. Bump affected pack versions when content changes, update evidence snapshots only after rechecking changed facts, and add a targeted regression check. Update current documentation in the same change.
5. Run tests and content validation and present the local correction for approval. Record resolution against the report ID when maintaining an external issue record. Commit and publication still require the user's authorization.

Unchanged meanings keep browser progress; content corrections do not currently invalidate or reschedule it automatically. A future migration must handle meaning changes explicitly.

## Email notifications — active

The owner approved `reports@perlingo.app` forwarding to `andrewjyuan@gmail.com`, plus notifications for new reports. On 2026-10-19, Cloudflare confirmed an active routing rule to the verified Gmail destination. Its three MX records, root SPF, and DKIM were added; existing Resend `auth.perlingo.app` sending records were preserved. A live report notification arrived in Gmail’s inbox at 17:12 EDT. Direct messages to this forwarding address reach Gmail; they do not automatically become app reports.

Deployed files: `supabase/report-notifications.sql` and `supabase/functions/report-notifications/`. The SQL queues new report IDs transactionally, leaving report submission independent of email availability. The worker sends a fixed notice through Resend from `noreply@auth.perlingo.app` to `reports@perlingo.app`. The email includes only the report UUID and instructions to open Settings → Account → Content inbox; no learner identity, note, or answer is emailed.

Delivery uses leased batches of five and a stable Resend idempotency key. Failed sends retry with exponential delays, up to eight attempts and a 20-hour age limit (inside Resend’s 24-hour idempotency window). Provider acceptance is recorded separately from inbox delivery. Exhausted notifications remain in the private queue for operator inspection; content reports remain available regardless. Client roles cannot access the queue or worker RPCs.

### Configuration and operation

- `RESEND_API_KEY` and `REPORT_WORKER_TOKEN` are stored only as Supabase server secrets. The active Resend key is **Perlingo report notifications v2**, sending-only for `auth.perlingo.app`. The unused first key was deleted with explicit owner approval. Temporary credential files were removed after configuration.
- Vault contains `report_worker_token` and `report_gateway_anon_key` (the public legacy anon JWT). Supabase’s built-in gateway JWT verification remains enabled, and the handler additionally requires the private `X-Report-Worker-Token` header.
- `supabase/activate-report-notifications.sql` activates the named `perlingo-report-notifications` cron job every minute. The dispatcher makes no HTTP call when there is no due work. Historical reports are not automatically queued.
- Inspect `public.report_notifications` in the project dashboard for acceptance, attempts, and failures. `sent_at` means Resend accepted the email, not that Gmail received it. Check provider/forwarding logs if delivery is missing. Retrying jobs older than the 24-hour provider deduplication window may duplicate emails; inspect provider history first.
- To pause delivery, set the named cron job inactive in Supabase Cron. Reports will continue to be accepted into the inbox and queued.

### Verification

`supabase/verify-report-notifications.sql` passed live for enqueue, exclusive leases, failed-send retry, acceptance recording, and client access denial; those synthetic rows rolled back without sending mail. Local validation: 117 tests pass, including stable idempotency keys, fixed recipients, provider failures, and database acknowledgement failures.

Live end-to-end test `88f5b2a5-adcc-4bba-907f-13a9bb3d5ad2` was submitted through the report RPC and delivered on its first attempt. Resend acceptance ID: `01a15602-7e5e-71b9-85b9-e1ee098f4154`. Gmail confirmed the matching report ID in an inbox message addressed to `reports@perlingo.app`. The clearly labeled setup report was marked resolved and retained as evidence.
