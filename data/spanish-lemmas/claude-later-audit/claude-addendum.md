# Addendum: reconciliation with Codex and author challenges (ranks 251–1500)

**Applies to:** `perlingo_251-1500_similar-word_audit_claude.md`, which stays unchanged. This addendum supersedes the conflicting statements in that report.
**Date:** 2026-11-05. **No curriculum edits; nothing here authorizes changes.**
**Evidence labels:**
- **[you-opened]**: a primary source you report opening directly.
- **[you-runtime]**: your runtime tests of the grader.
- **[RAE-extract]**: RAE page text seen in my search results (I could not open RAE pages directly).
- **[model]**: my own judgment, with no source opened.

I did no new web verification for this addendum.

---

## 1. Confirmed corrections (status after reconciliation)

| ID | Card(s) | Status | Basis |
|---|---|---|---|
| D-01 | 505 *referir* | **Grading defect confirmed. I withdraw my proposed cue** (see §2). | Bare "to report" rejects *informar/relatar/contar/reportar* [model] |
| D-02 | 269 (ex. shared 267–268) | **Confirmed.** *el final del torneo* ≠ "the final" (*la final*). | DLE *final* [you-opened] |
| D-04 | 333 *tú*, 699 *ti* | **Confirmed unless tuteo-only is deliberate** (then state it in the cue). | DPD *vos*, *voseo* [RAE-extract] |
| D-05 | 405 *ciento* | **Narrowed:** *centenar* and *centena* only. **I withdraw *cien*.** You are right that it is the apocopated numeral or adjective, not the requested collective noun. | DLE *centenar*, *ciento* sense 3 [RAE-extract] |
| D-06 | 1491 *jurídico* | **Confirmed** (rejects *legal*). | DLE *legal* sense 2 [secondary mirror]; DEM *legal* [you-opened]; group later-165 text |
| D-07 | 522, 1079, 1423 | **Stands** (rejects Spanish *usual*). | [model] |
| D-08 | 534 *época* | **Stands, as accept *era* only.** I withdraw the "epoch; period" re-prompt, because "epoch" still invites *era*. | [model] |
| D-10 | see below | **Stands, but acceptance is now the recommended fix** in most rows (see §2). | mixed |
| **New D-12** | 329 *caer*, 909 *reír* | **Upgraded from A-03.** Your runtime shows *caerse* and *reírse* get plain **incorrect** feedback. 329's own prompt says "(intransitive, reflexive)", and 295 *morir* accepts *morirse*. Both pronominal forms are standard answers to "to fall" and "to laugh". | [you-runtime] + [model] |

### 1a. Overlap: your primary-checked findings vs mine

| Your finding | My report | Reconciled |
|---|---|---|
| 815 *similar* → *semejante, parecido* | D-10j | **Confirmed by both** |
| 1123 *exponer* → *exhibir* | D-10o | **Confirmed by both** |
| 1192 *comportamiento* → *conducta* | D-10q | **Confirmed by both** |
| 1491 *jurídico* → *legal* | D-06 | **Confirmed by both** |
| 682 *informe* → *reporte* | O-01 (optional) | **Promote to confirmed.** You are right that I was inconsistent. The cue is unrestricted, and regional usage counts under the brief. |
| 750 *completo* → *entero* | O-02 (optional) | **Promote to confirmed.** The cue "With nothing missing" fits *entero* exactly. |
| 519 *meter* → *introducir, insertar* | missed | **Agree.** Prompt "to put in, insert" is unrestricted. |
| 589 *miedo* → *temor* | missed | **Agree** (medium-low; *temor* is more formal but ordinary). |
| 753 *suficiente* → *bastante* | missed | **Agree.** Adjectival *bastante* 'que basta' fits "sufficient, enough". |
| 904 *profundo* → *hondo* | missed | **Agree.** The prompt's physical-depth sense is exactly *hondo*. |
| 1222 *velocidad* → *rapidez* | missed | **Agree, qualified.** *Rapidez* fits "speed" as quickness but less well as a measured magnitude (*límite de velocidad*). Accepting it is reasonable, but it is the weakest of your 11. |

**Consistency consequence (my reclassification):** applying the same rule as *reporte*, my other O-01 regional items with unrestricted or matching cues should be **D (policy-based)**, not optional:
- 424 *dinero* → *plata*
- 897 *habitación* → *pieza* (group later-card-pieza-N itself acknowledges the regional room sense)
- 1289 *medicina* and 1449 *medicamento* → *remedio*
- 456 *bajo* (person) → *chaparro* / *petiso*
- 889 *detrás* (+ *de*) → *atrás de*
- 1181 *terreno* → *lote*

