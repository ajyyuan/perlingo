import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {combineNotes} from '../lemmas/notes-library.js';
import {createCardLookup,configureCardLinks,cardLinks} from '../lemmas/card-links.js';
import {sentenceMarkup} from '../lemmas/word-help.js';
const read=name=>JSON.parse(readFileSync(new URL('../lemmas/data/'+name+'.json',import.meta.url)));
const {notes,contexts}=combineNotes(read('notes'),read('context'));
const lookup=createCardLookup(notes,contexts.values());
test('course lookup preserves accents and resolves listed verb and noun forms',()=>{
 assert.ok(lookup('LIBRO').some(n=>n.word==='libro'));
 assert.ok(lookup('es').some(n=>n.word==='ser'));
 assert.ok(lookup('años').some(n=>n.word==='año'));
 assert.ok(lookup('está').some(n=>n.word==='estar'));
 assert.ok(!lookup('esta').some(n=>n.word==='estar'));
 assert.deepEqual(lookup('zzunknown'),[]);
 assert.equal(new Set(lookup('es').map(n=>n.id)).size,lookup('es').length);
});
test('ambiguous forms retain choices instead of guessing a lemma',()=>{
 const fixture=[{id:'a',word:'vino',label:'noun',forms:[]},{id:'b',word:'venir',label:'verb',forms:[['past','vino']]}];
 assert.deepEqual(createCardLookup(fixture)('vino').map(n=>n.id),['a','b']);
});
test('all listed course headwords resolve and links deduplicate phrase tokens',()=>{
 for(const n of notes)if(/^[\p{L}]+$/u.test(n.word))assert.ok(lookup(n.word).some(x=>x.id===n.id),n.id);
 configureCardLinks(notes,contexts.values());
 const once=cardLinks('libro'),twice=cardLinks('libro libro');assert.equal(once,twice);assert.match(once,/data-lemma-card="corpes:libro:N"/);assert.equal(cardLinks('zzunknown'),'');
});
test('unanswered cloze target has no lookup link; visible words do',()=>{
 configureCardLinks(notes,contexts.values());const c=contexts.get('corpes:el:T');
 const hidden=sentenceMarkup(c,false),shown=sentenceMarkup(c,true);
 assert.doesNotMatch(hidden,/data-lemma-card="corpes:el:T"/);assert.match(hidden,/data-lemma-card="corpes:libro:N"/);assert.match(shown,/data-lemma-card="corpes:el:T"/);
 assert.match(hidden,/role="group" aria-label="Quick meaning"/);
});

test('neuter esto belongs to este and links back from sentence help',()=>{
 const note=notes.find(n=>n.id==='corpes:este:D');
 assert.deepEqual(note.forms.find(([,form])=>form==='esto'),['neuter (standalone)','esto']);
 assert.match(note.more,/does not go before a noun/);
 assert.deepEqual(lookup('Esto').map(n=>n.id),['corpes:este:D']);
 configureCardLinks(notes,contexts.values());
 assert.match(cardLinks('Esto'),/data-lemma-card="corpes:este:D"/);
 assert.deepEqual(contexts.get('corpes:este:D').answers,['Este']);
});

test('every demonstrative and possessive family has its source-checked forms and links',()=>{
 const families={
  'este:D':['este','esta','estos','estas','esto'],
  'ese:D':['ese','esa','esos','esas','eso'],
  'aquel:D':['aquel','aquella','aquellos','aquellas','aquello'],
  'tal:D':['tal','tales'],
  'mío:X':['mi','mis','mío','mía','míos','mías'],
  'suyo:X':['su','sus','suyo','suya','suyos','suyas'],
  'tuyo:X':['tu','tus','tuyo','tuya','tuyos','tuyas'],
  'nuestro:X':['nuestro','nuestra','nuestros','nuestras']
 };
 const base=read('notes').notes;
 for(const [key,forms] of Object.entries(families)){
  const id='corpes:'+key;
  assert.deepEqual(base.find(n=>n.id===id).forms.map(r=>r[1]),forms);
  for(const form of forms)assert.ok(lookup(form.toLocaleUpperCase('es')).some(n=>n.id===id),form);
 }
 for(const [word,neuter] of [['este','esto'],['ese','eso'],['aquel','aquello']]){
  const n=notes.find(n=>n.word===word);
  assert.deepEqual(n.forms.find(r=>r[1]===neuter),['neuter (standalone)',neuter]);
  assert.deepEqual(n.forms.filter(([label])=>label.includes('neuter')),[['neuter (standalone)',neuter]]);
  assert.ok(!contexts.get(n.id).answers.includes(neuter));
 }
 assert.ok(!lookup('tú').some(n=>n.word==='tuyo'));
 assert.ok(!lookup('mia').some(n=>n.word==='mío'));
});
test('middle-dot groups resolve each form without indexing arbitrary phrase words',()=>{
 for(const [word,forms] of [['todo',['todo','toda','todos','todas']],['otro',['otro','otra','otros','otras']]]){
  for(const form of forms)assert.ok(lookup(form).some(n=>n.word===word),form);
 }
 const fixture=[{id:'x',word:'test',forms:[['variants','suya · suyas / suyo'],['phrase','de repente']]}];
 const find=createCardLookup(fixture);
 for(const form of ['suya','suyas','suyo'])assert.equal(find(form)[0].id,'x');
 assert.deepEqual(find('de'),[]);assert.deepEqual(find('repente'),[]);
});
