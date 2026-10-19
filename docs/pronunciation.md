# IPA pronunciation guides

Quick meaning shows the meaning, a clickable transcription without an “IPA” prefix, and a clickable grammar cue. It does not repeat the highlighted word. Clicking the transcription opens **Pronunciation**, with the selected chunk, an interactive transcription, and sound charts. **Grammar** contains grammar and context, with no pronunciation content. Cards have no inline IPA; recall has no IPA hints before submission.

Each recorded sound in the transcription is a keyboard-accessible button. Selecting it switches to Vowels or Consonants, highlights the matching chart button, and plays the bundled human recording. Nasal vowels and explicitly tied affricates are matched as units. Untied sequences and diphthongs expose their component sounds, not a synthesized combined recording. Stress marks and the length mark explain their meaning on click; they are not independent sounds. French **œ̃** is the sole sound token in current non-null transcriptions without a matching bundled recording: clicking it says so, without substituting oral œ or nasal ɛ̃. /ɥ/ does not occur in the generated corpus and is not bundled.

Vowels use a quadrilateral with Front/Central/Back and Close/Close-mid/Open-mid/Open axes; near-close and near-open sounds occupy intermediate positions. Unrounded/rounded pairs are ordered left/right. Nasal vowels are separate. Consonants use standard place/manner headings and voiceless/voiced left/right slots, with affricates and coarticulated w separate. This is an original, reduced sound inventory using the conventions of the [International Phonetic Association chart](https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_E/IPA_charts_E.html), not a copy of its artwork or a complete alphabet. Empty cells mean no bundled sound in the current filter, not anatomical impossibility. Consonant symbols use 17 px type and compact paired cells; the complete grid fits the desktop overlay. Below 600 px, a 520 px minimum keeps the matrix legible with horizontal scrolling. Vowel symbols use 18 px type.

Language filters include both the introductory inventory and every recorded sound used in that language’s actual transcriptions. German now uses the `standard-uvular-v1` profile described below: its r sounds select the existing **ʁ** and **ɐ** recordings. Alveolar r/ɾ and the former ɜ ending are no longer offered by the German filter; their recordings remain available in All sounds (and r/ɾ in Spanish). Nasal ɑ̃ in German loanwords remains covered. Spanish engine variants include recorded ʎ and ʝ.

Only a selected sound's name appears beneath the chart; a compact information button opens a floating view with its creator, source, license and recording note. Generic instructions, empty-state prompts, draft notices and source sections are removed from learning overlays. Approximation information and links to audio credits/content sources live in Settings → About; the compact transcription also has an approximation tooltip. Recordings are generic demonstrations and some consonants include surrounding vowels. Selecting another sound, changing chart/filter, clicking a notation mark, or closing stops previous playback. French Thomas phrase audio remains unchanged. After submission, recall and contrast answers offer Quick meaning and its Pronunciation/Grammar links, using the same authored chunks as learning. Charts and IPA remain unavailable before submission.

## Source and limits

`src/content/ipa-data.js` contains exact-text lookups for 2,792 Spanish, 2,739 French, and 2,669 German unique taught phrases and clickable chunks across starter, foundation and course packs. Of these 8,200 lookup records, 19 foreign-language fallbacks (9 French, 10 German) are explicitly withheld as null, leaving 8,181 displayed guides. Missing guides are omitted rather than invented. These are automatically generated approximations, not dictionary-verified or independently reviewed records. The approximation note is available in the Quick meaning tooltip and Settings → About. There is no runtime API or model dependency.

