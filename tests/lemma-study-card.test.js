import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {combineNotes} from '../lemmas/notes-library.js';
import {studyRows} from '../lemmas/study-card.js';
const read=n=>JSON.parse(readFileSync(new URL('../lemmas/data/'+n+'.json',import.meta.url)));
test('main study cards preserve every existing form row across all 1500 notes',()=>{
 const {notes}=combineNotes(read('notes'),read('context'));
 assert.equal(notes.length,1500);
 for(const note of notes){assert.deepEqual(studyRows(note).map(r=>[r.sourceLabel,r.lemma]),note.forms);assert.ok(note.examples.length);}
 assert.equal(studyRows(notes.find(n=>n.word==='tener'))[0].label,'I');
});
