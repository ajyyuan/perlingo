# Course authoring status

2026-10-18: the **full 16-unit content draft is authored and locally playable**. Every unit has at least 100 counted vocabulary items and 24 new contextual examples per language. This completes the numerical authoring scope, not source verification, unit mastery assessment, or publication approval. No commit or publication is authorized by this status.

## Actual inventory

| Language | Unique lexical items across the course | With at least one scoped source comparison | Contextual examples |
| --- | ---: | ---: | ---: |
| Spanish | 1,755 | 1,523 | 397 |
| French | 1,743 | 1,354 | 397 |
| German | 1,730 | 1,493 | 397 |

Counts include the retained structured seeds. Each language has 384 new examples (16 × 3 objectives × 8), plus 13 retained examples. Each objective has four production, two meaning-contrast and two transfer prompts. The 31 legacy starter records outside the structured pilot are not included.

`coverage.js` deduplicates NFC-normalized lemmas globally, even across different part-of-speech labels. Case is retained (German Sie/sie). An explicit lexicalSense can distinguish a separately audited sense; none is inferred. Forms, repetitions and productive phrases listed in `counting.js` (such as “my family” and “a cup of coffee”) do not add inventory. Remaining conventional expressions count once each. This is an authored words-and-expressions inventory, **not a ranked list of the most common words**. Per-unit totals cannot be summed to obtain unique global coverage.

## Content and practice

- `noun-inventory.js`, `essential-nouns.js`, `verb-inventory.js`, `adjective-inventory.js`, and `other-inventory.js` supply U02–U16. U01 retains its earlier authored inventory. Stable unit and record IDs preserve progress identity.
- `examples-core.js` and `examples-extension.js` contain explicitly marked chunks and contextual glosses. `grammar-guides.js` supplies language-specific objective explanations. No runtime translation, parser, external AI or content download is used.
- Course → **Learn this unit** includes fresh production items from that unit and due production reviews across units. Contrast and transfer prompts are excluded from learning, including due selection.
- **Understand the difference** presents a foreign sentence and two English meanings. **Try new combinations** starts typed recall directly, without showing the answers first. Each uses six prompts × selected languages. Feedback reveals the answer; a miss prevents a perfect round. Subsequent retries are practice, not an unseen mastery test.
- Only ordinary production sessions update spaced-review history. Contrast and transfer sessions retain their mode in session history. Production reviews use one attempt per pair; new production material and contrast/transfer practice require a perfect round. Production follows the [app-day scheduler](spaced-review.md), with reviews prioritized within 108 planned answers. Prerequisites are metadata only; delayed checkpoints and unit mastery are future work.
- Recall accepts the taught string and explicit alternatives, with existing normalization. Selected initial Spanish first-person examples allow optional yo. Unlisted natural alternatives may still be rejected; this is not semantic grading.
- More displays present paradigms, additional complete six-person tense groups where extracted, German noun cases and Spanish/French adjective agreement forms. A tense selector changes the verb table. This is **not every possible conjugation**: source omissions, compound tenses, imperative/subjunctive coverage and some reflexive constructions remain limited. Reference tables do not imply those forms are all taught.
- Individual component annotations remain partial for new multiword material. The sidebar explicitly identifies missing word analysis and offers a whole-expression record when appropriate. Objective-level prose is not represented as a full syntactic parse.
- Course progress uses `perlingo-preview-course-v1`; starter/foundation progress is separate. The original foundation and reading-pilot records are copied into course assignments without changing their published preview content.

## Evidence and limits

`source-evidence.js` freezes **4,375 additional lexical comparisons**, including 3,772 literal English/translation matches and 3,700 records with at least one form/headword check (overlapping sets). Earlier frozen U01 and foundation evidence is retained. `reference-forms.js` holds supplemental extracted forms for 1,871 records. Exact data snapshots fail validation after a checked lexical change; never refresh snapshots merely to remove an error.

