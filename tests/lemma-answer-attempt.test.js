import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRetryForms, retryMessage, retryReason, submitAnswer} from '../lemmas/answer-attempt.js';
import {createTest, advanceTest, validTest} from '../lemmas/assessment.js';
import {combineNotes} from '../lemmas/notes-library.js';
import {typedAnswers} from '../lemmas/recall-policy.js';
import {restoreProgress, validProgress} from '../lemmas/progress.js';

const read = name => JSON.parse(readFileSync(new URL(`../lemmas/data/${name}.json`, import.meta.url)));
const contexts = read('context').contexts;
const deck = read('deck').map(card => ({...card, context: contexts.find(context => context.id === card.id)}));
const library = combineNotes(read('notes'), {contexts});
const inventory = createRetryForms(library.notes, contexts);
const forms = (id, answers) => inventory(id, answers).forms;
const card = word => deck.find(card => card.lemma === word);
const attempt = (state, response, target) => submitAnswer(state, response, target,
  inventory(target.id, state.kind === 'context' ? [target.lemma] : typedAnswers(target)));

test('small spelling edits, transpositions and accents offer correction without accepting the answer', () => {
  for (const response of ['sbaer', 'saer', 'saberr', 'saver']) assert.equal(retryReason(response, ['saber']), 'spelling');
  assert.equal(retryReason('presidnete', ['presidente']), 'spelling');
  assert.equal(retryReason('presidnet', ['presidente']), 'spelling');
  assert.equal(retryReason('despues', ['después']), 'accents');
  assert.equal(retryReason('si', ['sí']), 'accents');
  assert.equal(retryReason('ano', ['año']), 'spelling');
  for (const response of ['', '!!!', 'a', 'se', 'conocer', 's'.repeat(10000)]) {
    assert.equal(retryReason(response, ['saber']), null, response.slice(0, 20));
  }
});

test('repeated close attempts preserve full credit and never advance or reveal feedback', () => {
  const target = card('saber');
  let state = createTest('typed', [target.id]);
  for (const response of ['sbaer', 'sbaer', 'sé']) {
    state = attempt(state, response, target);
    assert.equal(state.feedback, null);
    assert.equal(state.index, 0);
    assert.equal(state.firstCorrect, 0);
    assert.deepEqual(state.failures, {});
    assert.deepEqual(state.misses, []);
    assert.equal(state.draft, response);
    assert.ok(validTest(state, [target.id]));
    assert.deepEqual(advanceTest(state), state);
  }
  state = attempt(state, 'saber', target);
  assert.equal(state.feedback.correct, true);
  assert.equal(state.firstCorrect, 1);
  assert.equal(state.retry, undefined);
  assert.deepEqual(attempt(state, 'saber', target), state);
  assert.equal(advanceTest(state).done, true);
});

test('authored gender, shortened and irregular forms prompt a headword retry', () => {
  for (const [word, response] of [['presidente', 'presidenta'], ['primero', 'primer'], ['empezar', 'empiezo'], ['saber', 'supiste']]) {
    const target = card(word);
    const result = attempt(createTest('typed', [target.id]), response, target);
    assert.equal(result.retry, 'headword', word);
    assert.equal(result.feedback, null);
  }
});

test('recorded forms belong to the exact card and alternatives retain their grammatical category', () => {
  for (const [id, word, unwanted] of [
    ['corpes:ser:V', 'ser', 'seres'],
    ['corpes:bien:R', 'bien', 'bienes'],
    ['corpes:sí:R', 'sí', 'consigo'],
    ['corpes:solo:R', 'solo', 'sola'],
    ['corpes:mucho:R', 'mucho', 'muchas'],
    ['corpes:primero:R', 'primero', 'primeras']
  ]) assert.equal(forms(id, [word]).includes(unwanted), false, id);
  assert.ok(forms('corpes:ser:N', ['ser']).includes('seres'));
  assert.equal(forms('corpes:ser:N', ['ser']).includes('soy'), false);
  assert.ok(forms('corpes:bien:N', ['bien']).includes('bienes'));
  assert.ok(forms('corpes:sí:L', ['sí']).includes('consigo'));
  assert.ok(forms('corpes:empezar:V', ['empezar', 'comenzar']).includes('comencé'));
  assert.equal(forms('corpes:empezar:V', ['empezar', 'bien']).includes('bienes'), false);
  // Spelling proximity is intentionally independent of grammatical membership.
  assert.equal(retryReason('seres', ['ser'], inventory('corpes:ser:V', ['ser'])), 'formSpelling');
});

test('typos and accent slips in recorded forms allow correction back to the headword', () => {
  for (const [word, response] of [['saber', 'supisde'], ['saber', 'sabia'], ['saber', 'se'],
    ['presidente', 'presidentass'], ['empezar', 'comenzabam']]) {
    const target = card(word);
    const pending = attempt(createTest('typed', [target.id]), response, target);
    assert.equal(pending.retry, 'formSpelling', `${word}: ${response}`);
    assert.equal(pending.feedback, null);
    assert.deepEqual(pending.failures, {});
    assert.ok(validTest(pending, [target.id]));
    const corrected = attempt(pending, word, target);
    assert.equal(corrected.firstCorrect, 1);
    assert.equal(advanceTest(corrected).done, true);
  }
  const target = card('saber');
  let state = attempt(createTest('typed', [target.id]), 'supisde', target);
  state = attempt(state, 'supiste', target);
  assert.equal(state.retry, 'headword');
  assert.deepEqual(state.failures, {});
  assert.equal(attempt(state, 'saber', target).firstCorrect, 1);
  for (const response of ['hemos sabido', 'completely unrelated']) {
    assert.equal(attempt(createTest('typed', [target.id]), response, target).feedback.correct, false);
  }
});

