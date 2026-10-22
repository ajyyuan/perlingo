import {speechCandidates,speechRoutes} from './speech-profiles.js';
export async function requestJSON(url){
 const res=await fetch(url,{method:'POST',headers:{'X-Perlingo-Challenge':'1'},signal:AbortSignal.timeout(30000)});
 const data=await res.json();if(!res.ok)throw Error(data.error||'Speech service unavailable.');return data;
}
function base64(buffer){let result='';for(const b of new Uint8Array(buffer))result+=String.fromCharCode(b);return btoa(result);}
export class Microphone{
 async open(onLevel=()=>{}){
  this.stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
  try{
   this.context=new AudioContext({sampleRate:16000});await this.context.audioWorklet.addModule('/pcm-worklet.js');await this.context.resume();
   this.source=this.context.createMediaStreamSource(this.stream);this.node=new AudioWorkletNode(this.context,'pcm-capture');
   this.mute=this.context.createGain();this.mute.gain.value=0;this.source.connect(this.node).connect(this.mute).connect(this.context.destination);
   this.node.port.onmessage=event=>{const pcm=new Int16Array(event.data.buffer);let sum=0;for(const n of pcm)sum+=(n/32768)**2;const level=Math.sqrt(sum/pcm.length);onLevel(level);this.onAudio?.(event.data.buffer,level,event.data.token,event.data.startTime);};
  }catch(error){this.close();throw error;}
 }
 reset(token){this.node?.port.postMessage(token);}
 close(){this.onAudio=null;this.node?.disconnect();this.source?.disconnect();this.stream?.getTracks().forEach(t=>t.stop());this.context?.close().catch(()=>{});}
}
// Swappable provider contract: prepare(language) -> session with push/commit/close,
// onTranscript({text,final}), onError(error). No scoring or UI in this adapter.
export class ElevenLabsProvider{
 async prepare(language){
  const {token}=await requestJSON('/api/speech/token');
  const params=new URLSearchParams({token,model_id:'scribe_v2_realtime',audio_format:'pcm_16000',language_code:language,commit_strategy:'manual',no_verbatim:'false'});
  const socket=new WebSocket(`wss://api.elevenlabs.io/v1/speech-to-text/realtime?${params}`);
  const session={closed:false,failed:null,pending:0,bytes:0,uncommitted:0,onTranscript:null,onError:null,
   push(buffer){if(socket.readyState!==WebSocket.OPEN||this.closed)return;this.bytes+=buffer.byteLength;this.uncommitted+=buffer.byteLength;socket.send(JSON.stringify({message_type:'input_audio_chunk',audio_base_64:base64(buffer),sample_rate:16000}));},
   commit(){if(socket.readyState!==WebSocket.OPEN||this.closed||!this.uncommitted)return false; // Pad short segments to >= 0.35 seconds.
    const padding=Math.max(0,11200-this.uncommitted);this.uncommitted=0;this.pending++;socket.send(JSON.stringify({message_type:'input_audio_chunk',audio_base_64:base64(new ArrayBuffer(padding)),sample_rate:16000,commit:true}));return true;},
   close(){this.closed=true;socket.close();}
  };
  await new Promise((resolve,reject)=>{
   let ready=false;const timer=setTimeout(()=>{socket.close();reject(Error('Speech connection timed out. Try again.'));},12000);
   const fail=error=>{if(session.failed)return;session.failed=error;clearTimeout(timer);if(!ready)reject(error);else session.onError?.(error);};
   socket.onmessage=event=>{let data;try{data=JSON.parse(event.data);}catch{return;}
    if(data.message_type==='session_started'){ready=true;clearTimeout(timer);resolve();return;}
    if(['partial_transcript','committed_transcript'].includes(data.message_type)){if(data.message_type==='committed_transcript')session.pending=Math.max(0,session.pending-1);session.onTranscript?.({text:data.text||'',final:data.message_type==='committed_transcript'});}
    else if(data.message_type==='insufficient_audio_activity'){session.pending=Math.max(0,session.pending-1);session.onTranscript?.({text:'',final:true});}
    else if(data.error||/error|exceeded|rate_limited|throttled/.test(data.message_type))fail(Error('ElevenLabs: '+String(data.message_type).replaceAll('_',' ')+'. Check permissions, credits, and connection.'));
   };
   socket.onerror=()=>fail(Error('Could not connect to ElevenLabs. Check your connection and API access.'));
   socket.onclose=()=>{clearTimeout(timer);if(!session.closed)fail(Error('Speech connection closed. Please retry.'));};
  });return session;
 }
}
export class SonioxProvider{
 async prepare(language){
  const {token}=await requestJSON('/api/speech/token?provider=soniox');
  const socket=new WebSocket('wss://stt-rt.soniox.com/transcribe-websocket',['soniox-api-key',token]);
  let committed='';
  const session={closed:false,failed:null,pending:0,uncommitted:0,onTranscript:null,onError:null,
   push(buffer){if(this.closed||socket.readyState!==WebSocket.OPEN)return;this.uncommitted+=buffer.byteLength;socket.send(buffer);},
   commit(){if(this.closed||socket.readyState!==WebSocket.OPEN||!this.uncommitted||this.pending)return false;this.uncommitted=0;this.pending++;socket.send(JSON.stringify({type:'finalize'}));return true;},
   close(){this.closed=true;socket.close();}
  };
  await new Promise((resolve,reject)=>{
   let ready=false;const timer=setTimeout(()=>{socket.close();reject(Error('Soniox connection timed out.'));},12000);
   const fail=error=>{if(session.failed)return;session.failed=error;clearTimeout(timer);if(!ready)reject(error);else session.onError?.(error);};
   socket.onopen=()=>{socket.send(JSON.stringify({model:'stt-rt-v5',audio_format:'pcm_s16le',sample_rate:16000,num_channels:1,language_hints:[language==='fil'?'tl':language],language_hints_strict:true,enable_endpoint_detection:false}));ready=true;clearTimeout(timer);resolve();};
   socket.onmessage=event=>{let data;try{data=JSON.parse(event.data);}catch{return;}
    if(data.error_code){fail(Error(Number(data.error_code)===402?'Soniox requires funded credits. Add funds in the Soniox console, then retry.':'Soniox rejected the stream (code '+data.error_code+'). Check permissions and language support.'));return;}
    let partial='';
    for(const token of data.tokens||[]){
     if(token.text==='<fin>'){session.pending=Math.max(0,session.pending-1);session.onTranscript?.({text:committed,final:true});committed='';}
     else if(!token.text.startsWith('<')){if(token.is_final)committed+=token.text;else partial+=token.text;}
    }
    if(committed||partial)session.onTranscript?.({text:committed+partial,final:false});
   };
   socket.onerror=()=>fail(Error('Could not connect to Soniox.'));
   socket.onclose=()=>{clearTimeout(timer);if(!session.closed)fail(Error('Soniox connection closed. Please retry.'));};
  });return session;
 }
}
// Short-utterance adapters buffer one segment and return a final transcript. Closing
// aborts in-flight work and suppresses callbacks from a previous card.
export class ShortAudioProvider{
 constructor(name){this.name=name;}
 async prepare(language){
  if(!speechCandidates(language).includes(this.name))throw Error('Unsupported recognition language.');
  const name=this.name,controllers=new Set();let chunks=[];
  const session={closed:false,failed:null,pending:0,uncommitted:0,onTranscript:null,onError:null,
   push(buffer){
    if(this.closed||this.failed)return;
    if(this.uncommitted+buffer.byteLength>480000){this.failed=Error('Recognition is taking too long. Please reconnect.');this.onError?.(this.failed);return;}
    chunks.push(new Uint8Array(buffer.slice(0)));this.uncommitted+=buffer.byteLength;
    if(this.uncommitted>=384000&&!this.pending)this.commit();
   },
   commit(){
    if(this.closed||this.failed||this.pending||!this.uncommitted)return false;
    const pcm=new Uint8Array(Math.max(3200,this.uncommitted));let offset=0;for(const c of chunks){pcm.set(c,offset);offset+=c.length;}chunks=[];this.uncommitted=0;this.pending++;
    const controller=new AbortController();controllers.add(controller);const timeout=setTimeout(()=>controller.abort(),14000);
    fetch(`/api/speech/transcribe?provider=${name}&language=${encodeURIComponent(language)}`,{method:'POST',headers:{'X-Perlingo-Challenge':'1','Content-Type':'application/octet-stream'},body:pcm,signal:controller.signal})
     .then(async res=>{const data=await res.json();if(!res.ok)throw Error(data.error||'Recognition failed.');if(typeof data.text!=='string')throw Error('Invalid recognition response.');this.pending--;if(!this.closed)this.onTranscript?.({text:data.text,final:true});})
     .catch(error=>{this.pending=Math.max(0,this.pending-1);if(!this.closed){this.failed=Error(error.name==='AbortError'?'Recognition timed out. Please retry.':error.message);this.onError?.(this.failed);}})
     .finally(()=>{clearTimeout(timeout);controllers.delete(controller);});
    return true;
   },
   close(){this.closed=true;chunks=[];this.uncommitted=0;for(const c of controllers)c.abort();controllers.clear();}
  };return session;
 }
}
export function createRoutedSpeechProvider(routes){
 const selected=speechRoutes(routes);
 return {prepare(language){if(!selected[language])throw Error('Unsupported language.');return createSpeechProvider(selected[language]).prepare(language);}};
}
export function createSpeechProvider(name='elevenlabs'){if(name==='elevenlabs')return new ElevenLabsProvider();if(name==='soniox')return new SonioxProvider();if(['azure','sarvam','google','munsit'].includes(name))return new ShortAudioProvider(name);throw Error('Unknown speech provider: '+name);}
// Explicit locale choices prevent Mandarin falling back to Cantonese, for example.
export const voiceLocales={en:'en-US',zh:'zh-CN',es:'es-ES',fr:'fr-FR',pt:'pt-BR',ar:'ar-SA',no:'nb-NO',fil:'fil-PH'};
export const preferredVoiceNames={en:'Samantha',zh:'Tingting',hi:'Lekha',es:'Mónica',ar:'Maged',fr:'Thomas',pt:'Luciana',ru:'Milena',id:'Damayanti',de:'Anna',ja:'Kyoko',tr:'Yelda',ta:'Vani',vi:'Linh',ko:'Yuna',it:'Alice',th:'Kanya',pl:'Zosia',uk:'Lesya',ro:'Ioana',nl:'Xander',hu:'Mariska',el:'Melina',cs:'Zuzana',sv:'Alva',he:'Carmit',fi:'Satu',da:'Sara',no:'Nora',sk:'Laura',bg:'Daria',hr:'Lana',ms:'Amira',ca:'Montse',sl:'Tina'};
export function selectNativeVoice(voices,id){
 const locale=voiceLocales[id];const aliases=id==='no'?['no','nb']:id==='fil'?['fil','tl']:[id];
 let matches=voices.filter(v=>aliases.includes(v.lang.replaceAll('_','-').split('-')[0]));
 if(id==='zh')matches=matches.filter(v=>/^zh[-_](CN|TW|SG)/i.test(v.lang));
 if(id==='fr'){const thomas=matches.find(v=>/^Thomas(?:$| \()/i.test(v.name));if(thomas)return thomas;}
 const preferred=matches.find(v=>v.name===preferredVoiceNames[id]||v.name.startsWith(preferredVoiceNames[id]+' ('));if(preferred)return preferred;
 return matches.find(v=>v.lang.replaceAll('_','-')===locale&&v.localService)||matches.find(v=>v.lang.replaceAll('_','-')===locale)||matches.find(v=>v.localService)||matches[0];
}
export class Pronouncer{
 constructor(){this.serial=0;globalThis.speechSynthesis?.getVoices();}
 stop(){this.serial++;this.cancel?.();this.cancel=null;globalThis.speechSynthesis?.cancel();}
 async play(pack,entry,language){
  this.stop();const id=this.serial,synth=globalThis.speechSynthesis;
  if(!synth)throw Error('This browser does not provide device voices.');
  if(!synth.getVoices().length)await new Promise(resolve=>{const done=()=>{clearTimeout(timer);synth.removeEventListener('voiceschanged',done);resolve();};const timer=setTimeout(done,1200);synth.addEventListener('voiceschanged',done);});
  if(id!==this.serial)return;
  const voice=selectNativeVoice(synth.getVoices(),language.id);
  if(!voice)throw Error('No '+language.name+' voice is installed. Add one in your device speech settings.');
  await new Promise((resolve,reject)=>{
   const u=new SpeechSynthesisUtterance(entry.word);this.utterance=u;u.voice=voice;u.lang=voice.lang;u.rate=1;
   const done=()=>{if(id===this.serial)this.cancel=null;resolve();};this.cancel=done;
   u.onend=done;u.onerror=e=>{if(id!==this.serial||['interrupted','canceled'].includes(e.error))done();else{this.cancel=null;reject(Error('The '+language.name+' voice could not play.'));}};synth.speak(u);
  });
 }
}
