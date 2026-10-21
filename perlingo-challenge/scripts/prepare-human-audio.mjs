// Downloads only curated public source URLs; verifies exact source and decoded PCM hashes.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root=new URL('../',import.meta.url),hash=b=>createHash('sha256').update(b).digest('hex');
const sources=JSON.parse(await readFile(new URL('human-audio-sources.json',root)));
for(const source of sources){
 const original=new URL('.cache/human/'+source.id+(source.downloadFormat||path.extname(source.title)),root),pcm=new URL(source.file,root);await mkdir(new URL('.cache/human/',root),{recursive:true});let data;
 try{data=await readFile(original);}catch{
  for(let attempt=0;attempt<5;attempt++){
   const response=await fetch(source.download,{headers:{'User-Agent':'PerlingoAudioResearch/1.0'},signal:AbortSignal.timeout(30000)});
   if(response.status===429){await new Promise(r=>setTimeout(r,10000*(attempt+1)));continue;}
   if(!response.ok)throw Error('Download failed: '+response.status+' '+source.title);data=Buffer.from(await response.arrayBuffer());break;
  }
  if(!data)throw Error('Download rate limited: '+source.title);
  if(hash(data)!==source.sourceSha256)throw Error('Source changed: '+source.title);await writeFile(original,data);
 }
 if(hash(data)!==source.sourceSha256)throw Error('Source hash mismatch: '+source.title);
 try{if(hash(await readFile(pcm))===source.pcmSha256)continue;}catch{}
 execFileSync(process.env.FFMPEG||'ffmpeg',['-v','error','-y','-i',decodeURIComponent(original.pathname),'-ac','1','-ar','16000','-f','s16le',decodeURIComponent(pcm.pathname)]);
 if(hash(await readFile(pcm))!==source.pcmSha256)throw Error('PCM differs; check decoder version before changing the evidence: '+source.title);
 console.log(source.title);
}
