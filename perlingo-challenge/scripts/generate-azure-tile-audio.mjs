// node perlingo-challenge/scripts/generate-azure-tile-audio.mjs /private/path/to/existing-speech-key
// Fixed twelve-clip scope. Reads a credential; never prints or persists it in metadata.
import {readFile,writeFile,mkdir,open,unlink} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {languages,packs} from '../public/content.js';
const root=new URL('../',import.meta.url),cache=new URL('.cache/voices/',root);await mkdir(cache,{recursive:true});
const lock=new URL('generation.lock',cache);await open(lock,'wx').then(f=>f.close());
try {
 const key=(await readFile(process.argv[2],'utf8')).trim();if(key.length<30)throw Error('Missing Speech key');
 const locales={sw:'sw-TZ',af:'af-ZA',et:'et-EE',lv:'lv-LV',lt:'lt-LT',sl:'sl-SI'};
 const response=await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/voices/list',{headers:{'Ocp-Apim-Subscription-Key':key},signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('Voice list HTTP '+response.status);
 const voices=await response.json();const records=JSON.parse(await readFile(new URL('generated-audio-sources.json',root)));
 const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
 for(const [language,locale] of Object.entries(locales)){if(process.env.AUDIO_LANGUAGE&&language!==process.env.AUDIO_LANGUAGE)continue;
  const voice=voices.find(v=>v.Locale===locale&&v.Gender===(process.env.AUDIO_GENDER||'Female')&&v.VoiceType==='Neural'&&v.Status==='GA');if(!voice)throw Error('No GA native-locale voice: '+locale);
  for(const pack of packs){if(process.env.AUDIO_PACK&&pack.id!==process.env.AUDIO_PACK)continue;const entry=pack.entries.find(e=>e.id===language);const previous=records.find(r=>r.pack===pack.id&&r.language===language&&r.word===entry.word);if(previous&&(!process.env.AUDIO_REPLACE||previous.voiceId===voice.ShortName))continue;
   const ssml=`<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${locale}"><voice name="${voice.ShortName}">${esc(entry.word)}</voice></speak>`;
   const r=await fetch('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1',{method:'POST',headers:{'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':'audio-24khz-96kbitrate-mono-mp3'},body:ssml,signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error('Azure synthesis HTTP '+r.status+' for '+language);
   const bytes=Buffer.from(await r.arrayBuffer()),file=`/audio/generated/${pack.id}-${language}.mp3`;if(previous){await mkdir(new URL('rejected/',cache),{recursive:true});await writeFile(new URL('rejected/'+previous.sha256+'.mp3',cache),await readFile(new URL('public'+previous.file,root)));await writeFile(new URL('rejected/'+previous.sha256+'.json',cache),JSON.stringify(previous,null,2));records.splice(records.indexOf(previous),1);}await writeFile(new URL('public'+file,root),bytes);
   records.push({pack:pack.id,language,languageName:languages.find(l=>l.id===language).name,word:entry.word,kind:'generated',provider:'azure',model:'Azure Neural',voiceId:voice.ShortName,speaker:voice.DisplayName,accent:locale,voicePrimaryLanguage:language,voiceDescription:`Azure GA neural voice with primary locale ${voice.Locale}`,generation:{text:entry.word,locale,voice:voice.ShortName,format:'audio-24khz-96kbitrate-mono-mp3',ssml},source:'https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=text-to-speech',license:'Microsoft Azure account terms',licenseUrl:'https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/all',provenance:'Synthesized using an Azure neural voice for the target locale. Automated checks do not certify native pronunciation.',processing:'Original generated MP3; no trimming or speed changes.',file,sha256:createHash('sha256').update(bytes).digest('hex'),generatedAt:new Date().toISOString(),reviewStatus:'pending'});
   await writeFile(new URL('generated-audio-sources.json',root),JSON.stringify(records,null,2)+'\n');console.log(pack.id,language,voice.ShortName,bytes.length);
  }
 }
} finally {await unlink(lock);}
