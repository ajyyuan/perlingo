import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {contextPilot} from '../lemmas/context-pilot.js';
import {sentenceMarkup} from '../lemmas/word-help.js';
import {answerTokens,matchesContextAnswer} from '../lemmas/context-answer.js';
import {cleanDictation} from '../lemmas/dictation-text.js';
import {createTest,checkAnswer,advanceTest} from '../lemmas/assessment.js';
import {examIds,restoreExams} from '../lemmas/exam-state.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const deck=read('lemmas/data/deck.json'),bank=read('lemmas/data/context.json');
const cards=new Map(deck.map((c,i)=>[c.id,{...c,context:bank.contexts[i]}]));
test('all five days have precisely 300 contextual cards in unchanged course order',()=>{
 assert.equal(bank.version,3);assert.equal(bank.contexts.length,1500);
 assert.deepEqual(bank.contexts.map(c=>c.id),deck.map(c=>c.id));
 assert.deepEqual(bank.contexts.slice(0,50).map(({headwordCue,recallCue,answerNote,...original})=>original),contextPilot);
 for(let day=0;day<5;day++)assert.deepEqual(bank.contexts.slice(day*300,day*300+300).map(c=>c.id),examIds(deck,day));
 for(const c of bank.contexts){
  assert.equal(c.example.chunks.map(ch=>ch.text).join(' ')+'.',c.example.text);
  assert.equal(c.example.chunks[c.index].text.slice(c.offset,c.offset+c.target.length),c.target);
  assert.match(c.target,/^\p{L}+$/u);assert.ok(c.example.translation);assert.ok(c.explanation);
  const hidden=sentenceMarkup(c),shown=sentenceMarkup(c,true);
  assert.equal((hidden.match(/class="cloze-blank"/g)||[]).length,1);
  assert.ok(!hidden.includes(`data-speak="${c.target}"`),c.id);
  assert.ok(shown.includes(`data-speak="${c.target}"`),c.id);
  if(c.wordMeanings)for(const word of answerTokens(c.example.text))assert.ok(c.wordMeanings[word],`${c.id}: ${word}`);
 }
});
test('every contextual word, sentence, target-bearing phrase and dictated sentence is gradeable',()=>{
 for(const c of bank.contexts){
  assert.ok(matchesContextAnswer(c.target,c),c.id);
  assert.ok(matchesContextAnswer(c.example.text,c),c.id);
  assert.ok(matchesContextAnswer(c.example.chunks[c.index].text,c),c.id);
  assert.ok(matchesContextAnswer(cleanDictation(c.example.text,c.answers,c),c),c.id);
  assert.ok(!matchesContextAnswer('not the Spanish answer',c),c.id);
  const wrong=c.example.chunks.map((ch,i)=>i===c.index?ch.text.slice(0,c.offset)+'ZZZZ'+ch.text.slice(c.offset+c.target.length):ch.text).join(' ');
  assert.ok(!matchesContextAnswer(wrong,c),c.id);
 }
});
test('each day requires all 300 contextual answers and retains first-pass scores through repairs',()=>{
 for(let day=0;day<5;day++){
  const ids=examIds(deck,day);let t=createTest('context',ids,()=>0.5);const missed=t.queue[0];
  for(let i=0;i<300;i++){const c=cards.get(t.queue[t.index]);t=advanceTest(checkAnswer(t,i===0?'wrong':c.context.target,c));}
  assert.equal(t.done,false);assert.equal(t.mode,'repair');assert.equal(t.firstCorrect,299);assert.ok(t.queue.includes(missed));
  while(t.mode==='repair'){const c=cards.get(t.queue[t.index]);t=advanceTest(checkAnswer(t,c.context.target,c));}
  assert.equal(t.done,false);assert.equal(t.queue.length,300);assert.equal(t.pass,2);
  for(let i=0;i<300;i++){const c=cards.get(t.queue[t.index]);t=advanceTest(checkAnswer(t,c.context.target,c));assert.equal(t.done,i===299);}
  assert.equal(t.firstCorrect,299);
 }
});
test('old 50-card pilot is archived without damaging current exams, drafts or prior archives',()=>{
 const old={type:'review',day:0,test:{...createTest('context',examIds(deck,0).slice(0,50)),contextVersion:2}};
 const review={type:'review',day:4,test:{...createTest('context',examIds(deck,4)),draft:'working answer'}};
 const day={type:'day',day:2,test:createTest('typed',examIds(deck,2))};
 const raw={previousContext:{older:{saved:true}},exams:{'review-0':old,'review-4':review,'day-2':day}};
 const restored=restoreExams(raw,deck);
 assert.deepEqual(restored.exams,{'review-4':review,'day-2':day});
 assert.deepEqual(restored.previousContext,{'older':{saved:true},'review-0:v2:50':old});
 assert.deepEqual(restoreExams(restored,deck),restored);
 assert.deepEqual(restoreExams({exams:{'review-1':{...review,day:1}}},deck).exams,{});
});
test('noun/adverb and adjective/noun cards use distinct contexts; inflection is required',()=>{
 const context=id=>cards.get('corpes:'+id).context;
 for(const [a,b] of [['poco:N','poco:R'],['más:Q','más:R'],['hasta:P','hasta:R'],['según:P','según:R'],['político:N','político:A'],['tal:D','tal:R']]){
  assert.notEqual(context(a).example.text,context(b).example.text);
 }
 assert.equal(context('primero:M').target.toLowerCase(),'primer');
 assert.equal(context('ninguno:Q').target.toLowerCase(),'ningún');
 assert.equal(context('nuestro:X').target.toLowerCase(),'nuestra');
 assert.equal(matchesContextAnswer('nuestro',context('nuestro:X')),false);
 assert.equal(context('músico:N').target,'música');
});
test('authored context bank rebuilds deterministically from reviewed forms and explicit glosses',()=>{
 const paths=['lemmas/data/context.json','data/spanish-lemmas/context/coverage.json'];
 const before=paths.map(p=>readFileSync(new URL('../'+p,import.meta.url),'utf8'));
 execFileSync(process.execPath,['scripts/build-lemma-context.mjs'],{cwd:new URL('../',import.meta.url)});
 paths.forEach((p,i)=>assert.equal(readFileSync(new URL('../'+p,import.meta.url),'utf8'),before[i]));
});
