// Original synthesized two-note cues; no downloaded sound assets.
// Completion is tied to the audio clock, so speech follows the final note.
export function createAnswerFeedback(pronunciation,AudioContext,{cueGain=.055}={}){
 let context=null,generation=0,nodes=[];
 function stop(){
  generation++;
  for(const node of nodes){node.onended=null;try{node.stop();}catch{}node.disconnect();node.feedbackGain?.disconnect();}
  nodes=[];pronunciation.stop();
 }
 function play({correct,text,locale,label,enabled=true}){
  stop();if(!enabled)return;
  const id=generation;
  const speak=()=>{if(id===generation)pronunciation.speak(text,locale,label,()=>{});};
  if(!AudioContext){speak();return;}
  try{
   context??=new AudioContext();
   // Resume synchronously from the submission gesture for mobile browsers.
   const resumed=context.resume();
   Promise.resolve(resumed).then(()=>{
    if(id!==generation)return;
    if(context.state!=='running'){speak();return;}
    try{
     const start=context.currentTime,frequencies=correct?[660,880]:[440,330];
     frequencies.forEach((frequency,i)=>{
      const oscillator=context.createOscillator(),gain=context.createGain();
      oscillator.type='sine';oscillator.frequency.value=frequency;
      const at=start+i*.12;
      gain.gain.setValueAtTime(0,at);
      gain.gain.linearRampToValueAtTime(cueGain,at+.012);
      gain.gain.exponentialRampToValueAtTime(.001*(cueGain/.055),at+.105);
      oscillator.connect(gain);gain.connect(context.destination);
      oscillator.feedbackGain=gain;nodes.push(oscillator);
      oscillator.onended=()=>{
       oscillator.disconnect();gain.disconnect();
       nodes=nodes.filter(node=>node!==oscillator);
       if(i===1)speak();
      };
      oscillator.start(at);oscillator.stop(at+.12);
     });
    }catch{stop();pronunciation.speak(text,locale,label,()=>{});}
   },()=>{if(id===generation)speak();});
  }catch{speak();}
 }
 return {play,stop};
}
