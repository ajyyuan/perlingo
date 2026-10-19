# Learning chunks and contextual explanations

Status: implemented for the current 34-concept lesson bank; B2 was approved and committed; C1 preserves its interaction model. This document describes Perlingo's product convention, not a formal linguistic parsing standard.

## Definition

A **learning chunk** is the smallest contiguous span of a translation that is useful to explain as one unit in its sentence context. Boundaries follow grammar and meaning, with readability for a learner taking precedence over a complete syntax tree.

Parts of speech classify individual words (noun, verb, determiner, etc.). Syntactic phrases describe how words combine. Learning chunks use those distinctions but are not necessarily full syntactic constituents: a full verb phrase can include the object, whereas Perlingo normally separates the action from the object.

## Default grouping rules

- Keep a noun with its determiner: **un libro**, **ein Buch**, **ma maison**. Include tightly attached modifiers when they belong to the same noun phrase.
- Keep multiword verb constructions together when they jointly express an action, tense, aspect, or mood: **estoy aprendiendo**. Do not automatically include the object in the verb chunk.
- Keep standalone subject pronouns separate when they are useful to explain independently: **Je** · **bois**. Preserve written contractions and spacing when displaying a sentence.
- Keep articles and partitive constructions with their noun: **de l’eau**.
- Keep fixed expressions together when explaining each word separately would obscure the intended meaning: **hasta mañana**.
- Explain remaining grammatical words in context. Related words need not be adjacent: for example, explain French **ne** and **pas** as parts of the same negation construction without treating the intervening verb as part of one contiguous chunk.
- Preserve all original text, punctuation, accents, and spacing. Punctuation alone is not a clickable chunk.
- Segment each language independently. Equivalent meanings need not have identical chunk counts or boundaries across languages.

## Examples

| Translation | Default chunks | Compact meanings |
| --- | --- | --- |
| Leo un libro. | Leo · un libro | (I) read · (a) book |
| Je lis un livre. | Je · lis · un livre | I · read · (a) book |
| Ich lese ein Buch. | Ich · lese · ein Buch | I · read · (a) book |
| Estoy aprendiendo. | Estoy aprendiendo | (I) am learning |
| Je bois de l’eau. | Je · bois · de l’eau | I · drink · (some) water |
| Hasta mañana. | Hasta mañana | See you tomorrow |

Parentheses are a display convention for low-emphasis grammatical information, not a claim that a word can be omitted. For example, “(I)” makes an implicit Spanish subject visible, while “(a)” keeps the article in the English gloss without giving it the same visual emphasis as “book.”

## Interaction and information hierarchy

1. Clicking a chunk pronounces that chunk and opens a compact popover anchored to it.
2. The popover answers **“What does this mean here?”**: a contextual English gloss, a transcription link, and a brief grammatical cue. Parenthetical cues are small and muted.
3. The **grammar cue** opens the C2 details overlay. It answers **“Why this form?”**, retains the original sentence and English prompt, and lets the learner select words within the chunk. The reading pilot and C3 foundation preview have curated word roles, base forms, gender, present-tense conjugation tables, and noun singular/plural tables. Other legacy entries retain their phrase explanation and explicitly identify missing word analysis.
4. The popover overlays the lesson without moving its background. Clicking outside, pressing Escape, or closing it dismisses it; Escape and the close button return focus to the selected chunk.
5. The speaker button pronounces the complete translation. Preserve the quiet playback indicator and French Thomas voice preference.
6. These interactions are available on learning screens and, after a recall answer has been scored, on the revealed correct translation. Post-submission help does not change the recorded score. If help is introduced before recall submission, warn before revealing it, record the answer as assisted, and prevent that round from counting as perfect.

## Authoring and current implementation

Chunks are curated for the finite lesson bank, not inferred by an automatic parser or AI. Each clickable span needs its source text, contextual meaning, brief grammatical cue, and deeper explanation. Keep the original sentence available as context even when only a chunk is shown in the popover.

