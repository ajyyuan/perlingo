import {sourceEvidence} from './source-evidence.js';
import {courseSources} from './course-sources.js';
import {constructionPrompts} from './counting.js';
import {expandedPacks} from './expanded.js';
import {lessonEntries} from '../model.js';
import {courseSeeds} from './seeds.js';
import {firstExchanges} from './u01.js';
// First-exchanges exercises use the same 4 production / 2 contrast / 2 transfer split.
for(const objective of ['u01.1','u01.2','u01.3']){
 const examples=firstExchanges.entries.filter(e=>e.objectiveId===objective);
 examples.forEach((e,i)=>{e.mode=i<4?'production':i<6?'contrast':'transfer';if(e.mode==='contrast')e.contrastOptions=[examples[4].prompt,examples[5].prompt];});
}
export const coursePacks=[firstExchanges,...courseSeeds,...expandedPacks];
for(const p of coursePacks)for(const e of p.entries)if(constructionPrompts.has(e.prompt))for(const t of Object.values(e.translations))for(const id of t.lexemeIds)if(p.lexemes[id])p.lexemes[id].countTowardsInventory=false;
for(const pack of coursePacks){
 for(const l of Object.values(pack.lexemes)){const evidence=sourceEvidence[l.id];if(!l.evidence&&evidence){l.evidence=evidence;l.sourceIds=[...new Set([...l.sourceIds,...evidence.sourceIds])];for(const id of evidence.sourceIds)pack.sources[id]=courseSources[id];}}
 for(const e of pack.entries)for(const t of Object.values(e.translations))t.sourceIds=[...new Set([...t.sourceIds,...t.lexemeIds.flatMap(id=>pack.lexemes[id]?.sourceIds||[])])];
}
export const courseEntries=coursePacks.flatMap(p=>p.entries);

export function courseLessonEntries(){
 const selected=new Map();
 // Keep distinct prompts when their translations differ; collapse exact vocabulary duplicates.
 for(const pack of [...courseSeeds,firstExchanges,...expandedPacks])for(const item of lessonEntries(pack)){
  const identity=item.kind==='vocabulary'?`${item.unitId}:${item.type}:${item.es}|${item.fr}|${item.de}`:item.id;
  if(!selected.has(identity))selected.set(identity,item);
 }
 return [...selected.values()].sort((a,b)=>a.unitId.localeCompare(b.unitId));
}
