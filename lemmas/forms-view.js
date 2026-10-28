import {exampleMarkup,sentenceAudio} from './sentence-help.js';
import {esc} from './html.js';
import {formGroups,formGroup,tenseLabels} from './verb-forms.js';
export function tenseKeysAllowed(event,{active=true,editing=false}={}){
 return active&&!editing&&!event.defaultPrevented&&!event.isComposing&&!event.repeat&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&['[',']'].includes(event.key);
}
export function mountForms(host,note,{voice,onExample,cardNavigation=false}={}){
 let tense='present';const abort=new AbortController(),signal=abort.signal;
 const say=text=>`<button class="say" data-speak="${esc(text)}" lang="es" aria-label="Listen to ${esc(text)}">${esc(text)}</button>`;
const pickerGroups=formGroups(note);
function formsContent(lesson,g){
 const rows=g?.rows||lesson.rows;
 if(g?.notice)return `<p class="tense-cue">${esc(g.notice)}</p>`;
 return (g?`<p class="tense-cue">${esc(g.cue)}</p>`:'')+`<table class="forms-table"><caption ${g?'class="sr-only"':''}>${esc(g?.title||lesson.formsTitle||'Word forms')}</caption><tbody>${rows.map(r=>`<tr><th scope="row" title="${esc(r.sourceLabel)}">${esc(r.label)}</th><td>${(r.alternatives||[r.lemma]).map(say).join(' <span class="form-alternative">/</span> ')}</td></tr>`).join('')}</tbody></table>`+(!onExample&&g?.text?`<div class="tense-example"><p>${exampleMarkup(g)}${sentenceAudio(g.text)}</p><p>${esc(g.translation)}</p></div>`:!onExample&&g?.exampleNotice?`<p class="tense-cue">${esc(g.exampleNotice)}</p>`:'');
}
function formsPanel(lesson){
 const g=formGroup(lesson,tense);
 const selector=g?`<div class="tense-picker"><button class="tense-arrow" data-tense-step="-1" aria-label="Previous tense" aria-keyshortcuts="[" title="Previous tense ([)" ${g.id===pickerGroups[0].id?'disabled':''}>‹</button><div class="tense-rail" role="radiogroup" aria-label="Tense or mood">${pickerGroups.map(t=>`<button role="radio" aria-checked="${t.id===g.id}" tabindex="${t.id===g.id?0:-1}" data-tense="${t.id}" aria-label="${esc(t.title)}" title="${esc(t.title)}">${esc(tenseLabels[t.id])}</button>`).join('')}</div><button class="tense-arrow" data-tense-step="1" aria-label="Next tense" aria-keyshortcuts="]" title="Next tense (])" ${g.id===pickerGroups.at(-1).id?'disabled':''}>›</button></div>`:'';
 return selector+`<div data-tense-content>${formsContent(lesson,g)}</div>`;
}
function centerTense(smooth=false){
 const rail=host.querySelector('.tense-rail'),selected=rail?.querySelector('[aria-checked="true"]');
 if(selected)rail.scrollTo({left:selected.offsetLeft-(rail.clientWidth-selected.offsetWidth)/2,behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});
}
function chooseTense(id,{focus=false}={}){
 const g=formGroup(note,id);if(!g)return;
 voice?.stop();tense=g.id;onExample?.(g);
 host.querySelectorAll('[data-tense]').forEach(b=>{const selected=b.dataset.tense===tense;b.setAttribute('aria-checked',String(selected));b.tabIndex=selected?0:-1;});
 host.querySelector('[data-tense-step="-1"]').disabled=tense===pickerGroups[0].id;
 host.querySelector('[data-tense-step="1"]').disabled=tense===pickerGroups.at(-1).id;
 host.querySelector('[data-tense-content]').innerHTML=formsContent(note,g);
 if(focus)host.querySelector(`[data-tense="${tense}"]`).focus({preventScroll:true});centerTense(true);
}
host.addEventListener('keydown',e=>{
 if(cardNavigation||e.isComposing||e.repeat||!e.target.matches('[data-tense]')||e.altKey||e.ctrlKey||e.metaKey)return;
 let i=pickerGroups.findIndex(t=>t.id===tense);
 if(['ArrowRight','ArrowDown'].includes(e.key))i=Math.min(i+1,pickerGroups.length-1);
 else if(['ArrowLeft','ArrowUp'].includes(e.key))i=Math.max(0,i-1);
 else if(e.key==='Home')i=0;else if(e.key==='End')i=pickerGroups.length-1;else return;
 e.preventDefault();e.stopPropagation();chooseTense(pickerGroups[i].id,{focus:true});
},{signal});

 host.innerHTML=formsPanel(note);
 if(pickerGroups.length)onExample?.(formGroup(note,tense));
 document.addEventListener('keydown',e=>{
  const dialogs=[...document.querySelectorAll('dialog[open]')];
  const owner=host.closest('dialog');
  const active=dialogs.length?e.target.closest('dialog[open]')===owner&&Boolean(owner):!owner;
  if(!tenseKeysAllowed(e,{active,editing:Boolean(e.target.closest('input,textarea,select,[contenteditable=true]'))})||!pickerGroups.length)return;
  e.preventDefault();e.stopPropagation();const i=pickerGroups.findIndex(t=>t.id===tense)+(e.key===']'?1:-1);if(pickerGroups[i])chooseTense(pickerGroups[i].id);
 },{signal,capture:true});
 host.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tense)chooseTense(b.dataset.tense);else if(b.dataset.tenseStep){const i=pickerGroups.findIndex(t=>t.id===tense)+Number(b.dataset.tenseStep);if(pickerGroups[i])chooseTense(pickerGroups[i].id);}},{signal});
 const observer=new ResizeObserver(()=>centerTense());observer.observe(host);
 centerTense();return ()=>{abort.abort();observer.disconnect();};
}
