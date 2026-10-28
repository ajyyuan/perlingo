// Offline inventory only: no synthesis, upload, credentials, or manifest edits.
import {readFileSync,statSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {rowExamples} from '../lemmas/row-examples-data.js';
import {combineNotes} from '../lemmas/notes-library.js';
import {formGroups} from '../lemmas/verb-forms.js';
import {azureVoices,feminineVoices,normalizeAudioText} from '../src/azure-voices.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const base=read('lemmas/data/notes.json'),context=read('lemmas/data/context.json');
const {notes}=combineNotes(base,context),deck=read('lemmas/data/deck.json');
const targets=new Map();
function add(text,kind){if(!text)return;text=normalizeAudioText(text);if(!targets.has(text))targets.set(text,new Set());targets.get(text).add(kind);}
function sentence(text,kind){add(text,kind);for(const word of text.match(/[\p{L}]+/gu)||[])add(word,'sentence words');}
for(const n of notes){
 add(n.word,'headwords');
 // Nonverb notes and the three-word prototype expose these original rows.
 if(!formGroups(n).length||['tener','casa','bueno'].includes(n.word))for(const [,form]of n.forms)add(form,'forms');
 for(const g of formGroups(n)){for(const r of g.rows)for(const form of r.alternatives||[r.lemma])add(form,'forms');if(g.text)sentence(g.text,'tense sentences');}
 for(const e of n.examples)sentence(e.text,'usage sentences');
}
for(const tenses of Object.values(rowExamples))for(const rows of Object.values(tenses))for(const examples of Object.values(rows))for(const example of examples)if(example.text)sentence(example.text,'conjugation-row sentences');
for(const c of context.contexts){add(c.answers[0],'review answers');sentence(c.example.text,'review sentences');}
for(const c of (Array.isArray(deck)?deck:deck.cards))add(c.lemma,'headwords');
const items=[...targets].sort(([a],[b])=>a<b?-1:a>b?1:0).map(([text,kinds])=>({text,kinds:[...kinds].sort(),characters:[...text].length}));
if(process.argv.includes('--targets-only')){writeFileSync(1,JSON.stringify(items));process.exit(0);}
const jobs=[];
for(const [gender,voices,file]of [['masculine',azureVoices,'manifest.json'],['feminine',feminineVoices,'manifest-feminine.json']]){
 const manifest=read('src/audio/azure/'+file);
 for(const [locale,voice]of Object.entries(voices).filter(([l])=>l.startsWith('es-'))){
  assert.equal(manifest.regions[locale],voice);
  let reusable=0,bytes=0,invalid=0;const missing=[];let sampleBytes=0,sampleChars=0,sampleClips=0;
  for(const [text,path]of Object.entries(manifest.clips[locale])){try{const size=statSync(new URL('../src/audio/azure/'+path,import.meta.url)).size;if(size>100){sampleBytes+=size;sampleChars+=[...text].length;sampleClips++;}}catch{}}
  for(const item of items){const path=manifest.clips[locale]?.[item.text];let size=0;if(path){assert.equal(path,`${locale}/${createHash('sha256').update(voice+'\n'+item.text).digest('hex').slice(0,24)}.mp3`);try{size=statSync(new URL('../src/audio/azure/'+path,import.meta.url)).size;}catch{}if(size<=100)invalid++;}
   if(size>100){reusable++;bytes+=size;}else missing.push(item.text);
  }
  const characters=missing.reduce((sum,t)=>sum+[...t].length,0);
  jobs.push({locale,gender,voice,total:items.length,reusable,missing:missing.length,characters,invalidExistingFiles:invalid,existingBytes:bytes,estimatedNewBytes:Math.round(characters*sampleBytes/sampleChars),calibration:{clips:sampleClips,bytes:sampleBytes,characters:sampleChars},missingTexts:missing});
 }
}
assert.equal(notes.length,1500);assert.equal(jobs.length,8);
for(const job of jobs)assert.equal(job.reusable+job.missing,items.length);
const categories=[...new Set(items.flatMap(t=>t.kinds))].map(kind=>({kind,uniqueTexts:items.filter(t=>t.kinds.includes(kind)).length,missingSpainMasculine:items.filter(t=>t.kinds.includes(kind)&&jobs[0].missingTexts.includes(t.text)).length}));
const summary={schemaVersion:1,scope:'All current Lemmas pronunciation controls; text normalized exactly like recorded playback. Category counts overlap.',uniqueTexts:items.length,charactersPerVoice:items.reduce((s,t)=>s+t.characters,0),categories,jobs:jobs.map(({missingTexts,...j})=>j)};
if(process.argv.includes('--write')){writeFileSync(new URL('../data/spanish-lemmas/audio/inventory.json',import.meta.url),JSON.stringify({summary,targets:items,jobs},null,2)+'\n');}
console.log(JSON.stringify(summary,null,2));
