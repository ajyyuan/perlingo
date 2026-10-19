import test from 'node:test';
import assert from 'node:assert/strict';
import {ipaInputs} from '../scripts/ipa-inputs.mjs';
import {ipaFor,ipaGuide} from '../src/ipa.js';
import {ipaData,ipaSource} from '../src/content/ipa-data.js';
test('every taught phrase and clickable chunk has current IPA coverage',()=>{
 for(const [lang,texts] of Object.entries(ipaInputs())){
  assert.deepEqual(Object.keys(ipaData[lang]).sort(),texts);
  for(const text of texts){
   const ipa=ipaFor(text,lang);
   assert.ok(ipa===null||ipa.trim(),`${lang}: ${text}`);
   if(ipa)assert.doesNotMatch(ipa,/[()_-]/);
  }
 }
 assert.equal(ipaSource.loader,'0.2.4');
});
test('IPA is exact-text keyed and marked approximate, without fabricated fallback',()=>{
 assert.equal(ipaFor('missing text','es'),null);
 assert.equal(ipaGuide('missing text','es'),'');
 assert.match(ipaGuide('el agua','es'),/IPA ≈/);
 assert.match(ipaGuide('el agua','es'),/lang="es-fonipa"/);
 assert.match(ipaFor('el agua','es'),/aɣwa/);
});

test('foreign-language engine fallbacks are withheld',()=>{assert.equal(ipaFor('le dos','fr'),null);assert.equal(ipaGuide('le dos','fr'),'');});
