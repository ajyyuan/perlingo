import test from 'node:test';
import assert from 'node:assert/strict';
import {createPronunciationBoost} from '../lemmas/pronunciation-boost.js';
test('recording gain is measured and external audio uses only the fixed same-origin path',async()=>{
 let gain,disconnected=0;
 class Context{decodeAudioData(){return Promise.resolve({numberOfChannels:1,sampleRate:1000,getChannelData:()=>new Float32Array(1000).fill(.05)});}state='running';resume(){return Promise.resolve();}createMediaElementSource(){return {connect(){},disconnect(){disconnected++;}};}createGain(){gain={gain:{value:0},connect(){},disconnect(){disconnected++;}};return gain;}createDynamicsCompressor(){return {threshold:{},knee:{},ratio:{},attack:{},release:{},connect(){},disconnect(){disconnected++;}};}get destination(){return {};}}
 const boost=createPronunciationBoost(Context,{fetchAudio:async()=>({ok:true,arrayBuffer:async()=>new ArrayBuffer(0)})});await boost.unlock();
 const output=await boost.prepare({},'https://perlingoaudio.blob.core.windows.net/pronunciation/es-MX/1234567890abcdef12345678.mp3');
 assert.equal(output.url,'/api/pronunciation/es-MX/1234567890abcdef12345678.mp3');assert.ok(Math.abs(gain.gain.value-10**(-16/20)/.05)<.00001);output.release();assert.equal(disconnected,3);
 const local=await boost.prepare({},'/lemmas/audio-corrections/example.mp3');assert.equal(local.url,'/lemmas/audio-corrections/example.mp3');local.release();
 const other=await boost.prepare({},'https://example.com/audio.mp3');assert.equal(other.url,'https://example.com/audio.mp3');other.release();assert.equal(disconnected,6);
});
test('suspended audio waits for activation instead of quietly bypassing the boost',async()=>{
 let resume;class Context{state='suspended';resume(){return new Promise(resolve=>{resume=()=>{this.state='running';resolve();};});}}
 const boost=createPronunciationBoost(Context);const ready=boost.unlock();
 await assert.rejects(boost.prepare({},'/clip.mp3'),/activated/);resume();await ready;
});
test('unavailable Web Audio retains ordinary playback; blocked activation rejects explicitly',async()=>{
 const boost=createPronunciationBoost(undefined);await boost.unlock();assert.equal((await boost.prepare({},'/clip.mp3')).url,'/clip.mp3');
 const blocked=createPronunciationBoost(class{state='suspended';resume(){return Promise.reject(Error('blocked'));}});
 await assert.rejects(blocked.unlock(),/blocked/);await assert.rejects(blocked.prepare({},'/clip.mp3'),/activated/);
});
