import test from 'node:test';
import assert from 'node:assert/strict';
import {recordingLevel} from '../lemmas/audio-level.js';
const tone=amplitude=>Float32Array.from({length:24000},(_,i)=>amplitude*Math.sin(i*2*Math.PI*300/24000));
test('quiet and loud versions of the same voice reach the same active level',()=>{
 for(const amplitude of [.06,.12,.4]){
  const level=recordingLevel([tone(amplitude)],24000);
  assert.ok(Math.abs(level.activeRMSDBFS+level.adjustmentDB+19)<.0001);
 }
});
test('leading/trailing silence does not drive normalization; silence and near-silence stay unboosted',()=>{
 const original=tone(.1),padded=new Float32Array(72000);padded.set(original,24000);
 assert.ok(Math.abs(recordingLevel([padded],24000).gain-recordingLevel([original],24000).gain)<.00001);
 assert.equal(recordingLevel([new Float32Array(24000)],24000).gain,1);
 assert.equal(recordingLevel([tone(.0001)],24000).gain,1);
});
test('adjustment is capped in both directions and stereo channels are measured together',()=>{
 assert.equal(recordingLevel([tone(.002)],24000).adjustmentDB,12);
 assert.equal(recordingLevel([tone(1)],24000).adjustmentDB,-12);
 assert.ok(Number.isFinite(recordingLevel([tone(.1),tone(.2)],24000).gain));
});
