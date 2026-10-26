import test from 'node:test';
import assert from 'node:assert/strict';
import {DeveloperSession,reviewIdentity} from '../public/developer-session.js';
function fixture(overrides={}){
 const events=[],states=[];let time=0,commits=0,closed=0;
 const mic={open:async()=>{},close(){this.closed=true;},reset(token){this.token=token;}};
 const session={pending:0,uncommitted:0,push(buffer){this.uncommitted+=buffer.byteLength;},commit(){commits++;this.uncommitted=0;return true;},close(){closed++;}};
 const run=new DeveloperSession({microphone:()=>mic,prepare:async()=>session,onState:s=>states.push(s),onTranscript:r=>events.push(r),now:()=>time,...overrides});
 return {run,mic,session,events,states,setTime:t=>time=t,commits:()=>commits,closed:()=>closed};
}
test('developer capture uses game silence threshold and token isolation',async()=>{
 const f=fixture();await f.run.start('pt');
 f.mic.onAudio(new ArrayBuffer(2560),.1,f.mic.token+1);assert.equal(f.session.uncommitted,6400);
 f.mic.onAudio(new ArrayBuffer(2560),.1,f.mic.token);f.setTime(239);f.mic.onAudio(new ArrayBuffer(2560),0,f.mic.token);assert.equal(f.commits(),0);
 f.setTime(240);f.mic.onAudio(new ArrayBuffer(2560),0,f.mic.token);assert.equal(f.commits(),1);f.run.cancel();assert(f.mic.closed);
});
test('changing selection closes capture and suppresses late transcripts',async()=>{
 const f=fixture();await f.run.start('pt');f.run.cancel();f.session.onTranscript({text:'pão',final:true});assert.equal(f.events.length,0);assert.equal(f.closed(),1);
});
test('canceling during microphone permission closes the eventually opened stream',async()=>{
 let resolve;const f=fixture();f.mic.open=()=>new Promise(r=>resolve=r);const opening=f.run.start('pt');f.run.cancel();resolve();await opening;assert(f.mic.closed);assert.equal(f.run.phase,'idle');assert.equal(f.closed(),0);
});
test('canceling during provider connection closes the late provider',async()=>{
 let resolve;const f=fixture();f.run.prepare=()=>new Promise(r=>resolve=r);const opening=f.run.start('pt');await Promise.resolve();f.run.cancel();resolve(f.session);await opening;assert.equal(f.closed(),1);assert(f.mic.closed);
});
test('manual stop flushes audio and waits for final results without a false verdict',async()=>{
 const f=fixture();await f.run.start('pt');f.run.finish();assert(f.mic.closed);assert.equal(f.run.phase,'settling');assert.equal(f.events.length,0);
 f.session.onTranscript({text:'p',final:false});assert.equal(f.run.phase,'settling');
 f.session.onTranscript({text:'pão',final:true});assert.equal(f.events.length,2);assert.equal(f.run.phase,'idle');
});
test('provider failure releases microphone and cannot create an accepted attempt',async()=>{
 const f=fixture();await f.run.start('pt');f.session.onError(Error('offline'));assert(f.mic.closed);assert.equal(f.run.phase,'idle');f.session.onTranscript({text:'pão',final:true});assert.equal(f.events.length,0);assert.equal(f.states.at(-1),'offline');
});
test('capture automatically stops at the developer limit',async()=>{
 const f=fixture({limitMs:5});await f.run.start('pt');await new Promise(r=>setTimeout(r,15));assert(f.mic.closed);assert.equal(f.run.phase,'settling');f.run.cancel();
});
test('review identity changes with audio, taught answer, guides, accepted alternatives and speech route',()=>{
 const e={id:'pt',word:'pão',reading:'pão',ipa:'pɐ̃w̃',accepted:['pão']},r={sha256:'a'};
 const key=reviewIdentity('bread',e,r,'azure','short');
 for(const candidate of [reviewIdentity('bread',e,{sha256:'b'},'azure','short'),reviewIdentity('bread',{...e,accepted:['pão','pães']},r,'azure','short'),reviewIdentity('bread',{...e,ipa:'changed'},r,'azure','short'),reviewIdentity('bread',e,r,'soniox','realtime')])assert.notEqual(candidate,key);
 assert.equal(key,reviewIdentity('bread',e,r,'azure','short'));
});
