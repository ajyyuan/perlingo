import test from 'node:test';
import assert from 'node:assert/strict';
import {createRecordedDictation,createSpeechEndDetector} from '../lemmas/recorded-dictation.js';
function fixture(request=async()=>Response.json({text:'Buenos días.'})){
 let push,closed=0;const texts=[],states=[],calls=[],timers=new Map();let id=0;
 const d=createRecordedDictation({open:async fn=>{push=fn;return {close:()=>closed++};},request:async(...args)=>{calls.push(args);return request(...args);},onText:t=>texts.push(t),onStatus:(...s)=>states.push(s),setTimer:fn=>{timers.set(++id,fn);return id;},clearTimer:id=>timers.delete(id)});
 return {d,texts,states,calls,timers,push:(chunk=new Uint8Array(new Int16Array(3200).fill(1000).buffer))=>push(chunk),closed:()=>closed};
}
test('recording stops microphone and sends only PCM in Spanish, never a reference answer',async()=>{
 const f=fixture();await f.d.start();f.push();assert.equal(f.calls.length,0);await f.d.stop();assert.equal(f.closed(),1);assert.deepEqual(f.texts,['Buenos días.']);assert.equal(f.calls[0][0],'/challenge/api/speech/transcribe?provider=azure&language=es');assert.equal(f.calls[0][1].body.byteLength,6400);assert.equal(f.timers.size,0);
});
test('navigation aborts transcription and discards late results',async()=>{
 let resolve;const f=fixture(()=>new Promise(r=>resolve=r));await f.d.start();f.push();const pending=f.d.stop();f.d.cancel();assert.equal(f.calls[0][1].signal.aborted,true);resolve(Response.json({text:'late'}));await pending;assert.deepEqual(f.texts,[]);
});
test('late microphone permission closes capture after cancellation',async()=>{
 let resolve,closed=false;const d=createRecordedDictation({open:()=>new Promise(r=>resolve=r)});const pending=d.start();d.cancel();resolve({close:()=>closed=true});await pending;assert.equal(closed,true);
});
test('provider errors and empty audio preserve typing without invented transcripts',async()=>{
 const f=fixture(async()=>Response.json({error:'Unavailable'},{status:503}));await f.d.start();f.push();await f.d.stop();assert.equal(f.states.at(-1)[1],'Unavailable');assert.deepEqual(f.texts,[]);
 await f.d.start();await f.d.stop();assert.equal(f.calls.length,1);assert.match(f.states.at(-1)[1],/No recording/);
});

const pcm=(milliseconds,amplitude=0)=>new Uint8Array(new Int16Array(milliseconds*16).fill(amplitude).buffer);
test('endpoint waits through initial silence and short pauses, then stops after speech',()=>{
 const e=createSpeechEndDetector();assert.equal(e.push(pcm(1600)),false);assert.equal(e.heardSpeech,false);
 assert.equal(e.push(pcm(160,1000)),false);assert.equal(e.push(pcm(640)),false);
 assert.equal(e.push(pcm(80,1000)),false);assert.equal(e.push(pcm(720)),false);assert.equal(e.push(pcm(80)),true);
});
test('automatic endpoint closes mic and transcribes once without a Stop click',async()=>{
 const f=fixture();await f.d.start();f.push(pcm(160,1000));f.push(pcm(800));
 assert.equal(f.closed(),1);assert.equal(f.calls.length,1);f.push(pcm(800));assert.equal(f.calls.length,1);
 await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(f.texts,['Buenos días.']);
});
test('silence-only recording does not upload audio',async()=>{
 const f=fixture();await f.d.start();f.push(pcm(1000));await f.d.stop();assert.equal(f.calls.length,0);assert.match(f.states.at(-1)[1],/No speech/);
});
