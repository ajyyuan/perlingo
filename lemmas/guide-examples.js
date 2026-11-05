// Explicit construction templates over the reviewed row bank. No runtime AI or
// guessed conjugations. See docs/lemma-guide-examples.md for sources and limits.
import {rowExamples} from './row-examples-data.js';
const lower=s=>/^(?:I|Ana)(?: |$)/.test(s)?s:s.charAt(0).toLowerCase()+s.slice(1);
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const people=['yo','tú','ella','nosotros','vosotros','ellos'];
const enPeople=['I','you','she','we','you','they'];
const labels=['yo','tú','él / ella / usted','nosotros / nosotras','vosotros / vosotras','ellos / ellas / ustedes'];
const lex={cuando:'when',llegó:'arrived',ana:'Ana',ya:'already',para:'by (para entonces)',entonces:'then',en:'in',otras:'other',circunstancias:'circumstances',es:'it is',era:'it was',posible:'possible',que:'that',si:'if',deberá:'must (deberá constar: must be recorded)',constar:'be recorded',el:'the',informe:'report',una:'a / one',vez:'time (una vez que: once)',todo:'everything',cambió:'changed',aun:'even (concessive)',sigo:'I continue (sigo teniendo: I still have)',teniendo:'having',dudas:'doubts',sigue:'continues (sigue siendo: is still)',siendo:'being',importante:'important',después:'after',de:'of / after (después de)',necesité:'I needed',ayuda:'help',puede:'can',no:'not',haber:'to have (perfect auxiliary)',habiendo:'having (perfect auxiliary)',ha:'has (perfect auxiliary)',he:'I have (perfect auxiliary)',había:'had (perfect auxiliary)',habrá:'will have (perfect auxiliary)',habría:'would have (perfect auxiliary)',haya:'have / has (perfect subjunctive auxiliary)',hubiera:'had (past perfect subjunctive auxiliary)',hubiese:'had (past perfect subjunctive auxiliary)',hubiere:'have / has (future perfect subjunctive auxiliary)',hubo:'had (preterite anterior auxiliary)',solución:'solution',habido:'been / existed (participle of impersonal haber)',yo:'I',tú:'you (informal singular)',ella:'she',nosotros:'we',vosotros:'you (plural, Spain)',ellos:'they',terminado:'finished',leer:'to read',por:'at (por la noche)',la:'the',noche:'night',está:'is',naciendo:'being born',nueva:'new',idea:'idea',solido:'usually done (rare participle of soler)'};
function auxiliaryGloss(word){
 if(word==='haber')return 'to have (perfect auxiliary)';
 if(word==='habiendo')return 'having (perfect auxiliary)';
 if(/^habr[áé]/.test(word)||['habremos','habrás','habrán'].includes(word))return 'will have (future perfect auxiliary)';
 if(word.startsWith('habría'))return 'would have (conditional perfect auxiliary)';
 if(word.startsWith('había'))return 'had (past perfect auxiliary)';
 if(word.startsWith('haya')||word==='hayáis')return 'have / has (present perfect subjunctive auxiliary)';
 if(word.normalize('NFD').replace(/[\u0300-\u036f]/g,'').startsWith('hubie'))return /^hubier(?:e|es|emos|eis|en)$/.test(word.normalize('NFD').replace(/[\u0300-\u036f]/g,''))?'have / has (future perfect subjunctive auxiliary)':'had (past perfect subjunctive auxiliary)';
 return 'had (preterite anterior auxiliary)';
}
function finish(source,text,translation,target,meaning,extra={},register=''){
 const meanings={...source?.wordMeanings,...lex,...extra};
 // Preserve contextual lexical/prepositional meanings from the source sentence.
 for(const [k,v]of Object.entries(source?.wordMeanings||{}))if(!['es','era','que','cuando','ya','si'].includes(k))meanings[k]=v;
 const tokens=target.split(' ');
 const partMeaning=meaning.replace(/^(?:would have|will have|have|has|had|having) /,'');
 for(const [i,token] of tokens.entries())meanings[token.toLowerCase()]=tokens.length===1?meaning:i===tokens.length-1?partMeaning+' (with its complement)':token==='no'?'not':auxiliaryGloss(token);

 Object.assign(meanings,extra);
 const own={};for(const token of text.match(/[\p{L}]+/gu)||[]){const key=token.toLowerCase();if(!meanings[key])throw Error('Missing guide gloss: '+key+' in '+text);own[key]=meanings[key];}
 return {text,translation,target,wordMeanings:own,chunks:[{text:text.slice(text.toLowerCase().indexOf(target.toLowerCase()),text.toLowerCase().indexOf(target.toLowerCase())+target.length),meaning}],...(register?{register}:{})};
}
function splitPerfect(e){
 const at=e.text.toLowerCase().indexOf(e.target.toLowerCase());
 const en=e.translation.match(/^(.*?) (has|have) (.*)\.$/);
 if(at<0||!en)throw Error('Unsupported perfect frame: '+e.text);
 return {before:lower(e.text.slice(0,at)),tail:e.text.slice(at+e.target.length,-1),subject:en[1],aux:en[2],part:en[3]};
}
function futureBase(bank,slot,word){
 const e=bank.future[slot]?.[0];
 if(e?.text){const m=e.translation.match(/^(?:Later )?(.*?) will (.*)\.$/);if(m)return {subject:cap(m[1]),base:m[2]};}
 if(word==='nacer')return {subject:cap(enPeople[slot]),base:'be born in this city'};
 return null;
}
const notices={personal:'This meaning takes a thing or event as its subject. Choose a third-person row for a sentence.',solerGerund:'Soliendo is a rare gerund. For everyday habits, use suelo or solía with an infinitive; it is not a routine progressive form.'};
export function guideExample(note,lesson,rowIndex=0,alternative=0){
 const bank=rowExamples[note.id],row=lesson.rows[rowIndex];
 if(!row)return {notice:lesson.notice||'This tense is not used for the taught meaning.'};
 const target=row.alternatives[alternative];if(!target||!bank)throw Error('Missing guide example input');
 const kind=lesson.id,slot=row.slot??labels.indexOf(row.sourceLabel);
 if(kind==='nonfinite')return nonfinite(note,row.sourceLabel,target,bank);
 if(bank[kind]&&row.slot!==undefined){const old=bank[kind][row.slot]?.[alternative];if(!old)throw Error('Missing existing example');return old;}
 if(['commands','negative'].includes(kind))return weCommand(note,kind,target,bank);
 // Auxiliary haber needs a following participle; existential haber stays singular.
 if(note.word==='haber'&&['pastSubjunctive','futureSubjunctive'].includes(kind)){
  const impersonal=row.sourceLabel==='impersonal',past=kind==='pastSubjunctive';
  const clause=impersonal?target+' una solución':people[slot]+' '+target+' terminado';
  const en=impersonal?(past?'there was a solution':'there should be a solution'):(enPeople[slot]+(past?' had finished':' should have finished'));
  return finish(null,(past?'Era posible que ':'Si ')+clause+(past?'.':', deberá constar en el informe.'),(past?'It was possible that ':'If ')+en+(past?'.':', this must be recorded in the report.'),target,impersonal?'there be / exist':(past?'had (auxiliary)':'have (auxiliary)'),{},past?'':'Literary / legal');
 }
 if(note.word==='soler'&&kind==='pastSubjunctive')return finish(bank.imperfect[slot][0],`Era posible que ${people[slot]} ${target} leer por la noche.`,`It was possible that ${enPeople[slot]} usually read at night.`,target,'usually did (with the following infinitive)');
 const baseSlot=row.sourceLabel==='impersonal'?2:slot;
 const source=bank.perfect[baseSlot]?.[0];
 if(!source)throw Error('Missing perfect source '+note.id+' '+baseSlot);
 if(source.notice)return {notice:source.notice};
 const p=splitPerfect(source),clause=p.before+target+p.tail,perfect=p.subject+' '+p.aux+' '+p.part;
 const past=lower(p.subject)+' had '+p.part;
 const glossPart=note.word==='gustar'?'been liked by Ana':p.part;
 const perfectGloss=(baseSlot===2?'has ':'have ')+glossPart;
 if(kind==='pastPerfect')return finish(source,'Cuando llegó Ana, '+p.before+'ya '+target+p.tail+'.','When Ana arrived, '+lower(p.subject)+' had already '+p.part+'.',target,'had '+glossPart);
 if(kind==='futurePerfect')return finish(source,'Para entonces, '+clause+'.','By then, '+lower(p.subject)+' will have '+p.part+'.',target,'will have '+glossPart, {para:'by (the reference time)'});
 if(kind==='conditionalPerfect')return finish(source,'En otras circunstancias, '+clause+'.','Under different circumstances, '+lower(p.subject)+' would have '+p.part+'.',target,'would have '+glossPart,{en:'in (en otras circunstancias)'});
 if(kind==='perfectSubjunctive')return finish(source,'Es posible que '+clause+'.','It is possible that '+lower(perfect)+'.',target,perfectGloss);
 if(kind==='pluperfectSubjunctive')return finish(source,'Era posible que '+clause+'.','It was possible that '+past+'.',target,'had '+glossPart);
 if(kind==='pastAnterior')return finish(source,'Una vez que '+clause+', todo cambió.','Once '+past+', everything changed.',target,'had '+glossPart,{},'Literary');
 if(kind==='futurePerfectSubjunctive')return finish(source,'Si '+clause+', deberá constar en el informe.','If '+lower(perfect)+', this must be recorded in the report.',target,perfectGloss,{},'Literary / legal');
 const future=futureBase(bank,baseSlot,note.word);if(!future)throw Error('Missing future frame '+note.id);
 const glossBase=note.word==='gustar'?'be liked by Ana':future.base;
 if(kind==='pastSubjunctive')return finish(source,'Era posible que '+clause+'.','It was possible that '+lower(future.subject)+' would '+future.base+'.',target,'would '+glossBase+' (possible subsequent event)');
 if(kind==='futureSubjunctive')return finish(source,'Si '+clause+', deberá constar en el informe.','If '+lower(future.subject)+' should '+future.base+', this must be recorded in the report.',target,glossBase+' (hypothetical condition)',{},'Literary / legal');
 throw Error('Uncovered guide lesson '+kind);
}
function weCommand(note,kind,target,bank){
 if(bank[kind][0][0].notice)return bank[kind][0][0];
 const source=bank.perfect[3][0];if(source.notice)return source;
 const p=splitPerfect(source),future=futureBase(bank,3,note.word);
 let tail=p.tail,base=future.base;
 // Commands with their own reviewed sense retain that sense for nosotros.
 if(note.word==='querer'){tail=' a nuestra familia';base='love our family';}
 if(note.word==='saber'){tail=' que no estamos solos';base='know that we are not alone';}
 return finish(source,cap(target)+tail+'.',"Let's "+(kind==='negative'?'not ':'')+base+'.',target,(kind==='negative'?"let's not ":"let's ")+base,{a:'marks the person loved',nuestra:'our',familia:'family',estamos:'we are',solos:'alone',que:'that',no:'not'});
}
const stativeGerunds=new Set(['ser','estar','poder','saber','querer','deber','parecer','creer','conocer','recordar','entender','necesitar','comprender','requerir','preferir','poseer','pertenecer','merecer','existir','gustar','resultar','significar','depender','valer','sonar','costar','consistir','caber','durar','bastar']);
function englishGerund(phrase){
 const [v,...rest]=phrase.split(' '),double=new Set(['run','set','get','put','win','begin','stop','submit','prefer','control','fit','cut','emit','transmit']);
 const form=v==='be'?'being':v.endsWith('ie')?v.slice(0,-2)+'ying':double.has(v)?v+v.at(-1)+'ing':v.endsWith('e')&&!v.endsWith('ee')?v.slice(0,-1)+'ing':v+'ing';
 return [form,...rest].join(' ');
}
function nonfinite(note,kind,target,bank){
 if(note.word==='soler'){
  if(kind==='Gerund')return {notice:notices.solerGerund};
  if(kind==='Past participle')return finish(bank.perfect[0][0],bank.perfect[0][0].text,bank.perfect[0][0].translation,target,'usually done (with an infinitive)',{},'Uncommon');
  return finish(null,'Dice soler leer por la noche.','He says he usually reads at night.',target,'habitually do (with an infinitive)',{dice:'he / she says'});
 }
 if(note.word==='haber'){
  const forms={Infinitive:['Puede haber una solución.','There may be a solution.'],Gerund:['Habiendo una solución, podemos continuar.','Since there is a solution, we can continue.'],'Past participle':['Ha habido una solución.','There has been a solution.'],'Perfect infinitive':['Después de haber habido una solución, todo cambió.','After there had been a solution, everything changed.'],'Perfect gerund':['Habiendo habido una solución, todo cambió.','After there had been a solution, everything changed.']};
  return finish(null,...forms[kind],target,'exist / there be (in this construction)',{podemos:'we can',continuar:'continue'});
 }
 const personal=Boolean(bank.perfect[0]?.[0]?.text),slot=personal?0:2;
 const source=bank.perfect[slot][0],p=splitPerfect(source),future=futureBase(bank,slot,note.word);
 if(kind==='Past participle'){
  const fullTarget=(slot===0?'he ':'ha ')+target;
  return finish(source,cap(p.before)+fullTarget+p.tail+'.',source.translation,target,(note.word==='gustar'?'been liked by Ana':p.part)+' (participle, with its complement)');
 }
 let tail=p.tail;
 // An overt experiencer does not require clitic doubling with a lexical noun.
 // The personal subject remains the person Ana likes, not Ana herself.
 const base=note.word==='gustar'?'be liked by Ana':future.base;
 if(kind==='Infinitive'){
  const sentence=personal?'Es posible '+target+tail+'.':cap(p.before)+'puede '+target+tail+'.';
  const en=personal?'It is possible to '+base.replace(/\bmy\b/g,"one's")+'.':p.subject+' can '+base+'.';
  return finish(source,sentence,en,target,base);
 }
 if(kind==='Gerund'&&note.word==='nacer')return finish(null,'Está naciendo una nueva idea.','A new idea is being born.',target,'being born; emerging');
 const main=personal?'sigo teniendo dudas':p.before+'sigue siendo importante';
 const enMain=personal?'I still have doubts':lower(p.subject)+' is still important';
 if(kind==='Gerund'){
  const present=bank.present[slot][0];
  if(!stativeGerunds.has(note.word))return finish(source,(personal?'Estoy ':cap(p.before)+'está ')+target+tail+'.',(personal?'I am ':p.subject+' is ')+englishGerund(base)+'.',target,englishGerund(base),{estoy:'I am (progressive auxiliary)',está:'is (progressive auxiliary)'});
  return finish(source,'Aun '+target+tail+', '+main+'.','Even though '+lower(present.translation.slice(0,-1))+', '+enMain+'.',target,base+' (gerund)',{aun:'even; although (concessive gerund)'});
 }
 // Both perfect nonfinite constructions describe an earlier situation. The
 // following clause supplies the same understood subject, or an explicit one.
 const explicit=personal?'':p.before;
 const nonfinitePart=note.word==='gustar'?'been liked by Ana':p.part;
 const earlier=personal?'I had '+nonfinitePart:lower(p.subject)+' had '+p.part;
 const later=personal?'conté mi experiencia':'cambió la situación';
 const laterEn=personal?'I described my experience':'the situation changed';
 const laterGloss={conté:'I described / recounted',mi:'my',experiencia:'experience',cambió:'changed',situación:'situation'};
 if(kind==='Perfect infinitive')return finish(source,'Después de '+target+(explicit?' '+explicit.trim():'')+tail+', '+later+'.','After '+earlier+', '+laterEn+'.',target,'have '+nonfinitePart,{...laterGloss,de:'after (después de)'});
 if(kind==='Perfect gerund')return finish(source,cap(target)+(explicit?' '+explicit.trim():'')+tail+', '+later+'.',(personal?'Having '+nonfinitePart:'After '+earlier)+', '+laterEn+'.',target,'having '+nonfinitePart,laterGloss);
 throw Error('Uncovered nonfinite form '+kind);
}
