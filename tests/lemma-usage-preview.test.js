import test from 'node:test';
import assert from 'node:assert/strict';
import {previewWords} from '../lemmas/usage-preview-data.js';
import {normalize} from '../lemmas/assessment.js';

test('eight-word preview has complete teaching content and scoped answers', () => {
  assert.deepEqual(previewWords.map(card => card.word), ['saber', 'conocer', 'entender', 'tras', 'después', 'luego', 'empezar', 'comenzar']);
  for (const card of previewWords) {
    assert.ok(card.meaning && card.prompt && card.cue);
    assert.ok(card.uses.length && card.comparisons.length);
    assert.ok(card.answers.includes(card.word));
    for (const entry of [...card.uses, ...card.comparisons]) assert.ok(entry.every(text => typeof text === 'string' && text.trim()));
  }
  const accepts = (word, answer) => previewWords.find(card => card.word === word).answers.includes(normalize(answer));
  assert.ok(accepts('empezar', ' COMENZAR! '));
  assert.ok(accepts('comenzar', 'empezar'));
  assert.ok(accepts('después', 'luego'));
  assert.ok(accepts('luego', 'después'));
  assert.ok(accepts('entender', 'comprender'));
  for (const [word, answer] of [['saber', 'conocer'], ['conocer', 'saber'], ['tras', 'después'], ['tras', 'después de'], ['luego', 'despues']]) assert.equal(accepts(word, answer), false);
});

