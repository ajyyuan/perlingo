import test from 'node:test';
import assert from 'node:assert/strict';
import {notes,concepts} from '../lemmas/notes-data.js';
test('five-word pilot preserves examples and defines every clickable explanation',()=>{
 assert.deepEqual(notes.map(n=>n.word),['casa','tener','depender','que','música']);
 for(const n of notes){
  for(const k of n.tags)assert.ok(concepts[k]?.text);
  for(const e of n.examples){
   assert.equal(e.chunks.map(c=>c.text).join(' ')+'.',e.text);
   for(const c of e.chunks){assert.ok(c.meaning);assert.ok(concepts[c.concept]?.text);assert.ok(/\p{L}/u.test(c.text));}
  }
 }
 assert.deepEqual(notes[0].examples[0].chunks.map(c=>c.text),['Tengo','una casa']);
 assert.deepEqual(notes[2].examples[0].chunks.map(c=>c.text),['Depende','de ti']);
 assert.equal(notes[3].examples.length,2);
 assert.equal(notes[1].forms.find(([p])=>p==='yo')[1],'tengo');
 assert.equal(notes[2].forms.find(([p])=>p==='nosotros / nosotras')[1],'dependemos');
 assert.match(concepts.ti.text,/no written accent/);
 assert.match(notes[4].more,/count may cover other uses/);
});
