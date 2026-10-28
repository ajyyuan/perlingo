import {validExampleSeed,newExampleSeed} from './example-seed.js';
import {restore} from './session.js';
import {restoreFlows,completedCount,createFlow} from './workflow.js';
import {restoreExams} from './exam-state.js';
export function restoreProgress(raw,deck){
 const data=restore(raw,deck);data.exampleSeed=validExampleSeed(raw?.exampleSeed)?raw.exampleSeed:0;data.answerSound=raw?.answerSound!==false;data.previousAssessment=raw?.previousAssessment||(Object.values(raw?.flows||{}).some(f=>f.version!==4)?{flows:raw.flows,exams:raw.exams||{}}:null);data.flows=restoreFlows(raw?.flows,deck);data.practiced={};
 for(let s=0;s<30;s++){const n=raw?.practiced?.[s];data.practiced[s]=Math.max(Number.isInteger(n)&&n>=0&&n<=50&&n%10===0?n:0,completedCount(data.flows[s]));}
 Object.assign(data,restoreExams(raw,deck));
 data.activeExam=data.exams[raw?.activeExam]?raw.activeExam:null;
 if(!data.flows[data.set])data.flows[data.set]=createFlow();
 return data;
}
export function validProgress(p,deck){
 if(!p||p.version!==2||!p.flows||!p.exams||!p.practiced||!Number.isInteger(p.set)||p.set<0||p.set>=30||!Number.isInteger(p.day)||p.day<0||p.day>=5)return false;
 try{const restored=restoreProgress(p,deck);return stable(restored)===stable(p.exampleSeed===undefined?{...p,exampleSeed:0}:p);}catch{return false;}
}

function stable(value){return JSON.stringify(value,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))):v);}

export function createCourseProgress(deck){return restoreProgress({version:2,exampleSeed:newExampleSeed()},deck);}
