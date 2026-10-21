import test from 'node:test';
import assert from 'node:assert/strict';
import {createChallengeStore} from '../public/account-store.js';
function storage(){const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v),removeItem:k=>m.delete(k),key:i=>[...m.keys()][i],get length(){return m.size;}};}
function backend(){
 const rows=new Map();let offline=false;
 return {rows,set offline(v){offline=v;},client(owner){return {
  rpc(name,a){const call=async()=>{
   if(offline)return {error:Error('offline')};
   const key=owner+':'+a.p_id;
   if(name==='claim_challenge_round'){
    const prior=[...rows.values()].find(r=>r.user_id===owner&&r.challenge_date===a.p_date);
    if(prior)return {data:prior.id===a.p_id};
    rows.set(key,{id:a.p_id,user_id:owner,challenge_date:a.p_date,started_at:'2026-10-21',record:null,completed:false});return {data:true};
   }
   const old=rows.get(key);
   if(!old?.completed)rows.set(key,{...old,id:a.p_id,user_id:owner,record:a.p_record,completed:a.p_completed});
   return {data:null};
  };return {abortSignal:()=>call()};},
  from(name){assert.equal(name,'challenge_rounds');return {select(){return {order(){return {range(){return {async abortSignal(){return offline?{error:Error('offline')}:{data:[...rows.values()].filter(r=>r.user_id===owner)};}};}};}};}};}
 };}};
}
const record={date:'2026-10-21T20:00:00Z',word:'Bread',pack:'bread',score:1,total:50,correct:['fr'],attempts:[{id:'fr',outcome:'correct'}]};
const settle=()=>new Promise(r=>setTimeout(r,0));
test('two devices share a daily claim and score without touching Learning',async()=>{const db=backend();const a=createChallengeStore({client:db.client('a'),storage:storage(),userId:'a'}),b=createChallengeStore({client:db.client('a'),storage:storage(),userId:'a'});const claims=await Promise.all([a.claim('2026-10-21','one'),b.claim('2026-10-21','two')]);assert.deepEqual(claims,[true,false]);a.save('one',{...record,challengeDate:'2026-10-21'},true);await settle();await b.sync();assert.equal(b.snapshot().attempts['2026-10-21'].score,1);assert.equal(b.snapshot().history.length,1);});
test('offline outbox survives reload and retries idempotently',async()=>{const db=backend(),local=storage();db.offline=true;let a=createChallengeStore({client:db.client('a'),storage:local,userId:'a'});a.save('one',record,true);await settle();a.dispose();a=createChallengeStore({client:db.client('a'),storage:local,userId:'a'});assert.equal(a.snapshot().history.length,1);db.offline=false;await a.sync();await a.sync();assert.equal(db.rows.size,1);});
test('accounts are isolated and guests never uploaded implicitly',async()=>{const db=backend(),local=storage();local.setItem('pc-history-v1',JSON.stringify([record]));const a=createChallengeStore({client:db.client('a'),storage:local,userId:'a'});assert.equal(a.snapshot().history.length,0);a.save('one',record,true);await settle();a.dispose();const b=createChallengeStore({client:db.client('b'),storage:local,userId:'b'});await b.sync();assert.equal(b.snapshot().history.length,0);assert.equal(JSON.parse(local.getItem('pc-history-v1')).length,1);});
test('different tabs retain separate pending rounds',async()=>{const db=backend(),local=storage();db.offline=true;const a=createChallengeStore({client:db.client('a'),storage:local,userId:'a'}),b=createChallengeStore({client:db.client('a'),storage:local,userId:'a'});a.save('one',record,true);b.save('two',record,true);await settle();db.offline=false;await a.sync();assert.equal(db.rows.size,2);});
test('offline daily fails closed; disposal blocks later writes',async()=>{const db=backend();db.offline=true;const a=createChallengeStore({client:db.client('a'),storage:storage(),userId:'a'});await assert.rejects(a.claim('2026-10-21','one'));assert.deepEqual(a.snapshot().attempts,{});a.dispose();assert.throws(()=>a.save('one',record,true));});
