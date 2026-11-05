import {beforeLaterContextCorrections} from './helpers/context-integrity.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {combineNotes} from '../lemmas/notes-library.js';
import {recallTeachingMarkup,esc} from '../lemmas/note-view.js';
import {dayOneRecall} from '../lemmas/recall-policy-data.js';
import {typedPrompt,typedAnswers,typedFeedbackAnswer,typedAnswerNote} from '../lemmas/recall-policy.js';
import {recallCue} from '../lemmas/recall-prompt.js';
import {createTest,checkAnswer,advanceTest,normalize} from '../lemmas/assessment.js';
import {restoreProgress,validProgress} from '../lemmas/progress.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const source=read('lemmas/data/deck.json'),bank=read('lemmas/data/context.json');
const library=combineNotes(read('lemmas/data/notes.json'),bank),notes=new Map(library.notes.map(n=>[n.id,n]));
const deck=source.map(c=>({...c,meaning:notes.get(c.id).meaning,context:library.contexts.get(c.id)}));
const byId=new Map(deck.map(c=>[c.id,c]));
const c=key=>byId.get('corpes:'+key);
const correct=(key,answer,kind='typed')=>checkAnswer(createTest(kind,[c(key).id]),answer,c(key)).feedback.correct;

test('all 250 reviewed prompts and teaching uses are aligned',()=>{
 const audit=read('data/spanish-lemmas/day1-prompt-draft.json');
 assert.deepEqual(audit.entries.map(r=>r.id),deck.slice(0,250).map(c=>c.id));
 for(const row of audit.entries){const card=byId.get(row.id),p=row.proposed;
  assert.equal(p.definition,typedPrompt(card));
  assert.deepEqual([row.lemma,...p.additionalAnswers],typedAnswers(card));
  assert.equal(notes.get(row.id).recallTeaching.sense,p.definition);
  assert.equal(row.teachingAlignmentReview.status,'checked-and-aligned-locally');
  for(const answer of typedAnswers(card))assert.equal(correct(row.id.slice(7),answer),true,`${row.id}: ${answer}`);
 }
 assert.equal(Object.keys(dayOneRecall).length,250);
});

test('exact contexts accept valid alternatives and reject distinct constructions',()=>{
 for(const [key,answers]of [['empezar:V',['comenzar']],['lograr:V',['conseguir']],['entender:V',['comprender']],['aún:R',['todavía']],['solo:R',['solamente','únicamente']],['último:A',['final']],['casa:N',['hogar']],['llamar:V',['telefonear']],['nunca:R',['jamás']],['empresa:N',['compañía']],['mostrar:V',['enseñar']],['recordar:V',['acordarse']],['como:C',['porque']]])for(const answer of answers)assert.equal(correct(key,answer),true,`${key}: ${answer}`);
 for(const [key,answer]of [['como:C','pues'],['empezar:V','iniciar'],['lograr:V','obtener'],['tras:P','después'],['tras:P','después de'],['creer:V','pensar'],['ser:V','estar'],['por:P','para'],['saber:V','conocer'],['recordar:V','acordar'],['desde:P','de'],['un:T','uno'],['y:C','e'],['o:C','u'],['aún:R','aun']])assert.equal(correct(key,answer),false,`${key}: ${answer}`);
 assert.equal(correct('empezar:V','  COMENZAR! '),true);
 assert.equal(correct('empezar:V','comienzo'),false);
 assert.equal(typedFeedbackAnswer(c('empezar:V'),'COMENZAR!',normalize),'comenzar');
});

test('meaning supplements teach new senses without mutating frozen content banks',()=>{
 for(const [key,sense]of [['vivir:V','reside'],['presentar:V','introduce'],['creer:V','believe in'],['punto:N','dot'],['lograr:V','manage to']])assert.ok(notes.get(c(key).id).meaning.includes(sense),key);
 assert.match(notes.get(c('saber:V').id).recallTeaching.usage,/saber nadar/);
 assert.match(recallCue(c('cuando:R'),'typed'),/Llámame/);
 assert.match(typedAnswerNote(c('empezar:V')),/Accepted here: empezar \/ comenzar/);
 const old=read('data/spanish-lemmas/day1-recall-audit.json');
 for(const path of ['lemmas/data/deck.json','lemmas/data/notes.json','lemmas/data/context.json'])assert.equal(path==='lemmas/data/context.json'?beforeLaterContextCorrections().sha256:createHash('sha256').update(readFileSync(new URL('../'+path,import.meta.url))).digest('hex'),old.sourceHashes[path]);
});

test('typed alternatives do not leak into sentence blanks, recognition or unrelated later-day headwords',()=>{
 assert.equal(correct('empezar:V','comenzar','context'),false);
 assert.equal(correct('empezar:V','comenzar','choice'),false);
 const unrelated=deck.find(c=>c.lemma==='kilómetro');assert.equal(typedPrompt(unrelated),unrelated.meaning);assert.deepEqual(typedAnswers(unrelated),[unrelated.lemma]);
 for(const card of deck.slice(0,250))assert.equal(checkAnswer(createTest('choice',[card.id]),card.meaning,card).feedback.correct,true);
});

test('unfinished day test restores unchanged and completes using reviewed alternatives without a restart',()=>{
 const p=restoreProgress(null,deck),ids=deck.slice(0,250).map(c=>c.id);let t=createTest('typed',ids,()=>.5);
 t=advanceTest(checkAnswer(t,'wrong',byId.get(t.queue[0])));
 t.draft='saved answer';p.exams['day-0']={type:'day',day:0,test:t};p.activeExam='day-0';
 const resumed=restoreProgress(JSON.parse(JSON.stringify(p)),deck);
 assert.deepEqual(resumed,p);assert.ok(validProgress(resumed,deck));t=resumed.exams['day-0'].test;
 while(!t.done){const card=byId.get(t.queue[t.index]);t=advanceTest(checkAnswer(t,typedAnswers(card).at(-1),card));}
 assert.equal(t.firstCorrect,249);assert.equal(t.pass,2);assert.equal(t.done,true);
});

test('every reviewed contrast is taught on its member cards, including distinct-answer pairs',()=>{
 const contrasts=read('data/spanish-lemmas/day1-teaching-contrasts.json');
 assert.equal(contrasts.groups.length,60);
 for(const group of contrasts.groups){
  assert.ok(group.sources.length);
  for(const id of group.members){
   const note=notes.get(id);
   assert.ok(note.recallTeaching.comparisons.some(c=>c.id===group.id&&c.text===group.text),`${id}: ${group.id}`);
   assert.ok(recallTeachingMarkup(note).includes(`<p>${esc(group.text)}</p>`),`${id}: rendered ${group.id}`);
  }
 }
 for(const [key,group,phrase]of [['ser:V','being','not simply permanent'],['saber:V','knowledge','Conocer'],['por:P','for','Para'],['dejar:V','leave','salir'],['tras:P','sequence','Después']]){
  const t=notes.get(c(key).id).recallTeaching;
  assert.ok(t.comparisons.find(g=>g.id===group).text.includes(phrase));
 }
});
