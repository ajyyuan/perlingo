# Optional accounts and progress sync (C8)

Status: Google/Apple-only sign-in is published at https://perlingo.app/ (Sites version 13, `ca63c71`). Both providers are enabled; email/password/code login is disabled. Google audience is In production and verified branding is published. Existing sessions and progress are preserved.

Supabase database isolation tests and the earlier Resend email delivery test passed. Those results do not verify social login. The user completed Google sign-in; Supabase shows a linked Google identity on the existing account and the local session survives reload. Apple end-to-end sign-in on the production root and persistence after page reload were verified on 2026-10-19. Phone/computer sync, conflict recovery and real forced token refresh passed as recorded below; a long-duration automatic-refresh soak is not claimed.

## Persistent sign-in

The official Supabase JavaScript client is bundled locally in `src/vendor/supabase.js`. It uses `persistSession: true`, `autoRefreshToken: true`, and a stable `perlingo-auth-v1` browser storage key. Settings offers only Sign in with Google and Sign in with Apple. Credentials are managed by the SDK and are not included in progress exports or database snapshots. OAuth uses PKCE and SDK callback detection. Redirects return to the current page, retaining the pack query while removing old callback parameters and fragments.

The desired project settings are Supabase's defaults: no maximum session lifetime, no inactivity timeout, and no single-session restriction. Keep the normal short-lived access tokens and refresh-token rotation/reuse protections; persistent sign-in is achieved by refreshing tokens, not by issuing long-lived access tokens. Signing out uses local scope, so it signs out this browser without signing out other devices.

Users can remain signed in through reloads and browser restarts. Clearing site storage, private browsing cleanup, revocation, or provider security actions can still end a session; “always signed in” cannot be guaranteed. Browser storage is origin-specific: moving from the old Sites URL to perlingo.app requires signing in there. Failed progress requests do not explicitly sign users out. The SDK controls expired/revoked-token handling.

