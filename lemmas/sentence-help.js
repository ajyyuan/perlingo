import {esc} from './html.js';
import {wordButton,wordMeanings} from './word-help.js';
let examples=new Map(),sequence=0;
const extras={
 'Tengo una casa.':{tengo:'I have',una:'a',casa:'house'},
 'Escucho música.':{escucho:'I listen to',música:'music'},
 'Depende de ti.':{depende:'it depends',de:'on (with depender)',ti:'you (after a preposition)'},
 'Tengo una pregunta.':{tengo:'I have',una:'a',pregunta:'question'},
 'Ayer tuve una reunión.':{ayer:'yesterday',tuve:'I had',una:'a',reunión:'meeting'},
 'De niño, tenía un perro.':{de:'as (in de niño)',niño:'child; boy',tenía:'I had; I used to have',un:'a',perro:'dog'},
 'Mañana tendré más tiempo.':{mañana:'tomorrow',tendré:'I will have',más:'more',tiempo:'time'},
 'Con menos trabajo, tendría más tiempo.':{con:'with',menos:'less',trabajo:'work',tendría:'I would have',más:'more',tiempo:'time'},
 'He tenido mucha suerte.':{he:'I have (auxiliary)',tenido:'had (past participle)',mucha:'a lot of',suerte:'luck'},
 'Espero que tengas tiempo.':{espero:'I hope',que:'that',tengas:'you have (subjunctive)',tiempo:'time'},
 'Ten cuidado.':{ten:'have (command; with cuidado: be careful)',cuidado:'care; caution'},
 'No tengas miedo.':{no:'do not (negative command)',tengas:'have (subjunctive; used in negative commands)',miedo:'fear'}
};
export function configureSentenceHelp(contexts){examples=new Map([...contexts].map(c=>[c.example.text,c.wordMeanings||wordMeanings]));}
export function exampleMarkup(example,{grammar=false}={}){
 const meanings=extras[example.text]||example.wordMeanings||examples.get(example.text);
 if(!meanings)throw Error('Missing sentence glosses: '+example.text);
 const prefix=`example-${++sequence}`;
 let chunkCursor=0,cursor=0,index=0,html='';
 const ranges=(example.chunks||[]).map(c=>{const start=example.text.indexOf(c.text,chunkCursor);chunkCursor=start+c.text.length;return {...c,start,end:chunkCursor};});
 for(const match of example.text.matchAll(/[\p{L}]+/gu)){
  const text=match[0],offset=match.index,meaning=meanings[text.toLocaleLowerCase('es')];if(!meaning)throw Error('Missing sentence word gloss: '+text+' in '+example.text);
  const chunk=ranges.find(c=>offset>=c.start&&offset<c.end);
  const help=grammar&&chunk?.concept?`<button type="button" class="grammar-link" data-sentence-concept="${esc(chunk.concept)}" data-sentence="${esc(example.text)}" data-translation="${esc(example.translation)}">Grammar →</button>`:'';
  html+=esc(example.text.slice(cursor,offset))+wordButton(text,meaning,chunk?.meaning||'',`${prefix}-${index++}`,help);cursor=offset+text.length;
 }
 return html+esc(example.text.slice(cursor));
}
export function sentenceAudio(text){return `<button type="button" class="sentence-audio" data-speak="${esc(text)}" aria-label="Listen to whole sentence: ${esc(text)}" title="Listen to sentence"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 4a5 5 0 0 1 0 6m3-9a9 9 0 0 1 0 12"/></svg></button>`;}
