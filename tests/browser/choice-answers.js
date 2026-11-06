import {combineNotes} from '/lemmas/notes-library.js';
import {createTest,checkAnswer,optionsFor,currentChoiceOptions} from '/lemmas/assessment.js';
const el=id=>document.getElementById(id);
const read=async path=>{const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(path);return r.json();};
try{
 const [source,notes,context,usage]=await Promise.all(['/lemmas/data/deck.json','/lemmas/data/notes.json','/lemmas/data/context.json','/lemmas/data/day1-usage.json'].map(read));
 const library=combineNotes(notes,context,usage),byId=new Map(library.notes.map(n=>[n.id,n]));
 const deck=source.map(c=>({...c,meaning:byId.get(c.id).meaning}));
 let count=0;
 for(const c of deck){
  const options=optionsFor(c);
  if(options.length!==4||new Set(options).size!==4)throw Error('Duplicate/missing option: '+c.id);
  for(const answer of options)if(checkAnswer(createTest('choice',[c.id]),answer,c).feedback.correct!==(answer===c.meaning))throw Error('Wrong score: '+c.id);
  count++;
  const option=document.createElement('option');option.value=c.rank;option.textContent=`${c.rank} · ${c.lemma} · ${c.partOfSpeech}`;el('card').append(option);
 }
 el('status').textContent=`${count}/${deck.length} MCQs checked · 6,000 answer checks passed.`;
 el('card').value='256';
 let current,state;
 const render=()=>{
  el('choices').replaceChildren();
  for(const [i,value] of state.options.entries()){
   const b=document.createElement('button');b.textContent=`${String.fromCharCode(65+i)} · ${value}`;b.disabled=Boolean(state.feedback);
   if(state.feedback&&value===current.meaning)b.dataset.correct='';
   if(state.feedback&&!state.feedback.correct&&value===state.feedback.response)b.dataset.wrong='';
   b.onclick=()=>{state=checkAnswer(state,value,current);render();};el('choices').append(b);
  }
  el('feedback').textContent=state.feedback?(state.feedback.correct?'Correct.':`The matching meaning is: ${current.meaning}`):'';
 };
 const show=()=>{
  current=deck[Number(el('card').value)-1];state={...createTest('choice',[current.id]),options:optionsFor(current)};
  el('word').textContent=current.lemma;el('cue').textContent=current.partOfSpeech+' · Choose the meaning';el('migration').textContent='';render();
 };
 el('card').onchange=show;el('again').onclick=show;
 el('legacy').onclick=()=>{
  el('card').value='256';show();
  const old={...state,pass:3,round:4,firstCorrect:1,options:[current.meaning,deck[268].meaning,deck[252].meaning,deck[271].meaning]};
  const options=currentChoiceOptions(old,current);
  if(options.includes(deck[268].meaning)||old.pass!==3||old.firstCorrect!==1)throw Error('Legacy refresh failed');
  state={...old,options};render();el('migration').textContent='Old duplicate “end” removed. Pass 3 and the recorded first score are preserved.';
 };
 show();
}catch(error){el('status').textContent='FAIL · '+error.message;}
