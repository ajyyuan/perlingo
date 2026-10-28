export function createCompletionFeedback({enabled,AudioContext=window.AudioContext||window.webkitAudioContext}){
 let context;
 function unlock(){try{context??=AudioContext?new AudioContext():null;return context?.resume();}catch{return null;}}
 function chime(){
  if(!enabled())return;
  Promise.resolve(unlock()).then(()=>{
   if(!enabled()||context?.state!=='running')return;
   [523.25,659.25,783.99].forEach((hz,i)=>{
    const osc=context.createOscillator(),gain=context.createGain(),at=context.currentTime+i*.11;
    osc.type='sine';osc.frequency.value=hz;gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(.035*10,at+.015);gain.gain.exponentialRampToValueAtTime(.001*10,at+.3);
    osc.connect(gain);gain.connect(context.destination);osc.onended=()=>{osc.disconnect();gain.disconnect();};osc.start(at);osc.stop(at+.32);
   });
  }).catch(()=>{});
 }
 return {
  celebrate(host){const body=host.querySelector('.concept-body');if(!body)return;const mark=document.createElement('div');mark.className='completion-mark';mark.setAttribute('aria-hidden','true');mark.textContent='✓';body.prepend(mark);body.classList.add('completion-arrival');chime();}
 };
}
