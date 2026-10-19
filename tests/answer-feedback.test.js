import test from 'node:test';
import assert from 'node:assert/strict';
import {createAnswerFeedback} from '../src/answer-feedback.js';
function setup({deferred=false,unavailable=false}={}){
 const spoken=[],oscillators=[];let resolve,stops=0;
 class AudioContext{
  state='running';currentTime=10;destination={};
  resume(){return deferred?new Promise(r=>resolve=r):Promise.resolve();}
  createOscillator(){const node={frequency:{},connect(){},disconnect(){},start(at){this.at=at;},stop(at){this.until=at;}};oscillators.push(node);return node;}
  createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}};}
 }
 const player=createAnswerFeedback({speak:(...args)=>spoken.push(args),stop:()=>stops++},unavailable?null:AudioContext);
 const play=(options={})=>player.play({correct:true,text:'bonjour',locale:'fr-FR',label:'French',...options});
 return {player,play,spoken,oscillators,resolve:()=>resolve(),stops:()=>stops};
}
test('speech follows both notes and keeps the taught text and locale',async()=>{
 const t=setup();t.play();await Promise.resolve();assert.equal(t.spoken.length,0);
 assert.deepEqual(t.oscillators.map(o=>o.frequency.value),[660,880]);
 t.oscillators[0].onended();assert.equal(t.spoken.length,0);
 t.oscillators[1].onended();assert.deepEqual(t.spoken[0].slice(0,3),['bonjour','fr-FR','French']);
});
test('miss uses a descending cue and still pronounces the correct answer',async()=>{
 const t=setup();t.play({correct:false});await Promise.resolve();assert.deepEqual(t.oscillators.map(o=>o.frequency.value),[440,330]);t.oscillators[1].onended();assert.equal(t.spoken[0][0],'bonjour');
});
test('navigation during chime cancels speech even from a queued completion',async()=>{
 const t=setup();t.play();await Promise.resolve();const end=t.oscillators[1].onended;t.player.stop();end();assert.equal(t.spoken.length,0);assert.ok(t.stops()>=2);
});
test('navigation while audio resumes cannot start stale sound',async()=>{
 const t=setup({deferred:true});t.play();t.player.stop();t.resolve();await Promise.resolve();assert.equal(t.oscillators.length,0);assert.equal(t.spoken.length,0);
});
test('muting cancels active audio and starts neither sound nor speech',async()=>{
 const t=setup();t.play();await Promise.resolve();const end=t.oscillators[1].onended;t.play({enabled:false});end();assert.equal(t.spoken.length,0);assert.equal(t.oscillators.length,2);
});
test('without Web Audio, pronunciation remains available',()=>{
 const t=setup({unavailable:true});t.play();assert.equal(t.spoken[0][0],'bonjour');
});
