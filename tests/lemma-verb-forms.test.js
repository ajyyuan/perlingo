import {beforeLaterContextCorrections} from './helpers/context-integrity.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {formGroups,formGroup,referenceForms} from '../lemmas/verb-forms.js';
import {combineNotes} from '../lemmas/notes-library.js';
import {tenerGroups} from '../lemmas/tener-prototype.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const deck=read('lemmas/data/deck.json'),library=combineNotes(read('lemmas/data/notes.json'),read('lemmas/data/context.json'));
const notes=new Map(library.notes.map(n=>[n.word+':'+n.label,n]));
const note=w=>notes.get(w+':verb');
const rows=(w,id)=>formGroup(note(w),id).rows.map(r=>r.lemma);
test('every course verb has all nine reference groups; nonverbs have none',()=>{
 assert.equal(Object.keys(verbForms).length,369);
 for(const n of library.notes){const groups=formGroups(n);assert.equal(groups.length,n.label==='verb'?9:0,n.id);if(!groups.length)continue;
  assert.equal(new Set(groups.map(g=>g.id)).size,9);
  for(const g of groups){assert.ok(g.cue&&g.title);assert.ok(g.rows.length||g.notice);for(const r of g.rows){assert.ok(r.label&&r.sourceLabel&&r.lemma);assert.ok(r.alternatives.includes(r.lemma));}}
  for(const [,form]of n.forms)assert.ok(formGroup(n).rows.some(r=>r.alternatives.includes(form)),`${n.word}: ${form}`);
 }
 for(const g of tenerGroups)assert.deepEqual(rows('tener',g.id),g.rows.map(r=>r.lemma));
});
test('irregular families retain their tense, person and accent distinctions',()=>{
 assert.deepEqual(rows('ser','preterite'),['fui','fuiste','fue','fuimos','fuisteis','fueron']);
 assert.deepEqual(rows('ser','imperfect'),['era','eras','era','éramos','erais','eran']);
 assert.deepEqual(rows('ser','commands'),['sé','sea','sed','sean']);
 assert.deepEqual(rows('ir','commands'),['ve','vaya','id','vayan']);
 assert.deepEqual(rows('ir','negative'),['no vayas','no vaya','no vayáis','no vayan']);
 assert.deepEqual(rows('decir','preterite'),['dije','dijiste','dijo','dijimos','dijisteis','dijeron']);
 assert.deepEqual(rows('conducir','preterite'),['conduje','condujiste','condujo','condujimos','condujisteis','condujeron']);
 assert.deepEqual(rows('dormir','subjunctive'),['duerma','duermas','duerma','durmamos','durmáis','duerman']);
 assert.deepEqual(rows('prever','preterite'),['preví','previste','previó','previmos','previsteis','previeron']);
 assert.equal(rows('reír','preterite')[2],'rio');assert.equal(rows('reír','subjunctive')[4],'riais');
 assert.equal(rows('oír','preterite')[2],'oyó');assert.equal(rows('hacer','preterite')[2],'hizo');
 assert.equal(rows('poner','perfect')[0],'he puesto');assert.equal(rows('abrir','perfect')[0],'he abierto');
 assert.equal(rows('volver','perfect')[0],'he vuelto');assert.equal(rows('escribir','perfect')[0],'he escrito');
 assert.equal(rows('elegir','perfect')[0],'he elegido');assert.equal(rows('pagar','perfect')[0],'he pagado');
 assert.deepEqual(formGroup(note('describir'),'perfect').rows[0].alternatives,['he descrito','he descripto']);
 assert.match(formGroup(note('describir'),'perfect').cue,/Río de la Plata/);
 for(const w of ['ir','estar','hacer'])assert.ok(referenceForms(note(w)).every(([,f])=>!f.startsWith('me ')));
});
test('impersonal/event uses do not acquire misleading personal or command tables',()=>{
 for(const w of ['ocurrir','suceder','consistir'])for(const g of formGroups(note(w))){assert.equal(g.rows.length,['commands','negative'].includes(g.id)?0:2);}
 assert.deepEqual(rows('haber','perfect'),['ha habido']);
 assert.deepEqual(rows('haber','present'),['he','has','ha','hemos','habéis','han','hay']);
 assert.equal(formGroup(note('haber'),'commands').rows.length,0);assert.match(formGroup(note('haber'),'commands').notice,/not used/);
});
test('all simple reference forms match frozen tagged source slots and older snapshot membership evidence',()=>{
 const evidence=read('data/spanish-lemmas/conjugation-evidence.json').records;
 const audit=read('data/spanish-lemmas/conjugation-audit.json');
 const membership=new Set(audit.matches.map(r=>r.join('|')));
 for(const card of deck.filter(c=>c.sourceTag==='V')){
  const record=evidence[card.lemma];assert.ok(record.url&&record.sha256);const source=record.entries.flatMap(e=>{let active=false;return e.forms.filter(r=>{if(r.tags.includes('inflection-template'))active=false;if(r.tags.includes('infinitive'))active=r.form===card.lemma;return active&&!r.tags.some(t=>['combined-form','vos-form','archaic','obsolete','dated','rare','nonstandard'].includes(t));});});
  const tags={present:['indicative','present'],preterite:['indicative','preterite'],imperfect:['indicative','imperfect'],future:['indicative','future'],conditional:['conditional'],subjunctive:['subjunctive','present'],commands:['imperative'],negative:['imperative','negative']};
  const slots=[['first-person','singular'],['second-person','singular'],['third-person','singular'],['first-person','plural'],['second-person','plural'],['third-person','plural']];
  for(const [kind,required]of Object.entries(tags))verbForms[card.id][kind].forEach((alternatives,i)=>{const slot=slots[['commands','negative'].includes(kind)?[1,2,4,5][i]:i];for(const f of alternatives)assert.ok(source.some(r=>r.form===f.replace(/^no /,'')&&[...required,...slot].every(t=>r.tags.includes(t))&&r.tags.includes('negative')===(kind==='negative')),`${card.lemma}: ${kind} ${slot} ${f}`);});
  for(const [kind,table]of Object.entries(verbForms[card.id])){if(kind==='perfect')continue;for(const f of kind==='participle'?table:table.flat()){
   const word=f.replace(/^no /,'');assert.ok(source.some(r=>r.form===word),`${card.lemma}: ${f}`);assert.ok(membership.has(card.lemma+'|'+word),`${card.lemma}: ${f}`);
  }}
 }
 const digest=p=>createHash('sha256').update(readFileSync(new URL('../'+p,import.meta.url))).digest('hex');
 assert.equal(digest('lemmas/data/deck.json'),audit.unchanged.deck);
 // The later function-word review changes contextual help, not assessment content.
 const followUp=read('data/spanish-lemmas/function-word-audit.json').contextIntegrity;
 assert.equal(followUp.beforeSha256,audit.unchanged.context);
 const nounReview=read('data/spanish-lemmas/noun-adjective-audit.json').contextIntegrity;
 assert.equal(nounReview.beforeSha256,followUp.afterSha256);
 const pronounReview=read('data/spanish-lemmas/pronoun-recall-audit.json');
 assert.equal(pronounReview.beforeSha256,nounReview.afterSha256);
 assert.equal(beforeLaterContextCorrections().sha256,pronounReview.afterSha256);
 const schedule=read('data/spanish-lemmas/six-day-schedule-audit.json').files;
 const recall=read('data/spanish-lemmas/day1-recall-audit.json').files;
 const retries=read('data/spanish-lemmas/retry-assessment-audit.json').files;
 const restart=read('data/spanish-lemmas/restart-pass-audit.json').files;
 for(const [file,hash]of Object.entries(audit.unchanged.assessment)){
  const chain=[schedule,recall,retries,restart].map(a=>a[file]).filter(Boolean);
  const current=chain[0]?.beforeSha256??digest(file);
  for(let i=0;i<chain.length;i++)assert.equal(chain[i+1]?.beforeSha256??digest(file),chain[i].afterSha256,file);
  if(file==='lemmas/progress.js'){const seedAudit=read('data/spanish-lemmas/tense-examples/course-seed-audit.json');assert.equal(seedAudit.beforeSha256,hash);assert.equal(current,seedAudit.afterSha256);}
  else assert.equal(current,hash);
 }
});
test('conjugation compilation is deterministic and offline',()=>{
 const path=new URL('../lemmas/verb-forms-data.js',import.meta.url),before=readFileSync(path,'utf8');
 execFileSync('python3',['scripts/build-lemma-conjugations.py'],{cwd:new URL('../',import.meta.url)});assert.equal(readFileSync(path,'utf8'),before);
});

