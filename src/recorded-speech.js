import {normalizeAudioText} from './azure-voices.js';
import {audioBaseUrl} from './audio-host.js';

// All synthesis happens offline. Playback fetches existing recordings only.
export function createRecordedPronouncer({loadManifest,makeAudio,fallback,loadFeminineManifest=()=>null,baseUrl=audioBaseUrl,clipOverrides={},fallbackText=text=>text,beforeSpeak=()=>{},prepareAudio=(_audio,url)=>({url,release(){}})}){
 let generation=0,audio=null,reportState=null,timer=null,manifestPromise,femininePromise,releaseOutput=()=>{},outputAbort;
 const load=()=>manifestPromise??=Promise.resolve().then(loadManifest).catch(()=>{manifestPromise=null;return null;});
 const loadFeminine=()=>femininePromise??=Promise.resolve().then(loadFeminineManifest).catch(()=>{femininePromise=null;return null;});
 load();
 function release(){outputAbort?.abort();outputAbort=null;releaseOutput();releaseOutput=()=>{};clearTimeout(timer);timer=null;if(audio){audio.onplaying=audio.onended=audio.onerror=null;audio.pause();audio.removeAttribute('src');audio.load();audio.remove?.();audio=null;}}
 function stop(){generation++;release();fallback.stop();reportState?.({state:'idle',message:''});reportState=null;}
 function speak(text,locale,label,report,voice='masculine'){
  stop();let ready;try{ready=beforeSpeak();}catch(error){ready=Promise.reject(error);}const id=generation;let fellBack=false;reportState=report;const current=()=>id===generation;
  const useFallback=()=>{if(!current()||fellBack)return;fellBack=true;release();fallback.speak(fallbackText(text,locale),locale,label,({state,message})=>{if(current())report({state,message:message||(state==='playing'?'Using a device voice while the recording is unavailable.':'')});},{exactLocale:true});};
  report({state:'loading',message:''});
  Promise.all([voice==='feminine'?loadFeminine():load(),ready]).then(async ([manifest])=>{
   if(!current())return;
   const file=manifest?.clips?.[locale]?.[normalizeAudioText(text)];
   const override=clipOverrides[voice]?.[locale]?.[normalizeAudioText(text)];
   if(!file&&!override){useFallback();return;}
   audio=makeAudio();audio.preload='auto';outputAbort=new AbortController();const output=await prepareAudio(audio,override||baseUrl+file,{signal:outputAbort.signal});if(!current()){output.release();return;}releaseOutput=output.release;audio.src=output.url;audio.volume=1;
   audio.onplaying=()=>{if(current()){clearTimeout(timer);timer=null;report({state:'playing',message:''});}};
   audio.onended=()=>{if(current()){release();report({state:'idle',message:''});}};
   audio.onerror=useFallback;
   timer=setTimeout(useFallback,8000);
   try{Promise.resolve(audio.play()).catch(useFallback);}catch{useFallback();}
  }).catch(useFallback);
 }
 return {speak,stop};
}
