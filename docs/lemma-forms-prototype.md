# Lemma study prototype

Local reference prototype at `/lemmas/forms.html`, limited to tener, casa and bueno. There is no separate form quiz. The main 1,500-word course retains its four stages: batch typed lemma recall, set multiple choice, day typed lemma recall, and contextual gap-fill review. Context review tests a selected form in a sentence, not every form of every lemma. The course’s scoring and repair rules are unchanged.

## Layout and navigation

Meaning and uses share the left column; forms occupy the right, separated by a subtle vertical rule. All existing table rows and usage examples remain. The card is bounded to the desktop viewport with a scrollable central region and visible footer; at 680 px and below it stacks meaning, uses and forms with natural document scrolling. No content is removed to fit.

Next moves through the three reference cards. The final button says Back to course and opens `/lemmas/`; it never launches form recall. Full notes opens a popup containing the existing lexical reference, chunk meanings, grammar help and shared personal notes. Escape dismisses the topmost popup.

Tab/Shift+Tab reach controls. Arrow keys navigate words, while arrows/Home/End inside the tense picker select forms; `[` / `]` select the previous/next tense from elsewhere on the card. Typing, modifiers and open popups are protected. The central scroll region retains native Up/Down/Page/Home/End scrolling. Pronunciation and French Thomas settings are preserved.

## Forms reference

Tener includes nine exploratory groups: present, completed past, ongoing/habitual past, future, conditional, present perfect, present subjunctive, affirmative commands and negative commands. The horizontal picker displays about three choices, highlights one and centers it smoothly (respecting reduced motion). Short labels have full accessible names and hover titles. Each group has a usage cue and translated example. Existing casa and bueno tables are unchanged. The main course now supplies these nine groups for all 369 verbs (see [course-wide evidence](lemma-verb-forms.md)); Full notes now combines the lexical reference with the shared course tense picker and available examples.

Source comparison on 2026-10-26: [RAE conjugation appendix](https://www.rae.es/diccionario-estudiante/docs/conjugaciones-verbales.pdf), printed page 1510 / PDF page 34, model 62 TENER, supplies the simple-tense paradigms, participle and tú/vosotros affirmative commands. Its regular compound-tense model supplies the present haber auxiliaries. [Collins tener conjugation](https://www.collinsdictionary.com/es/conjugacion/espanol/tener) independently matches those forms, all six present-perfect forms, and usted/ustedes commands. Negative commands use the corresponding present subjunctive forms with no. Usage cues and translated examples are locally authored, not quotations or independently reviewed curriculum. The perfect example translates tener suerte idiomatically as “be lucky”; its regional usage caveat avoids treating the English perfect as an exact tense-selection rule.

## State and checks

The existing isolated sessionStorage key `perlingo-forms-prototype-v2` now stores a version-3 study state: current word only. Loading older version-2 state retains a valid word index but discards quiz results, drafts and gates. Main-course progress is untouched. Restart resets this study preview. Personal notes continue using their existing shared storage.

Tests check exact source-form completeness, reference group rows/examples, study navigation without quiz creation, invalid-state handling and removal of legacy quiz state. Preview: advance through tener, casa and bueno, then use Back to course. Explore tense groups and Full notes as before. The main course now uses this study layout across its learning cards, while preserving its four tests; this page remains a separate three-word reference preview.

Removal verification: all 293 remaining repository tests, `npm run check`, syntax and whitespace checks passed. Browser navigation confirmed the third reference card now offers Back to course and returns to the existing main-course context review without starting a form quiz or changing that review’s progress.
