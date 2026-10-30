import {SETS_PER_DAY,WORDS_PER_DAY} from './schedule.js';
import {matchesContextAnswer} from './context-answer.js';
// Tests use the reviewed deck; no generated translations or fuzzy semantic grading.
export const normalize=s=>String(s).normalize('NFC').replace(/[’‘]/gu,"'").toLocaleLowerCase('es').trim().replace(/[.!?¿¡]+$/u,'').trim().replace(/\s+/gu,' ');
export const shuffle=(items,random=Math.random)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export function createTest(kind,ids,random=Math.random){return {rules:2,contextVersion:kind==='context'?3:null,mode:'full',pass:1,failures:{},kind,ids:[...ids],queue:shuffle(ids,random),index:0,misses:[],round:1,firstCorrect:0,feedback:null,done:false};}
export function checkAnswer(test,response,card){
 if(test.done||test.feedback)return test;
 const answers=test.kind==='context'?card.context.answers:[test.kind==='choice'?card.meaning:card.lemma];
 const correct=test.kind==='context'?matchesContextAnswer(response,card.context):answers.some(a=>normalize(response)===normalize(a));
 return {...test,failures:{...test.failures,...(!correct?{[card.id]:(test.failures[card.id]||0)+1}:{})},feedback:{correct,response:String(response),formError:test.kind==='context'&&!correct&&normalize(response)===normalize(card.lemma)},firstCorrect:test.firstCorrect+(test.round===1&&correct?1:0)};
}
export function advanceTest(test){
 if(test.done||!test.feedback)return test;
 const t=structuredClone(test);if(!t.feedback.correct)t.misses.push(t.queue[t.index]);
 t.feedback=null;delete t.options;delete t.draft;t.index++;
 if(t.index===t.queue.length){
  if(t.misses.length){
   const last=t.queue[t.queue.length-1],fillers=shuffle(t.ids.filter(id=>!t.misses.includes(id))).slice(0,Math.max(0,4-t.misses.length));
   t.queue=shuffle([...t.misses,...fillers]);
   // Avoid an immediate echo of the answer just displayed, including a lone miss.
   if(t.queue[0]===last&&t.queue.length>1)t.queue.push(t.queue.shift());
   t.mode='repair';t.misses=[];t.index=0;t.round++;
  }else if(t.mode==='repair'){
   t.mode='full';t.pass++;t.queue=shuffle(t.ids);t.index=0;t.round++;
  }else t.done=true;
 }
 return t;
}
export function optionsFor(card,group,all,random=Math.random){
 const correct=card.meaning,options=[correct],seen=new Set([normalize(correct)]);
 for(const c of [...shuffle(group,random),...shuffle(all,random)]){if(!seen.has(normalize(c.meaning))){seen.add(normalize(c.meaning));options.push(c.meaning);}if(options.length===4)break;}
 return shuffle(options,random);
}
export function sampleDay(deck,day,random=Math.random){
 return Array.from({length:SETS_PER_DAY},(_,s)=>shuffle(deck.slice(day*WORDS_PER_DAY+s*50,day*WORDS_PER_DAY+s*50+50),random).slice(0,5).map(c=>c.id)).flat();
}
export function validTest(t,allowed){
 if(!t||(t.kind==='context'&&t.contextVersion!==3)||t.rules!==2||!['full','repair'].includes(t.mode)||!Number.isInteger(t.pass)||t.pass<1||!t.failures||typeof t.failures!=='object'||!Object.entries(t.failures).every(([id,n])=>allowed.includes(id)&&Number.isInteger(n)&&n>=0)||!['choice','typed','context'].includes(t.kind)||!Array.isArray(t.ids)||!t.ids.length||new Set(t.ids).size!==t.ids.length||!t.ids.every(id=>allowed.includes(id)))return false;
 if(!Array.isArray(t.queue)||!t.queue.length||new Set(t.queue).size!==t.queue.length||!t.queue.every(id=>t.ids.includes(id)))return false;
 if(!Number.isInteger(t.index)||t.index<0||t.index>(t.done?t.queue.length:t.queue.length-1)||typeof t.done!=='boolean'||(t.done&&t.index!==t.queue.length)||!Number.isInteger(t.round)||t.round<1)return false;
 if(t.mode==='full'&&(t.queue.length!==t.ids.length||!t.ids.every(id=>t.queue.includes(id))))return false;
 if(t.done&&(t.mode!=='full'||!Array.isArray(t.misses)||t.misses.length||t.feedback!==null))return false;
 if(!Array.isArray(t.misses)||new Set(t.misses).size!==t.misses.length||!t.misses.every(id=>t.queue.slice(0,t.index).includes(id)))return false;
 if(t.options!==undefined&&(!Array.isArray(t.options)||t.options.length<2||t.options.length>4||t.options.some(v=>typeof v!=='string')||new Set(t.options.map(normalize)).size!==t.options.length))return false;
 if(t.draft!==undefined&&typeof t.draft!=='string')return false;
 if(!Number.isInteger(t.firstCorrect)||t.firstCorrect<0||t.firstCorrect>t.ids.length)return false;
 return t.feedback===null||(!t.done&&typeof t.feedback?.correct==='boolean'&&typeof t.feedback?.response==='string');
}
