import test from 'node:test';import assert from 'node:assert/strict';
import {foundation} from '../src/content/foundation.js';import {readingPilot} from '../src/content/reading-pilot.js';
import {validatePack,approvedEntries,lessonEntries} from '../src/content/model.js';
import {bank} from '../src/content.js';import {segments} from '../src/explanations.js';import {inspectChunk,formsForWord} from '../src/details.js';
test('50 draft meanings are structurally valid and excluded from regular lessons',()=>{
 assert.equal(foundation.entries.length,50);assert.deepEqual(validatePack(foundation),[]);assert.throws(()=>approvedEntries(foundation),/not approved/);
 assert.equal(bank.length,34);assert.ok(bank.every(e=>!e.id.startsWith('f-')));
});
test('all expansion chunks reconstruct the sentence and resolve individual word annotations',()=>{
 for(const item of lessonEntries(foundation))for(const lang of ['es','fr','de']){
 const chunks=segments(item,lang);assert.equal(chunks.map(c=>c.text).join(''),item[lang]);
 for(const c of chunks.filter(c=>c.meaning))for(const word of inspectChunk(item,lang,c).words)assert.ok(word.meaning&&word.role,`${item.id}/${lang}/${word.text}`);
 }
});
test('complete paradigms cover six person-number slots and Spanish voseo',()=>{
 for(const pack of [readingPilot,foundation])for(const l of Object.values(pack.lexemes).filter(l=>l.pos==='verb')){
 assert.equal(l.paradigm.complete,true);for(const number of ['singular','plural'])for(const person of [1,2,3])assert.ok(l.forms.some(f=>f.number===number&&f.person===person));
 if(l.lang==='es')assert.ok(l.forms.some(f=>f.subject==='vos'));
 }
 const p=structuredClone(foundation);p.lexemes['es-write'].forms=p.lexemes['es-write'].forms.filter(f=>f.person!==1);assert.match(validatePack(p).join('\n'),/missing 1\/singular/);
});
test('syncretic forms highlight the grammatical subject rather than every identical spelling',()=>{
 const item=bank.find(e=>e.id==='c26'),chunk=segments(item,'fr').find(c=>c.text==='lis');
 const rows=formsForWord(inspectChunk(item,'fr',chunk).words[0]);assert.equal(rows.filter(r=>r.selected).length,1);assert.equal(rows.find(r=>r.selected).subject,'je');
 const writing=lessonEntries(foundation).find(e=>e.id==='f-write-letter');
 const french=segments(writing,'fr');assert.equal(writing.fr,'J’écris une lettre.');assert.equal(inspectChunk(writing,'fr',french[0]).words[0].meaning,'I');
});
test('German direct-object articles and Spanish person changes are preserved',()=>{
 const entries=lessonEntries(foundation);assert.equal(entries.find(e=>e.id==='f-write-letter').de,'Ich schreibe einen Brief.');assert.equal(entries.find(e=>e.id==='f-see-train').de,'Ich sehe den Zug.');assert.equal(entries.find(e=>e.id==='f-you-close').es,'Tú cierras la ventana.');
});
test('source checks remain draft and become stale when checked lexical facts change',()=>{
 assert.equal(Object.values(foundation.lexemes).filter(l=>l.evidence).length,114);
 for(const l of Object.values(foundation.lexemes)){assert.equal(l.review.status,'draft');assert.ok(l.sourceIds.length);}
 const changed=structuredClone(foundation);changed.lexemes['de-mother'].forms[1].text='Muttern';
 assert.match(validatePack(changed).join('\n'),/de-mother: source check is stale/);
 const gender=structuredClone(foundation);gender.lexemes['fr-egg'].gender='feminine';
 assert.match(validatePack(gender).join('\n'),/fr-egg: source check is stale/);
 assert.ok(foundation.entries.every(e=>Object.values(e.translations).every(t=>t.sourceIds.length)));
 assert.throws(()=>approvedEntries(foundation),/not approved/);
});
test('compound words explain their role without mislabelling prepositions as nouns or articles',()=>{
 const entries=lessonEntries(foundation),potato=entries.find(e=>e.id==='f-potato');
 const words=inspectChunk(potato,'fr',segments(potato,'fr')[0]).words;
 assert.equal(words.find(w=>w.text==='de').role,'Preposition');assert.equal(words.find(w=>w.text==='de').meaning,'of');
 assert.match(words.find(w=>w.text==='terre').note,/potato.*whole/);
 const pen=entries.find(e=>e.id==='f-want-pen');assert.equal(pen.en,'I want a ballpoint pen.');assert.equal(pen.fr,'Je veux un stylo à bille.');
 const phrase=segments(pen,'fr').find(c=>c.text==='un stylo à bille');assert.equal(phrase.meaning,'(a) ballpoint pen');
 assert.equal(inspectChunk(pen,'fr',phrase).words.find(w=>w.text==='à').role,'Preposition');
});
test('elided articles and gendered plural subjects retain their contextual qualifications',()=>{
 const egg=lessonEntries(foundation).find(e=>e.id==='f-egg');const word=inspectChunk(egg,'fr',segments(egg,'fr')[0]).words[0];
 assert.equal(word.meaning,'(the) egg');assert.match(word.role,/Elided article/);
 const they=foundation.entries.find(e=>e.id==='f-they-buy');assert.match(they.prompt,/male or mixed/);assert.match(they.translations.fr.wordDetails.Ils.note,/masculine or mixed/);
});
