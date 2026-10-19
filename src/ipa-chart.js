import {helpLink} from './help-overlay.js';
import {ipaSounds} from './content/ipa-sounds.js';
import {ipaData} from './content/ipa-data.js';
import {ipaTokens} from './ipa-tokens.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Include engine variants and loanword sounds actually used by the course, too.
const inventories=Object.fromEntries(Object.entries(ipaData).map(([lang,data])=>[lang,new Set(Object.values(data).flatMap(ipa=>ipaTokens(ipa).filter(t=>t.sound).map(t=>t.text)))]));
export function soundsFor(kind,language){return ipaSounds.filter(s=>s.kind===kind&&(language==='all'||s.languages.includes(language)||inventories[language]?.has(s.symbol)));}
const button=s=>`<button type="button" data-ipa-sound="${esc(s.symbol)}" aria-label="Hear ${esc(s.symbol)}: ${esc(s.name)}" aria-pressed="false" title="${esc(s.name)}"><span lang="und-fonipa">${esc(s.symbol)}</span></button>`;
const vowels=[['i y',18,12],['u',88,12],['ɪ ʏ',29,26],['ʊ',77,26],['e ø',30,39],['o',88,39],['ə',61,52],['ɛ œ',42,66],['ɜ',65,66],['ɔ',88,66],['ɐ',68,79],['a',54,92],['ɑ',88,92]];
function vowelChart(sounds){return `<div class="vowel-chart" role="group" aria-label="Vowel quadrilateral"><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M18 12 H88 V92 H54 Z M30 39 H88 M42 66 H88 M53 12 L71 92"/></svg><span class="axis front">Front</span><span class="axis central">Central</span><span class="axis back">Back</span>${[['Close',12],['Close-mid',39],['Open-mid',66],['Open',92]].map(([label,y])=>`<span class="axis height" style="top:${y}%">${label}</span>`).join('')}${vowels.map(([symbols,x,y])=>`<div class="vowel-pair" style="left:${x}%;top:${y}%">${symbols.split(' ').map(symbol=>sounds.find(s=>s.symbol===symbol)).filter(Boolean).map(button).join('')}</div>`).join('')}</div>${sounds.some(s=>s.row==='Nasalized')?`<div class="supplemental-sounds"><span>Nasal</span>${sounds.filter(s=>s.row==='Nasalized').map(button).join('')}</div>`:''}`;}
const columns=[['Lips','Bilabial'],['Lip/teeth','Labiodental'],['Teeth','Dental'],['Ridge','Alveolar'],['Behind ridge','Postalveolar'],['Palate','Palatal'],['Velum','Velar'],['Uvula','Uvular'],['Glottis','Glottal']];
const rows=[['Stop','Plosive'],['Nasal','Nasal'],['Trill','Trill'],['Tap','Tap / flap'],['Fricative','Fricative'],['Approximant','Approximant'],['Lateral','Lateral approximant']];
const voiceless=new Set(['p','t','k','ʔ','f','θ','s','ʃ','ç','x','h']);
export function chartTable(kind,language){
 const sounds=soundsFor(kind,language);if(kind==='vowels')return vowelChart(sounds);
 const main=sounds.filter(s=>s.row!=='Affricate'&&s.symbol!=='w');
 return `<div class="ipa-table-scroll" tabindex="0" role="region" aria-label="Consonant chart; scroll horizontally if needed"><table class="ipa-chart-table"><thead><tr><th scope="col"></th>${columns.map(([,label])=>`<th scope="col">${label}</th>`).join('')}</tr></thead><tbody>${rows.map(([row,label])=>`<tr><th scope="row">${label}</th>${columns.map(([col])=>{const cell=main.filter(s=>s.row===row&&s.column===col);return `<td><div class="consonant-pair"><span>${cell.filter(s=>voiceless.has(s.symbol)).map(button).join('')}</span><span>${cell.filter(s=>!voiceless.has(s.symbol)).map(button).join('')}</span></div></td>`;}).join('')}</tr>`).join('')}</tbody></table></div><div class="supplemental-sounds"><span>Affricates & coarticulation</span>${sounds.filter(s=>s.row==='Affricate'||s.symbol==='w').map(button).join('')}</div>`;
}
export function chartMarkup(lang){return `<details class="sound-reference"><summary>Sounds</summary><div class="sound-controls"><div class="sound-kinds" role="group" aria-label="Sound type"><button type="button" data-ipa-kind="vowels" aria-pressed="true">Vowels</button><button type="button" data-ipa-kind="consonants" aria-pressed="false">Consonants</button></div><select data-ipa-language aria-label="Chart language"><option value="es" ${lang==='es'?'selected':''}>Spanish</option><option value="fr" ${lang==='fr'?'selected':''}>French</option><option value="de" ${lang==='de'?'selected':''}>German</option><option value="all">All sounds</option></select></div><div data-ipa-table>${chartTable('vowels',lang)}</div><div data-ipa-selection class="ipa-selection" aria-live="polite"></div><p data-ipa-error class="error" role="status"></p></details>`;}
export function mountChart(host,stopSpeech=()=>{}){
 const reference=host.querySelector('.sound-reference');let kind='vowels',player=null,request=0;
 const clear=()=>{request++;if(player){player.pause();player.removeAttribute('src');player.load();player.remove();player=null;}host.querySelectorAll('[data-playing]').forEach(b=>b.removeAttribute('data-playing'));};
 const error=host.querySelector('[data-ipa-error]'),selection=host.querySelector('[data-ipa-selection]'),language=host.querySelector('[data-ipa-language]');
 const render=()=>{clear();error.textContent='';host.querySelector('[data-ipa-table]').innerHTML=chartTable(kind,language.value);selection.innerHTML='';host.querySelectorAll('[data-ipa-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ipaKind===kind)));host.querySelectorAll('[data-transcription-sound]').forEach(b=>b.setAttribute('aria-pressed','false'));};
 host.addEventListener('click',e=>{
  const type=e.target.closest('[data-ipa-kind]');if(type){kind=type.dataset.ipaKind;render();return;}
  const note=e.target.closest('[data-ipa-note]');if(note){stopSpeech();clear();selection.textContent=note.dataset.ipaNote;return;}
  const selected=e.target.closest('[data-ipa-sound], [data-transcription-sound]');if(!selected)return;
  const symbol=selected.dataset.ipaSound||selected.dataset.transcriptionSound,sound=ipaSounds.find(s=>s.symbol===symbol);if(!sound)return;
  if(selected.dataset.transcriptionSound){kind=sound.kind;if(!soundsFor(kind,language.value).some(s=>s.symbol===symbol))language.value='all';render();}
  clear();stopSpeech();window.speechSynthesis?.cancel();error.textContent='';const token=request;
  host.querySelectorAll('[data-ipa-sound], [data-transcription-sound]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.ipaSound||b.dataset.transcriptionSound)===symbol)));
  const chartButton=[...host.querySelectorAll('[data-ipa-sound]')].find(b=>b.dataset.ipaSound===symbol);
  if(selected.dataset.transcriptionSound&&chartButton){const scroller=chartButton.closest('.ipa-table-scroll');if(scroller)scroller.scrollLeft=chartButton.offsetLeft-scroller.clientWidth/2;}
  selection.innerHTML=`<span>${esc(sound.name)}</span>${helpLink('Recording credit',`<p>${esc(sound.author)} · <a href="${esc(sound.source)}" target="_blank" rel="noopener noreferrer">Source</a> · <a href="${esc(sound.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(sound.license)}</a></p><p>Unedited Commons MP3. Some consonants include a surrounding vowel.</p>`,'ⓘ')}`;
  player=new Audio(new URL(`./audio/ipa/${sound.file}`,import.meta.url).href);player.preload='none';player.hidden=true;reference.append(player);
  const failed=()=>{if(token!==request)return;host.querySelectorAll('[data-playing]').forEach(b=>b.removeAttribute('data-playing'));error.textContent='Couldn’t play this recording. Try again.';};
  player.addEventListener('error',failed);player.addEventListener('playing',()=>{if(token===request)chartButton?.setAttribute('data-playing','true');});player.addEventListener('ended',()=>{if(token===request)chartButton?.removeAttribute('data-playing');});player.play().catch(failed);
 });
 language.addEventListener('change',render);reference.addEventListener('toggle',()=>{if(!reference.open)clear();});return clear;
}
