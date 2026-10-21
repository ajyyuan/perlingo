import {normalize} from '../public/engine.js';
// Only orthographic equivalents of the exact tile word; never synonyms or substrings.
export function exactAudioWord(text,word,language){
 const clean=s=>normalize(language==='th'?s.normalize('NFKD'):s,language);
 const forms=[word];if(language==='sr'&&word==='вода')forms.push('voda');if(language==='sr'&&word==='хлеб')forms.push('hleb');
 return forms.some(w=>clean(text)===clean(w));
}
