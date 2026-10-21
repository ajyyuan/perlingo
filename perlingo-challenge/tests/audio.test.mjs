import test from 'node:test';import assert from 'node:assert/strict';import vm from 'node:vm';import {readFile} from 'node:fs/promises';
import {ElevenLabsProvider} from '../public/speech.js';
test('audio packets have timestamps and reset drops samples from a previous card',async()=>{
 let Processor;const messages=[];const context=vm.createContext({AudioWorkletProcessor:class{constructor(){this.port={postMessage:m=>messages.push(m)};}},registerProcessor:(_,p)=>Processor=p,sampleRate:16000,currentFrame:0,Int16Array,Math});
 vm.runInContext(await readFile(new URL('../public/pcm-worklet.js',import.meta.url),'utf8'),context);const p=new Processor();
 p.port.onmessage({data:1});p.process([[new Float32Array(100).fill(.2)]]);p.port.onmessage({data:2});context.currentFrame=100;p.process([[new Float32Array(1280).fill(.5)]]);
 assert.equal(messages.length,1);assert.equal(messages[0].token,2);assert.equal(messages[0].startTime,100/16000);assert.equal(new Int16Array(messages[0].buffer)[0],16384);
});
test('speech adapter separates partial/final, tracks outstanding commits and sends no answer hint',async()=>{
 const originalFetch=globalThis.fetch,originalSocket=globalThis.WebSocket;let socket,url;
 globalThis.fetch=async()=>({ok:true,json:async()=>({token:'fake-test-token'})});
 globalThis.WebSocket=class{static OPEN=1;readyState=1;messages=[];constructor(u){url=u;socket=this;setTimeout(()=>this.emit({message_type:'session_started'}),0);}send(data){this.messages.push(JSON.parse(data));}close(){this.readyState=3;}emit(data){this.onmessage?.({data:JSON.stringify(data)});}};
 try{
  const s=await new ElevenLabsProvider().prepare('pt');const results=[];s.onTranscript=r=>results.push(r);
  s.push(new ArrayBuffer(3000));s.commit();assert.equal(s.pending,1);assert.equal(socket.messages[1].commit,true);
  socket.emit({message_type:'partial_transcript',text:'pão'});assert.equal(s.pending,1);assert.equal(results[0].final,false);
  socket.emit({message_type:'committed_transcript',text:'pão'});assert.equal(s.pending,0);assert.equal(results[1].final,true);
  assert.equal(new URL(url).searchParams.get('language_code'),'pt');assert(!url.includes('keyterms'));s.close();
 }finally{globalThis.fetch=originalFetch;globalThis.WebSocket=originalSocket;}
});

test('native voice selection preserves Thomas and never substitutes another language',async()=>{
 const {selectNativeVoice}=await import('../public/speech.js');const voices=[{name:'English',lang:'en-US'},{name:'Cantonese',lang:'zh-HK'},{name:'Tingting',lang:'zh-CN'},{name:'Amélie',lang:'fr-CA'},{name:'Thomas',lang:'fr-FR'},{name:'Nora',lang:'nb-NO'}];
 assert.equal(selectNativeVoice(voices,'fr').name,'Thomas');assert.equal(selectNativeVoice(voices,'zh').name,'Tingting');assert.equal(selectNativeVoice(voices,'no').name,'Nora');assert.equal(selectNativeVoice(voices,'bn'),undefined);assert.equal(selectNativeVoice([voices[1]],'zh'),undefined);
});
test('Soniox joins subwords, only scores finalized segments and tracks errors',async()=>{
 const {SonioxProvider}=await import('../public/speech.js');const originalFetch=globalThis.fetch,originalSocket=globalThis.WebSocket;let socket;
 globalThis.fetch=async()=>({ok:true,json:async()=>({token:'fake-test-token'})});
 globalThis.WebSocket=class{static OPEN=1;readyState=1;messages=[];constructor(){socket=this;setTimeout(()=>this.onopen(),0);}send(data){this.messages.push(data);}close(){this.readyState=3;}emit(data){this.onmessage({data:JSON.stringify(data)});}};
 try{const s=await new SonioxProvider().prepare('ja');const results=[];s.onTranscript=r=>results.push(r);s.push(new ArrayBuffer(32000));assert(s.commit());assert.equal(s.commit(),false);
 socket.emit({tokens:[{text:'パ',is_final:true},{text:'ンダ',is_final:false}]});assert.equal(results.at(-1).final,false);
 socket.emit({tokens:[{text:'ン',is_final:true},{text:'。',is_final:true},{text:'<fin>',is_final:true}]});assert.deepEqual(results.at(-1),{text:'パン。',final:true});assert.equal(s.pending,0);
 const config=JSON.parse(socket.messages[0]);assert.deepEqual(config.language_hints,['ja']);assert.equal(config.context,undefined);
 socket.emit({error_code:402});assert.match(s.failed.message,/funded credits/);socket.onclose();assert.match(s.failed.message,/funded credits/);s.close();
 }finally{globalThis.fetch=originalFetch;globalThis.WebSocket=originalSocket;}
});

test('canceling native playback settles its promise without an English fallback',async()=>{
 const {Pronouncer}=await import('../public/speech.js');const oldSynth=globalThis.speechSynthesis,oldUtterance=globalThis.SpeechSynthesisUtterance;const spoken=[];
 globalThis.speechSynthesis={getVoices:()=>[{name:'Thomas',lang:'fr-FR'}],cancel(){},speak(u){spoken.push(u);}};
 globalThis.SpeechSynthesisUtterance=class{constructor(text){this.text=text;}};
 try{const p=new Pronouncer();const playing=p.play('bread',{word:'pain'},{id:'fr',name:'French'});p.stop();await playing;assert.equal(spoken[0].voice.name,'Thomas');await assert.rejects(p.play('bread',{word:'রুটি'},{id:'bn',name:'Bengali'}),/No Bengali voice/);assert.equal(spoken.length,1);
 }finally{globalThis.speechSynthesis=oldSynth;globalThis.SpeechSynthesisUtterance=oldUtterance;}
});
