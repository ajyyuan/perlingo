import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createProgressSync} from '../src/progress-sync.js';
import {restoreProgress,validProgress} from '../lemmas/progress.js';
import {createTest} from '../lemmas/assessment.js';
const deck=JSON.parse(readFileSync(new URL('../lemmas/data/deck.json',import.meta.url)));
const progress=index=>{const p=restoreProgress(null,deck);p.flows[0].index=index;return p;};
function setup({row=null,guest=progress(6),store=new Map(),cache=null}={}){
 let cloud=structuredClone(row),offline=false,race=false;
 if(cache)store.set('account',JSON.stringify(cache));
 const storage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 const states=[],applied=[];
 const sync=createProgressSync({storage,key:'account',initial:progress(0),guest,autoLink:true,validate:p=>validProgress(p,deck),
  remote:{read:async()=>{if(offline)throw Error('offline');return structuredClone(cloud);},write:async(revision,payload)=>{if(offline)throw Error('offline');if(race){race=false;cloud={revision:revision+1,payload:progress(9)};}if(revision!==(cloud?.revision||0))return null;cloud={revision:revision+1,payload:structuredClone(payload)};return cloud.revision;}},
  onStatus:s=>states.push(s),onApply:p=>applied.push(p)});
 return {sync,store,states,applied,cloud:()=>cloud,change:r=>cloud=r,offline:v=>offline=v,race:()=>race=true};
}
test('new account asks before importing the complete guest snapshot and keeps the guest key',async()=>{
 const guest=progress(3);guest.flows[0].phase='choice';guest.flows[0].test=createTest('typed',deck.slice(0,10).map(c=>c.id));guest.flows[0].test.draft='unfinished';
 const store=new Map([['guest',JSON.stringify(guest)]]),a=setup({guest,store});
 await a.sync.sync();assert.equal(a.cloud(),null);assert.equal(a.states.at(-1).choice,'guest');
 await a.sync.choose('guest');assert.deepEqual(a.cloud().payload,guest);assert.deepEqual(a.applied.at(-1),guest);assert.equal(store.get('guest'),JSON.stringify(guest));
 assert.deepEqual(JSON.parse(store.get('account:recovery')).guest,guest);a.sync.dispose();
});
test('existing cloud and cached account stay untouched until a choice; choosing cloud retains guest recovery',async()=>{
 const a=setup({row:{revision:4,payload:progress(8)},cache:{progress:progress(2),revision:3,linked:true,dirty:true}});
 await a.sync.sync();assert.equal(a.cloud().revision,4);assert.equal(a.states.at(-1).accountDraft,true);
 await a.sync.choose('cloud');assert.equal(a.cloud().revision,4);assert.deepEqual(a.applied.at(-1),progress(8));
 const backup=JSON.parse(a.store.get('account:recovery'));assert.deepEqual(backup.progress,progress(2));assert.deepEqual(backup.cloud,progress(8));assert.deepEqual(backup.guest,progress(6));
 a.sync.dispose();
});
test('guest import replaces an existing account only after selection and preserves both previous copies',async()=>{
 const a=setup({row:{revision:4,payload:progress(8)}});await a.sync.sync();await a.sync.choose('guest');
 assert.equal(a.cloud().revision,5);assert.deepEqual(a.cloud().payload,progress(6));assert.deepEqual(JSON.parse(a.store.get('account:recovery')).cloud,progress(8));a.sync.dispose();
});
test('declining import can start fresh or keep unsynced account progress',async()=>{
 for(const cache of [null,{progress:progress(2),revision:1,linked:true,dirty:true}]){
  const a=setup({cache,row:cache?{revision:2,payload:progress(8)}:null});await a.sync.sync();await a.sync.choose('device');
  assert.deepEqual(a.cloud().payload,progress(cache?2:0));assert.equal(a.states.at(-1).state,'saved');a.sync.dispose();
 }
});
test('pending guest offer survives offline reload, and a completed choice does not repeat on session restore',async()=>{
 const a=setup();a.offline(true);await a.sync.sync();assert.equal(a.states.at(-1).state,'error');a.sync.dispose();
 const b=setup({store:a.store,guest:null});await b.sync.sync();assert.equal(b.states.at(-1).choice,'guest');await b.sync.choose('guest');b.sync.dispose();
 const c=setup({store:a.store,guest:null,row:b.cloud()});await c.sync.sync();assert.equal(c.states.at(-1).state,'saved');assert.deepEqual(c.sync.getProgress(),progress(6));c.sync.dispose();
});
test('newer cloud revisions require review again; a racing write cannot overwrite unseen account progress',async()=>{
 const a=setup({row:{revision:1,payload:progress(8)}});await a.sync.sync();a.change({revision:2,payload:progress(9)});await a.sync.choose('guest');
 assert.equal(a.cloud().revision,2);assert.equal(a.applied.length,0);assert.equal(a.states.at(-1).choice,'guest');
 a.race();await a.sync.choose('guest');assert.equal(a.states.at(-1).choice,'conflict');assert.deepEqual(a.cloud().payload,progress(9));assert.deepEqual(a.sync.getProgress(),progress(6));a.sync.dispose();
});
test('another tab blocks import without overwriting its saved account or cloud',async()=>{
 const a=setup({row:{revision:1,payload:progress(8)}});await a.sync.sync();const newer=JSON.stringify({progress:progress(9),revision:2,linked:true,dirty:false});a.store.set('account',newer);
 await a.sync.choose('guest');assert.equal(a.states.at(-1).state,'error');assert.equal(a.store.get('account'),newer);assert.deepEqual(a.cloud().payload,progress(8));a.sync.dispose();
});
