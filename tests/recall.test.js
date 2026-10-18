import test from 'node:test';import assert from 'node:assert/strict';
import {checkAnswer,normalizeAnswer,roundPassed} from '../src/recall.js';
test('typing tolerates case, whitespace and sentence punctuation',()=>{assert.ok(checkAnswer('  JE  BOIS de l’eau!  ','Je bois de l’eau.'));assert.ok(checkAnswer('hola','¡Hola!'));});
test('apostrophes and unicode composition normalize',()=>{assert.ok(checkAnswer("l'eau",'l’eau'));assert.ok(checkAnswer('el cafe\u0301','el café'));});
test('spelling, accents and articles remain meaningful',()=>{assert.equal(checkAnswer('el cafe','el café'),false);assert.equal(checkAnswer('Wasser','das Wasser'),false);assert.equal(checkAnswer('la agua','el agua'),false);assert.equal(checkAnswer('comer','beber'),false);});
test('blank or punctuation-only answers are never correct',()=>{assert.equal(checkAnswer('   ','el agua'),false);assert.equal(checkAnswer('!!!',''),false);assert.equal(normalizeAnswer('?!'),'');});
test('a single perfect round passes; any miss requires another round',()=>{assert.equal(roundPassed(0),true);assert.equal(roundPassed(1),false);assert.equal(roundPassed(12),false);});
