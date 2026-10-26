// Recognition is opt-in, browser-provided, and never submits or evaluates an answer.
export function createDictation(Recognition,{onText=()=>{},onStatus=()=>{},setTimer=setTimeout,clearTimer=clearTimeout}={}){
 let active=null,token=0,timer=null;
 const clear=()=>{if(timer!==null)clearTimer(timer);timer=null;};
 const cancel=()=>{clear();token++;const r=active;active=null;if(r){try{r.abort();}catch{}}onStatus('cancelled','');};
 return {supported:typeof Recognition==='function',cancel,
 start(){
  cancel();if(typeof Recognition!=='function'){onStatus('unavailable','Voice input is unavailable here. Use keyboard dictation or type.');return;}
  const epoch=token;let r,received=false;
  try{r=new Recognition();active=r;r.lang='es-ES';r.continuous=false;r.interimResults=false;r.maxAlternatives=1;
   const current=()=>epoch===token&&active===r;
   const deadline=ms=>{clear();timer=setTimer(()=>{if(!current())return;cancel();onStatus('error','Dictation timed out. Try your device’s keyboard dictation or type.');},ms);};
   r.onstart=()=>{if(current()){deadline(30000);onStatus('listening','Listening…');}};
   r.onresult=e=>{if(!current())return;let transcript='';for(let i=e.resultIndex||0;i<e.results.length;i++)if(e.results[i].isFinal)transcript+=e.results[i][0].transcript+' ';if(transcript.trim()){received=true;onText(transcript.trim());onStatus('result','Transcript ready. Check it, then submit.');}};
   r.onerror=e=>{if(!current())return;clear();token++;active=null;onStatus('error',({'not-allowed':'Microphone access was denied. You can still type.','service-not-allowed':'Voice input is unavailable in this browser. You can still type.','no-speech':'No speech heard. Try again or type.','audio-capture':'No microphone is available. You can still type.','network':'Browser dictation is unavailable. Use your device’s keyboard dictation or type.'})[e.error]||'Voice input stopped. You can still type.');};
   r.onend=()=>{if(current()){clear();active=null;onStatus('ended',received?'Transcript ready. Check it, then submit.':'No speech captured. Try again or type.');}};
   deadline(8000);onStatus('starting','Starting microphone…');r.start();
  }catch{if(epoch===token){clear();active=null;token++;onStatus('error','Could not start voice input. You can still type.');}}
 },
 stop(){if(active){cancel();onStatus('stopped','Microphone stopped.');}}
 };
}
