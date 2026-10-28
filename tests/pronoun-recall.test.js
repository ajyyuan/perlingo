import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createTest,checkAnswer} from '../lemmas/assessment.js';
import {recallCue,contextFeedbackAnswer} from '../lemmas/recall-prompt.js';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url)));
const bank=read('lemmas/data/context.json'),review=read('data/spanish-lemmas/context/pronoun-recall.json');
const contexts=new Map(bank.contexts.map(c=>[c.id,c]));
const card=key=>({id:'corpes:'+key,lemma:key.split(':')[0],partOfSpeech:'pronoun',context:contexts.get('corpes:'+key)});
const correct=(key,response,kind='context')=>checkAnswer(createTest(kind,['corpes:'+key]),response,card(key)).feedback.correct;
test('all 28 pronoun and possessive prompts have reviewed grammatical cues',()=>{
 const scoped=read('lemmas/data/deck.json').filter(c=>['L','H','W','X'].includes(c.sourceTag));
 assert.equal(scoped.length,28);assert.deepEqual(Object.keys(review.entries),scoped.map(c=>c.id));
 for(const c of scoped){assert.ok(recallCue(card(c.id.slice(7)),'typed'));assert.equal(recallCue(card(c.id.slice(7)),'choice'),'pronoun');}
 for(const key of ['te:L','tuyo:X','usted:L','tú:L','ti:L','os:L','lo:L'])assert.ok(recallCue(card(key),'context'));
 assert.match(recallCue(card('mío:X'),'typed'),/long form.*masculine singular/);
 assert.notEqual(recallCue(card('te:L'),'typed'),recallCue(card('tú:L'),'typed'));
});
test('valid alternatives pass only in reviewed sentence blanks, including phrase dictation',()=>{
 for(const [key,answers] of [['nosotros:L',['nosotros','nosotras','Nosotras aseguramos']],['cual:H',['cual','que','del que hablamos']],['sí:L',['sí','ella','por ella misma']],['cuál:W',['cuál','qué']],['qué:W',['qué','cuál']]])for(const a of answers)assert.equal(correct(key,a),true,key+': '+a);
 for(const [key,wrong] of [['nosotros:L','nos'],['lo:L','la'],['te:L','lo'],['te:L','tú'],['ti:L','usted'],['usted:L','ustedes'],['os:L','les'],['suyo:X','su'],['suyo:X','suya'],['mío:X','mi'],['nuestro:X','nuestro'],['cuyo:H','cuya'],['quién:W','quiénes'],['cuál:W','cuales'],['cuál:W','cuáles'],['sí:L','si']])assert.equal(correct(key,wrong),false,key+': '+wrong);
 // Headword tests still ask for the displayed dictionary form, with explicit cues.
 assert.equal(correct('nosotros:L','nosotras','typed'),false);
 assert.equal(correct('mío:X','mi','typed'),false);
});
test('accepted alternative is the feedback and pronunciation answer',()=>{
 assert.equal(contextFeedbackAnswer(card('nosotros:L').context,'Nosotras aseguramos'),'Nosotras');
 assert.equal(contextFeedbackAnswer(card('cual:H').context,'del que hablamos'),'que');
 assert.equal(contextFeedbackAnswer(card('sí:L').context,'por ella misma'),'ella');
 assert.equal(contextFeedbackAnswer(card('sí:L').context,'wrong'),'sí');
 const app=readFileSync(new URL('../lemmas/app.js',import.meta.url),'utf8');
 assert.match(app,/recallCue\(c,t.kind\)/);assert.match(app,/contextFeedbackAnswer\(c.context,response\)/);
 assert.ok(app.includes('One missing word…'));
});
