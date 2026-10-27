import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {combineNotes} from '../lemmas/notes-library.js';
import {prototypeLessons,freshPrototype,advanceLesson,restorePrototype} from '../lemmas/forms-prototype-model.js';
const read=name=>JSON.parse(readFileSync(new URL('../lemmas/data/'+name+'.json',import.meta.url)));
const library=combineNotes(read('notes'),read('context')),lessons=prototypeLessons(library.notes,library.concepts),cards=new Map(lessons.flatMap(l=>l.rows).map(r=>[r.id,r]));
test('prototype teaches all twelve existing note forms and reuses existing explanations',()=>{
 assert.equal(lessons.length,3);assert.equal(cards.size,12);
 for(const lesson of lessons){const source=library.notes.find(n=>n.id===lesson.id);assert.deepEqual(lesson.rows.map(r=>[r.sourceLabel,r.lemma]),source.forms);assert.ok(Object.values(library.concepts).some(c=>c.text===lesson.why));}
 assert.deepEqual(lessons[0].rows.map(r=>r.lemma),['tengo','tienes','tiene','tenemos','tenéis','tienen']);
 assert.deepEqual(lessons[1].rows.map(r=>r.lemma),['la casa','las casas']);
});
test('study navigation never creates a quiz and drops legacy quiz state',()=>{
 let state=freshPrototype();
 for(let i=0;i<8;i++)state=advanceLesson(state,lessons);
 assert.equal(state.index,2);assert.equal(state.phase,'learn');assert.equal(state.test,undefined);
 assert.deepEqual(restorePrototype({version:2,phase:'test',index:1,test:{draft:'old answer'}},lessons),{version:3,phase:'learn',index:1});
 assert.deepEqual(restorePrototype({version:3,index:99},lessons),freshPrototype());
 assert.deepEqual(restorePrototype(state,lessons),state);
});

test('tense exploration preserves the source present table',async()=>{
 const {tenerGroups,formGroup}=await import('../lemmas/tener-prototype.js');
 assert.deepEqual(formGroup(lessons[0]).rows.map(r=>r.lemma),lessons[0].rows.map(r=>r.lemma));
 assert.equal(formGroup(lessons[1]),null);
 assert.equal(new Set(tenerGroups.map(g=>g.id)).size,9);
 for(const g of tenerGroups){
  assert.equal(g.rows.length,['commands','negative'].includes(g.id)?4:6);
  assert.ok(g.cue&&g.text&&g.translation);
  assert.ok(g.rows.every(r=>r.label&&r.sourceLabel&&r.lemma));
  assert.ok(g.rows.some(r=>g.text.toLocaleLowerCase('es').includes(r.lemma)));
 }
 assert.deepEqual(formGroup(lessons[0],'preterite').rows.map(r=>r.lemma),['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron']);
 assert.deepEqual(formGroup(lessons[0],'perfect').rows.map(r=>r.lemma),['he tenido','has tenido','ha tenido','hemos tenido','habéis tenido','han tenido']);
 assert.equal(formGroup(lessons[0],'negative').rows[0].lemma,'no tengas');

});
