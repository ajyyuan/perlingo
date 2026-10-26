import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {contextPilot} from '../lemmas/context-pilot.js';
import {firstSetNotes} from '../lemmas/first-set-notes.js';
import {createTest,checkAnswer,advanceTest,validTest} from '../lemmas/assessment.js';
import {sentenceMarkup,wordMeanings} from '../lemmas/word-help.js';
const deck=JSON.parse(readFileSync(new URL('../lemmas/data/deck.json',import.meta.url)));
test('cloze covers Set 1 with one exact surface word removed from each original sentence',()=>{
 assert.deepEqual(contextPilot.map(c=>c.id),deck.slice(0,50).map(c=>c.id));
 for(const [i,c] of contextPilot.entries()){
  assert.deepEqual(c.example,firstSetNotes[i].examples[0]);
  assert.equal(c.example.chunks.map(ch=>ch.text).join(' ')+'.',c.example.text);
  assert.equal(c.example.chunks[c.index].text.slice(c.offset,c.offset+c.target.length),c.target);
  assert.match(c.target,/^\p{L}+$/u);assert.deepEqual(c.answers,[c.target]);assert.ok(c.explanation);
  const html=sentenceMarkup(c);assert.equal((html.match(/class="cloze-blank"/g)||[]).length,1);
  // No hidden Spanish target in text, pronunciation attributes, or tooltip markup.
  assert.ok(!html.includes(`data-speak="${c.target}"`));
  const shown=sentenceMarkup(c,true);assert.ok(shown.includes(`data-speak="${c.target}"`));assert.ok(!shown.includes('cloze-blank'));
  for(const w of c.example.text.match(/\p{L}+/gu))assert.ok(wordMeanings[w.toLocaleLowerCase('es')],w);
 }
});
test('cloze expects the sentence form, distinguishes a correct lemma, and rejects translation answers',()=>{
 const ex=contextPilot.find(c=>c.id==='corpes:ser:V'),card={id:ex.id,lemma:'ser',context:ex};
 const t=createTest('context',[ex.id]);
 assert.equal(checkAnswer(t,'somos',card).feedback.correct,true);
 assert.equal(checkAnswer(t,'ser',card).feedback.formError,true);
 assert.equal(checkAnswer(t,'we are',card).feedback.correct,false);
 assert.equal(checkAnswer(t,'',card).feedback.correct,false);
 assert.equal(advanceTest(checkAnswer(t,'somos',card)).done,true);
 assert.equal(validTest({...t,contextVersion:undefined},[ex.id]),false);
});
test('single-word blanks preserve constructions and contractions rather than removing whole phrases',()=>{
 assert.equal(contextPilot.find(c=>c.id==='corpes:ya:R').target,'Ya');
 assert.equal(contextPilot.find(c=>c.id==='corpes:todo:Q').target,'todos');
 assert.equal(contextPilot.find(c=>c.id==='corpes:a:P').target,'al');
 assert.equal(contextPilot.find(c=>c.id==='corpes:como:C').target,'Como');
 const c=contextPilot.find(c=>c.id==='corpes:como:C'),html=sentenceMarkup(c);
 assert.ok(!html.includes('Como'));assert.ok(html.includes('data-speak="llueve"'));assert.ok(html.includes('it rains'));
});
