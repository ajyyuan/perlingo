# Later-day Claude + Codex cross-check — November 5, 2026

**Current status:** all findings in this audit have a correction or a documented no-change disposition in the [resolution report](lemma-later-day-resolution.md). Content changes remain local and uncommitted; audio is deferred.

The following is the historical audit of the pre-correction snapshot at ranks 251–1500. Counts, reproductions and “pending” language below describe that snapshot. No curriculum, runtime, recordings or saved progress were changed during the audit stage itself. The original reports and snapshot have not been rewritten to imply they audited the later corrections.

## Coverage and independence

Codex read all 1,250 resolved prompts/cues/answer lists, all 291 comparison groups (319 sections), and all 424 unique base Spanish/English example pairs. Claude Opus 5.5 independently reported reading the same full snapshot in five blocks of 250. Its downloaded CSV was checked against the snapshot: exactly 1,250 unique card IDs and 291 unique group IDs, without omissions. A ledger verifies accounting, not linguistic infallibility.

Codex saved its initial findings before reading Claude's report, then challenged Claude's findings with primary-source and runtime evidence. Neither reviewer is an independent human linguist. Source checking was targeted: Claude could only retrieve RAE search extracts; Codex opened the primary pages cited below. Neither reviewer freshly verified every underlying dictionary citation or every possible synonym. Verb-guide/conjugation-row examples outside this snapshot were not re-audited.

