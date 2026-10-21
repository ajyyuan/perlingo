// Restore only the curated, pinned sources. Adding clips requires manual source review.
import {readFile,writeFile,mkdir} from 'node:fs/promises';import {createHash} from 'node:crypto';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url),sources=JSON.parse(await readFile(new URL('tile-audio-sources.json',root))),hash=b=>createHash('sha256').update(b).digest('hex');
await mkdir(new URL('.cache/tile-sources/',root),{recursive:true});await mkdir(new URL('public/audio/',root),{recursive:true});
for(const r of sources){
 const target=new URL('public'+r.file,root);try{if(hash(await readFile(target))===r.sha256)continue;}catch{}
 const response=await fetch(r.downloadUsed,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`${r.title}: HTTP ${response.status}; stop and retry later, respecting provider rate limits.`);
 const bytes=Buffer.from(await response.arrayBuffer());if(hash(bytes)!==r.sourceSha256)throw Error('Source changed; review before updating: '+r.title);
 const source=new URL('.cache/tile-sources/'+r.pack+'-'+r.language,root);await writeFile(source,bytes);
 execFileSync(process.env.FFMPEG||'ffmpeg',['-v','error','-y','-i',fileURLToPath(source),'-vn','-ac','1','-ar','44100','-codec:a','libmp3lame','-q:a','3',fileURLToPath(target)]);
 if(hash(await readFile(target))!==r.sha256)throw Error('Encoding differs from pinned FFmpeg 7.1 output: '+r.title);
 console.log(r.pack,r.language);await new Promise(r=>setTimeout(r,3000));
}