Generation uses eSpeak NG through `espeakng-loader==0.2.4`; the actual engine version and voice identifiers are recorded in the generated file. Voices are `es` (Spain), `fr` (France), and `de` (German). Source: [eSpeak NG](https://github.com/espeak-ng/espeak-ng), [phoneme conventions](https://github.com/espeak-ng/espeak-ng/blob/master/docs/phonemes.md), [generator license](https://github.com/espeak-ng/espeak-ng/blob/master/COPYING). Only generated output is shipped, not the generator or its dictionaries. No dictionary entries are copied. The generator remains a development-only dependency.

Engine transcription conventions, stress notation, regional variation, liaison, schwa, homographs, and connected speech can differ from a dictionary or the selected browser voice. Chunk transcription is generated separately, never sliced from a sentence's IPA. Full phrases are processed together. Reference-form tables and individually selected overlay words do not yet have IPA guides. Errors can be reported through the existing Grammar → Report an issue flow; reports require investigation, not automatic replacement.

## German pronunciation target

The offline generator applies `scripts/german-ipa.mjs` to German only, after eSpeak generation and foreign-fallback rejection. The selected broad standard pronunciation uses uvular **ʁ** for consonantal r and **ɐ** for vocalized r. This is one consistent teaching target, not a claim that other German r variants are wrong.

The contextual convention follows the [LMU/BAS vocalized-r guidance](https://www.phonetik.uni-muenchen.de/forschung/Bas/BasGermanPronunciation/node5.html): vocalize syllable-final r after vowels, retaining consonantal r after a/aː; preserve an r that begins the next syllable. We choose the uvular realization documented by [LMU’s German r examples](https://www.phonetik.uni-muenchen.de/studium/skripten/Transkription/Transkription1/sounds/sprachbeispiele/r_sounds.html), rather than BAS’s abstract SAMPA r symbol. The broad notation uses ɐ without a nonsyllabic diacritic after vowels. Finer assimilation, glottal stops and optional regional realizations are not added.

Examples: Lehrer → lˈeːʁɐ, Tür → tˈyːɐ, fahren → fˈaːʁən, Fenster → fˈɛnstɐ; Arbeit retains consonantal ʁ after a. This target also retains ʁ in war, though vocalized variants are common. The engine’s ɜ endings become ɐ; oral ɑ becomes a while nasal ɑ̃ stays unchanged. Stress marks do not interrupt onset detection, and a following word’s vowel does not change the preceding word’s final r into an onset.

The corpus’s vowel-adjacent tap cases were inspected separately: er-/ver- before vowels (Ereignis, erinnern, Verein, Verantwortung, Vereinbarung, Vereinigung, Veränderung, verirrt) and vor|erst need morpheme boundaries, unlike fahren/warum. Explicit rules preserve those distinctions. This is a normalization of the pinned engine output, not a general German syllabifier or independent verification of every transcription. New content with unfamiliar compounds or engine output requires review of these boundaries. Regression fixtures cover onsets/clusters, long/short-vowel codas, endings, a exceptions, stress, word/prefix boundaries and nasal loanwords.

The symbol buttons keep exact recording identities: ʁ → `281.mp3`, ɐ → `250.mp3`. Whole-word audio still comes from the browser’s German voice; changing IPA does not force that voice to adopt this accent. French Thomas and Spanish/French IPA are unchanged.

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

The German pronunciation normalization was approved for commit and publication on 2026-10-19. The publication package in `dist/` mirrors the approved source.

## Sound recording provenance

The reference bundles **55 human recordings** (20 vowels, including three nasalized vowels; 35 consonants) from Wikimedia Commons. Most are CC BY-SA 3.0; the back nasal vowel and the newly added palatal lateral approximant are CC BY-SA 4.0, and two nasal vowels are CC0. Source-page metadata was inspected on 2026-10-19 through Commons’ `videoinfo` API. `src/content/ipa-sounds.js` retains exact remote URLs, creator credits, license links, retrieval date and SHA-256 checksums. [Per-file attribution](../src/audio/ipa/ATTRIBUTION.md) ships with the audio; the selected sound’s floating credit view shows the same credit. MP3 transcodes are served locally unchanged. No speech synthesizer is used for chart sounds; no network request is made during playback beyond the app's own origin.

Tests check exact asset hashes, licenses, inventory-to-transcription coverage, token reconstruction, atomic nasal vowels/tied affricates, button coverage, and separation from grammar details. They do not certify each speaker’s phonetic realization.

The development server serves MP3 as `audio/mpeg` and Ogg as `audio/ogg`. The publication package includes the recordings in `dist/src/audio/ipa/`.

Previous recording verification: vowel /y/ and consonant /p/ reached media readyState 4 with valid durations and no media errors. All 52 MP3s decode with the system audio inspector. Auditory/linguistic review of every recording is not claimed.

Prior overlay verification: 86 automated tests passed, including a full corpus token/inventory audit with œ̃ as the explicit sole missing recording. Browser checks confirmed that clicking transcription ɪ highlights the German vowel chart, clicking b switches to Consonants and highlights b, and both audio elements reached readyState 4 without media errors. Present indicative expanded inline in the earlier Quick meaning design; it now opens Grammar, where floating definitions remain available. The three newly bundled MP3s decode with the system audio inspector. Linguistic verification of the generated IPA itself remains separate from this coverage check.

Compact-layout browser verification: the grammar cue opens Grammar directly; the desktop consonant chart has equal client and scroll widths (620 px), confirming no horizontal overflow. Quick meaning reserves no header row above its definition.

## Whole-word audio

A speaker button beside the Pronunciation title plays the exact selected chunk through the same pronouncer as the learning card, preserving the French Thomas preference and quiet loading/playing indicator. The title itself is not clickable. Only failures display status text. Starting word audio stops a chart recording; selecting a sound or notation mark stops pending/active word speech. Closing the overlay stops both audio paths, including voice-discovery retries. Heading and transcription margins are tighter; the sound chart is unchanged.

German profile verification (2026-10-19): 88 tests and `npm run check` pass. Spanish/French lookup maps match the previous commit exactly. Browser testing of der Kugelschreiber confirmed transcription ʁ selects the uvular consonant and loads `281.mp3`, while final ɐ selects the vowel and loads `250.mp3`; both reached readyState 4 without media errors. The entire non-null corpus passes token-to-chart coverage checks.