The implementation is in `src/explanations.js`, with rendering and interaction in `src/app.js`. As part of C1, the book/read/reading-sentence chunks are stored in `src/content/reading-pilot.js` and consumed by the same interface; see [the content model](content-model.md). All 102 starter translations have intentional grouping: nouns with their articles, standalone infinitives, explicitly segmented sentences, or explicitly designated whole expressions/noun phrases/question words. **Estoy aprendiendo** is one chunk. Leading and trailing punctuation stays outside click targets. Invalid spans, unexplained words, and new sentence constructions without a chunk definition are rejected instead of silently falling back to a whole sentence.

Notes are authored in sentence context and shown as prose through Grammar. The original translation remains visible behind the popover. No automatic parser is used: the rule about tightly attached modifiers is an authoring requirement for future content; the expanded course includes modified noun phrases with authored spans.

The overlay and selection inside a chunk are implemented in C2 (formerly B3/remaining B4), with detailed word analysis in the C1 pilot and the C3 draft foundation pack. C3 adds present-indicative paradigms; the expanded course adds supplied reference tenses and draft content; full linguistic review remains pending. Recall uses the same authored chunks and overlays after submission, including correct answers, misses, and meaning contrasts. The assisted-answer rule above applies to any future help before submission.

`tests/explanations.test.js` checks coverage, original-text reconstruction, punctuation boundaries, contextual details, explicit failure for undefined constructions, and the documented chunking examples. Run `npm test` and `npm run check` before handoff, then verify the popover in the local browser.

For review, check that chunks reconstruct the original translation exactly, glosses fit the sentence, articles stay with nouns, multiword verb constructions stay together, and opening a popover or overlay causes no lesson layout shift. The overlay is a modal dialog: it traps keyboard focus, closes with Escape, its close button, or a backdrop click, and returns focus to the originating chunk. On narrow screens it remains centered with a 12 px outer margin and internal scrolling.

## Compound-word notes in the foundation preview

Keep `la pomme de terre` and `un stylo à bille` as whole clickable noun phrases. Inside the overlay, `de` and `à` are prepositions; the other components have their own roles and component glosses, with a note retaining the meaning of the whole expression. A component is not itself a lexical entry for the full compound. French elided article+noun tokens such as `l’œuf` explicitly describe both elements. These annotations remain draft prose even when the compound’s dictionary meaning and plural have been source-compared.

## Course draft

All 16 units have authored chunk meanings. `examples.js` parses explicit `span{contextual meaning}` annotations from the core/extension example inventories; it does not infer syntax. Punctuation and elision reconstruct the original text. Objective-level notes explain the target construction, while detailed individual component analyses remain partial. Missing word analysis is labeled explicitly. A whole-expression selection can expose the lexical record/forms without assigning the expression’s meaning to one component. The overlay uses “Recorded forms” for non-noun/verb records, noun case labels, and a tense selector for supplied verb groups. See [exact coverage and limits](course-authoring.md).

## Learning-card controls (C6.1)

Right/Down advances learning cards; Left/Up returns to the previous card. Shortcuts pause while explanations or dialogs are open. Opening a translation cancels any card entrance animation so its fixed popover remains correctly positioned. There is no custom focus tour; native button/Tab access and Escape dismissal remain available. Recall is unchanged. See [navigation](keyboard-navigation.md).

## New material versus due review

Learning cards and their explanation controls now show only unseen concept/language pairs. Due pairs are recalled directly in the app-day’s review phase, without showing their translations first; future-due pairs are omitted. This may leave fewer language columns on a mixed-history concept. See [spaced review](spaced-review.md).

Pronunciation: Quick meaning shows approximate IPA for the selected chunk in isolation as a button. It opens a separate Pronunciation overlay with clickable sound tokens and playable vowel/consonant charts. Grammar contains grammar, forms, context and reporting, with no pronunciation content. Cards do not display inline IPA; recall offers IPA through Quick meaning only after submission. See [pronunciation guides](pronunciation.md).

## Floating details (local)

