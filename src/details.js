import {readingPilot} from './content/reading-pilot.js';
export function inspectChunk(item,lang,chunk){
 const entry=readingPilot.entries.find(e=>e.id===item.id),translation=entry?.translations[lang];
 const words=[...chunk.text.matchAll(/[\p{L}\p{M}]+(?:[’'][\p{L}\p{M}]+)*/gu)].map(match=>{
  const text=match[0],annotation=translation?translation.wordDetails?.[text]:null;
  const lexeme=annotation?.lexeme?readingPilot.lexemes[annotation.lexeme]:null;
  return {text,...annotation,lexeme,note:annotation?.note||'Individual word analysis is not yet recorded for this selection. The phrase explanation below retains its context.'};
 });
 return {sentence:item[lang],english:item.en,chunk,words,pilot:Boolean(translation),sources:(translation?.sourceIds||[]).map(id=>readingPilot.sources[id])};
}
export function formLabel(form){return [form.verbForm==='infinitive'?'Infinitive':null,form.tense,form.mood,form.person?`${['','First','Second','Third'][form.person]} person`:null,form.number].filter(Boolean).join(' · ');}
