import {keyboardCommand,moveIndex} from './keyboard.js';
import {cleanDictation} from './dictation-text.js';
import {createAnswerFeedback} from '/src/answer-feedback.js';
import {createRecordedDictation} from './recorded-dictation.js';
import {sentenceMarkup,wordButton} from './word-help.js';
import {contextPilot} from './context-pilot.js';
import {createFlow,batchIds,completedCount,transition,restoreFlows,finishTest} from './workflow.js';
import {createTest,checkAnswer,advanceTest,optionsFor,validTest} from './assessment.js';
import {loadNotes} from './notes-library.js';
import {mountNote,notesOwnKeyboard,esc} from './note-view.js';
import {KEY,restore,idsForSet} from './session.js';
import {createPronouncer} from '/src/speech.js';
const app=document.querySelector('#app'),warning=document.querySelector('#storage');
const voice=createPronouncer(window.speechSynthesis,window.SpeechSynthesisUtterance);
const answerAudio=createAnswerFeedback(voice,window.AudioContext||window.webkitAudioContext);
const dictation=createRecordedDictation({
 onText:text=>{const input=app.querySelector('#answer');if(input&&!input.readOnly){const test=activeTest(),card=byId.get(test.queue[test.index]);const cleaned=cleanDictation(text,test.kind==='context'?card.context.answers:[],test.kind==='context'?card.context:null);input.value=cleaned;test.draft=cleaned;save();input.focus();}},
 onStatus:(state,message)=>{const b=app.querySelector('[data-action="dictate"]');if(b){const busy=['starting','listening','transcribing'].includes(state);b.dataset.listening=String(busy);b.dataset.state=state;const label=state==='transcribing'?'Cancel transcription':busy?'Stop dictation':'Dictate answer';b.setAttribute('aria-label',label);b.setAttribute('aria-pressed',String(busy));b.title=['error','ended'].includes(state)&&message?message:label;b.setAttribute('aria-description',['error','ended'].includes(state)?message:'');}}
});
const microphone='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3m-4 0h8"/></svg>';
const speaker='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></svg>';
let deck,byId,notes,concepts,data,view='study',search='',unmount=()=>{};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch{warning.hidden=false;warning.textContent='Progress could not be saved. Keep this tab open to continue.';}};
const flow=()=>data.flows[data.set];
const dayCards=d=>deck.slice(d*300,(d+1)*300);
const setCount=d=>Array.from({length:6},(_,i)=>data.flows[d*6+i]?.phase==='done').filter(Boolean).length;
const practiced=d=>Array.from({length:6},(_,i)=>data.practiced[d*6+i]||0).reduce((a,b)=>a+b,0);
const activeTest=()=>data.activeExam?data.exams[data.activeExam].test:flow().test;
const button=(action,label,cls='primary')=>`<button class="${cls}" data-action="${action}">${label}</button>`;
const listen=c=>`<button class="listen" data-speak="${esc(c.lemma)}" aria-label="Listen to ${esc(c.lemma)}">${speaker}</button>`;
function head(label,count,badge='Learn'){return `<div class="study-head"><div class="study-label"><span class="phase-badge ${badge==='Learn'?'phase-new':'phase-review'}">${badge}</span><span class="eyebrow">${label}</span></div><span class="counter">${count}</span></div>`;}
function stage(title,copy,actions,label='Your progress'){
 app.innerHTML=`<section class="concept stage">${head(label,'',title.includes('complete')||title==='Ten checked.'?'Complete':'Next')}<div class="concept-body"><h1>${title}</h1><p class="muted">${copy}</p><div class="stage-actions">${actions}</div></div></section>`;
}
function home(){
 const day=data.day,start=day*6,sets=Array.from({length:6},(_,i)=>start+i),next=sets.includes(data.set)&&data.flows[data.set]?.phase!=='done'?data.set:sets.find(s=>data.flows[s]?.phase!=='done')??start;
 const contextEntry=`<div class="review-row"><div><strong>Context review · Set 1 pilot</strong><p>50 contextual questions available. Full 300-word reviews are not ready yet.</p></div><button class="secondary" data-exam="review-0">${data.exams['review-0']&&!data.exams['review-0'].test.done?'Resume':'Try pilot'} →</button></div>`;
 app.innerHTML=`<section class="course-page"><div class="course-title"><p class="eyebrow">Spanish · 1,500 words</p><h1>Your five days.</h1></div><nav class="days" aria-label="Study day">${Array.from({length:5},(_,d)=>`<button data-day="${d}" aria-pressed="${d===day}">Day ${d+1}</button>`).join('')}</nav>${day<2?contextEntry:'<p class="hint">Previous-day contextual review is not available for this day yet.</p>'}<div class="day-heading"><div><h2>Day ${day+1}</h2><span>${practiced(day)} / 300 learned · ${setCount(day)} / 6 sets tested</span></div><button class="primary" data-set="${next}">${data.flows[next]?'Continue':'Start'} →</button></div><div class="set-list">${sets.map(s=>{const f=data.flows[s],label=!f?'Not started':f.phase==='done'?`Test complete · ${f.test.firstCorrect}/50 first try`:['set-ready','test'].includes(f.phase)?'50 learned · Set test':`Batch ${f.batch+1} / 5 · ${f.phase==='choice'?'Typed recall':f.phase==='complete'?'Checked':'Learning'}`;return `<button data-set="${s}"><span class="set-number">${String(s+1).padStart(2,'0')}</span><span><strong>Words ${s*50+1}–${s*50+50}</strong><small>${label}</small></span><span aria-hidden="true">${f?.phase==='done'?'✓':'→'}</span></button>`;}).join('')}</div><div class="review-row"><div><strong>Day ${day+1} test</strong><p>All 300 words · typed Spanish recall${data.exams[`day-${day}`]?.test.done?` · ${data.exams[`day-${day}`].test.firstCorrect}/300 first try`:''}</p></div><button class="secondary" data-exam="day-${day}">${data.exams[`day-${day}`]&&!data.exams[`day-${day}`].test.done?'Resume':'Start'} →</button></div></section>`;
}
function learning(){
 const f=flow(),c=byId.get(batchIds(idsForSet(deck,data.set),f)[f.index]);
 app.innerHTML=`<section class="concept learning-card">${head(`Day ${Math.floor(data.set/6)+1} · Set ${data.set+1} · Batch ${f.batch+1}`,`${String(f.index+1).padStart(2,'0')} / 10`)}<div class="concept-body"><h1 class="word ${c.meaning.length>30?'long-word':''}">${esc(c.meaning)}</h1><div class="translation"><p class="eyebrow">Spanish <span class="pos">· ${esc(c.partOfSpeech)}</span></p><div class="translation-value"><h3>${wordButton(c.lemma,c.meaning)}</h3>${listen(c)}</div></div><p id="audio-status" role="status"></p><details id="word-reference"><summary>Notes & examples</summary><div id="card-note"></div></details></div><nav class="learning-navigation" aria-label="Learning cards"><button data-action="previous" aria-label="Previous learning card" ${f.index===0?'disabled':''}>↑<span class="mobile-nav-label">Previous</span></button><button data-action="forward" aria-label="${f.index===9?'Start batch check':'Next learning card'}">${f.index===9?'<span class="check-label">Check these 10</span> →':'↓<span class="mobile-nav-label">Next</span>'}</button></nav></section>`;
 unmount=mountNote(app.querySelector('#card-note'),notes.get(c.id),concepts,{voice});

}
function testView(){
 const t=activeTest();if(t.done){testDone();return;}
 const c=byId.get(t.queue[t.index]),choice=t.kind==='choice',context=t.kind==='context',feedback=t.feedback;
 const exam=data.activeExam?data.exams[data.activeExam]:null;
 const label=exam?`${context?'Context pilot · Set 1':'Day test · Day '+(exam.day+1)}`:choice?`Set ${data.set+1} · 50 words`:`Set ${data.set+1} · Batch ${flow().batch+1}`;
 const prompt=choice?c.lemma:c.meaning;
 if(choice&&(!Array.isArray(t.options)||!t.options.includes(c.meaning))){t.options=optionsFor(c,t.ids.map(id=>byId.get(id)),deck);save();}
 const sentence=context?sentenceMarkup(c.context,Boolean(feedback)):'';
 const expected=context?c.context.answers[0]:choice?c.meaning:c.lemma;
 const explanation=context?`<p class="context-explanation">${esc(c.context.explanation)}</p><p class="hint">Headword: <span lang="es">${esc(c.lemma)}</span> · ${esc(c.meaning)}</p>`:'';
 app.innerHTML=`<section class="quiz typed">${head(label,`${t.index+1} / ${t.queue.length}`,t.mode==='repair'?'Repair':`Pass ${t.pass}`)}${context?`<p class="context-translation">${esc(c.context.example.translation)}</p><h1 class="context-sentence" lang="es">${sentence}</h1>${!feedback?'<p id="audio-status" role="status"></p>':''}`:`<h1 class="word ${prompt.length>30?'long-word':''}" ${choice?'lang="es"':''}>${esc(prompt)}</h1>`}${context?'':`<p class="test-cue">${esc(c.partOfSpeech)} · ${choice?'Choose the meaning':'Recall the Spanish headword'}</p>`}${choice?`<div class="choices" role="group" aria-label="Choose the English meaning">${t.options.map((value,i)=>`<button class="choice ${feedback&&value===c.meaning?'correct':''} ${feedback&&!feedback.correct&&value===feedback.response?'incorrect':''}" data-choice="${esc(value)}" ${feedback?'disabled':''}><span class="choice-letter">${String.fromCharCode(65+i)}</span>${esc(value)}${feedback&&value===c.meaning?'<span class="choice-mark">✓</span>':''}</button>`).join('')}</div>`:feedback?'':`<form id="answer-form"><label class="sr-only" for="answer">${context?'Missing Spanish word':'Spanish headword'}</label><div class="answer-line"><input class="typed-answer" id="answer" name="answer" lang="es" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Type in Spanish…" value="${esc(feedback?.response??t.draft??'')}" ${feedback?'readonly':''}>${!feedback?`<div class="voice-input"><button type="button" class="plain dictation-mic" data-action="dictate" aria-label="Dictate answer" aria-pressed="false" title="Dictate in Spanish; stops after a pause. Audio is transcribed by Azure Speech." ${dictation.supported?'':'disabled'}>${microphone}</button></div>`:''}</div>${!feedback?`<div class="answer-tools"><details class="input-tools"><summary aria-label="Accented letters" title="Accented letters">áéñ</summary><div class="accent-keys">${[...'áéíóúüñ'].map(ch=>`<button type="button" data-accent="${ch}" aria-label="Insert ${ch}" ${feedback?'disabled':''}>${ch}</button>`).join('')}</div></details></div>`:''}${!feedback?'<div class="test-actions"><button class="plain" type="button" data-action="skip">Show answer</button><button class="primary" type="submit">Check →</button></div>':''}</form>`}<div class="test-feedback ${feedback?(feedback.correct?'is-correct':'is-incorrect'):''}" role="status">${feedback?`<p class="feedback-title">${feedback.correct?'✓ Correct':context?(feedback.formError?'Right lemma; this sentence needs a different form:':'The target word in this sentence is:'):choice?'The matching meaning is:':'The headword for this card is:'}</p>${!feedback.correct&&feedback.response?`<p class="submitted-answer">You answered: ${esc(feedback.response)}</p>`:''}<p class="expected">${esc(expected)} ${!choice?listen({...c,lemma:expected}):''}</p>${!feedback.correct?'<p class="hint">This answer needs an unaided retry after this pass.</p>':''}${explanation}${(t.failures[c.id]||0)>=3?`<details class="relearn"><summary>Take a moment to relearn this word</summary><p>${esc(c.lemma)} — ${esc(c.meaning)}</p><p>${esc(notes.get(c.id).pattern)}</p><p>${esc(notes.get(c.id).tip)}</p></details>`:''}<p id="audio-status" role="status"></p>`:''}</div>${feedback?`<div class="continue-row">${button('continue','Continue →')}</div>`:''}<div class="test-footer"><div class="quick-word rule-help"><button class="rule-trigger" aria-describedby="pass-info" type="button">Passing & scores ⓘ</button><div class="quick-meaning" id="pass-info" role="tooltip"><p>Complete a perfect full pass to clear this stage. Finish each pass, then retry every miss unaided before a new full pass. Show answer counts as a miss.</p><p>First pass: ${t.firstCorrect}${t.round===1?' correct so far':' / '+t.ids.length+' correct'}. This score stays separate.</p></div></div><button class="plain sound-toggle-label" type="button" data-action="answer-sound" aria-pressed="${data.answerSound!==false}">Sound ${data.answerSound!==false?'on':'off'}</button></div></section>`;
 const form=app.querySelector('#answer-form');form?.querySelector('#answer').addEventListener('input',e=>{dictation.cancel();t.draft=e.target.value;save();});form?.addEventListener('submit',e=>{e.preventDefault();const input=form.querySelector('#answer');if(input.value.trim())submit(input.value);else input.focus();});
}

