import {exampleNoteHref} from './example-mode.js';
// Only match course headwords, explicitly listed forms and authored context targets.
const normal=text=>text.normalize('NFC').toLocaleLowerCase('es');
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Strip shared articles before splitting variants: “los / las jóvenes” is
// one noun form, not a standalone “los” variant belonging to joven.
const withoutArticle=text=>text.replace(/^(?:el|la|lo|los|las)(?:\s*\/\s*(?:el|la|lo|los|las))?\s+(?=\p{L})/u,'');
export function cardFormWords(form){
 return withoutArticle(form).split(/\s*[\/·]\s*/).map(withoutArticle).filter(word=>/^[\p{L}]+$/u.test(word));
}
export function createCardLookup(notes,contexts=[]){
 const index=new Map(),byId=new Map(notes.map(n=>[n.id,n]));
 function add(text,n){const key=normal(text.trim());if(!/^[\p{L}]+$/u.test(key))return;if(!index.has(key))index.set(key,new Map());index.get(key).set(n.id,n);}
 for(const n of notes){
  add(n.word,n);
  for(const [,form] of n.forms)for(const word of cardFormWords(form))add(word,n);
 }
 for(const c of contexts){const n=byId.get(c.id);if(n)add(c.target,n);}
 return text=>[...(index.get(normal(text))?.values()||[])];
}
let lookup=()=>[],courseNotes=new Map(),headwords=new Map();
export function configureCardLinks(notes,contexts){lookup=createCardLookup(notes,contexts);courseNotes=new Map(notes.map(n=>[n.id,n]));headwords=new Map();for(const n of notes){const key=normal(n.word);if(!headwords.has(key))headwords.set(key,[]);headwords.get(key).push(n);}}
export function cardLinks(text){
 const matches=new Map();for(const word of text.normalize('NFC').match(/[\p{L}]+/gu)||[])for(const n of lookup(word))matches.set(n.id,n);
 return [...matches.values()].map(n=>`<a class="lemma-card-link" href="${escape(exampleNoteHref(n.id))}" data-lemma-card="${escape(n.id)}">Open card · ${escape(n.word)} <small>${escape(n.label)}</small> ↗</a>`).join('');
}

// Comparison titles list headwords; do not resolve ordinary prose or inflected
// homographs to unrelated cards. Authored membership also supports named topics.
export function comparisonCardLinks(group,currentId){
 const matches=new Map();
 for(const id of group.members||[]){const n=courseNotes.get(id);if(n)matches.set(id,n);}
 for(const word of group.title.split(' · '))for(const n of headwords.get(normal(word.trim()))||[])matches.set(n.id,n);
 matches.delete(currentId);
 return [...matches.values()].map(n=>{
  const ambiguous=(headwords.get(normal(n.word))||[]).length>1;
  return `<a href="${escape(exampleNoteHref(n.id))}" data-lemma-card="${escape(n.id)}" aria-label="Open ${escape(n.word)} · ${escape(n.label)} course card">${escape(n.word)}${ambiguous?` <small>${escape(n.label)}</small>`:''}</a>`;
 }).join(' · ');
}
