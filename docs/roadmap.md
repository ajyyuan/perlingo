# Perlingo roadmap

Completed work is tracked as C1–C7; C7 status and the C8–C10 backlog are below. The user authorized continuous curriculum work using the established source-comparison method; individual content batches do not require separate approval. User approval still precedes each commit. Keep this file and the relevant specifications current with implementation.

| Task | Scope | Status |
| --- | --- | --- |
| C1 | Content foundation and small pilot: structured meanings, forms, grammar links, provenance, review metadata, validation, local inspection | Committed as `b66d4aa`. Three existing concepts migrated. Independent linguistic review remains pending. |
| C2 | Contextual details overlay plus selection inside a chunk; display conjugations and explain individual words | Committed as `db63ea1` for the C1 pilot. Legacy entries show phrase notes and explicit gaps. Combines B3 and remaining B4 |
| C3 | Expand vocabulary, constructions, and sentences using the C1 structure and review process | Full 16-unit content draft authored, including 384 new examples per language, contrast/transfer modes and sourced reference-form tables. [Actual counts and evidence limits](course-authoring.md). Foundation’s 114 checks are retained; new scoped comparisons and local issue capture/export are implemented. Full evidence coverage, component analyses, sentence/reuse review and proposed mastery progression remain pending. No release approval is claimed. |
| C4 | AI follow-up conversation | Removed at user request. No chatbot, OpenAI backend, or API-key setup remains in the app. A different AI integration may be explored later; no replacement is selected or implemented. |
| C5 | Restrained animation and reduced-motion support | Implemented and user-approved: brief overlay entrances, typed-answer feedback fade, and button color transitions. OS/browser Reduced Motion disables all added effects. See [motion behavior](motion.md). |
| C6 | Subtle flashcard surface for learning and recall | Implemented and user-approved: warm paper shading, fine border, rounded corners, faint shadow, and responsive inset spacing. See [visual treatment](flashcard-surface.md). |
| C6.1 | Simple learning-card navigation and motion | Implemented and user-approved: Right/Down next, Left/Up previous, directional card entrances, reduced-motion support, and an explicit ready screen before recall. Custom focus tour removed; recall unchanged. See [controls](keyboard-navigation.md). |

Completed earlier: B1 quiet pronunciation and B2 contextual learning-chunk popovers. B4 is partially implemented through chunk selection; individual word selection within a chunk is C2. C1 stores selected word forms, not complete conjugation tables. No external content API, AI generation, import at scale, or new teaching content is introduced by C1.

Published: promote the full course to the default route, preserve existing course progress, and move the main-screen content-quality notice into Settings → About. Legacy starter access is explicit at `?pack=starter`. Included in production.

Published SRS: app-days with 4 → 32 → graduate scheduling, review misses reset to +4, one attempt per review, perfect full rounds for new material, and a 108 planned-answer cap with reviews prioritized. Unfinished days resume from browser-local storage. See [spaced review](spaced-review.md). Included in production.


## Next backlog (2026-10-19)

C7 is implemented locally and approved for commit on 2026-10-19; C7.5 is implemented locally and approved for commit on 2026-10-19; C8–C10 remain planned. Work on one agreed task at a time; the ordering below is a proposal, not authorization to implement the entire backlog.

| Task | Scope | Next decision / acceptance criteria |
| --- | --- | --- |
| C7 | Answer feedback: a short chime after each submitted recall answer, followed by pronunciation of the correct answer; simple correct/incorrect animation | Implemented locally: original quiet synthesized cues, then the taught translation through the existing voice player; saved Settings sound toggle and post-submission pronunciation replay and Quick meaning/Pronunciation/Grammar help on the revealed correct translation, submission-only correct/miss motion, reduced-motion support, and cancellation on navigation/mute/page hiding. Scoring/SRS unchanged. 94 tests and content checks pass. Approved for commit on 2026-10-19; not yet published. See [behavior and testing](answer-feedback.md). |
| C7.5 | Restart the entire unfinished app-day | Implemented locally: confirmation, frozen-plan replay, rollback of completed review scheduling/journal entries, and saved checkpoints. Preserves earlier days and optional practice history. Legacy days with already-completed reviews and no checkpoint are excluded. 97 tests and content checks pass; approved for commit on 2026-10-19; not yet published. See [restart behavior](spaced-review.md#restart-day-c75). |
| C8 | Optional sign-in and saved/synchronized progress | Choose authentication and storage before integration. Preserve guest use and existing browser progress; define account migration, cross-device conflicts, and recovery. No provider chosen yet. |
| C9 | Mobile usability and consistent pronunciation audio | Swipe up for next and down for previous learning cards, without interfering with scrolling, overlays, or recall input. Test small screens and mobile keyboards. Separately compare recorded/pre-generated audio providers, pronunciation quality, coverage, licenses, cost, caching, and fallback behavior to reduce reliance on installed browser voices. No provider chosen yet. |
| C10 | Custom domain and eventual iOS app | Choose a domain and hosting setup; evaluate mobile web/PWA versus a native or wrapped iOS app after C9. Domain purchases, accounts, and App Store release require separate explicit authorization. |

Handoff baseline: `ac3fec1` is committed, pushed, and deployed as public Sites version 8 at https://perlingo-parallel.ayuan2.chatgpt.site. Includes pronunciation/grammar overlays, human IPA recordings, and contextual German ʁ/ɐ normalization. All 88 tests and content checks passed. C7 and this backlog documentation are subsequent changes, not part of that publication.
