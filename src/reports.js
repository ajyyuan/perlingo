import {contentRecord} from './content/catalog.js';
export const reportStorageKey='perlingo-content-reports-v1';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const copy=value=>JSON.parse(JSON.stringify(value));
export function reportContext(item,lang,{phase='learning',input=null,chunk=null}={}){
 const record=contentRecord(item.id);
 return copy({entryId:item.id,language:lang,packId:record?.pack.id||'starter',packVersion:record?.pack.version??null,
  prompt:item.en,taughtAnswer:item[lang],phase,submittedAnswer:input,selectedChunk:chunk,
  translation:record?.entry.translations[lang]||null,
  lexemes:record?Object.fromEntries((record.entry.translations[lang].lexemeIds||[]).map(id=>[id,record.pack.lexemes[id]])):{}});
}
export function readReports(storage){
 const raw=storage.getItem(reportStorageKey);if(raw===null)return [];
 const reports=JSON.parse(raw);
 if(!Array.isArray(reports)||reports.some(r=>!r?.id||!r.context?.entryId||typeof r.note!=='string'))throw new Error('Saved reports could not be read.');
 return reports;
}
export function saveReport(storage,report){const reports=readReports(storage);reports.push(report);storage.setItem(reportStorageKey,JSON.stringify(reports));}
function download(reports){const url=URL.createObjectURL(new Blob([JSON.stringify({schemaVersion:1,reports},null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='perlingo-content-reports.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function openReport(context,anchor){
 const dialog=document.createElement('dialog');dialog.className='report-dialog';dialog.setAttribute('aria-labelledby','report-title');
 dialog.innerHTML=`<form><div class="details-header"><h2 id="report-title">Report a content issue</h2><button type="button" class="plain" data-close aria-label="Close report">×</button></div><p>${esc(context.prompt)} · ${esc(context.language.toUpperCase())}</p><p lang="${esc(context.language)}">${esc(context.taughtAnswer)}</p><label for="report-note">What seems wrong?</label><textarea id="report-note" required maxlength="2000" rows="5" placeholder="Translation, grammar, missing valid answer…"></textarea><p class="hint">Saved on this browser only. Export the report and share the file with the maintainer to have it reviewed. Nothing is sent automatically.</p><p class="hint">Includes the entry, content version, explanation data and any answer you just submitted. Avoid personal information.</p><p role="status" data-status></p><div class="actions"><button type="button" class="secondary" data-export>Export this report</button><button class="primary" type="submit">Save locally</button></div></form>`;
 const id=crypto.randomUUID(),createdAt=new Date().toISOString();let saved=false;
 const report=()=>({id,createdAt,status:'open',note:dialog.querySelector('textarea').value.trim(),context});
 const close=()=>{dialog.close();dialog.remove();anchor?.isConnected&&anchor.focus({preventScroll:true});};
 dialog.querySelector('[data-close]').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 const valid=()=>{const field=dialog.querySelector('textarea');field.setCustomValidity(field.value.trim()?'':'Describe the issue first.');return field.reportValidity();};
 dialog.querySelector('textarea').oninput=e=>e.target.setCustomValidity('');
 dialog.querySelector('form').onsubmit=e=>{e.preventDefault();if(saved||!valid())return;try{saveReport(localStorage,report());saved=true;dialog.querySelector('textarea').readOnly=true;dialog.querySelector('[type=submit]').disabled=true;dialog.querySelector('[data-status]').textContent='Saved locally. Export and share it to request a correction.';}catch{dialog.querySelector('[data-status]').textContent='Could not save locally. Your note is still here; export this report to keep it.';}};
 dialog.querySelector('[data-export]').onclick=()=>{if(valid())download([report()]);};
 document.body.append(dialog);dialog.showModal();dialog.querySelector('textarea').focus();
}
export function exportReports(){try{const reports=readReports(localStorage);if(!reports.length)return 'No saved reports on this browser.';download(reports);return `Exported ${reports.length} saved report${reports.length===1?'':'s'}. Share the file with the maintainer.`;}catch{return 'Could not read saved reports. Browser storage may be unavailable or the saved data may be damaged.';}}
