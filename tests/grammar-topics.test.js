import test from 'node:test';
import assert from 'node:assert/strict';
import {bank,foundation} from '../src/content.js';
import {grammarTopicLabel} from '../src/content/grammar-topics.js';
import {lessonEntries,validatePack} from '../src/content/model.js';
import {makeLesson,questions} from '../src/engine.js';

test('legacy grammar targets are explicit and do not alter IDs or taught answers',()=>{
 const expected=[['c30','negation','I do not eat.','No como.'],['c31','noun-number','the books','los libros'],['c32','possessive-determiners','my house','mi casa'],['c33','question-words','Where?','¿Dónde?']];
 assert.deepEqual(bank.filter(e=>e.type==='grammar').map(e=>[e.id,e.grammarTopic,e.en,e.es]),expected);
 assert.equal(grammarTopicLabel(bank.find(e=>e.id==='c33')),'Question words');
 assert.equal(grammarTopicLabel(bank.find(e=>e.type==='sentence')),'');
});
test('foundation grammar topics survive lesson and recall adapters',()=>{
 const entries=lessonEntries(foundation),settings={languages:['es','fr','de'],noun:0,verb:0,sentence:0,grammar:4};
 const lesson=makeLesson(entries,settings,{});
 assert.equal(lesson.length,4);
 for(const item of lesson){assert.equal(item.grammarTopic,'subject-verb-agreement');assert.equal(grammarTopicLabel(item),'Subject–verb agreement');assert.ok(!item.en.startsWith('Agreement:'));}
 for(const q of questions(lesson,settings.languages))assert.equal(q.item.grammarTopic,'subject-verb-agreement');
});
test('structured grammar exercises reject absent or unknown topics',()=>{
 for(const topic of [undefined,'invented-topic']){
 const pack=structuredClone(foundation);pack.entries.find(e=>e.type==='grammar').grammarTopic=topic;
 assert.match(validatePack(pack).join('\n'),/recognized grammarTopic required/);
 }
});
