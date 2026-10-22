import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {packs,languages} from '../public/content.js';
import {ipaGuides} from '../public/ipa-data.js';
const ledger=JSON.parse(readFileSync(new URL('../data/word-bank/ipa-guides.json',import.meta.url),'utf8'));
test('all playable taught forms have aligned IPA, including optional languages',()=>{
 assert.equal(packs.length,12);assert.equal(languages.length,50);
 assert.equal(ledger.entries.length,600);assert.equal(Object.keys(ipaGuides).length,600);
 const keys=new Set();
 for(const row of ledger.entries){
  const key=`${row.pack}:${row.language}`;assert(!keys.has(key));keys.add(key);
  const entry=packs.find(p=>p.id===row.pack)?.entries.find(e=>e.id===row.language);
  assert(entry,key);assert.equal(row.word,entry.word,key);assert.equal(row.ipa,entry.ipa,key);
  assert(row.ipa.trim());assert(!/[\[\]\/<>]/u.test(row.ipa));
  assert.equal(row.status,'draft');
  if(row.method==='dictionary-selected-draft'){
   assert.match(row.evidence.url,/^https:\/\/en\.wiktionary\.org\/wiki\//);
   assert.match(row.evidence.pageSha256,/^[a-f0-9]{64}$/);
   assert(row.evidence.selected.includes(row.ipa));
  }else assert(['authored-broad-draft','existing-bread-draft'].includes(row.method));
 }
});
test('ambiguous dictionary readings use the taught word, not an etymology or a different reading',()=>{
 assert.equal(ipaGuides['book:ja'].ipa,'hõ̞ɴ');
 assert.equal(ipaGuides['star:ja'].ipa,'hoɕi');
 assert.equal(ipaGuides['moon:fil'].ipa,'buˈwan');
 assert.equal(ipaGuides['house:fil'].ipa,'ˈbahaj');
 assert.equal(ipaGuides['dog:he'].ipa,'ˈkɛlɛv');
});
test('generated IPA data matches its authored ledger',()=>{
 execFileSync(process.execPath,[new URL('../scripts/build-ipa.mjs',import.meta.url).pathname,'--check']);
});
