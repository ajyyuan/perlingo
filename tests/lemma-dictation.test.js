import test from 'node:test';
import assert from 'node:assert/strict';
import {createDictation} from '../lemmas/dictation.js';
function fixture(){
 const instances=[],texts=[],states=[],timers=new Map();let timerId=0;
 class Recognition {constructor(){instances.push(this);}start(){this.onstart();}abort(){this.aborted=true;}stop(){this.onend();}}
 const voice=createDictation(Recognition,{onText:s=>texts.push(s),onStatus:(...s)=>states.push(s),setTimer:fn=>{timers.set(++timerId,fn);return timerId;},clearTimer:id=>timers.delete(id)});
 const result=text=>({resultIndex:0,results:[Object.assign([{transcript:text}],{isFinal:true})]});
 return {instances,texts,states,voice,result,timers};
}
test('Spanish dictation supplies an editable transcript only after an explicit start',()=>{
 const f=fixture();assert.equal(f.instances.length,0);f.voice.start();const r=f.instances[0];assert.equal(r.lang,'es-ES');assert.equal(r.interimResults,false);
 r.onresult(f.result('somos'));assert.deepEqual(f.texts,['somos']);assert.equal(f.states.at(-1)[0],'result');
});
test('navigation and a new recording invalidate late callbacks from the previous answer',()=>{
 const f=fixture();f.voice.start();const old=f.instances[0];f.voice.cancel();old.onresult(f.result('late'));assert.deepEqual(f.texts,[]);assert.equal(old.aborted,true);
 f.voice.start();const second=f.instances[1];old.onerror({error:'not-allowed'});second.onresult(f.result('de'));assert.deepEqual(f.texts,['de']);
});
test('denied access and unavailable recognition preserve the typing fallback',()=>{
 const f=fixture();f.voice.start();f.instances[0].onerror({error:'not-allowed'});assert.match(f.states.at(-1)[1],/denied/);assert.deepEqual(f.texts,[]);
 let message;const v=createDictation(undefined,{onStatus:(_,m)=>message=m});assert.equal(v.supported,false);v.start();assert.match(message,/unavailable/);
});

test('stop aborts immediately and ignores a browser that never sends an end event',()=>{
 const f=fixture();f.voice.start();const r=f.instances[0];f.voice.stop();
 assert.equal(r.aborted,true);assert.equal(f.states.at(-1)[0],'stopped');assert.equal(f.timers.size,0);
 r.onresult(f.result('late'));assert.deepEqual(f.texts,[]);
});
test('a stalled recognition session times out and can be started again',()=>{
 const f=fixture();f.voice.start();const r=f.instances[0];[...f.timers.values()][0]();
 assert.equal(r.aborted,true);assert.match(f.states.at(-1)[1],/timed out/);assert.equal(f.timers.size,0);
 f.voice.start();f.instances[1].onresult(f.result('mío'));assert.deepEqual(f.texts,['mío']);
});
