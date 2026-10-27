const clone=value=>structuredClone(value);
export function validProgress(p){
 return Boolean(p&&p.srsVersion===2&&Number.isInteger(p.appDay)&&p.appDay>0&&p.settings&&
  Array.isArray(p.settings.languages)&&p.settings.languages.length&&p.settings.languages.every(l=>['es','fr','de'].includes(l))&&
  ['noun','verb','grammar','sentence'].every(k=>Number.isInteger(p.settings[k])&&p.settings[k]>=0)&&
  p.history&&typeof p.history==='object'&&!Array.isArray(p.history)&&Array.isArray(p.sessions));
}
// One versioned snapshot per account/pack. Never merge SRS counters by timestamp.
export function createProgressSync({storage,key,initial,remote,onApply,onStatus,validate=validProgress,autoLink=false}){
 let raw=storage.getItem(key),envelope=raw?JSON.parse(raw):{progress:clone(initial),revision:0,linked:false,dirty:false};
 if(!validate(envelope.progress)||!Number.isInteger(envelope.revision))throw new Error('Saved account progress is invalid. Export or recover it before continuing.');
 let disposed=false,busy=false,localBlocked=false,timer=null,choice=null,remoteRow=null;
 const status=(state,message)=>{if(!disposed)onStatus({state,message,choice,remote:remoteRow?.payload||null});};
 function persist(){
  // A second tab must not silently erase this tab's unsynced draft.
  if(storage.getItem(key)!==raw){localBlocked=true;throw new Error('Another tab changed this account. Reload to use its saved progress; export this tab first if needed.');}
  const next=JSON.stringify(envelope);try{storage.setItem(key,next);raw=next;}catch(error){localBlocked=true;throw error;}
 }
 function backup(){storage.setItem(`${key}:recovery`,JSON.stringify({savedAt:new Date().toISOString(),progress:envelope.progress,cloud:remoteRow?.payload||null}));}
 function save(progress){
  if(disposed)return;
  if(JSON.stringify(progress)===JSON.stringify(envelope.progress))return;
  envelope.progress=clone(progress);envelope.dirty=true;
  try{persist();}catch(error){status('error',error.message);return;}
  clearTimeout(timer);timer=setTimeout(()=>sync(),800);
 }
 async function sync(){
  if(disposed||busy||localBlocked)return;
  busy=true;
  try{
   const row=await remote.read();if(disposed)return;
   if(row&&(!Number.isInteger(row.revision)||!validate(row.payload)))throw new Error('Cloud progress has an unsupported format. Local progress has been kept.');
   remoteRow=row;
   if(!envelope.linked&&autoLink&&!envelope.dirty){
    envelope={progress:clone(row?.payload||envelope.progress),revision:row?.revision||0,linked:true,dirty:!row};persist();onApply(clone(envelope.progress));
   }
   if(!envelope.linked){choice='initial';status('choice',row?'Choose which progress to use for this account.':'Save this device’s progress to your account?');return;}
   if((row?.revision||0)!==envelope.revision){choice='conflict';status('choice','Progress changed on another device. Choose which copy to keep.');return;}
   if(choice){status('choice','Choose which progress to keep.');return;}
   if(envelope.dirty){
    const snapshot=clone(envelope.progress),revision=await remote.write(envelope.revision,snapshot);if(disposed)return;
    if(revision===null){choice='conflict';remoteRow=await remote.read();if(remoteRow&&(!Number.isInteger(remoteRow.revision)||!validate(remoteRow.payload)))throw new Error('Cloud progress has an unsupported format.');status('choice','Progress changed while saving. Choose which copy to keep.');return;}
    envelope.revision=revision;envelope.dirty=JSON.stringify(snapshot)!==JSON.stringify(envelope.progress);persist();
   }
   status('saved',envelope.dirty?'Saved on this device; syncing changes.':'Progress saved to your account.');
  }catch(error){status('error',`Progress remains on this device. ${error.message||'Sync will retry when connected.'}`);}
  finally{busy=false;}
 }
 async function choose(source){
  if(disposed||busy||localBlocked||!choice)return;
  busy=true;
  try{
   // Re-read before accepting a choice; never overwrite a newer version unseen.
   const row=await remote.read();if(disposed)return;
   if(row&&(!Number.isInteger(row.revision)||!validate(row.payload)))throw new Error('Cloud progress has an unsupported format.');
   if((row?.revision||0)!==(remoteRow?.revision||0)){remoteRow=row;status('choice','Cloud progress changed again. Review your choice.');return;}
   if(row&&!validate(row.payload))throw new Error('Cloud progress has an unsupported format.');
   backup();
   if(source==='cloud'){
    if(!row)throw new Error('No cloud progress is available.');
    envelope={progress:clone(row.payload),revision:row.revision,linked:true,dirty:false};persist();choice=null;onApply(clone(envelope.progress));
   }else if(source==='device'){
    envelope.linked=true;envelope.revision=row?.revision||0;envelope.dirty=true;persist();choice=null;
   }else throw new Error('Unknown progress choice');
  }catch(error){status('error',error.message);return;}
  finally{busy=false;}
  await sync();
 }
 async function reset(progress){
  if(disposed||busy||localBlocked||choice||!envelope.linked)throw new Error('Finish syncing or resolve the progress choice before resetting.');
  if(!validate(progress))throw new Error('Invalid reset progress.');
  backup();save(progress);
  if(localBlocked)throw new Error('Reset could not be saved. Reload and try again.');
  onApply(clone(envelope.progress));await sync();
 }
 return {save,sync,choose,reset,getProgress:()=>clone(envelope.progress),dispose(){disposed=true;clearTimeout(timer);}};
}
