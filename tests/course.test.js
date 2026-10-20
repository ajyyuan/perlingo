import test from 'node:test';
import assert from 'node:assert/strict';
import {coursePacks} from '../src/content/course/index.js';
import {courseCoverage,courseTotals,lexicalKey} from '../src/content/course/coverage.js';
import {units} from '../src/content/course/units.js';
import {validatePack,lessonEntries} from '../src/content/model.js';
import {makeLesson,key} from '../src/engine.js';
import {checkAnswer} from '../src/recall.js';
const pack=coursePacks[0];
test('course metadata and examples preserve stable unit and objective references',()=>{
 assert.deepEqual(validatePack(pack),[]);assert.equal(units.length,16);
 const invalid=structuredClone(pack);invalid.entries[0].unitId='u99';assert.ok(validatePack(invalid).some(e=>e.includes('unknown unit')));
 const example=lessonEntries(pack).find(e=>e.kind==='example');assert.equal(example.unitId,'u01');assert.ok(example.objectiveId.startsWith('u01.'));
});
test('coverage counts repeated French address forms once and preserves German formal pronoun',()=>{
 const coverage=courseCoverage(coursePacks);assert.ok(coverage[0].fr.vocabulary<Object.values(pack.lexemes).filter(l=>l.lang==='fr').length);
 assert.ok(coverage[7].es.vocabulary>=100);assert.equal(coverage[7].es.examples,24);
 assert.notEqual(lexicalKey({lang:'de',pos:'pronoun',lemma:'sie'}),lexicalKey({lang:'de',pos:'pronoun',lemma:'Sie'}));
});
test('listed variants are accepted while a different subject remains wrong',()=>{
 const item=lessonEntries(pack).find(e=>e.id==='course-u01-i-am-anna');const expected=[item.es,...item.acceptedAnswers.es];
 assert.ok(checkAnswer('Yo soy Anna!',expected));assert.ok(checkAnswer('Soy Anna',expected));assert.equal(checkAnswer('Eres Anna',expected),false);
 const spelling=lessonEntries(pack).find(e=>e.id==='course-u01-i-spell');assert.ok(checkAnswer("J’épèle le nom",[spelling.fr,...spelling.acceptedAnswers.fr]));assert.equal(checkAnswer('Je epelle le nom',[spelling.fr,...spelling.acceptedAnswers.fr]),false);
});
test('course selection restricts fresh material but keeps overdue reviews from earlier units',()=>{
 const bank=[{id:'old',unitId:'u01',type:'noun'},{id:'future',unitId:'u03',type:'noun'},{id:'new',unitId:'u02',type:'noun'}];
 const settings={languages:['fr'],noun:2,verb:0,grammar:0,sentence:0};
 const history={[key('old','fr')]:{due:1}};
 assert.deepEqual(makeLesson(bank,settings,history,2,{unitId:'u02'}).map(i=>i.id),['old','new']);
});
test('course evidence does not silently follow changed checked forms',()=>{
 const changed=structuredClone(pack);changed.lexemes['fr.u01-verb-1'].forms[1].text='sommes';
 assert.ok(validatePack(changed).some(e=>e.includes('source check is stale')));
});
test('accepted answers must be explicit nonempty strings',()=>{
 const changed=structuredClone(pack);changed.entries[0].translations.es.acceptedAnswers=[''];
 assert.ok(validatePack(changed).some(e=>e.includes('invalid accepted answers')));
});

test('every unit has validated authored examples and a production/contrast/transfer mix',()=>{
 for(const p of coursePacks)assert.deepEqual(validatePack(p),[],p.id);
 for(const unit of units)for(const o of unit.objectives){
  const examples=coursePacks.flatMap(p=>p.entries).filter(e=>e.objectiveId===o.id);
  for(const [mode,n] of [['production',4],['contrast',2],['transfer',2]])assert.ok(examples.filter(e=>e.mode===mode).length>=n,`${o.id}/${mode}`);
 }
});
test('whole-course vocabulary counts deduplicate repeated lemmas across units',()=>{
 for(const lang of ['es','fr','de']){
  const lexemes=coursePacks.flatMap(p=>Object.values(p.lexemes)).filter(l=>l.lang===lang);
  assert.ok(courseTotals(coursePacks)[lang].vocabulary>=1600,lang);
  assert.ok(new Set(lexemes.map(lexicalKey)).size<lexemes.length,lang);
 }
});
test('French downloading preserves the spelling-change e and disallows a wrong regular form',()=>{
 const p=coursePacks.find(p=>p.id==='course-u11'),l=p.lexemes['fr.u11-v-download'];
 assert.equal(l.forms.find(f=>f.tense==='present'&&f.person===1&&f.number==='plural').text,'téléchargeons');
 assert.ok(!l.forms.some(f=>f.text==='téléchargons'));
});

test('productive phrases and duplicate part-of-speech labels do not inflate vocabulary totals',()=>{
 const ls=[{lang:'de',lemma:'schnell',pos:'adjective'},{lang:'de',lemma:'schnell',pos:'adverb'},{lang:'de',lemma:'meine Familie',pos:'expression',countTowardsInventory:false}];
 assert.equal(courseTotals([{lexemes:Object.fromEntries(ls.map((l,i)=>[i,l])),entries:[]}]).de.vocabulary,1);
});

test('identical German noun spellings retain the selected case and number',()=>{
 const p=coursePacks.find(p=>p.id==='course-u16'),t=p.entries.find(e=>e.id==='course-u16-n-newspaper-article').translations.de;
 assert.deepEqual(t.wordDetails.Artikel.features,{number:'singular',case:'nominative'});
});

test('source-checked plural noun senses distinguish Spanish variants from French singular meanings',()=>{
 const get=(unit,id,lang)=>{
  const p=coursePacks.find(p=>p.id===`course-${unit}`);
  assert.equal(p.version,2);
  return {l:p.lexemes[`${lang}.${unit}-n-${id}`],t:p.entries.find(e=>e.id===`course-${unit}-n-${id}`).translations[lang]};
 };
 for(const [unit,id,singular] of [['u09','holiday','vacación'],['u12','scissors','tijera']]){
  const {l,t}=get(unit,id,'es');
  assert.ok(l.forms.some(f=>f.text===singular&&f.number==='singular'));
  assert.ok(checkAnswer(`la ${singular}`,[t.text,...t.acceptedAnswers]));
  assert.equal(checkAnswer(`las ${singular}`,[t.text,...t.acceptedAnswers]),false);
  assert.equal(t.wordDetails[l.lemma].features.number,'plural');
  assert.equal(t.wordDetails[l.lemma].note,t.chunks[0].detail);
 }
 for(const [unit,id,wrong,note] of [['u09','holiday','la vacance',/vacancy/],['u12','scissors','le ciseau',/chisel/],['u15','fee','le frais',/plural agreement/]]){
  const {l,t}=get(unit,id,'fr');
  assert.ok(l.forms.every(f=>f.number==='plural'));
  assert.equal(checkAnswer(wrong,[t.text,...t.acceptedAnswers]),false);
  assert.match(t.chunks[0].detail,note);
  assert.equal(t.wordDetails[l.lemma].note,t.chunks[0].detail);
 }
 const changed=structuredClone(coursePacks.find(p=>p.id==='course-u12'));
 changed.lexemes['es.u12-n-scissors'].forms.pop();
 assert.ok(validatePack(changed).some(e=>e.includes('source check is stale')));
});
