import test from 'node:test';
import assert from 'node:assert/strict';
import {migrateProgress,planDay,applyPhase,ANSWER_CAP,checkpointDay,restartDay} from '../src/app-days.js';
const settings={languages:['es','fr','de'],noun:4,verb:2,grammar:1,sentence:2};
const bank=Array.from({length:150},(_,i)=>({id:`c${String(i).padStart(3,'0')}`,type:'noun',unitId:i<145?'u01':'u02'}));
const pair={id:'c000',lang:'es'};
test('new -> 4 -> 32 -> graduate uses app-day offsets only',()=>{
 let h=applyPhase({},[pair],{'c000:es':false},1,'new');
 assert.deepEqual(h['c000:es'],{stage:0,dueDay:5,seen:1,correct:0});
 assert.equal(planDay(bank,settings,h,4).reviews.length,0);
 assert.equal(planDay(bank,settings,h,5).reviews.length,1);
 h=applyPhase(h,[pair],{'c000:es':true},5,'review');assert.equal(h['c000:es'].dueDay,37);assert.equal(h['c000:es'].stage,1);
 h=applyPhase(h,[pair],{'c000:es':true},37,'review');assert.equal(h['c000:es'].stage,2);assert.equal(h['c000:es'].dueDay,null);
 assert.equal(planDay(bank,settings,h,10000).reviews.length,0);
 assert.ok(!planDay(bank,settings,h,10000).fresh.some(p=>p.id==='c000'&&p.lang==='es'));
});
test('a miss at either review stage resets to four app-days without graduating',()=>{
 for(const stage of [0,1]){
  const h=applyPhase({'c000:es':{stage,dueDay:10,seen:2,correct:1}},[pair],{'c000:es':false},10,'review');
  assert.equal(h['c000:es'].stage,0);assert.equal(h['c000:es'].dueDay,14);
  assert.equal(h['c000:es'].seen,3);
 }
});
test('108 cap uses oldest reviews across units and carries overflow before new material',()=>{
 const history=Object.fromEntries(bank.map((item,i)=>[`${item.id}:es`,{stage:0,dueDay:i<140?9:1}]));
 const plan=planDay(bank,settings,history,10,{unitId:'u01'});
 assert.equal(plan.reviews.length,ANSWER_CAP);assert.equal(plan.fresh.length,0);assert.equal(plan.overflow,42);
 assert.equal(plan.reviews[0].id,'c140');assert.ok(plan.reviews.some(p=>p.id==='c149'));
 const first=Object.fromEntries(plan.reviews.map(p=>[`${p.id}:${p.lang}`,true]));
 const updated=applyPhase(history,plan.reviews,first,10,'review');
 assert.equal(planDay(bank,settings,updated,11).reviews.length,42);
});
test('new material shrinks with review pressure and never splits a language group',()=>{
 const h=Object.fromEntries(bank.slice(0,90).map(item=>[`${item.id}:es`,{stage:0,dueDay:1}]));
 const plan=planDay(bank,{...settings,noun:9},h,1,{unitId:'u02'});
 assert.equal(plan.reviews.length,90);assert.equal(plan.fresh.length,15); // five concepts available in u02
 const p=planDay(bank,{...settings,noun:9},h,1);
 assert.equal(p.fresh.length,18);assert.equal(p.reviews.length+p.fresh.length,108);
 const crowded=Object.fromEntries(bank.slice(0,107).flatMap(item=>settings.languages.map(lang=>[`${item.id}:${lang}`,{stage:2,dueDay:null}])));
 bank.slice(0,107).forEach(item=>crowded[`${item.id}:es`]={stage:0,dueDay:1});
 assert.equal(planDay(bank,settings,crowded,1).fresh.length,0); // one free slot cannot fit a three-language concept
});
test('new concepts cap at nine; only unseen enabled languages and selected unit are taught',()=>{
 const h={'c000:es':{stage:0,dueDay:5},'c000:fr':{stage:2,dueDay:null}};
 const p=planDay(bank,{...settings,noun:100},h,1);
 assert.equal(new Set(p.fresh.map(p=>p.id)).size,9);
 assert.deepEqual(p.fresh.filter(p=>p.id==='c000'),[{id:'c000',lang:'de'}]);
 const other=planDay(bank,{...settings,languages:['de']},h,1,{unitId:'u02'});
 assert.equal(other.reviews.length,0);assert.ok(other.fresh.every(p=>p.lang==='de'&&p.id>='c145'));
});
test('migration preserves history backup and sessions, maps overdue to day 1, others to day 5, and is idempotent',()=>{
 const original={settings,history:{a:{due:20,interval:8,seen:3,correct:2},b:{due:200,interval:60}},sessions:[{date:'old'}]};
 const migrated=migrateProgress(original,100);
 assert.equal(migrated.appDay,1);assert.equal(migrated.history.a.dueDay,1);assert.equal(migrated.history.b.dueDay,5);
 assert.equal(migrated.history.b.stage,0);assert.deepEqual(migrated.legacyHistory,original.history);
 assert.deepEqual(migrated.sessions,original.sessions);assert.equal(original.srsVersion,undefined);
 assert.equal(migrateProgress(migrated,9999999),migrated);
 assert.deepEqual(planDay(bank,settings,{},1),planDay(bank,settings,{},1));
});
test('phase scheduling does not touch other languages, future pairs or original state',()=>{
 const h={'c000:es':{stage:0,dueDay:1},'c000:fr':{stage:1,dueDay:30}};
 const updated=applyPhase(h,[pair],{'c000:es':true},1,'review');
 assert.equal(h['c000:es'].stage,0);assert.deepEqual(updated['c000:fr'],h['c000:fr']);
 assert.throws(()=>applyPhase(h,[{id:'c000',lang:'fr'}],{'c000:fr':true},1,'review'));
 assert.throws(()=>applyPhase(h,[pair],{},1,'review'));
});
test('active batches survive JSON storage with frozen queue, feedback and next phase',()=>{
 const data=migrateProgress({settings,history:{},sessions:[]});data.activeDay=planDay(bank,settings,data.history,1);
 data.activeDay.state={view:'quiz',queue:[pair],qi:0,feedback:{input:'wrong',correct:false},first:{'c000:es':false},round:1};
 const restored=migrateProgress(JSON.parse(JSON.stringify(data)));
 assert.deepEqual(restored.activeDay,data.activeDay);assert.equal(restored.appDay,1);
});

