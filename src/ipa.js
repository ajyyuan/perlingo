import {ipaData} from './content/ipa-data.js';
export const ipaFor=(text,lang)=>ipaData[lang]?.[text]??null;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function ipaGuide(text,lang,clickable=false){
 const ipa=ipaFor(text,lang);
 const tag=clickable?'button':'p';
 const action=clickable?' type="button" data-action="pronunciation" aria-label="Open pronunciation guide"':'';
 return ipa?`<${tag}${action} class="ipa-guide" title="Approximate, automatically generated IPA. Audio may differ by voice and accent."><span class="ipa-label">IPA ≈</span> <span lang="${lang}-fonipa">[${esc(ipa)}]</span></${tag}>`:'';
}
