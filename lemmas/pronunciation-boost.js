import {createLevelLookup,playbackUrl as audioUrl} from './recording-levels.js';
import {recordingLevel,levelAdjustment} from './audio-level.js';
// Opt-in for Lemmas only. Device speech and feedback cues retain their own levels.
export function createPronunciationBoost(AudioContext,{fetchAudio=fetch,getLevel=createLevelLookup(fetchAudio)}={}){
 let context;const levels=new Map();
 return {
  unlock(){
   if(!AudioContext)return Promise.resolve();
   try{context??=new AudioContext();let timer;return Promise.race([context.resume(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Audio activation timed out')),2000);})]).then(()=>{if(context.state!=='running')throw Error('Audio unavailable');}).finally(()=>clearTimeout(timer));}catch(error){return Promise.reject(error);}
  },
  async prepare(audio,url,{signal}={}){
   if(!AudioContext)return {url,release(){}};
   if(context?.state!=='running')throw Error('Audio must be activated before playback');
   // Only the fixed public library is proxied; local correction clips stay local.
   const match=url.match(/^https:\/\/perlingoaudio\.blob\.core\.windows\.net\/pronunciation\/(es-(?:ES|MX|AR|CO))\/([a-f0-9]{24}\.mp3)$/);
   if(/^https?:/.test(url)&&!match)return {url,release(){}};
   const playbackUrl=audioUrl(url);
   let level=levels.get(playbackUrl);
   if(!level){
    const db=await getLevel(playbackUrl);
    if(Number.isFinite(db))level=levelAdjustment(db);
   }
   if(!level){
    const response=await fetchAudio(playbackUrl,{signal:signal?AbortSignal.any([signal,AbortSignal.timeout(8000)]):AbortSignal.timeout(8000)});if(!response.ok)throw Error('Recording unavailable');
    const buffer=await context.decodeAudioData(await response.arrayBuffer());
    if(signal?.aborted)throw Error('Playback canceled');
    level=recordingLevel(Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i)),buffer.sampleRate);
   }
   levels.set(playbackUrl,level);if(levels.size>128)levels.delete(levels.keys().next().value);
   if(signal?.aborted)throw Error('Playback canceled');
   const source=context.createMediaElementSource(audio),gain=context.createGain(),limiter=context.createDynamicsCompressor();
   gain.gain.value=level.gain;
   // Protect transients after the fixed per-recording loudness adjustment.
   limiter.threshold.value=-1;limiter.knee.value=0;limiter.ratio.value=20;limiter.attack.value=.001;limiter.release.value=.08;
   source.connect(gain);gain.connect(limiter);limiter.connect(context.destination);
   return {url:playbackUrl,release(){source.disconnect();gain.disconnect();limiter.disconnect();}};
  }
 };
}
