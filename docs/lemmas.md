# Edited CORPES Spanish sprint

## Current local implementation

`http://127.0.0.1:5173/lemmas/` contains 1,500 headword/POS cards (1,455 distinct spellings), in 30 sets of 50. The user explicitly selected the edited CORPES deck. The original deck and five-word prototype were committed; the expanded notes and latest audit are approved for commit and remain unpublished. The user requested **local preview first**, not production deployment.

All 1,500 cards reveal word notes: English meanings, clickable grammatical help, word forms where relevant, dictionary access and personal notes. There are **53 entries with authored sentence examples**: Set 1 plus casa, depender and música. The other 1,447 are lexical reference entries, not completed sentence lessons. No fabricated examples fill that gap. Generic grammar help retains the headword and meaning; authored chunk help retains its example and translation. The expansion does not certify every dictionary sense or every original corpus annotation.

Thirty sets of fifty, six per suggested day. Reveal → Know/Again; misses repeat after a pass. Finished sets can be revisited. No SRS, timer, daily lock or automatic mastery claim. Space reveals, Left marks Again, Right marks Know, P pronounces. Unrevealed cards cannot be scored. No word notes appear before Reveal in study. Keyboard grading pauses while help is open or focus is inside notes, an input, a link or a disclosure. Navigation stops pronunciation and removes overlays/listeners. Shared French Thomas preferences are unchanged; playback feedback is quiet.

