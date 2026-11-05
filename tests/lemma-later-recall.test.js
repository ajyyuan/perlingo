import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {combineNotes} from '../lemmas/notes-library.js';
import {laterRecall} from '../lemmas/later-recall-data.js';
import {laterUsage} from '../lemmas/later-usage-data.js';
import {typedPrompt,typedAnswers,typedFeedbackAnswer} from '../lemmas/recall-policy.js';
import {createTest,checkAnswer,normalize,advanceTest} from '../lemmas/assessment.js';
import {submitAnswer,createRetryForms} from '../lemmas/answer-attempt.js';
import {supplementalMarkup,esc} from '../lemmas/note-view.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const bank=read('lemmas/data/context.json');
const lib=combineNotes(read('lemmas/data/notes.json'),bank,read('lemmas/data/day1-usage.json'));
const notes=new Map(lib.notes.map(n=>[n.id,n]));
const deck=read('lemmas/data/deck.json').map(c=>({...c,meaning:notes.get(c.id).meaning,context:lib.contexts.get(c.id)}));
const cards=new Map(deck.map(c=>[c.id,c]));
const card=k=>cards.get('corpes:'+k);
const grade=(k,a,kind='typed')=>checkAnswer(createTest(kind,[card(k).id]),a,card(k)).feedback.correct;

test('all 1250 later-day cards have explicit review dispositions and reproducible runtime artifacts',()=>{
 const review=read('data/spanish-lemmas/later-day-recall-review.json');
 assert.deepEqual(review.entries.map(e=>e.id),deck.slice(250).map(c=>c.id));
 assert.equal(Object.keys(laterRecall).length,547);
 for(const e of review.entries){
  const c=cards.get(e.id);
  assert.equal(typedPrompt(c),e.policy?.prompt??e.baseline.prompt,e.id);
  assert.deepEqual(typedAnswers(c),[e.lemma,...(e.policy?.alternatives||[])],e.id);
  if(e.teachingMeaning)assert.equal(notes.get(e.id).meaning,e.teachingMeaning);
  for(const a of typedAnswers(c))assert.equal(grade(e.id.slice(7),a),true,e.id+': '+a);
 }
 execFileSync(process.execPath,['scripts/build-later-recall.mjs','--check']);
});

test('selected meanings accept overlap but reject distinct senses, constructions and parts of speech',()=>{
 for(const [k,a]of [['utilizar:V','emplear'],['terminar:V','concluir'],['responder:V','contestar'],['enviar:V','mandar'],['escuchar:V','oír'],['oír:V','escuchar'],['médico:N','doctor'],['enseñar:V','mostrar'],['suelo:N','piso'],['recuerdo:N','memoria'],['solamente:R','solo'],['quizás:R','quizá'],['esposo:N','marido'],['fácil:A','sencillo']])assert.equal(grade(k,a),true,k);
 for(const [k,a]of [['jugar:V','tocar'],['tocar:V','jugar'],['actual:A','real'],['actualmente:R','realmente'],['libre:A','gratis'],['salvar:V','guardar'],['morir:V','matar'],['planta:N','piso'],['firma:N','empresa'],['mañana:N','mañana por la mañana'],['solo:A','solamente'],['médico:A','doctor'],['legal:A','judicial'],['empezar:V','iniciar'],['gana:N','ganas']])assert.equal(grade(k,a),false,k);
 assert.equal(grade('enviar:V','MANDAR!'),true);
 assert.equal(typedFeedbackAnswer(card('enviar:V'),'MANDAR!',normalize),'mandar');
});

