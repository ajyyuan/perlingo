// Only match course headwords, explicitly listed forms and authored context targets.
const normal=text=>text.normalize('NFC').toLocaleLowerCase('es');
const escape=text=>String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createCardLookup(notes,contexts=[]){
 const index=new Map(),byId=new Map(notes.map(n=>[n.id,n]));
 function add(text,n){const key=normal(text.trim());if(!/^[\p{L}]+$/u.test(key))return;if(!index.has(key))index.set(key,new Map());index.get(key).set(n.id,n);}
 for(const n of notes){
  add(n.word,n);
  for(const [,form] of n.forms)for(const variant of form.split(/\s*\/\s*/))add(variant.replace(/^(?:el|la|los|las)\s+/u,''),n);
 }
 for(const c of contexts){const n=byId.get(c.id);if(n)add(c.target,n);}
 return text=>[...(index.get(normal(text))?.values()||[])];
}
let lookup=()=>[];
export function configureCardLinks(notes,contexts){lookup=createCardLookup(notes,contexts);}
export function cardLinks(text){
 const matches=new Map();for(const word of text.match(/[\p{L}]+/gu)||[])for(const n of lookup(word))matches.set(n.id,n);
 return [...matches.values()].map(n=>`<a class="lemma-card-link" href="/lemmas/notes.html#${encodeURIComponent(n.id)}" data-lemma-card="${escape(n.id)}">Open card · ${escape(n.word)} <small>${escape(n.label)}</small> ↗</a>`).join('');
}
