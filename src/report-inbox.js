const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function openReportInbox(service,anchor){
 const dialog=document.createElement('dialog');dialog.className='report-dialog report-inbox';
 dialog.setAttribute('aria-labelledby','inbox-title');
 dialog.innerHTML='<div class="details-header"><h2 id="inbox-title">Content inbox</h2><button class="plain" data-close aria-label="Close inbox">×</button></div><p class="hint">Private · newest first</p><p role="status" data-status></p><div data-reports></div><div class="account-actions"><button class="secondary" data-prev>Newer</button><button class="secondary" data-next>Older</button><button class="plain" data-refresh>Refresh</button></div>';
 let offset=0,busy=false;
 const status=dialog.querySelector('[data-status]'),list=dialog.querySelector('[data-reports]');
 const close=()=>{dialog.close();dialog.remove();if(anchor?.isConnected)anchor.focus();};
 dialog.querySelector('[data-close]').onclick=close;dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
 function controls(disabled){dialog.querySelectorAll('[data-prev],[data-next],[data-refresh],select').forEach(el=>el.disabled=disabled);}
 async function load(){
  if(busy)return;busy=true;controls(true);status.textContent='Loading reports…';list.replaceChildren();
  try{
   const reports=await service.list(offset);
   if(!dialog.isConnected)return;
   list.innerHTML=reports.map(r=>{const c=r.payload.context;return `<article class="inbox-report"><div class="inbox-meta"><span>${esc(new Date(r.received_at).toLocaleString())} · ${esc(c.language.toUpperCase())}</span><label>Status <select data-id="${esc(r.id)}" aria-label="Status for ${esc(c.entryId)}">${['open','reviewed','resolved'].map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join('')}</select></label></div><h3>${esc(c.prompt)}</h3><p lang="${esc(c.language)}">${esc(c.taughtAnswer)}</p><p class="report-note">${esc(r.payload.note)}</p>${c.submittedAnswer!==null&&c.submittedAnswer!==undefined?`<p class="hint">Learner answer: ${esc(c.submittedAnswer)}</p>`:''}<details><summary>Content snapshot</summary><pre>${esc(JSON.stringify(r.payload,null,2))}</pre></details></article>`;}).join('');
   status.textContent=reports.length?`${offset+1}–${offset+reports.length}`:'No reports here yet.';
   controls(false);dialog.querySelector('[data-prev]').disabled=offset===0;dialog.querySelector('[data-next]').disabled=reports.length<25;
   list.querySelectorAll('select').forEach(select=>select.onchange=async()=>{
    controls(true);status.textContent='Updating status…';
    try{await service.setStatus(select.dataset.id,select.value);status.textContent='Status updated.';}catch(error){status.textContent=error.message;await load();}finally{controls(false);dialog.querySelector('[data-prev]').disabled=offset===0;dialog.querySelector('[data-next]').disabled=reports.length<25;}
   });
  }catch(error){status.textContent=error.message||'Could not load reports.';dialog.querySelector('[data-refresh]').disabled=false;}finally{busy=false;}
 }
 dialog.querySelector('[data-prev]').onclick=()=>{offset=Math.max(0,offset-25);load();};
 dialog.querySelector('[data-next]').onclick=()=>{offset+=25;load();};
 dialog.querySelector('[data-refresh]').onclick=load;
 document.body.append(dialog);dialog.showModal();load();
}
