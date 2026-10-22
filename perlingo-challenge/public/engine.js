export function normalize(text,language='en'){
 let value=String(text).normalize('NFC').toLocaleLowerCase(language==='fil'?'en':language).replace(/[\p{P}\p{S}]/gu,' ').replace(/\s+/gu,' ').trim();
 // Optional Arabic vocalization and Hebrew pointing are not lexical spelling differences.
 if(['ar','fa','ur','he'].includes(language))value=value.replace(/[\u064B-\u065F\u0670\u0591-\u05C7]/gu,'');
 return value;
}
export function matchesAnswer(text,accepted,language){
 const normalized=normalize(text,language);
 return accepted.some(answer=>{
  const target=normalize(answer,language);
  // Avoid accepting substrings (pan in pants, 水 in 水果).
  const parts=normalized.split(' '), wanted=target.split(' ');
  return parts.some((_,i)=>parts.slice(i,i+wanted.length).join(' ')===target);
 });
}
export function shuffle(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export class Round{
 constructor(ids,{seconds=60,windowSeconds=3,untimed=false,random=Math.random}={}){
  this.queue=shuffle([...new Set(ids)],random);this.initial=[...this.queue];this.untimed=untimed;this.remaining=untimed?Infinity:seconds*1000;this.windowMs=untimed?Infinity:windowSeconds*1000;this.correct=[];this.attempts=[];this.serial=0;this.active=null;
 }
 begin(now){if(this.active)throw Error('Card already active');if(this.done)return null;this.active={id:this.queue[0],token:++this.serial,start:now,duration:Math.min(this.windowMs,this.remaining)};return this.active;}
 finish(token,outcome,now,transcript=''){
  const card=this.active;if(!card||card.token!==token)return false;
  if(this.untimed&&outcome==='timeout')return false;
  if(!['correct','pass','timeout'].includes(outcome))throw Error('Unknown outcome');
  const elapsed=Math.max(0,Math.min(now-card.start,card.duration));
  this.remaining=Math.max(0,this.remaining-elapsed);this.queue.shift();
  if(outcome==='correct')this.correct.push(card.id);else this.queue.push(card.id);
  this.attempts.push({id:card.id,outcome,elapsed:Math.round(elapsed),transcript});this.active=null;return true;
 }
 // Reorder only unanswered languages between cards; never reset time or score.
 prioritize(id){if(this.active||this.done||!this.queue.includes(id))return false;const at=this.initial.indexOf(id);const ordered=[...this.initial.slice(at),...this.initial.slice(0,at)];this.queue=ordered.filter(item=>this.queue.includes(item));return true;}
 // Technical interruptions consume no game time and never become wrong answers.
 cancel(){this.active=null;}
 get done(){return this.remaining<=0||!this.queue.length;}
}

// Speech is a recall check, not a spelling/pronunciation exam. Preserve vowel
// signs in Indic/Thai scripts; remove accent marks only on alphabetic bases.
export function normalizeSpeech(text,language){
 return normalize(text,language).normalize('NFD')
  .replace(/([\p{Script=Latin}\p{Script=Greek}\p{Script=Cyrillic}])\p{M}+/gu,'$1')
  .normalize('NFC');
}
const graphemes=new Intl.Segmenter(undefined,{granularity:'grapheme'});
const units=text=>Array.from(graphemes.segment(text),s=>s.segment);
function distance(a,b){
 let previous=Array.from({length:b.length+1},(_,i)=>i);
 for(let i=0;i<a.length;i++){const next=[i+1];for(let j=0;j<b.length;j++)next[j+1]=Math.min(next[j]+1,previous[j+1]+1,previous[j]+(a[i]===b[j]?0:1));previous=next;}
 return previous[b.length];
}
export function matchesSpokenAnswer(text,entry,competitors=[]){
 const accepted=[...entry.accepted,...(entry.transcriptAlternatives||[])];
 if(matchesAnswer(text,accepted,entry.id))return true;
 const heard=normalizeSpeech(text,entry.id).split(' ').filter(Boolean);
 const targets=accepted.map(a=>normalizeSpeech(a,entry.id)).filter(Boolean);
 for(const target of targets){
  const words=target.split(' '),joined=words.join(''),expected=units(joined);
  // At most one edit per five graphemes, capped at two. Short words stay exact.
  const budget=Math.min(2,Math.floor(expected.length/5));
  for(let count=Math.max(1,words.length-1);count<=words.length+1;count++)for(let start=0;start+count<=heard.length;start++){
   const candidate=heard.slice(start,start+count).join('');
   if(candidate===joined)return true;
   const actual=units(candidate);
   if(!budget||Math.abs(actual.length-expected.length)>budget)continue;
   const delta=distance(actual,expected);if(delta>budget)continue;
   // Don't give a near match priority over an equally good known different word.
   const ambiguous=competitors.some(other=>{
    const folded=normalizeSpeech(other,entry.id).replaceAll(' ','');
    return !targets.some(t=>t.replaceAll(' ','')===folded)&&distance(actual,units(folded))<=delta;
   });
   if(!ambiguous)return true;
  }
 }
 return false;
}

// Partial text is provisional: show its state without awarding a point.
export function spokenVerdict(result,entry,competitors=[]){
 const text=String(result.text||'').trim();
 if(!text)return {accepted:false,label:'Listening…'};
 if(!result.final)return {accepted:false,label:'Hearing…'};
 const accepted=matchesSpokenAnswer(text,entry,competitors);
 return {accepted,label:accepted?'Correct':'Not matched — try again'};
}
