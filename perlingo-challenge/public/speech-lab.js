import {languages,packs,getEntry} from './content.js';
import {Microphone} from './speech.js';
import {recordings} from './recordings.js';
import {comparePCM} from './benchmark.js';
const $=id=>document.getElementById(id),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let mic=null,pcm=null,sample=null,rows=[],busy=false,generation=0,replayContext=null;
for(const [id,items] of [['pack',packs],['language',languages]])$(id).innerHTML=items.map(x=>`<option value="${x.id}">${esc(x.label||x.name)}</option>`).join('');
function target(){const entry=getEntry($('pack').value,$('language').value);$('target').textContent='Target: '+entry.word+' · '+entry.reading;pcm=null;sample=null;controls();}
function controls(){for(const id of ['pack','language','expected','record'])$(id).disabled=busy;$('compare').disabled=busy||!pcm;$('replay').disabled=busy||!pcm;$('export').disabled=!rows.length;}
function coverage(){$('coverage').textContent='Cached tile recordings: '+packs.map(p=>p.label+' '+recordings.filter(r=>r.pack===p.id).length+'/50').join(' · ')+'. Voices, sources, and check limitations are listed in Audio sources.';}
$('expected').onchange=()=>{if(sample)sample.shouldAccept=$('expected').value==='true';};
$('pack').onchange=target;$('language').onchange=target;
$('record').onclick=async()=>{
 busy=true;pcm=null;controls();const token=++generation;const chunks=[];let samples=0;
 try{mic=new Microphone();await mic.open();if(token!==generation){mic.close();return;}mic.reset(token);$('status').textContent='Recording…';
 await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(Error('Recording interrupted. Try again.')),5000);mic.onAudio=(buffer,level,t)=>{if(token!==generation){clearTimeout(timeout);reject(Error('Recording canceled.'));return;}if(t!==token)return;const part=buffer.slice(0,Math.min(buffer.byteLength,96000-samples));chunks.push(new Uint8Array(part));samples+=part.byteLength;if(samples>=96000){clearTimeout(timeout);resolve();}};});
 if(token!==generation)return;
 const joined=new Uint8Array(samples);let offset=0;for(const c of chunks){joined.set(c,offset);offset+=c.length;}pcm=joined.buffer;sample={pack:$('pack').value,language:$('language').value,shouldAccept:$('expected').value==='true'};$('status').textContent='Recorded. Replay it, then compare.';
 }catch(e){$('status').textContent=e.message;}finally{mic?.close();mic=null;busy=false;controls();}
};
$('replay').onclick=async()=>{await replayContext?.close();replayContext=new AudioContext({sampleRate:16000});const audio=replayContext.createBuffer(1,pcm.byteLength/2,16000);audio.getChannelData(0).set(new Float32Array(new Int16Array(pcm)).map(x=>x/32768));const source=replayContext.createBufferSource();source.buffer=audio;source.connect(replayContext.destination);source.start();};
$('compare').onclick=async()=>{busy=true;controls();$('status').textContent='Sending the same recording to both providers…';try{const entry=getEntry(sample.pack,sample.language);const results=await comparePCM(pcm,sample.language,entry.accepted);rows.push({date:new Date().toISOString(),...sample,results});$('results').innerHTML=rows.map(row=>`<h2>${esc(languages.find(l=>l.id===row.language).name)} · ${row.shouldAccept?'should accept':'should reject'}</h2><table><thead><tr><th>Provider</th><th>Transcript</th><th>Verdict</th><th>After clip</th><th>Connect</th></tr></thead><tbody>${row.results.map(r=>`<tr><td>${esc(r.name)}</td><td>${esc(r.error||r.text||'—')}</td><td>${r.error?'Error':(r.accepted===row.shouldAccept?'✓ ':'✗ ')+(r.accepted?'Accepted':'Rejected')}</td><td>${r.afterClipMs??'—'} ms</td><td>${r.connectionMs??'—'} ms</td></tr>`).join('')}</tbody></table>`).join('');$('status').textContent='Comparison complete.';}catch(e){$('status').textContent=e.message;}finally{busy=false;controls();}};
$('export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(rows,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='perlingo-speech-comparison.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
document.addEventListener('visibilitychange',()=>{if(document.hidden){generation++;mic?.close();replayContext?.close();}});window.addEventListener('pagehide',()=>{generation++;mic?.close();replayContext?.close();});
coverage();target();
