// Compile explicitly authored lexical frames with the frozen conjugation tables.
import fs from 'node:fs';
import {verbForms} from '../lemmas/verb-forms-data.js';
import {tenerGroups} from '../lemmas/tener-prototype.js';
const dir=new URL('../data/spanish-lemmas/tense-examples/',import.meta.url);
const read=n=>fs.readFileSync(new URL(n,dir),'utf8');
const frames=Object.fromEntries(read('frames.txt').split('\n').filter(l=>l&&!l.startsWith('#')).map(l=>{const [w,es,en]=l.split('|');return [w,{es,en}];}));
const words=Object.fromEntries(read('words.txt').split(/[;\n]/).filter(s=>s.trim()).map(s=>s.trim().split('=')));
const irregular={be:['were','been'],go:['went','gone'],make:['made','made'],tell:['told','told'],give:['gave','given'],know:['knew','known'],leave:['left','left'],find:['found','found'],set:['set','set'],think:['thought','thought'],take:['took','taken'],feel:['felt','felt'],come:['came','come'],keep:['kept','kept'],lose:['lost','lost'],begin:['began','begun'],write:['wrote','written'],show:['showed','shown'],understand:['understood','understood'],win:['won','won'],get:['got','gotten'],read:['read','read'],lead:['led','led'],pay:['paid','paid'],eat:['ate','eaten'],bring:['brought','brought'],run:['ran','run'],hear:['heard','heard'],sleep:['slept','slept'],buy:['bought','bought'],build:['built','built'],put:['put','put'],forget:['forgot','forgotten'],grow:['grew','grown'],hold:['held','held'],choose:['chose','chosen'],sell:['sold','sold'],overcome:['overcame','overcome'],throw:['threw','thrown'],send:['sent','sent'],tear:['tore','torn'],wake:['woke','woken'],drive:['drove','driven'],sing:['sang','sung'],teach:['taught','taught'],spread:['spread','spread'],cut:['cut','cut'],catch:['caught','caught'],hide:['hid','hidden'],drink:['drank','drunk'],draw:['drew','drawn'],lend:['lent','lent'],foresee:['foresaw','foreseen'],hang:['hung','hung'],fight:['fought','fought'],fall:['fell','fallen'],arise:['arose','arisen'],mean:['meant','meant'],cost:['cost','cost'],stop:['stopped','stopped'],submit:['submitted','submitted'],prefer:['preferred','preferred'],control:['controlled','controlled'],fit:['fitted','fitted'],emit:['emitted','emitted'],transmit:['transmitted','transmitted']};
function english(phrase,kind,third=false,plural=false){const [v,...rest]=phrase.split(' ');let f=v;if(kind==='past')f=irregular[v]?.[0]||regular(v);if(kind==='participle')f=irregular[v]?.[1]||regular(v);if(kind==='present'&&third&&!plural)f=v==='be'?'is':v==='have'?'has':/[^aeiou]y$/.test(v)?v.slice(0,-1)+'ies':/(s|sh|ch|x|z|o)$/.test(v)?v+'es':v+'s';if(kind==='present'&&v==='be'&&(!third||plural))f='are';if(kind==='past'&&v==='be'&&third&&!plural)f='was';return [f,...rest].join(' ');}
function regular(v){return /[^aeiou]y$/.test(v)?v.slice(0,-1)+'ied':v.endsWith('e')?v+'d':v+'ed';}
const subjects={existir:['Una solución','A solution'],gustar:['La canción le','The song'],ocurrir:['El cambio','The change'],morir:['Las plantas','The plants',true],resultar:['La tarea','The task'],caer:['Las hojas','The leaves',true],suceder:['El cambio','The change'],nacer:['Los niños','The children',true],significar:['El premio','The prize'],funcionar:['El reloj','The clock'],faltar:['Tu nombre','Your name'],depender:['El plan','The plan'],surgir:['Una duda','A doubt'],valer:['El libro','The book'],sonar:['La canción','The song'],costar:['El libro','The book'],consistir:['La prueba','The test'],caber:['El libro','The book'],durar:['La clase','The class'],bastar:['El dinero','The money']};
Object.assign(words,{tarea:'task',reloj:'clock'});
// These senses do not naturally express an everyday instruction. Do not manufacture one.
const uncommonCommands=new Set([...Object.keys(subjects),'poder','deber','saber','parecer','necesitar','requerir','desear','preferir','poseer','pertenecer','merecer']);
const keys=['present','preterite','imperfect','future','conditional','perfect','subjunctive','commands','negative'];
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const output={};
for(const [id,forms]of Object.entries(verbForms)){
 const w=id.split(':')[1];if(w==='tener'){output[id]=Object.fromEntries(tenerGroups.map(g=>[g.id,{text:g.text,translation:g.translation}]));continue;}
 if(['haber','soler'].includes(w))continue;
 const frame=frames[w];if(!frame)throw Error('Missing lexical frame '+w);
 const subj=subjects[w],third=Boolean(subj),plural=Boolean(subj?.[2]),slot=third?(plural?5:2):1;
 let esTail=frame.es,enPhrase=frame.en;
 if(w==='morir'){esTail='por el frío';enPhrase='die from the cold';}
 const enSubject=subj?.[1]||'You',esSubject=subj?subj[0].charAt(0).toLowerCase()+subj[0].slice(1)+' ':'';
 const group={};
 for(const key of keys){
  if(['commands','negative'].includes(key)&&uncommonCommands.has(w)){group[key]={notice:'Commands are not usual for this meaning; no everyday example is given.'};continue;}
  const target=forms[key][['commands','negative'].includes(key)?0:slot][0];
  const tail=esTail?' '+esTail:'',clause=esSubject+target+tail;
  const base=english(enPhrase,'base'),past=english(enPhrase,'past',third,plural),part=english(enPhrase,'participle');
  const texts={present:[cap(clause)+'.',enSubject+' '+english(enPhrase,'present',third,plural)+'.'],preterite:['Ayer '+clause+'.','Yesterday '+enSubject.toLowerCase()+' '+past+'.'],imperfect:['Antes '+clause+'.',enSubject+' used to '+base+'.'],future:['Después '+clause+'.','Later '+enSubject.toLowerCase()+' will '+base+'.'],conditional:['En ese caso, '+clause+'.','In that case, '+enSubject.toLowerCase()+' would '+base+'.'],perfect:[cap(clause)+'.',enSubject+(third&&!plural?' has ':' have ')+part+'.'],subjunctive:['Espero que '+clause+'.','I hope '+enSubject.toLowerCase()+' '+english(enPhrase,'present',third,plural)+'.'],commands:[cap(target+tail)+'.',cap(base)+'.'],negative:[cap(target+tail)+'.','Do not '+base+'.']};
  let [text,translation]=texts[key];
  // Spanish indirect-object construction, not an English subject/object swap.
  if(w==='gustar'){const en={present:'Ana likes the song.',preterite:'Yesterday Ana liked the song.',imperfect:'Ana used to like the song.',future:'Later Ana will like the song.',conditional:'In that case, Ana would like the song.',perfect:'Ana has liked the song.',subjunctive:'I hope Ana likes the song.'};translation=en[key];}
  if(key==='subjunctive'&&['morir','perder','olvidar','sufrir','cometer','matar','preocupar'].includes(w)){
   text='Espero que '+esSubject+'no '+target+tail+'.';
   translation='I hope '+enSubject.toLowerCase()+(third&&!plural?' does not ':' do not ')+base+'.';
  }
  const meanings={...words};
  if(esTail.includes('por la noche'))meanings.por='at (in por la noche)';
  if(['sufrir','morir'].includes(w))meanings.por='because of';
  else if(w==='preguntar')meanings.por='about';
  else if(w==='luchar')meanings.por='for';
  else meanings.por='through';
  if(esTail.includes('a tiempo'))meanings.a='on (in a tiempo: on time)';
  if(['llamar','tratar','ayudar','acompañar','obligar','invitar','sorprender','convencer','casar','acusar'].includes(w))meanings.a='marks the person affected';
  if(['sentar','representar','afectar','informar','matar','reunir','atender','interesar','vestir','cuidar','salvar','despedir','acusar','despertar'].includes(w))meanings.al='a + el; marks the person or thing affected';
  if(w==='gustar'){meanings.a='to (the person who likes it)';meanings.le='to her (Ana)';}
  if(['cambiar','salir'].includes(w))meanings.de='from';
  if(w==='convertir')meanings.en='into';
  if(w==='echar')meanings.en='into';
  if(w==='jugar')meanings.al='a + el (with jugar: play football)';
  if(w==='sonreír')meanings.a='at';
  if(w==='responder')meanings.a='to';
  
  if(w==='ingresar')meanings.cuenta='account';
  if(w==='someter')meanings.a='to';
  if(w==='coincidir')meanings.con='with (agree with)';
  if(['ubicar','basar'].includes(w))meanings.en='on';
  if(w==='viajar')meanings.en='by';
  if(w==='pegar')meanings.en='onto';
  if(w==='interesar')meanings.al='a + el; marks the audience interested';
  if(w==='corresponder')meanings.a='to (reciprocate)';
  if(w==='obligar')meanings.a='marks Ana as the person affected / introduces the required action';
  if(w==='gustar')meanings.le='to her (Ana)';
  if(w==='significar')meanings.para='to';
  if(w==='pretender')meanings.ganar='to win';
  if(w==='llorar')meanings.de='with (cause of crying)';
  if(w==='desaparecer')meanings.de='from';
  if(w==='disfrutar')meanings.del='de + el (with disfrutar: enjoy the trip)';
  if(w==='depender')meanings.del='on the';
  if(w==='escapar')meanings.del='from the';
  if(w==='alejar')meanings.del='away from the';

  if(key==='conditional'&&meanings.en!=='in')meanings.en='in / '+meanings.en+' (according to the phrase)';

  const targetGloss={present:english(enPhrase,'present',third,plural),preterite:past,imperfect:'used to '+base,future:'will '+base,conditional:'would '+base,perfect:'have '+part,subjunctive:english(enPhrase,'present',third,plural)+' (subjunctive)',commands:base+' (command)',negative:base+' (negative command)'}[key];
  // The verb hover explains the whole verb construction, with its complement clearly marked.
  for(const token of target.split(' '))meanings[token.toLocaleLowerCase('es')]=token==='no'?'do not':token==='has'?'you have (auxiliary)':token==='ha'?'has (auxiliary)':token==='han'?'have (auxiliary)':`${targetGloss} (with the following words)`;
  if(w==='gustar')for(const token of target.split(' '))if(!['ha','has','han'].includes(token))meanings[token]=key==='preterite'?'was pleasing to (Ana liked it)':'be pleasing to (Ana likes it)';
  const own={};for(const m of text.matchAll(/[\p{L}]+/gu)){const k=m[0].toLocaleLowerCase('es');if(!meanings[k])throw Error('Missing gloss '+k+' / '+text);own[k]=meanings[k];}
  group[key]={text,translation,target,slot,wordMeanings:own};
 }
 output[id]=group;
}
// Explicit examples for defective and impersonal verbs are kept in an authored file.
const special=JSON.parse(read('special.json'));
for(const [word,groups]of Object.entries(special)){
 const id='corpes:'+word+':V';output[id]??={};
 for(const [key,example]of Object.entries(groups)){
  if(example.notice){output[id][key]=example;continue;}
  const meanings={...words,...example.wordMeanings};const own={};
  for(const m of example.text.matchAll(/[\p{L}]+/gu)){const k=m[0].toLocaleLowerCase('es');if(!meanings[k])throw Error('Missing special gloss '+k);own[k]=meanings[k];}
  output[id][key]={...example,wordMeanings:own};
 }
}
for(const [id,groups]of Object.entries(output))if(keys.some(k=>!groups[k]))throw Error('Missing tense example '+id);
fs.writeFileSync(new URL('../lemmas/tense-examples-data.js',import.meta.url),'// Generated from authored frames and frozen verb forms; see docs/lemma-tense-examples.md.\nexport const tenseExamples = '+JSON.stringify(output,null,2)+';\n');
console.log(Object.keys(output).length+' verb example groups');
