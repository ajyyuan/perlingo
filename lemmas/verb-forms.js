import {verbForms} from './verb-forms-data.js';
import {tenerGroups} from './tener-prototype.js';
export const tenseOrder=['imperfect','preterite','present','future','conditional','perfect','subjunctive','commands','negative'];
export const tenseLabels={present:'Present',preterite:'Past',imperfect:'Past · ongoing',future:'Future',conditional:'Conditional',perfect:'Perfect',subjunctive:'Subjunctive',commands:'Do',negative:'Don’t'};
const titles={present:'Present',preterite:'Past · completed',imperfect:'Past · ongoing / habitual',future:'Future',conditional:'Conditional',perfect:'Present perfect',subjunctive:'Present subjunctive',commands:'Commands · do',negative:'Commands · don’t'};
const cues={present:'Now, habits or general facts.',preterite:'A past event viewed as a finished whole.',imperfect:'Past background, ongoing situations or habits.',future:'What will happen; also used for predictions or conjectures.',conditional:'What would happen under a condition.',perfect:'Haber + past participle · “have done.” Use versus the simple past varies by region.',subjunctive:'A mood used for wishes, doubt and other dependent clauses.',commands:'Ask or tell someone to do something.',negative:'Tell someone not to do something; uses subjunctive forms.'};
const labels=['I','you · informal','he / she / formal you','we','you · plural, Spain','they / you · plural'];
const subjects=['yo','tú','él / ella / usted','nosotros / nosotras','vosotros / vosotras','ellos / ellas / ustedes'];
const commandLabels=['you · informal','you · formal','you · plural, Spain','you · plural'];
const commandSubjects=['tú','usted','vosotros / vosotras','ustedes'];
const restricted=new Set(['ocurrir','suceder','consistir']);
export function formGroups(note){
 const data=verbForms[note.id];if(!data)return [];
 return tenseOrder.map(id=>{
  const command=['commands','negative'].includes(id);
  let rows=data[id].map((alternatives,i)=>({lemma:alternatives[0],alternatives,label:(command?commandLabels:labels)[i],sourceLabel:(command?commandSubjects:subjects)[i]}));
  let cue=cues[id],notice='';
  if(restricted.has(note.word)){
   if(command){rows=[];notice='Not used as a command for the meaning taught on this card.';}
   else{rows=[rows[2],rows[5]].map((r,i)=>({...r,label:i?'plural subject':'singular subject',sourceLabel:i?'ellos / ellas':'él / ella'}));cue+=' Third-person forms for the meaning taught here.';}
  }
  if(note.word==='haber'){
   if(command){rows=[];notice='Haber is not used in ordinary modern commands. Use tener for possession.';}
   else if(id==='perfect'){rows=[{...rows[2],label:'there has / have been',sourceLabel:'impersonal'}];cue='Ha habido · “there has/have been,” always singular.';}
   else{
    if(id==='present'){rows[2]={...rows[2],lemma:'ha',alternatives:['ha']};rows.push({lemma:'hay',alternatives:['hay'],label:'there is / are',sourceLabel:'impersonal'});}
    const impersonal={present:'hay',preterite:'hubo',imperfect:'había',future:'habrá',conditional:'habría',subjunctive:'haya'}[id];
    cue=`Auxiliary forms. For “there is/are,” use only ${impersonal}, even with plural things.`;
    if(id==='preterite')cue+=' Hube, hubiste, etc. are mainly literary as auxiliaries.';
   }
  }
  if(note.word==='describir'&&id==='perfect')cue+=' Descripto is a Río de la Plata variant.';
  // Keep the nine previously checked examples; other verbs retain their authored Uses examples.
  const example=note.word==='tener'?tenerGroups.find(g=>g.id===id):null;
  return {id,title:titles[id],cue,notice,rows,...(example?{cue:example.cue,text:example.text,translation:example.translation}:{})};
 });
}
export function formGroup(note,id='present'){const groups=formGroups(note);return groups.find(g=>g.id===id)||groups.find(g=>g.id==='present')||null;}

export function referenceForms(note){return [...formGroups(note).flatMap(g=>g.rows.flatMap(r=>(r.alternatives||[r.lemma]).map(f=>[r.sourceLabel,f]))),...(verbForms[note.id]?.participle||[]).map(f=>["past participle",f])];}
