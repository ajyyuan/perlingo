import {notes,concepts} from './notes-data.js';
import {createPronouncer} from '/src/speech.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const host=document.querySelector('#note'),nav=document.querySelector('#words'),popup=document.querySelector('#chunk-help'),dialog=document.querySelector('#grammar');
const voice=createPronouncer(window.speechSynthesis,window.SpeechSynthesisUtterance);
let index=Math.max(0,notes.findIndex(n=>n.word===decodeURIComponent(location.hash.slice(1)))),anchor=null,modalAnchor=null;
const storageKey='perlingo-word-notes-pilot-v1';let saved={};
try{const value=JSON.parse(localStorage.getItem(storageKey));if(value&&typeof value==='object'&&!Array.isArray(value))saved=value;}catch{document.querySelector('#storage-status').textContent='Personal notes cannot be loaded in this browser.';}
function speak(text){voice.speak(text,'es-ES','Spanish',({message})=>{const status=document.querySelector('#audio-status');if(status)status.textContent=message||'';});}
function closePopup(){if(popup.matches(':popover-open'))popup.hidePopover();anchor?.setAttribute('aria-expanded','false');}
popup.addEventListener('toggle',e=>{if(e.newState==='closed')anchor?.setAttribute('aria-expanded','false');});
function grammar(key,context,translation,trigger){
 closePopup();modalAnchor=trigger;document.querySelector('#grammar-title').textContent=concepts[key].title;document.querySelector('#grammar-text').textContent=concepts[key].text;document.querySelector('#grammar-context').textContent=context;document.querySelector('#grammar-translation').textContent=translation;dialog.showModal();
}
dialog.addEventListener('close',()=>{voice.stop();if(modalAnchor?.isConnected)modalAnchor.focus();});
document.querySelector('#close-grammar').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
function render(){
 closePopup();voice.stop();const n=notes[index];
 document.querySelector('#position').textContent=`${index+1} / ${notes.length}`;
 nav.innerHTML=notes.map((x,i)=>`<button data-word="${i}" aria-pressed="${i===index}" lang="es">${esc(x.word)}</button>`).join('');
 host.innerHTML=`<div class="word-heading"><div><p class="word-label">${esc(n.label)}</p><h1 lang="es">${esc(n.word)}</h1></div><button class="speaker" data-speak="${esc(n.word)}" aria-label="Listen to ${esc(n.word)}">♫</button></div><p class="meaning">${esc(n.meaning)}</p><div class="concepts">${n.tags.map(k=>`<button data-concept="${k}">${esc(concepts[k].title)}</button>`).join('')}</div><div class="usage"><p>${esc(n.pattern)}</p><small>${esc(n.tip)}</small></div><div class="examples">${n.examples.map((x,e)=>`<div class="example"><div class="example-line"><p lang="es">${x.chunks.map((c,j)=>`<button class="chunk" data-example="${e}" data-chunk="${j}" aria-expanded="false" aria-controls="chunk-help">${esc(c.text)}</button>`).join(' ')}.</p><button class="example-speak" data-speak="${esc(x.text)}" aria-label="Listen to ${esc(x.text)}">♫</button></div><p class="translation">${esc(x.translation)}</p></div>`).join('')}</div><p id="audio-status" role="status"></p>${n.forms.length?`<details class="more"><summary>${n.label==='verb'?'Present-tense forms':'Word forms'}</summary><table><caption class="sr-only">${esc(n.word)} forms</caption><tbody>${n.forms.map(([label,form])=>`<tr><th scope="row">${esc(label)}</th><td><button data-speak="${esc(form)}" lang="es" aria-label="Listen to ${esc(form)}">${esc(form)}</button></td></tr>`).join('')}</tbody></table></details>`:''}<details class="more"><summary>More about this word</summary><p>${esc(n.more)}</p><a href="https://en.wiktionary.org/wiki/${encodeURIComponent(n.source)}#Spanish" target="_blank" rel="noopener">Wiktionary · full entry ↗</a></details><details class="more"><summary>My note</summary><label class="sr-only" for="personal-note">Your note about ${esc(n.word)}</label><textarea id="personal-note" maxlength="4000" placeholder="An association, a phrase, something to remember…">${esc(typeof saved[n.word]==='string'?saved[n.word]:'')}</textarea><small>Saved in this browser.</small></details>`;
 document.querySelector('#personal-note').addEventListener('input',e=>{saved[n.word]=e.target.value;try{localStorage.setItem(storageKey,JSON.stringify(saved));document.querySelector('#storage-status').textContent='';}catch{document.querySelector('#storage-status').textContent='Your note could not be saved. Keep this tab open to retain it.';}});
}
nav.addEventListener('click',e=>{const b=e.target.closest('[data-word]');if(!b)return;index=Number(b.dataset.word);history.replaceState(null,'',`#${encodeURIComponent(notes[index].word)}`);render();nav.querySelector('[aria-pressed=true]').focus();});
host.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;const n=notes[index];
 if(b.dataset.speak){speak(b.dataset.speak);return;}
 if(b.dataset.concept){grammar(b.dataset.concept,n.word,n.meaning,b);return;}
 if(b.dataset.chunk!==undefined){
  if(anchor===b&&popup.matches(':popover-open')){closePopup();return;}
  closePopup();anchor=b;const ex=n.examples[Number(b.dataset.example)],c=ex.chunks[Number(b.dataset.chunk)];
  popup.innerHTML=`<p class="chunk-meaning">${esc(c.meaning)}</p><button class="grammar-link">${esc(concepts[c.concept].title)} →</button>`;
  popup.querySelector('button').onclick=()=>grammar(c.concept,ex.text,ex.translation,b);
  popup.showPopover();b.setAttribute('aria-expanded','true');const r=b.getBoundingClientRect(),p=popup.getBoundingClientRect();
  popup.style.left=`${Math.max(12,Math.min(r.left,innerWidth-p.width-12))}px`;popup.style.top=`${r.bottom+p.height+20<innerHeight?r.bottom+8:Math.max(12,r.top-p.height-8)}px`;speak(c.text);
 }
});
window.addEventListener('resize',closePopup);window.addEventListener('scroll',closePopup,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)voice.stop();});window.addEventListener('pagehide',()=>voice.stop());
render();
