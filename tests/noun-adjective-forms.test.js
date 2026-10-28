import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {combineNotes} from '../lemmas/notes-library.js';
import {createCardLookup,configureCardLinks,cardLinks,cardFormWords} from '../lemmas/card-links.js';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url)));
const deck=read('../lemmas/data/deck.json'),base=read('../lemmas/data/notes.json');
const {notes,contexts}=combineNotes(base,read('../lemmas/data/context.json'));
const audit=read('../data/spanish-lemmas/noun-adjective-audit.json');
const byId=new Map(notes.map(n=>[n.id,n])),lookup=createCardLookup(notes,contexts.values());
test('all 949 noun/adjective cards and every displayed variant are covered by the audit and lookup',()=>{
 const scoped=deck.filter(c=>['N','A'].includes(c.sourceTag));
 assert.equal(scoped.filter(c=>c.sourceTag==='N').length,752);assert.equal(scoped.filter(c=>c.sourceTag==='A').length,197);
 assert.deepEqual(audit.metadataScreen.map(e=>e.id),scoped.map(c=>c.id));
 for(const card of scoped){
  const n=byId.get(card.id);
  assert.ok(lookup(n.word).some(x=>x.id===n.id),n.id);
  for(const [,phrase] of n.forms){
   // Independently expand article-bearing alternatives rather than trusting the lookup parser.
   const variants=phrase.replace(/^(el|la|los|las) \/ (el|la|los|las) /u,'').split(/\s*[\/·]\s*/);
   for(const variant of variants){
    const word=variant.replace(/^(el|la|los|las) /u,'');
    assert.ok(lookup(word.toLocaleUpperCase('es')).some(x=>x.id===n.id),n.id+': '+word);
   }
  }
 }
 assert.equal(audit.changes.length,63);
 for(const change of audit.changes)assert.deepEqual(byId.get(change.id).forms,change.forms,change.id);
});
test('feminine counterparts, apocopations and alternate plurals link to the intended uses',()=>{
 const expected={niñas:'niño:N',hijas:'hijo:N',actrices:'actor:N',presidentas:'presidente:N',médicas:'médico:N',profesoras:'profesor:N',juezas:'juez:N',clientas:'cliente:N',lideresas:'líder:N',poetisas:'poeta:N',alcaldesas:'alcalde:N',reinas:'rey:N',doña:'don:N',campeonas:'campeón:N',muertas:'muerto:N',clubs:'club:N',clubes:'club:N',buen:'bueno:A',mal:'malo:A',gran:'grande:A'};
 configureCardLinks(notes,contexts.values());
 for(const [word,key] of Object.entries(expected))assert.ok(cardLinks(word).includes(`data-lemma-card="corpes:${key}"`),word);
 assert.ok(cardLinks('ME\u0301DICAS').includes('data-lemma-card="corpes:médico:N"'));
 for(const id of ['corpes:político:N','corpes:político:A'])assert.ok(lookup('políticas').some(n=>n.id===id));
 assert.ok(lookup('mal').some(n=>n.id==='corpes:mal:R'));
});
test('related meanings do not become inflections and fixed genders remain fixed',()=>{
 for(const [word,key] of [['actora','actor:N'],['mana','mano:N'],['tipa','tipo:N'],['rata','rato:N'],['carga','cargo:N'],['inglesa','inglés:N'],['músico','músico:N'],['madre','padre:N'],['dones','don:N'],['carácteres','carácter:N']])assert.ok(!lookup(word).some(n=>n.id==='corpes:'+key),word);
 assert.deepEqual(byId.get('corpes:mano:N').forms,[['singular','la mano'],['plural','las manos']]);
 for(const w of ['persona','personaje'])assert.equal(byId.get('corpes:'+w+':N').forms.length,2);
 for(const w of ['fútbol','pasado','izquierda','inglés','personal'])assert.equal(byId.get('corpes:'+w+':N').forms.length,1);
 assert.equal(byId.get('corpes:músico:N').forms.length,0); // Authored uncountable music note.
 assert.deepEqual(read('../data/spanish-lemmas/notes-build-report.json').omittedForms,[]);
 assert.match(byId.get('corpes:actor:N').more,/Actora belongs to other uses/);
 assert.match(byId.get('corpes:secretario:N').more,/secretaría with an accent/);
 assert.match(byId.get('corpes:miembro:N').more,/both el miembro and la miembro are valid/);
 assert.doesNotMatch(byId.get('corpes:miembro:N').more,/Use the feminine forms/);
 assert.match(byId.get('corpes:miembro:N').tip,/any gender/);
 assert.match(byId.get('corpes:bueno:A').more,/optional when coordinated/);
 assert.match(byId.get('corpes:bueno:A').more,/el bueno de Pedro/);
 assert.match(byId.get('corpes:español:N').tip,/language.*Spanish person/);
 assert.match(byId.get('corpes:izquierda:N').more,/a izquierdas.*counterclockwise/);
 assert.deepEqual(byId.get('corpes:dirigente:N').forms.map(row=>row[1]),['el dirigente','la dirigente','los dirigentes','las dirigentes']);
 for(const word of ['dirigenta','dirigentas'])assert.ok(!lookup(word).some(n=>n.id==='corpes:dirigente:N'));
 assert.doesNotMatch(byId.get('corpes:dirigente:N').more,/frozen dictionary/);
});
test('shared and repeated articles expand without article leakage or arbitrary phrase tokens',()=>{
 assert.deepEqual(cardFormWords('la juez / la jueza'),['juez','jueza']);
 assert.deepEqual(cardFormWords('los / las jueces'),['jueces']);
 assert.deepEqual(cardFormWords('los clubes / los clubs'),['clubes','clubs']);
 assert.deepEqual(cardFormWords('la investigación científica'),[]);
 for(const a of ['el','la','los','las'])assert.ok(!lookup(a).some(n=>['noun','adjective'].includes(n.label)),a);
});
test('contextual scientific remains an adjective and all assessment content is preserved',()=>{
 const shared=[...contexts.values()].filter(c=>c.example.text==='A usted le gusta la investigación científica.');
 assert.equal(shared.length,3);for(const c of shared)assert.equal(c.wordMeanings['científica'],'scientific (describing research)');
 const assessment=[...contexts.values()].map(c=>[c.id,c.target,c.answers,c.example.text,c.example.translation]);
 assert.equal(createHash('sha256').update(JSON.stringify(assessment)).digest('hex'),audit.contextIntegrity.assessmentSha256);
});
