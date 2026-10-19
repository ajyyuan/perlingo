# Flashcard surface (C6)

The active learning panel (`.concept`) and recall panel (`.quiz.typed`, including contrast practice) have a subtle raised-paper treatment: a warm near-white gradient, a fine warm-gray border, rounded corners, and a faint layered shadow. This is CSS shading, with no image texture or additional dependencies.

The desktop card has 40 px horizontal padding and a 722 px maximum outer width, preserving the previous 640 px content width. At 600 px and below, padding reduces to 20 px horizontally and the corner radius reduces from 16 to 12 px. Content remains in normal flow and the card grows for long sentences and feedback. The surface itself introduces no clipping. C6.1 adds temporary directional entrance transforms during learning-card navigation; these are cancelled before opening translation popovers, which remain viewport-positioned. More remains a fixed overlay. Reduced Motion disables the card entrances.

Settings, the course list, history, and completion screens retain their existing styling. Pronunciation, recall scoring, and content are unchanged.

## Preview checks

1. Open the course preview and inspect the central lesson surface; the color and shadow should feel only slightly distinct from the page.
2. Advance through a few concepts, including a sentence. Open a translation popover and More; they should remain overlays without shifting the card.
3. Enter recall or choose a course unit’s contrast practice. Check an answer and continue; feedback and controls should fit within the surface.
4. Narrow the window to a phone width. Translations should stack, long text should wrap, and the card should stay inside the viewport.

The learning card’s bottom edge is a two-column navigation panel with equal ↑/↓ button areas and a fine center divider. It extends through the horizontal padding to the card edges; bottom corner rounding is applied to the buttons without clipping translation popovers. Recall keeps its original action row.
