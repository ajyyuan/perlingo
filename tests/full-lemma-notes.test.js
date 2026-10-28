import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {combineNotes} from '../lemmas/notes-library.js';
import {cardFormWords} from '../lemmas/card-links.js';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
const base=read('../lemmas/data/notes.json'),deck=read('../lemmas/data/deck.json');
const library=combineNotes(base,read('../lemmas/data/context.json')),byId=new Map(library.notes.map(n=>[n.id,n]));
test('every deck identity has a complete lexical entry and an honest example layer',()=>{
 assert.equal(library.notes.length,1500);assert.equal(byId.size,1500);
 assert.deepEqual(library.notes.map(n=>n.id),deck.map(c=>c.id));
 assert.equal(library.notes.filter(n=>n.level==='sentence').length,1500);
 for(const [i,n] of library.notes.entries()){
  assert.equal(n.word,deck[i].lemma);assert.ok(n.meaning&&n.pattern&&n.tip&&n.source);
  for(const k of n.tags)assert.ok(library.concepts[k]?.text,`${n.id}: ${k}`);
  for(const ex of n.examples){assert.equal(ex.chunks.map(c=>c.text).join(' ')+'.',ex.text);for(const c of ex.chunks)assert.ok(library.concepts[c.concept]);}
  for(const value of [n.meaning,n.pattern,n.tip,n.more])assert.doesNotMatch(value,/\{\{|\[\[/);
 }
 assert.match(library.concepts.infinitive.text,/headword/);
 assert.doesNotMatch(library.concepts.infinitive.text,/Depender/); // Pilot concepts must not overwrite generic grammar.
 assert.match(library.concepts['pilot:infinitive'].text,/Depender/);
});
test('noun gender, accent and adjective exceptions survive generation',()=>{
 const get=(w,p='N')=>byId.get(`corpes:${w}:${p}`);
 assert.equal(get('mano').pattern,'la mano');assert.equal(get('problema').pattern,'el problema');
 for(const w of ['agua','área','arma','alma']){assert.equal(get(w).pattern,'el '+w);assert.match(get(w).more,/Feminine/);assert.ok(get(w).forms.some(r=>r[1].startsWith('las ')));}
 assert.deepEqual(get('bueno','A').forms.map(r=>r[1]),['bueno','buena','buenos','buenas','buen']);
 assert.ok(get('país').forms.some(r=>r[1]==='los países'));
 assert.ok(get('joven').forms.some(r=>r[1]==='los / las jóvenes'));
 assert.ok(get('orden').forms.some(r=>r[1]==='los / las órdenes'));
 assert.match(get('capital').more,/El capital.*La capital/);
 assert.equal(get('disco').pattern,'el disco');assert.equal(get('enero').pattern,'en enero');
 assert.equal(get('médico').pattern,'el médico');assert.match(get('médico').more,/la médica/);
 assert.match(get('persona').tip,/including for a man/);
});
test('displayed generated inflections are backed by exact lemma/POS evidence',()=>{
 const evidence=new Set(read('../data/spanish-lemmas/notes-inflection-evidence.json').matches.map(r=>r.join('|')));
 const manual=read('../data/spanish-lemmas/notes-manual-evidence.json').forms;
 for(const n of base.notes){
  const pos={noun:'n',adjective:'adj',verb:'v'}[n.label];if(!pos)continue;
  for(const [,phrase] of n.forms)for(const form of cardFormWords(phrase)){
   if(form===n.word)continue;
   assert.ok(evidence.has([n.word,pos,form].join('|'))||manual.some(e=>e.lemma===n.word&&e.pos===pos&&e.forms.includes(form)),`${n.word}: ${form}`);
  }
 }
 const verbs=base.notes.filter(n=>n.label==='verb');assert.equal(verbs.length,369);assert.ok(verbs.every(n=>n.forms.length));
 assert.deepEqual(byId.get('corpes:seguir:V').forms.map(r=>r[1]),['sigo','sigues','sigue','seguimos','seguís','siguen']);
 assert.deepEqual(byId.get('corpes:adquirir:V').forms.map(r=>r[1]),['adquiero','adquieres','adquiere','adquirimos','adquirís','adquieren']);
 assert.deepEqual(byId.get('corpes:ocurrir:V').forms.map(r=>r[1]),['ocurre','ocurren']);
});
test('gloss-review record matches the deck and prioritizes common learner senses',()=>{
 const audit=read('../data/spanish-lemmas/full-notes-gloss-review.json');assert.equal(audit.changes.length,104);
 for(const c of audit.changes)assert.deepEqual(deck.find(d=>d.id===c.id).meanings,c.meanings);
 for(const [id,re] of [['película:N',/movie/],['profesor:N',/teacher/],['efectivo:A',/effective/],['lengua:N',/language/]])assert.match(byId.get('corpes:'+id).meaning,re);
});
test('second-pass corrections preserve grammatical roles, sense and source identity',()=>{
 const get=(w,p='N')=>byId.get(`corpes:${w}:${p}`);
 assert.deepEqual(get('mes').forms,[['singular','el mes'],['plural','los meses']]);
 assert.deepEqual(get('gas').forms,[['singular','el gas'],['plural','los gases']]);
 assert.deepEqual(get('español','A').forms.map(r=>r[1]),['español','española','españoles','españolas']);
 for(const w of ['crisis','análisis','virus','lunes','martes','miércoles','jueves','viernes']){
  assert.ok(get(w).forms.some(([k,v])=>k==='plural'&&v.endsWith(' '+w)));
 }
 for(const w of ['ocurrir','suceder']){
  assert.doesNotMatch(get(w,'V').meaning,/impersonal/);
  assert.deepEqual(get(w,'V').forms.map(r=>r[0]),['singular subject','plural subject']);
 }
 assert.match(get('escuchar','V').pattern,/escuchar a alguien/);
 assert.match(get('gestión').meaning,/management; administration/);
 for(const w of ['inglés','personal'])assert.equal(get(w).forms.length,1);
 const etc=deck.find(c=>c.id==='corpes:etcétera:Q');
 assert.equal(etc.sourceTag,'Q');assert.equal(etc.partOfSpeech,'expression');
 assert.deepEqual(get('etcétera','Q').tags,['enumeration']);
 const audit=read('../data/spanish-lemmas/second-pass-audit.json');
 assert.equal(audit.changes.length,10);assert.equal(audit.retained.length,17);
 for(const change of audit.changes){
  const n=base.notes.find(n=>n.id===change.id);
  for(const [field,values] of Object.entries(change.fields))assert.deepEqual(n[field],values.after,`${change.id} ${field}`);
 }
});
test('independent DLE present-table comparisons retain the person labels as well as forms',()=>{
 const labels=['yo','tú','él / ella / usted','nosotros / nosotras','vosotros / vosotras','ellos / ellas / ustedes'];
 // Transcribed from the DLE present indicative tables linked in second-pass-audit.json.
 const checked={prever:'preveo prevés prevé prevemos prevéis prevén',adquirir:'adquiero adquieres adquiere adquirimos adquirís adquieren',seguir:'sigo sigues sigue seguimos seguís siguen',reír:'río ríes ríe reímos reís ríen'};
 for(const [word,forms] of Object.entries(checked))assert.deepEqual(byId.get(`corpes:${word}:V`).forms,labels.map((s,i)=>[s,forms.split(' ')[i]]));
});
test('notes rebuild offline without changing the evidence or output',()=>{
 const paths=['../lemmas/data/notes.json','../data/spanish-lemmas/notes-inflection-evidence.json','../data/spanish-lemmas/notes-build-report.json'];
 const before=paths.map(p=>readFileSync(new URL(p,import.meta.url),'utf8'));
 execFileSync('python3',['scripts/build-lemma-notes.py'],{cwd:new URL('../',import.meta.url)});
 for(const [i,p] of paths.entries())assert.equal(readFileSync(new URL(p,import.meta.url),'utf8'),before[i]);
});
