import test from 'node:test';
import assert from 'node:assert/strict';
import {keyboardCommand,moveIndex} from '../lemmas/keyboard.js';
test('typing, composition, overlays and held keys cannot trigger grading shortcuts',()=>{
 for(const state of [{editing:true},{notes:true},{overlay:true}])assert.equal(keyboardCommand({key:'1'},{choice:true,...state}),null);
 for(const event of [{key:'1',repeat:true},{key:'1',isComposing:true},{key:'1',ctrlKey:true},{key:'1',metaKey:true},{key:'1',defaultPrevented:true}])assert.equal(keyboardCommand(event,{choice:true}),null);
 assert.equal(keyboardCommand({key:'?'},{editing:true}),null);
});
test('explicit Alt shortcuts work in answers but never within overlays',()=>{
 const e={key:'µ',code:'KeyM',altKey:true};assert.equal(keyboardCommand(e,{editing:true}),'dictate');assert.equal(keyboardCommand(e,{overlay:true}),null);
 assert.equal(keyboardCommand({code:'KeyS',altKey:true},{editing:true}),'search');
});
test('learning and choice shortcuts are scoped to the active stage',()=>{
 assert.equal(keyboardCommand({key:'ArrowRight'},{learning:true}),'forward');assert.equal(keyboardCommand({key:'n'},{learning:true}),'notes');assert.equal(keyboardCommand({key:'1'},{choice:true}),'choice-0');assert.equal(keyboardCommand({key:'1'},{learning:true}),null);assert.equal(keyboardCommand({key:'Enter'},{choice:true}),null);
});
test('arrow navigation wraps within groups and Home/End remain bounded',()=>{
 assert.equal(moveIndex('ArrowLeft',0,4),3);assert.equal(moveIndex('ArrowDown',3,4),0);assert.equal(moveIndex('Home',2,4),0);assert.equal(moveIndex('End',0,4),3);assert.equal(moveIndex('Enter',0,4),null);assert.equal(moveIndex('ArrowLeft',0,0),null);
});

test('tense bracket keys respect active overlays and text editing',async()=>{
 const {tenseKeysAllowed}=await import('../lemmas/forms-view.js');
 assert.equal(tenseKeysAllowed({key:']'},{active:true}),true);
 for(const state of [{active:false},{editing:true}])assert.equal(tenseKeysAllowed({key:']'},state),false);
 for(const flag of ['defaultPrevented','isComposing','repeat','altKey','ctrlKey','metaKey','shiftKey'])assert.equal(tenseKeysAllowed({key:'[',[flag]:true}),false);
});
