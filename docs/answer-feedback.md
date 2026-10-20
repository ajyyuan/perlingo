# Answer feedback (C7)

Implemented and approved for publication on 2026-10-19; included in the release package in `dist/`.

Each scored submission in production recall, transfer recall, and meaning contrast triggers a brief original two-note sine-wave cue, then pronunciation of the taught translation in the question's language. Correct answers use an ascending cue; misses (including “I don’t know”) use a descending cue. Accepted alternatives still play the canonical taught translation. Contrast questions pronounce the target-language sentence, not the English meaning. Blank typed submissions do not trigger audio or scoring.

Web Audio generates the quiet 240 ms cue locally, with no assets, external providers, accounts, or backend. Speech uses the existing selected-region pronunciation player and its French Thomas preference. Browser voice availability and device volume still affect pronunciation; missing speech remains silent without blocking the quiz. If Web Audio is unavailable or fails, pronunciation is attempted directly. `src/answer-feedback.js` manages sequencing and cancellation; `src/app.js` triggers it only after scoring and rendering feedback.

**Answer sound: on/off** is available only in Settings. Recall shows a speaker beside the taught correct translation after submission, for correct answers, misses, and contrast questions. This speaker cancels pending automatic feedback and replays pronunciation without a chime, including when automatic sound is off. Clicking a chunk of the revealed correct translation also pronounces it and opens the same Quick meaning overlay as learning, including Pronunciation and Grammar links. Opening it cancels automatic audio and feedback motion. Help uses the current recall question and is available only after scoring; it does not change the recorded result. No help, replay button, or answer is revealed early. It controls both automatic chimes and automatic pronunciation, defaults on for existing and new users, and is saved with the current pack's browser-local settings. It does not disable manually requested pronunciation. Turning it on does not replay an answer. Continue remains available immediately. Navigation, opening a report, muting, page hiding, and leaving the page stop pending feedback; restoring an unfinished day does not replay it. No progress keys, score rules, or SRS intervals change.

Correct submissions briefly lift feedback by 3 px; misses briefly nudge it horizontally by 3 px. The 240 ms effects apply to typed feedback or contrast choices and respect Reduced Motion. Text and existing answer styling convey the result without motion or sound.

## Local verification

`npm test` includes audio sequencing, descending miss cues, mute cancellation, navigation during a chime or delayed audio activation, and missing Web Audio fallback. Existing speech tests cover Thomas selection and voice fallback. `npm run check` validates application syntax and content.

1. Open http://127.0.0.1:5173 and enter recall. Submit a correct answer: hear a short ascending cue, then the taught answer, with a slight lift.
2. Submit a wrong answer and use “I don’t know”: hear a descending cue, then the correction, with a slight nudge. A blank Check should only ask for input.
3. Press Continue immediately after submission, and separately exit or hide the page while audio is pending. Old audio must not spill into the next question. Navigation must not wait for audio.
4. Turn Answer sound off in Settings. Subsequent submissions remain silent; reload and verify the setting persists. After submitting an answer, click the speaker beside the correct translation: pronunciation should still play. Try repeated clicks and immediate Continue to verify cancellation. Recall should have no Answer sound toggle. Turn sound on in Settings and verify the next submission plays normally.
5. Enable OS/browser Reduced Motion. Feedback should remain readable with no movement. Verify French uses Thomas where installed. Check the quiet chime and speech volume on the actual device.
6. From Course, try Understand the difference and Try new combinations. Both should use the same feedback sequence. Resume an unfinished recall after reload: displayed feedback should not replay.

Testing ordinary recall advances local progress normally; no reset or storage deletion is required.

7. After a correct answer, miss, or contrast choice, click a chunk in the revealed correct translation. Verify its contextual meaning, IPA → Pronunciation, and grammar cue → Grammar. Close with Escape or outside click; Continue should dismiss help. Check a later question to confirm help follows that question, not the last learning card. Before submission, none of these answer controls should appear.

The local Azure trial routes the taught correct answer through the same recorded-audio player as manual replay and learning chunks. The quiet chime remains unchanged. Region changes cancel previous playback; automatic audio remains controlled by Answer sound. See [regional audio](pronunciation-audio.md).

The shared recorded player also respects the per-language Masculine/Feminine preference; changing it cancels playback without changing the quiet chime. Device fallback cannot guarantee gender.
