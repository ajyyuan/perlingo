import fs from 'node:fs';
import {buildExamples,balancedPeople} from './build-lemma-tense-examples.mjs';
const path=new URL('../data/spanish-lemmas/tense-examples/frequency-pilot.json',import.meta.url);
const config=JSON.parse(fs.readFileSync(path,'utf8'));
const balanced=buildExamples();
const people={...balancedPeople},specialOverrides={tener:{subjunctive:null}};
for(const [word,entry]of Object.entries(config.entries)){
 if(!balanced['corpes:'+word+':V'])throw Error('Unknown pilot verb '+word);
 if(!['third','impersonal'].includes(entry.person))people[word]=entry.person;
 // Commands address an addressee rather than the example's declarative subject.
 specialOverrides[word]={...specialOverrides[word],...config.specialOverrides?.[word],commands:balanced['corpes:'+word+':V'].commands,negative:balanced['corpes:'+word+':V'].negative};
}
specialOverrides.tener.commands={...specialOverrides.tener.commands,wordMeanings:{ten:'have (command)',cuidado:'care; in ten cuidado: be careful'}};
specialOverrides.tener.negative={...specialOverrides.tener.negative,wordMeanings:{no:'do not',tengas:'have (negative command)',miedo:'fear'}};
const generated=buildExamples({people,frameOverrides:config.frameOverrides,subjectOverrides:config.subjectOverrides,glossOverrides:config.glossOverrides,specialOverrides});
const pilot=Object.fromEntries(Object.keys(config.entries).map(w=>['corpes:'+w+':V',generated['corpes:'+w+':V']]));
const metadata={source:config.source,entries:Object.fromEntries(Object.entries(config.entries).map(([w,e])=>['corpes:'+w+':V',e]))};
fs.writeFileSync(new URL('../lemmas/frequency-pilot-data.js',import.meta.url),'// Authored pilot grounded in TUBELEX surface-form counts; see docs/lemma-frequency-pilot.md.\nexport const frequencyPilot = '+JSON.stringify(pilot,null,2)+';\nexport const pilotEvidence = '+JSON.stringify(metadata,null,2)+';\n');
console.log(Object.keys(pilot).length+' frequency-informed verb groups; balanced data retained');
