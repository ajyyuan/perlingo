import test from 'node:test';import assert from 'node:assert/strict';
import {server} from '../server.mjs';
// In-process handler tests don't expose a listener or call providers.
function request(url,method='GET',headers={}){return new Promise(resolve=>{
 const result={headers:{}};const res={setHeader:(k,v)=>result.headers[k]=v,writeHead:(s,h)=>{result.status=s;Object.assign(result.headers,h);},end:body=>resolve({...result,body:body?.toString()})};
 server.emit('request',{url,method,headers:{host:'127.0.0.1:5174',...headers}},res);
});}
test('secrets, source files and traversal are not served',async()=>{for(const path of ['/.env.local','/../.env.local','/%2eenv.local','/server.mjs','/source-check.json','/.cache/test.mp3'])assert.equal((await request(path)).status,404);});
test('foreign hosts and cross-origin token requests are rejected',async()=>{
 assert.equal((await request('/', 'GET',{host:'attacker.example'})).status,403);
 assert.equal((await request('/api/speech/token','POST',{origin:'https://evil.example','x-perlingo-challenge':'1'})).status,403);
 assert.equal((await request('/api/speech/token','POST')).status,403);
});
test('retired shared-voice endpoint cannot spend API credits',async()=>{const r=await request('/api/pronounce?pack=arbitrary&language=en','POST',{'x-perlingo-challenge':'1'});assert.equal(r.status,410);});
test('status exposes presence only and public page sets CSP',async()=>{const r=await request('/api/status');assert.deepEqual(Object.keys(JSON.parse(r.body)).sort(),['configured','model','provider','providers']);const home=await request('/');assert.equal(home.status,200);assert(home.headers['Content-Security-Policy'].includes("frame-ancestors 'none'"));});
test('unknown speech provider cannot spend credits',async()=>{assert.equal((await request('/api/speech/token?provider=other','POST',{'x-perlingo-challenge':'1'})).status,400);});

test('only curated recording assets are served with an audio MIME type',async()=>{
 const {recordings}=await import('../public/recordings-data.js');for(const r of recordings){const response=await request(r.file,'HEAD');assert.equal(response.status,200);assert.equal(response.headers['Content-Type'],'audio/mpeg');}
 assert.equal((await request('/audio/unlisted.mp3')).status,404);assert.equal((await request('/audio/../../.env.local')).status,404);assert.equal((await request('/audio-sources.html')).status,200);
});

test('local tree is served as JSON and importer metadata stays private',async()=>{
 const r=await request('/language-tree.json');assert.equal(r.status,200);assert.equal(r.headers['Content-Type'],'application/json; charset=utf-8');assert.equal(JSON.parse(r.body).nodes.length,27177);
 for(const path of ['/tree-model.js','/tree-picker.js'])assert.equal((await request(path)).status,200);
 assert.equal((await request('/data/playable-glottocodes.json')).status,404);
});

test('standalone exploration page and modules are served locally',async()=>{
 for(const path of ['/tree.html','/tree-explorer.js','/tree-explorer.css','/tree-layout.js'])assert.equal((await request(path)).status,200);
 const page=await request('/tree.html');assert(page.body.includes('Full detail'));assert(!page.body.includes('<dialog'));
});

test('pronunciation forest is a separate served page with links to the language artifact',async()=>{
 for(const path of ['/forest.html','/forest.js','/forest.css'])assert.equal((await request(path)).status,200);
 const forest=await request('/forest.html'),tree=await request('/tree.html');assert(forest.body.includes('href="/tree.html"'));assert(tree.body.includes('href="/forest.html"'));assert(!forest.body.includes('<svg'));
});

test('challenge family layout assets are served and stylesheet is linked',async()=>{
 for(const path of ['/family-board.js','/family-board.css'])assert.equal((await request(path)).status,200);
 assert((await request('/')).body.includes('/family-board.css'));
});
