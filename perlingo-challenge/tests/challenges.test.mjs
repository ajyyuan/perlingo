import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {calendar,todayET,challengeFor,archiveDays,challengeSettings,challengeRandom} from '../public/challenges.js';
import {languages,packs} from '../public/content.js';
import {getRecording} from '../public/recordings.js';
import {shuffle} from '../public/engine.js';
test('Eastern date changes at local midnight in daylight and standard time',()=>{
 assert.equal(todayET(new Date('2026-10-22T03:59:59Z')),'2026-10-21');
 assert.equal(todayET(new Date('2026-10-22T04:00:00Z')),'2026-10-22');
 assert.equal(todayET(new Date('2026-12-22T04:59:59Z')),'2026-12-21');
 assert.equal(todayET(new Date('2026-12-22T05:00:00Z')),'2026-12-22');
 for(const instant of ['2026-03-08T06:59:59Z','2026-03-08T07:00:00Z'])assert.equal(todayET(new Date(instant)),'2026-03-08');
 for(const instant of ['2026-11-01T05:59:59Z','2026-11-01T06:00:00Z'])assert.equal(todayET(new Date(instant)),'2026-11-01');
});
test('demo archive has two past dates and excludes today and future',()=>{
 assert.deepEqual(archiveDays('2026-10-21').map(c=>[c.date,c.pack,c.demo]),[['2026-10-20','tree',true],['2026-10-19','moon',true]]);
 assert.equal(challengeFor('2026-10-21','2026-10-21').pack,'bread');
 assert.equal(challengeFor('2026-10-22','2026-10-21'),null);
 assert.equal(challengeFor('2026-10-31','2026-10-31'),null);
});
test('scheduled rules override every freeplay setting without mutating preferences',()=>{
 const prefs={study:180,recall:120,window:8,mode:'typed',provider:'soniox',script:'Latin',languageIds:['en'],pack:'water',layout:'compact'};
 const before=structuredClone(prefs),c=calendar[0],s=challengeSettings(prefs,c,languages);
 assert.deepEqual(prefs,before);assert.equal(s.study,120);assert.equal(s.recall,60);assert.equal(s.window,3);assert.equal(s.mode,'voice');assert.equal(s.provider,'elevenlabs');assert.equal(s.script,'All scripts');assert.equal(s.languageIds.length,50);assert.equal(s.pack,c.pack);assert.equal(s.layout,'compact');
 assert(Object.isFrozen(c.rules));
});
test('each scheduled word has 50 entries and selected recordings; dates are unique',()=>{
 assert.equal(new Set(calendar.map(c=>c.date)).size,calendar.length);
 for(const c of calendar){const p=packs.find(p=>p.id===c.pack);assert(p);for(const l of languages){assert(p.entries.some(e=>e.id===l.id));assert(getRecording(c.pack,l.id));}}
});
test('daily and archive share a stable initial queue for the same date',()=>{
 const ids=languages.map(l=>l.id);assert.deepEqual(shuffle(ids,challengeRandom('2026-10-21')),shuffle(ids,challengeRandom('2026-10-21')));assert.notDeepEqual(shuffle(ids,challengeRandom('2026-10-21')),shuffle(ids,challengeRandom('2026-10-22')));
});
test('candidate inventory and historical Sun snapshot preserve review gaps',()=>{
 const read=name=>JSON.parse(readFileSync(new URL(`../data/word-bank/${name}.json`,import.meta.url)));
 const bank=read('candidates').entries,sun=read('sun');assert(bank.length>=400);assert.equal(new Set(bank.map(e=>e.id)).size,bank.length);assert(bank.every(e=>e.partOfSpeech==='noun'));assert.equal(sun.entries.length,50);assert.equal(new Set(sun.entries.map(e=>e.id)).size,50);assert(sun.source.revision);assert(sun.entries.every(e=>e.sourceForms.length&&e.taughtForm===null&&e.accepted.length===0));assert(packs.some(p=>p.id==='sun'));assert(packs.some(p=>p.id==='moon'));assert(packs.some(p=>p.id==='tree'));
});
