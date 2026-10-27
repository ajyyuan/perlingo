import {tenerGroups} from './tener-prototype.js';
import {configureSentenceHelp} from './sentence-help.js';
import {configureCardLinks} from './card-links.js';
import {firstSetNotes,firstSetConcepts} from './first-set-notes.js';
import {notes as pilot,concepts as pilotConcepts} from './notes-data.js';
// Sentence examples are authored; the full lexical layer is reproducible from source evidence.
export function combineNotes(base,contextBank){
 const authored=new Map(firstSetNotes.map(n=>[n.id,n]));
 const extraConcepts=Object.fromEntries(Object.entries(pilotConcepts).map(([k,v])=>['pilot:'+k,v]));
 for(const [word,id] of [['casa','corpes:casa:N'],['depender','corpes:depender:V'],['música','corpes:músico:N']]){const n=pilot.find(n=>n.word===word);authored.set(id,{...n,id,tags:n.tags.map(k=>'pilot:'+k),examples:n.examples.map(e=>({...e,chunks:e.chunks.map(c=>({...c,concept:'pilot:'+c.concept}))}))});}
 const contexts=new Map(contextBank.contexts.map(c=>[c.id,c]));
 const notes=base.notes.map(n=>{
  const note=authored.has(n.id)?{...n,...authored.get(n.id)}:{...n};
  const context=contexts.get(n.id);if(!context)throw Error('Missing context: '+n.id);
  return {...note,level:'sentence',examples:note.examples.some(e=>e.text===context.example.text)?note.examples:[...note.examples,context.example]};
 });
 configureCardLinks(notes.map(n=>n.id==='corpes:tener:V'?{...n,forms:[...n.forms,...tenerGroups.flatMap(g=>g.rows.map(r=>[r.label,r.lemma]))]}:n),[...contexts.values(),...['tenido'].map(target=>({id:'corpes:tener:V',target}))]);configureSentenceHelp(contexts.values());
 return {notes,contexts,concepts:{...base.concepts,...extraConcepts,...firstSetConcepts,...contextBank.concepts}};
}
let pending;
export function loadNotes(){
 pending??=Promise.all(['notes','context'].map(name=>fetch(`/lemmas/data/${name}.json`).then(r=>{if(!r.ok)throw Error(name);return r.json();}))).then(([notes,context])=>combineNotes(notes,context));
 return pending;
}
