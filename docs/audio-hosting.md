# Separate audio hosting

The original approved release was committed on GitHub as `66f5963f`.
Its large Sites source upload failed with TLS disconnects. Large transfer size is suspected,
not confirmed; switching Git clients and TLS backends did not fix it.

`src/audio-host.js` defaults to local recordings. `build:static` accepts
`PERLINGO_AUDIO_BASE_URL`, an HTTPS directory URL without credentials, query, or
fragment. When set, the build excludes Azure pronunciation MP3s and configures both lesson playback
and the accent comparison to use that host. Manifests remain same-origin.
The exact-region fallback, French Thomas preference, and quiet chime remain.
All referenced remote recordings were verified before packaging this release. Browser checks confirmed lesson playback and both voice options use the Azure HTTPS endpoint. All 129 tests and application checks passed.

## Azure configuration and estimate

Standard general-purpose v2, Hot, LRS, East US. No SFTP or paid CDN.
Microsoft retail rates checked October 19, 2026: $0.0208/GB/month storage,
$0.05 per 10,000 writes, $0.004 per 10,000 reads. Approximately $0.04/month
for the library, $0.28 for its initial upload, and $0.40 per million reads,
excluding bandwidth and repeat/range requests. The first 100 GB/month of
internet egress is free across the account. Costs are usage-based, not capped.
The owner approved creation with a $5/month target. The storage account `perlingoaudio` is created. All 54,784 recordings are uploaded and checksum-verified with zero failures; see `audio-generation/hosting-upload-validation.json`.
The owner authorized and completed the subscription upgrade to pay-as-you-go
with included Basic support on October 19, 2026. Azure confirmed the upgraded
account; remaining trial credits expire November 18, 2026. Usage beyond free
allowances is now billable across the subscription. Only public authored
recordings belong here.

Azure is the selected production speech provider. ElevenLabs Starter was
cancelled on October 19 and ends November 19, 2026; automatic top-up is off.
Google Cloud Text-to-Speech (`texttospeech.googleapis.com`) was disabled in
`perlingo-512119`. Google OAuth, project and billing account were not changed.
Historical audition files remain available locally.

