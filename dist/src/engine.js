export const key=(id,lang)=>`${id}:${lang}`;
export const shuffle=(xs)=>{const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
export function makeLesson(bank,settings,history,now=Date.now()){
 const selected=new Map();
 // Include all overdue language pairs, even when they exceed today's target.
 for(const item of bank)for(const lang of settings.languages){const h=history[key(item.id,lang)];if(h&&h.due<=now)selected.set(item.id,item);}
 for(const type of ['noun','verb','grammar','sentence']){
 const count=settings[type];const due=[...selected.values()].filter(i=>i.type===type).length;
 const fresh=bank.filter(i=>i.type===type&&settings.languages.some(l=>!history[key(i.id,l)]));
 const take=Math.max(0,count-due);for(const item of fresh.slice(0,take))selected.set(item.id,item);
 }
 return [...selected.values()];
}
export function schedule(previous,correct,now=Date.now()){
 const interval=correct?(previous?Math.min(60,Math.max(1,previous.interval)*2):1):1;
 return {interval,due:now+interval*86400000,seen:(previous?.seen||0)+1,correct:(previous?.correct||0)+Number(correct)};
}
export function questions(items,langs){return shuffle(items.flatMap(item=>langs.map(lang=>({item,lang}))));}
