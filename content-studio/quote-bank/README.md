# Quote vault

A local reference database for multilingual meme reenactments. Initial research: October 22, 2026. **40 entries: 18 NBA, 2 other sports, 20 internet**, including the requested Chris Webber and Jaylen Brown clips. The selection mixes established memes with newer internet references; it is not a live trends ranking.

The current standalone preview is <http://127.0.0.1:5175/index.html>. To start it from the repository root:

```sh
python3 -m http.server 5175 --bind 127.0.0.1 --directory content-studio/quote-bank
```

You can also open `index.html` directly in a browser. When the repository root server is running via `npm run dev`, the file is available at <http://127.0.0.1:5173/content-studio/quote-bank/index.html>; an existing server from another directory may not expose that route.

- Search quotes, speakers, themes, context and your own notes.
- Filter by category, format, translation effort, editorial first picks, or saved entries.
- Star quotes and add filming notes under each card. These persist in this browser/origin, separately from course and challenge progress.
- **Export bank + saves** downloads all records plus personal saves and notes as JSON. Export is a portable snapshot; an import/restore control is not implemented. Direct-file and localhost storage may differ.
- Source links open externally. Video playback remains on the source site; no media is downloaded or embedded.

## Data and evidence

`quotes.json` is the source of truth. Each stable ID records a short excerpt, attribution, category, format, priority, translation effort, comedic mechanism, context, filming suggestion, translation note, linked evidence and evidence status. Filming/translation notes are proposals; no multilingual scripts or linguistic review are claimed. `production_status: Idea` is the initial editorial state, not a production tracker.

Research inspected retrieved web text, indexed excerpts and clip metadata. **No clip has been marked as watched or audio-transcribed.** “Source documented” means there is supporting text or metadata, not that every syllable has been verified against audio. Follow the source before recording an exact imitation. Reported exchanges, text memes and circulating caption variants have distinct labels. In particular:

- Webber is the compartmentalize commentator. His full broadcast discussion concerns racial injustice; the short meme does not preserve all of that context.
- Brown's speech opening is documented by a Reddit repost/title. The linked YouTube locator explicitly discloses AI-expanded visuals; the original event/date and clean original upload remain unresolved.
- Chet's “treball” and Durant's “hesi” lines are written posts; the Chris Paul line is a joke post title, not a commentator transcript.
- Beverley's “next five years” exchange is **disputed**, with reporting and his denial both linked.
- Musical lines contain only short excerpts. Exact continuous wording remains distinct from shortened meme captions.

No current virality, performance metrics, licensing clearance, translation accuracy or clip-playback certification is inferred from inclusion. These entries are content references, separate from the lesson bank; nothing here is added to exercises or publication output. The existing static build uses an allowlist that excludes `content-studio/`.

## Editing and checks

Edit `quotes.json` for entries and `template.html` for the browser view. Run from the repository root:

```sh
node content-studio/quote-bank/build.mjs
node --check content-studio/quote-bank/build.mjs
```

The build validates unique IDs, required fields, supported categories/priorities, HTTPS source URLs and explicit unreviewed playback flags, then generates the standalone `index.html`. Do not edit generated HTML directly. A new record should include source evidence, explain uncertainty and keep a stable ID so personal saves survive updates.

Manual preview: search `Jaylen`; clear filters; choose NBA and Start here; star a card; open Saved; add a note and reload; export and inspect the JSON. At phone width, verify the single-column layout and keyboard-accessible filters, save buttons and details.

## Verified local preview — October 22, 2026

Build/data validation and generated-script syntax passed. Browser checks passed for all 40 cards, text search, NBA + Start here filtering (10 entries), adding Easy (7 entries), Text meme filtering (4 entries), empty results, saved favorites, notes retained after reload, and JSON export containing 40 records plus the test save/note. Temporary test saves/notes were cleared from the preview. A 390 × 844 viewport showed a single-column layout; the normal viewport showed two columns. No browser console errors were reported. `preview.jpg` captures the normal viewport. These checks do not certify external playback or source accuracy beyond the evidence scope above. App-wide tests were not rerun because application code was unchanged.
