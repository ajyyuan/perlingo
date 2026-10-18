import {inspectChunk,formLabel} from './details.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let dialog=null,returnFocus=null;
export function closeDetails(){if(dialog){dialog.close();dialog.remove();dialog=null;returnFocus?.focus({preventScroll:true});returnFocus=null;}}
export function openDetails(item,lang,chunk,anchor){
 closeDetails();returnFocus=anchor;
 const details=inspectChunk(item,lang,chunk);
 dialog=document.createElement('dialog');dialog.className='details-sidebar';dialog.setAttribute('aria-labelledby','details-title');
 dialog.innerHTML=`<header class="details-header"><span class="eyebrow">Why this form?</span><button class="plain" data-close aria-label="Close details">×</button></header><h2 id="details-title" lang="${lang}">${esc(chunk.text)}</h2><p class="details-gloss">${esc(chunk.meaning)}</p><p class="muted">${esc(chunk.summary)}</p><p>${esc(chunk.detail)}</p><section><h3>In context</h3><p lang="${lang}" class="details-context">${esc(details.sentence)}</p><p class="muted">${esc(details.english)}</p></section><section><h3>Inspect a word</h3><div class="word-picker">${details.words.map((w,i)=>`<button data-word="${i}" lang="${lang}" aria-pressed="false">${esc(w.text)}</button>`).join('')}</div><div id="word-details" role="region" aria-label="Selected word details" aria-live="polite"></div></section><p class="hint">${details.pilot?'Draft pilot · Independent linguistic review pending.':'Starter content · Independent linguistic review pending. Structured forms are not yet available for this entry.'}</p>${details.sources.length?`<details class="detail-sources"><summary>Lexical references</summary>${details.sources.map(s=>`<p><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)}</a></p>`).join('')}<p class="hint">These references do not certify every sentence or explanation.</p></details>`:''}`;
 const select=i=>{
  const w=details.words[i],lexeme=w.lexeme;
  dialog.querySelectorAll('[data-word]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.word)===i)));
  dialog.querySelector('#word-details').innerHTML=`<h4 lang="${lang}">${esc(w.text)}${w.meaning?` <span class="muted">— ${esc(w.meaning)}</span>`:''}</h4>${w.role?`<p class="muted">${esc(w.role)}</p>`:''}<p>${esc(w.note)}</p>${lexeme?`<dl><dt>Base form</dt><dd lang="${lang}">${esc(lexeme.lemma)}</dd><dt>Part of speech</dt><dd>${esc(lexeme.pos)}</dd>${lexeme.gender?`<dt>Gender</dt><dd>${esc(lexeme.gender)}</dd>`:''}</dl><h4>Available forms</h4><table><caption class="hint">Selected forms only; not a complete ${lexeme.pos==='verb'?'conjugation':'declension'} table.</caption><thead><tr><th>Form</th><th>Use</th></tr></thead><tbody>${lexeme.forms.map(f=>`<tr><td lang="${lang}">${esc(f.text)}</td><td>${esc(formLabel(f))}</td></tr>`).join('')}</tbody></table>`:''}`;
 };
 dialog.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeDetails();else if(e.target.closest('[data-word]'))select(Number(e.target.closest('[data-word]').dataset.word));else if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetails();}});
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetails();});
 document.body.append(dialog);dialog.showModal();if(details.words.length)select(0);dialog.querySelector('[data-close]').focus();
}
