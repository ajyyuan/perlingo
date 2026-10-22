import test from 'node:test';
import assert from 'node:assert/strict';
import {Round,matchesAnswer,normalize,matchesSpokenAnswer,spokenVerdict} from '../public/engine.js';
import {languages,packs} from '../public/content.js';
test('pass and timeout cycle to back; correct removes and cannot double-score',()=>{
 const r=new Round(['en','fr','es'],{seconds:10,random:()=>.999});
 let c=r.begin(0);r.finish(c.token,'pass',100);assert.deepEqual(r.queue,['fr','es','en']);
 c=r.begin(200);r.finish(c.token,'timeout',3200);assert.deepEqual(r.queue,['es','en','fr']);
 c=r.begin(3300);assert.equal(r.finish(c.token,'correct',4000),true);assert.equal(r.finish(c.token,'correct',4100),false);assert.deepEqual(r.correct,['es']);assert.equal(r.remaining,6200);
});
test('late verdicts charge only capture time; stale card tokens ignored',()=>{
 const r=new Round(['en','fr'],{seconds:5,windowSeconds:3,random:()=>.999});const c=r.begin(0);r.finish(c.token,'correct',4200,'bread');assert.equal(r.remaining,2000);const next=r.begin(5000);assert.equal(next.duration,2000);assert.equal(r.finish(c.token,'correct',5200),false);r.finish(next.token,'timeout',9000);assert.equal(r.done,true);
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

test('untimed practice never expires, cycles passes, and completes after every correct answer',()=>{
 const r=new Round(['en','fr'],{untimed:true,random:()=>.999});
 const first=r.begin(0);assert.equal(first.duration,Infinity);
 assert.equal(r.finish(first.token,'timeout',3600000),false);
 assert.equal(r.finish(first.token,'pass',3600000),true);
 assert.equal(r.remaining,Infinity);assert.equal(r.done,false);
 const second=r.begin(3600000);r.finish(second.token,'correct',7200000,'pain');
 r.cancel();const last=r.begin(9000000);r.finish(last.token,'correct',10000000,'bread');
 assert.equal(r.done,true);assert.equal(r.attempts.length,3);assert(r.attempts.every(a=>Number.isFinite(a.elapsed)));
});


test('reported Czech Bread transcript tolerates omitted accent only in speech',()=>{
 const bread=packs.find(p=>p.id==='bread').entries.find(e=>e.id==='cs');
 for(const text of ['Chleb.','chléb','chleba'])assert(matchesSpokenAnswer(text,bread));
 assert(!matchesAnswer('chleb',bread.accepted,'cs'));
 assert(!matchesSpokenAnswer('chlebník',bread));
 assert(!matchesSpokenAnswer('voda',bread));
 assert(!matchesSpokenAnswer('chleb',packs.find(p=>p.id==='water').entries.find(e=>e.id==='cs')));
 assert.equal(spokenVerdict({text:'Chleb.',final:false},bread).accepted,false);
 assert.equal(spokenVerdict({text:'Chleb.',final:true},bread).accepted,true);
 assert.equal(spokenVerdict({text:'voda',final:true},bread).label,'Not matched — try again');
 assert.equal(spokenVerdict({text:'',final:true},bread).label,'Listening…');
});

test('shared speech tolerance handles accents, spacing and bounded errors without changing typed matching',()=>{
 const entry=(id,word)=>({id,accepted:[word]});
 for(const [id,target,heard] of [['cs','chléb','Chleb.'],['pt','pão','pao'],['fr','étoile','etoile'],['vi','bánh mì','banhmi'],['el','νερό','νερο'],['en','bread','bred'],['ru','молоко','малоко'],['hi','किताबघर','किताबघर']])assert(matchesSpokenAnswer(heard,entry(id,target)),`${id}: ${heard}`);
 for(const [id,target,heard] of [['es','pan','pain'],['zh','水','水果'],['en','cat','car'],['en','bread','tree'],['hi','पानी','पनी']])assert(!matchesSpokenAnswer(heard,entry(id,target)),`${id}: ${heard}`);
 assert(!matchesAnswer('pao',['pão'],'pt'));
 assert(!matchesSpokenAnswer('breads',entry('en','bread'),['breads']));
});
test('every taught answer passes speech matching with the full same-language word bank',()=>{
 for(const pack of packs)for(const entry of pack.entries){
  const competitors=packs.filter(p=>p!==pack).flatMap(p=>p.entries.find(e=>e.id===entry.id).accepted);
  assert(matchesSpokenAnswer(entry.word,entry,competitors),`${pack.id}/${entry.id}`);
 }
});
test('speech tolerance introduces no wrong-pack acceptance across the current 6600 language pairs',()=>{
 for(const pack of packs)for(const entry of pack.entries){
  const others=packs.filter(p=>p!==pack).map(p=>p.entries.find(e=>e.id===entry.id));
  const competitors=others.flatMap(e=>e.accepted);
  for(const other of others)if(!matchesAnswer(other.word,entry.accepted,entry.id))assert(!matchesSpokenAnswer(other.word,entry,competitors),`${entry.id}: ${other.word} for ${entry.word}`);
 }
});

test('jumping reorders unanswered cards without resetting budget or allowing stale scores',()=>{
 const r=new Round(['en','fr','cs'],{seconds:60,windowSeconds:5,random:()=>.999});
 const a=r.begin(0);assert.equal(r.prioritize('cs'),false);
 r.finish(a.token,'pass',1700);assert(r.prioritize('cs'));assert.equal(r.remaining,58300);
 const b=r.begin(2000);assert.equal(b.id,'cs');assert.equal(r.finish(a.token,'correct',2100),false);
 r.finish(b.token,'correct',3000);assert.equal(r.prioritize('cs'),false);assert.equal(r.prioritize('unknown'),false);
 assert(r.prioritize('en'));assert.deepEqual(r.queue,['en','fr']);assert.deepEqual(r.correct,['cs']);assert.equal(r.remaining,57300);
});
test('untimed jumps keep infinite budget; timed exhaustion cannot reopen a round',()=>{
 const r=new Round(['en','fr'],{untimed:true,random:()=>.999});const c=r.begin(0);r.finish(c.token,'pass',1000000);assert(r.prioritize('fr'));assert.equal(r.remaining,Infinity);
 const timed=new Round(['en','fr'],{seconds:1,random:()=>.999});const t=timed.begin(0);timed.finish(t.token,'pass',2000);assert.equal(timed.prioritize('fr'),false);assert.equal(timed.begin(3000),null);
});
test('jumped-to cards advance clockwise through visible dots, including wrap and answered gaps',()=>{
 const r=new Round(['en','fr','de','es','ja'],{untimed:true,random:()=>.999});
 let c=r.begin(0);r.finish(c.token,'pass',1);r.prioritize('de');
 c=r.begin(2);r.finish(c.token,'correct',3);assert.equal(r.begin(4).id,'es');r.cancel();
 r.prioritize('ja');c=r.begin(5);r.finish(c.token,'pass',6);assert.equal(r.begin(7).id,'en');r.cancel();
 r.prioritize('fr');c=r.begin(8);r.finish(c.token,'correct',9);assert.equal(r.begin(10).id,'es');
 assert.deepEqual(r.initial,['en','fr','de','es','ja']);
});

test('shared recall clock allows long answers and carries time across passes',()=>{
 const r=new Round(['en','fr'],{seconds:120,random:()=>.999});
 let c=r.begin(0);assert.equal(c.duration,120000);
 r.finish(c.token,'pass',15000);assert.equal(r.remaining,105000);
 c=r.begin(16000);assert.equal(c.duration,105000);
 r.finish(c.token,'timeout',121000);assert(r.done);assert.equal(r.begin(122000),null);
});