function testDone(){
 if(data.activeExam){const ex=data.exams[data.activeExam],t=ex.test;stage(`${ex.type==='review'?'Review':'Day test'} complete.`,`${t.firstCorrect} / ${t.ids.length} on the first try. A fully correct pass completed.${ex.type==='review'?' This pilot covers Set 1’s 50 words; the full contextual review is not yet available.':''}`,button('home','Back to your day →'),`Day ${ex.day+1}`);return;}
 const f=flow(),t=f.test,score=`${t.firstCorrect} / ${t.ids.length} on the first try. A fully correct pass completed.`;
 if(f.phase==='complete')stage('Ten checked.',score,button('forward','Learn the next 10 →')+button('home','Take a break','plain'),`Set ${data.set+1} · Batch ${f.batch+1} / 5`);
 else if(f.phase==='set-ready')stage('Now, recognize all fifty.',`${score} You’ve checked all five batches. Next: choose the English meaning for each of the 50 Spanish headwords.`,button('start-test','Start set test →')+button('home','Later','plain'),`Set ${data.set+1}`);
 else if(f.phase==='done'){
 const day=Math.floor(data.set/6),last=data.set%6===5;
 stage('Set complete.',score,last?`<button class="primary" data-exam="day-${day}">Day ${day+1} test →</button>`+button('next-day',day<4?'Go to the next day':'Back to your days','plain'):button('next','Next set →')+button('home','Take a break','plain'),`Set ${data.set+1} · 50 words`);
 }
}
function study(){
 if(data.activeExam){testView();return;}
 const f=flow();
 if(f.phase==='learn'){learning();return;}
 if(f.phase==='ready'){stage('Find the Spanish.','Type the ten headwords from their English meanings. Repair any misses, then complete a fully correct pass.',button('start-test','Start batch recall →')+button('previous','Look through them again','plain'),`Set ${data.set+1} · Batch ${f.batch+1}`);return;}
 if(['choice','test'].includes(f.phase)){testView();return;}
 testDone();
}
function browse(){
 app.innerHTML='<section class="course-page"><p class="eyebrow">The whole deck</p><h1>Find a word.</h1><label class="sr-only" for="search">Search Spanish or English</label><input class="search" id="search" placeholder="Search Spanish or English"><p id="matches" class="hint" role="status"></p><div id="list"></div></section>';
 const input=app.querySelector('#search');input.value=search;input.addEventListener('input',()=>{search=input.value;renderList();});renderList();
}
function renderList(){const q=search.trim().toLocaleLowerCase(),matches=deck.filter(c=>(c.lemma+' '+c.meaning).toLocaleLowerCase().includes(q));app.querySelector('#matches').textContent=`${matches.length} cards${matches.length>100?' · Showing first 100':''}`;app.querySelector('#list').innerHTML=matches.slice(0,100).map(c=>`<a class="search-row" href="/lemmas/notes.html?set=${Math.ceil(c.rank/50)}#${encodeURIComponent(c.id)}"><span lang="es">${esc(c.lemma)}<small>${esc(c.partOfSpeech)}</small></span><span>${esc(c.meaning)}</span></a>`).join('');}
function render(focus){
 unmount();unmount=()=>{};answerAudio.stop();dictation.cancel();document.body.dataset.view=view;
 if(view==='study'&&!data.activeExam)data.day=Math.floor(data.set/6);
 document.querySelector('#total-progress').textContent=`Day ${data.day+1} · ${practiced(data.day)} / 300 learned`;
 if(view==='home')home();else if(view==='browse')browse();else study();
 const fallback=view==='home'?'.day-heading .primary':view==='browse'?'#search':'#answer, [data-action="continue"], .stage .primary, .choice:not(:disabled), [data-action="forward"]';
 (app.querySelector(focus||fallback)||app.querySelector(fallback))?.focus();
}
function openSet(set){data.set=set;data.day=Math.floor(set/6);data.activeExam=null;if(!data.flows[set])data.flows[set]=createFlow();view='study';save();render();}
function openExam(key){
 const [type,d]=key.split('-'),day=Number(d);if(!['day','review'].includes(type)||!Number.isInteger(day)||day<0||day>4)return;
 if(type==='review'&&day!==0)return;
 if(!data.exams[key]||data.exams[key].test.done)data.exams[key]={type,day,test:createTest(type==='review'?'context':'typed',type==='review'?contextPilot.map(c=>c.id):dayCards(day).map(c=>c.id))};
 data.activeExam=key;view='study';save();render('#answer');
}
function submit(response){
 const t=activeTest();if(t.done||t.feedback)return;
 const c=byId.get(t.queue[t.index]),next=checkAnswer(t,response,c);
 if(data.activeExam)data.exams[data.activeExam].test=next;else flow().test=next;
 if(t.kind==='typed')data.known[c.id]=next.feedback.correct;
 save();render('[data-action="continue"]');
 answerAudio.play({correct:next.feedback.correct,text:c.context&&t.kind==='context'?c.context.answers[0]:c.lemma,locale:'es-ES',label:'Spanish',enabled:data.answerSound!==false});
}
function act(action){
 if(action==='home'){view='home';save();render();return;}
 if(view!=='study')return;
 if(action==='answer-sound'){data.answerSound=data.answerSound===false;save();if(!data.answerSound)answerAudio.stop();const b=app.querySelector('[data-action="answer-sound"]');b.textContent=`Sound ${data.answerSound?'on':'off'}`;b.setAttribute('aria-pressed',String(data.answerSound));return;}
 if(action==='notes'){const d=app.querySelector('#word-reference');if(d){d.open=!d.open;d.querySelector('summary').focus();}return;}
 if(action==='next'){openSet(Math.min(29,data.set+1));return;}
 if(action==='next-day'){data.day=Math.min(4,Math.floor(data.set/6)+1);view='home';save();render();return;}
 if(action==='dictate'){const b=app.querySelector('[data-action="dictate"]');if(b?.dataset.listening==='true')dictation.stop();else{answerAudio.stop();dictation.start();}return;}
 if(action==='skip'){submit('');return;}
 if(action==='continue'){
  const t=activeTest();if(!t?.feedback)return;
  const next=advanceTest(t);if(data.activeExam)data.exams[data.activeExam].test=next;else data.flows[data.set]=finishTest(flow(),next);
 }else if(!data.activeExam)data.flows[data.set]=transition(flow(),action,idsForSet(deck,data.set));
 data.practiced[data.set]=Math.max(data.practiced[data.set]||0,completedCount(flow()));save();render('#answer, [data-action="forward"], [data-action="start-test"]');
}
function speak(text){answerAudio.stop();dictation.cancel();const mic=app.querySelector('[data-action="dictate"]');if(mic){mic.dataset.listening='false';mic.setAttribute('aria-pressed','false');mic.dataset.state='cancelled';mic.setAttribute('aria-label','Dictate answer');}voice.speak(text,'es-ES','Spanish',({message})=>{const s=document.querySelector('#audio-status');if(s)s.textContent=message||'';});}
document.querySelector('#home').onclick=()=>{if(deck){view='home';render();}};
document.querySelector('#browse').onclick=()=>{if(deck){view='browse';render('#search');}};
app.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||!deck)return;
 if(b.dataset.day!==undefined){data.day=Number(b.dataset.day);save();render(`[data-day="${data.day}"]`);}
 else if(b.dataset.set!==undefined)openSet(Number(b.dataset.set));
 else if(b.dataset.exam)openExam(b.dataset.exam);
 else if(b.dataset.choice!==undefined)submit(b.dataset.choice);
 else if(b.dataset.accent){const input=app.querySelector('#answer');input.setRangeText(b.dataset.accent,input.selectionStart,input.selectionEnd,'end');input.dispatchEvent(new Event('input',{bubbles:true}));input.focus();}
 else if(b.dataset.speak)speak(b.dataset.speak);
 else if(b.dataset.action)act(b.dataset.action);
});
app.addEventListener('pointerover',e=>{const w=e.target.closest('.quick-word');if(w&&!w.contains(e.relatedTarget))w.classList.remove('tip-dismissed');});
app.addEventListener('focusin',e=>e.target.closest('.quick-word')?.classList.remove('tip-dismissed'));
const shortcuts=document.querySelector('#keyboard-help');
let shortcutAnchor=null;
function showShortcuts(){shortcutAnchor=document.activeElement;shortcuts.showModal();}
document.querySelector('#keyboard-help-open').onclick=showShortcuts;
shortcuts.querySelector('[data-close]').onclick=()=>shortcuts.close();
shortcuts.addEventListener('close',()=>{if(shortcutAnchor?.isConnected)shortcutAnchor.focus();});
document.addEventListener('keydown',e=>{
 if(e.isComposing)return;
 if(e.repeat&&['Enter',' '].includes(e.key)&&e.target.closest('button,input,summary')){e.preventDefault();return;}
 const overlay=Boolean(document.querySelector('#keyboard-help[open],#grammar[open],#chunk-help:popover-open'));
 if(e.key==='Escape'&&!overlay){
  app.querySelectorAll('.quick-word').forEach(w=>w.classList.add('tip-dismissed'));
  if(app.querySelector('[data-action="dictate"][aria-pressed="true"]')){dictation.cancel();app.querySelector('#answer')?.focus();e.preventDefault();return;}
  const detail=e.target.closest('details[open]');if(detail){detail.open=false;detail.querySelector('summary')?.focus();e.preventDefault();return;}
 }
 if(!deck)return;
 const editing=Boolean(e.target.closest('input,textarea,select,[contenteditable=true]'));
 const notes=notesOwnKeyboard(e.target,false)||Boolean(e.target.closest('header,footer,details'));
 const learning=view==='study'&&!data.activeExam&&flow().phase==='learn';
 const choice=Boolean(app.querySelector('.choice:not(:disabled)'));
 const command=keyboardCommand(e,{editing,overlay,notes,learning,choice});
 if(command){
  if(command==='dictate'){const mic=app.querySelector('[data-action="dictate"]');if(!mic)return;e.preventDefault();act('dictate');}
  else if(command==='home'){e.preventDefault();act('home');}
  else if(command==='search'){e.preventDefault();view='browse';render('#search');}
  else if(command==='help'){e.preventDefault();showShortcuts();}
  else if(command==='pronounce'){e.preventDefault();speak(byId.get(batchIds(idsForSet(deck,data.set),flow())[flow().index]).lemma);}
  else if(command.startsWith('choice-')){const b=app.querySelectorAll('.choice:not(:disabled)')[Number(command.slice(-1))];if(b){e.preventDefault();b.click();}}
  else {e.preventDefault();act(command);}
  return;
 }
 if(overlay||editing||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.repeat)return;
 const group=e.target.closest('.choices,.days');
 if(group){const buttons=[...group.querySelectorAll('button:not(:disabled)')],index=buttons.indexOf(e.target.closest('button')),next=moveIndex(e.key,index,buttons.length);if(next!==null&&index>=0){e.preventDefault();buttons[next].focus();}}
});
document.addEventListener('visibilitychange',()=>{if(document.hidden){answerAudio.stop();dictation.cancel();}});window.addEventListener('pagehide',()=>{answerAudio.stop();dictation.cancel();});
try{
 const response=await fetch('/lemmas/data/deck.json');if(!response.ok)throw Error('deck');const source=await response.json(),library=await loadNotes();notes=new Map(library.notes.map(n=>[n.id,n]));concepts=library.concepts;
 deck=source.map(c=>({...c,meaning:notes.get(c.id).meaning,context:contextPilot.find(x=>x.id===c.id)}));byId=new Map(deck.map(c=>[c.id,c]));let raw;
 try{raw=JSON.parse(localStorage.getItem(KEY));}catch{warning.hidden=false;warning.textContent='Saved progress is unavailable. This session can still be used.';}
 data=restore(raw,deck);data.answerSound=raw?.answerSound!==false;data.previousContext=raw?.previousContext||Object.fromEntries(Object.entries(raw?.exams||{}).filter(([,ex])=>ex?.test?.kind==='context'&&ex.test.contextVersion!==2));data.previousAssessment=raw?.previousAssessment||(Object.values(raw?.flows||{}).some(f=>f.version!==4)?{flows:raw.flows,exams:raw.exams||{}}:null);data.flows=restoreFlows(raw?.flows,deck);data.practiced={};
 for(let s=0;s<30;s++){const n=raw?.practiced?.[s];data.practiced[s]=Math.max(Number.isInteger(n)&&n>=0&&n<=50&&n%10===0?n:0,completedCount(data.flows[s]));}
 data.exams={};for(const [key,ex] of Object.entries(raw?.exams||{})){
  if(!ex||!['day','review'].includes(ex.type)||!Number.isInteger(ex.day)||ex.day<0||ex.day>4||key!==`${ex.type}-${ex.day}`)continue;
  const context=ex.type==='review',allowed=context?contextPilot.map(c=>c.id):dayCards(ex.day).map(c=>c.id);
  if((!context||ex.day===0)&&ex.test?.kind===(context?'context':'typed')&&ex.test.ids?.length===allowed.length&&validTest(ex.test,allowed))data.exams[key]=ex;
 }
 data.activeExam=data.exams[raw?.activeExam]?raw.activeExam:null;
 if(!data.flows[data.set])data.flows[data.set]=createFlow();render();
}catch(error){app.innerHTML='<p>The deck could not load. Please reload this page.</p>';console.error(error);}
