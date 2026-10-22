// Synthetic Google integration screen; not learner-accent validation.
import {readFile,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {transcribe} from '../speech-transcribe.mjs';
import {googleSpeechLocales} from '../public/speech-profiles.js';
import {packs,getEntry} from '../public/content.js';
import {spokenVerdict} from '../public/engine.js';
process.loadEnvFile('.env.local');
const root=new URL('../',import.meta.url),sources=JSON.parse(await readFile(new URL('generated-audio-sources.json',root))),rows=[];
const provider=process.env.SCREEN_PROVIDER||'google',screenLanguages=process.env.SCREEN_LANGUAGES?.split(',')||Object.keys(googleSpeechLocales);
for(const language of screenLanguages)for(const pack of ['bread','moon','silence']){
 let raw=Buffer.alloc(0),sourceSha256=null;
 if(pack!=='silence'){
  const source=sources.find(s=>s.language===language&&s.pack===pack),bytes=await readFile(new URL('public'+source.file,root));
  sourceSha256=createHash('sha256').update(bytes).digest('hex');if(sourceSha256!==source.sha256)throw Error('Asset hash mismatch');
  raw=execFileSync(process.env.FFMPEG||'/private/tmp/perlingo-audio-tools/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v7.1',['-v','error','-i','pipe:0','-f','s16le','-ac','1','-ar','16000','pipe:1'],{input:bytes});
 }
 const pcm=Buffer.concat([Buffer.alloc(6400),raw,Buffer.alloc(pack==='silence'?57600:19200)]),start=Date.now();
 const response=await transcribe(new Request(`http://localhost/api/speech/transcribe?provider=${provider}&language=${language}`,{method:'POST',headers:{'Content-Type':'application/octet-stream'},body:pcm}),process.env),result=await response.json();
 const entry=getEntry(pack==='silence'?'bread':pack,language),competitors=packs.flatMap(p=>p.id===(pack==='silence'?'bread':pack)?[]:getEntry(p.id,language)?.accepted||[]);
 const accepted=spokenVerdict({text:result.text||'',final:true},entry,competitors).accepted;
 rows.push({language,locale:googleSpeechLocales[language],pack,provider,model:provider==='munsit'?'munsit':'latest_short',sourceSha256,audioSha256:createHash('sha256').update(pcm).digest('hex'),status:response.status,...result,accepted,elapsedMs:Date.now()-start});
 console.log(language,pack,response.status,result.text??result.error,accepted);
}
await writeFile(new URL(process.env.SCREEN_OUTPUT||'google-short-word-screen.json',root),JSON.stringify({date:new Date().toISOString(),method:'Cached generated teaching clips, 16kHz PCM, 200ms lead/600ms tail. No answer hints. Bread/Moon positives and silence only. Not learner-accent or microphone endpointing validation.',rows},null,2)+'\n');
