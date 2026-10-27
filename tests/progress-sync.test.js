import test from 'node:test';
import assert from 'node:assert/strict';
import {createProgressSync,validProgress} from '../src/progress-sync.js';
import {sessionOptions,createAccountClient} from '../src/account-client.js';
const progress=(day=1)=>({srsVersion:2,appDay:day,settings:{languages:['fr'],noun:1,verb:0,grammar:0,sentence:0},history:{},sessions:[],activeDay:null});
const storage=()=>{const map=new Map();return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};};
function setup({row=null,cache=null,store=storage(),key='account:a:course'}={}){
 let cloud=structuredClone(row),writes=0,fail=false,hook=null;
 if(cache)store.setItem(key,JSON.stringify(cache));
 const states=[],applied=[];
 const remote={read:async()=>{if(fail)throw Error('Offline');return structuredClone(cloud);},write:async(revision,payload)=>{writes++;if(hook)await hook();if(revision!==(cloud?.revision||0))return null;cloud={revision:revision+1,payload:structuredClone(payload)};return cloud.revision;}};
 const sync=createProgressSync({storage:store,key,initial:progress(),remote,onApply:p=>applied.push(p),onStatus:s=>states.push(s)});
 return {sync,states,applied,store,cloud:()=>cloud,writes:()=>writes,offline:v=>fail=v,change:r=>cloud=r,hook:h=>hook=h};
}
test('auth explicitly persists and refreshes sessions; unconfigured guest makes no client',async()=>{
 assert.equal(sessionOptions.persistSession,true);assert.equal(sessionOptions.autoRefreshToken,true);
 assert.equal(await createAccountClient({}),null);
 await assert.rejects(createAccountClient({url:'https://example.supabase.co',publishableKey:'service-role'}));
});
test('new account requires opt-in before uploading guest progress',async()=>{
 const t=setup();await t.sync.sync();assert.equal(t.writes(),0);assert.equal(t.states.at(-1).choice,'initial');
 await t.sync.choose('device');assert.equal(t.cloud().payload.appDay,1);assert.equal(t.cloud().revision,1);t.sync.dispose();
});
test('choosing cloud preserves a recovery copy of local progress and persists account state',async()=>{
 const t=setup({row:{revision:4,payload:progress(12)}});await t.sync.sync();await t.sync.choose('cloud');
 assert.equal(t.applied[0].appDay,12);assert.equal(JSON.parse(t.store.getItem('account:a:course:recovery')).progress.appDay,1);
 assert.equal(t.writes(),0);t.sync.dispose();
 const reopened=setup({store:t.store,row:t.cloud()});assert.equal(reopened.sync.getProgress().appDay,12);await reopened.sync.sync();assert.equal(reopened.states.at(-1).state,'saved');reopened.sync.dispose();
});
test('offline edits persist, retry on reconnection, and retain restart checkpoint',async()=>{
 const t=setup();await t.sync.sync();await t.sync.choose('device');t.offline(true);
 const p=progress(3);p.activeDay={day:3,restartHistory:{x:{stage:0,dueDay:3}},state:{feedback:{correct:false}}};
 t.sync.save(p);await t.sync.sync();assert.equal(t.states.at(-1).state,'error');assert.equal(JSON.parse(t.store.getItem('account:a:course')).progress.appDay,3);
 t.offline(false);await t.sync.sync();assert.deepEqual(t.cloud().payload.activeDay,p.activeDay);t.sync.dispose();
});
test('another device changing progress causes a choice instead of automatic overwrite',async()=>{
 const t=setup();await t.sync.sync();await t.sync.choose('device');t.sync.save(progress(2));
 t.change({revision:2,payload:progress(5)});await t.sync.sync();assert.equal(t.states.at(-1).state,'choice');assert.equal(t.cloud().payload.appDay,5);
 await t.sync.choose('device');assert.equal(t.cloud().payload.appDay,2);assert.equal(t.cloud().revision,3);t.sync.dispose();
});
test('a racing cloud write is rejected atomically; an outdated conflict choice is not applied',async()=>{
 const t=setup();await t.sync.sync();await t.sync.choose('device');t.sync.save(progress(2));
 t.hook(()=>t.change({revision:2,payload:progress(4)}));await t.sync.sync();assert.equal(t.states.at(-1).state,'choice');
 t.change({revision:3,payload:progress(6)});await t.sync.choose('cloud');assert.equal(t.applied.length,0);
 await t.sync.choose('cloud');assert.equal(t.applied[0].appDay,6);t.sync.dispose();
});
test('edits during an upload remain dirty and are sent by the next sync',async()=>{
 const t=setup();await t.sync.sync();await t.sync.choose('device');t.sync.save(progress(2));
 t.hook(()=>{t.sync.save(progress(3));t.hook(null);});await t.sync.sync();assert.equal(t.cloud().payload.appDay,2);
 await t.sync.sync();assert.equal(t.cloud().payload.appDay,3);t.sync.dispose();
});
test('disposing during a pending request prevents stale account application',async()=>{
 const t=setup({row:{revision:1,payload:progress(9)}});const pending=t.sync.sync();t.sync.dispose();await pending;assert.equal(t.states.length,0);assert.equal(t.applied.length,0);
});
test('account and pack storage is isolated; other-tab writes pause sync without erasing its draft',async()=>{
 const store=storage(),a=setup({store}),b=setup({store,key:'account:b:starter'});
 await a.sync.sync();await a.sync.choose('device');await b.sync.sync();await b.sync.choose('device');
 store.setItem('account:a:course',JSON.stringify({progress:progress(8),revision:1,linked:true,dirty:true}));
 a.sync.save(progress(3));await a.sync.sync();assert.equal(a.cloud().payload.appDay,1);assert.equal(JSON.parse(store.getItem('account:a:course')).progress.appDay,8);assert.equal(b.sync.getProgress().appDay,1);
 a.sync.dispose();b.sync.dispose();
});
test('malformed cloud progress does not replace local progress',async()=>{
 const t=setup({row:{revision:1,payload:{appDay:99}}});await t.sync.sync();assert.equal(t.states.at(-1).state,'error');assert.equal(t.applied.length,0);assert.equal(validProgress({}),false);t.sync.dispose();
});

test('Learning reset backs up progress and replaces only its account pack',async()=>{
 const store=storage(),a=setup({store}),b=setup({store,key:'account:a:starter'});
 await a.sync.sync();await a.sync.choose('device');await b.sync.sync();await b.sync.choose('device');
 const old=progress(9);old.activeDay={state:{draftInput:'unfinished'}};a.sync.save(old);await a.sync.sync();
 await a.sync.reset(progress());assert.deepEqual(a.cloud().payload,progress());assert.deepEqual(a.applied.at(-1),progress());
 assert.deepEqual(JSON.parse(store.getItem('account:a:course:recovery')).progress,old);assert.equal(b.cloud().revision,1);
 a.sync.dispose();b.sync.dispose();
});
test('reset refuses a competing tab and preserves its snapshot',async()=>{
 const t=setup();await t.sync.sync();await t.sync.choose('device');t.sync.save(progress(3));await t.sync.sync();
 const other=JSON.stringify({progress:progress(8),revision:2,linked:true,dirty:true});t.store.setItem('account:a:course',other);
 await assert.rejects(t.sync.reset(progress()),/Reload/);assert.equal(t.store.getItem('account:a:course'),other);assert.equal(t.cloud().payload.appDay,3);t.sync.dispose();
});
