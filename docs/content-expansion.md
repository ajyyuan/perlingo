# C3: content expansion

## Current deliverable

C2 was committed as `db63ea1`; the first C3 tranche was committed as `e3ddcf7`. C3's first tranche adds a **draft** foundation pack of 50 meanings / 150 translations: 30 nouns, 8 verbs, 8 sentences, and 4 subject-agreement exercises. This is an authored everyday-vocabulary selection, not a measured top-frequency list. It is not the full future curriculum, and C3 remains ongoing until evidence and review requirements are satisfied.

- Source: `src/content/foundation.js`; data assembly is deterministic and runs locally, without AI or network requests.
- Preview: http://127.0.0.1:5173/?pack=foundation
- Review: http://127.0.0.1:5173/content-review.html?pack=foundation
- Regular lessons remain the existing 34 concepts. New draft entries do not silently enter that bank.
- Preview settings/progress use `perlingo-preview-foundation-v1`, independent of `perlingo-v1`. Return to regular lessons via the preview banner. Export works on whichever bank is active.
- The same learning, recall, pronunciation, popover, and overlay interfaces operate on the draft pack. Preview recall still accepts the exact taught translation; it does not evaluate every valid paraphrase.

## Conjugation and word inspection

Reading-pilot v3 and foundation v3 provide present-indicative tables for all their verbs: 27 language-specific verbs in total. Tables cover six grammatical person/number slots, plus a common Spanish vos form. Spanish includes tú, usted, vosotros, and ustedes; French vous/on and German formal Sie are explained. The tables do not claim to cover all regional voseo variants, other tenses, or other moods.

The overlay heading is **Present-tense conjugation**, with subject and form columns. A finite verb selected in a sentence highlights the matching person/number row, not every row with the same spelling. Infinitive selections show the table without implying a person. Nouns show **Singular and plural**, not “available forms.” Multiword noun entries remain chunks. Inside them, word notes distinguish the head noun, preposition, and modifier, give component glosses, and retain the whole expression’s meaning. Components do not inherit the compound’s lexical forms as if they were standalone entries.

Word annotations and forms belong to their draft pack and inherit its review obligations. `src/content/catalog.js` resolves pack ownership and rejects colliding entry IDs. `src/details.js` and `src/explanations.js` use this catalog for all registered packs; other starter-bank explanations remain unchanged.

## Confidence and evidence

All new material remains draft. The 2026-10-18 source pass compared **all 114 foundation lexical records** (90 nouns and 24 verbs): intended meaning, noun gender/singular/plural, and the displayed present-indicative forms. References are attached to all 150 translations, with separate scope descriptions. Most are language-specific Wiktionary entries; SpanishDictionary.com supplies the intended senses for `carta`, `tren`, and `comida`, with Wiktionary plural entries for the two lemma pages that timed out. Revisions are pinned where returned by the consulted page; other links are live and dated. RAE/ASALE, UT Austin, and IDS grammis references support the recorded construction rules. See [evidence record](content-evidence.md).

Corrections include a consistent **ballpoint pen** sense (`stylo à bille`, not generic `stylo`), component roles inside French compounds, explicit elided-article notes, and a masculine/mixed-group qualification for the “they” exercise. Regional/sense notes flag Spanish `coche`, `billete`, `patata`, `tomate`, `comida`, and French `chambre`.

This is a Codex source comparison, **not independent linguistic approval**. Exact sentence naturalness, word-note prose, regional suitability, accepted alternative answers, and reuse terms remain pending. No sentence has been promoted as corpus-attested. The reading pilot remains separately draft; this pass does not certify the legacy bank.

`src/content/foundation-evidence.js` freezes checked lexical values (lemma, sense ID, gender where applicable, and forms with their grammatical labels). Validation rejects a changed checked value until its evidence is rechecked and updated. Do not regenerate those snapshots from lesson data to silence failures. This guard does not automatically detect changed prose, definitions, or external source edits; those still require review.
Structural validation and tests check coverage, reference integrity, conjugation person/number coverage, token annotations, original-text reconstruction, and selected-form behavior. They cannot certify linguistic correctness. `approvedEntries` and the release CLI still reject the packs. The preview intentionally allows drafts, with a visible label; release admission must use the strict gate.

## Expansion plan beyond the first tranche

1. **Vocabulary:** follow the [proposed curriculum budgets](curriculum.md): 800 lexical sense-items per language for the core, 1,600 through the extension. Author and source-check the U01 inventory, then continue through the remaining units without batch approval pauses. A later library may expand toward 10,000. Rank within each language using frequency evidence, normalize inflected forms to lemmas, and disambiguate meanings before aligning translations. The current 50 are not frequency-ranked. Add adjectives, adverbs, and fixed expressions when their model and review coverage are ready.
2. **Grammar progression:** see the [audited topics and proposed progression](grammar-topics.md). Topic metadata and muted labels are implemented; filters, prerequisite sequencing, remain planned; the 16-unit course now supplies draft objective exercises. The foundation pack currently targets subject–verb agreement.
3. **Sentences:** select reviewed examples or author controlled candidates with mostly known vocabulary and one target construction. Record intended meaning and language-specific chunks. Avoid unconstrained substitutions; naturalness, ambiguity, register, and accepted answers need review. Existing candidates focus on writing, shopping, doors/windows, and transport.
4. **Evidence:** attach supporting lexical and grammatical references at the claim/record level, preserve attribution, inspect reuse terms, and pin revisions where possible. Frequency data ranks candidates; it does not verify translation or grammar. Imported corpora need their own provenance and license checks.
5. **Review and release:** the user authorized continued local authoring using the existing source-comparison process on 2026-10-18. Independent linguistic review adds assurance but is not a blocker to this work. Keep per-record evidence and review metadata truthful; method acceptance is not a claim that every entry was individually reviewed. Publication is separately authorized and the existing strict release gate remains unchanged. Do not promote drafts merely to make that gate pass. See [content maintenance](content-maintenance.md) for reports and corrections.

## Manual verification

Open the draft preview, advance to a verb, select it and choose More: check the full present table. Advance to “I write a letter,” inspect the verb, and confirm only the relevant row is highlighted. Switch to the noun phrase and inspect its article and noun. Check the review page’s 114/114 lexical coverage, scoped source links, and still-pending independent review. Inspect potato and ballpoint pen: French de/à should be prepositions within the intact noun phrase. Return to regular lessons and verify the normal settings/history remain separate.

The [16-unit course draft](course-authoring.md) is now authored and locally playable, with additional sourced forms, contrast exercises and transfer recall. Its inventory meets the numerical targets; source/sense coverage, sentence/prose verification and release clearance remain incomplete. The original foundation bank and its approval status are unchanged.
