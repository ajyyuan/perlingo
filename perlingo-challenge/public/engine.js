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
 constructor(ids,{seconds=60,windowSeconds=3,random=Math.random}={}){
  this.queue=shuffle([...new Set(ids)],random);this.initial=[...this.queue];this.remaining=seconds*1000;this.windowMs=windowSeconds*1000;this.correct=[];this.attempts=[];this.serial=0;this.active=null;
 }
 begin(now){if(this.active)throw Error('Card already active');if(this.done)return null;this.active={id:this.queue[0],token:++this.serial,start:now,duration:Math.min(this.windowMs,this.remaining)};return this.active;}
 finish(token,outcome,now,transcript=''){
  const card=this.active;if(!card||card.token!==token)return false;
  if(!['correct','pass','timeout'].includes(outcome))throw Error('Unknown outcome');
  const elapsed=Math.max(0,Math.min(now-card.start,card.duration));
  this.remaining=Math.max(0,this.remaining-elapsed);this.queue.shift();
  if(outcome==='correct')this.correct.push(card.id);else this.queue.push(card.id);
  this.attempts.push({id:card.id,outcome,elapsed:Math.round(elapsed),transcript});this.active=null;return true;
 }
 // Technical interruptions consume no game time and never become wrong answers.
 cancel(){this.active=null;}
 get done(){return this.remaining<=0||!this.queue.length;}
}

// Explicit speech-only transcript formatting; typed spelling stays unchanged.
export function matchesSpokenAnswer(text,entry){return matchesAnswer(text,[...entry.accepted,...(entry.transcriptAlternatives||[])],entry.id);}
