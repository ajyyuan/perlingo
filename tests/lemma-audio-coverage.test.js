import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {guideExample} from '../lemmas/guide-examples.js';
import {verbGuide} from '../lemmas/verb-guide.js';
import {combineNotes} from '../lemmas/notes-library.js';
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

test('pronunciation inventory covers every full-guide form and alternate, including rare tenses',()=>{
 const read=name=>JSON.parse(readFileSync(new URL('../lemmas/data/'+name+'.json',import.meta.url),'utf8'));
 const {notes}=combineNotes(read('notes'),read('context'),read('day1-usage'));
 let count=0;
 for(const note of notes)for(const category of verbGuide(note))for(const lesson of category.lessons)for(const row of lesson.rows)for(const form of row.alternatives){
  count++;assert.ok(indexed.get(normalizeAudioText(form))?.kinds.includes('verb guide forms'),note.word+': '+form);
 }
 assert.ok(count>20000);
 let sentences=0;
 for(const note of notes)for(const category of verbGuide(note))for(const lesson of category.lessons)for(const [i,row]of lesson.rows.entries())for(const [a]of row.alternatives.entries()){const e=guideExample(note,lesson,i,a);if(e.text){sentences++;assert.ok(indexed.get(normalizeAudioText(e.text))?.kinds.includes('verb guide sentences'));for(const word of e.text.match(/[\p{L}]+/gu)||[])assert.ok(indexed.has(normalizeAudioText(word)),word);}}
 assert.ok(sentences>44000);
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
