import {contextSpan} from './context-answer.js';
// Dictation punctuation is not part of a vocabulary answer. Preserve ñ and lexical accents.
const grammaticalPairs=new Set(['que','quien','quienes','cual','cuales','como','cuando','donde','adonde','cuanto','cuanta','cuantos','cuantas','el','tu','mi','si','te','de','se','mas']);
const acute=s=>s.normalize('NFD').replace(/\u0301/g,'').normalize('NFC');
export function cleanDictation(text,contextAnswers=[],context=null){
 const clean=String(text).normalize('NFC').toLocaleLowerCase('es').replace(/\p{P}+/gu,' ').replace(/\s+/gu,' ').trim();
 const resolve=word=>{
  const exact=contextAnswers.find(a=>a.toLocaleLowerCase('es')===word);if(exact)return exact.toLocaleLowerCase('es');
  if(grammaticalPairs.has(acute(word))){
   const match=contextAnswers.find(a=>acute(a.toLocaleLowerCase('es'))===acute(word));if(match)return match.toLocaleLowerCase('es');
  }
  // Reviewed homophone pair: this changes dictation only, never typed spelling.
  if(['ay','hay'].includes(word)){
   const match=contextAnswers.find(a=>['ay','hay'].includes(a.toLocaleLowerCase('es')));if(match)return match.toLocaleLowerCase('es');
  }
  return null;
 };
 if(context){
  const span=contextSpan(clean,context,word=>resolve(word)!==null);
  if(span){span.input[span.targetIndex]=resolve(span.input[span.targetIndex]);return span.input.join(' ');}
 }
 return resolve(clean)??clean;
}
