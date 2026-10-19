# Learning-card navigation (C6.1)

The initial study phase is **learning**: its panels are **learning cards**. The typed-answer phase is **recall**. The number of learning cards depends on lesson settings, so it is not necessarily nine. Contrast and transfer remain separate practice modes.

## Learning controls

- **Right or Down:** next learning card; on the last card, open the “Recall · Ready?” screen.
- **Left or Up:** previous learning card. At the first card, stay put.
- The learning card ends in a full-width panel split into equal halves: ↑ previous on the left, ↓ next on the right. The entire half is clickable. Previous is disabled at the first card; the final ↓ opens “Recall · Ready?”. Accessible labels and hover titles identify each action, including Finish learning. The top counter retains lesson position and total; the old bottom concept count and text buttons are removed.

The incoming card travels upward from 24 px below when advancing, or downward from 24 px above when going back, fading from 35% opacity over 240 ms. The previous card is replaced immediately; this is an entrance, not a delayed two-card exit sequence. Rapid navigation remains responsive and key repeats are ignored. Initial loading, the ready screen, and entering recall have no card animation. Reduced Motion disables these effects. Opening an explanation cancels movement before positioning its fixed overlay.

Arrows do not navigate while an explanation or dialog is open, while typing/editing or using a select, or with modifiers/composition. At the first learning card, previous arrows do not scroll the page. They retain ordinary browser behavior on other screens, including recall.

## Focus and recall

No custom Tab tour, automatic heading focus, or enlarged primary-button focus ring is used. Learning navigation needs only arrows. Native Tab access and existing focus indicators remain available for accessibility. Popovers retain their prior focus behavior, with Escape returning to the translation. More retains its native modal focus behavior.

Recall is unchanged: type an answer, Enter checks, then Enter on the focused Continue button advances. Arrow keys can edit the answer. No shortcut reveals an answer or changes scoring.

## Local testing

1. Reload the course preview. Press Down and Right to advance; Up and Left to return. At the first card, previous arrows should leave both card and scroll position unchanged.
2. Observe the direction: next enters upward; previous enters downward. Click the ↑/↓ halves and compare. Navigate quickly; controls should not wait for the animation.
3. Open a translation immediately after changing cards. Its popover should stay correctly positioned; arrows should not change the lesson while it is open. Escape dismisses it.
4. Advance through the final learning card to “Recall · Ready?”. A fresh Right/Down press or ↓ click should start recall; Left/Up or ↑ should return to the last card. Holding an arrow should not skip the pause. Confirm there is no card motion there and arrows still edit the answer. Enter should check and continue normally.
5. Enable OS/browser Reduced Motion and repeat navigation: changes should be immediate without movement or fade. Native Tab access is still available but not required for learning navigation.

## Before recall

Production lessons, including one-card lessons, stop at a compact **Recall · Ready?** card after learning. It uses the same split ↑/↓ panel: Right/Down or ↓ starts recall; Left/Up or ↑ returns to the final learning card. Accessible labels identify both actions. There is no automatic focus jump. Native Tab and Enter/Space activation remain available. Arrow key repeats are ignored, so a held key cannot pass the pause; a fresh press can. Double-click follow-through on Begin recall is ignored. Returning preserves the lesson and does not score a round. Leaving uses the usual unfinished-session confirmation. Contrast/transfer practice and subsequent recall rounds do not show this card.
