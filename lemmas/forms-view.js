import {mountVerbAccordion} from './verb-accordion.js';
import {exampleMarkup,sentenceAudio} from './sentence-help.js';
import {openVerbGuide} from './verb-guide-view.js';
import {esc} from './html.js';
import {rowExample,sessionSelection,selectedRow,selectExampleRow} from './row-examples.js';
import {formGroups,formGroup} from './verb-forms.js';
function formKeysAllowed(event,{active=true,editing=false}={},keys){
 return active&&!editing&&!event.defaultPrevented&&!event.isComposing&&!event.repeat&&!event.altKey&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&keys.includes(event.key);
}
export const tenseKeysAllowed=(event,state)=>formKeysAllowed(event,state,['-','=']);
export const rowKeysAllowed=(event,state)=>formKeysAllowed(event,state,['[',']']);
export function mountForms(host,note,{voice,onExample,cardNavigation=false,showHeading=false}={}){
 if(formGroups(note).length)return mountVerbAccordion(host,note,{voice,showHeading,onExample});
 let tense=sessionSelection(note.id).tense,alternative=sessionSelection(note.id).alternative||0;const abort=new AbortController(),signal=abort.signal;
 const say=text=>`<button class="say" data-speak="${esc(text)}" lang="es" aria-label="Listen to ${esc(text)}">${esc(text)}</button>`;
const commonTenses=['present','imperfect','preterite','perfect','subjunctive'];
const allGroups=formGroups(note);
const pickerGroups=commonTenses.map(id=>allGroups.find(g=>g.id===id)).filter(Boolean);
if(!pickerGroups.some(g=>g.id===tense))tense='present';
function activeGroup(id=tense){
 const g=formGroup(note,id);if(!g)return null;
 const row=selectedRow(note.id,id,g.rows),e=row&&rowExample(note.id,id,row.slot,alternative);
 return {...g,text:undefined,translation:undefined,exampleNotice:'',...(e?.text?e:{exampleNotice:e?.notice||g.notice||g.exampleNotice}),selectedSlot:row?.slot};
}
function formsContent(lesson,g){
 const rows=g?.rows||lesson.rows;
 if(g?.notice)return `<p class="tense-cue">${esc(g.notice)}</p>`;
 return (g?`<p class="tense-cue">${esc(g.cue)}</p>`:'')+`<table class="forms-table"><caption ${g?'class="sr-only"':''}>${esc(g?.title||lesson.formsTitle||'Word forms')}</caption><tbody>${rows.map(r=>`<tr ${g?`data-example-row="${r.slot}" class="${r.slot===g.selectedSlot?'example-selected':''}"`:''}><th scope="row" title="${esc(r.sourceLabel)}">${g?`<button type="button" class="example-row-select" data-example-slot="${r.slot}" aria-pressed="${r.slot===g.selectedSlot}" aria-label="Show example: ${esc(r.label)}">${esc(r.label)}</button>`:esc(r.label)}</th><td>${(r.alternatives||[r.lemma]).map((form,i)=>say(form)+(g&&i?` <button type="button" class="example-alternative" data-example-slot="${r.slot}" data-example-alternative="${i}" aria-pressed="${r.slot===g.selectedSlot&&alternative===i}" aria-label="Show example with ${esc(form)}">Example</button>`:'')).join(' <span class="form-alternative">/</span> ')}</td></tr>`).join('')}</tbody></table>`+(!onExample&&g?.text?`<div class="tense-example"><p>${exampleMarkup(g)}${sentenceAudio(g.text)}</p><p>${esc(g.translation)}</p></div>`:!onExample&&g?.exampleNotice?`<p class="tense-cue">${esc(g.exampleNotice)}</p>`:'');
}
function formsPanel(lesson){
 const g=activeGroup();
 return g?`<div class="forms-focus"><div class="tense-stage" aria-label="Verb tenses">${pickerGroups.map(t=>`<section class="tense-scene" data-scene="${t.id}"><div class="tense-scene-content"><h3>${esc(t.title)}</h3><div data-tense-content="${t.id}">${formsContent(lesson,activeGroup(t.id))}</div></div><button class="tense-scene-select" data-tense="${t.id}" aria-label="${esc(t.title)}" aria-pressed="${t.id===g.id}"></button></section>`).join('')}</div><div class="forms-navigation"><button class="tense-arrow" data-tense-step="-1" aria-label="Previous tense" title="Previous tense (-)">‹</button><span><kbd>−</kbd> <kbd>=</kbd> tense · <kbd>[</kbd> <kbd>]</kbd> person</span><button class="tense-arrow" data-tense-step="1" aria-label="Next tense" title="Next tense (=)">›</button></div></div>`:`<div data-tense-content>${formsContent(lesson,g)}</div>`;
}
function centerTense(){
 const current=pickerGroups.findIndex(t=>t.id===tense);
 host.querySelectorAll('[data-scene]').forEach((panel,i)=>{
  const offset=i-current,selected=offset===0;
  panel.style.setProperty('--offset',offset===0?0:Math.sign(offset)*(0.92+Math.abs(offset)*0.14));
  panel.style.setProperty('--distance',Math.abs(offset));
  panel.dataset.active=String(selected);
  panel.style.zIndex=String(10-Math.abs(offset));
  panel.querySelector('.tense-scene-content').inert=!selected;
  const button=panel.querySelector('[data-tense]');
  button.setAttribute('aria-pressed',String(selected));
  button.tabIndex=selected?-1:0;
 });
 host.querySelector('[data-tense-step="-1"]')?.toggleAttribute('disabled',current===0);
 host.querySelector('[data-tense-step="1"]')?.toggleAttribute('disabled',current===pickerGroups.length-1);
}
function chooseTense(id,{focus=false}={}){
 alternative=0;const g=activeGroup(id);if(!g)return;
 voice?.stop();tense=g.id;sessionSelection(note.id).tense=tense;sessionSelection(note.id).alternative=0;onExample?.(g);

 host.querySelector('[data-tense-step="-1"]').disabled=tense===pickerGroups[0].id;
 host.querySelector('[data-tense-step="1"]').disabled=tense===pickerGroups.at(-1).id;
 host.querySelector(`[data-tense-content="${tense}"]`).innerHTML=formsContent(note,g);

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

 const guide=pickerGroups.length?'<button type="button" class="plain" data-verb-guide aria-haspopup="dialog">Verb guide ↗</button>':'';
 host.innerHTML=showHeading?`<div class="forms-heading"><h2>Forms</h2>${guide}</div>${formsPanel(note)}`:formsPanel(note)+guide;
 if(pickerGroups.length)onExample?.(activeGroup());
 document.addEventListener('keydown',e=>{
  const dialogs=[...document.querySelectorAll('dialog[open]')];
  const owner=host.closest('dialog');
  const active=dialogs.length?e.target.closest('dialog[open]')===owner&&Boolean(owner):!owner;
  const state={active,editing:Boolean(e.target.closest('input,textarea,select,[contenteditable=true]'))};
  if(rowKeysAllowed(e,state)&&pickerGroups.length){
   const g=activeGroup(),rows=g?.notice?[]:g?.rows||[];
   if(!rows.length)return;
   e.preventDefault();e.stopPropagation();
   const i=(rows.findIndex(r=>r.slot===g.selectedSlot)+(e.key===']'?1:-1)+rows.length)%rows.length;
   if(rows[i])chooseRow(rows[i].slot,0,{focus:Boolean(e.target.closest('[data-example-row]'))});
   return;
  }
  if(!tenseKeysAllowed(e,state)||!pickerGroups.length)return;
  e.preventDefault();e.stopPropagation();const i=pickerGroups.findIndex(t=>t.id===tense)+(e.key==='='?1:-1);if(pickerGroups[i])chooseTense(pickerGroups[i].id);
 },{signal,capture:true});
 function chooseRow(slot,alt=0,{focus=false}={}){
  voice?.stop();selectExampleRow(note.id,tense,slot);alternative=alt;sessionSelection(note.id).alternative=alt;
  const g=activeGroup();onExample?.(g);
  host.querySelector(`[data-tense-content="${tense}"]`).innerHTML=formsContent(note,g);
  if(focus)host.querySelector(`[data-scene="${tense}"] [data-example-slot="${slot}"]${alt?`[data-example-alternative="${alt}"]`:''}`)?.focus({preventScroll:true});
 }
 host.addEventListener('click',e=>{
  const b=e.target.closest('button');
  if(b?.dataset.verbGuide!==undefined){voice?.stop();openVerbGuide(note,tense);return;}
  if(b?.dataset.exampleSlot!==undefined){chooseRow(Number(b.dataset.exampleSlot),Number(b.dataset.exampleAlternative||0),{focus:true});return;}
  if(b?.dataset.tense)chooseTense(b.dataset.tense);
  else if(b?.dataset.tenseStep){const i=pickerGroups.findIndex(t=>t.id===tense)+Number(b.dataset.tenseStep);if(pickerGroups[i])chooseTense(pickerGroups[i].id);}
  else if(!e.target.closest('button,a')){const row=e.target.closest('[data-example-row]');if(row)chooseRow(Number(row.dataset.exampleRow));}
 },{signal});
 const observer=new ResizeObserver(()=>centerTense());observer.observe(host);
 centerTense();return ()=>{abort.abort();observer.disconnect();};
}
