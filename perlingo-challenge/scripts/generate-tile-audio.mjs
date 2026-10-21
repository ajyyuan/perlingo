// Run from the repository root: node --env-file=.env.local perlingo-challenge/scripts/generate-tile-audio.mjs
// Uses primary-language catalog voices. Never falls back to a generic English voice.
import {readFile,writeFile,mkdir,open,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {languages,packs} from '../public/content.js';
const generationPacks=process.env.AUDIO_BATCH==='first-ten'?(await import('../data/word-bank/first-ten.js')).firstTen:packs;
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
async function generateLanguage(l){if(only&&l.id!==only)return;const candidates=catalog.find(x=>x.language===l.id)?.candidates||[];let v=candidates[override===undefined?(preferred[l.id]||0):Number(override)];const winner=process.env.AUDIO_BATCH==='first-ten'&&!override?records.find(r=>r.language===l.id&&r.provider==='elevenlabs'&&r.pack==='bread'):null;if(winner){v=candidates.find(c=>c.voice_id===winner.voiceId)||v;}if(!v){console.log('No primary-language voice:',l.id);return;}
 for(const pack of generationPacks){if(onlyPack&&pack.id!==onlyPack)continue;const e=pack.entries.find(e=>e.id===l.id);const previous=records.find(r=>r.pack===pack.id&&r.language===l.id);
 const body={text:e.word+(process.env.AUDIO_PUNCTUATION==='period'?'.':''),model_id:process.env.AUDIO_MODEL||winner?.model||'eleven_v3',language_code:l.id,seed:Number(process.env.AUDIO_SEED)||417,voice_settings:{stability:1,similarity_boost:0.75}};
 if(process.env.AUDIO_PREVIOUS_TEXT)body.previous_text=process.env.AUDIO_PREVIOUS_TEXT;
 if(process.env.AUDIO_SPEED)body.voice_settings.speed=Number(process.env.AUDIO_SPEED);
 if(previous&&previous.word===e.word&&(!process.env.AUDIO_REPLACE||(previous.voiceId===v.voice_id&&JSON.stringify(previous.generation)===JSON.stringify(body))))continue;
 const response=await fetch('https://api.elevenlabs.io/v1/text-to-speech/'+v.voice_id+'?output_format=mp3_44100_128',{method:'POST',headers:{'xi-api-key':process.env.ELEVENLABS_API_KEY,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(90000)});
 if(!response.ok){console.log(l.id,pack.id,'HTTP',response.status);if([401,402,403,429].includes(response.status))throw Error('Generation stopped: provider authorization, quota or rate limit (HTTP '+response.status+').');continue;}
 const bytes=Buffer.from(await response.arrayBuffer()),file=`/audio/generated/${pack.id}-${l.id}.mp3`;
 if(previous){await mkdir(new URL('rejected/',cache),{recursive:true});await writeFile(new URL('rejected/'+previous.sha256+'.mp3',cache),await readFile(new URL(previous.stagedFile||('public'+previous.file),root)));await writeFile(new URL('rejected/'+previous.sha256+'.json',cache),JSON.stringify(previous,null,2));records=records.filter(r=>r!==previous);}
 await writeFile(new URL(previous?.stagedFile||('public'+file),root),bytes);
 records.push({... (previous?.stagedFile?{stagedFile:previous.stagedFile}:{}),pack:pack.id,language:l.id,languageName:l.name,word:e.word,kind:'generated',provider:'elevenlabs',model:body.model_id,voiceId:v.voice_id,speaker:v.name,accent:v.accent,voicePrimaryLanguage:v.language,voiceDescription:v.description,generation:body,source:'https://elevenlabs.io/voice-library?voiceId='+v.voice_id,license:'ElevenLabs account terms',licenseUrl:'https://elevenlabs.io/terms-of-use',provenance:'Synthesized with a catalog voice whose primary language matches this tile. Automated checks do not certify native pronunciation.',processing:'Original generated MP3; no trimming or speed changes.',file,sha256:createHash('sha256').update(bytes).digest('hex'),generatedAt:new Date().toISOString(),reviewStatus:'pending'});
 saving=saving.then(()=>writeFile(new URL('generated-audio-sources.json',root),JSON.stringify(records,null,2)+'\n'));await saving;console.log(pack.id,l.id,bytes.length);
 }
}

const queue=[...languages];await Promise.all(Array.from({length:3},async()=>{while(queue.length)await generateLanguage(queue.shift());}));

} finally {await unlink(lock);}
