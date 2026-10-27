import {bindHelp} from './help-overlay.js';
import {bindArticleTables} from './german-articles.js';
import {bindGrammar} from './grammar-help.js';
import {learningBank,practiceItems,contrastChoices} from './course-practice.js';
import {coursePacks,courseLessonEntries} from './content/course/index.js';
import {units,unitById} from './content/course/units.js';
import {courseCoverage} from './content/course/coverage.js';
import {openReport,reportContext,exportReports,configureReportSender} from './reports.js';
import {grammarTopicLabel} from './content/grammar-topics.js';
import {ipaGuide} from './ipa.js';
import {openDetails,openPronunciation,closeDetails} from './sidebar.js';
import {bank as starterBank,languages,notes,foundation} from './content.js';
import {lessonEntries} from './content/model.js';
const selectedPack=new URLSearchParams(location.search).get('pack');
const courseMode=!['starter','foundation'].includes(selectedPack);
const foundationMode=selectedPack==='foundation';
const bank=courseMode?courseLessonEntries():foundationMode?lessonEntries(foundation):starterBank;
// Retain the existing keys so promoting the course does not reset progress.
const storageKey=courseMode?'perlingo-preview-course-v1':foundationMode?'perlingo-preview-foundation-v1':'perlingo-v1';
import {key,questions,shuffle} from './engine.js';
import {migrateProgress,planDay,applyPhase,checkpointDay,restartDay} from './app-days.js';
import {checkAnswer,roundPassed} from './recall.js';
import {segments} from './explanations.js';
import {createPronouncer} from './speech.js';
import {createRecordedPronouncer} from './recorded-speech.js';
import {createPronunciationControl,selectedRegion,selectedVoice} from './pronunciation-control.js';
import {createAnswerFeedback} from './answer-feedback.js';
import {createAccount} from './account.js';
import {accountConfig} from './account-config.js';
import {validProgress} from './progress-sync.js';
let account=null;
bindGrammar(document);bindHelp(document);bindArticleTables(document);
document.addEventListener('click',e=>{if(e.target.closest('[data-grammar]'))positionExplanation();});
const devicePronunciation=createPronouncer(window.speechSynthesis,window.SpeechSynthesisUtterance);
const recordedPronunciation=createRecordedPronouncer({fallback:devicePronunciation,loadFeminineManifest:async()=>{const response=await fetch('/src/audio/azure/manifest-feminine.json',{signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error('Audio manifest unavailable');return response.json();},loadManifest:async()=>{const response=await fetch('/src/audio/azure/manifest.json',{signal:AbortSignal.timeout(5000)});if(!response.ok)throw Error('Audio manifest unavailable');return response.json();},makeAudio:()=>{const audio=new Audio();audio.hidden=true;audio.dataset.pronunciationAudio='';document.body.append(audio);return audio;}});
const pronunciation={stop:()=>recordedPronunciation.stop(),speak:(text,locale,label,report)=>recordedPronunciation.speak(text,selectedRegion(data.settings,locale.split('-')[0])||locale,label,report,selectedVoice(data.settings,locale.split('-')[0]))};
const answerAudio=createAnswerFeedback(pronunciation,window.AudioContext||window.webkitAudioContext);
window.addEventListener('pagehide',()=>answerAudio.stop());
document.addEventListener('visibilitychange',()=>{if(document.hidden)answerAudio.stop();});
const root=document.querySelector('#app');
const defaults={languages:['es','fr','de'],noun:4,verb:2,grammar:1,sentence:2};
let data={settings:defaults,history:{},sessions:[]},storageError=false;
try{const stored=JSON.parse(localStorage.getItem(storageKey));if(stored?.settings&&stored?.history&&Array.isArray(stored.sessions))data=stored;}catch{storageError=true;}
data=migrateProgress(data);
data.activeDay=checkpointDay(data.activeDay,data.history);
const currentUnit=()=>unitById(data.settings.unitId)?.id||'u01';
const studyBank=courseMode?learningBank(bank):bank;
const itemById=new Map(bank.map(item=>[item.id,item]));
const getDay=()=>data.activeDay||planDay(studyBank,data.settings,data.history,data.appDay,courseMode?{unitId:currentUnit()}:{});
const hydrate=pairs=>pairs.map(({id,lang})=>({item:itemById.get(id),lang}));
const nextSession=()=>{const batch=getDay(),pairs=hydrate(batch.phase==='review'?batch.reviews:batch.fresh);return {kind:batch.phase,pairs,items:[...new Map(pairs.map(q=>[q.item.id,q.item])).values()]};};
const nextLesson=()=>nextSession().items;
let sessionPlan=null;
let practiceMode='production';
let view='home',lesson=[],index=0,round=1,queue=[],qi=0,feedback=null,mistakes=0,answers=0,correct=0,first={},started=0,result=null,draftInput='';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Keep grammatical cues visible without giving them the same weight as the concept.
function prompt(item){
 let text=item.en,prefix='';
 if(item.type==='noun')prefix='the';
 else if(item.type==='verb'&&text.startsWith('to ')){prefix='to';text=text.slice(3);}
 else if(item.type==='grammar'&&text.startsWith('the ')){prefix='the';text=text.slice(4);}
 const concept=esc(text).replace(/\([^()]+\)/g,cue=>`<span class="prompt-note">${cue}</span>`);
 return `${prefix?`<span class="prompt-cue">${esc(prefix)}</span> `:''}${concept}`;
}
const topicLabel=item=>grammarTopicLabel(item)?`<p class="grammar-topic">${esc(grammarTopicLabel(item))}</p>`:'';
function save(){if(account?.save(data))return;try{localStorage.setItem(storageKey,JSON.stringify(data));}catch{storageError=true;}}
const due=()=>{const p=planDay(studyBank,data.settings,data.history,data.appDay);return p.reviews.length+p.overflow;};
const duration=ms=>`${Math.floor(ms/60000)}:${String(Math.floor(ms/1000)%60).padStart(2,'0')}`;
const pronunciationControl=createPronunciationControl({pronouncer:pronunciation,getSettings:()=>data.settings,getLanguages:()=>['study','ready','quiz','round'].includes(view)?[...new Set((practiceMode==='production'?(sessionPlan?.pairs||[]):queue||[]).map(q=>q.lang))]:data.settings.languages,onOpen:()=>{answerAudio.stop();closeDetails();closeExplanation();},onVoiceSelect:(lang,voice)=>{data.settings.pronunciationVoices={...data.settings.pronunciationVoices,[lang]:voice};save();},onSelect:(lang,locale)=>{data.settings.pronunciationRegions={...data.settings.pronunciationRegions,[lang]:locale};save();}});
const pronunciationButton='<button type="button" class="plain pronunciation-control" data-action="pronunciation-preferences" aria-label="Pronunciation preferences" aria-haspopup="dialog" aria-expanded="false" title="Pronunciation preferences"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M4 10v4M8 6v12M12 3v18M16 7v10M20 10v4"/></svg></button>';
const lemmasLink='<a class="plain app-switch" href="/lemmas/">Lemmas</a>';
function shell(content){const active=['study','ready','quiz','round'].includes(view);root.innerHTML=`<div class="shell"><header class="top"><button class="brand" data-action="home" aria-label="Perlingo home">perlingo<span>.</span></button><nav>${lemmasLink}${pronunciationButton}${data.activeDay?.restartHistory&&(!active||practiceMode==='production')?'<button class="plain restart-day" data-action="restart-day">Restart day</button>':''}${active?'<button class="plain" data-action="home">Exit session</button>':`<button class="plain icon" data-action="settings" aria-label="Settings" title="Settings"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="var(--bg)"/><circle cx="15" cy="17" r="3" fill="var(--bg)"/></svg></button>`}</nav></header>${storageError?'<p class="error">Browser storage is unavailable. Progress may not survive a reload.</p>':''}<main>${content}</main>${active?'':`<footer class="footer"><div><button class="plain" data-action="history">Progress</button>${courseMode?'<button class="plain" data-action="course">Course</button>':''}</div><span>${data.settings.languages.map(l=>languages[l].name).join(' / ')}</span></footer>`}</div>`;}
function persistDay(){
 if(practiceMode!=='production'||!data.activeDay||!['study','ready','quiz','round'].includes(view))return;
 data.activeDay.state={view,index,round,queue:queue.map(q=>({id:q.item.id,lang:q.lang})),qi,feedback,mistakes,answers,correct,first,started,draftInput};save();
}
function resumeDay(){
 sessionPlan=nextSession();lesson=sessionPlan.items;practiceMode='production';
 const state=data.activeDay.state;
 ({view,index,round,qi,feedback,mistakes,answers,correct,first,started}=state);draftInput=state.draftInput||'';queue=hydrate(state.queue);render();
}
function render(direction){pronunciationControl.close();persistDay();closeDetails();closeExplanation();answerAudio.stop();if(view==='home')home();if(view==='study')study();if(view==='ready')recallReady();if(view==='quiz')quiz();if(view==='round')roundEnd();if(view==='results')results();if(view==='history')history();if(view==='settings'){settings();account?.mount();}if(view==='course')course();if(direction)root.querySelector('.concept')?.classList.add(`card-${direction}`);}
function translationChunks(item,l){return segments(item,l).map((part,i)=>part.meaning?`<button class="translation-text" data-explain="${l}" data-part="${i}" aria-expanded="false" aria-controls="translation-explanation" aria-label="Explain and pronounce ${esc(part.text)} in ${languages[l].name}">${esc(part.text)}</button>`:esc(part.text)).join('');}
function translations(item){const pairs=view==='home'?nextSession().pairs:sessionPlan.pairs;const shown=[...new Set(pairs.filter(q=>q.item.id===item.id).map(q=>q.lang))];return `<div class="translations">${shown.map(l=>`<article class="translation"><span class="badge">${languages[l].name}</span><div class="translation-value"><h3>${translationChunks(item,l)}</h3><button data-speak="${l}" aria-label="Listen in ${languages[l].name}" title="Listen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></svg></button></div></article>`).join('')}</div><p id="audio-status" class="muted" role="status"></p><div id="translation-explanation" class="explanation" hidden></div>`;}
let explanationAnchor=null,explanationSelection=null;
function closeExplanation(restoreFocus=false){
 const panel=root.querySelector('#translation-explanation');if(panel)panel.hidden=true;
 explanationAnchor?.setAttribute('aria-expanded','false');
 if(restoreFocus)explanationAnchor?.focus();explanationAnchor=null;
}
function positionExplanation(){
 const panel=root.querySelector('#translation-explanation');if(!panel||panel.hidden||!explanationAnchor?.isConnected)return;
 const rect=explanationAnchor.getBoundingClientRect(),gap=8,margin=12;
 panel.style.left=`${Math.max(margin,Math.min(rect.left,window.innerWidth-panel.offsetWidth-margin))}px`;
 const below=rect.bottom+gap,above=rect.top-panel.offsetHeight-gap;
 panel.style.top=`${Math.max(margin,below+panel.offsetHeight<=window.innerHeight-margin?below:above)}px`;
}
function showExplanation(entry,l,anchor,item){
 root.querySelector('.concept')?.classList.remove('card-next','card-prev');
 root.querySelector('.quiz')?.classList.remove('answer-correct','answer-incorrect');
 closeExplanation();explanationSelection={item,lang:l,chunk:entry};explanationAnchor=anchor;anchor.setAttribute('aria-expanded','true');
 const panel=root.querySelector('#translation-explanation');panel.hidden=false;
 const meaning=esc(entry.meaning).replace(/\([^()]+\)/g,cue=>`<span class="meaning-cue">${cue}</span>`);
 panel.innerHTML=`<div class="explanation-head"><button class="plain" data-action="close-explanation" aria-label="Close explanation">×</button></div><p class="explanation-meaning">${meaning}</p>${ipaGuide(entry.text,l,true)}<button class="quick-grammar" data-action="more-details" aria-label="Open grammar: ${esc(entry.summary||'Grammar')}">${esc(entry.summary||'Grammar')}</button>`;
 positionExplanation();
}
window.addEventListener('resize',positionExplanation);
window.addEventListener('scroll',positionExplanation,true);
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#translation-explanation, [data-explain]'))closeExplanation();});
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&explanationAnchor){closeExplanation(true);e.preventDefault();return;}
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.isComposing)return;
 if(!['home','study','ready'].includes(view)||explanationAnchor||document.querySelector('dialog[open]'))return;
 if(e.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]'))return;
 const back=['ArrowLeft','ArrowUp'].includes(e.key);
 const action=view==='ready'?(back?'review-cards':'begin-recall'):back?'prev':view==='home'?'start':'next';
 const button=root.querySelector(`[data-action="${action}"]`);
 if(button){e.preventDefault();if(!button.disabled&&!e.repeat)button.click();}else if(view==='home'&&action==='prev')e.preventDefault();
});
function course(){const coverage=courseCoverage(coursePacks);shell(`<section><h1>Your course.</h1><p class="muted">16 authored units · vocabulary, expressions and contextual practice. Counts describe draft content, not mastery or independent verification.</p><div class="course-units">${coverage.map(({unit,...counts})=>{const items=bank.filter(i=>i.unitId===unit.id);return `<article class="course-unit"><h2>${unit.id.toUpperCase()} · ${esc(unit.title)}</h2><p>${esc(unit.description)}</p><p class="hint">${data.settings.languages.map(l=>`${languages[l].name}: ${counts[l].vocabulary} vocabulary items · ${counts[l].examples}/${counts[l].exampleTarget} examples · ${counts[l].sourceChecked} with scoped source checks`).join('<br>')}</p><button class="secondary" data-unit="${unit.id}" ${items.length?'':'disabled'}>${items.length?'Learn this unit':'Content not yet authored'}</button>${items.some(i=>i.mode==='contrast')?`<button class="plain" data-practice="contrast" data-practice-unit="${unit.id}">Understand the difference</button>`:''}${items.some(i=>i.mode==='transfer')?`<button class="plain" data-practice="transfer" data-practice-unit="${unit.id}">Try new combinations</button>`:''}</article>`;}).join('')}</div></section>`);}
function learningNavigation(action,first,last){return `<nav class="learning-navigation" aria-label="Learning cards"><button data-action="prev" aria-label="Previous learning card" aria-keyshortcuts="ArrowLeft ArrowUp" title="Previous learning card" ${first?'disabled':''}><span aria-hidden="true">↑</span><span class="mobile-nav-label">Previous</span></button><button data-action="${action}" aria-label="${last?'Finish learning':'Next learning card'}" aria-keyshortcuts="ArrowRight ArrowDown" title="${last?'Finish learning':'Next learning card'}"><span aria-hidden="true">↓</span><span class="mobile-nav-label">${last?'Finish learning':'Next'}</span></button></nav>`;}
function home(){if(data.activeDay?.state){shell(`<section class="quiz center"><p class="eyebrow">Day ${data.appDay}</p><h1>Pick up where you left off.</h1><button class="primary" data-action="start">Resume day</button></section>`);return;}const plan=nextSession();if(plan.kind==='review'){
 shell(`<section class="quiz center"><p class="eyebrow"><span class="phase-badge phase-review">Review</span> · Day ${data.appDay}</p><h1>Time to recall.</h1><p class="muted">${plan.pairs.length} ${plan.pairs.length===1?'translation':'translations'} due.</p><button class="primary" data-action="start" aria-keyshortcuts="ArrowRight ArrowDown">Start review</button></section>`);return;
 }const preview=plan.items,item=preview[0];shell(item?`<section class="concept"><div class="study-head"><div class="study-label"><span class="phase-badge phase-new">New</span><span class="eyebrow">Day ${data.appDay} · ${courseMode?esc(unitById(item.unitId)?.title||'Learn'):'Learn'}</span></div><span class="counter">01 <span>/ ${String(preview.length).padStart(2,'0')}</span></span></div><div class="concept-body">${topicLabel(item)}<h1 class="word">${prompt(item)}</h1>${translations(item)}</div>${learningNavigation('start',true,preview.length===1)}</section>`:`<section class="empty center"><div class="eyebrow">Day ${data.appDay}</div><h1>Nothing scheduled.</h1><p class="muted">Choose another unit, adjust new-material settings, or finish this day to move the review schedule forward.</p><button class="primary" data-action="advance-empty">Finish day</button></section>`);}
