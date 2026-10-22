import test from 'node:test';import assert from 'node:assert/strict';
import {activeLanguages as languages,activePacks as packs} from '../public/content.js';
import {languagePools,poolForSelection} from '../public/language-pools.js';
test('trial pools have exact sizes, are nested, and retain playable words in every pack',()=>{
 let previous=[];
 for(const [size,pool] of Object.entries(languagePools)){
  assert.equal(new Set(pool).size,Number(size));assert(previous.every(id=>pool.includes(id)));
  for(const id of pool){assert(languages.some(l=>l.id===id));assert(packs.every(p=>p.entries.some(e=>e.id===id)));}
  assert.equal(poolForSelection([...pool].reverse()),size);previous=pool;
 }
 assert.equal(poolForSelection(['en']),'custom');assert.deepEqual([...languagePools[33]].sort(),languages.map(l=>l.id).sort());
});
test('agreed 33-language roster includes priority languages and omits the agreed cuts',()=>{
 const pool=languagePools[33];
 for(const id of ['ar','bn','ur','ta','te','hu','sv','ca','cs','sr'])assert(pool.includes(id));
 for(const id of ['vi','af','lv','ms','da','no','sk','bg','hr','sl','mr','gu','kn','ml','lt','fi','et'])assert(!pool.includes(id));
});

test('new play exposes only 33 languages and 396 taught entries',async()=>{
 const {initialSelection,createTree}=await import('../public/tree-model.js');
 const {readFileSync}=await import('node:fs');
 assert.equal(languages.length,33);assert.equal(packs.reduce((n,p)=>n+p.entries.length,0),396);
 assert.deepEqual(initialSelection({languageIds:['en','vi','af','cs','sr']},languages).sort(),['cs','en','sr']);
 const tree=createTree(JSON.parse(readFileSync(new URL('../public/language-tree.json',import.meta.url))),languages);
 const mapped=new Set([...tree.nodes.values()].flatMap(n=>n.own));
 assert.equal(mapped.size,33);assert(!mapped.has('vi'));assert(!mapped.has('af'));
});
