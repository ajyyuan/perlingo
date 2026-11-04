# Day 1 usage prototype

Local review at `/lemmas/usage-preview.html`, expanded October 31, 2026. This supersedes the eight-word-only prototype description. Nothing in this expansion is committed or published.

## Information hierarchy

The first 250 deck entries are available in frequency order. The starting card is saber. Search matches Spanish words and quick meanings, ignores accents for navigation, and accepts comma-separated search terms. Different entries with the same spelling retain their individual IDs and part-of-speech labels.

Main cards contain one quick meaning and a small example area. The original eight retain their one or two short usage examples; other cards have one example without added explanatory paragraphs. Compare & explore opens the detailed overlay; standalone entries use Usage details. Cards belonging to several groups have a compact topic selector inside the overlay. Related Day 1 entries link to their cards during study. Close, Escape and backdrop dismissal return focus; the overlay scrolls while its Close control remains accessible.

The 60 previously identified comparison groups now have expanded explanations and paired examples. The 38 previously ungrouped entries have individual usage notes. The separate eight-section después/luego comparison remains available from both words. Together these provide 99 topics and 175 sections. Depth follows the useful distinctions: it is not a fixed word quota per lemma or an exhaustive list of dictionary senses.

## Content and evidence

- `lemmas/data/day1-usage.json` contains the expanded group and individual explanations, examples, exact member IDs and section-level primary references.
- `lemmas/usage-comparisons.js` retains the detailed temporal comparison.
- `lemmas/usage-preview-library.js` combines those with the actual first 250 deck entries, existing quick meanings/context sentences, and the earlier recall policy. The original eight sample cards are defined in `lemmas/usage-preview-data.js`.
- `data/spanish-lemmas/day1-usage-source-review.json` records evidence reuse, new targeted retrieval and review decisions. The earlier contrast research and primary-source log remain relevant evidence rather than being represented as newly retrieved material.

The October 31 source pass used RAE/ASALE DLE and DPD entries, original corpus research for the empezar/comenzar register tendency, and the University of Santiago de Compostela verb-construction reference. Examples and English explanations are authored, not source quotations. Opening a source URL is not itself proof of a claim; grammatical claims must point to the relevant grammar reference, not only a dictionary synonym listing. For example, the DPD comenzar entry describes conjugation but does not establish the por construction. The latter also links to the university reference. Según's pronoun construction links to the DPD personal-pronoun entry because no standalone DPD según entry exists.

The knowledge comparison covers learned ability versus situational possibility, the overlap of saber/conocer with factual information, acquaintance versus encounters, understanding with entender/comprender, subject expertise, inclusion and taste. It does not assert a universal shallow/deep distinction. The beginning comparison covers direct objects/events, a + infinitive, por + infinitive, register/regional tendencies and useful forms. Preferences do not become absolute grammatical prohibitions.

Other notes include ser/estar state and location distinctions, current deber (de) usage, regional gente and hasta, pronoun roles, water/hand gender, and additional meanings of entries such as derecho, económico and partido. Ordinary uses and meaningful exceptions are included; archaic and specialized senses are generally outside scope. This is a source-based editorial pass, not independent linguistic certification. Automated coverage does not prove language accuracy.

## Recall and scope

Try recall starts a new in-memory round using the current search results, beginning at the selected card when it is among them. With an empty search it includes all 250. A comma-separated search such as `saber, conocer, entender` provides a short review round. Results and progress are discarded on reload. The displayed counter uses the actual round length.

The original eight prompt/answer policies remain: entender accepts comprender, después/luego accept each other for ordinary later, and empezar/comenzar accept each other for generic beginning. Saber, conocer and tras use differentiating contexts. Other cards reuse the previously reviewed explicit Day 1 recall policy. No alternative is inferred from shared group membership, an example, or a synonym chain. Comparison help is available after an answer is graded, and a correct alternative reveals the target word.

This expansion changes the separate prototype only. The existing course's earlier local changes remain in their existing state. There is no course-progress write, authentication change, production content replacement, noun-gender test, new grammar curriculum or new audio generation. The existing pronunciation service and voice preferences are reused. These display examples use whole-phrase pronunciation; they are not additions to the chunk-authored sentence lesson bank. Full conjugation and chunk popovers remain outside this prototype.

## Validation and local review

Run `node --test tests/lemma-usage-preview.test.js tests/lemma-day1-recall.test.js`. The ten tests cover exact 250-entry inventory, group coverage, content/reference structure, original-eight acceptance boundaries, reuse of the explicit Day 1 policy, and separation from course progress and other assessment modes. JavaScript syntax checks cover the preview and its library.

Review steps:

