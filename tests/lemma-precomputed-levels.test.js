import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {singleLetterAudio} from '../lemmas/single-letter-audio.js';
const shards=new Map();
function level(path){const bits=path.split('/'),id=bits.at(-1).replace('.mp3','');const shard=path.includes('audio-corrections')?'corrections.json':`${bits.at(-2)}/${id.slice(0,2)}.json`;if(!shards.has(shard))shards.set(shard,JSON.parse(readFileSync(new URL('../lemmas/audio-levels/'+shard,import.meta.url))));const db=shards.get(shard)[id];assert.ok(Number.isFinite(db)&&db>=-180&&db<=0,`Missing/invalid level: ${path}`);return db;}
test('every Spanish recording and y correction has an offline loudness measurement',()=>{
 for(const filename of ['manifest.json','manifest-feminine.json']){
  const m=JSON.parse(readFileSync(new URL('../src/audio/azure/'+filename,import.meta.url)));
  for(const [locale,clips] of Object.entries(m.clips))if(locale.startsWith('es-'))for(const path of Object.values(clips))level(path);
 }
 for(const regions of Object.values(singleLetterAudio))for(const clips of Object.values(regions))for(const path of Object.values(clips))level(path);
});
test('offline measurements agree with the independently decoded 104-clip sample',()=>{
 const sample=JSON.parse(readFileSync(new URL('../data/spanish-lemmas/audio/level-sample.json',import.meta.url)));
 for(const clip of sample.clips)assert.ok(Math.abs(level(clip.file)-clip.activeRMSDBFS)<.1,clip.file);
});
