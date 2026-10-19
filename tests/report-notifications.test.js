import test from 'node:test';
import assert from 'node:assert/strict';
import {notificationMessage,sendNotification,processNotifications} from '../supabase/functions/report-notifications/worker.js';
test('notifications use a fixed destination and stable retry key, with no report contents',async()=>{
 const message=notificationMessage('report-123');assert.deepEqual(message.to,['reports@perlingo.app']);assert.match(message.text,/report-123/);
 let first;
 const fetcher=async(url,args)=>{if(first)assert.deepEqual(args.body,first.body);first=args;assert.equal(url,'https://api.resend.com/emails');assert.equal(args.headers['Idempotency-Key'],'perlingo-report/report-123');return Response.json({id:'email-123'});};
 assert.equal(await sendNotification('report-123','secret',fetcher),'email-123');await sendNotification('report-123','secret',fetcher);
});
test('a rejected or unconfirmed email never appears sent',async()=>{
 await assert.rejects(sendNotification('r','secret',async()=>new Response('private provider details',{status:429})),/^Error: Email provider returned 429$/);
 await assert.rejects(sendNotification('r','secret',async()=>Response.json({})),/did not confirm/);
});
test('failed mail is recorded for retry without exposing provider payloads',async()=>{
 const calls=[];const db={rpc:async(name,args)=>{calls.push({name,args});return {data:name==='claim_report_notifications'?[{report_id:'r',lease_id:'lease'}]:true};}};
 const result=await processNotifications(db,'secret',async()=>{throw new Error('secret transport details');});
 assert.deepEqual(result,{sent:0,failed:1});assert.equal(calls[1].args.p_error,'Email request failed');assert.equal(calls[1].args.p_provider_id,null);assert.equal(calls[1].args.p_lease_id,'lease');
});
test('database acknowledgement failures are not reported as successful',async()=>{
 const db={rpc:async name=>name==='claim_report_notifications'?{data:[{report_id:'r',lease_id:'l'}]}:{error:new Error('db failed')}};
 await assert.rejects(processNotifications(db,'secret',async()=>Response.json({id:'email'})),/not saved/);
});
