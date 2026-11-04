# Day 1 external audit reconciliation

> Current status: implemented locally for testing; not committed or published. [Implementation, resolved pues evidence, teaching alignment and testing](lemma-day1-local-preview.md). Earlier draft/provisional statements below are historical.


Draft only. The supplied Claude report was checked against the current JSON and primary evidence. Seven highlighted missing-synonym rows are corrected, the cuando context is replaced, and the saber sense-selection omission is recorded. The pues/fronting issue is provisionally revised but remains explicitly source-unresolved: NGLE was read directly; the cited Miche PDF could not be retrieved. This is not a claim that all ten findings are independently confirmed.

The report correctly identifies incomplete acceptance lists. Its “no change needed” blocks are not a proof that every other synonym is excluded; for example, DLE conjunto also specifically denotes a sports team, so #190 now accepts it.

Some suggested shortcuts are not sound: deleting an English gloss alone does not eliminate Spanish overlap; restricting grupo to people does not eliminate conjunto; desde…a is valid; sentir frío is attested in the Diccionario del español de México. Different examples for genuine synonyms do not measure distinct lemma recall.

All changes remain proposals. The single-word instruction now explicitly yields to the form required by a Spanish blank. Papá/mamá and regional juego are accepted where the prompt contains no restriction. The sense-alignment metadata now covers every row, not just a partial warning list.

