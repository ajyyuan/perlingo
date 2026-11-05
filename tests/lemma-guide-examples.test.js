import test from 'node:test';
import assert from 'node:assert/strict';
import {guideExample} from '../lemmas/guide-examples.js';
import {verbGuide} from '../lemmas/verb-guide.js';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {exampleMarkup} from '../lemmas/sentence-help.js';
function get(word,tense,row=0,alternative=0){const note={id:'corpes:'+word+':V',word};return guideExample(note,verbGuide(note).flatMap(g=>g.lessons).find(l=>l.id===tense),row,alternative);}
test('every visible guide form and alternative has an exact example or explicit sense restriction',()=>{
 let sentences=0,restrictions=0;
 for(const id of Object.keys(verbForms)){
  const note={id,word:id.split(':')[1]};
  for(const g of verbGuide(note))for(const l of g.lessons){
   if(!l.rows.length)assert.ok(guideExample(note,l).notice);
   for(const [i,r] of l.rows.entries())for(const [a,form] of r.alternatives.entries()){
    const e=guideExample(note,l,i,a);
    if(e.notice){assert.ok(e.notice.length>30);restrictions++;continue;}
    assert.equal(e.target,form,`${id} ${l.id} ${i}/${a}`);
    assert.ok(e.text.toLowerCase().includes(form.toLowerCase()),e.text);
    assert.ok(e.translation&&!/undefined|NaN|\[object|\bhaved\b|\bi\b|\bana\b/.test(e.translation),e.text);
    assert.doesNotThrow(()=>exampleMarkup(e),e.text);
    for(const c of e.chunks||[])assert.ok(e.text.includes(c.text));
    if(g.category==='Literary & legal')assert.match(e.register,/Literary/);
    sentences++;
   }
  }
 }
 assert.ok(sentences>44000);assert.ok(restrictions>0);
});
test('compound tense contexts distinguish reference times and preserve both subjunctive alternatives',()=>{
 assert.equal(get('tener','pastPerfect').text,'Cuando llegó Ana, yo ya había tenido tiempo.');
 assert.equal(get('tener','perfectSubjunctive').translation,'It is possible that I have had time.');
 assert.equal(get('gustar','perfectSubjunctive').translation,'It is possible that Ana has liked me.');
 assert.match(get('tener','futurePerfectSubjunctive',3).wordMeanings['hubiéremos'],/future perfect/);
 assert.equal(get('tener','futurePerfect').translation,'By then, I will have had time.');
 assert.equal(get('tener','conditionalPerfect').translation,'Under different circumstances, I would have had time.');
 assert.match(get('tener','pastSubjunctive',0,1).text,/yo tuviese tiempo/);
 assert.match(get('tener','pluperfectSubjunctive',0,1).text,/yo hubiese tenido tiempo/);
 assert.equal(get('tener','pastAnterior').text,'Una vez que yo hube tenido tiempo, todo cambió.');
 assert.match(get('tener','futurePerfectSubjunctive').text,/^Si yo hubiere tenido tiempo,/);
});
test('subject identity survives restricted tables, experiencers, commands and nonfinite constructions',()=>{
 assert.equal(get('ocurrir','pastPerfect').text,'Cuando llegó Ana, el cambio ya había ocurrido aquí.');
 assert.equal(get('gustar','pastPerfect').translation,'When Ana arrived, Ana had already liked me.');
 assert.equal(get('gustar','nonfinite',3).translation,'After I had been liked by Ana, I described my experience.');
 assert.match(get('haber','pastSubjunctive',0).text,/yo hubiera terminado/);
 assert.match(get('haber','pastSubjunctive',6).text,/hubiera una solución/);
 assert.match(get('haber','pastPerfect').text,/había habido un cambio/);
 assert.equal(get('ir','commands',2).text,'Vamos al mercado.');
 assert.equal(get('ir','commands',2,1).text,'Vayamos al mercado.');
 assert.equal(get('querer','commands',2).translation,"Let's love our family.");
 assert.ok(get('saber','negative',2).notice);
 assert.match(get('describir','nonfinite',2,1).text,/he descripto/);
 assert.match(get('soler','nonfinite',1).notice,/rare gerund/);
 assert.equal(get('nacer','nonfinite',1).text,'Está naciendo una nueva idea.');
});
