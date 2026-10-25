import {SIZE,KEY,createSession,answer,restore,idsForSet} from './session.js';
import {createPronouncer} from '/src/speech.js';
const app=document.querySelector('#app'),warning=document.querySelector('#storage');
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const voice=createPronouncer(window.speechSynthesis,window.SpeechSynthesisUtterance);
let deck,byId,data,view='home',search='';
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch{warning.hidden=false;warning.textContent='Progress could not be saved. Keep this tab open to continue.';}};
const knownIn=set=>idsForSet(deck,set).filter(id=>data.known[id]).length;
function home(){
 const known=deck.filter(c=>data.known[c.id]).length;
 app.innerHTML=`<section><p class="eyebrow">The five-day Spanish sprint</p><div class="intro-line"><div><h1>1,500 cards.<br>One card at a time.</h1><p class="lead">50 per set. Six sets a day. Repeat what needs another look.</p></div><div class="total">${known.toLocaleString()} / 1,500<small>marked known</small></div></div><progress max="1500" value="${known}" aria-label="Cards marked known"></progress><div class="days" role="group" aria-label="Choose a study day">${Array.from({length:5},(_,d)=>`<button data-day="${d}" aria-pressed="${data.day===d}">Day ${d+1}</button>`).join('')}</div><div class="set-grid">${Array.from({length:6},(_,j)=>{const s=data.day*6+j,n=knownIn(s),active=data.sessions[s];return `<button class="set" data-set="${s}"><strong>Set ${s+1}</strong><span>Cards ${s*SIZE+1}–${(s+1)*SIZE}</span><small class="set-status">${active&&!active.done?'Resume · ':active?.done?'Revisit · ':''}${n} / 50 known</small></button>`;}).join('')}</div></section>`;
}
function study(){
 const s=data.sessions[data.set];
 if(s.done){app.innerHTML=`<section class="lemma-card complete"><p class="eyebrow">Set ${data.set+1} complete</p><h1>All 50 marked known.</h1><p class="lead">${s.round===1?'One pass.':`${s.round} passes.`} Come back whenever you want to check again.</p><div class="actions"><button class="secondary" data-action="revisit">Revisit set</button><button class="primary" data-action="next">${data.set<29?'Next set →':'Back to sets'}</button></div></section>`;return;}
 const c=byId.get(s.queue[s.index]);
 app.innerHTML=`<section class="study"><div class="study-top"><button class="plain" data-action="home">← Sets</button><span class="counter">Set ${data.set+1} · ${s.round>1?`Again · Pass ${s.round} · `:''}${s.index+1} / ${s.queue.length}</span></div><div class="lemma-card"><div class="study-head"><span class="eyebrow">Spanish · ${esc(c.partOfSpeech)}</span><span class="counter">#${c.rank}</span></div><div class="lemma-title"><h1 lang="es">${esc(c.lemma)}</h1><button data-speak="${esc(c.lemma)}" aria-label="Listen to ${esc(c.lemma)}">♫</button></div><div class="audio-status" role="status" id="audio-status"></div>${s.revealed?`<div class="answer" aria-live="polite">${c.meanings.map(m=>`<p>${esc(m)}</p>`).join('')}${c.sourceNote?`<details class="source-note"><summary>About this headword</summary><p>${esc(c.sourceNote)}</p></details>`:''}${c.forms.length?`<div class="forms">Related forms<div class="form-buttons">${c.forms.map(f=>`<button lang="es" data-speak="${esc(f)}">${esc(f)}</button>`).join('')}</div></div>`:''}<a class="small-link" href="${esc(c.dictionary)}" target="_blank" rel="noopener">Dictionary & meanings ↗</a></div><div class="card-actions"><button class="secondary" data-action="again">← Again</button><button class="primary" data-action="know">Know →</button></div>`:`<div class="card-actions"><button class="primary" data-action="reveal">Reveal meaning</button></div>`}</div><p class="keys">Space to reveal · ← Again · → Know · P to listen</p></section>`;
}
function browse(){
 app.innerHTML=`<section><p class="eyebrow">The whole deck</p><h1>Find a word.</h1><label for="search" class="sr-only">Search Spanish or English</label><input id="search" class="search" placeholder="Search Spanish or English" value="${esc(search)}"><div id="matches" role="status"></div><div class="browse-list" id="list"></div></section>`;
 renderList();document.querySelector('#search').addEventListener('input',e=>{search=e.target.value;renderList();});
}
function renderList(){const q=search.trim().toLocaleLowerCase(),matches=deck.filter(c=>(c.lemma+' '+c.meanings.join(' ')).toLocaleLowerCase().includes(q));document.querySelector('#matches').textContent=`${matches.length} cards${matches.length>100?' · Showing first 100':''}`;document.querySelector('#list').innerHTML=matches.slice(0,100).map(c=>`<div class="browse-row"><small>${c.rank}</small><a href="${esc(c.dictionary)}" target="_blank" rel="noopener" lang="es">${esc(c.lemma)}<small class="browse-pos">${esc(c.partOfSpeech)}</small></a><span>${esc(c.meanings[0])}</span></div>`).join('');}
function render(focus){voice.stop();if(view==='home')home();else if(view==='browse')browse();else study();if(focus)app.querySelector(focus)?.focus({preventScroll:true});}
function openSet(set){data.set=set;data.day=Math.floor(set/6);if(!data.sessions[set]||data.sessions[set].done)data.sessions[set]=createSession(idsForSet(deck,set));view='study';save();render('[data-action="reveal"]');}
function act(action){
 const s=data.sessions[data.set];
 if(action==='home'){view='home';save();render();return;}
 if(view!=='study'||!s)return;
 if(action==='revisit'){openSet(data.set);return;}
 if(action==='next'){if(data.set<29)openSet(data.set+1);else act('home');return;}
 if(s.done)return;
 if(action==='reveal'){s.revealed=true;save();render('[data-action="know"]');return;}
 if((action==='know'||action==='again')&&s.revealed){const id=s.queue[s.index];data.known[id]=action==='know';data.sessions[data.set]=answer(s,action==='know');save();render('[data-action="reveal"], [data-action="next"]');}
}
function speak(text){voice.speak(text,'es-ES','Spanish',({state,message})=>{const status=document.querySelector('#audio-status');if(status)status.textContent=message||(state==='loading'?'Loading…':state==='playing'?'Playing…':'');});}
document.querySelector('#home').onclick=()=>{if(!deck)return;view='home';render();};
document.querySelector('#browse').onclick=()=>{if(!deck)return;view='browse';render('#search');};
app.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!deck)return;if(b.dataset.day!==undefined){data.day=Number(b.dataset.day);save();render();}else if(b.dataset.set!==undefined)openSet(Number(b.dataset.set));else if(b.dataset.speak)speak(b.dataset.speak);else if(b.dataset.action)act(b.dataset.action);});
document.addEventListener('keydown',e=>{if(view!=='study'||e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,textarea,select,a'))return;const s=data.sessions[data.set];if(!s||s.done)return;const action={' ':'reveal','ArrowLeft':'again','ArrowRight':'know'}[e.key];if(action){e.preventDefault();if(action!=='reveal'||!s.revealed)act(action);}else if(e.key.toLowerCase()==='p'){e.preventDefault();speak(byId.get(s.queue[s.index]).lemma);}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)voice.stop();});window.addEventListener('pagehide',()=>voice.stop());
try{const response=await fetch('/lemmas/data/deck.json');if(!response.ok)throw Error('deck');deck=await response.json();byId=new Map(deck.map(c=>[c.id,c]));let raw;try{raw=JSON.parse(localStorage.getItem(KEY));}catch{warning.hidden=false;warning.textContent='Saved progress is unavailable. This session can still be used.';}data=restore(raw,deck);render();}catch{app.innerHTML='<p>The deck could not load. Please reload this page.</p>';}
