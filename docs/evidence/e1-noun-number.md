# E1 noun number comparison — October 19, 2026

Owner approved the local batch on October 19, 2026 for a local commit; not published. Five lexical records in course-u09,
course-u12 and course-u15 (pack versions 1 → 2). Same senses and entry IDs retain
progress. Existing plural teaching targets and their recordings are unchanged.

The October 18 extraction audit flagged the plural forms below as unmatched.
Manual consultation found a misleading shared explanation: it implied that a
singular necessarily changes the meaning. This is false for the two Spanish
entries. The original extraction audit is retained as historical evidence;
these five flags have this follow-up disposition, not a retroactive extraction match.

| Record | Consulted source and scope | Result |
| --- | --- | --- |
| es.u09-n-holiday | [RAE/ASALE, vacación, senses 1–2](https://dle.rae.es/vacación) | Time off is usually plural, not exclusively plural. Retain las vacaciones; add singular vacación to forms and la vacación to accepted answers. |
| es.u12-n-scissors | [RAE/ASALE, tijera, sense 1](https://dle.rae.es/tijera) | Plural and singular can name the same cutting tool; plural is more common. Retain las tijeras; add tijera and accepted la tijera. |
| fr.u09-n-holiday | [OQLF, number and sense](https://vitrinelinguistique.oqlf.gouv.qc.ca/23760/la-grammaire/le-nom/pluriel-des-noms/pluriel-et-sens-du-nom/noms-dont-le-sens-differe-au-singulier-et-au-pluriel) | Retain vacances for time off; explain the contrast with vacance (vacancy). |
| fr.u12-n-scissors | Same OQLF table, ciseau/ciseaux | Retain ciseaux for scissors; explain ciseau as a chisel. Do not accept le ciseau for this prompt. |
| fr.u15-n-fee | [Académie française, frais, noun](https://www.dictionnaire-academie.fr/article/A9F1507) | Costs/charges use a masculine plural noun. Explain plural agreement; retain les frais. |

Sources accessed October 19, 2026. Notes are original short paraphrases; no
source prose or example sentences were imported. Reuse clearance remains pending.
OQLF comparison covers the sense/number contrast, not a new gender audit. Prior
frozen comparisons remain in source-evidence.js; noun-usage-evidence.js supplies
the current scoped snapshots for these five records. No source-coverage count
increase is claimed: all five already had limited extraction evidence.

Chunk and selected-noun notes now agree, and selected articles explain plural
agreement. Regression checks exercise Spanish accepted variants, reject malformed
article agreement and the French wrong-sense singulars, preserve plural selection,
and ensure changed checked forms invalidate evidence. Examples containing these
words were inspected for related singular claims; no sentence edits were needed.
This is not a complete naturalness review or linguistic certification.

## Local preview

1. Open http://127.0.0.1:5173/content-review.html?pack=course-u12. Find
   `course-u12-n-scissors`: inspect Spanish forms and notes;
   compare French ciseaux and its chisel distinction.
2. Select course-u09 and inspect `course-u09-n-holiday`, then course-u15 and
   `course-u15-n-fee`. Check source links and draft/reuse blockers.
3. In http://127.0.0.1:5173/?pack=course, select unit 12. When scissors is shown,
   open its chunk → Grammar, select the noun and article, and check the plural
   selection and concise notes. In Spanish recall, `la tijera` should pass;
   `las tijera` should fail. In French, `le ciseau` should fail.
   Existing progress can affect which cards appear; do not reset saved progress
   just to reach this item. The review page gives deterministic inspection.

## Verification

130 tests pass, including the targeted noun-number regression. `npm run check`
and `node scripts/check-course.mjs` pass their normal structural checks; the
course audit still reports 48 outstanding coverage requirements. Browser review
confirmed course-u12 v2, both corrected scissors notes, reference links and the
Spanish plural/singular form rows. Recall acceptance was tested through the
actual answer checker, not an end-to-end scheduled lesson.
