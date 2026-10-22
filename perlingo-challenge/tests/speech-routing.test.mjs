import test from 'node:test';
import assert from 'node:assert/strict';
import {languages} from '../public/content.js';
import {speechRoutes,speechCandidates,speechLocales} from '../public/speech-profiles.js';
import {speechStatus,handleSpeechAPI} from '../hosted-api.mjs';
import {ShortAudioProvider} from '../public/speech.js';
const env={ELEVENLABS_API_KEY:'baseline',AZURE_SPEECH_KEY:'private-azure',AZURE_SPEECH_REGION:'eastus',SARVAM_API_KEY:'private-sarvam'};
const request=(provider,language,body=new Uint8Array(6400),origin='https://perlingo.app')=>new Request(`https://perlingo.app/challenge/api/speech/transcribe?provider=${provider}&language=${language}`,{method:'POST',headers:{Origin:origin,'X-Perlingo-Challenge':'1','Content-Type':'application/octet-stream'},body});
test('routing covers exactly the game languages and rejects unsupported specialist assignments',()=>{
 assert.deepEqual(Object.keys(speechLocales).sort(),languages.map(l=>l.id).sort());
 assert.equal(speechRoutes({hi:'sarvam',cs:'azure'}).hi,'sarvam');assert.equal(speechRoutes({hi:'sarvam',cs:'azure'}).cs,'azure');assert.equal(speechRoutes().fr,'elevenlabs');
 assert.throws(()=>speechRoutes({cs:'sarvam'}));assert.throws(()=>speechRoutes({unknown:'azure'}));assert.throws(()=>speechRoutes({fr:'unlisted'}));
 assert(speechCandidates('ta').includes('sarvam'));assert(!speechCandidates('ru').includes('sarvam'));
 const status=speechStatus({...env,CHALLENGE_SPEECH_ROUTES:'{"fr":"soniox"}'});assert.equal(status.configured,false);assert.equal(status.routes.fr,'soniox');assert(!JSON.stringify(status).includes('private-'));
});
test('short-audio broker rejects bad routes, cross-origin audio and oversized audio before spending',async()=>{
 let calls=0;const upstream=async()=>{calls++;throw Error('Must not call');};
 for(const [req,status] of [[request('sarvam','cs'),400],[request('azure','en',new Uint8Array(6400),'https://evil.example'),403],[request('azure','en',new Uint8Array(480002)),413],[request('azure','en',new Uint8Array(3201)),400]])assert.equal((await handleSpeechAPI(req,env,{upstream})).status,status);
 assert.equal(calls,0);
});
test('Azure sends fixed locale and valid WAV without reference-answer hints or leaking provider fields',async()=>{
 const res=await handleSpeechAPI(request('azure','cs'),env,{upstream:async(url,opts)=>{
  assert(url.startsWith('https://eastus.stt.speech.microsoft.com/'));assert(url.includes('language=cs-CZ'));assert.equal(opts.headers['Ocp-Apim-Subscription-Key'],'private-azure');
  assert.equal(new TextDecoder().decode(opts.body.slice(0,4)),'RIFF');assert.equal(new DataView(opts.body.buffer).getUint32(24,true),16000);assert(!opts.headers['Pronunciation-Assessment']);
  return Response.json({RecognitionStatus:'Success',DisplayText:'Chléb.',private:'hidden'});
 }});assert.deepEqual(await res.json(),{text:'Chléb.',final:true});
});
test('Sarvam pins Indic language and verbatim model with no target text; upstream failures stay private',async()=>{
 const res=await handleSpeechAPI(request('sarvam','ur'),env,{upstream:async(url,opts)=>{assert.equal(url,'https://api.sarvam.ai/speech-to-text');assert.equal(opts.body.get('language_code'),'ur-IN');assert.equal(opts.body.get('mode'),'verbatim');assert.equal(opts.body.get('model'),'saaras:v4');assert.equal(opts.body.get('keyterms'),null);return Response.json({transcript:'روٹی',request_id:'hidden'});}});
 assert.deepEqual(await res.json(),{text:'روٹی',final:true});
 const bad=await handleSpeechAPI(request('sarvam','hi'),env,{upstream:async()=>new Response('private-sarvam',{status:403})});assert.equal(bad.status,502);assert(!(await bad.text()).includes('private-sarvam'));
});
test('closing a short-audio session aborts work and prevents stale transcripts scoring the next card',async t=>{
 let resolve,signal,callbacks=0;t.mock.method(globalThis,'fetch',(url,options)=>{signal=options.signal;return new Promise(r=>resolve=r);});
 const session=await new ShortAudioProvider('azure').prepare('cs');session.onTranscript=()=>callbacks++;session.push(new ArrayBuffer(6400));assert(session.commit());assert.equal(session.pending,1);assert.equal(session.commit(),false);session.close();assert(signal.aborted);resolve(Response.json({text:'chléb'}));await new Promise(r=>setTimeout(r,0));assert.equal(callbacks,0);
});
test('Google short-word trial pins six supported locales and sends PCM without answer hints',async()=>{
 const googleEnv={...env,GOOGLE_SPEECH_API_KEY:'private-google'};
 for(const [language,locale] of Object.entries({ar:'ar-SA',vi:'vi-VN',ta:'ta-IN',te:'te-IN',ml:'ml-IN',da:'da-DK',bn:'bn-BD',no:'no-NO'})){
  const res=await handleSpeechAPI(request('google',language),googleEnv,{upstream:async(url,opts)=>{
   assert.equal(url,'https://speech.googleapis.com/v1/speech:recognize');assert.equal(opts.headers['x-goog-api-key'],'private-google');
   const body=JSON.parse(opts.body);assert.deepEqual(body.config,{encoding:'LINEAR16',sampleRateHertz:16000,audioChannelCount:1,languageCode:locale,model:'latest_short',maxAlternatives:1});assert.equal(Buffer.from(body.audio.content,'base64').length,6400);
   return Response.json({results:[{alternatives:[{transcript:'word',confidence:0.8}]}]});
  }});assert.deepEqual(await res.json(),{text:'word',final:true});
 }
 assert.throws(()=>speechRoutes({en:'google'}));
 assert.equal((await handleSpeechAPI(request('google','ta'),env)).status,503);
 const silence=await handleSpeechAPI(request('google','ta'),googleEnv,{upstream:async()=>Response.json({})});assert.deepEqual(await silence.json(),{text:'',final:true});
 const bad=await handleSpeechAPI(request('google','ta'),googleEnv,{upstream:async()=>new Response('private-google',{status:403})});assert.equal(bad.status,502);assert(!(await bad.text()).includes('private-google'));
});
test('specialist routes are language-restricted, server-authenticated and never receive the answer',async()=>{
 const keys={...env,MUNSIT_API_KEY:'private-munsit',FPT_API_KEY:'private-fpt'};
 assert.equal(speechRoutes({ar:'munsit'}).ar,'munsit');
 for(const route of [{vi:'munsit'},{ar:'fpt'},{en:'munsit'}])assert.throws(()=>speechRoutes(route));
 for(const [provider,language] of [['munsit','ar']])assert.equal((await handleSpeechAPI(request(provider,language),env)).status,503);
 const ar=await handleSpeechAPI(request('munsit','ar'),keys,{upstream:async(url,opts)=>{
  assert.equal(url,'https://api.munsit.com/api/v1/audio/transcribe');assert.equal(opts.headers['x-api-key'],'private-munsit');assert.deepEqual([...opts.body.keys()],['file','model','return_timestamps']);assert.equal(opts.body.get('model'),'munsit');assert.equal(opts.body.get('file').type,'audio/wav');
  return Response.json({statusCode:200,data:{transcription:'قمر',duration:1},message:'Success'});
 }});assert.deepEqual(await ar.json(),{text:'قمر',final:true});
 const fail=await handleSpeechAPI(request('munsit','ar'),keys,{upstream:async()=>Response.json({statusCode:401,message:'private-munsit'})});assert.equal(fail.status,502);assert(!(await fail.text()).includes('private-munsit'));
});

