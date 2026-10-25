import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answer,createSession,restore,idsForSet,KEY} from '../lemmas/session.js';
const deck=JSON.parse(readFileSync(new URL('../lemmas/data/deck.json',import.meta.url)));
test('edited CORPES deck preserves source evidence and distinguishes grammatical uses',()=>{
 const raw=readFileSync(new URL('../data/spanish-lemmas/corpes-5000-source.tsv',import.meta.url),'utf8').trimEnd().split(/\r?\n/).slice(2).map(line=>line.split('\t'));
 assert.equal(deck.length,1500);assert.equal(new Set(deck.map(c=>c.id)).size,1500);
 assert.equal(new Set(deck.map(c=>c.lemma+':'+c.sourceTag)).size,1500);
 for(let s=0;s<30;s++)assert.equal(idsForSet(deck,s).length,50);
 deck.forEach((c,i)=>{
  assert.equal(c.rank,i+1);assert.equal(c.id,`corpes:${c.sourceLemma}:${c.sourceTag}`);
  const source=raw[c.sourceRank-1];assert.equal(source[0],c.sourceLemma);assert.equal(source[1],c.sourceTag);assert.equal(Number(source[2]),c.count);
  assert.ok(c.meanings.length);assert.ok(c.meanings.every(m=>typeof m==='string'&&m.trim()&&!/\{\{|\[\[|<t:/.test(m)));
  if(i)assert.ok(deck[i-1].sourceRank<c.sourceRank);
 });
 const byId=new Map(deck.map(c=>[c.id,c]));
 assert.match(byId.get('corpes:poder:V').meanings.join(' '),/able/);
 assert.match(byId.get('corpes:poder:N').meanings.join(' '),/power/);
 assert.match(byId.get('corpes:qué:W').meanings[0],/what/);
 assert.match(byId.get('corpes:qué:R').meanings[0],/how/);
 for(const [source,display] of Object.entries({músico:'música',característico:'característica',salido:'salida',listo:'lista',perspectivo:'perspectiva',deudo:'deuda',caído:'caída'})){
  const c=byId.get(`corpes:${source}:N`);assert.equal(c.lemma,display);assert.ok(c.sourceNote.includes(source));assert.ok(c.dictionary.includes(encodeURI(display))||c.dictionary.includes(display));
 }
 assert.ok(!byId.has('corpes:intereses:N'));assert.match(byId.get('corpes:interés:N').meanings.join(' '),/intereses/);
 assert.equal(deck.at(-1).lemma,'religioso');
 const evidence=JSON.parse(readFileSync(new URL('../data/spanish-lemmas/form-evidence.json',import.meta.url)));
 for(const c of deck)for(const form of c.forms)assert.ok(evidence.matches.some(e=>e.form===form&&e.lemma===c.lemma&&e.pos==='v'));
 assert.ok(!byId.get('corpes:ser:V').forms.includes('sé'));assert.ok(byId.get('corpes:saber:V').forms.includes('sé'));
});
test('CORPES progress starts separately and identical spellings do not share ratings',()=>{
 assert.equal(KEY,'perlingo-lemmas-corpes-v2');
 assert.deepEqual(restore({version:1,known:{el:true},sessions:{}},deck).known,{});
 const saved=restore({version:2,known:{'corpes:poder:V':true,'corpes:poder:N':false},sessions:{}},deck);
 assert.equal(saved.known['corpes:poder:V'],true);assert.equal(saved.known['corpes:poder:N'],false);
});
test('unrevealed cards cannot be scored; only misses repeat and complete after recall',()=>{
 let s=createSession(['a','b','c']);assert.deepEqual(answer(s,true),s);
 s=answer({...s,revealed:true},false);s=answer({...s,revealed:true},true);s=answer({...s,revealed:true},false);
 assert.deepEqual(s.queue,['a','c']);assert.equal(s.round,2);assert.equal(s.index,0);assert.equal(s.revealed,false);
 s=answer({...s,revealed:true},true);s=answer({...s,revealed:true},true);assert.equal(s.done,true);assert.equal(s.index,2);assert.deepEqual(answer(s,false),s);
});
test('serialized progress resumes exactly and rejects invalid or cross-set queues',()=>{
 const ids=idsForSet(deck,0);let s=createSession(ids);s=answer({...s,revealed:true},false);s.revealed=true;
 const raw={version:2,known:{[ids[0]]:false,[ids[1]]:true,foreign:true},sessions:{0:s},set:0,day:0};
 const restored=restore(JSON.parse(JSON.stringify(raw)),deck);assert.deepEqual(restored.sessions[0],s);assert.equal(restored.known.foreign,undefined);
 assert.deepEqual(restore({...raw,sessions:{0:{...s,queue:idsForSet(deck,1)}}},deck).sessions,{});
 assert.deepEqual(restore({...raw,sessions:{0:{...s,index:500}}},deck).sessions,{});
 assert.deepEqual(restore({...raw,sessions:{0:{...s,misses:[ids[20]]}}},deck).sessions,{});
 assert.equal(restore(null,deck).set,0);
});
test('local and static routes include the independent lemma page',()=>{
 const server=readFileSync(new URL('../server.mjs',import.meta.url),'utf8');assert.ok(server.includes("['/lemmas','/lemmas/']"));
 const build=readFileSync(new URL('../scripts/build-static.mjs',import.meta.url),'utf8');assert.ok(build.includes("'lemmas'"));
});