test('new alternatives preserve retry, scoring and full-pass rules without changing contextual or choice acceptance',()=>{
 const c=card('utilizar:V'),inventory=createRetryForms(lib.notes,bank.contexts)(c.id,typedAnswers(c));
 let t=createTest('typed',[c.id]);
 t=submitAnswer(t,'emplera',c,inventory);assert.equal(t.retry,'spelling');assert.equal(t.feedback,null);assert.equal(t.firstCorrect,0);
 t=submitAnswer(t,'emplear',c,inventory);assert.equal(t.feedback.correct,true);assert.equal(t.firstCorrect,1);assert.equal(advanceTest(t).done,true);
 for(const c of deck.slice(250)){
  assert.equal(checkAnswer(createTest('choice',[c.id]),c.meaning,c).feedback.correct,true);
  for(const a of laterRecall[c.id]?.alternatives||[]){
   assert.equal(checkAnswer(createTest('choice',[c.id]),a,c).feedback.correct,normalize(a)===normalize(c.meaning));
   // Bare-word cloze answers are governed only by the unchanged context list.
   assert.equal(checkAnswer(createTest('context',[c.id]),a,c).feedback.correct,c.context.answers.some(x=>normalize(x)===normalize(a)),c.id+': '+a);
  }
 }
});

test('all comparison members expose their explanations and selected-use acceptance, with grounded source records',()=>{
 const evidence=read('data/spanish-lemmas/later-day-source-evidence.json');
 const source=read('data/spanish-lemmas/dictionary-extract.json');
 for(const g of laterUsage)for(const id of g.members){
  assert.ok(cards.get(id).rank>250,id);
  const html=supplementalMarkup(notes.get(id),lib.concepts);
  for(const s of g.sections){assert.ok(html.includes(esc(s.text)),id);assert.ok(s.sources.length);for(const [text]of s.examples)assert.ok(html.includes(`data-speak="${esc(text)}"`));}
 }
 for(const [id,p]of Object.entries(laterRecall)){
  const html=supplementalMarkup(notes.get(id),lib.concepts);
  assert.ok(html.includes(esc(p.prompt)));assert.ok(html.includes(esc(p.cue)));
  for(const a of p.alternatives){assert.ok(html.includes(esc(a)));assert.ok(evidence.sources[a],id+': '+a);}
 }
 for(const record of Object.values(evidence.sources))if(record.type.startsWith('stored-'))assert.equal(record.sha256,createHash('sha256').update(source[record.entry]).digest('hex'),record.word);
});

test('previously submitted feedback is not retroactively rescored after an alternative is added',()=>{
 const c=card('utilizar:V');
 const previous={...createTest('typed',[c.id]),feedback:{correct:false,response:'emplear',formError:false},failures:{[c.id]:1}};
 assert.strictEqual(submitAnswer(previous,'emplear',c),previous);
 assert.equal(previous.firstCorrect,0);
 assert.equal(previous.feedback.correct,false);
});


test('second linguistic audit accepts supported overlap without merging distinct senses',()=>{
 for(const [k,a]of [['tierra:N','suelo'],['riesgo:N','peligro'],['peligro:N','riesgo'],['suponer:V','asumir'],['analizar:V','examinar'],['analizar:V','estudiar'],['incluir:V','sumar'],['agregar:V','incorporar'],['añadir:V','incluir'],['luchar:V','combatir']])assert.equal(grade(k,a),true,k+': '+a);
 for(const [k,a]of [['suelo:N','tierra'],['asumir:V','suponer'],['estudiar:V','aprender']])assert.equal(grade(k,a),false,k+': '+a);
 const reason=laterUsage.find(g=>g.id==='later-69');
 assert.deepEqual(reason.sections[0].examples[0],['Explica el motivo de su decisión.','She explains the reason for her decision.']);
 assert.equal(laterRecall['corpes:medida:N'].cue,'The act of measuring something');
});


