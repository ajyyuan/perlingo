import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {processNotifications} from './worker.js';
Deno.serve(async request=>{
 const token=Deno.env.get('REPORT_WORKER_TOKEN');
 if(!token||request.headers.get('X-Report-Worker-Token')!==token)return new Response('Unauthorized',{status:401});
 if(request.method!=='POST')return new Response('Method not allowed',{status:405});
 const apiKey=Deno.env.get('RESEND_API_KEY');
 if(!apiKey)return new Response('Email is not configured',{status:503});
 try{
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
  return Response.json(await processNotifications(db,apiKey));
 }catch{return new Response('Notification processing failed',{status:503});}
});
