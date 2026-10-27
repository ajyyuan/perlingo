import {exampleMarkup,sentenceAudio} from './sentence-help.js';
import {esc} from './html.js';
export {esc} from './html.js';
// One renderer/controller for the standalone preview and revealed study cards.
export function chunkMarkup(c,e,j){
 const [,opening,text,punctuation]=c.text.match(/^([¿¡]*)(.*?)([,;:!?]*)$/u);
 return `${esc(opening)}<button class="chunk" data-example="${e}" data-chunk="${j}" aria-expanded="false" aria-controls="chunk-help">${esc(text)}</button>${esc(punctuation)}`;
}
export function mountNote(host,n,concepts,{voice,storageKey='perlingo-word-notes-v1',heading=false,overlayRoot=document.body}={}){
 const controller=new AbortController(),options={signal:controller.signal};
 const id=n.id||n.word;
 let anchor=null,modalAnchor=null,saved={};
 const overlays=document.createElement('div');
 overlays.innerHTML='<div id="chunk-help" popover="auto" role="dialog" aria-label="Example explanation"></div><dialog id="grammar" aria-labelledby="grammar-title"><button class="close" aria-label="Close grammar explanation">×</button><p class="eyebrow">A closer look</p><h2 id="grammar-title"></h2><p id="grammar-context" lang="es"></p><p id="grammar-translation"></p><p id="grammar-text"></p></dialog>';
 overlayRoot.append(overlays);
 const popup=overlays.querySelector('#chunk-help'),dialog=overlays.querySelector('#grammar');
 let loadError='';
 try{const value=JSON.parse(localStorage.getItem(storageKey));if(value&&typeof value==='object'&&!Array.isArray(value))saved=value;}catch{loadError='Personal notes cannot be loaded in this browser.';}
 host.classList.add('word-note');
 host.innerHTML=`${heading?`<div class="word-heading"><div><p class="word-label">${esc(n.label)}</p><h1 lang="es">${esc(n.word)}</h1></div><button class="speaker" data-speak="${esc(n.word)}" aria-label="Listen to ${esc(n.word)}">♫</button></div>`:''}<p class="meaning">${esc(n.meaning)}</p><div class="concepts">${n.tags.map(k=>`<button data-concept="${esc(k)}">${esc(concepts[k].title)}</button>`).join('')}</div><div class="usage"><p>${esc(n.pattern)}</p><small>${esc(n.tip)}</small></div>${n.examples.length?`<div class="examples">${n.examples.map((x,e)=>`<div class="example"><div class="example-line"><p lang="es">${exampleMarkup(x,{grammar:true})}</p>${sentenceAudio(x.text)}</div><p class="translation">${esc(x.translation)}</p></div>`).join('')}</div>`:''}<p class="note-audio" role="status"></p>${n.forms.length?`<details class="more"><summary>${esc(n.formsTitle||(n.word==='haber'?'Auxiliary present forms':n.label==='verb'?'Present-tense forms':'Word forms'))}</summary><table><caption class="sr-only">${esc(n.word)} forms</caption><tbody>${n.forms.map(([label,form])=>`<tr><th scope="row">${esc(label)}</th><td><button data-speak="${esc(form)}" lang="es" aria-label="Listen to ${esc(form)}">${esc(form)}</button></td></tr>`).join('')}</tbody></table>${n.label==='verb'?'<small>Vosotros is mainly used in Spain; ustedes takes the third-person plural form. Voseo forms are not shown.</small>':''}</details>`:''}<details class="more"><summary>More about this word</summary>${n.more?`<p>${esc(n.more)}</p>`:''}<a href="https://en.wiktionary.org/wiki/${encodeURIComponent(n.source)}#Spanish" target="_blank" rel="noopener">Wiktionary · full entry ↗</a></details><details class="more"><summary>My note</summary><label class="sr-only" for="personal-note">Your note about ${esc(n.word)}</label><textarea id="personal-note" maxlength="4000" placeholder="An association, a phrase, something to remember…">${esc(typeof saved[id]==='string'?saved[id]:'')}</textarea><small>Saved in this browser.</small></details><p class="note-storage" role="status">${esc(loadError)}</p>`;
 const status=host.querySelector('.note-storage');
 host.querySelector('textarea').addEventListener('input',e=>{
  saved[id]=e.target.value;
  try{const latest=JSON.parse(localStorage.getItem(storageKey));if(latest&&typeof latest==='object'&&!Array.isArray(latest))saved={...latest,[id]:e.target.value};localStorage.setItem(storageKey,JSON.stringify(saved));status.textContent='';}
  catch{status.textContent='Your note could not be saved. Keep this tab open to retain it.';}
 },options);
 function speak(text){voice?.speak(text,'es-ES','Spanish',({message})=>{const status=host.querySelector('.note-audio');if(status)status.textContent=message||'';});}
 function closePopup(){if(popup.matches(':popover-open'))popup.hidePopover();anchor?.setAttribute('aria-expanded','false');}
 function grammar(key,context,translation,trigger){
  closePopup();modalAnchor=trigger;
  for(const [selector,text] of Object.entries({'#grammar-title':concepts[key].title,'#grammar-text':concepts[key].text,'#grammar-context':context,'#grammar-translation':translation}))dialog.querySelector(selector).textContent=text;
  const example=n.examples.find(x=>x.text===context);
  if(example)dialog.querySelector('#grammar-context').innerHTML=exampleMarkup(example)+sentenceAudio(example.text);
  dialog.showModal();
 }
 popup.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closePopup();anchor?.focus();}},options);
 popup.addEventListener('toggle',e=>{if(e.newState==='closed')anchor?.setAttribute('aria-expanded','false');},options);
 dialog.addEventListener('close',()=>{voice?.stop();if(modalAnchor?.isConnected)modalAnchor.focus();},options);
 dialog.querySelector('.close').addEventListener('click',()=>dialog.close(),options);
 dialog.addEventListener('click',e=>{const audio=e.target.closest('[data-speak]');if(audio)speak(audio.dataset.speak);if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}},options);
 host.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  // Do not let the study controller handle this pronunciation a second time.
  e.stopPropagation();
  if(b.dataset.speak){speak(b.dataset.speak);return;}
  if(b.dataset.concept){const example=n.examples.find(x=>x.chunks.some(c=>c.concept===b.dataset.concept))||n.examples[0]||{text:n.word,translation:n.meaning};grammar(b.dataset.concept,example.text,example.translation,b);return;}
  if(b.dataset.sentenceConcept){grammar(b.dataset.sentenceConcept,b.dataset.sentence,b.dataset.translation,b);return;}

 },options);
 window.addEventListener('resize',closePopup,options);window.addEventListener('scroll',closePopup,{...options,passive:true});
 return ()=>{voice?.stop();controller.abort();if(dialog.open)dialog.close();closePopup();overlays.remove();};
}
// Keep grading shortcuts inactive while the user reads, edits, or operates notes.
export function notesOwnKeyboard(target,overlayOpen){return overlayOpen||Boolean(target.closest('.word-note, #chunk-help, #grammar, input, textarea, select, a, summary'));}
