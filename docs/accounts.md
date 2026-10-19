# Optional accounts and progress sync (C8)

Status: Google/Apple-only sign-in UI is published in Sites version 11 (`b214e6c`). Google is configured in Supabase and enabled locally for testing; Apple is now configured and enabled for local testing. Email/password/code entry has been removed from the app. Supabase email login is disabled after Google sign-in was confirmed on the existing account. Google and Apple are the only enabled providers. Existing sessions and progress are preserved. Committed as `ef9cceb`; included in the approved release package.

Supabase database isolation tests and the earlier Resend email delivery test passed. Those results do not verify social login. The user completed Google sign-in; Supabase shows a linked Google identity on the existing account and the local session survives reload. Apple end-to-end sign-in on the production root and persistence after page reload were verified on 2026-10-19. Long-duration refresh and two-device sync testing remain pending.

## Persistent sign-in

The official Supabase JavaScript client is bundled locally in `src/vendor/supabase.js`. It uses `persistSession: true`, `autoRefreshToken: true`, and a stable `perlingo-auth-v1` browser storage key. Settings offers only Sign in with Google and Sign in with Apple. Credentials are managed by the SDK and are not included in progress exports or database snapshots. OAuth uses PKCE and SDK callback detection. Redirects return to the current page, retaining the pack query while removing old callback parameters and fragments.

The desired project settings are Supabase's defaults: no maximum session lifetime, no inactivity timeout, and no single-session restriction. Keep the normal short-lived access tokens and refresh-token rotation/reuse protections; persistent sign-in is achieved by refreshing tokens, not by issuing long-lived access tokens. Signing out uses local scope, so it signs out this browser without signing out other devices.

Users can remain signed in through reloads and browser restarts. Clearing site storage, private browsing cleanup, revocation, or provider security actions can still end a session; “always signed in” cannot be guaranteed. Browser storage is origin-specific: a future move to a custom domain will require signing in there. Failed progress requests do not explicitly sign users out. The SDK controls expired/revoked-token handling.

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

OAuth setup check (2026-10-19): With explicit user approval, the dedicated Google Cloud project `Perlingo` (`perlingo-512119`) was created in `andrewjyuan-org`. The OAuth app configuration was created with Perlingo branding, the account owner's Gmail address as support/developer contact, and an external testing audience after the user approved Google's API Services User Data Policy. The approved web client `Perlingo Web (Supabase)` was created with the exact Supabase callback above. Its secret is stored in Supabase, not source files. Supabase confirms Google is enabled, with nonce checks retained and email required. The local Google button is enabled for testing. Supabase Site URL is `http://127.0.0.1:5173/` and its redirect allowlist contains `http://127.0.0.1:5173/**` to support lesson-pack queries. Publication setup (2026-10-19) sets the Site URL to https://perlingo-parallel.ayuan2.chatgpt.site/ and adds exact production return URLs for the root and the course, starter and foundation pack queries, retaining localhost development redirects. Production end-to-end OAuth testing remains pending. Google remains in Testing mode with `andrewjyuan@gmail.com` listed as its one test user. Apple Developer sign-in is complete and an existing Individual Apple Developer Program membership is confirmed, with renewal dated January 23, 2027. The user accepted the updated Apple Developer Program License Agreement, and Certificates, Identifiers & Profiles is now accessible. With user approval, primary App ID `app.perlingo` (Perlingo) and Services ID `app.perlingo.web` (Perlingo Web) were registered. Web authentication is saved using Perlingo as the primary App ID, domain `buuxjzibgblnlmfafpny.supabase.co`, and the Supabase callback above. The user completed Continue/Save; reopening the Services ID confirms Sign in with Apple is enabled. After restarting the browser, the Configure dialog confirmed the persisted domain and callback. Signing-key creation and Supabase configuration are complete as recorded below. Apple also reports a default-payment-method renewal issue, which has not been changed. Apple is enabled in Supabase and the local app. Google sign-in was confirmed at 16:04 local time on the existing account. Email login was then disabled and the signed-in local session and day 1 progress survived reload. Initial cloud upload still awaits the user’s choice.

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

Live Console inspection: External/Testing audience, one owner test user, and Publish app disabled with an explicit instruction to complete Branding. Name and contact information are set; homepage/privacy/terms URLs are blank. The Supabase callback domain is the sole authorized domain. Data Access contains no configured scope rows; a read-only request to the live Supabase authorize endpoint returned a Google redirect requesting only `email profile`, with the expected callback. Console declarations still need reconciliation before rollout. No Google settings were changed.

Local `about.html` and `privacy.html` now provide an introduction and privacy policy, with shared `src/public-pages.css` and links from Settings → About. They load without account scripts. The user approved these pages, including contact, retention and deletion-request wording, for commit/push/publication on 2026-10-19. Deployment and domain verification are tracked separately. The learning route remains `/`. Terms are optional for the Google branding step; no new terms agreement was added.

