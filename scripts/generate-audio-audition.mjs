// Google Cloud access token on stdin; never print it or save it with audio.
// Run with --dry-run to inspect the fixed job without credentials/network.
import {readFile,mkdir,writeFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const project='perlingo-512119';
const dir=new URL('../audio-audition/',import.meta.url);
const {samples}=JSON.parse(await readFile(new URL('../docs/audio-audition.json',import.meta.url),'utf8'));
const jobs=samples.flatMap((s,i)=>['Charon','Kore'].map(voice=>({...s,voice:`${s.locale}-Chirp3-HD-${voice}`,file:`${s.locale}-${voice}-${i+1}.mp3`})));
const chars=jobs.reduce((n,j)=>n+[...j.text].length,0);
const estimate=chars*30/1e6;
if(jobs.length!==36||estimate>.05)throw Error('Sample job changed; review before generation.');
console.log(JSON.stringify({clips:jobs.length,characters:chars,estimatedUsdBeforeAllowance:estimate}));
if(process.argv.includes('--dry-run'))process.exit(0);
await mkdir(dir,{recursive:true});
const ledger=new URL('generation.json',dir);
try{await access(ledger);throw Error('Generation ledger exists. Review it before starting another billed job.');}catch(e){if(e.code!=='ENOENT')throw e;}
let token='';for await(const part of process.stdin)token+=part;token=token.trim();
if(!token||/\s/.test(token))throw Error('Provide one Google access token on stdin.');
const headers={Authorization:`Bearer ${token}`,'x-goog-user-project':project,'Content-Type':'application/json'};
const voicesResponse=await fetch('https://texttospeech.googleapis.com/v1/voices',{headers,signal:AbortSignal.timeout(30000)});
if(!voicesResponse.ok)throw Error(`Voice availability request failed: HTTP ${voicesResponse.status}`);
const {voices}=await voicesResponse.json();
for(const j of jobs)if(!voices.some(v=>v.name===j.voice&&v.languageCodes.includes(j.locale)))throw Error(`Unavailable voice: ${j.voice}`);
const record={provider:'Google Cloud Text-to-Speech',project,createdAt:new Date().toISOString(),estimatedUsdBeforeAllowance:estimate,attemptedCharacters:0,clips:[]};
const save=()=>writeFile(ledger,JSON.stringify(record,null,2)+'\n');
await save();
for(const job of jobs){
 const clip={...job,textSha256:createHash('sha256').update(job.text).digest('hex'),status:'attempted'};
 record.clips.push(clip);record.attemptedCharacters+=[...job.text].length;await save();
 const response=await fetch('https://texttospeech.googleapis.com/v1/text:synthesize',{method:'POST',headers,body:JSON.stringify({input:{text:job.text},voice:{languageCode:job.locale,name:job.voice},audioConfig:{audioEncoding:'MP3'}}),signal:AbortSignal.timeout(60000)});
 if(!response.ok){clip.status=`failed-http-${response.status}`;await save();throw Error(`Synthesis stopped: HTTP ${response.status}. No automatic retries.`);}
 const body=await response.json();if(!body.audioContent)throw Error('No audio returned; job stopped.');
 const audio=Buffer.from(body.audioContent,'base64');if(audio.length<100)throw Error('Unexpectedly small audio response; job stopped.');
 await writeFile(new URL(job.file,dir),audio);clip.status='generated';clip.bytes=audio.length;await save();
 console.log(`Saved ${job.file}`);
}
console.log('Sample generation complete. No production files changed.');
