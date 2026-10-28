# Single-letter pronunciation correction — October 28, 2026

Approved y-only correction; publication status is recorded in README.md.

The reported issue was standalone conjunction **y** being read as the letter name **i griega**. The recorded library contains five single-letter strings (`a`, `A`, `e`, `o`, `y`) in each of eight Spanish voices: Alvaro/Elvira (Spain), Jorge/Dalia (Mexico), Tomas/Elena (Argentina), Gonzalo/Salome (Colombia). The deck headwords are a, o and y; e and uppercase A occur among playable text fragments. There is no standalone u recording in the inventory.

## Evidence and correction

All 40 original clips were decoded to 16 kHz mono WAV and submitted to the configured Azure short-audio recognizer. All eight original y clips returned lexical “y griega.” Other vowels produced a mixture of expected letters, no lexical output and false words (including “tipo” for Tomas’s o); these isolated-vowel transcriptions are not reliable phonetic judgments. No auditory certification is claimed. Raw results, source paths, durations and SHA-256s are retained in `data/spanish-lemmas/audio/single-letter-audit/`.

Generated 32 new recordings using the same voices and explicit SSML IPA phonemes: a → /a/, e → /e/, o → /o/, y → /i/. Uppercase A reuses the corresponding a recording, covering all 40 combinations. All 32 responses decoded successfully. All eight corrected y clips return lexical “y,” without “griega”; isolated-vowel recognition remains imperfect for some other clips, including Tomas’s o. Corrected results are in `single-letter-corrected-audit/`; exact synthesis inputs, hashes and request status are in `single-letter-corrections.json` in the same parent directory. This is scoped machine verification, not an independent listening review.

The user confirmed y was fixed and requested restoring a/A, e and o because no defect had been established for them. Only the eight y replacements are active. The 24 unused vowel MP3s have been removed from application assets; their generation/recognition evidence remains marked as withdrawn in the ledger. Original a/A, e and o recordings were never overwritten and are used again.

Only 32 single-character SSML synthesis requests were made. Recognition checked 40 original and 32 corrected clips. No bulk regeneration or storage upload was performed. Historical assets/manifests and bulk generation evidence remain unchanged.

## Playback

`lemmas/single-letter-audio.js` maps only standalone y, region and voice to immutable hashed MP3s in `lemmas/audio-corrections/`. Lemmas supplies these optional overrides to the shared recorded player. They are same-origin assets in local and hosted builds, independent of the large Azure Blob library; a future normal site publication includes them automatically. Whole-sentence and other-word recordings are untouched. Learning/Challenge do not opt into the override map. Device fallback substitutes i only for standalone y; device-specific pronunciation still depends on the installed voice. Existing exact-region fallback and cancellation are retained.

## Reproduction and review

- `scripts/audit-single-letter-audio.py` audits originals; `--corrected` audits replacements. It reuses saved audit results. Requires macOS afconvert and the existing Speech key on stdin; no key is persisted.
- `scripts/correct-single-letter-audio.py` generates only the eight y requests with the key on stdin. Completed clips resume only after hash verification; unresolved synthesis attempts stop instead of retrying automatically.
- `tests/lemma-single-letter-audio.test.js` checks all 40 voice/region/text mappings, y phonemes, file hashes, original a/A/e/o playback, remote-library override behavior, y fallback and unchanged whole phrases.
- Open `/lemmas/single-letter-preview.html`, choose each letter, and compare Original/Current for each voice. It does not alter course progress. In `/lemmas/`, search y, open its card and use pronunciation preferences to verify each region and voice.

Provider references: [SSML pronunciation](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-synthesis-markup-pronunciation), [short-audio recognition](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-speech-to-text-short).
