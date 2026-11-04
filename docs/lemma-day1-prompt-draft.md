# Day 1 prompt draft — review before implementation

> Current status: implemented locally for testing; not committed or published. [Implementation, resolved pues evidence, teaching alignment and testing](lemma-day1-local-preview.md). Earlier draft/provisional statements below are historical.


**Status: proposed only, October 30, 2026.** External-audit reconciliation is recorded [here](lemma-day1-external-audit-review.md). Row 18 is now resolved; see the local implementation report. All 250 cards are covered below. No app code, graders, learning cards, tests or progress were changed for this draft. The older local prototype is still present but remains unapproved. This document proposes its replacement; it does not validate that prototype’s alternatives.

The baseline is the shipped wording captured in `originalPrompt` / `originalCue` in the earlier audit, not the prototype’s edited wording. The companion [structured draft](../data/spanish-lemmas/day1-prompt-draft.json) contains every row, rationale and source reference.

## What the learner would see

Use a short English definition plus, where needed, one quiet contextual line. Do not add a generic “ambiguous” badge: say the intended use directly. The target Spanish word and the alternatives below are reviewer information, never pre-answer text. Keep broader meanings and comparisons on the learning card. A selected test sense is not a complete dictionary definition.

**Proposed response instruction:** Give one Spanish headword. Use the infinitive for verbs; otherwise use the singular dictionary form unless the prompt specifies another form. For adjectives, use masculine singular unless specified. If a Spanish blank specifies a form, supply the form that fits it.

English examples illustrate meaning; they do not request a conjugated sentence. Spanish blanks test the shown construction with one headword. Existing part-of-speech metadata can remain separate from the contextual line. A dash in the context column means no extra explanatory line.

**Important response-format dependency:** `tras` in `___ la clase` is distinguishable from bare `después` and `luego` only because the response asks for one word. `Después de` and `luego de` are valid multiword translations; they must not be described as bad Spanish. If multiword responses are allowed instead, this row needs those alternatives. Do not silently introduce this restriction.

## Acceptance proposals

76 cards retain reviewed overlap after the proposed context (98 additional-answer assignments). These lists are local to the exact row; accepting `de` for a topic prompt does not make it an alternative for every `sobre` use. No global synonym groups or inferred reverse matches.

“—” in the alternatives column means no additional reviewed answer proposed, not a claim of universal uniqueness. This audit prioritizes the Day 1 confusions plus selected common external alternatives; it is not an exhaustive thesaurus. A newly reported valid answer still needs exact-prompt review. A synonym-list entry alone is insufficient: meaning, syntax, form and any visible register restriction must all fit.

A correct alternative should not be marked linguistically wrong. Whether it also proves recall of the target lemma is a separate product decision: suggested feedback is “Also correct. This card teaches …”, without silently replacing which lemma is being practiced. No scoring or mastery behavior is implemented here.

## Sense selections to review

These are meaningful selections, not just wording cleanup. Before implementation, ensure the learning card teaches the selected sense and construction. In particular, the current learner must not suddenly be examined on an unintroduced meaning. If a sense is not taught, retain the taught sense and accept its genuine overlap until teaching is aligned.

| Rank / word | Proposed selection |
| --- | --- |
| 52 · saber | Selects know-how + infinitive rather than factual knowledge. |
| 62 · deber | Selects owing money from an existing multi-sense gloss. |
| 91 · hablar | Selects speaking a language rather than general conversation. |
| 114 · creer | Replaces a transitive-belief gloss with creer en + existence. |
| 119 · contar | Selects counting from a multi-sense word. |
| 123 · tomar | Selects drinking from an existing take/drink gloss. |
| 125 · llamar | Selects telephoning from a broad summon/call gloss. |
| 131 · caso | Selects a police investigation rather than a generic situation/fact. |
| 135 · estado | Selects a federal territory from state/condition/political meanings. |
| 143 · vivir | Tests residence, rather than the existing be-alive gloss. |
| 149 · punto | Tests a dot/mark, rather than the existing location gloss. |
| 160 · presentar | Tests introducing people, rather than presenting/submitting objects. |
| 164 · esperar | Selects waiting from the broader wait/hope/expect meanings. |
| 177 · partido | Selects a sports match from the polysemous partido. |
| 185 · cuenta | Selects a bank account. |

This table highlights substantial changes; it is not exhaustive. Every row now has a teaching-alignment review field in the JSON, covering all selected meanings and constructions. None is marked teaching-verified by this audit alone.

## Full before-and-after review

“Before” includes the original short cue. “Definition” and “Context” are the proposed visible text. The target and additional-answer columns are review-only. Unchanged simple words are included to make coverage explicit.

### Set 1: 1–50

| # / target | Before: definition · cue | Proposed definition | Proposed context | Additional answers |
| --- | --- | --- | --- | --- |
| 1 · el | the · article | the | Definite article · masculine singular | — |
| 2 · de | of; from · preposition | of; belonging to | Possession: “Ana’s book” → el libro ___ Ana | — |
| 3 · y | and · conjunction | and | “bread and cheese” → pan ___ queso. | — |
| 4 · en | in; on; at · preposition | in; inside | Location: “in the room” → ___ la habitación | — |
| 5 · a | to; at · preposition | at (a clock time) | “at three o’clock” → ___ las tres | — |
| 6 · un | a; an; some (plural) · article | a; an | Indefinite article before a masculine singular noun: ___ libro. | — |
| 7 · que | that; which; who · Relative pronoun | which; that | Relative pronoun: “the book that I bought” | — |
| 8 · ser | to be: identity, characteristic, origin · verb | to be (identity) | “Ana is a doctor.” · Give the verb’s infinitive. | — |
| 9 · se | oneself; each other; other grammatical uses · Reflexive / reciprocal object | oneself; each other | Unstressed reflexive / reciprocal pronoun · third person | — |
| 10 · que | that; than · conjunction | that (introducing a statement) | “I think that it’s true.” · Clause-linking conjunction | — |
| 11 · suyo | his; hers; its; theirs; yours (formal) · Possessive · long form · masculine singular | his; hers; theirs; yours (usted/ustedes) | Possessive · stressed form · masculine singular | — |
| 12 · con | with · preposition | with | Accompaniment: “with a friend” | — |
| 13 · no | not · adverb | not | — | — |
| 14 · por | through; because of; by; in exchange for · preposition | because of (a cause) | “because of the rain” → ___ la lluvia | — |
| 15 · para | for; to; in order to · preposition | for (an intended recipient) | “This gift is for Ana.” | — |
| 16 · lo | him; it; you (formal masculine object) · Direct object · masculine / neuter singular | it (direct object) | Unstressed pronoun · inanimate masculine singular | — |
| 17 · este | this; these · demonstrative | this | Near the speaker · masculine singular | — |
| 18 · como | as; since · conjunction | since; because | Reason first: “Since it is raining, we will stay home.” → ___ llueve, nos quedamos en casa. | porque |
| 19 · estar | to be: state or location · verb | to be (a state) | “Ana is tired.” · Give the verb’s infinitive. | — |
| 20 · tener | to have · verb | to have; possess | Having something as one’s property | poseer |
| 21 · ir | to go · verb | to go | Movement to a place away from the speaker | — |
| 22 · le | to him; to her; to you (formal) · Indirect object · singular | to him; to her; to you (usted) | Unstressed indirect-object pronoun · singular | — |
| 23 · más | more · adverb | more | Degree: “more difficult” · adverb | — |
| 24 · me | me; to me; myself · Object / reflexive · first-person singular | me; to me; myself | Unstressed object / reflexive pronoun · first-person singular | — |
| 25 · hacer | to do; to make · verb | to do | “to do the homework” | realizar, efectuar, ejecutar |
| 26 · poder | can; to be able to · verb | to be able to | Ability: “to be able to open it” | — |
| 27 · ese | that; those · demonstrative | that (near you) | Near the person being spoken to · masculine singular | — |
| 28 · todo | all; every; everything · quantifier | all; the whole of | “the whole book” → ___ el libro | — |
| 29 · o | or · conjunction | or | “tea or coffee” → té ___ café. | — |
| 30 · pero | but · conjunction | but (a contrast) | “It’s small, but comfortable.” | — |
| 31 · él | he; him (after a preposition) · Subject / after a preposition · masculine singular | he | Subject pronoun · masculine singular | — |
| 32 · otro | other; another · quantifier | another | An additional coffee: ___ café. | — |
| 33 · decir | to say; to tell · verb | to say | “to say something to someone” | — |
| 34 · año | year · noun | year | — | — |
| 35 · haber | there is / are; auxiliary have · verb | have (auxiliary verb) | Used with a past participle: “I have eaten.” · Give the infinitive. | — |
| 36 · si | if · conjunction | if | A condition, not the answer “yes” | — |
| 37 · mío | mine; my (mi before a noun) · Possessive · long form · masculine singular | mine | Possessive · stressed form · masculine singular | — |
| 38 · dar | to give · verb | to give | — | — |
| 39 · ver | to see; to watch · verb | to see | Perceive something with your eyes | — |
| 40 · sobre | on; above; about · preposition | about; on the subject of | “a book about history” | de |
| 41 · cuando | when · adverb | when | “Call me when you arrive.” → Llámame ___ llegues. | — |
| 42 · entre | between; among · preposition | between; among | — | — |
| 43 · también | also; too; as well · adverb | also; too | “Ana is coming; Luis is also coming.” | además |
| 44 · ya | already; now · adverb | already | “It’s already finished.” | — |
| 45 · nos | us; to us; ourselves · Object / reflexive · first-person plural | us; to us; ourselves | Unstressed object / reflexive pronoun · first-person plural | — |
| 46 · uno | one · numeral | one | The number 1, said on its own. | — |
| 47 · sin | without · preposition | without | — | — |
| 48 · te | you; to you; yourself (informal singular) · Object / reflexive · informal singular | you; to you; yourself | Unstressed object / reflexive pronoun · tú/vos | — |
| 49 · muy | very · adverb | very | High degree before a noncomparative adjective: “very tall” | bien |
| 50 · desde | from; since · preposition | since (a starting time) | “I have lived here since Monday.” → Vivo aquí ___ el lunes. | — |

### Set 2: 51–100

| # / target | Before: definition · cue | Proposed definition | Proposed context | Additional answers |
| --- | --- | --- | --- | --- |
| 51 · porque | because · conjunction | because | “We stayed home because it was raining.” | pues |
| 52 · saber | to know, to understand (a fact) · verb | to know how to | A learned skill: “to know how to swim” | — |
| 53 · primero | first (in a sequence) · numeral | first | Position in a sequence · masculine singular | — |
| 54 · dos | two · numeral | two | — | — |
| 55 · mismo | same; self; very (for emphasis) · quantifier | the same | The same person or thing, not a different one | — |
| 56 · qué | what; which (in questions and exclamations) · Question word · what | what? | Direct question: “What is that?” | — |
| 57 · alguno | some; any · quantifier | some; an unspecified one | Indefinite pronoun · masculine singular | uno |
| 58 · vez | time; occasion · noun | time (an occurrence) | “three times” · Give the singular noun. | — |
| 59 · día | day · noun | day | — | — |
| 60 · yo | I · Subject · first-person singular | I | Subject pronoun | — |
| 61 · querer | to desire, to want, to want to · verb | to want | Desire to have or do something | desear |
| 62 · deber | must; should; to have to; to owe · verb | to owe | Money owed to someone | adeudar |
| 63 · solo | only; solely; just · adverb | only; solely | Adverb: “only two” | solamente, únicamente |
| 64 · hasta | until · preposition | until; up to | The endpoint of a time period | — |
| 65 · nuevo | new · adjective | new | — | — |
| 66 · pasar | to pass; to happen; to spend time · verb | to happen; occur | “What happened?” · Give the infinitive. | ocurrir, suceder |
| 67 · mucho | much; many; a lot of · quantifier | much; many; a lot of | Quantity before a noun · give the masculine singular headword | — |
| 68 · llegar | to arrive, get (to) (intransitive) · verb | to arrive | Reach the destination of a journey | — |
| 69 · parte | part; section; portion; share; piece; bit; cut; proportion · noun | part; portion | A portion of a whole | porción |
| 70 · país | country (the territory of a nation) · noun | country | A country or national territory | nación |
| 71 · grande | big; large; great · adjective | big; large | Size, rather than specifically height or length | — |
| 72 · tiempo | time; weather · noun | time (duration) | How much time an activity takes | — |
| 73 · donde | where (relative: the place where...) · adverb | where | Relative place word: “the place where I live” | — |
| 74 · nuestro | our; ours · Possessive · masculine singular headword | our; ours | Possessive · masculine singular | — |
| 75 · dejar | to leave; to let; dejar de: to stop doing · verb | to leave something behind | “to leave the keys at home” | — |
| 76 · vida | life · noun | life | Noun | — |
| 77 · llevar | to carry; to take somewhere; to wear · verb | to carry | Take an object along with you | — |
| 78 · persona | person (an individual; usually a human being) · noun | person | An individual human being · noun | individuo, humano |
| 79 · seguir | to follow; to continue · verb | to follow | Go behind someone along a route | — |
| 80 · cada | each; every · quantifier | each; every | Repeated interval: “every three days” → ___ tres días | — |
| 81 · encontrar | to find; to meet · verb | to find | Find something you were looking for | hallar |
| 82 · quien | who · Relative pronoun · person · singular | who; whoever | Relative pronoun for a person: “whoever arrives first” | — |
| 83 · ni | nor; neither ... nor · conjunction | nor; neither … nor | Negative coordination | — |
| 84 · después | afterwards; later · adverb | later; afterward | “We can discuss it afterward.” | luego |
| 85 · poner | to put, to place (cause to assume a specified position) (transitive or ditransitive) · verb | to put; place | Put an object in a particular position | colocar |
| 86 · quedar | to remain; to be left; quedar en: to agree on; quedarse: to stay · verb | to be left; remain | “Three tickets remain.” · Give the infinitive. | restar |
| 87 · bueno | good · adjective | good | Adjective describing quality | — |
| 88 · mujer | woman · noun | woman | An adult woman | — |
| 89 · ahora | now (at the present time) · adverb | now | At this moment | — |
| 90 · último | final; last · adjective | last; final | Position at the end of a sequence | final |
| 91 · hablar | to speak; to talk · verb | to speak | Speaking a language: “to speak Spanish”. | — |
| 92 · así | like this; like that; so · adverb | like this; in this way | Adverb of manner | — |
| 93 · aunque | though, although, even though, albeit · conjunction | although; even though | “Although it’s raining, we’ll go out.” | — |
| 94 · parecer | to seem; to look like · verb | to seem | Give a particular impression | — |
| 95 · durante | during, in, over · preposition | during | Followed by a time period: “during the class” | — |
| 96 · aquel | that (over there; implying some distance) (also postpositive) · demonstrative | that (over there) | Far from both speaker and listener · masculine singular | — |
| 97 · mundo | world, earth (human collective existence) · noun | world | Human life and society as a whole | — |
| 98 · momento | moment, instant (time) · noun | moment; instant | A brief stretch of time | instante |
| 99 · siempre | always · adverb | always | — | — |
| 100 · pensar | to think, ponder · verb | to think about; ponder | Reflect on a problem | reflexionar, considerar |

