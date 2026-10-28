import test from 'node:test';
import assert from 'node:assert/strict';
import {highlightMatch} from '../lemmas/search-highlight.js';
const bold=s=>`<strong class="search-match">${s}</strong>`;
test('search highlights all literal matches while retaining case and accents',()=>{
 assert.equal(highlightMatch('Hacer',' HAC '),bold('Hac')+'er');
 assert.equal(highlightMatch('to do; to make','to'),bold('to')+' do; '+bold('to')+' make');
 assert.equal(highlightMatch('qué','que'),bold('qué'));
 assert.equal(highlightMatch('qué','QUÉ'),bold('qué'));
 assert.equal(highlightMatch('a.b','.'),'a'+bold('.')+'b');
});
test('highlighting escapes matched and unmatched markup and handles empty queries',()=>{
 assert.equal(highlightMatch('<b>&','b'),'&lt;'+bold('b')+'&gt;&amp;');
 assert.equal(highlightMatch('<b>&','<b>'),bold('&lt;b&gt;')+'&amp;');
 assert.equal(highlightMatch('<b>&',' '),'&lt;b&gt;&amp;');
 assert.equal(highlightMatch('hacer','xyz'),'hacer');
});

test('folded highlighting preserves decomposed accents',()=>{
 assert.equal(highlightMatch('que\u0301','que'),bold('que\u0301'));
 assert.equal(highlightMatch('año','ano'),bold('año'));
});