Sources: FreeDict English–Spanish 2025.11.23, English–French 0.1.6 repository snapshot, Ding/FreeDict English–German 1.9-fd1; Kaikki’s English-Wiktionary extraction using the 2026-09-02 dump. `course-sources.js` records access dates, attribution, licenses and scope. `docs/evidence/course-source-audit.json` records dictionary SHA-256 hashes, unmatched records and extraction discrepancies. A literal translation-pair match does not resolve polysemy; an adjective headword check does not validate every agreement form. The source datasets can omit information or conflate capitalized headwords. There are **1,043 new records without an attached comparison**, including many complete expressions and excluded practice combinations.

Author review corrected French nous téléchargeons and added a regression test. Remaining extraction flags include optional Spanish vos forms in retained seeds, plural-only/invariant nouns, participles used adjectivally and multiword/reflexive paradigms absent from extracted tables. Flags are evidence to inspect, not automatic corrections. Noun mass senses omit untaught plurals; el agua/aula retain feminine gender despite their singular article.

French grammar references consulted include UT Austin’s passé composé with avoir/être, imparfait contrast and qui/que pages; German clause-bracket guidance was consulted at IDS grammis. These are background comparisons, not record-by-record certification of the new grammar prose. Full sense/register checks, sentence naturalness, comprehensive word analyses/accepted variants, independent review and source reuse clearance remain incomplete. No corpus attestation, frequency rank or independent reviewer is invented. All new content remains draft; release validation still rejects it.

## Validation and preview

Run `npm test`, `npm run check`, and `node scripts/check-course.mjs`. The coverage audit shows the numerical inventory and exercise-mode targets met; `--complete` still fails on source coverage in 48 unit/language combinations. This failure is intentional and is not hidden by the authored-count tests. `node scripts/check-content.mjs --release` also fails until actual review and reuse clearance.

1. Open http://127.0.0.1:5173/?pack=course and choose **Course**. All 16 units offer all three practice modes.
2. Learn a late unit. Click a noun/verb, then More; inspect noun cases or select a supplied verb tense. Check that the popover overlays the lesson and Report an issue appears only in More.
3. Try **Understand the difference**, choose a wrong meaning, and inspect the correct-meaning feedback. A wrong answer must require another full round.
4. Try **Try new combinations**. It should begin with an English prompt and empty answer field, without a learning pass. The reveal control warns that revealing prevents a perfect round.
5. Open http://127.0.0.1:5173/content-review.html?pack=course-u16 and use the pack selector to inspect any unit, evidence scopes and release blockers.

Publication authorized by the user on 2026-10-18. `dist/` now includes the full current draft course and approved interface updates. Content remains draft with the evidence limits described above; publication is not independent linguistic approval. C4 AI chat was removed.

## Repeating source comparisons

`node scripts/export-course-candidates.mjs > /tmp/perlingo-candidates.json` exports the current lexical facts (including frozen snapshots) without fetching anything. Copy this export to `/tmp/perlingo-form-candidates.json`. With the documented public TEI files cached as `perlingo-eng-spa.tei`, `perlingo-eng-fra.tei`, `perlingo-eng-deu.tei`, and individual Kaikki JSONL files in `perlingo-source-forms/<lang>-<percent-encoded-lemma>.jsonl`, run `python3 scripts/compare-course-dictionaries.py /tmp` and `python3 scripts/audit-course-forms.py /tmp`. They write comparison reports in that directory only. Inputs are external data, not shipped runtime dependencies. Match file hashes against the checked-in audit when reproducing this snapshot; a newer dictionary is a new comparison. Inspect discrepancies before deliberately editing evidence. Neither script regenerates frozen checked-in evidence or grants review approval.

## Default course (local update)

The full course now opens at `/` as well as `?pack=course`; both retain `perlingo-preview-course-v1` progress. The old starter bank is explicitly available at `?pack=starter`, preserving `perlingo-v1`. The foundation route is unchanged. Unknown pack values open the course. The prominent preview banner and regular-lessons link are removed; Settings → About explains structural validation, scoped source checks, incomplete coverage, and pending independent linguistic review. Detailed content metadata remains honest about draft status. This routing/presentation update is local pending approval and publication.
