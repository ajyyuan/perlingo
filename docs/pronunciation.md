# IPA pronunciation guides

Quick meaning shows the meaning, a clickable transcription without an “IPA” prefix, and a clickable grammar cue. It does not repeat the highlighted word. Clicking the transcription opens **Pronunciation**, with the selected chunk, an interactive transcription, and sound charts. **Grammar** contains grammar and context, with no pronunciation content. Cards and recall have no IPA hints.

Each recorded sound in the transcription is a keyboard-accessible button. Selecting it switches to Vowels or Consonants, highlights the matching chart button, and plays the bundled human recording. Nasal vowels and explicitly tied affricates are matched as units. Untied sequences and diphthongs expose their component sounds, not a synthesized combined recording. Stress marks and the length mark explain their meaning on click; they are not independent sounds. French **œ̃** is the sole sound token in current non-null transcriptions without a matching bundled recording: clicking it says so, without substituting oral œ or nasal ɛ̃. /ɥ/ does not occur in the generated corpus and is not bundled.

Vowels use a quadrilateral with Front/Central/Back and Close/Close-mid/Open-mid/Open axes; near-close and near-open sounds occupy intermediate positions. Unrounded/rounded pairs are ordered left/right. Nasal vowels are separate. Consonants use standard place/manner headings and voiceless/voiced left/right slots, with affricates and coarticulated w separate. This is an original, reduced sound inventory using the conventions of the [International Phonetic Association chart](https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_E/IPA_charts_E.html), not a copy of its artwork or a complete alphabet. Empty cells mean no bundled sound in the current filter, not anatomical impossibility. Consonant symbols use 17 px type and compact paired cells; the complete grid fits the desktop overlay. Below 600 px, a 520 px minimum keeps the matrix legible with horizontal scrolling. Vowel symbols use 18 px type.

Language filters include both the introductory inventory and every recorded sound used in that language’s actual transcriptions. The German mismatch included hidden ɑ, r, ɾ and a missing ɜ recording; these are now covered, along with loanword ɑ̃. Spanish engine variants are covered too, including newly recorded ʎ and ʝ. This aligns chart access with generated notation; it does not establish the generator as a canonical accent model or silently rewrite its output.

Only a selected sound's name appears beneath the chart; a compact information button opens a floating view with its creator, source, license and recording note. Generic instructions, empty-state prompts, draft notices and source sections are removed from learning overlays. Approximation information and links to audio credits/content sources live in Settings → About; the compact transcription also has an approximation tooltip. Recordings are generic demonstrations and some consonants include surrounding vowels. Selecting another sound, changing chart/filter, clicking a notation mark, or closing stops previous playback. French Thomas phrase audio remains unchanged. Charts and IPA remain unavailable during recall and contrast questions.

## Source and limits

`src/content/ipa-data.js` contains exact-text lookups for 2,792 Spanish, 2,739 French, and 2,669 German unique taught phrases and clickable chunks across starter, foundation and course packs. Of these 8,200 lookup records, 19 foreign-language fallbacks (9 French, 10 German) are explicitly withheld as null, leaving 8,181 displayed guides. Missing guides are omitted rather than invented. These are automatically generated approximations, not dictionary-verified or independently reviewed records. The approximation note is available in the Quick meaning tooltip and Settings → About. There is no runtime API or model dependency.

