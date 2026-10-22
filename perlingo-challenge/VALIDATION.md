# Local validation — October 20, 2026

## Earlier implementation evidence (shared TTS since retired)

- Saved ElevenLabs key is present; single-use Scribe token request succeeded. No key/token values were printed.
- English, French and Spanish generated Bread audio returned MP3 successfully. Each was converted to mono 16 kHz PCM and streamed at real-time pacing to the live Scribe endpoint.
- Generated fixtures recognized as `Bread.`, `Pain.`, and `"Pan".` and passed the deterministic matcher. Final transcripts arrived approximately **147 / 206 / 176 ms after manual commit**, respectively. Total fixture-and-response times were approximately 1.94 / 2.00 / 1.98 seconds. These are three synthetic samples, not p50/p95 or a natural-accent benchmark.
- An earlier very short system-voice `bread` fixture was misrecognized as `Red.` and correctly rejected. Later tests used different generated audio and added silence padding, so this does **not** isolate or prove the cause of that first error.
- All 50 configured language codes accepted by live Scribe session handshakes (`provider-check.json`). No microphone audio in this audit.
- Browser: home/study grid, setup controls, ready transition, typed scoring, passing and completing a five-language round, results and attempt review.
- Automated checks: challenge-specific tests plus the existing repository suite and content checker. Exact final counts are reported in the handoff.

## Still needs user acceptance testing

Live browser microphone permission/capture, the user's accent, near-miss discrimination, tonal contrasts, very quiet speech, Bluetooth microphones, provider behavior across all languages and slow network conditions, mobile Safari, and native-device pronunciation quality in each language. No measured production latency or 50-language accuracy guarantee is claimed. Content and IPA limitations are in `CONTENT.md`.

## Reproduce provider checks

With the preview server running and credits available:

```sh
node perlingo-challenge/scripts/check-provider.mjs
node perlingo-challenge/scripts/smoke-speech.mjs /absolute/path/mono-16khz-pcm.wav en bread
```

The smoke script uses synthetic/file audio explicitly provided to it, adds leading/trailing silence, and prints only language, expected word, transcript, match and timing. The WAV must be mono signed 16-bit PCM at 16 kHz. It is not a general audio converter.

## Speech revision

- Historical device-voice stage (superseded for tile playback by the human recording library): shared English-voice synthesis removed. Device voice selection is language-specific, with French Thomas preserved and Cantonese excluded for Mandarin. Browser comparison page reports 35/50 installed languages; missing: Bengali, Urdu, Marathi, Telugu, Persian, Gujarati, Malayalam, Kannada, Serbian, Filipino, Swahili, Afrikaans, Estonian, Latvian and Lithuanian. Full playback coverage is not implemented on this device.
- Removed commits triggered by promising partial transcripts. Silence threshold is now 400 ms; only final transcripts score.
- Soniox adapter, token broker, provider selector and paired-recording comparison page implemented. Adapter regression tests cover subword assembly, finalization, errors and absence of answer hints. Soniox key is configured and temporary-key issuance succeeded. The first live transcription returned 402 (payment required); the run was stopped. After funding, paired recognition testing succeeded; see the results below. Implementation tests are not evidence of provider accuracy.
- `speech-baseline.json` records actual API outcomes for independent macOS synthetic samples. Its missing-provider list and errors must remain visible; never treat an unavailable service as a recognition failure or a comparison winner.
- Browser checked: recognition selector, comparison page, target selection and installed-voice coverage. Real microphone samples remain a user acceptance step.

