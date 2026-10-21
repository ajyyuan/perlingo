import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {recordings} from './public/recordings-data.js';
const root=path.dirname(fileURLToPath(import.meta.url));
try{process.loadEnvFile(path.join(root,'../.env.local'));}catch(error){if(error.code!=='ENOENT')throw error;}
const key=process.env.ELEVENLABS_API_KEY;
const sonioxKey=process.env.SONIOX_API_KEY;
const port=Number(process.env.CHALLENGE_PORT||5174);
const allowedHosts=new Set([`127.0.0.1:${port}`,`localhost:${port}`]);
const publicFiles=new Set(['index.html','style.css','app.js','content.js','noun-packs.js','challenges.js','tree-model.js','family-board.js','family-board.css','tree-picker.js','tree.html','forest.html','forest.js','forest.css','tree-explorer.js','tree-explorer.css','tree-layout.js','language-tree.json','engine.js','speech.js','pcm-worklet.js','speech-lab.html','speech-lab.js','benchmark.js','recordings.js','recordings-data.js','audio-sources.html',...recordings.flatMap(r=>[r.file,...(r.reference?[r.reference.file]:[])]).map(file=>file.replace(/^\//,''))]);
let requests=[];
function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
async function upstream(endpoint,body){
 if(!key)throw Object.assign(Error('Add ELEVENLABS_API_KEY to .env.local and restart the server.'),{status:503});
 const response=await fetch(`https://api.elevenlabs.io/v1/${endpoint}`,{method:'POST',headers:{'xi-api-key':key,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(25000)});
 if(!response.ok){
  const status=response.status;
  const messages={401:'ElevenLabs rejected the API key. Check the key and its permissions.',403:'Enable the required Speech to Text or Text to Speech permission on this key.',402:'ElevenLabs needs available credits.',429:'ElevenLabs is busy or the account limit was reached. Try again shortly.'};
  // Never forward provider payloads, which can include account details.
  throw Object.assign(Error(messages[status]||`ElevenLabs could not complete this request (HTTP ${status}).`),{status:502});
 }
 return response;
}
export const server=http.createServer(async(req,res)=>{
 res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' wss://api.elevenlabs.io wss://stt-rt.soniox.com; media-src 'self' blob:; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
 if(!allowedHosts.has(req.headers.host)){json(res,403,{error:'Local access only.'});return;}
 const url=new URL(req.url,`http://${req.headers.host}`);
 try{
  if(url.pathname.startsWith('/api/')){
   if(req.headers.origin&&req.headers.origin!==url.origin){json(res,403,{error:'Origin not allowed.'});return;}
   if(url.pathname==='/api/status'&&req.method==='GET'){json(res,200,{configured:!!key,provider:'elevenlabs',model:'scribe_v2_realtime',providers:{elevenlabs:!!key,soniox:!!sonioxKey}});return;}
   if(req.method!=='POST'||req.headers['x-perlingo-challenge']!=='1'){json(res,403,{error:'Unsupported request.'});return;}
   requests=requests.filter(t=>Date.now()-t<60000);if(requests.length>=180){json(res,429,{error:'Too many requests. Wait a moment.'});return;}requests.push(Date.now());
   if(url.pathname==='/api/speech/token'){
    const provider=url.searchParams.get('provider')||'elevenlabs';
    if(!['elevenlabs','soniox'].includes(provider)){json(res,400,{error:'Unknown provider.'});return;}
    if(provider==='soniox'){
     if(!sonioxKey){json(res,503,{error:'Add SONIOX_API_KEY to .env.local and restart the server.'});return;}
     const response=await fetch('https://api.soniox.com/v1/auth/temporary-api-key',{method:'POST',headers:{Authorization:`Bearer ${sonioxKey}`,'Content-Type':'application/json'},body:JSON.stringify({usage_type:'transcribe_websocket',expires_in_seconds:60,single_use:true,max_session_duration_seconds:180}),signal:AbortSignal.timeout(25000)});
     if(!response.ok){json(res,502,{error:`Soniox token request failed (HTTP ${response.status}). Check Speech-to-Text and Temporary API keys permissions.`});return;}
     const data=await response.json();json(res,200,{token:data.api_key});return;
    }
    const response=await upstream('single-use-token/realtime_scribe');const data=await response.json();json(res,200,{token:data.token});return;
   }
   if(url.pathname==='/api/pronounce'){json(res,410,{error:'Study audio uses cached pronunciation files.'});return;}
   json(res,404,{error:'Not found.'});return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const file=url.pathname==='/'?'index.html':url.pathname.slice(1);
  if(!publicFiles.has(file)){res.writeHead(404);res.end('Not found');return;}
  const body=await readFile(path.join(root,'public',file));res.writeHead(200,{'Content-Type':({'.json':'application/json; charset=utf-8','.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav'})[path.extname(file)],'Cache-Control':'no-cache'});res.end(req.method==='HEAD'?undefined:body);
 }catch(error){json(res,error.status||502,{error:error.name==='TimeoutError'?'Speech service timed out. Try again.':error.status?error.message:'Speech service unavailable. Try again.'});}
});
if(process.argv[1]===fileURLToPath(import.meta.url))server.listen(port,'127.0.0.1',()=>console.log(`Perlingo Challenge: http://127.0.0.1:${port}`));
