import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {rowExamples} from '../lemmas/row-examples-data.js';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {formGroups} from '../lemmas/verb-forms.js';
import {exampleMarkup} from '../lemmas/sentence-help.js';
import {sampleStartingRow,rankedStartingRows,sessionSelection,selectExampleRow,selectedRow,rowExample} from '../lemmas/row-examples.js';
test('every displayed verb row and alternative has a matching example or scoped explanation',()=>{
 assert.deepEqual(Object.keys(rowExamples).sort(),Object.keys(verbForms).sort());
 for(const id of Object.keys(verbForms))for(const group of formGroups({id,word:id.split(':')[1]}))for(const row of group.rows){
  const examples=rowExamples[id][group.id][row.slot];assert.equal(examples.length,row.alternatives.length,`${id} ${group.id} ${row.slot}`);
  for(const [i,e]of examples.entries()){
   if(e.notice){assert.ok(e.notice.length>20);continue;}
   assert.equal(e.target,row.alternatives[i],`${id} ${group.id} ${row.slot}`);
   assert.ok(e.text.toLowerCase().includes(e.target.toLowerCase()),e.text);
   assert.ok(!/undefined|NaN|\[object|\bI (?:are|were|has)\b|\b(?:[Hh]e|[Ss]he) have\b/.test(e.translation),e.translation);
   assert.doesNotThrow(()=>exampleMarkup(e),e.text);
  }
 }
});
test('agreement and semantic exceptions remain contextual for different rows',()=>{
 const get=(w,t,s,a=0)=>rowExample('corpes:'+w+':V',t,s,a);
 assert.equal(get('ser','present',4).text,'Vosotros sois amables con todos.');
 assert.equal(get('querer','commands',2).text,'Quered a vuestra familia.');
 assert.equal(get('saber','commands',3).text,'Sepan que no están solos.');
 assert.equal(get('gustar','present',0).text,'Yo le gusto a Ana.');
 assert.equal(get('gustar','present',0).translation,'Ana likes me.');
 assert.equal(get('gustar','present',5).translation,'Ana likes the songs.');
 assert.equal(get('resultar','present',5).text,'Las tareas resultan fáciles.');
 assert.equal(get('haber','present',0).text,'Yo he terminado.');
 assert.equal(get('haber','present',6).text,'Hay una solución.');
 assert.equal(get('haber','perfect',2).text,'Ha habido un cambio.');
 assert.match(get('describir','perfect',4,1).text,/habéis descripto/);
 assert.match(get('soler','future',0).notice,/not used/);
 assert.equal(get('recuperar','present',2).translation,'She recovers her strength.');
});
test('session choices stay stable, row selection persists, and tense mapping respects people',()=>{
 const id='corpes:comer:V';assert.equal(sessionSelection(id),sessionSelection(id));
 selectExampleRow(id,'present',4);
 const groups=formGroups({id,word:'comer'});
 assert.equal(selectedRow(id,'perfect',groups.find(g=>g.id==='perfect').rows).slot,4);
 assert.equal(selectedRow(id,'commands',groups.find(g=>g.id==='commands').rows).slot,2);
 selectExampleRow(id,'negative',3);assert.equal(sessionSelection(id).person,5);
 assert.equal(sampleStartingRow('corpes:haber:V',()=>0).person,6);
 assert.equal(sampleStartingRow(id,()=>0).person,2);
 assert.equal(sampleStartingRow(id,()=>.7).person,5);assert.equal(sampleStartingRow(id,()=>.95).person,3);
});
test('row bank rebuilds deterministically without touching balanced and frequency snapshots',()=>{
 const files=['lemmas/row-examples-data.js','lemmas/tense-examples-data.js','lemmas/frequency-pilot-data.js'];
 const before=files.map(f=>readFileSync(f,'utf8'));
 execFileSync(process.execPath,['scripts/build-lemma-row-examples.mjs']);
 files.forEach((f,i)=>assert.equal(readFileSync(f,'utf8'),before[i],f));
});
test('random starting examples are usable for every verb and keep the command anchor',()=>{
 for(const id of Object.keys(verbForms))for(const random of [()=>0,()=>.59,()=>.61,()=>.999]){
  const s=sampleStartingRow(id,random),slot=s.tense==='commands'?s.command:s.person;
  assert.ok(rowExample(id,s.tense,slot)?.text,id+' '+slot);
 }
 const mirar=sampleStartingRow('corpes:mirar:V',()=>0);
 assert.equal(mirar.tense,'commands');assert.equal(mirar.command,0);assert.equal(mirar.person,1);
 assert.match(rowExample('corpes:nacer:V','future',0).notice,/living speaker/);
 assert.equal(rowExample('corpes:morir:V','preterite',0).text,'Ayer yo morí de risa.');
});

test('starting forms use the top three eligible counts with exact 60/30/10 intervals',()=>{
 const id='corpes:comer:V';
 assert.deepEqual(rankedStartingRows(id).map(r=>r.slot),[2,5,3]); // como excluded
 const counts={2:0,5:0,3:0};
 for(let i=0;i<1000;i++)counts[sampleStartingRow(id,()=>(i+.5)/1000).person]++;
 assert.deepEqual(counts,{2:600,5:300,3:100});
 assert.equal(sampleStartingRow(id,()=>.6).person,5);
 assert.equal(sampleStartingRow(id,()=>.9).person,3);
 assert.deepEqual(rankedStartingRows('corpes:haber:V').map(r=>r.slot),[6,2,0]);
 assert.deepEqual(rankedStartingRows('corpes:nacer:V').map(r=>r.slot),[2,5]);
 assert.equal(sampleStartingRow('corpes:nacer:V',()=>.65).person,2);
 assert.equal(sampleStartingRow('corpes:nacer:V',()=>.67).person,5);
 for(const verb of Object.keys(verbForms))assert.ok(rankedStartingRows(verb).length,verb);
});
test('course-seeded examples reproduce across reloads and retain manual choices until the seed changes',async()=>{
 const {exampleDraw}=await import('../lemmas/example-seed.js');
 const {setCourseExampleSeed}=await import('../lemmas/row-examples.js');
 const id='corpes:comer:V';setCourseExampleSeed(1234);
 const expected=sampleStartingRow(id,()=>exampleDraw(1234,id));
 assert.deepEqual(sessionSelection(id),expected);
 selectExampleRow(id,'present',4);setCourseExampleSeed(1234);
 assert.equal(sessionSelection(id).person,4);
 setCourseExampleSeed(4321);setCourseExampleSeed(1234);
 assert.deepEqual(sessionSelection(id),expected);
 for(const verb of Object.keys(verbForms))assert.deepEqual(sampleStartingRow(verb,()=>exampleDraw(1234,verb)),sampleStartingRow(verb,()=>exampleDraw(1234,verb)));
 assert.notEqual(exampleDraw(1234,id),exampleDraw(4321,id));
});
