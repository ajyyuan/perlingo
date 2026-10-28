import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {combineNotes} from '../lemmas/notes-library.js';
import {sentenceMarkup} from '../lemmas/word-help.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const bank=read('lemmas/data/context.json');
const audit=read('data/spanish-lemmas/course-audit-2026-10-27.json');
const library=combineNotes(read('lemmas/data/notes.json'),bank);
test('title don does not teach the gift-sense article or plural',()=>{
 const n=library.notes.find(n=>n.id==='corpes:don:N');
 assert.deepEqual(n.forms,[['before a male first name','don'],['before a female first name','doña']]);
 assert.ok(!n.forms.some(([,form])=>form==='dones'||form==='el don'));
 assert.match(n.pattern,/first name/);
 assert.match(n.more,/separate gift or talent/);
 assert.ok(bank.contexts.find(c=>c.id===n.id).answers.includes('Don'));
});
test('cambia translation preserves the grammatical subject across all shared exercises',()=>{
 const contexts=bank.contexts.filter(c=>c.example.text==='Ahí cambia mi dirección con cada paso.');
 assert.equal(contexts.length,3);
 for(const c of contexts)assert.equal(c.example.translation,'There, my direction changes with each step.');
 const n=library.notes.find(n=>n.id==='corpes:cambiar:V');
 assert.equal(n.examples[0].translation,contexts[0].example.translation);
});
test('audited ambiguous hover words include the taught phrase sense',()=>{
 for(const fix of audit.corrections.hoverHints){
  const contexts=bank.contexts.slice(50).filter(c=>c.example.chunks.some(ch=>
   [...ch.text.matchAll(/\p{L}+/gu)].length>1 &&
   [...ch.text.matchAll(/\p{L}+/gu)].some(w=>w[0].toLocaleLowerCase('es')===fix.word)));
  assert.ok(contexts.length,fix.word);
  for(const c of contexts){
   assert.equal(c.wordMeanings[fix.word],fix.after,`${c.id}: ${fix.word}`);
   assert.ok(sentenceMarkup(c,true).includes(fix.after.replaceAll('&','&amp;')),fix.word);
  }
 }
 // The original pilot's verb uses must retain their original meanings.
 assert.match(sentenceMarkup(bank.contexts[13],true),/I\) walk|I walk/);
});
test('accuracy pass preserves the deck and every target and accepted-answer list',()=>{
 const bytes=readFileSync(new URL('../lemmas/data/deck.json',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),audit.beforeHashes['lemmas/data/deck.json']);
 const originalAnswers=read('data/spanish-lemmas/pronoun-recall-audit.json').originalAnswers;
 const answers=bank.contexts.map(c=>({id:c.id,target:c.target,answers:originalAnswers[c.id]||c.answers}));
 assert.equal(createHash('sha256').update(JSON.stringify(answers)).digest('hex'),audit.answerIdentitySha256);
});
