import test from 'node:test';import assert from 'node:assert/strict';
import {readingPilot} from '../src/content/reading-pilot.js';
import {validatePack,approvedEntries,lessonEntries} from '../src/content/model.js';
import {bank} from '../src/content.js';import {segments} from '../src/explanations.js';
const copy=()=>structuredClone(readingPilot);
test('pilot migration preserves stable IDs and taught translations',()=>{
 assert.deepEqual(validatePack(readingPilot),[]);
 assert.equal(bank.length,34);assert.equal(new Set(bank.map(e=>e.id)).size,34);
 for(const e of lessonEntries(readingPilot)){assert.deepEqual(bank.find(item=>item.id===e.id),e);for(const lang of ['es','fr','de'])assert.deepEqual(segments(e,lang),readingPilot.entries.find(item=>item.id===e.id).translations[lang].chunks);}
 assert.deepEqual(lessonEntries(readingPilot).map(e=>e.id),['c3','c19','c26']);
 assert.equal(bank.find(e=>e.id==='c26').es,'Leo un libro.');
});
test('draft content cannot pass the release gate',()=>{assert.throws(()=>approvedEntries(readingPilot),/not approved/);});
test('approval requires reviewer, evidence, and reuse review',()=>{
 const p=copy();for(const e of p.entries)for(const t of Object.values(e.translations))t.review.status='approved';
 assert.ok(validatePack(p,{release:true}).some(e=>e.includes('reviewer and date')));
 assert.ok(validatePack(p,{release:true}).some(e=>e.includes('evidence sources required')));
 assert.ok(validatePack(p,{release:true}).some(e=>e.includes('reuse terms not reviewed')));
});
test('validator rejects missing languages, dangling references, and duplicate IDs',()=>{
 const p=copy();delete p.entries[0].translations.fr;p.entries[1].translations.es.lexemeIds=['missing'];p.entries.push(p.entries[0]);
 const errors=validatePack(p).join('\n');assert.match(errors,/missing fr/);assert.match(errors,/invalid reference missing/);assert.match(errors,/Duplicate/);
});
test('validator rejects broken chunks and cross-language word references',()=>{
 const p=copy();p.entries[0].translations.es.chunks[0].text='other';p.entries[1].translations.es.lexemeIds=['fr-lire'];
 const errors=validatePack(p).join('\n');assert.match(errors,/reconstruct/);assert.match(errors,/invalid reference fr-lire/);
});
test('release gate accepts complete approval metadata without altering content',()=>{
 // Synthetic review metadata exercises the gate; it does not approve the real pilot.
 const p=copy();for(const source of Object.values(p.sources))source.reuseReviewed=true;
 for(const record of [...Object.values(p.lexemes),...Object.values(p.grammar),...p.entries.flatMap(e=>Object.values(e.translations))]){
  record.review={status:'approved',author:'Fixture author',reviewer:'Fixture reviewer',reviewedAt:'2026-10-18'};
  if(!record.sourceIds.length)record.sourceIds=[Object.keys(p.sources).find(id=>id.startsWith(record.lang+'-'))];
 }
 assert.equal(approvedEntries(p).length,3);assert.equal(readingPilot.entries[0].translations.es.review.status,'draft');
});
