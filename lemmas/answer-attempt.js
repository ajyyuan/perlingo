import {checkAnswer, normalize} from './assessment.js';
import {answerTokens, contextSpan} from './context-answer.js';
import {cardFormWords} from './card-links.js';
import {formGroups} from './verb-forms.js';
import {verbForms} from './verb-forms-data.js';
import {guideForms} from './verb-guide-data.js';
import {typedAnswers, typedInstruction} from './recall-policy.js';

const retryMessages = {
  spelling: 'Close — check the spelling or word choice. Try again.',
  accents: 'Check the accent marks. Try again.',
  headword: 'Use the dictionary form. Try again.',
  context: 'Check the form needed here. Try again.',
  formSpelling: 'Check the spelling and requested form. Try again.'
};

export function retryMessage(reason, partOfSpeech) {
  if (reason === 'headword' && partOfSpeech === 'verb') return 'Try the infinitive.';
  return retryMessages[reason];
}

const retryTenses = new Set(['present','imperfect','preterite','perfect','subjunctive']);

// Reuse authored forms, including irregular forms, without guessing inflections.
export function createRetryForms(notes, contexts) {
  const byId = new Map();
  const byWord = new Map();
  const targets = new Map([...contexts].map(context => [context.id, context.target]));
  for (const note of notes) {
    const key = normalize(note.word);
    const forms = new Set([key]);
    const knownVerbForms = new Set();
    if (note.label === 'verb') {
      for (const group of formGroups(note)) {
        if (!retryTenses.has(group.id)) continue;
        for (const row of group.rows) {
          if (row.slot < 3 || row.sourceLabel === 'impersonal') {
            for (const form of row.alternatives) forms.add(normalize(form));
          }
        }
      }
      // A known plural or other out-of-scope form can be one edit from a singular.
      for (const bank of [verbForms[note.id], guideForms[note.id]]) {
        for (const form of Object.values(bank).flat(2)) knownVerbForms.add(normalize(form));
      }
    } else {
      for (const [, form] of note.forms) {
        for (const word of cardFormWords(form)) forms.add(normalize(word));
      }
      if (targets.has(note.id)) forms.add(normalize(targets.get(note.id)));
    }
    const entry = {id: note.id, type: note.label, forms, knownVerbForms};
    byId.set(note.id, entry);
    if (!byWord.has(key)) byWord.set(key, []);
    byWord.get(key).push(entry);
  }
  return (id, answers) => {
    const target = byId.get(id);
    if (!target) return {forms:[], knownVerbForms:new Set()};
    const alternatives = answers.flatMap(answer => byWord.get(normalize(answer)) || [])
      .filter(entry => entry.id !== id && entry.type === target.type);
    const entries = [target, ...alternatives];
    return {forms:[...new Set(entries.flatMap(entry => [...entry.forms]))],
      knownVerbForms:new Set(entries.flatMap(entry => [...entry.knownVerbForms]))};
  };
}

function editDistance(left, right) {
  const rows = Array.from({length: left.length + 1}, () => Array(right.length + 1).fill(0));
  for (let i = 0; i <= left.length; i++) rows[i][0] = i;
  for (let j = 0; j <= right.length; j++) rows[0][j] = j;
  for (let i = 1; i <= left.length; i++) {
    for (let j = 1; j <= right.length; j++) {
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + Number(left[i - 1] !== right[j - 1]));
      if (i > 1 && j > 1 && left[i - 1] === right[j - 2] && left[i - 2] === right[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1);
      }
    }
  }
  return rows[left.length][right.length];
}

function spellingIsClose(input, answer) {
  const length = Math.min(input.length, answer.length);
  if (length < 3 || !/^\p{L}+$/u.test(answer)) return false;
  const allowance = length >= 7 ? 2 : 1;
  return Math.abs(input.length - answer.length) <= allowance && editDistance(input, answer) <= allowance;
}

// This only offers another attempt. Exact accepted answers still determine credit.
export function retryReason(response, answers, inventory = {}, context = false) {
  const input = normalize(response);
  const expected = answers.map(normalize);
  if (!input || expected.includes(input)) return null;
  const {forms = [], knownVerbForms} = inventory;
  const formHint = context ? 'context' : 'headword';
  if (forms.includes(input)) return formHint;
  const known = knownVerbForms?.has(input);
  const spellingHint = known ? formHint : 'formSpelling';
  const withoutAccents = text => text.normalize('NFD').replace(/[\u0301\u0308]/gu, '').normalize('NFC');
  if (expected.some(answer => withoutAccents(answer) === withoutAccents(input))) return known ? formHint : 'accents';
  if (input.length > 64) return null;
  if (input.includes(' ')) {
    // Keep the auxiliary intact and apply the single-word typo allowance to the participle.
    const [auxiliary, participle, extra] = input.split(' ');
    if (extra || !/[\p{L}]/u.test(participle)) return null;
    const close = forms.some(form => {
      const [aux, part] = form.split(' ');
      return part && aux === auxiliary && (withoutAccents(participle) === withoutAccents(part) || spellingIsClose(participle, part));
    });
    return close ? spellingHint : null;
  }
  // Mistyped punctuation/digits still count as edits; never normalize them into credit.
  if (!/\p{L}/u.test(input)) return null;
  if (expected.some(answer => spellingIsClose(input, answer))) return known ? formHint : 'spelling';
  const closeForm = forms.some(form => withoutAccents(form) === withoutAccents(input) || spellingIsClose(input, form));
  return closeForm ? spellingHint : null;
}

function contextRetryInput(response, context, isVerb) {
  const span = contextSpan(response, context, () => true);
  if (span) return span.input[span.targetIndex];
  if (!isVerb) return response;

  // Try a compound in the blank while still checking every surrounding word.
  const words = answerTokens(response);
  const sentenceLength = context.example.chunks.reduce((n,c) => n + answerTokens(c.text).length, 0);
  if (words.length > sentenceLength + 1) return response;
  for (let i = 0; i + 1 < words.length; i++) {
    if (!['he','has','ha'].includes(words[i])) continue;
    const shortened = [...words.slice(0,i), ...words.slice(i+1)].join(' ');
    const match = contextSpan(shortened, context, word => word === words[i+1]);
    if (match?.targetIndex === i) return words[i] + ' ' + words[i+1];
  }
  return response;
}

export function submitAnswer(test, response, card, inventory = {}) {
  if (test.done || test.feedback) return test;
  const {retry, ...state} = test;
  const checked = checkAnswer(state, response, card);
  if (checked.feedback.correct || test.kind === 'choice' || !normalize(response)) return checked;
  const context = test.kind === 'context';
  const input = context ? contextRetryInput(response, card.context, card.partOfSpeech === 'verb') : response;
  const answers = context ? card.context.answers : typedAnswers(card);
  const needsSentenceForm = context || typedInstruction(card) === 'One word to fit the blank';
  const reason = retryReason(input, answers, inventory, needsSentenceForm);
  return reason ? {...state, draft: String(response), retry: reason} : checked;
}
