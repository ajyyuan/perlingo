# Grammar topics and coverage

Nouns, Verbs, Grammar, and Sentences remain the four session categories. Grammar exercises now carry a `grammarTopic` ID independent of the English prompt. `src/content/grammar-topics.js` defines implemented topic labels and their broader `area` metadata. This is descriptive metadata, not a filter or a progression engine.

Learning (including the home preview), typed recall, and content review show a small muted topic label above the prompt. Prompts contain only the sentence or phrase: “She opens the door.”, not “Agreement: She opens the door.” Existing IDs, translated answers, review scheduling, and category settings are preserved. The topic is always visible context; it reveals no answer and does not count as assisted recall.

## Audited implemented exercises

Every row below has Spanish, French, and German translations. These are individual exercises, not complete coverage of their topics; content review status is unchanged.

| Entries | Topic ID / label | Actual coverage |
| --- | --- | --- |
| Starter c30 | `negation` / Negation | “I do not eat.”: Spanish no, French ne…pas, German nicht. |
| Starter c31 | `noun-number` / Plural nouns and articles | “the books”: noun plurals and plural definite articles. No general gender curriculum. |
| Starter c32 | `possessive-determiners` / Possessive determiners | “my house”: mi, ma, mein with one singular noun; not the full possessive system. |
| Starter c33 | `question-words` / Question words | “Where?”: dónde, où, wo. No full question syntax or word-order exercise. |
| Foundation f-she-opens, f-they-buy, f-you-close, f-we-see | `subject-verb-agreement` / Subject–verb agreement | Present indicative, selected persons/numbers. “They” specifies a male or mixed group; “you” specifies singular informal. |

The foundation pack remains an explicit draft preview. Other examples may contain articles, objects, or case, but their presence does not count as dedicated exercises in those topics. The reading pilot has no grammar-category exercises.

## Proposed progression — future curriculum

These are topic families, not a strict teaching order. The [curriculum specification](curriculum.md) proposes an interleaved 16-unit sequence with language-specific targets and prerequisites. Neither filtering, prerequisite logic, nor the complete content is implemented.

1. Articles, gender, and number.
2. Subject–verb agreement.
3. Pronouns.
4. Negation.
5. Questions.
6. Possession.
7. Adjective agreement and placement.
8. Objects and case.
9. Prepositions.
10. Modal verbs.
11. Tense and aspect.
12. Commands.
13. Comparisons.
14. Connecting clauses.

Language-specific work includes Spanish omitted subjects and regional address forms; French elision, pronoun placement, and negation; German case marking and verb position. These are planning considerations, not claims that equivalent exercises already exist in all three languages. Topic filtering, automatic progression, and authoring the rest of this curriculum are future work.

## Authoring and validation

A structured grammar entry must name a recognized `grammarTopic`; `lessonEntries` retains it for study/recall. Use the actual teaching target, not a broad inferred label. The topic registry contains only currently used topics; extend it deliberately when authoring new exercises. The four legacy entries carry explicit metadata by stable ID. Tests cover the audit, missing/unknown metadata, and preservation through lesson and recall adapters.

## Course objective labels

The expanded course registers one grammar-topic ID per unit objective (`course-u01.1` through `course-u16.3`). Its 384 new examples use those labels in production, contrast and transfer practice. The table above audits the earlier starter/foundation bank; it does not describe the full expanded inventory. Topic filtering, prerequisite recommendations and mastery checkpoints remain future work. See [current course scope](course-authoring.md).
