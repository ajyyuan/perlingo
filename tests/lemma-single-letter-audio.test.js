import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {singleLetterAudio} from '../lemmas/single-letter-audio.js';
import {createRecordedPronouncer} from '../src/recorded-speech.js';
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
const ledger=JSON.parse(readFileSync(new URL('../data/spanish-lemmas/audio/single-letter-corrections.json',import.meta.url)));
test('all eight Spanish voices have explicit y recordings with verified bytes',()=>{
 assert.equal(ledger.clips.filter(r=>r.disposition==='active').length,8);
 for(const gender of ['masculine','feminine'])for(const locale of ['es-ES','es-MX','es-AR','es-CO']){
  const mapping=singleLetterAudio[gender][locale];assert.deepEqual(Object.keys(mapping),['y']);
  for(const [text,ipa] of Object.entries({y:'i'})){
   const r=ledger.clips.find(r=>r.gender===gender&&r.locale===locale&&r.text===text);
   assert.equal(r.status,'complete');assert.equal(r.ipa,ipa);assert.ok(r.ssml.includes(`<phoneme alphabet="ipa" ph="${ipa}">${text}</phoneme>`));
   assert.equal(mapping[text],'/lemmas/audio-corrections/'+r.file);
   const bytes=readFileSync(new URL('..'+mapping[text],import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),r.sha256);
  }
 }
});
test('same-origin corrections beat the external audio library for every voice and preserve normal phrases',async()=>{
 let clip;const calls=[];
 const manifests=Object.fromEntries(['masculine','feminine'].map(g=>[g,JSON.parse(readFileSync(new URL('../src/audio/azure/'+(g==='masculine'?'manifest.json':'manifest-feminine.json'),import.meta.url)))]));
 const p=createRecordedPronouncer({clipOverrides:singleLetterAudio,fallbackText:t=>t==='y'?'i':t,baseUrl:'https://audio.example/',loadManifest:()=>manifests.masculine,loadFeminineManifest:()=>manifests.feminine,fallback:{stop(){},speak(...args){calls.push(args);}},makeAudio:()=>clip={play:()=>Promise.resolve(),pause(){},removeAttribute(){},load(){}}});
 for(const gender of ['masculine','feminine'])for(const locale of ['es-ES','es-MX','es-AR','es-CO'])for(const text of ['a','A','e','o','y']){
  p.speak(text,locale,'Spanish',()=>{},gender);await flush();assert.equal(clip.src,text==='y'?singleLetterAudio[gender][locale][text]:'https://audio.example/'+manifests[gender].clips[locale][text]);
 }
 p.speak('y','es-MX','Spanish',()=>{});await flush();clip.onerror();assert.equal(calls.at(-1)[0],'i');assert.equal(calls.at(-1)[1],'es-MX');
 manifests.masculine.clips['es-ES']['tú y yo']='phrase.mp3';
 p.speak('tú y yo','es-ES','Spanish',()=>{});await flush();assert.equal(clip.src,'https://audio.example/phrase.mp3');clip.onerror();assert.equal(calls.at(-1)[0],'tú y yo');p.stop();
});
