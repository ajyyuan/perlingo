# Account data requests

Maintainer procedure for requests sent to reports@perlingo.app. This is a documented procedure, not an automated feature. The dependency order passed a synthetic PostgreSQL 16.8 rehearsal using repository application SQL and a minimal auth stub. Full GoTrue/Auth admin API behavior was not exercised. Do not test it on real users.

## Verify and scope the request

Verify the requester controls the relevant account using a trusted account channel. Never request a password, refresh token or provider verification code. Resolve the exact Supabase user UUID and linked identities; Apple private-relay and Google accounts may be separate. Confirm whether the request concerns progress, reports or the whole account. Record only the minimum request/audit information needed; do not copy progress or credentials into logs.

For access requests, use the app's Progress export where sufficient. Recovery exports contain both the device and cloud snapshots and must be handled as private data. Use authenticated maintainer access for other records and send results only through an agreed private channel after ownership verification.

## Whole-account deletion preparation

Inspect the deployed schema, not only these source files. Count target progress rows, reports, associated notification rows and admin membership. Identify any additional dependencies before proceeding. If the target is the sole maintainer/admin, resolve the intended ownership outcome before deleting it. Do not silently create replacement admins.

Prepare and review a transaction scoped to the verified UUID. The current dependency order is:

1. Delete report notification rows joined to reports owned by the target user.
2. Delete the target user's content reports.
3. Delete the target user's report_admins membership, if applicable.
4. Delete the matching auth user with a reviewed privileged account-deletion procedure; public.progress cascades on auth-user deletion.

`content_reports.user_id`, `report_admins.user_id` and `report_notifications.report_id` do not have cascading deletes. Deleting only the auth user can fail. Do not run broad or email-substring deletes. Prefer one reviewed transaction covering relational cleanup and auth deletion; if using the Auth admin API separately, document the non-atomic boundary and reconcile failures rather than claiming full completion. Coordinate concurrent report submissions and queued/in-flight notification workers before executing; deleting a queue row does not retract an email already sent.

Before production use, rehearse the chosen procedure in an isolated disposable Supabase environment: create a synthetic user with progress, report, notification and optional admin membership, plus an unrelated control user. Verify the target dependencies disappear, the control user's records remain, and rollback/error handling behaves as intended. Then obtain explicit authorization for the particular real deletion. This document does not authorize execution.

## Completion and limitations

Confirm no target rows remain in the applicable live tables and that the auth account is gone. Document any failures or retained records accurately. Provider sessions/access tokens, logs and backups require their own handling under provider capabilities and retention rules; do not promise instantaneous revocation or erasure everywhere. Recheck current Supabase guidance before execution.

Tell the requester to clear Perlingo site data on each browser/origin and delete any downloaded exports they no longer want. Server deletion cannot remove browser-local drafts or downloads. Signing in again can create a new account and offer to upload retained device progress. Revoking Google/Apple access alone does not erase Perlingo data. Direct support emails and already-delivered report-ID notifications are separate from the database cleanup and need explicit retention/deletion consideration.

Related implementation: supabase/schema.sql, supabase/content-reports.sql, supabase/report-notifications.sql. Public wording: privacy.html. Current account verification: accounts.md.

## Rehearsal evidence — 2026-10-19

`supabase/verify-account-deletion.sql` passed in an isolated local PostgreSQL database with no network worker. Direct auth deletion was rejected, ordered cleanup and progress cascade passed, an unrelated control user remained, and savepoint rollback restored all target relations. Fixtures were rolled back and the server stopped. Application tables/functions/queue trigger came from repository SQL; auth.users contained only id and auth.uid was stubbed. This proves relational dependency handling, not provider sessions, GoTrue internals, backup erasure or production deletion authorization.
