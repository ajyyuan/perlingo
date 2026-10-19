import test from 'node:test';
import assert from 'node:assert/strict';
import {ipaData} from '../src/content/ipa-data.js';
import {ipaTokens} from '../src/ipa-tokens.js';
import {soundsFor} from '../src/ipa-chart.js';
import {interactiveIPA,ipaGuide} from '../src/ipa.js';
import {grammarMarkup} from '../src/grammar-help.js';
test('course transcription coverage includes the standard German profile; only œ̃ lacks audio',()=>{
 const missing=new Set();
 for(const [lang,entries] of Object.entries(ipaData))for(const ipa of Object.values(entries)){
  const tokens=ipaTokens(ipa);assert.equal(tokens.map(t=>t.text).join(''),ipa||'');
  for(const t of tokens){if(t.sound)assert.ok(soundsFor(t.sound.kind,lang).some(s=>s.symbol===t.text),`${lang}: ${t.text}`);else if(!t.note&&!/^\s+$/.test(t.text))missing.add(t.text);}
 }
 assert.deepEqual([...missing],['œ̃']);
 for(const symbol of ['ɐ'])assert.ok(soundsFor('vowels','de').some(s=>s.symbol===symbol));
 for(const symbol of ['ʁ'])assert.ok(soundsFor('consonants','de').some(s=>s.symbol===symbol));
});
test('nasal vowels and tied affricates stay intact, length/stress are explanatory marks',()=>{
 assert.deepEqual(ipaTokens('ˈɑ̃ː t͡ʃ œ̃').map(t=>t.text),['ˈ','ɑ̃','ː',' ','t͡ʃ',' ','œ̃']);
 assert.equal(ipaTokens('œ̃')[0].sound,null);
 assert.equal(ipaTokens('ː')[0].sound,null);assert.ok(ipaTokens('ː')[0].note);
 assert.match(interactiveIPA('das Fenster','de'),/data-transcription-sound="ɐ"/);
 assert.doesNotMatch(ipaGuide('el agua','es'),/IPA ≈|ipa-label/);
});
test('grammar terms explain compound labels once and escape authored text',()=>{
 const html=grammarMarkup('Present indicative · person 1 · singular <test>');
 assert.equal((html.match(/data-grammar/g)||[]).length,3);
 assert.match(html,/Present describes now/);assert.match(html,/&lt;test&gt;/);assert.match(html,/aria-haspopup="dialog"/);
});