function study(){const item=lesson[index];shell(`<section class="concept"><div class="study-head"><div class="study-label"><span class="phase-badge phase-new">New</span><span class="eyebrow">Day ${data.appDay} · ${courseMode?esc(unitById(item.unitId)?.title||'Learn'):'Learn'}</span></div><span class="counter">${String(index+1).padStart(2,'0')} <span>/ ${String(lesson.length).padStart(2,'0')}</span></span></div><div class="concept-body">${topicLabel(item)}<h1 class="word">${prompt(item)}</h1>${translations(item)}<details class="note"><summary>Usage note</summary><p>${notes[item.type]}</p></details></div>${learningNavigation('next',index===0,index===lesson.length-1)}</section>`);}
function answerSoundControl(){return `<button type="button" class="plain answer-sound" data-action="answer-sound" aria-pressed="${data.settings.answerSound!==false}">Answer sound: ${data.settings.answerSound!==false?'on':'off'}</button>`;}
function correctTranslation(q){return `<span class="correct-translation"><strong lang="${q.lang}">${translationChunks(q.item,q.lang)}</strong><button type="button" class="plain" data-action="replay-answer" aria-label="Listen to the correct translation in ${languages[q.lang].name}" title="Listen"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></svg></button></span><div id="translation-explanation" class="explanation" hidden></div>`;}
function playAnswerFeedback(q){
 root.querySelector('.quiz')?.classList.add(feedback.correct?'answer-correct':'answer-incorrect');
 answerAudio.play({correct:feedback.correct,text:q.item[q.lang],locale:languages[q.lang].locale,label:languages[q.lang].name,enabled:data.settings.answerSound!==false});
}
function settings(){shell(`<section class="settings"><button class="plain back" data-action="home">← Back to learning</button><div class="settings-heading"><h1>Settings</h1></div><div id="account-settings" class="settings-section"></div><div class="settings-section sound-setting"><div><h2>Answer sound</h2><p class="hint">Quiet feedback and pronunciation.</p></div><button class="sound-toggle" data-action="answer-sound" role="switch" aria-label="Answer sound" aria-checked="${data.settings.answerSound!==false}"><span></span></button></div><div class="settings-section"><h2>Languages</h2><div class="langs">${Object.entries(languages).map(([id,l])=>`<button class="lang ${data.settings.languages.includes(id)?'selected':''}" data-lang="${id}" aria-pressed="${data.settings.languages.includes(id)}">${l.name}<span>${data.settings.languages.includes(id)?'✓':'+'}</span></button>`).join('')}</div></div><details class="routine"><summary>Session structure</summary><p class="muted">Up to 9 new concepts per app-day. Due reviews come first; new material fits into the remaining 108-answer budget.</p><div class="counts">${[['noun','Nouns',16],['verb','Verbs',8],['grammar','Grammar',4],['sentence','Sentences',6]].map(([id,label,max])=>`<label>${label}<input aria-label="${label}" data-setting="${id}" type="number" min="0" max="${max}" value="${data.settings[id]}"></label>`).join('')}</div><p class="muted">Changes apply to the next unstarted app-day. An unfinished day keeps its original batch.</p><div class="session-facts"><div class="stat"><span>Reviews</span><span>One attempt · 4 → 32 → graduate</span></div><div class="stat"><span>New material</span><span>1 perfect round</span></div><div class="stat"><span>App-day limit</span><span>108 planned answers</span></div></div></details><details class="routine"><summary>Content reports</summary><p class="muted">Report an issue from the Grammar overlay or after checking a recall answer. Sign in to send reports privately to the maintainer.</p><button class="secondary" data-action="export-reports">Export older local reports</button><p id="report-export-status" role="status"></p></details><details class="routine"><summary>About</summary><p class="muted">Perlingo teaches Spanish, French, and German side by side.</p><p class="muted">Content quality: structural checks pass, and selected translations and forms have been compared with reference sources. Source checks are incomplete, and the full course has not received independent linguistic review. Errors may remain. Report an issue from Grammar or after checking a recall answer.</p><p class="muted">Pronunciation guides are generated by eSpeak NG and may differ from natural speech or regional accents. Charts demonstrate individual sounds, not whole-word pronunciation.</p><p><a href="about.html" target="_blank" rel="noopener">About Perlingo</a> · <a href="privacy.html" target="_blank" rel="noopener">Privacy policy</a> · <a href="src/audio/ipa/ATTRIBUTION.md" target="_blank" rel="noopener">Audio credits</a> · <a href="content-review.html" target="_blank" rel="noopener">Content sources</a></p></details></section>`);}
const isReview=()=>practiceMode==='production'&&sessionPlan?.kind==='review';
const accents={es:'áéíóúüñ',fr:'àâçéèêëîïôùûüÿœ',de:'äöüß'};
function stageRecall(){view='ready';render();}
function recallReady(){
 shell(`<section class="quiz recall-ready center"><div class="ready-body"><p class="eyebrow">Recall</p><h1>Ready?</h1></div><nav class="learning-navigation" aria-label="Recall preparation"><button data-action="review-cards" aria-label="Back to learning cards" aria-keyshortcuts="ArrowLeft ArrowUp" title="Back to learning cards"><span aria-hidden="true">↑</span><span class="mobile-nav-label">Back to cards</span></button><button data-action="begin-recall" aria-label="Begin recall" aria-keyshortcuts="ArrowRight ArrowDown" title="Begin recall"><span aria-hidden="true">↓</span><span class="mobile-nav-label">Begin recall</span></button></nav></section>`);
}
function startRound(){queue=practiceMode==='production'?shuffle(sessionPlan.pairs):questions(lesson,data.settings.languages);qi=0;mistakes=0;feedback=null;draftInput='';view='quiz';render();}
function quiz(){if(practiceMode==='contrast'){contrastQuiz();return;}const q=queue[qi];shell(`<section class="quiz typed ${isReview()?'review-card':''}"><div class="study-head"><span class="eyebrow">${practiceMode==='transfer'?'New combinations':practiceMode==='production'&&sessionPlan?.kind==='review'?'Review':'Recall'} <span class="round-label">${isReview()?`· Day ${data.appDay}`:`· Round ${round}`}</span></span><span class="counter">${qi+1} / ${queue.length}</span></div>${topicLabel(q.item)}<h1 class="word">${prompt(q.item)}</h1><form id="recall-form"><label class="badge" for="recall-answer">In ${languages[q.lang].name}</label><input id="recall-answer" class="typed-answer ${feedback?(feedback.correct?'correct':'incorrect'):''}" name="answer" lang="${q.lang}" type="text" value="${esc(feedback?.input??draftInput)}" placeholder="Your translation" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-describedby="answer-hint answer-feedback" ${feedback?'readonly':''}><details class="input-tools" ${feedback?'hidden':''}><summary>Special characters <span aria-hidden="true">+</span></summary><div class="accent-keys" aria-label="Accented letters">${[...accents[q.lang]].map(c=>`<button type="button" data-accent="${c}" aria-label="Insert ${c}" ${feedback?'disabled':''}>${c}</button>`).join('')}</div></details><p id="answer-hint" class="hint input-hint">Include articles and accents. “I don’t know” reveals the answer and counts as a miss.</p><div id="answer-feedback" class="typed-feedback ${feedback?.correct?'is-correct':''}" role="status" aria-live="polite">${feedback?`${feedback.correct?'✓ Correct':`<span class="muted">${feedback.skipped?'Answer':'Correct translation'}</span>`}${correctTranslation(q)}`:''}</div>${feedback?'<button type="button" class="plain" data-action="report-answer">Report an issue with this answer</button>':''}<div class="actions">${feedback?`<span class="hint">${feedback.correct?'':isReview()?'Returns in 4 app-days.':'Review again next round.'}</span><button type="button" class="primary" data-action="continue">${qi===queue.length-1?(isReview()?'Finish review':'Finish round'):'Continue'} →</button>`:'<button type="button" class="plain" data-action="skip">I don’t know</button><button class="primary" type="submit">Check <span class="key-hint" aria-hidden="true">↵</span></button>'}</div></form></section>`);root.querySelector(feedback?'[data-action="continue"]':'#recall-answer')?.focus({preventScroll:true});}
function submitAnswer(skipped=false){if(view!=='quiz'||feedback)return;const input=root.querySelector('#recall-answer').value;if(!skipped&&!input.trim()){root.querySelector('#answer-feedback').textContent='Type an answer, or choose “I don’t know”.';return;}
 const q=queue[qi],ok=!skipped&&checkAnswer(input,[q.item[q.lang],...(q.item.acceptedAnswers?.[q.lang]||[])]);answers++;correct+=Number(ok);mistakes+=Number(!ok);const k=key(q.item.id,q.lang);if(!(k in first))first[k]=ok;feedback={input,correct:ok,skipped};render();playAnswerFeedback(q);}
