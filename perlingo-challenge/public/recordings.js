// Generated metadata is also displayed in Audio sources. Generated clips and retained human recordings share the same cached playback path.
import {recordings} from './recordings-data.js';
export {recordings};
export function getRecording(pack,language){return recordings.find(r=>r.pack===pack&&r.language===language);}
export class RecordingPlayer{
 constructor(){this.current=null;this.finish=null;}
 stop(){const audio=this.current;this.current=null;this.finish?.();if(audio){audio.pause();audio.removeAttribute('src');audio.load();}}
 async play(pack,entry,language){
  this.stop();const recording=getRecording(pack,language.id);
  if(!recording||recording.word!==entry.word)throw Error(`A pronunciation recording for ${language.name} is not available yet.`);
  const audio=new Audio(recording.file);this.current=audio;
  await new Promise((resolve,reject)=>{
   let settled=false;
   const finish=error=>{if(settled)return;settled=true;audio.onended=null;audio.onerror=null;if(this.current===audio){this.current=null;this.finish=null;}error?reject(error):resolve();};
   this.finish=()=>finish();audio.onended=()=>finish();audio.onerror=()=>finish(Error(`The ${language.name} recording could not load. Try again.`));
   audio.play().catch(error=>finish(Error(error.name==='NotAllowedError'?'Tap the tile again to allow audio playback.':`The ${language.name} recording could not play.`)));
  });
 }
}
