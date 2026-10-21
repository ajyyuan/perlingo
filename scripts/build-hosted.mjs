import {cpSync,mkdirSync,readFileSync,writeFileSync,readdirSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {challengePaths} from '../perlingo-challenge/paths.mjs';
const sitesBuildHelper=process.argv[2];
if(!sitesBuildHelper)throw Error('Pass the absolute Sites build-site.mjs helper path.');
const root=process.cwd(),hosting=path.join(root,'hosting'),publicDir=path.join(hosting,'public');
// Preserve the existing static application and verified remote pronunciation library.
execFileSync(process.execPath,['scripts/build-static.mjs'],{stdio:'inherit',env:{...process.env,PERLINGO_AUDIO_BASE_URL:'https://perlingoaudio.blob.core.windows.net/pronunciation/'}});
rmSync(publicDir,{recursive:true,force:true});cpSync('dist',publicDir,{recursive:true});
const source='perlingo-challenge/public',target=path.join(publicDir,'challenge');mkdirSync(target,{recursive:true});
const excluded=new Set(['forest.html','forest.js','forest.css','speech-lab.html','speech-lab.js','benchmark.js']);
const names=new Set(readdirSync(source).filter(name=>!excluded.has(name)));
const rewrite=text=>challengePaths(text,names);
for(const name of names){const src=path.join(source,name),out=path.join(target,name);if(name==='audio')cpSync(src,out,{recursive:true});else writeFileSync(out,rewrite(readFileSync(src,'utf8')));}
writeFileSync(path.join(publicDir,'_headers'),`/challenge/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
  Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://buuxjzibgblnlmfafpny.supabase.co wss://api.elevenlabs.io wss://stt-rt.soniox.com; media-src 'self' blob:; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'
`);
// Give the worker a minimal framework route; static assets preserve existing URLs.
execFileSync(process.execPath,[sitesBuildHelper],{cwd:hosting,stdio:'inherit'});
rmSync('dist',{recursive:true,force:true});cpSync(path.join(hosting,'dist'),'dist',{recursive:true});
console.log('Hosted build: Learning at /; Challenge at /challenge/.');
