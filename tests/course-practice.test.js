import test from 'node:test';
import assert from 'node:assert/strict';
import {courseLessonEntries,coursePacks} from '../src/content/course/index.js';
import {learningBank,practiceItems,contrastChoices} from '../src/course-practice.js';
import {parseAuthoredChunks} from '../src/content/course/examples.js';
import {validatePack} from '../src/content/model.js';
test('held-out and comprehension examples are excluded from learning, even when due',()=>{
 const bank=courseLessonEntries(),learn=learningBank(bank);
 assert.ok(learn.length>0);assert.ok(learn.every(i=>!['transfer','contrast'].includes(i.mode)));
 const transfers=practiceItems(bank,'u16','transfer');assert.equal(transfers.length,6);
 assert.ok(transfers.every(i=>!learn.some(l=>l.id===i.id)));
});
test('each contrast retains its correct English meaning and one different alternative',()=>{
 for(const item of courseLessonEntries().filter(i=>i.mode==='contrast')){
  const options=contrastChoices(item);assert.equal(new Set(options).size,2);assert.ok(options.includes(item.en));
 }
 const p=structuredClone(coursePacks.find(p=>p.id==='course-u02'));p.entries.find(e=>e.mode==='contrast').contrastOptions=['same','same'];assert.ok(validatePack(p).some(s=>s.includes('contrast requires')));
});
test('authored markers preserve elision and punctuation and reject unexplained text',()=>{
 const options={summary:'Example',detail:'Example detail',grammarId:'fr.example'};
 const parts=parseAuthoredChunks('J’{I}ai{have} un livre{(a) book}.',options);
 assert.equal(parts.map(p=>p.text).join(''),'J’ai un livre.');
 assert.deepEqual(parts.filter(p=>p.meaning).map(p=>p.text),['J’','ai','un livre']);
 assert.throws(()=>parseAuthoredChunks('Je{I} broken',options),/Unexplained/);
});
