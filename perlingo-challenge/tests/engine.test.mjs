import test from 'node:test';
import assert from 'node:assert/strict';
import {Round,matchesAnswer,normalize} from '../public/engine.js';
import {languages,packs} from '../public/content.js';
test('pass and timeout cycle to back; correct removes and cannot double-score',()=>{
 const r=new Round(['en','fr','es'],{seconds:10,random:()=>.999});
 let c=r.begin(0);r.finish(c.token,'pass',100);assert.deepEqual(r.queue,['fr','es','en']);
 c=r.begin(200);r.finish(c.token,'timeout',3200);assert.deepEqual(r.queue,['es','en','fr']);
 c=r.begin(3300);assert.equal(r.finish(c.token,'correct',4000),true);assert.equal(r.finish(c.token,'correct',4100),false);assert.deepEqual(r.correct,['es']);assert.equal(r.remaining,6200);
});
test('late verdicts charge only capture time; stale card tokens ignored',()=>{
 const r=new Round(['en','fr'],{seconds:5,random:()=>.999});const c=r.begin(0);r.finish(c.token,'correct',4200,'bread');assert.equal(r.remaining,2000);const next=r.begin(5000);assert.equal(next.duration,2000);assert.equal(r.finish(c.token,'correct',5200),false);r.finish(next.token,'timeout',9000);assert.equal(r.done,true);
});
test('technical interruption restarts without changing score or budget',()=>{const r=new Round(['en']);r.begin(10);r.cancel();assert.equal(r.remaining,60000);assert.equal(r.attempts.length,0);assert.equal(r.begin(400).id,'en');});
test('self correction accepted, partial substrings and similar spellings rejected',()=>{
 assert(matchesAnswer('pan… um… pão!',['pão'],'pt'));assert(!matchesAnswer('pao',['pão'],'pt'));assert(!matchesAnswer('pants',['pan'],'es'));assert(!matchesAnswer('pain',['pan'],'es'));assert(!matchesAnswer('水果',['水'],'zh'));assert(matchesAnswer('Bread!',['bread'],'en'));assert(matchesAnswer('bánh mì',['bánh mì'],'vi'));
});
test('optional Semitic vocalization is normalized, lexical accents preserved',()=>{assert.equal(normalize('خُبْز','ar'),'خبز');assert(matchesAnswer('לֶחֶם',['לחם'],'he'));assert.notEqual(normalize('pão','pt'),normalize('pao','pt'));});
test('all 50 languages have complete draft content, sources and accepted taught answers',()=>{
 assert.equal(languages.length,50);assert.equal(new Set(languages.map(l=>l.id)).size,50);
 for(const pack of packs){assert.equal(pack.entries.length,50);for(const e of pack.entries){assert(languages.some(l=>l.id===e.id));assert(e.word&&e.reading&&e.source.startsWith('https://'));assert.equal(e.status,'draft');assert(matchesAnswer(e.word,e.accepted,e.id));}}
});
test('Malayalam bread uses sourced rotti, not a narrower appam pancake sense',()=>{assert.equal(packs[0].entries.find(e=>e.id==='ml').word,'റൊട്ടി');});
test('a one-language pass can return immediately; clearing the queue ends round',()=>{const r=new Round(['en']);let c=r.begin(0);r.finish(c.token,'pass',5);c=r.begin(6);assert.equal(c.id,'en');r.finish(c.token,'correct',10);assert(r.done);assert.equal(r.begin(20),null);});
