import {exampleMarkup,sentenceAudio} from './sentence-help.js';
import {esc,mountNote} from './note-view.js';
import {mountForms} from './forms-view.js';
const labels={yo:'I',tú:'you · informal','él / ella / usted':'he / she / formal you','nosotros / nosotras':'we','vosotros / vosotras':'you · plural, Spain','ellos / ellas / ustedes':'they / you · plural',singular:'one',plural:'more than one','masculine singular':'masculine · one','feminine singular':'feminine · one','masculine plural':'masculine · plural','feminine plural':'feminine · plural'};
export function studyRows(note){return note.forms.map(([label,lemma])=>({label:labels[label]||label,sourceLabel:label,lemma}));}
let nextNoteDialog=0;
export function mountStudyCard(root,note,concepts,{voice,speak,heading,index,reference=false}){
 note={...note,rows:studyRows(note)};
 let removeNotes=()=>{},anchor;
 const abort=new AbortController(),signal=abort.signal;
 const say=text=>`<button class="say" data-speak="${esc(text)}" lang="es" aria-label="Listen to ${esc(text)}">${esc(text)}</button>`;
 const stop=()=>voice.stop();

 const hasForms=note.rows.length>0;
 root.innerHTML=`<section class="course-study ${hasForms?'':'no-form-table'}">${heading}<div class="lesson-columns" tabindex="0" role="group" aria-label="Word details"><div class="lesson-summary"><div class="word-overview"><h1 lang="es">${say(note.word)}</h1><p class="word-type">${esc(note.label)} <span class="course-rank" aria-label="Word ${note.rank} of 1500">#${note.rank}</span></p><p class="meaning-main">${esc(note.meaning)}</p></div><section class="lesson-uses" aria-label="Uses"><h2>Uses</h2><p class="use-pattern">${esc(note.pattern)}</p>${note.examples.map(e=>`<div class="use-example"><p>${exampleMarkup(e)}${sentenceAudio(e.text)}</p><p class="use-translation">${esc(e.translation)}</p></div>`).join('')}<p class="use-tip">${esc(note.tip)}</p></section></div>${hasForms?`<section class="lesson-forms" aria-label="Forms"><h2>Forms</h2><div class="shared-forms"></div></section>`:''}</div><p id="audio-status" role="status"></p><div class="lesson-footer"><button class="plain" data-action="notes">More info</button>${reference?'':`<div class="lesson-steps"><button class="plain" data-action="previous" aria-label="Previous learning card" ${index===0?'disabled':''}>←</button><button class="primary" data-action="forward">${index===9?'Check these 10':'Next word'} →</button></div>`}</div></section>`;
 const dialog=document.createElement('dialog');dialog.className='study-notes-dialog';dialog.id=`study-notes-${++nextNoteDialog}`;dialog.setAttribute('aria-label','More word information');
 dialog.innerHTML='<button class="plain notes-close" aria-label="Close more info">×</button><div class="study-note-content"></div>';document.body.append(dialog);
 function openNotes(){anchor=document.activeElement;stop();removeNotes();removeNotes=mountNote(dialog.querySelector('.study-note-content'),note,concepts,{voice,heading:true,supplemental:true,overlayRoot:dialog});dialog.showModal();dialog.scrollTop=0;}
 dialog.querySelector('.notes-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{removeNotes();removeNotes=()=>{};anchor?.isConnected&&anchor.focus();},{signal});
 dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();},{signal});
 function showTenseExample(group){
  const uses=root.querySelector('.lesson-uses');
  uses.innerHTML='<h2>Uses</h2>'+(group.text?`<div class="use-example"><p>${exampleMarkup(group)}${sentenceAudio(group.text)}</p><p class="use-translation">${esc(group.translation)}</p></div>`:`<p class="use-tip">${esc(group.notice||group.exampleNotice||'')}</p>`);
 }
 const removeForms=hasForms?mountForms(root.querySelector('.shared-forms'),note,{voice,onExample:showTenseExample,cardNavigation:!reference}):()=>{};
 return {openNotes,destroy(){abort.abort();removeForms();removeNotes();dialog.remove();stop();}};
}