### Set 3: 101–150

| # / target | Before: definition · cue | Proposed definition | Proposed context | Additional answers |
| --- | --- | --- | --- | --- |
| 101 · forma | shape; form; figure · noun | shape; form | The shape of an object, such as a round shape. | figura |
| 102 · casa | house; home · noun | house; home | — | hogar |
| 103 · mayor | bigger; greater; older · adjective | older | Comparison of age: “older than her brother” | — |
| 104 · volver | to return, to revert, to get back · verb | to return; go back | Return to a place you left | regresar |
| 105 · bien | well (adverbial form of bueno) · adverb | well; properly | Manner of doing something: “do it well” | — |
| 106 · antes | earlier; before; sooner; previously; formerly; beforehand (at an earlier time) · adverb | before; earlier | Adverb; before a named event, followed by de | — |
| 107 · tres | three · numeral | three | — | — |
| 108 · cómo | how? (interrogative) · adverb | how? | Question about manner: “How did you do it?” | — |
| 109 · tan | so, as · adverb | as … as; so | Before an adjective: “as tall as” | — |
| 110 · trabajo | work; job · noun | work; a job | Paid employment | empleo |
| 111 · algo | something, anything · quantifier | something | An unspecified thing | — |
| 112 · hombre | man (adult male human) · noun | man | An adult male person | — |
| 113 · cosa | thing (object, concept) · noun | thing | An unspecified thing: “Give me that thing.” | — |
| 114 · creer | to believe (transitive) · verb | to believe in | Believe something exists: “to believe in ghosts” · followed by en | — |
| 115 · salir | to go out, to leave, to depart, to head out · verb | to go out; exit | Move from inside to outside | — |
| 116 · nacional | national, nationwide (of or relating to a nation) · adjective | national | Relating to a nation | — |
| 117 · sí | yes · adverb | yes | — | — |
| 118 · conocer | to know; to be familiar with; to meet (a person for the first time) · verb | to know; be acquainted with | Knowing a person through acquaintance | — |
| 119 · contar | to count; to tell (a story) · verb | to count | Work out how many items there are | — |
| 120 · niño | child, boy · noun | child; boy | A child by age, not someone’s offspring | chico |
| 121 · lugar | place · noun | place; location | A place where something is located | sitio |
| 122 · gobierno | government · noun | government | The governing executive body | — |
| 123 · tomar | to take; to drink · verb | to drink | Consume a beverage | beber |
| 124 · social | social · adjective | social | Relating to society | — |
| 125 · llamar | to summon, to call · verb | to call | Contact someone by telephone | telefonear |
| 126 · tratar | to treat; tratar de: to try to, to be about · verb | to try to | Attempt an action · followed by de + infinitive | — |
| 127 · tuyo | your; yours (informal singular) · Possessive · long form · masculine singular · informal singular owner | yours (tú/vos) | Possessive · stressed form · masculine singular | — |
| 128 · sentir | to feel (transitive) · verb | to feel | Experience a physical sensation, such as cold | — |
| 129 · hora | hour (a time period of sixty minutes) · noun | hour | A period of 60 minutes | — |
| 130 · venir | to come · verb | to come | Movement toward where the speaker is | — |
| 131 · caso | case (situation or fact) · noun | case | A matter being investigated by the police | — |
| 132 · mano | hand (anatomy, of a person) · noun | hand | Body part | — |
| 133 · sino | but (rather) (after a negative clause) · conjunction | but rather | Replace something just denied: “not X, but Y” | — |
| 134 · crear | to create (transitive) · verb | to create | Bring something new into existence | hacer, producir |
| 135 · estado | state; condition; state (political territory or government) · noun | state | An autonomous territory within a federation | — |
| 136 · grupo | group · noun | group | People or things considered together | conjunto |
| 137 · realizar | to carry out; to perform · verb | to carry out; perform | An action or task | hacer, efectuar, ejecutar |
| 138 · nada | nothing; not anything · quantifier | nothing; not anything | — | — |
| 139 · hijo | son · noun | son | A male child in relation to his parents, at any age | — |
| 140 · mirar | to look at (to try to see, to pay attention to with one’s eyes) (transitive) · verb | to look at | Direct your eyes toward something | — |
| 141 · según | according to · preposition | according to | — | — |
| 142 · propio | own (belonging to) · adjective | one’s own | Belonging specifically to that person | — |
| 143 · vivir | to live; to be alive (intransitive) · verb | to live; reside | Have your home in a place | residir, habitar |
| 144 · entonces | then, next, thereupon, at that time, at that point (demonstrative) · adverb | then; at that time | At a previously mentioned time | — |
| 145 · mejor | better · adjective | better | Adjective comparing quality | — |
| 146 · permitir | to allow, permit · verb | to allow; permit | Let someone do something | dejar |
| 147 · importante | important · adjective | important | — | — |
| 148 · cual | which; who (relative, usually el cual / la cual) · Relative pronoun · used with an article | which; who | Relative pronoun: “the tool with which I work” → la herramienta con la ___ trabajo | que |
| 149 · punto | point (specific spot, location, or place) · noun | point; dot | A dot or small mark | — |
| 150 · hacia | toward, towards · preposition | toward | In the direction of a place, without stating arrival | para |

### Set 4: 151–200

