# IPA pronunciation guides

Quick meaning shows clickable approximate IPA below the meaning. Clicking it opens **Pronunciation**, a separate centered overlay with the selected chunk, IPA, collapsed Reading IPA help, and playable sound charts. **Word details** (More) has no pronunciation content. Cards and recall have no IPA hints. Missing guides are omitted. The charts have Vowels/Consonants controls and a language selector. The current language is selected initially; All included sounds shows the combined reference, not the entire IPA alphabet. Vowels are arranged by tongue height/position; consonants by manner/place, with horizontal scrolling on narrow screens. Every symbol is a native keyboard-accessible button with a descriptive label.

Recordings are generic phonetic demonstrations; many consonants include a surrounding vowel. Language filters are introductory selections, not exhaustive phoneme inventories or guarantees of an exact dialect realization. Nasalization, length, stress and connected speech need the phrase context. Missing recordings are not synthesized. The reference currently omits /ɥ/ and /œ̃/, and diphthongs are not separate buttons.

Selecting a sound displays its description, creator, file source and license. Audio loads only on selection, and the active button is subtly tinted. Errors show a short retry message and retain a source link. A new selection, switching chart/filter, closing the overlay stops playback. Browser speech synthesis is cancelled when a recording starts. Existing phrase audio—including French Thomas—is unchanged. Charts and IPA are not available during recall or contrast questions.

## Source and limits

`src/content/ipa-data.js` contains exact-text lookups for 2,792 Spanish, 2,739 French, and 2,669 German unique taught phrases and clickable chunks across starter, foundation and course packs. Of these 8,200 lookup records, 19 foreign-language fallbacks (9 French, 10 German) are explicitly withheld as null, leaving 8,181 displayed guides. Missing guides are omitted rather than invented. These are automatically generated approximations, not dictionary-verified or independently reviewed records. Each guide explicitly says **IPA ≈**, with a longer explanation in Pronunciation. There is no runtime API or model dependency.

Generation uses eSpeak NG through `espeakng-loader==0.2.4`; the actual engine version and voice identifiers are recorded in the generated file. Voices are `es` (Spain), `fr` (France), and `de` (German). Source: [eSpeak NG](https://github.com/espeak-ng/espeak-ng), [phoneme conventions](https://github.com/espeak-ng/espeak-ng/blob/master/docs/phonemes.md), [generator license](https://github.com/espeak-ng/espeak-ng/blob/master/COPYING). Only generated output is shipped, not the generator or its dictionaries. No dictionary entries are copied. The generator remains a development-only dependency.

Engine transcription conventions, stress notation, regional variation, liaison, schwa, homographs, and connected speech can differ from a dictionary or the selected browser voice. Chunk transcription is generated separately, never sliced from a sentence's IPA. Full phrases are processed together. Reference-form tables and individually selected overlay words do not yet have IPA guides. Errors can be reported through the existing More → Report an issue flow; reports require investigation, not automatic replacement.

## Regeneration and checks

Use a temporary directory or virtual environment:

```sh
python3 -m pip install --target /tmp/perlingo-ipa-tools espeakng-loader==0.2.4
PYTHONPATH=/tmp/perlingo-ipa-tools python3 scripts/generate-ipa.py
npm test
npm run check
```

The input exporter collects every taught phrase and clickable chunk and deduplicates by language and exact text. The generator normalizes curly apostrophes only for engine input; lookup keys preserve the original text. It processes all clauses, rejects empty output, removes engine hyphen separators, withholds foreign-language fallback output and records engine provenance. Coverage tests fail if taught text changes without regenerating IPA. Tests establish coverage and rendering contracts, not linguistic correctness.

Manual check: open Quick meaning and click its IPA. Play vowel and consonant symbols, change language, and use Tab/Enter. Verify closing stops playback and restores focus to the originating chunk. Reopen Quick meaning → More and confirm no IPA/help/charts appear in Word details. Check horizontal chart scrolling on a narrow screen. Recall must not show IPA or chart controls.

Approved locally; production and `dist/` remain unchanged.

## Sound recording provenance

The reference bundles **52 human recordings** (19 vowels, including three nasalized vowels; 33 consonants) from Wikimedia Commons. Most are CC BY-SA 3.0; the back nasal vowel is CC BY-SA 4.0, and two nasal vowels are CC0. Source-page metadata was inspected on 2026-10-19 through Commons’ `videoinfo` API. `src/content/ipa-sounds.js` retains exact remote URLs, creator credits, license links, retrieval date and SHA-256 checksums. [Per-file attribution](../src/audio/ipa/ATTRIBUTION.md) ships with the audio; the UI shows the same credit on selection. MP3 transcodes are served locally unchanged. No speech synthesizer is used for chart sounds; no network request is made during playback beyond the app's own origin.

The layout is an original simplified reference using standard articulatory categories, not a reproduction of the official IPA chart artwork. It includes the common building-block sounds for the three course languages; regional differences and language-specific realizations remain outside this introductory reference. French /ɥ/ and /œ̃/ have no bundled buttons in this version. Tests check exact asset hashes, licenses, filter membership, button coverage and separation from grammar details. They do not certify each speaker's phonetic realization.

The development server serves MP3 as `audio/mpeg` and Ogg as `audio/ogg`. Production assets will be copied into `dist/src/audio/ipa/` when publication is requested.

Previous recording verification: vowel /y/ and consonant /p/ reached media readyState 4 with valid durations and no media errors. All 52 MP3s decode with the system audio inspector. Auditory/linguistic review of every recording is not claimed.