test('restart rolls back completed reviews, keeps the frozen plan and does not advance the day',()=>{
 const history={'c000:es':{stage:0,dueDay:5,seen:1,correct:1},other:{stage:1,dueDay:60}};
 const batch=planDay(bank,settings,history,5);
 const scheduled=applyPhase(history,batch.reviews,{'c000:es':true},5,'review');
 const data={appDay:5,settings,history:scheduled,activeDay:{...batch,phase:'new',state:{view:'quiz',feedback:{correct:false}}},sessions:[{appDay:4,sessionKind:'new'},{appDay:5,sessionKind:'review'},{mode:'contrast'}]};
 const restarted=restartDay(JSON.parse(JSON.stringify(data)));
 assert.deepEqual(restarted.history,history);assert.equal(restarted.appDay,5);
 assert.equal(restarted.activeDay.phase,'review');assert.equal(restarted.activeDay.state,null);
 assert.deepEqual(restarted.activeDay.reviews,batch.reviews);assert.deepEqual(restarted.activeDay.fresh,batch.fresh);
 assert.deepEqual(restarted.sessions,[data.sessions[0],data.sessions[2]]);
 assert.equal(data.history['c000:es'].dueDay,37);
 assert.deepEqual(restartDay(restarted),restarted);
 const replayed=applyPhase(restarted.history,batch.reviews,{'c000:es':false},5,'review');
 assert.equal(replayed['c000:es'].seen,2);assert.equal(replayed['c000:es'].dueDay,9);
});
test('new-only and review-only days restart after serialization without replacing the batch',()=>{
 for(const noun of [0,1]){
  const history=noun?{}:{'c000:es':{stage:1,dueDay:37,seen:2,correct:2}};
  const batch=planDay(bank,{...settings,noun,verb:0,grammar:0,sentence:0},history,37);
  const data={appDay:37,history,settings,sessions:[],activeDay:{...batch,state:{round:3,qi:2,first:{'c000:es':false}}}};
  const restarted=restartDay(JSON.parse(JSON.stringify(data)));
  assert.equal(restarted.activeDay.phase,noun?'new':'review');assert.equal(restarted.activeDay.state,null);
  assert.deepEqual(restarted.history,history);assert.deepEqual(restarted.activeDay.fresh,batch.fresh);
 }
});
test('legacy unfinished days gain checkpoints only when their starting history is still known',()=>{
 const history={'c000:es':{stage:0,dueDay:1}};
 const batch={day:1,reviews:[pair],fresh:[],phase:'review',state:{qi:1}};
 const upgraded=checkpointDay(batch,history);assert.deepEqual(upgraded.restartHistory,history);
 history['c000:es'].stage=1;assert.equal(upgraded.restartHistory['c000:es'].stage,0);
 const completedReview={...batch,phase:'new'};
 assert.equal(checkpointDay(completedReview,history),completedReview);
 assert.throws(()=>restartDay({appDay:1,activeDay:completedReview}));
 assert.throws(()=>restartDay({appDay:2,activeDay:upgraded}));
 assert.throws(()=>restartDay({appDay:2,activeDay:null}));
});
