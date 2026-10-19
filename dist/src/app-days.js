import {key} from './engine.js';
export const ANSWER_CAP=108;
export const NEW_CONCEPT_CAP=9;
export const SRS_VERSION=2;

// Preserve legacy records for export; never infer graduation from elapsed-time history.
export function migrateProgress(data,now=Date.now()){
 if(data.srsVersion===SRS_VERSION)return data;
 const legacyHistory=structuredClone(data.history||{});
 const history=Object.fromEntries(Object.entries(legacyHistory).map(([k,h])=>[k,{
  seen:h.seen||0,correct:h.correct||0,stage:0,dueDay:Number.isFinite(h.due)&&h.due<=now?1:5,
 }]));
 return {...data,history,legacyHistory,srsVersion:SRS_VERSION,appDay:1,activeDay:null};
}

export function planDay(bank,settings,history,day,{unitId}={}){
 const reviews=bank.flatMap(item=>settings.languages.flatMap(lang=>{
  const h=history[key(item.id,lang)];
  return h&&h.stage!==2&&Number.isFinite(h.dueDay)&&h.dueDay<=day?[{id:item.id,lang,dueDay:h.dueDay}]:[];
 })).sort((a,b)=>a.dueDay-b.dueDay||a.id.localeCompare(b.id)||a.lang.localeCompare(b.lang));
 const selected=reviews.slice(0,ANSWER_CAP).map(({id,lang})=>({id,lang}));
 const fresh=[];let remaining=ANSWER_CAP-selected.length,concepts=0;
 for(const type of ['noun','verb','grammar','sentence']){
  let count=0;
  for(const item of bank){
   if(count>=settings[type]||concepts>=NEW_CONCEPT_CAP)break;
   if(item.type!==type||(unitId&&item.unitId!==unitId))continue;
   const pairs=settings.languages.filter(lang=>!history[key(item.id,lang)]).map(lang=>({id:item.id,lang}));
   if(!pairs.length||pairs.length>remaining)continue;
   fresh.push(...pairs);remaining-=pairs.length;count++;concepts++;
  }
 }
 return {day,unitId:unitId??null,languages:[...settings.languages],reviews:selected,fresh,overflow:Math.max(0,reviews.length-selected.length),phase:selected.length?'review':'new',state:null};
}

export function applyPhase(history,pairs,first,day,kind){
 const next={...history};
 for(const {id,lang} of pairs){
  const k=key(id,lang),previous=history[k],correct=first[k]===true;
  if(typeof first[k]!=='boolean')throw new Error(`Missing answer for ${k}`);
  if(kind==='new'){
   if(previous)throw new Error(`Already learned: ${k}`);
   next[k]={stage:0,dueDay:day+4,seen:1,correct:Number(correct)};
  }else{
   if(!previous||previous.stage===2||previous.dueDay>day)throw new Error(`Review is not due: ${k}`);
   const stage=correct?previous.stage+1:0;
   next[k]={...previous,stage,dueDay:stage===2?null:day+(stage===1?32:4),seen:(previous.seen||0)+1,correct:(previous.correct||0)+Number(correct)};
  }
 }
 return next;
}
