import {createSpeechProvider} from './speech.js';
import {matchesAnswer} from './engine.js';
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
// Both providers receive the exact same PCM, at real-time pace, with no answer hints.
// One finalization at clip end isolates recognizer accuracy from game endpointing.
export async function comparePCM(pcm,language,accepted,names=['elevenlabs','soniox']){
 const prepared=await Promise.all(names.map(async name=>{const start=performance.now();try{return {name,session:await createSpeechProvider(name).prepare(language),connectionMs:Math.round(performance.now()-start)};}catch(e){return {name,error:e.message};}}));
 const jobs=prepared.map(item=>{
  if(!item.session)return Promise.resolve(item);
  const {session,...row}=item;let end=0,text='',resolve,done=false;
  const result=new Promise(r=>resolve=r);
  const finish=error=>{if(done)return;done=true;clearTimeout(timer);session.close();resolve({...row,text,accepted:!!text&&matchesAnswer(text,accepted,language),afterClipMs:end?Math.round(performance.now()-end):null,...(error?{error}: {})});};
  const timer=setTimeout(()=>finish('Result timeout'),pcm.byteLength/32+10000);
  session.onError=e=>finish(e.message);
  if(session.failed)finish(session.failed.message);
  session.onTranscript=r=>{if(r.final){text=r.text;if(end)finish();}};
  item.push=buffer=>{if(!done)session.push(buffer);};item.end=()=>{end=performance.now();if(session.failed)finish(session.failed.message);else if(!session.commit())finish('Could not finalize recording');};
  return result;
 });
 for(let i=0;i<pcm.byteLength;i+=2560){const chunk=pcm.slice(i,i+2560);for(const item of prepared)item.push?.(chunk);await delay(chunk.byteLength/32);}
 for(const item of prepared)item.end?.();
 return Promise.all(jobs);
}
