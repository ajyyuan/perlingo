import test from 'node:test';
import assert from 'node:assert/strict';
import {articleForms,articleTable,germanArticleGuide} from '../src/german-articles.js';
test('German articles preserve gender/case contrasts and indefinite plural absence',()=>{
 assert.deepEqual(articleForms.definite.map(r=>r[0]),['der','den','dem','des']);
 assert.deepEqual(articleForms.definite.map(r=>r[1]),['die','die','der','der']);
 assert.deepEqual(articleForms.definite.map(r=>r[2]),['das','das','dem','des']);
 assert.deepEqual(articleForms.definite.map(r=>r[3]),['die','die','den','der']);
 assert.ok(articleForms.indefinite.every(r=>r[3]==='—'));
 assert.deepEqual(articleForms.negative.map(r=>r[3]),['keine','keine','keinen','keiner']);
});
test('article guide offers case explanations without claiming a selected phrase case',()=>{
 const html=articleTable();assert.equal((html.match(/data-grammar/g)||[]).length,4);
 assert.match(germanArticleGuide(),/data-article-kind/);
 assert.match(germanArticleGuide(),/A form alone does not identify its case/);
 assert.doesNotMatch(html,/aria-current|selected-form/);
});
