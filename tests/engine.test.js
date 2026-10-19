import test from 'node:test';import assert from 'node:assert/strict';
import {makeLesson,schedule,questions} from '../src/engine.js';import {bank} from '../src/content.js';
const settings={languages:['es','fr','de'],noun:4,verb:2,grammar:1,sentence:2};
test('initial lesson contains requested types and all language pairs',()=>{const lesson=makeLesson(bank,settings,{},100);assert.equal(lesson.length,9);assert.equal(questions(lesson,settings.languages).length,27);});
test('overdue concepts survive zero new-item targets',()=>{assert.equal(makeLesson(bank,{...settings,noun:0,verb:0,grammar:0,sentence:0},{'c0:fr':{due:50}},100)[0].id,'c0');});
test('future reviews are not added to new material',()=>{const h=Object.fromEntries(settings.languages.map(l=>['c0:'+l,{due:200}]));assert.ok(!makeLesson(bank,settings,h,100).some(x=>x.id==='c0'));});
test('review schedule grows for success and resets for failure',()=>{assert.equal(schedule({interval:8,seen:3,correct:2},true,0).interval,16);assert.equal(schedule({interval:8},false,0).due,86400000);});
test('question shuffle preserves unique pairs',()=>{const q=questions(bank,['es','fr']);assert.equal(new Set(q.map(x=>x.item.id+x.lang)).size,bank.length*2);});

import {planSession,scheduleSession,key} from '../src/engine.js';
const sample=[{id:'old',type:'noun',unitId:'u01'},{id:'new',type:'noun',unitId:'u02'}];
test('due review isolates only due language pairs across units before any new material',()=>{
 const history={'old:es':{due:100,interval:2},'old:fr':{due:200,interval:4}};
 const plan=planSession(sample,settings,history,100,{unitId:'u02'});
 assert.equal(plan.kind,'review');
 assert.deepEqual(plan.pairs.map(q=>key(q.item.id,q.lang)),['old:es']);
 assert.deepEqual(plan.items.map(i=>i.id),['old']);
 const zero=planSession(sample,{...settings,noun:0,verb:0,grammar:0,sentence:0},history,100);
 assert.equal(zero.pairs.length,1);
});
test('after review, new learning includes only unseen languages and keeps future reviews untouched',()=>{
 const history={'old:es':{due:100,interval:2},'old:fr':{due:200,interval:4}};
 const review=planSession(sample,settings,history,100);
 const updated=scheduleSession(history,review.pairs,{'old:es':true},100);
 assert.equal(updated['old:es'].interval,4);
 assert.deepEqual(updated['old:fr'],history['old:fr']);
 assert.equal(history['old:es'].due,100);
 assert.equal(updated['old:de'],undefined);
 const fresh=planSession(sample,{...settings,noun:1},updated,100,{unitId:'u01'});
 assert.equal(fresh.kind,'new');
 assert.deepEqual(fresh.pairs.map(q=>key(q.item.id,q.lang)),['old:de']);
 const saved=scheduleSession(updated,fresh.pairs,{'old:de':false},100);
 assert.equal(saved['old:de'].interval,1);
 assert.deepEqual(saved['old:es'],updated['old:es']);
});
test('new learning respects unit targets and disabled languages; exhausted units return empty',()=>{
 const plan=planSession(sample,{...settings,languages:['fr'],noun:1},{'old:es':{due:0}},100,{unitId:'u02'});
 assert.equal(plan.kind,'new');assert.deepEqual(plan.pairs.map(q=>key(q.item.id,q.lang)),['new:fr']);
 const empty=planSession(sample,{...settings,languages:['fr']},{'new:fr':{due:200}},100,{unitId:'u02'});
 assert.deepEqual(empty.pairs,[]);
});
test('session scheduling uses first-attempt result once and never advances an untested or future pair',()=>{
 const pairs=[{item:sample[0],lang:'es'},{item:sample[0],lang:'es'},{item:sample[0],lang:'fr'},{item:sample[1],lang:'de'}];
 const history={'old:es':{due:0,interval:8,seen:3},'old:fr':{due:1000,interval:8}};
 const updated=scheduleSession(history,pairs,{'old:es':false,'old:fr':true},100);
 assert.equal(updated['old:es'].interval,1);assert.equal(updated['old:es'].seen,4);
 assert.deepEqual(updated['old:fr'],history['old:fr']);assert.equal(updated['new:de'],undefined);
});
