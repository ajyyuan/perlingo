import {notes as pilot,concepts as pilotConcepts} from './notes-data.js';
import {loadNotes} from './notes-library.js';
import {mountNote,esc} from './note-view.js';
import {createPronouncer} from '/src/speech.js';
const allMode=new URLSearchParams(location.search).has('set');
const host=document.querySelector('#note'),nav=document.querySelector('#words'),setSelect=document.querySelector('#note-set'),search=document.querySelector('#note-search');
const voice=createPronouncer(window.speechSynthesis,window.SpeechSynthesisUtterance);
let notes=pilot,concepts=pilotConcepts,fragment='',index=0,unmount=()=>{},set=0;
try{fragment=decodeURIComponent(location.hash.slice(1));}catch{}
function renderNav(){
 const query=search.value.trim().toLocaleLowerCase();
 const matches=allMode?notes.map((n,i)=>({n,i})).filter(({n,i})=>query?(n.word+' '+n.meaning+' '+n.label).toLocaleLowerCase().includes(query):Math.floor(i/50)===set):notes.map((n,i)=>({n,i}));
 document.querySelector('#note-matches').textContent=query?`${matches.length} matches${matches.length>50?' · Showing first 50':''}`:'';
 nav.innerHTML=matches.slice(0,50).map(({n,i})=>`<button data-word="${i}" aria-pressed="${i===index}" lang="es">${esc(n.word)}${allMode&&notes.some((other,j)=>j!==i&&other.word===n.word)?` <small lang="en">(${esc(n.label)})</small>`:''}</button>`).join('');
}
function render(){
 unmount();document.querySelector('#position').textContent=`${index+1} / ${notes.length}`;
 renderNav();unmount=mountNote(host,notes[index],concepts,{voice,heading:true,storageKey:allMode?'perlingo-word-notes-v1':'perlingo-word-notes-pilot-v1'});
}
function select(i){index=i;set=Math.floor(i/50);setSelect.value=String(set);history.replaceState(null,'',`${allMode?'?set='+String(set+1):''}#${encodeURIComponent(notes[index].id||notes[index].word)}`);render();nav.querySelector('[aria-pressed=true]')?.focus();}
nav.addEventListener('click',e=>{const b=e.target.closest('[data-word]');if(b)select(Number(b.dataset.word));});
search.addEventListener('input',renderNav);
setSelect.addEventListener('change',()=>{search.value='';select(Number(setSelect.value)*50);});
document.addEventListener('visibilitychange',()=>{if(document.hidden)voice.stop();});window.addEventListener('pagehide',()=>voice.stop());
try{
 if(allMode){
  ({notes,concepts}=await loadNotes());
  const requested=Number(new URLSearchParams(location.search).get('set'));set=Number.isInteger(requested)&&requested>=1&&requested<=30?requested-1:0;
  document.querySelector('#note-tools').hidden=false;
  setSelect.innerHTML=Array.from({length:30},(_,i)=>`<option value="${i}">Set ${i+1} · ${i*50+1}–${(i+1)*50}</option>`).join('');
 }
 const found=notes.findIndex(n=>(n.id||n.word)===fragment);index=found>=0?found:set*50;set=Math.floor(index/50);setSelect.value=String(set);
 document.querySelector('.pilot-heading .eyebrow').textContent=allMode?'Word notes':'Word notes · five-word preview';
 render();
}catch{host.textContent='The word notes could not load. Please reload this page.';}
