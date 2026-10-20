import test from 'node:test';
import assert from 'node:assert/strict';
import {createRecordedPronouncer} from '../src/recorded-speech.js';
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function setup(loadManifest=()=>({clips:{'fr-FR':{"l'eau":'fr-FR/water.mp3'},'fr-CA':{"l'eau":'fr-CA/water.mp3'}}})){
 const clips=[],fallbackCalls=[],messages=[];
 const fallback={stop(){},speak(...args){fallbackCalls.push(args);}};
 const player=createRecordedPronouncer({loadManifest,fallback,makeAudio(){const audio={play:()=>Promise.resolve(),pause(){this.paused=true;},removeAttribute(){},load(){},remove(){this.removed=true;}};clips.push(audio);return audio;}});
 return {player,clips,fallbackCalls,messages,speak:(locale='fr-FR')=>player.speak('l’eau',locale,'French',m=>messages.push(m))};
}
test('selected region plays its Azure file and normalizes apostrophes',async()=>{const t=setup();t.speak('fr-CA');await flush();assert.equal(t.clips[0].src,'/src/audio/azure/fr-CA/water.mp3');t.clips[0].onplaying();assert.equal(t.messages.at(-1).state,'playing');assert.equal(t.fallbackCalls.length,0);t.clips[0].onended();assert.equal(t.messages.at(-1).state,'idle');t.player.stop();});
test('navigation cancels pending manifest and cannot start delayed playback',async()=>{let resolve;const t=setup(()=>new Promise(r=>resolve=r));t.speak();await flush();t.player.stop();resolve({clips:{'fr-FR':{"l'eau":'fr-FR/water.mp3'}}});await flush();assert.equal(t.clips.length,0);assert.equal(t.fallbackCalls.length,0);});
test('switching region cancels previous recording and ignores its old callbacks',async()=>{const t=setup();t.speak();await flush();const old=t.clips[0],oldEnd=old.onended;t.speak('fr-CA');await flush();oldEnd();assert.equal(old.paused,true);assert.equal(t.clips[1].src,'/src/audio/azure/fr-CA/water.mp3');assert.equal(t.messages.at(-1).state,'loading');t.player.stop();});
test('failed recording falls back once and only within selected region',async()=>{const t=setup();t.speak('fr-CA');await flush();const fail=t.clips[0].onerror;fail();fail();assert.equal(t.fallbackCalls.length,1);assert.equal(t.fallbackCalls[0][1],'fr-CA');assert.deepEqual(t.fallbackCalls[0][4],{exactLocale:true});t.player.stop();});
test('manifest outage permits exact-region fallback, and a later call retries manifest',async()=>{let attempts=0;const t=setup(()=>{attempts++;throw Error('offline');});t.speak();await flush();assert.equal(t.fallbackCalls.length,1);t.speak();await flush();assert.ok(attempts>=2);t.player.stop();});

test('switching voice cancels pending masculine audio and uses feminine manifest',async()=>{
 let resolveMale;const clips=[];let femaleLoads=0;
 const p=createRecordedPronouncer({loadManifest:()=>new Promise(r=>resolveMale=r),loadFeminineManifest:()=>{femaleLoads++;return {clips:{'fr-CA':{bonjour:'female.mp3'}}};},fallback:{stop(){},speak(){assert.fail('Unexpected fallback');}},makeAudio:()=>{const a={play:()=>Promise.resolve(),pause(){},removeAttribute(){},load(){}};clips.push(a);return a;}});
 p.speak('bonjour','fr-CA','French',()=>{});await flush();p.speak('bonjour','fr-CA','French',()=>{},'feminine');await flush();resolveMale({clips:{'fr-CA':{bonjour:'male.mp3'}}});await flush();
 assert.equal(clips.length,1);assert.equal(clips[0].src,'/src/audio/azure/female.mp3');p.stop();p.speak('bonjour','fr-CA','French',()=>{},'feminine');await flush();assert.equal(femaleLoads,1);p.stop();
});
test('missing feminine recording uses device fallback instead of a masculine recording',async()=>{
 let deviceCalls=0;
 const p=createRecordedPronouncer({loadManifest:()=>({clips:{'fr-FR':{bonjour:'masculine.mp3'}}}),loadFeminineManifest:()=>({clips:{}}),fallback:{stop(){},speak(){deviceCalls++;}},makeAudio(){assert.fail('Must not silently use masculine recording');}});
 p.speak('bonjour','fr-FR','French',()=>{},'feminine');await flush();assert.equal(deviceCalls,1);p.stop();
});

test('external recording host preserves locale paths and uses fallback on network failure',async()=>{
 let clip,fallBack=0;
 const player=createRecordedPronouncer({baseUrl:'https://audio.example.test/library/',loadManifest:()=>({clips:{'fr-FR':{bonjour:'fr-FR/hello.mp3'}}}),fallback:{stop(){},speak(){fallBack++;}},makeAudio(){return clip={play:()=>Promise.resolve(),pause(){},removeAttribute(){},load(){}};}});
 player.speak('bonjour','fr-FR','French',()=>{});await flush();
 assert.equal(clip.src,'https://audio.example.test/library/fr-FR/hello.mp3');clip.onerror();assert.equal(fallBack,1);player.stop();
});
