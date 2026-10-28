import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {restoreProgress,validProgress,createCourseProgress} from '../lemmas/progress.js';
import {exampleDraw} from '../lemmas/example-seed.js';
const deck=JSON.parse(readFileSync(new URL('../lemmas/data/deck.json',import.meta.url)));
test('course seed survives progress round-trips and old progress remains compatible',()=>{
 const course=createCourseProgress(deck);assert.ok(validProgress(course,deck));
 const restored=restoreProgress(JSON.parse(JSON.stringify(course)),deck);
 assert.equal(restored.exampleSeed,course.exampleSeed);
 assert.equal(exampleDraw(restored.exampleSeed,'corpes:ser:V'),exampleDraw(course.exampleSeed,'corpes:ser:V'));
 const legacy={...course};delete legacy.exampleSeed;
 assert.ok(validProgress(legacy,deck));assert.equal(restoreProgress(legacy,deck).exampleSeed,0);
 assert.equal(restoreProgress(legacy,deck).exampleSeed,restoreProgress(legacy,deck).exampleSeed);
 for(const exampleSeed of [-1,2**32,1.5,'123',null])assert.equal(validProgress({...course,exampleSeed},deck),false);
});
test('reset creates a new seed without carrying old progress or example settings',()=>{
 const previous={...createCourseProgress(deck),exampleSeed:17};previous.flows[0].index=4;
 const reset=createCourseProgress(deck);
 assert.equal(reset.flows[0].index,0);assert.ok(validProgress(reset,deck));
 assert.ok(Number.isInteger(reset.exampleSeed));
});
