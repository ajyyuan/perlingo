import {activeLanguages as languages,activePacks as packs,getEntry} from './content.js';
import {RecordingPlayer,getRecording} from './recordings.js';
import {Microphone,createRoutedSpeechProvider} from './speech.js';
import {providerLabels,speechModels} from './speech-profiles.js';
import {spokenVerdict} from './engine.js';
import {DeveloperSession,reviewIdentity} from './developer-session.js';
const $=id=>document.getElementById(id),esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='pc-developer-reviews-v1',player=new RecordingPlayer();
let records={},status=null,provider=null,pack=packs[0].id,language=languages[0].id,playSerial=0;
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))records=saved;}catch{$('storage-status').textContent='Saved reviews could not be read. Export this session before leaving.';}
const selectedEntry=()=>getEntry(pack,language);
function identity(p=pack,l=language){return reviewIdentity(p,getEntry(p,l),getRecording(p,l),status?.routes?.[l],speechModels[status?.routes?.[l]]);}
function row(){const key=identity();return records[key]??={identity:JSON.parse(key),review:'unchecked',notes:'',attempts:[]};}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(records));$('storage-status').textContent='Saved in this browser.';}catch{$('storage-status').textContent='Could not save. Export your review before leaving.';}}
function controls(){const busy=attempt.phase&&attempt.phase!=='idle';$('record').disabled=!!busy||!status?.providers?.[status.routes?.[language]];$('stop').disabled=!busy;}
const attempt=new DeveloperSession({microphone:()=>new Microphone(),prepare:id=>provider.prepare(id),onState:message=>{$('status').textContent=message;controls();},onTranscript:result=>{
 const entry=selectedEntry(),competitors=packs.filter(p=>p.id!==pack).flatMap(p=>getEntry(p.id,language)?.accepted||[]),verdict=spokenVerdict(result,entry,competitors);
 $('transcript').textContent=result.text||'—';$('verdict').textContent=result.final?(verdict.accepted?'✓ Accepted':result.text?'Not accepted':'No speech recognized'):'Hearing…';
 if(result.final){row().attempts.push({date:new Date().toISOString(),transcript:result.text||'',accepted:verdict.accepted});persist();renderAttempts();if(verdict.accepted){attempt.cancel();$('status').textContent='Ready to try again.';controls();}}
}});
function cancel(){playSerial++;player.stop();$('listen').classList.remove('playing');attempt.cancel();controls();}
function renderAttempts(){const attempts=row().attempts||[];$('attempts').innerHTML=attempts.length?attempts.slice().reverse().map(a=>`<div class="attempt">${esc(a.transcript||'No speech')}<small>${a.accepted?'✓ Accepted':'Not accepted'} · ${esc(new Date(a.date).toLocaleString())}</small></div>`).join(''):'<p class="notice">No attempts yet.</p>';}
function visibleLanguages(){return languages.filter(l=>$('filter').value==='all'||(records[identity(pack,l.id)]?.review||'unchecked')===$('filter').value);}
function focusTile(){(document.querySelector(`[data-language="${language}"]`)||$('tiles')).focus({preventScroll:true});}
function renderTiles(){
 let checked=0,issues=0;for(const p of packs)for(const l of languages){const r=records[identity(p.id,l.id)]?.review;if(r==='checked')checked++;if(r==='issue')issues++;}
 $('progress').textContent=`${checked} / ${packs.length*languages.length} checked · ${issues} flagged`;
 const shown=visibleLanguages();
 $('tiles').innerHTML=shown.map(l=>{const e=getEntry(pack,l.id),review=records[identity(pack,l.id)]?.review||'unchecked';return `<button class="tile ${review==='checked'?'success':review==='issue'?'missed':''}" data-review="${review}" data-language="${l.id}" aria-current="${l.id===language}" aria-label="Review ${esc(l.name)}: ${esc(e.word)}"><span class="tile-top"><span aria-hidden="true">${l.flag}</span> ${esc(l.name)}</span><span class="word" lang="${l.id}" dir="auto">${esc(e.word)}</span><small>${review==='checked'?'✓ Checked':review==='issue'?'Needs attention':'Unchecked'}</small></button>`;}).join('');
 $('empty').textContent=shown.length?'':'No recordings match this filter.';
 document.querySelectorAll('[data-language]').forEach(button=>button.onclick=()=>{language=button.dataset.language;$('language').value=language;render();focusTile();});
}
function render(){cancel();const entry=selectedEntry(),l=languages.find(l=>l.id===language);$('flag').textContent=l.flag;$('language-name').textContent=l.name;$('word').textContent=entry.word;$('word').lang=language;$('reading').textContent=entry.reading;$('ipa').textContent=entry.ipa?`/${entry.ipa}/`:'';$('listen').setAttribute('aria-label',`Listen to ${entry.word} in ${l.name}`);
 $('route').textContent=status?.routes?.[language]?`Your microphone audio goes to ${providerLabels[status.routes[language]]}.`:'Speech route unavailable.';
 $('transcript').textContent='';$('verdict').textContent='';$('status').textContent=status?'Ready.':'Loading speech routes…';$('review').disabled=!status;$('notes').disabled=!status;
 const r=row();$('review').value=r.review||'unchecked';$('review').dataset.review=$('review').value;$('notes').value=r.notes||'';renderAttempts();renderTiles();controls();
}
$('pack').innerHTML=packs.map(p=>`<option value="${p.id}">${esc(p.emoji+' '+p.label)}</option>`).join('');$('language').innerHTML=languages.map(l=>`<option value="${l.id}">${esc(l.name)}</option>`).join('');
$('pack').onchange=()=>{pack=$('pack').value;render();};$('language').onchange=()=>{language=$('language').value;render();};$('filter').onchange=renderTiles;
$('listen').onclick=async()=>{cancel();const serial=playSerial;$('listen').classList.add('playing');try{await player.play(pack,selectedEntry(),languages.find(l=>l.id===language));}catch(error){if(serial===playSerial)$('status').textContent=error.message;}finally{if(serial===playSerial)$('listen').classList.remove('playing');}};
$('record').onclick=()=>{cancel();$('transcript').textContent='';$('verdict').textContent='';attempt.start(language);};$('stop').onclick=()=>attempt.finish();
$('review').onchange=()=>{row().review=$('review').value;$('review').dataset.review=$('review').value;row().reviewedAt=new Date().toISOString();persist();renderTiles();};$('notes').oninput=()=>{row().notes=$('notes').value;persist();};
$('next').onclick=()=>{const pairs=packs.flatMap(p=>languages.map(l=>[p.id,l.id]));const start=pairs.findIndex(([p,l])=>p===pack&&l===language);for(let step=1;step<=pairs.length;step++){const [p,l]=pairs[(start+step)%pairs.length];if((records[identity(p,l)]?.review||'unchecked')==='unchecked'){pack=p;language=l;$('pack').value=p;$('language').value=l;render();return;}}$('status').textContent='All current recordings have a review.';};
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({schemaVersion:1,exportedAt:new Date().toISOString(),scope:{words:packs.map(p=>p.id),languages:languages.map(l=>l.id)},reviews:Object.values(records).filter(r=>r.review!=='unchecked'||r.notes||r.attempts?.length)},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='perlingo-recording-review.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
document.addEventListener('keydown',event=>{
 if(event.defaultPrevented||event.altKey||event.ctrlKey||event.metaKey||event.shiftKey||event.isComposing)return;
 const target=event.target;
 if(target.isContentEditable||target.closest('input,textarea,select,a,summary,[role="textbox"]'))return;
 if(['Space','Enter'].includes(event.code)&&target.closest('#export,#next'))return;
 if(!['ArrowLeft','ArrowRight','Space','Enter','KeyL'].includes(event.code))return;
 event.preventDefault();if(event.repeat)return;
 if(event.code==='Space'){
  if(attempt.phase==='settling'){cancel();$('status').textContent='Stopped.';}
  else if(attempt.phase==='listening'||attempt.phase==='connecting')$('stop').click();
  else if(!$('record').disabled)$('record').click();
 }else if(event.code==='KeyL'){
  $('listen').click();
 }else if(event.code==='Enter'){
  if(!status?.routes)return;
  const states=['unchecked','checked','issue'];
  $('review').value=states[(states.indexOf(row().review||'unchecked')+1)%states.length];
  $('review').onchange();focusTile();
  $('storage-status').textContent+=' '+({unchecked:'Marked unchecked.',checked:'Marked checked.',issue:'Marked needs attention.'}[row().review]);
 }else{
  const shown=visibleLanguages();if(!shown.length)return;
  const index=shown.findIndex(l=>l.id===language),direction=event.code==='ArrowRight'?1:-1;
  language=shown[index<0?(direction===1?0:shown.length-1):(index+direction+shown.length)%shown.length].id;
  $('language').value=language;render();focusTile();
 }
});
document.addEventListener('visibilitychange' ,()=>{if(document.hidden){cancel();$('status').textContent='Paused. Tap Try speaking to resume.';}});window.addEventListener('pagehide',cancel);
render();fetch('/api/status').then(async response=>{if(!response.ok)throw Error('Speech routes could not load. Reload to retry.');status=await response.json();if(!status.routes)throw Error(status.error||'Speech routes unavailable.');provider=createRoutedSpeechProvider(status.routes);render();}).catch(error=>{$('status').textContent=error.message;});
