import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {combineNotes} from '../lemmas/notes-library.js';
import {exampleMarkup,sentenceAudio} from '../lemmas/sentence-help.js';
import {tenerGroups} from '../lemmas/tener-prototype.js';
import {cardLinks} from '../lemmas/card-links.js';
const read=n=>JSON.parse(readFileSync(new URL('../lemmas/data/'+n+'.json',import.meta.url)));
const {notes}=combineNotes(read('notes'),read('context'));
test('every course example and tense example has a gloss for each word',()=>{
 for(const e of [...notes.flatMap(n=>n.examples),...tenerGroups]){
  const markup=exampleMarkup(e);assert.equal((markup.match(/class="word-sound"/g)||[]).length,[...e.text.matchAll(/[\p{L}]+/gu)].length,e.text);
  assert.doesNotMatch(markup,/undefined|null/);
 }
});
test('sentence markup keeps punctuation and exposes contextual grammar independently from pronunciation',()=>{
 const example=notes.find(n=>n.word==='casa').examples[0];
 const markup=exampleMarkup(example,{grammar:true});assert.match(markup,/data-sentence-concept="pilot:possession"/);assert.match(markup,/data-speak="Tengo"/);assert.ok(markup.endsWith('.'));assert.doesNotMatch(markup,/<button[^>]*data-speak[^>]*data-sentence-concept/);
 const other=exampleMarkup(example);const ids=s=>[...s.matchAll(/ id="([^"]+)"/g)].map(m=>m[1]);assert.ok(ids(markup).every(id=>!ids(other).includes(id)));
});
test('tense glosses distinguish forms and retain links to tener',()=>{
 const past=exampleMarkup(tenerGroups.find(g=>g.id==='preterite'));assert.match(past,/I had/);assert.match(past,/corpes:tener:V/);
 assert.match(exampleMarkup(tenerGroups.find(g=>g.id==='perfect')),/had \(past participle\)/);assert.match(cardLinks('tenido'),/corpes:tener:V/);
 assert.match(sentenceAudio('Tengo una pregunta.'),/Listen to whole sentence/);
});