Browse searches the deck and links to local word notes. [All word notes](http://127.0.0.1:5173/lemmas/notes.html?set=1) has a set selector and Spanish/English search; at most 50 matching word buttons render. Duplicate spellings show their grammatical category. Selecting a word updates its card-ID fragment and set. This reference page does not change study ratings. The original five-word prototype remains at `/lemmas/notes.html` with no set parameter.

## Content and checks

The full displayed gloss list was read in the October 25 audit. **104 entries** received concise wording or more representative senses, recorded in `data/spanish-lemmas/full-notes-gloss-review.json`. For example película includes movie, profesor includes teacher, and capital distinguishes money from a capital city. That initial expansion had 330 editorial deck entries; the second pass brings the total to 334. Source order, ranks, headwords, original counts, IDs and exclusions did not change in this audit.

All 752 noun cards have gender information. Gender-dependent meanings are explicit for entries such as capital, orden, frente and corte. Feminine agua/área/arma/alma retain el in the immediate singular article and las in the plural. Common-gender people and lexical exceptions have explicit handling. The 197 adjective cards have agreement forms. All 369 verb cards have present forms; ocurrir, suceder and consistir show only the third-person forms appropriate to the meanings taught. Haber’s auxiliary forms are distinguished from impersonal hay. Gustar identifies the Spanish subject as what is liked. Supplied paradigms use tú/vosotros, with ustedes explained; voseo and other tenses are not supplied.

There are 3,381 frozen lemma/POS/form matches behind the generated layer. These establish form membership; the grammatical labels come from documented morphology rules and explicit exceptions, with all generated present tables read in this pass. Bueno’s feminine/plural forms use a separately recorded live Wiktionary check because the pinned form map lacks them. Plurals for fútbol, noun pasado and noun izquierda are omitted rather than inferred from unrelated POS mappings. Missing forms are not proof that a word lacks those forms. The second pass also omits generic plural rows for the uncountable taught senses of inglés and personal; this does not prohibit plurals in other senses or specialized contexts.

See [source evidence and limits](lemma-notes-sources.md), [research audit](../data/spanish-lemmas/AUDIT.md) and the public [About page](../lemmas/sources.html). Content QA belongs to the authoring workflow; the user is not expected to verify Spanish. This is an editorial, source-backed review, not independent linguistic certification or a measured text-coverage result.

The [second-pass report](lemma-notes-second-pass.md) records ten evidence-based corrections after screening all 1,500 entries; 1,490 entries were unchanged. Additional DLE/DPD comparisons cover 27 specific entry decisions, including four full present tables and 17 explicit decisions to retain existing content. This is a same-assistant review with targeted additional references, not a separate expert review or a second dictionary lookup for every entry. The generator now preserves ñ when removing acute accents, rejects unresolved adjective feminine candidates, and uses an explicit reviewed invariant-plural list. Etcétera keeps source tag Q but displays the learner label expression and enumeration help.

## Implementation and reproduction

- `scripts/build-corpes-deck.py` builds `lemmas/data/deck.json` and provenance from the frozen CORPES source, dictionary extract and teaching edits. `build-lemmas.py` remains a compatibility entry point.
- `scripts/build-lemma-notes.py` builds `lemmas/data/notes.json` from that deck, dictionary genders, usage overrides and pinned form evidence. Normal builds are offline. `--form-source /path/to/es_allforms.csv` refreshes the subset only after checking the exact source hash.
- `lemmas/notes-library.js` combines generated lexical notes with `first-set-notes.js` and three reused pilot notes. Pilot concepts are namespaced so a specific explanation never replaces generic grammar for other words.
- `lemmas/note-view.js` and `note-view.css` serve both revealed cards and reference pages. `notes.js` provides search/set navigation. There is no runtime AI, external generator or parser.
- Tests cover exact 1,500-ID coverage/order, source counts, sense corrections, gender/inflection exceptions, grammatical-use separation, source matches, byte-identical rebuilding, chunk reconstruction, punctuation boundaries and keyboard ownership. These checks are evidence about those properties, not a proof of all linguistic correctness.

## Source conventions

CORPES is the ranking input; Doozan supplies the pinned Wiktionary dictionary/form intermediary. Seven explicit source-label choices remain: músico→música, característico→característica, salido→salida, listo→lista, perspectivo→perspectiva, deudo→deuda, caído→caída. Their notes explain the ambiguity in More. Intereses is folded into interés without adding its count, with religioso filling the slot. Counts are not reassigned to displayed senses. No corpus-independent “true top 1,500” or 90% comprehension claim is made.

The official table is CC BY-SA 4.0 and does not identify its extraction version. The original CRLF bytes/hash are preserved. Dictionary-derived adaptations retain Wiktionary/Doozan attribution and CC BY-SA terms. Source-derived notes and edits follow the same attribution policy.

## Persistence

`perlingo-lemmas-corpes-v2` stores sessions and self-ratings by original lemma/POS ID. The earlier `perlingo-lemmas-v1` is neither migrated nor deleted. Identical spellings with different POS have separate ratings. The wording audit preserves all existing card identities.

`perlingo-word-notes-v1` stores personal notes by card ID and is shared by study and the full reference view. Saves merge the latest stored object to preserve other words edited in another tab. The five-word prototype retains its separate `perlingo-word-notes-pilot-v1`. Storage failures display a visible error. There is no account sync.

## Local functional preview

1. Open `/lemmas/`, choose Set 2 and Reveal porque. Open Conjunction; verify that the explanation concerns conjunctions generally, not que’s pilot sentence. Escape restores focus; no rating changes until Again/Know.
2. Open Word notes and search agua. Open Word forms and More: el agua / las aguas, with feminine gender explained. Search capital and compare the two gender-dependent meanings.
3. Search seguir and open its present forms. Search bueno and inspect buena/buenos/buenas. Compare poder verb/noun and the two que cards.
4. Choose Set 30 and religioso to reach card 1,500. Reference navigation must not modify study progress.
5. Search mes and gas: the plural rows must read los meses and los gases. Search español (adjective): the feminine rows must read española and españolas. Etcétera must show Expression and Continuing a list.
6. Add a temporary personal note, reload/reselect the word and verify it remains, then clear it. Check pronunciation on the actual device and narrow-screen controls.

These are functional checks for the interface; linguistic correctness is not delegated to the learner. The user approved committing this content and its audit. Nothing has been pushed or published.

Validation completed October 25 for the full lexical expansion: 245 repository tests pass, including 16 focused note/deck/session tests; `npm run check`, all changed JavaScript syntax checks and `git diff --check` pass. Offline note regeneration is byte-identical. The static build passes with 54,942 files (1,578.0 MiB). Browser checks verified a Set 2 revealed note, generic grammar without pilot leakage, global search, agua’s article/plural explanation, seguir’s irregular table, set switching, and card 1,500 religioso with all four agreement forms; the inspected browser reported no console errors. A desktop screenshot was inspected. Earlier personal-note persistence and grading-isolation checks remain applicable to the shared renderer; narrow-device and audible playback checks are not claimed in this pass. No upload, commit or publication was performed.

Second-pass follow-up: 247 repository tests and 18 focused lemma tests pass; `npm run check`, offline regeneration and `git diff --check` pass. Browser checks confirmed mes and español’s corrected form rows. The earlier static-build result above belongs to the expansion pass; it was not rerun for this content-only follow-up. Full findings and limits are in [the second-pass report](lemma-notes-second-pass.md).
