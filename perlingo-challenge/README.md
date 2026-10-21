# Perlingo Challenge

Local standalone word-memory game: one word, up to 50 languages, timed study and rapid spoken recall. The existing Perlingo course is separate.

## Run

Requires Node 22+ (tested with Node 24). From the repository root:

```sh
npm run dev:challenge
```

Open http://127.0.0.1:5174. For navigation between apps, also run `npm run dev` for the course at port 5173. Use **← Learning** in the Challenge intro footer and **Challenge** in the course header (outside active practice). These links connect the local previews and preserve the hostname; scores/settings are separate. The course’s Challenge link assumes port 5174 ; hosted navigation uses `/challenge/` and `/`. No new npm dependencies are required. The preview binds only to loopback. The local preview remains available; the production build serves Challenge at `/challenge/` on the existing Perlingo site.

Place `ELEVENLABS_API_KEY` and/or `SONIOX_API_KEY` in the repository-root `.env.local` (ignored by Git). ElevenLabs needs Speech to Text access; Soniox needs Speech-to-Text and Temporary API keys permissions. Restart after changing keys. `CHALLENGE_PORT` defaults to 5174. Choose the recognition provider under **Adjust challenge**. Study playback uses cached MP3s and needs no runtime TTS key: all 100 clips use language-specific generated voices (89 ElevenLabs, 11 Azure). Generation requires Text to Speech access; full catalog/model discovery additionally needs Voices Read and Models Read. ElevenLabs remains the default recognizer; Soniox is still available for comparisons.

The secret stays on the server. Browsers receive time-limited, single-use provider tokens (Soniox keys expire in 60 seconds and cap sessions at 180 seconds). API routes check Host, Origin and a custom request header; the static server serves an explicit public-file allowlist. The existing Perlingo development server now rejects dot-path requests; restart any older running process to load that protection. Never serve the repository with a generic static server while credentials are present.

## Implemented

- Bread and Water starter packs: 50 languages each, with a Glottolog family-tree picker and script filter. This collection is **not** a verified top-50 speaker ranking.
- The intro shows settings and an optional disclosure of language names, with no translations or playback. **Begin** reveals the board and starts its timer. **Families** is the default language layout on the timed study screen, using a densely packed grid of tinted boxes, one per family or major branch, without connector lines (parent families remain in group accessible labels); **Compact** arranges the same small tiles in a flat, responsive grid without family headings or grouping. The choice persists in browser settings. Both show the same selected/script-filtered languages and use the same audio, reading/IPA controls and study deadline. Layout and reading/IPA controls live on the study screen; changing them does not restart study. Switching during study does not restart the timer. Results retain their existing tile grid. If the local classification catalog cannot load, a contextual message accompanies a compact fallback.
- Timed study tiles with word, language name and reading (results also show a representative locale flag); optional broad draft IPA for Bread. Water has readings, not IPA. Tap a tile for audio. Playback uses the exact tile’s cached MP3. Generated audio must pass an independent word transcription screen before selection. Missing recordings show a dash and an explanatory message when tapped; no live synthesis occurs. The footer links to Audio sources and shows available recording coverage. `tile-audio-sources.json` records credits, source licenses, processing, hashes, and the evidence level for native-language status. Human recording status is not equivalent to a verified native-speaker declaration. Old generated files in ignored `.cache/` are not served. The main Perlingo course’s French Thomas preference is unchanged.
- Configurable study time (30/60/120/180 seconds), recall time (30/60/90/120), and per-card window (3/5/8 seconds).
- Flashcard recall in shuffled order. A confirmed correct answer earns one point and removes that language. Passes and timeouts cycle to the back. Wrong guesses do not end the window. Answers are never revealed on a pass or timeout.
- Voice and typed practice, a live English microphone check, quiet visual correctness feedback, completed results, attempt transcripts, score copying, JSON export, and the last 30 rounds saved locally. Typed and voice scores are labeled separately. Microphone streams close on exit, error, completion, page hiding or navigation.
- The page hiding during recall pauses and restarts the current card without consuming its budget; completed answers are preserved in the active page. In-progress rounds do not survive reload. Settings and completed rounds do.
- Keyboard support (Space to pass outside a text input, Enter to check typed answers), native labeled controls, reduced motion, and responsive layouts.

## Language tree

Two separate exploration pages are linked from the home header:

