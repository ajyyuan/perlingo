import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {tenseExamples} from '../lemmas/tense-examples-data.js';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {formGroups} from '../lemmas/verb-forms.js';
import {exampleMarkup} from '../lemmas/sentence-help.js';
import {tenerGroups} from '../lemmas/tener-prototype.js';
const keys=['present','preterite','imperfect','future','conditional','perfect','subjunctive','commands','negative'];
test('every verb and tense has a distinct translated example or explicit usage exception',()=>{
 assert.deepEqual(Object.keys(tenseExamples).sort(),Object.keys(verbForms).sort());
 for(const [id,examples]of Object.entries(tenseExamples)){
  assert.deepEqual(Object.keys(examples).sort(),keys.slice().sort(),id);
  const texts=[];for(const [key,e]of Object.entries(examples)){
   if(e.notice){assert.ok(e.notice.length>10);continue;}
   assert.ok(e.text&&e.translation,`${id} ${key}`);texts.push(e.text);
   assert.doesNotThrow(()=>exampleMarkup(e),`${id} ${key}`);
   assert.ok(!/undefined|\[object|NaN/.test(e.text+e.translation));
   if(e.target){
    const normalized=e.text.toLocaleLowerCase('es');assert.ok(normalized.includes(e.target.toLocaleLowerCase('es')),`${id} ${key} target`);
    const rows=verbForms[id][key];assert.ok(rows.flat().includes(e.target),`${id} ${key}: sourced form ${e.target}`);
    if(e.slot!==undefined)assert.ok(rows[['commands','negative'].includes(key)?0:e.slot].includes(e.target));
   }
  }
  assert.equal(new Set(texts).size,texts.length,id+' distinct examples');
  for(const g of formGroups({id,word:id.split(':')[1]}))assert.ok(g.text||g.notice||g.exampleNotice);
 }
});
test('defective forms, impersonal agreement and irregular translations are handled explicitly',()=>{
 const get=w=>tenseExamples['corpes:'+w+':V'];
 for(const k of ['future','conditional','commands','negative','preterite'])assert.equal(formGroups({id:'corpes:soler:V',word:'soler'}).find(g=>g.id===k).rows.length,0);
 assert.match(formGroups({id:'corpes:soler:V',word:'soler'}).find(g=>g.id==='perfect').cue,/uncommon/);
 assert.equal(get('haber').perfect.text,'Ha habido un cambio.');
 assert.equal(get('gustar').present.text,'La canción le gusta a Ana.');
 assert.equal(get('gustar').present.translation,'Ana likes the song.');
 assert.equal(get('hacer').perfect.translation,'You have made the meal.');
 assert.equal(get('ir').preterite.translation,'Yesterday you went to the market.');
 assert.equal(get('ser').commands.text,'Sé amable con todos.');
 assert.equal(get('escribir').perfect.target,'has escrito');
 assert.equal(get('saber').preterite.translation,'Yesterday you found out the answer.');
 assert.equal(get('perder').commands.text,'Pierde el miedo.');
 for(const g of tenerGroups){assert.equal(get('tener')[g.id].text,g.text);assert.equal(get('tener')[g.id].translation,g.translation);}
});
test('example bank rebuild is deterministic and offline',()=>{
 const path=new URL('../lemmas/tense-examples-data.js',import.meta.url),before=readFileSync(path,'utf8');
 execFileSync(process.execPath,['scripts/build-lemma-tense-examples.mjs'],{cwd:new URL('../',import.meta.url)});
 assert.equal(readFileSync(path,'utf8'),before);
});
