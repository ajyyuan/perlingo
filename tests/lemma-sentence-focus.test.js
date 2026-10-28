import test from 'node:test';
import assert from 'node:assert/strict';
import {bindSentenceInteractions} from '../lemmas/sentence-interactions.js';

test('Escape preserves outside focus and restores focus only from inside the dismissed meaning',t=>{
 const keys=['document','window','Element','innerWidth','innerHeight'];
 const descriptors=keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]);
 t.after(()=>{for(const [key,descriptor] of descriptors){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}});
 const handlers={};let open=false,focusCalls=0;
 const answer={},link={},otherControl={};
 const button={focus(){focusCalls++;document.activeElement=button;}};
 const popup={contains:el=>el===link,matches:()=>open,hidePopover(){open=false;},showPopover(){open=true;},setAttribute(){},getBoundingClientRect:()=>({height:50,width:100}),dataset:{},style:{}};
 const word={querySelector:selector=>selector==='.word-sound'?button:popup,contains:el=>[button,link].includes(el),classList:{remove(){}},getBoundingClientRect:()=>({top:100,left:100,bottom:120})};
 globalThis.Element=class{closest(){return word;}};
 globalThis.document={activeElement:answer,addEventListener(type,handler){handlers[type]=handler;}};
 globalThis.window={addEventListener(){}};globalThis.innerWidth=1000;globalThis.innerHeight=800;
 bindSentenceInteractions();
 for(const focused of [answer,otherControl,button,link]){
  document.activeElement=focused;
  handlers.pointerover({target:new Element(),relatedTarget:null});
  assert.equal(open,true);
  let prevented=false,stopped=false;
  const before=focusCalls;
  handlers.keydown({key:'Escape',preventDefault(){prevented=true;},stopPropagation(){stopped=true;}});
  assert.equal(open,false);assert.equal(prevented,true);assert.equal(stopped,true);
  assert.equal(document.activeElement,focused===link?button:focused);
  assert.equal(focusCalls-before,focused===link?1:0);
 }
});
