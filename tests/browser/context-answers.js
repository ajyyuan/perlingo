import {combineNotes} from '/lemmas/notes-library.js';
import {createTest} from '/lemmas/assessment.js';
import {submitAnswer,createRetryForms} from '/lemmas/answer-attempt.js';
const read=async path=>{const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(path+': '+r.status);return r.json();};
const el=id=>document.getElementById(id);
try{
 const [source,notes,bank,usage,audit]=await Promise.all([
  '/lemmas/data/deck.json','/lemmas/data/notes.json','/lemmas/data/context.json',
  '/lemmas/data/day1-usage.json','/data/spanish-lemmas/context/answer-review-2026-11-06.json'
 ].map(read));
 const library=combineNotes(notes,bank,usage),forms=createRetryForms(library.notes,bank.contexts);
 const deck=source.map(c=>({...c,context:library.contexts.get(c.id)}));
 const grade=(c,answer)=>submitAnswer(createTest('context',[c.id]),answer,c,forms(c.id,c.context.answers));
 let failures=0,count=0;
 for(const d of [...audit.candidates,...audit.related,...audit.originalFlags]){
  const c=deck[d.rank-1],expected=['accept','retain'].includes(d.decision);
  const responses=d.substitutedSentence?[d.answer,d.substitutedSentence]:[d.answer];
  const ok=responses.every(answer=>{
   const result=grade(c,answer);
   return expected?result.feedback?.correct===true&&!result.retry&&result.firstCorrect===1:result.feedback?.correct!==true&&result.firstCorrect===0;
  });
  count++;if(!ok)failures++;
  const li=document.createElement('li');li.textContent=`${ok?'PASS':'FAIL'} · ${d.rank} ${c.lemma} → ${d.answer} · ${expected?'credit':'no credit'}`;el('checks').append(li);
 }
 el('status').textContent=`${count-failures}/${count} audit checks passed${failures?` · ${failures} failures`:''}.`;
 const ranks=[...new Set([...audit.candidates,...audit.related].map(d=>d.rank))].sort((a,b)=>a-b);
 for(const rank of ranks){const option=document.createElement('option');option.value=rank;option.textContent=`${rank} · ${deck[rank-1].lemma}`;el('card').append(option);}
 el('card').value='1278';
 const show=()=>{
  const c=deck[Number(el('card').value)-1],x=c.context;
  el('sentence').textContent=x.example.chunks.map((ch,i)=>i===x.index?ch.text.slice(0,x.offset)+'___'+ch.text.slice(x.offset+x.target.length):ch.text).join(' ')+'.';
  el('translation').textContent=x.example.translation;el('feedback').textContent='';el('answer').value='';
 };
 el('card').onchange=show;show();
 el('try').onsubmit=event=>{
  event.preventDefault();const c=deck[Number(el('card').value)-1],result=grade(c,el('answer').value);
  el('feedback').textContent=result.feedback?.correct?'Accepted immediately.':result.retry?'No credit — retry offered.':'Not accepted for this sentence.';
 };
}catch(error){el('status').textContent='FAIL · '+error.message;}
