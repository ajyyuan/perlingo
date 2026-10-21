# Challenge content and evidence

The original bank contains **Bread and Water × 50 languages** in `public/content.js`. It is a draft collection of common languages supported by the speech endpoint, not a sourced ranking by speaker counts. Country flags identify a representative locale and are not a claim that a language belongs exclusively to that country. Regional IPA and audio voice/locale agreement remain unverified.

The units here are isolated dictionary words; bread may be represented by a local bread type (for example Hindi roti). This is not a sentence/chunk course, and it does not change Perlingo's existing article-and-noun grouping conventions. These labels should not be represented as interchangeable in every sentence or as complete phrase instruction.

Each entry includes the taught written form, a reading, an explicit accepted-answer list, a dictionary link and `draft` status. Bread has authored broad approximate IPA; Water currently has readings only. Readings are romanizations, not a uniform English respelling system. IPA, romanizations, tones, dialects, synonyms and all generated pronunciations still need further review. The app's About explains these limits without putting repeated notices on each card.

## Source comparison performed

`source-check.json` records normalized spelling presence for all 100 taught forms against:

- https://en.wiktionary.org/wiki/bread (baked cereal dough translation collection)
- https://en.wiktionary.org/wiki/water/translations

The report includes the fetched page revision IDs. **A spelling-presence match does not verify the word's language, exact sense, pronunciation, or its alternatives.** All 100 taught spellings were present. Accepted alternatives have not all undergone this automated comparison. No independent linguistic review is claimed.

A manual check of the bread translation section changed Malayalam from `അപ്പം` (a narrower local food term) to listed `റൊട്ടി`; a regression assertion accompanies that choice. Marathi `पाव` and Gujarati `રોટલી` were also compared with their listed bread translations. Do not automatically correct entries solely because a spelling is missing from this broad comparison: inspect the sense and language first.

Reproduce the limited source check (requires network):

```sh
python3 perlingo-challenge/scripts/check-sources.py
```

Wiktionary is a community dictionary. Reference links are evidence for review, not a claim of definitive validation. Source material is available under Wiktionary's CC BY-SA terms; source and revision links are retained for attribution. Authored UI summaries and IPA remain draft.

To extend a pack, add every intended language's written form, reading, sourced accepted alternatives and review status together; add tests for meaningful lexical distinctions. Do not add arbitrary phonetic near-matches to make the speech checker more permissive. Keep unmatched/unsupported languages visible as a coverage limitation rather than silently substituting a different language.

## Tile pronunciation sources

The human recording library is maintained separately in `tile-audio-sources.json`; word/reading/IPA content remains draft. Source language and exact word were checked against dictionary sections, Commons descriptions, and Lingua Libre language/transcription labels. Speaker native-language evidence is tracked per clip, not inferred from nationality or an audio filename. Known non-native candidates were excluded. Published IPA is not guaranteed to match every regional speaker. Credits and missing entries are visible at `/audio-sources.html`. See `VALIDATION.md` for current coverage and limits.

Generated pronunciation candidates are tracked separately in `generated-audio-sources.json`, with explicit voice language/accent and model. Only independently word-screened candidates enter playback; see `generated-audio-checks.json`. This is not a phonetic certification and does not validate the draft IPA. Current coverage, remaining language gaps and the listening workflow are in README.md.

The original Bread/Water tile selection covers all 100 entries with generated audio: 89 ElevenLabs clips and 11 Azure clips. Historical human recordings are optional references only. Slovenian `kruh` was checked against https://en.wiktionary.org/wiki/kruh#Slovene while investigating failed synthesis/recognition candidates; no content or phoneme override was inferred from recognizer errors. The selected Slovenian-primary replacement passed word screening.

## Family classification

The original 50 playable entries map explicitly to Glottolog 5.3 identifiers in `data/playable-glottocodes.json`. This classification does not expand the lesson, audio or recognition inventory. See [GLOTTOLOG.md](GLOTTOLOG.md) for mapping qualifications and licensing.

## Expansion started October 21, 2026

`data/word-bank/candidates.json` holds **491 noun candidates** (including the two existing packs), grouped by topic. This is a planning inventory, not 491 translated packs. Noun-first is a practical starting policy, not a permanent noun-only restriction. It includes ambiguous labels that need explicit senses before authoring: orange the fruit, date the fruit, nail the body part, bank the financial institution, and so on. Do not copy an English label into translation work without resolving its sense. Compound nouns and languages without a one-word equivalent are allowed; no English-style grammatical category is imposed on every translation.

