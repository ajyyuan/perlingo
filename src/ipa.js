import {ipaTokens} from './ipa-tokens.js';
import {ipaData} from './content/ipa-data.js';
export const ipaFor=(text,lang)=>ipaData[lang]?.[text]??null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function ipaGuide(text,lang,clickable=false){
 const ipa=ipaFor(text,lang);
 const tag=clickable?'button':'p';
 const action=clickable?' type="button" data-action="pronunciation" aria-label="Open pronunciation guide"':'';
 return ipa?`<${tag}${action} class="ipa-guide" title="Approximate, automatically generated IPA. Audio may differ by voice and accent."><span lang="${lang}-fonipa">[${esc(ipa)}]</span></${tag}>`:'';
}

export function interactiveIPA(text,lang){
 const ipa=ipaFor(text,lang);if(!ipa)return '';
 return `<div class="ipa-transcription" title="Approximate, automatically generated IPA. Audio may differ by voice and accent." lang="${lang}-fonipa" aria-label="Pronunciation transcription">[${ipaTokens(ipa).map(t=>/^\s+$/.test(t.text)?esc(t.text):`<button type="button" ${t.sound?`data-transcription-sound="${esc(t.text)}" aria-label="Hear ${esc(t.text)}"`:`data-ipa-note="${esc(t.note||`No recording available for ${t.text}.`)}" aria-label="Explain ${esc(t.text)}"`}>${esc(t.text)}</button>`).join('')}]</div>`;
}
