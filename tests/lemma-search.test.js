import test from 'node:test';
import assert from 'node:assert/strict';
import {searchCards} from '../lemmas/search.js';
const card=(lemma,meaning='')=>({lemma,meaning});
test('Spanish exact, accent-folded exact, prefix and substring precede English matches',()=>{
 const deck=[card('x','que'),card('parque'),card('querer'),card('qué'),card('que')];
 assert.deepEqual(searchCards(deck,' QUE ').map(c=>c.lemma),['que','qué','querer','parque','x']);
 assert.deepEqual(searchCards(deck,'qué').slice(0,2).map(c=>c.lemma),['qué','que']);
});
test('search folds accents both ways, preserves tie order and handles empty/no results',()=>{
 const deck=[card('sí','yes'),card('si','if'),card('si','whether'),card('año','year')];
 assert.deepEqual(searchCards(deck,'si'),[deck[1],deck[2],deck[0]]);
 assert.deepEqual(searchCards(deck,'ano'),[deck[3]]);
 assert.deepEqual(searchCards(deck,'   '),deck);
 assert.deepEqual(searchCards(deck,'xyz'),[]);
});

test('search locks unanswered questions and unlocks feedback across test kinds and repairs',async()=>{
 const {searchAllowed}=await import('../lemmas/search.js');
 const {createTest,checkAnswer,advanceTest}=await import('../lemmas/assessment.js');
 const c={id:'one',lemma:'uno',meaning:'one',context:{answers:['uno'],index:0,offset:0,example:{chunks:[{text:'uno'}]}}};
 for(const kind of ['typed','choice','context']){
  for(const response of [kind==='choice'?'one':'uno','wrong','']){
   const t=createTest(kind,['one']);
   assert.equal(searchAllowed('study',t),false);
   assert.equal(searchAllowed('study',{...t,draft:'unfinished'}),false);
   const answered=checkAnswer(t,response,c);
   assert.equal(searchAllowed('study',answered),true);
   const next=advanceTest(answered);
   assert.equal(searchAllowed('study',next),next.done);
   assert.equal(searchAllowed('home',t),true);
  }
 }
 assert.equal(searchAllowed('study',null),true);
});