test('both temporal cards expose the sourced detailed comparison', async () => {
  const {usageComparisons} = await import('../lemmas/usage-comparisons.js');
  const sections = usageComparisons['despues-luego'];
  assert.equal(sections.length, 8);
  for (const word of ['después', 'luego']) {
    const card = previewWords.find(item => item.word === word);
    const other = word === 'después' ? 'luego' : 'después';
    assert.equal(card.comparisons.find(item => item[0] === other)[4], 'despues-luego');
    assert.ok(card.answers.includes(other));
  }
  for (const section of sections) {
    assert.ok(section.title && section.text);
    assert.ok(section.sources.length);
    for (const [, url] of section.sources) assert.match(url, /^https:\/\/(www\.|dle\.)rae\.es\//);
    for (const example of section.examples) assert.equal(example.length, 2);
  }
  const regional = sections.find(section => section.title === 'Regional meanings');
  assert.match(regional.text, /Canary Islands/);
  assert.match(regional.text, /El Salvador/);
});

test('Day 1 preview covers all 250 distinct entries with sourced overlays', async () => {
  const {readFile} = await import('node:fs/promises');
  const read = async name => JSON.parse(await readFile(new URL(`../lemmas/data/${name}.json`, import.meta.url), 'utf8'));
  const {buildUsagePreview} = await import('../lemmas/usage-preview-library.js');
  const input = await Promise.all(['deck', 'notes', 'context', 'day1-usage'].map(read));
  const {cards, groups} = buildUsagePreview(...input);
  assert.equal(cards.length, 250);
  assert.deepEqual(cards.map(c => c.id), input[0].slice(0, 250).map(c => c.id));
  assert.equal(new Set(cards.map(c => c.id)).size, 250);
  for (const card of cards) {
    assert.ok(card.groups.length, card.id);
    assert.ok(card.meaning && card.prompt, card.id);
    assert.equal(typeof card.cue, 'string');
    assert.ok(card.answers.includes(card.word), card.id);
    assert.ok(card.uses.length <= 2, 'Keep main cards compact');
    for (const key of card.groups) assert.ok(groups.get(key).members.includes(card.id));
  }
  for (const group of groups.values()) {
    for (const member of group.members) assert.ok(cards.some(card => card.id === member));
    assert.ok(group.sections.length);
    for (const section of group.sections) {
      assert.ok(section.title && section.text);
      assert.ok(section.sources.length);
      for (const [label, url] of section.sources) {
        assert.ok(label);
        assert.equal(new URL(url).protocol, 'https:');
      }
      for (const example of section.examples) assert.ok(example.length === 2 && example.every(Boolean));
    }
  }
});

test('expansion retains original prompt-specific boundaries without synonym transitivity', async () => {
  const {readFile} = await import('node:fs/promises');
  const {buildUsagePreview} = await import('../lemmas/usage-preview-library.js');
  const {dayOneRecall} = await import('../lemmas/recall-policy-data.js');
  const input = await Promise.all(['deck', 'notes', 'context', 'day1-usage'].map(async name => JSON.parse(await readFile(new URL(`../lemmas/data/${name}.json`, import.meta.url), 'utf8'))));
  const {cards, groups} = buildUsagePreview(...input);
  for (const card of cards) {
    const original = previewWords.find(item => item.word === card.word);
    assert.deepEqual(card.answers, original?.answers || [card.word, ...dayOneRecall[card.id].alternatives]);
  }
  for (const word of ['saber', 'conocer', 'entender']) assert.ok(cards.find(c => c.word === word).groups.includes('knowledge'));
  for (const word of ['empezar', 'comenzar']) assert.ok(cards.find(c => c.word === word).groups.includes('begin'));
  assert.ok(groups.get('knowledge').sections.length >= 5);
  assert.ok(groups.get('begin').sections.length >= 4);
  assert.ok(groups.get('word-agua').sections.some(s => s.text.includes('feminine') && s.text.includes('stressed')));
});

test('preview and course share form recognition for every Day 1 card', async () => {
  const {readFile} = await import('node:fs/promises');
  const {buildUsagePreview} = await import('../lemmas/usage-preview-library.js');
  const {combineNotes} = await import('../lemmas/notes-library.js');
  const {createRetryForms} = await import('../lemmas/answer-attempt.js');
  const input = await Promise.all(['deck', 'notes', 'context', 'day1-usage'].map(async name =>
    JSON.parse(await readFile(new URL(`../lemmas/data/${name}.json`, import.meta.url), 'utf8'))));
  const preview = buildUsagePreview(...input);
  const library = combineNotes(input[1], input[2]);
  const courseForms = createRetryForms(library.notes, library.contexts.values());
  for (const card of preview.cards) {
    assert.deepEqual(preview.retryForms(card.id, card.answers), courseForms(card.id, card.answers), card.id);
  }
  for (const [id, word, variants] of [
    ['corpes:el:T', 'el', ['la', 'los', 'las']],
    ['corpes:un:T', 'un', ['una', 'unos', 'unas']],
    ['corpes:todo:Q', 'todo', ['toda', 'todos', 'todas']],
    ['corpes:otro:Q', 'otro', ['otra', 'otros', 'otras']],
    ['corpes:uno:M', 'uno', ['un']]
  ]) for (const variant of variants) assert.ok(preview.retryForms(id, [word]).forms.includes(variant), `${id}: ${variant}`);
});

test('audit examples resolve consistently, have complete glosses, and retain exact grading', async () => {
 const {readFile} = await import('node:fs/promises');
 const {dayOneExamples} = await import('../lemmas/day1-examples.js');
 const {combineNotes} = await import('../lemmas/notes-library.js');
 const {buildUsagePreview} = await import('../lemmas/usage-preview-library.js');
 const {exampleMarkup} = await import('../lemmas/sentence-help.js');
 const {supplementalMarkup} = await import('../lemmas/note-view.js');
 const input=await Promise.all(['deck','notes','context','day1-usage'].map(async n=>JSON.parse(await readFile(new URL(`../lemmas/data/${n}.json`,import.meta.url),'utf8'))));
 const preview=buildUsagePreview(...input);
 const main=combineNotes(input[1],input[2],input[3]);
 assert.equal(Object.keys(dayOneExamples).length,30);
 for(const rank of [20,21,44,50,57,62,66,77,85,86,101,114,119,123,126,131,135,144,149,160,177,184,185,199])assert.ok(dayOneExamples[input[0][rank-1].id],`audit rank ${rank}`);
 assert.equal(dayOneExamples['corpes:uno:M'],undefined);
 for(const [id,example] of Object.entries(dayOneExamples)){
  const card=preview.cards.find(c=>c.id===id),note=main.notes.find(n=>n.id===id);
  assert.equal(card.uses[0][1],example.text,id);
  assert.equal(note.examples[0].text,example.text,id);
  assert.doesNotThrow(()=>exampleMarkup(example),id);
 }
 assert.match(preview.cards.find(c=>c.word==='sobre').meaning,/about/);
 assert.match(preview.cards.find(c=>c.word==='desde').meaning,/from/);
 const sobre=main.notes.find(n=>n.word==='sobre');
 assert.match(supplementalMarkup(sobre,main.concepts),/Position versus subject matter/);
 assert.doesNotMatch(supplementalMarkup(sobre,main.concepts),/Usage in context/);
 assert.match(supplementalMarkup(sobre,main.concepts),/Un libro sobre música/);
 for(const word of ['después','luego'])assert.equal(main.notes.find(n=>n.word===word).usageGroups[0].sections.length,8);
});