Generation uses eSpeak NG through `espeakng-loader==0.2.4`; the actual engine version and voice identifiers are recorded in the generated file. Voices are `es` (Spain), `fr` (France), and `de` (German). Source: [eSpeak NG](https://github.com/espeak-ng/espeak-ng), [phoneme conventions](https://github.com/espeak-ng/espeak-ng/blob/master/docs/phonemes.md), [generator license](https://github.com/espeak-ng/espeak-ng/blob/master/COPYING). Only generated output is shipped, not the generator or its dictionaries. No dictionary entries are copied. The generator remains a development-only dependency.

Engine transcription conventions, stress notation, regional variation, liaison, schwa, homographs, and connected speech can differ from a dictionary or the selected browser voice. Chunk transcription is generated separately, never sliced from a sentence's IPA. Full phrases are processed together. Reference-form tables and individually selected overlay words do not yet have IPA guides. Errors can be reported through the existing Grammar → Report an issue flow; reports require investigation, not automatic replacement.

## Regeneration and checks

Use a temporary directory or virtual environment:

```sh
python3 -m pip install --target /tmp/perlingo-ipa-tools espeakng-loader==0.2.4
PYTHONPATH=/tmp/perlingo-ipa-tools python3 scripts/generate-ipa.py
npm test
npm run check
```

The input exporter collects every taught phrase and clickable chunk and deduplicates by language and exact text. The generator normalizes curly apostrophes only for engine input; lookup keys preserve the original text. It processes all clauses, rejects empty output, removes engine hyphen separators, withholds foreign-language fallback output and records engine provenance. Coverage tests fail if taught text changes without regenerating IPA. Tests establish coverage and rendering contracts, not linguistic correctness.

Manual check: open Quick meaning and click its IPA. Play vowel and consonant symbols, change language, and use Tab/Enter. Verify closing stops playback and restores focus to the originating chunk. Reopen Quick meaning → grammar cue and confirm no IPA/help/charts appear in Grammar. Check horizontal chart scrolling on a narrow screen. Recall must not show IPA or chart controls.

These changes are approved locally. Production and `dist/` remain unchanged.

## Sound recording provenance

The reference bundles **55 human recordings** (20 vowels, including three nasalized vowels; 35 consonants) from Wikimedia Commons. Most are CC BY-SA 3.0; the back nasal vowel and the newly added palatal lateral approximant are CC BY-SA 4.0, and two nasal vowels are CC0. Source-page metadata was inspected on 2026-10-19 through Commons’ `videoinfo` API. `src/content/ipa-sounds.js` retains exact remote URLs, creator credits, license links, retrieval date and SHA-256 checksums. [Per-file attribution](../src/audio/ipa/ATTRIBUTION.md) ships with the audio; the selected sound’s floating credit view shows the same credit. MP3 transcodes are served locally unchanged. No speech synthesizer is used for chart sounds; no network request is made during playback beyond the app's own origin.

Tests check exact asset hashes, licenses, inventory-to-transcription coverage, token reconstruction, atomic nasal vowels/tied affricates, button coverage, and separation from grammar details. They do not certify each speaker’s phonetic realization.

The development server serves MP3 as `audio/mpeg` and Ogg as `audio/ogg`. Production assets will be copied into `dist/src/audio/ipa/` when publication is requested.

Previous recording verification: vowel /y/ and consonant /p/ reached media readyState 4 with valid durations and no media errors. All 52 MP3s decode with the system audio inspector. Auditory/linguistic review of every recording is not claimed.

Current verification: 86 automated tests pass, including a full corpus token/inventory audit with œ̃ as the explicit sole missing recording. Browser checks confirmed that clicking transcription ɪ highlights the German vowel chart, clicking b switches to Consonants and highlights b, and both audio elements reached readyState 4 without media errors. Present indicative expanded inline in the earlier Quick meaning design; it now opens Grammar, where floating definitions remain available. The three newly bundled MP3s decode with the system audio inspector. Linguistic verification of the generated IPA itself remains separate from this coverage check.

Compact-layout browser verification: the grammar cue opens Grammar directly; the desktop consonant chart has equal client and scroll widths (620 px), confirming no horizontal overflow. Quick meaning reserves no header row above its definition.

## Whole-word audio

A speaker button beside the Pronunciation title plays the exact selected chunk through the same pronouncer as the learning card, preserving the French Thomas preference and quiet loading/playing indicator. The title itself is not clickable. Only failures display status text. Starting word audio stops a chart recording; selecting a sound or notation mark stops pending/active word speech. Closing the overlay stops both audio paths, including voice-discovery retries. Heading and transcription margins are tighter; the sound chart is unchanged.
