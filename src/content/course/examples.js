import {addExample,draft} from './build.js';
import {coreExamples} from './examples-core.js';
import {extensionExamples} from './examples-extension.js';
import {grammarGuides} from './grammar-guides.js';
import {unitById} from './units.js';
export function parseAuthoredChunks(markup,{summary,detail,grammarId}){
 const chunks=[];let end=0;
 for(const match of markup.matchAll(/([^{}]+)\{([^{}]+)\}/gu)){
  if(match.index!==end)throw new Error(`Unparsed annotation at ${end}: ${markup}`);
  const raw=match[1],leading=raw.match(/^[\s\p{P}]+/u)?.[0]||'',text=raw.slice(leading.length);
  if(leading)chunks.push({text:leading});
  if(!text)throw new Error(`Empty authored span: ${markup}`);
  chunks.push({text,meaning:match[2],summary,detail,lexemeIds:[],grammarIds:[grammarId]});end=match.index+match[0].length;
 }
 const trailing=markup.slice(end);if(/[\p{L}\p{N}{}]/u.test(trailing))throw new Error(`Unexplained trailing text: ${markup}`);
 if(trailing)chunks.push({text:trailing});if(!chunks.some(c=>c.meaning))throw new Error('No authored chunks');
 return chunks;
}
export function addCourseExamples(pack){
 const unitId=pack.id.replace('course-',''),unit=unitById(unitId),groups=({...coreExamples,...extensionExamples})[unitId];
 if(!groups)return;
 groups.forEach((group,g)=>{
  const objective=unit.objectives[g],rows=group.trim().split('\n').map(l=>l.split('|'));
  if(rows.length!==8)throw new Error(`${objective.id}: expected eight examples`);
  for(const [li,lang] of ['es','fr','de'].entries()){
   const id=`${lang}.${objective.id}`;pack.grammar[id]={id,lang,description:grammarGuides[unitId][g][li],sourceIds:[],review:draft()};
  }
  rows.forEach(([prompt,...markups],i)=>{
   if(markups.length!==3)throw new Error(`${objective.id}: three translations required`);
   const mode=i<4?'production':i<6?'contrast':'transfer';
   const translations=Object.fromEntries(['es','fr','de'].map((lang,li)=>{
    const grammarId=`${lang}.${objective.id}`,detail=pack.grammar[grammarId].description;
    const chunks=parseAuthoredChunks(markups[li],{summary:objective.title,detail,grammarId});
    return [lang,{text:chunks.map(c=>c.text).join(''),chunks,grammarIds:[grammarId],wordDetails:Object.fromEntries(chunks.filter(c=>c.meaning&&!/[\s-]/u.test(c.text)).map(c=>[c.text,{meaning:c.meaning,role:'Contextual span · '+objective.title,note:detail}]))}];
   }));
   const esFirst=translations.es.chunks.find(c=>c.meaning);if(esFirst?.meaning.startsWith('(I) '))translations.es.acceptedAnswers=['Yo '+translations.es.text.charAt(0).toLocaleLowerCase('es')+translations.es.text.slice(1)];
   const e=addExample(pack,{id:`${unitId}-example-${g+1}-${i+1}`,unitId,objectiveId:objective.id,prompt,definition:prompt,translations,mode,situation:i<4?'Everyday statement or request':i<6?'Compare the intended meaning':'Apply the pattern in another context'});
   e.grammarTopic=`course-${objective.id}`;
   if(mode==='contrast')e.contrastOptions=[rows[4][0],rows[5][0]];
  });
 });
}
