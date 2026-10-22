import {cpSync,mkdirSync,rmSync,readdirSync,statSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
// Only public application assets belong in the deployment, not generation ledgers or auditions.
const audioHost=process.env.PERLINGO_AUDIO_BASE_URL;
if(audioHost){
 const url=new URL(audioHost);
 if(url.protocol!=='https:'||url.username||url.password||url.search||url.hash||!audioHost.endsWith('/'))throw Error('Audio host must be an HTTPS directory URL without credentials or query parameters.');
}
rmSync('dist',{recursive:true,force:true});mkdirSync('dist');
for(const entry of ['index.html','about.html','privacy.html','content-review.html','src','audio-regions'])cpSync(entry,join('dist',entry),{recursive:true,filter:source=>!audioHost||!(source.startsWith('src/audio/azure/')&&source.endsWith('.mp3'))});
if(audioHost)writeFileSync('dist/src/audio-host.js',`export const audioBaseUrl = ${JSON.stringify(audioHost)};\n`);
mkdirSync('dist/learning',{recursive:true});
cpSync('index.html','dist/learning/index.html');
writeFileSync('dist/index.html','<!doctype html><meta http-equiv="refresh" content="0;url=/challenge/"><a href="/challenge/">Open Challenge</a>');
let count=0,bytes=0;
function inspect(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())inspect(path);else{const size=statSync(path).size;if(size>25*1024*1024)throw Error(`Static asset exceeds 25 MiB: ${path}`);count++;bytes+=size;}}}
inspect('dist');if(count>100000)throw Error('Static asset count exceeds Workers for Platforms limit');
console.log(`Static release: ${count} files, ${(bytes/1024/1024).toFixed(1)} MiB.`);