The first proposed batch was Sun, Moon, Star, Tree, Apple, Cat, Dog, House, Book and Milk. `sun.json` begins Sun with source candidates for all 50 language slots, extracted from Wiktionary’s exact “the star around which the Earth revolves” table. English comes from the source headword. It retains revision, source URL, source-byte hash and CC BY-SA attribution. Mandarin is extracted with `cmn`, Filipino with `tl`, Norwegian with `nb`, and Croatian/Serbian with `sh`; these mappings require explicit variety review. Source variants and accent marks are not automatically taught forms or accepted answers. The source’s proper-noun classification is retained in the sense evidence; it does not settle our eventual teaching-label convention.

Reproduce after downloading the public source HTML:

```sh
curl -fsSL https://en.wiktionary.org/wiki/sun/translations -o /tmp/perlingo-sun-source.html
python3 perlingo-challenge/scripts/import-sun-candidates.py /tmp/perlingo-sun-source.html
```

Review the resulting diff and revision; regeneration is a new source snapshot, not approval. This historical snapshot intentionally retains unset taught forms/readings/accepted answers. It is not the playable Sun pack; the subsequent authored batch below supersedes it for gameplay. Extraction alone is not linguistic verification.

Unless explicitly waived for a specific audio hash by the user, admission to a playable pack requires all 50 taught forms and readings, explicit accepted answers with source/sense checks, meaningful lexical regression checks, and checked exact-word audio under the existing pronunciation workflow. Daily calendar tests additionally reject scheduled packs with missing entries or selected recordings. Stage incomplete work outside `public/`; do not silently reduce Daily’s 50 languages. Keep the original course’s article-and-noun and contextual chunk conventions unchanged.

## First ten noun packs — local authoring

The authored batch is Sun, Moon, Star, Tree, Apple, Cat, Dog, House, Book and Milk. `data/word-bank/first-ten.js` is the authored content; `first-ten-checks.json` records 500 language/sense comparisons with source revisions, selected forms and explicit accepted answers. These checks are more narrowly scoped than the initial Bread/Water whole-page spelling search. Readings remain authored drafts, not independently verified phonetic transcriptions; no new IPA is claimed.

The selected senses are the celestial Sun/Moon/star, a living tree, apple fruit, domestic cat/dog, a dwelling, a readable book, and animal milk as a drink. Mandarin 牛奶, Japanese 牛乳 and Korean 우유 specifically mean cow’s milk, and carry that note. Telugu Apple uses ఆపిల్ rather than generic కాయ; Thai Book uses หนังสือ rather than notebook สมุด. Croatian uses Ijekavian Latin (mjesec, zvijezda, mlijeko); Serbian uses Ekavian Cyrillic (месец, звезда, млеко) with explicit Latin-script equivalents accepted. Iranian Persian forms/readings and Malay Rumi forms are selected explicitly rather than taking the first historical/regional form in a source table. Marathi Star, Kannada Star, Malayalam Moon, Mandarin Milk and Gujarati Dog use supplementary direct language entries to resolve table gaps. Gujarati Dog uses standard કૂતરો rather than the table’s કુતરો.

Only deliberately selected alternatives enter scoring. Japanese kana readings are accepted when listed in the same source language row, including リンゴ / 林檎 / りんご for Apple. Chinese simplified/traditional forms and Serbian Cyrillic/Latin equivalents are listed explicitly. Audio screening permits declared orthographic alternatives and the documented Norwegian Tree speech-format exception below; gameplay synonyms such as Portuguese cão for cachorro do not make a clip saying the wrong target word pass the audio screen. Extra words, plurals and near-matches remain failures.

Recheck the cached dictionary pages with `python3 perlingo-challenge/scripts/check-first-ten-sources.py /absolute/path/to/source-directory`. The ledger lists the source URLs and pinned revisions. Save translation subpages as `<word>-translations.html`, Tree/Apple main entries as `<word>.html`, and the five supplementary pages as `moon-ml.html`, `star-mr.html`, `star-kn.html`, `milk-zh.html`, `dog-gu.html`. The checker fails on changed base revisions or mismatched authored forms; it does not automatically correct content. Supplementary language/sense inspection is recorded separately from the script’s presence smoke check. Source evidence remains CC BY-SA 4.0 with attribution; no native-speaker review is asserted.

Generation uses `AUDIO_BATCH=first-ten node --env-file=.env.local perlingo-challenge/scripts/generate-tile-audio.mjs`. Screening uses `AUDIO_BATCH=first-ten FFMPEG=/absolute/path/to/ffmpeg node perlingo-challenge/scripts/check-generated-audio.mjs`, with the local speech broker running. It resumes by asset hash, retains failed transcripts, and retries service-error rows on a subsequent run. Use at most three concurrent screens; a 429 adds a 60-second worker backoff. Screen replacements again after generation. The script verifies file bytes against the recorded hash before decoding.

