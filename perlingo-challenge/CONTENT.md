# Challenge content and evidence

The initial bank contains **Bread and Water × 50 languages** in `public/content.js`. It is a draft collection of common languages supported by the speech endpoint, not a sourced ranking by speaker counts. Country flags identify a representative locale and are not a claim that a language belongs exclusively to that country. Regional IPA and audio voice/locale agreement remain unverified.

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

Current tile selection covers all 100 entries with generated audio: 89 ElevenLabs clips and 11 Azure clips. Historical human recordings are optional references only. Slovenian `kruh` was checked against https://en.wiktionary.org/wiki/kruh#Slovene while investigating failed synthesis/recognition candidates; no content or phoneme override was inferred from recognizer errors. The selected Slovenian-primary replacement passed word screening.

## Family classification

The original 50 playable entries map explicitly to Glottolog 5.3 identifiers in `data/playable-glottocodes.json`. This classification does not expand the lesson, audio or recognition inventory. See [GLOTTOLOG.md](GLOTTOLOG.md) for mapping qualifications and licensing.

## Expansion started October 21, 2026

`data/word-bank/candidates.json` holds **491 noun candidates** (including the two existing packs), grouped by topic. This is a planning inventory, not 491 translated packs. Noun-first is a practical starting policy, not a permanent noun-only restriction. It includes ambiguous labels that need explicit senses before authoring: orange the fruit, date the fruit, nail the body part, bank the financial institution, and so on. Do not copy an English label into translation work without resolving its sense. Compound nouns and languages without a one-word equivalent are allowed; no English-style grammatical category is imposed on every translation.

The first proposed batch is Sun, Moon, Star, Tree, Apple, Cat, Dog, House, Book and Milk. `sun.json` begins Sun with source candidates for all 50 language slots, extracted from Wiktionary’s exact “the star around which the Earth revolves” table. English comes from the source headword. It retains revision, source URL, source-byte hash and CC BY-SA attribution. Mandarin is extracted with `cmn`, Filipino with `tl`, Norwegian with `nb`, and Croatian/Serbian with `sh`; these mappings require explicit variety review. Source variants and accent marks are not automatically taught forms or accepted answers. The source’s proper-noun classification is retained in the sense evidence; it does not settle our eventual teaching-label convention.

Reproduce after downloading the public source HTML:

```sh
curl -fsSL https://en.wiktionary.org/wiki/sun/translations -o /tmp/perlingo-sun-source.html
python3 perlingo-challenge/scripts/import-sun-candidates.py /tmp/perlingo-sun-source.html
```

Review the resulting diff and revision; regeneration is a new source snapshot, not approval. Sun remains **staged, not playable**: taught form, reading and accepted answers are deliberately unset, with audio not started. Extraction is not linguistic verification. No new generated audio or native listening review was performed in this change.

Admission to a playable pack requires all 50 taught forms and readings, explicit accepted answers with source/sense checks, meaningful lexical regression checks, and checked exact-word audio under the existing pronunciation workflow. Daily calendar tests additionally reject scheduled packs with missing entries or selected recordings. Stage incomplete work outside `public/`; do not silently reduce Daily’s 50 languages. Keep the original course’s article-and-noun and contextual chunk conventions unchanged.
