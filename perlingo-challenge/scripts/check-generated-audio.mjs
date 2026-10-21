// Independent transcription screen, NOT a native-speaker pronunciation certification.
// FFMPEG=/path/to/ffmpeg node perlingo-challenge/scripts/check-generated-audio.mjs
import {readFile,writeFile} from 'node:fs/promises';import {execFileSync} from 'node:child_process';
import {comparePCM} from '../public/benchmark.js';import {exactAudioWord} from './audio-word-match.mjs';
const root=new URL('../',import.meta.url),originalFetch=globalThis.fetch;globalThis.fetch=(url,options)=>originalFetch(new URL(url,'http://127.0.0.1:5174'),options);
let rows=[];try{rows=JSON.parse(await readFile(new URL('generated-audio-checks.json',root))).rows;}catch{}
const sources=JSON.parse(await readFile(new URL('generated-audio-sources.json',root)));
let saving=Promise.resolve();
async function check(s){const provider=process.env.AUDIO_CHECK_PROVIDER||'soniox';if(process.env.AUDIO_LANGUAGE&&s.language!==process.env.AUDIO_LANGUAGE)return;if(rows.some(r=>r.sha256===s.sha256&&(r.provider||'soniox')===provider))return;
 const raw=execFileSync(process.env.FFMPEG||'ffmpeg',['-v','error','-i',new URL('public'+s.file,root).pathname,'-f','s16le','-ac','1','-ar','16000','pipe:1']);
 const pcm=Buffer.concat([Buffer.alloc(6400),raw,Buffer.alloc(16000)]);const results=await comparePCM(pcm.buffer.slice(pcm.byteOffset,pcm.byteOffset+pcm.byteLength),s.language,[s.word],[provider]);
 const result=results[0];const row={provider,pack:s.pack,language:s.language,word:s.word,sha256:s.sha256,duration:raw.length/32000,transcript:result.text,error:result.error,exactMatch:!result.error&&exactAudioWord(result.text,s.word,s.language)};
 rows.push(row);console.log(JSON.stringify(row));saving=saving.then(()=>writeFile(new URL('generated-audio-checks.json',root),JSON.stringify({date:new Date().toISOString(),method:'FFmpeg decode; transcription by provider named on each row (legacy rows: Soniox stt-rt-v5; elevenlabs: Scribe v2 Realtime), expected language only, no target-word hint; exact normalized word match, including Thai Unicode decomposition and Serbian Latin/Cyrillic equivalents (not game substring scoring). This checks intelligibility, not accent, stress, tone or native-speaker quality. No listening review performed.',rows},null,2)+'\n'));await saving;
}

const queue=[...sources];await Promise.all(Array.from({length:3},async()=>{while(queue.length)await check(queue.shift());}));
