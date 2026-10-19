import {bank,foundation} from '../src/content.js';
import {lessonEntries} from '../src/content/model.js';
import {courseLessonEntries} from '../src/content/course/index.js';
import {segments} from '../src/explanations.js';
export function ipaInputs(){
 const texts={es:new Set(),fr:new Set(),de:new Set()};
 for(const item of [...bank,...lessonEntries(foundation),...courseLessonEntries()])for(const lang of Object.keys(texts)){
  texts[lang].add(item[lang]);
  for(const chunk of segments(item,lang))if(chunk.meaning)texts[lang].add(chunk.text);
 }
 return Object.fromEntries(Object.entries(texts).map(([lang,values])=>[lang,[...values].sort()]));
}
if(process.argv[1]?.endsWith('/ipa-inputs.mjs'))console.log(JSON.stringify(ipaInputs()));
