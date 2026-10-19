import {helpLink,closeHelp} from './help-overlay.js';
import {germanArticleGuide} from './german-articles.js';
import {languages} from './content.js';
import {chartMarkup,mountChart} from './ipa-chart.js';
import {grammarMarkup} from './grammar-help.js';
import {interactiveIPA} from './ipa.js';
import {openReport,reportContext} from './reports.js';
import {inspectChunk,formLabel,formsForWord} from './details.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let dialog=null,returnFocus=null,stopChart=null,stopSpeech=null;
export function closeDetails(){closeHelp();stopSpeech?.();stopSpeech=null;stopChart?.();stopChart=null;if(dialog){dialog.close();dialog.remove();dialog=null;returnFocus?.focus({preventScroll:true});returnFocus=null;}}
export function openDetails(item,lang,chunk,anchor){
 closeDetails();returnFocus=anchor;
 const details=inspectChunk(item,lang,chunk);
 dialog=document.createElement('dialog');dialog.className='details-overlay';dialog.setAttribute('aria-labelledby','details-title');
 dialog.innerHTML=`<header class="details-header"><span class="eyebrow" data-details-heading>Grammar</span><button class="plain" data-close aria-label="Close grammar">×</button></header><div data-details-view><h2 id="details-title" lang="${lang}">${esc(chunk.text)}</h2><p class="details-gloss">${esc(chunk.meaning)}</p><p class="muted">${grammarMarkup(chunk.summary)}</p><p>${esc(chunk.detail)}</p>${details.sentence!==chunk.text?helpLink('Sentence context',`<p lang="${lang}" class="details-context">${esc(details.sentence)}</p><p class="muted">${esc(details.english)}</p>`):''}<section>${details.words.length>1?`<h3>Inspect a word</h3><div class="word-picker">${details.words.map((w,i)=>`<button data-word="${i}" lang="${lang}" aria-pressed="false">${esc(w.text)}</button>`).join('')}</div>`:''}<div id="word-details" role="region" aria-label="Selected word details" aria-live="polite"></div></section></div>`;
 const reportButton=document.createElement('button');reportButton.className='plain';reportButton.textContent='Report an issue';reportButton.onclick=()=>openReport(reportContext(item,lang,{chunk}),reportButton);dialog.querySelector('[data-details-view]').append(reportButton);
 const select=(i,tense)=>{
  const w=details.words[i],lexeme=w.lexeme;
  const forms=formsForWord(w),tenses=[...new Set(forms.map(f=>f.tense).filter(Boolean))];
  tense=tense||w.features?.tense||(tenses.includes('present')?'present':tenses[0]);
  const shown=lexeme?.pos==='verb'?forms.filter(f=>f.tense===tense):forms;
  dialog.querySelectorAll('[data-word]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.word)===i)));
  dialog.querySelector('#word-details').innerHTML=`${details.words.length>1?`<h4 lang="${lang}">${esc(w.text)}${w.meaning?` <span class="muted">— ${esc(w.meaning)}</span>`:''}</h4>`:''}${w.role&&w.role!==chunk.summary?`<p class="muted">${grammarMarkup(w.role)}</p>`:''}${w.note!==chunk.detail?`<p>${esc(w.note)}</p>`:''}${lang==='de'&&/\bdefinite article\b/i.test(w.role||'')?germanArticleGuide():''}${lexeme?`<dl><dt>Base form</dt><dd lang="${lang}">${esc(lexeme.lemma)}</dd><dt>Part of speech</dt><dd>${grammarMarkup(lexeme.pos)}</dd>${lexeme.gender?`<dt>Gender</dt><dd>${grammarMarkup(lexeme.gender)}</dd>`:''}</dl><h4>${lexeme.pos==='verb'?'Conjugation':lexeme.pos==='noun'?'Noun forms':'Recorded forms'}</h4>${lexeme.pos==='verb'&&tenses.length>1?`<label>Tense <select data-tense data-selected-word="${i}">${tenses.map(t=>`<option value="${esc(t)}" ${t===tense?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`:''}<table>${lexeme.paradigm?.note?`<caption class="hint">${esc(lexeme.paradigm.note)}</caption>`:''}<thead><tr><th>${lexeme.pos==='verb'?'Subject':lexeme.pos==='noun'?'Number':'Form type'}</th><th>Form</th></tr></thead><tbody>${shown.map(f=>`<tr class="${f.selected?'selected-form':''}" ${f.selected?'aria-current="true"':''}><td>${f.subject?esc(f.subject):grammarMarkup(formLabel(f))}</td><td lang="${lang}">${esc(f.text)}${f.selected?' <span class="hint">← here</span>':''}</td></tr>`).join('')}</tbody></table>`:''}`;
 };
 dialog.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeDetails();else if(e.target.closest('[data-word]'))select(Number(e.target.closest('[data-word]').dataset.word));else if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetails();}});
 dialog.addEventListener('change',e=>{if(e.target.matches('[data-tense]')){select(Number(e.target.dataset.selectedWord),e.target.value);dialog.querySelector('[data-tense]')?.focus();}});
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetails();});
 document.body.append(dialog);dialog.showModal();if(details.words.length)select(0);dialog.querySelector('[data-close]').focus();
}

export function openPronunciation(lang,chunk,anchor,pronouncer){
 closeDetails();returnFocus=anchor;
 dialog=document.createElement('dialog');dialog.className='details-overlay pronunciation-overlay';dialog.setAttribute('aria-labelledby','pronunciation-title');
 stopSpeech=()=>pronouncer.stop();pronouncer.stop();
 dialog.innerHTML=`<header class="details-header"><span class="eyebrow">Pronunciation</span><button class="plain" data-close aria-label="Close pronunciation">×</button></header><div class="pronunciation-title"><h2 id="pronunciation-title" lang="${lang}">${esc(chunk.text)}</h2><button class="overlay-speaker" data-word-audio aria-label="Listen in ${languages[lang].name}" title="Listen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></svg></button></div><p class="error" data-word-audio-error role="status"></p>${interactiveIPA(chunk.text,lang)}<div data-sounds-view>${chartMarkup(lang)}</div>`;
 dialog.querySelector('.sound-reference').open=true;
 dialog.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeDetails();else if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetails();}});
 dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetails();});
 const host=dialog,speaker=host.querySelector('[data-word-audio]');
 speaker.addEventListener('click',()=>{stopChart?.();pronouncer.speak(chunk.text,languages[lang].locale,languages[lang].name,({state,message})=>{if(!host.isConnected)return;speaker.dataset.audioState=state;host.querySelector('[data-word-audio-error]').textContent=message;});});
 document.body.append(dialog);stopChart=mountChart(dialog,()=>pronouncer.stop());dialog.showModal();dialog.querySelector('[data-close]').focus();
}
