import {defaultLanguageIds} from './language-pools.js';
// Explicit local-preview calendar. Never silently recycle words on unscheduled dates.
const rules=Object.freeze({study:120,recall:60,window:5,script:'All scripts',mode:'voice',provider:'elevenlabs',languageIds:defaultLanguageIds});
export const calendar=Object.freeze([
 // Seeded demo history for archive testing, not prior public challenges.
 Object.freeze({date:'2026-10-19',pack:'moon',demo:true,rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-20',pack:'tree',demo:true,rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-21',pack:'bread',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-22',pack:'water',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-23',pack:'sun',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-24',pack:'star',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-25',pack:'apple',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-26',pack:'cat',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-27',pack:'dog',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-28',pack:'house',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-29',pack:'book',rulesVersion:4,rules}),
 Object.freeze({date:'2026-10-30',pack:'milk',rulesVersion:4,rules}),
]);
export const challengeTimeZone='America/New_York';
const dateFormatter=new Intl.DateTimeFormat('en-US',{timeZone:challengeTimeZone,year:'numeric',month:'2-digit',day:'2-digit'});
export function todayET(now=new Date()){const parts=Object.fromEntries(dateFormatter.formatToParts(now).map(p=>[p.type,p.value]));return `${parts.year}-${parts.month}-${parts.day}`;}
export function challengeFor(date,today=todayET()){return date<=today?calendar.find(c=>c.date===date)||null:null;}
export function archiveDays(today=todayET()){return calendar.filter(c=>c.date<today).slice().reverse();}
export function challengeSettings(preferences,challenge,languages){
 if(!challenge)throw Error('No scheduled challenge.');
 const languageIds=challenge.rules.languageIds?[...challenge.rules.languageIds]:languages.map(l=>l.id);
 return {...preferences,...challenge.rules,pack:challenge.pack,count:languageIds.length,languageIds};
}
export function challengeRandom(date){let seed=Number(date.replaceAll('-',''));return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}

export const attemptStorageKey='pc-dated-attempts-v1';
export function datedAttempts(storage,history=[]){
 const attempts=JSON.parse(storage.getItem(attemptStorageKey)||'{}');
 if(!attempts||Array.isArray(attempts)||typeof attempts!=='object')throw Error('Invalid attempt storage');
 for(const h of history)if(h.challengeDate&&h.playMode!=='unlimited'&&!attempts[h.challengeDate])attempts[h.challengeDate]={startedAt:h.date,completedAt:h.date,score:h.score,total:h.total,record:h};
 return attempts;
}
export async function claimDatedAttempt(date,{storage,locks,history=[],now=new Date()}){
 if(!locks)throw Error('This browser cannot safely save a daily attempt. Try Unlimited.');
 return locks.request('perlingo-dated-attempts',()=>{const attempts=datedAttempts(storage,history);if(attempts[date])return false;attempts[date]={startedAt:now.toISOString()};storage.setItem(attemptStorageKey,JSON.stringify(attempts));return true;});
}
export async function completeDatedAttempt(date,record,{storage,locks,completed=true}){
 return locks.request('perlingo-dated-attempts',()=>{const attempts=datedAttempts(storage);if(!attempts[date])throw Error('Missing dated attempt');attempts[date]={...attempts[date],...(completed?{completedAt:record.date}:{}),score:record.score,total:record.total,record};storage.setItem(attemptStorageKey,JSON.stringify(attempts));});
}
