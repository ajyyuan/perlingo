import {dayOneExamples} from './day1-examples.js';
import {previewWords as originals} from './usage-preview-data.js';
import {usageComparisons} from './usage-comparisons.js';
import {dayOneTeaching} from './day1-teaching-data.js';
import {dayOneRecall} from './recall-policy-data.js';
import {combineNotes} from './notes-library.js';
import {createRetryForms} from './answer-attempt.js';

// This separate prototype never writes to course data or saved progress.
export function buildUsagePreview(deck, notes, contexts, content) {
  const library = combineNotes(notes, contexts);
  const retryForms = createRetryForms(library.notes, library.contexts.values());
  const noteMap = new Map(notes.notes.map(note => [note.id, note]));
  const contextMap = new Map(contexts.contexts.map(context => [context.id, context]));
  const groups = new Map(content.groups.map(group => [group.id, group]));
  groups.set('despues-luego', {id: 'despues-luego', title: 'después · luego', members: ['corpes:después:R', 'corpes:luego:R'], sections: usageComparisons['despues-luego']});
  const cards = deck.slice(0, 250).map(entry => {
    const note = noteMap.get(entry.id);
    const context = contextMap.get(entry.id);
    const original = originals.find(card => card.word === entry.lemma);
    const policy = dayOneRecall[entry.id];
    const ownGroups = [...groups.values()].filter(group => group.members.includes(entry.id)).map(group => group.id);
    if (['después', 'luego'].includes(entry.lemma)) ownGroups.sort((a, b) => (b === 'despues-luego') - (a === 'despues-luego'));
    const solo = groups.get(`word-${entry.lemma}`);
    // New simple cards use the first authored example, without extra prose on the card.
    const aligned = dayOneExamples[entry.id];
    const sample = aligned ? [aligned.text, aligned.translation] : solo?.sections[0].examples[0] || [context.example.text, context.example.translation];
    return {
      id: entry.id, rank: entry.rank, word: entry.lemma, type: entry.partOfSpeech,
      meaning: original?.meaning || dayOneTeaching[entry.id]?.meaning || note.meaning,
      uses: original?.uses || [['', ...sample]],
      prompt: original?.prompt || policy.prompt,
      cue: original?.cue || policy.cue,
      blank: original?.blank,
      answers: original?.answers || [entry.lemma, ...policy.alternatives],
      groups: ownGroups
    };
  });
  return {cards, groups, retryForms};
}
