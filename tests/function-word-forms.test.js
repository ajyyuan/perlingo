import test from 'node:test';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {combineNotes} from '../lemmas/notes-library.js';
import {createCardLookup,configureCardLinks,cardLinks} from '../lemmas/card-links.js';
import {createTest,checkAnswer} from '../lemmas/assessment.js';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
const deck=read('../lemmas/data/deck.json');
const audit=read('../data/spanish-lemmas/function-word-audit.json');
const {notes,contexts}=combineNotes(read('../lemmas/data/notes.json'),read('../lemmas/data/context.json'));
const byId=new Map(notes.map(n=>[n.id,n]));
const lookup=createCardLookup(notes,contexts.values());
const forms=rows=>[...new Set(rows.flatMap(([,text])=>text.split(/\s*·\s*/)))];
test('audit covers all 61 remaining function-word cards and their actual displayed forms',()=>{
 const scoped=deck.filter(c=>['L','H','W','Q','M'].includes(c.sourceTag));
 assert.equal(scoped.length,61);
 assert.deepEqual(audit.entries.map(e=>e.id),scoped.map(c=>c.id));
 assert.equal(audit.entries.filter(e=>e.status==='added').length,30);
 for(const entry of audit.entries){
  assert.ok(entry.reason);
  assert.deepEqual(forms(byId.get(entry.id).forms),forms(entry.forms),entry.id);
  assert.ok(lookup(byId.get(entry.id).word).some(n=>n.id===entry.id));
  for(const phrase of forms(entry.forms)){
   const word=phrase.replace(/^(?:el|la|lo|los|las) /u,'');
   assert.ok(lookup(word.toLocaleUpperCase('es')).some(n=>n.id===entry.id),entry.id+': '+word);
  }
 }
});
test('missing agreement, short forms and con combinations open their intended cards',()=>{
 const expected={les:'le:L',ellas:'él:L',ello:'él:L',ustedes:'usted:L',nosotras:'nosotros:L',contigo:'ti:L',consigo:'sí:L',quienes:'quien:H',quiénes:'quién:W',cuales:'cual:H',cuáles:'cuál:W',cuyas:'cuyo:H',cuántas:'cuánto:W',algún:'alguno:Q',ningún:'ninguno:Q',cualesquiera:'cualquiera:Q',cualesquier:'cualquiera:Q',primer:'primero:M',tercer:'tercero:M',segundas:'segundo:M',cuartas:'cuarto:M',medias:'medio:M',mismas:'mismo:Q',tantas:'tanto:Q',pocas:'poco:Q',muchas:'mucho:Q',ciertas:'cierto:Q',varias:'varios:Q',ambas:'ambos:Q',unos:'uno:Q'};
 configureCardLinks(notes,contexts.values());
 for(const [word,key] of Object.entries(expected))assert.ok(cardLinks(word).includes(`data-lemma-card="corpes:${key}"`),word);
 assert.ok(lookup('consigo').some(n=>n.id==='corpes:conseguir:V'));
 assert.deepEqual(lookup('conmigo').map(n=>n.id).sort(),['corpes:conmigo:L','corpes:mí:L'].sort());
});
test('shared noun articles do not create bogus links, and real article/pronoun ambiguity remains',()=>{
 for(const article of ['el','la','los','las'])assert.deepEqual(lookup(article).map(n=>n.id).sort(),(article==='el'?['corpes:el:T']:['corpes:el:T','corpes:lo:L']).sort());
 const f=createCardLookup([{id:'noun',word:'joven',forms:[['plural','los / las jóvenes']]},{id:'relative',word:'cual',forms:[['singular','el cual / la cual'],['neuter','lo cual']]}]);
 for(const article of ['el','la','lo','los','las'])assert.deepEqual(f(article),[]);
 assert.equal(f('jóvenes')[0].id,'noun');assert.equal(f('cual')[0].id,'relative');
 const pronouns=createCardLookup([{id:'objects',word:'lo',forms:[['group','lo / la / los / las']]}]);
 for(const word of ['lo','la','los','las'])assert.equal(pronouns(word)[0].id,'objects');
});
test('sense restrictions and accents prevent invented or misleading variants',()=>{
 for(const [word,wrong] of [['quiénes','quien:H'],['quienes','quién:W'],['cuáles','cual:H'],['cuales','cuál:W'],['ti','tuyo:X'],['si','sí:L'],['alguien','alguno:Q'],['nada','ninguno:Q'],['unos','uno:M'],['doses','dos:M']])assert.ok(!lookup(word).some(n=>n.id==='corpes:'+wrong),word);
 for(const word of ['cualesquieras','ningun','algun'])assert.deepEqual(lookup(word),[]);
 assert.match(byId.get('corpes:ninguno:Q').more,/restricted/);
 assert.match(byId.get('corpes:cualquiera:Q').more,/formal.*rare/);
 assert.match(byId.get('corpes:uno:Q').more,/Generic-person.*singular/);
 assert.match(byId.get('corpes:sí:L').more,/Consigo is reflexive/);
 assert.match(byId.get('corpes:sí:L').tip,/referent in the same sentence/);
 assert.doesNotMatch(byId.get('corpes:sí:L').tip,/third-person subject/);
 for(const key of ['cada:Q','algo:Q','nada:Q','nadie:Q','alguien:Q','más:Q','menos:Q','demás:Q','dos:M','qué:W'])assert.deepEqual(byId.get('corpes:'+key).forms,[]);
});
test('new reference forms do not broaden contextual accepted answers',()=>{
 for(const [key,answer,wrong] of [['primero:M','primer','primera'],['alguno:Q','algunos','algún'],['ninguno:Q','ningún','ninguna'],['él:L','Él','ella'],['lo:L','Lo','la'],['cuánto:W','cuánto','cuántas'],['uno:Q','Uno','unos']]){
  const id='corpes:'+key,context=contexts.get(id),card={id,lemma:byId.get(id).word,context};
  assert.deepEqual(context.answers,[answer]);
  assert.equal(checkAnswer(createTest('context',[id]),answer,card).feedback.correct,true);
  assert.equal(checkAnswer(createTest('context',[id]),wrong,card).feedback.correct,false);
 }
});

test('new ambiguous forms retain the reviewed meaning in every shared sentence',()=>{
 for(const {word,sentence,meaning} of audit.contextGlossReview){
  const shared=[...contexts.values()].filter(c=>c.example.text===sentence);
  assert.equal(shared.length,3);
  for(const c of shared)assert.equal(c.wordMeanings[word],meaning);
 }
});

test('all assessment content retains the pre-audit fingerprint',()=>{
 const bank=read('../lemmas/data/context.json');
 const assessment=bank.contexts.map(c=>[c.id,c.target,c.answers,c.example.text,c.example.translation]);
 assert.equal(createHash('sha256').update(JSON.stringify(assessment)).digest('hex'),audit.contextIntegrity.assessmentSha256);
});