test('explicit alternatives keep their credit while semantic guesses remain misses', () => {
  const target = card('empezar');
  let state = createTest('typed', [target.id]);
  state = attempt(state, 'comne zar', target);
  assert.equal(state.feedback.correct, false);
  state = attempt(createTest('typed', [target.id]), 'comnezar', target);
  assert.equal(state.retry, 'spelling');
  state = attempt(state, 'comenzar', target);
  assert.equal(state.feedback.correct, true);
  assert.equal(state.firstCorrect, 1);
  const saber = card('saber');
  assert.equal(attempt(createTest('typed', [saber.id]), 'conocer', saber).feedback.correct, false);
});

test('sentence retries inspect the target inside a supported phrase and keep the blank concealed', () => {
  const target = card('saber');
  // Use an explicit fixture so the headword and required conjugation differ.
  const fixture = {...target, context: {target: 'sabe', answers: ['sabe'], index: 1, offset: 0,
    example: {text: 'Ella sabe nadar.', chunks: [{text: 'Ella'}, {text: 'sabe'}, {text: 'nadar'}]}}};
  for (const response of ['saber', 'Ella saber nadar.', 'Ella sbae nadar.', 'Ella supisde nadar.']) {
    const state = attempt(createTest('context', [fixture.id]), response, fixture);
    assert.equal(state.feedback, null);
    assert.ok(state.retry);
    assert.equal(attempt(state, 'Ella sabe nadar.', fixture).firstCorrect, 1);
  }
});

test('show answer and unrelated answers after retries become normal misses; choices remain exact', () => {
  const target = card('saber');
  const pending = attempt(createTest('typed', [target.id]), 'sbaer', target);
  for (const response of ['', 'conocer']) {
    const state = attempt(pending, response, target);
    assert.equal(state.feedback.correct, false);
    assert.equal(state.retry, undefined);
    assert.equal(state.failures[target.id], 1);
    assert.equal(state.firstCorrect, 0);
    assert.equal(advanceTest(state).mode, 'repair');
  }
  const choice = submitAnswer(createTest('choice', [target.id]), 'sbaer', target);
  assert.equal(choice.feedback.correct, false);
  assert.equal(choice.retry, undefined);
});

test('pending retries survive progress restore and invalid retry state is rejected', () => {
  const target = card('saber');
  const state = attempt(createTest('typed', [target.id]), 'sbaer', target);
  const progress = restoreProgress(null, deck);
  const ids = deck.slice(0, 250).map(card => card.id);
  const exam = createTest('typed', ids);
  exam.queue = [target.id, ...exam.queue.filter(id => id !== target.id)];
  progress.exams['day-0'] = {type: 'day', day: 0, test: attempt(exam, 'supisde', target)};
  progress.activeExam = 'day-0';
  const restored = restoreProgress(JSON.parse(JSON.stringify(progress)), deck);
  assert.deepEqual(restored, progress);
  assert.ok(validProgress(restored, deck));
  assert.equal(attempt(restored.exams['day-0'].test, 'saber', target).firstCorrect, 1);
  assert.equal(validTest({...state, retry: 'unknown'}, [target.id]), false);
  assert.equal(validTest({...state, feedback: {correct: true, response: 'saber'}}, [target.id]), false);
});

test('five singular tense paradigms and nearby known conjugations allow an unscored retry', () => {
  const target = card('tener');
  const state = createTest('typed', [target.id]);
  const allowed = ['tengo','tienes','tiene','tenía','tenías','tuve','tuviste','tuvo','he tenido','has tenido','ha tenido','tenga','tengas'];
  assert.deepEqual(new Set(forms(target.id,['tener'])), new Set(['tener',...allowed]));
  for (const response of allowed) {
    const result = attempt(state,response,target);
    assert.equal(result.retry,'headword',response);
    assert.equal(attempt(result,'tener',target).firstCorrect,1);
  }
  for (const response of ['tienen','tenían']) {
    const result = attempt(state,response,target);
    assert.equal(result.feedback,null);
    assert.deepEqual(result.failures,{});
    assert.equal(retryMessage(result.retry,target.partOfSpeech),'Try the infinitive.');
    assert.equal(attempt(result,'tener',target).firstCorrect,1);
  }
  for (const response of ['tenemos','hemos tenido','han tenido','ten','tendré','tendría','teniendo','tenido','tuviera']) {
    assert.equal(attempt(state,response,target).feedback?.correct,false,response);
  }
  assert.equal(attempt(state,'ha teniod',target).retry,'formSpelling');
  assert.equal(attempt(state,'tienee',target).retry,'formSpelling');
  assert.deepEqual(forms('corpes:ocurrir:V',['ocurrir']).sort(), ['ocurrir','ocurre','ocurría','ocurrió','ocurra','ha ocurrido'].sort());
  const alternate=card('empezar');
  assert.equal(attempt(createTest('typed',[alternate.id]),'ha comenzado',alternate).retry,'headword');
  assert.equal(attempt(createTest('typed',[alternate.id]),'comenzaron',alternate).retry,'headword');
  const blank={...target,context:{target:'tienen',answers:['tienen'],index:1,offset:0,example:{chunks:[{text:'Ellos'},{text:'tienen'},{text:'tiempo'}]}}};
  const context=createTest('context',[blank.id]);
  assert.equal(attempt(context,'Ellos ha tenido tiempo',blank).retry,'context');
  assert.equal(attempt(context,'Ellos tenían tiempo',blank).retry,'context');
  assert.equal(attempt(context,'Ellos tienen tiempo',blank).firstCorrect,1);
});
