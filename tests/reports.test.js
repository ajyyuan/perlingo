import test from 'node:test';
import assert from 'node:assert/strict';
import {reportContext,readReports,saveReport,reportStorageKey} from '../src/reports.js';
import {foundation} from '../src/content/foundation.js';
import {lessonEntries} from '../src/content/model.js';
const memory=()=>{const values=new Map();return {getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};};
test('a report retains the taught version and submitted answer independently of later content changes',()=>{
 const item=lessonEntries(foundation)[0];const context=reportContext(item,'fr',{phase:'recall-feedback',input:'my alternative'});
 assert.equal(context.packId,foundation.id);assert.equal(context.packVersion,foundation.version);assert.equal(context.submittedAnswer,'my alternative');
 assert.equal(context.taughtAnswer,item.fr);assert.deepEqual(context.translation,foundation.entries[0].translations.fr);
 context.translation.text='changed snapshot';assert.notEqual(foundation.entries[0].translations.fr.text,'changed snapshot');
 assert.ok(Object.keys(context.lexemes).length);
});
test('legacy reports honestly omit a structured pack version',()=>{
 const context=reportContext({id:'legacy-test',en:'hello',es:'hola'},'es');
 assert.equal(context.packId,'starter');assert.equal(context.packVersion,null);assert.equal(context.translation,null);
});
test('reports append without replacing earlier reports',()=>{
 const storage=memory();const report={id:'a',note:'wrong gender',context:{entryId:'f-mother'}};
 saveReport(storage,report);saveReport(storage,{...report,id:'b'});assert.deepEqual(readReports(storage).map(r=>r.id),['a','b']);
});
test('unreadable saved reports and write failures never appear successful or overwrite existing data',()=>{
 for(const raw of ['{','{}','[{}]']){const storage=memory();storage.setItem(reportStorageKey,raw);assert.throws(()=>saveReport(storage,{id:'a'}));assert.equal(storage.getItem(reportStorageKey),raw);}
 assert.throws(()=>saveReport({getItem:()=>null,setItem:()=>{throw new Error('Quota exceeded');}},{id:'a'}));
});
