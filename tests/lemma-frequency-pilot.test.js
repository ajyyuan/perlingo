import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {frequencyPilot,pilotEvidence} from '../lemmas/frequency-pilot-data.js';
import {tenseExamples} from '../lemmas/tense-examples-data.js';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {formGroups} from '../lemmas/verb-forms.js';
import {exampleFor,exampleMode,initialExampleTense} from '../lemmas/example-variants.js';
import {exampleMarkup} from '../lemmas/sentence-help.js';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('all 369 opt-in frequency-informed verbs have grade-independent, sourced forms and complete glosses',()=>{
 assert.equal(Object.keys(frequencyPilot).length,369);
 assert.equal(exampleMode(''),'balanced');assert.equal(exampleMode('?examples=frequency'),'frequency');
 assert.equal(exampleMode('?examples=unknown'),'balanced');
 for(const [id,groups]of Object.entries(frequencyPilot)){
  assert.deepEqual(Object.keys(groups).sort(),Object.keys(tenseExamples[id]).sort());
  for(const [key,e]of Object.entries(groups)){
   if(e.notice)continue;
   assert.doesNotThrow(()=>exampleMarkup(e),id+' '+key);
   if(e.target&&e.target!=='hay')assert.ok(verbForms[id][key].flat().includes(e.target),id+' '+key);
   if(e.slot!==undefined)assert.ok(verbForms[id][key][e.slot].includes(e.target),id+' '+key+' person');
   assert.equal(exampleFor(id,key,'balanced'),tenseExamples[id][key]);
   assert.equal(exampleFor(id,key,'frequency'),e);
  }
  if(id!=='corpes:haber:V')assert.equal(new Set(Object.entries(groups).filter(([k,e])=>!['commands','negative'].includes(k)&&!e.notice).map(([,e])=>e.slot)).size,1,id+' stable subject');
  for(const key of ['commands','negative']){
   assert.equal(groups[key].text,tenseExamples[id][key].text);
   assert.equal(groups[key].translation,tenseExamples[id][key].translation);
  }
 }
 assert.equal(exampleFor('corpes:comer:V','present','frequency'),frequencyPilot['corpes:comer:V'].present);
 assert.deepEqual(Object.keys(frequencyPilot).sort(),Object.keys(verbForms).sort());
 assert.equal(initialExampleTense({id:'corpes:mirar:V'},'frequency'),'commands');
 assert.equal(initialExampleTense({id:'corpes:mirar:V'},'balanced'),'present');
 assert.equal(formGroups({id:'corpes:ir:V',word:'ir'},'frequency').find(g=>g.id==='present').text,'Nosotros vamos al mercado.');
 assert.equal(formGroups({id:'corpes:ir:V',word:'ir'},'balanced').find(g=>g.id==='present').text,'Ella va al mercado.');
});
test('pilot frequencies match the retained source excerpt without treating ambiguous uses as disambiguated',()=>{
 const rows=new Map(read('data/spanish-lemmas/tense-examples/frequency-observations.tsv').trim().split('\n').slice(1).map(l=>{const [word,count,videos,channels]=l.split('\t');return [word,{count:+count,videos:+videos,channels:+channels}];}));
 for(const e of Object.values(pilotEvidence.entries)){
  assert.deepEqual(e.evidence,rows.get(e.anchor));
  for(const c of e.presentCandidates){assert.equal(c.count,rows.get(c.form)?.count??null);assert.equal(c.channels,rows.get(c.form)?.channels??null);}
 }
 assert.equal(rows.get('hay').count,452965);assert.equal(rows.get('he').count,144633);
 assert.match(pilotEvidence.entries['corpes:mirar:V'].reason,/cannot establish/);
 assert.match(pilotEvidence.entries['corpes:creer:V'].reason,/crear/);
 assert.match(pilotEvidence.entries['corpes:tener:V'].reason,/not always|instead of always/);
});
test('pilot preserves reviewed assessment and source-form snapshots',()=>{
 const audit=JSON.parse(read('data/spanish-lemmas/tense-examples/person-audit.json'));
 for(const [path,hash]of Object.entries(audit.unchangedHashes))assert.equal(createHash('sha256').update(read(path)).digest('hex'),hash,path);
 const get=w=>frequencyPilot['corpes:'+w+':V'];
 assert.equal(get('haber').present.text,'Hay una solución.');
 assert.equal(get('saber').preterite.translation,'Yesterday I found out the answer.');
 assert.equal(get('parecer').present.text,'El plan parece fácil.');
 assert.equal(get('pasar').present.translation,'This happens often.');
 assert.equal(get('ser').present.wordMeanings.buena,'good');
 assert.equal(get('tener').perfect.wordMeanings.he,'I have (auxiliary)');
});
test('pilot regenerates offline without changing the balanced bank',()=>{
 const p='lemmas/frequency-pilot-data.js',before=read(p),balanced=read('lemmas/tense-examples-data.js');
 execFileSync(process.execPath,['scripts/build-lemma-frequency-pilot.mjs'],{cwd:new URL('../',import.meta.url)});
 assert.equal(read(p),before);assert.equal(read('lemmas/tense-examples-data.js'),balanced);
});
test('expanded choices retain the original pilot and reject known misleading homograph counts',()=>{
 const original=JSON.parse(read('data/spanish-lemmas/tense-examples/pilot-25.json'));
 const expanded=JSON.parse(read('data/spanish-lemmas/tense-examples/frequency-pilot.json'));
 for(const [word,e]of Object.entries(original.entries))assert.deepEqual(expanded.entries[word],e,word);
 for(const [word,form]of [['comer','como'],['parar','para'],['unir','uno'],['casar','caso'],['crear','creo']]){
  const e=expanded.entries[word];
  assert.ok(e.presentCandidates.find(c=>c.form===form).excludedFromAutomaticRanking,word);
  assert.notEqual(e.anchor,form,word);
 }
 for(const [word,slot]of [['gustar',2],['morir',5],['caer',5],['nacer',5]]){
  assert.equal(frequencyPilot['corpes:'+word+':V'].present.slot,slot);
 }
 const soler=frequencyPilot['corpes:soler:V'];
 assert.equal(soler.present.text,'Ella suele leer por la noche.');
 for(const [key,e]of Object.entries(tenseExamples['corpes:soler:V']))if(e.notice)assert.deepEqual(soler[key],e);
});
test('frequency anchors match rendered examples and both modes retain every conjugation row',()=>{
 for(const [id,e]of Object.entries(pilotEvidence.entries)){
  assert.equal(frequencyPilot[id][e.anchorTense].target,e.anchor,id);
  assert.ok(frequencyPilot[id][e.anchorTense].text.toLocaleLowerCase('es').includes(e.anchor),id);
  const note={id,word:id.split(':')[1]},balanced=formGroups(note,'balanced'),frequency=formGroups(note,'frequency');
  for(let i=0;i<balanced.length;i++){
   assert.deepEqual(frequency[i].rows,balanced[i].rows,id+' '+balanced[i].id);
   assert.equal(frequency[i].notice,balanced[i].notice);
  }
 }
});
test('expanded automatic decisions obey reviewed thresholds and exclusions independently',()=>{
 const config=JSON.parse(read('data/spanish-lemmas/tense-examples/frequency-pilot.json'));
 const review=JSON.parse(read('data/spanish-lemmas/tense-examples/frequency-selection-review.json'));
 const people=JSON.parse(read('data/spanish-lemmas/tense-examples/people.json'));
 const slots={yo:0,tú:1,él:2,ella:2,nosotros:3,nosotras:3,ellos:5,ellas:5};
 for(const [word,e]of Object.entries(config.entries)){
  if(!['leading-eligible-form','near-leader-variety'].includes(e.selectionRule))continue;
  const eligible=e.presentCandidates.filter(c=>c.slot!==4&&!c.excludedFromAutomaticRanking&&c.count!==null).sort((a,b)=>b.count-a.count||b.channels-a.channels||a.slot-b.slot);
  const top=eligible[0],previous=eligible.find(c=>c.slot===slots[people[word]]);
  const retain=previous&&previous.count>=top.count*review.nearLeaderCountRatio&&previous.channels>=top.channels*review.nearLeaderChannelRatio;
  assert.equal(e.anchor,(retain?previous:top).form,word);
  assert.equal(slots[e.person],(retain?previous:top).slot,word);
 }
});
test('lookup URLs lead to the unified experience regardless of historical example mode',async()=>{
 const {exampleNoteHref}=await import('../lemmas/example-mode.js');
 assert.equal(exampleNoteHref('corpes:comer:V',{set:3,search:'?examples=frequency&unrelated=1'}),'/lemmas/notes.html?set=3#corpes%3Acomer%3AV');
 assert.equal(exampleNoteHref('corpes:ser:V',{search:'?examples=balanced'}),'/lemmas/notes.html#corpes%3Aser%3AV');
 assert.equal(exampleNoteHref('corpes:ser:V',{search:'?examples=bad'}),'/lemmas/notes.html#corpes%3Aser%3AV');
});
