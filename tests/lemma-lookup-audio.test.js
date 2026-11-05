import test from 'node:test';
import assert from 'node:assert/strict';
import {bindLookupAudioShortcuts} from '../lemmas/card-preview.js';

test('lookup shortcuts open More info and target only the active card',()=>{
 let handler,played=[],sentence='first',editing=false,nested=false,popover=false;
 const dialog={
  ownerDocument:{querySelector:()=>popover?{}:null},
  addEventListener(type,fn){assert.equal(type,'keydown');handler=fn;},
  querySelector(selector){return {click(){played.push(selector.includes('h1')?'headword':selector.includes('data-action')?'notes':sentence);}};}
 };
 const target={closest(selector){return selector==='dialog'?(nested?{}:dialog):(editing?{}:null);}};
 function press(key,extra={}){let prevented=false;handler({key,target,preventDefault(){prevented=true;},stopPropagation(){},...extra});return prevented;}
 bindLookupAudioShortcuts(dialog);
 assert.equal(press('s'),true);assert.equal(press('p'),true);
 sentence='new tense/person';press('p');assert.deepEqual(played,['headword','first','new tense/person']);
 assert.equal(press('n'),true);assert.equal(press('N'),true);
 for(const key of ['s','p','n']){
  editing=true;assert.equal(press(key),false);editing=false;
  nested=true;assert.equal(press(key),false);nested=false;
  popover=true;assert.equal(press(key),false);popover=false;
  for(const flag of ['repeat','isComposing','defaultPrevented','ctrlKey','metaKey','altKey','shiftKey'])assert.equal(press(key,{[flag]:true}),false);
 }
 assert.equal(press('ArrowRight'),false);
 assert.deepEqual(played,['headword','first','new tense/person','notes','notes']);
});
