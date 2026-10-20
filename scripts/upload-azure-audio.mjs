import {createHmac,createHash} from 'node:crypto';
import {readFile,readdir,writeFile,unlink} from 'node:fs/promises';
import {resolve} from 'node:path';
const account='perlingoaudio',container='pronunciation',root=resolve('src/audio/azure');
const keyFile=process.argv[2];
if(!keyFile)throw Error('Pass an owner-only temporary key file; it is deleted immediately after reading.');
const key=(await readFile(keyFile,'utf8')).trim();
await unlink(keyFile);
if(!/^[A-Za-z0-9+/]{86}==$/.test(key))throw Error('Invalid storage key format');
async function request(method,path,data,extra={}){
 const h={'x-ms-date':new Date().toUTCString(),'x-ms-version':'2023-11-03',...extra};
 if(data)h['Content-Length']=String(data.length);
 const [pathname,query]=path.split('?');
 const canonical=Object.keys(h).filter(k=>k.startsWith('x-ms-')).sort().map(k=>`${k}:${h[k]}\n`).join('');
 const params=query?Object.entries(Object.fromEntries(new URLSearchParams(query))).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`\n${k}:${v}`).join(''):'';
 const sig=[method,'','',data?.length?String(data.length):'',h['Content-MD5']||'',h['Content-Type']||'','','','',h['If-None-Match']||'','','',canonical+`/${account}/${container}${pathname}`+params].join('\n');
 h.Authorization=`SharedKey ${account}:`+createHmac('sha256',Buffer.from(key,'base64')).update(sig).digest('base64');
 return fetch(`https://${account}.blob.core.windows.net/${container}${path}`,{method,headers:h,body:data});
}
let r=await request('PUT','?restype=container',null,{'x-ms-blob-public-access':'blob'});
if(![201,409].includes(r.status))throw Error('Container: '+r.status);
const files=[];
async function walk(p=''){for(const e of await readdir(root+'/'+p,{withFileTypes:true})){const f=p+e.name;if(e.isDirectory())await walk(f+'/');else if(f.endsWith('.mp3'))files.push(f);}}await walk();
let index=0,done=0,uploaded=0; const failures=[];
await Promise.all(Array.from({length:80},async()=>{while(index<files.length){const file=files[index++];try{const data=await readFile(root+'/'+file),md5=createHash('md5').update(data).digest('base64');let ok=false;for(let attempt=0;attempt<4;attempt++){try{let head=await request('HEAD','/'+file);if(head.status===200&&head.headers.get('content-md5')===md5){ok=true;break;}if(head.status===200)throw Error('Existing immutable clip differs; use a new filename');if(head.status!==404)throw Error('HEAD '+head.status);let put=await request('PUT','/'+file,data,{'x-ms-blob-type':'BlockBlob','If-None-Match':'*','Content-Type':'audio/mpeg','Content-MD5':md5,'x-ms-blob-cache-control':'public,max-age=31536000,immutable'});if(put.status!==201)throw Error('PUT '+put.status);if(put.headers.get('content-md5')!==md5)throw Error('MD5 mismatch');uploaded++;ok=true;break;}catch(e){if(attempt===3)throw e;await new Promise(r=>setTimeout(r,1000*(attempt+1)));}}if(!ok)throw Error('Not verified');}catch(e){failures.push({file,error:String(e)});}done++;if(done%1000===0)console.log(JSON.stringify({done,total:files.length,uploaded,failed:failures.length}));}}));
const report={account,container,checkedAt:new Date().toISOString(),total:files.length,uploaded,verified:done-failures.length,failures};await writeFile('audio-generation/hosting-upload-validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));process.exitCode=failures.length?1:0;
