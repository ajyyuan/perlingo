import {tenseExamples} from './tense-examples-data.js';
import {frequencyPilot,pilotEvidence} from './frequency-pilot-data.js';
import {tenseOrder,tenseLabels} from './verb-forms.js';
import {exampleMarkup,sentenceAudio} from './sentence-help.js';
import {esc} from './html.js';
import {createLemmaVoice} from './pronunciation.js';
const voice=createLemmaVoice(),verb=document.querySelector('#verb'),tense=document.querySelector('#tense'),host=document.querySelector('#examples');
let page=0;const pageSize=25;
const ids=Object.keys(frequencyPilot),number=n=>n===null?'unavailable':n.toLocaleString('en');
verb.innerHTML+=ids.map(id=>`<option value="${esc(id)}">${esc(id.split(':')[1])}</option>`).join('');
tense.innerHTML+=tenseOrder.map(t=>`<option value="${t}">${esc(tenseLabels[t])}</option>`).join('');
function sample(id,mode,key){
 const e=(mode==='balanced'?tenseExamples:frequencyPilot)[id][key];
 const href='/lemmas/notes.html#'+encodeURIComponent(id);
 return `<section class="pilot-variant" aria-label="${mode==='balanced'?'Balanced':'Frequency-informed'} example"><h3>${mode==='balanced'?'Balanced':'Frequency-informed'} · ${esc(tenseLabels[key])}</h3>${e.text?`<p class="pilot-sentence" lang="es">${exampleMarkup(e)}${sentenceAudio(e.text)}</p><p class="pilot-translation">${esc(e.translation)}</p>`:`<p>${esc(e.notice)}</p>`}<p class="pilot-links"><a href="${href}">Open interactive card →</a></p></section>`;
}
function render(){
 voice.stop();const all=verb.value==='all',chosen=all?ids.slice(page*pageSize,(page+1)*pageSize):[verb.value];
 document.querySelector('#pages').hidden=!all;
 document.querySelector('#previous').disabled=page===0;document.querySelector('#next').disabled=(page+1)*pageSize>=ids.length;
 document.querySelector('#range').textContent=`${page*pageSize+1}–${Math.min((page+1)*pageSize,ids.length)} of ${ids.length} verbs`;
 host.innerHTML=chosen.map(id=>{const e=pilotEvidence.entries[id],balancedTense=tense.value==='recommended'?'present':tense.value,pilotTense=tense.value==='recommended'?e.anchorTense:tense.value;
 return `<article class="pilot-verb"><h2 lang="es">${esc(id.split(':')[1])}</h2><div class="pilot-pair">${sample(id,'balanced',balancedTense)}${sample(id,'frequency',pilotTense)}</div><details class="pilot-evidence"><summary>Why this example?</summary><p>${esc(e.reason)}</p><p><strong lang="es">${esc(e.anchor)}</strong>: ${number(e.evidence.count)} occurrences across ${number(e.evidence.channels)} channels. These are corpus spelling counts, not counts of the example sentence or chosen use.</p><table><caption>Present-form candidates · all uses of each spelling</caption><thead><tr><th>Form</th><th>Occurrences</th><th>Channels</th></tr></thead><tbody>${e.presentCandidates.map(c=>`<tr><td lang="es">${esc(c.form)}${c.excludedFromAutomaticRanking?' <span lang="en">(excluded)</span>':''}</td><td>${number(c.count)}</td><td>${number(c.channels)}</td></tr>`).join('')}</tbody></table><p>“Excluded” means a known homograph was not used for automatic ranking; it remains a valid verb form.</p><p>Other tenses preserve the example’s subject where natural; they are not ranked separately by frequency. Commands address you.</p></details></article>`;}).join('');
}
verb.addEventListener('change',()=>{page=0;render();});
for(const [id,step]of [['previous',-1],['next',1]])document.querySelector('#'+id).addEventListener('click',()=>{page=Math.max(0,Math.min(Math.ceil(ids.length/pageSize)-1,page+step));render();host.scrollIntoView({block:'start'});});tense.addEventListener('change',render);
host.addEventListener('click',event=>{const button=event.target.closest('[data-speak]');if(button)voice.speak(button.dataset.speak,'es-ES','Spanish');});
render();
