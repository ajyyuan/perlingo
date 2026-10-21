// Challenge data never reads or writes Learning's progress table.
export function createChallengeStore({client,storage,userId,onChange=()=>{},onStatus=()=>{}}){
 const prefix=`pc-account-v1:${userId}:`;
 const read=(key,fallback)=>JSON.parse(storage.getItem(prefix+key)||JSON.stringify(fallback));
 let rows=read('rows',{}),busy=false,disposed=false;
 const pendingRows=()=>{const entries={};for(let i=0;i<storage.length;i++){const key=storage.key(i);if(key.startsWith(prefix+'pending:'))entries[key.slice((prefix+'pending:').length)]=JSON.parse(storage.getItem(key));}return entries;};
 const persist=()=>storage.setItem(prefix+'rows',JSON.stringify(rows));
 const restorePending=()=>{for(const [id,entry] of Object.entries(pendingRows()))rows[id]=entry.row;};
 restorePending();
 const rpc=async(name,args)=>{const {data,error}=await client.rpc(name,args).abortSignal(AbortSignal.timeout(15000));if(error)throw error;return data;};
 const notify=()=>{if(!disposed)onChange();};
 function snapshot(){const values=Object.values(rows);return {attempts:Object.fromEntries(values.filter(r=>r.challenge_date).map(r=>[r.challenge_date,{startedAt:r.started_at,completedAt:r.completed?r.updated_at:null,score:r.record?.score,total:r.record?.total,record:r.record}])),history:values.filter(r=>r.completed&&r.record).map(r=>r.record).sort((a,b)=>b.date.localeCompare(a.date))};}
 async function sync(){
  if(busy||disposed)return;busy=true;onStatus('Syncing…');
  try{
   // Each round has its own outbox entry; retries cannot duplicate completed rounds.
   for(const [id,entry] of Object.entries(pendingRows())){
    if(disposed)return;
    await rpc('save_challenge_round',{p_id:id,p_record:entry.record,p_completed:entry.completed});
    if(disposed)return;
    const key=prefix+'pending:'+id;if(storage.getItem(key)===JSON.stringify(entry))storage.removeItem(key);
   }
   const data=[];
   for(let offset=0;;offset+=1000){
    const page=await client.from('challenge_rounds').select('*').order('id').range(offset,offset+999).abortSignal(AbortSignal.timeout(15000));
    if(page.error)throw page.error;if(disposed)return;data.push(...page.data);if(page.data.length<1000)break;
   }
   if(disposed)return;
   const fresh=Object.fromEntries(data.map(r=>[r.id,r]));
   rows=fresh;restorePending();persist();notify();onStatus(Object.keys(pendingRows()).length?'Waiting to sync':'Synced');
  }catch{if(!disposed)onStatus('Sync unavailable · device changes will retry');}finally{busy=false;}
 }
 return {snapshot,sync,dispose(){disposed=true;},
  async claim(date,id){
   // Must reach the server before revealing a dated word. Same UUID safely retries a lost response.
   const claimed=await rpc('claim_challenge_round',{p_date:date,p_id:id});
   if(disposed)throw Error('Account changed');
   if(!claimed){await sync();return false;}
   rows[id]={id,challenge_date:date,started_at:new Date().toISOString(),completed:false,record:null};persist();return true;
  },
  save(id,record,completed){
   if(disposed)throw Error('Account changed');
   rows[id]={...rows[id],id,challenge_date:record.challengeDate||null,started_at:rows[id]?.started_at||record.date,updated_at:record.date,record:structuredClone(record),completed};
   storage.setItem(prefix+'pending:'+id,JSON.stringify({record:structuredClone(record),completed,row:rows[id]}));persist();notify();void sync();
  }
 };
}