These are [model] only, so Codex should verify them before acting.

---

## 2. Qualified, downgraded or withdrawn

- **D-03 (277 example, *aseguramos que… tiene* = "We ensure") → downgraded to A (clarity), Low–Medium.** I cannot substantiate an *obligatory* subjunctive for the 'ensure' sense, and I withdraw "normally takes the subjunctive" as a rule. What remains defensible: with the indicative, the assertive reading 'we assure/affirm that…' is the more natural parse, so "ensure" is a questionable translation. Smallest fix: "We assure you that…". Your DPD reading (affirmative *asegurar* vs *asegurarse de* 'cerciorarse') supports a clarification, not a categorical error.
- **D-01 proposed cue: withdrawn.** You are right that my cue mixed non-pronominal *referir* with *referirse a*. The grading defect remains. The author has to choose the target:
  - **(a)** If the target is non-pronominal *referir* 'to recount', the prompt should be "to recount; to relate (an event)". *contar, relatar, narrar* must then be accepted, because they fit that prompt. The pronominal example (*Se refiere a…*) would also need a transitive replacement.
  - **(b)** If the target is 'to refer to', the card is really teaching *referirse a*. That is a headword and construction decision, not a cue tweak.

  I cannot choose between (a) and (b) on linguistic grounds.
- **D-09 (valid spelling variants) → Low, friction only.** Your runtime confirms that *periodo* (523, 534), *futbol* (734), *vídeo* (1147), *consciencia* (1227), *setiembre* (1036) and *escaparse* (1278) get a score-free retry, not a penalty. The finding stays: a correct standard form is treated as a slip. But it no longer counts as a scoring error. I am not generalizing beyond the forms you tested.
- **D-10 narrowing suggestions: mostly withdrawn.** You are right that several did not exclude the synonym. Revised recommended fixes:
  - **Accept the synonym:** 527 *mostrar* ("demonstrate" still invites it, and "to prove" would add *probar*); 653 *grupo* ("ensemble" covers *grupo* musical); 534 *era*; 894 *pelea*; 1159 *además* ("likewise" would invite *igualmente*); 1219 *crimen* ("offense" alone invites *infracción*); 1484 *presente*.
  - **Narrowing still works:**
    - 465: dropping "to influence" does remove the *influir* trigger.
    - 1255: the cue "los pros y los ___s" excludes *desventaja/inconveniente*.
  - **Either fix works:** 1008. Acceptance is still preferable there, because *breve* also fits short texts.
- **D-11 (968 *incorporar*) → downgraded to A, Low.** I accept that acceptance is not reciprocal or transitive, so the group/294 argument is withdrawn. On its own cue, "Add something to an existing whole" still invites *añadir* and *agregar*. The issue is the cue's wording. Smallest fix: "Make something part of a larger whole". The reverse case is also cue-driven: your 905 *integrar* → *incorporar* fits 905's own cue, "Bring parts into a unified whole". DLE *incorporar* 1 is 'agregar, unir algo a otra cosa para que haga un todo con ella' [model recall; not opened]. **I agree with 905.**
- **A-03 escaparse:** retry only (friction). The other two items moved to D-12.

---

## 3. Your additional candidates (§6): my judgments

I have **no outright false positives** to report: every form you list is real Spanish with a sense that touches the prompt. But several fail the brief's "obvious, common alternative" bar, or have a sense or construction mismatch. All my judgments here are [model] unless you opened the page.

**Agree (common, and fits the prompt or cue):**
- 307 *fortaleza*
- 313 *autoridad* (the cue says "Authority to act")
- 446 *convenio, pacto*
- 477 *padecer*
- 479 *descender*
- 486 *ascender*
- 533 *integrante*
- 535 *porvenir*
- 545 *respaldo*
- 550 *vistazo* (for "glance")
- 569 *decenio*
- 611 *cosa* (the cue says "A physical thing")
- 629 *triunfo*
- 692 *tapar*
- 724 *comportarse* (for "behave")
- 740 *cirugía* (common in the Americas for 'an operation')
- 763 *alternativa*
- 771 *asistencia*
- 795 *juntar*
- 805 *gozar*
- 880 *igualmente* (the cue says "In the same way")
- 902 *vecindario*
- 905 *incorporar*
- 928 *listado*
- 933 *apropiado*
- 948 *despacho*
- 1039 *representante* (I had noted this in my working notes but left it out of the report, so it overlaps with mine)
- 1044 *indumentaria*; I would add *prenda* for "garment"
- 1084 *pelaje* for "fur", alongside my *cabello*
- 1099 *exactamente*
- 1148 *convertir*
- 1160 *recientemente*
- 1171 *discusión*
- 1213 *ofrecimiento*
- 1220 *progreso, adelanto*
- 1278 *huir*
- 1384 *sabroso, adinerado*
- 1401 *transmitir*
- 1451 *valorar*
- 1467 *comercio*, and *carpa* (Am.) for "tent"
- 1470 *encomendar*

