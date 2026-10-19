// Server-only worker. Email contains a report identifier, not the learner's note or identity.
export function notificationMessage(reportId){
 return {
  from:'Perlingo <noreply@auth.perlingo.app>',
  to:['reports@perlingo.app'],
  subject:'New Perlingo content report',
  text:`A new content report is waiting in your private Perlingo inbox.\n\nOpen Perlingo, then Settings → Account → Content inbox.\n\nReport ID: ${reportId}\n\nThis notification contains no learner answers or personal details.`,
 };
}
export async function sendNotification(reportId,apiKey,fetcher=fetch){
 const response=await fetcher('https://api.resend.com/emails',{
  method:'POST',headers:{Authorization:`Bearer ${apiKey}`,'Content-Type':'application/json','Idempotency-Key':`perlingo-report/${reportId}`},
  body:JSON.stringify(notificationMessage(reportId)),signal:AbortSignal.timeout(10000),
 });
 // Do not persist provider error bodies: they may contain secret/request details.
 if(!response.ok)throw new Error(`Email provider returned ${response.status}`);
 const data=await response.json();
 if(typeof data.id!=='string'||!data.id)throw new Error('Email provider did not confirm acceptance');
 return data.id;
}
export async function processNotifications(db,apiKey,fetcher=fetch){
 const {data:jobs,error}=await db.rpc('claim_report_notifications');
 if(error)throw new Error('Could not claim notifications');
 let sent=0,failed=0;
 for(const job of jobs||[]){
  let providerId=null,failure=null;
  try{providerId=await sendNotification(job.report_id,apiKey,fetcher);}catch(error){failure=error.message?.startsWith('Email provider')?error.message:'Email request failed';failed++;}
  const {data:finished,error:finishError}=await db.rpc('finish_report_notification',{
   p_report_id:job.report_id,p_lease_id:job.lease_id,p_provider_id:providerId,p_error:failure,
  });
  if(finishError||!finished)throw new Error('Notification result was not saved');
  if(providerId)sent++;
 }
 return {sent,failed};
}
