import {createReportService} from './report-service.js';
import {openReportInbox} from './report-inbox.js';
import {createAccountClient,progressRemote,signInWithProvider} from './account-client.js';
import {createProgressSync,validProgress} from './progress-sync.js';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function createAccount({config,pack,storage,getGuest,apply,validate=validProgress,onStorageError,clientFactory=createAccountClient}){
 let client=null,user=null,syncer=null,working=false,message='',syncState=null,sequence=0,accountOptionsOpen=false,isAdmin=false;
 const configured=Boolean(config.url&&config.publishableKey);
 function mount(){
  const panel=document.querySelector('#account-settings');if(!panel)return;
  panel.innerHTML=`<h2>Account</h2>${!configured?'<p class="muted">Sign-in is being set up. Your progress is saved on this browser.</p>':user?`<p class="account-identity">${esc(user.email||'Signed in')}</p><p class="account-status" role="status">${esc(message||syncState?.message||'Checking saved progress…')}</p>${syncState?.state==='choice'?`<p class="hint">This device: day ${syncer?.getProgress().appDay||1}${syncState.remote?` · Cloud: day ${esc(syncState.remote.appDay)}`:''}. Whole progress includes settings and unfinished days.</p><div class="account-actions"><button class="secondary" data-account="device">${syncState.remote?'Keep this device’s progress':'Save this progress'}</button>${syncState.remote?'<button class="secondary" data-account="cloud">Use cloud progress</button>':''}</div><p class="hint">A local recovery copy is kept before replacing progress.</p>`:''}${isAdmin?'<button class="secondary" data-account="inbox">Content inbox</button>':''}<details class="account-options" ${accountOptionsOpen?'open':''}><summary>Manage account</summary><p class="hint">You stay signed in on this browser until you sign out.</p><div class="account-actions"><button class="plain" data-account="sync">Sync now</button><button class="plain" data-account="recovery">Export recovery copy</button><button class="plain" data-account="signout">Sign out</button></div></details>`:`<p class="muted">Keep your progress with you on every device.</p><div class="account-actions">${['google','apple'].map(provider=>`<button class="provider-button" aria-label="Sign in with ${provider==='google'?'Google':'Apple'}" data-account="${provider}" ${working||!client||config.providers?.[provider]!==true?'disabled':''}><img src="src/assets/auth/${provider}-sign-in.png" alt="Sign in with ${provider==='google'?'Google':'Apple'}" height="44"></button>`).join('')}</div>${!config.providers?.google||!config.providers?.apple?'<p class="hint">Unavailable sign-in options are still being set up.</p>':''}<p role="status">${esc(message)}</p>`}`;
  panel.querySelectorAll('.account-options').forEach(details=>details.addEventListener('toggle',()=>{accountOptionsOpen=details.open;}));
  panel.querySelectorAll('[data-account]').forEach(button=>button.addEventListener('click',async()=>{
   const action=button.dataset.account;
   try{
    message='';
    if(action==='inbox'){openReportInbox(createReportService(client),button);return;}
    if(action==='google'||action==='apple'){if(working)return;working=true;mount();try{await signInWithProvider(client,config,action,window.location.href);}finally{working=false;}mount();return;}
    if(action==='signout'){
     const {error}=await client.auth.signOut({scope:'local'});if(error)throw error;
     await setUser(null);return;
    }
    if(action==='sync')await syncer?.sync();
    if(action==='device'||action==='cloud'){
     if(syncState?.remote&&!confirm(action==='device'?'Replace cloud progress with this device’s progress? Other devices will be asked to resolve their copies.':'Use cloud progress on this device? A local recovery copy of the current progress will be saved.'))return;
     await syncer?.choose(action);
    }
    if(action==='recovery'){
     const raw=storage.getItem(accountKey()+':recovery');if(!raw)throw new Error('No recovery copy has been needed yet.');
     const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='perlingo-recovery.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
   }catch(error){message=error.message||'Please try again.';}
   mount();
  }));
 }
 const accountKey=()=>`perlingo-account-v1:${user.id}:${pack}`;
 async function setUser(next){
  if(user?.id===next?.id)return;
  document.querySelector('.report-inbox')?.remove();
  sequence++;isAdmin=false;syncer?.dispose();syncer=null;user=next;syncState=null;message='';
  if(!user){apply(getGuest());mount();return;}
  const id=sequence;
  try{
   syncer=createProgressSync({storage,key:accountKey(),initial:getGuest(),remote:progressRemote(client,pack),validate,
    onApply:progress=>{if(id===sequence)apply(progress);},onStatus:state=>{if(id===sequence){syncState=state;mount();}}
   });
   apply(syncer.getProgress());mount();await syncer.sync();
   try{const allowed=await createReportService(client).isAdmin();if(id===sequence){isAdmin=allowed===true;mount();}}catch{/* Inbox remains hidden when access cannot be verified. */}
  }catch(error){message=error.message;onStorageError();mount();}
 }
 async function start(){
  if(!configured)return;
  try{
   // Verify persistence is available before promising persistent sign-in.
   const probe='perlingo-storage-check';storage.setItem(probe,'1');storage.removeItem(probe);
   client=await clientFactory(config);
   client.auth.onAuthStateChange((_event,session)=>{setTimeout(()=>setUser(session?.user||null),0);});
   const {data,error}=await client.auth.getSession();if(error)throw error;
   await setUser(data.session?.user||null);mount();
  }catch(error){message=error.message||'Sign-in is temporarily unavailable.';mount();}
 }
 window.addEventListener('online',()=>syncer?.sync());
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)syncer?.sync();});
 const interval=setInterval(()=>{if(!document.hidden)syncer?.sync();},30000);
 interval.unref?.();
 return {start,mount,sendReport:report=>createReportService(client).send(report),save(progress){if(!user)return false;if(syncer)syncer.save(progress);else onStorageError();return true;}};
}
