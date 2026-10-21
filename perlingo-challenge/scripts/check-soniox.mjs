// Silent streams validate configuration/language coverage, not recognition accuracy.
import {writeFile} from 'node:fs/promises';
import {languages} from '../public/content.js';
import {comparePCM} from '../public/benchmark.js';
const originalFetch=globalThis.fetch;
globalThis.fetch=(url,options)=>originalFetch(new URL(url,'http://127.0.0.1:5174'),options);
const rows=[];
for(let offset=0;offset<languages.length;offset+=4){
 const batch=await Promise.all(languages.slice(offset,offset+4).map(async language=>({language:language.id,result:(await comparePCM(new ArrayBuffer(32000),language.id,[],['soniox']))[0]})));
 rows.push(...batch);console.log(JSON.stringify(batch.map(r=>({language:r.language,error:r.result.error||null,text:r.result.text}))));
}
await writeFile('perlingo-challenge/soniox-language-check.json',JSON.stringify({date:new Date().toISOString(),scope:'One second of silence per language; configuration check, NOT accuracy',rows},null,2)+'\n');
