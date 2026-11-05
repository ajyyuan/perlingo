import test from 'node:test';
import assert from 'node:assert/strict';
import {createTest,validTest,checkAnswer} from '../lemmas/assessment.js';
import {restartExamTest,firstPassScore,restoreExams} from '../lemmas/exam-state.js';
const ids=Array.from({length:250},(_,i)=>String(i));
for(const kind of ['typed','context'])test(`${kind}: restart cutoff counts checked answers but not drafts or spelling retries`,()=>{
 const initial=createTest(kind,ids,()=>.5);
 const early={...initial,index:83,firstCorrect:60,draft:'draft',retry:'spelling'};
 assert.equal(restartExamTest(early).pass,1);assert.equal(restartExamTest(early).firstCorrect,0);
 const checked={...early,feedback:{correct:false,response:''}};delete checked.retry;
 const next=restartExamTest(checked);
 assert.equal(next.pass,2);assert.equal(next.round,2);assert.equal(next.firstCorrect,60);assert.equal(next.firstAttempted,84);
 assert.equal(next.index,0);assert.equal(next.feedback,null);assert.equal(next.draft,undefined);assert.equal(next.retry,undefined);
 assert.deepEqual(new Set(next.queue),new Set(ids));assert.ok(validTest(next,ids));
 assert.equal(firstPassScore(next),'60/84 first try (partial pass)');
 assert.equal(early.index,83);
 const exact=restartExamTest({...initial,index:84,firstCorrect:70});assert.equal(exact.pass,2);
});
test('later passes retain history, advance after meaningful progress and never become pass one',()=>{
 const original={...createTest('typed',ids),pass:3,round:5,index:2,firstCorrect:170,failures:{'0':2}};
 const early=restartExamTest(original);assert.equal(early.pass,3);assert.equal(early.firstCorrect,170);assert.deepEqual(early.failures,{'0':2});
 assert.equal(restartExamTest({...original,index:84}).pass,4);
 assert.equal(restartExamTest({...original,mode:'repair',queue:['0','1'],index:0}).pass,4);
 assert.equal(restartExamTest({...original,done:true,index:250}).pass,4);
 assert.equal(firstPassScore(early),'170/250 first try');
 const c={id:early.queue[0],lemma:'sí'};
 assert.equal(checkAnswer(early,'sí',c).firstCorrect,170);
});
test('preserved partial first-pass score survives restoring a day exam',()=>{
 const restarted=restartExamTest({...createTest('typed',ids),index:84,firstCorrect:60});
 const deck=ids.map(id=>({id}));const restored=restoreExams({exams:{'day-0':{type:'day',day:0,test:restarted}}},deck);
 assert.deepEqual(restored.exams['day-0'].test,restarted);
 assert.equal(validTest({...restarted,firstAttempted:59},ids),false);
});
