import {contentRecord} from './content/catalog.js';
export function inspectChunk(item,lang,chunk){
 const {entry,pack}=contentRecord(item.id)||{},translation=entry?.translations[lang];
 const words=[...chunk.text.matchAll(/[\p{L}\p{M}]+(?:[’'][\p{L}\p{M}]+)*/gu)].map(match=>{
  const text=match[0],annotation=translation?translation.wordDetails?.[text]||translation.wordDetails?.[text+'’']:null;
  const lexeme=annotation?.lexeme?pack.lexemes[annotation.lexeme]:null;
  return {text,...annotation,lexeme,note:annotation?.note||'Individual word analysis is not yet recorded for this selection. The phrase explanation below retains its context.'};
 });
 const phraseLexeme=chunk.lexemeIds?.length===1?pack?.lexemes[chunk.lexemeIds[0]]:null;
 if(phraseLexeme&&chunk.text.includes(' ')&&!words.some(w=>w.lexeme?.id===phraseLexeme.id))words.unshift({text:chunk.text,meaning:chunk.meaning,role:'Whole expression',note:chunk.detail,lexeme:phraseLexeme,phrase:true});
 return {sentence:item[lang],english:item.en,chunk,words,pilot:Boolean(translation),sources:(translation?.sourceIds||[]).map(id=>pack.sources[id])};
}
export function formLabel(form){return [form.verbForm==='infinitive'?'Infinitive':null,form.tense,form.mood,form.person?`${['','First','Second','Third'][form.person]} person`:null,form.number,form.gender,form.case,form.usage].filter(Boolean).join(' · ')||'Base form';}

export function formsForWord(word){
 const forms=word.lexeme?.forms||[];
 return forms.filter(f=>word.lexeme.pos!=='verb'||f.verbForm==='finite').map(f=>({...f,selected:word.features?Object.entries(word.features).every(([key,value])=>f[key]===value)&&f.text.toLocaleLowerCase()===word.text.toLocaleLowerCase():word.lexeme.pos!=='verb'&&f.text===word.text}));
}
