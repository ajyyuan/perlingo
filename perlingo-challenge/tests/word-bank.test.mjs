import {audioException} from '../scripts/audio-exceptions.mjs';
import {createHash} from 'node:crypto';
import {getRecording} from '../public/recordings.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {firstTen} from '../data/word-bank/first-ten.js';
import {languages,packs} from '../public/content.js';
import {matchesAnswer,matchesSpokenAnswer} from '../public/engine.js';
const evidence=JSON.parse(readFileSync(new URL('../data/word-bank/first-ten-checks.json',import.meta.url)));
const entry=(pack,id)=>firstTen.find(p=>p.id===pack).entries.find(e=>e.id===id);
test('first noun batch covers all 50 languages with matching source evidence',()=>{
 assert.equal(firstTen.length,10);assert.equal(evidence.entries.length,500);
 for(const p of firstTen){assert.equal(p.entries.length,50);assert.deepEqual(p.entries.map(e=>e.id),languages.map(l=>l.id));for(const e of p.entries){const r=evidence.entries.find(r=>r.pack===p.id&&r.language===e.id);assert(r);assert.equal(e.word,r.word);assert.deepEqual(e.accepted,r.accepted);assert(r.sourceRevision);assert(e.reading);assert(matchesAnswer(e.word,e.accepted,e.id));assert.equal(e.ipa,null);}}
});
test('noun senses avoid neighboring meanings and preserve chosen regional forms',()=>{
 assert.equal(entry('apple','te').word,'ఆపిల్');assert(!entry('apple','te').accepted.includes('కాయ'));
 assert.equal(entry('star','mr').word,'तारा');assert.equal(entry('star','kn').word,'ನಕ್ಷತ್ರ');
 assert.equal(entry('milk','hr').word,'mlijeko');assert.equal(entry('milk','sr').word,'млеко');
 assert.equal(entry('moon','hr').word,'mjesec');assert.equal(entry('moon','sr').word,'месец');
 assert.equal(entry('dog','gu').word,'કૂતરો');assert(!entry('dog','gu').accepted.includes('કુતરો'));
 assert.equal(entry('book','th').word,'หนังสือ');assert(!entry('book','th').accepted.includes('สมุด'));
 for(const id of ['zh','ja','ko'])assert.match(entry('milk',id).note,/Cow/);
 assert(!matchesAnswer('காடு',entry('tree','ta').accepted,'ta')); // forest is not tree
 assert(!matchesAnswer('星座',entry('star','zh').accepted,'zh')); // constellation is not star
});

test('Norwegian tree accepts digit formatting only in spoken recognition',()=>{const e=entry('tree','no');assert(matchesSpokenAnswer('3.',e));assert(!matchesAnswer('3',e.accepted,e.id));assert(!matchesSpokenAnswer('30',e));assert(!matchesSpokenAnswer('3',entry('tree','da')));});

test('ten noun packs have exact-file audio with only hash-bound approved exceptions',()=>{
 const sources=JSON.parse(readFileSync(new URL('../generated-audio-sources.json',import.meta.url))),checks=JSON.parse(readFileSync(new URL('../generated-audio-checks.json',import.meta.url))).rows;
 assert.equal(packs.length,12);
 for(const p of firstTen){const playable=packs.some(x=>x.id===p.id);assert.equal(playable,true);if(playable)assert.deepEqual(packs.find(x=>x.id===p.id),p);
 for(const e of p.entries){const source=sources.find(s=>s.pack===p.id&&s.language===e.id);const bytes=readFileSync(new URL('../'+(source.stagedFile||('public'+source.file)),import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),source.sha256);if(playable){assert(getRecording(p.id,e.id));assert(audioException(source)||checks.some(c=>c.pack===p.id&&c.language===e.id&&c.sha256===source.sha256&&c.provider==='soniox'&&c.exactMatch&&!c.error));}else{assert(!getRecording(p.id,e.id));assert(source.stagedFile);}}}
});

test('audio exceptions cannot approve different words or replacement bytes',()=>{const sources=JSON.parse(readFileSync(new URL('../generated-audio-sources.json',import.meta.url)));assert.equal(sources.filter(audioException).length,2);for(const s of sources.filter(audioException)){assert(!audioException({...s,sha256:'changed'}));assert(!audioException({...s,word:'changed'}));}});
