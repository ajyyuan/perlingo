# Lemma notes: second-pass review

October 25, 2026. Local preview only; subsequently approved for commit, not publication.

The earlier audit missed real errors. This pass screened all 1,500 lexical entries and the 53 authored example entries, then investigated specific uncertainties against RAE/ASALE DLE and DPD. Ten entries changed; 1,490 lexical entries stayed identical. The [machine-readable record](../data/spanish-lemmas/second-pass-audit.json) preserves baseline/result hashes, exact changed fields, reasons, references and explicit retain decisions.

This was the same authoring assistant reviewing again, with additional references independent of the frozen Wiktionary extraction. It was **not an independent reviewer**, nor a separate second-dictionary verification of all 1,500 entries. “Unchanged” means no issue identified in this screen, not certified correct.

## Changes supported by evidence

| Entry | Previous issue | Narrow correction and basis |
| --- | --- | --- |
| mes | `los mes` presented as plural | `los meses`; monosyllabic words ending in -s take -es under [DPD plural §1.6](https://www.rae.es/dpd/plural). |
| gas | Same invariant-plural error | `los gases`, under the same rule. |
| español, adjective | Feminine rows repeated the masculine | `española / españolas`; [DLE español](https://dle.rae.es/espa%C3%B1ol) supplies the feminine headword, with regular plural agreement. |
| ocurrir | Gloss called the happen sense impersonal despite a grammatical subject | Remove that qualifier; retain the third-person table. [DLE sense 2](https://dle.rae.es/ocurrir) identifies the thing that happens. |
| suceder | Same confusion between third-person usage and subjectless usage | Remove the qualifier; retain the third-person table. [DLE sense 4](https://dle.rae.es/suceder) explicitly illustrates a plural subject. |
| escuchar | Pattern included a person but omitted personal a | Distinguish `escuchar algo` from `escuchar a alguien`. [DPD escuchar](https://www.rae.es/dpd/escuchar). |
| gestión | Bare “process” obscured the administrative/goal-directed meaning | Management; administration; steps taken to get something done. Supported by [DLE senses 1–2](https://dle.rae.es/gesti%C3%B3n) and the frozen dictionary’s management/step senses. |
| etcétera | Corpus Q tag triggered an inappropriate quantity explanation | Learner label “expression” and enumeration help, following [DLE](https://dle.rae.es/etc%C3%A9tera). Original Q tag, identity and count remain intact. |
| inglés, noun | Generic plural row mixed the language with another noun sense | Omit the row and explain that `los ingleses` usually means English people. [DLE](https://dle.rae.es/ingl%C3%A9s) distinguishes the senses; frozen language entry is uncountable. Specialized language-variety plurals are not prohibited. |
| personal, noun | An uncountable staff sense received an unqualified plural table | Omit that row and explain the collective singular. The frozen entry marks it uncountable; [DLE](https://dle.rae.es/personal) distinguishes collective staff from other uses. This is a conservative teaching choice, not a claim that *personales* is impossible. |

## Things deliberately retained

The existing [clubes](https://www.rae.es/dpd/club), [la juez](https://www.rae.es/dpd/juez), and [video](https://www.rae.es/dpd/video) are valid variants. They were not replaced just because alternatives exist. Existing explanations of [arte](https://www.rae.es/dpd/arte) and [radio](https://www.rae.es/dpd/radio) already qualify their gender variation adequately.

All six displayed present-indicative person/form pairs were compared with the DLE tables for [prever](https://dle.rae.es/prever), [adquirir](https://dle.rae.es/adquirir), [seguir](https://dle.rae.es/seguir), and [reír](https://dle.rae.es/re%C3%ADr). They matched and were retained. The eight other invariant-plural entries—crisis, análisis, virus and the five weekdays ending in -s—correctly follow the non-final-stress rule and remain unchanged.

Those 17 retain decisions plus ten corrections are the **27 specific entry decisions** recorded against additional references. General screening covered the remaining entries, but the report does not present them as having individual second-reference checks. Valid narrow glosses were not expanded merely because a dictionary lists other senses.

## Why the previous checks missed errors

The form map includes headwords as well as inflected forms. Membership therefore did not establish that *mes* was a plural. The old test also skipped a form equal to its headword. Separately, stripping every Unicode combining mark changed ñ to n; the failed *espanola* candidate silently became an alleged invariant adjective. Finally, lemma/POS membership does not distinguish noun senses: a plural can be real without being appropriate to the taught sense.

The builder now preserves ñ, explicitly handles the reviewed invariant plurals, and fails on an unresolved feminine candidate instead of silently declaring invariance. Tests assert actual plural/feminine outputs, sense-specific omissions, personal a, grammar-label distinctions, and the four independently referenced verb tables. Existing source-membership tests remain useful but are not described as linguistic certification.

Original headwords, IDs, order, source ranks/tags and counts are unchanged. Saved progress is unaffected. The deck remains 1,500 edited lemma/POS cards with 1,455 spellings. Corpus counts have not been independently disambiguated by intended sense, and no 90% coverage or comprehension estimate has been established.

## Validation and local preview

247 repository tests pass, including 18 focused lemma tests. `npm run check` and `git diff --check` pass. Offline notes regeneration is byte-identical. The local browser was checked for the corrected *mes* plural and all four *español* agreement rows. This content-only follow-up did not repeat the earlier full static build or audio/device checks.

Open [the español note](http://127.0.0.1:5173/lemmas/notes.html?set=7#corpes%3Aespa%C3%B1ol%3AA) and expand Word forms. Search *mes* to inspect `el mes / los meses`. These are usability checks; the learner is not responsible for certifying the Spanish.

The result is a better-supported local study draft. There is no defensible numerical error-rate estimate from this targeted review, and no claim that every remaining sense, label, example or form is error-free.
