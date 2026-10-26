import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, mkdtempSync, mkdirSync, copyFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {challengePaths} from '../perlingo-challenge/paths.mjs';

const pages = {
 'index.html': '/learning/',
 'about.html': '/about',
 'privacy.html': '/privacy',
 'lemmas/index.html': '/lemmas/',
 'lemmas/sources.html': '/lemmas/sources',
 'audio-regions/index.html': '/audio-regions/',
 'perlingo-challenge/public/index.html': '/challenge/',
 'perlingo-challenge/public/tree.html': '/challenge/tree',
 'perlingo-challenge/public/audio-sources.html': '/challenge/audio-sources',
};
function canonical(html, path) {
 const tags = html.match(/<link\b[^>]*\brel="canonical"[^>]*>/g) || [];
 assert.deepEqual(tags, [`<link rel="canonical" href="https://perlingo.app${path}">`]);
 assert(html.indexOf(tags[0]) < html.indexOf('<title>') || !html.includes('<title>'));
}
test('public entry pages declare distinct production canonicals before JavaScript runs', () => {
 for (const [file, path] of Object.entries(pages)) {
  const html = readFileSync(file, 'utf8');
  canonical(html, path);
  if (file.startsWith('perlingo-challenge/')) canonical(challengePaths(html, new Set(['index.html','tree.html','audio-sources.html'])), path);
 }
});
test('static build retains Learning canonical and gives home fallback the Challenge canonical and redirects', () => {
 const root = mkdtempSync(join(tmpdir(), 'perlingo-indexing-'));
 try {
  for (const dir of ['src','audio-regions','lemmas']) mkdirSync(join(root, dir));
  for (const file of ['_redirects','index.html','about.html','privacy.html','content-review.html','lemmas/index.html','audio-regions/index.html']) copyFileSync(file, join(root, file));
  execFileSync(process.execPath, [resolve('scripts/build-static.mjs')], {cwd: root, env: {...process.env, PERLINGO_AUDIO_BASE_URL: ''}});
  canonical(readFileSync(join(root,'dist/learning/index.html'),'utf8'), '/learning/');
  canonical(readFileSync(join(root,'dist/index.html'),'utf8'), '/challenge/');
  const rules = readFileSync(join(root,'dist/_redirects'),'utf8').split('\n').filter(line => line && !line.startsWith('#'));
  assert.deepEqual(rules, ['/ /challenge/ 308','/index.html /challenge/ 308']);
 } finally { rmSync(root, {recursive:true,force:true}); }
});
test('Worker home redirects are permanent, preserve callback data and do not intercept Learning or APIs', async () => {
 const result = await build({entryPoints:['hosting/worker/index.ts'], bundle:true, write:false, format:'esm', platform:'node', define:{'import.meta.env.DEV':'false'}, plugins:[{
  name:'isolate-routing', setup(plugin) {
   plugin.onResolve({filter:/.*/}, args => args.importer ? {path:args.path,namespace:'routing-stub'} : undefined);
   plugin.onLoad({filter:/.*/,namespace:'routing-stub'}, () => ({contents:`
    export default {fetch: () => new Response('framework')};
    export const runWithConnectorBinding = (_, fn) => fn();
    export const handleSpeechAPI = () => new Response('speech');
   `,loader:'js'}));
  }
 }]});
 const {default:worker} = await import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'));
 for (const path of ['/', '/index.html']) {
  const response = await worker.fetch(new Request('https://perlingo.app'+path+'?code=abc%2B123&pack=course'), {}, {});
  assert.equal(response.status,308);
  assert.equal(response.headers.get('Location'),'https://perlingo.app/challenge/?code=abc%2B123&pack=course');
 }
 for (const path of ['/learning/?pack=starter','/challenge/','/privacy']) assert.equal(await (await worker.fetch(new Request('https://perlingo.app'+path),{},{})).text(),'framework');
 assert.equal(await (await worker.fetch(new Request('https://perlingo.app/challenge/api/status'),{},{})).text(),'speech');
});
