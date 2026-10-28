import test from 'node:test';
import assert from 'node:assert/strict';
import {searchCards} from '../lemmas/search.js';
const card=(lemma,meaning='')=>({lemma,meaning});
test('Spanish exact, accent-folded exact, prefix and substring precede English matches',()=>{
 const deck=[card('x','que'),card('parque'),card('querer'),card('qué'),card('que')];
 assert.deepEqual(searchCards(deck,' QUE ').map(c=>c.lemma),['que','qué','querer','parque','x']);
 assert.deepEqual(searchCards(deck,'qué').slice(0,2).map(c=>c.lemma),['qué','que']);
});
test('search folds accents both ways, preserves tie order and handles empty/no results',()=>{
 const deck=[card('sí','yes'),card('si','if'),card('si','whether'),card('año','year')];
 assert.deepEqual(searchCards(deck,'si'),[deck[1],deck[2],deck[0]]);
 assert.deepEqual(searchCards(deck,'ano'),[deck[3]]);
 assert.deepEqual(searchCards(deck,'   '),deck);
 assert.deepEqual(searchCards(deck,'xyz'),[]);
});