Google requires public homepage/privacy links on the same domain, accurate disclosures and domain-ownership verification for brand verification. The intended owned domain is `perlingo.app`, but its hosting is D2 and is not configured. Do not assume ownership of the Sites provider's parent domain. Hosting only the public introduction/privacy pages on the owned domain may be evaluated separately from migrating the learning app. After that hosting is resolved and publication approved, use `https://perlingo.app/about.html` and `https://perlingo.app/privacy.html` as branding links, preserve the existing Supabase callback, verify ownership, declare actual requested scopes, and review the Console's verification requirements before any approved audience change. These are planned URLs, not live pages.

Sources: [Google brand verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/brand-verification), [Google audience guidance](https://support.google.com/cloud/answer/15549945?hl=en). Basic identity-only scopes have an exception to the usual Testing authorization expiry; do not infer a seven-day Perlingo session limit from Testing status alone.

### Local review and release checklist

1. Open http://127.0.0.1:5173/about.html; follow Privacy and Open Perlingo. Check narrow-screen readability and keyboard links.
2. Review privacy disclosures against account-client.js, progress-sync.js, reports and notification behavior. Confirm owner contact and manual data-request handling before approval.
3. In the local app, Settings → About should expose About Perlingo and Privacy policy; existing lesson navigation and account controls remain intact.
4. For an approved release, include `about.html`, `privacy.html` and `src/public-pages.css` in `dist/` alongside the refreshed application source. The approved package refreshes `dist/` with these files.
5. Real forced refresh passed; a long-duration automatic-refresh soak remains optional additional assurance, not established by this test. Public readiness also depends on domain delivery, approved public pages and Google configuration/verification. The user subsequently authorized commit, push, publication, custom-domain connection and Google branding setup on 2026-10-19.

Review follow-through: [account data-request procedure](account-data-requests.md) records verified ownership, dependent-row deletion order, isolated rehearsal requirements and local-copy/log/backup limitations. Dependency order passed the isolated PostgreSQL rehearsal described in the data-request procedure; no live-user deletion occurred. No user data was deleted. The live redirect requests `email profile`. Reconcile Console declarations with that runtime result and Supabase’s documented basic identity scopes (`openid`, `userinfo.email`, `userinfo.profile`) and reconcile Console declarations before rollout: https://supabase.com/docs/guides/auth/social-login/auth-google.


### Final technical checks

On 2026-10-19, `supabase/verify-account-deletion.sql` passed against disposable PostgreSQL 16.8 using the repository application tables, functions and report-queue trigger. A minimal auth.users/id and auth.uid stub replaced GoTrue's schema. The rehearsal proved direct deletion fails with dependencies, ordered deletion succeeds, progress cascades, an unrelated synthetic user remains intact, and rollback restores target records. All fixtures rolled back; database stopped afterward. This is relational verification, not a full Supabase Auth admin API rehearsal.

The Sites API confirms the current public project is active and has no custom domains attached. No DNS, Google scope declaration, audience or hosting setting changed. Completing general-public readiness requires approval for publishing reviewed source/pages and domain configuration. The supported existing-Sites custom-domain path can host the app and public pages together; separately hosting information pages remains an alternative rather than a requirement.


## Authorized public rollout — 2026-10-19

The user approved committing, pushing, publishing, attaching perlingo.app and completing Google branding. Commit `3b655ac0d8eb9f750ae93b9d150874321ea9fa2c` was pushed to GitHub and Sites source; Sites version 12 deployed successfully. The follow-up package removes the introduction's obsolete Google Testing notice.

`perlingo.app` is attached to the existing public project as `appgdom_6ad6a4b890048191aea76d23d9816d1c`; Sites reports domain and TLS active. Cloudflare has DNS-only apex A records 162.159.143.30 and 172.66.3.26 plus the Sites/Cloudflare ownership TXT records. Existing mail records were preserved. Public introduction and privacy URLs load over HTTPS (the static host redirects .html paths to extensionless paths).

Supabase Site URL is now `https://perlingo.app/`. Exact root/course/starter/foundation return URLs were added, preserving old Sites and localhost redirects. Google sign-in completed on the new domain and showed the existing owner identity and cloud choice. Account cloud data is shared across domains; browser-local sessions and guest data are origin-specific. Use cloud progress when moving an existing account. Old guest-only progress requires export before migration; it is not automatically copied.

Google Search Console verified perlingo.app ownership through a TXT record. Branding now has homepage `https://perlingo.app/about.html`, privacy `https://perlingo.app/privacy.html`, and the owned domain alongside the existing Supabase callback domain. Only the observed email/profile runtime scopes were declared, as userinfo.email and userinfo.profile; no sensitive/restricted scopes. Audience is External/In production. Verification Center says data-access verification is unnecessary for these scopes; separate branding verification was initiated and remains pending until its result is recorded. Production audience does not by itself mean the Perlingo brand is verified or displayed.
