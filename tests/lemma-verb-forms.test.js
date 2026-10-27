import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {formGroups,formGroup,referenceForms} from '../lemmas/verb-forms.js';
import {combineNotes} from '../lemmas/notes-library.js';
import {tenerGroups} from '../lemmas/tener-prototype.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const deck=read('lemmas/data/deck.json'),library=combineNotes(read('lemmas/data/notes.json'),read('lemmas/data/context.json'));
const notes=new Map(library.notes.map(n=>[n.word+':'+n.label,n]));
const note=w=>notes.get(w+':verb');
const rows=(w,id)=>formGroup(note(w),id).rows.map(r=>r.lemma);
test('every course verb has all nine reference groups; nonverbs have none',()=>{
 assert.equal(Object.keys(verbForms).length,369);
 for(const n of library.notes){const groups=formGroups(n);assert.equal(groups.length,n.label==='verb'?9:0,n.id);if(!groups.length)continue;
  assert.equal(new Set(groups.map(g=>g.id)).size,9);
  for(const g of groups){assert.ok(g.cue&&g.title);assert.ok(g.rows.length||g.notice);for(const r of g.rows){assert.ok(r.label&&r.sourceLabel&&r.lemma);assert.ok(r.alternatives.includes(r.lemma));}}
  for(const [,form]of n.forms)assert.ok(formGroup(n).rows.some(r=>r.alternatives.includes(form)),`${n.word}: ${form}`);
 }
 for(const g of tenerGroups)assert.deepEqual(rows('tener',g.id),g.rows.map(r=>r.lemma));
});
test('irregular families retain their tense, person and accent distinctions',()=>{
 assert.deepEqual(rows('ser','preterite'),['fui','fuiste','fue','fuimos','fuisteis','fueron']);
 assert.deepEqual(rows('ser','imperfect'),['era','eras','era','éramos','erais','eran']);
 assert.deepEqual(rows('ser','commands'),['sé','sea','sed','sean']);
 assert.deepEqual(rows('ir','commands'),['ve','vaya','id','vayan']);
 assert.deepEqual(rows('ir','negative'),['no vayas','no vaya','no vayáis','no vayan']);
 assert.deepEqual(rows('decir','preterite'),['dije','dijiste','dijo','dijimos','dijisteis','dijeron']);
 assert.deepEqual(rows('conducir','preterite'),['conduje','condujiste','condujo','condujimos','condujisteis','condujeron']);
 assert.deepEqual(rows('dormir','subjunctive'),['duerma','duermas','duerma','durmamos','durmáis','duerman']);
 assert.deepEqual(rows('prever','preterite'),['preví','previste','previó','previmos','previsteis','previeron']);
 assert.equal(rows('reír','preterite')[2],'rio');assert.equal(rows('reír','subjunctive')[4],'riais');
 assert.equal(rows('oír','preterite')[2],'oyó');assert.equal(rows('hacer','preterite')[2],'hizo');
 assert.equal(rows('poner','perfect')[0],'he puesto');assert.equal(rows('abrir','perfect')[0],'he abierto');
 assert.equal(rows('volver','perfect')[0],'he vuelto');assert.equal(rows('escribir','perfect')[0],'he escrito');
 assert.equal(rows('elegir','perfect')[0],'he elegido');assert.equal(rows('pagar','perfect')[0],'he pagado');
 assert.deepEqual(formGroup(note('describir'),'perfect').rows[0].alternatives,['he descrito','he descripto']);
 assert.match(formGroup(note('describir'),'perfect').cue,/Río de la Plata/);
 for(const w of ['ir','estar','hacer'])assert.ok(referenceForms(note(w)).every(([,f])=>!f.startsWith('me ')));
});
test('impersonal/event uses do not acquire misleading personal or command tables',()=>{
 for(const w of ['ocurrir','suceder','consistir'])for(const g of formGroups(note(w))){assert.equal(g.rows.length,['commands','negative'].includes(g.id)?0:2);}
 assert.deepEqual(rows('haber','perfect'),['ha habido']);
 assert.deepEqual(rows('haber','present'),['he','has','ha','hemos','habéis','han','hay']);
 assert.equal(formGroup(note('haber'),'commands').rows.length,0);assert.match(formGroup(note('haber'),'commands').notice,/not used/);
});
test('all simple reference forms match frozen tagged source slots and older snapshot membership evidence',()=>{
 const evidence=read('data/spanish-lemmas/conjugation-evidence.json').records;
 const audit=read('data/spanish-lemmas/conjugation-audit.json');
 const membership=new Set(audit.matches.map(r=>r.join('|')));
 for(const card of deck.filter(c=>c.sourceTag==='V')){
  const record=evidence[card.lemma];assert.ok(record.url&&record.sha256);const source=record.entries.flatMap(e=>{let active=false;return e.forms.filter(r=>{if(r.tags.includes('inflection-template'))active=false;if(r.tags.includes('infinitive'))active=r.form===card.lemma;return active&&!r.tags.some(t=>['combined-form','vos-form','archaic','obsolete','dated','rare','nonstandard'].includes(t));});});
  const tags={present:['indicative','present'],preterite:['indicative','preterite'],imperfect:['indicative','imperfect'],future:['indicative','future'],conditional:['conditional'],subjunctive:['subjunctive','present'],commands:['imperative'],negative:['imperative','negative']};
  const slots=[['first-person','singular'],['second-person','singular'],['third-person','singular'],['first-person','plural'],['second-person','plural'],['third-person','plural']];
  for(const [kind,required]of Object.entries(tags))verbForms[card.id][kind].forEach((alternatives,i)=>{const slot=slots[['commands','negative'].includes(kind)?[1,2,4,5][i]:i];for(const f of alternatives)assert.ok(source.some(r=>r.form===f.replace(/^no /,'')&&[...required,...slot].every(t=>r.tags.includes(t))&&r.tags.includes('negative')===(kind==='negative')),`${card.lemma}: ${kind} ${slot} ${f}`);});
  for(const [kind,table]of Object.entries(verbForms[card.id])){if(kind==='perfect')continue;for(const f of kind==='participle'?table:table.flat()){
   const word=f.replace(/^no /,'');assert.ok(source.some(r=>r.form===word),`${card.lemma}: ${f}`);assert.ok(membership.has(card.lemma+'|'+word),`${card.lemma}: ${f}`);
  }}
 }
 const digest=p=>createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex');
 assert.equal(digest('lemmas/data/deck.json'),audit.unchanged.deck);
 assert.equal(digest('lemmas/data/context.json'),audit.unchanged.context);
 for(const [file,hash]of Object.entries(audit.unchanged.assessment))assert.equal(digest(file),hash);
});
test('conjugation compilation is deterministic and offline',()=>{
 const path=new URL('../lemmas/verb-forms-data.js',import.meta.url),before=readFileSync(path,'utf8');
 execFileSync('python3',['scripts/build-lemma-conjugations.py'],{cwd:new URL('../',import.meta.url)});assert.equal(readFileSync(path,'utf8'),before);
});
