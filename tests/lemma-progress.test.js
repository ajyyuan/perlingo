import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {restoreProgress,validProgress} from '../lemmas/progress.js';
import {createProgressSync} from '../src/progress-sync.js';
import {createTest} from '../lemmas/assessment.js';
const deck=JSON.parse(readFileSync(new URL('../lemmas/data/deck.json',import.meta.url)));
const fresh=()=>restoreProgress(null,deck);
const memory=()=>{const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};};
function setup({store=memory(),row=null}={}){
 let cloud=row,offline=false;const applied=[],states=[];
 const remote={read:async()=>{if(offline)throw Error('offline');return structuredClone(cloud);},write:async(r,p)=>{if(offline)throw Error('offline');if(r!==(cloud?.revision||0))return null;cloud={revision:r+1,payload:structuredClone(p)};return cloud.revision;}};
 const sync=createProgressSync({storage:store,key:'account',initial:fresh(),autoLink:true,remote,validate:p=>validProgress(p,deck),onApply:p=>applied.push(p),onStatus:s=>states.push(s)});
 return {sync,store,applied,states,cloud:()=>cloud,offline:v=>offline=v};
}
test('full Lemmas snapshots round-trip independently of database key order; invalid tests are rejected',()=>{
 const p=fresh();assert.ok(validProgress(p,deck));
 p.flows[0].phase='choice';p.flows[0].test=createTest('typed',deck.slice(0,10).map(c=>c.id));p.flows[0].test.draft='el';
 const reordered=JSON.parse(JSON.stringify(p,(_k,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.entries(v).reverse()):v));
 assert.ok(validProgress(reordered,deck));assert.deepEqual(restoreProgress(p,deck),p);
 p.flows[0].test.ids[0]='foreign';assert.equal(validProgress(p,deck),false);
});
test('fresh account links without importing any guest storage; existing cloud wins',async()=>{
 const store=memory();store.setItem('perlingo-lemmas-corpes-v2',JSON.stringify({day:4}));
 const a=setup({store});await a.sync.sync();assert.deepEqual(a.cloud().payload,fresh());assert.equal(JSON.parse(store.getItem('perlingo-lemmas-corpes-v2')).day,4);a.sync.dispose();
 const p=fresh();p.flows[0].index=7;const b=setup({row:{revision:3,payload:p}});await b.sync.sync();assert.equal(b.applied.at(-1).flows[0].index,7);assert.equal(b.cloud().revision,3);b.sync.dispose();
});
test('reset persists offline, retains recovery and syncs on reconnect; stale devices cannot silently resurrect old course',async()=>{
 const a=setup();await a.sync.sync();const p=fresh();p.flows[0].index=7;a.sync.save(p);await a.sync.sync();
 const old=a.cloud();a.offline(true);await a.sync.reset(fresh());assert.deepEqual(a.sync.getProgress(),fresh());assert.equal(JSON.parse(a.store.getItem('account:recovery')).progress.flows[0].index,7);
 a.offline(false);await a.sync.sync();assert.deepEqual(a.cloud().payload,fresh());
 const b=setup({row:a.cloud()});b.store.setItem('unused','keep');
 // A stale linked cache encounters the reset's revision and must choose.
 const store=memory();store.setItem('account',JSON.stringify({progress:old.payload,revision:old.revision,linked:true,dirty:true}));
 const stale=setup({store,row:a.cloud()});await stale.sync.sync();assert.equal(stale.states.at(-1).state,'choice');await assert.rejects(stale.sync.reset(fresh()),/resolve/);assert.deepEqual(stale.cloud().payload,fresh());
 a.sync.dispose();b.sync.dispose();stale.sync.dispose();
});
test('learning before first cloud read does not silently overwrite either copy',async()=>{
 const p=fresh();p.flows[0].index=8;const a=setup({row:{revision:1,payload:p}});const local=fresh();local.flows[0].index=2;a.sync.save(local);await a.sync.sync();assert.equal(a.states.at(-1).state,'choice');assert.equal(a.cloud().payload.flows[0].index,8);a.sync.dispose();
});
test('example seed travels with cloud progress and changes with an explicit course reset',async()=>{
 const p={...fresh(),exampleSeed:1234};const a=setup({row:{revision:1,payload:p}});
 await a.sync.sync();assert.equal(a.sync.getProgress().exampleSeed,1234);
 const reset={...fresh(),exampleSeed:5678};await a.sync.reset(reset);
 assert.equal(a.cloud().payload.exampleSeed,5678);
 assert.equal(JSON.parse(a.store.getItem('account:recovery')).progress.exampleSeed,1234);
 a.sync.dispose();
});
