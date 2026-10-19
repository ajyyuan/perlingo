import test from 'node:test';
import assert from 'node:assert/strict';
import {createReportService} from '../src/report-service.js';
const client=(rpc,session={user:{id:'u'}})=>({auth:{getSession:async()=>({data:{session}})},rpc});
test('report submission requires a session and confirmed matching server ID',async()=>{
 let calls=0;const rpc=async()=>{calls++;return {data:'report-id'};};
 await assert.rejects(createReportService(null).send({}),/Sign in/);
 await assert.rejects(createReportService(client(rpc,null)).send({}),/Sign in/);assert.equal(calls,0);
 assert.equal(await createReportService(client(rpc)).send({id:'report-id'}),'report-id');
 await assert.rejects(createReportService(client(rpc)).send({id:'different'}),/not confirmed/);
});
test('RPC failures propagate instead of reporting successful delivery',async()=>{
 const service=createReportService(client(async()=>({error:new Error('Report limit reached')})));
 await assert.rejects(service.send({id:'x'}),/Report limit/);
 await assert.rejects(service.list(0),/Report limit/);
});
test('admin list and status operations use server authorization and handle missing reports',async()=>{
 const calls=[];const service=createReportService(client(async(name,args)=>{calls.push({name,args});return {data:name==='set_content_report_status'?false:[]};}));
 await service.list(25);assert.deepEqual(calls[0],{name:'list_content_reports',args:{p_offset:25}});
 await assert.rejects(service.setStatus('id','resolved'),/not found/);
 assert.deepEqual(calls[1],{name:'set_content_report_status',args:{p_id:'id',p_status:'resolved'}});
});
