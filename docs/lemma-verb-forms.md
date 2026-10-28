# Course-wide verb reference — October 27, 2026

Published October 27, 2026 as Sites version 26, deployment `appgdep_6ae103c84db4819180cae87f5170e44d` (succeeded). GitHub application commit `8e1ca5a8` maps to Sites source `b2599319e94a7692882f778660d7b68581acd702`. The existing public audience, perlingo.app domain and runtime environment revision 2 are preserved. Every one of the 369 verb cards has the compact nine-group picker previously available for tener: present, preterite, imperfect, future, conditional, present perfect, present subjunctive, affirmative commands and negative commands. The original four assessments, their question banks, scoring and progress are unchanged. These are reference tables, not additional tests.

The picker retains its sliding three-option view, pronunciation, arrow-key navigation and `-` / `=` shortcuts. Version 26 retained only tener’s nine tense examples. The subsequent local expansion adds translated tense examples across all 369 verbs, with explicit exceptions for unsuitable commands and defective forms; see [coverage and evidence](lemma-tense-examples.md). A subsequent local UI update makes Full notes and standalone notes use the shared forms renderer and the same tense data/examples as study cards; it awaits publication. Displayed reference forms and participles now participate in exact course-card lookup from sentence words.

## Sources and checks

`data/spanish-lemmas/conjugation-evidence.json` freezes conjugation records for all 369 headwords from [English Wiktionary contributors through Kaikki/Wiktextract](https://kaikki.org/dictionary/Spanish/index.html), October 1, 2026 dump, October 25 extraction. Each record includes its download URL, retrieval date and hash of the original JSONL payload. The retained evidence excludes combined object-pronoun forms; its hash identifies the original download, not the filtered record. Attribution and adaptations are listed on the course Sources page; adapted tables retain CC BY-SA 4.0 licensing.

The offline compiler selects the exact infinitive's conjugation table, then exact tense/mood/person/number tags. Table boundaries matter: source entries can also contain separate pronominal paradigms. It excludes voseo, archaic/obsolete/dated/rare/nonstandard tags, and fails on missing slots. Present perfect is assembled from the six present haber auxiliaries plus a sourced masculine singular participle. No missing conjugations are guessed.

Checks cover all slots, preserve every existing present row, and match 12,656 distinct simple-form/participle–lemma pairs against the older pinned Doozan allforms snapshot. That older source checks membership only, not tense/person. Both snapshots derive from Wiktionary: they are not independent dictionaries. `conjugation-audit.json` records these matches and hashes of unchanged deck/context/assessment files. Tests also check explicit irregular families, accent distinctions, exclusions and deterministic compilation.

Targeted primary-source comparisons used [RAE conjugation models](https://www.rae.es/dpd/ayuda/modelos-de-conjugacion-verbal) and DPD entries for [ser](https://www.rae.es/dpd/ser), [haber](https://www.rae.es/dpd/haber), [prever](https://www.rae.es/dpd/prever), [reír](https://www.rae.es/dpd/re%C3%ADr), [escribir](https://www.rae.es/dpd/escribir), [pagar](https://www.rae.es/dpd/pagar), [elegir](https://www.rae.es/dpd/elegir) and [describir](https://www.rae.es/dpd/describir). These support the reviewed irregular models and the following editorial decisions; this is not a claim that every form received an independent RAE comparison.

- Use escrito, pagado and elegido in the compound tables; omit archaic escripto and the less appropriate source alternatives for these teaching tables.
- Retain descrito/descripto, labeling the latter as a Río de la Plata variant.
- Separate auxiliary ha from impersonal hay. Show only ha habido for the impersonal perfect. Explain that other existential forms remain singular; suppress archaic haber command tables in the UI.
- Preserve third-person-only tables for the taught event/state senses of ocurrir, suceder and consistir. Explain command non-use rather than inventing a command exercise.

The scope is nine selected groups, not all Spanish conjugation: imperfect subjunctive, other compound tenses, progressive constructions, voseo, full pronominal paradigms and nosotros commands are outside this picker. Existing pronominal usage notes remain. Automated agreement with dictionary data and targeted source checks improve confidence but cannot certify error-free linguistic content.

## Maintenance

Ordinary rebuilds are offline:

```sh
python3 scripts/build-lemma-conjugations.py
node --test tests/lemma-verb-forms.test.js
```

Explicit source refresh: run `node scripts/fetch-lemma-conjugations.mjs`, inspect Kaikki's current dump/extraction metadata and enter those dates in the evidence file before compilation. Review source differences and editorial decisions. Never refresh silently during normal app builds.

To reproduce older membership evidence, obtain `es_allforms.csv` from doozan/spanish_data revision `b8ed076b4faea26a0985ee46ca736771c2e62dc4`, verify its hash against the audit record, then run `node scripts/audit-lemma-conjugations.mjs /path/to/es_allforms.csv`. This writes an audit record for the current files; it must not be used to silently bless unrelated assessment changes.

Validation: 317 tests pass; `npm run check` passes. Browser inspection confirmed ser's new picker, its past table and the bracket shortcut in the main course, with the existing divided card layout fitting the viewport. No assessment answers were submitted.

Preview: reload `/lemmas/`, open ser (word #8) or another verb, and select Past/Future or press `-` / `=`. Compare a noun to confirm it retains its simpler forms table. The four test entry points remain unchanged.
