import test from 'node:test';
import assert from 'node:assert/strict';
import {keyboardCommand,moveIndex} from '../lemmas/keyboard.js';
test('typing, composition, overlays and held keys cannot trigger grading shortcuts',()=>{
 for(const state of [{editing:true},{notes:true},{overlay:true}])assert.equal(keyboardCommand({key:'1'},{choice:true,...state}),null);
 for(const event of [{key:'1',repeat:true},{key:'1',isComposing:true},{key:'1',ctrlKey:true},{key:'1',metaKey:true},{key:'1',defaultPrevented:true}])assert.equal(keyboardCommand(event,{choice:true}),null);
 assert.equal(keyboardCommand({key:'?'},{editing:true}),null);
});
test('platform command shortcuts work in answers without intercepting ordinary browser chords',()=>{
 for(const mac of [true,false]){const primary=mac?{metaKey:true}:{ctrlKey:true};
 assert.equal(keyboardCommand({...primary,code:'KeyK'},{editing:true,mac}),'search');
 assert.equal(keyboardCommand({...primary,shiftKey:true,code:'KeyK'},{editing:true,mac}),'search');
 assert.equal(keyboardCommand({...primary,shiftKey:true,code:'KeyK'},{overlay:true,mac}),null);
 assert.equal(keyboardCommand({...primary,shiftKey:true,code:'KeyM'},{editing:true,mac}),'dictate');
 assert.equal(keyboardCommand({...primary,shiftKey:true,code:'KeyH'},{mac}),'home');
 for(const code of ['KeyM','KeyH','KeyS'])assert.equal(keyboardCommand({...primary,code},{mac}),null);
 assert.equal(keyboardCommand({...primary,code:'KeyK'},{overlay:true,mac}),null);
 }
 assert.equal(keyboardCommand({code:'KeyM',altKey:true},{editing:true}),null);
});
test('learning and choice shortcuts are scoped to the active stage',()=>{
 assert.equal(keyboardCommand({key:'ArrowRight'},{learning:true}),'forward');assert.equal(keyboardCommand({key:'n'},{learning:true}),'notes');assert.equal(keyboardCommand({key:'1'},{choice:true}),'choice-0');assert.equal(keyboardCommand({key:'1'},{learning:true}),null);assert.equal(keyboardCommand({key:'Enter'},{choice:true}),null);
});
test('arrow navigation wraps within groups and Home/End remain bounded',()=>{
 assert.equal(moveIndex('ArrowLeft',0,4),3);assert.equal(moveIndex('ArrowDown',3,4),0);assert.equal(moveIndex('Home',2,4),0);assert.equal(moveIndex('End',0,4),3);assert.equal(moveIndex('Enter',0,4),null);assert.equal(moveIndex('ArrowLeft',0,0),null);
});

test('tense minus/equal keys respect active overlays and text editing',async()=>{
 const {tenseKeysAllowed}=await import('../lemmas/forms-view.js');
 assert.equal(tenseKeysAllowed({key:'='},{active:true}),true);
 for(const state of [{active:false},{editing:true}])assert.equal(tenseKeysAllowed({key:'='},state),false);
 for(const flag of ['defaultPrevented','isComposing','repeat','altKey','ctrlKey','metaKey','shiftKey'])assert.equal(tenseKeysAllowed({key:'-',[flag]:true}),false);
});

test('conjugation keys respect native event modifiers, editing and inactive overlays',async()=>{
 const {rowKeysAllowed}=await import('../lemmas/forms-view.js');
 for(const key of ['[',']'])assert.equal(rowKeysAllowed({key}),true);
 for(const state of [{active:false},{editing:true}])assert.equal(rowKeysAllowed({key:']'},state),false);
 for(const flag of ['defaultPrevented','isComposing','repeat','altKey','ctrlKey','metaKey','shiftKey']){
  const event=Object.create({key:']',[flag]:true});
  assert.equal(rowKeysAllowed(event),false);
 }
 for(const key of ['1','6','+','_','-','='])assert.equal(rowKeysAllowed({key}),false);
});
