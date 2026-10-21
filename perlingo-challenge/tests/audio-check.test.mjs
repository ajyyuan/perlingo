import test from 'node:test';import assert from 'node:assert/strict';import {exactAudioWord} from '../scripts/audio-word-match.mjs';
test('audio screening accepts orthographic equivalents, but rejects extra words and wrong targets',()=>{assert(exactAudioWord('น้ํา','น้ำ','th'));assert(exactAudioWord('Voda.','вода','sr'));assert(exactAudioWord('Pain.','pain','fr'));assert(!exactAudioWord('Temps.','pain','fr'));assert(!exactAudioWord('le pain','pain','fr'));assert(!exactAudioWord('Bánh mì.','nước','vi'));});

test('new-pack screening accepts only declared orthographic equivalents, not synonyms or added words',()=>{
 assert(exactAudioWord('太陽。','太阳','zh',['太陽']));
 assert(exactAudioWord('sunce','сунце','sr',['sunce']));
 assert(!exactAudioWord('Sternchen','Stern','de'));
 assert(!exactAudioWord('les arbres','arbre','fr'));
 assert(!exactAudioWord('cão','cachorro','pt'));
});

test('audio screening scopes numeral formatting to explicitly checked homophones',()=>{assert(exactAudioWord('3.','tre','no',[],['3']));assert(!exactAudioWord('3.','træ','da'));assert(!exactAudioWord('100.','hund','da'));});
