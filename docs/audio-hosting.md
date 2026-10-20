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
After committing a verified external-audio build, run `node scripts/prepare-sites-release.mjs /absolute/path/to/clean-sites-checkout`. Open that checkout with the Sites helper first; the preparation script checks project identity and clean working trees, copies tracked application files while omitting Azure pronunciation MP3s and audition/generation records, and writes `.openai/release-source.json` with the GitHub SHA. Use the Sites helper to commit, push and package this checkout, then save and deploy its exact returned commit/archive. Do not push development `main` directly to Sites, since its history contains the recordings. Use the Sites deployment result for publication status.

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
