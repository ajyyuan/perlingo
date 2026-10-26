import {createTest,validTest} from './assessment.js';
export const BATCH=10;
export const createFlow=()=>({version:4,phase:'learn',batch:0,index:0,test:null});
export const batchIds=(ids,f)=>ids.slice(f.batch*BATCH,(f.batch+1)*BATCH);
export const completedCount=f=>!f?0:['set-ready','test','done'].includes(f.phase)?50:f.batch*10+(f.phase==='complete'?10:0);
export function transition(flow,action,ids){
 const f=structuredClone(flow);
 if(f.phase==='learn'){
  if(action==='previous')f.index=Math.max(0,f.index-1);
  if(action==='forward'){if(f.index<9)f.index++;else f.phase='ready';}
 }else if(f.phase==='ready'){
  if(action==='previous'){f.phase='learn';f.index=0;}
  if(action==='start-test'){f.phase='choice';f.test=createTest('typed',batchIds(ids,f));}
 }else if(f.phase==='complete'&&action==='forward'){
  f.batch++;f.index=0;f.phase='learn';f.test=null;
 }else if(f.phase==='set-ready'&&action==='start-test'){
  f.phase='test';f.test=createTest('choice',ids);
 }
 return f;
}
export function finishTest(flow,test){
 const f={...flow,test};if(!test.done)return f;
 if(f.phase==='choice')f.phase=f.batch===4?'set-ready':'complete';
 else if(f.phase==='test')f.phase='done';
 return f;
}
export function restoreFlows(raw,deck){
 const flows={};for(const [key,original] of Object.entries(raw||{})){
  const set=Number(key),ids=deck.slice(set*50,(set+1)*50).map(c=>c.id);
  if(!Number.isInteger(set)||set<0||set>=30||ids.length!==50||!original)continue;
  let f=original;
  // Preserve the learning location; a previous self-rating session is not a passed test.
  if(f.version!==4){if(!Number.isInteger(f.batch)||f.batch<0||f.batch>4)continue;f={...createFlow(),batch:f.batch,index:f.phase==='learn'?f.index:0};}
  if(!['learn','ready','choice','complete','set-ready','test','done'].includes(f.phase)||!Number.isInteger(f.batch)||f.batch<0||f.batch>4||!Number.isInteger(f.index)||f.index<0||f.index>9)continue;
  if(['set-ready','test','done'].includes(f.phase)&&f.batch!==4)continue;
  if(f.phase==='complete'&&f.batch===4)continue;
  if(['choice','complete','set-ready','test','done'].includes(f.phase)){
   const typed=['test','done'].includes(f.phase),expected=typed?ids:batchIds(ids,f);
   if(!validTest(f.test,expected)||f.test.ids.length!==expected.length||f.test.kind!==(typed?'choice':'typed')||f.test.done!==['complete','set-ready','done'].includes(f.phase))continue;
  }
  flows[set]=structuredClone(f);
 }return flows;
}