test('idle microphone silence stays bounded and is not uploaded as an answer',async t=>{
 const bodies=[];t.mock.method(globalThis,'fetch',async(_url,options)=>{bodies.push(options.body);return Response.json({text:''});});
 const session=await new ShortAudioProvider('azure').prepare('en');
 for(let i=0;i<200;i++)session.push(new ArrayBuffer(2560),0);
 assert.equal(session.uncommitted,0);assert.equal(session.commit(),false);assert.equal(bodies.length,0);
 const voice=new Int16Array(1280).fill(2000);
 session.push(voice.buffer,.06);session.push(new ArrayBuffer(2560),0);assert(session.commit());
 await new Promise(r=>setTimeout(r,0));
 assert.equal(bodies[0].byteLength,5120+2560+2560);
 assert.equal(new Int16Array(bodies[0].buffer)[2560],2000);session.close();
});

test('a finished retry uploads immediately after the preceding response, without another microphone frame',async t=>{
 const calls=[];t.mock.method(globalThis,'fetch',(_url,options)=>new Promise(resolve=>calls.push({resolve,options})));
 const session=await new ShortAudioProvider('munsit').prepare('ar');const heard=[];session.onTranscript=r=>heard.push(r.text);
 session.push(new ArrayBuffer(6400));assert(session.commit());
 session.push(new ArrayBuffer(9600));assert(session.commit());assert.equal(calls.length,1);
 calls[0].resolve(Response.json({text:'first'}));await new Promise(r=>setTimeout(r,0));
 assert.equal(calls.length,2);assert.equal(calls[1].options.body.byteLength,9600);assert.equal(session.pending,1);
 calls[1].resolve(Response.json({text:'retry'}));await new Promise(r=>setTimeout(r,0));assert.deepEqual(heard,['first','retry']);session.close();
});

test('accepting a previous result cancels queued retries rather than sending them for the next card',async t=>{
 const calls=[];t.mock.method(globalThis,'fetch',(_url,options)=>new Promise(resolve=>calls.push({resolve,options})));
 const session=await new ShortAudioProvider('azure').prepare('en');session.onTranscript=()=>session.close();
 session.push(new ArrayBuffer(6400));session.commit();session.push(new ArrayBuffer(6400));session.commit();
 calls[0].resolve(Response.json({text:'bread'}));await new Promise(r=>setTimeout(r,0));assert.equal(calls.length,1);assert.equal(session.closed,true);
});
