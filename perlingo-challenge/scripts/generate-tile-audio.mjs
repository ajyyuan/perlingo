// Run from the repository root: node --env-file=.env.local perlingo-challenge/scripts/generate-tile-audio.mjs
// Uses primary-language catalog voices. Never falls back to a generic English voice.
import {readFile,writeFile,mkdir,open,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {languages,packs} from '../public/content.js';
const root=new URL('../',import.meta.url),cache=new URL('.cache/voices/',root);
await mkdir(cache,{recursive:true});
const lock=new URL('generation.lock',cache);await open(lock,'wx').then(f=>f.close());
try {
const catalog=JSON.parse(await readFile(new URL('voice-candidates.json',root)));
const only=process.env.AUDIO_LANGUAGE,onlyPack=process.env.AUDIO_PACK,override=process.env.AUDIO_VOICE_INDEX;

const preferred={en:1,zh:1,hi:1,ar:2,bn:2,id:1,mr:1,te:0,ta:0,ko:1,fa:0,th:0,pl:1,uk:1,kn:1,ro:2,nl:2,da:1,ms:1,he:1};
await mkdir(new URL('public/audio/generated/',root),{recursive:true});
let records=[];try{records=JSON.parse(await readFile(new URL('generated-audio-sources.json',root)));}catch{}
let saving=Promise.resolve();
async function generateLanguage(l){if(only&&l.id!==only)return;const candidates=catalog.find(x=>x.language===l.id)?.candidates||[];const v=candidates[override===undefined?(preferred[l.id]||0):Number(override)];if(!v){console.log('No primary-language voice:',l.id);return;}
 for(const pack of packs){if(onlyPack&&pack.id!==onlyPack)continue;const e=pack.entries.find(e=>e.id===l.id);const previous=records.find(r=>r.pack===pack.id&&r.language===l.id&&r.word===e.word);if(previous&&(!process.env.AUDIO_REPLACE||(previous.voiceId===v.voice_id&&previous.model===(process.env.AUDIO_MODEL||'eleven_v3'))))continue;
 const body={text:e.word,model_id:process.env.AUDIO_MODEL||'eleven_v3',language_code:l.id,seed:417,voice_settings:{stability:1,similarity_boost:0.75}};
 const response=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+v.voice_id+'?output_format=mp3_44100_128',{method:'POST',headers:{'xi-api-key':process.env.ELEVENLABS_API_KEY,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});
 if(!response.ok){console.log(l.id,pack.id,response.status,(await response.text()).slice(0,350));continue;}
 const bytes=Buffer.from(await response.arrayBuffer()),file=`/audio/generated/${pack.id}-${l.id}.mp3`;
 if(previous){await mkdir(new URL('rejected/',cache),{recursive:true});await writeFile(new URL('rejected/'+previous.sha256+'.mp3',cache),await readFile(new URL('public'+previous.file,root)));await writeFile(new URL('rejected/'+previous.sha256+'.json',cache),JSON.stringify(previous,null,2));records=records.filter(r=>r!==previous);}
 await writeFile(new URL('public'+file,root),bytes);
 records.push({pack:pack.id,language:l.id,languageName:l.name,word:e.word,kind:'generated',provider:'elevenlabs',model:body.model_id,voiceId:v.voice_id,speaker:v.name,accent:v.accent,voicePrimaryLanguage:v.language,voiceDescription:v.description,generation:body,source:'https://elevenlabs.io/voice-library?voiceId='+v.voice_id,license:'ElevenLabs account terms',licenseUrl:'https://elevenlabs.io/terms-of-use',provenance:'Synthesized with a catalog voice whose primary language matches this tile. Automated checks do not certify native pronunciation.',processing:'Original generated MP3; no trimming or speed changes.',file,sha256:createHash('sha256').update(bytes).digest('hex'),generatedAt:new Date().toISOString(),reviewStatus:'pending'});
 saving=saving.then(()=>writeFile(new URL('generated-audio-sources.json',root),JSON.stringify(records,null,2)+'\n'));await saving;console.log(pack.id,l.id,bytes.length);
 }
}

const queue=[...languages];await Promise.all(Array.from({length:3},async()=>{while(queue.length)await generateLanguage(queue.shift());}));

} finally {await unlink(lock);}
