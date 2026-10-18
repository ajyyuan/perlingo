# Perlingo roadmap

The next sequence is C1–C5, replacing the previous suggested ordering. Implement one agreed task at a time; user approval precedes each commit. Keep this file and the relevant specifications current with implementation.

| Task | Scope | Status |
| --- | --- | --- |
| C1 | Content foundation and small pilot: structured meanings, forms, grammar links, provenance, review metadata, validation, local inspection | Committed as `b66d4aa`. Three existing concepts migrated. Independent linguistic review remains pending. |
| C2 | Contextual details sidebar plus selection inside a chunk; display conjugations and explain individual words | Committed as `db63ea1` for the C1 pilot. Legacy entries show phrase notes and explicit gaps. Combines B3 and remaining B4 |
| C3 | Expand vocabulary, constructions, and sentences using the C1 structure and review process | First tranche implemented locally: 50 draft concepts plus full present-indicative tables. Grammar topic metadata/labels and audited coverage added; topic filtering/progression remain planned. All 114 lexical records now source-compared, with scoped references and stale-check validation. Sentence/prose checks, independent review, and broader expansion remain ongoing. See [C3 plan](content-expansion.md). |
| C4 | AI follow-up conversation grounded in selected content; discuss model/backend before integrating | Planned; formerly B5 |
| C5 | Restrained animation and reduced-motion support | Planned; formerly B6 |

Completed earlier: B1 quiet pronunciation and B2 contextual learning-chunk popovers. B4 is partially implemented through chunk selection; individual word selection within a chunk is C2. C1 stores selected word forms, not complete conjugation tables. No external content API, AI generation, import at scale, or new teaching content is introduced by C1.
