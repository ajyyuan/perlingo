const localeKey=value=>value.toLowerCase().replaceAll('_','-');
export function matchingVoices(voices,locale,{exactLocale=false}={}){
 const target=localeKey(locale),language=target.split('-')[0];
 // Prefer the standard French system voice over enhanced voices that may be advertised but unavailable.
 const score=v=>Number(language==='fr'&&/^Thomas(?:$| \()/i.test(v.name||''))*8+Number(Boolean(v.localService))*4+Number(localeKey(v.lang)===target)*2+Number(Boolean(v.default));
 return voices.filter(v=>exactLocale?localeKey(v.lang)===target:localeKey(v.lang).split('-')[0]===language).sort((a,b)=>score(b)-score(a));
}

export function createPronouncer(synth,Utterance){
 let request=0,utterance=null,timer=null,waiting=null,reportState=null;
 const clear=()=>{clearTimeout(timer);timer=null;if(waiting)synth?.removeEventListener('voiceschanged',waiting);waiting=null;};
 function stop(){request++;clear();utterance=null;synth?.cancel();reportState?.({state:'idle',message:''});reportState=null;}
 // Kick off asynchronous voice discovery before the first click.
 synth?.getVoices();
 function speak(text,locale,label,report,options={}){
  stop();const id=request;reportState=report;
  const notify=(state,message='')=>report({state,message});
  if(!synth||!Utterance){notify('error','Pronunciation is unavailable in this browser.');return;}
  const fail=()=>notify('error',`${label} audio could not play. Try again or use another browser.`);
  const play=(voices,index=0)=>{
   if(id!==request)return;
   clearTimeout(timer);
   if(index>=voices.length){utterance=null;fail();return;}
   const voice=voices[index],u=new Utterance(text.normalize('NFC').replace(/[’‘]/g,"'"));
   // Keep a reference until completion; some browser engines lose local utterances.
   utterance=u;u.voice=voice;u.lang=voice.lang;u.rate=.85;u.volume=1;
   const current=()=>id===request&&utterance===u;
   const retry=()=>{if(!current())return;utterance=null;clearTimeout(timer);synth.cancel();play(voices,index+1);};
   u.onstart=()=>{if(current()){clearTimeout(timer);notify('playing');}};
   u.onend=()=>{if(current()){clearTimeout(timer);utterance=null;notify('idle');}};
   u.onerror=retry;
   notify('loading');
   timer=setTimeout(retry,5000);
   try{synth.resume();synth.speak(u);}catch{retry();}
  };
  const select=()=>{
   if(id!==request)return;
   const voices=matchingVoices(synth.getVoices(),locale,options);
   if(voices.length){clear();play(voices);return true;}
   return false;
  };
  if(select())return;
  notify('loading');
  waiting=select;synth.addEventListener('voiceschanged',waiting);
  timer=setTimeout(()=>{clear();if(id===request)notify('error',`No ${label} voice is available in this browser. Enable a ${label} system voice, or try another browser.`);},1800);
 }
 return {speak,stop};
}