Official protocol references: [Soniox temporary credentials](https://soniox.com/docs/guides/temporary-api-keys), [WebSocket authentication](https://soniox.com/docs/guides/websocket-authentication), [STT configuration](https://soniox.com/docs/api-reference/stt/websocket-api).

### Earlier ElevenLabs-only baseline

18 live ElevenLabs cases: six languages × (correct Bread, wrong Water, silence). Four of six positive samples accepted; French `pain` → `Fain.` and Spanish `pan` → `Ven.` were false rejects. All 12 negative/silence cases rejected. Post-clip finalization was 103–179 ms, excluding the three-second clip and connection setup. This tiny synthetic set is not a population accuracy estimate. Soniox was not configured during this run, so no provider ranking is supported. These are historical results from the initial ElevenLabs-only run. The subsequent partial paired run is saved as `soniox-connectivity-check.json`; Soniox returned payment-required 402 and was not an accuracy comparison.

## Funded paired comparison — October 20, 2026

Both providers received the exact same 36 synthetic PCM recordings across English, French, Spanish, German, Mandarin and Japanese. Each language had one correct word, wrong word, silence, self-correction, late-positioned correct word and similar-sounding wrong word. Three-second capture, 16 kHz mono PCM, real-time pacing, a known language and no answer/context hint; one manual finalization at clip end. ElevenLabs used `scribe_v2_realtime`; Soniox used `stt-rt-v5` with strict language hints. Raw outcomes are in `speech-baseline.json` (18 cases) and `speech-stress.json` (18 cases).

| Metric | ElevenLabs | Soniox |
| --- | ---: | ---: |
| Correct samples accepted | 13 / 18 | 11 / 18 |
| Incorrect/silent samples falsely accepted | 0 / 18 | 1 / 18 |
| Median finalization latency after clip | 176 ms | 67 ms |
| Provider errors | 0 | 0 |

Soniox's false accept was German `rot` transcribed as `Brot.`. Both rejected all baseline Water/silence negatives. Both missed standalone French `pain` and Spanish `pan`; Spanish self-correction succeeded for both. ElevenLabs missed late Japanese `パン` as `バン`; Soniox transcribed both standalone and late Japanese `パン` as `番`.

These results support retaining ElevenLabs as the existing default for now, with Soniox selectable. They do not establish a general provider ranking, human accent accuracy, or sufficient reliability for scoring: only one system voice and one take per language/category were tested. End-of-clip latency excludes the three-second sample and connection setup and is not end-of-speech latency. The comparison finalizes once; game silence-triggered finalization still needs human testing. No matcher relaxation was added to hide provider errors.

For user acceptance, open `/speech-lab.html`, record actual correct answers and near-misses in familiar languages, replay to check capture, compare both, and export results. Then test the same words in a spoken game round, including self-corrections and a last-moment answer. Device playback remains limited to the 35 installed languages; the other 15 have no cross-language fallback.

Soniox configuration audit: all 50 language hints completed a one-second silent stream and manual finalization without errors (`soniox-language-check.json`). This checks accepted configuration, temporary credentials and finalization only; it does not establish spoken-language accuracy. Final automated checks: 148 repository tests passed, content checker passed, and `git diff --check` passed. No commit or publication.

## Sourced human-recording pilot — October 20, 2026

This supersedes the synthetic pilot as the better available evidence for provider selection, without claiming a population accuracy estimate. No default-provider or scoring changes were made in this research task.

11 public human recordings produced 26 paired cases across English, French, Spanish, German, Mandarin and Japanese: 6 normal-position positives, 6 late-position positives, 5 negatives, 6 silence controls and 3 constructed corrections. A second provider received the exact same bytes at real-time pace, with a language hint but no expected-answer hint. Audio was decoded with FFmpeg 7.1 to mono 16 kHz, without synthesis, normalization or trimming. Clips were padded or concatenated whole; German correction was omitted because it would not fit the window. Corrections are splices, not natural human corrections. Timing variants reuse the same take and are not independent speakers.

| Metric | ElevenLabs | Soniox |
| --- | ---: | ---: |
| Expected-correct cases accepted | 14 / 15 | 15 / 15 |
| False accepts among negatives/silence | 0 / 11 | 0 / 11 |
| Median finalization after clip | 144 ms | 52.5 ms |
| Service errors | 0 | 0 |

Only miss: ElevenLabs transcribed the late-positioned native French `pain` as `Pan.`; its normal-position version was correctly recognized by both. All six normal-position positive recordings were recognized by both. Soniox correctly rejected human German `rot`, unlike the previous synthetic example. These outcomes support trying Soniox on the user's microphone next; they do not establish universal superiority or learner-accent performance.

### Provenance and limits

- English: Dvortygirl, Commons profile declares native English.
- French positive: Kipmaster, Commons profile declares native French; the file specifies Île-de-France pronunciation. Current source revision was amplified by Ruan123.
- Spanish: Eavqwiki, linked personal account Eavq/Emma vq declares native Spanish. Both account pages cross-link.
- German: Jeuwre, both source descriptions and profile identify a native German speaker from Berlin.
- Mandarin: Shangkuanlc's Chinese Wikipedia profile declares native Chinese; the audio is labeled Mandarin (`cmn`). A separate specifically-Mandarin native declaration was not established.
- Japanese: Lingua Libre credits 葵心 as the speaker; native-language declaration was not confirmed. Kept supplemental.
- French negative `Fr-eau.ogg`: source identifies Nicolas Vion, a male French speaker from Paris, and labels `de l'eau`; a separate native declaration was not checked. It and its constructed correction are supplemental.

The declared-native subgroup contains 12 expected-correct cases and 4 negatives (ElevenLabs 11/12 positives, Soniox 12/12; neither falsely accepted a negative). The supplemental human group contains 3 positives and 1 negative, all scored correctly by both. Six silence controls are separate. Source/self-reported native status is not independent phonetic certification; recordings were selected by published word/language labels, attribution, and provenance, not by the recognizers' outputs. No recording was excluded because a recognizer failed. Missing candidate files and rate-limited originals were resolved before testing; official MP3 renditions are identified in the manifest.

[Playable report](human-speech-report.html) embeds all exact submitted clips and source attribution/license links. Its generator reconstructed and SHA-256-checked every playable clip against submitted bytes. [Source manifest](human-audio-sources.json) includes URLs, licenses, speaker evidence and hashes; [raw results](human-speech-results.json) include every transcript, outcome, and latency. Native provenance is self-reported/source-described, not inferred from the voices. See the challenge README for reproduction. All 18 challenge tests and `git diff --check` passed. No commit or publication.

## Human tile playback (2026-10-21)

- Replaced challenge tile synthesis with bundled human recordings: Bread 42/50, Water 45/50. Main course synthesis and French Thomas preference are unchanged. ElevenLabs remains the default recognizer.
- `tile-audio-sources.json` contains all source URLs, speaker credits, licenses, native-status caveats, source and asset hashes, and conversion details. 32 clips have source-described/self-reported native evidence; 55 do not have a verified native declaration. This is not full native-speaker certification.
- Excluded Lithuanian clips by Renvoy (profile lt-2), Portuguese bread by Nelson Ricardo 2500 (pt-4), and Arabic water by Annisa Tiara Ramadhani (ar-2; replaced with Zinou2go). Hungarian bread by Beaudine Wilson was withheld pending speaker evidence. French `Fr-eau.ogg` was excluded because it contains an article; Italian `It-il pane.ogg` was excluded for the same reason.
- Bread gaps: Portuguese, Urdu, Hungarian, Greek, Finnish, Croatian, Lithuanian, Slovenian. Water gaps: Persian, Gujarati, Greek, Croatian, Lithuanian. No synthetic fallback or cross-language substitution is used. Forvo sourcing requires an API key and remains proposed, not implemented.
- `tile-audio-validation.json`: all 87 MP3s decode with FFmpeg 7.1, are non-silent, and span 0.445–3.014 seconds. These are file-integrity checks, not a linguistic listening review or evidence of improved STT accuracy.
- 22 challenge tests pass, including manifest/hash/word matching, interruption/error settlement, and serving only listed audio assets. JavaScript syntax and whitespace checks pass.
- Browser check: French and Japanese Water tile clicks produced no playback errors; a missing Persian clip shows the intended message; recognition remained ElevenLabs in Adjust challenge. Credits page shows all 100 entries and 87 playable records.


## Language-specific generated playback (current)

100 generated Bread/Water clips across all 50 languages passed independent Soniox exact-word screening (89 ElevenLabs synthesis, 11 Azure synthesis). The original six transcript mismatches were replaced and screened again; Serbian Latin/Cyrillic and Thai composed/decomposed text were adjudicated as orthographic equivalence without editing transcripts. All selected assets are hash-checked and decode. This is an intelligibility screen, not a native pronunciation judgment; no native-speaker listening review has been performed. The generated source/check manifests preserve model, voice and result evidence. No human clips remain selected for tiles and no tiles lack audio. Human clips remain comparison references. Two Azure Slovenian Bread candidates failed the screen; the second also failed ElevenLabs recognition. The final Slovenian-primary ElevenLabs Ana v4 clip passed Soniox. Complete coverage does not imply complete linguistic validation.

The 23 challenge tests pass, including exact-word screening, selected asset/hash/source checks, playback cancellation, audio allowlisting and unchanged recognition session tests. Game recognition remains ElevenLabs. Review instructions and reproduction commands are in README.md.

## Glottolog tree picker — 2026-10-21

Imported the hash-pinned official Glottolog 5.3 archive: 27,177 nodes, 429 roots, and 50 unique ISO-matched playable mappings. Added tests for ancestry/coverage, Romance and Slavic branch selection, partial states, overlapping selection, unsupported entries, aliases, legacy migration, script intersection, and static JSON serving/isolation. `npm test`: 158 passing; `npm run check`: passed. Challenge subset: 28 passing.

In-app browser verified: Romance selects exactly six tiles and survives reload; removing French makes Romance mixed; cancel preserves the saved six; a Han filter yields zero matches and disables Start; All 50 restores the collection; Playable only and Indo-European expansion work. Existing unsupported Basque is disabled and links to its Glottolog record. Native search fields consume the first Escape to clear nonempty search; a subsequent Escape dismisses the dialog. New catalog selection does not change audio assets or recognition adapters. No new live microphone accuracy claim; real-phone layout remains a user acceptance check.

## Visual family tree — 2026-10-21

Replaced the nested-list browse view with connected cards, a family overview/focused family view, native scroll/blank-space mouse drag, zoom buttons, Ctrl/Command-wheel zoom, Fit and Reset. Search retains the accessible list. Simplified view compresses single-child chains while preserving playable entries and selected core group labels; Full detail restores source levels. Playable only now defaults on. No source data, audio or recognition changes.

Challenge suite: 29 tests pass, including traversal proving all 50 mappings remain reachable in simplified mode. JavaScript syntax check passes. Browser checks: expanding Dravidian and South Dravidian draws connected nodes; selecting Dravidian selects four languages; unchecking Telugu yields three and a mixed parent; All 50 restores selection; Fit frames the tree, Zoom in increases its displayed scale, and Full detail toggles. Screenshot: ignored `.cache/visual-family-tree.png`. Touch/pinch and real-phone behavior remain user acceptance checks; touch supports native scrolling, while explicit zoom buttons are provided.

## Leaf-labelled overview — 2026-10-21

Default focused trees now label language tips only, with accessible circular branch checkboxes and family names on hover/focus. The editorial projection retains major Romance/Germanic/Slavic/Indo-Aryan/Iranian/Celtic groups where present and skips other intermediate nodes; Full detail retains exact source parentage and labels. Family overview labels remain for navigation. Simplified language tips omit unplayable dialect descendants; these remain accessible in Full detail. Search can focus a subtree without enabling Full detail.

29 challenge tests pass. The projection test checks direct Indo-European major groups, six direct Romance language tips, source-parent behavior in Full detail, and reachability of all 50 playable mappings. Browser verified Romance branch selects six, deselecting French leaves five/mixed state, collapse/expand hides/restores tips, and Full detail restores Eastern Romance/Italo-Western Romance. Selection survives mode changes. Screenshot in ignored `.cache/leaf-family-tree.png`. Speech and audio unchanged.

## All-language canvas — 2026-10-21

All 50 tips open on one zoomable forest canvas. Family roots remain separate; no common linguistic ancestor is invented. Show all expands playable branches and fits the canvas; search jumps within the forest. Full detail and branch selection remain available.

30 challenge tests pass, including exactly-once coverage of all 50 tips. Browser: counted 50 rendered language labels; deselecting Romance leaves 44 selected while English stays selected; collapsing Romance leaves the other 44 tips rendered; Show all restores 50. Zoom in and Fit verified. Screenshot: ignored `.cache/all-languages-canvas.png`. Overview text is necessarily small when fitted; zoom/pan provides readable detail. No audio/recognition changes.

## Dedicated radial exploration page — 2026-10-21

`/tree.html` replaces the popup as the current exploration surface; the existing challenge selection picker remains available separately. New full-viewport SVG uses a central collection root, smooth cubic curves, 50 language-only tip labels and compact controls. No game settings, content, audio or recognizer changes.

32 challenge tests pass. New checks cover exactly 50 unique radial tips in both modes, centered collection root, finite curved paths and allowlisted page/assets. Browser verified 67 simplified branches versus 244 detailed branches, with 50 tips in both; Romance search highlights six; zoom increases to 125%; pointer drag changes the canvas translation; Fit recenters. Screenshot: ignored `.cache/radial-tree-page.png`. Physical-device pinch and mobile usability remain user acceptance checks; no claim of device testing.

## Pronunciation-tree prototype — 2026-10-21

Added a two-sided horizontal card layout alongside the radial language view. Default is Bread/Romance for legible comparison; All 50 and all playable root families remain available. Cards show existing authored word/reading and use existing cached recordings. No new pronunciation accuracy claim or generated assets. Full detail follows the same source hierarchy; layout does not represent word etymology.

33 challenge tests pass, including card separation, finite curves and unique tip coverage for both detail levels across all 50, Romance and Germanic. Browser verified six Romance cards; French Bread playback completed without an exposed error (not an independent listening review); Water changes the French card to eau; All 50 renders 50 cards; Languages renders 50 radial tips; Full detail retains the six Romance cards. Existing recording interruption tests remain passing. Screenshot in ignored `.cache/pronunciation-tree.png`. Real-device pinch/audio listening remain user review.

## Pronunciation forest — 2026-10-21

Default Forest/Bread/All 50 displays 12 separate family panels, Indo-European first. No collection root or cross-family edges. Cards are packed in non-overlapping family grids, with curved connections routed through gutters. Single tree and radial Languages remain selectable; family filtering, Full detail, search, pan/zoom and cached playback remain available.

34 challenge tests pass. Added coverage for 50 unique tips in both detail modes, family-panel separation, contained cards, finite paths and no cross-family connections. Browser counted 50 cards and 12 headings; Full detail retains 50; Water changes the cards and French eau playback exposed no error (not a listening review). Screenshot: ignored `.cache/pronunciation-forest.png`. All-50 fit provides an overview; zoom remains necessary for comfortable small-text reading on narrower screens.

## Relationship-driven Indo-European clusters — 2026-10-21

Simplified forest layout now groups larger families by their projected child branches. Indo-European has separate labeled columns for Romance (6), Germanic (7), Slavic (9), Eastern Baltic (2), Indo-Aryan (5), Iranian (1), and Greek (1). Incoming curves and per-group stems align with contained language cards. Eastern Baltic is an explicit Glottolog-backed overview group, not an invented family. Full detail retains the original source hierarchy.

35 challenge tests pass. Added membership and containment checks for the major groups, plus disjoint cluster bounds; existing 50-tip and family-separation checks pass. Browser confirmed 50 cards in All 50 and seven Indo-European group labels; focused Indo-European has 31 cards and Romance search highlights six. French cached playback exposed no error; this is not a listening-quality assessment. Preview screenshot in ignored `.cache/indo-european-clusters.png`.

## Separate readable forest and language-only artifact — 2026-10-21

`/forest.html` now uses a responsive HTML overview instead of a scaled SVG canvas. Native buttons preserve word, reading, keyboard interaction and cached audio. Family/branch sections remain explicit. `/tree.html` is restored to the language-only radial artifact with search, pan/zoom and Full detail; both pages link to each other and the home header links to both.

36 challenge tests pass, including serving/cross-link checks for the new page and its assets. At the actual 940×704 browser viewport, both Bread and Water render exactly 50 cards, with the last card ending at y=675 and no word overflow. Bread word sizes were 18.2143–20px, without canvas scaling. Smaller viewports reflow and may scroll; the claim is limited to the tested viewport. Water/French playback exposed no error (not a listening-quality evaluation). The separate radial page has 50 tips and zero word cards in both detail modes. Screenshot: ignored `.cache/readable-forest.png`. No speech assets, recognition settings, game selections, commits or publication changed.

## Families as challenge default — 2026-10-21

38 challenge tests pass. Added family-board checks for exactly-once selected language rendering, Latin-only and mixed-family subsets, empty selection and empty-branch removal, plus serving/stylesheet linkage. Browser verified default Families with 50 tiles; Compact displays 50 and persists across reload; Latin produces 29 family tiles; study starts with 50 family tiles. Switching to Compact preserved the running clock at 1:43 (no reset), and switching back retained the selection. End round returned home without a recall score. French Water tile playback exposed no error. Saved preview `.cache/default-families.png`. No speech/recognition or scoring changes; standalone artifacts remain separate.

### Compact tile sizing (2026-10-21)
- Compact now uses the family board's 60px minimum-height tiles, typography and word fitting in a flat responsive grid with 5px gaps. Results retain the original grid.
- `node --check perlingo-challenge/public/app.js` and all 38 challenge tests passed.
- Browser check with all 50 Water languages: 50 tiles, 60px tile height, 320px total grid height, no overflowing word labels at the preview viewport. Visually verified the ungrouped layout.
- Preview: http://127.0.0.1:5174/ — select Compact, compare with Families, and resize the window to see columns reflow.

### Continuous family grid (2026-10-21)
- Families now uses the same responsive column layout as Compact, ordered by family/major branch, with subtle group tints and a label on each group's first tile. Groups may wrap across rows. Removed branch connectors and separate panels; retained accessible parent-family labels.
- All 38 challenge tests pass. Browser verification: 50 Water tiles, no overflowing word labels, 562px board height at the 940px-wide preview, all 50 visible together after scrolling to the language toolbar.
- Local review: http://127.0.0.1:5174/ — compare Families and Compact; resize to see group runs flow across rows. The standalone forest/tree artifacts are unchanged.

### Intact family boxes (2026-10-21)
- Replaced continuous colored runs with 18 labeled family/major-branch boxes. Dense CSS grid placement fills gaps with smaller boxes; groups remain intact. Compact and standalone exploration artifacts are unchanged.
- All 38 challenge tests pass. Browser check at 940px: all 50 Water tiles present, zero overflowing words, zero tiles outside their group box. Board height is 736px; intact boxes trade some height for clearer boundaries.
- Preview: http://127.0.0.1:5174/ — select Families and compare with Compact. Each outlined box keeps its group together; resize to check narrower wrapping.

### Pre-commit verification (2026-10-21)
- Full repository `npm test`: 168 tests passed; `npm run check` passed syntax/content validation.
- Challenge-specific suite: 38 tests passed. These checks do not establish native pronunciation or live microphone accuracy; the limitations above still apply.
- Reviewed pending files for credential matches; local env files, generation caches and preview screenshots are excluded from Git. No push or publication is included.

### Spoiler-free intro (2026-10-21)
- Intro renders setup, script filtering and a closed-by-default language-name disclosure, with no translation tiles or audio playback. Start studying reveals answers and starts the timer. Exploration links move to the footer; layout and guide controls move to study.
- Syntax check and all 38 challenge tests passed. Browser verified zero translation tiles on intro (including with all 50 names expanded), 50 tiles after starting study, working guide/layout switches, and returning to the spoiler-free intro. Existing timing code retains its deadline when controls change.
- Review at http://127.0.0.1:5174/: expand the names, change settings, start study, switch layout/guide, then End round. No new microphone/provider test was needed for this UI change.

### Local app navigation (2026-10-21)
- Added Course/Challenge header links between local ports 5173 and 5174. The course exposes Challenge only outside active practice and only on local preview hosts. Course progress and Challenge scores remain separate.
- Full suite: 168 tests passed; both app modules passed syntax checks. Browser followed Challenge → Course → Challenge successfully, retaining the existing course resume state and Challenge settings.
- Run both preview commands before trying the links. No deployment or shared-account integration is included.

### Learning footer link (2026-10-21)
- Renamed the Challenge return link to Learning and moved it into the intro footer. It is absent from the header and timed study screen. Destination remains the local learning app on port 5173.
- App syntax and diff whitespace checks passed. The destination is unchanged from the verified local navigation flow above.

### Intro spoiler links (2026-10-21)
- Main action renamed Begin. Removed pronunciation-forest links from intro/tree and the dictionary answer link from How to play; moved Audio sources from intro to study. Retained the old forest artifact at its direct URL.
- This removes answer previews from normal intro navigation, not direct-URL or developer-tools access.
- All 38 challenge tests pass, including the updated expectation that the language tree does not link to the pronunciation forest. Browser verified Begin and an intro footer containing only Learning and the language-only tree.

### Combined hosted release preparation (2026-10-21)
- Learning remains at `/`; Challenge mounts at `/challenge/` with production-relative navigation, cached audio and a Worker token broker. Site runtime secrets are configured separately from source.
- 171 repository tests and syntax/content checks pass, including hosted broker origin/provider rejection, sanitized errors and bounded single-use Soniox tokens.
- Built Worker preview verified Learning → Challenge navigation, 50 study tiles in 18 groups, French playback interaction and typed recall entry. HTTP checks returned 200 for both apps, catalog, cached French MP3 and status; 404 for env files, the retired forest and comparison lab. Live microphone accuracy is not re-certified by this deployment check.
- Public anonymous recognition has per-isolate request throttles, not a durable global spending cap. Existing course accounts/audio are preserved. Deployment outcome is recorded after publication.

Publication completed October 21, 2026: **Sites version 15**, deployment `appgdep_6ad92a1b85348191b7053198d9185ae9`, succeeded. Learning is live at https://perlingo.app/ and Challenge at https://perlingo.app/challenge/. GitHub source `e18b5b26` maps to Sites source `372693b8d606131183124dc7e74842a54bd3e33e`; runtime environment revision 1 contains the provider secrets. Live checks passed for both apps, cached French audio and ElevenLabs temporary-token issuance. The retired forest route returns 404. 171 repository tests passed. Live microphone recognition accuracy and phone behavior remain user acceptance checks.

## Modes and word-bank staging — October 21, 2026 (local)

Added tests for UTC boundaries, archive visibility, unscheduled dates, fixed-rule overrides without preference mutation, deterministic dated recall order, scheduled 50-language/audio coverage, and separation of the 491-noun candidate inventory / Sun source candidates from playable packs. Sun extraction retains the Wiktionary revision and exact sense-table scope; it is not an approved translation or audio pack. Existing two-pack content and 100 recordings are unchanged.

Validation: 176 repository tests passed (46 Challenge tests). Browser checks confirmed Daily’s 50-language/2-minute study launch despite Unlimited’s Type/Latin/30-second preferences, restoration of those Unlimited preferences, and the first-day Archive empty state. Application syntax and diff whitespace checks passed. Narrow-phone layout and new live microphone accuracy were not verified in this revision.

## October 22 routing and shared-clock revision (published as version 22)

- `npm test`: 220 passing tests, including shared-budget carryover beyond five seconds, global expiry, and consistent 180s study / 120s recall defaults across every scheduled date. `npm run check` passes structural content validation; existing draft-content limitations remain.
- Hosted build passed; generated assets contain `/learning/index.html`, and generated Worker configuration routes `/` and `/index.html` through the redirect handler before static assets.
- Browser verified root → `/challenge/`, Learning → `/learning`, and return navigation with the existing account session. Unlimited study verified hidden translations (including accessible labels), individual reveal, preserved reveal state across Families/Compact, and a continuously decreasing study timer. Original study/recall/layout preferences were restored; no dated attempt was consumed.
- No new live microphone test or production OAuth round-trip was performed. Learning production callback URLs were added and verified before release (see `docs/accounts.md`). All playable dates now share the revised rules; recorded results are retained.
