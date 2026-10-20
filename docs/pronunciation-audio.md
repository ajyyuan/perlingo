# D1 pronunciation audio

Status (2026-10-19): Azure selected after owner listening. The ten-region masculine/feminine library is generated and connected to local playback through the minimal selector. No D1 commit or publication. Historical research/audition details below document how the decision was reached; current implementation is in the final section.

## Current coverage

`node scripts/audio-inventory.mjs` inventories current starter, foundation and course lesson translations plus clickable pronunciation chunks, matching speech.js NFC/apostrophe normalization. `--manifest` emits the exact text and source references for generation and coverage checks. It deduplicates by locale and text, retains punctuation within spoken text but excludes unclickable punctuation-only segments, and fails if chunk extraction fails. No learner data, secrets or provider requests are involved. Reference-form tables are not current speech targets; existing licensed IPA sound files are separate and unchanged.

| Locale | Unique clips | Characters |
| --- | ---: | ---: |
| es-ES | 2,792 | 32,022 |
| fr-FR | 2,739 | 33,324 |
| de-DE | 2,669 | 33,522 |
| Total | 8,200 | 98,868 |

Counts describe the current draft course, not independently verified pronunciation or curriculum. Isolated clitics (for example French J’) and ambiguous words need contextual listening review; synthesized output must not be assumed correct merely because generation succeeded.

## Options checked

Official sources checked 2026-10-19; costs exclude hosting, taxes, retries and additional candidate voices. No provider quality ranking is claimed without listening.

| Option | Cost for one current inventory | Coverage / rights / tradeoff |
| --- | --- | --- |
| Existing device voices | No synthesis API charge | Already works with Thomas preference, but installed voice and behavior vary by device. Not a consistent cross-device asset source; do not assume redistribution rights for captured system speech. |
| Google Chirp 3 HD | $2.97 at $30/million characters before allowance | es-ES/fr-FR/de-DE supported. Listed allowance is 1 million characters; billing activation required. Generated files may be used in applications subject to Google terms. Recommended first audition because the project already exists, not because voice quality has been established. |
| Amazon Polly Neural | $1.58 at $16/million characters before allowance | All three locales supported; specific voices/engines must be selected. AWS explicitly permits storing/reusing output. Requires AWS setup. |
| ElevenLabs | Paid plan starts at $6/month; model-specific credits | Multilingual alternative; commercial license requires paid plan. Trial and character allowances vary by model. Compare if the first candidates disappoint. |
| Human recordings | Quote required | Potentially strong pedagogical control, but thousands of clips, revisions and explicit distribution rights make this a separate production effort. |

