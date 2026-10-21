import {normalize} from '../public/engine.js';
// Exact tile word, declared spellings and source-backed speech formatting; no synonyms/substrings.
export function exactAudioWord(text,word,language,orthographicAlternatives=[],transcriptAlternatives=[]){
 const clean=s=>normalize(language==='th'?s.normalize('NFKD'):s,language);
 const forms=[word,...orthographicAlternatives,...transcriptAlternatives];if(language==='sr'&&word==='вода')forms.push('voda');if(language==='sr'&&word==='хлеб')forms.push('hleb');
 return forms.some(w=>clean(text)===clean(w));
}
