import test from 'node:test';
import assert from 'node:assert/strict';
import {voiceSettings,lemmaPronouncer} from '../lemmas/pronunciation-settings.js';
test('lemma pronunciation routes every call through selected region and voice',()=>{
 const calls=[];let settings;const recorded={speak:(...args)=>calls.push(args),stop:()=>calls.push('stop')};const voice=lemmaPronouncer(recorded,()=>settings);
 for(const locale of ['es-ES','es-MX','es-AR','es-CO'])for(const gender of ['masculine','feminine']){
  settings={pronunciationRegions:{es:locale},pronunciationVoices:{es:gender}};const report=()=>{};voice.speak('hiciste','es-ES','Spanish',report);
  assert.deepEqual(calls.at(-1),['hiciste',locale,'Spanish',report,gender]);
 }
 voice.stop();assert.equal(calls.at(-1),'stop');
});
test('missing or invalid lemma preferences safely default without importing course progress',()=>{
 for(const raw of [null,{}, {pronunciationRegions:{es:'fr-FR'},pronunciationVoices:{es:'unknown'},flows:{}}])assert.deepEqual(voiceSettings(raw),{pronunciationRegions:{es:'es-ES'},pronunciationVoices:{es:'masculine'}});
});
