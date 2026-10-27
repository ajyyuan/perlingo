import {exampleMarkup,sentenceAudio} from './sentence-help.js';
import {esc,mountNote} from './note-view.js';
import {tenerGroups,formGroup} from './tener-prototype.js';
const labels={yo:'I',tú:'you · informal','él / ella / usted':'he / she / formal you','nosotros / nosotras':'we','vosotros / vosotras':'you · plural, Spain','ellos / ellas / ustedes':'they / you · plural',singular:'one',plural:'more than one','masculine singular':'masculine · one','feminine singular':'feminine · one','masculine plural':'masculine · plural','feminine plural':'feminine · plural'};
export function studyRows(note){return note.forms.map(([label,lemma])=>({label:labels[label]||label,sourceLabel:label,lemma}));}
let nextNoteDialog=0;
export function mountStudyCard(root,note,concepts,{voice,speak,heading,index,reference=false}){
 note={...note,rows:studyRows(note)};
 let tense='present',removeNotes=()=>{},anchor;
 const abort=new AbortController(),signal=abort.signal;
 const say=text=>`<button class="say" data-speak="${esc(text)}" lang="es" aria-label="Listen to ${esc(text)}">${esc(text)}</button>`;
 const stop=()=>voice.stop();
const pickerGroups=['imperfect','preterite','present','future','conditional','perfect','subjunctive','commands','negative'].map(id=>tenerGroups.find(g=>g.id===id));
const tenseLabels={present:'Present',preterite:'Past',imperfect:'Past · ongoing',future:'Future',conditional:'Conditional',perfect:'Perfect',subjunctive:'Subjunctive',commands:'Do',negative:'Don’t'};
function formsContent(lesson,g){
 const rows=g?.rows||lesson.rows;
 return (g?`<p class="tense-cue">${esc(g.cue)}</p>`:'')+`<table class="forms-table"><caption ${g?'class="sr-only"':''}>${esc(g?.title||lesson.formsTitle||'Word forms')}</caption><tbody>${rows.map(r=>`<tr><th scope="row" title="${esc(r.sourceLabel)}">${esc(r.label)}</th><td>${say(r.lemma)}</td></tr>`).join('')}</tbody></table>`+(g?`<div class="tense-example"><p>${exampleMarkup({text:g.text,translation:g.translation})}${sentenceAudio(g.text)}</p><p>${esc(g.translation)}</p></div>`:'');
}
function formsPanel(lesson){
 const g=formGroup(lesson,tense);
 const selector=g?`<div class="tense-picker"><button class="tense-arrow" data-tense-step="-1" aria-label="Previous tense" aria-keyshortcuts="[" title="Previous tense ([)" ${g.id===pickerGroups[0].id?'disabled':''}>‹</button><div class="tense-rail" role="radiogroup" aria-label="Tense or mood">${pickerGroups.map(t=>`<button role="radio" aria-checked="${t.id===g.id}" tabindex="${t.id===g.id?0:-1}" data-tense="${t.id}" aria-label="${esc(t.title)}" title="${esc(t.title)}">${esc(tenseLabels[t.id])}</button>`).join('')}</div><button class="tense-arrow" data-tense-step="1" aria-label="Next tense" aria-keyshortcuts="]" title="Next tense (])" ${g.id===pickerGroups.at(-1).id?'disabled':''}>›</button></div>`:'';
 return selector+`<div id="tense-content">${formsContent(lesson,g)}</div>`;
}
function centerTense(smooth=false){
 const rail=root.querySelector('.tense-rail'),selected=rail?.querySelector('[aria-checked="true"]');
 if(selected)rail.scrollTo({left:selected.offsetLeft-(rail.clientWidth-selected.offsetWidth)/2,behavior:smooth&&!matchMedia('(prefers-reduced-motion: reduce)').matches?'smooth':'instant'});
}
function chooseTense(id){
 const g=formGroup(note,id);if(!g)return;
 stop();tense=g.id;
 root.querySelectorAll('[data-tense]').forEach(b=>{const selected=b.dataset.tense===tense;b.setAttribute('aria-checked',String(selected));b.tabIndex=selected?0:-1;});
 root.querySelector('[data-tense-step="-1"]').disabled=tense===pickerGroups[0].id;
 root.querySelector('[data-tense-step="1"]').disabled=tense===pickerGroups.at(-1).id;
 root.querySelector('#tense-content').innerHTML=formsContent(note,g);
 root.querySelector(`[data-tense="${tense}"]`).focus({preventScroll:true});centerTense(true);
}
root.addEventListener('keydown',e=>{
 if(e.isComposing||e.repeat||!e.target.matches('[data-tense]')||e.altKey||e.ctrlKey||e.metaKey)return;
 let i=pickerGroups.findIndex(t=>t.id===tense);
 if(['ArrowRight','ArrowDown'].includes(e.key))i=Math.min(i+1,pickerGroups.length-1);
 else if(['ArrowLeft','ArrowUp'].includes(e.key))i=Math.max(0,i-1);
 else if(e.key==='Home')i=0;else if(e.key==='End')i=pickerGroups.length-1;else return;
 e.preventDefault();e.stopPropagation();chooseTense(pickerGroups[i].id);
},{signal});

 const hasForms=note.rows.length>0;
 root.innerHTML=`<section class="course-study ${hasForms?'':'no-form-table'}">${heading}<div class="lesson-columns" tabindex="0" role="group" aria-label="Word details"><div class="lesson-summary"><div class="word-overview"><h1 lang="es">${say(note.word)}</h1><p class="word-type">${esc(note.label)} <span class="course-rank" aria-label="Word ${note.rank} of 1500">#${note.rank}</span></p><p class="meaning-main">${esc(note.meaning)}</p></div><section class="lesson-uses" aria-label="Uses"><h2>Uses</h2><p class="use-pattern">${esc(note.pattern)}</p>${note.examples.map(e=>`<div class="use-example"><p>${exampleMarkup(e)}${sentenceAudio(e.text)}</p><p class="use-translation">${esc(e.translation)}</p></div>`).join('')}<p class="use-tip">${esc(note.tip)}</p></section></div>${hasForms?`<section class="lesson-forms" aria-label="Forms"><h2>Forms</h2>${formsPanel(note)}</section>`:''}</div><p id="audio-status" role="status"></p><div class="lesson-footer"><button class="plain" data-action="notes">Full notes</button>${reference?'':`<div class="lesson-steps"><button class="plain" data-action="previous" aria-label="Previous learning card" ${index===0?'disabled':''}>←</button><button class="primary" data-action="forward">${index===9?'Check these 10':'Next word'} →</button></div>`}</div></section>`;
 const dialog=document.createElement('dialog');dialog.className='study-notes-dialog';dialog.id=`study-notes-${++nextNoteDialog}`;dialog.setAttribute('aria-label','Full word notes');
 dialog.innerHTML='<button class="plain notes-close" aria-label="Close full notes">×</button><div class="study-note-content"></div>';document.body.append(dialog);
 function openNotes(){anchor=document.activeElement;stop();removeNotes();removeNotes=mountNote(dialog.querySelector('.study-note-content'),note,concepts,{voice,heading:true,overlayRoot:dialog});dialog.showModal();dialog.scrollTop=0;}
 dialog.querySelector('.notes-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{removeNotes();removeNotes=()=>{};anchor?.isConnected&&anchor.focus();},{signal});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();},{signal});
 root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tense){chooseTense(b.dataset.tense);}else if(b.dataset.tenseStep){const i=pickerGroups.findIndex(t=>t.id===tense)+Number(b.dataset.tenseStep);if(pickerGroups[i])chooseTense(pickerGroups[i].id);}},{signal});
 document.addEventListener('keydown',e=>{
  if(e.isComposing||e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||document.querySelector('dialog[open]')||e.target.closest('input,textarea,select,[contenteditable=true]'))return;
  if(!['[',']'].includes(e.key)||!root.querySelector('.tense-rail'))return;
  e.preventDefault();e.stopPropagation();const i=pickerGroups.findIndex(t=>t.id===tense)+(e.key===']'?1:-1);if(pickerGroups[i])chooseTense(pickerGroups[i].id);
 },{signal,capture:true});
 centerTense();
 return {openNotes,destroy(){abort.abort();removeNotes();dialog.remove();stop();}};
}
