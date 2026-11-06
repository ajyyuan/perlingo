import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {combineNotes} from '../lemmas/notes-library.js';
import {choiceOptions} from '../lemmas/choice-data.js';
import {createTest,checkAnswer,advanceTest,optionsFor,currentChoiceOptions,validTest} from '../lemmas/assessment.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const library=combineNotes(read('lemmas/data/notes.json'),read('lemmas/data/context.json'),read('lemmas/data/day1-usage.json'));
const notes=new Map(library.notes.map(n=>[n.id,n]));
const deck=read('lemmas/data/deck.json').map(c=>({...c,meaning:notes.get(c.id).meaning}));
const card=rank=>deck[rank-1];
const permutations=values=>values.length?values.flatMap((v,i)=>permutations(values.filter((_,j)=>j!==i)).map(rest=>[v,...rest])):[[]];

test('all 1500 reviewed MCQs rebuild exactly and each displayed answer has the intended score',()=>{
 assert.deepEqual(Object.keys(choiceOptions),deck.map(c=>c.id));
 for(const c of deck){
  const options=optionsFor(c,()=>0.4);
  assert.equal(options.length,4);assert.equal(new Set(options).size,4);assert.ok(options.includes(c.meaning));
  for(const response of options){
   const result=checkAnswer({...createTest('choice',[c.id]),options},response,c);
   assert.equal(result.feedback.correct,response===c.meaning,c.id+': '+response);
   assert.equal(result.firstCorrect,response===c.meaning?1:0);
   if(result.feedback.correct)assert.equal(advanceTest(result).done,true);
   else assert.equal(advanceTest(result).done,false);
  }
 }
 execFileSync(process.execPath,['scripts/build-lemma-choices.mjs','--check']);
});

test('every ordering is stable on resume; no arbitrary or duplicate option survives',()=>{
 for(const c of deck){
  const t=createTest('choice',[c.id]);
  for(const options of permutations(choiceOptions[c.id])){
   assert.strictEqual(currentChoiceOptions({...t,options},c),options);
   assert.equal(validTest({...t,options},[c.id]),true);
  }
  for(const options of [undefined,[c.meaning],[c.meaning,c.meaning,'wrong','other'],[c.meaning,'arbitrary','unreviewed','text']]){
   const before={...t,options},snapshot=structuredClone(before);
   assert.deepEqual(new Set(currentChoiceOptions(before,c)),new Set(choiceOptions[c.id]));
   assert.deepEqual(before,snapshot,'Refreshing options must not reset progress');
  }
 }
 const c=card(256);assert.notDeepEqual(optionsFor(c,()=>0),optionsFor(c,()=>0.99));
});

test('the original synonym collisions and other-sense collisions cannot appear as wrong answers',()=>{
 for(const [a,b] of [[256,269],[264,287],[509,516],[305,334],[357,399],[397,363],[901,912],[1430,1449],[1455,1451],[1280,1281],[466,470],[1078,1082],[1247,1246],[361,395],[366,395],[1451,1460]]){
  assert.ok(!choiceOptions[card(a).id].slice(1).includes(card(b).meaning),`${a}/${b}`);
  assert.ok(!choiceOptions[card(b).id].slice(1).includes(card(a).meaning),`${b}/${a}`);
 }
});

test('an unanswered legacy question refreshes, while existing feedback and first score remain historical',()=>{
 const c=card(256),legacy=[c.meaning,card(269).meaning,card(253).meaning,card(272).meaning];
 const t={...createTest('choice',[c.id]),pass:3,round:4,firstCorrect:1,options:legacy};
 const refreshed=currentChoiceOptions(t,c);
 assert.ok(!refreshed.includes(card(269).meaning));
 assert.equal(t.pass,3);assert.equal(t.round,4);assert.equal(t.firstCorrect,1);
 const checked=checkAnswer(t,card(269).meaning,c);
 assert.strictEqual(currentChoiceOptions(checked,c),legacy);
 assert.strictEqual(checkAnswer(checked,c.meaning,c),checked);
 assert.equal(checked.feedback.correct,false);assert.equal(checked.firstCorrect,1);
 const next=advanceTest(checked);assert.equal(next.mode,'repair');
 assert.deepEqual(new Set(currentChoiceOptions(next,c)),new Set(choiceOptions[c.id]));
});

test('missing or changed reviewed meanings fail instead of silently inventing distractors',()=>{
 assert.throws(()=>optionsFor({id:'unreviewed',meaning:'anything'}),/reviewed choices/);
 assert.throws(()=>optionsFor({...card(256),meaning:'changed meaning'}),/reviewed choices/);
 assert.equal(card(650).meaning,'food; nourishment');
 for(const options of Object.values(choiceOptions))assert.ok(options.every(o=>!o.includes('solid substance that can be consumed')));
 const app=readFileSync(new URL('../lemmas/app.js',import.meta.url),'utf8');
 assert.ok(app.includes('currentChoiceOptions(t,c)'),'Live quiz must refresh resumed questions');
});
