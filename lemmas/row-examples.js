import {exampleDraw,validExampleSeed} from './example-seed.js';
import {rowExamples} from './row-examples-data.js';
import {pilotEvidence} from './frequency-pilot-data.js';
const selections=new Map();
const activeSeedKey='perlingo-lemmas-active-example-seed';
let courseSeed=0;
try{const saved=JSON.parse(globalThis.localStorage?.getItem(activeSeedKey)||'null');if(validExampleSeed(saved))courseSeed=saved;}catch{}
export function setCourseExampleSeed(seed){
 const next=validExampleSeed(seed)?seed:0;
 if(next!==courseSeed){courseSeed=next;selections.clear();}
 // A convenience mirror for standalone notes; the course payload is authoritative.
 try{globalThis.localStorage?.setItem(activeSeedKey,JSON.stringify(next));}catch{}
}
globalThis.addEventListener?.('storage',event=>{
 if(event.key!==activeSeedKey)return;
 try{const seed=JSON.parse(event.newValue);if(validExampleSeed(seed)&&seed!==courseSeed){courseSeed=seed;selections.clear();}}catch{}
});
const toCommand={1:0,2:1,4:2,5:3};
const fromCommand=[1,2,4,5];
export const isCommand=tense=>['commands','negative'].includes(tense);
export function rowExample(id,tense,slot,alternative=0){return rowExamples[id]?.[tense]?.[slot]?.[alternative]||null;}
export function rankedStartingRows(id){
 const evidence=pilotEvidence.entries[id];
 return Object.entries(rowExamples[id]?.present||{}).flatMap(([slot,examples])=>{
  const example=examples[0];if(!example?.text)return [];
  const count=evidence?.presentCandidates.find(c=>c.form===example.target);
  if(!count||count.count===null||count.excludedFromAutomaticRanking)return [];
  return [{slot:Number(slot),count:count.count,channels:count.channels??0}];
 }).sort((a,b)=>b.count-a.count||b.channels-a.channels||a.slot-b.slot).slice(0,3);
}
export function sampleStartingRow(id,random=Math.random){
 const candidates=rankedStartingRows(id);
 if(!candidates.length){
  const slot=Object.entries(rowExamples[id]?.present||{}).find(([,es])=>es[0]?.text)?.[0];
  const person=Number(slot??2);return {person,command:toCommand[person]??0,tense:'present'};
 }
 // Renormalize the available ranks when a verb only has one or two usable forms.
 const weights=[60,30,10].slice(0,candidates.length),total=weights.reduce((a,b)=>a+b,0);
 let draw=random()*total,index=0;
 while(index<weights.length-1&&draw>=weights[index])draw-=weights[index++];
 const person=candidates[index].slot,evidence=pilotEvidence.entries[id];
 const startCommand=evidence?.anchorTense==='commands'&&rowExample(id,'present',person)?.target===evidence.anchor&&rowExample(id,'commands',0)?.text;
 return {person:startCommand?1:person,command:startCommand?0:toCommand[person]??0,tense:startCommand?'commands':'present'};
}
export function sessionSelection(id){if(!selections.has(id))selections.set(id,sampleStartingRow(id,()=>exampleDraw(courseSeed,id)));return selections.get(id);}
export function selectExampleRow(id,tense,slot){
 const selection=sessionSelection(id);selection.tense=tense;
 if(isCommand(tense)){selection.command=slot;selection.person=fromCommand[slot];}
 else {selection.person=slot;if(toCommand[slot]!==undefined)selection.command=toCommand[slot];}
 return selection;
}
export function selectedRow(id,tense,rows){
 const selection=sessionSelection(id),preferred=isCommand(tense)?selection.command:selection.person;
 return rows.find(r=>r.slot===preferred)||rows.find(r=>rowExample(id,tense,r.slot)?.text)||rows[0];
}
