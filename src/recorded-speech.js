import {normalizeAudioText} from './azure-voices.js';

// All synthesis happens offline. This player only fetches same-origin assets.
export function createRecordedPronouncer({loadManifest,makeAudio,fallback,loadFeminineManifest=()=>null,baseUrl='/src/audio/azure/'}){
 let generation=0,audio=null,reportState=null,timer=null,manifestPromise,femininePromise;
 const load=()=>manifestPromise??=Promise.resolve().then(loadManifest).catch(()=>{manifestPromise=null;return null;});
 const loadFeminine=()=>femininePromise??=Promise.resolve().then(loadFeminineManifest).catch(()=>{femininePromise=null;return null;});
 load();
 function release(){clearTimeout(timer);timer=null;if(audio){audio.onplaying=audio.onended=audio.onerror=null;audio.pause();audio.removeAttribute('src');audio.load();audio.remove?.();audio=null;}}
 function stop(){generation++;release();fallback.stop();reportState?.({state:'idle',message:''});reportState=null;}
 function speak(text,locale,label,report,voice='masculine'){
  stop();const id=generation;let fellBack=false;reportState=report;const current=()=>id===generation;
  const useFallback=()=>{if(!current()||fellBack)return;fellBack=true;release();fallback.speak(text,locale,label,({state,message})=>{if(current())report({state,message:message||(state==='playing'?'Using a device voice while the recording is unavailable.':'')});},{exactLocale:true});};
  report({state:'loading',message:''});
  (voice==='feminine'?loadFeminine():load()).then(manifest=>{
   if(!current())return;
   const file=manifest?.clips?.[locale]?.[normalizeAudioText(text)];
   if(!file){useFallback();return;}
   audio=makeAudio();audio.preload='auto';audio.src=baseUrl+file;audio.volume=1;
   audio.onplaying=()=>{if(current()){clearTimeout(timer);timer=null;report({state:'playing',message:''});}};
   audio.onended=()=>{if(current()){release();report({state:'idle',message:''});}};
   audio.onerror=useFallback;
   timer=setTimeout(useFallback,8000);
   try{Promise.resolve(audio.play()).catch(useFallback);}catch{useFallback();}
  }).catch(useFallback);
 }
 return {speak,stop};
}
