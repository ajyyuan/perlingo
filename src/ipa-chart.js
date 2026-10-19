import {ipaSounds} from './content/ipa-sounds.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function soundsFor(kind,language){return ipaSounds.filter(s=>s.kind===kind&&(language==='all'||s.languages.includes(language)));}
const rowOrder={vowels:['Close','Near-close','Close-mid','Mid','Open-mid','Near-open','Open','Nasalized'],consonants:['Stop','Nasal','Fricative','Affricate','Approximant','Lateral','Tap','Trill']};
const columnOrder={vowels:['Front','Central','Back'],consonants:['Lips','Lip/teeth','Teeth','Ridge','Behind ridge','Palate','Velum','Uvula','Glottis']};
export function chartTable(kind,language){
 const sounds=soundsFor(kind,language),columns=columnOrder[kind].filter(c=>sounds.some(s=>s.column===c));
 return `<div class="ipa-table-scroll" tabindex="0" role="region" aria-label="${kind==='vowels'?'Vowel':'Consonant'} chart; scroll horizontally if needed"><table class="ipa-chart-table"><caption>${kind==='vowels'?'Tongue height ↓ · tongue position →':'How the sound is made ↓ · where it is made →'}</caption><thead><tr><th scope="col">${kind==='vowels'?'Height':'Manner'}</th>${columns.map(c=>`<th scope="col">${c}</th>`).join('')}</tr></thead><tbody>${rowOrder[kind].filter(row=>sounds.some(s=>s.row===row)).map(row=>`<tr><th scope="row">${row}</th>${columns.map(col=>`<td>${sounds.filter(s=>s.row===row&&s.column===col).map(s=>`<button type="button" data-ipa-sound="${esc(s.symbol)}" aria-label="Hear ${esc(s.symbol)}: ${esc(s.name)}" title="${esc(s.name)}"><span lang="und-fonipa">${esc(s.symbol)}</span></button>`).join('')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
export function chartMarkup(lang){return `<details class="sound-reference"><summary>Explore sounds</summary><p class="hint">Tap a symbol to listen. Consonant recordings may include an “ah” vowel.</p><div class="sound-controls"><div class="sound-kinds" role="group" aria-label="Sound type"><button type="button" data-ipa-kind="vowels" aria-pressed="true">Vowels</button><button type="button" data-ipa-kind="consonants" aria-pressed="false">Consonants</button></div><label>Sounds for <select data-ipa-language><option value="es" ${lang==='es'?'selected':''}>Spanish</option><option value="fr" ${lang==='fr'?'selected':''}>French</option><option value="de" ${lang==='de'?'selected':''}>German</option><option value="all">All included sounds</option></select></label></div><div data-ipa-table>${chartTable('vowels',lang)}</div><div data-ipa-selection class="ipa-selection"><p class="muted">Choose a sound.</p></div><p data-ipa-error class="error" role="status"></p><p class="hint">A practical reference, not the full IPA alphabet or an exact accent inventory. Paired oral vowels at the same height and position differ in lip rounding. Nasalized vowels let air pass through the nose. Spanish includes Spain’s θ; regional realizations vary.</p><details class="ipa-credits"><summary>Recording sources</summary><p class="hint">Human recordings from Wikimedia Commons. Each selection shows its creator, source and license. Audio is bundled locally; MP3 copies are Commons transcodes, with no edits by Perlingo. Generic sounds illustrate the symbols, not necessarily your phrase’s exact pronunciation.</p></details></details>`;}
export function mountChart(host){
 const reference=host.querySelector('.sound-reference');let kind='vowels',player=null,button=null,request=0;
 const clear=()=>{request++;if(player){player.pause();player.removeAttribute('src');player.load();player.remove();player=null;}if(button){button.removeAttribute('data-playing');button=null;}};
 const error=host.querySelector('[data-ipa-error]');
 const render=()=>{clear();error.textContent='';host.querySelector('[data-ipa-table]').innerHTML=chartTable(kind,host.querySelector('[data-ipa-language]').value);host.querySelector('[data-ipa-selection]').innerHTML='<p class="muted">Choose a sound.</p>';};
 host.addEventListener('click',e=>{
  const type=e.target.closest('[data-ipa-kind]');if(type){kind=type.dataset.ipaKind;host.querySelectorAll('[data-ipa-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b===type)));render();return;}
  const selected=e.target.closest('[data-ipa-sound]');if(!selected)return;
  const sound=ipaSounds.find(s=>s.symbol===selected.dataset.ipaSound);if(!sound)return;
  clear();window.speechSynthesis?.cancel();error.textContent='';button=selected;const token=request;
  host.querySelector('[data-ipa-selection]').innerHTML=`<strong lang="und-fonipa">[${esc(sound.symbol)}]</strong><p>${esc(sound.name)}</p><p class="hint">${esc(sound.author)} · <a href="${esc(sound.source)}" target="_blank" rel="noopener noreferrer">Recording</a> · <a href="${esc(sound.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(sound.license)}</a></p>`;
  player=new Audio(new URL(`./audio/ipa/${sound.file}`,import.meta.url).href);player.preload='none';player.hidden=true;reference.append(player);
  const failed=()=>{if(token!==request)return;button?.removeAttribute('data-playing');error.textContent='Couldn’t play this recording. Try again, or open its Recording link.';};
  player.addEventListener('error',failed);player.addEventListener('playing',()=>{if(token===request)button?.setAttribute('data-playing','true');});player.addEventListener('ended',()=>{if(token===request)button?.removeAttribute('data-playing');});player.play().catch(failed);
 });
 host.querySelector('[data-ipa-language]').addEventListener('change',render);
 reference.addEventListener('toggle',()=>{if(!reference.open)clear();});
 return clear;
}