- **[Pronunciation forest](http://127.0.0.1:5174/forest.html):** a responsive, unscaled overview of all 50 word cards, grouped by family and major Indo-European branch. Bread/Water cards show the taught word and reading; click or press Enter/Space for cached audio. Desktop layout uses compact groups to keep all 50 visible at the tested 940×704 viewport. Smaller screens scroll rather than shrinking text. Words fit within cards at 14–20px; no canvas zoom is needed. Source/structure and audio attribution remain available.
- **[Language tree](http://127.0.0.1:5174/tree.html):** the original language-only radial artifact, with a centered collection root, curved branches, search, pan/zoom and Full detail. The root is a visual collection device, not a shared-ancestor claim. Keyboard arrows pan, +/− zoom and 0 fits when the canvas is focused.

Both pages are local exploration surfaces, with no game-selection persistence or runtime speech-provider calls. Forest playback stops when another card is played, the pack changes, or the page is hidden/left. The old challenge selection picker remains separate.

Open **Languages** to browse the bundled Glottolog 5.3 catalog (27,177 family, language and dialect entries). The default canvas opens all 50 language tips at once, grouped into separate family trees with unnamed branch circles. Hover a circle for its family name; check it to select the branch, or use its +/− control to expand/collapse. Major groups lead directly to language tips; Full detail restores the labeled source hierarchy. Drag/scroll to pan and use zoom/Fit controls. Playable only is on by default; turn it off to explore the rest. Search names/codes to jump within the canvas, or use Show all to expand branches and fit the overview. Branches select only descendants among the existing 50. Other entries remain explorable with Glottolog links. Apply saves the selection; closing discards edits. The existing script filter intersects that selection. See [source, mapping and regeneration details](GLOTTOLOG.md).

## Speech and timing

`public/speech.js` holds the provider adapter. `createSpeechProvider(name)` supplies ElevenLabs Scribe v2 Realtime or Soniox stt-rt-v5. Adapters implement `prepare(language)` returning a session with `push(PCM)`, `commit()`, `close()`, `pending`, `failed`, `onTranscript({text, final})`, and `onError(error)`. Game scoring stays in `engine.js`; no LLM judge is involved.

Each card gets a separate provider session with its known language and no answer/keyterm hint. One next-card session is prepared ahead of time. This avoids cross-card context contamination and overlaps connection latency, at the cost of more sessions. Provider connection time is outside the game budget. Earlier tests verified ElevenLabs accepts all 50 configured language codes; they do not prove accuracy. Soniox credentials and funding are now working. Paired synthetic recognition results are recorded in `speech-baseline.json` and `speech-stress.json`; these do not establish human accent accuracy. Its adapter supplies strict language hints (Filipino maps to `tl`) and joins finalized subword tokens until the `<fin>` marker before scoring.

The microphone uses a 16 kHz AudioWorklet with 80 ms PCM packets, token-tagged and timestamped. Reset discards a preceding card's buffered samples. Each card's capture is clipped by audio timestamps, including the final buffered samples and excluding post-deadline speech. The recognizer receives 200 ms of synthetic leading silence. Local energy/silence detection triggers manual commits after approximately 400 ms silence, with at least one second between silence-triggered commits. Partial transcripts never trigger finalization or award points, avoiding premature truncation of a word. ElevenLabs pads short commits to at least 350 ms audio. Soniox allows only one outstanding finalization; trailing audio is flushed when it completes, including at the deadline.

At the answer deadline, capture drains for 100 ms (timestamp clipping still enforces the deadline), then the game waits up to 1.5 seconds for final results with the game clock paused. If a commit remains outstanding, the round pauses with a retry instead of recording a false miss. Answer events from an old token cannot score the next card. Speech recognized before the deadline advances immediately; elapsed game time includes recognition latency up to the capture deadline. This is **not** a guarantee of 150 ms end-to-end latency.

Matching accepts the taught form and explicitly listed variants, ignoring case and punctuation plus optional Arabic/Hebrew vocalization. Lexical accents remain meaningful. Whole whitespace-delimited words/phrases must match; arbitrary fuzzy spelling and substring matches are not accepted. This conservative matcher can reject a valid word embedded in an unsegmented Japanese/Chinese sentence. It is designed for isolated answers. Speech recognition accommodates some accents but is not a phonetic pronunciation assessment.

## Privacy

Microphone audio goes directly to the selected provider during recall and microphone checks. The comparison page sends a single recorded sample to both providers when Compare both is clicked. The app does not persist recordings. Provider logging/retention depends on each provider account; this app does not claim zero retention. Attempt text and scores are stored in this browser, and exports include transcripts. Tokens and API keys are never included in result exports. Study playback fetches bundled MP3 files from the local server; it sends no text to a synthesis provider. Opening external source links follows those sites’ policies. Fonts load from Google Fonts with system fallbacks.

## Validation and local testing

```sh
npm run test:challenge
npm test
npm run check
```

The challenge tests cover queue cycling, duplicate/late events, clock clipping, interruption recovery, answer matching, content shape, audio packet isolation, provider partial/final semantics, static-file isolation and API origin restrictions. `provider-check.json` records a real connection-only audit; `source-check.json` records limited spelling-presence comparisons. See [content scope](CONTENT.md) and [validation evidence](VALIDATION.md).

Try these in the preview:

1. Select 5 languages and Type, start study, then choose **I'm ready**. Enter a wrong guess followed by the correct word inside the window. Only the correct answer should advance.
2. Pass one card. It should return after the remaining cards. Let a card time out and verify the same behavior, without answer revelation.
3. End or finish the round. Check results, review attempts, copy/export the score, and reload to inspect Recent rounds.
4. Select Speak. On the ready screen choose **Check microphone**, allow access, and say “hello.” Then start a round and try correct answers, wrong guesses, a self-correction and a last-moment answer.
5. Change script/language/timing controls and test narrow-window layout. Switch away during spoken recall; it should pause and release the microphone.

Manual accent accuracy, live-microphone browser behavior and real-phone testing remain user acceptance checks. Synthetic smoke tests are not a substitute for them. Challenge is published as Sites version 15; deployment does not replace these acceptance checks.

## Recognition comparison

Open **Adjust challenge → Compare recognition** (`/speech-lab.html`). Select a word/language, label whether the recording should count, record three seconds, optionally replay, and compare. Try correct answers, wrong words, silence, near-misses and self-corrections. Both adapters receive identical 16 kHz PCM at real-time pace without answer hints. Results show transcript, acceptance, connection time and latency after the clip finishes streaming. Export includes labels/results but no audio or credentials. Samples are held only in page memory. This test finalizes once at clip end to isolate the recognizers; it does not reproduce game silence detection.

`node perlingo-challenge/scripts/compare-speech.mjs` runs an independent macOS synthetic baseline (Samantha, Thomas, Mónica, Anna, Tingting, Kyoko), with Bread positives, Water negatives and silence. The report is `speech-baseline.json`; unavailable providers are explicitly listed. It requires the preview server, network access and provider credits. Synthetic results cannot establish human accent accuracy or justify declaring a provider winner. Before choosing a default, collect paired human samples across target languages, including repeated near-misses and self-corrections; compare false accepts, false rejects and latency on those same samples.

Run `node perlingo-challenge/scripts/compare-speech.mjs --stress` for a second paired suite: self-corrections, a correct sample placed late in the three-second window, and similar-sounding wrong words. It writes `speech-stress.json`. Run `node perlingo-challenge/scripts/check-soniox.mjs` for a 50-language silent-stream configuration check (not recognition accuracy); it writes `soniox-language-check.json`. Do not run the coverage audit concurrently with timing benchmarks, since that adds load.

The funded 36-case synthetic comparison found 13/18 correct samples accepted by ElevenLabs versus 11/18 by Soniox; false accepts were 0/18 versus 1/18. Median post-clip finalization was 176 ms versus 67 ms. ElevenLabs remains the existing default; Soniox is selectable. This synthetic comparison is superseded for selection purposes by the sourced human pilot below. These are single-take system-voice fixtures, not human accent validation, and both still make errors. See `VALIDATION.md` for the exact limits and reproduction steps.

## Human-recording comparison

`human-audio-sources.json` lists public Commons/Lingua Libre recordings, credited speakers, license links, native-language evidence, exact download rendition, source/PCM hashes and processing. Native declarations are self-reported/source-described; Japanese and the French negative recording have incomplete native-status evidence and are supplemental. Chinese provenance declares native Chinese generally; its recording is labeled Mandarin. No claim of independent phonetic certification is made.

To reproduce, use Node 22+ and FFmpeg 7.1 (or an exactly matching decoder); set `FFMPEG` to its executable path if needed:

```sh
node perlingo-challenge/scripts/prepare-human-audio.mjs
node perlingo-challenge/scripts/compare-human-speech.mjs
node perlingo-challenge/scripts/report-human-speech.mjs
```

The preview must be running with both funded providers. Downloads and decoded PCM stay in ignored `.cache/human/`; the manifest and raw results are reviewable. Original downloads that were unavailable were replaced with official Wikimedia MP3 renditions, explicitly recorded in the manifest. The downloader verifies hashes and stops if sources/decoding change; do not silently replace the corpus. Audio is decoded to mono 16 kHz, never synthesized, normalized or truncated. Timing variants add silence; constructed corrections concatenate whole clips with 150 ms silence and are skipped if they cannot fit. These are not natural self-corrections. Both providers receive identical bytes without expected-answer hints, with one finalization at the end of three seconds.

`human-speech-report.html` embeds the exact submitted clips alongside transcripts, outcome labels, per-source attribution/license links and separate provenance groups. Its generation verifies every playable clip against the submitted SHA-256. Audio adaptations retain their source licenses; no new general license is asserted over the recordings. This small corpus reuses the same takes across timing variants, so those variants are not independent speakers or an accuracy population estimate. It tests file streaming, not browser microphone capture or game silence endpointing.

The human pilot completed 26 paired cases from 11 recordings: ElevenLabs accepted 14/15 expected-correct cases and Soniox 15/15; both rejected all 11 negatives/silence controls. Median post-clip finalization was 144 ms versus 52.5 ms. The native-declaration subgroup and supplemental clips are reported separately in the playable report. This supports trying Soniox on real microphone input, but no default was changed based solely on this small corpus.

## Human reference recordings (retained)

`public/recordings.js` handles interruption-safe cached audio playback. `public/recordings-data.js` and `public/audio-sources.html` are generated by `node perlingo-challenge/scripts/build-recording-credits.mjs` from the human source manifest, generated source manifest, and generated check results. Each clip retains its original license; MP3 conversions are identified in credits. The server allows only manifest-listed audio paths.

Audio files are bundled under `public/audio/`. To restore missing assets, use `FFMPEG=/path/to/ffmpeg node perlingo-challenge/scripts/restore-tile-audio.mjs`; hashes pin both downloaded source bytes and FFmpeg 7.1 conversion output. A changed source or encoding requires review, not silently updating hashes. New recordings must match the exact word and language, have reusable licensing and human-speaker provenance, and be checked for any declared non-native proficiency. Preserve native-status uncertainty in the manifest.

All 100 Bread/Water entries were searched in Wiktionary and Commons. The bundled library has 42/50 Bread and 45/50 Water clips (87 total), including 32 with source-described or self-reported native-language evidence; the remaining 55 have unverified native status. This describes the retained human reference corpus; the current generated playback library is described below. Forvo is not integrated or required. Recordings have not received an independent phonetic review.

Preview: open http://127.0.0.1:5174, tap English/French/Japanese and switch between tiles rapidly; switch Bread to Water; open Audio sources; all current tiles have recordings. Recognition remains selectable under Adjust challenge.


## Language-specific generated tile audio (local)

Current selection: **100 generated clips across all 50 languages** (89 ElevenLabs, 11 Azure), with no missing tiles or human playback fallbacks. Human recordings remain optional comparison references. The initial unauthenticated ElevenLabs catalog omitted six languages; after Voices Read and Models Access were enabled, authenticated catalog requests found primary-language voices for all six. The earlier empty public results did not establish provider-wide absence. The user authorized the existing Azure Speech resource; its eleven passing clips are retained. No generic English voice is substituted.

`voice-candidates.json` pins primary-language catalog metadata. `generated-audio-sources.json` records each selected voice, primary language, accent, exact text, model, settings, date and MP3 hash. Most clips use Eleven v3; Persian, Thai, Hebrew and several replacement clips use v4. Models are explicit per asset. Azure supplies Swahili, Afrikaans, Estonian, Latvian and Lithuanian Bread/Water plus Slovenian Water using GA neural voices for the exact locale. These are generated voices, not recordings of humans speaking those words. Game recognition remains ElevenLabs Scribe v2 Realtime; no recognition settings were changed.

`generated-audio-checks.json` preserves independent Soniox stt-rt-v5 transcripts without target-word hints. Exact word matching permits punctuation/case, optional Semitic marks, Thai Unicode decomposition and Serbian Latin/Cyrillic equivalents. It rejects added words and synonyms. The first French Bread, Arabic Bread, Japanese Water, Vietnamese Water, Catalan Bread and Filipino Water candidates were flagged; replacements passed. Slovenian Bread failed with Azure Petra and Rok; the Rok clip was misread by both Soniox and ElevenLabs. A Slovenian-primary ElevenLabs Ana v4 replacement passed Soniox. No phoneme override was applied. Raw failed transcripts remain in the check ledger; rejected bytes and metadata remain in the ignored cache. A match establishes intelligibility to this recognizer, **not native accent, stress or tone**. No native-speaker listening review has been performed. The Audio sources page offers retained human reference comparisons where available; their provenance caveats still apply.

Reproduction (from repository root, preview server running for screening):

```sh
node --env-file=.env.local perlingo-challenge/scripts/generate-tile-audio.mjs
FFMPEG=/path/to/ffmpeg node perlingo-challenge/scripts/check-generated-audio.mjs
node perlingo-challenge/scripts/build-recording-credits.mjs
npm run test:challenge
```

Generation resumes without repeating cached entries and uses an exclusive lock. After an interrupted process, verify it has stopped before removing `.cache/voices/generation.lock`. For a targeted replacement, set `AUDIO_LANGUAGE`, `AUDIO_PACK`, `AUDIO_VOICE_INDEX`, `AUDIO_MODEL`, and `AUDIO_REPLACE=1`; old bytes/metadata are retained under ignored `.cache/voices/rejected/`. Run one generator process at a time and recheck each new hash before rebuilding selection. Do not silently reuse screening results from old audio. Restart the preview after changing the manifest so its exact asset allowlist refreshes. Credits identify generated provider terms and human licenses separately. Generation scripts do not publish changes; use the separate release workflow.

Local review: refresh http://127.0.0.1:5174, play Bread and Water tiles (especially the six replacement cases), rapidly switch tiles to check interruption, and use **Audio sources → Compare human reference** for side-by-side listening. Check that Adjust challenge still selects ElevenLabs. Report any pronunciation issue with language and pack; automatic screening is not final linguistic approval.

Azure regeneration: `node perlingo-challenge/scripts/generate-azure-tile-audio.mjs /private/path/to/speech-key` is restricted to the six originally missing language locales and skips existing cached entries. Its provider voice list is checked live for GA neural voices. The existing East US resource was reused without changing billing, permissions or resource configuration. The temporary key file was removed after generation. `azure-voice-candidates.json` records the available target-locale voices. For a targeted Azure replacement, use `AUDIO_LANGUAGE`, `AUDIO_PACK`, `AUDIO_GENDER` and `AUDIO_REPLACE=1`, then screen the new hash.

`AUDIO_CHECK_PROVIDER=elevenlabs AUDIO_LANGUAGE=sl` optionally runs a second recognizer screen. The primary selection gate remains a passing Soniox exact-word screen; secondary results and failures are retained rather than overwritten. Current browser coverage is 50/50 for both packs.

Intro navigation is limited to Learning and the language-only tree. Pronunciation-forest links are removed from the intro and tree; Audio sources is linked only during timed study. The old forest artifact remains available by direct URL only in local development and is excluded from the hosted build, as is the comparison lab. This is a spoiler-free normal flow, not enforced anti-cheating. Packs and audio remain client-accessible.

## Hosted release

`scripts/build-hosted.mjs` takes an absolute Sites `build-site.mjs` helper path. It builds the existing course with its verified Azure audio host, mounts Challenge assets under `/challenge/`, and builds the retained Sites/Vinext Worker integration in `hosting/`. Source code stays in this repository; ignored output goes to `dist/`. Production Learning/Challenge links share the same origin, while their storage keys stay separate. Local scores do not migrate automatically to the production origin.

The hosted broker in `hosted-api.mjs` reads ElevenLabs/Soniox runtime secrets from Sites, returns only short-lived provider tokens, rejects foreign browser origins and unknown providers, and masks upstream errors. Anonymous voice mode remains available. Throttling is 180 requests per IP per minute **per Worker isolate**, best effort; it is not a durable global spending limit. Audio is cached and makes no live TTS calls. Private source files, comparison lab and pronunciation forest are excluded from the release. Content/audio can still be inspected with developer tools; this is not an anti-cheating boundary.

Publication completed October 21, 2026: **Sites version 15**, deployment `appgdep_6ad92a1b85348191b7053198d9185ae9`, succeeded. Learning is live at https://perlingo.app/ and Challenge at https://perlingo.app/challenge/. GitHub source `e18b5b26` maps to Sites source `372693b8d606131183124dc7e74842a54bd3e33e`; runtime environment revision 1 contains the provider secrets. Live checks passed for both apps, cached French audio and ElevenLabs temporary-token issuance. The retired forest route returns 404. 171 repository tests passed. Live microphone recognition accuracy and phone behavior remain user acceptance checks.
