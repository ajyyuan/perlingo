# Motion and reduced motion (C5)

Motion is optional polish, implemented entirely in `src/style.css`. Effects apply only when `prefers-reduced-motion: no-preference` matches:

- Translation popovers and content-report dialogs fade in over 140 ms.
- The More sidebar fades in and moves 10 px from the right over 180 ms. Modal backdrops fade in over 140 ms.
- Nonempty typed-answer feedback fades in over 140 ms, for both correct answers and revealed corrections.
- Buttons transition text, background, and border colors over 120 ms.

These entrances do not change layout or move the lesson behind overlays. Closing is immediate. No whole-screen transitions, looping effects, animated pronunciation indicators, or delayed input/focus changes are introduced. C6.1 additionally gives incoming learning cards a 240 ms, 24 px directional entrance with a fade: upward for next, downward for previous. It applies to keyboard and button navigation, not initial loading, entering recall, or recall questions. Opening an explanation cancels any active card entrance. Word and tense selection inside More stay immediate. Contrast-mode feedback stays immediate.

With OS/browser Reduced Motion enabled, none of these animations or transitions apply. Changing the preference also cancels an active effect through the media query. Browsers without support default to the static interface. No separate app setting or JavaScript timing is needed.

## Local testing

1. Open the course preview, click a translation, and open More. Observe the short popover fade and small sidebar entrance, with the lesson remaining in place.
2. Close with Escape and the close button; dismissal and focus return should be immediate. Reopen and select another word or tense; the panel should not animate again.
3. Open Report an issue from More, then close it. It should fade in without delaying interaction.
4. Start recall and check an answer or choose I don’t know. Feedback should fade in without moving the prompt; Continue should respond immediately. French pronunciation should still use Thomas when available, with quiet feedback.
5. Enable Reduce Motion in macOS Accessibility → Display (or emulate `prefers-reduced-motion: reduce` in browser developer tools). Repeat: overlays, feedback, and button state changes should appear immediately. Disable the preference to restore effects. Try narrow and wide window sizes.

## AI direction

C4’s contextual chatbot and backend were removed at the user’s request. Lessons remain curated local content. A future AI feature is an open product question, not an implemented feature or commitment; evaluate it for usefulness beyond asking an external chatbot.