Sources: [Google pricing](https://cloud.google.com/text-to-speech/pricing), [Google voices](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types), [Google generated-audio use](https://docs.cloud.google.com/text-to-speech/quotas), [Polly pricing](https://aws.amazon.com/polly/pricing/), [Polly voices](https://docs.aws.amazon.com/polly/latest/dg/available-voices.html), [Polly storage/reuse rights](https://aws.amazon.com/polly/faqs/), [ElevenLabs pricing](https://elevenlabs.io/pricing), [ElevenLabs publication licensing](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform).

## Proposed implementation and listening gate

1. Audition two voices per locale on actual lesson words, noun/article pairs and sentences. Include French liaison/nasal vowels, Spanish stress/r versus rr, and German umlauts/ich versus ach. Compare French against the current Thomas baseline. Keep existing Spain/France/Germany locales unless the owner requests other accents.
2. Record the selected provider, exact voice/model, rate, generation date, license reference and source text hash. Generate only approved static lesson text; never send learner answers or account data. Review output before assigning an accepted asset.
3. Serve static audio through the existing site, requested on demand. A manifest maps locale + normalized text to immutable versioned files. Changed lesson text must miss the old asset rather than silently replay stale speech. Normal HTTP caching is sufficient initially; do not claim offline availability or precache the entire course.
4. Add an asset-first player that preserves the existing speak/stop interface. Missing/failed clips fall back to current browser speech including Thomas. Reject stale playback callbacks, cancel fetch/playback on navigation, and preserve mute, manual replay and quiet chime sequencing. Device gesture/autoplay restrictions need actual iPhone testing.
5. Update privacy/docs to actual behavior, run cancellation/fallback regression checks, and provide a local listening preview. Owner voice approval precedes bulk generation and release approval precedes commit/push/publication.

This was the pre-audition proposal; local Azure runtime integration is now implemented as described in the final section. The original audition is retained below. Google billing upgrade, TTS API activation and Cloud Shell credential authorization are complete. Existing Google OAuth branding alone does not establish Cloud TTS access.

## Prepared audition

`docs/audio-audition.json` contains 18 exact current lesson/chunk targets with source references (six per locale, 226 characters total). Two candidate voices per language would synthesize 452 characters, approximately $0.014 at the listed Chirp 3 HD rate before allowances/retries. This text-only fixture includes French J’ deliberately as a fragment failure probe; successful full sentences do not validate fragment pronunciation. The fixture describes the text; generated recordings are stored separately under `audio-audition/`. No listening-based quality judgment has been made. The owner selected Google and approved up to $5 for samples. The owner approved the API terms. The initial activation was blocked by the expired trial billing account. The owner subsequently approved its pay-as-you-go upgrade; the upgrade, project billing link, and TTS API enablement are verified complete.

For an initial no-generation listen, use the audio controls on [Google's official voice catalog](https://docs.cloud.google.com/text-to-speech/docs/list-voices-and-types) and [Amazon Polly's official samples](https://aws.amazon.com/polly/features/). Those vendor examples use different text and cannot establish a fair pronunciation ranking. The prepared common-text audition is needed for that comparison.

The prepared `scripts/generate-audio-audition.mjs --dry-run` job uses Charon and Kore for each locale, checks live voice availability before synthesis, and takes a Google access token only on stdin. It generates 36 MP3 clips (452 characters, estimated $0.01356 before allowances) into `audio-audition/`. It records attempted requests before sending, stops on failure without automatic retries, refuses a second run over an existing generation ledger, and refuses an expanded job exceeding $0.05. The authenticated job completed in Cloud Shell; all 36 generated files and its ledger were transferred to `audio-audition/google/`. The script's estimate is not a Google billing-account cap or a final invoice.

## Accuracy-first research update — 2026-10-19

The owner asked to reconsider ElevenLabs and research the best possible pronunciation rather than optimize cost. This is research authorization, not authorization to upgrade Google billing or subscribe to another provider. No account or billing changes were made during this research.

Recommendation: for maximum assurance, commission native-speaking pronunciation educators/voice talent for the target accents, with an independent qualified reviewer checking every clip against its intended meaning and context. This is an engineering/editorial recommendation, not a published proof that every human recording beats every synthesizer. Humans also make errors; review and retakes are essential. A synthetic voice plus the same review/replacement process is the scalable alternative.

An unreviewed provider-wide accuracy winner is not established by the evidence consulted. Short lesson words, contextual homographs, clitics and minimal contrasts are not equivalent to expressive narration. Choose per language, not necessarily one provider for all three. Existing targets assume Spain Spanish, France French and Germany German; valid regional variants should not be labeled errors.

| Candidate | Verified pronunciation controls | Decision implication |
| --- | --- | --- |
| Azure Speech | SSML phoneme overrides and custom lexicons; locale-specific phonetic tables for es-ES, fr-FR and de-DE | First engineering baseline for a correction-driven audition. This is a control/tooling recommendation, not a measured pronunciation-accuracy victory. Verify exact chosen voice supports the required SSML features. |
| ElevenLabs v4 | Current developer guide explicitly requires v4 for non-English IPA/CMU dictionary pronunciation; older models may skip phoneme entries or require aliases. Current model overview lists v4 through Text to Dialogue. | Serious candidate, with native-language voices and exact endpoint/model compatibility tested. Do not repeat older blanket claims that ElevenLabs has no non-English phoneme control. Documentation describes capability, not perfect compliance. |
| Google Chirp 3 HD | Current documentation supports IPA/X-SAMPA custom pronunciation in these three locales, with pronunciation/SSML controls labeled Preview | Still a credible candidate. Existing setup and low price are not evidence of superior pronunciation. |

Sources: [Azure pronunciation controls](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation), [Azure phonetic tables](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-ssml-phonetic-sets), [ElevenLabs dictionaries](https://elevenlabs.io/docs/eleven-api/guides/how-to/text-to-speech/pronunciation-dictionaries), [ElevenLabs models](https://elevenlabs.io/docs/overview/models), [Google Chirp controls](https://docs.cloud.google.com/text-to-speech/docs/chirp3-hd).

### Evidence limits and evaluation

[Artificial Analysis methodology](https://artificialanalysis.ai/methodology/text-to-speech) distinguishes multilingual listener preference from its pronunciation robustness benchmark, which uses a pinned US English voice. Its [model comparison](https://artificialanalysis.ai/text-to-speech/models) explicitly labels pronunciation robustness English. That cannot establish a pronunciation winner for Spanish/French/German. ASR word-error-rate comparisons measure transcript recovery; they cannot alone certify vowel quality, stress, liaison or accent suitability. Vendor demonstrations and marketing claims are not controlled evaluations on this course. The research did not include listening scores. The generated audition below is for owner listening; no independent linguistic accuracy certification is claimed.

The current 18-target fixture is a smoke test, not enough to select a production provider. Proposed next comparison: 30–50 targets per language, including actual lesson words/phrases, full sentences and difficult context cases. Generate identical texts with fixed candidate voice/model settings, retain first attempts and repeat a subset to measure stability. Blind the provider labels, normalize playback loudness, and have two qualified native reviewers score segmental pronunciation, stress/rhythm, context and exact text fidelity separately from voice pleasantness. Resolve disagreements; test whether identified errors can actually be corrected. Reject or replace every known faulty production clip; do not rely on an average score alone.

Specific engineering change needed before bulk audio: context-sensitive targets must be keyed by intended reading/context as well as text/locale. The current inventory deduplicates literal text for estimation, not linguistic equivalence. A fragment such as French J’ needs deliberate contextual treatment rather than trusting standalone TTS. The app's approximate auto-generated IPA is not a source for phoneme overrides; overrides require independently checked transcriptions.

Recommended decision: a reviewed audio library is the accuracy target. For automation, audition Azure, ElevenLabs v4 and Google on the same expanded set; choose the best reviewed result per language and replace exceptions with approved human recordings. Do not name a definitive AI winner before that evidence exists.

## Three-provider audition setup

The owner authorized generating the same samples with Azure, ElevenLabs and Google. The prepared fixture remains 18 exact lesson/chunk texts, six per language. The local listening page is `http://127.0.0.1:5173/audio-audition/` (use `/audio-audition/index.html` with the simple development server). It accepts separate provider generation logs, labels the actual voice/model, plays only one clip at a time, and explicitly shows missing audio as awaiting generation. No placeholder audio is used. It has not been added to the production dist package.

Account setup completed after explicit owner approvals: Google pay-as-you-go is active, Perlingo is linked to its billing account, Cloud TTS is enabled, and Cloud Shell was authorized. ElevenLabs Starter is active ($1 first month, then $6/month; monthly renewal November 19). Azure enrollment created an active subscription, and a dedicated `perlingo-audio-audition` SpeechServices resource and resource group were created in East US on the Free F0 tier. The initial empty Azure list was caused by its subscription filter.

Google generated 36 clips with Charon/Kore through Chirp 3 HD. Azure generated 36 clips with Alvaro/Elvira (Spanish), Henri/Denise (French), and Conrad/Katja (German). The final Azure request returned HTTP 429 and succeeded in one delayed retry; the ledger records this. Google Cloud Shell downloads did not yield local files through browser automation; the completed audio was transferred through its account-restricted web preview without regenerating it.

ElevenLabs generated 18 retained clips using Marco - Premium Spanish, Florian French Male Narrator, and Hans - Calm German Explainer with Eleven v4, stability 50%, similarity 75%, automatic language detection, and MP3 44.1 kHz/128 kbps. The UI generates two alternatives; the active first-generation audio is retained for this initial comparison, without choosing a preferred take. No phoneme corrections or expressive tags are applied. Provider/voice selection remains provisional.

The audition itself does not change the app runtime. The subsequent dedicated-control trial below adds recorded-region selection while preserving the French Thomas default and quiet feedback. The audition is local and is not included in the published site. No D1 commit, push or publication is authorized by the sample-generation request.

Validation: all 90 local MP3 files have nonzero decodable durations, matching fixture text/locale and recorded file hashes (`audio-audition/validation.json` and provider ledgers). Google transfer labels had a UTF-8 display-decoding error; corrected labels match the original pre-generation text SHA-256 values, so no audio regeneration was needed. These checks establish file integrity, not linguistic correctness.

## Owner selection and regional accents

The owner selected Azure after listening to the three-provider audition. This records a listening preference on this sample set, not a universal accuracy benchmark. Regional Azure recordings and the dedicated control are now implemented locally. The implemented design is: generate reusable files offline, key recordings by normalized text and voice, and offer a per-language pronunciation region setting. Current keys use literal text plus voice; contextual disambiguation remains future work. Changing the voice alone does not adapt vocabulary, grammar or accepted answers to a regional dialect. Azure regional voice coverage is documented in its [language support table](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts).

## Dedicated pronunciation control — local trial

The header waveform opens a compact popover on desktop and mobile. Its only visible content is one row per enabled session language: ES, FR or DE beside native flag/region and Masculine/Feminine dropdowns. Screen readers retain full dialog, language and country names. Outside click/tap or Escape closes it and restores trigger focus. Native controls retain keyboard navigation and 44 px touch targets. There is no Auto/device-default option.

Regions and fixed Azure voices (masculine / feminine):

| Region | Masculine | Feminine |
| --- | --- | --- |
| Spain | es-ES-AlvaroNeural | es-ES-ElviraNeural |
| Mexico | es-MX-JorgeNeural | es-MX-DaliaNeural |
| France | fr-FR-HenriNeural | fr-FR-DeniseNeural |
| Canada | fr-CA-JeanNeural | fr-CA-SylvieNeural |
| Germany | de-DE-ConradNeural | de-DE-KatjaNeural |
| Austria | de-AT-JonasNeural | de-AT-IngridNeural |
| Argentina | es-AR-TomasNeural | es-AR-ElenaNeural |
| Colombia | es-CO-GonzaloNeural | es-CO-SalomeNeural |
| Belgium (French) | fr-BE-GerardNeural | fr-BE-CharlineNeural |
| Switzerland (German) | de-CH-JanNeural | de-CH-LeniNeural |

Unset, old Auto, or invalid preferences resolve to Spain, France and Germany. Valid saved region choices are retained. Preferences use the existing progress persistence path in `settings.pronunciationRegions` and `settings.pronunciationVoices`. Missing/invalid voice choices default to masculine. No neutral voice is offered without an auditioned candidate. The lesson is not rerendered, so question and draft survive changes. Opening stops audio. During a session only batch languages appear; elsewhere enabled settings languages appear.

### Recording generation and playback

`src/recorded-speech.js` loads the same-origin manifest and plays the selected-region and selected-voice MP3. Masculine and feminine manifests are cached independently; the feminine manifest loads on first use. It is shared by card speakers, clickable chunks, Pronunciation overlay speech, correct-answer replay and automatic feedback. Navigation, region or voice selection, visibility changes and muting cancel pending playback, including delayed manifest loads. The quiet feedback chime is unchanged.

Files are generated once; playback never calls Azure and contains no provider credential. A missing/failed recording tries only a matching-region device voice, retaining Thomas preference within fr-FR. It never substitutes another region. Device fallback cannot guarantee voice gender; the existing French Thomas preference remains intact. Visible playback status identifies fallback when a status surface is present; automatic feedback stays quiet. If no matching fallback exists, audio reports unavailable. Browser cache is used normally; full offline availability is not promised.

`src/azure-voices.js` fixes the voice mapping and NFC/apostrophe normalization. The immutable asset identifier hashes voice plus normalized text. This is literal-text coverage, not contextual linguistic equivalence. Isolated clitics such as J’ and homographs still require contextual review; these recordings are not independent linguistic certification. Regional voice selection leaves lesson vocabulary/grammar unchanged; regional IPA is [deferred](regional-ipa.md), and guides remain shared language baselines.

Workflow: `node scripts/prepare-azure-library.mjs` writes an offline deterministic plan from all current starter, foundation and course targets. `python3 scripts/generate-azure-library.py submit` takes the Speech key on stdin and submits six batch jobs. `collect` downloads completed ZIPs, verifies exact text/order against provider results, writes MP3s and per-file hashes, and creates the manifest only after all six regions are complete. Persistent job ledgers prevent automatic duplicate generation. ZIPs are ignored; recordings, plan and ledgers are retained. Run `npm run check:audio` after content changes to detect missing/stale coverage.

The owner approved upgrading the dedicated East US resource from F0 to S0 and spending up to $5 for this job. Upgrade is complete. The submitted plan had 16,442 inputs and 197,796 characters, plus an 18-character probe. Validation found 42 unclickable punctuation-only inputs; their outputs are excluded. The original masculine library has 16,400 playable recordings (8,200 unique texts × two regions per language). The submitted plan is retained unchanged as evidence; future plans exclude unclickable segments. At the $15/million East US Standard Neural rate displayed on [Microsoft pricing](https://azure.microsoft.com/en-us/pricing/details/speech/) on 2026-10-20, Azure reported 197,772 billed batch characters, plus the 18-character probe: estimated synthesis is $2.96685 before credits/taxes; this is not a final invoice or account-wide spending cap. No ongoing synthesis occurs from app use. Credential files are temporary, outside the repository; generated files contain no secrets.

Validation passed: all six batches succeeded; all 16,400 shipped files match their generation SHA-256 hashes and have positive provider-reported duration. Eighteen distributed MP3 samples passed local decoder checks. `npm run check:audio` confirms complete current lesson/chunk coverage and voice/file mappings (468.3 MiB, loaded on demand). All 124 automated tests plus syntax/content checks pass. Browser checks verified actual playing MP3 paths for all six locales. Full-library linguistic review and physical iPhone autoplay testing are not claimed. Temporary key file removed after generation. Local test: open `http://127.0.0.1:5173/?pack=foundation`, open the waveform, select a region, tap outside and replay a phrase. Compare the alternate region. Type a partial recall answer and repeat the selector interaction; the draft should remain. No commit, push or publication is included in this local trial.

### Feminine extension — 2026-10-19

The owner approved the proposed approximately $3 addition. The separate immutable `azure-feminine-plan.json` has 16,400 inputs / 197,736 characters. Use `node scripts/prepare-azure-library.mjs --feminine`, then `python3 scripts/generate-azure-library.py submit|collect --feminine` with the credential on stdin. The feminine generation budget guard is $3, separate from the original masculine $5 guard. Existing masculine files and ledgers are preserved. Both manifests point into the same locale directories using voice-specific hashes; no duplicate masculine synthesis is needed. The initial Spain submission failed DNS before reaching Azure; its separate `.dns-failed.json` ledger is excluded from budget reservations. A later network-enabled submission succeeded.

All six feminine batches succeeded: 16,400 recordings, 197,736 billed characters, approximately $2.96604 before credits/taxes. Every feminine file passed hash and positive-duration checks; 18 distributed files passed decoder checks. At this stage, both libraries totaled 32,800 recordings / 940.3 MiB, fetched on demand. All six feminine locales played their expected MP3s in the browser. Saved voice choices survived reload, and the compact controls fit a 375 px viewport. At this stage, the automated suite had 127 passing tests (126 in the full run plus the added fallback regression run); syntax/content and complete audio coverage checks pass. Neutral voices, full linguistic certification and physical-device autoplay testing are not claimed. Temporary credential removed. Nothing is committed or published.

### Four-region extension — 2026-10-19

The owner approved Argentina and Colombia (Spanish), Belgium (French), and Switzerland (German), masculine and feminine, up to $5 total. The immutable `azure-expansion-plan.json` contains 21,984 recordings / 261,780 characters, estimated $3.9267 at the recorded $15/million rate before credits/taxes. Voices: Tomas/Elena, Gonzalo/Salome, Gerard/Charline, and Jan/Leni respectively, all locale-specific Standard Neural voices in Microsoft's catalog. This is pronunciation of the existing lesson text, not a localized vocabulary/grammar curriculum or a Swiss German dialect course.

Prepare with `node scripts/prepare-azure-library.mjs --expansion`; submit/collect with `python3 scripts/generate-azure-library.py submit|collect --expansion` and the existing key on stdin. An eight-voice allowlist and separate cumulative $5 guard bound this job. After all eight batches complete, collection merges into both existing manifests, retaining original regions and voice-specific filenames. Manifest files are replaced atomically individually. Recollecting an older plan also preserves newer regions. All eight batches succeeded. Azure reports 261,780 billed characters ($3.9267 estimated before credits/taxes). All 21,984 new files match their generation hashes and have positive duration; 24 distributed MP3s passed decoder checks. Coverage verification passes for all 54,784 recordings across ten regions (1,563.0 MiB loaded on demand). All eight new voice/region combinations played their expected local MP3 in the browser, and new region choices survived reload. All 128 automated tests and syntax/content checks pass. The temporary key was removed. Full linguistic review and physical-device autoplay testing remain outside these checks. Local only: no commit, push or publication.

### Local accent comparison page

`audio-regions/index.html` presents 13 suggested test words across Spanish, French and German, with each language's configured countries side by side and a single Masculine/Feminine selector. It reads the existing manifests; no synthesis or extra provider charge occurs. Play buttons toggle stop, switching clips/voice or hiding/leaving the page stops playback, and load failures appear contextually. It has no device-voice fallback so comparisons use the exact regional recordings. It does not read/write progress or account settings. Test at `http://127.0.0.1:5173/audio-regions/index.html`: compare la calle and cinco across Spanish regions, tu/dire/petit across French regions, and ich/die Kirche/zwanzig/das Auto across German regions, then repeat with the other voice. Differences are listening candidates, not certification of regional phonetic features. Local only.

The regional IPA experiment was removed at the user’s request. Lesson overlays use shared baseline IPA; the comparison page shows it once per word. Exact recording-matched IPA remains future work.

UI refinement: the popover retains its three-row, heading-free layout with borderless native selects, soft hover/focus treatment, subtle row dividers and 44 px targets. Settings now uses a flat centered list rather than separate bordered cards; account conflict/save decisions remain visible. No account workflow or pronunciation playback behavior changed.

## Release approval — 2026-10-19

The owner approved commit, push and publication of the complete current implementation. `npm run build:static` includes both manifests, the comparison page, and the refined application UI. Its default local build includes all 54,784 Azure clips; the external-audio release omits these clips and uses Azure Blob Storage. Audition assets and generation ledgers remain source-only. Earlier local-only statements are historical trial status. Actual deployment completion must be checked in Sites. Audio is fetched on demand, not preloaded as a whole library.

Separate Azure Blob audio hosting is configured after the Sites source-upload failure. The optional `PERLINGO_AUDIO_BASE_URL` build setting excludes Azure pronunciation MP3s from the static build and configures lesson/comparison playback; default local playback is unchanged. All 54,784 remote recordings are checksum-verified. Sites publication uses a separate lightweight source checkout; see its deployment result for live status. See [hosting status and costs](audio-hosting.md).
