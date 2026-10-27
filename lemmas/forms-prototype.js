import {exampleMarkup,sentenceAudio} from './sentence-help.js';
import {bindCardPreview} from './card-preview.js';
import {tenerGroups,formGroup} from './tener-prototype.js';
import {loadNotes} from './notes-library.js';
import {esc,mountNote} from './note-view.js';
import {prototypeLessons,freshPrototype,advanceLesson,restorePrototype} from './forms-prototype-model.js';
import {createLemmaVoice} from './pronunciation.js';
const root=document.querySelector('#prototype'),storageKey='perlingo-forms-prototype-v2';
const voice=createLemmaVoice();
let lessons,state,concepts,tense='present',unmountNote=()=>{},notesAnchor;
const notesDialog=document.querySelector('#full-notes');
function openNotes(){stop();notesAnchor=document.activeElement;unmountNote();unmountNote=mountNote(document.querySelector('#full-note-content'),lessons[state.index],concepts,{voice,heading:true,overlayRoot:notesDialog});notesDialog.showModal();notesDialog.scrollTop=0;}
notesDialog.querySelector('.notes-close').onclick=()=>notesDialog.close();
notesDialog.addEventListener('close',()=>{unmountNote();unmountNote=()=>{};notesAnchor?.focus();});
notesDialog.addEventListener('click',e=>{if(e.target!==notesDialog)return;const r=notesDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)notesDialog.close();});
function save(){try{sessionStorage.setItem(storageKey,JSON.stringify(state));}catch{document.querySelector('#save-error').textContent='This preview cannot save progress in this tab.';}}
function stop(){voice.stop();}
function speak(text){stop();voice.speak(text,'es-ES','Spanish',({message})=>{const el=root.querySelector('.prototype-audio');if(el)el.textContent=message||'';});}
const say=text=>`<button class="say" data-say="${esc(text)}" lang="es" aria-label="Listen to ${esc(text)}">${esc(text)}</button>`;
const next=(action,text)=>`<button class="primary next" data-action="${action}">${text} →</button>`;
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
 const g=formGroup(lessons[state.index],id);if(!g)return;
 stop();tense=g.id;
 root.querySelectorAll('[data-tense]').forEach(b=>{const selected=b.dataset.tense===tense;b.setAttribute('aria-checked',String(selected));b.tabIndex=selected?0:-1;});
 root.querySelector('[data-tense-step="-1"]').disabled=tense===pickerGroups[0].id;
 root.querySelector('[data-tense-step="1"]').disabled=tense===pickerGroups.at(-1).id;
 root.querySelector('#tense-content').innerHTML=formsContent(lessons[state.index],g);
 root.querySelector(`[data-tense="${tense}"]`).focus({preventScroll:true});centerTense(true);
}
root.addEventListener('keydown',e=>{
 if(!e.target.matches('[data-tense]')||e.altKey||e.ctrlKey||e.metaKey)return;
 let i=pickerGroups.findIndex(t=>t.id===tense);
 if(['ArrowRight','ArrowDown'].includes(e.key))i=Math.min(i+1,pickerGroups.length-1);
 else if(['ArrowLeft','ArrowUp'].includes(e.key))i=Math.max(0,i-1);
 else if(e.key==='Home')i=0;else if(e.key==='End')i=pickerGroups.length-1;else return;
 e.preventDefault();e.stopPropagation();chooseTense(pickerGroups[i].id);
});
function render(){
 stop();
 if(state.phase==='learn'){
  const l=lessons[state.index];
  root.innerHTML=`<section class="form-card learning-card"><div class="card-meta"><span class="phase">Learn</span><span>${state.index+1} / ${lessons.length}</span></div><div class="lesson-columns" tabindex="0" role="group" aria-label="Word details"><div class="lesson-summary"><div class="word-overview"><h1 id="lesson-title" tabindex="-1" lang="es">${esc(l.word)}</h1><p class="word-type">${esc(l.label)}</p><p class="meaning-main">${esc(l.meaning)}</p></div><section class="lesson-uses" aria-labelledby="uses-heading"><h2 id="uses-heading">Uses</h2><p class="use-pattern">${esc(l.pattern)}</p>${l.examples.map(e=>`<div class="use-example"><p lang="es">${exampleMarkup(e)}${sentenceAudio(e.text)}</p><p class="use-translation">${esc(e.translation)}</p></div>`).join('')}<p class="use-tip">${esc(l.tip)}</p></section></div><section class="lesson-forms" aria-labelledby="forms-heading"><h2 id="forms-heading">Forms</h2>${formsPanel(l)}</section></div><p class="prototype-audio" role="status"></p><div class="lesson-footer"><button class="quiet full-notes-link" data-action="notes">Full notes</button><div class="lesson-steps">${state.index?'<button class="quiet" data-action="back" aria-label="Previous word">←</button>':''}${next('next',state.index===lessons.length-1?'Back to course':'Next word')}</div></div></section>`;
  root.querySelector('#lesson-title').focus();centerTense();window.scrollTo(0,0);return;
 }
}
function act(action){
 if(action==='notes'&&state.phase==='learn'){openNotes();return;}
 if(action==='restart'){state=freshPrototype();tense='present';save();render();return;}
 if(action==='next'&&state.phase==='learn'){if(state.index===lessons.length-1){stop();location.assign('/lemmas/');return;}state=advanceLesson(state,lessons);}
 else if(action==='back'&&state.phase==='learn')state={...state,index:Math.max(0,state.index-1)};
 else return;
 save();render();
}
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tense){chooseTense(b.dataset.tense);}else if(b.dataset.tenseStep){const i=pickerGroups.findIndex(t=>t.id===tense)+Number(b.dataset.tenseStep);if(pickerGroups[i])chooseTense(pickerGroups[i].id);}else if(b.dataset.speak)speak(b.dataset.speak);else if(b.dataset.say)speak(b.dataset.say);else if(b.dataset.action)act(b.dataset.action);});
document.querySelector('#restart').onclick=()=>act('restart');
document.addEventListener('keydown',e=>{
 if(e.repeat&&['Enter',' '].includes(e.key)&&e.target.closest('button,input,summary')){e.preventDefault();return;}
 if(!state||e.isComposing||e.repeat||document.querySelector('dialog[open]'))return;
 // Brackets select a form group without interfering with typing or dialogs.
 if(state.phase==='learn'&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&['[',']'].includes(e.key)&&!e.target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]')&&root.querySelector('.tense-rail')){
  e.preventDefault();
  const i=pickerGroups.findIndex(t=>t.id===tense)+(e.key===']'?1:-1);
  if(pickerGroups[i])chooseTense(pickerGroups[i].id);
  return;
 }
 if(e.target.matches('.lesson-columns')&&['ArrowUp','ArrowDown','PageUp','PageDown','Home','End'].includes(e.key))return;
 if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.target.closest('input,textarea,select,option,details,a'))return;
 if(state.phase==='learn'&&['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();act(['ArrowLeft','ArrowUp'].includes(e.key)?'back':'next');}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);
try{const library=await loadNotes();concepts=library.concepts;bindCardPreview({notes:library.notes,concepts,voice});lessons=prototypeLessons(library.notes,library.concepts);let raw;try{raw=JSON.parse(sessionStorage.getItem(storageKey));}catch{}state=restorePrototype(raw,lessons);render();}catch(error){root.textContent='The prototype could not load. Please reload.';console.error(error);}
