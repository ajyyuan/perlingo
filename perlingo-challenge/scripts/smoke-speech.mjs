// Streams a generated, non-user speech fixture. Never logs credentials or tokens.
import {readFile} from 'node:fs/promises';
import {matchesAnswer} from '../public/engine.js';
const [file,language='en',expected='bread']=process.argv.slice(2);
if(!file)throw Error('Usage: node smoke-speech.mjs fixture.wav language expected');
const wav=await readFile(file);let offset=12,pcm;
while(offset+8<=wav.length){const size=wav.readUInt32LE(offset+4);if(wav.toString('ascii',offset,offset+4)==='data'){pcm=wav.subarray(offset+8,offset+8+size);break;}offset+=8+size+(size%2);}
if(!pcm)throw Error('No PCM audio');
pcm=Buffer.concat([Buffer.alloc(6400),pcm,Buffer.alloc(6400)]);
const response=await fetch('http://127.0.0.1:5174/api/speech/token',{method:'POST',headers:{'X-Perlingo-Challenge':'1'}});const data=await response.json();if(!response.ok)throw Error(data.error);
const ws=new WebSocket('wss://api.elevenlabs.io/v1/speech-to-text/realtime?'+new URLSearchParams({token:data.token,model_id:'scribe_v2_realtime',audio_format:'pcm_16000',language_code:language,commit_strategy:'manual'}));
await new Promise((resolve,reject)=>{
 let start=0,commit=0;const timeout=setTimeout(()=>{ws.close();reject(Error('Speech result timeout'));},15000);
 ws.onmessage=async event=>{const msg=JSON.parse(event.data);
  if(msg.message_type==='session_started'){
   start=performance.now();for(let i=0;i<pcm.length;i+=2560){ws.send(JSON.stringify({message_type:'input_audio_chunk',audio_base_64:pcm.subarray(i,i+2560).toString('base64'),sample_rate:16000}));await new Promise(r=>setTimeout(r,80));}
   commit=performance.now();ws.send(JSON.stringify({message_type:'input_audio_chunk',audio_base_64:Buffer.alloc(11200).toString('base64'),sample_rate:16000,commit:true}));
  }else if(msg.message_type==='committed_transcript'){
   console.log(JSON.stringify({language,expected,transcript:msg.text,match:matchesAnswer(msg.text,[expected],language),afterCommitMs:Math.round(performance.now()-commit),totalMs:Math.round(performance.now()-start)}));clearTimeout(timeout);ws.close();resolve();
  }else if(msg.error){clearTimeout(timeout);ws.close();reject(Error(msg.message_type));}
 };ws.onerror=()=>{clearTimeout(timeout);reject(Error('WebSocket connection failed'));};
});
