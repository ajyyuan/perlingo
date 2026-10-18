import test from 'node:test';import assert from 'node:assert/strict';
import {makeLesson,schedule,finishRound,questions} from '../src/engine.js';import {bank} from '../src/content.js';
const settings={languages:['es','fr','de'],noun:4,verb:2,grammar:1,sentence:2};
test('initial lesson contains requested types and all language pairs',()=>{const lesson=makeLesson(bank,settings,{},100);assert.equal(lesson.length,9);assert.equal(questions(lesson,settings.languages).length,27);});
test('overdue concepts survive zero new-item targets',()=>{assert.equal(makeLesson(bank,{...settings,noun:0,verb:0,grammar:0,sentence:0},{'c0:fr':{due:50}},100)[0].id,'c0');});
test('future reviews are not added to new material',()=>{const h=Object.fromEntries(settings.languages.map(l=>['c0:'+l,{due:200}]));assert.ok(!makeLesson(bank,settings,h,100).some(x=>x.id==='c0'));});
test('review schedule grows for success and resets for failure',()=>{assert.equal(schedule({interval:8,seen:3,correct:2},true,0).interval,16);assert.equal(schedule({interval:8},false,0).due,86400000);});
test('one mistake resets consecutive perfect rounds',()=>{assert.equal(finishRound(2,1),0);assert.equal(finishRound(2,0),3);});
test('question shuffle preserves unique pairs',()=>{const q=questions(bank,['es','fr']);assert.equal(new Set(q.map(x=>x.item.id+x.lang)).size,bank.length*2);});
