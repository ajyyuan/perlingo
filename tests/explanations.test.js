import test from 'node:test';
import assert from 'node:assert/strict';
import {bank,languages} from '../src/content.js';
import {segments} from '../src/explanations.js';
test('clickable phrases preserve every original translation and its punctuation',()=>{
 for(const item of bank)for(const lang of Object.keys(languages)){
  const parts=segments(item,lang);
  assert.equal(parts.map(part=>part.text).join(''),item[lang]);
  for(const part of parts.filter(part=>part.meaning))assert.ok(part.summary&&part.detail);
 }
});
test('Spanish reading sentence separates the verb from the noun phrase',()=>{
 const item=bank.find(item=>item.en==='I read a book.');
 const parts=segments(item,'es').filter(part=>part.meaning);
 assert.deepEqual(parts.map(({text,meaning})=>({text,meaning})),[{text:'Leo',meaning:'(I) read'},{text:'un libro',meaning:'(a) book'}]);
});
test('documented learning chunks stay together across languages',()=>{
 const cases=[
  ['c26','es',['Leo','un libro']],['c26','fr',['Je','lis','un livre']],
  ['c26','de',['Ich','lese','ein Buch']],['c25','es',['Estoy aprendiendo']],
  ['c24','fr',['Je','bois','de l’eau']],['c29','es',['Hasta mañana']],
  ['c31','es',['los libros']],['c32','fr',['ma maison']],
  ['c30','fr',['Je','ne','mange','pas']]
 ];
 for(const [id,lang,expected] of cases)assert.deepEqual(segments(bank.find(item=>item.id===id),lang).filter(part=>part.meaning).map(part=>part.text),expected);
 const progressive=segments(bank.find(item=>item.id==='c25'),'es')[0];
 assert.equal(progressive.meaning,'(I) am learning');
 assert.match(progressive.detail,/Estoy.*estar.*Aprendiendo.*aprender/);
});
test('every word is explained and sentence punctuation remains outside click targets',()=>{
 for(const item of bank)for(const lang of Object.keys(languages))for(const part of segments(item,lang)){
  if(part.meaning){assert.doesNotMatch(part.text,/^[¡¿]|[.!?]$/u);}
  else assert.doesNotMatch(part.text,/[\p{L}\p{N}]/u);
 }
});
test('new sentence constructions require an explicit chunk definition',()=>{
 assert.throws(()=>segments({id:'new-sentence',type:'sentence',en:'We read.',es:'Leemos.'},'es'),/Missing chunk definition/);
 assert.throws(()=>segments({...bank.find(item=>item.id==='c26'),es:'Leo otro libro.'},'es'),/Invalid chunk/);
});