test('guide forms for every verb match the tagged infinitive paradigm, tense and person', async()=>{
 const {guideForms}=await import('../lemmas/verb-guide-data.js');
 const {verbGuide}=await import('../lemmas/verb-guide.js');
 const evidence=read('data/spanish-lemmas/conjugation-evidence.json').records;
 assert.deepEqual(Object.keys(guideForms).sort(),Object.keys(verbForms).sort());
 for(const n of library.notes){
  const sections=verbGuide(n);
  if(n.label!=='verb'){assert.deepEqual(sections,[]);continue;}
  const lessons=sections.flatMap(section=>section.lessons);
  for(const lesson of lessons) assert.ok(lesson.notice||(lesson.rows.length&&lesson.rows.every(r=>r.sourceLabel&&r.alternatives.length)),n.word+' '+lesson.id);
  const source=evidence[n.word].entries.flatMap(entry=>{
   let active=false;
   return entry.forms.filter(f=>{
    if(f.tags.includes('inflection-template'))active=false;
    if(f.tags.includes('infinitive'))active=f.form===n.word;
    return active&&f.source==='conjugation'&&!f.tags.some(t=>['combined-form','vos-form','archaic','obsolete','dated','rare','nonstandard'].includes(t));
   });
  });
  const matching=tags=>[...new Set(source.filter(f=>tags.every(tag=>f.tags.includes(tag))).map(f=>f.form))];
  assert.deepEqual(guideForms[n.id].gerund,matching(['gerund']));
  for(const [key,tense] of [['pastSubjunctive','imperfect'],['futureSubjunctive','future']]){
   const slots=guideForms[n.id][key];
   assert.equal(slots.length,6);
   slots.forEach((row,index)=>assert.deepEqual(row,matching(['subjunctive',tense,['first-person','second-person','third-person'][index%3],index<3?'singular':'plural'])));
  }
 }
 const lesson=(word,id)=>verbGuide(note(word)).flatMap(group=>group.lessons).find(l=>l.id===id);
 assert.deepEqual(lesson('ir','commands').rows[2].alternatives,['vamos','vayamos']);
 assert.deepEqual(lesson('ir','negative').rows[2].alternatives,['no vayamos']);
 assert.deepEqual(lesson('hacer','pastPerfect').rows[0].alternatives,['había hecho']);
 assert.deepEqual(lesson('venir','pastSubjunctive').rows[3].alternatives,['viniéramos','viniésemos']);
 assert.deepEqual(lesson('haber','futurePerfect').rows,[{slot:2,sourceLabel:'impersonal',alternatives:['habrá habido']}]);
 assert.equal(lesson('ocurrir','pastPerfect').rows.length,2);
 assert.equal(lesson('soler','futurePerfect'),undefined);
});

