import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeGermanIPA,germanPronunciationProfile} from '../scripts/german-ipa.mjs';
import {ipaData,ipaSource} from '../src/content/ipa-data.js';
import {ipaTokens} from '../src/ipa-tokens.js';
import {soundsFor} from '../src/ipa-chart.js';
test('German r distinguishes onsets, vocalized codas, a contexts and morpheme boundaries',()=>{
 const examples=[
  ['rˈoːt','ʁˈoːt'],['ʃpɾˈɛçən','ʃpʁˈɛçən'],
  ['lˈeːrɜ','lˈeːʁɐ'],['fˈɑːrən','fˈaːʁən'],
  ['mˈeːɾ','mˈeːɐ'],['mˈeːrərə','mˈeːʁəʁə'],
  ['tˈyːɾ','tˈyːɐ'],['fˈɛnstɜ','fˈɛnstɐ'],
  ['vˈɔɾt','vˈɔɐt'],['ˈaɾbaɪt','ˈaʁbaɪt'],['vɑːɾ','vaːʁ'],
  ['fyːɾ ˌiːrə','fyːɐ ˌiːʁə'], // next word's vowel does not turn r into an onset
  ['vɑːrˈʊm','vaːʁˈʊm'], // stress is not a boundary
  ['fɛɾˈaɪn','fɛɐˈaɪn'],['ɛɾˈɪnərˌʊŋ','ɛɐˈɪnəʁˌʊŋ'],
  ['fˈoːɾˌeːɾst','fˈoːɐˌeːɐst'],
  ['rˌɛstoːrˈɑ̃','ʁˌɛstoːʁˈɑ̃'], // preserve the nasal loanword vowel
  ['dʊɐç','dʊɐç'],[null,null],
 ];
 for(const [raw,expected] of examples)assert.equal(normalizeGermanIPA(raw),expected,raw);
});
test('generated German data follows the profile and both r realizations select their own recordings',()=>{
 assert.equal(ipaSource.germanProfile,germanPronunciationProfile);
 for(const ipa of Object.values(ipaData.de))if(ipa){
  assert.doesNotMatch(ipa,/[rɾɜ]|ɑ(?!̃)/u);
  assert.equal(normalizeGermanIPA(ipa),ipa);
 }
 assert.equal(ipaData.de['der Lehrer'],'dɛɐ lˈeːʁɐ');
 assert.equal(ipaData.de['die Tür'],'diː tˈyːɐ');
 assert.equal(ipaData.de['fahren'],'fˈaːʁən');
 assert.equal(ipaTokens('ʁ')[0].sound.file,'281.mp3');
 assert.equal(ipaTokens('ɐ')[0].sound.file,'250.mp3');
 assert.ok(soundsFor('consonants','de').some(s=>s.symbol==='ʁ'));
 assert.ok(soundsFor('vowels','de').some(s=>s.symbol==='ɐ'));
 for(const symbol of ['r','ɾ'])assert.ok(!soundsFor('consonants','de').some(s=>s.symbol===symbol));
 assert.ok(!soundsFor('vowels','de').some(s=>s.symbol==='ɜ'));
});
