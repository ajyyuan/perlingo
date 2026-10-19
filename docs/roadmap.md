# Perlingo roadmap

The next sequence is C1–C5, replacing the previous suggested ordering. The user authorized continuous curriculum work using the established source-comparison method; individual content batches do not require separate approval. User approval still precedes each commit. Keep this file and the relevant specifications current with implementation.

| Task | Scope | Status |
| --- | --- | --- |
| C1 | Content foundation and small pilot: structured meanings, forms, grammar links, provenance, review metadata, validation, local inspection | Committed as `b66d4aa`. Three existing concepts migrated. Independent linguistic review remains pending. |
| C2 | Contextual details sidebar plus selection inside a chunk; display conjugations and explain individual words | Committed as `db63ea1` for the C1 pilot. Legacy entries show phrase notes and explicit gaps. Combines B3 and remaining B4 |
| C3 | Expand vocabulary, constructions, and sentences using the C1 structure and review process | Full 16-unit content draft authored, including 384 new examples per language, contrast/transfer modes and sourced reference-form tables. [Actual counts and evidence limits](course-authoring.md). Foundation’s 114 checks are retained; new scoped comparisons and local issue capture/export are implemented. Full evidence coverage, component analyses, sentence/reuse review and proposed mastery progression remain pending. No release approval is claimed. |
| C4 | AI follow-up conversation grounded in selected content; discuss model/backend before integrating | Deferred until curriculum/content work is complete; model/backend discussion still required. Formerly B5 |
| C5 | Restrained animation and reduced-motion support | Planned; formerly B6 |

Completed earlier: B1 quiet pronunciation and B2 contextual learning-chunk popovers. B4 is partially implemented through chunk selection; individual word selection within a chunk is C2. C1 stores selected word forms, not complete conjugation tables. No external content API, AI generation, import at scale, or new teaching content is introduced by C1.
