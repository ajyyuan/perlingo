// Expand reviewed frames into examples for every displayed verb row.
import fs from 'node:fs';
import {buildExamples,balancedPeople} from './build-lemma-tense-examples.mjs';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {tenseExamples} from '../lemmas/tense-examples-data.js';
const people=['yo','tú','ella','nosotros','vosotros','ellos'];
const english=['I','You','She','We','You','They'];
const pluralSubjects={existir:['Las soluciones','The solutions'],gustar:['Las canciones le','The songs'],ocurrir:['Los cambios','The changes'],morir:['Las plantas','The plants'],resultar:['Las tareas','The tasks'],caer:['Las hojas','The leaves'],suceder:['Los cambios','The changes'],nacer:['Los niños','The children'],significar:['Los premios','The prizes'],funcionar:['Los relojes','The clocks'],faltar:['Los nombres','The names'],depender:['Los planes','The plans'],surgir:['Las dudas','The doubts'],valer:['Los libros','The books'],sonar:['Las canciones','The songs'],costar:['Los libros','The books'],consistir:['Las pruebas','The tests'],caber:['Los libros','The books'],durar:['Las clases','The classes'],bastar:['Los fondos','The funds']};
const singularSubjects={morir:['La planta','The plant'],caer:['La hoja','The leaf'],nacer:['El niño','The child']};
const personalFrames={morir:['de risa','die laughing'],existir:['','exist'],gustar:['a Ana','be pleasing to Ana'],resultar:['útil','turn out to be useful'],caer:['al suelo','fall to the ground'],significar:['mucho para Ana','mean a lot to Ana'],funcionar:['mejor por la mañana','work better in the morning'],faltar:['a clase','miss class'],depender:['de Ana','depend on Ana'],surgir:['de la oscuridad','emerge from the darkness'],valer:['mucho','be worth a lot'],sonar:['diferente por teléfono','sound different on the phone'],caber:['en el coche','fit in the car']};
const restricted=new Set(['ocurrir','suceder','consistir','costar','durar','bastar']);
const lex={risa:'laughter',soluciones:'solutions',canciones:'songs',cambios:'changes',tareas:'tasks',planta:'plant',hoja:'leaf',premios:'prizes',relojes:'clocks',nombres:'names',planes:'plans',dudas:'doubts',libros:'books',pruebas:'tests',clases:'classes',fondos:'funds',fáciles:'easy',útil:'useful',útiles:'useful',mejor:'better',mañana:'morning',oscuridad:'darkness',diferente:'different',teléfono:'phone',vuestro:'your (plural, Spain)',vuestra:'your (plural, Spain)',su:'your (formal / plural)',solos:'alone',crueles:'cruel',vosotros:'you (plural, Spain)',ella:'she',ellos:'they',nosotros:'we',yo:'I',tú:'you (informal singular)'};
const banks=people.map((person,slot)=>{
 const assigned=Object.fromEntries([...Object.keys(balancedPeople),...Object.keys(pluralSubjects),'tener'].map(w=>[w,person]));
 const subjects={},frames={tener:{es:'tiempo',en:'have time'}},gloss={};
 for(const word of Object.keys(pluralSubjects)){
  if(slot===5)subjects[word]=[...pluralSubjects[word],true];
  else if(slot===2&&singularSubjects[word])subjects[word]=singularSubjects[word];
  else if(![2,5].includes(slot)&&!restricted.has(word)){
   subjects[word]=null;
   if(personalFrames[word])frames[word]={es:personalFrames[word][0],en:personalFrames[word][1]};
   if(word==='gustar')delete subjects[word];
  }
  gloss[word]={...lex};
 }
 if(slot===5)frames.resultar={es:'fáciles',en:'turn out to be easy'};
 if(slot===3||slot===4)frames.resultar={es:'útiles',en:'turn out to be useful'};
 for(const w of ['depender','surgir'])if(![2,5].includes(slot))gloss[w].de=w==='depender'?'on':'from';
 if(![2,5].includes(slot)){gloss.morir.de='of (morir de risa: die laughing)';gloss.funcionar.por='in (por la mañana)';gloss.sonar.por='on (por teléfono)';gloss.faltar.a='in faltar a clase: miss class';}
 return buildExamples({people:assigned,subjectOverrides:subjects,frameOverrides:frames,glossOverrides:gloss,specialOverrides:{tener:{subjunctive:null}}});
});
function glossed(e){
 const meanings={...lex,...e.wordMeanings};
 for(const token of e.text.match(/[\p{L}]+/gu)||[])if(!meanings[token.toLowerCase()])throw Error('Missing row gloss '+token+' '+e.text);
 return {...e,wordMeanings:Object.fromEntries((e.text.match(/[\p{L}]+/gu)||[]).map(t=>[t.toLowerCase(),meanings[t.toLowerCase()]]))};
}
function replaceTarget(e,target){
 const text=e.text.replace(new RegExp(e.target.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'),match=>match[0]===match[0].toUpperCase()?target[0].toUpperCase()+target.slice(1):target);
 const meaning=e.wordMeanings[e.target.split(' ').at(-1)];
 return glossed({...e,text,target,wordMeanings:{...e.wordMeanings,...Object.fromEntries(target.split(' ').map(t=>[t,t==='no'?'do not':e.wordMeanings[t]||meaning]))}});
}
const result={};
for(const [id,forms]of Object.entries(verbForms)){
 const word=id.split(':')[1];result[id]={};
 for(const key of Object.keys(tenseExamples[id])){
  const command=['commands','negative'].includes(key);result[id][key]={};
  for(let slot=0;slot<forms[key].length;slot++){
   let e;
   if(command){
    const source=tenseExamples[id][key];
    if(source.notice)e={notice:source.notice};
    else{
     e={...source,target:source.target||forms[key][0][0],wordMeanings:source.wordMeanings||{ten:'have (command)',cuidado:'care',no:'do not',tengas:'have (negative command)',miedo:'fear'}};
     e=replaceTarget(e,forms[key][slot][0]);
     if(word==='querer'&&key==='commands'&&slot!==0)e={...e,text:e.text.replace('tu familia',slot===2?'vuestra familia':'su familia'),wordMeanings:{...e.wordMeanings,...lex}};
     if(word==='ser'&&slot>=2){e={...e,text:e.text.replace('amable','amables').replace('cruel','crueles'),wordMeanings:{...e.wordMeanings,amables:'kind',crueles:'cruel'}};}
     if(word==='saber'){
      const be=['estás','está','estáis','están'][slot];e={...e,text:e.text.replace('estás',be).replace(/solo\./,slot>=2?'solos.':'solo.'),wordMeanings:{...e.wordMeanings,[be]:'you are',solos:'alone'}};
     }
     e=glossed({...e,slot});
    }
   }else if(word==='haber'){
    if(key==='perfect'){e=slot===2?tenseExamples[id].perfect:{notice:'For existential haber, use ha habido regardless of the number of things.'};}
    else{
     const p=people[slot],en=english[slot],target=forms[key][slot][0];
     const endings={present:(slot===2?'has':'have'),imperfect:'had',future:'will have',conditional:'would have',subjunctive:(slot===2?'has':'have'),preterite:'had'};
     let text=`${p[0].toUpperCase()+p.slice(1)} ${target} terminado.`,translation=`${en} ${endings[key]} finished.`;
     if(key==='subjunctive'){text=`Es posible que ${p} ${target} terminado.`;translation=`It is possible that ${en==='I'?'I':en.toLowerCase()} ${endings[key]} finished.`;}
     if(key==='preterite'){const left=['salí','saliste','salió','salimos','salisteis','salieron'][slot];text=`Cuando ${p} ${target} terminado, ${left}.`;translation=`When ${en==='I'?'I':en.toLowerCase()} had finished, ${en==='I'?'I':en.toLowerCase()} left.`;}
     e=glossed({text,translation,target,slot,wordMeanings:{...lex,[target]:endings[key]+' (auxiliary)',terminado:'finished',es:'it is',posible:'possible',que:'that',cuando:'when',salí:'I left',saliste:'you left',salió:'she left',salimos:'we left',salisteis:'you all left',salieron:'they left'}});
    }
   }else if(word==='soler'){
    const source=tenseExamples[id][key];
    if(source.notice)e={notice:source.notice};
    else{
     const p=people[slot],en=english[slot],target=forms[key][slot][0];
     let text=`${p[0].toUpperCase()+p.slice(1)} ${target} leer por la noche.`;
     let translation=key==='imperfect'?`${en} used to read at night.`:key==='perfect'?`${en} ${slot===2?'has':'have'} usually read at night.`:`${en} usually ${slot===2?'reads':'read'} at night.`;
     if(key==='subjunctive'){text=`Me alegra que ${p} ${target} leer.`;translation=`I am glad ${en==='I'?'I':en.toLowerCase()} usually ${slot===2?'reads':'read'}.`;}
     e=glossed({text,translation,target,slot,wordMeanings:{...source.wordMeanings,...lex,leer:'to read',por:'at (por la noche)',la:'the',noche:'night',me:'me',alegra:'makes glad',que:'that',...Object.fromEntries(target.split(' ').map(t=>[t,t==='solido'?'usually done (uncommon compound form)':key==='perfect'?(slot===2?'has (auxiliary)':'have (auxiliary)'):'usually do / used to (with infinitive)']))}});
    }
   }else if(word==='nacer'&&![2,5].includes(slot)&&!['preterite','perfect'].includes(key)){
    e={notice:'For a living speaker, literal birth is normally described in a past tense. Choose Past for a natural example with this person.'};
   }else if(restricted.has(word)&&![2,5].includes(slot)){
    e={notice:'This meaning uses a thing or event as its subject. Choose a singular or plural third-person row for an example.'};
   }else{
    e=banks[slot][id][key];
    // Gustar agrees with its subject, while Ana is the person experiencing liking.
    if(word==='gustar'){
     const objects=['me','you','the song','us','you all','the songs'];
     const t={present:`Ana likes ${objects[slot]}.`,preterite:`Yesterday Ana liked ${objects[slot]}.`,imperfect:`Ana used to like ${objects[slot]}.`,future:`Later Ana will like ${objects[slot]}.`,conditional:`In that case, Ana would like ${objects[slot]}.`,perfect:`Ana has liked ${objects[slot]}.`,subjunctive:`I hope Ana likes ${objects[slot]}.`};
     e={...e,translation:t[key]};
     if(![2,5].includes(slot)){
      const p=people[slot],target=forms[key][slot][0],clause=`${p} le ${target} a Ana`;
      const prefixes={present:'',preterite:'Ayer ',imperfect:'Antes ',future:'Después ',conditional:'En ese caso, ',perfect:'',subjunctive:'Espero que '};
      const raw=(key==='subjunctive'&&slot===0?'Es posible que ':prefixes[key])+clause+'.';
      if(key==='subjunctive'&&slot===0)t[key]='It is possible that Ana likes me.';
      e={text:raw[0].toUpperCase()+raw.slice(1),translation:t[key],target,slot,wordMeanings:{...e.wordMeanings,...lex,le:'to her (Ana)',a:'to',ana:'Ana',es:'it is',posible:'possible',que:'that',...Object.fromEntries(target.split(' ').map(t=>[t,['he','has','hemos','habéis'].includes(t)?'have (auxiliary)':'be pleasing to (Ana likes the subject)']))}};
     }
    }
   }
   if(e.text)e=glossed({...e,slot});
   result[id][key][slot]=forms[key][slot].filter(t=>!(word==='haber'&&t==='hay')).map(t=>e.text?replaceTarget(e,t):e);
  }
  if(word==='haber'&&!command&&key!=='perfect')result[id][key][6]=[tenseExamples[id][key]];
 }
}
fs.writeFileSync(new URL('../lemmas/row-examples-data.js',import.meta.url),'// Generated row examples; see docs/lemma-row-examples.md.\nexport const rowExamples = '+JSON.stringify(result)+';\n');
console.log(Object.keys(result).length+' verbs expanded into row examples');