The grammar cue and the IPA button replace Quick meaning with separate centered, rounded modal overlays: Grammar and Pronunciation respectively. Both have a 680 px maximum width, capped viewport-relative height, internal scrolling, and sticky Close control. Escape, Close or a backdrop click dismisses the overlay and returns focus to the originating chunk. Closing Pronunciation stops its recording. Native dialog focus containment and reduced-motion behavior remain. The underlying learning card does not reflow. There is no nested sound-chart view or Back button.

## Compact overlays and grammar help

Quick meaning omits the repeated source word; its meaning comes first, followed by the transcription and grammar cue. Grammar omits draft-status notices and lexical-reference blocks; source data remains in the review tooling, linked from Settings → About. Repeated selected-word roles/notes are omitted when identical to the chunk explanation. Report an issue remains in Grammar.

The whole Quick meaning grammar cue is one dotted-underlined button that opens Grammar. Inside Grammar, recognized grammar terms are dotted-underlined buttons. They open short floating definitions (including present indicative, mood/tense terms, person, number, gender and case); Back, Escape or an outside click returns to the original panel. They explain terminology, not new per-sentence linguistic analysis. Unknown terms remain plain text. Quick meaning contains no inline grammar definitions or separate More button. Its close button sits in the top-right corner without reserving a header row. Recall exposes this grammar help only through the revealed answer after submission.

## Compact grammar and German article guide

Overlay headings, paragraph margins, word-picker controls and form rows use tighter spacing. Sentence context is a floating help view when it differs from the selected chunk; an identical source phrase is not repeated. Existing word analysis and form tables remain available. Single-word chunks omit the redundant word-picker and repeated selected-word heading.

Under Inspect a word, selecting a German word annotated as a definite article shows the **Why der, die, das?** floating guide. The link sits with that word’s explanation, not above the word picker; selecting the noun hides it. It explains gender, number and case, with switchable definite, indefinite and negative-article tables. Case names open floating definitions. Examples contrast the same masculine noun as subject, direct object and a dative object. A further floating view covers possessive endings, common contractions and ambiguous forms. The guide does not infer the selected phrase’s case or pretend that a matching article spelling proves its role. No indefinite plural article is invented; the table shows a dash.

Source comparison: the four-case article tables were checked against [Goethe-Institut, Artikel und Pronomen](https://www.goethe.de/ins/de/de/m/prf/grm.html) on 2026-10-19. Explanations and examples are authored for this UI. Regression tests cover the gender/case contrasts, missing indefinite plural, negative-article plural and clickable case definitions.

## Floating help instead of expanding sections

Sentence context, grammar-term definitions, the German article guide, its additional article notes, and recording credits now open child modal overlays. The original panel retains its dimensions, scroll position, selected word and form state underneath. Each child has Back; Escape or clicking its backdrop closes only that child and restores focus to its trigger. Nested case explanations behave the same way over the article guide. Closing the main details view clears all child overlays. The article-type selector updates only the guide’s table. Main-app Settings and recall controls are outside this change.

Browser verification: opening the article guide left its parent at the same 456.67 px height, vertical position and scroll offset. Opening Dative and dismissing it restored focus to Dative and retained the indefinite-article table selection. The automated suite passes 86 tests.

## Form highlighting and grammar-link consistency

A shaded row with “← here” identifies one unambiguous form matching the selected word and its recorded grammatical features. Equal spellings alone do not justify marking several rows as the form used here. If the supplied annotations cannot distinguish candidates, no row is marked. This applies to nouns and conjugated verbs; the selected word button remains a separate indication of which word is being inspected.

The singular noun authoring helpers now record number explicitly, including the foundation entries used by the course. This fixes `der Kugelschreiber`, whose singular and plural spellings are identical: only singular is marked in that singular phrase. Lexical forms and translations are unchanged. Regression tests cover explicit singular/plural selections and ambiguous spelling without contextual features.

Dotted-underlined grammar labels consistently open floating definitions in summaries, selected-word roles, part-of-speech/gender metadata, and form-type table cells. The glossary now also covers common parts of speech and definite/indefinite articles. Ordinary explanatory prose and foreign-language forms are not automatically turned into glossary links.
