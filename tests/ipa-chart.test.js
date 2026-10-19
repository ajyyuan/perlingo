import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {ipaSounds} from '../src/content/ipa-sounds.js';
import {soundsFor,chartTable,chartMarkup} from '../src/ipa-chart.js';
test('all chart buttons have licensed, intact local recordings',()=>{
 assert.equal(new Set(ipaSounds.map(s=>s.symbol)).size,ipaSounds.length);
 for(const s of ipaSounds){
  assert.match(s.source,/^https:\/\/commons.wikimedia.org\//);
  assert.ok(s.author);assert.match(s.license,/^(CC BY-SA [34]\.0|CC0)$/);assert.ok(s.licenseUrl);
  const bytes=readFileSync(new URL('../src/audio/ipa/'+s.file,import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),s.sha256);
  assert.ok(bytes.length>1000);
  assert.ok(bytes.subarray(0,3).toString()==='ID3'||bytes[0]===0xff,'MP3 header');
 }
});
test('language filters and phonetic axes preserve symbol identity',()=>{
 assert.ok(['a','e','i','o','u'].every(symbol=>soundsFor('vowels','es').some(s=>s.symbol===symbol)));
 assert.ok(soundsFor('vowels','fr').some(s=>s.symbol==='ɑ̃'));
 assert.ok(soundsFor('consonants','de').some(s=>s.symbol==='ç'));
 for(const lang of ['es','fr','de','all'])for(const kind of ['vowels','consonants']){
  const html=chartTable(kind,lang);
  assert.equal((html.match(/data-ipa-sound=/g)||[]).length,soundsFor(kind,lang).length);
  if(kind==='consonants'){assert.match(html,/scope="row"/);assert.match(html,/scope="col"/);}else assert.match(html,/Vowel quadrilateral/);
 }
 assert.match(chartMarkup('fr'),/value="fr" selected/);
});
test('IPA opens pronunciation separately from grammar details',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.doesNotMatch(app,/chartMarkup|mountChart/);
 assert.match(app,/ipaGuide\(entry.text,l,true\)/);
 const sidebar=readFileSync(new URL('../src/sidebar.js',import.meta.url),'utf8');
 assert.doesNotMatch(sidebar.split('export function openPronunciation')[0],/ipaGuide\(chunk|chartMarkup\(lang\)/);
 assert.match(sidebar,/chartMarkup\(lang\)/);assert.match(sidebar,/stopChart\?\.\(\)/);
});
