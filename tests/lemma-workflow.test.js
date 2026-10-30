import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlow,transition,batchIds,completedCount,restoreFlows,finishTest} from '../lemmas/workflow.js';
import {createTest,checkAnswer,advanceTest,optionsFor,sampleDay,validTest,normalize} from '../lemmas/assessment.js';
const deck=Array.from({length:1500},(_,i)=>({id:'word'+i,lemma:'palabra'+i,meaning:'meaning '+i}));
const ids=deck.slice(0,50).map(c=>c.id),cards=new Map(deck.map(c=>[c.id,c]));
const move=(f,a)=>transition(f,a,ids);
const learn=f=>{for(let i=0;i<10;i++)f=move(f,'forward');return move(f,'start-test');};
const pass=t=>{while(!t.done){const c=cards.get(t.queue[t.index]);t=advanceTest(checkAnswer(t,t.kind==='choice'?c.meaning:c.lemma,c));}return t;};
test('ten learning cards precede a shuffled typed test; navigation cannot mark a test complete',()=>{
 let f=createFlow();assert.deepEqual(move(f,'know'),f);assert.deepEqual(move(f,'previous'),f);f=learn(f);
 assert.equal(f.phase,'choice');assert.deepEqual(new Set(f.test.queue),new Set(ids.slice(0,10)));assert.deepEqual(move(f,'forward'),f);
});
test('batch misses repeat, then all five batches lead to a separate 50-word recognition test',()=>{
 let f=learn(createFlow()),c=cards.get(f.test.queue[0]);
 f=finishTest(f,advanceTest(checkAnswer(f.test,'wrong',c)));
 for(let i=1;i<10;i++){c=cards.get(f.test.queue[f.test.index]);f=finishTest(f,advanceTest(checkAnswer(f.test,c.lemma,c)));}
 assert.equal(f.phase,'choice');assert.equal(f.test.round,2);assert.equal(f.test.queue.length,4);assert.equal(completedCount(f),0);
 f=finishTest(f,pass(f.test));assert.equal(f.phase,'complete');assert.equal(f.test.firstCorrect,9);assert.equal(completedCount(f),10);
 for(let i=1;i<5;i++){f=move(f,'forward');assert.equal(batchIds(ids,f)[0],ids[i*10]);f=learn(f);f=finishTest(f,pass(f.test));}
 assert.equal(f.phase,'set-ready');assert.equal(completedCount(f),50);
 f=move(f,'start-test');assert.equal(f.test.kind,'choice');assert.equal(f.test.ids.length,50);assert.equal(f.phase,'test');
 f=finishTest(f,pass(f.test));assert.equal(f.phase,'done');assert.equal(f.test.firstCorrect,50);
});
test('answer checking requires the target headword, preserves ñ and accents, and cannot double-score',()=>{
 const c={id:'x',lemma:'sí',meaning:'yes'},t=createTest('typed',['x']);
 assert.equal(checkAnswer(t,' SI ',c).feedback.correct,false);
 const checked=checkAnswer(t,' SÍ! ',c);assert.equal(checked.feedback.correct,true);assert.equal(checked.firstCorrect,1);
 assert.deepEqual(checkAnswer(checked,'sí',c),checked);assert.deepEqual(advanceTest(t),t);
 assert.notEqual(normalize('ano'),normalize('año'));assert.equal(normalize('si\u0301'),'sí');
});
test('choice distractors are distinct even when different cards have identical glosses',()=>{
 const c={meaning:'the'},group=[c,{meaning:'the'},{meaning:' THE '},{meaning:'of'},{meaning:'and'},{meaning:'in'}];
 const options=optionsFor(c,group,group,()=>0.5);assert.equal(options.length,4);assert.equal(new Set(options.map(normalize)).size,4);assert.equal(options.filter(v=>v==='the').length,1);
});
test('day samples have exactly five unique cards from each of the five sets and stay in their day',()=>{
 for(let day=0;day<6;day++){
  const sample=sampleDay(deck,day);assert.equal(new Set(sample).size,25);
  for(let set=0;set<5;set++)assert.equal(sample.filter(id=>deck.slice(day*250+set*50,day*250+set*50+50).some(c=>c.id===id)).length,5);
 }
});
test('restore preserves checked answers and rejects incomplete, wrong-kind, or cross-set tests',()=>{
 let f=learn(createFlow());const c=cards.get(f.test.queue[0]);f.test=checkAnswer(f.test,'wrong',c);
 assert.deepEqual(restoreFlows({0:f},deck),{0:f});
 assert.deepEqual(restoreFlows({0:{...f,test:createTest('choice',['word90'])}},deck),{});
 assert.deepEqual(restoreFlows({0:{...f,test:createTest('choice',ids.slice(0,10))}},deck),{});
 assert.deepEqual(restoreFlows({0:{...f,phase:'done'}},deck),{});
 assert.equal(validTest({...f.test,index:99},ids),false);
 assert.equal(validTest({...f.test,options:'invalid'},ids),false);
 assert.equal(validTest({...f.test,draft:42},ids),false);
 assert.equal(validTest({...f.test,queue:[f.test.queue[0],f.test.queue[0]]},ids),false);
 assert.equal(validTest(createTest('typed',sampleDay(deck,0)),deck.slice(0,250).map(c=>c.id)),true);
});
test('old self-rating progress never becomes a passed active test; learning location is retained',()=>{
 const old={phase:'recall',batch:2,index:9,recall:{done:false}};
 const restored=restoreFlows({0:old},deck)[0];assert.equal(restored.phase,'learn');assert.equal(restored.batch,2);assert.equal(restored.index,0);
 assert.equal(restoreFlows({0:{...old,phase:'learn',index:4}},deck)[0].index,4);
});

test('repair never passes a stage; a new full perfect pass is required and first score is frozen',()=>{
 let t=createTest('typed',ids.slice(0,10),()=>0.5);
 const original=[...t.queue];
 for(let i=0;i<10;i++)t=advanceTest(checkAnswer(t,i===9?'wrong':cards.get(t.queue[t.index]).lemma,cards.get(t.queue[t.index])));
 assert.equal(t.mode,'repair');assert.equal(t.done,false);assert.equal(t.firstCorrect,9);assert.notEqual(t.queue[0],original[9]);
 while(t.mode==='repair')t=advanceTest(checkAnswer(t,cards.get(t.queue[t.index]).lemma,cards.get(t.queue[t.index])));
 assert.equal(t.mode,'full');assert.equal(t.pass,2);assert.equal(t.done,false);assert.equal(t.queue.length,10);
 // A new full-pass error is repaired too, never discarded or treated as a pass.
 t=advanceTest(checkAnswer(t,'wrong',cards.get(t.queue[t.index])));
 assert.equal(t.index,1);assert.equal(t.mode,'full');
 t=pass(t);assert.equal(t.done,true);assert.equal(t.pass,3);assert.equal(t.firstCorrect,9);
});
test('all 250 day words must be answered in the final perfect pass',()=>{
 let t=createTest('typed',deck.slice(0,250).map(c=>c.id));
 for(let i=0;i<249;i++)t=advanceTest(checkAnswer(t,cards.get(t.queue[t.index]).lemma,cards.get(t.queue[t.index])));
 assert.equal(t.done,false);assert.equal(t.queue.length,250);t=pass(t);assert.equal(t.done,true);assert.equal(t.firstCorrect,250);
});
test('old test rules cannot restore as a newly passed stage',()=>{
 const old=pass(createTest('typed',ids.slice(0,10)));delete old.rules;
 assert.equal(validTest(old,ids),false);
});
