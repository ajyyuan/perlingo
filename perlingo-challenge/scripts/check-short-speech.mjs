// Native/supplemental human pilot for the short-audio broker; not learner-accent validation.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {transcribe} from '../speech-transcribe.mjs';
import {getEntry,packs} from '../public/content.js';
import {spokenVerdict} from '../public/engine.js';
process.loadEnvFile(new URL('../../.env.local',import.meta.url));
const root=new URL('../',import.meta.url),rows=[],sources=JSON.parse(await readFile(new URL('human-audio-sources.json',root))).filter(s=>s.useInBenchmark);
const cases=[...sources,...[...new Set(sources.map(s=>s.language))].map(language=>({language,role:'silence'}))];
for(const s of cases){
 const raw=s.file?await readFile(new URL(s.file,root)):Buffer.alloc(0);
 if(s.file&&createHash('sha256').update(raw).digest('hex')!==s.pcmSha256)throw Error('Source hash mismatch');
 if(raw.length>89600)throw Error('Do not truncate speech');
 const pcm=Buffer.alloc(96000);raw.copy(pcm,6400);
 const start=Date.now();const res=await transcribe(new Request(`http://localhost/challenge/api/speech/transcribe?provider=azure&language=${s.language}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:pcm}),process.env);const data=await res.json();
 const entry=getEntry('bread',s.language),competitors=packs.filter(p=>p.id!=='bread').flatMap(p=>getEntry(p.id,s.language)?.accepted||[]);
 const row={language:s.language,kind:s.role,sourceId:s.id||null,nativeDeclaration:!!s.nativeDeclaration,audioSha256:createHash('sha256').update(pcm).digest('hex'),shouldAccept:s.role==='correct',status:res.status,requestMs:Date.now()-start,...(res.ok?{text:data.text,accepted:spokenVerdict(data,entry,competitors).accepted}:{error:data.error})};rows.push(row);console.log(JSON.stringify(row));
}
await writeFile(new URL('azure-human-pilot.json',root),JSON.stringify({date:new Date().toISOString(),provider:'azure',model:'locale-specific short-audio API (unversioned)',method:'Existing sourced human PCM, padded to 3 seconds; one REST request after clip completion; no reference answer; current game matcher. Not browser microphone/endpointing or learner-accent validation. Request time includes uploading entire clip; not directly comparable to streaming post-clip latency.',rows},null,2)+'\n');
