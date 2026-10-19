export function createReportService(client){
 async function rpc(name,args){
  if(!client)throw new Error('Sign in from Settings to send a report.');
  const {data:{session},error:sessionError}=await client.auth.getSession();
  if(sessionError||!session)throw new Error('Sign in from Settings to send a report.');
  const {data,error}=await client.rpc(name,args);if(error)throw error;return data;
 }
 return {
  async send(report){const id=await rpc('submit_content_report',{p_report:report});if(id!==report.id)throw new Error('Report was not confirmed. Please try again.');return id;},
  isAdmin:()=>rpc('is_report_admin'),
  list:offset=>rpc('list_content_reports',{p_offset:offset}),
  async setStatus(id,status){if(!await rpc('set_content_report_status',{p_id:id,p_status:status}))throw new Error('Report was not found. Refresh the inbox.');},
 };
}
