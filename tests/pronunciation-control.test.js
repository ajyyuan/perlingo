import test from 'node:test';
import assert from 'node:assert/strict';
import {selectedRegion,selectedVoice,pronunciationRegions} from '../src/pronunciation-control.js';
test('restored preferences only accept configured regions for their language',()=>{
 assert.equal(selectedRegion({pronunciationRegions:{fr:'fr-CA'}},'fr'),'fr-CA');
 assert.equal(selectedRegion({pronunciationRegions:{fr:'es-MX'}},'fr'),'fr-FR');
 assert.equal(selectedRegion({},'fr'),'fr-FR');
});

test('voice preference defaults compatibly and stays per language',()=>{
 const settings={pronunciationVoices:{fr:'feminine',de:'neutral'}};
 assert.equal(selectedVoice(settings,'fr'),'feminine');assert.equal(selectedVoice(settings,'es'),'masculine');assert.equal(selectedVoice(settings,'de'),'masculine');
});

test('every selectable region has both recorded voices and restores independently',async()=>{
 const {azureVoices,feminineVoices}=await import('../src/azure-voices.js');
 for(const [lang,{regions}] of Object.entries(pronunciationRegions))for(const [locale] of regions){
  assert.ok(azureVoices[locale]?.startsWith(locale+'-'));assert.ok(feminineVoices[locale]?.startsWith(locale+'-'));
  assert.equal(selectedRegion({pronunciationRegions:{[lang]:locale}},lang),locale);
 }
 assert.equal(selectedRegion({pronunciationRegions:{es:'fr-BE'}},'es'),'es-ES');
});
