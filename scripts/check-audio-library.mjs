import {readFileSync,statSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {azureVoices,feminineVoices} from '../src/azure-voices.js';
const root='src/audio/azure/';
const lemmaTargets=JSON.parse(execFileSync(process.execPath,['scripts/lemma-audio-inventory.mjs','--targets-only'],{encoding:'utf8',maxBuffer:32*1024*1024}));
let count=0,bytes=0;
const gaps=[];
const inventory=JSON.parse(execFileSync(process.execPath,['scripts/audio-inventory.mjs','--manifest'],{encoding:'utf8',maxBuffer:20*1024*1024}));
for(const [voices,filename] of [[azureVoices,'manifest.json'],[feminineVoices,'manifest-feminine.json']]){
const manifest=JSON.parse(readFileSync(root+filename,'utf8'));
for(const [locale,voice] of Object.entries(voices)){
 assert.equal(manifest.regions[locale],voice);
 const original=inventory.targets.filter(t=>t.locale.split('-')[0]===locale.split('-')[0]);
 const targets=[...new Set([...original.map(t=>t.text),...(locale.startsWith('es-')?lemmaTargets.map(t=>t.text):[])])].map(text=>({text}));
 const missing=targets.filter(({text})=>!manifest.clips[locale][text]);
 if(missing.length){gaps.push(`${voice}: ${missing.length} missing (e.g. ${JSON.stringify(missing[0].text)})`);continue;}
 for(const {text} of targets){const id=createHash('sha256').update(`${voice}\n${text}`).digest('hex').slice(0,24),file=manifest.clips[locale][text];assert.equal(file,`${locale}/${id}.mp3`);const size=statSync(root+file).size;assert.ok(size>100);bytes+=size;count++;}
}
}
assert.equal(gaps.length,0,`Missing current curriculum recordings:\n${gaps.join('\n')}`);
console.log(`Azure coverage valid: ${count} recordings, ${Object.keys(azureVoices).length} regions, ${(bytes/1024/1024).toFixed(1)} MiB.`);
