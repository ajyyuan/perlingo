// Explicit local-preview calendar. Never silently recycle words on unscheduled dates.
const rulesV1=Object.freeze({study:120,recall:60,window:3,script:'All scripts',mode:'voice',provider:'elevenlabs'});
export const calendar=Object.freeze([
 // Seeded demo history for archive testing, not prior public challenges.
 Object.freeze({date:'2026-10-19',pack:'moon',demo:true,rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-20',pack:'tree',demo:true,rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-21',pack:'bread',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-22',pack:'water',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-23',pack:'sun',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-24',pack:'star',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-25',pack:'apple',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-26',pack:'cat',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-27',pack:'dog',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-28',pack:'house',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-29',pack:'book',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-30',pack:'milk',rulesVersion:1,rules:rulesV1}),
]);
export const challengeTimeZone='America/New_York';
const dateFormatter=new Intl.DateTimeFormat('en-US',{timeZone:challengeTimeZone,year:'numeric',month:'2-digit',day:'2-digit'});
export function todayET(now=new Date()){const parts=Object.fromEntries(dateFormatter.formatToParts(now).map(p=>[p.type,p.value]));return `${parts.year}-${parts.month}-${parts.day}`;}
export function challengeFor(date,today=todayET()){return date<=today?calendar.find(c=>c.date===date)||null:null;}
export function archiveDays(today=todayET()){return calendar.filter(c=>c.date<today).slice().reverse();}
export function challengeSettings(preferences,challenge,languages){
 if(!challenge)throw Error('No scheduled challenge.');
 return {...preferences,...challenge.rules,pack:challenge.pack,count:languages.length,languageIds:languages.map(l=>l.id)};
}
export function challengeRandom(date){let seed=Number(date.replaceAll('-',''));return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
