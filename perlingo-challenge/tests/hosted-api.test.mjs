import test from 'node:test';
import assert from 'node:assert/strict';
import {handleSpeechAPI} from '../hosted-api.mjs';
const env={ELEVENLABS_API_KEY:'test-secret',SONIOX_API_KEY:'other-secret'};
const req=(path='/speech/token',origin='https://perlingo.app')=>new Request('https://perlingo.app/challenge/api'+path,{method:'POST',headers:{Origin:origin,'X-Perlingo-Challenge':'1','CF-Connecting-IP':'test-client'}});
test('hosted broker rejects foreign origins and unknown providers without spending',async()=>{
 let calls=0;const options={upstream:()=>{calls++;throw Error();}};
 assert.equal((await handleSpeechAPI(req('/speech/token','https://evil.example'),env,options)).status,403);
 assert.equal((await handleSpeechAPI(req('/speech/token?provider=bad'),env,options)).status,400);assert.equal(calls,0);
});
test('hosted broker returns only temporary tokens and masks upstream errors',async()=>{
 const result=await handleSpeechAPI(req(),env,{upstream:async(url,options)=>{assert.equal(options.headers['xi-api-key'],'test-secret');return Response.json({token:'temporary',private:'hidden'});}});
 assert.deepEqual(await result.json(),{token:'temporary'});
 const failed=await handleSpeechAPI(req(),env,{upstream:async()=>new Response('private upstream details',{status:401})});assert.equal(failed.status,502);assert(!(await failed.text()).includes('private'));
});
test('Soniox token limits remain single-use and bounded',async()=>{
 await handleSpeechAPI(req('/speech/token?provider=soniox'),env,{upstream:async(url,options)=>{const body=JSON.parse(options.body);assert.equal(body.single_use,true);assert.equal(body.expires_in_seconds,60);assert.equal(body.max_session_duration_seconds,180);return Response.json({api_key:'temporary'});}});
});
