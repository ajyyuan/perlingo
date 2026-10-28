# First-set word-note evidence

Local draft, October 25, 2026. Fifty notes cover exactly the first 50 **card IDs**, including distinct relative/conjunction que. They add teaching explanations without altering deck order, counts, headwords or ratings. Examples, translations and explanatory prose are authored for this interface, not quoted corpus sentences. This is scoped source comparison, not independent linguistic certification or an exhaustive dictionary.

## References checked

The frozen [dictionary extract](../data/spanish-lemmas/dictionary-extract.json), from the already credited Doozan/Wiktionary revision `b8ed076b4faea26a0985ee46ca736771c2e62dc4`, supplies senses and usage for the first-set headwords other than a. Each note links to the corresponding English Wiktionary Spanish entry. Its POS distinctions were checked when selecting examples: notably más modifies an adjective here, como is causal, que has separate relative/conjunction examples, and uno is numeral. The online a page returned an English-only extract, so it was not treated as Spanish evidence.

Additional primary references read on October 25:

| Reference | Scope used |
| --- | --- |
| [RAE/ASALE DPD: a](https://www.rae.es/dpd/a) | Personal a, including named people as direct objects; the de/el dictionary entries also document the al/del contractions. |
| [RAE/ASALE DPD: unstressed personal pronouns](https://www.rae.es/dpd/pronombres%20personales%20%C3%A1tonos) | Object/reflexive roles; le/les → se before another object pronoun; neuter lo. |
| [RAE/ASALE DPD: haber](https://www.rae.es/dpd/haber) | Impersonal existence versus auxiliary usage; possession uses tener in current ordinary Spanish. |
| [RAE/ASALE DPD: ser](https://www.rae.es/dpd/ser), [estar](https://www.rae.es/dpd/estar) | Origin/description versus state; frozen ser entry also explains location and why permanence alone is insufficient. |
| [RAE/ASALE DPD: y, section y²](https://www.rae.es/dpd/y) | y → e before /i/, with exceptions; sound rather than spelling. |
| [RAE/ASALE DPD: o, section o²](https://www.rae.es/dpd/o) | Alternatives, o → u before /o/, no written accent. |

The frozen dictionary's entre entry supports tú/yo in the ordinary “between” construction and cautions against generalizing to every expression with entre. Its el/un entries support the stressed-a exception without changing the noun's gender. The possessive and pronoun entries distinguish owner, possessed noun, subject and object. Explanations intentionally present one contextual use at a time, with alternatives in More.

## Inflections

[notes-form-evidence.json](../data/spanish-lemmas/notes-form-evidence.json) records 60 present-indicative form-to-lemma matches for ten verbs against the frozen `es_allforms.csv`, with source SHA-256. This verifies membership, not the person labels; those were manually checked while authoring. It does not certify full paradigms or every word in the examples. The haber table is explicitly auxiliary (he/has/ha/hemos/habéis/han); impersonal hay is taught in the example. Tables include tú and vosotros, and explain ustedes; voseo paradigms are not supplied.

## Validation and limits

`tests/first-set-notes.test.js` checks exact first-set identity/order, explained chunks, original-text reconstruction, punctuation outside buttons, important contrast regressions, all table rows against evidence, and shortcut ownership. The pilot and session tests remain applicable. Current browser checks cover Notes & examples, popover → dialog → Escape, no grading while help is open, typed/choice grading, personal-note persistence, and navigation cleanup.

The first-set prose and examples remain a local review draft. No claim is made that 50 examples cover every sense or that 1,500 cards yield a measured text-coverage percentage. Attribution and licensing follow the [existing deck sources](../lemmas/sources.html); source-derived teaching adaptations retain CC BY-SA 4.0.

## Full lexical dataset expansion — October 25

The lexical build covers all 1,500 IDs. At its October 25 checkpoint, 53 entries had authored examples. The October 26 context expansion now supplies sentence examples to all 1,500 entries, preserving those original examples. The new source scope and checks are recorded in [lemma-context-sources.md](lemma-context-sources.md); no exhaustive sense or inflection mastery is claimed.

The entire displayed gloss list was read. `full-notes-gloss-review.json` records 104 changes checked against the frozen dictionary senses, including several misleadingly narrow first-sense extractions. `notes-usage.json` adds selected construction and contrast notes from the same entries. The dataset does not claim to cover every sense.

`notes-inflection-evidence.json` records 3,381 exact lemma/POS/form matches from the pinned allforms CSV. Present forms are proposed by ordinary conjugation patterns or explicit irregular paradigms and accepted only on an exact source match. All 369 resulting verb tables were read; ocurrir/suceder/consistir are restricted to third-person forms for the taught meanings. This map alone does not label tense/person: the rules, authored exceptions and review supply those labels. Nominal/adjectival plurals use ordinary morphology plus accent exceptions, likewise gated by same-POS matches. Three missing noun plurals are omitted, not guessed. The build report lists them.

Additional references checked: [RAE plural](https://www.rae.es/dpd/plural), [RAE género](https://www.rae.es/dpd/g%C3%A9nero), [RAE el](https://www.rae.es/dpd/el). These support the grammar rules, not each generated lexical item independently. Gender metadata comes from matching noun sections, with explicit sense-specific choices for multi-gender entries. The source mapping omitted bueno’s agreement forms; its [Spanish headword line, pinned revision](https://en.wiktionary.org/w/index.php?title=bueno&oldid=93385478#Spanish) explicitly lists buena/buenos/buenas. This exception is recorded in `notes-manual-evidence.json`.

`tests/full-lemma-notes.test.js` validates coverage, example-layer counts, concept namespace isolation, every non-headword generated form against source/manual evidence, important gender/verb regressions, audit/deck consistency, and deterministic offline regeneration. User feedback is for usability; responsibility for source checks and correction remains with authoring. This is not independent certification, exhaustive semantic annotation or a coverage measurement.

## Separately recorded second pass

See [the second-pass report](lemma-notes-second-pass.md) and [field-level evidence](../data/spanish-lemmas/second-pass-audit.json). Ten entries changed, while 1,490 stayed identical. The second pass found real errors missed by membership checks, including los mes/los gas and the feminine of español. It adds DLE/DPD comparisons for specific decisions, including correct variants retained unchanged; it does not retroactively turn the first pass into independent validation. The 3,381 mapping matches remain membership evidence only.

## Course-wide recheck — 27 October 2026

See [the complete review and its limits](lemma-course-audit-2026-10-27.md). The later pass corrects the don title table, one shared English translation and 41 contextual word-hover hints. The selected deck and all accepted answers remain unchanged. The current generated form evidence has 3,380 matches after removing the gift-sense plural from the don title card.

## Neuter esto (local correction)

On October 27, 2026, checked the omission against [Universidad Complutense de Madrid’s demonstrative table](https://www.ucm.es/plataformaele/determinativos): esto is the neuter member of the este family and stands alone. The existing authored este note explained this but omitted esto from its forms. Added a “neuter (standalone)” row, which also enables the existing sentence-to-card lookup. This corrects the authored overlay in `lemmas/first-set-notes.js`; generated lexical notes are supplemented by that overlay at runtime. No separate card or neuter plural is added. The sentence “Este libro es bueno” still requires Este, not esto.

Regression coverage checks the rendered note data, lookup of capitalized Esto, card link, and unchanged contextual accepted answer. Local preview: open `/lemmas/notes.html#corpes%3Aeste%3AD` and inspect the forms; on the entre card’s “Esto es entre tú y yo” example, open Esto’s quick meaning and follow “Open card · este.” Pending user review; not published.

### Related-form follow-up

The October 27 follow-up covers all four demonstrative cards (`este`, `ese`, `aquel`, `tal`) and all four possessive cards (`mío`, `suyo`, `tuyo`, `nuestro`). Added eso to the authored ese table; supplied generated tables for all eight families, including aquello, the agreeing aquel forms, tal/tales, tu/tus/tuyo/tuya/tuyos/tuyas, and nuestro/nuestra/nuestros/nuestras. Existing authored tables remain the runtime overlay for the first set. Explicit `forms` in `notes-usage.json` now survive the offline notes build. Source comparisons and exact generated paradigms are recorded in `notes-manual-evidence.json` under `functionWordReview`.

The card lookup previously split slash-separated variants but silently skipped middle-dot groups. It now handles both separators, restoring links for the already taught long mío/suyo forms and todo/otro agreement forms. It still rejects arbitrary multiword phrases and preserves accents and ambiguous card choices. No headwords, ordering, progress identities or accepted answers changed. That initial pass was scoped to demonstratives/possessives and grouped-form lookup; the remaining function-word pass is recorded below.

Preview ese and aquel by their note-page hashes and check the standalone neuter rows. On the ese example, open mío’s quick meaning and its card; inspect tuyo and nuestro for the added tables. Tests cover all eight families, uppercase lookup, accent distinctions, grouped forms, no invented neuter plurals and contextual answer restrictions. These local changes await user review and are not published.

## Remaining function-word audit

Local follow-up, October 27, 2026: reviewed all **61** current entries tagged L, H, W, Q or M in the source, including the `etcétera` expression exception. [The per-card audit](../data/spanish-lemmas/function-word-audit.json) records every added or retained table and why. Thirty cards needed explicit tables. This checks common agreement, shortened forms and con combinations for the senses taught; it does not claim every dialectal, archaic, derived, number-name noun or verb-plus-clitic form.

- Personal forms: lo/la/los/las (plus neuter lo), le/les, él/ella/ellos/ellas/ello, usted/ustedes, nosotros/nosotras, mí/conmigo, ti/contigo and sí/consigo. Existing subject/object/prepositional cards remain distinct. Ello has restricted use; consigo is reflexive. Vos and vosotros/vosotras are not added as new course cards or silently treated as gender variants of tú.
- Relative/question forms: quien/quienes, quién/quiénes, cual/cuales with their articles (including lo cual), cuál/cuáles, cuyo agreement and cuánto agreement. Accents remain significant.
- Quantifiers: missing gender/number rows, algún/ningún, and cualquier/cualesquiera/cualesquier. Ninguno plurals are restricted; cualquiera plurals are formal and shortened cualesquier is rare. Generic uno/una stays singular; indefinite unos/unas has other uses, with partitive restrictions explained. Invariant cards retain no artificial table.
- Numerals: agreement for primero, segundo, tercero, cuarto and medio, plus primer/tercer. Uno/un/una was already present. Cardinal counting forms two through ten stay unchanged; noun plurals such as doses are outside these counting senses.

Sources read: [UCM determinatives](https://www.ucm.es/plataformaele/determinativos), [UOC pronoun tables](https://www.uoc.edu/es/servicios/lengua-estilo/criterios/gramatica/pronombres), [RAE stressed pronouns](https://www.rae.es/dpd/pronombres%20personales%20t%C3%B3nicos), and targeted RAE entries for [uno](https://www.rae.es/dpd/uno), [alguno](https://www.rae.es/dpd/alguno), [ninguno](https://www.rae.es/dpd/ninguno), [cualquiera](https://www.rae.es/dpd/cualquiera), [primero](https://www.rae.es/dpd/primero), [tercero](https://www.rae.es/dpd/tercero), [medio](https://www.rae.es/dpd/medio) and [sí](https://www.rae.es/dpd/s%C3%AD). The frozen dictionary also supplies explicit pronoun/tanto metadata and adjective metadata for mismo/medio. This is source comparison, not independent certification.

The builder reads the explicit tables from `notes-usage.json`; lo, le and él also update their first-set authored overlays. Sentence examples, contextual accepted answers, deck identities, ordering and learner progress remain unchanged. Shared article prefixes are removed before splitting form variants, so “los / las jóvenes” links jóvenes to joven but never los to joven. Actual article/object ambiguity is retained: los links to both el and lo. Consigo retains links to both sí and conseguir. Arbitrary phrase words are still not indexed.

Regression checks cover the entire 61-card inventory against runtime forms, uppercase lookup, exact expected links, accent distinctions, restricted/invariant senses, shared-article parsing, genuine ambiguity and contextual-answer rejection. Reproducible notes generation is also checked.

Local preview: open `/lemmas/notes.html#corpes%3Aninguno%3AQ`, expand **Word forms** and **More about this word**, and check the restricted plural labels. Open `/lemmas/notes.html#corpes%3Aprimero%3AM`, focus **algunos** in its example and follow **Open card · alguno**; inspect the algún row. On the le card, check les; on the él card, check ella/ellos/ellas/ello. Pending user review; not published.

The full rebuild also exposed newly ambiguous lookup candidates in two existing sentences. Explicit hover glosses now keep **ciertas** as “certain/some” before familias and **media** as “middle” in clase media, across all three exercises sharing each sentence. The audit records this comparison; regression tests cover all six occurrences. Rebuilt context data and source hashes also carry the earlier tal grammar cue. Sentences and accepted answers are unchanged.

Validation: all 339 tests and syntax/content checks pass. Browser verification confirmed the restricted ninguno rows and explanation, and followed the ningún quick-meaning link into the course-card preview. The audit retains both the old and new context-file hashes plus a fingerprint proving all 1,500 assessment identities, targets, answer lists, sentence texts and translations are unchanged.

## Noun and adjective form audit

Local follow-up, October 27, 2026. Screened all **752 nouns and 197 adjectives** against their displayed tables, frozen headword metadata, previously omitted candidates and card lookup. [The audit](../data/spanish-lemmas/noun-adjective-audit.json) records the 949-entry metadata inventory and **63 expanded tables**. This is a systematic screen plus targeted source comparison, not independent verification of every dictionary sense or exhaustive coverage of diminutives, superlatives and regional/archaic variants.

Added ordinary feminine counterparts for the explicitly selected person/animal nouns, including niña, hija, profesora, médica, actriz, presidenta, jueza, reina and doña, with plural forms where appropriate. Valid alternatives include la juez/la jueza, la cliente/la clienta, la líder/la lideresa and la poeta/la poetisa. Their notes explain distinctions and regional usage. Actor uses actriz for the performer sense, not legal actora. Lexically distinct existing cards such as padre/madre and mamá/papá remain separate. Mano retains feminine gender; persona and personaje retain fixed grammatical gender. No unrelated feminine sense is inferred for tipo, cargo or rato.

Added buen, mal and gran with their placement restrictions. Mejor/peor and other existing comparative headwords remain separate; no automatic superlative bank was added. Club already had clubes; added the equally valid plural clubs. Kept caracteres (not carácteres), regímenes and invariant plurals such as crisis and lunes. The six sense-scoped singular exclusions now explicitly include fútbol, pasado, izquierda and música alongside inglés and personal. Música's authored overlay continues to teach music without a countable-forms table. Don gains doña as a title, not dones from the gift/talent sense.

Sources: the frozen dictionary's explicit feminine and apocopation metadata; [RAE gender](https://www.rae.es/dpd/g%C3%A9nero) and [plural rules](https://www.rae.es/dpd/plural); targeted DPD entries for [actor](https://www.rae.es/dpd/actor), [presidente](https://www.rae.es/dpd/presidente), [jefe](https://www.rae.es/dpd/jefe), [juez](https://www.rae.es/dpd/juez), [cliente](https://www.rae.es/dpd/cliente), [líder](https://www.rae.es/dpd/l%C3%ADder), [poeta](https://www.rae.es/dpd/poeta), [club](https://www.rae.es/dpd/club), [bueno](https://www.rae.es/dpd/bueno), [malo](https://www.rae.es/dpd/malo), [grande](https://www.rae.es/dpd/grande), and [DLE muerto/muerta](https://dle.rae.es/muerto). Feminine plurals are derived using the cited plural rules, not claimed to be present in the old allforms subset. RAE DPD had no dirigente entry and the secretario request failed; those are not counted as successful secondary checks. The frozen dictionary supplies secretario’s feminine metadata; the later dirigente review below narrows its table.

Explicit tables remain in `notes-usage.json`, with additional same-lemma/POS evidence in `notes-manual-evidence.json`. The context builder and card lookup now share `cardFormWords`, so slash/middle-dot variants and shared article prefixes are handled consistently. Lookup normalizes Unicode before tokenizing words, including decomposed accents. Genuine noun/adjective ambiguities remain selectable. The three exercises using investigación científica explicitly retain the adjective gloss “scientific”; newly recognized feminine scientist forms do not override the sentence meaning.

Tests cover all 949 runtime tables and their links, each expanded table, irregular feminine forms, accent distinctions, variant parsing without article leakage, mass-sense exclusions, genuine ambiguity and contextual scientific. The audit records a hash chain from the previous function-word pass and an unchanged assessment fingerprint: all 1,500 sentence texts, translations, targets, accepted answers and identities are preserved. Course order, learner progress and pronunciation preferences are unchanged.

Local preview: open `/lemmas/notes.html#corpes%3Aactor%3AN`, expand **Word forms**, and check actriz/actrices. On the juez card, inspect both feminine alternatives. On bueno, malo and grande, check buen/mal/gran and their explanations. On the bueno example (“Esa mujer es ahora una buena amiga”), focus buena and follow **Open card · bueno** to verify that the opened course card includes the new buen row. Pending user review; not published.

Validation: all 344 tests, syntax/content checks and whitespace checks pass. Browser verification confirmed actor’s actriz/actrices table and followed buena’s quick-meaning link into the bueno course card, where the buen row is present.

Noun-form review follow-up: miembro now explains that both el miembro and la miembro can refer to a woman ([RAE DPD](https://www.rae.es/dpd/miembro)). Dirigente retains la dirigente/las dirigentes; the metadata-only dirigenta/dirigentas alternatives are deferred pending stronger evidence for their usage, not declared incorrect. The learner note uses plain grammatical guidance, and regression checks cover these restrictions. This is targeted source comparison, not blanket linguistic certification.

## Deep verification of the forms changes

At the user's request, a second research pass reviewed the complete uncommitted forms/card-link diff against primary linguistic sources. Two research subagents independently checked the function-word paradigms and ordinary noun pairs; the main review checked irregular nouns, adjective shortening, changed grammatical help, contextual glosses and production code. [The source map](../data/spanish-lemmas/forms-deep-review.json) records coverage, decisions and failed lookups. This is corroboration of the changed content, not a new independent certification of every unchanged course sense.

Retained the source-supported tables. Dirigenta/dirigentas remain deferred, preserving the original common-gender dirigente/dirigentes forms; no claim is made that the deferred alternatives are incorrect. Miembro's short tip now matches its explanation: masculine el miembro can refer to any gender, and la miembro is also valid for a woman ([RAE miembro](https://www.rae.es/dpd/miembro)). Bueno's explanation now includes the de construction and optional shortening when coordinated ([RAE bueno](https://www.rae.es/dpd/bueno)). Español's short tip distinguishes the language from a Spanish person. Izquierda's singular table is scoped to the taught expression; the note acknowledges nonpolitical plural expressions such as a izquierdas ([DLE izquierdo](https://dle.rae.es/izquierdo)). The pre-existing sí tip now allows a third-person antecedent elsewhere in the same sentence, not only its subject ([RAE sí](https://www.rae.es/dpd/sí)).

The earlier failed secretario lookup is not evidence, but a successful [El Colegio de México entry](https://dem.colmex.mx/ver/secretario) now directly corroborates secretaria in the clerical sense. Original singular-only runtime behavior for fútbol, pasado and izquierda is preserved. Música's generated data remains aligned with its pre-existing uncountable authored overlay; this does not deny countable musical varieties or the distinct musician sense.

The three contextual hover meanings (ciertas familias, clase media, investigación científica) were checked in their sentences against DLE senses. All 1,500 assessment records, including sentence chunks, texts, translations, targets and answer lists, still match Git HEAD. Regression checks cover the clarified notes as well as form-to-card mappings; software tests are not presented as linguistic evidence.

Local review: open miembro and expand **More about this word**; inspect bueno for the qualified shortening rule, español for the language/person distinction, izquierda for the fixed-expression qualification, and sí for its revised antecedent tip. These remain local changes awaiting user review; no commit or publication.

Deep-review validation: all 344 tests, syntax/content checks and whitespace checks pass. Local browser verification confirmed miembro’s revised tip and expanded explanation. The evidence record distinguishes direct source retrieval, rule-based plural derivation and unsuccessful requests.

Publication completed October 27, 2026: Sites version **30**, deployment `appgdep_6ae15f9b6590819182b59c4885b6496f`, succeeded. Application commit `a1fb8f61c` maps to Sites source `ffefc2ec7dd73a2c7ca6e397b9cafe6ba9fdd53f`. This release includes the reviewed demonstrative/possessive, function-word and noun/adjective form tables, card-link repairs, contextual gloss safeguards and qualified usage notes. All 344 tests, content checks and the hosted build passed. Public access, perlingo.app and environment revision 2 are retained. This supersedes the earlier local-only and pending-review status of these changes; source verification remains scoped, not a claim of absolute linguistic certainty.
