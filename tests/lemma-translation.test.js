import test from 'node:test';
import assert from 'node:assert/strict';
import {translationKeyAllowed} from '../lemmas/sentence-translation.js';

test('translation shortcut respects typing, inactive cards, composition and browser shortcuts',()=>{
 assert.equal(translationKeyAllowed({key:'t'}),true);
 assert.equal(translationKeyAllowed({key:'T'}),true);
 assert.equal(translationKeyAllowed({key:'n'}),false);
 for(const flag of ['defaultPrevented','isComposing','repeat','altKey','ctrlKey','metaKey','shiftKey']){
  assert.equal(translationKeyAllowed({key:'t',[flag]:true}),false,flag);
 }
 assert.equal(translationKeyAllowed({key:'t'},{editing:true}),false);
 assert.equal(translationKeyAllowed({key:'t'},{active:false}),false);
});
