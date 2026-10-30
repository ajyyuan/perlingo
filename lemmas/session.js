import {DAY_COUNT} from './schedule.js';
export const SIZE=50, TOTAL=1500, KEY='perlingo-lemmas-corpes-v2';
export const idsForSet=(deck,set)=>deck.slice(set*SIZE,(set+1)*SIZE).map(c=>c.id);
export function createSession(ids){return {queue:[...ids],index:0,misses:[],round:1,revealed:false,done:false};}
export function answer(session,known){
 if(!session.revealed||session.done)return session;
 const s={...session,queue:[...session.queue],misses:[...session.misses],revealed:false};
 if(!known)s.misses.push(s.queue[s.index]);
 s.index++;
 if(s.index===s.queue.length){
  if(s.misses.length){s.queue=s.misses;s.misses=[];s.index=0;s.round++;}
  else{s.done=true;}
 }
 return s;
}
export function restore(raw,deck){
 const clean={version:2,known:{},sessions:{},set:0,day:0};
 if(!raw||raw.version!==2)return clean;
 const ids=new Set(deck.map(c=>c.id));
 for(const [id,v] of Object.entries(raw.known||{}))if(ids.has(id)&&typeof v==='boolean')clean.known[id]=v;
 if(Number.isInteger(raw.set)&&raw.set>=0&&raw.set<30)clean.set=raw.set;
 if(Number.isInteger(raw.day)&&raw.day>=0&&raw.day<DAY_COUNT)clean.day=raw.day;
 for(const [key,s] of Object.entries(raw.sessions||{})){
  const set=Number(key);if(!Number.isInteger(set)||set<0||set>=30||!s)continue;
  const allowed=new Set(idsForSet(deck,set));
  if(!Array.isArray(s.queue)||!s.queue.length||s.queue.length>SIZE||new Set(s.queue).size!==s.queue.length||!s.queue.every(id=>allowed.has(id)))continue;
  if(!Number.isInteger(s.index)||s.index<0||s.index>s.queue.length||!Number.isInteger(s.round)||s.round<1)continue;
  if(typeof s.done!=='boolean'||typeof s.revealed!=='boolean'||(s.done?s.index!==s.queue.length:s.index>=s.queue.length))continue;
  if(!Array.isArray(s.misses)||new Set(s.misses).size!==s.misses.length||!s.misses.every(id=>s.queue.slice(0,s.index).includes(id)))continue;
  clean.sessions[set]={queue:s.queue,index:s.index,round:s.round,misses:s.misses,done:s.done,revealed:s.revealed};
 }
 return clean;
}
