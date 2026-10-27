# Eight-voice lemma audition — 27 October 2026

The owner approved all eight configured Spanish voices with a **$45 generation/upload budget**, starting with a small sample for listening review. The owner subsequently approved the samples and full generation; see [bulk generation status](lemma-audio-library.md). This approval supersedes the inventory report's earlier unapproved status; it does not authorize publishing the course.

Generated six exact course texts in each voice (48 MP3s): hacer, hiciste, haríamos, Ayer hiciste la comida., Espero que tengas tiempo., and La canción le gusta a Ana. These exercise headword pronunciation, past/conditional stress and sentence rhythm; they do not exhaust all phonetic or context-sensitive cases. The selection is identical across Spain, Mexico, Argentina and Colombia, masculine and feminine.

Open http://127.0.0.1:5173/audio-generation/lemmas-sample/index.html. Select a phrase, then click a voice. Only one sample plays at a time. Clicking the active voice stops it; changing phrase or leaving the page stops playback. Native controls and keyboard focus are retained. This comparison page is outside the production build input; no course audio was replaced.

## Generation and budget evidence

- Immutable sample fixture: audio-generation/lemmas-sample/plan.json.
- Generator: scripts/generate-lemma-audio-sample.py, existing East US Speech resource, standard Neural voices, 24 kHz / 48 kbps mono MP3. Direct synthesis requests used explicit voice/locale with no speaking-rate adjustment, to audition the provider's default rendition. Future bulk PlainText generation should use the same voice and audio format.
- 48 successful requests, 752 text characters, **$0.01128 estimated synthesis** at $15/million. This is an estimate before credits/taxes, not a retrieved invoice. Count it against the approved $45; approximately $44.98872 remains before other costs.
- Separate ledger reserves each attempt before sending; completed files are reused and hash-checked on rerun. Failed or uncertain attempts stop rather than automatically retry. The sample script has a $0.10 guard and cannot launch bulk generation. Future bulk tooling must count this ledger toward the combined budget and skip reusable sample files or explicitly account for any repeats.
- Existing Speech key was used temporarily, not regenerated. Temporary credential file was removed after completion. No key is in the plan, source, ledger or comparison page.

All 48 files match their saved SHA-256 hashes and passed local afinfo decoding/duration checks (102.5 seconds total). Results are in audio-generation/lemmas-sample/validation.json. Browser checks confirmed the eight controls, sentence selection/translation and sample playback control. These are file-integrity and UI checks, not an independent pronunciation-quality assessment. The owner subsequently listened and approved these samples.

No existing library manifest, generation ledger, course progress or app playback was changed. No remote hosting upload, commit, push or publication was performed.
