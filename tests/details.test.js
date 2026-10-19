import test from 'node:test';import assert from 'node:assert/strict';
import {bank} from '../src/content.js';import {segments} from '../src/explanations.js';import {inspectChunk,formLabel} from '../src/details.js';
const sentence=bank.find(e=>e.id==='c26');
test('noun phrase inspection separates determiner and noun while retaining context',()=>{
 const chunk=segments(sentence,'es').find(c=>c.text==='un libro');const detail=inspectChunk(sentence,'es',chunk);
 assert.equal(detail.sentence,'Leo un libro.');assert.deepEqual(detail.words.map(w=>w.text),['un','libro']);
 assert.match(detail.words[0].role,/Indefinite article/);assert.equal(detail.words[1].lexeme.lemma,'libro');assert.equal(detail.words[1].lexeme.gender,'masculine');
});
test('finite verb inspection resolves base form and available conjugation',()=>{
 for(const [lang,text,lemma] of [['es','Leo','leer'],['fr','lis','lire'],['de','lese','lesen']]){
 const word=inspectChunk(sentence,lang,segments(sentence,lang).find(c=>c.text===text)).words[0];
 assert.equal(word.lexeme.lemma,lemma);assert.match(word.role,/first person singular/);
 assert.ok(word.lexeme.forms.some(f=>f.text===text.toLowerCase()&&f.person===1));
 }
});
test('legacy words do not inherit pilot annotations by spelling',()=>{
 const item=bank.find(e=>e.id==='c31'),detail=inspectChunk(item,'es',segments(item,'es')[0]);assert.equal(detail.pilot,false);assert.equal(detail.words[0].lexeme,null);assert.match(detail.words[0].note,/not yet recorded/);
});
test('form labels expose person, number, tense, and mood',()=>{assert.equal(formLabel({text:'leo',tense:'present',mood:'indicative',person:1,number:'singular'}),'present · indicative · First person · singular');});

test('identical noun spellings do not mark multiple grammatical forms as here',async()=>{
 const {formsForWord}=await import('../src/details.js');
 const lexeme={pos:'noun',forms:[{text:'Kugelschreiber',number:'singular'},{text:'Kugelschreiber',number:'plural'}]};
 assert.equal(formsForWord({text:'Kugelschreiber',lexeme}).filter(f=>f.selected).length,0);
 assert.deepEqual(formsForWord({text:'Kugelschreiber',lexeme,features:{number:'singular'}}).filter(f=>f.selected).map(f=>f.number),['singular']);
 assert.deepEqual(formsForWord({text:'Kugelschreiber',lexeme,features:{number:'plural'}}).filter(f=>f.selected).map(f=>f.number),['plural']);
});
test('foundation pen has explicit contextual number for matching forms',async()=>{
 const {foundation}=await import('../src/content/foundation.js');const {lessonEntries}=await import('../src/content/model.js');const {formsForWord}=await import('../src/details.js');
 const item=lessonEntries(foundation).find(e=>e.de==='der Kugelschreiber');
 const w=inspectChunk(item,'de',segments(item,'de')[0]).words.find(w=>w.lexeme);
 assert.deepEqual(formsForWord(w).filter(f=>f.selected).map(f=>f.number),['singular']);
});