**Genuine overlap with my report:**
- 417 *carencia* = D-10a
- 421 = D-10b
- 521 = D-10d
- 894 = D-10l
- 1008 = D-10m
- 1084 = D-10n
- 1219 = D-10r
- 1095 *expandir*, 1204 *complicado* and 1331 *insertar* = A-07

**Qualified: valid but low-frequency, literary or specialized** (in my view these do not meet "obvious common alternative"; optional at most):
- 275 *pesquisa* (*indagación* is acceptable)
- 376 *determinación* (mainly in *tomar una determinación*)
- 561 *proposición*
- 713 *lecho* (literary)
- 734 *balompié*
- 802 *parecer* (n.)
- 828 *pormenor*
- 870 *convidar*
- 971 *perito* (legal or technical expert)
- 1169 *dorso*: the page you opened supports it, but the word is uncommon for anatomy
- 1256 *rellenar* (the 'refill' and 'fill in a form' senses dominate)
- 1285 *aseo* (Spain-specific; valid regionally, so policy-eligible)
- 1368 *arribo* (formal, American)

**Sense or construction caution:**
- 484 *comunicar*: it takes the information as its object and the person with *a*, whereas the cue says "Give someone information". This is the group later-60 distinction. I would defer, or prefer *avisar/notificar*.
- 1046 *muro*: more often an exterior or free-standing wall, and the prompt favours "of a house or room". Defer.
- 754 *aplicación* → *uso/empleo* and 1342 *componer* → *arreglar/reparar*: the triggers come from over-broad Wiktionary-style glosses. Trimming the prompt is the better fix than accepting the synonyms (same class as my A-07).

**Your four deferrals:**
- 913 *salvar* (saving a file): I lean **no change**. It is a regional software calque, and the group already notes the variation.
- 1204 *complicado*: I lean **accept**. DLE *complicado* has a 'compuesto de gran número de piezas' sense, which matches "made of multiple parts" [model recall; not opened].
- 1244 *interpretación*: I lean **no change**. It is the rendition, not the show; *función* and *espectáculo* would be stronger candidates.
- 1421 *averiguar*: still **defer**. It is result-oriented ('find out'), while the cue says "Seek information about the cause".

---

## 4. No-change decisions (updated)

- **U-01 resolved: keep the 402 *asumir* acceptance.** You opened the current DPD *asumir* entry, which recognizes 'dar por sentado o por cierto'. The group's DPD link stands. The DLE's silence on this sense is not a reason to change it.
- **U-02 resolved: no learner-facing change.** Stable IDs are deliberate after the lemma corrections.
- **N-08 revisited: I withdraw my endorsement of the group later-22 clause** "obtener does not [take an infinitive directly]". I endorsed it without a source, and an absolute negative is overbroad. **Note:** this snapshot still contains that absolute wording. If it was removed after the first-250 audit, this may be a regression worth checking. Suggested positive phrasing: "Conseguir and lograr commonly take an infinitive directly to mean 'manage to'; obtener normally takes a noun object (*obtener un resultado*)."
- **later-125 *alma* / *el*:** agreed, this is a clarity issue only. The shorthand "takes el in the singular" is accurate, but could say "takes *el* before stressed *a-*".
- **N-01 (*escuchar*/*oír*), N-02 to N-06:** unchanged.

---

## 5. Limits

- This is not a new exhaustive pass. I re-read only the cards and the group named in your message, from the same snapshot.
- I accepted your directly opened sources and runtime results as reported. I have not reproduced them.
- I still could not open RAE pages directly, and the judgments in §3 are [model].
- The promotions of my O-01 regional items (§1a) follow from applying your *reporte* reasoning consistently. They are unverified, and Codex should check each one before acting.
