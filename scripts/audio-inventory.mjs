// Read-only inventory of every current app pronunciation target. No provider calls.
import {bank,languages,foundation} from '../src/content.js';
import {lessonEntries} from '../src/content/model.js';
import {courseLessonEntries} from '../src/content/course/index.js';
import {segments} from '../src/explanations.js';
const entries=[...bank,...lessonEntries(foundation),...courseLessonEntries()];
const normalize=text=>text.normalize('NFC').replace(/[’‘]/g,"'");
const summary=[],targets=[];
for(const [lang,{locale}] of Object.entries(languages)){
 const texts=new Map();
 function add(text,item,kind){
  text=normalize(text);
  if(!texts.has(text))texts.set(text,{locale,text,references:[]});
  const refs=texts.get(text).references;
  if(!refs.some(r=>r.item===item&&r.kind===kind))refs.push({item,kind});
 }
 for(const item of entries){
  add(item[lang],item.id,'lesson');
  for(const chunk of segments(item,lang))if(chunk.meaning)add(chunk.text,item.id,'chunk');
 }
 const records=[...texts.values()].sort((a,b)=>a.text<b.text?-1:a.text>b.text?1:0);
 summary.push({locale,clips:records.length,characters:records.reduce((n,r)=>n+[...r.text].length,0)});
 targets.push(...records);
}
console.log(JSON.stringify(process.argv.includes('--manifest')?{schemaVersion:1,summary,targets}:{summary,totalClips:targets.length,totalCharacters:summary.reduce((n,r)=>n+r.characters,0)},null,2));
