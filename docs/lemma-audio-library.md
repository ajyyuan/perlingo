# Full eight-voice lemma audio library

On 27 October 2026 the owner listened to the eight-voice audition and approved full generation within the existing $45 generation/upload budget. This supersedes the sample-first pause. It does not authorize commit, push or publication.

The frozen `audio-generation/lemmas-library/plan.json` contains 192 batches of at most 1,000 texts, using the same eight Neural voices and 24 kHz / 48 kbps mono MP3 format as the audition. It requests 187,448 new recordings and reuses all 48 audition recordings, plus existing matching course recordings. Estimated synthesis including the audition is $35.06244 at $15/million characters, before credits/taxes. The plan reserves $2 for upload operations; total remains below $45. Hosting and playback integration are separate next steps.

`scripts/generate-lemma-audio-library.py` supports prepare, submit, collect and finalize. Submit reserves each deterministic job ID locally before a paid PUT. Existing attempts are never automatically submitted again; ambiguous submissions must be inspected using GET. Collect downloads successful batches without resynthesis, validates exact text/result correspondence and file size, saves SHA-256 proofs, and removes temporary ZIPs. Finalize verifies all generated hashes and full eight-voice target coverage before merging entries into existing manifests; other languages and historical generation ledgers are preserved. Credentials are read from stdin and never stored in plans or ledgers.

## Completed results

All 192 Azure batches succeeded, with zero failed clips. Collected **187,448 new MP3s**, totaling **4,243,051,668 bytes (4.24 GB)**, and reused all 48 audition recordings. Combined with the preexisting recordings, each of the eight voices covers all **24,344 distinct course texts** (194,752 course text/voice combinations).

Azure reported 2,336,744 bulk Neural characters. At $15/million plus the $0.01128 audition, synthesis totals **$35.06244**, leaving **$9.93756** of the $45 generation/upload budget. This is a rate-based estimate using provider-reported character counts, not a retrieved invoice; credits and taxes are not included. No hosting upload was performed, so no new upload charge is included.

Every new clip passed exact request/result text matching, SHA-256 verification and MP3 frame validation; 24 representative clips (short, median and long for each voice) also decoded locally using afinfo. Batch files contain ID3 provenance and an optional Xing frame in addition to the expected 24 kHz / 48 kbps mono audio. Evidence is in `audio-generation/lemmas-library/validation.json`, `mp3-validation.json`, and the per-job ledgers. The full library checker verifies the union of legacy audio and lemma targets; existing recordings, region mappings, French and German entries remain intact.

The temporary key file was removed after collection. Local manifests are extended; app playback behavior is unchanged. Upload, the Lemmas recorded-voice integration and voice preferences remain subsequent work. No commit, push or publication was performed. The existing local audition remains available at http://127.0.0.1:5173/audio-generation/lemmas-sample/index.html.

These automated checks establish mapping and file integrity, not an independent auditory review of every pronunciation.
