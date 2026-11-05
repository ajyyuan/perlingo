# Perlingo — Independent audit of similar-word teaching and typed-answer acceptance, ranks 251–1500

**Auditor:** Claude (Opus 5.5). This is the Claude half of a Claude + Codex cross-check.
**Snapshot audited:** the attached resolved snapshot dated 2026-11-05 (`e7ec5e90-input.json`): 1,250 cards and 291 comparison groups.
**Audit date:** 2026-11-05
**Status:** These are findings for review. Nothing in this report authorizes a curriculum change. I did not modify the curriculum. Every proposed correction is the smallest one I could justify, and each is for Codex and the author to accept or reject.

---

## 0. How to read this report

- **Grading model assumed** (from the snapshot's `grading` field): only the headword and the explicit `accepted` alternatives pass, after case and edge-punctuation normalization. Accent or spelling slips and recognized inflections get a score-free retry, not an immediate rejection. Dictionary-form and infinitive instructions are intentional. I treated these as design decisions, not defects.
- **What the learner sees:** the English `prompt`, plus a `cue` whenever the cue is more than the bare POS label, plus the `instruction`. "Cue admits X" means a competent speaker reading that prompt and cue could reasonably type X.
- **Finding classes:**
  - **D** demonstrated factual or grading error: a valid answer is rejected, or there is a false translation or claim.
  - **A** ambiguity or clarity concern.
  - **O** optional improvement.
  - **U** unresolved question.
  - **N** recorded no-change decision.
- **Severity:** *High* means many learners will be falsely marked wrong, or the card teaches something false. *Medium* means a plausible, common correct answer is rejected, or there is a false translation. *Low* means it is less common, cosmetic, or mitigated by the retry.
- **Confidence** is my estimate that the finding survives expert challenge.
- **Verification labels:**
  - **[RAE-extract]**: I read the text of the RAE/ASALE page itself as returned in a web-search result. I did **not** open the page directly, because direct fetches of `rae.es` and `dle.rae.es` were refused (allowlist) or failed with a client error. I quote only what the extract showed.
  - **[secondary]**: a non-RAE source seen in search results.
  - **[model]**: my own linguistic judgment, with no source opened. Where I list a URL with [model], it is a pointer for Codex to check; I did **not** open it.

---

## 1. Coverage

### 1.1 Cards: all 1,250 read

| Rank block | Cards in snapshot | Unique IDs | Read in full | Cards carrying ≥1 finding or recorded decision |
|---|---|---|---|---|
| 251–500 | 250 | 250 | 250 | 32 |
| 501–750 | 250 | 250 | 250 | 41 |
| 751–1000 | 250 | 250 | 250 | 32 |
| 1001–1250 | 250 | 250 | 250 | 31 |
| 1251–1500 | 250 | 250 | 250 | 30 |
| **Total** | **1,250** | **1,250** | **1,250** | **166** (includes O-03 sense-alignment notes and N decisions) |

For every card I read the headword, POS, id, teachingMeaning, prompt, cue, instruction, every accepted form, the note, the comparison links and every example, both Spanish and English. I read the 1,250 cards in five passes of 250 from a lossless one-line-per-card dump of the JSON; no card was skipped or sampled. Snapshot-level checks: there are 1,250 unique ranks (251–1500, no gaps) and 1,250 unique IDs, and every headword appears in its own `accepted` list.

### 1.2 Groups: all 291 read

I read all 291 comparison groups in full: 265 with one section, 24 with two and 2 with three. That covers every title, section text and example pair, plus the source label of every one of the 687 source links. All 454 member IDs resolve to cards in the snapshot. All 291 groups are linked from at least one card. Of the source links, 643 point to Wiktionary, 40 to DLE and 4 to DPD. Programmatic check: 3 groups cite a source word that does not appear in the group (see O-05).

### 1.3 What I did not do (candid limits)

- **No RAE page was opened directly.** Every RAE/ASALE citation is an [RAE-extract], i.e. the page's own text as returned inside search results. Codex should open those URLs directly.
- I did **not** verify the 643 Wiktionary citations against live Wiktionary. I checked group claims on their linguistic merits instead.
- I could not test the grading engine. Severity for D-09 (valid spelling variants) and A-03 (pronominal infinitives) depends on whether those inputs trigger the score-free retry or a plain rejection (U-05).
- For many "missing common alternative" findings (D-10), the evidence is [model]. These are basic lexical facts, such as *cabello* = hair, but they are not source-verified here.

### 1.4 Ledger

The companion file **`perlingo_251-1500_coverage_ledger.csv`** lists all 1,250 cards (rank, id, headword, POS, block, finding IDs or `none`) and all 291 groups (id, title, finding IDs or `none`). There are 1,084 cards and 267 groups with `none`. "None" means I reviewed the item and found no demonstrated issue. It does not mean the item was unread.

---

## 2. Demonstrated factual or grading errors (D)

### D-01 — 505 `corpes:referir:V`: bare prompt "to report" effectively requires *referir* — **High**, confidence 0.95
- **Current:** prompt `to report`, cue `verb` (bare POS), instruction `One word · infinitive`, accepted `["referir"]`. Example: *Se refiere a un aspecto del paisaje que está a la vista.* = "She refers to an aspect of the landscape that is visible."
- **Counterexample:** a learner reads "to report" and types **informar** (itself card 484), *relatar*, *contar* or *reportar*. All are rejected. *Referir* in its 'recount' sense is rare as a learner's answer to "to report", so nearly every learner will fail this card on first sight. The example teaches a different sense ('refer to'), so the prompt and the example disagree.
- **Source:** [model]. DLE *referir* sense 1 ('dar a conocer… un hecho') does support "recount/report" as a valid meaning, so the gloss is not false. The problem is that the cue is underdetermined.
- **Smallest correction:** re-prompt as "to refer (to); to recount" with a cue such as "Mention or allude to something · usually referirse a". Alternatively, keep the prompt and accept *informar, relatar, contar, reportar*. Re-prompting is preferable because it also aligns the card with its example.

### D-02 — 269 `corpes:final:N` (example shared by 267, 268): *el final* ≠ "the final" (match) — **Medium**, confidence 0.95
- **Current:** *Incluso el final del torneo internacional es gratis.* = "Even the final of the international tournament is free."
- **Problem:** in English, "the final of a tournament" means the deciding match. In Spanish that is **la final** (feminine). *El final del torneo* means "the end of the tournament". As written, the English is a false translation of the Spanish. The card teaches *final* (m.) 'end', so the Spanish matches the card but the English does not.
- **Source:** [RAE-extract] DLE *final*: "4. m. Término y remate de algo. *El final del viaje.*"; "5. f. Última y decisiva competición en un campeonato o concurso. *La final de los 100 metros.*" — https://dle.rae.es/final
- **Smallest correction:** replace the sentence with one where 'end' is natural, e.g. *Llegamos justo al final del torneo.* = "We arrived right at the end of the tournament." Changing only the English to "Even the end of the tournament is free" would be accurate but semantically odd. Optionally, add a one-line *el final / la final* contrast to group later-66 (O-06).

### D-03 — 277 `corpes:asegurar:V` (example shared by 276, 278): indicative *asegurar que* translated as "ensure" — **Medium**, confidence 0.8
- **Current:** *Nosotros aseguramos que el sector tiene recursos suficientes.* = "We ensure that the sector has enough resources."
- **Problem:** *asegurar que* + **indicative** (*tiene*) is assertive: 'we assure / affirm that the sector has…'. The 'make sure/ensure that' reading normally takes the subjunctive (*aseguramos que tenga*, or *nos aseguramos de que tenga*). The English therefore asserts a different speech act. It also misaligns with the card cue "Give assurance of safety" and the prompt "to guarantee".
- **Source:** [model]. Mood selection with assertive vs. causative/volitional predicates is standard grammar (NGLE ch. 25, not opened). [secondary] learner references give *Aseguro que es verdad* (indicative) as the assertive pattern.
- **Smallest correction:** change the English to "We assure you that the sector has enough resources". Or keep "ensure" and change the Spanish to *Nosotros aseguramos que el sector tenga recursos suficientes*. The first is smaller.

### D-04 — 333 `corpes:tú:L` and 699 `corpes:ti:L`: *vos* rejected for "informal singular you" — **Medium**, confidence 0.85 on the linguistics (policy-dependent)
- **Current:** 333 prompt `you (second-person singular pronoun) (informal)`, accepted `["tú"]`. 699 prompt `you (after a preposition, informal singular)`, accepted `["ti"]`.
- **Counterexample:** an Argentine, Uruguayan or Central American learner types **vos** (*Vos te equivocás*; *para vos*) and is rejected. The cue does not exclude voseo, and the brief says valid regional usage counts unless the cue excludes it.
- **Source:** [RAE-extract] DPD *vos*: "1. Pronombre personal tónico de segunda persona del singular…"; DPD *voseo* 2.1.1: "El voseo pronominal consiste en el uso de vos como pronombre de segunda persona del singular en lugar de tú y de ti." — https://www.rae.es/dpd/vos, https://www.rae.es/dpd/voseo
- **Smallest correction:** accept *vos* on both cards, or add "(tú form)" to both cues if the course deliberately teaches only the tuteo paradigm.

### D-05 — 405 `corpes:ciento:N`: "hundred (100 units of something)" rejects *centenar/centena* (and *cien*) — **Medium**, confidence 0.9
- **Current:** prompt `hundred (100 units of something)`, cue `noun`, accepted `["ciento"]`.
- **Counterexample:** *centenar* is the DLE noun meaning exactly 'a set of 100 units', and the prompt paraphrases that definition. Most learners will also type *cien*, which DLE defines as the apocope of *ciento*. Whether *cien* gets a score-free inflection retry is unknown (U-05).
- **Source:** [RAE-extract] DLE *centenar*: "1. m. centena (‖ conjunto de 100 unidades)" — https://dle.rae.es/centenar. DLE *ciento* 3: "m. centena (‖ conjunto de 100 unidades). *Un ciento de huevos*" — https://dle.rae.es/ciento. DLE *cien*: "Apóc. de ciento." — https://dle.rae.es/cien
- **Smallest correction:** accept *centenar* and *centena*. Decide explicitly whether *cien* passes or retries. Alternatively, cue "the full (non-apocopated) form used in cientos de…".

### D-06 — 1491 `corpes:jurídico:A`: prompt "legal" rejects *legal* — **Medium**, confidence 0.85
- **Current:** prompt `legal`, cue `Relating to law as a field`, accepted `["jurídico"]`.
- **Counterexample:** *asesoría legal* and *asesoría jurídica* both occur. DLE *legal* sense 2 is exactly "relating to law". Group later-165 itself says: "Legal can mean relating to law or permitted by law."
- **Source:** DLE *legal* "2. Perteneciente o relativo a la ley o al derecho". I saw this as a [secondary] es-academic mirror of the DLE (older edition), so Codex should confirm it at https://dle.rae.es/legal.
- **Smallest correction:** accept *legal* on 1491, or make the cue specific to the field-of-law reading in a way *legal* doesn't fit (e.g. "Relating to the legal system as a discipline, as in *ciencias ___s*"). Accepting is smaller.

### D-07 — 522 `común`, 1079 `normal`, 1423 `habitual`: prompt "usual" rejects Spanish *usual* — **Medium**, confidence 0.9
- **Current:** all three have prompt `usual` and cue `Customary rather than exceptional`, and each accepts `común, normal, habitual`.
- **Counterexample:** the most natural answer for many learners is the cognate **usual**, a standard Spanish adjective (*lo usual*, *horario usual*). It is rejected on all three cards.
- **Source:** [model]. [secondary] Spanish Wiktionary *usual* ("Que se ve, escucha, se hace o se observa con mucha frecuencia") via a kaikki.org extract. DLE entry not opened: https://dle.rae.es/usual
- **Smallest correction:** add *usual* to the accepted list of all three, which keeps the group consistent. Group later-150 could mention it.

### D-08 — 534 `corpes:época:N`: prompt "era; period" rejects *era* — **Medium**, confidence 0.9
- **Current:** prompt `era; period`, cue `A period of time`, accepted `["época","período"]`.
- **Counterexample:** a learner types **era**, the Spanish noun (*la era digital*), and is rejected.
- **Source:** [model]. DLE *era* not opened: https://dle.rae.es/era
- **Smallest correction:** accept *era*, or change the prompt to "epoch; period". Accepting is smaller.

### D-09 — Valid RAE spelling variants not in `accepted` — **Low–Medium**, confidence 0.9 (severity depends on U-05)

| Rank / id | Accepted now | Valid variant missing | Evidence |
|---|---|---|---|
| 523 `período` | período, época | **periodo** | [RAE-extract] DPD *período o periodo*: "Ambas acentuaciones son correctas" — https://www.rae.es/dpd/período |
| 534 `época` | época, período | **periodo** (as the alternative) | same |
| 734 `fútbol` | fútbol | **futbol** | [RAE-extract] DPD *fútbol o futbol*: "…ambas válidas… En México y el área centroamericana se usa la aguda futbol" — https://www.rae.es/dpd/futbol |
| 1147 `video` | video | **vídeo** | [RAE-extract] DPD *Lemas dobles*: "video o vídeo… ambas válidas: la forma esdrújula vídeo… es la única usada en España" — https://www.rae.es/dpd/ayuda/lemas-dobles |
| 1227 `conciencia` (cue "Being aware of something") | conciencia, conocimiento | **consciencia** | [RAE-extract] DPD *conciencia*: "Con el sentido general de 'percepción o conocimiento', se usan ambas formas" — https://www.rae.es/dpd/conciencia |
| 1036 `septiembre` | septiembre | **setiembre** | [model] (DLE/DPD list *septiembre o setiembre*, but I did not verify this) |

- **Why it matters even with retries:** if these inputs trigger a "spelling slip" retry, a learner who wrote a correct, standard form, often the majority form in their country (*video*/*vídeo*, *futbol*), is told to "fix" it.
- **Smallest correction:** add each variant to `accepted`.

### D-10 — The prompt and cue admit a common, ordinary alternative that is rejected — **Medium** unless noted

In each case below the prompt/cue does not exclude the alternative, the alternative is an everyday word, and it is not in `accepted`. I have kept to obvious, high-frequency alternatives and excluded obscure synonyms. Evidence is [model] unless stated. The smallest correction is either to accept the listed form(s) **or** to narrow the prompt/cue so it no longer invites them; the right-hand column says which I recommend.

| ID | Rank / headword | Exact current prompt · cue | Accepted now | Rejected valid answer(s) | Conf. | Recommended smallest fix |
|---|---|---|---|---|---|---|
| D-10a | 417 falta | `lack, shortage` · `noun` | falta | **escasez**, carencia | 0.9 | accept both |
| D-10b | 421 destacar | `to highlight; to stand out` · `verb` | destacar | **resaltar**, sobresalir | 0.85 | accept *resaltar* (fits both glosses) |
| D-10c | 465 afectar | `to affect, to have an effect on, to influence` · `verb` | afectar | **influir** | 0.85 | drop "to influence" from prompt (smaller) or accept *influir* |
| D-10d | 521 fuera | `outside, out` · `adverb` | fuera | **afuera** | 0.9 | accept. [RAE-extract] DPD *afuera*: in America "se prefiere afuera cuando el complemento está implícito" — https://www.rae.es/dpd/afuera |
| D-10e | 527 demostrar | `to show, to demonstrate` · `verb` | demostrar | **mostrar** | 0.9 | re-prompt "to demonstrate; to prove" (example *demuestra que* = proves/shows that) |
| D-10f | 653 conjunto | `group; set; ensemble` · `noun` | conjunto | **grupo** | 0.9 | re-prompt "set; ensemble" |
| D-10g | 656 superar | `to surpass, exceed` · `verb` | superar | **exceder**, sobrepasar | 0.85 | accept *exceder, sobrepasar* |
| D-10h | 676 contrario | `contrary, opposite` · `adjective` | contrario | **opuesto** | 0.9 | accept |
| D-10i | 797 obligar | `to force, to compel, to make (someone do something)` · `verb` | obligar | **forzar** | 0.8 | accept (*forzar a alguien a* + inf.) |
| D-10j | 815 similar | `similar` · `adjective` | similar | **parecido**, **semejante** | 0.9 | accept both |
| D-10k | 860 aumento | `increase` · `A rise in prices` | aumento, incremento | **subida**, alza | 0.8 | accept both (group later-115 silent) |
| D-10l | 894 lucha | `fight, fighting, fray` · `noun` | lucha | **pelea**, combate | 0.85 | accept *pelea* (or re-prompt "struggle; fight") |
| D-10m | 1008 corto | `short` · `Of little length or duration` | corto | **breve** (cue names duration) | 0.75 | accept *breve*, or drop "or duration" |
| D-10n | 1084 pelo | `hair; fur` · `noun` | pelo | **cabello** | 0.95 | accept |
| D-10o | 1123 exponer | `to exhibit` · `Display artworks publicly` | exponer, mostrar | **exhibir** | 0.85 | accept (group later-card-exponer-V silent) |
| D-10p | 1159 asimismo | `also` · `In addition` | asimismo, también | **además** | 0.85 | accept *además*, or change cue to "Likewise (formal connector)" |
| D-10q | 1192 comportamiento | `behavior` · `noun` | comportamiento | **conducta** | 0.9 | accept |
| D-10r | 1219 delito | `crime; offense` · `noun` | delito | **crimen** | 0.9 | accept, or re-prompt "offense (legal); crime" with cue distinguishing *crimen* = serious crime |
| D-10s | 1255 contra (n.) | `disadvantage; objection` · `noun` | contra | **desventaja**, **inconveniente** | 0.9 | re-prompt "con (as in pros and cons)" with cue "los pros y los ___s" (better than accepting) |
| D-10t | 1353 promedio | `average` · `noun` | promedio | **media** | 0.85 | accept |
| D-10u | 1484 actualidad | `the present` · `The current time` | actualidad | **presente** (noun: *el presente*) | 0.8 | accept, or cue "current times; current affairs" |

### D-11 — 968 `corpes:incorporar:V`: the cue literally says "Add…" but *añadir/agregar/incluir* are rejected, which is inconsistent with group later-28 and card 294 — **Low–Medium**, confidence 0.75
- **Current:** prompt `to incorporate`, cue `Add something to an existing whole`, accepted `["incorporar","integrar"]`. Card 294 *incluir* accepts `incorporar, agregar, añadir, sumar`. Group later-28 says: "Incluir, incorporar, agregar, añadir and sumar all fit adding a name to a list."
- **Counterexample:** for 968, a learner who reads the cue "Add something…" and types *añadir* is rejected, even though the same words are mutually accepted on 294/509/516.
- **Smallest correction:** accept *añadir, agregar, incluir* on 968, or reword the cue to emphasise integration ("Make something part of a larger whole").

---

## 3. Ambiguity and clarity concerns (A)

### A-01 — Prompts that cannot elicit their own headword (grading is correct; the teaching target is invisible) — **Low**, confidence 0.9
Each of these cards prompts with the gloss of a sibling, which is accepted. The learner will almost always type the sibling and never practise the headword:
340 *efecto* ("result"), 626 *consecuencia* ("result"), 638 *requerir* ("to need"), 654 *negocio* ("company"), 785 *defender* ("to protect"), 954 *básico* ("fundamental"), 977 *adquirir* ("to buy"), 1193 *labor* ("task"), 1263 *facilitar* ("to provide"), 1299 *procedimiento* ("method"), 1351 *triunfo* ("victory"), 1383 *disminuir* ("to reduce").
None of these grades falsely. **Optional smallest fix:** use the headword's own gloss (e.g. 340 "effect", 626 "consequence", 954 "basic", 977 "to acquire") and keep the siblings accepted. Leave as is if acceptance of siblings is the intended design.

### A-02 — 471 *chico* / 990 *muchacho*: "boy" with cue "A male young person" rejects *niño* — **Low–Medium**, confidence 0.65
- Group later-107 deliberately separates *niño* ('child'). But "boy" is most learners' default for *niño*, and "young person" does not clearly exclude children.
- **Smallest fix:** a cue that excludes children, e.g. "A male adolescent or young man". Otherwise accept *niño*. I lean towards the cue fix, because the group's distinction is real.

### A-03 — Pronominal infinitives: 329 *caer*, 909 *reír*, 1278 *escapar* — **Low–Medium**, confidence 0.7 (depends on U-05)
- 329's own prompt says "(intransitive, **reflexive**)", yet `accepted` is `["caer"]`. *Caerse*, *reírse* and *escaparse* are among the most common forms. 295 *morir* already accepts *morirse*, so the treatment is inconsistent.
- **Smallest fix:** accept *caerse, reírse, escaparse*, or confirm that clitic infinitives route to the score-free retry.

### A-04 — Register/region labels in teachingMeaning: 509 *agregar* "(colloquially chiefly Latam)", 584 *regresar* "(intransitive, colloquially chiefly Latam)", 1194 *retirar* "(colloquially chiefly Latam)" — **Low–Medium**, confidence 0.75
- These are standard verbs in all registers. "Colloquially" is misleading.
- **Source:** [RAE-extract] DLE *agregar* carries no colloquial or regional mark: "1. tr. Unir o juntar unas personas o cosas a otras… 2. tr. Añadir algo a lo ya dicho o escrito" (https://dle.rae.es/agregar). For *regresar* and *retirar* the evidence is [model], unverified. Plausibly, only transitive *regresar* ('give back') is chiefly American.
- **Smallest fix:** delete "colloquially". Where a frequency note is wanted, say "more frequent in Latin America".

### A-05 — 595 *acto* (example shared by 596, 597): *En el acto entrega un libro…* — **Low–Medium**, confidence 0.7
- *En el acto* is a fixed locution meaning 'immediately', and native readers will parse it that way first. The translation "At the ceremony she presents a book…" relies on the less likely parse.
- **Source:** [RAE-extract] DLE *acto*: "en el acto 1. loc. adv. enseguida." — https://dle.rae.es/acto
- **Smallest fix:** *Durante el acto, entrega un libro sobre la libertad.*

### A-06 — 993 *claro* (adv.): prompt "certainly, naturally, of course"; example *Habla claro* = "speaks clearly" — **Low**, confidence 0.8
- The example teaches the manner sense ('clearly'), which differs from the prompt. The prompt also lists "naturally", which invites *naturalmente* or *ciertamente*; both are rejected.
- **Smallest fix:** prompt "of course (interjection-like); clearly", or swap the example for *—¿Vienes? —¡Claro!*

### A-07 — Lower-impact broad glosses (several English glosses, one of which invites a different common word) — **Low**, confidence 0.6–0.75
685 *cabo* ("end, edge, extremity" → *extremo*); 667 *plantear* ("…to present" → *presentar*); 756 *temporada* ("season, period, span of time" → *período*); 841 *recoger* ("to collect, to gather…" → *recolectar, reunir*); 917 *aprobar* ("…to permit" → *permitir*); 921 *cifra* ("figure; number; digit" → *número, dígito*); 930 *ámbito* ("scope, field" → *campo, alcance*); 1021 *cuidado* ("care; attention" → *atención*); 1065 *promover* ("…to foster…" → *fomentar, impulsar*); 1095 *extender* ("to extend, to expand" → *expandir*); 1137 *actitud* ("attitude; stance" → *postura*); 1149 *fijar* ("…set, establish, determine" → *establecer, determinar*); 1187 *impulsar* ("to impel, to propel" → *propulsar*); 1204 *complejo* ("complex, sophisticated, intricate" → *complicado*); 1275 *dispuesto* ("willing, ready…" → *listo, preparado*); 1318 *señal* ("sign" → *signo, letrero*); 1331 *introducir* ("…to insert" → *insertar*); 1385 *abordar* ("…to discuss…" → *tratar, discutir*); 1470 *encargar* ("…to order" → *pedir*); 1478 *ingresar* ("to enter; to join; to deposit" → *entrar, depositar*).
**Smallest fix:** trim each prompt to the gloss that best fits the card's cue and example, rather than adding many alternatives. All the evidence here is [model].

### A-08 — 537 *aumentar*: TM "(intransitive)" contradicts the transitive cue and example (*aumentar la longitud*) — **Low**, confidence 0.9. Fix: change the TM label to "(transitive or intransitive)".

### A-09 — 536 *medio* (numeral) "half": most learners will type the noun *mitad*. The POS label "numeral" does not tell them an adjectival form is wanted — **Low**, confidence 0.6. Fix: cue "Before a noun: ___ litro".

---

## 4. Optional improvements (O)

- **O-01 Regional alternatives** (valid; not demanded by the cue; low priority): 424 *dinero* → *plata* (Am.); 682 *informe* → *reporte* (Am.); 897 *habitación* → *pieza* (Am.; group later-card-pieza-N itself notes "regionally, a room"); 1289 *medicina* / 1449 *medicamento* → *remedio*; 456 *bajo* → *chaparro* (Mx), *petiso* (Rioplatense); 889 *detrás* → *atrás de* (Am.; group later-182 acknowledges regional variation); 1181 *terreno* → *lote* (Am.). All [model].
- **O-02 Other reasonable alternatives:** 256/269 *fin/final* → *desenlace* (for "ending of a film"); 344 *intentar* → *procurar* (takes an infinitive directly, matching the cue); 730 *fundamental* → *esencial*; 750 *completo* → *entero*; 1055 *impedir* → *prevenir* (needs checking); 1166 *mil* → *millar* (parallel to D-05); 1390 *conservar* → *preservar*. All [model].
- **O-03 Example–sense alignment** (no false translation; the example shows a different legitimate sense from the typed cue): 254, 298 (*tiene sentido*), 331, 346 (*el próximo mes*), 388 (*papel* = role), 487 (*está seguro*), 506, 513 (*tiempo libre*), 518, 571, 616 (*echar un vistazo*), 673, 688 (*lanzar un grito*), 723, 740, 754, 776, 785, 809, 888, 923, 959, 977, 1024, 1231, 1266, 1289, 1326, 1354, 1410. These are permitted by the brief's rule on broad teaching meanings. Only adjust if card-level alignment is a goal.
- **O-04 Naturalness or English polish (no false meaning):**
  - 255–257: *al fin del proceso* → *al final del proceso*.
  - 517–519: *sin meter miedo en la conversación* is odd; *sin meter miedo* normally takes a person (*meterle miedo a alguien*).
  - 685–687: *Nos falta tiempo…* = "We need time…" hides the 'lack' meaning that card 686 *faltar* teaches; "We don't have enough time…" is better.
  - 820–822: *desaparece del cuadro* is a calque of "disappears from the picture".
  - 1159–1161: *me gusta el gusto del pan* → *el sabor*.
  - 1279–1281: *Simplemente necesito solamente…* is redundant.
  - 1288–1290: "The medicine student" → "The medical student".
- **O-05 Group citation mismatches** (source word not in group): later-56 (*reunir · juntar*) cites "Wiktionary · agregar" (should be *juntar*); later-143 (*difícil · complicado*) cites "Wiktionary · complejo" (should be *complicado*); later-card-viejo-N cites "Wiktionary · grande" (likely meant *anciano*/*mayor*).
- **O-06** later-66 (*fin · final · término · conclusión*) could add one line: *el final* 'end' vs *la final* 'final match' (ties to D-02).

---

## 5. Unresolved questions (U)

- **U-01 — 402 *suponer* accepts *asumir*; groups later-card-suponer-V / later-card-asumir-V claim "RAE recognizes this use of asumir".** Evidence conflicts. [RAE-extract] DLE *asumir* lists only "1. Atraer a sí, tomar para sí. 2. Hacerse cargo, responsabilizarse de algo, aceptarlo. 3. Adquirir, tomar una forma mayor." (https://dle.rae.es/?w=asumir), so there is no 'suppose' sense. A [secondary] source (Glosas, via temas.sld.cu) quotes the DPD as saying *asumir* "significa también… 'dar por sentado o por cierto'". Wiktionary, which the group also cites, calls the 'suppose' sense a false friend. I could not open https://www.rae.es/dpd/asumir. **No change recommended until Codex reads the current DPD (2nd ed.) entry.** If the DPD supports it, the group text should cite the DPD specifically, not "RAE" in general, because the DLE does not list it.
- **U-02 — CORPES ID/headword mismatches (data provenance, not linguistics):** 300 *música* = `corpes:músico:N`; 814 *característica* = `corpes:característico:N` (also a member of group later-131); 920 *salida* = `corpes:salido:N`; 928 *lista* = `corpes:listo:N`; 1241 *perspectiva* = `corpes:perspectivo:N`; 1334 *deuda* = `corpes:deudo:N`; 1475 *caída* = `corpes:caído:N`. These look like CORPES lemmatization artifacts, with feminine nouns merged under masculine forms. If so, the frequency ranks may reflect merged counts. This is worth confirming. No learner-facing error.
- **U-03 — 937 *estadounidense*:** should *norteamericano* be accepted for "American (of… the United States)"? It is common usage. I believe the DPD treats it as admissible, but I verified nothing authoritative ([secondary] only).
- **U-04 — Unverified regional/register claims in teachingMeaning:** 854 *rostro* "(often formal in Spain)"; 1026 *coche* "(chiefly Spain, Mexico, Equatorial Guinea, Philippines)". Neither is demonstrably wrong; neither is source-checked here. The group-level wording (later-98: "can sound more formal or literary") is safer.
- **U-05 — Retry-engine behaviour:** whether *periodo/futbol/vídeo/consciencia/setiembre* (D-09), *cien* (D-05) and *caerse/reírse/escaparse* (A-03) get a score-free retry or a rejection. This sets their final severity.

---

## 6. No-change decisions (N), reviewed explicitly because they looked suspicious

- **N-01 — 292 *escuchar* ⇄ 499 *oír* cross-acceptance (group later-card-escuchar-V):** keep. [RAE-extract] DPD *escuchar* (2nd ed.): oír "casi siempre puede usarse en lugar de este [escuchar]"; using escuchar for oír is "menos justificable… pero es uso que también existe desde época [clásica]" — https://rae.es/dpd/escuchar. The group text is accurate.
- **N-02 — *aun* (1234) vs *aún*** in 268/591/1234 and group later-185: correct. *aun* = *incluso*, *aún* = *todavía* (model; standard OLE rule).
- **N-03 — 1245 *gana* singular-headword instruction:** intentional and clearly noted. No issue.
- **N-04 — 1144 *coger* regional note:** accurate as a register warning (model). Accepting *tomar* is appropriate.
- **N-05 — 286 *principal* accepts *primordial*:** lenient but defensible. The group cites DLE *primordial*.
- **N-06 — 294/509/516 mutual acceptance of *incluir/agregar/añadir/incorporar/sumar*** for "add a name to a list": consistent with groups later-6/later-28 (see D-11 for the one card that breaks it).
- **N-07 — Example sentences generally:** I read all 1,252 examples (1,248 cards have one, 2 have two). Apart from D-02, D-03 and A-05, I found no false translation. Borderline constructions that I judged acceptable and did not flag: *Me interesa el empleo y el derecho laboral* (singular agreement with a postposed coordinated subject is normative); *responder la siguiente pregunta* (transitive *responder* is common in America); *nos informa de que* (correct, not dequeísmo); *alberga al ministerio*.
- **N-08 — All other groups:** I found no demonstrated factual error in group explanations. Their claims (e.g. later-22 on *conseguir/lograr* + infinitive vs *obtener*; later-138 *actual* ≠ English 'actual'; later-171 *quizá/quizás*; later-179 *ahí/allí/allá*; later-26 *detenerse*) are consistent with standard descriptions.

---

## 7. Summary counts

| Class | Findings | Distinct cards touched |
|---|---|---|
| D (demonstrated) | 11 IDs (D-10 has 21 sub-items) | 42 cards (incl. 4 cards that only share a flagged example) |
| A (ambiguity) | 9 | 46 |
| O (optional) | 6 | 63 (mostly O-03 alignment notes) |
| U (unresolved) | 5 | 11 |
| N (no change, recorded) | 8 | 11 cards + 5 groups |

Highest priority for Codex to challenge: **D-01** (*referir* "to report"), **D-02** (*el/la final*), **D-03** (*asegurar que* + indicative), **D-07** (*usual*), **D-10n/D-10j/D-10q/D-10r** (*cabello, parecido/semejante, conducta, crimen*), and **U-01** (*asumir* = 'suponer').

Plausible false positives to scrutinize: D-04 (only valid if voseo is not deliberately out of scope), D-10m (*breve*), D-10u (*presente*), D-11, A-02.
