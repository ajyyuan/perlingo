# Lemmas audio inventory and estimate — 27 October 2026

Subsequent approval: the owner approved all eight voices with a $45 budget and a sample-first checkpoint. See [sample results and current budget](lemma-audio-sample.md). The report below records the pre-generation inventory and estimates.

This is an offline inventory and public-price estimate only. No synthesis, upload, account changes, credentials, paid requests, or playback changes were made. The existing `/learning/` generation plans and their historical budgets remain untouched. This new scope has not been approved for spending.

## Scope and exact counts

The inventory follows current pronunciation controls in the merged 1,500-card course: headwords, displayed noun/adjective forms and all exposed verb tense alternatives, original usage sentences, tense examples, context-review sentences and first accepted answers, and individually clickable sentence words. The three-word forms prototype's original rows are included. Grammar dialogs reuse these original examples. English definitions and arbitrary personal notes are not spoken and are excluded. Audio preference preview samples are not currently played by the existing control; future added samples would need inclusion.

Text normalization matches recorded playback: NFC and curly-to-straight apostrophes. Case, spaces, punctuation and accents remain significant. Homographs and repeated sentences share one text entry. There are **24,344 distinct texts / 298,896 characters per voice**. The 1,500 lexical cards contain 1,455 distinct headword strings.

| Category | Distinct texts | Missing per voice |
|---|---:|---:|
| Headwords | 1,455 | 1,113 |
| Displayed forms | 17,975 | 17,393 |
| Original usage sentences | 540 | 536 |
| Tense example sentences | 3,252 | 3,250 |
| Context-review sentences | 537 | 533 |
| Context-review answers | 1,467 | 1,182 |
| Individually clickable sentence words | 4,768 | 4,357 |

**Rows overlap; do not sum them.** Original usage plus tense sentences total 3,792 distinct sentences, explaining the earlier sentence-only estimate. Context sentences repeat across several lexical cards; their number is not the count of review questions.

For each of the eight configured Spanish voices, **907 targets are reusable and 23,437 missing**, totaling **292,187 new characters per voice**. The eight variants currently have identical text coverage. Reuse requires a matching manifest entry, expected voice/text-derived asset path, and local file over 100 bytes. Zero matching manifest entries referenced missing/undersized local files. This is not fresh remote-Blob verification or an auditory review of every recording.

## Current rates

Read from Microsoft's public [Azure Retail Prices API](https://prices.azure.com/api/retail/prices), USD consumption rates, East US, on 27 October 2026. The selected meter records are retained in `data/spanish-lemmas/audio/prices-2026-10-27.json`.

- Azure Speech S1 Neural Text To Speech Characters: **$15 / million characters**. Existing named Neural voices, not custom, HD or the separate Long Audio meter.
- Blob Storage Hot LRS, first storage tier: **$0.0208 / GB-month**.
- Hot LRS writes: **$0.05 / 10,000 operations**; Hot reads: **$0.004 / 10,000 operations**.

[Speech pricing](https://azure.microsoft.com/en-us/pricing/details/speech/) · [Blob pricing](https://azure.microsoft.com/en-us/pricing/details/storage/blobs/) · [Bandwidth](https://azure.microsoft.com/en-us/pricing/details/bandwidth/).

No trial credits, free synthesis allowance, tax or negotiated discounts are assumed. Speech charges are for generated text; replaying stored files does not synthesize again. A future generation job should confirm its billing meter before a bulk run.

## Incremental estimates

| Coverage | New files | New characters | Synthesis once | Estimated added storage | Storage/month | Initial writes |
|---|---:|---:|---:|---:|---:|---:|
| Spain masculine | 23,437 | 292,187 | $4.38 | 0.76 GB | $0.016 | $0.12 |
| Spain masculine + feminine | 46,874 | 584,374 | $8.77 | 1.52 GB | $0.032 | $0.23 |
| All four countries, both voices | 187,496 | 2,337,496 | $35.06 | 6.09 GB | $0.127 | $0.94 |

Countries: Spain, Mexico, Argentina and Colombia. Voices are the existing mappings in src/azure-voices.js. Other single voices cost the same synthesis amount; file-size estimates differ slightly.

Storage is modeled from observed bytes/character across the existing Spanish recordings for each voice at the current 24 kHz / 48 kbps mono MP3 format. The new corpus has a different word/sentence mix; **6.09 GB is an estimate, not a measured output size**. Allow roughly 4–8 GB for planning (about $0.08–$0.17/month). Changing encoding changes file size. Using one write per new clip gives the initial-write estimate; verification/listing/retries add operations.

All-eight base generation plus upload is approximately **$36**. A **$45 generation/upload budget** would leave about $9 for samples, selective corrections and retries; it would not cover regenerating the entire library twice. This is a proposed job budget, not an Azure billing cap or spending approval. Monthly hosting and traffic are separate. At the listed read rate, one million read operations cost about $0.40, excluding bandwidth and additional/range requests. Azure advertises the first 100 GB/month of internet egress free; this allowance is shared across account usage, so remaining free capacity was not assumed or checked.

## Reproduction and next step

Run `node scripts/lemma-audio-inventory.mjs` for the summary or add `--write` to regenerate `data/spanish-lemmas/audio/inventory.json`. The artifact includes normalized targets/categories and exact per-voice missing text lists. The script validates course/voice counts and reused asset identities. Two runs produced identical summaries; no app behavior changed.

Before synthesis: choose the voice scope and approve a new budget, prepare a separate incremental plan and ledger with explicit limits, then generate a small pronunciation sample. Preserve all existing recordings and historical ledgers. Only after checking samples should bulk synthesis, validation and hosting uploads proceed. Playback integration and the shared voice selector are subsequent implementation work, not completed by this inventory.
