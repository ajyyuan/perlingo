# Edited CORPES Spanish sprint

Implemented locally October 25, 2026 at `http://127.0.0.1:5173/lemmas/` (also `/lemmas`). Approved for commit; not published. The user explicitly chose the practical edited CORPES deck after the lexical-unit audit. This replaces the earlier Doozan frequency selection in the UI. Doozan remains only the intermediary for Wiktionary dictionary meanings/form checks.

## Current behavior

Thirty sets of fifty, six sets per suggested day. Day selection is manual. Reveal → Know/Again; misses repeat at the end of a pass. Completed sets can be revisited. No timer, SRS, daily lock or automatic mastery claim. Space reveals, Left marks Again, Right marks Know, P pronounces. Unrevealed cards cannot be scored.

Cards show the study headword, grammatical use, concise English meaning(s), dictionary link and selected common verb forms where checked. Seven changed headwords explain their provenance in a collapsed “About this headword” disclosure. Browse searches Spanish/English and displays grammatical use to distinguish identically spelled cards. Only the first 100 matches render.

`perlingo-lemmas-corpes-v2` stores version-2 sessions and self-ratings in localStorage. IDs include the original source lemma and POS, so poder/verb and poder/noun are independent. Old `perlingo-lemmas-v1` data is neither imported nor deleted: previous card identities/order are incompatible. Reloading or returning to Sets preserves each unfinished session. Storage failures display a warning. There is no account sync.

Pronunciation reuses `src/speech.js` without changing shared voice preferences, including French Thomas or quiet feedback. These remain isolated vocabulary cards; no sentence/chunk lesson bank or contextual grammar overlays are introduced.

## Selection and evidence

See [research source and audit](../data/spanish-lemmas/README.md), [lexical-unit findings](../data/spanish-lemmas/AUDIT.md), and [teaching edits](../data/spanish-lemmas/teaching-edits.json).

- 1,500 unique study lemma/POS pairs, 1,455 spellings; this is not 1,500 distinct written words.
- Original CORPES eligible order is preserved. Source counts are not reassigned, combined or fabricated. Display ranks are study order.
- Existing filters exclude punctuation, unknown tokens, affixes, capitalized entries, phrases, numeric/symbol entries, al/del and letter names.
- intereses is folded into the explanation of interés, without summing corpus counts. The next eligible entry, religioso, fills the vacated slot.
- Seven explicit display choices: músico→música, característico→característica, salido→salida, listo→lista, perspectivo→perspectiva, deudo→deuda and caído→caída. These select useful teaching nouns; they do not prove which tokens contributed to the original corpus count. The original labels and counts remain on each card and in provenance.
- Dictionary meanings match the displayed word and grammatical category, with explicit corrections for function-word categories, irrelevant specialist senses, excessively long glosses, and unresolved dictionary markup. By default only the first eligible sense is shown; this is not a complete sense inventory. Regional/register qualifications remain when automatically extracted.
- 226 entries currently have explicit editorial changes or selected forms. Their full record is reproducible. The 55 displayed verb forms were checked against the frozen dictionary's form mapping; ambiguous forms such as fui or fue are not claimed exclusive to one verb.

The [official table](https://www.rae.es/corpes/assets/rae/files/corpes/5000_lemas.html) is CC BY-SA 4.0 and does not state its extraction version. The original PRE-text snapshot/hash is preserved. Wiktionary meanings come from Jeff Doozan's pinned dictionary revision, credited in the public About page. The adapted deck is CC BY-SA 4.0 with all source attribution retained. No measured coverage or independent linguistic certification is claimed.

## Reproduction and checks

Run `python3 scripts/build-corpes-deck.py` (or the compatibility entry point `python3 scripts/build-lemmas.py`). It uses the checked-in raw source, dictionary extract and teaching edits; no downloads or credentials are needed. Outputs: `lemmas/data/deck.json`, `provenance.json`, and the public source-table download. `scripts/select-corpes-lemmas.py` still reproduces the separate unedited research selection; it does not overwrite the teaching deck. `scripts/audit-corpes-lemmas.py` reports category mismatches for the research selection, not teaching errors already resolved by edits.

Validation includes source-row/count identity, uniqueness by lemma/POS, headword-edit regressions, POS distinctions, progress isolation, miss-only sessions, exact regeneration, syntax checks and static build. These are pipeline/behavior checks, not proof that every source token or dictionary sense is correct.

## Local review

Run `npm run dev`, open `/lemmas/`:

1. Start Set 1, reveal el, mark Again, and check that a reload resumes at the next card. At the end of the pass, only misses repeat.
2. Browse poder: the verb and noun should have different meanings and grammatical labels. Browse música, salida and perspectiva to see edited headwords.
3. Study música (Set 6, card 300); reveal and expand “About this headword” to inspect its original source label. Review the downloadable provenance on About.
4. Check on-demand Spanish pronunciation, keyboard navigation and a narrow viewport. Revisit a finished set to start another pass.

The user approved this implementation for commit. Publication remains pending explicit approval. Future work: contextual inflection/sense practice and account synchronization; neither is implemented here.

Validation completed October 25: all 234 repository tests, `npm run check`, deterministic deck regeneration, JavaScript syntax checks and `git diff --check` passed. `npm run build:static` passed with the full local audio library (54,933 files, 1,577.0 MiB); nothing was uploaded. Browser verification confirmed the edited deck loads, el reveals its meaning, Again advances, reload/Resume returns to card 2, and Browse distinguishes poder verb/noun. Desktop screenshot inspected. Audible playback and real-device mobile testing remain user-preview checks.
