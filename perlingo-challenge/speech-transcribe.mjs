import {speechLocales,googleSpeechLocales,speechCandidates,pcmWav} from './public/speech-profiles.js';
export const MAX_PCM_BYTES=32000*15;
export function extraProviders(env){return {munsit:!!env.MUNSIT_API_KEY,google:!!env.GOOGLE_SPEECH_API_KEY,azure:!!env.AZURE_SPEECH_KEY&&/^[a-z0-9-]+$/.test(env.AZURE_SPEECH_REGION||''),sarvam:!!env.SARVAM_API_KEY};}
// Read a bounded raw 16kHz/16-bit/mono PCM body. Never forward client-selected hosts,
// models, locales, reference answers or provider response payloads.
export async function transcribe(request,env,{upstream=fetch}={}){
 const reply=(status,data)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
 const url=new URL(request.url),provider=url.searchParams.get('provider'),language=url.searchParams.get('language');
 if(!['azure','sarvam','google','munsit'].includes(provider)||!Object.hasOwn(speechLocales,language)||!speechCandidates(language).includes(provider))return reply(400,{error:'Unsupported recognition route.'});
 if(!extraProviders(env)[provider])return reply(503,{error:'This recognition provider is not configured.'});
 if(request.headers.get('Content-Type')!=='application/octet-stream')return reply(415,{error:'Expected 16 kHz mono PCM.'});
 if(Number(request.headers.get('Content-Length'))>MAX_PCM_BYTES)return reply(413,{error:'Recording is too long.'});
 let size=0;const chunks=[],reader=request.body?.getReader();if(!reader)return reply(400,{error:'Empty recording.'});
 try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_PCM_BYTES){await reader.cancel();return reply(413,{error:'Recording is too long.'});}chunks.push(value);}}catch{return reply(400,{error:'Recording interrupted.'});}
 if(size<3200||size%2)return reply(400,{error:'Invalid PCM recording.'});
 const pcm=new Uint8Array(size);let offset=0;for(const chunk of chunks){pcm.set(chunk,offset);offset+=chunk.byteLength;}
 const wav=pcmWav(pcm.buffer);let endpoint,options;
 if(provider==='munsit'){
  const form=new FormData();form.set('file',new Blob([wav],{type:'audio/wav'}),'utterance.wav');form.set('model','munsit');form.set('return_timestamps','false');
  endpoint='https://api.munsit.com/api/v1/audio/transcribe';options={headers:{'x-api-key':env.MUNSIT_API_KEY},body:form};
 }else if(provider==='azure'){
  endpoint=`https://${env.AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${speechLocales[language]}&format=simple&profanity=raw`;
  options={headers:{'Ocp-Apim-Subscription-Key':env.AZURE_SPEECH_KEY,'Content-Type':'audio/wav; codecs=audio/pcm; samplerate=16000',Accept:'application/json'},body:wav};
 }else if(provider==='google'){
  // Chunk conversion avoids argument limits and works in Node and the hosted Worker.
  let binary='';for(let i=0;i<pcm.length;i+=8192)binary+=String.fromCharCode(...pcm.subarray(i,i+8192));
  endpoint='https://speech.googleapis.com/v1/speech:recognize';
  options={headers:{'x-goog-api-key':env.GOOGLE_SPEECH_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({config:{encoding:'LINEAR16',sampleRateHertz:16000,audioChannelCount:1,languageCode:googleSpeechLocales[language],model:'latest_short',maxAlternatives:1},audio:{content:btoa(binary)}})};
 }else{
  const form=new FormData();form.set('file',new Blob([wav],{type:'audio/wav'}),'utterance.wav');form.set('model','saaras:v4');form.set('language_code',speechLocales[language]);form.set('mode','verbatim');
  endpoint='https://api.sarvam.ai/speech-to-text';options={headers:{'api-subscription-key':env.SARVAM_API_KEY},body:form};
 }
 try{
  const res=await upstream(endpoint,{...options,method:'POST',signal:AbortSignal.timeout(12000)});if(!res.ok)return reply(502,{error:'Recognition provider could not transcribe. Check access, credits and connection.'});
  const data=await res.json();
  if(provider==='azure'&&!['Success','NoMatch','InitialSilenceTimeout','BabbleTimeout'].includes(data.RecognitionStatus))return reply(502,{error:'Recognition could not finish.'});
  if(provider==='google'&&(data.error||(data.results!==undefined&&!Array.isArray(data.results))))return reply(502,{error:'Recognition returned an invalid result.'});
  if(provider==='munsit'&&data.statusCode!==200)return reply(502,{error:'Recognition could not finish.'});
  const text=provider==='munsit'?data.data?.transcription:provider==='google'?(data.results||[]).map(result=>result.alternatives?.[0]?.transcript||'').join(' '):provider==='azure'?(data.RecognitionStatus==='Success'?data.DisplayText:''):data.transcript;
  if(typeof text!=='string')return reply(502,{error:'Recognition returned an invalid result.'});
  return reply(200,{text:text.slice(0,4000),final:true});
 }catch{return reply(502,{error:'Recognition could not connect. Please retry.'});}
}
