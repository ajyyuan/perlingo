# Day 1 typed-recall prompt audit

> Current status: implemented locally for testing; not committed or published. [Implementation, resolved pues evidence, teaching alignment and testing](lemma-day1-local-preview.md). Earlier draft/provisional statements below are historical.


Status: **paused, not approved**, October 30, 2026. The user requested meaning/construction research before further grading changes. The implementation described below remains in the local preview, but its alternative lists are not validated by the new [contrast research](lemma-day1-contrast-research.md). Not committed or published.

## Scope and findings

Reviewed all 250 rendered English headword prompts, using `combineNotes` so the first-set authored overrides are included. The complete ledger is `data/spanish-lemmas/day1-recall-audit.json`; it records original and revised prompts, cues, exact accepted answers, decisions and source references. This pass changes 138 prompts/cues; 61 cards accept explicitly reviewed alternatives. It is an editorial screen, not an exhaustive Spanish synonym inventory or independent linguistic certification. Retained entries mean no blocking collision was identified in this pass, not that no other translation exists.

The main problems were broad glosses that hid the intended use, overlapping synonyms graded as wrong, and definitions that included Spanish answers. The revised prompts use short English sense cues and grammatical-form cues. They do not invent formal/informal distinctions to force a unique answer. When the English meaning still admits reviewed synonyms, those alternatives count as correct. Some accepted expressions have more than one word (for example, después de).

## Behavior

- Applies to typed ten-word batch tests and the typed Day 1 test for cards 1–250. Later-day targets retain their existing grading, even when a later-day lemma is an accepted alternative for a Day 1 target.
- Recognition tests and sentence-cloze prompts/answers are unchanged. An alternative for an English headword prompt is not automatically a valid inflection or word in a sentence blank.
- Short English sense/form cues appear before answering in the existing muted cue line. Accepted Spanish alternatives and any explanatory comparison appear only in feedback, after submission or Show answer. This is prompt clarification, not an answer-revealing hint.
- Correct feedback and automatic pronunciation use the accepted answer the learner actually entered. The feedback lists the card headword and the other accepted alternatives together, so an alternative does not silently replace what the card teaches.
- Exact reviewed forms are accepted after existing case, whitespace and terminal-punctuation normalization. Accents, spelling, grammatical forms and unrelated meanings remain strict. There is no live model or fuzzy semantic grader.
- Existing test IDs, order, index, drafts, repair state, saved feedback, first-pass scores and completed work remain intact. New submissions use the updated prompts and answers immediately. Earlier wrong answers and scores are not retroactively recalculated; a saved feedback screen still carries its original result. This avoids inventing historical answers, which are not all retained. Existing misses are still retried normally.
- The card's broader lexical definition and examples remain reference material. A narrowed test prompt samples the stated sense; passing it does not establish mastery of all senses or of the specific original lemma when a synonym was supplied.

## Source comparison and limits

The baseline is the repository's frozen Wiktionary-derived `dictionary-extract.json`, together with the existing reviewed lexical notes and grammatical cues. The audit stores file hashes and per-entry source keys. A referenced synonym in an existing entry is distinguished from a separately fetched entry. Dictionary membership supports meaning comparison, but does not establish universal interchangeability in sentences. Contextual restrictions in this revision are authored judgments about the displayed English prompt.

Targeted primary-source comparisons include:

