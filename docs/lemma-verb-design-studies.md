# Verb guide design studies — local prototype

Open `/lemmas/verb-designs.html`. This is a separate comparison page, not a replacement for the current app guide. Its gallery contains 15 working layouts, with a prototype selector and previous/next controls in full-size view. Links ending in `#1` through `#15` open an individual study. Tener, ser, hablar and ir use the existing `verbGuide` data; the rare-tense toggle controls the literary/legal group. No scoring, saved progress, audio, source data or production guide behavior changes.

| # | Study | Main interaction |
|---|---|---|
| 1 | Quiet atlas | Grouped compact tables; click for full table |
| 2 | Horizontal bands | A horizontal strip per mood; click for full table |
| 3 | Conjugation matrix | Shared subject rows, tense columns; horizontal scroll |
| 4 | Mood tabs | Switch mood, read larger tables |
| 5 | Reference browser | Tense navigation beside one full table |
| 6 | Fixed inspector | Hover/focus/click updates a stationary detail panel |
| 7 | Bottom drawer | Tense selection updates a reserved bottom panel |
| 8 | Folded families | Expand mood groups |
| 9 | Dictionary ledger | Expand individual tense rows |
| 10 | Simple + compound | Paired construction tables, with other forms below |
| 11 | Singular / plural | Explicit number toggle; nonfinite forms remain separate |
| 12 | One person at a time | Explicit person filter; click for all forms |
| 13 | Magnifying atlas | Hover/focus lens, click for a full table |
| 14 | Two-table comparison | Independent construction selectors |
| 15 | Index + table | Compact text index, full table on click |

Every prototype has access to the complete reference inventory selected by the rare toggle, although not every layout shows all forms simultaneously. Number/person filters are explicitly labeled and do not change the underlying data. Compact previews abbreviate alternate forms; expanded tables retain them. These are interaction studies, not new grammar lessons. Some intentionally trade simultaneous coverage for readability; no winner has been chosen. Primary source attribution is inherited from the existing guide, with a form-source link on the study page.

Files: `lemmas/verb-designs.html`, `lemmas/verb-designs.js`, `lemmas/verb-designs.css`. No commit or publication is authorized by creating these studies.

Validation: browser review rendered all 15 full-size studies, exercised mood switching, the fixed inspector, singular/plural filtering, person filtering and both-table selection, and rendered the gallery for all four verbs with rare tenses both enabled and disabled. No browser console errors were reported. JavaScript syntax, `npm run check`, and whitespace checks pass. Screenshot: `/tmp/perlingo-15-designs.png`. Visual choice remains the user's review; no production UI was replaced.
