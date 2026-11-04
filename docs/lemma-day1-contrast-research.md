# Day 1 meaning and construction contrasts

> Current status: implemented locally for testing; not committed or published. [Implementation, resolved pues evidence, teaching alignment and testing](lemma-day1-local-preview.md). Earlier draft/provisional statements below are historical.


Research only, October 30, 2026. Primary-source follow-up completed for the 31 previously frozen-only groups. The earlier recall prototype is paused and **not approved**: its alternative lists are not the result of this research and must not be treated as validated by it. No new grading or UI changes were made for this research.

## Scope and evidence

All 250 Day 1 cards were screened, including repeated spellings with different parts of speech. This inventory records 60 overlapping-meaning or grammatical-confusion groups. Related concepts and opposites are explicitly not synonym sets. It is a systematic candidate screen, not a claim to enumerate every Spanish synonym or every dialectal use.

Each group names its frozen dictionary keys and checked primary sources. All 60 groups now have targeted primary evidence; this follow-up inspected the stated distinctions for the 31 previously frozen-only groups. The 29 earlier groups retain their explicitly scoped prior checks. RAE/ASALE DLE supplies senses; DPD supplies construction guidance; FundéuRAE supplies a targeted usage recommendation. The frozen Wiktionary-derived extract supports the broader lexical screen; it does not independently certify subtle register, dialect or syntactic restrictions. No group is now supported only by the frozen extract. Source review establishes the stated senses and qualifications, not an exhaustive thesaurus or a validated answer whitelist. Exact new prompts, sentence frames, inflections and accepted answers remain a separate next step. Source absence/failure is not evidence. The DPD has no entries for tras, por or para; their DLE entries were used instead.

The [primary-source lookup log](../data/spanish-lemmas/day1-primary-source-checks.json) records the pages retrieved in the follow-up; the DPD suyo/tuyo lookups returned no headword entries and were excluded (DLE possessive entries and DPD usted/voseo supplied the evidence instead). The machine-readable [ledger](../data/spanish-lemmas/day1-contrast-research.json) includes exact card IDs, ranks, source hashes and coverage. Frozen-source provenance is in [lemma-notes-sources](lemma-notes-sources.md). All descriptions below are editorial paraphrases; examples and proposed cues are author-created illustrations, not quotations or approved test items.

## Corrections from the primary-source follow-up

- **Starting points:** de and desde overlap; this is not an exclusive sense of desde.
- **Work/products:** trabajo and obra overlap even for produced works.
- **Teams:** grupo can be organized; organization alone does not distinguish equipo.
- **Possessors:** suyo includes usted/ustedes; plural ustedes is also informal across the Americas. Tuyo also belongs to modern American vos.
- **People:** gente is generally collective but can be countable for individuals in American usage.
- **Size/age:** mayor is not always comparative; grande can describe stature and adulthood.
- **Grammar:** mientras que can be temporal; mucho precedes comparatives; tanto has exceptions to shortening; alguno can have a negative postnominal use.
- **Time:** momento need not be a tiny instant; hoy/ahora both extend to the present era; hasta has a regional not-before reading.

The corresponding sections below link the evidence for each correction. These findings replace overly categorical research wording, not app definitions. No new test definitions, examples, answer lists, scoring, progress migration or UI were implemented. The older unapproved prototype remains local and is not validated by this research.

## What should guide the next implementation

1. Narrow a gloss to the sense actually being tested.
2. When the construction carries the distinction, show a short example/frame before the answer.
3. Do not use unsupported register labels or pretend a tendency is a rule.
4. Check alternatives against the exact prompt and frame, not against a whole-word synonym list.
5. If a prompt still admits genuine synonyms, acknowledge that overlap; do not mark a correct translation wrong just to force recall of a particular card. Decide separately how to assess the target headword.

A contextual line should say something useful, such as “followed directly by the event”, rather than merely label the item “ambiguous”. These are design recommendations, not implemented behavior.

## Priority example: after / afterward / then

| Word | Useful distinction | Limit |
| --- | --- | --- |
| tras | Direct complement: tras la clase | Not labelled formal in its ordinary temporal DLE sense; después de la clase expresses the same relation. |
| después | Standalone afterward; después de la clase | Overlaps with luego. |
| luego | Standalone afterward; also luego de and luego (de) que | Not restricted to second-clause sequence; regional distribution should not be erased. |
| entonces | At that time; in that case/therefore | Also participates in sequencing, so “then” alone is insufficient. |

