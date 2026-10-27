import {esc} from './note-view.js';
// Small reviewed vocabulary for the existing 50 example sentences. The phrase
// gloss supplies context where an isolated word has several functions.
export const wordMeanings={
 a:'to; at',al:'to the (a + el)',ana:'Ana (a name)',aprender:'to learn',aquí:'here',azúcar:'sugar',año:'year',años:'years',bueno:'good',café:'coffee',camino:'I walk',casa:'house; home',comida:'meal; food',como:'since; because (here)',con:'with',creo:'I think; I believe',cuando:'when',de:'of; from',desde:'from',digo:'I say; I tell',doce:'twelve',doy:'I give',días:'days',el:'the',en:'in; at; on',entiendo:'I understand',entre:'between',es:'is',ese:'that',español:'Spanish',este:'this',esto:'this',estoy:'I am',estudiar:'to study',estudio:'I study',está:'is; is located',fácil:'easy',habla:'speaks',hago:'I make; I do',hay:'there is; there are',ir:'to go',la:'the',lava:'washes',le:'to him; to her; to you (formal)',libro:'book',llueve:'it rains; it is raining',lo:'it; him (object)',los:'the (plural)',madrid:'Madrid',me:'me; myself',mesa:'table',meses:'months',muy:'very',más:'more',méxico:'Mexico',mío:'mine',no:'not',nos:'us',o:'or',otro:'another; other',para:'to; in order to (here)',parque:'park',pero:'but',por:'through; around (here)',puedo:'I can',que:'that; which',quedo:'I stay (me quedo)',quiero:'I want',se:'herself (here)',si:'if',sin:'without',sobre:'on; above',somos:'we are',soy:'I am',suyo:'his; hers; its; theirs; yours',también:'also; too',te:'you (object)',tengo:'I have',tiempo:'time',tiene:'has',todos:'all; every (with los días)',té:'tea',tú:'you (subject)',un:'a; one',uno:'one',ve:'sees',veinte:'twenty',veo:'I see',verdad:'truth',viene:'comes; is coming',vivo:'I live',voy:'I go; I am going',y:'and',ya:'already; with no: no longer',yo:'I',él:'he'
};
export function wordButton(text,meaning,phrase='',id='word-help'){
 return `<span class="quick-word"><button type="button" class="word-sound" data-speak="${esc(text)}" lang="es" aria-describedby="${id}" aria-label="Listen to ${esc(text)}">${esc(text)}</button><span class="quick-meaning" role="tooltip" id="${id}">${esc(meaning)}${phrase&&phrase.toLocaleLowerCase()!==meaning.toLocaleLowerCase()?`<small>In this phrase: ${esc(phrase)}</small>`:''}</span></span>`;
}
export function sentenceMarkup(context,revealed=false){
 let wordIndex=0;
 return context.example.chunks.map((chunk,chunkIndex)=>{
  let cursor=0,result='';
  for(const match of chunk.text.matchAll(/[\p{L}]+/gu)){
   result+=esc(chunk.text.slice(cursor,match.index));
   const hidden=chunkIndex===context.index&&match.index===context.offset;
   if(hidden&&!revealed)result+='<span class="cloze-blank" aria-label="Missing Spanish word"></span>';
   else {const meaning=(context.wordMeanings||wordMeanings)[match[0].toLocaleLowerCase('es')];if(!meaning)throw Error('Missing word meaning: '+match[0]);result+=wordButton(match[0],meaning,chunk.meaning,'sentence-word-'+wordIndex);}
   cursor=match.index+match[0].length;wordIndex++;
  }
  return result+esc(chunk.text.slice(cursor));
 }).join(' ')+'.';
}
