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
    if(e.slot!==undefined)assert.ok(rows[e.slot].includes(e.target));
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
 assert.equal(get('hacer').perfect.translation,'We have made the meal.');
 assert.equal(get('ir').preterite.translation,'Yesterday she went to the market.');
 assert.equal(get('ser').commands.text,'Sé amable con todos.');
 assert.equal(get('escribir').perfect.target,'he escrito');
 assert.equal(get('saber').preterite.translation,'Yesterday we found out the answer.');
 assert.equal(get('perder').commands.text,'Pierde el miedo.');
 assert.equal(get('tener').subjunctive.text,'Es posible que yo tenga tiempo.');
 for(const g of tenerGroups.filter(g=>g.id!=='subjunctive')){assert.equal(get('tener')[g.id].text,g.text);assert.equal(get('tener')[g.id].translation,g.translation);}
});
test('example bank rebuild is deterministic and offline',()=>{
 const path=new URL('../lemmas/tense-examples-data.js',import.meta.url),before=readFileSync(path,'utf8');
 execFileSync(process.execPath,['scripts/build-lemma-tense-examples.mjs'],{cwd:new URL('../',import.meta.url)});
 assert.equal(readFileSync(path,'utf8'),before);
});
test('stable subject assignments balance five groups and agree across non-command tenses',()=>{
 const people=JSON.parse(readFileSync(new URL('../data/spanish-lemmas/tense-examples/people.json',import.meta.url)));
 const slots={yo:0,tú:1,él:2,ella:2,nosotros:3,nosotras:3,ellos:5,ellas:5};
 const counts={0:0,1:0,2:0,3:0,5:0};
 for(const [word,person]of Object.entries(people)){
  const slot=slots[person];counts[slot]++;
  for(const key of keys.filter(k=>!['commands','negative'].includes(k))){
   const e=tenseExamples['corpes:'+word+':V'][key];
   assert.equal(e.slot,slot,word+' '+key);
   assert.ok(e.text.toLocaleLowerCase('es').includes(person+' '),e.text);
   assert.ok(verbForms['corpes:'+word+':V'][key][slot].includes(e.target),e.text);
   assert.ok(!/\bi\b|\bI (?:are|were|has)\b|\b(?:He|She|he|she) have\b|\b(?:We|They|we|they) has\b/.test(e.translation),e.translation);
  }
 }
 assert.deepEqual(counts,{0:70,1:69,2:69,3:69,5:69});
 const get=w=>tenseExamples['corpes:'+w+':V'];
 assert.equal(get('ser').present.translation,'I am kind to everyone.');
 assert.equal(get('ser').preterite.translation,'Yesterday I was kind to everyone.');
 assert.equal(get('ir').present.translation,'She goes to the market.');
 assert.equal(get('poder').present.translation,'They are able to open the door.');
 assert.equal(get('recuperar').present.translation,'I recover my strength.');
 assert.equal(get('contener').present.translation,'He contains his emotion.');
 assert.equal(get('conocer').preterite.translation,'Yesterday I got to know the city.');
 assert.equal(get('hacer').perfect.wordMeanings.hemos,'we have (auxiliary)');
 assert.equal(get('ser').subjunctive.wordMeanings.es,'it is');
});