1. Open saber, then Compare & explore. Explore the knowledge comparison and the separate memory topic. Follow conocer to its card.
2. Search `empezar, comenzar`. Open either overlay and review the paired constructions and qualified register note.
3. Search `despues` without the accent. Open después and switch between its temporal and other related topics.
4. Search `agua`. The main card stays short; Usage details explains feminine agreement and the article forms.
5. Search `saber, conocer, entender`, select saber, then Try recall. Conocer should fail the know-how prompt; comprender should pass the understanding prompt. The comparison is available after submission.
6. Clear search to navigate all 250; try duplicate-spelling entries such as que. Check narrow-screen navigation, overlay scrolling and keyboard dismissal.

Validation on October 31: all ten focused tests, preview/library syntax checks, whitespace checks and the repository content-structure check passed. Browser checks covered the knowledge and beginning overlays, a standalone agua note, a three-question filtered round (2/3 after one deliberate wrong answer), 390 px layout, internal scrolling, Escape/focus restoration, and reopening at the top. Reopening initially retained the old scroll position; resetting scroll after the dialog becomes visible corrected it. The viewport override was restored after testing.

## External audit

The user-requested Claude review is complete, with a revised report after challenges against current primary sources. Four priority issues and further clarity suggestions are documented in [the audit record](lemma-day1-claude-audit.md). The November 1 correction-attempt follow-up below addresses form guidance. Broader content corrections remain pending. The evidence directory preserves the exact resolved preview input and both report versions.

## Correction attempts — November 1 local update

Recall now shares the course’s score-free retry rules for small spelling slips, accent differences and recorded inflections. A brief correction cue appears below the editable answer, and repeated qualifying attempts retain full credit when corrected. The prototype also offers Show answer, which records a miss. Comparison overlays become available after grading. The answer label requests a Spanish dictionary form or infinitive, except where an explicit blank specifies the form.

For a quick check, search saber, start Try recall, submit sbaer and then saber. Finish should show 1 of 1 correct. Presidenta for presidente and primer for primero request the dictionary form. Despues for después requests accent correction. Broader content corrections from the Claude audit remain pending. The prototype’s main card content and accepted-answer lists retain their audited snapshot values.

November 1 validation passed all 421 automated tests and the content check, followed by the 17 focused recall tests after the final form-hint adjustment. Browser checks confirmed a corrected typo scores 1/1, presidenta prompts a headword retry, and the answer remains concealed during correction. A separate guest origin verified that a pending course retry survives reload, earns first-pass credit after correction, and handles a typo in a full-sentence context response. A small label-spacing adjustment keeps the focused input outline clear of its label.

The November 1 form follow-up also allows spelling and accent corrections against the recorded non-headword forms, using the same thresholds as headword typos. For example, supierom prompts a spelling/form retry for saber, and correcting directly to saber earns full credit. The correction message also works in the main course and persists through saved progress.

The form-typo follow-up passed 18 recall/preview tests and five conjugation/evidence tests. Browser verification submitted supierom for saber, observed the new spelling/form cue, corrected to saber and finished with 1/1. Regression cases also cover a missing accent on an inflection, a typo in an accepted alternative’s inflection, sentence-target retries and restoring the new pending retry type.


## Consistent form inventories — November 1 follow-up

The preview now resolves authored note overrides through the same `combineNotes` path as the main course. Its retry inventory is returned by `buildUsagePreview` and indexed by the exact card ID. Accepted alternatives contribute forms from entries with the same part of speech as the target. This restores the preview’s missing article and quantifier variants while preventing cross-category form pooling, including noun seres under verb ser, bienes under adverb bien, and consigo under adverb sí. The typo classifier can still grant a spelling retry independently of explicit form membership.

Regression checks compare the resolved inventory for all 250 preview cards with the course inventory for the same card and answer list. Specific tests cover the previously missing el, un, todo, otro and uno variants, isolation of homographs, and inflections of accepted verb alternatives. The five-tense singular policy below supersedes the earlier verb inventory and plural examples.

Validation passed all 424 automated tests, syntax checks for the four changed application modules, and `git diff --check`. Browser verification confirmed that la on the el card prompts a free dictionary-form correction, followed by a successful el response on the same question.

The preview now uses the same [singular five-tense retry policy](lemmas.md#generous-correction-attempts--local-november-1-2026) as the course. Try he sabido on saber for a free retry, then saber to finish. Supieron now scores as a miss.

November 4: the 24 I1 example mismatches plus pues/sobre and clarity examples are resolved through shared `day1-examples.js`. The main app now exposes the same sourced comparison bank through More info; the original eight-card prototype remains a separate experiment. See [audit disposition](lemma-day1-claude-audit.md). New sentence recordings are pending; the strict audio coverage check reports the gap.