References: [Supabase sessions](https://supabase.com/docs/guides/auth/sessions), [passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Progress ownership and conflicts

Guest keys remain unchanged. Account drafts are separate by user ID and pack: `perlingo-account-v1:<user-id>:<course|foundation|starter>`. Signing out returns to the original guest progress; it does not copy account history into the guest key. Account drafts remain on that browser for the next sign-in. Content reports are separate from progress sync: signed-in submissions go to the private report inbox; drafts and older reports remain local.

On first connection for a pack, the account starts with a copy of guest progress. Settings asks before uploading it. If cloud progress exists, the user chooses either the device or cloud copy. Nothing is silently merged. Each snapshot includes settings, SRS history, session journal, unfinished-day state, legacy migration data, and restart checkpoints.

Local edits are saved immediately and scheduled for sync after 800 ms. Sync also retries every 30 seconds while visible, on reconnect, and on returning to the page. **Sync now**, recovery export, and sign-out are available under Settings → Account → Manage account. Account identity and sync status remain visible, and pending upload/conflict choices are never hidden in the disclosure. A cloud change always prompts a choice, even if the local copy was clean, so downloading cannot interrupt an active lesson. Choosing cloud returns to the home/resume screen. Continuing to learn while a choice is pending saves local edits without uploading them.

The server stores one versioned JSON snapshot per user/pack. `save_progress` uses an atomic expected-revision check. Concurrent writes, lost network responses, or newer cloud progress produce a choice instead of silent overwrite. Choice actions re-read the revision before proceeding. SRS histories and restart results are never merged by wall-clock timestamp.

Before a choice, the previous device and observed cloud snapshots are saved in a local `:recovery` record. **Export recovery copy** downloads that record; it contains no authentication tokens. This is one latest recovery checkpoint, not a historical backup archive. The app does not yet have a recovery-file import UI; restoring an exported snapshot requires a maintainer-assisted local restore. Regular Progress → Export also exports the currently displayed progress. If another tab has changed the same local draft, sync pauses and asks for a reload rather than overwriting that draft. Export this tab first if its unsaved changes are needed.

## Configure a project

1. Select a Supabase project. The connected Perlingo project is identified below; no billing or publication changes are part of this setup.
2. Run `supabase/schema.sql` in that project's SQL editor. It creates a private `progress` table, enables RLS, grants authenticated users read access only to their own rows, and restricts writes to the revision-checking RPC. Anonymous users have no progress access. The security-definer RPC derives ownership from `auth.uid()`; the browser never chooses an owner ID.
3. Configure Google OAuth credentials in Google Cloud and the Supabase Google provider. Configure Apple using an Apple Developer account, a Sign in with Apple App ID, Services ID, and signing key/client secret. The web client secret needs renewal at least every six months. Use `https://buuxjzibgblnlmfafpny.supabase.co/auth/v1/callback` as the provider callback. Keep secrets in provider dashboards only.
4. Add exact app return URLs (including supported pack queries) to Supabase's redirect allowlist, starting with `http://127.0.0.1:5173/`. Add the production origin only when deployed. Keep session duration/inactivity limits and single-session enforcement disabled; retain refresh-token protections.
5. Set `providers.google` or `providers.apple` to true only after that provider is configured and ready for live testing. After a replacement provider works, disable Supabase Email login, leave Phone/anonymous/other providers disabled, and verify direct OTP/password requests are rejected. Removing the form alone does not enforce the policy. Existing email sessions are not revoked by this UI change; preserve progress during migration.
6. Run the checks and live acceptance steps below. The schema has been executed in the Perlingo project. `supabase/verify.sql` passed with temporary users inside a rolled-back transaction: own reads/writes work, cross-user access and anonymous access are denied, direct updates are denied, and stale revisions are rejected. Actual SDK sign-in and two-device requests remain to be tested.

The browser SDK is checked in so ordinary preview needs no dependency install or external script CDN. To rebuild it, run `npm ci` and `npm run build:auth`. `package-lock.json` pins the dependency tree. Bundled dependency licenses are under `src/vendor/`.

## Verification

`npm test` passes 117 tests, including persistent-session options, restored account identity, refresh without lesson reset, sign-out returning to guest, explicit first-upload consent, cloud/device choice, recovery copies, cached account restoration, offline edits and retry, competing-device revisions, writes racing with edits, stale callbacks after disposal, account/pack separation, same-browser tab interference, and malformed cloud progress. `npm run check` validates syntax and lesson data. These are local tests using a fake remote, not evidence of working live authentication, SQL permissions, email delivery, or mobile session persistence.

Guest preview: open http://127.0.0.1:5173, then Settings → Account. Signed-out Settings should show only Google and Apple buttons (disabled while setup is pending), with no email or code fields. Existing lessons, restart, audio, and exports remain available.

For live provider verification, with test accounts and exported progress backups:

1. Sign in separately with Google and Apple, verifying callback errors and cancellation as well as success. Choose device progress; verify the guest storage key remains intact. Reload and quit/reopen the browser: sign-in should persist without another code.
2. Leave the session through an access-token refresh interval; confirm renewal and that progress continues to sync. Verify the project has no inactivity or maximum-session limits.
3. On another browser, sign in to the same account and choose cloud progress. Resume an unfinished day, including feedback and restart checkpoint.
4. Make different progress on two devices, including offline edits. Sync and choose each conflict direction in separate trials. Verify no silent overwrite or double-counting of SRS reviews. Export the recovery copy.
5. Sign out on one browser. It should show the original guest data; the other browser should remain signed in. Sign into a different account: it must not inherit the previous account's draft.
6. Verify with unauthenticated and second-user requests that the table and RPC cannot read or write another user's progress. Verify a stale revision returns null and cannot overwrite a newer version.
7. Test OAuth cancellation, failed callback exchange, unavailable storage, revoked sessions, and offline reload. Verify current progress remains recoverable and status never claims a successful sync after failure.

No live Supabase resources are required to keep using the existing guest app.


## Earlier email setup evidence (2026-10-19; superseded login method)

- Project: Perlingo, free plan, East US (Ohio), `buuxjzibgblnlmfafpny`.
- `schema.sql` returned success. Role checks: RLS enabled; anon SELECT/execute false; authenticated SELECT/RPC true; direct UPDATE false.
- `verify.sql` returned PASS for ownership isolation, compare-and-swap conflicts, direct-write denial, and anonymous denial. All synthetic auth/progress rows were rolled back.
- Sessions UI: time-box 0 (never), inactivity 0 (never), single-session enforcement off; access tokens 3600 seconds; refresh reuse protection on with 10-second interval. These defaults were preserved.
- Custom SMTP now enables template editing on the free project. Both Confirm sign up and Magic link or OTP use subject `Your Perlingo sign-in code` and a body containing `{{ .Token }}`.
- Domain: Cloudflare confirmed `perlingo.app` registration on 2026-10-19. Resend account setup is complete and `auth.perlingo.app` has been added in the North Virginia region. With user approval, all three sender DNS records were saved in Cloudflare: TXT `resend._domainkey.auth` (Resend public DKIM key), DNS-only CNAME `rsend.auth` → `rsend.forge.rmta.net`, and DNS-only CNAME `send.auth` → `send.forge.rmta.net`, all with automatic TTL. Resend confirmed DNS and domain verification on 2026-10-19; the domain is ready to send. Receiving is disabled. The approved `Perlingo Supabase Auth` credential has sending-only access restricted to `auth.perlingo.app`. It is stored in Supabase SMTP, not in source code.
- SMTP: `smtp.resend.com`, port 465, username `resend`, sender `Perlingo <noreply@auth.perlingo.app>`. Supabase confirmed settings saved. Its default custom-SMTP rate limit is 30 emails/hour.
- The local app successfully requested one authorized sign-in code; Resend marked it Delivered. This confirms delivery-provider acceptance, not user inbox placement or completed sign-in.
- This email flow was subsequently replaced in the local UI by Google/Apple-only sign-in. SMTP remains configured; it is not used by the new sign-in buttons.

Provider setup references: [Google](https://supabase.com/docs/guides/auth/social-login/auth-google), [Apple](https://supabase.com/docs/guides/auth/social-login/auth-apple).

Historical initial OAuth setup (2026-10-19; superseded by the authorized public rollout below): With explicit user approval, the dedicated Google Cloud project `Perlingo` (`perlingo-512119`) was created in `andrewjyuan-org`. The OAuth app configuration was created with Perlingo branding, the account owner's Gmail address as support/developer contact, and an external testing audience after the user approved Google's API Services User Data Policy. The approved web client `Perlingo Web (Supabase)` was created with the exact Supabase callback above. Its secret is stored in Supabase, not source files. Supabase confirms Google is enabled, with nonce checks retained and email required. The local Google button is enabled for testing. Supabase Site URL is `http://127.0.0.1:5173/` and its redirect allowlist contains `http://127.0.0.1:5173/**` to support lesson-pack queries. Publication setup (2026-10-19) sets the Site URL to https://perlingo-parallel.ayuan2.chatgpt.site/ and adds exact production return URLs for the root and the course, starter and foundation pack queries, retaining localhost development redirects. Production end-to-end OAuth testing remains pending. Google remains in Testing mode with `andrewjyuan@gmail.com` listed as its one test user. Apple Developer sign-in is complete and an existing Individual Apple Developer Program membership is confirmed, with renewal dated January 23, 2027. The user accepted the updated Apple Developer Program License Agreement, and Certificates, Identifiers & Profiles is now accessible. With user approval, primary App ID `app.perlingo` (Perlingo) and Services ID `app.perlingo.web` (Perlingo Web) were registered. Web authentication is saved using Perlingo as the primary App ID, domain `buuxjzibgblnlmfafpny.supabase.co`, and the Supabase callback above. The user completed Continue/Save; reopening the Services ID confirms Sign in with Apple is enabled. After restarting the browser, the Configure dialog confirmed the persisted domain and callback. Signing-key creation and Supabase configuration are complete as recorded below. Apple also reports a default-payment-method renewal issue, which has not been changed. Apple is enabled in Supabase and the local app. Google sign-in was confirmed at 16:04 local time on the existing account. Email login was then disabled and the signed-in local session and day 1 progress survived reload. Initial cloud upload still awaits the user’s choice.

Apple configuration completed on 2026-10-19: saved web callback verified after browser restart. Key `PMY643BZPC` (Perlingo Apple Auth) is restricted to Sign in with Apple for primary App ID `app.perlingo`. Services ID `app.perlingo.web` is configured in Supabase. The ES256 client secret was generated locally and stored in Supabase; it expires **2027-04-17 at 16:22 EDT** and must be replaced before then. The downloaded signing key is at `~/Downloads/AuthKey_PMY643BZPC.p8`; keep a secure backup outside the repository. No secret was added to source files. The local Apple button is enabled; Apple production login and page-reload persistence were subsequently verified in the D3 checkpoint below.

The sign-in buttons use locally hosted, unmodified official Google and Apple image assets, with accessible labels and equal heights. Asset provenance is in `src/assets/auth/README.md`. The existing Supabase OAuth actions are unchanged.

The verified owner account has a Content inbox button in Settings → Account. Admin membership is checked by the database; access is not based on browser settings or editable user metadata. See `docs/content-maintenance.md` for report submission and permission checks.


## D3 verification checkpoint — 2026-10-19

| Check | Evidence / result |
| --- | --- |
| Local regression checks | All 117 tests and `npm run check` pass. Fake-remote tests do not substitute for live tests. |
| Apple login | User completed production sign-in; desktop directly showed the private-relay identity after callback and reload. No Apple progress was uploaded. |
| Google login and initial transfer | Production login passed. The earlier localhost day 1 draft had not been uploaded; saved it, then explicitly selected that cloud copy on production. |
| iPhone resume | User confirmed Google login, cloud selection and day 1 lesson resume. |
| Offline conflict | User set phone sound off while offline. Desktop saved a newer revision ending with sound on. Phone reconnection preserved sound off and prompted a device/cloud choice. |
| Both choice directions | User kept the phone copy; desktop detected a conflict and selected cloud. Desktop directly showed sound off and saved status. Desktop then restored sound on; user selected cloud on phone and confirmed on. No lesson answers or SRS outcomes were deliberately changed. |
| Recovery export | Desktop downloaded `perlingo-recovery.json`; parsed file contains savedAt and both day 1 progress snapshots, with no access/refresh/provider-token fields. Export verified; the app has no recovery import UI. |
| Local sign-out isolation | Desktop returned to guest controls; user confirmed phone remained signed in and could sync. Desktop remains signed out. |
| Phone browser restart | User confirmed sign-in and successful sync after fully closing/reopening its browser. |
| Real token refresh | A temporary localhost diagnostic used the bundled SDK refreshSession against the existing local account: same account, changed access token, later expiry, and successful authenticated course-progress read. No tokens were displayed. Diagnostic removed afterward. This is a real forced refresh, not an elapsed-time automatic-refresh soak test. |

The reported unresponsive Sync now button on iPhone was clarified as a missed existing conflict message, not a confirmed sync failure. A separate synthetic probe showed a never-settling remote read suppresses later sync calls without feedback; this is not evidence that the phone encountered it. Browser automation also had confirmation-dialog failures and duplicate tabs; those were resolved without claiming those attempts passed.

### Google production readiness

Pre-rollout Console inspection (historical): External/Testing audience, one owner test user, and Publish app disabled with an explicit instruction to complete Branding. Name and contact information are set; homepage/privacy/terms URLs are blank. The Supabase callback domain is the sole authorized domain. Data Access contains no configured scope rows; a read-only request to the live Supabase authorize endpoint returned a Google redirect requesting only `email profile`, with the expected callback. Console declarations still need reconciliation before rollout. No Google settings were changed.

Local `about.html` and `privacy.html` now provide an introduction and privacy policy, with shared `src/public-pages.css` and links from Settings → About. They load without account scripts. The user approved these pages, including contact, retention and deletion-request wording, for commit/push/publication on 2026-10-19. Deployment and domain verification are tracked separately. The learning route remains `/`. Terms are optional for the Google branding step; no new terms agreement was added.

The authorized rollout below completed homepage/privacy publication on perlingo.app, ownership verification, runtime scope declaration and Google branding verification. The Supabase provider callback remains unchanged. Both branding URLs are live; the app remains at `/`.

Sources: [Google brand verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification), [Google audience guidance](https://support.google.com/cloud/answer/15549945?hl=en). Basic identity-only scopes have an exception to the usual Testing authorization expiry; do not infer a seven-day Perlingo session limit from Testing status alone.

### Local review and release checklist

1. Open http://127.0.0.1:5173/about.html; follow Privacy and Open Perlingo. Check narrow-screen readability and keyboard links.
2. Review privacy disclosures against account-client.js, progress-sync.js, reports and notification behavior. Confirm owner contact and manual data-request handling before approval.
3. In the local app, Settings → About should expose About Perlingo and Privacy policy; existing lesson navigation and account controls remain intact.
4. For an approved release, include `about.html`, `privacy.html` and `src/public-pages.css` in `dist/` alongside the refreshed application source. The approved package refreshes `dist/` with these files.
5. Real forced refresh passed; a long-duration automatic-refresh soak remains optional additional assurance, not established by this test. Public readiness also depends on domain delivery, approved public pages and Google configuration/verification. The user subsequently authorized commit, push, publication, custom-domain connection and Google branding setup on 2026-10-19.

Review follow-through: [account data-request procedure](account-data-requests.md) records verified ownership, dependent-row deletion order, isolated rehearsal requirements and local-copy/log/backup limitations. Dependency order passed the isolated PostgreSQL rehearsal described in the data-request procedure; no live-user deletion occurred. No user data was deleted. The live redirect requests `email profile`. Console declarations now match that runtime result; reference for Supabase basic identity scope configuration: https://supabase.com/docs/guides/auth/social-login/auth-google.


### Final technical checks

On 2026-10-19, `supabase/verify-account-deletion.sql` passed against disposable PostgreSQL 16.8 using the repository application tables, functions and report-queue trigger. A minimal auth.users/id and auth.uid stub replaced GoTrue's schema. The rehearsal proved direct deletion fails with dependencies, ordered deletion succeeds, progress cascades, an unrelated synthetic user remains intact, and rollback restores target records. All fixtures rolled back; database stopped afterward. This is relational verification, not a full Supabase Auth admin API rehearsal.

The pre-rollout inspection found no custom domain attached. The authorized rollout below subsequently connected perlingo.app to that same public project.


## Authorized public rollout — 2026-10-19

The user approved committing, pushing, publishing, attaching perlingo.app and completing Google branding. Commit `3b655ac0d8eb9f750ae93b9d150874321ea9fa2c` was pushed to GitHub and Sites source; Sites version 12 deployed successfully. Sites version 13 (`ca63c7152668d6eb1abbd6e560734a7a106d456e`) then deployed successfully and removes the introduction's obsolete Google Testing notice; both source commits were pushed to GitHub and Sites.

`perlingo.app` is attached to the existing public project as `appgdom_6ad6a4b890048191aea76d23d9816d1c`; Sites reports domain and TLS active. Cloudflare has DNS-only apex A records 162.159.143.30 and 172.66.3.26 plus the Sites/Cloudflare ownership TXT records. Existing mail records were preserved. Public introduction and privacy URLs load over HTTPS (the static host redirects .html paths to extensionless paths).

Supabase Site URL is now `https://perlingo.app/`. Exact root/course/starter/foundation return URLs were added, preserving old Sites and localhost redirects. Google sign-in completed on the new domain and showed the existing owner identity and cloud choice. Account cloud data is shared across domains; browser-local sessions and guest data are origin-specific. Use cloud progress when moving an existing account. Old guest-only progress requires export before migration; it is not automatically copied.

Google Search Console verified perlingo.app ownership through a TXT record. Branding now has homepage `https://perlingo.app/about.html`, privacy `https://perlingo.app/privacy.html`, and the owned domain alongside the existing Supabase callback domain. Only the observed email/profile runtime scopes were declared, as userinfo.email and userinfo.profile; no sensitive/restricted scopes. Audience is External/In production. Verification Center says data-access verification is unnecessary for these scopes; separate branding verification passed and Publish branding completed. Google explicitly confirms: “Your branding has been verified and is being shown to users.”


## Challenge accounts — local implementation

Status (2026-10-21): frontend published in Sites version 19. The separate Supabase schema and redirect allowlist are active. Live SQL checks and authenticated preview reads passed. A new Challenge OAuth round-trip and physical cross-device acceptance remain pending.

Challenge imports `account-client.js` / `account-config.js` and the same `perlingo-auth-v1` session. On the production origin, signing in/out is shared with Learning; the two progress models remain independent. `npm run dev` serves both apps at port 5173, with Challenge at `/challenge/`. The optional standalone port 5174 preview cannot share origin-local sessions with port 5173.

`supabase/challenge.sql` adds an RLS-protected `challenge_rounds` table keyed by user and round UUID, plus unique user/date. Authenticated users can select only their own rows; writes go through `claim_challenge_round` and `save_challenge_round`, deriving the owner from `auth.uid()`. Daily admission requires a successful online claim before word reveal. Date validity uses America/New_York. Completed results cannot be replaced; stale shorter partial snapshots are ignored. This enforces account attempt uniqueness, not anti-cheating: scoring/content remain client-side. Guests retain browser-only attempts.

The Challenge store caches by `pc-account-v1:<user-id>:` and uses separate per-round pending keys to avoid losing simultaneous tabs’ uploads. Requests time out after 15 seconds; pending records retry on reconnect, visibility, 30-second polling and Sync now. Per-answer dated progress and completed results include transcripts; no microphone recording is stored. Account changes dispose the old store and end active play. Guest history is not automatically copied to accounts. Challenge preferences stay device-local; Learning’s progress snapshots, consent/conflict handling and SRS are unchanged.

Activation:
1. Apply `supabase/challenge.sql` in the existing project, then run `supabase/verify-challenge.sql`. It uses synthetic identities and rolls back all fixtures.
2. Preserve the current redirect allowlist and add `https://perlingo.app/challenge/`, `http://127.0.0.1:5173/challenge/`, and standalone `http://127.0.0.1:5174/` if testing it. Existing 5173 wildcard may already cover the combined preview.
3. Verify signed-in Learning → Challenge uses the same identity; sign-in from Challenge returns to Challenge.
4. On two devices using the same account, begin the same dated challenge: only one may enter. Complete it and sync the other device; verify score, Review and Unlimited replay.
5. Complete Unlimited offline, reload and reconnect; verify one history entry uploads. Sign out, verify original guest history, then use another account and verify isolation. Confirm Learning progress did not change.

Verification: 193 local tests passed including five Challenge store tests (two clients, offline reload/retry, account/guest isolation, competing tabs, fail-closed admission). Disposable PostgreSQL 16 passed the migration and `verify-challenge.sql`: daily uniqueness, idempotent claim, completed result protection, RLS, direct-write/anonymous denial and deletion cascade. This used a minimal auth stub, not live Supabase Auth. No real user records were changed.

Browser check: the same-origin 5173 Challenge preview restored the existing Learning identity without another login. It displayed “Account · Not synced” while the migration was unavailable. Signed-out 5174 preview rendered the existing Google/Apple buttons. The combined hosted build passed. These checks do not establish cloud score persistence; this initial check was followed by the successful activation below.

### Challenge backend activation — 2026-10-21

Using only the Codex in-app browser, applied `supabase/challenge.sql` to the existing project. Supabase returned success. Ran `supabase/verify-challenge.sql`: PASS for daily uniqueness, idempotence, completed score protection, owner isolation, direct-write denial, anonymous denial and deletion cascade. All synthetic auth/round fixtures were rolled back; no real attempts were consumed.

Added exactly `https://perlingo.app/challenge/` and `http://127.0.0.1:5174/` to the existing nine return URLs (eleven total). Retained Site URL `https://perlingo.app/` and the existing `http://127.0.0.1:5173/**` wildcard, which already covers the shared local preview. The local shared preview restored the existing Learning identity and its Account dialog showed **Synced** after an authenticated cloud read. No frontend publication or new OAuth round-trip is claimed. The account/attempt behavior was approved for commit and publication; physical two-device acceptance remains available for user testing.

Publication: GitHub `d8fec39a` maps to Sites source `ebca60a5a067e3f32c1fdca404c1facad601d643`. Sites version 19 deployed successfully as `appgdep_6ad9421597648191b96673d2e552dfbb` on October 21, 2026. Public audience, custom domain and runtime environment revision 1 were preserved. All 193 tests and the production build passed.

Route release preparation (October 22): Learning returns OAuth to `/learning` (or `/learning/` when opened with a trailing slash). Added ten exact callbacks in Supabase: those two paths plus `/learning?pack=course`, `/learning?pack=starter`, and `/learning?pack=foundation`, on both `https://perlingo.app` and the existing `https://perlingo-parallel.ayuan2.chatgpt.site` domain. Verified 21 total allowlisted URLs, preserving all eleven existing entries and Site URL. The local 5173 wildcard already covers Learning. Root callbacks preserve query parameters when redirecting to Challenge. A new production OAuth round-trip remains unverified.

## Lemmas sync and course resets — local implementation, October 27

The frontend is published in Sites version 24; signed-in Lemmas progress now uses the account backend on perlingo.app. On October 27 the user explicitly approved backend activation: `supabase/lemmas.sql` was applied successfully, and `supabase/verify-lemmas.sql` passed in the live project with all synthetic fixtures rolled back. The existing Learning/Challenge tables are unchanged. Exact `/lemmas` and `/lemmas/` return URLs were added on both `https://perlingo.app` and `https://perlingo-parallel.ayuan2.chatgpt.site`, increasing the allowlist from 21 to 25 entries while preserving the Site URL, all earlier entries and the localhost wildcard. Google sign-in from localhost completed successfully and returned to `/lemmas/`. A production OAuth round-trip after frontend publication and physical cross-device acceptance remain unverified.

Lemmas uses the shared Google/Apple session and a separate `lemma_progress` row per authenticated user. Writes use `save_lemma_progress`, deriving ownership from `auth.uid()` and checking the expected revision. The new table has RLS, no anonymous access and no direct authenticated writes. Its foreign key cascades on account deletion. It does not alter Learning or Challenge progress.

The account draft key is `perlingo-account-v1:<user-id>:lemmas`. Published version 38 loads existing cloud progress or creates a fresh course without importing guest progress. Version 39 publishes the October 29 update below with an explicit guest-import choice on sign-in; session restoration still does not import automatically. The guest key `perlingo-lemmas-corpes-v2` stays separate and reappears on sign-out. Once linked, new signed-in activity on localhost uses the same account backend as production; localhost is not a separate test account. Unsynced account edits are preserved and require an explicit choice if a competing cloud snapshot exists. The complete course snapshot includes learning position, all four test stages, unfinished answers, scores, prior assessment archives and sound preference. Personal word notes remain browser-only and are neither synchronized nor cleared by course reset.

Lemmas → Account and Learning → Settings each offer a quiet reset control with confirmation. Reset replaces only that course's snapshot with defaults, including unfinished tests/sessions and settings; it retains authentication, other courses and personal notes. Learning resets only the selected course/foundation/starter pack. Signed-out resets affect only guest progress. Signed-in resets affect the account draft and upload through the normal revision-checked sync; offline resets remain pending until reconnection. A sync choice, competing local tab or active sync prevents reset until resolved. Other devices encounter a conflict rather than silently resurrecting old progress.

Before reset, one local recovery copy is saved: account recovery remains available through Manage account → Export recovery copy; guest recovery is stored at `<guest-key>:recovery`. This is not an in-app undo or a server backup erasure feature. Provider backups, other devices' caches, downloaded exports and prior recovery files are not erased by a course reset. Whole-account deletion is still a separate request.

Verification: local PostgreSQL 16 with a minimal auth stub passed owner isolation, revision conflicts, direct-write denial and anonymous denial; all synthetic fixtures rolled back. The full suite passes (305 tests); syntax/content checks pass. Automated tests exercise fresh linking, account switching, database JSON key ordering, invalid test rejection, offline reset/retry, recovery, pack isolation, competing tabs and cloud conflicts. Browser checks confirmed the signed-out account popup, both reset entry points and Escape/focus return. No real progress was reset and no localhost guest snapshot was uploaded. Live activation verification is recorded below.


### Lemmas backend activation verification — October 27

After explicit user authorization, the migration succeeded in the existing production Supabase project. Live SQL tests passed owner isolation, expected-revision conflicts, direct-write denial and anonymous denial; their temporary auth/progress fixtures were rolled back.

Google sign-in from the local Lemmas Account popup returned successfully to `/lemmas/`. The app saved a freshly initialized Day 1 / Set 1 / Batch 1 account snapshot. A temporary local diagnostic used the bundled account client and actual Lemmas remote adapter to verify that the cloud snapshot exactly matched the fresh course, save that identical snapshot under its expected revision, restore it through a second sync client with an empty in-memory cache, and reject a stale write. It checked that the browser's guest key was byte-for-byte unchanged throughout. The diagnostic did not upload guest data, complete lessons, change answers/settings or expose credentials. It was removed after verification.

The normal app detected the diagnostic's newer revision after reload; selecting the identical cloud snapshot resolved that expected conflict and showed “Progress saved to your account.” This verifies authenticated cloud persistence and independent-client restore, not a physical second-device test. No frontend publication or new commit was performed as part of backend activation.

### Lemmas frontend publication — October 27, version 24

Deployment `appgdep_6ae0d80822088191b149f5c5d0c5799f` succeeded with environment revision 2 and public access preserved. The production page restored the existing Google session and cloud course position, and Account displayed “Progress saved to your account.” This verifies production existing-session restore without importing guest storage. No learner answers were submitted or reset. A new production OAuth round-trip and physical second-device acceptance were not exercised.

## Guest import on Lemmas sign-in — local October 29

Clicking Google or Apple in the signed-out Lemmas Account popup marks a pending guest-import offer for this browser origin and course. After OAuth returns, the guest snapshot is staged in the signed-in account draft, including when that account already has a cached draft. Account opens with **Use guest progress** and **Keep account progress** when a cloud copy exists, or **Start fresh** if there is no account copy. If an unsynced account draft also exists, **Keep account on this device** preserves that separate option. Summaries show day, set, card position and words practiced. Choosing guest replaces the entire account snapshot; it does not merge scores or test attempts.

No account write occurs while the offer is pending. Before applying a choice, sync re-reads the cloud revision and saves the guest, previous account draft and observed cloud snapshot to the account's local recovery record. A changed cloud revision asks for review again; a write race retains the normal conflict flow. Guest storage is never changed by the choice and returns on sign-out. Pending offers survive reload/offline retry in the account draft; completed choices do not reappear during session restoration or token refresh. A later explicit sign-in can offer the retained guest copy again. A failed OAuth request clears the pending handoff marker.

This imports only guest progress from the same browser origin: localhost and perlingo.app remain separate. Choosing guest from localhost can update the real account backend after confirmation. Personal word notes stay browser-local. Learning/Challenge behavior is unchanged; the new policy is enabled only for Lemmas. No backend migration is required.

Validation uses synthetic accounts and in-memory remotes: new/existing accounts, cached unsynced drafts, full unfinished-answer snapshots, declined import, OAuth return, failed OAuth, reload, sign-out, token refresh, offline retry, stale revisions, racing writes and competing tabs. No real guest or account progress was uploaded or replaced during implementation. Local preview: sign in from Account, compare the summaries, and choose the intended complete copy. This change is published in Sites version 39.

Local verification: all 402 tests and syntax/content checks passed. Browser verification confirmed the signed-out Account prompt; real OAuth import and live replacement were intentionally left for user testing.

Published October 29, 2026: Sites version **39**, deployment `appgdep_6ae3cb2160648191b32cfed5d814f843`, succeeded. Application commit `94c064509b` maps to Sites source `db55eb018ccef29c63f95734a8e55150c4c2712b`. Guest-progress import on explicit Lemmas sign-in is live, superseding the local-only status above. All 402 tests, syntax/content checks and the hosted build passed; packaged account/sync modules match source. Public access, perlingo.app and environment revision 2 are retained. No real guest/account progress was imported during release verification; live OAuth import remains user acceptance testing.
