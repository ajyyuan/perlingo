import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {rowExamples} from '../lemmas/row-examples-data.js';
import {azureVoices,feminineVoices,normalizeAudioText} from '../src/azure-voices.js';
const targets=JSON.parse(execFileSync(process.execPath,['scripts/lemma-audio-inventory.mjs','--targets-only'],{encoding:'utf8',maxBuffer:32*1024*1024}));
const indexed=new Map(targets.map(t=>[t.text,t]));
test('live pronunciation inventory includes every conjugation-row sentence, alternative and clickable word',()=>{
 let sentences=0;
 for(const tenses of Object.values(rowExamples))for(const rows of Object.values(tenses))for(const examples of Object.values(rows))for(const e of examples){
  if(!e.text)continue;sentences++;
  assert.ok(indexed.get(normalizeAudioText(e.text))?.kinds.includes('conjugation-row sentences'),e.text);
  for(const word of e.text.match(/[\p{L}]+/gu)||[])assert.ok(indexed.has(normalizeAudioText(word)),word);
 }
 assert.ok(sentences>17000);
});

test('all eight Spanish voice manifests cover the current pronunciation inventory',()=>{
 for(const [voices,file] of [[azureVoices,'manifest.json'],[feminineVoices,'manifest-feminine.json']]){
  const manifest=JSON.parse(readFileSync(new URL('../src/audio/azure/'+file,import.meta.url),'utf8'));
  for(const [locale,voice] of Object.entries(voices).filter(([locale])=>locale.startsWith('es-'))){
   assert.equal(manifest.regions[locale],voice);
   const missing=targets.filter(({text})=>!manifest.clips[locale]?.[text]);
   assert.equal(missing.length,0,`${voice}: ${missing.length} missing recordings; first: ${missing[0]?.text}`);
  }
 }
});
