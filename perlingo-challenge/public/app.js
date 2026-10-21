import {renderFamilyBoard,fitFamilyWords} from './family-board.js';
import {createTree,initialSelection,roundLanguages} from './tree-model.js';
import {openTreePicker} from './tree-picker.js';
import {languages,packs,getEntry} from './content.js';
import {Round,matchesAnswer} from './engine.js';
import {Microphone,createSpeechProvider} from './speech.js';
import {RecordingPlayer,getRecording} from './recordings.js';
const $=s=>document.querySelector(s),app=$('#app');
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{toast('Browser storage is unavailable; this round will not be saved.');}};
let familyTree=null;
let settings={layout:'families',pack:'bread',count:50,study:120,recall:60,window:3,script:'All scripts',guide:'reading',mode:'voice',provider:'elevenlabs',...load('pc-settings-v1',{})};
settings.languageIds=initialSelection(settings,languages);
let history=load('pc-history-v1',[]);if(!Array.isArray(history))history=[];
let screen='home',round=null,selected=[],studyEnd=0,frame=0,run=0,mic=null,session=null,prepared=null,preparedId=null,card=null,settling=false,settleTimer=null,finished=false,transcript='',lastSpeech=0,speaking=false,captureSamples=0,commitAt=0,captureStart=0,toastTimer,status={configured:false};
const pronouncer=new RecordingPlayer();
let tilePlayToken=0;
let provider=createSpeechProvider(settings.provider==='soniox'?'soniox':'elevenlabs');
const pack=()=>packs.find(p=>p.id===settings.pack)||packs[0];
const language=id=>languages.find(l=>l.id===id);
function eligible(){return roundLanguages(languages,settings.languageIds,settings.script);}
function time(ms){const s=Math.ceil(Math.max(0,ms)/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4500);}
function dialog(html){$('#dialog-content').innerHTML=html;$('#dialog').showModal();}
$('#dialog .close').onclick=()=>$('#dialog').close();$('#dialog').onclick=e=>{if(e.target===$('#dialog'))$('#dialog').close();};
$('#about-button').onclick=()=>dialog(`<h2>One word. A world of languages.</h2><p>Study the grid, then recall each translation from a language prompt. Say the word within ${settings.window} seconds. Correct answers earn one point and leave the queue. Passes and timeouts return to the back. Wrong guesses don't end your turn.</p><p>Only confirmed speech transcripts score. Recognition processing pauses the game clock. Typed practice follows the same queue rules, with a separate score history.</p><p class="notice">Voice mode sends microphone audio to your selected provider during recall and mic checks. This app does not save recordings. Provider retention policies apply. Study playback uses cached language-specific audio. Source and check details are linked below the grid. Scores and transcripts stay in this browser.</p><p class="notice">Choose languages from the Glottolog family tree using the language selector. Whole branches select their playable descendants; the rest of the catalog is explorable. Script filters apply to your selected languages. This is a 50-language starter collection, not a verified ranking of the world's most-spoken languages. Flags indicate a representative locale, not ownership of a language. Words, readings, and broad IPA are draft teaching content; regional alternatives and pronunciation review are incomplete. Water uses readings only. <a href="https://en.wiktionary.org/wiki/bread#Translations" target="_blank" rel="noreferrer">Dictionary reference ↗</a></p>`);
$('#history-button').onclick=()=>dialog(`<h2>Recent rounds</h2>${history.length?history.slice(0,12).map(h=>`<div class="history-row"><div><strong>${esc(h.word)}</strong><br><small>${esc(new Date(h.date).toLocaleDateString())} · ${esc(h.mode)} · ${h.study}s study / ${h.recall}s recall / ${h.window}s cards</small></div><strong>${h.score}/${h.total}</strong></div>`).join(''):'<p>Your completed rounds will appear here.</p>'}`);
function compactGrid(ids,result=false){return `<div class="grid">${ids.map(id=>{const l=language(id),e=getEntry(pack().id,id),correct=round?.correct.includes(id);return `<button class="tile ${result?(correct?'success':'missed'):''}" data-play="${id}" aria-label="${getRecording(pack().id,id)?'Hear':'Recording unavailable:'} ${esc(e.word)} in ${l.name}" title="${getRecording(pack().id,id)?'Play pronunciation':'Pronunciation not yet available'}"><span class="tile-top"><span class="flag" aria-hidden="true">${l.flag}</span>${l.name}<span class="speaker" aria-hidden="true">${result&&correct?'✓':getRecording(pack().id,id)?'◖))':'—'}</span></span><span class="word" lang="${id}" dir="auto">${esc(e.word)}</span><span class="reading">${esc(settings.guide==='ipa'&&e.ipa?'/'+e.ipa+'/':settings.guide==='off'?'':e.reading)}</span></button>`;}).join('')}</div>`;}
function tileGrid(ids,result=false){return !result&&settings.layout!=='compact'&&familyTree?renderFamilyBoard(familyTree,ids,group=>compactGrid(group).slice('<div class="grid">'.length,-6)):result?compactGrid(ids,true):compactGrid(ids).replace('<div class="grid">','<div class="grid compact-grid">');}
function layoutToggle(){return `<div class="layout-toggle" role="group" aria-label="Language layout"><button data-layout="families" aria-pressed="${settings.layout!=='compact'}">Families</button><button data-layout="compact" aria-pressed="${settings.layout==='compact'}">Compact</button></div>`;}
function bindLayout(){document.querySelectorAll('[data-layout]').forEach(button=>button.onclick=()=>{settings.layout=button.dataset.layout;save('pc-settings-v1',settings);pronouncer.stop();if(screen==='home')home();else if(screen==='study'){document.querySelector('#study-languages').innerHTML=tileGrid(selected);document.querySelectorAll('[data-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.layout===settings.layout)));bindTiles();}document.querySelector(`[data-layout="${settings.layout}"]`)?.focus();});}
function bindTiles(){fitFamilyWords(app);document.querySelectorAll('[data-play]').forEach(button=>button.onclick=async()=>{
 const token=++tilePlayToken;document.querySelectorAll('.playing').forEach(b=>b.classList.remove('playing'));button.classList.add('playing');
 try{await pronouncer.play(pack().id,getEntry(pack().id,button.dataset.play),language(button.dataset.play));}catch(e){toast(e.message);}finally{if(token===tilePlayToken)button.classList.remove('playing');}
});}
function options(values,current){return values.map(v=>`<option value="${esc(v[0])}" ${String(v[0])===String(current)?'selected':''}>${esc(v[1])}</option>`).join('');}
function home(){cleanup();screen='home';selected=eligible().map(l=>l.id);
 app.innerHTML=`<section class="hero intro-hero"><div><p class="eyebrow"><span class="dot"></span> A LITTLE DAILY LANGUAGE CHAOS</p><h1>One word.<br><em>How far can you go?</em></h1><p class="subtitle">A world of ways to say it. A few seconds to remember.</p></div><div class="word-stamp" aria-hidden="true">${pack().emoji}</div></section>
 <section class="setup" aria-label="Challenge setup"><div class="field"><label for="word-select">YOUR WORD</label><select id="word-select" data-setting="pack">${options(packs.map(p=>[p.id,p.emoji+' '+p.label]),settings.pack)}</select></div><div class="divider"></div><div class="field"><span class="field-label" id="languages-label">LANGUAGES</span><button class="language-picker-button" id="choose-languages" aria-labelledby="languages-label choose-languages" aria-haspopup="dialog">${selected.length} languages <span aria-hidden="true">⌄</span></button></div><div class="field"><label for="study-select">STUDY TIME</label><select id="study-select" data-setting="study">${options([[30,'30 seconds'],[60,'1 minute'],[120,'2 minutes'],[180,'3 minutes']],settings.study)}</select></div><div class="field"><label for="mode-select">RECALL</label><select id="mode-select" data-setting="mode">${options([['voice','◉ Speak'],['typed','⌨ Type']],settings.mode)}</select></div><div class="start-area"><button class="primary" id="start">Start studying <span aria-hidden="true">↗</span></button></div></section>
 <div class="setup-note"><span>${selected.length} languages · ${settings.study}s to study · ${settings.recall}s to recall · ${settings.window}s per answer</span><button class="text-button" id="tune">Adjust challenge</button></div>
 <div class="intro-languages"><details><summary>See the ${selected.length} languages</summary><div class="language-names">${selected.map(id=>'<span>'+esc(language(id).name)+'</span>').join('')}</div></details><select aria-label="Filter by script" id="script-select">${options(['All scripts',...new Set(languages.map(l=>l.script))].map(s=>[s,s]),settings.script)}</select></div>
 ${!selected.length?'<p class="empty-selection">No languages match this script. Change the filter or edit your selection.</p>':''}
 <ol class="intro-steps"><li><span>01</span><div><strong>Study</strong><p>Reveal the words. Tap to listen.</p></div></li><li><span>02</span><div><strong>Recall</strong><p>${settings.mode==='voice'?'Say':'Type'} the word for each language.</p></div></li><li><span>03</span><div><strong>Try again</strong><p>Passed languages come back around.</p></div></li></ol>
 <p class="intro-reveal">Translations appear when your study timer starts.</p>
 <div class="footer-line intro-footer"><a href="/tree.html">Explore the language tree ↗</a><a href="/forest.html">Pronunciation forest ↗</a><a href="/audio-sources.html" target="_blank" rel="noreferrer">Audio sources ↗</a></div>`;
 document.querySelectorAll('[data-setting]').forEach(el=>el.onchange=()=>{settings[el.dataset.setting]=['count','study'].includes(el.dataset.setting)?Number(el.value):el.value;save('pc-settings-v1',settings);home();});
 $('#script-select').onchange=e=>{settings.script=e.target.value;save('pc-settings-v1',settings);home();};
 $('#tune').onclick=tune;$('#start').disabled=!selected.length;$('#start').onclick=startStudy;$('#choose-languages').onclick=()=>{pronouncer.stop();openTreePicker({languages,selected:settings.languageIds,script:settings.script,onApply:ids=>{settings.languageIds=ids;save('pc-settings-v1',settings);home();$('#choose-languages').focus();}});};
}
function tune(){dialog(`<h2>Your challenge</h2><div class="field"><label for="speech-provider">Recognition</label><select id="speech-provider">${options([['elevenlabs','ElevenLabs'],['soniox','Soniox']],settings.provider)}</select></div><p><a href="/speech-lab.html">Compare recognition →</a></p><div class="settings-grid"><div class="field"><label for="recall-duration">Recall time</label><select id="recall-duration">${options([[30,'30 seconds'],[60,'1 minute'],[90,'90 seconds'],[120,'2 minutes']],settings.recall)}</select></div><div class="field"><label for="card-duration">Time per language</label><select id="card-duration">${options([[3,'3 seconds'],[5,'5 seconds'],[8,'8 seconds']],settings.window)}</select></div></div><p class="notice">The clock pauses while speech results resolve. Passing never reveals an answer.</p><button class="primary" id="save-settings">Done</button>`);$('#save-settings').onclick=()=>{settings.provider=$('#speech-provider').value;provider=createSpeechProvider(settings.provider);settings.recall=Number($('#recall-duration').value);settings.window=Number($('#card-duration').value);save('pc-settings-v1',settings);$('#dialog').close();home();};}
function guideControls(){return '<div class="filters" role="group" aria-label="Pronunciation guide">'+['reading','ipa','off'].map(g=>'<button class="chip '+(g===settings.guide?'active':'')+'" aria-pressed="'+(g===settings.guide)+'" data-guide="'+g+'" '+(g==='ipa'&&pack().id==='water'?'disabled title="IPA is available for Bread; Water uses readings."':'')+'>'+(g==='reading'?'Reading':g==='ipa'?'IPA':'Word only')+'</button>').join('')+'</div>';}
function bindGuide(){document.querySelectorAll('[data-guide]').forEach(el=>el.onclick=()=>{
 settings.guide=el.dataset.guide;save('pc-settings-v1',settings);
 document.querySelector('#study-languages').innerHTML=tileGrid(selected);
 document.querySelectorAll('[data-guide]').forEach(b=>{b.classList.toggle('active',b.dataset.guide===settings.guide);b.setAttribute('aria-pressed',String(b.dataset.guide===settings.guide));});bindTiles();
});}
function startStudy(){if(!eligible().length)return;pronouncer.stop();screen='study';selected=eligible().map(l=>l.id);studyEnd=performance.now()+settings.study*1000;
 app.innerHTML=`<div class="study-header"><div><p class="eyebrow">STUDY · ${selected.length} LANGUAGES</p><h1>${pack().emoji} ${pack().label}</h1></div><div class="clock" id="study-clock">${time(settings.study*1000)}</div><button class="secondary" id="finish-study">I'm ready →</button></div><div class="progress-track study-progress"><div class="progress-fill" id="study-progress"></div></div>${`<div class="study-layout">${layoutToggle()}${guideControls()}</div><div id="study-languages">${tileGrid(selected)}</div>`}<div class="footer-line"><span>Tap to hear. Revisit anything.</span><button class="text-button" id="quit-study">End round</button></div>`;
 $('#finish-study').onclick=()=>ready();$('#quit-study').onclick=home;bindTiles();bindLayout();bindGuide();
 function tick(){if(screen!=='study')return;const left=studyEnd-performance.now();$('#study-clock').textContent=time(left);$('#study-progress').style.width=Math.max(0,left/(settings.study*1000)*100)+'%';if(left<=0){ready();return;}frame=requestAnimationFrame(tick);}tick();
}
function ready(error='',resume=false){cleanup();screen='ready';if(!resume)round=new Round(selected,{seconds:settings.recall,windowSeconds:settings.window});else round?.cancel();
 app.innerHTML=`<section class="center-stage"><p class="eyebrow">${resume?'ROUND PAUSED':'STUDY COMPLETE'}</p><div class="ready-symbol">${pack().emoji}</div><h1>${resume?'Let’s reconnect.':'Now, make it stick.'}</h1><p class="subtitle">${resume?'Your score is safe. The current card will restart.':`${settings.mode==='voice'?'Say':'Type'} “${pack().label.toLowerCase()}” in the language you see.`}</p><div class="rules"><div><strong>${selected.length}</strong>languages</div><div><strong>${settings.window}s</strong>per answer</div><div><strong>${time(round.remaining)}</strong>on the clock</div></div>${error?`<div class="error" role="alert">${esc(error)}</div>`:''}<div class="actions"><button class="primary" id="begin-recall">${settings.mode==='voice'?'Enable mic & start':'Start typed recall'} →</button>${settings.mode==='voice'?'<button class="secondary" id="mic-check">Check microphone</button>':''}</div><p class="notice">${settings.mode==='voice'?`Your voice is sent to ${settings.provider==='soniox'?'Soniox':'ElevenLabs'} for recognition.`:'Type an answer and press Enter.'} Pass or time out to try that language again.</p><button class="text-button" id="back-home">End round</button></section>`;
 $('#begin-recall').onclick=beginRecall;$('#mic-check')?.addEventListener('click',micCheck);$('#back-home').onclick=home;
}
async function micCheck(){
 const generation=++run;let testMic,testSession;
 dialog('<h2>Microphone check</h2><p>Say “hello” in English. This check does not affect your score.</p><p id="mic-status">Connecting…</p><div class="mic-bars">'+Array(7).fill('<i></i>').join('')+'</div><p id="mic-transcript"></p>');
 const stop=()=>{run++;testMic?.close();testSession?.close();};$('#dialog').addEventListener('close',stop,{once:true});
 try{
  testMic=new Microphone();await testMic.open(level=>{document.querySelectorAll('.mic-bars i').forEach((el,i)=>el.style.height=Math.min(40,5+level*300*(1+i%3))+'px');});
  if(generation!==run){testMic.close();return;}
  testSession=await provider.prepare('en');if(generation!==run){testMic.close();testSession.close();return;}
  $('#mic-status').textContent='Listening…';testSession.onTranscript=r=>{if($('#mic-transcript'))$('#mic-transcript').textContent=r.text;};testSession.onError=e=>{if($('#mic-status'))$('#mic-status').textContent=e.message;};
  let bytes=0;testMic.onAudio=(buffer)=>{testSession.push(buffer);bytes+=buffer.byteLength;if(bytes>=32000){testSession.commit();bytes=0;}};
 }catch(e){testMic?.close();testSession?.close();if($('#mic-status'))$('#mic-status').textContent=e.message;}
}
function cleanup(){run++;cancelAnimationFrame(frame);clearTimeout(settleTimer);pronouncer.stop();mic?.close();mic=null;session?.close();session=null;prepared?.then(s=>s?.close()).catch(()=>{});prepared=null;preparedId=null;card=null;settling=false;}
async function beginRecall(){
 cleanup();const generation=run;screen='connecting';$('#begin-recall').disabled=true;$('#begin-recall').textContent='Connecting…';finished=false;
 try{
  if(settings.mode==='voice'){const opened=new Microphone();await opened.open();if(generation!==run){opened.close();return;}mic=opened;}
  await nextCard(generation);
 }catch(e){if(generation===run)ready(e.message,true);}
}
function warmNext(){
 if(settings.mode!=='voice'||round.queue.length<2||prepared)return;
 const id=round.queue[1],generation=run;preparedId=id;
 prepared=provider.prepare(id).then(s=>{if(generation!==run){s.close();return null;}return s;}).catch(()=>null);
}
async function nextCard(generation=run){
 if(generation!==run)return;if(round.done){results();return;}
 session?.close();session=null;settling=false;clearTimeout(settleTimer);screen='connecting';
 if($('#listen-state'))$('#listen-state').textContent='Getting ready…';
 if(settings.mode==='voice'){
  let candidate=null;
  if(prepared&&preparedId===round.queue[0]){const promise=prepared;prepared=null;preparedId=null;candidate=await promise;}
  if(generation!==run){candidate?.close();return;}
  if(!candidate)candidate=await provider.prepare(round.queue[0]);
  if(generation!==run){candidate.close();return;}if(candidate.failed){candidate.close();throw candidate.failed;}session=candidate;
 }
 screen='recall';card=round.begin(performance.now());transcript='';captureSamples=0;speaking=false;lastSpeech=0;commitAt=0;
 const l=language(card.id);app.innerHTML=`<section class="center-stage"><div class="recall-top"><span class="score"><strong id="score">${round.correct.length}</strong><span> / ${selected.length}</span></span><span class="eyebrow">${pack().emoji} ${pack().label.toUpperCase()}</span><span class="clock" id="round-clock">${time(round.remaining)}</span></div><div class="recall-card"><span class="flag" aria-hidden="true">${l.flag}</span><h1>${l.name}</h1><div class="progress-track"><div class="progress-fill" id="card-progress"></div></div><div class="listening" id="listen-state">${settings.mode==='voice'?'Listening…':'Type the word below'}</div>${settings.mode==='typed'?'<form id="answer-form"><input class="answer-input" id="answer" aria-label="Your answer" autocomplete="off" autocapitalize="off" spellcheck="false"><button type="submit" class="text-button">Check ↵</button></form>':'<p class="partial" id="partial" aria-live="off"></p>'}</div><div class="recall-bottom"><div class="dots" aria-label="${round.correct.length} of ${selected.length} correct">${selected.map(id=>`<i class="${round.correct.includes(id)?'done':''}"></i>`).join('')}</div><button class="pass" id="pass">Pass <span class="shortcut">Space</span></button></div><button class="text-button" id="end">End round</button></section>`;
 $('#pass').onclick=()=>finish('pass');$('#end').onclick=results;
 if(settings.mode==='typed'){$('#answer').focus();$('#answer-form').onsubmit=e=>{e.preventDefault();if(settling||performance.now()>card.start+card.duration)return;const text=$('#answer').value;if(matchesAnswer(text,getEntry(pack().id,card.id).accepted,card.id))finish('correct',text);else{$('#listen-state').textContent='Keep trying…';$('#answer').select();}};}
 if(session){
  const token=card.token,entry=getEntry(pack().id,card.id);
  captureStart=mic.context.currentTime;mic.reset(token);session.push(new ArrayBuffer(6400));
  session.onError=e=>{if(card?.token===token)ready(e.message,true);};
  session.onTranscript=r=>{
   if(card?.token!==token||generation!==run)return;
   if(r.text)transcript=r.text;
   if($('#partial'))$('#partial').textContent=r.text;
   if(r.final&&matchesAnswer(r.text,entry.accepted,entry.id)){finish('correct',r.text);return;}
   // If a previous finalization was still pending at the deadline, flush its trailing audio now.
   if(r.final&&settling&&session?.uncommitted)session.commit();

  };
  mic.onAudio=(buffer,level,audioToken,startTime)=>{
   if(audioToken!==token)return;
   if(!card||card.token!==token||screen!=='recall')return;
   const now=performance.now();
   // Timestamp clipping keeps the final buffered samples and excludes all post-deadline speech.
   const from=Math.max(0,Math.ceil((captureStart-startTime)*16000));
   const to=Math.min(buffer.byteLength/2,Math.floor((captureStart+card.duration/1000-startTime)*16000));
   if(to<=from)return;
   const clipped=buffer.slice(from*2,to*2);captureSamples+=clipped.byteLength/2;session.push(clipped);
   if(level>.012){speaking=true;lastSpeech=now;}
   if(speaking&&now-lastSpeech>=400&&now-commitAt>=1000){if(session.commit()){commitAt=now;speaking=false;}}
  };
 }
 warmNext();tick();
}
function tick(){if(screen!=='recall'||!card||settling)return;const elapsed=performance.now()-card.start;$('#round-clock').textContent=time(round.remaining-Math.min(elapsed,card.duration));$('#card-progress').style.width=Math.max(0,100-elapsed/card.duration*100)+'%';if(elapsed>=card.duration){expire();return;}frame=requestAnimationFrame(tick);}
function expire(){if(!card||settling)return;settling=true;cancelAnimationFrame(frame);$('#card-progress').style.width='0%';$('#listen-state').textContent=settings.mode==='voice'?'Checking…':'Next language…';$('#pass').disabled=true;
 if(settings.mode==='voice'){settleTimer=setTimeout(()=>{if(mic)mic.onAudio=null;session?.commit();settleTimer=setTimeout(()=>{if(session?.pending>0)ready('Speech results took too long. Try this card again.',true);else finish('timeout',transcript);},1500);},100);}else finish('timeout',transcript);
}
function finish(outcome,text=''){
 if(!card||!['recall','connecting'].includes(screen))return;const current=card;
 const now=Math.min(performance.now(),current.start+current.duration);
 if(outcome==='pass'&&settling)return;
 if(!round.finish(current.token,outcome,now,text))return;
 card=null;if(mic)mic.onAudio=null;session?.close();session=null;clearTimeout(settleTimer);cancelAnimationFrame(frame);
 if(outcome==='correct')toast('✓ '+language(current.id).name);
 const generation=run;nextCard(generation).catch(e=>{if(generation===run)ready(e.message,true);});
}
function results(){if(finished)return;finished=true;const last=card;if(last){round.finish(last.token,'pass',Math.min(performance.now(),last.start+last.duration),transcript);}cleanup();screen='results';
 const record={date:new Date().toISOString(),word:pack().label,pack:pack().id,score:round.correct.length,total:selected.length,mode:settings.mode,provider:settings.mode==='voice'?settings.provider:null,study:settings.study,recall:settings.recall,window:settings.window,correct:round.correct,attempts:round.attempts};history=[record,...history].slice(0,30);save('pc-history-v1',history);
 app.innerHTML=`<section class="results-head"><p class="eyebrow" style="justify-content:center">${pack().emoji} ${pack().label.toUpperCase()} · ROUND COMPLETE</p><div class="result-number">${round.correct.length}<span> / ${selected.length}</span></div><h2>${round.correct.length===selected.length?'Around the world. Every word.':round.correct.length?'Look how far you went.':'The first round is a starting point.'}</h2><p class="result-meta">${settings.mode==='voice'?'Spoken':'Typed'} recall · ${settings.study}s study · ${settings.recall}s recall · ${settings.window}s per language</p><div class="actions"><button class="primary" id="again">Another round ↗</button><button class="secondary" id="share">Copy score</button><button class="secondary" id="export">Export results</button></div></section><div class="toolbar"><h2>Your words <span class="count">Tap to listen again</span></h2><span class="badge">${round.correct.length} remembered</span></div>${tileGrid(selected,true)}<details><summary>Review attempts</summary><table><thead><tr><th>Language</th><th>Heard / typed</th><th>Result</th></tr></thead><tbody>${round.attempts.map(a=>`<tr><td>${language(a.id).name}</td><td>${esc(a.transcript||'—')}</td><td>${a.outcome==='correct'?'✓ Correct':a.outcome==='pass'?'Passed':'Time out'}</td></tr>`).join('')}</tbody></table></details>`;
 bindTiles();$('#again').onclick=home;$('#share').onclick=async()=>{const text=`Perlingo Challenge ${pack().emoji}\nOne word: ${pack().label}. ${selected.length} languages.\n${round.correct.length}/${selected.length} · ${settings.study}s study / ${settings.recall}s recall / ${settings.window}s per answer · ${settings.mode}`;try{await navigator.clipboard.writeText(text);toast('Score copied.');}catch{dialog(`<h2>Your score</h2><p>${esc(text).replaceAll('\n','<br>')}</p>`);}};
 $('#export').onclick=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(record,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='perlingo-challenge-results.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]'))return;if(screen==='recall'&&e.code==='Space'&&!['INPUT','TEXTAREA'].includes(e.target.tagName)){e.preventDefault();if(!e.repeat)finish('pass');}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){if($('#dialog').open)$('#dialog').close();pronouncer.stop();if(['recall','connecting'].includes(screen))ready('The round paused because you switched away.',true);}});
window.addEventListener('pagehide',cleanup);
fetch('/api/status').then(r=>r.json()).then(data=>status=data).catch(()=>{});
app.innerHTML='<p class=notice role=status>Loading languages…</p>';
try{const response=await fetch('/language-tree.json');if(!response.ok)throw Error();familyTree=createTree(await response.json(),languages);}catch{}
addEventListener('resize',()=>fitFamilyWords(app));
home();
