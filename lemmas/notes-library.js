import {firstSetNotes,firstSetConcepts} from './first-set-notes.js';
import {notes as pilot,concepts as pilotConcepts} from './notes-data.js';
// Sentence examples are authored; the full lexical layer is reproducible from source evidence.
export function combineNotes(base){
 const authored=new Map(firstSetNotes.map(n=>[n.id,n]));
 const extraConcepts=Object.fromEntries(Object.entries(pilotConcepts).map(([k,v])=>['pilot:'+k,v]));
 for(const [word,id] of [['casa','corpes:casa:N'],['depender','corpes:depender:V'],['música','corpes:músico:N']]){const n=pilot.find(n=>n.word===word);authored.set(id,{...n,id,tags:n.tags.map(k=>'pilot:'+k),examples:n.examples.map(e=>({...e,chunks:e.chunks.map(c=>({...c,concept:'pilot:'+c.concept}))}))});}
 const notes=base.notes.map(n=>authored.has(n.id)?{...n,...authored.get(n.id),level:'sentence'}:n);
 return {notes,concepts:{...base.concepts,...extraConcepts,...firstSetConcepts}};
}
let pending;
export function loadNotes(){
 pending??=fetch('/lemmas/data/notes.json').then(r=>{if(!r.ok)throw Error('notes');return r.json();}).then(combineNotes);
 return pending;
}
