// Prototype-only reference groups. Source comparisons: docs/lemma-forms-prototype.md.
const people=['I','you · informal','he / she / formal you','we','you · plural, Spain','they / you · plural'];
const subjects=['yo','tú','él / ella / usted','nosotros / nosotras','vosotros / vosotras','ellos / ellas / ustedes'];
const commandPeople=['you · informal','you · formal','you · plural, Spain','you · plural'];
const commandSubjects=['tú','usted','vosotros / vosotras','ustedes'];
const group=(id,title,forms,cue,text,translation,commands=false)=>({id,title,cue,text,translation,rows:forms.map((lemma,i)=>({lemma,label:(commands?commandPeople:people)[i],sourceLabel:(commands?commandSubjects:subjects)[i]}))});
export const tenerGroups=[
 group('present','Present',['tengo','tienes','tiene','tenemos','tenéis','tienen'],'What you have now, or generally.','Tengo una pregunta.','I have a question.'),
 group('preterite','Past · completed',['tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron'],'Preterite · a past situation viewed as a finished whole.','Ayer tuve una reunión.','Yesterday I had a meeting.'),
 group('imperfect','Past · ongoing / habitual',['tenía','tenías','tenía','teníamos','teníais','tenían'],'Imperfect · past background or habits, without focusing on an endpoint.','De niño, tenía un perro.','As a child, I had a dog.'),
 group('future','Future',['tendré','tendrás','tendrá','tendremos','tendréis','tendrán'],'What you will have.','Mañana tendré más tiempo.','Tomorrow I will have more time.'),
 group('conditional','Conditional',['tendría','tendrías','tendría','tendríamos','tendríais','tendrían'],'What you would have under a condition.','Con menos trabajo, tendría más tiempo.','With less work, I would have more time.'),
 group('perfect','Present perfect',['he tenido','has tenido','ha tenido','hemos tenido','habéis tenido','han tenido'],'Haber + tenido · “have had.” Use versus the simple past varies by region.','He tenido mucha suerte.','I have been very lucky.'),
 group('subjunctive','Present subjunctive',['tenga','tengas','tenga','tengamos','tengáis','tengan'],'Used after expressions such as “I hope…”; this is a mood, not another past tense.','Espero que tengas tiempo.','I hope you have time.'),
 group('commands','Commands · do',['ten','tenga','tened','tengan'],'Ask or tell someone to do something.','Ten cuidado.','Be careful.',true),
 group('negative','Commands · don’t',['no tengas','no tenga','no tengáis','no tengan'],'Negative commands use subjunctive forms.','No tengas miedo.','Don’t be afraid.',true)
];
export function formGroup(lesson,id='present'){
 if(lesson.id!=='corpes:tener:V')return null;
 return tenerGroups.find(g=>g.id===id)||tenerGroups[0];
}
