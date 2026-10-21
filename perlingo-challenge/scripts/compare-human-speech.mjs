import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {comparePCM} from '../public/benchmark.js';
import {getEntry} from '../public/content.js';
const root=new URL('../',import.meta.url),sources=JSON.parse(await readFile(new URL('human-audio-sources.json',root)));
const originalFetch=globalThis.fetch;globalThis.fetch=(url,options)=>originalFetch(new URL(url,'http://127.0.0.1:5174'),options);
const status=await(await fetch('/api/status')).json();if(!status.providers?.elevenlabs||!status.providers?.soniox)throw Error('Both providers must be configured');
const selected=sources.filter(s=>s.useInBenchmark),rows=[];
const hash=b=>createHash('sha256').update(b).digest('hex');
async function pcm(source){const data=await readFile(new URL(source.file,root));if(hash(data)!==source.pcmSha256)throw Error('PCM hash mismatch: '+source.title);return data;}
const cases=[];
for(const source of selected){
 const raw=await pcm(source);if(raw.length>89600)throw Error('Source exceeds window; do not truncate speech: '+source.title);
 cases.push({language:source.language,kind:source.role,shouldAccept:source.role==='correct',sources:[source],raw,offset:6400});
 if(source.role==='correct')cases.push({language:source.language,kind:'late-correct',shouldAccept:true,sources:[source],raw,offset:96000-raw.length-1600});
}
for(const language of [...new Set(selected.map(s=>s.language))]){
 cases.push({language,kind:'silence',shouldAccept:false,sources:[],raw:Buffer.alloc(0),offset:0});
 const correct=selected.find(s=>s.language===language&&s.role==='correct'),wrong=selected.find(s=>s.language===language&&s.role==='wrong');
 if(correct&&wrong){const raw=Buffer.concat([await pcm(wrong),Buffer.alloc(4800),await pcm(correct)]);if(raw.length<=89600)cases.push({language,kind:'spliced-correction',shouldAccept:true,sources:[wrong,correct],raw,offset:6400});}
}
for(const c of cases){
 const buffer=Buffer.alloc(96000);c.raw.copy(buffer,c.offset);
 const results=await comparePCM(buffer.buffer.slice(buffer.byteOffset,buffer.byteOffset+buffer.byteLength),c.language,getEntry('bread',c.language).accepted);
 const row={language:c.language,kind:c.kind,shouldAccept:c.shouldAccept,sources:c.sources.map(s=>s.id),nativeProvenance:c.sources.length>0&&c.sources.every(s=>s.nativeDeclaration),audioSha256:hash(buffer),results};rows.push(row);console.log(JSON.stringify(row));
 await writeFile(new URL('human-speech-results.json',root),JSON.stringify({date:new Date().toISOString(),source:'Human Commons/Lingua Libre recordings; provenance tiers in human-audio-sources.json',models:{elevenlabs:'scribe_v2_realtime',soniox:'stt-rt-v5'},method:'Identical PCM; 16 kHz mono; 3 seconds; real-time streaming; one finalization at end; known language, no answer hint. Spliced corrections are constructed, not natural human self-corrections.',plannedCases:cases.length,completedCases:rows.length,rows},null,2)+'\n');
}
