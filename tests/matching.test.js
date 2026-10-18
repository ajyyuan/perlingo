import test from 'node:test';
import assert from 'node:assert/strict';
import {makeBoards,emptyMatch,selectMatch} from '../src/matching.js';
import {bank} from '../src/content.js';

test('boards cover every concept in every language exactly once',()=>{
 const items=bank.slice(0,9),boards=makeBoards(items,['es','fr','de']);
 assert.equal(boards.length,6);
 for(const lang of ['es','fr','de']){
  const group=boards.filter(b=>b.lang===lang);
  assert.deepEqual(group.flatMap(b=>b.left.map(i=>i.id)).sort(),items.map(i=>i.id).sort());
  for(const b of group){assert.ok(b.left.length>=2&&b.left.length<=5);assert.deepEqual(b.left.map(i=>i.id).sort(),b.right.map(i=>i.id).sort());}
 }
});
test('balanced partitions avoid singleton tails',()=>{assert.deepEqual(makeBoards(bank.slice(0,6),['es']).map(b=>b.left.length),[3,3]);assert.equal(makeBoards(bank.slice(0,1),['fr'])[0].left.length,1);assert.deepEqual(makeBoards([],['es']),[]);});
test('either side can be selected first; same tile toggles selection',()=>{let a=selectMatch(emptyMatch(),'right','c0');assert.equal(a.attempt,null);assert.equal(selectMatch(a.state,'right','c0').state.right,null);const b=selectMatch(a.state,'left','c0');assert.equal(b.attempt.correct,true);assert.deepEqual(b.state.matched,['c0']);});
test('mismatch clears selections without locking either tile',()=>{let a=selectMatch(emptyMatch(),'left','c0');const b=selectMatch(a.state,'right','c1');assert.equal(b.attempt.correct,false);assert.deepEqual(b.state.matched,[]);assert.equal(b.state.left,null);assert.equal(b.state.right,null);const c=selectMatch(b.state,'left','c0');assert.equal(c.state.last,null);assert.equal(selectMatch(c.state,'right','c0').attempt.correct,true);});
test('matched tiles cannot score twice',()=>{let a=selectMatch(emptyMatch(),'left','c0');a=selectMatch(a.state,'right','c0');const b=selectMatch(a.state,'left','c0');assert.equal(b.attempt,null);assert.deepEqual(b.state.matched,['c0']);});