- [El Colegio de México: empezar](https://dem.colmex.mx/ver/empezar) and the frozen empezar/comenzar entries support accepting their overlap rather than assigning an artificial exclusive register.
- [FundéuRAE: lograr / conseguir / alcanzar](https://www.fundeu.es/recomendacion/lograr-obtener-alcanzar-conseguir-resultado/) supports the desired-result cue for lograr. The frozen obtener entry supports obtaining; this is not general permission to substitute these verbs in every construction.
- [RAE: aún / aun](https://www.rae.es/dpd/tilde) supports todavía for the continuing-time meaning while retaining the written accent.
- [RAE: adentro](https://www.rae.es/dpd/adentro) confirms an interior-location use alongside movement.
- [FundéuRAE: causal expressions](https://www.fundeu.es/consulta/ya-que-puesto-que-4043/) and [tras](https://www.fundeu.es/dudas/palabra-clave/tras/) support the listed causal and temporal expressions.
- Targeted DEM entries for a, reflexionar, efectuar, porción, vínculo, conexión, modificación, frente and así are linked in the machine-readable ledger. Their sense checks informed original concise wording; dictionary example sentences are not copied into the app.

Source pages that failed to load were not counted as evidence. For example, previamente is supported by its explicit synonym listing under antes in the frozen dictionary, not by a claimed successful DEM fetch. This audit does not certify that every possible correct answer is now recognized. Further reports should be checked against the exact English prompt and cue.

## Local testing

Open `http://127.0.0.1:5183/lemmas/` for a separate guest-browser origin, choose Your days → Day 1 test. Check the short cues, submit a reviewed alternative when its prompt appears, and reload with an unsubmitted draft. For a deterministic offline check, run `node --test tests/lemma-day1-recall.test.js`: it grades every authored answer, checks the reported confusion groups and rejects neighboring wrong senses, verifies exact 250-card audit coverage/source hashes, and completes a restored full-day test through repair and a perfect pass using alternatives.

Do not reset or replace the user's account progress for testing. The production app remains unchanged until explicit approval and publication.

## Complete prompt ledger

“Retained” means the original rendered prompt/cue is retained. All other rows have revised prompts or cues; accepted answers are listed explicitly. Spanish answers below are audit material, not pre-answer test hints.

| # | Card | Typed prompt | Cue | Accepted answers | Decision |
| --- | --- | --- | --- | --- | --- |
| 1 | el | the | Definite article · masculine singular | el | Revised |
| 2 | de | of; from | preposition | de | Retained |
| 3 | y | and | conjunction | y | Retained |
| 4 | en | in; on; at | preposition | en | Retained |
| 5 | a | to (a destination) | Preposition | a / para | Revised |
| 6 | un | a; an | Indefinite article · masculine singular | un | Revised |
| 7 | que | who; which; that | Relative pronoun · can refer to people or things | que | Revised |
| 8 | ser | to be (identity or origin) | Verb · who someone is or where they are from | ser | Revised |
| 9 | se | oneself; each other | Third-person reflexive / reciprocal object | se | Revised |
| 10 | que | that (introducing a statement) | Conjunction | que | Revised |
| 11 | suyo | his; hers; its; theirs; yours (formal) | Possessive · long form · masculine singular | suyo | Retained |
| 12 | con | with | preposition | con | Retained |
| 13 | no | not | adverb | no | Retained |
| 14 | por | for (a cause or an exchange); through | Preposition · why or in exchange for what | por | Revised |
| 15 | para | for (a purpose or intended recipient) | Preposition · intended use or destination | para | Revised |
| 16 | lo | him; it; you (formal masculine object) | Direct object · masculine / neuter singular | lo | Retained |
| 17 | este | this (near the speaker) | Demonstrative · masculine singular | este | Revised |
| 18 | como | as; since (given that) | Conjunction · introducing a reason | como / porque / ya que / puesto que | Revised |
| 19 | estar | to be (a state or physical location) | Verb · how someone is, or where a person or thing is | estar | Revised |
| 20 | tener | to have; to possess | Verb · possession, not the auxiliary for a completed action | tener / poseer | Revised |
| 21 | ir | to go | Verb · movement toward a destination | ir | Revised |
| 22 | le | to him; to her; to you (formal) | Indirect object · singular | le | Retained |
| 23 | más | more (with a verb, adjective or adverb) | Adverb | más | Revised |
| 24 | me | me; to me; myself | Object / reflexive · first-person singular | me | Retained |
| 25 | hacer | to do (an activity or task) | Verb | hacer / realizar / efectuar | Revised |
| 26 | poder | can; to be able to | verb | poder | Retained |
| 27 | ese | that (near the listener) | Demonstrative · masculine singular | ese | Revised |
| 28 | todo | all; every | Quantifier · the whole amount or group | todo | Revised |
| 29 | o | or | conjunction | o | Retained |
| 30 | pero | but | conjunction | pero | Retained |
| 31 | él | he; him (after a preposition) | Subject / after a preposition · masculine singular | él | Retained |
| 32 | otro | other; another | quantifier | otro | Retained |
| 33 | decir | to say; to tell someone something | Verb · communicating words | decir | Revised |
| 34 | año | year | noun | año | Retained |
| 35 | haber | auxiliary “have” (a completed action); there is / are | Verb · give the infinitive | haber | Revised |
| 36 | si | if | conjunction | si | Retained |
| 37 | mío | mine | Possessive · long form · masculine singular | mío | Revised |
| 38 | dar | to give | verb | dar | Retained |
| 39 | ver | to see (perceive with the eyes) | Verb · visual perception | ver | Revised |
| 40 | sobre | on; on top of | Preposition · position above a supporting surface | sobre / encima de / en | Revised |
| 41 | cuando | when (at the time that) | Relative time word · not a question | cuando | Revised |
| 42 | entre | between; among | preposition | entre | Retained |
| 43 | también | also; too; as well | Adverb · adding something | también / además | Revised |
| 44 | ya | already | Adverb · something has happened by now | ya | Revised |
| 45 | nos | us; to us; ourselves | Object / reflexive · first-person plural | nos | Retained |
| 46 | uno | one | Cardinal number · standalone form | uno | Revised |
| 47 | sin | without | preposition | sin | Retained |
| 48 | te | you; to you; yourself (informal singular) | Object / reflexive · informal singular | te | Retained |
| 49 | muy | very | adverb | muy | Retained |
| 50 | desde | from; since (a starting point) | Preposition · beginning in time or space | desde | Revised |
| 51 | porque | because | Conjunction · introducing a reason | porque / ya que / puesto que | Revised |
| 52 | saber | to know a fact; to know how to do something | Verb · knowledge, not familiarity with a person | saber | Revised |
| 53 | primero | first (in a sequence) | numeral | primero | Retained |
| 54 | dos | two | numeral | dos | Retained |
| 55 | mismo | same; self (for emphasis) | Quantifier · identity rather than similarity | mismo | Revised |
| 56 | qué | what; which (in questions and exclamations) | Question word · what | qué | Retained |
| 57 | alguno | some; any | Quantifier · masculine singular dictionary form | alguno | Revised |
| 58 | vez | time (one occurrence); occasion | Noun · how many times something happens | vez / ocasión | Revised |
| 59 | día | day | noun | día | Retained |
| 60 | yo | I | Subject · first-person singular | yo | Retained |
| 61 | querer | to want; to desire | Verb | querer / desear | Revised |
| 62 | deber | must; should; to owe | Verb · give the infinitive | deber | Revised |
| 63 | solo | only; solely | Adverb · limiting a statement | solo / solamente / únicamente | Revised |
| 64 | hasta | until (an endpoint) | Preposition | hasta | Revised |
| 65 | nuevo | new | adjective | nuevo | Retained |
| 66 | pasar | to happen; to occur | Verb | pasar / ocurrir / suceder | Revised |
| 67 | mucho | much; many; a lot of | Quantifier · modifying a noun · masculine singular form | mucho | Revised |
| 68 | llegar | to arrive, get (to) (intransitive) | verb | llegar | Retained |
| 69 | parte | part; portion (of a whole) | Noun | parte / porción | Revised |
| 70 | país | country (a territory) | Noun | país | Revised |
| 71 | grande | big; large | Adjective · size | grande | Revised |
| 72 | tiempo | time (duration); weather | Noun · time passing, not one occurrence | tiempo | Revised |
| 73 | donde | where (relative: the place where...) | adverb | donde | Retained |
| 74 | nuestro | our; ours | Possessive · masculine singular headword | nuestro | Retained |
| 75 | dejar | to leave something somewhere | Verb · an object is left; not someone departing | dejar | Revised |
| 76 | vida | life | noun | vida | Retained |
| 77 | llevar | to carry; to take something somewhere | Verb · transport away or onward | llevar | Revised |
| 78 | persona | person (an individual; usually a human being) | noun | persona | Retained |
| 79 | seguir | to follow (a person or route) | Verb | seguir | Revised |
| 80 | cada | each; every (individual) | Quantifier · considers members one by one | cada | Revised |
| 81 | encontrar | to find (something sought) | Verb | encontrar / hallar | Revised |
| 82 | quien | who (the person who...) | Relative pronoun · refers specifically to a person · singular | quien | Revised |
| 83 | ni | nor; neither ... nor | conjunction | ni | Retained |
| 84 | después | afterwards; later | Adverb · at a subsequent time | después / luego | Revised |
| 85 | poner | to put; to place something | Verb | poner / colocar | Revised |
| 86 | quedar | to remain; to be left | Verb · what remains after something changes | quedar / permanecer | Revised |
| 87 | bueno | good | adjective | bueno | Retained |
| 88 | mujer | woman | noun | mujer | Retained |
| 89 | ahora | now (at the present moment) | Adverb | ahora | Revised |
| 90 | último | final; last | adjective | último | Retained |
| 91 | hablar | to speak; to talk | verb | hablar | Retained |
| 92 | así | like this; in this way | Adverb · manner | así / de esta manera / de este modo | Revised |
| 93 | aunque | though, although, even though, albeit | conjunction | aunque | Retained |
| 94 | parecer | to seem; to look like | verb | parecer | Retained |
| 95 | durante | during, in, over | preposition | durante | Retained |
| 96 | aquel | that (far from both speaker and listener) | Demonstrative · masculine singular | aquel | Revised |
| 97 | mundo | world | Noun | mundo | Revised |
| 98 | momento | moment; instant | Noun · a brief point in time | momento / instante | Revised |
| 99 | siempre | always | adverb | siempre | Retained |
| 100 | pensar | to think; to ponder | Verb · the activity of thinking, not feeling an emotion | pensar / reflexionar | Revised |
| 101 | forma | shape; form (physical outline) | Noun · what something is shaped like | forma / figura | Revised |
| 102 | casa | house (a building) | Noun | casa | Revised |
| 103 | mayor | bigger; greater; older | adjective | mayor | Retained |
| 104 | volver | to return; to come or go back | Verb | volver / regresar | Revised |
| 105 | bien | well | Adverb · doing something well | bien | Revised |
| 106 | antes | before; earlier | Adverb · at an earlier time | antes / anteriormente / previamente | Revised |
| 107 | tres | three | numeral | tres | Retained |
| 108 | cómo | how? (interrogative) | adverb | cómo | Retained |
| 109 | tan | so; as (before an adjective or adverb) | Adverb · degree, not a quantity of things | tan | Revised |
| 110 | trabajo | work; job | Noun · employment or an activity | trabajo / empleo / labor | Revised |
| 111 | algo | something, anything | quantifier | algo | Retained |
| 112 | hombre | man (adult male human) | noun | hombre | Retained |
| 113 | cosa | thing (object, concept) | noun | cosa | Retained |
| 114 | creer | to believe; to think something is true | Verb · belief or opinion | creer / pensar | Revised |
| 115 | salir | to leave; to go out | Verb · someone departs from a place | salir / irse / marcharse | Revised |
| 116 | nacional | national, nationwide (of or relating to a nation) | adjective | nacional | Retained |
| 117 | sí | yes | adverb | sí | Retained |
| 118 | conocer | to know a person or place; to be familiar with | Verb · familiarity, not knowing a fact | conocer | Revised |
| 119 | contar | to count (numbers or items) | Verb | contar | Revised |
| 120 | niño | boy; male child | Noun · masculine singular | niño / chico | Revised |
| 121 | lugar | place; location | Noun | lugar / sitio | Revised |
| 122 | gobierno | government | noun | gobierno | Retained |
| 123 | tomar | to drink (a beverage) | Verb | tomar / beber | Revised |
| 124 | social | social | adjective | social | Retained |
| 125 | llamar | to call; to summon someone | Verb | llamar | Revised |
| 126 | tratar | to treat (someone in a particular way) | Verb · how you deal with someone | tratar | Revised |
| 127 | tuyo | your; yours (informal singular) | Possessive · long form · masculine singular · informal singular owner | tuyo | Retained |
| 128 | sentir | to feel (an emotion or sensation) | Verb · feeling, not holding an opinion | sentir | Revised |
| 129 | hora | hour (a time period of sixty minutes) | noun | hora | Retained |
| 130 | venir | to come | verb | venir | Retained |
| 131 | caso | case (an instance or particular situation) | Noun | caso | Revised |
| 132 | mano | hand (anatomy, of a person) | noun | mano | Retained |
| 133 | sino | but rather (correcting a negative statement) | Conjunction | sino | Revised |
| 134 | crear | to create; to bring something into existence | Verb | crear / generar / hacer | Revised |
| 135 | estado | state; condition | Noun · the condition something is in | estado / condición / situación | Revised |
| 136 | grupo | group | noun | grupo | Retained |
| 137 | realizar | to carry out; to perform a task | Verb | realizar / hacer / efectuar | Revised |
| 138 | nada | nothing; not anything | quantifier | nada | Retained |
| 139 | hijo | son | noun | hijo | Retained |
| 140 | mirar | to look at (direct your eyes toward) | Verb · deliberate looking | mirar | Revised |
| 141 | según | according to | preposition | según | Retained |
| 142 | propio | own (belonging to) | adjective | propio | Retained |
| 143 | vivir | to live; to be alive (intransitive) | verb | vivir | Retained |
| 144 | entonces | then (at that time) | Adverb · referring to a time already mentioned | entonces | Revised |
| 145 | mejor | better | adjective | mejor | Retained |
| 146 | permitir | to allow; to permit | Verb | permitir / dejar / autorizar | Revised |
| 147 | importante | important | adjective | importante | Retained |
| 148 | cual | which; who (relative, usually el cual / la cual) | Relative pronoun · used with an article | cual | Retained |
| 149 | punto | point (a specific spot) | Noun | punto | Revised |
| 150 | hacia | toward, towards | preposition | hacia | Retained |
| 151 | historia | history (past events) | Noun | historia | Revised |
| 152 | millón | million (10^6) (cardinal number) | noun | millón | Retained |
| 153 | hoy | today | adverb | hoy | Retained |
| 154 | manera | way; manner (of doing something) | Noun | manera / modo / forma | Revised |
| 155 | luego | afterwards; later | Adverb · at a subsequent time | luego / después | Revised |
| 156 | padre | father | Noun · male parent | padre | Revised |
| 157 | público | public | adjective | público | Retained |
| 158 | ante | before; in front of (in the presence of) | Preposition · facing someone or something | ante / delante de / frente a | Revised |
| 159 | menos | less | Adverb · a smaller degree | menos | Revised |
| 160 | presentar | to present; to submit | Verb · put something forward | presentar | Revised |
| 161 | buscar | to seek, search for, look for, try to find, to scour | verb | buscar | Retained |
| 162 | sistema | system | noun | sistema | Retained |
| 163 | problema | problem; difficulty | Noun | problema / dificultad | Revised |
| 164 | esperar | to wait; to hope; to expect | Verb · one verb with these three uses | esperar | Revised |
| 165 | presidente | president (head of a government or organization) | Noun | presidente | Revised |
| 166 | tipo | kind; type; sort | Noun · category | tipo / clase / género | Revised |
| 167 | contra | against, versus | preposition | contra | Retained |
| 168 | nunca | never | Adverb | nunca / jamás | Revised |
| 169 | ciudad | city | noun | ciudad | Retained |
| 170 | además | also; in addition | Adverb · adding something | además / también | Revised |
| 171 | pues | so; then (in that case) | Conjunction · drawing a conclusion | pues / entonces | Revised |
| 172 | casi | almost | adverb | casi | Retained |
| 173 | mes | month | noun | mes | Retained |
| 174 | político | political | adjective | político | Retained |
| 175 | poco | little; not much | Quantifier · an amount · masculine singular form | poco | Revised |
| 176 | más | more (before a noun) | Quantifier · a larger amount or number | más | Revised |
| 177 | partido | political party; sports match | Noun · one word with both uses | partido | Revised |
| 178 | proceso | process | noun | proceso | Retained |
| 179 | segundo | second (after the first) (ordinal number) | numeral | segundo | Retained |
| 180 | cambio | change (an alteration) | Noun · a change from one state to another | cambio / modificación | Revised |
| 181 | trabajar | to work | verb | trabajar | Retained |
| 182 | alto | tall; high; loud | adjective | alto | Retained |
| 183 | empezar | to start; to begin | Verb | empezar / comenzar / iniciar | Revised |
| 184 | obra | work (an artistic or literary creation) | Noun · a created work, not employment | obra | Revised |
| 185 | cuenta | account; bill; calculation | noun | cuenta | Retained |
| 186 | existir | to exist | verb | existir | Retained |
| 187 | varios | several; various | quantifier | varios | Retained |
| 188 | explicar | to explain (transitive) | verb | explicar | Retained |
| 189 | medio | means; medium | Noun · a way or instrument for achieving something | medio | Revised |
| 190 | equipo | team | noun | equipo | Retained |
| 191 | mí | me (after a preposition) | After a preposition · first-person singular | mí | Retained |
| 192 | noche | night (the period between sunset and sunrise) | noun | noche | Retained |
| 193 | tras | after; following (an event) | Preposition · followed by a noun phrase | tras / después de | Revised |
| 194 | estudio | study (the activity of studying) | Noun · not employment | estudio | Revised |
| 195 | mientras | while (at the same time as) | Conjunction | mientras / mientras que | Revised |
| 196 | mucho | a lot; much | Adverb · modifying an action or degree | mucho | Revised |
| 197 | agua | water | noun | agua | Retained |
| 198 | aquí | here (in the speaker's location) | adverb | aquí | Retained |
| 199 | uno | one; someone (an unspecified person) | Indefinite pronoun · not the counting number | uno / alguien | Revised |
| 200 | empresa | company; business | Noun · a commercial organization | empresa / compañía | Revised |
| 201 | gente | people (a group of persons) | Noun · collective singular | gente | Revised |
| 202 | recordar | to remember; to recollect | Verb | recordar / acordarse / acordarse de | Revised |
| 203 | ninguno | none; not any | Quantifier · masculine singular dictionary form | ninguno | Revised |
| 204 | considerar | to consider; to regard as | Verb · judging or viewing something in a certain way | considerar | Revised |
| 205 | mantener | to maintain; to keep something in a state | Verb · sustaining a condition | mantener / conservar | Revised |
| 206 | centro | center (general) | noun | centro | Retained |
| 207 | nivel | level (height or degree) | Noun | nivel | Revised |
| 208 | perder | to lose (transitive) | verb | perder | Retained |
| 209 | lado | side | noun | lado | Retained |
| 210 | recibir | to receive (something given or sent) | Verb · receiving, not achieving a goal | recibir | Revised |
| 211 | abrir | to open, open up (transitive, intransitive, reflexive) | verb | abrir | Retained |
| 212 | pequeño | small; little | adjective | pequeño | Retained |
| 213 | servicio | service | noun | servicio | Retained |
| 214 | proyecto | project (a planned undertaking) | Noun | proyecto | Revised |
| 215 | lograr | to achieve; to obtain a desired result | Verb · reaching a goal | lograr / conseguir / obtener / alcanzar | Revised |
| 216 | general | general, overall | adjective | general | Retained |
| 217 | preguntar | to ask a question | Verb · seek an answer, not request an object | preguntar | Revised |
| 218 | tanto | so much (to that degree) | Adverb · degree or extent | tanto | Revised |
| 219 | ejemplo | example | noun | ejemplo | Retained |
| 220 | madre | mother | noun | madre | Retained |
| 221 | libro | book | noun | libro | Retained |
| 222 | convertir | to convert; to turn something into something else | Verb · changing something, not the reflexive “to become” | convertir / transformar | Revised |
| 223 | único | only; sole; single | Adjective · masculine singular, not the adverb “only” | único / solo | Revised |
| 224 | familia | family (group of people related to each other) | noun | familia | Retained |
| 225 | salud | health | noun | salud | Retained |
| 226 | semana | week (7 days) | noun | semana | Retained |
| 227 | comenzar | to start; to begin | Verb | comenzar / empezar / iniciar | Revised |
| 228 | largo | long (in length) | Adjective · distance from one end to the other | largo | Revised |
| 229 | pedir | to ask for; to request something | Verb · requesting something, not asking a question | pedir / solicitar | Revised |
| 230 | desarrollo | development | noun | desarrollo | Retained |
| 231 | derecho | right (a legal, just or moral entitlement) | noun | derecho | Retained |
| 232 | entrar | to enter; to go in | Verb | entrar | Revised |
| 233 | escribir | to write | verb | escribir | Retained |
| 234 | situación | situation; state of affairs | Noun · circumstances | situación / circunstancia / estado | Revised |
| 235 | humano | human | adjective | humano | Retained |
| 236 | aún | still; yet (continuing up to now) | Adverb · time | aún / todavía | Revised |
| 237 | palabra | word | noun | palabra | Retained |
| 238 | cuerpo | body (the physical structure of a human or animal) | noun | cuerpo | Retained |
| 239 | mostrar | to show (let someone see something) | Verb | mostrar / enseñar | Revised |
| 240 | información | information | Noun · facts communicated, not an individual data item | información | Revised |
| 241 | cualquiera | any; whichever | Quantifier · full dictionary form | cualquiera | Revised |
| 242 | dentro | inside (in an interior space) | Adverb | dentro / adentro | Revised |
| 243 | entender | to understand; to comprehend | Verb · grasping a meaning or explanation | entender / comprender | Revised |
| 244 | relación | relation; relationship; connection | Noun | relación / vínculo / conexión | Revised |
| 245 | tema | topic; subject (of discussion) | Noun | tema / asunto | Revised |
| 246 | económico | economic | adjective | económico | Retained |
| 247 | ojo | eye (anatomy) | noun | ojo | Retained |
| 248 | producir | to produce; to generate | Verb | producir / generar | Revised |
| 249 | político | politician | noun | político | Retained |
| 250 | cuatro | four | numeral | cuatro | Retained |

## Verification

Browser verification used a fresh guest origin on port 5183, without signing in or importing account progress. The revised reflexive cue graded correctly; a relación prompt accepted conexión, showed conexión as the feedback/pronunciation target and listed all three reviewed answers. Reload retained the unsubmitted conexión draft and question 2 / 250. Full-day completion and preservation of older progress are automated checks, not a claimed manual 250-question walkthrough.

Checks: all 409 repository tests and `npm run check` passed. After the final two alias-list additions, the 10 focused recall/evidence tests passed again; changed JavaScript syntax and `git diff --check` pass. No commit or publication was made.