test('reference retains the full tense inventory, commands and nonfinite forms', async()=>{
 const {verbGuide}=await import('../lemmas/verb-guide.js');
 const tables=new Map(verbGuide(note('tener')).flatMap(g=>g.lessons.map(l=>[l.id,l])));
 assert.equal(tables.size,19);
 assert.deepEqual(tables.get('nonfinite').rows.map(r=>r.alternatives[0]),['tener','teniendo','tenido','haber tenido','habiendo tenido']);
 for(const [id,form] of [['preterite','tuve'],['future','tendré'],['conditional','tendría'],['pastAnterior','hube tenido'],['futurePerfectSubjunctive','hubiere tenido']]) assert.equal(tables.get(id).rows[0].alternatives[0],form);
});

test('overview fits 9 plus 8 tables, with all rare tenses recoverable', async()=>{
 const {guideOverview}=await import('../lemmas/verb-guide-view.js');
 const note={id:'corpes:tener:V',word:'tener'};
 const common=guideOverview(note),full=guideOverview(note,{rare:true});
 assert.equal(common.top.length,9);assert.equal(common.bottom.length,8);
 assert.equal(full.top.length,10);assert.equal(full.bottom.length,10);
 const all=[...full.top,...full.bottom];
 for(const id of ['pastAnterior','futureSubjunctive','futurePerfectSubjunctive'])assert.ok(all.some(l=>l.id===id));
 assert.deepEqual(common.bottom.find(l=>l.id==='gerund').rows[0].alternatives,['teniendo']);
 assert.deepEqual(common.bottom.find(l=>l.id==='participle').rows[0].alternatives,['tenido']);
 assert.ok(full.nonfinite.rows.some(r=>r.alternatives.includes('habiendo tenido')));
});
