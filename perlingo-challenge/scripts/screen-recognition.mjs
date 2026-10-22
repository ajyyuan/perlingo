// Compare identical cached speech across configured recognizers. Synthetic screen only.
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {comparePCM} from '../public/benchmark.js';
import {packs,getEntry} from '../public/content.js';
import {speechCandidates} from '../public/speech-profiles.js';
const root=new URL('../',import.meta.url),originalFetch=globalThis.fetch;
globalThis.fetch=(url,options)=>originalFetch(new URL(String(url).replace(/^\/api\//,'/challenge/api/'),'http://127.0.0.1:5173'),options);
const status=await(await fetch('/api/status')).json();
const languages=(process.env.SCREEN_LANGUAGES||'ta,te,ml,da,bn,no').split(',');
const sources=JSON.parse(await readFile(new URL('generated-audio-sources.json',root))),rows=[];
const cases=languages.flatMap(language=>[...packs.map(pack=>({language,pack:pack.id})),{language,pack:'bread',silence:true}]);
const output=new URL(process.env.SCREEN_OUTPUT||'recognition-six-language-screen.json',root);let saving=Promise.resolve();
async function run(c){
 let raw=Buffer.alloc(0),hash=null;
 if(!c.silence){const s=sources.find(s=>s.language===c.language&&s.pack===c.pack);const bytes=await readFile(new URL('public'+s.file,root));hash=createHash('sha256').update(bytes).digest('hex');if(hash!==s.sha256)throw Error('Asset hash mismatch');raw=execFileSync(process.env.FFMPEG||'/private/tmp/perlingo-audio-tools/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1',['-v','error','-i','pipe:0','-f','s16le','-ac','1','-ar','16000','pipe:1'],{input:bytes});}
 const pcm=Buffer.concat([Buffer.alloc(6400),raw,Buffer.alloc(c.silence?57600:19200)]),entry=getEntry(c.pack,c.language),competitors=packs.filter(p=>p.id!==c.pack).flatMap(p=>getEntry(p.id,c.language)?.accepted||[]);
 const results=await comparePCM(pcm.buffer.slice(pcm.byteOffset,pcm.byteOffset+pcm.byteLength),c.language,entry,speechCandidates(c.language).filter(n=>status.providers[n]),competitors);
 // Score every returned transcript against other packs too; these are only limited
 // same-vocabulary negatives, not evidence for arbitrary wrong words/learner accents.
 const {spokenVerdict}=await import('../public/engine.js');
 for(const r of results)r.otherPacksAccepted=packs.filter(p=>p.id!==c.pack&&spokenVerdict({text:r.text,final:true},getEntry(p.id,c.language),packs.filter(x=>x.id!==p.id).flatMap(x=>getEntry(x.id,c.language)?.accepted||[])).accepted).map(p=>p.id);
 rows.push({...c,word:entry.word,sourceSha256:hash,audioSha256:createHash('sha256').update(pcm).digest('hex'),results});console.log(c.language,c.silence?'silence':c.pack,results.map(r=>r.name+':'+(r.error?'ERROR':r.accepted?'yes':'no')).join(' '));
 saving=saving.then(()=>writeFile(output,JSON.stringify({date:new Date().toISOString(),method:'Cached generated study audio, identical 16kHz PCM, 200ms leading/600ms trailing silence. One commit after clip. Explicit language, no target-word hints, game speech matcher. Synthetic intelligibility screen, NOT learner-accent accuracy or browser endpointing. Non-target pack matches are limited negatives; synonyms need interpretation.',plannedCases:cases.length,completedCases:rows.length,rows},null,2)+'\n'));await saving;
}
const queue=[...cases];await Promise.all(Array.from({length:2},async()=>{while(queue.length)await run(queue.shift());}));
