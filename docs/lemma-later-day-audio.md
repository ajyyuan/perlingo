# Later-day audio completion — November 5, 2026

The reviewed curriculum was committed as `38f9e7ce6c`, as requested. The subsequent audio change was approved and committed as `32b920b21d`, including all 3,160 MP3 files. Nothing was pushed, uploaded to the production audio host, or published.

## Scope and cost

Generated only the missing 395 texts per voice: 177 comparison sentences, one revised context sentence, and 217 accepted-answer words. The eight existing Spanish voices received 3,160 recordings, totaling 99,569,254 bytes. All 90,416 current inventory texts now have a local recording in every voice. All 789,448 pre-existing manifest mappings were preserved, including other languages; French Thomas and pronunciation feedback behavior are unchanged.

Azure reported 47,464 billed neural characters. At the previously documented $15/million rate, synthesis is **$0.71196** before tax/credits, within the $2 operational ceiling. This is a rate-based calculation, not an invoice. The [Azure pricing page](https://azure.microsoft.com/en-us/pricing/details/speech/) was checked but returned dynamic price placeholders, so no fresh account-specific price is claimed. No upload spending occurred.

## Generation and verification

`scripts/generate-lemma-later-audio.py` uses a separate immutable plan and eight deterministic batch IDs. It records attempts before submission and does not automatically resubmit attempted jobs. The initial sandbox DNS failure occurred before connecting; that record is preserved separately. The same job ID was then submitted with network access. All eight jobs succeeded. Credentials were supplied through stdin, never written into the plan or ledgers.

- Every returned text was checked against its planned input and deterministic voice/text filename; all 3,160 hashes and MP3 frame structures pass.
- All 3,160 new clips decoded successfully with the existing native decoder and received active-RMS measurements. Twenty-four short/median/long samples also passed the independent file-validation decoder.
- Existing loudness measurements were retained. The full bank now has 760,168 Spanish measurement entries in 1,025 shards; the -16 dBFS target and ±12 dB gain cap are unchanged.
- All 449 tests in `npm test` pass, including strict recording and measurement coverage. `npm run check` and whitespace checks pass.
- `npm run check:audio` passes for 770,480 required recordings across ten regions, including legacy languages. The current inventory reports zero missing recordings in all eight Spanish voices.
- The Codex browser played the newly recorded **Utiliza esta herramienta.** from its local MP3, with readyState 4, advancing playback time and no media error. No browser test answers or saved progress were changed.

This establishes mapping, file integrity, decode/measurement and representative browser playback; it is not an independent phonetic listening review of every clip.

Evidence: [expansion summary](../data/spanish-lemmas/audio/later-expansion.json), [plan and batch ledgers](../audio-generation/lemma-later-library/), [current inventory](../data/spanish-lemmas/audio/inventory.json). The earlier `later-day-audio-gap.json` preserves the fulfilled target list for traceability. New MP3s are stored under `src/audio/azure/` and explicitly tracked in the approved audio commit despite the general ignore rule; production upload remains a separate release step.

## Local preview

Reload [Perlingo](http://127.0.0.1:5173/lemmas/) to discard cached manifests. Search **utilizar**, open More info, expand **utilizar · usar · emplear**, then play **Utiliza esta herramienta.** Compare with an existing headword recording. Use pronunciation preferences to try another region or the feminine voice, then restore your preference. In typed practice, newly accepted answers use their recordings for spoken feedback.

The audio changes are committed locally. Production still serves the previously published version.
