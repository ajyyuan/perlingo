// Explicit local-preview calendar. Never silently recycle words on unscheduled dates.
const rulesV1=Object.freeze({study:120,recall:60,window:3,script:'All scripts',mode:'voice',provider:'elevenlabs'});
export const calendar=Object.freeze([
 Object.freeze({date:'2026-10-21',pack:'bread',rulesVersion:1,rules:rulesV1}),
 Object.freeze({date:'2026-10-22',pack:'water',rulesVersion:1,rules:rulesV1}),
]);
export const todayUTC=(now=new Date())=>now.toISOString().slice(0,10);
export function challengeFor(date,today=todayUTC()){return date<=today?calendar.find(c=>c.date===date)||null:null;}
export function archiveDays(today=todayUTC()){return calendar.filter(c=>c.date<today).slice().reverse();}
export function challengeSettings(preferences,challenge,languages){
 if(!challenge)throw Error('No scheduled challenge.');
 return {...preferences,...challenge.rules,pack:challenge.pack,count:languages.length,languageIds:languages.map(l=>l.id)};
}
export function challengeRandom(date){let seed=Number(date.replaceAll('-',''));return ()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
