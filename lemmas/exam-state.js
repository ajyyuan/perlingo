import {DAY_COUNT,WORDS_PER_DAY} from './schedule.js';
import {createTest,validTest} from './assessment.js';
// Day membership is always defined by the unchanged course order, never saved IDs.
export function examIds(deck,day){return deck.slice(day*WORDS_PER_DAY,(day+1)*WORDS_PER_DAY).map(c=>c.id);}
export function restoreExams(raw,deck){
 const exams={},previousContext={...(raw?.previousContext||{})};
 for(const [key,ex] of Object.entries(raw?.exams||{})){
  if(!ex||!['day','review'].includes(ex.type)||!Number.isInteger(ex.day)||ex.day<0||ex.day>=DAY_COUNT||key!==`${ex.type}-${ex.day}`)continue;
  const context=ex.type==='review',allowed=examIds(deck,ex.day);
  if(context&&(ex.test?.contextVersion!==3||ex.test?.ids?.length!==WORDS_PER_DAY)){
   const archiveKey=`${key}:v${ex.test?.contextVersion??'legacy'}:${ex.test?.ids?.length??0}`;
   if(!Object.hasOwn(previousContext,archiveKey))previousContext[archiveKey]=ex;
   continue;
  }
  if(ex.test?.kind===(context?'context':'typed')&&ex.test.ids?.length===allowed.length&&validTest(ex.test,allowed))exams[key]=ex;
 }
 return {exams,previousContext};
}

// A checked/revealed answer counts immediately, before Continue is pressed.
export function restartExamTest(test,random=Math.random){
 const attempted=Math.min(test.queue.length,test.index+(test.feedback?1:0));
 const substantial=attempted*3>=test.queue.length;
 const fresh=createTest(test.kind,test.ids,random);
 if(test.pass===1&&test.round===1&&!substantial&&!test.done)return fresh;
 return {...fresh,pass:test.pass+((substantial||test.mode==='repair'||test.done)?1:0),round:test.round+1,
  failures:{...test.failures},firstCorrect:test.firstCorrect,
  firstAttempted:test.firstAttempted??(test.round===1?attempted:test.ids.length)};
}
export function firstPassScore(test){
 const attempted=test.firstAttempted??test.ids.length;
 return `${test.firstCorrect}/${attempted} first try${attempted<test.ids.length?' (partial pass)':''}`;
}
