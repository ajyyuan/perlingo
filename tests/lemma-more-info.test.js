import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {combineNotes} from '../lemmas/notes-library.js';
import {supplementalMarkup} from '../lemmas/note-view.js';
import {formGroups} from '../lemmas/verb-forms.js';
import {esc} from '../lemmas/html.js';
const read=name=>JSON.parse(readFileSync(new URL(`../lemmas/data/${name}.json`,import.meta.url)));
const {notes,concepts}=combineNotes(read('notes'),read('context'));
test('all 1500 supplemental views retain usage, contextual grammar and personal notes without duplicate form tables',()=>{
 assert.equal(notes.length,1500);
 for(const n of notes){
  const html=supplementalMarkup(n,concepts);
  assert.doesNotMatch(html,/<table|data-tense|class="meaning"|♫/,n.id);
  assert.ok(html.includes(esc(n.more)),n.id);
  if(formGroups(n).length){assert.ok(html.includes(esc(n.pattern)),n.id);assert.ok(html.includes(esc(n.tip)),n.id);}
  for(const k of n.tags){assert.ok(concepts[k],`${n.id}: ${k}`);assert.ok(html.includes(`data-concept="${esc(k)}"`));}
  for(const e of n.examples){
   assert.ok(html.includes(`data-speak="${esc(e.text)}"`),e.text);
   assert.ok(html.includes(esc(e.translation)),e.text);
   for(const c of e.chunks||[])if(c.concept){assert.ok(concepts[c.concept],`${n.id}: ${c.concept}`);assert.ok(html.includes(`data-sentence-concept="${esc(c.concept)}"`),c.concept);}
  }
  assert.match(html,/<details class="more usage-context"><summary>Usage in context/);
  assert.match(html,/<summary>My note<\/summary>/);
 }
});
test('personal note text remains escaped and source links retain their word',()=>{
 const n=notes.find(n=>n.word==='hacer');
 const html=supplementalMarkup(n,concepts,{personalNote:'</textarea><script>alert(1)</script>'});
 assert.ok(html.includes(esc('</textarea><script>alert(1)</script>')));
 assert.doesNotMatch(html,/<script>/);
 assert.match(html,/https:\/\/en.wiktionary.org\/wiki\/hacer#Spanish/);
});