Sources: [tras](https://dle.rae.es/tras), [después constructions](https://www.rae.es/dpd/despu%C3%A9s), [luego](https://dle.rae.es/luego), [luego constructions](https://www.rae.es/dpd/luego), [entonces](https://dle.rae.es/entonces). A one-word blank directly before la clase can distinguish tras from bare después/luego; it cannot show that multiword después de/luego de are semantically wrong. A word-count restriction would need to be explicit.

## Candidate groups

### sequence

**Day 1:** después (#84, adverb); entonces (#144, adverb); luego (#155, adverb); tras (#193, preposition).

Tras is a preposition with a direct complement; después can stand alone or take de + noun/infinitive. Luego overlaps with después as afterward and also has luego de / luego (de) que constructions. Entonces can locate an event at that time or introduce a consequence. These are not four mutually exclusive temporal meanings. DLE does not label the ordinary temporal tras sense formal.

**Test implication (proposed):** Use a short construction or a stated sense. A bare “afterward” still admits después/luego. A direct-complement frame distinguishes tras from bare después/luego, but not from the multiword alternatives después de/luego de. Do not label luego “sequence only”.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: después, entonces, luego, tras. Primary: [tras](https://dle.rae.es/tras), [después](https://dle.rae.es/despu%C3%A9s), [luego](https://dle.rae.es/luego), [entonces](https://dle.rae.es/entonces), [después](https://www.rae.es/dpd/despu%C3%A9s), [luego](https://www.rae.es/dpd/luego).

### begin

**Day 1:** empezar (#183, verb); comenzar (#227, verb).

Both denote beginning; both can introduce the start of an action. The consulted entries support genuine overlap, not an exclusive everyday/formal split.

**Test implication (proposed):** A generic “to begin” or ordinary beginning example cannot fairly force one headword. Teach the pair together and explicitly acknowledge overlap.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: empezar, comenzar. Primary: [empezar](https://dle.rae.es/empezar), [comenzar](https://dle.rae.es/comenzar).

### knowledge

**Day 1:** saber (#52, verb); conocer (#118, verb); entender (#243, verb). **Outside comparison:** comprender.

Saber includes factual knowledge and knowing how; conocer includes acquaintance/familiarity; entender includes comprehension. Their broader senses overlap. Comprender also means understand and can additionally mean include/comprise. A mandatory shallow/deep split between entender and comprender is unsupported.

**Test implication (proposed):** Use know how to swim / be acquainted with a person / understand an explanation as sense illustrations; validate exact sentence answers separately. The last still permits comprender.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: saber, conocer, entender. Primary: [saber](https://dle.rae.es/saber), [conocer](https://dle.rae.es/conocer), [entender](https://dle.rae.es/entender), [comprender](https://dle.rae.es/comprender).

### thought

**Day 1:** parecer (#94, verb); pensar (#100, verb); creer (#114, verb); sentir (#128, verb); considerar (#204, verb).

Pensar includes thinking through ideas; creer includes taking something as true; sentir includes sensations, emotions and regret. Importantly, sentir also has an opinion sense: it is not categorically excluded from “I feel/think that”. Considerar can mean deem/judge; parecer can express an impression.

**Test implication (proposed):** Choose specific senses such as reflect on a problem, believe a claim, feel cold, or seem. Avoid claiming one exclusive translation for “think that”.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: parecer, pensar, creer, sentir, considerar. Primary: [pensar](https://dle.rae.es/pensar), [creer](https://dle.rae.es/creer), [sentir](https://dle.rae.es/sentir).

### being

**Day 1:** ser (#8, verb); estar (#19, verb).

Ser can identify/classify or attribute a property; estar presents a state or situation. Permanent versus temporary is not a reliable general rule.

**Test implication (proposed):** Use an identity/profession context versus a location/state context. Check adjective-dependent meaning changes; do not reduce the entire contrast to duration.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: ser, estar. Primary: [ser](https://www.rae.es/dpd/ser), [estar](https://www.rae.es/dpd/estar).

### demonstratives

**Day 1:** este (#17, demonstrative); ese (#27, demonstrative); aquel (#96, demonstrative).

The basic spatial contrast is near the speaker, near the addressee, and distant from both. Discourse reference and temporal uses extend beyond physical distance.

**Test implication (proposed):** Give a speaker/listener reference, not just “that”. A compact “that, over there—far from both of us” cue can identify aquel.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: este, ese, aquel. Primary: [este](https://dle.rae.es/este), [ese](https://dle.rae.es/ese), [aquel](https://dle.rae.es/aquel).

### for

**Day 1:** por (#14, preposition); para (#15, preposition).

Por includes cause, route, means and exchange. Para includes intended purpose, destination, recipient and deadline. The dictionaries also record overlapping purpose uses; cause/purpose is a teaching entry point, not a complete partition.

**Test implication (proposed):** State the particular relation: in exchange for, because of, intended for, or by a deadline. Check each sentence instead of sharing all answers to “for”.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: por, para. Primary: [por](https://dle.rae.es/por), [para](https://dle.rae.es/para).

### leave

**Day 1:** ir (#21, verb); dejar (#75, verb); salir (#115, verb). **Outside comparison:** irse.

Dejar can leave something behind, abandon, permit or stop doing something; salir can exit/go out; irse can depart. Some departure senses overlap, but their constructions differ. Irse is a pronominal use of ir, not a separate Day 1 card.

**Test implication (proposed):** Prefer leave an object behind / exit a room / go away, with the necessary object or construction visible. Do not pool all translations of “leave”.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: ir, dejar, salir. Primary: [dejar](https://dle.rae.es/dejar), [salir](https://dle.rae.es/salir), [ir](https://dle.rae.es/ir).

### attainment

**Day 1:** tener (#20, verb); recibir (#210, verb); lograr (#215, verb). **Outside comparison:** obtener, conseguir.

Lograr concerns achieving what one seeks; recibir concerns receiving; tener concerns possession/state. Conseguir overlaps strongly with lograr and obtaining; obtener also covers obtaining and extraction/production. These are not a clean effort/no-effort scale.

**Test implication (proposed):** Use achieve a desired result versus receive a delivery or possess something. Lograr/conseguir may remain valid together in an exact frame.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: tener, recibir, lograr. Primary: [obtener](https://dle.rae.es/obtener), [conseguir](https://dle.rae.es/conseguir), [](https://www.fundeu.es/recomendacion/lograr-obtener-alcanzar-conseguir-resultado/).

### continuing-time

**Day 1:** ya (#44, adverb); ahora (#89, adverb); aún (#236, adverb). **Outside comparison:** todavía.

Aún in the continuing-time sense corresponds to todavía; ya can mark already/now or, with negation, no longer; ahora anchors the present. Aun without the accent has other uses.

**Test implication (proposed):** Use “still, continuing up to now” rather than “now”; retain the accent. Do not invent a distinction from todavía for that sense.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: ya, ahora, aún. Primary: [tilde](https://www.rae.es/dpd/tilde).

### possession-existence

**Day 1:** tener (#20, verb); haber (#35, verb); existir (#186, verb).

Tener expresses possession among other senses; haber forms compound tenses and existential expressions; existir expresses existence. English “have” or “be” alone hides these functions.

**Test implication (proposed):** Separate “have as an auxiliary”, “have/possess”, and “exist”. A generic existential paraphrase may admit more than one construction.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: tener, haber, existir. Primary: [haber](https://dle.rae.es/haber), [tener](https://dle.rae.es/tener).

### movement

**Day 1:** ir (#21, verb); pasar (#66, verb); llegar (#68, verb); volver (#104, verb); salir (#115, verb); venir (#130, verb); entrar (#232, verb).

Basic motion senses confirmed: ir moves toward somewhere away from the speaker; venir toward the speaker’s location; llegar reaches an endpoint; entrar/salir cross inward/outward; volver returns and volver a repeats; pasar can cross, pass or happen. These senses overlap in real situations.

**Qualification / implication for later test design:** Do not equate every English “come” with venir, or assume specifying arrival automatically excludes venir. A frame must establish viewpoint and intended action. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE ir](https://dle.rae.es/ir), [DLE pasar](https://dle.rae.es/pasar), [DLE llegar](https://dle.rae.es/llegar), [DLE volver](https://dle.rae.es/volver), [DLE salir](https://dle.rae.es/salir), [DLE venir](https://dle.rae.es/venir), [DLE entrar](https://dle.rae.es/entrar). Frozen keys retained for provenance: ir, pasar, llegar, volver, salir, venir, entrar.

### remain-continue

**Day 1:** estar (#19, verb); seguir (#79, verb); quedar (#86, verb); mantener (#205, verb).

Quedar can remain, be situated, be left over or result in a state; seguir continues or follows; mantener sustains/preserves and can continue an activity; mantenerse can persist in a state; estar can also remain in a location/state.

**Qualification / implication for later test design:** “Stay” does not partition these verbs. Separate transitive mantener from mantenerse; keep remaining quantity, continued action and preservation as different tested senses. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE estar](https://dle.rae.es/estar), [DLE seguir](https://dle.rae.es/seguir), [DLE quedar](https://dle.rae.es/quedar), [DLE mantener](https://dle.rae.es/mantener). Frozen keys retained for provenance: estar, seguir, quedar, mantener.

### take-place

**Day 1:** dar (#38, verb); dejar (#75, verb); llevar (#77, verb); poner (#85, verb); tomar (#123, verb); recibir (#210, verb). **Outside comparison:** traer.

Llevar includes carry/take/wear; tomar includes take/grasp/drink; poner places something; dejar can leave it there; dar gives; recibir receives. Shared objects do not make these synonyms.

**Test implication (proposed):** Name the action and object: carry a bag, drink water, put an object somewhere, leave it behind. Verify overlap in the actual frame.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: dar, dejar, llevar, poner, tomar, recibir. Primary: [dejar](https://dle.rae.es/dejar).

### make

**Day 1:** hacer (#25, verb); crear (#134, verb); realizar (#137, verb); convertir (#222, verb); producir (#248, verb).

Hacer includes producing, fabricating and executing an action. Realizar carries an action out; crear produces something new; producir includes manufacture and causing a result; convertir transforms one thing into another.

**Qualification / implication for later test design:** The entries explicitly overlap. “Carry out a task” is not uniquely realizar, nor is making something necessarily distinct from hacer. No exclusive register division established. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE hacer](https://dle.rae.es/hacer), [DLE crear](https://dle.rae.es/crear), [DLE realizar](https://dle.rae.es/realizar), [DLE convertir](https://dle.rae.es/convertir), [DLE producir](https://dle.rae.es/producir). Frozen keys retained for provenance: hacer, crear, realizar, convertir, producir.

### perception

**Day 1:** ver (#39, verb); sentir (#128, verb); mirar (#140, verb).

Ver covers visual perception and watching; mirar directs attention/eyes and can also watch. Sentir can perceive sensations. The English see/watch division is not absolute.

**Test implication (proposed):** Use a concrete visual frame and recognize remaining ver/mirar overlap. “Watch” alone is insufficient.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: ver, sentir, mirar. Primary: [sentir](https://dle.rae.es/sentir), [ver](https://dle.rae.es/ver), [mirar](https://dle.rae.es/mirar).

### show

**Day 1:** presentar (#160, verb); mostrar (#239, verb).

Mostrar puts something on view or makes it known. Presentar also places something before someone, and includes introducing a person.

**Qualification / implication for later test design:** A generic display/show sense can admit both. Introduction and submission provide useful narrower senses, but exact proposed frames still need validation. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE presentar](https://dle.rae.es/presentar), [DLE mostrar](https://dle.rae.es/mostrar). Frozen keys retained for provenance: presentar, mostrar.

### speech

**Day 1:** decir (#33, verb); hablar (#91, verb); contar (#119, verb); llamar (#125, verb); explicar (#188, verb).

Decir expresses thoughts in words; hablar covers speaking and conversation; contar counts or recounts events; llamar attracts attention, telephones or names; explicar makes content/reasons clear.

**Qualification / implication for later test design:** Narrating, telling and explaining can overlap. Distinguish counting, telephoning and explanation of a cause rather than force exclusive mappings from “tell”. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE decir](https://dle.rae.es/decir), [DLE hablar](https://dle.rae.es/hablar), [DLE contar](https://dle.rae.es/contar), [DLE llamar](https://dle.rae.es/llamar), [DLE explicar](https://dle.rae.es/explicar). Frozen keys retained for provenance: decir, hablar, contar, llamar, explicar.

### ask

**Day 1:** preguntar (#217, verb); pedir (#229, verb).

Preguntar asks a question; pedir requests something or an action.

**Test implication (proposed):** Use ask a question versus request a glass of water, not bare “ask”.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: preguntar, pedir. Primary: [preguntar](https://dle.rae.es/preguntar), [pedir](https://dle.rae.es/pedir).

### find-meet

**Day 1:** encontrar (#81, verb); conocer (#118, verb); buscar (#161, verb).

Buscar searches/seeks; encontrar finds or encounters; conocer can mean become acquainted.

**Test implication (proposed):** Distinguish searching, finding, and first acquaintance. English “meet” needs a scenario.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: encontrar, conocer, buscar. Primary: [conocer](https://dle.rae.es/conocer).

### want-wait

**Day 1:** querer (#61, verb); esperar (#164, verb).

Querer includes desire, affection and intention. Esperar includes hope, expectation and waiting for a person/event or withholding action until something happens.

**Qualification / implication for later test design:** Expectation is not necessarily desire. “Wait” gives a clearer contrast than “hope/want”; do not impose a universal mood rule from this lexical distinction. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE querer](https://dle.rae.es/querer), [DLE esperar](https://dle.rae.es/esperar). Frozen keys retained for provenance: querer, esperar.

### modal-permission

**Day 1:** poder (#26, verb); deber (#62, verb); dejar (#75, verb); permitir (#146, verb).

Poder includes ability/possibility; deber obligation/owing; permitir and dejar overlap in allowing.

**Test implication (proposed):** Specify ability, obligation or allowing someone to act. “Allow” remains shared by permitir/dejar.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: poder, deber, dejar, permitir. Primary: [dejar](https://dle.rae.es/dejar).

### about-treatment

**Day 1:** hablar (#91, verb); tratar (#126, verb); considerar (#204, verb).

Tratar includes handling, managing, dealing with a person, discussing a topic and trying to achieve something. Considerar includes examining thoughtfully, judging and attending to something; hablar includes conversation.

**Qualification / implication for later test design:** Tratar de + infinitive can express trying; tratar de + topic can express subject matter. The preposition alone does not distinguish the senses. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE hablar](https://dle.rae.es/hablar), [DLE tratar](https://dle.rae.es/tratar), [DLE considerar](https://dle.rae.es/considerar). Frozen keys retained for provenance: hablar, tratar, considerar.

### source

**Day 1:** de (#2, preposition); desde (#50, preposition).

De marks possession, material and origin; importantly, it also marks a starting point in time or space. Desde marks a starting point and also a perspective.

**Qualification / implication for later test design:** Corrected: “from a starting point” is not exclusive to desde. De X a Y and desde X hasta Y are useful patterns, not proof that other combinations are wrong. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE de](https://dle.rae.es/de), [DLE desde](https://dle.rae.es/desde). Frozen keys retained for provenance: de, desde.

### direction

**Day 1:** a (#5, preposition); para (#15, preposition); hacia (#150, preposition).

A can mark a destination; hacia direction toward; para can also indicate direction/destination.

**Test implication (proposed):** Clarify direction versus endpoint without claiming a universal exclusive split. The frozen a entry is empty; the DEM entry supplies destination and arrival-point evidence.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: para, hacia. Primary: [para](https://dle.rae.es/para), [a](https://dem.colmex.mx/ver/a).

### location-topic

**Day 1:** en (#4, preposition); sobre (#40, preposition); entre (#42, preposition); dentro (#242, adverb).

En locates in/on/at; sobre can mean on/above/about; dentro is inside and normally takes de for a complement; entre is between/among.

**Test implication (proposed):** Use a specific spatial relationship or topic sense. English “on” needs a scene.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: en, sobre, entre, dentro. Primary: [dentro](https://www.rae.es/dpd/dentro).

### before

**Day 1:** antes (#106, adverb); ante (#158, preposition).

Antes is earlier/before in time and takes de before a nominal complement; ante is a preposition for before/in the presence of/in the face of.

**Test implication (proposed):** Use before a time versus in the presence of a person; avoid bare “before”.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: antes, ante. Primary: [antes](https://www.rae.es/dpd/antes).

### duration

**Day 1:** cuando (#41, adverb); durante (#95, preposition); mientras (#195, conjunction).

Durante is a preposition marking simultaneity with a period/event. Mientras has temporal adverb and conjunction uses; a subjunctive clause may add a conditional shade. Mientras que can be temporal as well as contrastive. Cuando locates a time and has further connective uses.

**Qualification / implication for later test design:** Corrected: do not teach mientras que as contrast-only. A noun-complement versus clause frame distinguishes selected durante/mientras uses; it is not a universal account of cuando. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE cuando](https://dle.rae.es/cuando), [DLE durante](https://dle.rae.es/durante), [DLE mientras](https://dle.rae.es/mientras), [DPD mientras](https://www.rae.es/dpd/mientras). Frozen keys retained for provenance: cuando, durante, mientras.

### addition

**Day 1:** y (#3, conjunction); también (#43, adverb); además (#170, adverb).

También adds an entity/event alongside one mentioned; además introduces additional information and additionally occurs in además de. Y coordinates affirmatively.

**Qualification / implication for later test design:** Also/in addition overlap. Discourse position or a different English synonym alone does not guarantee a unique answer. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE y](https://dle.rae.es/y), [DLE también](https://dle.rae.es/tambi%C3%A9n), [DLE además](https://dle.rae.es/adem%C3%A1s). Frozen keys retained for provenance: y, también, además.

### cause-consequence

**Day 1:** como (#18, conjunction); porque (#51, conjunction); entonces (#144, adverb); luego (#155, adverb); pues (#171, conjunction).

Porque supplies a reason; causal como/pues can also supply reasons. Pues/entonces/luego can express consequence or inference in appropriate uses.

**Test implication (proposed):** Use the exact connective role and clause frame. Many remain alternatives; do not pool all senses under “so”.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: como, porque, entonces, luego, pues. Primary: [entonces](https://dle.rae.es/entonces), [luego](https://dle.rae.es/luego).

### contrast

**Day 1:** pero (#30, conjunction); aunque (#93, conjunction); sino (#133, conjunction).

Pero contrasts; sino corrects/replaces following negation; aunque introduces concession (although/even if).

**Test implication (proposed):** Use “not X but rather Y” for sino and an explicit concessive clause for aunque.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: pero, aunque, sino. Primary: [sino](https://www.rae.es/dpd/sino).

### relative-question

**Day 1:** que (#7, relative); que (#10, conjunction); como (#18, conjunction); cuando (#41, adverb); qué (#56, interrogative); donde (#73, adverb); quien (#82, relative); cómo (#108, adverb); cual (#148, relative).

Relative que can refer to people/things; quien to people; el cual and forms are relative constructions. Que also introduces clauses. Qué/cómo mark interrogative or exclamative functions, including indirect questions.

**Test implication (proposed):** Show syntactic role and any required article. Do not equate English who/which/that with a unique form. Frozen cual is incomplete for the target relative sense; DPD supplies the relative constructions.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: que, como, cuando, qué, donde, quien, cómo, cual. Primary: [cual](https://www.rae.es/dpd/cual).

### personal-pronouns

**Day 1:** se (#9, personal pronoun); lo (#16, personal pronoun); le (#22, personal pronoun); me (#24, personal pronoun); él (#31, personal pronoun); nos (#45, personal pronoun); te (#48, personal pronoun); yo (#60, personal pronoun); mí (#191, personal pronoun).

Subject, prepositional and clitic object forms are different grammatical choices despite shared English translations. Se has reflexive, reciprocal, impersonal, passive and le/les replacement uses; lo/le distinctions have regional qualifications.

**Test implication (proposed):** Use explicit grammatical role plus person/number. Do not automatically accept every “him/it” translation; check leísmo against primary grammar before sentence-level exclusions.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: se, lo, le, me, él, nos, te, yo, mí. Primary: [leísmo](https://www.rae.es/dpd/le%C3%ADsmo).

### possessives

**Day 1:** suyo (#11, possessive); mío (#37, possessive); nuestro (#74, possessive); tuyo (#127, possessive).

Mío refers to the speaker; nuestro to us (also special singular institutional/royal uses). Tuyo corresponds to tú and modern American vos. Suyo corresponds to él/ella/ellos/ellas and usted/ustedes.

**Qualification / implication for later test design:** Corrected: suyo is not “formal yours” only. Ustedes is used for both formal and informal plural address throughout the Americas. Specify the possessor pronoun; agreement reflects the possessed noun. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE suyo](https://dle.rae.es/suyo), [DLE mío](https://dle.rae.es/m%C3%ADo), [DLE nuestro](https://dle.rae.es/nuestro), [DLE tuyo](https://dle.rae.es/tuyo), [DPD usted](https://www.rae.es/dpd/usted), [DPD voseo](https://www.rae.es/dpd/voseo). Frozen keys retained for provenance: suyo, mío, nuestro, tuyo.

### accent-function

**Day 1:** el (#1, article); que (#7, relative); que (#10, conjunction); como (#18, conjunction); él (#31, personal pronoun); si (#36, conjunction); qué (#56, interrogative); cómo (#108, adverb); sí (#117, adverb).

Accent/function pairs are not synonyms: article versus pronoun, if versus yes, relative/conjunction versus question/exclamation.

**Test implication (proposed):** Clarify function in the cue and preserve accent-sensitive grading.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: el, que, como, él, si, qué, cómo, sí. Primary: [tilde](https://www.rae.es/dpd/tilde).

### one

**Day 1:** un (#6, article); uno (#46, numeral); solo (#63, adverb); uno (#199, quantifier); único (#223, adjective).

Un(o) has article, numeral and indefinite-pronoun uses. Solo is “only” in the target adverb card; adjectival solo can also mean sole or alone. Único is adjectival sole/unique.

**Qualification / implication for later test design:** These are partly form/function contrasts, not separate semantic boxes. Do not accept solo as equivalent to único without matching the adjective/adverb construction. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE uno](https://dle.rae.es/uno), [DLE solo](https://dle.rae.es/solo), [DLE único](https://dle.rae.es/%C3%BAnico), [DPD uno](https://www.rae.es/dpd/uno). Frozen keys retained for provenance: un, uno, solo, único.

### quantifiers

**Day 1:** todo (#28, quantifier); otro (#32, quantifier); alguno (#57, quantifier); mucho (#67, quantifier); cada (#80, quantifier); algo (#111, quantifier); nada (#138, quantifier); poco (#175, quantifier); varios (#187, quantifier); mucho (#196, adverb); ninguno (#203, quantifier); cualquiera (#241, quantifier).

Todo marks entirety and can also distribute over each member; cada individualizes/distributes. Alguno marks an unspecified entity/quantity; cualquiera can select any member or generalize; ninguno negates existence. Algo/nada and mucho/poco distinguish entity/quantity uses. Varios and algunos overlap as an unspecified small plurality.

**Qualification / implication for later test design:** Corrected: no hard some-versus-several number threshold. Alguno also has a negative use after a noun; negative concord and algún/ningún/cualquier forms depend on construction. Bare “any” is insufficient. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE todo](https://dle.rae.es/todo), [DLE otro](https://dle.rae.es/otro), [DLE alguno](https://dle.rae.es/alguno), [DLE mucho](https://dle.rae.es/mucho), [DLE cada](https://dle.rae.es/cada), [DLE algo](https://dle.rae.es/algo), [DLE nada](https://dle.rae.es/nada), [DLE poco](https://dle.rae.es/poco), [DLE varios](https://dle.rae.es/varios), [DLE ninguno](https://dle.rae.es/ninguno), [DLE cualquiera](https://dle.rae.es/cualquiera), [DPD alguno](https://www.rae.es/dpd/alguno), [DPD ninguno](https://www.rae.es/dpd/ninguno), [DPD cualquiera](https://www.rae.es/dpd/cualquiera). Frozen keys retained for provenance: todo, otro, alguno, mucho, cada, algo, nada, poco, varios, ninguno, cualquiera.

### degree

**Day 1:** más (#23, adverb); muy (#49, adverb); mucho (#67, quantifier); tan (#109, adverb); menos (#159, adverb); casi (#172, adverb); más (#176, quantifier); mucho (#196, adverb); tanto (#218, adverb).

Muy normally precedes noncomparative adjectives/adverbs; mucho modifies verbs and comparatives, and agrees when used as a determiner. Tan is the usual shortened adverbial tanto before adjectives/adverbs; full tanto modifies verbs. Más/menos quantify or compare; casi marks near approximation.

**Qualification / implication for later test design:** Corrected: “before an adjective” alone cannot select muy: comparatives normally take mucho. Tanto remains full before comparatives and in un tanto. Choose a concrete construction, not a universal word-order rule. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE más](https://dle.rae.es/m%C3%A1s), [DLE muy](https://dle.rae.es/muy), [DLE mucho](https://dle.rae.es/mucho), [DLE tan](https://dle.rae.es/tan), [DLE menos](https://dle.rae.es/menos), [DLE casi](https://dle.rae.es/casi), [DLE tanto](https://dle.rae.es/tanto), [DPD mucho](https://www.rae.es/dpd/mucho), [DPD tanto](https://www.rae.es/dpd/tanto). Frozen keys retained for provenance: más, muy, mucho, tan, menos, casi, tanto.

### quality

**Day 1:** bueno (#87, adjective); bien (#105, adverb); mejor (#145, adjective).

Bueno is adjectival good, including a healthy sense. Bien can mean correctly, satisfactorily or in good health; mejor compares either bueno or bien. Bien can also intensify an adjective/adverb similarly to muy.

**Qualification / implication for later test design:** Healthy/fine is not an exclusive bueno/bien split. A specific noun-quality versus manner-of-action frame is more useful; relative-superlative context must be explicit for best. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE bueno](https://dle.rae.es/bueno), [DLE bien](https://dle.rae.es/bien), [DLE mejor](https://dle.rae.es/mejor), [DPD bien](https://www.rae.es/dpd/bien), [DPD mejor](https://www.rae.es/dpd/mejor). Frozen keys retained for provenance: bueno, bien, mejor.

### size

**Day 1:** grande (#71, adjective); mayor (#103, adjective); alto (#182, adjective); pequeño (#212, adjective); largo (#228, adjective).

Grande denotes size/importance and can describe a tall or grown person. Mayor can be comparative larger/older, but also noncomparative grown-up or elderly. Alto specifies height among other senses; largo length/duration; pequeño small, short or young.

**Qualification / implication for later test design:** Corrected: do not teach mayor as always comparative, or grande as never tall/old. Dimension and comparison can narrow the intended sense without eliminating all overlap. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE grande](https://dle.rae.es/grande), [DLE mayor](https://dle.rae.es/mayor), [DLE alto](https://dle.rae.es/alto), [DLE pequeño](https://dle.rae.es/peque%C3%B1o), [DLE largo](https://dle.rae.es/largo), [DPD mayor](https://www.rae.es/dpd/mayor). Frozen keys retained for provenance: grande, mayor, alto, pequeño, largo.

### identity

**Day 1:** otro (#32, quantifier); mismo (#55, quantifier); propio (#142, adjective); único (#223, adjective).

Mismo identifies the same entity, equal properties or emphatic self/very; propio marks exclusive belonging, characteristic properties and emphatic reference. Otro adds or distinguishes an entity; único means sole or exceptional.

**Qualification / implication for later test design:** Mismo and propio overlap in emphasis. Belonging versus identity is a useful selected-sense contrast, not a complete exclusive partition. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE otro](https://dle.rae.es/otro), [DLE mismo](https://dle.rae.es/mismo), [DLE propio](https://dle.rae.es/propio), [DLE único](https://dle.rae.es/%C3%BAnico). Frozen keys retained for provenance: otro, mismo, propio, único.

### time-nouns

**Day 1:** vez (#58, noun); día (#59, noun); tiempo (#72, noun); momento (#98, noun); hora (#129, noun).

Tiempo includes duration, available time, era and weather; vez an occurrence or turn; hora a 60-minute unit, specified time or occasion; momento a brief interval but also a longer period distinguished by circumstances; día a day.

**Qualification / implication for later test design:** Corrected: momento is not always a tiny instant and hora is not only clock time. Use a specific unit/occurrence/duration sense; broad “moment/time” remains overlapping. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE vez](https://dle.rae.es/vez), [DLE día](https://dle.rae.es/d%C3%ADa), [DLE tiempo](https://dle.rae.es/tiempo), [DLE momento](https://dle.rae.es/momento), [DLE hora](https://dle.rae.es/hora). Frozen keys retained for provenance: vez, día, tiempo, momento, hora.

### work

**Day 1:** trabajo (#110, noun); trabajar (#181, verb); obra (#184, noun); estudio (#194, noun).

Trabajo includes employment, activity and its produced result. Obra includes a produced thing, intellectual/artistic work and construction. Estudio includes learning, an analytical work and a studio; trabajar is the verb.

**Qualification / implication for later test design:** Corrected: “work as a product” is not exclusive to obra. Artistic/construction context is informative but not a guarantee that trabajo is wrong. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE trabajo](https://dle.rae.es/trabajo), [DLE trabajar](https://dle.rae.es/trabajar), [DLE obra](https://dle.rae.es/obra), [DLE estudio](https://dle.rae.es/estudio). Frozen keys retained for provenance: trabajo, trabajar, obra, estudio.

### people

**Day 1:** persona (#78, noun); mujer (#88, noun); hombre (#112, noun); niño (#120, noun); hijo (#139, noun); gente (#201, noun); humano (#235, adjective).

Persona identifies an individual; gente is generally a collective noncount noun, but also a countable individual in some American usage. Niño denotes a child by life stage; hijo a relation to parents, including an adult child. Hombre/mujer include adult male/female senses and partner senses; humano is adjectival in this card.

**Qualification / implication for later test design:** Corrected: do not state that gente can never mean one person. The age-versus-parentage distinction is useful; English “child” alone is underdetermined. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE persona](https://dle.rae.es/persona), [DLE mujer](https://dle.rae.es/mujer), [DLE hombre](https://dle.rae.es/hombre), [DLE niño](https://dle.rae.es/ni%C3%B1o), [DLE hijo](https://dle.rae.es/hijo), [DLE gente](https://dle.rae.es/gente), [DLE humano](https://dle.rae.es/humano), [DPD gente](https://www.rae.es/dpd/gente). Frozen keys retained for provenance: persona, mujer, hombre, niño, hijo, gente, humano.

### manner

**Day 1:** forma (#101, noun); manera (#154, noun); tipo (#166, noun).

Forma can mean shape or manner; manera manner/way; tipo kind/type (and other senses). Forma/manera genuinely overlap as way of doing something.

**Test implication (proposed):** Shape distinguishes a forma sense; a generic “way/manner” does not fairly distinguish forma/manera.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: forma, manera, tipo. Primary: [forma](https://dle.rae.es/forma), [manera](https://dle.rae.es/manera).

### condition

**Day 1:** caso (#131, noun); estado (#135, noun); situación (#234, noun).

Estado and situación explicitly overlap as condition/state of affairs. Estado additionally denotes a political state; situación can locate something. Caso can be an occurrence, circumstance, matter under consideration or legal case.

**Qualification / implication for later test design:** No source basis for a rigid internal-state/external-situation split. A legal-case or political-state sense can help; ordinary condition prompts may still admit overlap. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE caso](https://dle.rae.es/caso), [DLE estado](https://dle.rae.es/estado), [DLE situación](https://dle.rae.es/situaci%C3%B3n). Frozen keys retained for provenance: caso, estado, situación.

### place-part

**Day 1:** parte (#69, noun); lugar (#121, noun); punto (#149, noun); centro (#206, noun); nivel (#207, noun); lado (#209, noun).

Parte is a portion and can also be a place; lado a side/face and also a place; lugar a location; punto can be a location as well as a mark or score; centro a middle/center and institution/hub; nivel a height, degree or rank.

**Qualification / implication for later test design:** Generic place/spot/side prompts still overlap. Select a concrete geometry, portion, score or level sense rather than relying on a supposedly exclusive English noun. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE parte](https://dle.rae.es/parte), [DLE lugar](https://dle.rae.es/lugar), [DLE punto](https://dle.rae.es/punto), [DLE centro](https://dle.rae.es/centro), [DLE nivel](https://dle.rae.es/nivel), [DLE lado](https://dle.rae.es/lado). Frozen keys retained for provenance: parte, lugar, punto, centro, nivel, lado.

### collective

**Day 1:** grupo (#136, noun); equipo (#190, noun).

Grupo is a set of beings or things, and can be an organized performing group or set of apparatus. Equipo includes an organized team and equipment for a purpose.

**Qualification / implication for later test design:** Corrected: organized versus unorganized is not a categorical distinction. Team is more specific, but an organized team can also be called a grupo. Equipment is not a universal exclusion either. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE grupo](https://dle.rae.es/grupo), [DLE equipo](https://dle.rae.es/equipo). Frozen keys retained for provenance: grupo, equipo.

### political

**Day 1:** país (#70, noun); nacional (#116, adjective); gobierno (#122, noun); social (#124, adjective); estado (#135, noun); público (#157, adjective); político (#174, adjective); político (#249, noun).

País can mean a sovereign country or a geographic/cultural territory within a state. Estado includes sovereign political organization, its governing institutions and a federal subdivision. Gobierno includes the executive governing body. Nacional, público, social and político specify different relations; político can also name a person.

**Qualification / implication for later test design:** Corrected: country is not always sovereign; state is not always a subdivision. “Government” and “state” can refer to overlapping institutions. Use a specified sense and preserve adjective/person-noun distinction. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE país](https://dle.rae.es/pa%C3%ADs), [DLE nacional](https://dle.rae.es/nacional), [DLE gobierno](https://dle.rae.es/gobierno), [DLE social](https://dle.rae.es/social), [DLE estado](https://dle.rae.es/estado), [DLE público](https://dle.rae.es/p%C3%BAblico), [DLE político](https://dle.rae.es/pol%C3%ADtico). Frozen keys retained for provenance: país, nacional, gobierno, social, estado, público, político.

### development

**Day 1:** proceso (#178, noun); cambio (#180, noun); proyecto (#214, noun); desarrollo (#230, noun).

Proceso denotes successive phases or a course of events (also judicial proceedings); desarrollo development/unfolding and economic development; cambio change/exchange; proyecto a plan/design for carrying something out.

**Qualification / implication for later test design:** Proceso and desarrollo can describe the same unfolding. Do not invent a required improvement sense for every desarrollo or accept all four merely because they concern change. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE proceso](https://dle.rae.es/proceso), [DLE cambio](https://dle.rae.es/cambio), [DLE proyecto](https://dle.rae.es/proyecto), [DLE desarrollo](https://dle.rae.es/desarrollo). Frozen keys retained for provenance: proceso, cambio, proyecto, desarrollo.

### communication-nouns

**Day 1:** historia (#151, noun); cuenta (#185, noun); palabra (#237, noun); información (#240, noun); relación (#244, noun); tema (#245, noun).

Historia includes past events, their study and a true or invented narrative; relación includes connection, personal dealings, list or account of events. Cuenta includes calculation, financial account and accounting/explanation for conduct. Tema is subject matter; información communicated knowledge; palabra a linguistic unit.

**Qualification / implication for later test design:** Corrected: English account must be disambiguated. A bank account points to cuenta; a narrative account can be relación/historia. Cuenta is not automatically a standalone synonym of story (cuento). Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE historia](https://dle.rae.es/historia), [DLE cuenta](https://dle.rae.es/cuenta), [DLE palabra](https://dle.rae.es/palabra), [DLE información](https://dle.rae.es/informaci%C3%B3n), [DLE relación](https://dle.rae.es/relaci%C3%B3n), [DLE tema](https://dle.rae.es/tema). Frozen keys retained for provenance: historia, cuenta, palabra, información, relación, tema.

### life

**Day 1:** vida (#76, noun); vivir (#143, verb); existir (#186, verb).

Vida is the noun life; vivir includes being alive and residing somewhere; existir includes reality/existence and also being alive.

**Qualification / implication for later test design:** The being-alive senses genuinely overlap. Residence provides a useful selected vivir sense; noun-versus-verb is a separate cue. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE vida](https://dle.rae.es/vida), [DLE vivir](https://dle.rae.es/vivir), [DLE existir](https://dle.rae.es/existir). Frozen keys retained for provenance: vida, vivir, existir.

### frequency

**Day 1:** cada (#80, quantifier); siempre (#99, adverb); nunca (#168, adverb).

Siempre denotes all times; nunca no time/no occasion; cada distributes over members and can specify recurrence with a number and unit.

**Qualification / implication for later test design:** These are contrast/paraphrase candidates, not interchangeable one-word answers. Always and every time require different constructions; neither licenses changing negation. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE cada](https://dle.rae.es/cada), [DLE siempre](https://dle.rae.es/siempre), [DLE nunca](https://dle.rae.es/nunca). Frozen keys retained for provenance: cada, siempre, nunca.

### negation-coordination

**Day 1:** y (#3, conjunction); no (#13, adverb); o (#29, conjunction); sin (#47, preposition); ni (#83, conjunction).

No negates; ni joins negative elements and also means not even in selected uses; sin marks absence and introduces negative infinitive expressions. Y adds/co-ordinates; o expresses alternatives or reformulation/equivalence.

**Qualification / implication for later test design:** “And/or” explanations describe selected functions; o need not be an exclusive choice. Negative concord is grammatical: adding no before a later negative item need not reverse meaning. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE y](https://dle.rae.es/y), [DLE no](https://dle.rae.es/no), [DLE o](https://dle.rae.es/o), [DLE sin](https://dle.rae.es/sin), [DLE ni](https://dle.rae.es/ni). Frozen keys retained for provenance: y, no, o, sin, ni.

### boundary

**Day 1:** entre (#42, preposition); desde (#50, preposition); hasta (#64, preposition); durante (#95, preposition).

Hasta marks an endpoint in time/space/quantity; desde a starting point; entre between/among or within; durante simultaneity over a period. Hasta also means even as an adverb.

**Qualification / implication for later test design:** Corrected: temporal hasta can mean not before in parts of the Americas. Do not turn an isolated deadline example into a universal polarity rule. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE entre](https://dle.rae.es/entre), [DLE desde](https://dle.rae.es/desde), [DLE hasta](https://dle.rae.es/hasta), [DLE durante](https://dle.rae.es/durante), [DPD hasta](https://www.rae.es/dpd/hasta). Frozen keys retained for provenance: entre, desde, hasta, durante.

### method

**Day 1:** como (#18, conjunction); así (#92, adverb); forma (#101, noun); manera (#154, noun); sistema (#162, noun); medio (#189, noun).

Medio can be a means; sistema a system/method; manera and forma ways of doing something; así means in this way and como can introduce manner/comparison. These are different grammatical forms with overlapping descriptions.

**Test implication (proposed):** Specify means/tool, organized method, manner noun or manner adverb. Do not use bare “way” for all of them.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: como, así, forma, manera, sistema, medio. Primary: [forma](https://dle.rae.es/forma), [manera](https://dle.rae.es/manera).

### order

**Day 1:** primero (#53, numeral); después (#84, adverb); último (#90, adjective); antes (#106, adverb); segundo (#179, numeral).

Primero/segundo are ordinals in the target cards; último is last; antes/después express relative order or time. Related ordering concepts are not interchangeable parts of speech.

**Test implication (proposed):** State ordinal position versus before/after, and retain the requested headword form.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: primero, después, último, antes, segundo. Primary: [antes](https://www.rae.es/dpd/antes), [después](https://www.rae.es/dpd/despu%C3%A9s).

### means

**Day 1:** con (#12, preposition); por (#14, preposition).

Con can express accompaniment or an instrument; por can express means/channel. English “with/by” requires a particular relation.

**Test implication (proposed):** Give the instrument or communication channel; do not map every use of “by” to por.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: con, por. Primary: [por](https://dle.rae.es/por).

### present-time

**Day 1:** ahora (#89, adverb); hoy (#153, adverb).

Hoy refers to this day and also the present era. Ahora refers to this moment/current time and can extend to the recent past or near future.

**Qualification / implication for later test design:** Corrected: neither word has only its narrow calendar/moment sense. A clearly anchored this-day versus this-moment prompt can select the intended reading. Proposed only; no new prompt or answer-list implementation.

**Evidence:** Primary review completed October 30 for these stated distinctions. [DLE ahora](https://dle.rae.es/ahora), [DLE hoy](https://dle.rae.es/hoy). Frozen keys retained for provenance: ahora, hoy.

### memory

**Day 1:** saber (#52, verb); recordar (#202, verb).

Recordar retrieves or retains something in memory and can remind someone; saber is knowing. A remembered fact is also known, but “remember” and “know” do not test the same action.

**Test implication (proposed):** Use recall a past event rather than know a fact; check the object and whether the intended meaning is remind.

**Evidence:** targeted primary-source comparison plus frozen lexical entries. Frozen keys: saber, recordar. Primary: [saber](https://dle.rae.es/saber).

## Complete screening coverage

An ungrouped card means no priority collision was identified in this screen, not that the word has no synonyms. Every card remains in scope for later prompt validation.

| Rank | Lemma | Part of speech | Candidate groups |
| --- | --- | --- | --- |
| 1 | el | article | accent-function |
| 2 | de | preposition | source |
| 3 | y | conjunction | addition, negation-coordination |
| 4 | en | preposition | location-topic |
| 5 | a | preposition | direction |
| 6 | un | article | one |
| 7 | que | relative | relative-question, accent-function |
| 8 | ser | verb | being |
| 9 | se | personal pronoun | personal-pronouns |
| 10 | que | conjunction | relative-question, accent-function |
| 11 | suyo | possessive | possessives |
| 12 | con | preposition | means |
| 13 | no | adverb | negation-coordination |
| 14 | por | preposition | for, means |
| 15 | para | preposition | for, direction |
| 16 | lo | personal pronoun | personal-pronouns |
| 17 | este | demonstrative | demonstratives |
| 18 | como | conjunction | cause-consequence, relative-question, accent-function, method |
| 19 | estar | verb | being, remain-continue |
| 20 | tener | verb | attainment, possession-existence |
| 21 | ir | verb | leave, movement |
| 22 | le | personal pronoun | personal-pronouns |
| 23 | más | adverb | degree |
| 24 | me | personal pronoun | personal-pronouns |
| 25 | hacer | verb | make |
| 26 | poder | verb | modal-permission |
| 27 | ese | demonstrative | demonstratives |
| 28 | todo | quantifier | quantifiers |
| 29 | o | conjunction | negation-coordination |
| 30 | pero | conjunction | contrast |
| 31 | él | personal pronoun | personal-pronouns, accent-function |
| 32 | otro | quantifier | quantifiers, identity |
| 33 | decir | verb | speech |
| 34 | año | noun | Screened; no priority collision identified |
| 35 | haber | verb | possession-existence |
| 36 | si | conjunction | accent-function |
| 37 | mío | possessive | possessives |
| 38 | dar | verb | take-place |
| 39 | ver | verb | perception |
| 40 | sobre | preposition | location-topic |
| 41 | cuando | adverb | duration, relative-question |
| 42 | entre | preposition | location-topic, boundary |
| 43 | también | adverb | addition |
| 44 | ya | adverb | continuing-time |
| 45 | nos | personal pronoun | personal-pronouns |
| 46 | uno | numeral | one |
| 47 | sin | preposition | negation-coordination |
| 48 | te | personal pronoun | personal-pronouns |
| 49 | muy | adverb | degree |
| 50 | desde | preposition | source, boundary |
| 51 | porque | conjunction | cause-consequence |
| 52 | saber | verb | knowledge, memory |
| 53 | primero | numeral | order |
| 54 | dos | numeral | Screened; no priority collision identified |
| 55 | mismo | quantifier | identity |
| 56 | qué | interrogative | relative-question, accent-function |
| 57 | alguno | quantifier | quantifiers |
| 58 | vez | noun | time-nouns |
| 59 | día | noun | time-nouns |
| 60 | yo | personal pronoun | personal-pronouns |
| 61 | querer | verb | want-wait |
| 62 | deber | verb | modal-permission |
| 63 | solo | adverb | one |
| 64 | hasta | preposition | boundary |
| 65 | nuevo | adjective | Screened; no priority collision identified |
| 66 | pasar | verb | movement |
| 67 | mucho | quantifier | quantifiers, degree |
| 68 | llegar | verb | movement |
| 69 | parte | noun | place-part |
| 70 | país | noun | political |
| 71 | grande | adjective | size |
| 72 | tiempo | noun | time-nouns |
| 73 | donde | adverb | relative-question |
| 74 | nuestro | possessive | possessives |
| 75 | dejar | verb | leave, take-place, modal-permission |
| 76 | vida | noun | life |
| 77 | llevar | verb | take-place |
| 78 | persona | noun | people |
| 79 | seguir | verb | remain-continue |
| 80 | cada | quantifier | quantifiers, frequency |
| 81 | encontrar | verb | find-meet |
| 82 | quien | relative | relative-question |
| 83 | ni | conjunction | negation-coordination |
| 84 | después | adverb | sequence, order |
| 85 | poner | verb | take-place |
| 86 | quedar | verb | remain-continue |
| 87 | bueno | adjective | quality |
| 88 | mujer | noun | people |
| 89 | ahora | adverb | continuing-time, present-time |
| 90 | último | adjective | order |
| 91 | hablar | verb | speech, about-treatment |
| 92 | así | adverb | method |
| 93 | aunque | conjunction | contrast |
| 94 | parecer | verb | thought |
| 95 | durante | preposition | duration, boundary |
| 96 | aquel | demonstrative | demonstratives |
| 97 | mundo | noun | Screened; no priority collision identified |
| 98 | momento | noun | time-nouns |
| 99 | siempre | adverb | frequency |
| 100 | pensar | verb | thought |
| 101 | forma | noun | manner, method |
| 102 | casa | noun | Screened; no priority collision identified |
| 103 | mayor | adjective | size |
| 104 | volver | verb | movement |
| 105 | bien | adverb | quality |
| 106 | antes | adverb | before, order |
| 107 | tres | numeral | Screened; no priority collision identified |
| 108 | cómo | adverb | relative-question, accent-function |
| 109 | tan | adverb | degree |
| 110 | trabajo | noun | work |
| 111 | algo | quantifier | quantifiers |
| 112 | hombre | noun | people |
| 113 | cosa | noun | Screened; no priority collision identified |
| 114 | creer | verb | thought |
| 115 | salir | verb | leave, movement |
| 116 | nacional | adjective | political |
| 117 | sí | adverb | accent-function |
| 118 | conocer | verb | knowledge, find-meet |
| 119 | contar | verb | speech |
| 120 | niño | noun | people |
| 121 | lugar | noun | place-part |
| 122 | gobierno | noun | political |
| 123 | tomar | verb | take-place |
| 124 | social | adjective | political |
| 125 | llamar | verb | speech |
| 126 | tratar | verb | about-treatment |
| 127 | tuyo | possessive | possessives |
| 128 | sentir | verb | thought, perception |
| 129 | hora | noun | time-nouns |
| 130 | venir | verb | movement |
| 131 | caso | noun | condition |
| 132 | mano | noun | Screened; no priority collision identified |
| 133 | sino | conjunction | contrast |
| 134 | crear | verb | make |
| 135 | estado | noun | condition, political |
| 136 | grupo | noun | collective |
| 137 | realizar | verb | make |
| 138 | nada | quantifier | quantifiers |
| 139 | hijo | noun | people |
| 140 | mirar | verb | perception |
| 141 | según | preposition | Screened; no priority collision identified |
| 142 | propio | adjective | identity |
| 143 | vivir | verb | life |
| 144 | entonces | adverb | sequence, cause-consequence |
| 145 | mejor | adjective | quality |
| 146 | permitir | verb | modal-permission |
| 147 | importante | adjective | Screened; no priority collision identified |
| 148 | cual | relative | relative-question |
| 149 | punto | noun | place-part |
| 150 | hacia | preposition | direction |
| 151 | historia | noun | communication-nouns |
| 152 | millón | noun | Screened; no priority collision identified |
| 153 | hoy | adverb | present-time |
| 154 | manera | noun | manner, method |
| 155 | luego | adverb | sequence, cause-consequence |
| 156 | padre | noun | Screened; no priority collision identified |
| 157 | público | adjective | political |
| 158 | ante | preposition | before |
| 159 | menos | adverb | degree |
| 160 | presentar | verb | show |
| 161 | buscar | verb | find-meet |
| 162 | sistema | noun | method |
| 163 | problema | noun | Screened; no priority collision identified |
| 164 | esperar | verb | want-wait |
| 165 | presidente | noun | Screened; no priority collision identified |
| 166 | tipo | noun | manner |
| 167 | contra | preposition | Screened; no priority collision identified |
| 168 | nunca | adverb | frequency |
| 169 | ciudad | noun | Screened; no priority collision identified |
| 170 | además | adverb | addition |
| 171 | pues | conjunction | cause-consequence |
| 172 | casi | adverb | degree |
| 173 | mes | noun | Screened; no priority collision identified |
| 174 | político | adjective | political |
| 175 | poco | quantifier | quantifiers |
| 176 | más | quantifier | degree |
| 177 | partido | noun | Screened; no priority collision identified |
| 178 | proceso | noun | development |
| 179 | segundo | numeral | order |
| 180 | cambio | noun | development |
| 181 | trabajar | verb | work |
| 182 | alto | adjective | size |
| 183 | empezar | verb | begin |
| 184 | obra | noun | work |
| 185 | cuenta | noun | communication-nouns |
| 186 | existir | verb | possession-existence, life |
| 187 | varios | quantifier | quantifiers |
| 188 | explicar | verb | speech |
| 189 | medio | noun | method |
| 190 | equipo | noun | collective |
| 191 | mí | personal pronoun | personal-pronouns |
| 192 | noche | noun | Screened; no priority collision identified |
| 193 | tras | preposition | sequence |
| 194 | estudio | noun | work |
| 195 | mientras | conjunction | duration |
| 196 | mucho | adverb | quantifiers, degree |
| 197 | agua | noun | Screened; no priority collision identified |
| 198 | aquí | adverb | Screened; no priority collision identified |
| 199 | uno | quantifier | one |
| 200 | empresa | noun | Screened; no priority collision identified |
| 201 | gente | noun | people |
| 202 | recordar | verb | memory |
| 203 | ninguno | quantifier | quantifiers |
| 204 | considerar | verb | thought, about-treatment |
| 205 | mantener | verb | remain-continue |
| 206 | centro | noun | place-part |
| 207 | nivel | noun | place-part |
| 208 | perder | verb | Screened; no priority collision identified |
| 209 | lado | noun | place-part |
| 210 | recibir | verb | attainment, take-place |
| 211 | abrir | verb | Screened; no priority collision identified |
| 212 | pequeño | adjective | size |
| 213 | servicio | noun | Screened; no priority collision identified |
| 214 | proyecto | noun | development |
| 215 | lograr | verb | attainment |
| 216 | general | adjective | Screened; no priority collision identified |
| 217 | preguntar | verb | ask |
| 218 | tanto | adverb | degree |
| 219 | ejemplo | noun | Screened; no priority collision identified |
| 220 | madre | noun | Screened; no priority collision identified |
| 221 | libro | noun | Screened; no priority collision identified |
| 222 | convertir | verb | make |
| 223 | único | adjective | one, identity |
| 224 | familia | noun | Screened; no priority collision identified |
| 225 | salud | noun | Screened; no priority collision identified |
| 226 | semana | noun | Screened; no priority collision identified |
| 227 | comenzar | verb | begin |
| 228 | largo | adjective | size |
| 229 | pedir | verb | ask |
| 230 | desarrollo | noun | development |
| 231 | derecho | noun | Screened; no priority collision identified |
| 232 | entrar | verb | movement |
| 233 | escribir | verb | Screened; no priority collision identified |
| 234 | situación | noun | condition |
| 235 | humano | adjective | people |
| 236 | aún | adverb | continuing-time |
| 237 | palabra | noun | communication-nouns |
| 238 | cuerpo | noun | Screened; no priority collision identified |
| 239 | mostrar | verb | show |
| 240 | información | noun | communication-nouns |
| 241 | cualquiera | quantifier | quantifiers |
| 242 | dentro | adverb | location-topic |
| 243 | entender | verb | knowledge |
| 244 | relación | noun | communication-nouns |
| 245 | tema | noun | communication-nouns |
| 246 | económico | adjective | Screened; no priority collision identified |
| 247 | ojo | noun | Screened; no priority collision identified |
| 248 | producir | verb | make |
| 249 | político | noun | political |
| 250 | cuatro | numeral | Screened; no priority collision identified |

Usage follow-up (October 30): [Krohn 2025](https://www.canela.org.es/cuadernos-canela/index.php/cuadernos/article/view/303) supplies corpus evidence for register/regional tendencies in empezar/comenzar. The earlier finding rules out an exclusive formal/informal split, not all usage differences. See the [rechecked prompt draft](lemma-day1-prompt-draft.md#accuracy-recheck-meaning-usage-and-grading) for teaching-versus-grading treatment.
