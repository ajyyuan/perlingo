// Offline normalization of the pinned eSpeak German output, not a spelling-to-IPA engine.
// Target: uvular consonantal r; BAS-style vocalization, retaining r after a/aː.
// See docs/pronunciation.md for sources, reviewed prefix boundaries and limitations.
import {pathToFileURL} from 'node:url';
export const germanPronunciationProfile='standard-uvular-v1';
export function normalizeGermanIPA(ipa){
 if(ipa===null)return null;
 // Preserve nasal ɑ̃ in French loanwords; oral German long a uses aː.
 let result=ipa.replace(/ɑ(?!̃)/gu,'a').replace(/ɜ/gu,'ɐ');
 // Audited morpheme boundaries: er-/ver- before a vowel, and vor|erst.
 // These are codas even though the next sound is a vowel (unlike fahren).
 result=result.replace(/(^|\s)(f?ɛ)ɾ(?=[ˈˌ]*[aeiouɛɪʊɔəøœyʏ])/gu,'$1$2ɐ')
  .replace(/fˈoːɾˌeːɾst/gu,'fˈoːɐˌeːɐst');
 // Do not cross a word boundary to look for the following syllable's vowel.
 // Stress signs may intervene between onset r and its vowel: rˈoːt, f aː rˈʊm.
 const vowels='aeiouɛɪʊɔəøœyʏɐɑ';
 result=result.replace(new RegExp(`([eiouɛɪʊɔøœyʏ]ː?)[rɾ](?![ˈˌ]*[${vowels}])`,'gu'),'$1ɐ')
  .replace(new RegExp(`ə[rɾ](?![ˈˌ]*[${vowels}])`,'gu'),'ɐ');
 return result.replace(/[rɾ]/gu,'ʁ');
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 let input='';for await(const chunk of process.stdin)input+=chunk;
 const entries=JSON.parse(input);
 process.stdout.write(JSON.stringify(Object.fromEntries(Object.entries(entries).map(([text,ipa])=>[text,normalizeGermanIPA(ipa)]))));
}
