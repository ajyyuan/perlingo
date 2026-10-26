// A bounded, unscored microphone attempt using the game's provider interface.
export class DeveloperSession {
 constructor({microphone,prepare,onTranscript,onState,now=()=>performance.now(),limitMs=15000}){Object.assign(this,{microphone,prepare,onTranscript,onState,now,limitMs});this.serial=0;}
 cancel(){this.serial++;clearTimeout(this.limit);clearTimeout(this.wait);this.mic?.close();this.session?.close();this.mic=null;this.session=null;this.phase='idle';}
 async start(language){
  this.cancel();const token=this.serial,live=()=>this.serial===token;this.phase='connecting';this.onState('Connecting…');
  const mic=this.microphone();this.mic=mic;
  try{
   await mic.open();if(!live()){mic.close();return;}
   const session=await this.prepare(language);if(!live()){session.close();return;}this.session=session;
   if(session.failed)throw session.failed;
   session.onError=error=>{if(live()){this.cancel();this.onState(error.message);}};
   session.onTranscript=result=>{if(!live())return;this.onTranscript(result);if(!live())return;if(result.final&&this.phase==='settling'){if(session.uncommitted)session.commit();else if(!session.pending){this.cancel();this.onState('Ready to try again.');}}};
   this.phase='listening';this.onState('Listening…');mic.reset(token);session.push(new ArrayBuffer(6400),0);
   let speaking=false,lastSpeech=0;
   mic.onAudio=(buffer,level,audioToken)=>{
    if(!live()||audioToken!==token||this.phase!=='listening')return;
    session.push(buffer,level);const time=this.now();
    // Same energy threshold and 240ms silence finalization as gameplay.
    if(level>.012){speaking=true;lastSpeech=time;}
    if(speaking&&time-lastSpeech>=240&&session.commit())speaking=false;
   };
   this.limit=setTimeout(()=>this.finish(),this.limitMs);
  }catch(error){mic.close();if(live()){this.cancel();this.onState(error.message);}}
 }
 finish(){
  if(this.phase==='connecting'){this.cancel();this.onState('Canceled.');return;}
  if(this.phase!=='listening')return;
  this.phase='settling';clearTimeout(this.limit);this.mic?.close();this.mic=null;this.onState('Checking…');
  const token=this.serial;this.session?.commit();
  this.wait=setTimeout(()=>{if(this.serial===token){this.cancel();this.onState('No final response. Try again.');}},16000);
 }
}
export function reviewIdentity(pack,entry,recording,provider,model){
 return JSON.stringify({pack,language:entry.id,word:entry.word,reading:entry.reading,ipa:entry.ipa,accepted:entry.accepted,transcriptAlternatives:entry.transcriptAlternatives||[],audioSha256:recording?.sha256||null,provider,model,matcherRevision:1});
}
