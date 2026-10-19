import {units,courseTargets} from './units.js';
// Conservative counting: repeat forms and repeated teaching of the same lemma do not add words.
// An explicit lexicalSense may distinguish genuinely separate meanings of a polysemous lemma.
export const lexicalKey=l=>`${l.lang}:${l.lemma.normalize('NFC')}:${l.lexicalSense||''}`;
export function courseCoverage(packs){
 const lexemes=packs.flatMap(p=>Object.values(p.lexemes));
 const entries=packs.flatMap(p=>p.entries);
 return units.map(unit=>({unit,...Object.fromEntries(courseTargets.languages.map(lang=>{
  const ls=lexemes.filter(l=>l.lang===lang&&l.unitId===unit.id&&l.countTowardsInventory!==false);
  const keys=new Set(ls.map(lexicalKey));
  const examples=entries.filter(e=>e.unitId===unit.id&&e.kind==='example'&&e.translations[lang]);
  return [lang,{vocabulary:keys.size,vocabularyTarget:unit.vocabularyTarget,sourceChecked:new Set(ls.filter(l=>l.evidence).map(lexicalKey)).size,examples:examples.length,exampleTarget:unit.exampleTarget,objectives:unit.objectives.map(o=>({id:o.id,examples:examples.filter(e=>e.objectiveId===o.id).length,target:o.exampleTarget}))}];
 }))}));
}

export function courseTotals(packs){
 const all=packs.flatMap(p=>Object.values(p.lexemes));
 return Object.fromEntries(courseTargets.languages.map(lang=>{
  const ls=all.filter(l=>l.lang===lang&&l.countTowardsInventory!==false);
  return [lang,{vocabulary:new Set(ls.map(lexicalKey)).size,sourceChecked:new Set(ls.filter(l=>l.evidence).map(lexicalKey)).size,examples:packs.flatMap(p=>p.entries).filter(e=>e.kind==='example'&&e.translations[lang]).length}];
 }));
}
