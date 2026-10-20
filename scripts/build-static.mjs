import {cpSync,mkdirSync,rmSync,readdirSync,statSync} from 'node:fs';
import {join} from 'node:path';
// Only public application assets belong in the deployment, not generation ledgers or auditions.
rmSync('dist',{recursive:true,force:true});mkdirSync('dist');
for(const entry of ['index.html','about.html','privacy.html','content-review.html','src','audio-regions'])cpSync(entry,join('dist',entry),{recursive:true});
let count=0,bytes=0;
function inspect(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())inspect(path);else{const size=statSync(path).size;if(size>25*1024*1024)throw Error(`Static asset exceeds 25 MiB: ${path}`);count++;bytes+=size;}}}
inspect('dist');if(count>100000)throw Error('Static asset count exceeds Workers for Platforms limit');
console.log(`Static release: ${count} files, ${(bytes/1024/1024).toFixed(1)} MiB.`);
