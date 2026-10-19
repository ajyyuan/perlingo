import {ipaSounds} from './content/ipa-sounds.js';
const symbols=ipaSounds.map(s=>s.symbol).sort((a,b)=>b.length-a.length);
export const ipaMarks={'ˈ':'Primary stress: emphasize the following syllable.','ˌ':'Secondary stress: a lighter emphasis on the following syllable.','ː':'Length: hold the preceding sound longer.'};
// Keep nasalization attached to its vowel and explicit tie bars within affricates.
// Do not merge untied adjacent letters: a transcription may cross a syllable boundary.
export function ipaTokens(ipa){
 const result=[];let rest=ipa||'';
 while(rest){
  let text=symbols.find(s=>rest.startsWith(s))||Array.from(rest)[0];
  if(rest.slice(text.length).startsWith('\u0303'))text+='\u0303';
  result.push({text,sound:ipaSounds.find(s=>s.symbol===text)||null,note:ipaMarks[text]||null});rest=rest.slice(text.length);
 }
 return result;
}
