// Connection-only coverage audit. No microphone or audio; tokens never printed.
import {languages} from '../public/content.js';import {writeFile} from 'node:fs/promises';
const results=[];
for(const language of languages){
 const r=await fetch('http://127.0.0.1:5174/api/speech/token',{method:'POST',headers:{'X-Perlingo-Challenge':'1'}});const d=await r.json();if(!r.ok)throw Error(d.error);
 const result=await new Promise(resolve=>{
  const ws=new WebSocket('wss://api.elevenlabs.io/v1/speech-to-text/realtime?'+new URLSearchParams({token:d.token,model_id:'scribe_v2_realtime',audio_format:'pcm_16000',language_code:language.id,commit_strategy:'manual'}));
  let done=false;const finish=result=>{if(done)return;done=true;clearTimeout(timer);ws.close();resolve(result);};const timer=setTimeout(()=>finish('timeout'),10000);
  ws.onmessage=e=>{const data=JSON.parse(e.data);if(data.message_type==='session_started')finish('ready');else if(data.error)finish(data.message_type);};ws.onerror=()=>finish('connection-error');
 });results.push({language:language.id,result});if(result!=='ready')console.log(language.id,result);
}
await writeFile(new URL('../provider-check.json',import.meta.url),JSON.stringify({checked:'2026-10-20',provider:'elevenlabs',model:'scribe_v2_realtime',scope:'Session handshake only; does not certify recognition accuracy or pronunciation playback.',results},null,2)+'\n');
console.log(`${results.filter(r=>r.result==='ready').length}/${results.length} languages accepted by realtime endpoint`);
