import test from 'node:test';
import assert from 'node:assert/strict';
import {createCardPreloader} from '../lemmas/audio-preload.js';
import {createLevelLookup,playbackUrl} from '../lemmas/recording-levels.js';
const tick=()=>new Promise(r=>setImmediate(r));
test('preloads only a bounded, deduplicated current-card selection with three requests at most',async()=>{
 let active=0,peak=0;const loaded=[];
 const p=createCardPreloader({limit:5,resolve:async t=>t,load:async url=>{active++;peak=Math.max(peak,active);loaded.push(url);await tick();active--;}});
 await p.preload(['a','a','b','c','d','e','f']);assert.deepEqual(loaded,['a','b','c','d','e']);assert.equal(peak,3);
});
test('card changes cancel old requests and never start the stale queued clips',async()=>{
 const oldSignals=[],loaded=[];let finish;
 const p=createCardPreloader({resolve:async t=>t,load:async(url,signal)=>{loaded.push(url);if(url.startsWith('old')){oldSignals.push(signal);await new Promise(r=>{signal.addEventListener('abort',r,{once:true});});}}});
 const first=p.preload(['old1','old2','old3','old4']);await tick();await p.preload(['new']);await first;
 assert.ok(oldSignals.every(s=>s.aborted));assert.deepEqual(loaded,['old1','old2','old3','new']);p.cancel();
});
test('late manifest resolution cannot preload a previous voice or card',async()=>{
 let resolve;const loaded=[];const p=createCardPreloader({resolve:t=>t[0]==='old'?new Promise(r=>resolve=r):Promise.resolve(t),load:async u=>loaded.push(u)});
 const old=p.preload(['old']);await p.preload(['new']);resolve(['old']);await old;assert.deepEqual(loaded,['new']);
});
test('metadata requests share a small shard; failed requests can retry',async()=>{
 const id='1234567890abcdef12345678';let requests=0;
 const lookup=createLevelLookup(async url=>{requests++;assert.equal(url,'/lemmas/audio-levels/es-MX/12.json');return {ok:requests>1,json:async()=>({[id]:-22})};});
 const url=playbackUrl('https://perlingoaudio.blob.core.windows.net/pronunciation/es-MX/'+id+'.mp3');
 assert.equal(await lookup(url),null);assert.deepEqual(await Promise.all([lookup(url),lookup(url)]),[-22,-22]);assert.equal(requests,2);
 assert.equal(await lookup('https://unrelated.example/audio.mp3'),null);
});