test('reconciled audit accepts ordinary alternatives without collapsing selected meanings',()=>{
 for(const [k,answers] of [
  ['meter:V',['introducir','insertar']],['miedo:N',['temor']],['informe:N',['reporte']],
  ['completo:A',['entero']],['suficiente:A',['bastante']],['similar:A',['parecido','semejante']],
  ['profundo:A',['hondo']],['exponer:V',['exhibir']],['comportamiento:N',['conducta']],
  ['velocidad:N',['rapidez']],['jurídico:A',['legal']],['ciento:N',['centenar','centena']],
  ['fuerza:N',['fortaleza']],['pared:N',['muro']],['informar:V',['comunicar']],
  ['llenar:V',['rellenar']],['complejo:A',['complicado']],['investigar:V',['averiguar']],
  ['actuación:N',['interpretación']],['estadounidense:A',['norteamericano']],
  ['tú:L',['vos']],['ti:L',['vos']],['común:A',['usual']],['normal:A',['usual']],['habitual:A',['usual']],
  ['época:N',['era']],['caer:V',['caerse']],['reír:V',['reírse']],['escapar:V',['escaparse']],
  ['aplicación:N',['uso','empleo']],['componer:V',['arreglar','reparar']],['promedio:N',['media']]
 ])for(const a of answers)assert.equal(grade(k,a),true,k+': '+a);
 for(const [k,a] of [['ciento:N','cien'],['medio:M','mitad'],['guardar:V','salvar'],['salvar:V','guardar'],['médico:A','doctor'],['suelo:N','tierra'],['asumir:V','suponer'],['libre:A','gratis'],['jugar:V','tocar']])assert.equal(grade(k,a),false,k+': '+a);
 assert.equal(laterRecall['corpes:guardar:V'].cue,'File menu: ___ como');
 assert.equal(laterRecall['corpes:actuación:N'].cue,'An actor’s performance of a role');
});

test('valid accent and spelling variants earn credit instead of a corrective retry',()=>{
 const inventory=createRetryForms(lib.notes,bank.contexts);
 for(const [k,a]of [['período:N','periodo'],['época:N','periodo'],['fútbol:N','futbol'],['video:N','vídeo'],['conciencia:N','consciencia'],['septiembre:N','setiembre']]){
  const c=card(k),t=submitAnswer(createTest('typed',[c.id]),a,c,inventory(c.id,typedAnswers(c)));
  assert.equal(t.retry,undefined,k);assert.equal(t.feedback.correct,true,k);assert.equal(t.firstCorrect,1,k);
 }
 const c=card('fútbol:N'),t=submitAnswer(createTest('typed',[c.id]),'futbo;',c,inventory(c.id,typedAnswers(c)));
 assert.ok(t.retry);assert.equal(t.firstCorrect,0);assert.equal(t.feedback,null);
});

test('audit corrections reach every shared example and preserve sentence cloze targets',()=>{
 for(const c of bank.contexts){
  if(c.example.text==='Incluso el final del torneo internacional es gratis.'){
   assert.equal(c.example.translation,'Even the end of the international tournament is free.');
   assert.ok(c.example.chunks.some(x=>x.meaning==='the end of the international tournament'));
  }
  if(c.example.text==='Nosotros aseguramos que el sector tiene recursos suficientes.'){
   assert.equal(c.example.translation,'We assure you that the sector has enough resources.');
   assert.ok(c.example.chunks.some(x=>x.meaning==='assure you'));
  }
  assert.ok(!c.example.translation.includes('medicine student'));
 }
 assert.equal(bank.contexts.find(c=>c.id==='corpes:final:N').answers[0],'final');
 assert.equal(grade('similar:A','parecido','context'),false);
 const obtaining=laterUsage.find(g=>g.id==='later-22');
 assert.ok(!obtaining.sections.some(s=>s.text.includes('obtener does not')));
 for(const [id,word]of [['later-56','juntar'],['later-143','complicado'],['later-card-viejo-N','anciano']])assert.ok(laterUsage.find(g=>g.id===id).sections[0].sources.some(([,url])=>url.includes('/'+word+'#')));
 for(const k of ['agregar:V','regresar:V','retirar:V'])assert.ok(!notes.get('corpes:'+k).meaning.includes('colloquially'));
});
