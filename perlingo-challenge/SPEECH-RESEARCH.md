# Recognition selection — research and local implementation

Research date: 2026-10-21. **No provider has yet been established as best for accented single-word recall in any of the 50 languages.** Model support is not evidence of game accuracy. The checked-in fallback remains ElevenLabs; the local environment now explicitly enables the Sarvam/Azure gameplay trial described below. The following is a candidate shortlist and testing infrastructure, not a completed provider migration.

## What to compare

- **Sarvam Saaras v4:** a regional specialist covering the nine Indic languages in this game. Pin the language and use `verbatim` to retain the spoken word in its script. Bengali and Urdu use Indian locales; our content also uses Bangladeshi/Pakistani representative locales, so dialect/lexical differences need specific testing. Documentation claims broad dialect coverage; it does not demonstrate novice foreign-accent single-word accuracy. [Model](https://docs.sarvam.ai/api/getting-started/models/saaras), [request schema](https://docs.sarvam.ai/api-reference/speech-to-text/transcribe).
- **Azure Speech:** locale-selected recognition with coverage for all current languages. This implementation uses its short-audio REST endpoint: final transcript only, no live partials, no pronunciation-assessment/reference-text header. Azure recommends SDK/fast transcription where practical; REST is a minimal comparison adapter, not a latency-optimized streaming integration. Azure does not expose a pinned underlying model version here. [Coverage](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support), [API](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-speech-to-text-short).
- **Google Cloud STT:** `latest_short` is explicitly intended for utterances lasting a few seconds, making it a strong next candidate. Availability must be checked for each locale, API version and region; do not assume every language supports every model. Adapter/credentials are **not implemented**. [Model purpose](https://docs.cloud.google.com/speech-to-text/docs/v1/transcription-model), [coverage](https://docs.cloud.google.com/speech-to-text/docs/speech-to-text-supported-languages).
- **Speechmatics Enhanced:** language packs, including Russian, Ukrainian, Polish, Czech, Slovak, Bulgarian, Croatian and Slovenian; documented accent coverage makes it another useful candidate. Serbian is not listed on the inspected language page. It is not evidence of a dedicated single “Slavic” model or superior non-native recognition. Adapter/credentials are **not implemented**. [Languages](https://docs.speechmatics.com/speech-to-text/languages).
- **NVIDIA NeMo:** regional European multilingual checkpoints are possible self-hosted candidates. GPU hosting, serving and model evaluation would be additional work; no adapter is implemented. [Checkpoint catalogue](https://docs.nvidia.com/nemo/speech/nightly/asr/asr_checkpoints.html).
- **Deepgram Nova-3:** language-selected models are another comparison candidate. No adapter is implemented; vendor aggregate WER claims do not establish performance on this task. [Models/languages](https://developers.deepgram.com/docs/models-languages-overview/).
- **ElevenLabs Scribe v2 Realtime and Soniox stt-rt-v5:** existing baselines, explicit language selection, no reference-answer hints. These remain useful controls even when testing regional specialists.

The prior human pilot comprises 26 cases from 11 recordings in six languages, reusing takes in timing variants. Soniox passed 26/26 labeled decisions; ElevenLabs 25/26, with a French positive missed. This is native/supplemental human audio, not a representative learner-accent corpus. It is insufficient to pick 50 production winners. Synthetic tile checks measure generated audio intelligibility and likewise cannot establish learner recognition accuracy.

## All 50 languages: implemented candidates

Every row also compares ElevenLabs and Soniox. Azure locales below are explicit initial locale choices, not a promise of a separately trained model or an optimal accent choice. Sarvam candidates share the listed Indic locale. No row currently has a validated winner.

| Language | Azure locale | Additional implemented specialist |
|---|---|---|
| English | en-GB | — |
| Mandarin | zh-CN | — |
| Hindi | hi-IN | Sarvam Saaras v4 |
| Spanish | es-ES | — |
| Arabic | ar-SA | — |
| French | fr-FR | — |
| Bengali | bn-IN | Sarvam Saaras v4 |
| Portuguese | pt-BR | — |
| Russian | ru-RU | — |
| Urdu | ur-IN | Sarvam Saaras v4 |
| Indonesian | id-ID | — |
| German | de-DE | — |
| Japanese | ja-JP | — |
| Marathi | mr-IN | Sarvam Saaras v4 |
| Telugu | te-IN | Sarvam Saaras v4 |
| Turkish | tr-TR | — |
| Tamil | ta-IN | Sarvam Saaras v4 |
| Vietnamese | vi-VN | — |
| Korean | ko-KR | — |
| Persian | fa-IR | — |
| Italian | it-IT | — |
| Thai | th-TH | — |
| Gujarati | gu-IN | Sarvam Saaras v4 |
| Polish | pl-PL | — |
| Ukrainian | uk-UA | — |
| Malayalam | ml-IN | Sarvam Saaras v4 |
| Kannada | kn-IN | Sarvam Saaras v4 |
| Romanian | ro-RO | — |
| Dutch | nl-NL | — |
| Hungarian | hu-HU | — |
| Greek | el-GR | — |
| Czech | cs-CZ | — |
| Swedish | sv-SE | — |
| Hebrew | he-IL | — |
| Finnish | fi-FI | — |
| Danish | da-DK | — |
| Norwegian | nb-NO | — |
| Slovak | sk-SK | — |
| Bulgarian | bg-BG | — |
| Croatian | hr-HR | — |
| Serbian | sr-RS | — |
| Malay | ms-MY | — |
| Filipino | fil-PH | — |
| Swahili | sw-TZ | — |
| Afrikaans | af-ZA | — |
| Catalan | ca-ES | — |
| Estonian | et-EE | — |
| Latvian | lv-LV | — |
| Lithuanian | lt-LT | — |
| Slovenian | sl-SI | — |

## Local setup and routing

Ignored repository-root `.env.local` accepts `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` and `SARVAM_API_KEY`, alongside existing ElevenLabs/Soniox keys. Restart the server after editing. Use the existing Azure resource; no new cloud resource or subscription is required by this code. The Sarvam dashboard supplies a subscription key. Never put secrets in browser JavaScript or commit them.

`CHALLENGE_SPEECH_ROUTES={"hi":"sarvam","cs":"azure"}` is an **example testing override**, not the selected production map. Omitted languages retain ElevenLabs. Unsupported assignments fail validation. A configured route to an unavailable provider is reported unavailable; there is no silent fallback or sending audio to multiple recognizers during normal play. The browser receives only provider names/routes and configuration booleans. The game prepares the selected provider for each card, including prewarming; microphone checks use the English route. Recipients are disclosed before enabling the mic. Round records include the language/provider/model map (Azure's model is unversioned).

New adapters send short PCM segments to a same-origin broker, which wraps mono 16 kHz PCM in WAV and calls the provider with server-side credentials. Max request is 15 seconds; browser auto-finalizes at 12 seconds to bound untimed accumulation. Errors pause the round. Closing a card aborts pending REST requests and suppresses stale callbacks. REST has no partial feedback and may exceed the game's 1.5-second deadline grace; live latency testing is required before assigning these adapters to timed Daily. Existing silence detection is unchanged and remains a separate possible source of missed speech.

Both local and hosted handlers implement `/api/speech/transcribe` (hosted prefix `/challenge`). Same-origin/custom-header checks, bounded input, route allowlists, fixed upstream URLs, timeouts and existing best-effort rate limits apply. Audio is held in memory, forwarded to the selected provider and not logged/saved by this app; provider policies still apply. No new production secrets have been configured and nothing in this change has been deployed.

## Evaluation and promotion

Open `/challenge/speech-lab.html` in the combined local preview (or `/speech-lab.html` on port 5174). Choose language, word and expected verdict; select configured providers; record once, replay, then compare. Each receives identical PCM without reference-answer hints. The comparison now uses the game's speech matcher and same-language competing words, including speech-only alternatives. Results export model, transcript, decision and latency but no audio or credentials. Audio remains in page memory until departure. The lab is excluded from production.

Before changing routes, collect multiple learners, accents, words and repetitions per language. Include silence, wrong words, similar-sounding words, hesitations and self-corrections. Separate speakers/words used for choosing routes from held-out tests. Report false rejects, false accepts and result latency separately, with sample counts. A small pilot can select a provisional testing candidate; it cannot establish reliable population accuracy. Test the winning candidate again with the actual microphone, endpointing and timed game. If vocabulary bias is later explored, compare the same full vocabulary for positives and negatives; do not give a recognizer only the current answer. Avoid an “any provider says yes” ensemble without negative testing, since it can increase false accepts.

Current verification is automated broker/routing/session tests only. Sarvam credential smoke test succeeded on 2026-10-21: the existing generated Hindi Bread MP3 was submitted directly (no answer hints), using saaras:v4, hi-IN and verbatim mode; HTTP 200, transcript रोटी, 1305 ms request-to-response. This checks credentials and one generated clip only, not the browser PCM adapter, comparative accuracy or human accents. Azure live broker pilot also completed: 17 cases across English, French, Spanish, Japanese, Mandarin and German; accepted 5/6 positive recordings and rejected all 11 wrong-word/silence controls. Japanese Bread returned an empty transcript. See azure-human-pilot.json and scripts/check-short-speech.mjs for exact inputs, hashes and timings. This small native/supplemental corpus does not establish learner-accent accuracy; those evaluations remain outstanding. Google/Speechmatics/Deepgram/NVIDIA remain research candidates, not integrated features.

Local gameplay trial enabled on 2026-10-21 at the user’s request: `.env.local` now assigns Sarvam to Hindi, Bengali, Urdu, Marathi, Telugu, Tamil, Gujarati, Malayalam and Kannada, and Azure to the other 41 languages. This applies to normal localhost gameplay, including Unlimited; it is a provisional trial, not validated winner selection. Production is unchanged. Restart the local server after changing the route map.

## Reported failures and reduced game pools (2026-10-21)

User report: Tamil, Telugu, Malayalam, Danish, Bengali and Norwegian repeatedly returned **wrong transcripts** during Bread and Moon gameplay. This is real user evidence of an unacceptable experience, but not enough to declare those languages inherently unrecognizable. No recordings of that user's attempts were captured. A separate Azure control sent the same public English Bread PCM with 0.2 seconds and 6 seconds of leading silence; both returned Bread. That test did not reproduce an initial-silence failure; it does not rule out other capture/endpointing issues.

`screen-recognition.mjs` compares all twelve cached teaching clips in the six reported languages plus one silence control per language. It uses the current matcher and records transcripts and hashes in `recognition-six-language-screen.json`. These are **synthetic study-voice sanity checks**, not independent accent benchmarks. In particular, most study clips were originally selected using Soniox, which biases this corpus in its favor. Wrong-vocabulary acceptance checks cover the other eleven taught words only, not arbitrary speech. Do not use the pass fractions as estimates of real-user accuracy or as proof of the best recognizer.

### Concrete next recognition candidates

- Google Cloud STT V1 `latest_short`, with `ta-IN`, `te-IN`, `ml-IN`, `da-DK`, `bn-BD`, `no-NO`, is explicitly available for all six. This is a use-case-specific candidate for isolated utterances; it is not proof of superiority or six separately trained monolingual networks. Bengali requires care: the inspected V1 matrix lists latest_short for bn-BD, while bn-IN lists default/command_and_search. [Official locale/model matrix](https://docs.cloud.google.com/speech-to-text/docs/v1/speech-to-text-supported-languages), [short-model purpose](https://docs.cloud.google.com/speech-to-text/docs/v1/transcription-model). Google is not integrated or active yet; its API is being set up in the existing Perlingo project.
- Deepgram Nova-3 lists Bengali, Tamil, Telugu, Danish and Norwegian. Malayalam is not listed in that model's inspected coverage. This is another candidate, not a demonstrated winner. [Official coverage](https://developers.deepgram.com/docs/models-languages-overview/).
- Speechmatics Enhanced lists Tamil, Bengali, Danish and Norwegian; Telugu and Malayalam are absent from the inspected list. [Official language packs](https://docs.speechmatics.com/speech-to-text/languages).
- AI4Bharat IndicConformer provides a multilingual checkpoint and monolingual checkpoints for Indian languages. This is a genuine per-language-model research direction, but deploying it needs its model runtime and evaluation; no local/hosted inference integration is claimed. [Official project and checkpoints](https://github.com/AI4Bharat/IndicConformerASR).

No inspected source establishes a universally best provider for accented single words. Published support and aggregate accuracy marketing are not comparable game tests.

### In-game exploration, not permanent deletion

Earlier trial, superseded by the current 33-language roster below: Unlimited had 25, 30, 35, 40, 42 and All 50 selections directly in its Languages dropdown, plus Customize for the existing tree. Selecting a pool resets the script filter to All scripts and saves the choice. These are nested **editorial trial sets**, not a measured ranking of online resources or ASR accuracy. Content/audio remain available in All 50 and Customize; no saved history is removed. Daily/Archive retain their fixed 50-language rules until a final pool is chosen.

| Pool | Composition / change |
|---|---|
| 25 | English, Mandarin, Hindi, Spanish, Arabic, French, Portuguese, Russian, Indonesian, German, Japanese, Turkish, Vietnamese, Korean, Italian, Thai, Polish, Ukrainian, Romanian, Dutch, Hungarian, Greek, Czech, Swedish, Hebrew |
| 30 | 25 + Finnish, Malay, Persian, Catalan, Filipino |
| 35 | 30 + Bulgarian, Croatian, Slovak, Serbian, Slovenian |
| 40 | 35 + Estonian, Latvian, Lithuanian, Afrikaans, Swahili |
| 42 | 40 + Urdu, Marathi |
| 50 | 42 + Gujarati, Kannada, Tamil, Telugu, Malayalam, Danish, Bengali, Norwegian |

42 removes the six user-reported problem languages plus Gujarati/Kannada as a provisional extra cut to reach the requested count—not because their recognition was proven bad. Further reductions trade breadth for fewer languages to validate. 35 is an initial product-testing suggestion, not a quality guarantee. The six reported languages are excluded from all reduced presets but remain available individually for recognizer retries. Flagged translations/audio still require their own source-based review; a failed transcript alone must not rewrite the teaching content or accepted answers.

### Completed six-language screen and actual local routing

78/78 cases completed (72 generated clips + 6 silence controls). Accepted teaching clips:

| Language | Sarvam | Azure | ElevenLabs | Soniox |
|---|---:|---:|---:|---:|
| Tamil | 10/12 | 11/12 | 7/12 | 12/12 |
| Telugu | 10/12 | 12/12 | 7/12 | 12/12 |
| Malayalam | 10/12 | 11/12 | 9/12 | 12/12 |
| Danish | — | 10/12 | 7/12 | 11/12 |
| Bengali | 12/12 | 11/12 | 9/12 | 12/12 |
| Norwegian | — | 10/12 | 11/12 | 12/12 |

All providers rejected their silence controls, with no other taught pack accepted by the returned transcripts. This narrow negative screen does not measure arbitrary wrong-word false accepts. All providers missed the existing Danish Tree clip, whose known failed transcription already has a user-approved hash-bound inclusion exception; the content/acceptance rules were not silently changed.

Based on this limited sanity screen and the user's repeated failures with the current trial, `.env.local` now routes the six reported languages to **Soniox for a further gameplay trial**. Remaining languages retain their prior routes: five Indic languages to Sarvam, 39 to Azure. This supersedes the earlier 9/41 local trial. It does not certify Soniox as best or resolve the user-accent report. Google setup is still pending; there is no hidden Google fallback. All 207 repository tests passed after adding the pools. No changes have been committed, pushed or published.


### Google short-utterance adapter (local trial active)

The game and same-origin broker now support Google V1 `latest_short` for ta-IN, te-IN, ml-IN, da-DK, bn-BD and no-NO. The locale is pinned server-side, with raw 16 kHz mono LINEAR16 audio and no target-answer hints. Bengali uses Bangladesh Bengali because that locale lists this model; it is not interchangeable with an Indian Bengali validation result. Norwegian uses Google's no-NO rather than Azure's nb-NO.

Set `GOOGLE_SPEECH_API_KEY` in the ignored root `.env.local`, restrict the key to Cloud Speech-to-Text, and explicitly assign `google` in `CHALLENGE_SPEECH_ROUTES` to activate it. Keys stay server-side; a fixed Google endpoint receives audio, and client responses contain only transcript/final status. API-key authentication for V1 is demonstrated in [Google's official lab](https://www.cloudskillsboost.google/course_templates/634/labs/461613). [Model documentation](https://docs.cloud.google.com/speech-to-text/docs/v1/transcription-model) describes short utterances; [locale support](https://docs.cloud.google.com/speech-to-text/docs/v1/speech-to-text-supported-languages) determines the six initial candidates. This is a task-specific model selection, not proof of six separately trained monolingual networks or improved learner-accent accuracy.

The Speech-to-Text-only key is configured in the ignored local environment. `scripts/check-google-speech.mjs` produced `google-short-word-screen.json`: 12/12 generated Bread/Moon clips accepted, 6/6 silence cases rejected, no request errors. These are synthetic integration checks, not learner-accent evidence. Local gameplay now routes the six languages to Google, keeping five other Indic languages on Sarvam and 39 on Azure. Earlier Soniox route notes above are superseded. Production is unchanged. Unit tests verify the six fixed locales, exact model/PCM configuration, silence, missing credentials and upstream error redaction.


### Current 33-language trial (October 21, 2026)

Unlimited now defaults to English, Mandarin, Hindi, Spanish, Arabic, French, Bengali, Portuguese, Russian, Urdu, Indonesian, German, Japanese, Telugu, Turkish, Tamil, Korean, Persian, Italian, Thai, Polish, Ukrainian, Romanian, Dutch, Hungarian, Greek, Swedish, Hebrew, Filipino, Swahili, Catalan, Czech and Serbian. A one-time local preference migration selects this roster and All scripts while preserving timing and other settings; subsequent choices are preserved. The selector offers the full 33-language roster or a custom subset of it. The 12 playable packs provide 396 teaching entries. Earlier source-bank entries are retained internally for archival records and content checks.

All calendar dates use version 4 rules with these 33 IDs for new attempts. Stored round totals and review data are unchanged. Languages outside this roster cannot be selected for new rounds. Arabic remains an improvement priority; inclusion does not assert measured recognition reliability. Speech providers are unchanged by this roster edit. Local preview only; not committed or deployed.


### Arabic/Vietnamese latency trial (October 21, 2026)

Local gameplay now assigns Arabic and Vietnamese to Soniox `stt-rt-v5` with strict language hints, replacing Azure REST for these two languages only. This is a streaming trial, not a new specialist model or proof of learner-accent superiority. Other routes are unchanged. Google `latest_short` candidates ar-SA and vi-VN are implemented but not selected, based on Google's V1 language/model matrix: https://docs.cloud.google.com/speech-to-text/docs/v1/speech-to-text-supported-languages .

`recognition-arabic-vietnamese-screen.json` records all 12 teaching clips per language plus silence, tested on identical PCM through Google/Azure/ElevenLabs/Soniox. Arabic: Google 10/12, others 12/12. Vietnamese: all 12/12. All silence rejected and no other taught pack accepted. Median final-result delay after clip end: Arabic Soniox 46 ms vs Azure 460 ms; Vietnamese Soniox 87 ms vs Azure 403 ms (Google 504/534 ms; ElevenLabs 148/183 ms). These measurements exclude connection setup and actual microphone endpointing. Cached teaching clips were selected partly using Soniox, so accuracy comparisons are biased and do not predict foreign-accent performance. User speech still requires actual gameplay testing.

The game's silence wait is now 320 ms rather than 400 ms, and the extra one-second inter-submission gate is removed. Providers that serialize requests still refuse commits while pending; the game retries on later audio blocks. Short internal pauses under 320 ms remain within an utterance; longer pauses can split phrases. Final-only scoring, stale-card guards and the 1.5-second deadline grace are unchanged. No target-word hints or relaxed answer exceptions were added. Production is unchanged.


### Arabic specialist active; Vietnamese specialist setup pending (October 21, 2026)

Local gameplay routes Arabic to Munsit's Arabic-only `munsit` model through the bounded short-audio broker. `MUNSIT_API_KEY` is stored only in ignored `.env.local`; the browser receives no credentials. WAV uploads contain no answer hints, request `return_timestamps=false`, and return only the transcript. Munsit's current REST schema is documented at https://docs.munsit.com/speech-to-text/transcribe . Closing a session aborts pending work and suppresses stale scoring. Production is unchanged.

The live Bread/Moon/silence integration check is recorded in `munsit-short-word-screen.json` and reproducible with `SCREEN_PROVIDER=munsit SCREEN_LANGUAGES=ar SCREEN_OUTPUT=munsit-short-word-screen.json node perlingo-challenge/scripts/check-google-speech.mjs`. Both teaching clips were accepted; silence produced unrelated Arabic text which the game rejected. This is not learner-accent validation and does not demonstrate robustness to arbitrary silence/noise. Internal evaluation only; no public comparison claim. Initial REST latency is not equivalent to the previous Soniox streaming speed. Munsit streaming relay remains future work: https://docs.munsit.com/speech-to-text/streaming . The 320 ms silence wait and removal of the one-second submission gate remain active.

FPT's older individual Speech-to-Text service was discontinued (new service stopped July 6, existing plans ended August 29, 2026), and the replacement account's model-permission list offered no STT model. Its obsolete adapter was withdrawn and no FPT key created. Official notice: https://fpt.ai/vi/tin-tuc/thong-bao-quan-trong-ve-viec-ngung-cung-cap-dich-vu-ca-nhan-tren-fpt-ai-console/ . Viettel's explicitly Vietnamese speech service is the next candidate; account/API setup is pending. Vietnamese remains on Soniox until a specialist is validated and activated. Sources: https://viettelai.vn/en and https://viettelai.vn/en/tai-lieu . Jais-ASR (Arabic) and NVIDIA Vietnamese Parakeet are additional self-hosted candidates, not integrated: https://huggingface.co/IFM/Jais-ASR and https://build.nvidia.com/nvidia/parakeet-ctc-0_6b-vi/modelcard .


Vietnamese trial update (October 21, 2026): at the user's request, local gameplay now uses ElevenLabs `scribe_v2_realtime` with explicit Vietnamese language selection. Viettel setup is abandoned. Arabic stays on Munsit; other routes are unchanged. This is a multilingual streaming baseline trial, not a specialized Vietnamese model or proven accent improvement. The earlier Arabic/Vietnamese screen recorded 12/12 Vietnamese teaching clips accepted and silence rejected for ElevenLabs, with 183 ms median final-result delay after clip end (excluding connection and microphone endpointing). Existing synthetic-selection limitations still apply. Reload the local game to load the route. Nothing deployed.

Navigation: clicking a recall dot or using left/right arrows rotates the unanswered queue into the fixed visible dot order. Automatic advancement follows the next unanswered dot to the right, wrapping at the end; it does not resume the previous queue order. Score and time are preserved.

Current app roster: 33 languages throughout setup, new Daily/Archive attempts, custom selection, language maps, help and audio credits. Customization can select a subset, but cannot restore retired languages. Saved scores keep their recorded totals; source-bank and IPA evidence retain historical entries internally. A one-time preference migration selects the 33-language roster, and later stored selections are filtered to it.
