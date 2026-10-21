# Language tree

## Separate exploration artifacts

`/tree.html` preserves the original language-only radial tree: 50 language tips, centered collection root, smooth curves, search, pan/zoom and Full detail. The synthetic root is a navigation device, not a linguistic ancestry assertion. Simplified mode uses the editorial projection below; Full detail retains the source nodes on each playable path. Internal names appear on hover.

`/forest.html` is the pronunciation overview. `forest.js` renders semantic HTML family/branch sections and native audio buttons; `forest.css` sizes them directly to the viewport without scaling the page. Indo-European subgroups remain explicit, with connecting stems and bounded clusters. All 50 appear once. Word text stays on one line, fitted between 14–20px; on smaller screens the layout reflows and scrolls. This is a compact classification overview, not a full genealogical drawing. The radial page provides that exploration separately. Existing Bread/Water word, reading and cached audio assets are reused. No new pronunciation-quality claim is made.

The pages fetch bundled catalog JSON; only forest playback fetches audio. Neither saves game settings or calls speech providers. The previous SVG word/forest layout functions remain in `tree-layout.js` as tested prototype code, but are not offered by the two current page interfaces.

## Challenge selection picker

Implemented locally: a searchable visual family tree with connected cards, branch expansion and individual selection. The canvas opens with all 50 playable language tips expanded across their separate family trees. There is no family-opening step and no invented shared ancestor between unrelated roots. Show all expands the playable branches and fits the complete canvas. Drag blank space or scroll to pan, use +/− or Ctrl/Command-wheel to zoom, Fit to frame the expanded tree, and Reset for 100%. Touch uses native scrolling. Native checkboxes and buttons remain keyboard accessible. Only the original 50 content entries are playable. Branch checkboxes select their playable descendants, with mixed state for partial selections. Other nodes can be expanded and opened on Glottolog but cannot enter a round. Playable only (on by default) hides branches without playable descendants. Turn it off to explore the entire catalog. The default canvas labels only language tips. Internal forks are circular branch checkboxes; hover or keyboard focus reveals the group name, and a nearby +/− control expands or collapses it. Trees open expanded in this view. Root and branch names are available on hover/focus. The editorial projection skips intermediate classifications and retains Romance, Germanic, Slavic, Eastern Baltic, Indo-Aryan, Iranian and Celtic as broad groups where present, then language tips. Other families go directly to language tips. Playable standard varieties remain available regardless of Glottolog level; unplayable dialects are explored in Full detail. Full detail restores every source level and its labeled cards. Search jumps to a family on the same canvas without hiding other roots. This visual projection is not a claim of immediate genealogical descent; the source ancestry and external links remain available. Search includes app aliases, Glottolog names, Glottocodes and ISO codes; exact Glottolog names appear first. Search results retain ancestry and can jump into the tree.

Selection is saved as `languageIds` in browser `pc-settings-v1`. Closing the picker discards draft changes; Use selection applies them. Legacy count settings migrate to the corresponding first N original entries. The script filter intersects the selected IDs; zero matching languages disables starting. All 50 resets the draft selection. No new speech calls, voices, words or recognition languages were introduced.

## Source and attribution

[Glottolog 5.3](https://glottolog.org/download), retrieved 2026-10-21. Hammarström, Harald & Forkel, Robert & Haspelmath, Martin & Bank, Sebastian. 2026. Glottolog 5.3. Leipzig: Max Planck Institute for Evolutionary Anthropology. [DOI](https://doi.org/10.5281/zenodo.15525265). License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Original attribution and modifications are recorded in `data/GLOTTOLOG-LICENSE.txt` and in the picker's source disclosure.

The pinned `glottolog_languoid.csv.zip` archive SHA-256 is `47fcc04c18f3f6bff43198b5be14f1f6954600c90573373df9ecf6fc12622bfb`. The importer preserves all 27,177 node identities and parent links, including 429 roots, while exporting only required fields. This is a catalog containing families, languages, dialects and administrative groups, not 27,177 separate languages or a claim that every root is genealogical. Classification reflects this source/version and is not a definitive resolution of disputed language boundaries.

`data/playable-glottocodes.json` maps app IDs explicitly. Arabic maps to Standard Arabic, Persian to Western Farsi, Malay to Standard Malay, Filipino to Tagalog, Norwegian to Bokmål, and Latvian to Standard Latvian. Croatian Standard, Serbian Standard, Bokmål and Standard Latvian have dialect-level nodes in this source; the app preserves its familiar labels and existing content. Mapping notes are displayed contextually. Future catalog upgrades require reviewing these mappings; they do not automatically enable new playable entries.

## Regeneration

From repository root, with Python 3:

```sh
python3 perlingo-challenge/scripts/import-glottolog.py
npm run test:challenge
```

The importer uses the ignored local archive cache or downloads the pinned official archive, verifies its hash, validates ancestry and 50 unique ISO-matched mappings, then writes `public/language-tree.json` and attribution. The challenge loads bundled JSON at startup for its default Families layout; the picker also loads a local copy when opened; browsing needs no provider API or Glottolog network access until an external source link is opened. The server serves the JSON and two UI modules through its explicit public allowlist. Large lists render in pages of 80 to keep the DOM manageable.

## Challenge default layout

`family-board.js` derives nonempty family/branch groups from the active selected IDs; its renderer delegates card content to the existing challenge tile renderer. `family-board.css` shares small tile styling and word fitting between the family board and the flat Compact grid. Compact uses closely spaced responsive columns without family headings or grouping. Families keeps each family or major branch in one tinted, labeled box, with small tiles arranged inside. Dense CSS grid placement fills available gaps with smaller groups; visual placement can differ from source/tab order. Boxes reduce to at most two columns on narrow screens. Parent family names remain in group tooltips and accessible labels. Tiles retain Compact’s 60px height and word sizing. Setup and study default to Families; `pc-settings-v1.layout` persists Families/Compact preference. The study toggle replaces only the language board, preserving its deadline and round selection. Script filtering, readings/IPA, playback and recognition behavior are unchanged. Results keep the original grid. Catalog failure displays a compact fallback with a contextual notice.