Sources: [Blob pricing](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/),
[bandwidth](https://azure.microsoft.com/en-us/pricing/details/bandwidth/),
[retail API](https://prices.azure.com/api/retail/prices).

## Release workflow

Deleting audio in a new commit does not remove the large files from Git ancestry.
Use a separate checkout of the existing Sites branch and copy the small app
release into it, recording the GitHub source SHA. GitHub remains the development
repository and recording backup. No GitHub history rewrite is needed.
For the combined Learning/Challenge release, install dependencies in `hosting/` using the Sites installer, then run `node scripts/build-hosted.mjs /absolute/path/to/sites/scripts/build-site.mjs`. This emits a Worker build with static assets under `dist/client`, retaining the verified external course audio host. Generated output is ignored by Git. After committing the verified source, run `node scripts/prepare-sites-release.mjs /absolute/path/to/clean-sites-checkout`. Open that checkout with the Sites helper first; the preparation script checks project identity and clean working trees, copies tracked application files while omitting Azure pronunciation MP3s and audition/generation records, and writes `.openai/release-source.json` with the GitHub SHA. Use the Sites helper to commit, push and package this checkout, then save and deploy its exact returned commit/archive. Do not push development `main` directly to Sites, since its history contains the recordings. Use the Sites deployment result for publication status.

## Uploads

`scripts/upload-azure-audio.mjs /absolute/path/to/temporary-key-file` uploads only
the local Azure MP3 library to `perlingoaudio/pronunciation`. Supply the existing
account key in an owner-only temporary file outside the repository; the script
deletes that file immediately after reading it. Never put a key in a command
argument, Git file, browser app bundle, or report. It skips matching remote MD5s,
uses Content-MD5 validation for new uploads, sets audio/mpeg and immutable
one-year cache headers, retries transient failures up to four attempts, and
writes a non-secret report to `audio-generation/hosting-upload-validation.json`.
The public container permits individual blob reads only, not anonymous listing
or writes. Local copies and GitHub remain the backup. New audio content must
use a new path; do not replace cached immutable clips with different bytes.

The Azure budget form could not load cost/filter data during setup, so no budget
alert is configured. The approved $5/month target is not an enforced cap.

Publication completed October 19, 2026: Sites version **14**, deployment `appgdep_6ad6d5cafd548191b12139c69fa79992`, succeeded. GitHub application commit `1aa49d4c` corresponds to Sites source commit `8de0a2d1e18c1cb896fdffb1f0b65d43753bfa25`. The existing public site and perlingo.app domain are retained. All 54,784 Azure recordings were verified before release.

The October 21 release adds a hosted speech-token broker and mounts Challenge at `/challenge/`; runtime provider keys are Sites secrets. The site audience stays public. Course authentication, course progress and remote audio URLs are unchanged. Publication success is recorded only after the deployment returns a terminal success result.

Publication completed October 21, 2026: **Sites version 15**, deployment `appgdep_6ad92a1b85348191b7053198d9185ae9`, succeeded. Learning is live at https://perlingo.app/ and Challenge at https://perlingo.app/challenge/. GitHub source `e18b5b26` maps to Sites source `372693b8d606131183124dc7e74842a54bd3e33e`; runtime environment revision 1 contains the provider secrets. Live checks passed for both apps, cached French audio and ElevenLabs temporary-token issuance. The retired forest route returns 404. 171 repository tests passed. Live microphone recognition accuracy and phone behavior remain user acceptance checks.

Publication completed October 21, 2026: **Sites version 16**, deployment `appgdep_6ad9317a2598819196283fef6d0f8925`, succeeded. GitHub modes commit `9246e9d4` maps to Sites source `c4ea6d5cd93cb32a06a45afe90651547c111d090`. Existing public audience, custom domain and runtime environment revision 1 retained. Daily/Archive/Unlimited are published with the explicit two-day starter calendar; further word packs are separate local work.

Publication completed October 21, 2026: **Sites version 17**, deployment `appgdep_6ad93cacf1d08191bce0d0131ec9c62c`, succeeded. GitHub source `03db3b8b` maps to Sites source `d9b5a9686e4f0a980be40943c2a7339667e887f5`. Learning remains at https://perlingo.app/ and Challenge at https://perlingo.app/challenge/. Public audience, custom domain and runtime environment revision 1 were preserved. This release includes twelve packs / 600 clips (two explicitly approved audio exceptions), the Eastern-time demo archive, hidden-word setup, flags and visual refresh, browser-local dated attempt limits, score/review, and random Unlimited with one-round replay overrides. All 188 tests, content checks and the production build passed. Cross-device attempt enforcement and native-speaker audio certification are not implemented.

Publication completed October 21, 2026: **Sites version 18**, deployment `appgdep_6ad93dea8b848191b6276f9e9439c16a`, succeeded. GitHub source `c54715c9` maps to Sites source `4fb02e80f97aedf6008bec89306027008d176d31`. Unlimited setup omits the Word/Random row and recognition control; game recognition is fixed to ElevenLabs. Replaying in Unlimited starts study immediately. Public audience, custom domain and runtime environment revision 1 are unchanged. All 188 tests, content checks and the production build passed. Live at https://perlingo.app/challenge/.

## Lemmas expansion — 27 October 2026

The existing container now also hosts the full eight-voice Lemmas library. All 194,752 course recordings were checksum-verified, with zero final failures; 187,496 recordings were added (including audition samples). The existing 54,784 legacy recordings were preserved. See `audio-generation/lemmas-library/upload-validation.json` and [the generation/integration record](lemma-audio-library.md). The upload uses existing access settings and immutable conditional writes; it creates no new public container or permissions. Local Lemmas playback and browser-stored country/gender preferences are implemented, including notes and the forms prototype. The new app code is not published yet.