| # / target | Decision | Evidence |
| --- | --- | --- |
| 3 · y | State a concrete form/context so no hidden headword-versus-variant policy is needed. | [y](https://www.rae.es/dpd/y) |
| 6 · un | State a concrete form/context so no hidden headword-versus-variant policy is needed. | [uno](https://www.rae.es/dpd/uno) |
| 18 · como | Remove pues from this explicitly fronted causal frame as a provisional editorial correction. NGLE supports the causal-structure distinction but does not directly state the absolute prohibition alleged in the report; the cited Miche PDF could not be retrieved. Do not mark this issue fully source-resolved. | [las-causales-explicativas](https://www.rae.es/gramática/sintaxis/las-causales-explicativas) |
| 25 · hacer | Use a daily task example rather than the same abstract prompt as realizar; retain reviewed task-performing alternatives because the cue still permits them. | [ejecutar](https://dle.rae.es/ejecutar) |
| 29 · o | State a concrete form/context so no hidden headword-versus-variant policy is needed. | [o](https://www.rae.es/dpd/o) |
| 32 · otro | Use a concrete additional-item frame rather than the ambiguous different one. | Existing row evidence / editorial choice |
| 40 · sobre | Already distinguishes subject-classifying de from topic sobre; retain both. | [dentro](https://www.rae.es/dpd/dentro) |
| 41 · cuando | Replace the uncommon expressed-antecedent cuando construction. Use an event-time clause rather than the day when; choose a punctual example so mientras is not another invited answer. | [adverbio-relativo](https://www.rae.es/gtg/adverbio-relativo) |
| 43 · también | Retain además for whole-sentence translation with appropriate placement; do not force substitution at the English word position. | [y](https://dle.rae.es/y) · [tambi%C3%A9n](https://dle.rae.es/tambi%C3%A9n) · [adem%C3%A1s](https://dle.rae.es/adem%C3%A1s) |
| 46 · uno | State a concrete form/context so no hidden headword-versus-variant policy is needed. | [uno](https://www.rae.es/dpd/uno) |
| 49 · muy | Retain bien. Do not add the proposed Spain/Latin-America frequency claim from a secondary teaching site without primary usage evidence. | [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [mucho](https://dle.rae.es/mucho) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 50 · desde | Use a complete since-Monday frame to select desde. Do not teach exclusive de+a / desde+hasta pairing: desde+a is also standard. | [correlaciones-de-preposiciones](https://www.rae.es/gramática/sintaxis/correlaciones-de-preposiciones) |
| 55 · mismo | Remove identical because the context tests identity of the individual, not resemblance. | Existing row evidence / editorial choice |
| 61 · querer | Accept desear for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [desear](https://dle.rae.es/desear) |
| 63 · solo | Accept solamente, únicamente for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [solo](https://dle.rae.es/solo) |
| 70 · país | Accept nación for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [naci%C3%B3n](https://dle.rae.es/naci%C3%B3n) |
| 78 · persona | Retain humano and individuo for the current individual-human noun prompt; existing note already distinguishes their emphasis. Do not invent a blanket formal/pejorative label. | [persona](https://dle.rae.es/persona) · [mujer](https://dle.rae.es/mujer) · [hombre](https://dle.rae.es/hombre) · [ni%C3%B1o](https://dle.rae.es/ni%C3%B1o) · [hijo](https://dle.rae.es/hijo) · [gente](https://dle.rae.es/gente) · [humano](https://dle.rae.es/humano) · [gente](https://www.rae.es/dpd/gente) · [individuo](https://dle.rae.es/individuo) |
| 84 · después | Vary the example for usefulness, but retain reciprocal acceptance. Different examples do not prove which synonymous lemma was recalled. | Existing row evidence / editorial choice |
| 90 · último | Accept final for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [final](https://dle.rae.es/final) |
| 91 · hablar | Select speaking a language to distinguish hablar from conversar; this is a meaningful sense selection to teach first. | [conversar](https://dle.rae.es/conversar) |
| 100 · pensar | Retain broad reflection on a problem and the reviewed alternatives. Contrast with considering an option in teaching, without pretending the meanings are exclusive. | [pensar](https://dle.rae.es/pensar) · [creer](https://dle.rae.es/creer) · [sentir](https://dle.rae.es/sentir) · [reflexionar](https://dle.rae.es/reflexionar) |
| 101 · forma | Remove outline, which unnecessarily invites contour/silhouette senses; keep figura for the physical-shape overlap. | Existing row evidence / editorial choice |
| 102 · casa | Accept hogar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [hogar](https://dle.rae.es/hogar) |
| 113 · cosa | Select the unspecified-thing use rather than explicitly listing object and matter. | Existing row evidence / editorial choice |
| 120 · niño | Accept chico for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [chico](https://dle.rae.es/chico) |
| 125 · llamar | Accept telefonear for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [telefonear](https://dle.rae.es/telefonear) |
| 128 · sentir | Keep the original sensation example: sentir frío is valid and appears explicitly in the Diccionario del español de México. Tener frío is also idiomatic; it does not invalidate sentir frío. | [sentir](https://dem.colmex.mx/ver/sentir) |
| 136 · grupo | Accept conjunto for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [conjunto](https://dle.rae.es/conjunto) |
| 137 · realizar | Keep an action/task prompt and add ejecutar; it fits carrying out the action just as the already accepted efectuar does. | [ejecutar](https://dle.rae.es/ejecutar) |
| 155 · luego | Vary the example for usefulness, but retain reciprocal acceptance. Different examples do not prove which synonymous lemma was recalled. | Existing row evidence / editorial choice |
| 156 · padre | Accept papá for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [pap%C3%A1](https://dle.rae.es/pap%C3%A1) |
| 164 · esperar | Accept aguardar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [aguardar](https://dle.rae.es/aguardar) |
| 168 · nunca | Accept jamás for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [jam%C3%A1s](https://dle.rae.es/jam%C3%A1s) |
| 170 · además | Use a further-point example to foreground además. Keep también: adding another true property can still be expressed with it. | Existing row evidence / editorial choice |
| 177 · partido | Accept juego for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [juego](https://dem.colmex.mx/ver/juego) |
| 183 · empezar | Vary the example for usefulness, but retain reciprocal acceptance. Different examples do not prove which synonymous lemma was recalled. | Existing row evidence / editorial choice |
| 187 · varios | Accept diversos for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [diverso](https://dle.rae.es/diverso) |
| 188 · explicar | Accept aclarar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [aclarar](https://dle.rae.es/aclarar) |
| 190 · equipo | Accept conjunto for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [conjunto](https://dle.rae.es/conjunto) |
| 194 · estudio | Accept análisis for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [an%C3%A1lisis](https://dle.rae.es/an%C3%A1lisis) |
| 199 · uno | Keep uno for the expressly requested indefinite pronoun; Nunca se sabe is a valid alternative sentence construction, not the same pronoun. | [uno](https://dle.rae.es/uno) · [solo](https://dle.rae.es/solo) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) · [uno](https://www.rae.es/dpd/uno) |
| 200 · empresa | Accept compañía for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [compa%C3%B1%C3%ADa](https://dle.rae.es/compa%C3%B1%C3%ADa) |
| 202 · recordar | Already accepts acordarse, not bare acordar, and teaches de. No change needed. | [saber](https://dle.rae.es/saber) · [rememorar](https://dle.rae.es/rememorar) · [recordar](https://dle.rae.es/recordar) · [acordar](https://dle.rae.es/acordar) |
| 204 · considerar | Accept contemplar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [contemplar](https://dle.rae.es/contemplar) |
| 205 · mantener | Remove preserve as the primary English gloss; specify maintaining an existing state. Do not turn the distinction from protective preservar into a universal exclusion. | [preservar](https://dle.rae.es/preservar) |
| 207 · nivel | Accept grado for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [grado](https://dle.rae.es/grado) |
| 216 · general | Accept global for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [global](https://dle.rae.es/global) |
| 220 · madre | Accept mamá for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [mam%C3%A1](https://dle.rae.es/mam%C3%A1) |
| 227 · comenzar | Vary the example for usefulness, but retain reciprocal acceptance. Different examples do not prove which synonymous lemma was recalled. | Existing row evidence / editorial choice |
| 230 · desarrollo | Replace growth with gradual unfolding to foreground development. This is a selected meaning, not a claim that desarrollo and crecimiento never overlap. | [crecimiento](https://dle.rae.es/crecimiento) |
| 234 · situación | Accept circunstancia for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [circunstancia](https://dle.rae.es/circunstancia) |
| 239 · mostrar | Accept enseñar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [ense%C3%B1ar](https://dle.rae.es/ense%C3%B1ar) |

## Validation

All 250 IDs/ranks and draft tables checked for consistency; all newly proposed alternatives have rationale and references. Source checking is scoped to the claims described above, not a certification of exhaustive answer coverage. Application code, grading and tests are unchanged.