`node perlingo-challenge/scripts/activate-first-ten.mjs` checks all 500 source records and exact audio hashes against independent Soniox passes or exact hash-bound user approvals before writing the local app’s `public/noun-packs.js`. With explicit `--ready`, only complete admitted packs are included and all remaining failures are printed; it never admits a 49-language pack. Staged audio is moved to public assets only when its entire pack is admitted. Then rebuild credits with `node perlingo-challenge/scripts/build-recording-credits.mjs` and restart the preview so its recording allowlist refreshes. None of these commands commit, push or deploy. Audio screening establishes recognizer intelligibility, not native accent, stress or tone.


All ten new noun packs are playable: 500 source-compared entries and 500 new clips, bringing the total to twelve packs / 600 clips. On October 21, 2026 the user approved including Afrikaans Moon and Danish Tree despite failed transcription. `data/word-bank/audio-exceptions.json` binds those two approvals to exact words and audio hashes; failed transcripts remain unchanged and wrong answers are not accepted. The other 498 new clips passed Soniox. This expansion was approved for publication on October 21, 2026.

Norwegian `tre` (tree) and `tre` (three) have the same /tɾeː/ pronunciation in the [Bokmål entry](https://en.wiktionary.org/wiki/tre#Norwegian_Bokmål), checked October 21, 2026. Its explicit `transcriptAlternatives: ["3"]` handles numeric transcription only in speech and audio screening; typed `3` remains wrong. Danish `træ` has no such exception. No general homophone or numeral matching is used.

Replacement generation may use `AUDIO_SEED`, `AUDIO_MODEL`, `AUDIO_VOICE_INDEX`, `AUDIO_PUNCTUATION=period`, `AUDIO_SPEED`, and `AUDIO_PREVIOUS_TEXT`. The last supplies unspoken synthesis context using the provider’s documented previous-text parameter; it is never sent to recognition. Request parameters are retained with each asset. The approved Moon/Tree exceptions used this context without passing. The independent screen still requires the exact isolated word and no extra text. Rejected assets retain their hash/metadata in the ignored cache; the transcription ledger keeps failed attempts.

The local calendar assigns the eight complete new packs to October 23–30, 2026. These packs and dates were not included in version 16 and are approved for the next release. Romanization, accent, stress and tone are not certified by dictionary comparison or automated transcription.

Archive/timezone revision: two fixed demo entries, October 19 Moon and October 20 Tree, appear before the October 21 Daily. These are seeded test history, not prior published challenges or fabricated completed rounds. Daily and Archive use America/New_York calendar dates (EST/EDT automatically); the UI has no UTC suffix. The noun expansion is committed as `aaa9ebed`; archive/timezone changes are committed as `2e715008`.

Spoiler-free dated setup: Daily and Archive show only dates and fixed rules until Begin reveals the assigned word and starts study. Archive uses a scrollable newest-first date list with a selected date and a separate Begin button; selecting a date does not start the timer. Word names and word-specific emoji are omitted from dated setup, including decorative markup. Unlimited also hides its randomly assigned word until Begin. This is a presentation rule, not an anti-cheating boundary for client-accessible content.

Local visual/attempt revision: Challenge uses a warmer paper background, forest-green controls, segmented mode navigation, cleaner cards and date selection, and representative locale flags in both Families and Compact study grids. Flags remain decorative alongside language names. Daily/Archive allow one attempt per date in this browser, consumed on Begin before revealing the word; aborted attempts remain used, active recall can still reconnect, and Unlimited is replayable. The separate attempt ledger is not truncated with recent history. Web Locks prevent concurrent same-origin tab claims; storage errors block dated admission. No cross-device/account enforcement is claimed. These changes were approved for commit and publication on October 21, 2026; the preceding archive/spoiler revision is `2e715008`.

Dated review: used Daily/Archive entries show their saved score and a Review button instead of a disabled play button; archive rows also show scores. Review opens the assigned word, language tiles/audio and retained answer details without starting a timer, claiming an attempt or adding a history row. Full dated results and per-answer recall progress are stored in the separate attempt ledger so review survives the 30-round history limit. An attempt abandoned before recall shows 0/50. Older records use available recent-history details; missing details are not reconstructed.

Played-date actions: the setup attempt note is removed. Played Daily/Archive cards, review, dated results, and recent history offer “Play again in Unlimited.” This opens Unlimited setup with a one-round replay override, preserving the saved freeplay language/timing/input preferences; Begin starts the practice round. It never resets the dated attempt or changes its score. The one-attempt rule remains explained in How to play.

Unlimited word assignment: no word selector is exposed. A playable pack is chosen uniformly at random on each ordinary Begin, and the word/emoji stays hidden until study. Repeats are possible. “Play again in Unlimited” supplies a one-round override for the requested word; setup labels it Replay, and subsequent normal rounds return to Random. Switching modes cancels the pending override. Saved legacy pack preferences do not choose ordinary Unlimited words.
