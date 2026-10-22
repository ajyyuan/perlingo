import {transcribe,extraProviders} from './speech-transcribe.mjs';
import {speechRoutes} from './public/speech-profiles.js';
export function speechStatus(env){
 let routes;try{routes=speechRoutes(JSON.parse(env.CHALLENGE_SPEECH_ROUTES||'{}'));}catch{return {configured:false,error:'Invalid speech routing configuration.'};}
 const providers={elevenlabs:!!env.ELEVENLABS_API_KEY,soniox:!!env.SONIOX_API_KEY,...extraProviders(env)};
 return {configured:Object.values(routes).every(name=>providers[name]),provider:'per-language',routes,providers};
}
// Hosted token broker. Provider keys never leave the Worker runtime.
// Limits are per isolate, best-effort throttles, not a global spending cap.
const buckets=new Map();
function reply(status,data){return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
export async function handleSpeechAPI(request,env,{upstream=fetch,now=Date.now}={}){
 const url=new URL(request.url),route=url.pathname;
 if(request.headers.get('Origin')&&request.headers.get('Origin')!==url.origin)return reply(403,{error:'Origin not allowed.'});
 if(route==='/challenge/api/status'&&request.method==='GET')return reply(200,speechStatus(env));
 if(!['/challenge/api/speech/token','/challenge/api/speech/transcribe'].includes(route))return reply(404,{error:'Not found.'});
 if(request.method!=='POST'||request.headers.get('X-Perlingo-Challenge')!=='1')return reply(403,{error:'Unsupported request.'});
 const provider=url.searchParams.get('provider')||'elevenlabs';
 if(route.endsWith('/token')&&!['elevenlabs','soniox'].includes(provider))return reply(400,{error:'Unknown provider.'});
 const key=provider==='soniox'?env.SONIOX_API_KEY:env.ELEVENLABS_API_KEY;
 if(route.endsWith('/token')&&!key)return reply(503,{error:'This recognition provider is unavailable. Try typed recall.'});
 const time=now(),ip=request.headers.get('CF-Connecting-IP')||'unknown';
 for(const [id,b] of buckets)if(time-b.start>=60000)buckets.delete(id);
 const bucket=buckets.get(ip)||{start:time,count:0};
 if(bucket.count>=180||buckets.size>=10000)return reply(429,{error:'Too many requests. Wait a minute and retry.'});
 bucket.count++;buckets.set(ip,bucket);
 if(route.endsWith('/transcribe'))return transcribe(request,env,{upstream});
 try{
  const response=await upstream(provider==='soniox'?'https://api.soniox.com/v1/auth/temporary-api-key':'https://api.elevenlabs.io/v1/single-use-token/realtime_scribe',{
   method:'POST',headers:provider==='soniox'?{Authorization:`Bearer ${key}`,'Content-Type':'application/json'}:{'xi-api-key':key},
   ...(provider==='soniox'?{body:JSON.stringify({usage_type:'transcribe_websocket',expires_in_seconds:60,single_use:true,max_session_duration_seconds:180})}:{}),signal:AbortSignal.timeout(25000)
  });
  if(!response.ok)return reply(502,{error:'Recognition is unavailable. Try again or use typed recall.'});
  const data=await response.json(),token=provider==='soniox'?data.api_key:data.token;
  if(typeof token!=='string'||!token)return reply(502,{error:'Recognition could not start. Please retry.'});
  return reply(200,{token});
 }catch{return reply(502,{error:'Recognition could not connect. Please retry.'});}
}
