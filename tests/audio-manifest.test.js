import test from 'node:test';
import assert from 'node:assert/strict';
import {loadAudioManifest} from '../src/audio-manifest.js';
test('full local manifest preserves legacy and Spanish mappings',async()=>{
 const m={regions:{fr:'Thomas'},clips:{fr:{bonjour:'fr/a.mp3'}}};
 assert.deepEqual(await loadAudioManifest('/manifest.json',{fetcher:async()=>({ok:true,json:async()=>m})}),m);
});
test('hosted manifest resolves relative shards and preserves metadata',async()=>{
 const urls=[];
 const values={'https://example.test/audio/manifest.json':{regions:{es:'voice'},clips:{fr:{salut:'fr/a.mp3'}},clipShards:{es:'manifest-es.json'}},'https://example.test/audio/manifest-es.json':{hola:'es/b.mp3'}};
 const m=await loadAudioManifest('https://example.test/audio/manifest.json',{fetcher:async url=>{urls.push(url);return {ok:true,json:async()=>values[url]};}});
 assert.deepEqual(m.clips,{fr:{salut:'fr/a.mp3'},es:{hola:'es/b.mp3'}});assert.equal(m.regions.es,'voice');assert.equal(urls.length,2);
});
test('failed shard rejects rather than silently dropping recordings',async()=>{
 let n=0;await assert.rejects(loadAudioManifest('/manifest.json',{fetcher:async()=>++n===1?{ok:true,json:async()=>({clips:{},clipShards:{es:'es.json'}})}:{ok:false}}),/unavailable/);
});
