# Optional accounts and progress sync (C8)

Status: Google/Apple-only sign-in UI is implemented locally. Google is configured in Supabase and enabled locally for testing; Apple is now configured and enabled for local testing. Email/password/code entry has been removed from the app. Supabase email login is disabled after Google sign-in was confirmed on the existing account. Google and Apple are the only enabled providers. Existing sessions and progress are preserved. Committed as `ef9cceb`; included in the approved release package.

Supabase database isolation tests and the earlier Resend email delivery test passed. Those results do not verify social login. The user completed Google sign-in; Supabase shows a linked Google identity on the existing account and the local session survives reload. Apple end-to-end sign-in, long-duration refresh and two-device sync testing remain pending.

## Persistent sign-in

The official Supabase JavaScript client is bundled locally in `src/vendor/supabase.js`. It uses `persistSession: true`, `autoRefreshToken: true`, and a stable `perlingo-auth-v1` browser storage key. Settings offers only Sign in with Google and Sign in with Apple. Credentials are managed by the SDK and are not included in progress exports or database snapshots. OAuth uses PKCE and SDK callback detection. Redirects return to the current page, retaining the pack query while removing old callback parameters and fragments.

The desired project settings are Supabase's defaults: no maximum session lifetime, no inactivity timeout, and no single-session restriction. Keep the normal short-lived access tokens and refresh-token rotation/reuse protections; persistent sign-in is achieved by refreshing tokens, not by issuing long-lived access tokens. Signing out uses local scope, so it signs out this browser without signing out other devices.

Users can remain signed in through reloads and browser restarts. Clearing site storage, private browsing cleanup, revocation, or provider security actions can still end a session; “always signed in” cannot be guaranteed. Browser storage is origin-specific: a future move to a custom domain will require signing in there. Failed progress requests do not explicitly sign users out. The SDK controls expired/revoked-token handling.

References: [Supabase sessions](https://supabase.com/docs/guides/auth/sessions), [passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Progress ownership and conflicts

Guest keys remain unchanged. Account drafts are separate by user ID and pack: `perlingo-account-v1:<user-id>:<course|foundation|starter>`. Signing out returns to the original guest progress; it does not copy account history into the guest key. Account drafts remain on that browser for the next sign-in. Content reports remain local and are not synced.

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

After email setup, with disposable accounts:

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

Apple configuration completed on 2026-10-19: saved web callback verified after browser restart. Key `PMY643BZPC` (Perlingo Apple Auth) is restricted to Sign in with Apple for primary App ID `app.perlingo`. Services ID `app.perlingo.web` is configured in Supabase. The ES256 client secret was generated locally and stored in Supabase; it expires **2027-04-17 at 16:22 EDT** and must be replaced before then. The downloaded signing key is at `~/Downloads/AuthKey_PMY643BZPC.p8`; keep a secure backup outside the repository. No secret was added to source files. The local Apple button is enabled; a completed Apple login remains to be verified.

The sign-in buttons use locally hosted, unmodified official Google and Apple image assets, with accessible labels and equal heights. Asset provenance is in `src/assets/auth/README.md`. The existing Supabase OAuth actions are unchanged.

The verified owner account has a Content inbox button in Settings → Account. Admin membership is checked by the database; access is not based on browser settings or editable user metadata. See `docs/content-maintenance.md` for report submission and permission checks.
