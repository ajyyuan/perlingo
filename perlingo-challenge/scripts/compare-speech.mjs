// Independent macOS synthetic baseline. Not evidence of human accent accuracy.
import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {comparePCM} from '../public/benchmark.js';
import {getEntry} from '../public/content.js';
const originalFetch=globalThis.fetch;
globalThis.fetch=(url,options)=>originalFetch(new URL(url,'http://127.0.0.1:5174'),options);
const status=await (await fetch('/api/status')).json();const names=['elevenlabs','soniox'].filter(n=>status.providers?.[n]);
if(!names.length)throw Error('No provider configured');
const directory='/tmp/perlingo-speech-baseline';await mkdir(directory,{recursive:true});
const cases=[['en','Samantha'],['fr','Thomas'],['es','Mónica'],['de','Anna'],['zh','Tingting'],['ja','Kyoko']];
const stress=process.argv.includes('--stress');
const near={en:'red',fr:'faim',es:'van',de:'rot',zh:'面条',ja:'パンダ'};
const rows=[];
for(const [language,voice] of cases){for(const kind of (stress?['self-correction','late-correct','near-miss']:['correct','wrong','silence'])){
 let pcm=Buffer.alloc(96000);
 if(kind!=='silence'){
  const bread=getEntry('bread',language).word,water=getEntry('water',language).word;
  const text=kind==='self-correction'?water+', '+bread:kind==='near-miss'?near[language]:kind==='wrong'?water:bread;
  const file=`${directory}/${language}-${kind}.wav`;
  execFileSync('/usr/bin/say',['-v',voice,'-r','165','-o',file,'--file-format=WAVE','--data-format=LEI16@16000',text],{stdio:'pipe'});
  const wav=await readFile(file);let offset=12,raw;
  while(offset+8<=wav.length){const size=wav.readUInt32LE(offset+4);if(wav.toString('ascii',offset,offset+4)==='data'){raw=wav.subarray(offset+8,offset+8+size);break;}offset+=8+size+size%2;}
  if(!raw)throw Error('No WAV data');if(raw.length>89600)throw Error('Fixture exceeds capture window');raw.copy(pcm,kind==='late-correct'?Math.max(0,96000-raw.length-1600):6400);
 }
 const expected=getEntry('bread',language);const results=await comparePCM(pcm.buffer.slice(pcm.byteOffset,pcm.byteOffset+pcm.byteLength),language,expected.accepted,names);
 const row={language,voice,kind,shouldAccept:['correct','self-correction','late-correct'].includes(kind),results};rows.push(row);console.log(JSON.stringify(row));
 await writeFile(stress?'perlingo-challenge/speech-stress.json':'perlingo-challenge/speech-baseline.json',JSON.stringify({date:new Date().toISOString(),source:'macOS synthetic voices; one sample per language/category; NOT human accuracy',configuredProviders:names,missingProviders:['elevenlabs','soniox'].filter(n=>!names.includes(n)),rows},null,2)+'\n');
}}
