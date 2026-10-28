# Interactive verb-row examples

Reviewed and approved for commit; not pushed or published. This supersedes the balanced/frequency URL experiment for the main app. `/lemmas/` and historical `?examples=...` URLs now use the same interactive experience. The earlier comparison page retains frozen authored versions as a development reference; its links open the unified app.

## Behavior

Every displayed verb-table row has an example or a contextual explanation when the taught sense does not support a natural example. Click its subject label, or the row background, to select it. The selected row has a quiet highlight; its label is a keyboard-operable pressed button. Pronunciation buttons remain separate and do not change the example. Describir's alternate participles have a small Example control beside the alternate form. Shared conjugations carry explicit subjects where needed. A third-person row illustrates one subject, not every gender or usted/ustedes interpretation.

A new course receives a random `exampleSeed` stored in its progress payload. Each verb's starting choice is derived deterministically from that seed and its ID when first opened. Usable present rows are ranked by the retained TUBELEX spelling counts, then channel coverage, with slot order breaking ties. Known homograph exclusions and rows without examples or count evidence are omitted. The top three receive **60%, 30%, and 10%** respectively. With two eligible rows, 60:30 is normalized to 2/3 and 1/3; with one, it is always chosen. Every current verb has at least one eligible row. Other forms remain manually selectable.

These are editorial sampling probabilities, not measured corpus proportions. For mirar, selecting the leading spelling mira retains the reviewed tú-command example. Reloading, reopening the app, or restoring the same account progress reproduces the same starting choices. Only the explicit course-reset action creates a new seed (switching to another saved course follows that course's seed). Existing pre-seed saves use a stable legacy seed of zero; new courses receive their seed at creation. The seed travels through existing account sync and recovery copies. A local active-seed mirror lets standalone notes follow the last active course. Manual row/tense/alternative browsing is remembered within the page, but does not change the saved starting choices; after a reload, cards return to their course-assigned starting form. Grades and test answers are unaffected.

Tense changes preserve the selected person wherever it has a displayed row. Commands map tú→informal singular, third singular→formal singular, vosotros→Spain plural, and third plural→ustedes. I/we have no matching command addressee in the existing tables, so the last command addressee (initially tú) is used. Restricted tables fall back to an available row without erasing the preferred person. An unavailable tense retains its usage notice. Tests, accepted answers, scores and saved progress remain unchanged.

## Content and evidence

`scripts/build-lemma-row-examples.mjs` expands reviewed lexical frames and frozen `verb-forms-data.js` rows. It reuses the shared builder with six subject assignments, handles dependent English inflection/possessives and Spanish adjective agreement, and explicitly authors exceptions. Balanced and frequency comparison banks are not overwritten. Rebuild with `node scripts/build-lemma-row-examples.mjs` after changing frames or conjugations.

- Gustar uses the subject as the liked person/thing, and Ana as experiencer: *Yo le gusto a Ana* → “Ana likes me.” Personal-subject examples are supported by the [University of Piura's explanation](https://www.udep.edu.pe/castellanoactual/duda-resuelta-el-verbo-gustar-2/).
- Haber separates auxiliary examples (*Yo he terminado*) from impersonal examples (*Hay una solución*). Explicit impersonal rows are also available in the other simple tenses. Its perfect table retains singular *ha habido*. Auxiliary completed-past examples use a following past action and retain the literary-use cue; see [El Colegio de México's antepretérito entry](https://dem.colmex.mx/ver/antepret%C3%A9rito).
- Soler retains its restricted tense inventory and uncommon-perfect cue. Personal nacer rows outside completed past/perfect explain the contextual restriction; they do not declare the conjugations nonexistent. Human morir examples use *morir de risa*, rather than implausible reports of one's own literal death.
- Commands adjust their addressee and dependent wording, including *quered a vuestra familia*, *sean amables* and *sepan que no están solos*. Existing meanings without natural commands retain explanations. Costar/durar/bastar personal rows explain why the taught thing/event construction is illustrated in third person instead.

Frequency evidence remains the hash-verified TUBELEX spelling-count snapshot documented in [the earlier experiment](lemma-frequency-pilot.md). It does not distinguish verb senses or commands from statements. The row bank illustrates grammatical forms; it does not claim every example is itself frequent or independently corpus-attested. This is template/source validation and targeted construction review, not independent certification of every generated sentence.

## Validation and preview

Tests cover every displayed row and alternative: matching target text, complete gloss rendering, exceptional constructions, deterministic rebuilding, untouched comparison banks, valid sampling and stable person mapping. Browser checks cover mouse and keyboard selection, tense switching, independent pronunciation and descripto selection. Existing focus and grading tests remain required.

Preview: open `/lemmas/`, search ser, choose the “you · plural, Spain” row, then switch to Past. Search describir, choose Perfect and the Example control beside *hemos descripto*. Search haber to compare *he* and *hay*, and soler for unavailable tenses. Reopen the same card to check stability; reload to confirm the same course-assigned starting form. A fresh assignment is created only by the explicit course reset; do not reset real progress merely to test sampling.

Local validation: all 370 tests and content/syntax checks pass; the external-audio static build succeeds (204 files, 35.1 MiB). Coverage is 18,309 displayed rows, with 17,987 examples and 328 contextual explanations across all alternatives; the source/output hashes are recorded in `data/spanish-lemmas/tense-examples/row-example-audit.json`. Browser verification additionally confirmed he versus hay, retaining impersonal haber across tenses, and reopening the card with the same selection. No test answers were submitted.

The ranked sampler is regression-tested at the 60% and 90% boundaries and on a deterministic 1,000-draw grid (600/300/100), including homograph exclusions, haber’s separate hay row, and two-row normalization for nacer.

Persistence checks cover seed round-trips, legacy-save compatibility, deterministic choices after reload, unchanged manual selection on same-seed account updates, and seed replacement/recovery through the existing cloud-reset path.

Course-persistence validation: 370 tests and content/syntax checks pass. A browser reload reproduced the same ser example. `course-seed-audit.json` records the intentional progress-format change against the earlier conjugation audit; the earlier assessment-code hashes remain checked. The real course was not reset during verification.

## Conjugation keyboard navigation

While browsing a verb in the learning card or notes, `[` selects the previous displayed conjugation row and `]` selects the next, updating its example. Navigation wraps from the last row to the first and vice versa and resets any alternative-form selection. `- / =` continue to change tenses. These shortcuts ignore text inputs, modified/held keys and inactive dialogs; non-verbs and notice-only tables have no row shortcut. The keyboard-shortcuts panel lists both pairs.
