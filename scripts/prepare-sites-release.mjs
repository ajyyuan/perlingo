import {execFileSync} from 'node:child_process';
import {cpSync,existsSync,mkdirSync,readFileSync,rmSync,writeFileSync,realpathSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
const target=resolve(process.argv[2]||'');
const source=realpathSync('.');
if(!process.argv[2]||target===source||target.startsWith(source+'/'))throw Error('Use a separate Sites checkout outside the development repository.');
const git=(args,cwd)=>execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:64*1024*1024,env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}}).trim();
if(git(['rev-parse','--show-toplevel'],target)!==target)throw Error('Target must be a Git checkout root.');
const manifest=JSON.parse(readFileSync('.openai/hosting.json','utf8'));
if(JSON.parse(readFileSync(target+'/.openai/hosting.json','utf8')).project_id!==manifest.project_id)throw Error('Wrong Sites project.');
if(git(['status','--porcelain'],source)||git(['status','--porcelain'],target))throw Error('Commit development changes and start with a clean Sites checkout.');
if(!readFileSync('dist/client/src/audio-host.js','utf8').includes('https://'))throw Error('Build the external-audio release first.');
const files=git(['ls-files','-z'],source).split('\0').filter(Boolean).filter(f=>!((f.startsWith('src/audio/azure/')||f.startsWith('dist/src/audio/azure/'))&&f.endsWith('.mp3'))&&!f.startsWith('audio-audition/')&&!f.startsWith('audio-generation/'));
const wanted=new Set(files);
for(const f of git(['ls-files','-z'],target).split('\0').filter(Boolean))if(!wanted.has(f))rmSync(resolve(target,f),{force:true});
for(const f of files){if(!existsSync(f))throw Error('Missing tracked source: '+f);const out=resolve(target,f);mkdirSync(dirname(out),{recursive:true});cpSync(f,out);}
writeFileSync(target+'/.openai/release-source.json',JSON.stringify({repository:'https://github.com/ajyyuan/perlingo',commit:git(['rev-parse','HEAD'],source)},null,2)+'\n');
// The verified Worker build is ignored source output, copied only for packaging.
rmSync(target+'/dist',{recursive:true,force:true});cpSync('dist',target+'/dist',{recursive:true});
console.log(`Prepared ${files.length} files in ${target}; publish with the Sites source helper.`);
