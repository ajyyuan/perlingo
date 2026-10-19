import test from 'node:test';
import assert from 'node:assert/strict';
import {swipeDirection,bindLearningSwipe} from '../src/learning-swipe.js';

test('swipes follow card motion; small, horizontal and slow movements do not navigate',()=>{
 const start={x:100,y:100,time:100};
 assert.equal(swipeDirection(start,{x:105,y:40,time:400}),'next');
 assert.equal(swipeDirection(start,{x:105,y:160,time:400}),'prev');
 for(const end of [{x:100,y:80,time:400},{x:160,y:160,time:400},{x:100,y:160,time:1100}])
  assert.equal(swipeDirection(start,end),null);
});
function fixture(){
 const handlers={},documentHandlers={},moves=[];
 let allowed=true;
 const surface={isConnected:true,setPointerCapture(){}};
 const root={addEventListener:(name,fn)=>handlers[name]=fn,ownerDocument:{addEventListener:(name,fn)=>documentHandlers[name]=fn}};
 bindLearningSwipe(root,{enabled:()=>allowed,navigate:direction=>moves.push(direction)});
 const event={target:{closest:()=>surface},pointerId:1,pointerType:'touch',isPrimary:true,clientX:100,clientY:100,timeStamp:0,preventDefault(){}};
 return {moves,surface,allow:value=>allowed=value,send:(name,extra={})=>handlers[name]({...event,...extra}),second:()=>documentHandlers.pointerdown({...event,isPrimary:false})};
}
test('a touch navigates once; mouse and non-primary touches cannot navigate',()=>{
 const f=fixture();
 f.send('pointerdown');f.send('pointerup',{clientY:40,timeStamp:200});f.send('pointerup',{clientY:40,timeStamp:200});
 assert.deepEqual(f.moves,['next']);
 for(const extra of [{pointerType:'mouse'},{isPrimary:false}]){f.send('pointerdown',extra);f.send('pointerup',{clientY:40,timeStamp:200});}
 assert.equal(f.moves.length,1);
});
test('cancellation, multiple fingers, removed cards and newly opened overlays cancel swipes',()=>{
 for(const cancel of [f=>f.send('pointercancel'),f=>f.send('lostpointercapture'),f=>f.second(),f=>f.surface.isConnected=false,f=>f.allow(false)]){
  const f=fixture();f.send('pointerdown');cancel(f);f.send('pointerup',{clientY:40,timeStamp:200});assert.deepEqual(f.moves,[]);
 }
});
test('content outside swipe strip and disabled screens never start a gesture',()=>{
 const f=fixture();
 f.send('pointerdown',{target:{closest:()=>null}});f.send('pointerup',{clientY:40,timeStamp:200});
 f.allow(false);f.send('pointerdown');f.allow(true);f.send('pointerup',{clientY:40,timeStamp:200});
 assert.deepEqual(f.moves,[]);
});
