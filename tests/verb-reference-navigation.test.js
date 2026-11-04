import test from 'node:test';
import assert from 'node:assert/strict';
import {stepReferenceForm,stepReferenceChart} from '../lemmas/verb-accordion.js';
const lessons=[{rows:[1,2,3,4,5,6]},{rows:[]},{rows:[1,2,3,4]}];
test('reference form navigation crosses tense boundaries and skips empty paradigms',()=>{
 assert.deepEqual(stepReferenceForm(lessons,0,5,1),{active:2,row:0});
 assert.deepEqual(stepReferenceForm(lessons,2,0,-1),{active:0,row:5});
 assert.deepEqual(stepReferenceForm(lessons,1,0,-1),{active:0,row:5});
});
test('reference wraps only at the ends of the complete form inventory',()=>{
 assert.deepEqual(stepReferenceForm(lessons,2,3,1),{active:0,row:0});
 assert.deepEqual(stepReferenceForm(lessons,0,0,-1),{active:2,row:3});
 assert.deepEqual(stepReferenceForm(lessons,0,2,1),{active:0,row:3});
});

test('tense jumps preserve the person, including reordered or restricted inventories',()=>{
 const groups=[{rows:['yo','tú','él'].map(sourceLabel=>({sourceLabel}))},{rows:['tú','él'].map(sourceLabel=>({sourceLabel}))}];
 assert.deepEqual(stepReferenceChart(groups,0,1,1),{active:1,row:0});
 assert.deepEqual(stepReferenceChart(groups,1,1,-1),{active:0,row:2});
 assert.deepEqual(stepReferenceChart(groups,0,0,1),{active:1,row:0});
});
