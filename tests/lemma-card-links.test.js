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
