// Endpoint short answers after 800 ms of quiet following at least 160 ms of voice.
export function createSpeechEndDetector(){
 let voiced=0,quiet=0;
 return {get heardSpeech(){return voiced>=160;},push(chunk){
  const view=new DataView(chunk.buffer,chunk.byteOffset,chunk.byteLength);let energy=0;
  for(let i=0;i+1<chunk.length;i+=2)energy+=(view.getInt16(i,true)/32768)**2;
  const duration=chunk.length/32,loud=Math.sqrt(energy/(chunk.length/2||1))>=.008;
  if(loud){voiced+=duration;quiet=0;}else quiet+=duration;
  return voiced>=160&&quiet>=800;
 }};
}
// Short explicit recordings use the existing challenge broker; keys stay server-side.
export async function openMicrophone(onAudio){
 const stream=await navigator.mediaDevices.getUserMedia({audio:{channelCount:1,echoCancellation:true,noiseSuppression:true}});
 let context,source,node,mute;
 const close=()=>{stream.getTracks().forEach(t=>t.stop());node?.disconnect();source?.disconnect();context?.close().catch(()=>{});};
 try{
  context=new AudioContext({sampleRate:16000});
  if(context.sampleRate!==16000)throw Error('This device cannot record at the required sample rate.');
  await context.audioWorklet.addModule('/challenge/pcm-worklet.js');await context.resume();
  source=context.createMediaStreamSource(stream);node=new AudioWorkletNode(context,'pcm-capture');mute=context.createGain();mute.gain.value=0;
  node.port.onmessage=e=>onAudio(new Uint8Array(e.data.buffer));source.connect(node).connect(mute).connect(context.destination);
  return {close};
 }catch(error){close();throw error;}
}
export function createRecordedDictation({onText=()=>{},onStatus=()=>{},open=openMicrophone,request=fetch,setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let serial=0,mic=null,controller=null,timer=null,chunks=[],bytes=0,recording=false,endpoint=null;
 const clear=()=>{if(timer!==null)clearTimer(timer);timer=null;mic?.close();mic=null;recording=false;};
 const cancel=()=>{serial++;clear();controller?.abort();controller=null;chunks=[];bytes=0;onStatus('cancelled','');};
 const fail=message=>{cancel();onStatus('error',message);};
 async function stop(){
  if(!recording){cancel();return;}
  const id=serial;clear();
  if(bytes<3200){fail('No recording captured. Try again.');return;}
  if(!endpoint?.heardSpeech){fail('No speech heard. Try again.');return;}
  const pcm=new Uint8Array(bytes);let offset=0;for(const chunk of chunks){pcm.set(chunk,offset);offset+=chunk.length;}chunks=[];bytes=0;
  controller=new AbortController();const signal=controller.signal;timer=setTimer(()=>fail('Transcription timed out. Please retry.'),15000);onStatus('transcribing','Transcribing…');
  try{
   const res=await request('/challenge/api/speech/transcribe?provider=azure&language=es',{method:'POST',headers:{'Content-Type':'application/octet-stream','X-Perlingo-Challenge':'1'},body:pcm,signal});
   const data=await res.json();if(id!==serial)return;
   if(!res.ok)throw Error(data.error||'Transcription unavailable.');
   clear();controller=null;
   if(typeof data.text!=='string'||!data.text.trim()){onStatus('ended','No speech recognized. Try again.');return;}
   onText(data.text.trim());onStatus('result','');
  }catch(error){if(id===serial)fail(error.message||'Could not transcribe. Please retry.');}
 }
 async function start(){
  cancel();endpoint=createSpeechEndDetector();const id=serial;onStatus('starting','Starting microphone…');timer=setTimer(()=>fail('Microphone did not start. Check permission and retry.'),15000);
  try{
   const opened=await open(chunk=>{if(id!==serial||!recording)return;chunks.push(chunk.slice());bytes+=chunk.length;if(endpoint.push(chunk)||bytes>=32000*12)void stop();});
   if(id!==serial){opened.close();return;}clearTimer(timer);mic=opened;recording=true;timer=setTimer(()=>void stop(),12000);onStatus('listening','Listening…');
  }catch(error){if(id===serial)fail(error.name==='NotAllowedError'?'Allow microphone access to dictate.':error.message||'Could not open microphone.');}
 }
 return {supported:true,start,stop,cancel};
}
