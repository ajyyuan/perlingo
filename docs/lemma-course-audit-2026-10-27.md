# Course accuracy review — 27 October 2026

This pass screened every one of the 1,500 combined headword/POS notes, not a sample. It read the displayed meanings and 4,537 form rows, the unique usage explanations, all 540 distinct combined example sentences and their English translations, 1,848 distinct phrase/gloss pairs, and 1,881 distinct generated word-hover/gloss pairs. The nine additional tener reference groups were read separately. Repeated generic grammar explanations were reviewed once rather than counted as independent reviews.

## Findings and changes

- **don:** the card teaches the respectful title before a first name. Its generic noun table incorrectly offered **el don / los dones**, mixing in the separate gift/talent noun. It now shows **don**, labeled “before a first name,” with the distinction in full notes. Compare [DLE don](https://dle.rae.es/don) and [NGLE §16.16g](https://www.rae.es/gramática/sintaxis/las-formas-de-tratamiento-ii-sustantivos-y-grupos-nominales). This is the only changed base lexical note; 1,499 remain identical.
- **One sentence translation:** “Ahí cambia mi dirección con cada paso” means “There, my direction changes with each step,” not “There, I change direction with each step.” Corrected the English in the authoring source and all three exercises sharing that sentence. The Spanish, targets and answers were already consistent. [DLE cambiar](https://dle.rae.es/cambiar) distinguishes first-person cambio from third-person cambia.
- **41 word-hover entries:** corrected word-role collisions and hints whose narrow dictionary sense did not cover the authored phrase. Examples: camino (“I walk”) in *un camino distinto*; estudio (“I study”) in *un estudio*; grito shown as a verb in *un grito*; papel shown only as paper in a theatrical-role example. Broader hints now include the relevant sense. These are not 41 incorrect headword definitions: several original glosses were legitimate dictionary meanings, but misleading beside these sentences. Existing phrase glosses were already correct.

The frozen dictionary's alternative senses support the hover changes. Additional checks used [DLE grito](https://dle.rae.es/grito), [trato](https://dle.rae.es/trato), [sanitario](https://dle.rae.es/sanitario), [exponer](https://dle.rae.es/exponer), and [representación](https://dle.rae.es/representación). Exact before/after values, example locations, source references and data hashes are in [the audit record](../data/spanish-lemmas/course-audit-2026-10-27.json).

No changes to the 1,500 selected cards, ranking, main definitions, Spanish example sentences, test targets, accepted-answer lists, or four-stage assessment rules. Form evidence now contains 3,380 matches because the misleading don plural is no longer displayed. The combined notes now contain 4,536 form rows.

## Decisions to leave data alone

Valid variants and less-common forms were not removed merely for looking unusual. Examples include clubes, gente/gentes, regional radio genders, and the existing invariant plurals. [DPD internet](https://www.rae.es/dpd/internet) supports both genders and common-noun uses; the table's plural is not labeled impossible. Saludes is attested but rare; [DLE salud](https://dle.rae.es/salud) also lists a distinct plural courtesy sense. Its table was left unchanged, not certified as a frequent everyday health plural. Form tables establish forms, not equal usefulness or frequency of every row.

## Verification and limits

The tests cover all 1,500 identities, every generated form's existing evidence, all 1,500 context targets and accepted answers, all five 300-word days, repair/perfect-pass behavior, and deterministic offline generation. New regressions cover the title sense, all shared copies of the corrected translation, every corrected compound-phrase hover hint, pilot preservation, and unchanged deck/answer hashes.

This is a complete **editorial screen** by the same authoring assistant, plus automated checks and targeted source comparisons. It is **not** a fresh second-dictionary lookup for every field, independent linguistic certification, or proof that no errors remain. Automated form membership cannot establish the right sense. Hover hints remain dictionary-style and can include multiple senses; the phrase gloss supplies the intended reading. The existing caveats about edited CORPES labels, non-exhaustive meanings/forms and unmeasured text coverage still apply.

## Local inspection

- Open `/lemmas/notes.html?set=16#corpes%3Adon%3AN`: the title form has no gift-sense plural.
- Open `/lemmas/notes.html?set=6#corpes%3Acambiar%3AV`: the English example has “my direction changes.”
- In context review, *un camino distinto*, *un estudio*, *un grito* and *un papel* now have matching noun senses in their word hints. No progress reset is needed.

Validation: all 298 tests pass; `npm run check` and `git diff --check` pass. The local notes page was inspected for both the don table and the corrected cambiar translation.

Published with user approval in Sites version 23 on October 27, 2026; see the README publication record.
