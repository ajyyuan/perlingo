import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {contextPilot} from '../lemmas/context-pilot.js';
import {wordMeanings} from '../lemmas/word-help.js';
import {cardFormWords} from '../lemmas/card-links.js';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const exceptions=read('data/spanish-lemmas/context/form-exceptions.json');
const deck=read('lemmas/data/deck.json'),notes=read('lemmas/data/notes.json').notes;
const concepts={
 n:{title:'Noun phrase',text:'Read the noun together with its article and modifiers. Articles and adjectives agree with the noun in gender and number; a phrase beginning with de can add information about it.'},
 v:{title:'Verb construction',text:'Read these words together as the action in this sentence. A conjugated verb marks its subject and tense; a dependent infinitive names an action without adding another person ending. Pronouns can accompany a verb.'},
 p:{title:'Connecting phrase',text:'Read this phrase as a unit: it connects the action or description to a place, time, person, purpose, or other complement. The English gloss gives its meaning here; prepositions do not have a single translation in every context.'},
 s:{title:'Reference in context',text:'This expression refers to a person, thing, or idea in the sentence. Relative words connect it to a description; object pronouns and personal a can mark the person affected by an action.'},
 c:{title:'Linking ideas',text:'This word or expression connects the ideas in the sentence. Use its contextual gloss to distinguish meanings such as addition, contrast, cause, and conditions.'},
 a:{title:'Description and agreement',text:'This description belongs to the person or thing described in the sentence. Spanish adjectives normally agree with that noun in gender and number. The noun’s entry shows its gender.'},
 r:{title:'Meaning in context',text:'This expression modifies an action, description, or statement. Its placement and surrounding words determine the intended meaning; the English gloss describes this use.'}
};
const targetConcepts={};
const bank=[...contextPilot],errors=[],used=new Set(bank.map(c=>c.id));
const rows=[];
const sourceFiles=['scripts/build-lemma-context.mjs','lemmas/card-links.js','lemmas/word-help.js','lemmas/data/notes.json','data/spanish-lemmas/dictionary-extract.json','data/spanish-lemmas/notes-inflection-evidence.json','lemmas/context-pilot.js','lemmas/first-set-notes.js','data/spanish-lemmas/context/form-exceptions.json','data/spanish-lemmas/context/word-glosses.json',...Array.from({length:5},(_,i)=>`data/spanish-lemmas/context/day${i+1}.txt`)];
for(let day=1;day<=5;day++)for(const [lineNo,line] of fs.readFileSync(`data/spanish-lemmas/context/day${day}.txt`,'utf8').split('\n').entries()){
 if(!line.trim()||line.startsWith('#'))continue;
 const [targets,translation,span,...extra]=line.split('|');
 if(extra.length||!span||!translation)throw Error(`Invalid row day ${day}:${lineNo+1}`);
 const chunks=span.split(' / ').map(s=>{const m=s.match(/^([nvpscar]):([^=]+)=(.+)$/u);if(!m)throw Error(s);return {text:m[2],meaning:m[3].trim(),concept:'context:'+m[1]};});
 const example={text:chunks.map(c=>c.text).join(' ')+'.',translation,chunks};
 for(const spec of targets.split(',')){
  const [rankString,target]=spec.split(':'),rank=Number(rankString),note=notes[rank-1];
  if(!note||rank<=50||Math.floor((rank-1)/300)+1!==day)errors.push(`Rank ${rank} in wrong file`);
  const locations=chunks.flatMap((c,index)=>[...c.text.matchAll(/\p{L}+/gu)].filter(m=>m[0].toLocaleLowerCase('es')===target.toLocaleLowerCase('es')).map(m=>({index,offset:m.index,target:m[0]})));
  if(locations.length!==1){errors.push(`${rank} ${note.word}: ${target} occurs ${locations.length} times`);continue;}
  const forms=[note.word,...note.forms.flatMap(r=>cardFormWords(r[1]))];
  if(!forms.some(f=>f.toLocaleLowerCase('es')===target.toLocaleLowerCase('es'))&&exceptions[rank]?.form!==target)errors.push(`FORM ${rank} ${note.word}: ${target} vs ${forms.join(', ')}`);
  if(used.has(note.id))errors.push(`Duplicate ${note.id}`);used.add(note.id);
  const formLabels=note.forms.filter(([,f])=>cardFormWords(f).some(word=>word.toLocaleLowerCase('es')===target.toLocaleLowerCase('es'))).map(([label])=>label);
  const explanation=exceptions[rank]?`${locations[0].target}: ${exceptions[rank].reason}. ${note.tip}`:target.toLowerCase()===note.word?`${note.word} is used here as ${/^[aeiou]/i.test(note.label)?'an':'a'} ${note.label}. ${note.tip}`:`${locations[0].target} is a form of ${note.word}${formLabels.length?` (${note.label==='verb'?'present: ':''}${formLabels.join(' / ')})`:''}. ${note.tip}`;
  const authoredExample=structuredClone(example),concept='context:target:'+rank;
  targetConcepts[concept]={title:note.word+' in this sentence',text:explanation+' In this phrase: '+authoredExample.chunks[locations[0].index].meaning+'.'};
  authoredExample.chunks[locations[0].index].concept=concept;
  bank.push({id:note.id,example:authoredExample,...locations[0],answers:[locations[0].target],headword:note.word,explanation});
  rows.push({rank,id:note.id,target:locations[0].target,source:note.source,sourceFile:`day${day}.txt`,line:lineNo+1});
 }
}
if(errors.length){console.log(errors.join('\n'));process.exitCode=1;}else{
 const order=new Map(deck.map((c,i)=>[c.id,i]));bank.sort((a,b)=>order.get(a.id)-order.get(b.id));
 if(bank.length!==1500)throw Error('Incomplete context bank: '+bank.length);
 const additions=fs.existsSync('data/spanish-lemmas/context/word-glosses.json')?read('data/spanish-lemmas/context/word-glosses.json'):{};
 const lexicon={...wordMeanings,...additions};
 const candidates=new Map();
 for(const n of notes){for(const form of [n.word,...n.forms.flatMap(r=>cardFormWords(r[1]))]){
  if(!/^\p{L}+$/u.test(form))continue;
  const key=form.toLocaleLowerCase('es');if(!candidates.has(key))candidates.set(key,[]);
  if(!candidates.get(key).some(x=>x.id===n.id))candidates.get(key).push(n);
 }}
 const unknown=new Set(),ambiguous=new Map();
 for(const c of bank.slice(50)){
  c.wordMeanings={};
  for(const chunk of c.example.chunks){const words=[...chunk.text.matchAll(/\p{L}+/gu)];for(const w of words){
   const key=w[0].toLocaleLowerCase('es'),choices=candidates.get(key)||[];
   const meaning=words.length===1?chunk.meaning:lexicon[key]|| (choices.length===1?choices[0].meaning:null);
   if(!meaning){if(choices.length>1)ambiguous.set(key,choices.map(n=>`${n.label}: ${n.meaning}`));else unknown.add(key);}
   c.wordMeanings[key]=meaning;
  }}
 }
 if(unknown.size||ambiguous.size){console.log('UNKNOWN:',[...unknown].sort().join(', '));console.log('AMBIGUOUS:',JSON.stringify(Object.fromEntries(ambiguous),null,2));process.exitCode=1;}
 else{
  fs.writeFileSync('lemmas/data/context.json',JSON.stringify({version:3,contexts:bank,concepts:{...Object.fromEntries(Object.entries(concepts).map(([k,v])=>['context:'+k,v])),...targetConcepts}},null,2)+'\n');
  fs.writeFileSync('data/spanish-lemmas/context/coverage.json',JSON.stringify({version:3,count:bank.length,sourceHashes:Object.fromEntries(sourceFiles.map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')])),perDay:[0,1,2,3,4].map(d=>bank.slice(d*300,d*300+300).length),uniqueSentences:new Set(bank.map(c=>c.example.text)).size,entries:rows},null,2)+'\n');
  console.log(`Built ${bank.length} contexts, ${new Set(bank.map(c=>c.example.text)).size} distinct sentences.`);
 }
}
