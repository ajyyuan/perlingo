import {coursePacks} from '../src/content/course/index.js';
import {courseCoverage,courseTotals} from '../src/content/course/coverage.js';
const coverage=courseCoverage(coursePacks),issues=[];
for(const row of coverage){
 console.log(`${row.unit.id} ${row.unit.title}: ${['es','fr','de'].map(lang=>`${lang} ${row[lang].vocabulary}/100 words, ${row[lang].examples}/24 examples, ${row[lang].sourceChecked} lexical checks`).join(' | ')}`);
 for(const lang of ['es','fr','de']){
  const counts=row[lang];if(counts.vocabulary<100)issues.push(`${row.unit.id}/${lang}: vocabulary shortfall`);
  if(counts.sourceChecked<counts.vocabulary)issues.push(`${row.unit.id}/${lang}: lexical source checks incomplete`);
  for(const objective of row.unit.objectives){
   const examples=coursePacks.flatMap(p=>p.entries).filter(e=>e.objectiveId===objective.id&&e.translations[lang]);
   for(const [mode,count] of [['production',4],['contrast',2],['transfer',2]])if(examples.filter(e=>e.mode===mode).length<count)issues.push(`${objective.id}/${lang}: ${mode} examples incomplete`);
  }
 }
}
const totals=courseTotals(coursePacks);console.log('Whole-course unique lexical inventory:',totals);for(const lang of ['es','fr','de'])if(totals[lang].vocabulary<1600)issues.push(`${lang}: global inventory below 1600`);
console.log(`\n${issues.length} outstanding authoring coverage requirements. Counts do not certify sentence accuracy, task support, or release approval.`);
if(process.argv.includes('--complete')&&issues.length){console.error(issues.join('\n'));process.exitCode=1;}
