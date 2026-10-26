import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanDictation} from '../lemmas/dictation-text.js';
test('removes dictated punctuation and casing while preserving lexical accents and ñ',()=>{
 assert.equal(cleanDictation(' ¿Qué? '),'qué');assert.equal(cleanDictation('¡Niño!'),'niño');assert.equal(cleanDictation('Sí, claro.'),'sí claro');
});
test('sentence context resolves only explicit grammatical accent pairs',()=>{
 assert.equal(cleanDictation('¿Qué?',['que']),'que');assert.equal(cleanDictation('Que.',['qué']),'qué');
 assert.equal(cleanDictation('casa',['que']),'casa');assert.equal(cleanDictation('termino',['terminó']),'termino');assert.equal(cleanDictation('ano',['año']),'ano');assert.equal(cleanDictation('Qué.'),'qué');
});

import {contextPilot} from '../lemmas/context-pilot.js';
import {matchesContextAnswer} from '../lemmas/context-answer.js';
const hay=contextPilot.find(c=>c.target==='Hay');
test('hay/ay dictation uses the authored sentence, including matching phrases',()=>{
 assert.equal(cleanDictation('¡Ay!',hay.answers,hay),'hay');
 assert.equal(cleanDictation('Ay un libro aquí.',hay.answers,hay),'hay un libro aquí');
 assert.equal(cleanDictation('Ay un libro.',hay.answers,hay),'hay un libro');
 assert.equal(cleanDictation('Ay un perro.',hay.answers,hay),'ay un perro');
 assert.equal(cleanDictation('Ahí.',hay.answers,hay),'ahí');
 assert.equal(cleanDictation('Ay.'),'ay');
});
test('context answers accept only contiguous sentence spans covering the target',()=>{
 for(const text of ['hay','¡Hay!','Hay un libro','Hay un libro aquí.'])assert.equal(matchesContextAnswer(text,hay),true,text);
 for(const text of ['ay','un libro aquí','no hay','hay un perro','hay aquí','hay un libro aquí extra'])assert.equal(matchesContextAnswer(text,hay),false,text);
 const que=contextPilot.find(c=>c.target==='que');
 const full=que.example.chunks.map(c=>c.text).join(' ');
 assert.equal(matchesContextAnswer(full,que),true);
 assert.equal(matchesContextAnswer(full.replace(/\bque\b/,'qué'),que),false);
 assert.equal(matchesContextAnswer(cleanDictation(full.replace(/\bque\b/,'qué'),que.answers,que),que),true);
});

test('every pilot full sentence and target word is accepted',()=>{
 for(const context of contextPilot){
  assert.equal(matchesContextAnswer(context.target,context),true,context.id);
  assert.equal(matchesContextAnswer(context.example.chunks.map(c=>c.text).join(' '),context),true,context.id);
 }
});