function contrastQuiz(){const q=queue[qi];shell(`<section class="quiz typed"><div class="study-head"><span class="eyebrow">Understand the difference · Round ${round}</span><span class="counter">${qi+1} / ${queue.length}</span></div><span class="badge">${languages[q.lang].name}</span><h1 class="word" lang="${q.lang}">${esc(q.item[q.lang])}</h1><p class="muted">Which meaning matches this sentence?</p><div class="contrast-choices">${(q.choices??=contrastChoices(q.item)).map(choice=>`<button class="secondary" data-choice="${esc(choice)}" ${feedback?'disabled':''}>${esc(choice)}</button>`).join('')}</div><div role="status">${feedback?`${feedback.correct?'✓ Correct':`Correct meaning: ${esc(q.item.en)}`}${correctTranslation(q)}`:''}</div>${feedback?`<button class="plain" data-action="report-answer">Report an issue with this answer</button><div class="actions"><button class="primary" data-action="continue">${qi===queue.length-1?(isReview()?'Finish review':'Finish round'):'Continue'} →</button></div>`:''}</section>`);root.querySelector(feedback?'[data-action="continue"]':'[data-choice]')?.focus({preventScroll:true});}
function roundEnd(){shell(`<section class="card quiz center summary-view"><div class="eyebrow">Round ${round} complete</div><h1>A little more practice.</h1><p class="muted">${mistakes} ${mistakes===1?'answer':'answers'} missed. One perfect round is all you need.</p><button class="primary" data-action="another">Try another round →</button><p class="muted" style="margin-top:20px">Same concepts. A fresh order.</p></section>`);}
function complete(){
 const now=Date.now(),pairs=practiceMode==='production'?sessionPlan.pairs:questions(lesson,data.settings.languages);
 let dayFinished=false;
 if(practiceMode==='production'){
  const batch=data.activeDay,refs=batch.phase==='review'?batch.reviews:batch.fresh;
  data.history=applyPhase(data.history,refs,first,batch.day,batch.phase);
  if(batch.phase==='review'&&batch.fresh.length){batch.phase='new';batch.state=null;}
  else{data.appDay++;data.activeDay=null;dayFinished=true;}
 }
 result={date:new Date(now).toISOString(),concepts:lesson.length,pairs:pairs.length,rounds:round,accuracy:Math.round(correct/answers*100),duration:now-started,languages:[...new Set(pairs.map(q=>q.lang))],...(practiceMode==='production'?{sessionKind:sessionPlan.kind,appDay:dayFinished?data.appDay-1:data.appDay,dayFinished}:{}),...(courseMode?{unitId:currentUnit(),mode:practiceMode}:{})};data.sessions.push(result);view='results';save();render();
}
function results(){const production=practiceMode==='production';shell(`<section class="card quiz center summary-view"><div class="eyebrow">${production?`Day ${result.appDay}`:`Session ${data.sessions.length}`}</div><h1>${production?(result.dayFinished?'Day complete.':'Reviews complete.'):'Practice complete.'}</h1><p class="muted">${isReview()?'One attempt per translation. Your next reviews are scheduled.':'One perfect round. Done.'}</p><div class="metrics"><div class="metric"><strong>${result.accuracy}%</strong><span class="muted">accuracy</span></div><div class="metric"><strong>${result.pairs}</strong><span class="muted">translations</span></div><div class="metric"><strong>${result.rounds}</strong><span class="muted">rounds</span></div></div><button class="primary" data-action="home">${production?(result.dayFinished?`Continue to Day ${data.appDay}`:'Learn new material'):'Back to practice'} →</button></section>`);}
function history(){shell(`<div class="intro"><div><div class="eyebrow">Your learning journal</div><h1>Small sessions add up.</h1><p class="muted">Your progress lives in this browser. Export a backup to keep it.</p></div><button class="secondary" data-action="export">Export progress ↓</button></div><div class="metrics"><div class="metric"><strong>${data.sessions.length}</strong>completed sessions</div><div class="metric"><strong>${Object.keys(data.history).length}</strong>language pairs studied</div><div class="metric"><strong>${due()}</strong>pairs due for review</div></div><div class="card"><h2>Session history</h2>${data.sessions.length?[...data.sessions].reverse().map(s=>`<div class="history-row"><span>${new Date(s.date).toLocaleDateString()}<br><small class="muted">${s.languages.map(l=>languages[l].name).join(' · ')}</small></span><span>${s.pairs} translations<br><small class="muted">${s.accuracy}% · ${s.rounds} rounds · ${duration(s.duration)}</small></span></div>`).join(''):'<p class="muted">Your first session starts a new story. Complete a challenge to see it here.</p>'}</div>`);}
root.addEventListener('input',e=>{if(e.target.id==='recall-answer'){draftInput=e.target.value;persistDay();return;}const id=e.target.dataset.setting;if(id){data.settings[id]=Math.max(0,Math.min(Number(e.target.max),Math.floor(Number(e.target.value)||0)));save();}});
root.addEventListener('change',e=>{const id=e.target.dataset.setting;if(id){data.settings[id]=Math.max(0,Math.min(Number(e.target.max),Math.floor(Number(e.target.value)||0)));save();}});
root.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;const a=b.dataset.action;if(b.dataset.lang){const l=b.dataset.lang;const list=data.settings.languages;if(list.includes(l)){if(list.length>1)data.settings.languages=list.filter(x=>x!==l);}else data.settings.languages=Object.keys(languages).filter(x=>list.includes(x)||x===l);save();render();return;}
if(b.dataset.practice&&courseMode){persistDay();practiceMode=b.dataset.practice;data.settings.unitId=b.dataset.practiceUnit;lesson=practiceItems(bank,currentUnit(),practiceMode);if(!lesson.length)return;round=1;answers=0;correct=0;first={};started=Date.now();save();startRound();return;}
if(b.dataset.choice!==undefined&&practiceMode==='contrast'&&view==='quiz'&&!feedback){const q=queue[qi],input=b.dataset.choice,ok=input===q.item.en;answers++;correct+=Number(ok);mistakes+=Number(!ok);const k=key(q.item.id,q.lang);if(!(k in first))first[k]=ok;feedback={input,correct:ok};render();playAnswerFeedback(q);return;}
if(b.dataset.unit&&courseMode&&bank.some(i=>i.unitId===b.dataset.unit)){data.settings.unitId=b.dataset.unit;save();view='home';render();return;}
if(a==='export-reports'){root.querySelector('#report-export-status').textContent=exportReports();return;}
if(a==='restart-day'&&data.activeDay?.restartHistory){
 answerAudio.stop();
 if(!confirm(`Restart Day ${data.appDay}? This clears today's answers and completed review results, then repeats the same reviews and new material. Earlier days stay saved.`))return;
 data=restartDay(data);practiceMode='production';sessionPlan=nextSession();lesson=sessionPlan.items;
 index=0;round=1;qi=0;queue=[];feedback=null;mistakes=0;answers=0;correct=0;first={};draftInput='';result=null;started=Date.now();
 if(sessionPlan.kind==='review')startRound();else{view='study';render();}return;
}
if(a==='pronunciation-preferences'){pronunciationControl.open(b);return;}
if(a==='answer-sound'){data.settings.answerSound=data.settings.answerSound===false;save();answerAudio.stop();if(b.getAttribute('role')==='switch')b.setAttribute('aria-checked',String(data.settings.answerSound));else{b.textContent=`Answer sound: ${data.settings.answerSound?'on':'off'}`;b.setAttribute('aria-pressed',String(data.settings.answerSound));}return;}
if(a==='replay-answer'&&view==='quiz'&&feedback){const q=queue[qi];answerAudio.stop();pronunciation.speak(q.item[q.lang],languages[q.lang].locale,languages[q.lang].name,({state,message})=>{if(b.isConnected){b.dataset.audioState=state;b.title=message||'Listen';}});return;}
if(a==='report-answer'&&view==='quiz'&&feedback){const q=queue[qi];answerAudio.stop();openReport(reportContext(q.item,q.lang,{phase:'recall-feedback',input:feedback.input}),b);return;}
if(a==='pronunciation'&&explanationSelection){const anchor=explanationAnchor,{lang,chunk}=explanationSelection;closeExplanation();openPronunciation(lang,chunk,anchor,pronunciation);return;}
if(a==='more-details'&&explanationSelection){const anchor=explanationAnchor,{item,lang,chunk}=explanationSelection;closeExplanation();openDetails(item,lang,chunk,anchor);return;}
if(a==='close-explanation'){closeExplanation(true);return;}
if(b.dataset.speak||b.dataset.explain){const status=document.querySelector('#audio-status'),l=b.dataset.speak||b.dataset.explain;if(view==='quiz'&&!feedback)return;const item=view==='quiz'?queue[qi].item:view==='home'?nextLesson()[0]:lesson[index];if(view==='quiz')answerAudio.stop();const selected=b.dataset.explain?segments(item,l)[Number(b.dataset.part)]:null;if(selected)showExplanation(selected,l,b,item);const speaker=root.querySelector(`[data-speak="${l}"]`);pronunciation.speak(selected?.text||item[l],languages[l].locale,languages[l].name,({state,message})=>{if(!speaker?.isConnected)return;speaker.dataset.audioState=state;speaker.setAttribute('aria-label',`${state==='loading'?'Loading audio in':state==='playing'?'Playing audio in':'Listen in'} ${languages[l].name}`);if(status?.isConnected)status.textContent=message;});return;}
if(b.dataset.accent){const input=root.querySelector('#recall-answer');if(input&&!feedback){input.setRangeText(b.dataset.accent,input.selectionStart,input.selectionEnd,'end');input.focus();draftInput=input.value;persistDay();}return;}
if(a==='begin-recall'&&view==='ready'){if(e.detail<=1)startRound();return;}
if(a==='review-cards'&&view==='ready'){index=lesson.length-1;view='study';render('prev');return;}
if(a==='skip'){submitAnswer(true);return;}
if(a==='home'||a==='history'||a==='settings'||a==='course'){if(practiceMode==='production')persistDay();else if(['quiz','round'].includes(view)&&!confirm('Leave this practice? Unfinished practice will not be saved.'))return;view=a;render();return;}
if(a==='advance-empty'&&!data.activeDay){const batch=getDay();if(!batch.reviews.length&&!batch.fresh.length){data.appDay++;save();render();}return;}
if(a==='start'){if(data.activeDay?.state){resumeDay();return;}practiceMode='production';data.activeDay=getDay();sessionPlan=nextSession();lesson=sessionPlan.items;if(!lesson.length){data.activeDay=null;save();render();return;}index=lesson.length>1?1:0;round=1;answers=0;correct=0;first={};draftInput='';queue=[];feedback=null;started=Date.now();if(sessionPlan.kind==='review')startRound();else if(lesson.length===1)stageRecall();else{view='study';render('next');}}if(a==='prev'){index--;render('prev');}if(a==='next'){if(index<lesson.length-1){index++;render('next');}else stageRecall();}if(a==='continue'&&feedback){if(qi<queue.length-1){qi++;feedback=null;draftInput='';render();}else if(isReview()||roundPassed(mistakes))complete();else{view='round';render();}}if(a==='another'){round++;startRound();}if(a==='export'){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='perlingo-progress.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}});

root.addEventListener('submit',e=>{if(e.target.id==='recall-form'){e.preventDefault();submitAnswer();}});
root.addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.isComposing||e.repeat))e.preventDefault();});
save();
account=createAccount({config:accountConfig,pack:courseMode?'course':foundationMode?'foundation':'starter',storage:localStorage,
 getGuest:()=>migrateProgress(JSON.parse(localStorage.getItem(storageKey))||{settings:structuredClone(defaults),history:{},sessions:[]}),
 validate:progress=>validProgress(progress)&&(!progress.activeDay||(
  progress.activeDay.day===progress.appDay&&['review','new'].includes(progress.activeDay.phase)&&
  ['reviews','fresh'].every(k=>Array.isArray(progress.activeDay[k])&&progress.activeDay[k].every(p=>itemById.has(p.id)&&languages[p.lang]))&&
  (!progress.activeDay.state||(['study','ready','quiz','round'].includes(progress.activeDay.state.view)&&Array.isArray(progress.activeDay.state.queue)&&progress.activeDay.state.queue.every(p=>itemById.has(p.id)&&languages[p.lang])))
 )),
 apply:progress=>{view='home';practiceMode='production';data=progress;data.activeDay=checkpointDay(data.activeDay,data.history);sessionPlan=null;feedback=null;queue=[];draftInput='';render();},
 onStorageError:()=>{storageError=true;},
});
configureReportSender(report=>account.sendReport(report));
render();
account.start();
