import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {verbGuide} from '../lemmas/verb-guide.js';
import {guideExample} from '../lemmas/guide-examples.js';
import {exampleMarkup} from '../lemmas/sentence-help.js';
const report={scope:'Every displayed verb-guide row and alternative, across the 369 verbs in the 1500-lemma course',method:'Reviewed lexical row frames plus explicit source-compared construction templates; not corpus attestations or independent certification of every sentence',verbs:0,sentences:0,notices:0,emptyCharts:0,byLesson:{},restrictions:[],sha256:{}};
for(const id of Object.keys(verbForms)){
 report.verbs++;const note={id,word:id.split(':')[1]};
 for(const g of verbGuide(note))for(const lesson of g.lessons){
  if(!lesson.rows.length){if(!guideExample(note,lesson).notice)throw Error('Unexplained empty chart');report.emptyCharts++;}
  for(const [r,row]of lesson.rows.entries())for(const [a,target]of row.alternatives.entries()){
   const e=guideExample(note,lesson,r,a),kind=e.text?'sentences':'notices';
   report[kind]++;(report.byLesson[lesson.id]??={sentences:0,notices:0})[kind]++;
   if(e.text){
    if(e.target!==target||!e.text.toLowerCase().includes(target.toLowerCase())||!e.translation)throw Error('Example/form mismatch');
    exampleMarkup(e);
   }else report.restrictions.push({id,lesson:lesson.id,row:r,alternative:a,target,notice:e.notice});
  }
 }
}
for(const f of ['lemmas/guide-examples.js','lemmas/row-examples-data.js','lemmas/verb-guide.js','lemmas/verb-guide-data.js','lemmas/verb-forms-data.js'])report.sha256[f]=createHash('sha256').update(fs.readFileSync(f)).digest('hex');
fs.writeFileSync('data/spanish-lemmas/tense-examples/guide-example-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,restrictions:report.restrictions.length},null,2));