| # / target | Before: definition · cue | Proposed definition | Proposed context | Additional answers |
| --- | --- | --- | --- | --- |
| 151 · historia | history (the aggregate of past events) · noun | history | Past events and their study | — |
| 152 · millón | million (10^6) (cardinal number) · noun | million | 1,000,000 | — |
| 153 · hoy | today · adverb | today | This calendar day | — |
| 154 · manera | way; manner; method; style · noun | way; manner | How something is done | forma, modo |
| 155 · luego | then (afterward) · adverb | later; afterward | “I will do it later, not now.” | después |
| 156 · padre | father, parent (family) · noun | father | Male parent | papá |
| 157 · público | public · adjective | public | Open or accessible to everyone | — |
| 158 · ante | in front of, before · preposition | before; in the presence of | “before the judge” → ___ el juez | — |
| 159 · menos | less; least · adverb | less | Lower degree: “less difficult” | — |
| 160 · presentar | to present, to submit · verb | to introduce | Introduce one person to another | — |
| 161 · buscar | to seek, search for, look for, try to find, to scour · verb | to look for; search for | Try to find something | — |
| 162 · sistema | system · noun | system | Interconnected elements forming a whole | — |
| 163 · problema | problem, issue, challenge (a difficulty or obstacle that has to be dealt with) · noun | problem; difficulty | Something that needs to be solved or dealt with | dificultad |
| 164 · esperar | to wait; to hope; to expect · verb | to wait | Wait for someone to arrive | aguardar |
| 165 · presidente | president, head (leader) · noun | president | Head of a country or organization | — |
| 166 · tipo | kind, type, sort, manner · noun | type; kind; sort | A category of things | clase |
| 167 · contra | against, versus · preposition | against | Opposition: “against the proposal” | — |
| 168 · nunca | never · adverb | never | — | jamás |
| 169 · ciudad | city · noun | city | — | — |
| 170 · además | in addition, moreover, furthermore, further, also, additionally · adverb | in addition; also | “It is cheap; besides, it is good.” | también |
| 171 · pues | so, then; in that case · conjunction | so; in that case | Introduce a conclusion from what was just said | entonces, luego |
| 172 · casi | almost · adverb | almost | — | — |
| 173 · mes | month · noun | month | — | — |
| 174 · político | political · adjective | political | Relating to politics · adjective | — |
| 175 · poco | little, not much · quantifier | little; not much | A small quantity · masculine singular headword | — |
| 176 · más | more (with a noun: más tiempo = more time) · quantifier | more | Quantity before a noun: “more time” | — |
| 177 · partido | party (politics); match or game (sports) · noun | match; game | A sports contest | encuentro, juego |
| 178 · proceso | process · noun | process | A sequence of stages in an activity or change | — |
| 179 · segundo | second (after the first) (ordinal number) · numeral | second | Position after first · masculine singular | — |
| 180 · cambio | change, shift · noun | change | Something becoming different | — |
| 181 · trabajar | to work · verb | to work | Do work or have a job | — |
| 182 · alto | tall; high; loud · adjective | tall; high | Vertical height | — |
| 183 · empezar | to start, begin, to get started · verb | to start; begin | Begin studying · followed by a + infinitive | comenzar |
| 184 · obra | work (usually literary or artistic) · noun | a work | A literary or artistic creation | trabajo |
| 185 · cuenta | account; bill; calculation · noun | account | A bank account | — |
| 186 · existir | to exist · verb | to exist | Be real, rather than imaginary | — |
| 187 · varios | several; various · quantifier | several; some | An unspecified number of people or things · plural | algunos, diversos |
| 188 · explicar | to explain (transitive) · verb | to explain | Make something clear or give the reason for it | aclarar |
| 189 · medio | means; medium; middle · noun | means | Something used to achieve a purpose | — |
| 190 · equipo | team · noun | team | The players competing on one side in a sport | conjunto |
| 191 · mí | me (after a preposition) · After a preposition · first-person singular | me | After a preposition: “for me” | — |
| 192 · noche | night (the period between sunset and sunrise) · noun | night | — | — |
| 193 · tras | after, following, in the wake of; upon · preposition | after; following | Preposition directly before the event: ___ la clase | — |
| 194 · estudio | study · noun | study | Investigation or analysis of a subject | investigación, análisis |
| 195 · mientras | while, whilst, as (at the same time as) (with the indicative) · conjunction | while | Introduce a simultaneous action: “while she reads” | — |
| 196 · mucho | a lot; much (modifying a verb, adjective or adverb) · adverb | a lot; much | Modifies an action: “work a lot” | — |
| 197 · agua | water · noun | water | — | — |
| 198 · aquí | here (in the speaker's location) · adverb | here | At the speaker’s location | acá |
| 199 · uno | one; someone; a person · quantifier | one; a person | Indefinite pronoun: “One never knows.” | — |
| 200 · empresa | company · noun | company | A business organization | compañía |

### Set 5: 201–250

| # / target | Before: definition · cue | Proposed definition | Proposed context | Additional answers |
| --- | --- | --- | --- | --- |
| 201 · gente | people · noun | people | Collective noun in general Spanish | — |
| 202 · recordar | to remember, to recollect (transitive) · verb | to remember; recall | Bring a past event back to mind | rememorar, acordarse |
| 203 · ninguno | none; no; not any · quantifier | none; not any | No member of a set · masculine singular headword | — |
| 204 · considerar | to consider, to regard, to see, to look, to view · verb | to consider | Think carefully about an option | pensar, reflexionar, contemplar |
| 205 · mantener | to keep (transitive) · verb | to maintain; keep | Keep something in its existing condition | conservar |
| 206 · centro | center (general) · noun | center | The middle of an area or object | medio |
| 207 · nivel | level, tier, height (distance relative to a given reference elevation) · noun | level | A position or degree on a scale | grado |
| 208 · perder | to lose (transitive) · verb | to lose | — | — |
| 209 · lado | side · noun | side | One side of an object | — |
| 210 · recibir | to receive, get (transitive) · verb | to receive | Be given or sent something | — |
| 211 · abrir | to open, open up (transitive, intransitive, reflexive) · verb | to open | — | — |
| 212 · pequeño | small; little · adjective | small; little | Size | chico |
| 213 · servicio | service · noun | service | — | — |
| 214 · proyecto | project, plan · noun | project; plan | A planned piece of work | plan |
| 215 · lograr | to get, to obtain (transitive) · verb | to manage to; succeed in | Achieve an action · directly followed by an infinitive | conseguir |
| 216 · general | general, overall · adjective | general; overall | — | global |
| 217 · preguntar | to ask (ditransitive, ambitransitive) · verb | to ask a question | Seek information from someone | — |
| 218 · tanto | so much, long, hard, often, etc · adverb | so much; as much | Modifies an action: “work so much” | — |
| 219 · ejemplo | example · noun | example | — | — |
| 220 · madre | mother · noun | mother | — | mamá |
| 221 · libro | book · noun | book | — | — |
| 222 · convertir | to turn into; to convert; convertirse en: to become · verb | to turn into; transform | Make something become something else · followed by en | transformar |
| 223 · único | only; single; sole · adjective | only; sole | Adjective: “the only child” | — |
| 224 · familia | family (group of people related to each other) · noun | family | People related to one another | — |
| 225 · salud | health · noun | health | — | — |
| 226 · semana | week (7 days) · noun | week | Seven days | — |
| 227 · comenzar | to begin, to commence · verb | to start; begin | Begin working · followed by a + infinitive | empezar |
| 228 · largo | long (having much distance from one terminating point to another) · adjective | long | Length from one end to the other | — |
| 229 · pedir | to ask for something (transitive) · verb | to ask for; request | Ask someone to give you something | solicitar |
| 230 · desarrollo | development · noun | development | The gradual unfolding of a process. | — |
| 231 · derecho | right (a legal, just or moral entitlement) · noun | a right; entitlement | Something a person is entitled to | — |
| 232 · entrar | to enter; to come in; to get in; to go in; to get inside; to come on in · verb | to enter; go in | Move from outside to inside | — |
| 233 · escribir | to write · verb | to write | — | — |
| 234 · situación | situation, scenario, picture · noun | situation; circumstances | The circumstances someone or something is in | estado, circunstancia |
| 235 · humano | human · adjective | human | Relating to human beings · adjective | — |
| 236 · aún | still; yet · adverb | still; yet | Continuing up to the reference time | todavía |
| 237 · palabra | word · noun | word | A unit of language | — |
| 238 · cuerpo | body (the physical structure of a human or animal) · noun | body | The physical body of a person or animal | — |
| 239 · mostrar | to show (have somebody see something) (transitive) · verb | to show | Let someone see something | presentar, enseñar |
| 240 · información | information, data (also countable) · noun | information | Facts or knowledge communicated about something | — |
| 241 · cualquiera | any; anyone; whichever · quantifier | any; whichever | Free choice: any member, no matter which | — |
| 242 · dentro | inside (for space) · adverb | inside | Adverb of place, used on its own | adentro |
| 243 · entender | to understand · verb | to understand | Grasp the meaning of an explanation | comprender |
| 244 · relación | relation · noun | relationship; connection | A connection between people or things | conexión, vínculo |
| 245 · tema | topic; subject; theme · noun | topic; subject | What a conversation or text is about | asunto |
| 246 · económico | economic · adjective | economic | Relating to the economy | — |
| 247 · ojo | eye (anatomy) · noun | eye | Body part | — |
| 248 · producir | to produce · verb | to produce; manufacture | Make goods or products | fabricar, hacer |
| 249 · político | politician · noun | politician | A person active in politics · noun | — |
| 250 · cuatro | four · numeral | four | — | — |

## Why these changes / evidence

The rationales below are editorial applications of the source findings, not quotations or claims that RAE approved these tests. The [60-group research inventory](lemma-day1-contrast-research.md) records targeted comparisons and limitations. Simple retained meanings need no new primary-source claim. Source links attached to a group do not imply every sense of every member was rechecked. Supplemental checks for external alternatives are recorded in the structured draft.

| # / target | Rationale for this exact prompt | Primary references |
| --- | --- | --- |
| 2 · de | Selects possession, not the overlapping de/desde origin sense. | [de](https://dle.rae.es/de) · [desde](https://dle.rae.es/desde) |
| 3 · y | State a concrete form/context so no hidden headword-versus-variant policy is needed. | [y](https://dle.rae.es/y) · [tambi%C3%A9n](https://dle.rae.es/tambi%C3%A9n) · [adem%C3%A1s](https://dle.rae.es/adem%C3%A1s) · [no](https://dle.rae.es/no) · [o](https://dle.rae.es/o) · [sin](https://dle.rae.es/sin) · [ni](https://dle.rae.es/ni) · [y](https://www.rae.es/dpd/y) |
| 4 · en | Preposition before a noun phrase; dentro needs de here. | [dentro](https://www.rae.es/dpd/dentro) |
| 5 · a | Selects an exact clock time, not direction toward a destination. | [para](https://dle.rae.es/para) · [a](https://dem.colmex.mx/ver/a) |
| 6 · un | State a concrete form/context so no hidden headword-versus-variant policy is needed. | [uno](https://dle.rae.es/uno) · [solo](https://dle.rae.es/solo) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) · [uno](https://www.rae.es/dpd/uno) |
| 7 · que | Restrictive relative referring to a thing; avoids the personal-relative overlap with quien. | [cual](https://www.rae.es/dpd/cual) · [tilde](https://www.rae.es/dpd/tilde) |
| 8 · ser | Identity, not a permanent-versus-temporary rule. | [ser](https://www.rae.es/dpd/ser) · [estar](https://www.rae.es/dpd/estar) |
| 9 · se | Selects se’s reflexive/reciprocal role, not every use of se. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) |
| 10 · que | Separates conjunction que from relative que; same spelling remains correct for both. | [cual](https://www.rae.es/dpd/cual) · [tilde](https://www.rae.es/dpd/tilde) |
| 11 · suyo | Names the possessor forms; ustedes is not necessarily formal. | [suyo](https://dle.rae.es/suyo) · [m%C3%ADo](https://dle.rae.es/m%C3%ADo) · [nuestro](https://dle.rae.es/nuestro) · [tuyo](https://dle.rae.es/tuyo) · [usted](https://www.rae.es/dpd/usted) · [voseo](https://www.rae.es/dpd/voseo) |
| 12 · con | Selects accompaniment rather than an ambiguous means/instrument gloss. | [por](https://dle.rae.es/por) |
| 14 · por | Selects cause, not the overlapping price/direction/purpose uses. | [por](https://dle.rae.es/por) · [para](https://dle.rae.es/para) |
| 15 · para | The recipient is distinct from acting on Ana’s behalf or giving a cause. | [por](https://dle.rae.es/por) · [para](https://dle.rae.es/para) · [a](https://dem.colmex.mx/ver/a) |
| 16 · lo | An inanimate reference avoids the accepted personal leísmo overlap. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) |
| 17 · este | One requested form; proximity anchors the demonstrative. | [este](https://dle.rae.es/este) · [ese](https://dle.rae.es/ese) · [aquel](https://dle.rae.es/aquel) |
| 18 · como | Miche, pp. 52–53, section 1.1.1 explicitly rejects fronting causal pues. Exclude it from this reason-first frame; this does not prohibit sentence-initial discourse pues. | [Miche, pp. 52–53](https://www.unige.ch/clf/fichiers/pdf/03-Miche_nclf15.pdf) |
| 19 · estar | A selected state use; not a claim that states must be temporary. | [ser](https://www.rae.es/dpd/ser) · [estar](https://www.rae.es/dpd/estar) · [estar](https://dle.rae.es/estar) · [seguir](https://dle.rae.es/seguir) · [quedar](https://dle.rae.es/quedar) · [mantener](https://dle.rae.es/mantener) |
| 20 · tener | Possession remains shared; haber’s auxiliary/existential senses do not fit. | [obtener](https://dle.rae.es/obtener) · [conseguir](https://dle.rae.es/conseguir) · [](https://www.fundeu.es/recomendacion/lograr-obtener-alcanzar-conseguir-resultado/) · [haber](https://dle.rae.es/haber) · [tener](https://dle.rae.es/tener) · [poseer](https://dle.rae.es/poseer) |
| 21 · ir | Distinguishes direction from venir; does not test departing/irse. | [dejar](https://dle.rae.es/dejar) · [salir](https://dle.rae.es/salir) · [ir](https://dle.rae.es/ir) · [pasar](https://dle.rae.es/pasar) · [llegar](https://dle.rae.es/llegar) · [volver](https://dle.rae.es/volver) · [venir](https://dle.rae.es/venir) · [entrar](https://dle.rae.es/entrar) |
| 22 · le | The indirect-object role is required; no blanket lo/le interchangeability. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) |
| 23 · más | Distinguishes adverbial más from the separate quantity card. | [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [mucho](https://dle.rae.es/mucho) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 24 · me | Excludes the prepositional form mí by grammatical role. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) |
| 25 · hacer | Use a daily task example rather than the same abstract prompt as realizar; retain reviewed task-performing alternatives because the cue still permits them. | [hacer](https://dle.rae.es/hacer) · [crear](https://dle.rae.es/crear) · [realizar](https://dle.rae.es/realizar) · [convertir](https://dle.rae.es/convertir) · [producir](https://dle.rae.es/producir) · [efectuar](https://dle.rae.es/efectuar) · [ejecutar](https://dle.rae.es/ejecutar) |
| 26 · poder | Ability, not granting permission or imposing an obligation. | [dejar](https://dle.rae.es/dejar) |
| 27 · ese | Specifies the reference point instead of bare that. | [este](https://dle.rae.es/este) · [ese](https://dle.rae.es/ese) · [aquel](https://dle.rae.es/aquel) |
| 28 · todo | The whole-of frame distinguishes todo from distributive cada. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) |
| 29 · o | State a concrete form/context so no hidden headword-versus-variant policy is needed. | [y](https://dle.rae.es/y) · [no](https://dle.rae.es/no) · [o](https://dle.rae.es/o) · [sin](https://dle.rae.es/sin) · [ni](https://dle.rae.es/ni) · [o](https://www.rae.es/dpd/o) |
| 30 · pero | Adds a contrast, rather than replacing a previously negated item with sino. | [sino](https://www.rae.es/dpd/sino) |
| 31 · él | Selects the subject form, avoiding ambiguity with English him. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) · [tilde](https://www.rae.es/dpd/tilde) |
| 32 · otro | Use a concrete additional-item frame rather than the ambiguous different one. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) · [mismo](https://dle.rae.es/mismo) · [propio](https://dle.rae.es/propio) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) |
| 33 · decir | Selects saying content, not speaking a language or narrating a story. | [decir](https://dle.rae.es/decir) · [hablar](https://dle.rae.es/hablar) · [contar](https://dle.rae.es/contar) · [llamar](https://dle.rae.es/llamar) · [explicar](https://dle.rae.es/explicar) |
| 35 · haber | Clearly separates auxiliary haber from possession with tener. | [haber](https://dle.rae.es/haber) · [tener](https://dle.rae.es/tener) |
| 36 · si | The accent/function distinction matters. | [tilde](https://www.rae.es/dpd/tilde) |
| 37 · mío | Removes the Spanish mi answer leak and specifies the requested form. | [suyo](https://dle.rae.es/suyo) · [m%C3%ADo](https://dle.rae.es/m%C3%ADo) · [nuestro](https://dle.rae.es/nuestro) · [tuyo](https://dle.rae.es/tuyo) · [usted](https://www.rae.es/dpd/usted) · [voseo](https://www.rae.es/dpd/voseo) |
| 39 · ver | Selects visual perception rather than the overlapping watch sense. | [sentir](https://dle.rae.es/sentir) · [ver](https://dle.rae.es/ver) · [mirar](https://dle.rae.es/mirar) |
| 40 · sobre | Un libro sobre historia and un libro de historia both fit this topic cue. | [dentro](https://www.rae.es/dpd/dentro) |
| 41 · cuando | Replace the uncommon expressed-antecedent cuando construction. Use an event-time clause rather than the day when; choose a punctual example so mientras is not another invited answer. | [cuando](https://dle.rae.es/cuando) · [durante](https://dle.rae.es/durante) · [mientras](https://dle.rae.es/mientras) · [mientras](https://www.rae.es/dpd/mientras) · [cual](https://www.rae.es/dpd/cual) · [adverbio-relativo](https://www.rae.es/gtg/adverbio-relativo) |
| 43 · también | The addition remains expressible with either adverb; not every placement is interchangeable. | [y](https://dle.rae.es/y) · [tambi%C3%A9n](https://dle.rae.es/tambi%C3%A9n) · [adem%C3%A1s](https://dle.rae.es/adem%C3%A1s) |
| 44 · ya | Selects completed-by-now ya, not the broad now gloss. | [tilde](https://www.rae.es/dpd/tilde) |
| 45 · nos | Explicit role and number. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) |
| 46 · uno | State a concrete form/context so no hidden headword-versus-variant policy is needed. | [uno](https://dle.rae.es/uno) · [solo](https://dle.rae.es/solo) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) · [uno](https://www.rae.es/dpd/uno) |
| 48 · te | Names the second-person system rather than implying vos requires another clitic. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) |
| 49 · muy | Bien can also intensify an adjective (bien alto); this exact degree cue still admits it. | [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [mucho](https://dle.rae.es/mucho) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 50 · desde | Use a complete since-Monday frame to select desde. Do not teach exclusive de+a / desde+hasta pairing: desde+a is also standard. | [de](https://dle.rae.es/de) · [desde](https://dle.rae.es/desde) · [entre](https://dle.rae.es/entre) · [hasta](https://dle.rae.es/hasta) · [durante](https://dle.rae.es/durante) · [hasta](https://www.rae.es/dpd/hasta) · [correlaciones-de-preposiciones](https://www.rae.es/gramática/sintaxis/correlaciones-de-preposiciones) |
| 51 · porque | Pues can supply the same causal explanation; this does not license its other discourse uses. | [entonces](https://dle.rae.es/entonces) · [luego](https://dle.rae.es/luego) |
| 52 · saber | Selects saber + infinitive, not general understanding or acquaintance. | [saber](https://dle.rae.es/saber) · [conocer](https://dle.rae.es/conocer) · [entender](https://dle.rae.es/entender) · [comprender](https://dle.rae.es/comprender) |
| 53 · primero | Shortens wording while retaining ordinal role. | [antes](https://www.rae.es/dpd/antes) · [despu%C3%A9s](https://www.rae.es/dpd/despu%C3%A9s) |
| 55 · mismo | Remove identical because the context tests identity of the individual, not resemblance. | [otro](https://dle.rae.es/otro) · [mismo](https://dle.rae.es/mismo) · [propio](https://dle.rae.es/propio) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) |
| 56 · qué | This asks what something is, not which item from a specified set. | [cual](https://www.rae.es/dpd/cual) · [tilde](https://www.rae.es/dpd/tilde) |
| 57 · alguno | An unspecified one can be expressed by alguno or uno; no forced distinction from the generic English cue. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) |
| 58 · vez | Occurrence count, not duration or clock time. | [vez](https://dle.rae.es/vez) · [d%C3%ADa](https://dle.rae.es/d%C3%ADa) · [tiempo](https://dle.rae.es/tiempo) · [momento](https://dle.rae.es/momento) · [hora](https://dle.rae.es/hora) |
| 60 · yo | Already clear; keep the role concise. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) |
| 61 · querer | Accept desear for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [querer](https://dle.rae.es/querer) · [esperar](https://dle.rae.es/esperar) · [desear](https://dle.rae.es/desear) |
| 62 · deber | Both express owing money. Selecting this sense separates deber from ability/permission, but does not make it unique. | [dejar](https://dle.rae.es/dejar) · [adeudar](https://dle.rae.es/adeudar) · [deber](https://dle.rae.es/deber) |
| 63 · solo | Accept solamente, únicamente for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [uno](https://dle.rae.es/uno) · [solo](https://dle.rae.es/solo) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) · [uno](https://www.rae.es/dpd/uno) |
| 64 · hasta | Specifies the intended endpoint sense; not every regional hasta sentence has the same polarity. | [entre](https://dle.rae.es/entre) · [desde](https://dle.rae.es/desde) · [hasta](https://dle.rae.es/hasta) · [durante](https://dle.rae.es/durante) · [hasta](https://www.rae.es/dpd/hasta) |
| 66 · pasar | All express the occurrence of an event; this excludes movement and spending-time uses. | [ir](https://dle.rae.es/ir) · [pasar](https://dle.rae.es/pasar) · [llegar](https://dle.rae.es/llegar) · [volver](https://dle.rae.es/volver) · [salir](https://dle.rae.es/salir) · [venir](https://dle.rae.es/venir) · [entrar](https://dle.rae.es/entrar) · [ocurrir](https://dle.rae.es/ocurrir) · [suceder](https://dle.rae.es/suceder) |
| 67 · mucho | Distinguishes quantifier mucho from the adverb card. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) · [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 68 · llegar | Selects reaching an endpoint rather than motion toward the speaker. | [ir](https://dle.rae.es/ir) · [pasar](https://dle.rae.es/pasar) · [llegar](https://dle.rae.es/llegar) · [volver](https://dle.rae.es/volver) · [salir](https://dle.rae.es/salir) · [venir](https://dle.rae.es/venir) · [entrar](https://dle.rae.es/entrar) |
| 69 · parte | Both directly name the selected partitive sense, not every section/place/role sense. | [parte](https://dle.rae.es/parte) · [lugar](https://dle.rae.es/lugar) · [punto](https://dle.rae.es/punto) · [centro](https://dle.rae.es/centro) · [nivel](https://dle.rae.es/nivel) · [lado](https://dle.rae.es/lado) · [porci%C3%B3n](https://dle.rae.es/porci%C3%B3n) |
| 70 · país | Accept nación for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [pa%C3%ADs](https://dle.rae.es/pa%C3%ADs) · [nacional](https://dle.rae.es/nacional) · [gobierno](https://dle.rae.es/gobierno) · [social](https://dle.rae.es/social) · [estado](https://dle.rae.es/estado) · [p%C3%BAblico](https://dle.rae.es/p%C3%BAblico) · [pol%C3%ADtico](https://dle.rae.es/pol%C3%ADtico) · [naci%C3%B3n](https://dle.rae.es/naci%C3%B3n) |
| 71 · grande | Narrowed selected sense; no claim that grande cannot also describe stature. | [grande](https://dle.rae.es/grande) · [mayor](https://dle.rae.es/mayor) · [alto](https://dle.rae.es/alto) · [peque%C3%B1o](https://dle.rae.es/peque%C3%B1o) · [largo](https://dle.rae.es/largo) · [mayor](https://www.rae.es/dpd/mayor) |
| 72 · tiempo | Distinguishes duration from occurrences, clock readings and weather. | [vez](https://dle.rae.es/vez) · [d%C3%ADa](https://dle.rae.es/d%C3%ADa) · [tiempo](https://dle.rae.es/tiempo) · [momento](https://dle.rae.es/momento) · [hora](https://dle.rae.es/hora) |
| 73 · donde | Relative donde, not question word dónde. | [cual](https://www.rae.es/dpd/cual) |
| 74 · nuestro | Retains the existing requested form. | [suyo](https://dle.rae.es/suyo) · [m%C3%ADo](https://dle.rae.es/m%C3%ADo) · [nuestro](https://dle.rae.es/nuestro) · [tuyo](https://dle.rae.es/tuyo) · [usted](https://www.rae.es/dpd/usted) · [voseo](https://www.rae.es/dpd/voseo) |
| 75 · dejar | Leaving an object behind, not exiting a place; salir/irse do not fit this transitive sense. | [dejar](https://dle.rae.es/dejar) · [salir](https://dle.rae.es/salir) · [ir](https://dle.rae.es/ir) |
| 76 · vida | Avoids confusion with the verbs vivir/existir. | [vida](https://dle.rae.es/vida) · [vivir](https://dle.rae.es/vivir) · [existir](https://dle.rae.es/existir) |
| 77 · llevar | Selects carrying, not grabbing/drinking with tomar or receiving. | [dejar](https://dle.rae.es/dejar) |
| 78 · persona | Both can name an individual human; humano has a noun use even though its Day 1 target card is adjectival. | [persona](https://dle.rae.es/persona) · [mujer](https://dle.rae.es/mujer) · [hombre](https://dle.rae.es/hombre) · [ni%C3%B1o](https://dle.rae.es/ni%C3%B1o) · [hijo](https://dle.rae.es/hijo) · [gente](https://dle.rae.es/gente) · [humano](https://dle.rae.es/humano) · [gente](https://www.rae.es/dpd/gente) · [individuo](https://dle.rae.es/individuo) |
| 79 · seguir | Selects following rather than continuing/remain/maintain. | [estar](https://dle.rae.es/estar) · [seguir](https://dle.rae.es/seguir) · [quedar](https://dle.rae.es/quedar) · [mantener](https://dle.rae.es/mantener) |
| 80 · cada | The actual construction selects cada; todo alone cannot fill this frame. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) · [siempre](https://dle.rae.es/siempre) · [nunca](https://dle.rae.es/nunca) |
| 81 · encontrar | Both fit successful discovery; this is not knowing/meeting someone for the first time. | [conocer](https://dle.rae.es/conocer) · [hallar](https://dle.rae.es/hallar) |
| 82 · quien | No overt noun antecedent; distinguishes this use from a generic que-relative. | [cual](https://www.rae.es/dpd/cual) |
| 83 · ni | Distinguishes coordination from no and the preposition sin. | [y](https://dle.rae.es/y) · [no](https://dle.rae.es/no) · [o](https://dle.rae.es/o) · [sin](https://dle.rae.es/sin) · [ni](https://dle.rae.es/ni) |
| 84 · después | Vary the example for usefulness, but retain reciprocal acceptance. Different examples do not prove which synonymous lemma was recalled. | [tras](https://dle.rae.es/tras) · [despu%C3%A9s](https://dle.rae.es/despu%C3%A9s) · [luego](https://dle.rae.es/luego) · [entonces](https://dle.rae.es/entonces) · [despu%C3%A9s](https://www.rae.es/dpd/despu%C3%A9s) · [luego](https://www.rae.es/dpd/luego) · [antes](https://www.rae.es/dpd/antes) |
| 85 · poner | Both fit physical placement; not every poner idiom. | [dejar](https://dle.rae.es/dejar) · [colocar](https://dle.rae.es/colocar) |
| 86 · quedar | Both express a remaining quantity; the prompt is not generic staying in a location. | [estar](https://dle.rae.es/estar) · [seguir](https://dle.rae.es/seguir) · [quedar](https://dle.rae.es/quedar) · [mantener](https://dle.rae.es/mantener) · [restar](https://dle.rae.es/restar) |
| 87 · bueno | Distinguishes noun quality from adverbial bien. | [bueno](https://dle.rae.es/bueno) · [bien](https://dle.rae.es/bien) · [mejor](https://dle.rae.es/mejor) · [bien](https://www.rae.es/dpd/bien) · [mejor](https://www.rae.es/dpd/mejor) |
| 88 · mujer | Selects the adult-person sense, not wife/partner. | [persona](https://dle.rae.es/persona) · [mujer](https://dle.rae.es/mujer) · [hombre](https://dle.rae.es/hombre) · [ni%C3%B1o](https://dle.rae.es/ni%C3%B1o) · [hijo](https://dle.rae.es/hijo) · [gente](https://dle.rae.es/gente) · [humano](https://dle.rae.es/humano) · [gente](https://www.rae.es/dpd/gente) |
| 89 · ahora | Narrows the selected time reference; not a claim that ahora has no extended uses. | [tilde](https://www.rae.es/dpd/tilde) · [ahora](https://dle.rae.es/ahora) · [hoy](https://dle.rae.es/hoy) |
| 90 · último | Accept final for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [antes](https://www.rae.es/dpd/antes) · [despu%C3%A9s](https://www.rae.es/dpd/despu%C3%A9s) · [final](https://dle.rae.es/final) |
| 91 · hablar | Select speaking a language to distinguish hablar from conversar; this is a meaningful sense selection to teach first. | [decir](https://dle.rae.es/decir) · [hablar](https://dle.rae.es/hablar) · [contar](https://dle.rae.es/contar) · [llamar](https://dle.rae.es/llamar) · [explicar](https://dle.rae.es/explicar) · [tratar](https://dle.rae.es/tratar) · [considerar](https://dle.rae.es/considerar) · [conversar](https://dle.rae.es/conversar) |
| 92 · así | Chooses manner instead of causal/consequential so. | [forma](https://dle.rae.es/forma) · [manera](https://dle.rae.es/manera) |
| 93 · aunque | Concession, not correction of a negated item. | [sino](https://www.rae.es/dpd/sino) |
| 94 · parecer | Selects appearing/seeming, not stating one’s own belief as true. | [pensar](https://dle.rae.es/pensar) · [creer](https://dle.rae.es/creer) · [sentir](https://dle.rae.es/sentir) |
| 95 · durante | Preposition with a noun phrase, not mientras introducing a clause. | [cuando](https://dle.rae.es/cuando) · [durante](https://dle.rae.es/durante) · [mientras](https://dle.rae.es/mientras) · [mientras](https://www.rae.es/dpd/mientras) · [entre](https://dle.rae.es/entre) · [desde](https://dle.rae.es/desde) · [hasta](https://dle.rae.es/hasta) · [hasta](https://www.rae.es/dpd/hasta) |
| 96 · aquel | Clear spatial reference; not a universal rule for discourse uses. | [este](https://dle.rae.es/este) · [ese](https://dle.rae.es/ese) · [aquel](https://dle.rae.es/aquel) |
| 97 · mundo | Selects world of human existence, not soil/land. | Existing baseline / editorial clarification |
| 98 · momento | Both fit this deliberately brief sense; momento can have broader senses elsewhere. | [vez](https://dle.rae.es/vez) · [d%C3%ADa](https://dle.rae.es/d%C3%ADa) · [tiempo](https://dle.rae.es/tiempo) · [momento](https://dle.rae.es/momento) · [hora](https://dle.rae.es/hora) · [instante](https://dle.rae.es/instante) |
| 100 · pensar | All fit reflection on a problem; this is not the shared opinion sense of pensar/creer/sentir. | [pensar](https://dle.rae.es/pensar) · [creer](https://dle.rae.es/creer) · [sentir](https://dle.rae.es/sentir) · [reflexionar](https://dle.rae.es/reflexionar) |
| 101 · forma | Remove outline, which unnecessarily invites contour/silhouette senses; keep figura for the physical-shape overlap. | [forma](https://dle.rae.es/forma) · [manera](https://dle.rae.es/manera) · [figura](https://dle.rae.es/figura) |
| 102 · casa | Accept hogar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [hogar](https://dle.rae.es/hogar) |
| 103 · mayor | Selects comparative age; does not teach mayor as always comparative. | [grande](https://dle.rae.es/grande) · [mayor](https://dle.rae.es/mayor) · [alto](https://dle.rae.es/alto) · [peque%C3%B1o](https://dle.rae.es/peque%C3%B1o) · [largo](https://dle.rae.es/largo) · [mayor](https://www.rae.es/dpd/mayor) |
| 104 · volver | Both fit returning to a place; this does not test volver a + infinitive. | [ir](https://dle.rae.es/ir) · [pasar](https://dle.rae.es/pasar) · [llegar](https://dle.rae.es/llegar) · [volver](https://dle.rae.es/volver) · [salir](https://dle.rae.es/salir) · [venir](https://dle.rae.es/venir) · [entrar](https://dle.rae.es/entrar) · [regresar](https://dle.rae.es/regresar) |
| 105 · bien | Adverbial manner, not adjective bueno. | [bueno](https://dle.rae.es/bueno) · [bien](https://dle.rae.es/bien) · [mejor](https://dle.rae.es/mejor) · [bien](https://www.rae.es/dpd/bien) · [mejor](https://www.rae.es/dpd/mejor) |
| 106 · antes | Distinguishes temporal antes from prepositional ante. | [antes](https://www.rae.es/dpd/antes) · [despu%C3%A9s](https://www.rae.es/dpd/despu%C3%A9s) |
| 108 · cómo | Retains the written accent and the manner sense. | [cual](https://www.rae.es/dpd/cual) · [tilde](https://www.rae.es/dpd/tilde) |
| 109 · tan | Selects tan in an equality construction; tanto modifies other elements or comparatives. | [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [mucho](https://dle.rae.es/mucho) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 110 · trabajo | Both can denote paid employment; excludes artwork as the intended sense. | [trabajo](https://dle.rae.es/trabajo) · [trabajar](https://dle.rae.es/trabajar) · [obra](https://dle.rae.es/obra) · [estudio](https://dle.rae.es/estudio) · [empleo](https://dle.rae.es/empleo) |
| 111 · algo | Drops anything, which depends strongly on polarity/context. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) |
| 112 · hombre | Selects the adult male sense, not humanity collectively. | [persona](https://dle.rae.es/persona) · [mujer](https://dle.rae.es/mujer) · [hombre](https://dle.rae.es/hombre) · [ni%C3%B1o](https://dle.rae.es/ni%C3%B1o) · [hijo](https://dle.rae.es/hijo) · [gente](https://dle.rae.es/gente) · [humano](https://dle.rae.es/humano) · [gente](https://www.rae.es/dpd/gente) |
| 113 · cosa | Select the unspecified-thing use rather than explicitly listing object and matter. | Existing baseline / editorial clarification |
| 114 · creer | Selects belief in existence; pensar en means thinking about, and sentir does not express this construction. This is a sense-selection proposal requiring teaching alignment. | [pensar](https://dle.rae.es/pensar) · [creer](https://dle.rae.es/creer) · [sentir](https://dle.rae.es/sentir) |
| 115 · salir | Selects crossing outward rather than leaving an object behind. | [dejar](https://dle.rae.es/dejar) · [salir](https://dle.rae.es/salir) · [ir](https://dle.rae.es/ir) · [pasar](https://dle.rae.es/pasar) · [llegar](https://dle.rae.es/llegar) · [volver](https://dle.rae.es/volver) · [venir](https://dle.rae.es/venir) · [entrar](https://dle.rae.es/entrar) |
| 116 · nacional | No claim that public or political is synonymous. | [pa%C3%ADs](https://dle.rae.es/pa%C3%ADs) · [nacional](https://dle.rae.es/nacional) · [gobierno](https://dle.rae.es/gobierno) · [social](https://dle.rae.es/social) · [estado](https://dle.rae.es/estado) · [p%C3%BAblico](https://dle.rae.es/p%C3%BAblico) · [pol%C3%ADtico](https://dle.rae.es/pol%C3%ADtico) |
| 118 · conocer | Selects acquaintance, not skill or comprehension of an explanation. | [saber](https://dle.rae.es/saber) · [conocer](https://dle.rae.es/conocer) · [entender](https://dle.rae.es/entender) · [comprender](https://dle.rae.es/comprender) |
| 119 · contar | Selects counting, not the overlapping tell/narrate sense. | [decir](https://dle.rae.es/decir) · [hablar](https://dle.rae.es/hablar) · [contar](https://dle.rae.es/contar) · [llamar](https://dle.rae.es/llamar) · [explicar](https://dle.rae.es/explicar) |
| 120 · niño | Accept chico for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [persona](https://dle.rae.es/persona) · [mujer](https://dle.rae.es/mujer) · [hombre](https://dle.rae.es/hombre) · [ni%C3%B1o](https://dle.rae.es/ni%C3%B1o) · [hijo](https://dle.rae.es/hijo) · [gente](https://dle.rae.es/gente) · [humano](https://dle.rae.es/humano) · [gente](https://www.rae.es/dpd/gente) · [chico](https://dle.rae.es/chico) |
| 121 · lugar | Both fit the selected location sense; no geometric-point restriction is intended. | [parte](https://dle.rae.es/parte) · [lugar](https://dle.rae.es/lugar) · [punto](https://dle.rae.es/punto) · [centro](https://dle.rae.es/centro) · [nivel](https://dle.rae.es/nivel) · [lado](https://dle.rae.es/lado) · [sitio](https://dle.rae.es/sitio) |
| 122 · gobierno | Selects the governing body rather than the entire political state or country. | [pa%C3%ADs](https://dle.rae.es/pa%C3%ADs) · [nacional](https://dle.rae.es/nacional) · [gobierno](https://dle.rae.es/gobierno) · [social](https://dle.rae.es/social) · [estado](https://dle.rae.es/estado) · [p%C3%BAblico](https://dle.rae.es/p%C3%BAblico) · [pol%C3%ADtico](https://dle.rae.es/pol%C3%ADtico) |
| 123 · tomar | Both fit drinking; this is not every take sense of tomar. | [dejar](https://dle.rae.es/dejar) · [beber](https://dle.rae.es/beber) · [tomar](https://dle.rae.es/tomar) |
| 124 · social | Distinguishes the selected society relation from public/government ownership. | [pa%C3%ADs](https://dle.rae.es/pa%C3%ADs) · [nacional](https://dle.rae.es/nacional) · [gobierno](https://dle.rae.es/gobierno) · [social](https://dle.rae.es/social) · [estado](https://dle.rae.es/estado) · [p%C3%BAblico](https://dle.rae.es/p%C3%BAblico) · [pol%C3%ADtico](https://dle.rae.es/pol%C3%ADtico) |
| 125 · llamar | Accept telefonear for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [decir](https://dle.rae.es/decir) · [hablar](https://dle.rae.es/hablar) · [contar](https://dle.rae.es/contar) · [llamar](https://dle.rae.es/llamar) · [explicar](https://dle.rae.es/explicar) · [telefonear](https://dle.rae.es/telefonear) |
| 126 · tratar | The construction selects tratar; intentar does not take this de. | [hablar](https://dle.rae.es/hablar) · [tratar](https://dle.rae.es/tratar) · [considerar](https://dle.rae.es/considerar) |
| 127 · tuyo | Explicit possessor forms avoid vague formal/informal labels. | [suyo](https://dle.rae.es/suyo) · [m%C3%ADo](https://dle.rae.es/m%C3%ADo) · [nuestro](https://dle.rae.es/nuestro) · [tuyo](https://dle.rae.es/tuyo) · [usted](https://www.rae.es/dpd/usted) · [voseo](https://www.rae.es/dpd/voseo) |
| 128 · sentir | Keep the original sensation example: sentir frío is valid and appears explicitly in the Diccionario del español de México. Tener frío is also idiomatic; it does not invalidate sentir frío. | [pensar](https://dle.rae.es/pensar) · [creer](https://dle.rae.es/creer) · [sentir](https://dle.rae.es/sentir) · [ver](https://dle.rae.es/ver) · [mirar](https://dle.rae.es/mirar) · [sentir](https://dem.colmex.mx/ver/sentir) |
| 129 · hora | A specific unit, not every hora sense. | [vez](https://dle.rae.es/vez) · [d%C3%ADa](https://dle.rae.es/d%C3%ADa) · [tiempo](https://dle.rae.es/tiempo) · [momento](https://dle.rae.es/momento) · [hora](https://dle.rae.es/hora) |
| 130 · venir | Anchors the viewpoint needed to distinguish venir from ir. | [ir](https://dle.rae.es/ir) · [pasar](https://dle.rae.es/pasar) · [llegar](https://dle.rae.es/llegar) · [volver](https://dle.rae.es/volver) · [salir](https://dle.rae.es/salir) · [venir](https://dle.rae.es/venir) · [entrar](https://dle.rae.es/entrar) |
| 131 · caso | Selects the investigation sense rather than generic situation/condition. | [caso](https://dle.rae.es/caso) · [estado](https://dle.rae.es/estado) · [situaci%C3%B3n](https://dle.rae.es/situaci%C3%B3n) |
| 132 · mano | Concise cue; no change in sense. | Existing baseline / editorial clarification |
| 133 · sino | Selects corrective sino rather than ordinary contrast with pero. | [sino](https://www.rae.es/dpd/sino) |
| 134 · crear | The new-creation sense still overlaps with hacer/producir; context does not make crear exclusive. | [hacer](https://dle.rae.es/hacer) · [crear](https://dle.rae.es/crear) · [realizar](https://dle.rae.es/realizar) · [convertir](https://dle.rae.es/convertir) · [producir](https://dle.rae.es/producir) |
| 135 · estado | Selects a political territorial sense, not condition/situación or all sovereign countries. | [caso](https://dle.rae.es/caso) · [estado](https://dle.rae.es/estado) · [situaci%C3%B3n](https://dle.rae.es/situaci%C3%B3n) · [pa%C3%ADs](https://dle.rae.es/pa%C3%ADs) · [nacional](https://dle.rae.es/nacional) · [gobierno](https://dle.rae.es/gobierno) · [social](https://dle.rae.es/social) · [p%C3%BAblico](https://dle.rae.es/p%C3%BAblico) · [pol%C3%ADtico](https://dle.rae.es/pol%C3%ADtico) |
| 136 · grupo | Accept conjunto for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [grupo](https://dle.rae.es/grupo) · [equipo](https://dle.rae.es/equipo) · [conjunto](https://dle.rae.es/conjunto) |
| 137 · realizar | Keep an action/task prompt and add ejecutar; it fits carrying out the action just as the already accepted efectuar does. | [hacer](https://dle.rae.es/hacer) · [crear](https://dle.rae.es/crear) · [realizar](https://dle.rae.es/realizar) · [convertir](https://dle.rae.es/convertir) · [producir](https://dle.rae.es/producir) · [efectuar](https://dle.rae.es/efectuar) · [ejecutar](https://dle.rae.es/ejecutar) |
| 139 · hijo | Family relation rather than the age category niño. | [persona](https://dle.rae.es/persona) · [mujer](https://dle.rae.es/mujer) · [hombre](https://dle.rae.es/hombre) · [ni%C3%B1o](https://dle.rae.es/ni%C3%B1o) · [hijo](https://dle.rae.es/hijo) · [gente](https://dle.rae.es/gente) · [humano](https://dle.rae.es/humano) · [gente](https://www.rae.es/dpd/gente) |
| 140 · mirar | Selects directing one’s gaze, not merely seeing or generic watch. | [sentir](https://dle.rae.es/sentir) · [ver](https://dle.rae.es/ver) · [mirar](https://dle.rae.es/mirar) |
| 142 · propio | Ownership sense, not identity or same. | [otro](https://dle.rae.es/otro) · [mismo](https://dle.rae.es/mismo) · [propio](https://dle.rae.es/propio) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) |
| 143 · vivir | Both fit residence; existir does not carry that selected home/residence meaning. | [vida](https://dle.rae.es/vida) · [vivir](https://dle.rae.es/vivir) · [existir](https://dle.rae.es/existir) · [residir](https://dle.rae.es/residir) · [habitar](https://dle.rae.es/habitar) |
| 144 · entonces | Selects reference to that time, not simply later/afterward. | [tras](https://dle.rae.es/tras) · [despu%C3%A9s](https://dle.rae.es/despu%C3%A9s) · [luego](https://dle.rae.es/luego) · [entonces](https://dle.rae.es/entonces) · [despu%C3%A9s](https://www.rae.es/dpd/despu%C3%A9s) · [luego](https://www.rae.es/dpd/luego) |
| 145 · mejor | Comparative quality, not every adverbial or superlative use. | [bueno](https://dle.rae.es/bueno) · [bien](https://dle.rae.es/bien) · [mejor](https://dle.rae.es/mejor) · [bien](https://www.rae.es/dpd/bien) · [mejor](https://www.rae.es/dpd/mejor) |
| 146 · permitir | Both fit permission; this does not accept dejar in unrelated senses. | [dejar](https://dle.rae.es/dejar) · [permitir](https://dle.rae.es/permitir) |
| 148 · cual | This explicit con la relative frame admits both cual and que; avoids treating every article + relative as interchangeable. | [cual](https://www.rae.es/dpd/cual) |
| 149 · punto | Selects a distinguishable point sense rather than broad location/lugar. | [parte](https://dle.rae.es/parte) · [lugar](https://dle.rae.es/lugar) · [punto](https://dle.rae.es/punto) · [centro](https://dle.rae.es/centro) · [nivel](https://dle.rae.es/nivel) · [lado](https://dle.rae.es/lado) |
| 150 · hacia | Both can express direction; “toward” does not make hacia exclusive. | [para](https://dle.rae.es/para) · [a](https://dem.colmex.mx/ver/a) |
| 151 · historia | Chooses history rather than an invented story or a report. | [historia](https://dle.rae.es/historia) · [cuenta](https://dle.rae.es/cuenta) · [palabra](https://dle.rae.es/palabra) · [informaci%C3%B3n](https://dle.rae.es/informaci%C3%B3n) · [relaci%C3%B3n](https://dle.rae.es/relaci%C3%B3n) · [tema](https://dle.rae.es/tema) |
| 152 · millón | Removes distracting cardinal/noun metadata from the definition. | Existing baseline / editorial clarification |
| 153 · hoy | Selects the day rather than the broad present-era overlap with ahora. | [ahora](https://dle.rae.es/ahora) · [hoy](https://dle.rae.es/hoy) |
| 154 · manera | All fit this manner sense; physical shape is not the requested use of forma. | [forma](https://dle.rae.es/forma) · [manera](https://dle.rae.es/manera) · [modo](https://dle.rae.es/modo) |
| 155 · luego | Vary the example for usefulness, but retain reciprocal acceptance. Different examples do not prove which synonymous lemma was recalled. | [tras](https://dle.rae.es/tras) · [despu%C3%A9s](https://dle.rae.es/despu%C3%A9s) · [luego](https://dle.rae.es/luego) · [entonces](https://dle.rae.es/entonces) · [despu%C3%A9s](https://www.rae.es/dpd/despu%C3%A9s) · [luego](https://www.rae.es/dpd/luego) |
| 156 · padre | Accept papá for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [pap%C3%A1](https://dle.rae.es/pap%C3%A1) |
| 157 · público | Chooses accessibility, not the separate state-owned sense. | [pa%C3%ADs](https://dle.rae.es/pa%C3%ADs) · [nacional](https://dle.rae.es/nacional) · [gobierno](https://dle.rae.es/gobierno) · [social](https://dle.rae.es/social) · [estado](https://dle.rae.es/estado) · [p%C3%BAblico](https://dle.rae.es/p%C3%BAblico) · [pol%C3%ADtico](https://dle.rae.es/pol%C3%ADtico) |
| 158 · ante | Preposition directly before a person; antes de is temporal, not this selected sense. | [antes](https://www.rae.es/dpd/antes) |
| 159 · menos | Adverbial comparison, not adjective fewer + noun. | [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [mucho](https://dle.rae.es/mucho) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 160 · presentar | Selects interpersonal introduction rather than showing/submitting something. | [presentar](https://dle.rae.es/presentar) · [mostrar](https://dle.rae.es/mostrar) |
| 161 · buscar | Search is not successful finding/encontrar. | [conocer](https://dle.rae.es/conocer) |
| 162 · sistema | Selects an organized whole, not a generic method/way. | [forma](https://dle.rae.es/forma) · [manera](https://dle.rae.es/manera) |
| 163 · problema | Both fit the difficulty sense; not every task or neutral situation. | [dificultad](https://dle.rae.es/dificultad) |
| 164 · esperar | Accept aguardar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [querer](https://dle.rae.es/querer) · [esperar](https://dle.rae.es/esperar) · [aguardar](https://dle.rae.es/aguardar) |
| 165 · presidente | Does not mean every leader or every politician. | Existing baseline / editorial clarification |
| 166 · tipo | Both fit a category; manner/way is not selected. | [forma](https://dle.rae.es/forma) · [manera](https://dle.rae.es/manera) · [clase](https://dle.rae.es/clase) |
| 167 · contra | Selects opposition rather than physical contact. | Existing baseline / editorial clarification |
| 168 · nunca | Accept jamás for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [cada](https://dle.rae.es/cada) · [siempre](https://dle.rae.es/siempre) · [nunca](https://dle.rae.es/nunca) · [jam%C3%A1s](https://dle.rae.es/jam%C3%A1s) |
| 170 · además | Use a further-point example to foreground además. Keep también: adding another true property can still be expressed with it. | [y](https://dle.rae.es/y) · [tambi%C3%A9n](https://dle.rae.es/tambi%C3%A9n) · [adem%C3%A1s](https://dle.rae.es/adem%C3%A1s) |
| 171 · pues | These can express consequence/inference; this is not the causal because use of pues. | [entonces](https://dle.rae.es/entonces) · [luego](https://dle.rae.es/luego) |
| 174 · político | Distinguishes the adjective from the person noun at #249. | [pa%C3%ADs](https://dle.rae.es/pa%C3%ADs) · [nacional](https://dle.rae.es/nacional) · [gobierno](https://dle.rae.es/gobierno) · [social](https://dle.rae.es/social) · [estado](https://dle.rae.es/estado) · [p%C3%BAblico](https://dle.rae.es/p%C3%BAblico) · [pol%C3%ADtico](https://dle.rae.es/pol%C3%ADtico) |
| 175 · poco | Selects quantity, not adjective small/pequeño. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) |
| 176 · más | Distinguishes the quantifier card from degree-adverb más. | [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [mucho](https://dle.rae.es/mucho) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 177 · partido | Accept juego for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [encuentro](https://dle.rae.es/encuentro) · [juego](https://dem.colmex.mx/ver/juego) |
| 178 · proceso | Selects a sequence of stages; not a project/plan or improvement by definition. | [proceso](https://dle.rae.es/proceso) · [cambio](https://dle.rae.es/cambio) · [proyecto](https://dle.rae.es/proyecto) · [desarrollo](https://dle.rae.es/desarrollo) |
| 179 · segundo | The ordinal, not the unit of time. | [antes](https://www.rae.es/dpd/antes) · [despu%C3%A9s](https://www.rae.es/dpd/despu%C3%A9s) |
| 180 · cambio | Not specifically development or improvement. | [proceso](https://dle.rae.es/proceso) · [cambio](https://dle.rae.es/cambio) · [proyecto](https://dle.rae.es/proyecto) · [desarrollo](https://dle.rae.es/desarrollo) |
| 181 · trabajar | The verb, rather than noun trabajo/obra. | [trabajo](https://dle.rae.es/trabajo) · [trabajar](https://dle.rae.es/trabajar) · [obra](https://dle.rae.es/obra) · [estudio](https://dle.rae.es/estudio) |
| 182 · alto | Selects height rather than loudness; grande can overlap in some descriptions. | [grande](https://dle.rae.es/grande) · [mayor](https://dle.rae.es/mayor) · [alto](https://dle.rae.es/alto) · [peque%C3%B1o](https://dle.rae.es/peque%C3%B1o) · [largo](https://dle.rae.es/largo) · [mayor](https://www.rae.es/dpd/mayor) |
| 183 · empezar | Vary the example for usefulness, but retain reciprocal acceptance. Different examples do not prove which synonymous lemma was recalled. | [empezar](https://dle.rae.es/empezar) · [comenzar](https://dle.rae.es/comenzar) · [303](https://www.canela.org.es/cuadernos-canela/index.php/cuadernos/article/view/303) |
| 184 · obra | Trabajo can also name the produced work; “artistic” is not an absolute exclusion. | [trabajo](https://dle.rae.es/trabajo) · [trabajar](https://dle.rae.es/trabajar) · [obra](https://dle.rae.es/obra) · [estudio](https://dle.rae.es/estudio) |
| 185 · cuenta | Avoids confusing financial cuenta with a narrative account/relación. | [historia](https://dle.rae.es/historia) · [cuenta](https://dle.rae.es/cuenta) · [palabra](https://dle.rae.es/palabra) · [informaci%C3%B3n](https://dle.rae.es/informaci%C3%B3n) · [relaci%C3%B3n](https://dle.rae.es/relaci%C3%B3n) · [tema](https://dle.rae.es/tema) |
| 186 · existir | Selects existence/reality, not residence or simply being alive. | [haber](https://dle.rae.es/haber) · [tener](https://dle.rae.es/tener) · [vida](https://dle.rae.es/vida) · [vivir](https://dle.rae.es/vivir) · [existir](https://dle.rae.es/existir) |
| 187 · varios | Accept diversos for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) · [diverso](https://dle.rae.es/diverso) |
| 188 · explicar | Accept aclarar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [decir](https://dle.rae.es/decir) · [hablar](https://dle.rae.es/hablar) · [contar](https://dle.rae.es/contar) · [llamar](https://dle.rae.es/llamar) · [explicar](https://dle.rae.es/explicar) · [aclarar](https://dle.rae.es/aclarar) |
| 189 · medio | Selects means rather than middle; a generic method may still overlap in particular examples. | [forma](https://dle.rae.es/forma) · [manera](https://dle.rae.es/manera) |
| 190 · equipo | Accept conjunto for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [grupo](https://dle.rae.es/grupo) · [equipo](https://dle.rae.es/equipo) · [conjunto](https://dle.rae.es/conjunto) |
| 191 · mí | Selects mí rather than unstressed me. | [le%C3%ADsmo](https://www.rae.es/dpd/le%C3%ADsmo) |
| 193 · tras | A single-headword answer in this construction is tras; después/luego require de before this noun phrase. Multiword después de/luego de are valid translations, not equivalent bare headwords. | [tras](https://dle.rae.es/tras) · [despu%C3%A9s](https://dle.rae.es/despu%C3%A9s) · [luego](https://dle.rae.es/luego) · [entonces](https://dle.rae.es/entonces) · [despu%C3%A9s](https://www.rae.es/dpd/despu%C3%A9s) · [luego](https://www.rae.es/dpd/luego) |
| 194 · estudio | Accept análisis for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [trabajo](https://dle.rae.es/trabajo) · [trabajar](https://dle.rae.es/trabajar) · [obra](https://dle.rae.es/obra) · [estudio](https://dle.rae.es/estudio) · [investigaci%C3%B3n](https://dle.rae.es/investigaci%C3%B3n) · [an%C3%A1lisis](https://dle.rae.es/an%C3%A1lisis) |
| 195 · mientras | Removes the blanket indicative-only wording; simultaneity is the selected sense. | [cuando](https://dle.rae.es/cuando) · [durante](https://dle.rae.es/durante) · [mientras](https://dle.rae.es/mientras) · [mientras](https://www.rae.es/dpd/mientras) |
| 196 · mucho | Distinguishes the adverb from quantity before a noun and muy before noncomparatives. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) · [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 198 · aquí | The broad speaker-location prompt admits acá as well as aquí; geographical preferences are not an exclusion. | [aqu%C3%AD](https://dle.rae.es/aqu%C3%AD) · [ac%C3%A1](https://dle.rae.es/ac%C3%A1) |
| 199 · uno | Generic person rather than numeral one or a specific someone. | [uno](https://dle.rae.es/uno) · [solo](https://dle.rae.es/solo) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) · [uno](https://www.rae.es/dpd/uno) |
| 200 · empresa | Accept compañía for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [compa%C3%B1%C3%ADa](https://dle.rae.es/compa%C3%B1%C3%ADa) |
| 201 · gente | Selects collective gente; personas is a plural, not the requested dictionary headword. Regional individual gente remains valid Spanish. | [persona](https://dle.rae.es/persona) · [mujer](https://dle.rae.es/mujer) · [hombre](https://dle.rae.es/hombre) · [ni%C3%B1o](https://dle.rae.es/ni%C3%B1o) · [hijo](https://dle.rae.es/hijo) · [gente](https://dle.rae.es/gente) · [humano](https://dle.rae.es/humano) · [gente](https://www.rae.es/dpd/gente) |
| 202 · recordar | All proposed answers express recalling a past event. Acordarse is one pronominal infinitive; the English cue does not impose the direct-object construction of recordar. | [saber](https://dle.rae.es/saber) · [rememorar](https://dle.rae.es/rememorar) · [recordar](https://dle.rae.es/recordar) · [acordar](https://dle.rae.es/acordar) |
| 203 · ninguno | No/none quantifier, not free-choice cualquiera or the adverb no. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) |
| 204 · considerar | Accept contemplar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [pensar](https://dle.rae.es/pensar) · [creer](https://dle.rae.es/creer) · [sentir](https://dle.rae.es/sentir) · [hablar](https://dle.rae.es/hablar) · [tratar](https://dle.rae.es/tratar) · [considerar](https://dle.rae.es/considerar) · [reflexionar](https://dle.rae.es/reflexionar) · [contemplar](https://dle.rae.es/contemplar) |
| 205 · mantener | Remove preserve as the primary English gloss; specify maintaining an existing state. Do not turn the distinction from protective preservar into a universal exclusion. | [estar](https://dle.rae.es/estar) · [seguir](https://dle.rae.es/seguir) · [quedar](https://dle.rae.es/quedar) · [mantener](https://dle.rae.es/mantener) · [conservar](https://dle.rae.es/conservar) · [preservar](https://dle.rae.es/preservar) |
| 206 · centro | Both fit the selected middle sense; not every institutional centro use. | [parte](https://dle.rae.es/parte) · [lugar](https://dle.rae.es/lugar) · [punto](https://dle.rae.es/punto) · [centro](https://dle.rae.es/centro) · [nivel](https://dle.rae.es/nivel) · [lado](https://dle.rae.es/lado) |
| 207 · nivel | Accept grado for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [parte](https://dle.rae.es/parte) · [lugar](https://dle.rae.es/lugar) · [punto](https://dle.rae.es/punto) · [centro](https://dle.rae.es/centro) · [nivel](https://dle.rae.es/nivel) · [lado](https://dle.rae.es/lado) · [grado](https://dle.rae.es/grado) |
| 209 · lado | Selects a side, not a location in general. | [parte](https://dle.rae.es/parte) · [lugar](https://dle.rae.es/lugar) · [punto](https://dle.rae.es/punto) · [centro](https://dle.rae.es/centro) · [nivel](https://dle.rae.es/nivel) · [lado](https://dle.rae.es/lado) |
| 210 · recibir | Receipt, not necessarily achieving a goal or already possessing it. | [obtener](https://dle.rae.es/obtener) · [conseguir](https://dle.rae.es/conseguir) · [](https://www.fundeu.es/recomendacion/lograr-obtener-alcanzar-conseguir-resultado/) · [dejar](https://dle.rae.es/dejar) |
| 212 · pequeño | Chico also describes small size; this does not accept it for every little/young sense. | [grande](https://dle.rae.es/grande) · [mayor](https://dle.rae.es/mayor) · [alto](https://dle.rae.es/alto) · [peque%C3%B1o](https://dle.rae.es/peque%C3%B1o) · [largo](https://dle.rae.es/largo) · [mayor](https://www.rae.es/dpd/mayor) · [chico](https://dle.rae.es/chico) |
| 214 · proyecto | The planned undertaking sense remains expressible with either word; proceso describes its unfolding rather than the plan itself. | [proceso](https://dle.rae.es/proceso) · [cambio](https://dle.rae.es/cambio) · [proyecto](https://dle.rae.es/proyecto) · [desarrollo](https://dle.rae.es/desarrollo) · [plan](https://dle.rae.es/plan) |
| 215 · lograr | Both fit lograr/conseguir + infinitive. Obtener does not fit this direct infinitive construction. | [obtener](https://dle.rae.es/obtener) · [conseguir](https://dle.rae.es/conseguir) · [](https://www.fundeu.es/recomendacion/lograr-obtener-alcanzar-conseguir-resultado/) |
| 216 · general | Accept global for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [global](https://dle.rae.es/global) |
| 217 · preguntar | Distinguishes questioning from requesting something with pedir. | [preguntar](https://dle.rae.es/preguntar) · [pedir](https://dle.rae.es/pedir) |
| 218 · tanto | Selects adverbial tanto rather than tan before an adjective or plain mucho. | [m%C3%A1s](https://dle.rae.es/m%C3%A1s) · [muy](https://dle.rae.es/muy) · [mucho](https://dle.rae.es/mucho) · [tan](https://dle.rae.es/tan) · [menos](https://dle.rae.es/menos) · [casi](https://dle.rae.es/casi) · [tanto](https://dle.rae.es/tanto) · [mucho](https://www.rae.es/dpd/mucho) · [tanto](https://www.rae.es/dpd/tanto) |
| 220 · madre | Accept mamá for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [mam%C3%A1](https://dle.rae.es/mam%C3%A1) |
| 222 · convertir | Both fit transformation into something; the infinitive is transitive here, not pronominal becoming. | [hacer](https://dle.rae.es/hacer) · [crear](https://dle.rae.es/crear) · [realizar](https://dle.rae.es/realizar) · [convertir](https://dle.rae.es/convertir) · [producir](https://dle.rae.es/producir) · [transformar](https://dle.rae.es/transformar) |
| 223 · único | Selects sole offspring (hijo único), not the adverb only or being unaccompanied (hijo solo). | [uno](https://dle.rae.es/uno) · [solo](https://dle.rae.es/solo) · [%C3%BAnico](https://dle.rae.es/%C3%BAnico) · [uno](https://www.rae.es/dpd/uno) · [otro](https://dle.rae.es/otro) · [mismo](https://dle.rae.es/mismo) · [propio](https://dle.rae.es/propio) |
| 224 · familia | Selects the family relationship, not any group/team. | Existing baseline / editorial clarification |
| 226 · semana | Keeps the unit explicit. | Existing baseline / editorial clarification |
| 227 · comenzar | Vary the example for usefulness, but retain reciprocal acceptance. Different examples do not prove which synonymous lemma was recalled. | [empezar](https://dle.rae.es/empezar) · [comenzar](https://dle.rae.es/comenzar) · [303](https://www.canela.org.es/cuadernos-canela/index.php/cuadernos/article/view/303) |
| 228 · largo | Selects length, not vertical height or overall size. | [grande](https://dle.rae.es/grande) · [mayor](https://dle.rae.es/mayor) · [alto](https://dle.rae.es/alto) · [peque%C3%B1o](https://dle.rae.es/peque%C3%B1o) · [largo](https://dle.rae.es/largo) · [mayor](https://www.rae.es/dpd/mayor) |
| 229 · pedir | Both fit requesting; preguntar does not denote requesting the item itself. | [preguntar](https://dle.rae.es/preguntar) · [pedir](https://dle.rae.es/pedir) · [solicitar](https://dle.rae.es/solicitar) |
| 230 · desarrollo | Replace growth with gradual unfolding to foreground development. This is a selected meaning, not a claim that desarrollo and crecimiento never overlap. | [proceso](https://dle.rae.es/proceso) · [cambio](https://dle.rae.es/cambio) · [proyecto](https://dle.rae.es/proyecto) · [desarrollo](https://dle.rae.es/desarrollo) · [crecimiento](https://dle.rae.es/crecimiento) |
| 231 · derecho | Not direction/right-hand, law as a field, or adjective correct. | Existing baseline / editorial clarification |
| 232 · entrar | Selects entering rather than merely arriving at a destination. | [ir](https://dle.rae.es/ir) · [pasar](https://dle.rae.es/pasar) · [llegar](https://dle.rae.es/llegar) · [volver](https://dle.rae.es/volver) · [salir](https://dle.rae.es/salir) · [venir](https://dle.rae.es/venir) · [entrar](https://dle.rae.es/entrar) |
| 234 · situación | Accept circunstancia for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [caso](https://dle.rae.es/caso) · [estado](https://dle.rae.es/estado) · [situaci%C3%B3n](https://dle.rae.es/situaci%C3%B3n) · [circunstancia](https://dle.rae.es/circunstancia) |
| 235 · humano | Distinguishes the adjective from the noun person. | [persona](https://dle.rae.es/persona) · [mujer](https://dle.rae.es/mujer) · [hombre](https://dle.rae.es/hombre) · [ni%C3%B1o](https://dle.rae.es/ni%C3%B1o) · [hijo](https://dle.rae.es/hijo) · [gente](https://dle.rae.es/gente) · [humano](https://dle.rae.es/humano) · [gente](https://www.rae.es/dpd/gente) |
| 236 · aún | Both express continuation; this does not cover unaccented aun meaning even. | [tilde](https://www.rae.es/dpd/tilde) |
| 237 · palabra | Selects the linguistic unit rather than a topic or information. | [historia](https://dle.rae.es/historia) · [cuenta](https://dle.rae.es/cuenta) · [palabra](https://dle.rae.es/palabra) · [informaci%C3%B3n](https://dle.rae.es/informaci%C3%B3n) · [relaci%C3%B3n](https://dle.rae.es/relaci%C3%B3n) · [tema](https://dle.rae.es/tema) |
| 238 · cuerpo | Keeps the anatomical sense. | Existing baseline / editorial clarification |
| 239 · mostrar | Accept enseñar for the current visible prompt; the lexical meaning/construction fits, without a hidden register or dialect restriction. | [presentar](https://dle.rae.es/presentar) · [mostrar](https://dle.rae.es/mostrar) · [ense%C3%B1ar](https://dle.rae.es/ense%C3%B1ar) |
| 240 · información | Removes the misleading generic “also countable” wording; specific plural uses belong in teaching notes. | [historia](https://dle.rae.es/historia) · [cuenta](https://dle.rae.es/cuenta) · [palabra](https://dle.rae.es/palabra) · [informaci%C3%B3n](https://dle.rae.es/informaci%C3%B3n) · [relaci%C3%B3n](https://dle.rae.es/relaci%C3%B3n) · [tema](https://dle.rae.es/tema) |
| 241 · cualquiera | Selects free-choice cualquiera rather than existential alguno or negative ninguno. | [todo](https://dle.rae.es/todo) · [otro](https://dle.rae.es/otro) · [alguno](https://dle.rae.es/alguno) · [mucho](https://dle.rae.es/mucho) · [cada](https://dle.rae.es/cada) · [algo](https://dle.rae.es/algo) · [nada](https://dle.rae.es/nada) · [poco](https://dle.rae.es/poco) · [varios](https://dle.rae.es/varios) · [ninguno](https://dle.rae.es/ninguno) · [cualquiera](https://dle.rae.es/cualquiera) · [alguno](https://www.rae.es/dpd/alguno) · [ninguno](https://www.rae.es/dpd/ninguno) · [cualquiera](https://www.rae.es/dpd/cualquiera) |
| 242 · dentro | Both can express interior location; regional preferences do not make one wrong. | [dentro](https://www.rae.es/dpd/dentro) · [adentro](https://www.rae.es/dpd/adentro) |
| 243 · entender | Both fit comprehension; no unsupported shallow/deep distinction. | [saber](https://dle.rae.es/saber) · [conocer](https://dle.rae.es/conocer) · [entender](https://dle.rae.es/entender) · [comprender](https://dle.rae.es/comprender) |
| 244 · relación | Both fit a connection; the prompt does not test a list or narrative account. | [historia](https://dle.rae.es/historia) · [cuenta](https://dle.rae.es/cuenta) · [palabra](https://dle.rae.es/palabra) · [informaci%C3%B3n](https://dle.rae.es/informaci%C3%B3n) · [relaci%C3%B3n](https://dle.rae.es/relaci%C3%B3n) · [tema](https://dle.rae.es/tema) · [conexi%C3%B3n](https://dle.rae.es/conexi%C3%B3n) · [v%C3%ADnculo](https://dle.rae.es/v%C3%ADnculo) |
| 245 · tema | Both fit subject matter; not every sense of subject/topic. | [historia](https://dle.rae.es/historia) · [cuenta](https://dle.rae.es/cuenta) · [palabra](https://dle.rae.es/palabra) · [informaci%C3%B3n](https://dle.rae.es/informaci%C3%B3n) · [relaci%C3%B3n](https://dle.rae.es/relaci%C3%B3n) · [tema](https://dle.rae.es/tema) · [asunto](https://dle.rae.es/asunto) |
| 246 · económico | Selects economic rather than economical/cheap. | Existing baseline / editorial clarification |
| 247 · ojo | Concise anatomical cue. | Existing baseline / editorial clarification |
| 248 · producir | Both fit production of goods; this does not cover every causar/producir sense. | [hacer](https://dle.rae.es/hacer) · [crear](https://dle.rae.es/crear) · [realizar](https://dle.rae.es/realizar) · [convertir](https://dle.rae.es/convertir) · [producir](https://dle.rae.es/producir) · [fabricar](https://dle.rae.es/fabricar) |
| 249 · político | Distinguishes the person from adjective político at #174. | [pa%C3%ADs](https://dle.rae.es/pa%C3%ADs) · [nacional](https://dle.rae.es/nacional) · [gobierno](https://dle.rae.es/gobierno) · [social](https://dle.rae.es/social) · [estado](https://dle.rae.es/estado) · [p%C3%BAblico](https://dle.rae.es/p%C3%BAblico) · [pol%C3%ADtico](https://dle.rae.es/pol%C3%ADtico) |

## Accuracy recheck: meaning, usage and grading

All 250 proposed rows and the 60 contrast summaries were reconsidered. This is a draft review, not approval to implement. New primary checks supplement the existing evidence; this does not claim 250 fresh independent source verifications.

The standard is now explicit: **teach a useful distinction at a lower threshold than rejecting an answer**. Register and regional preferences can guide learning without becoming hidden requirements. No pair is certified as universally identical across all senses and idioms.

- **Equivalent in this use:** teach as alternatives for the selected meaning; do not manufacture a contrast. Examples: aún/todavía for continuing still; entender/comprender for understanding an explanation.
- **Overlap with a distinction:** explain the difference, while accepting both when the visible prompt fits both. Examples: pedir/solicitar, poner/colocar, empezar/comenzar.
- **Distinct in the selected context:** use meaning or a real construction to separate them. Examples: saber how to swim / conocer a person; leaving keys / exiting a room; por a cause / para a recipient. This does not certify the target as the only possible Spanish translation.

**Corrections:** the earlier “no invented formality label” treatment of empezar/comenzar was too dismissive of real tendencies. [Krohn’s original corpus study](https://www.canela.org.es/cuadernos-canela/index.php/cuadernos/article/view/303) reports register and regional differences. Teach those tendencies, while keeping both answers. Added missing acá for the unrestricted here prompt and acordarse for recalling an event; made the cual/que context an actual sentence. DPD /pues has no entry; the checked source is DLE pues.

The notes below are proposed contextual teaching/post-answer explanations, **not additional hidden grading constraints**. Lexical/construction distinctions draw on the row’s linked evidence. Unless explicitly attributed to corpus/DPD findings, these are pedagogical applications of senses, not measured claims about relative frequency. Keep the short prompts above; do not display this whole audit to the learner.

| # / target | Treatment | Proposed clarification |
| --- | --- | --- |
| 18 · como | overlap-with-distinction | Como introduces a background reason first. Porque can also introduce a fronted cause, with different emphasis. Causal pues follows the statement it explains; sentence-initial pues has other discourse uses. |
| 20 · tener | overlap-with-distinction | Tener is broad having; poseer specifically expresses possession. The property context fits both, while tener hambre and tener que do not take poseer. |
| 25 · hacer | overlap-with-distinction | Hacer is broad do/make. Realizar, efectuar and ejecutar express carrying something out. They may be less natural choices for homework but are not barred by an undisplayed register rule. |
| 40 · sobre | overlap-with-distinction | Sobre explicitly presents the topic. De can classify a book by its subject. Both describe a history book; they do not share all their other prepositional uses. |
| 43 · también | overlap-with-distinction | También adds another participant or parallel fact. Además adds further information and can connect whole statements. The translation here allows both, with appropriate placement. |
| 49 · muy | overlap-with-distinction | Muy is the general degree word here. Bien also intensifies adjectives, with an emphatic reading. A bare very tall cue cannot fairly reject bien alto. |
| 50 · desde | distinct-in-selected-context | Desde marks the starting point continuing to the present here. In bounded spans, de…a, desde…a and desde…hasta are all valid. |
| 51 · porque | overlap-with-distinction | Porque supplies the cause directly. Causal pues supplies an explanatory reason, often as an added clause. The English sentence permits both; placement and punctuation in Spanish may differ. |
| 57 · alguno | overlap-with-distinction | Alguno picks an unspecified member of a set; uno can introduce an unspecified individual. This generic singular cue leaves both possible. |
| 61 · querer | overlap-with-distinction | Querer expresses wanting; desear expresses desire. Changing desire to want in English would not remove the overlap. |
| 62 · deber | overlap-with-distinction | Deber covers obligations as well as debts. Adeudar specifically fits material debt here; it is not a substitute in deber estudiar. |
| 63 · solo | overlap-with-distinction | Solo, solamente and únicamente all express only in this quantity prompt. This does not concern adjectival solo meaning alone. |
| 66 · pasar | equivalent-in-this-use | Pasar, ocurrir and suceder all express an event happening here. Pasar also has many movement/time senses that the other two do not share. |
| 69 · parte | overlap-with-distinction | Parte is a general part of a whole. Porción emphasizes an amount separated or allocated from a larger amount. The present portion cue deliberately fits both. |
| 70 · país | overlap-with-distinction | País foregrounds a country/territory; nación can denote a people or its territory. Both fit this broad country prompt, without being identical in political or cultural discussion. |
| 78 · persona | overlap-with-distinction | Persona is the general person noun. Individuo can identify an unnamed individual; humano foregrounds being human. Accepting the broad noun prompt does not teach these as neutral replacements in every social context. |
| 81 · encontrar | equivalent-in-this-use | Encontrar and hallar both work for finding a searched-for object. Their other constructions differ, including encontrarse con someone; no register restriction is tested here. |
| 84 · después | overlap-with-distinction | Después expresses later/after and uses de before a named event. Luego also means later/next and has additional inferential uses. Both fit the bare later sentence; luego de also exists. |
| 85 · poner | overlap-with-distinction | Poner is broad putting. Colocar focuses on placing something in a position or appropriate place. Neither a placement cue nor a deliberate action makes poner wrong. |
| 86 · quedar | overlap-with-distinction | Quedar is broad remaining/being left. Restar expresses what remains, including a quantity, and also subtraction. Three remaining tickets fits both. |
| 90 · último | overlap-with-distinction | Último marks the last position; final marks what closes or ends something. Both fit the end-of-sequence cue. |
| 98 · momento | overlap-with-distinction | Momento can be a brief interval or a period distinguished by events. Instante specifically denotes a very brief interval. This brief-time cue leaves overlap; there is no fixed seconds cutoff. |
| 100 · pensar | overlap-with-distinction | Pensar is broad thinking. Reflexionar stresses attentive, sustained thought; considerar can mean examining an option or issue. The ponder/reflect wording fits all three. |
| 101 · forma | overlap-with-distinction | Forma describes shape/configuration and also manner. Figura can describe an exterior outline or shape. Only physical shape is being accepted here. |
| 102 · casa | overlap-with-distinction | Casa names a house/home. Hogar can mean a home or household; it is not exclusively an emotional concept. The broad house/home prompt admits it. |
| 104 · volver | equivalent-in-this-use | Volver and regresar both mean return to a place here. Volver a + infinitive can mean do again; that construction does not make regresar interchangeable. |
| 110 · trabajo | overlap-with-distinction | Trabajo covers work, effort and its result. Empleo specifies employment/a job. Paid employment fits both; an artwork or homework need not be an empleo. |
| 120 · niño | overlap-with-distinction | Niño names a child; chico can refer to a child or a young person more broadly. The age context excludes the family-relation sense of hijo, not chico. |
| 121 · lugar | equivalent-in-this-use | Lugar and sitio both name a place in this context. Neither should be forced out of a generic location prompt; fixed expressions and other senses remain separate. |
| 123 · tomar | overlap-with-distinction | Tomar is broad taking and also consuming; beber specifically denotes drinking. Both fit a beverage, but beber cannot replace tomar in taking a bus. |
| 125 · llamar | overlap-with-distinction | Llamar has several calling meanings; telefonear specifically denotes telephone communication. Both fit this prompt; no unsupported frequency ranking is needed. |
| 134 · crear | overlap-with-distinction | Crear emphasizes bringing something into existence; producir emphasizes producing an output or result; hacer is broader making/doing. This broad creation prompt does not identify a unique verb. |
| 136 · grupo | overlap-with-distinction | Grupo and conjunto can both denote things or people considered together. Restricting to people alone would not exclude conjunto. |
| 137 · realizar | overlap-with-distinction | Realizar, efectuar and ejecutar specify carrying an action out; hacer is broader. These overlap for the present action/task cue. |
| 143 · vivir | overlap-with-distinction | Vivir includes being alive and residing. Residir selects having a residence; habitar selects dwelling in a place. The home context fits all three without making them identical elsewhere. |
| 146 · permitir | overlap-with-distinction | Permitir expresses allowing/making possible. Dejar can mean letting someone do something, alongside leaving/abandoning meanings. Only permission overlaps here. |
| 148 · cual | overlap-with-distinction | El cual and el que overlap in this relative construction. Some constructions require cual, so acceptance applies to the concrete example, not every article + relative. |
| 150 · hacia | overlap-with-distinction | Hacia highlights direction. Para can indicate a destination or direction. The broad movement-toward cue does not justify rejecting para; destination does not itself assert arrival. |
| 154 · manera | equivalent-in-this-use | Manera and modo express manner; forma also does so, alongside its physical-shape sense. All fit how something is done. |
| 155 · luego | overlap-with-distinction | Luego can mean later/next and can also introduce an inference. Después can locate something after another event, including después de. Both fit this later sentence. |
| 156 · padre | overlap-with-distinction | Padre is father; papá is a familiar/colloquial term for the same relation. The prompt has no formal-register restriction. |
| 163 · problema | overlap-with-distinction | Problema foregrounds an issue to solve. Dificultad foregrounds an obstacle or difficulty. Something to deal with is broad enough for both; not every problem is identical to a degree of difficulty. |
| 164 · esperar | overlap-with-distinction | Esperar includes waiting, expecting and hoping. Aguardar also means waiting for someone or an event. No formal-only requirement is imposed. |
| 166 · tipo | equivalent-in-this-use | Tipo and clase both classify things into kinds here. Other senses, such as a person or a teaching class, remain different. |
| 168 · nunca | overlap-with-distinction | Nunca and jamás both mean never here. Do not require a difference in emotional intensity to accept the answer. |
| 170 · además | overlap-with-distinction | Además presents a further point; también adds another applicable property. Both can translate this full sentence, with suitable placement. |
| 171 · pues | overlap-with-distinction | Pues can introduce a consequent response; entonces a conclusion or time reference; luego an inference or later event. Only the inferential use overlaps here, not their time/cause uses. |
| 177 · partido | overlap-with-distinction | Partido and encuentro name a sporting contest. Juego also fits the unrestricted sports-game cue, including Mexican usage. It has many other game/play senses. |
| 183 · empezar | overlap-with-distinction | Both mean begin doing here. Corpus research finds comenzar associated more with formal/written registers and empezar with informal/spoken registers, with substantial regional variation. This is a tendency, not an acceptance boundary. |
| 184 · obra | overlap-with-distinction | Obra names a created work, notably literary/artistic work and construction. Trabajo can also name a produced work, alongside activity/employment. The artistic-work cue is not enough to reject it. |
| 187 · varios | overlap-with-distinction | Varios foregrounds plurality; algunos an unspecified subset; diversos can mean several in its plural use as well as diverse. No fixed number cutoff applies. |
| 188 · explicar | overlap-with-distinction | Explicar makes something understandable or gives a reason; aclarar clarifies something unclear. Both fit the make-clear cue. |
| 190 · equipo | overlap-with-distinction | Equipo names a sports team. Conjunto has a specifically attested sports-team sense, not merely the broader collection meaning; it therefore also fits. |
| 194 · estudio | overlap-with-distinction | Estudio includes studying and an analytical work; investigación inquiry; análisis detailed examination. This investigation/analysis cue admits all three. |
| 198 · aquí | overlap-with-distinction | Aquí points to this place. Acá can mean this place or the nearby area. That distinction does not exclude acá from this broad here prompt. |
| 200 · empresa | overlap-with-distinction | Empresa names a business; compañía can name a business as well as companionship or other organized groups. The business context does not exclude it. |
| 202 · recordar | overlap-with-distinction | Recordar takes a remembered object directly; acordarse normally uses de. Rememorar also means recalling the past. With no Spanish complement frame supplied, all fit this English cue. |
| 204 · considerar | overlap-with-distinction | Considerar an option, pensar about it, reflexionar on it and contemplar it as a possibility all fit this English deliberation cue. Spanish complement patterns can differ. |
| 205 · mantener | overlap-with-distinction | Mantener keeps something in a state; conservar preserves it. Preservar foregrounds protection from harm, which this cue does not explicitly request. |
| 206 · centro | overlap-with-distinction | Centro identifies the central part or point. Medio can name the middle. This spatial cue fits both; an institution called a centro is different. |
| 207 · nivel | overlap-with-distinction | Nivel denotes a level; grado a degree or level on an ordered scale. Both fit the stated scale cue. |
| 212 · pequeño | overlap-with-distinction | Pequeño describes small size and other qualities; chico also describes small size and can name a child. The adjective-size cue fits both. |
| 214 · proyecto | overlap-with-distinction | Proyecto names a proposed undertaking/design; plan its intended course or arrangement. The planned-work cue still admits both, without equating either to the process of execution. |
| 215 · lograr | overlap-with-distinction | Lograr foregrounds achieving a sought result; conseguir covers attaining/getting and also succeeding in an action. Both take this direct infinitive. Obtener does not supply the same construction. |
| 216 · general | overlap-with-distinction | General and global overlap for overall/taken together; global also means worldwide. Neither has all the other word’s senses. |
| 220 · madre | overlap-with-distinction | Madre is mother; mamá is a familiar/colloquial term for the same relation. The prompt has no formal-register restriction. |
| 222 · convertir | overlap-with-distinction | Convertir en presents a change into something else; transformar en can do the same while foregrounding transformation. This change-of-form context fits both. |
| 227 · comenzar | overlap-with-distinction | Both mean begin doing here. Corpus evidence supports register and regional tendencies, not a formal-only versus informal-only rule. Both remain acceptable. |
| 229 · pedir | overlap-with-distinction | Pedir is general requesting. Solicitar can emphasize a deliberate/respectful request or an application. That is useful teaching context, not grounds to reject it from an unrestricted request prompt. |
| 234 · situación | overlap-with-distinction | Situación and estado overlap as circumstances/condition. Circunstancia can also name the surrounding circumstances; the singular headword is accepted under the prompt instruction. |
| 236 · aún | equivalent-in-this-use | Aún and todavía are effectively equivalent for continuing still here. Unaccented aun and other todavía uses need separate treatment. |
| 239 · mostrar | overlap-with-distinction | Mostrar and enseñar both mean show something to someone here; enseñar also means teach. Presentar can also put something before someone, so remains accepted for this broad cue. |
| 242 · dentro | overlap-with-distinction | Both can express being inside. DPD notes geographical preferences: dentro predominates in Spain; adentro is especially usual in America with an implicit complement. Motion versus rest is not a valid hard split. |
| 243 · entender | equivalent-in-this-use | Entender and comprender both express grasping meaning here. Comprender also has include/comprise senses. Do not teach a mandatory shallow-versus-deep understanding rule. |
| 244 · relación | overlap-with-distinction | Relación broadly links things or people; conexión emphasizes a link; vínculo a bond. The broad connection prompt fits all; listing/narrating senses of relación are separate. |
| 245 · tema | overlap-with-distinction | Tema is subject matter; asunto can be a matter to deal with or the topic. A conversation/text topic fits both. |
| 248 · producir | overlap-with-distinction | Producir covers outputs and effects. Fabricar specifically fits manufacturing goods; hacer is broader making/doing. The goods prompt fits all three, not every produced effect. |

## Review and validation

Read the first table for each 50-word set. For any contested row, judge the **whole** proposed definition, context and response instruction; then inspect its rationale. Approving this draft would still require a separate implementation pass with learning-card alignment, exact-prompt grading checks, documentation updates and a local preview.

Draft validation: all 250 IDs and ranks match the current deck and baseline audit; every additional answer has an authored rationale and supporting references; no duplicate or self-alternative occurs. The prompt tables and added distinction notes are synchronized with the JSON. These are artifact consistency checks, not a claim of exhaustive linguistic certification. No application tests were run because this change is documentation/review data only.
