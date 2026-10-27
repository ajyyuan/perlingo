import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {firstSetNotes as notes,firstSetConcepts as concepts} from '../lemmas/first-set-notes.js';
import {chunkMarkup,notesOwnKeyboard} from '../lemmas/note-view.js';
const read=path=>JSON.parse(readFileSync(new URL(path,import.meta.url)));
const byId=new Map(notes.map(n=>[n.id,n]));
test('notes cover exactly the first 50 deck identities, with explained reconstructable examples',()=>{
 const deck=read('../lemmas/data/deck.json');
 assert.deepEqual(notes.map(n=>n.id),deck.slice(0,50).map(c=>c.id));
 for(const n of notes){
  assert.ok(n.meaning&&n.pattern&&n.tip&&n.more&&n.source);
  assert.ok(n.examples.length);
  for(const key of n.tags)assert.ok(concepts[key]?.text);
  for(const e of n.examples){
   assert.equal(e.chunks.map(c=>c.text).join(' ')+'.',e.text);
   assert.ok(e.translation);
   for(const c of e.chunks){assert.ok(c.meaning&&concepts[c.concept]?.text);assert.match(c.text,/\p{L}/u);}
  }
 }
});
test('grammatical contrasts remain separate and useful chunks stay intact',()=>{
 const get=(word,pos)=>byId.get(`corpes:${word}:${pos}`);
 assert.equal(get('que','H').label,'relative pronoun');assert.equal(get('que','C').label,'conjunction');
 assert.notDeepEqual(get('que','H').examples,get('que','C').examples);
 assert.match(get('más','R').examples[0].text,/más fácil/); // Adverbial degree, not noun-quantity determiner.
 assert.deepEqual(get('ir','V').examples[0].chunks.map(c=>c.text),['Voy a estudiar']);
 assert.deepEqual(get('poder','V').examples[0].chunks.map(c=>c.text),['Puedo ir']);
 assert.ok(get('el','T').examples[0].chunks.some(c=>c.text==='El libro'));
 assert.match(concepts[get('suyo','X').tags[0]].text,/not tell us the owner/);
 assert.match(concepts[get('haber','V').tags[0]].text,/impersonal/);
 assert.match(concepts[get('ser','V').tags[0]].text,/not a reliable rule/);
 assert.match(concepts[get('entre','P').tags[0]].text,/tú and yo/);
});
test('all 60 displayed present forms have frozen lemma evidence and distinct subject rows',()=>{
 const evidence=read('../data/spanish-lemmas/notes-form-evidence.json');
 assert.equal(evidence.matches.length,60);
 for(const n of notes.filter(n=>n.label==='verb')){
  assert.equal(n.forms.length,6);assert.equal(new Set(n.forms.map(r=>r[0])).size,6);
  for(const [subject,form] of n.forms)assert.ok(evidence.matches.some(e=>e.lemma===n.word&&e.subject===subject&&e.form===form));
 }
 assert.deepEqual(byId.get('corpes:haber:V').forms.map(r=>r[1]),['he','has','ha','hemos','habéis','han']);
 assert.deepEqual(byId.get('corpes:ser:V').forms.map(r=>r[1]),['soy','eres','es','somos','sois','son']);
});
test('punctuation is rendered outside chunk buttons, while text stays escaped',()=>{
 assert.match(chunkMarkup({text:'llueve,'},0,1),/>llueve<\/button>,/);
 assert.match(chunkMarkup({text:'<script>'},0,0),/&lt;script&gt;/);
 assert.match(chunkMarkup({text:'¿Vendrás?'},0,0),/^¿<button[^>]*>Vendrás<\/button>\?$/);
 assert.match(chunkMarkup({text:'¡Qué bien!'},0,0),/^¡<button[^>]*>Qué bien<\/button>!$/);
});
test('grammar, notes, text input and disclosures own their keyboard; ordinary study surface does not',()=>{
 const target=selector=>({closest:query=>query.split(',').map(s=>s.trim()).includes(selector)?{}:null});
 for(const selector of ['.word-note','#grammar','#chunk-help','textarea','summary','a'])assert.equal(notesOwnKeyboard(target(selector),false),true);
 assert.equal(notesOwnKeyboard(target('main'),true),true);
 assert.equal(notesOwnKeyboard(target('main'),false),false);
});
