import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {combineNotes} from '../lemmas/notes-library.js';
import {createTest,advanceTest} from '../lemmas/assessment.js';
import {submitAnswer,createRetryForms} from '../lemmas/answer-attempt.js';
import {contextFeedbackAnswer} from '../lemmas/recall-prompt.js';
import {typedAnswers,typedPrompt} from '../lemmas/recall-policy.js';
import {recallCue} from '../lemmas/recall-prompt.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const bank=read('lemmas/data/context.json'),edits=read('data/spanish-lemmas/context/answer-alternatives.json').entries;
const lib=combineNotes(read('lemmas/data/notes.json'),bank,read('lemmas/data/day1-usage.json'));
const notes=new Map(lib.notes.map(n=>[n.id,n]));
const deck=read('lemmas/data/deck.json').map(c=>({...c,meaning:notes.get(c.id).meaning,context:lib.contexts.get(c.id)}));
const forms=createRetryForms(lib.notes,bank.contexts);
const card=rank=>deck[rank-1];
const grade=(c,response,kind='context')=>submitAnswer(createTest(kind,[c.id]),response,c,forms(c.id,kind==='context'?c.context.answers:typedAnswers(c)));
const sentence=(c,a)=>c.context.example.chunks.map((ch,i)=>i===c.context.index?ch.text.slice(0,c.context.offset)+a+ch.text.slice(c.context.offset+c.context.target.length):ch.text).join(' ')+'.';
test('every reviewed sentence alternative earns immediate credit alone and in its full sentence',()=>{
 for(const c of deck)for(const a of edits[c.id]?.alternatives||[]){
  assert.equal(c.context.example.text,edits[c.id].sentence);
  for(const response of [a,sentence(c,a)]){
   const result=grade(c,response);
   assert.equal(result.feedback?.correct,true,c.id+': '+response);
   assert.equal(result.retry,undefined);assert.equal(result.firstCorrect,1);
   assert.deepEqual(result.failures,{});
   assert.equal(contextFeedbackAnswer(c.context,response),a);
   assert.equal(advanceTest(result).done,true);
  }
  assert.notEqual(grade(c,'palabrainventada '+sentence(c,a)).feedback?.correct,true);
 }
});
test('valid variants are credited, while missing accents that change words remain unaccepted',()=>{
 for(const [rank,a] of [[523,'periodo'],[721,'quizás'],[1100,'quizá'],[734,'futbol'],[1036,'setiembre'],[1147,'vídeo'],[1227,'consciencia']])assert.equal(grade(card(rank),a).feedback?.correct,true);
 assert.notEqual(grade(deck.find(c=>c.lemma==='aún'),'aun').feedback?.correct,true);
});
test('sentence sense, inflection, gender and surrounding words still constrain answers',()=>{
 for(const [rank,wrong] of [[166,'clase'],[352,'centuria'],[362,'motivo'],[375,'ruta'],[430,'forma'],[569,'decenio'],[772,'noción'],[669,'acceso'],[20,'poseo'],[62,'adeudo'],[177,'encuentro'],[405,'centenar'],[505,'relata'],[571,'sujetar'],[740,'cirugía'],[754,'utilización'],[1082,'mostrar'],[1288,'mencionar'],[1342,'Reparar'],[104,'regresar'],[860,'subida'],[1294,'historia'],[897,'cuarto']])assert.notEqual(grade(card(rank),wrong).feedback?.correct,true,rank+': '+wrong);
 assert.equal(grade(card(266),'usar').feedback.correct,true);
 assert.equal(grade(card(266),'Para terminar, tenías que usar este número.').feedback.correct,false);
});
test('identical typed prompts now share the reported missing alternatives',()=>{
 for(const [ranks,answers] of [[[730,954],['esencial']],[[897,956],['pieza']],[[860,1412],['subida','alza']]])for(const rank of ranks)for(const a of answers)assert.equal(grade(card(rank),a,'typed').feedback?.correct,true);
});
test('pronominal alternatives must match the subject of the unchanged sentence',()=>{
 for(const [rank,accepted,rejected] of [
  [1278,'escaparte',['escaparse','escaparme','escaparnos']],
  [877,'quedarme',['quedarte','quedarse','quedarnos']],
  [909,'reírse',['reírme','reírte','reírnos']],
  [295,'morirse',['morirme','morirte','morirnos']]
 ]){
  const c=card(rank);
  for(const response of [accepted,sentence(c,accepted)])assert.equal(grade(c,response).feedback?.correct,true);
  for(const wrong of rejected)for(const response of [wrong,sentence(c,wrong)]){
   const result=grade(c,response);
   assert.notEqual(result.feedback?.correct,true,rank+': '+response);
   assert.equal(result.firstCorrect,0);
  }
 }
 // Dictionary-form recall has a different grammatical contract from a tú command.
 assert.equal(grade(card(1278),'escaparse','typed').feedback?.correct,true);
});
test('confirmed semantic omissions earn credit without a spelling retry',()=>{
 for(const [rank,answer] of [[719,'verdad'],[340,'impacto'],[841,'recopilar']]){
  const c=card(rank);
  for(const response of [answer,sentence(c,answer)]){
   const result=grade(c,response);
   assert.equal(result.feedback?.correct,true,rank+': '+response);
   assert.equal(result.retry,undefined);
   assert.equal(result.firstCorrect,1);
  }
 }
 for(const [rank,wrong] of [[719,'verdades'],[340,'impactos'],[841,'recopila'],[1006,'atmósfera']])
  assert.notEqual(grade(card(rank),wrong).feedback?.correct,true,rank+': '+wrong);
});
test('every cross-audit finding has an implemented and sentence-bound disposition',()=>{
 const audit=read('data/spanish-lemmas/context/answer-review-2026-11-06.json');
 assert.equal(audit.candidates.length,60);
 assert.equal(audit.related.length,12);
 assert.equal(audit.originalFlags.length,40);
 assert.equal(audit.candidates.filter(c=>c.decision==='exclude').length,1);
 for(const decision of [...audit.candidates,...audit.related]){
  const c=card(decision.rank);
  assert.equal(c.id,decision.id);
  assert.equal(c.context.example.text,decision.sentence);
  assert.equal(c.context.example.translation,decision.translation);
  assert.equal(c.context.target,decision.target);
  assert.equal(sentence(c,decision.answer),decision.substitutedSentence);
  assert.ok(decision.reason&&decision.evidence.length);
  assert.ok(['accept','exclude'].includes(decision.decision));
  for(const response of [decision.answer,decision.substitutedSentence]){
   const result=grade(c,response);
   if(decision.decision==='accept'){
    assert.equal(result.feedback?.correct,true,c.id+': '+response);
    assert.equal(result.retry,undefined);
    assert.equal(result.firstCorrect,1);
   }else{
    assert.notEqual(result.feedback?.correct,true,c.id+': '+response);
    assert.equal(result.firstCorrect,0);
   }
  }
 }
 for(const d of audit.originalFlags){
  assert.ok(['retain','replace'].includes(d.decision));
  assert.equal(Boolean(grade(card(d.rank),d.answer).feedback?.correct),d.decision==='retain',d.rank+': '+d.answer);
 }
});
test('all identical typed prompts and cues expose the same accepted answers',()=>{
 const groups=new Map();
 for(const c of deck){
  const key=JSON.stringify([typedPrompt(c),recallCue(c,'typed')]);
  const answers=typedAnswers(c).map(a=>a.toLocaleLowerCase('es')).sort();
  if(groups.has(key))assert.deepEqual(answers,groups.get(key),c.id+': '+key);
  else groups.set(key,answers);
 }
});
