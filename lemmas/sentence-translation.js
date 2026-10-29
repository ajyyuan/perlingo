import {esc} from './html.js';

// Shared across cards and lookup overlays for this page visit.
let shown=true;
const listeners=new Set();
function translationIcon(){
 return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>${shown?'':'<path d="m3 3 18 18"/>'}</svg>`;
}
function translationButton(){
 return `<button type="button" class="translation-toggle" data-translation-toggle aria-expanded="${shown}" aria-keyshortcuts="T" aria-label="${shown?'Hide':'Show'} translation" title="${shown?'Hide':'Show'} translation (T)">${translationIcon()}</button>`;
}
export function translationMarkup(text){
 return `<div class="translation-row"><div class="sentence-translation" data-shown="${shown}" aria-hidden="${!shown}"><p class="use-translation">${esc(text)}</p></div>${translationButton()}</div>`;
}
export function translationKeyAllowed(e,{active=true,editing=false}={}){
 return active&&!editing&&!e.defaultPrevented&&!e.isComposing&&!e.repeat&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&e.key.toLowerCase()==='t';
}
export function bindTranslationToggle(root){
 const abort=new AbortController(),signal=abort.signal;
 function update(){
  root.querySelectorAll('[data-translation-toggle]').forEach(b=>{b.setAttribute('aria-expanded',String(shown));b.innerHTML=translationIcon();b.setAttribute('aria-label',`${shown?'Hide':'Show'} translation`);b.title=`${shown?'Hide':'Show'} translation (T)`;});
  root.querySelectorAll('.sentence-translation').forEach(el=>{el.dataset.shown=String(shown);el.setAttribute('aria-hidden',String(!shown));});
 }
 function toggle(){shown=!shown;listeners.forEach(update=>update());}
 listeners.add(update);
 root.addEventListener('click',e=>{if(e.target.closest('[data-translation-toggle]'))toggle();},{signal});
 document.addEventListener('keydown',e=>{
  const owner=root.closest('dialog'),dialogs=document.querySelectorAll('dialog[open]');
  const active=dialogs.length?Boolean(owner)&&e.target.closest('dialog[open]')===owner:!owner;
  const editing=Boolean(e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])'));
  if(!root.querySelector('[data-translation-toggle]')||document.querySelector('#chunk-help:popover-open'))return;
  if(translationKeyAllowed(e,{active,editing})){e.preventDefault();toggle();}
 },{signal});
 return ()=>{abort.abort();listeners.delete(update);};
}
