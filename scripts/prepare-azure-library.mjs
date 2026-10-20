// Deterministic offline plan. Does not call Azure.
import {execFileSync} from 'node:child_process';
import {writeFileSync,mkdirSync,existsSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {azureVoices,feminineVoices,expansionVoices} from '../src/azure-voices.js';
const inventory=JSON.parse(execFileSync(process.execPath,['scripts/audio-inventory.mjs','--manifest'],{encoding:'utf8',maxBuffer:20*1024*1024}));
const feminine=process.argv.includes('--feminine');
const expansion=process.argv.includes('--expansion');
const choices=expansion?Object.values(expansionVoices).flatMap(v=>Object.entries(v)):Object.entries(feminine?feminineVoices:azureVoices).filter(([locale])=>!expansionVoices.masculine[locale]);
const jobs=choices.map(([locale,voice])=>({locale,voice,clips:inventory.targets.filter(t=>t.locale.split('-')[0]===locale.split('-')[0]).map(t=>({text:t.text,id:createHash('sha256').update(`${voice}\n${t.text}`).digest('hex').slice(0,24)}))}));
const plan={version:1,format:'audio-24khz-48kbitrate-mono-mp3',jobs};
mkdirSync('audio-generation',{recursive:true});
const destination=`audio-generation/azure${expansion?'-expansion':feminine?'-feminine':''}-plan.json`;
if(existsSync(destination)&&readFileSync(destination,'utf8')!==JSON.stringify(plan))throw Error('Existing submitted plan differs. Preserve its ledgers and review incremental generation before replacing it.');
writeFileSync(destination,JSON.stringify(plan));
console.log(JSON.stringify({clips:jobs.reduce((n,j)=>n+j.clips.length,0),characters:jobs.reduce((n,j)=>n+j.clips.reduce((n,c)=>n+[...c.text].length,0),0),regions:jobs.map(j=>j.locale)}));