[Claude conversation](https://claude.ai/chat/cb528a83-cc94-45c7-bbe0-b166f519cd69). Evidence is in [claude-later-audit](../data/spanish-lemmas/claude-later-audit/): immutable `input.json`, exact requests, original report and coverage CSV, Codex independent findings and follow-up triage, runtime reproductions, and provenance hashes. The original report is retained verbatim, including claims qualified below.

## Confirmed priorities

Codex's first primary-source pass demonstrated 13 missing valid answers on 11 cards. All 13 were reproduced through the actual typed grading functions; no saved progress was modified.

| Rank / headword | Missing answer(s) fitting current cue | Primary evidence opened |
|---|---|---|
| 519 meter | introducir, insertar | [DLE meter](https://dle.rae.es/meter) |
| 589 miedo | temor | [DLE temor](https://dle.rae.es/temor) |
| 682 informe | reporte | [DLE reporte](https://dle.rae.es/reporte) |
| 750 completo | entero | [DLE completo](https://dle.rae.es/completo) |
| 753 suficiente | bastante | [DLE suficiente](https://dle.rae.es/suficiente) |
| 815 similar | semejante, parecido | [DLE similar](https://dle.rae.es/similar) |
| 904 profundo | hondo | [DLE profundo](https://dle.rae.es/profundo) |
| 1123 exponer | exhibir | [DLE exhibir](https://dle.rae.es/exhibir) |
| 1192 comportamiento | conducta | [DLE comportamiento](https://dle.rae.es/comportamiento) |
| 1222 velocidad | rapidez | [DLE velocidad](https://dle.rae.es/velocidad) |
| 1491 jurídico | legal | [DEM legal](https://dem.colmex.mx/ver/legal) |

The independent candidate inventory contains 70 additional cards. Follow-up triage supports 66 as correction candidates and defers four: guardar/salvar in computing, complejo/complicado under the multiple-parts cue, actuación/interpretación under the live-show cue, and investigar/averiguar under the process cue. Six of the 66 received additional primary checks (fortaleza, respaldo, cosa, igualmente, recientemente, dorso); the others have stored-source comparison and reviewer sense judgments, not fresh primary verification. These are not 70 automatic edits, nor an exhaustive synonym list. Exact cues and proposed answers are preserved in `codex-triage.json`.

Claude additionally identified:

- **Valid spelling variants forced into correction:** periodo on 523/534, futbol on 734, vídeo on 1147, consciencia on 1227, setiembre on 1036. Actual `submitAnswer` returns an unscored accent/spelling retry for all six, rather than immediate incorrect feedback. This mitigates scoring impact but still labels correct Spanish as needing repair. Codex opened DPD entries for [período](https://www.rae.es/dpd/per%C3%ADodo), [fútbol](https://www.rae.es/dpd/f%C3%BAtbol), [video](https://www.rae.es/dpd/video), [conciencia](https://www.rae.es/dpd/conciencia), and [septiembre](https://www.rae.es/dpd/septiembre). Consciencia is valid for this awareness cue; do not extend it to every moral-conscience expression.
- **Usual** missing on común/normal/habitual (522/1079/1423), and **era** missing on época (534). Direct [DLE usual](https://dle.rae.es/usual) and [DLE era](https://dle.rae.es/era) checks support the stated senses. Merely replacing English “era” with “epoch” would not exclude Spanish era.
- **El final / la final translation:** the shared 267–269 sentence says *el final del torneo* while its English names the tournament final. [DLE final](https://dle.rae.es/final) distinguishes masculine ending from feminine decisive competition. The minimal correction can preserve Spanish and translate “the end,” though a more natural replacement sentence would require coordinated context/audio work.
- **Three citation mismatches:** later-56 cites agregar while explaining juntar; later-143 cites complejo while explaining complicado; later-card-viejo-N cites grande while explaining anciano/persona mayor. Confirmed directly in the authored source. Correct the evidence links; this does not establish that the explanations themselves are false.

## Disposition of Claude's report

| Original ID | Cross-check disposition |
|---|---|
| D-01 referir | Broad-prompt omission supported. Do not adopt its proposed mixed referir/referirse cue without construction review. Different legitimate main-example sense alone is not an error. |
| D-02 final | Confirmed translation distinction; see above. |
| D-03 asegurar | Downgraded to translation clarification / unresolved categorical grammar claim. [DPD asegurar](https://www.rae.es/dpd/asegurar) supports the assertion and pronominal constructions, but does not establish an absolute “ensure requires subjunctive” rule. Do not teach that prohibition from this report. |
| D-04 vos | [DPD voseo](https://www.rae.es/dpd/voseo) supports vos as subject and prepositional term. Current cues do not specify tuteo. Valid regional alternative or an explicit construction cue is appropriate; no need to redesign all conjugation teaching. |
| D-05 ciento | Centenar/centena are plausible noun alternatives. Cien is an apocope/numeral and must be handled separately, not automatically equated with the noun cue. Runtime currently marks cien incorrect. |
| D-06 jurídico | Confirmed independently; keep noun/adjective and lawful/relating-to-law distinctions. |
| D-07 usual / D-08 era | Supported by opened primary entries. |
| D-09 variants | Confirmed valid-form friction, with actual retry behavior documented above. |
| D-10a–u | Ordinary-alternative findings are supported at the cue level by reviewer judgment; several independently source-checked. Proposed prompt trimming does not necessarily eliminate overlap. Do not automatically apply every suggested rewrite. |
| D-11 incorporar | Evaluate adding to an existing whole on its own meaning; reciprocal acceptance on another card is not proof. Clarifying integration is reasonable; no transitive synonym expansion. |
| A-01 | Optional elicitation preference; accepting a valid sibling is intentional. No automatic rewrite. |
| A-02 | Boy/young-person cue does not clearly exclude niño. Clarify age or accept appropriate overlap; no blanket lexical prohibition. |
| A-03 | Runtime: caerse and reírse marked incorrect; escaparse gets spelling retry. These are lexical/pronominal alternatives to review, not grounds to accept arbitrary conjugated forms. |
| A-04 | Register labels merit correction after scope check. Do not replace unsupported “colloquially” with an equally unverified regional frequency claim. |
| A-05 | En el acto is ambiguous; ceremony reading is possible. Clarity improvement, not demonstrated false Spanish. |
| A-06 / A-07 | Broad-prompt candidates, with exact-sense review needed. Different example sense alone is allowed. |
| A-08 | Transitive aumentar cue conflicts with an intransitive-only teaching label; supported internal consistency issue. |
| A-09 | Numeral medio versus noun mitad: cue clarity, not automatic noun acceptance. |
| O-01 / O-02 | Mixed priorities. Reporte and entero are already primary-supported omissions above. Multiword atrás de conflicts with one-word instructions; do not add indiscriminately. Other suggestions retain their stated uncertainty. |
| O-03 / O-04 / O-06 | Optional alignment/style/context improvements; no automatic changes. |
| O-05 | Three source-link mismatches confirmed. |
| U-01 | Resolved, no change: current [DPD asumir](https://www.rae.es/dpd/asumir) explicitly recognizes assuming something true. Existing comparison already cites that entry. |
| U-02 | Stable IDs preserve earlier corrected lemmas/progress. No learner-facing correction justified; frequency provenance is a separate question. |
| U-03 / U-04 | Still unresolved regional alternatives/labels; do not present as factual errors. |
| U-05 | Resolved for the ten actual runtime inputs in `retry-reproduction.json`; not a claim about every form. |
| N-01–N-07 | Preserve the stated no-change decisions, subject to specific translation findings above. |
| N-08 | Qualified: later-22's absolute prohibition on obtener + infinitive is unsupported here and repeats an absolute removed in the first-250 audit. Prefer positive construction guidance. Other group text had no demonstrated new factual error in this pass. |

## Handoff and checks

The next implementation task should correct justified acceptance, variant feedback, explanation/evidence and translation issues together, add semantic regressions, regenerate artifacts, and recalculate audio gaps. Do not bulk-import either model's suggestions. Three Codex candidates (salvar, interpretación, averiguar) and Claude's remaining regional/construction questions remain explicitly unresolved; the follow-up below resolves complicado.

For local inspection, reload http://127.0.0.1:5173/lemmas/, search miedo, similar, profundo or jurídico, and inspect More info / Usage notes. The omissions described above remain present because this task only records the audit. The runtime diagnostic files reproduce grading without submitting browser answers or changing progress.

Audit checks: snapshot SHA-256 preserved; exact Claude card/group ledger coverage verified; 13 false rejections reproduced across 11 cards; ten variant/pronominal inputs exercised through the real retry wrapper. No broad test rerun is claimed for these evidence-only changes. Prior implementation validation remains 445/446 tests, with the known missing-audio coverage failure. No audio generation, spending, commit, push or publication occurred in this cross-check.

## Final reconciliation

The [Claude addendum](../data/spanish-lemmas/claude-later-audit/claude-addendum.md) withdraws the mixed referir/referirse cue, cien as a noun alternative, the categorical asegurar mood claim, and its endorsement of the obtener absolute. It agrees with all eleven initial Codex findings, while qualifying rapidez for measured-speed contexts. The actual cue simply says “speed”; the primary DLE supports ordinary rapidez, so Codex retains that finding.

Claude challenged thirteen other candidates as literary, specialized or less common. These are priority/register judgments, not proof of invalidity under an unrestricted cue. Keep them separate from the highest-priority omissions; do not delete their legitimate senses. Its blanket promotion of regional proposals also needs qualification: atrás de is two words, and terreno/lote depends on whether the cue selects a plot of land.

Codex opened four more DLE entries after reading the addendum:

- [Muro](https://dle.rae.es/muro) includes pared; the current “wall, especially of a house or room” prompt does not exclude it. Typical exterior usage is not an absolute restriction.
- [Comunicar](https://dle.rae.es/comunicar) includes making something known to someone. The bare infinitive task has no Spanish sentence slot imposing a direct-object frame. Retain it as a candidate for informar’s “Give someone information,” while teaching their different constructions.
- [Rellenar](https://dle.rae.es/rellenar) includes filling completely, in addition to refilling. Retain it for “fill something up.”
- [Complicado](https://dle.rae.es/complicado) explicitly has a many-pieces sense. This resolves one initial deferral in favor of a supported candidate for rank 1204. The other three deferrals remain.

Likewise, aplicación and componer currently explicitly prompt “use” and “repair.” Calling their glosses broad does not make uso/empleo or arreglar/reparar false answers. A future selected-sense redesign can narrow those prompts, but must update teaching and explanations together. No such redesign was made in this audit.
