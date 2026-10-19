import {addExample} from './build.js';
// Each span is authored in its own language; spaces and punctuation are literal.
const part=(text,meaning,summary,detail,lexemeId,features)=>({text,meaning,summary,detail,lexemeIds:lexemeId?[lexemeId]:[],grammarIds:[],...(features?{features}:{})});
const subject=(text,meaning)=>part(text,meaning,'Subject pronoun',`${text} identifies who the statement is about. The finite verb agrees with this subject.`);
const name=text=>part(text,text,'Personal name','A personal name is retained rather than translated.');
const verb=(text,meaning,lang,n,person=1,number='singular')=>part(text,meaning,`Present indicative · person ${person} · ${number}`,`This is the ${person}-person ${number} present form. The subject is ${person===1?'the speaker':person===2?'the addressee':'the person being described'}.`,`${lang}.u01-verb-${n}`,{person,number,tense:'present',mood:'indicative'});
const phrase=(text,meaning,note)=>part(text,meaning,'Contextual phrase',note);
const punctuation=text=>({text});
function sentence(parts,acceptedAnswers=[]){const chunks=[];for(const p of parts){if(chunks.length&&!chunks.at(-1).text.endsWith('’'))chunks.push(punctuation(' '));chunks.push(p);}chunks.push(punctuation('.'));return {text:chunks.map(c=>c.text).join(''),chunks,acceptedAnswers,lexemeIds:[...new Set(parts.flatMap(p=>p.lexemeIds||[]))],wordDetails:Object.fromEntries(parts.filter(p=>!p.text.includes(' ')).map(p=>[p.text,{meaning:p.meaning,role:p.summary,note:p.detail,...(p.lexemeIds?.length?{lexeme:p.lexemeIds[0]}:{}),...(p.features?{features:p.features}:{})}]))};}
export function addFirstExamples(pack){
 const add=(id,objectiveId,prompt,translations,situation='Meeting someone')=>addExample(pack,{id:`u01-${id}`,unitId:'u01',objectiveId:`u01.${objectiveId}`,prompt,definition:prompt,translations,situation});
 add('i-am-anna',1,'I am Anna.',{
  es:sentence([verb('Soy','(I) am','es',1),name('Anna')],['Yo soy Anna.']),
  fr:sentence([subject('Je','I'),verb('suis','am','fr',1),name('Anna')]),
  de:sentence([subject('Ich','I'),verb('bin','am','de',1),name('Anna')])});
 add('you-are-paul',1,'You (singular, informal) are Paul.',{
  es:sentence([verb('Eres','(you) are','es',1,2),name('Paul')],['Tú eres Paul.']),
  fr:sentence([subject('Tu','you'),verb('es','are','fr',1,2),name('Paul')]),
  de:sentence([subject('Du','you'),verb('bist','are','de',1,2),name('Paul')])});
 add('she-is-anna',1,'She is Anna.',{
  es:sentence([subject('Ella','she'),verb('es','is','es',1,3),name('Anna')]),
  fr:sentence([subject('Elle','she'),verb('est','is','fr',1,3),name('Anna')]),
  de:sentence([subject('Sie','she'),verb('ist','is','de',1,3),name('Anna')])});
 add('he-is-paul',1,'He is Paul.',{
  es:sentence([subject('Él','he'),verb('es','is','es',1,3),name('Paul')]),
  fr:sentence([subject('Il','he'),verb('est','is','fr',1,3),name('Paul')]),
  de:sentence([subject('Er','he'),verb('ist','is','de',1,3),name('Paul')])});
 add('we-are-students',1,'We (male or mixed group) are university students.',{
  es:sentence([verb('Somos','(we) are','es',1,1,'plural'),phrase('estudiantes','students','A profession or student status after ser normally appears without an indefinite article.')],['Nosotros somos estudiantes.']),
  fr:sentence([subject('Nous','we'),verb('sommes','are','fr',1,1,'plural'),phrase('étudiants','students','Masculine or mixed-group plural. The role after être has no indefinite article here.')]),
  de:sentence([subject('Wir','we'),verb('sind','are','de',1,1,'plural'),phrase('Studenten','students','Nominative plural identifying the subject. Studenten refers to university students.')])},'Introducing a study group');
 add('formal-you-teacher',1,'You (singular, formal; male) are a teacher.',{
  es:sentence([subject('Usted','you'),verb('es','are','es',1,3),phrase('profesor','a teacher','Masculine occupational noun. Spanish normally omits the indefinite article for an unmodified profession after ser.')]),
  fr:sentence([subject('Vous','you'),verb('êtes','are','fr',1,2,'plural'),phrase('professeur','a teacher','The unmodified profession after être is introduced without an indefinite article.')]),
  de:sentence([subject('Sie','you'),verb('sind','are','de',1,3,'plural'),phrase('Lehrer','a teacher','Formal Sie takes the plural verb form; the profession is nominative and has no article here.')])},'Addressing a teacher');
 add('they-are-students',1,'They (all female) are university students.',{
  es:sentence([subject('Ellas','they'),verb('son','are','es',1,3,'plural'),phrase('estudiantes','students','Estudiante has the same spelling for men and women; the subject here is an all-female group.')]),
  fr:sentence([subject('Elles','they'),verb('sont','are','fr',1,3,'plural'),phrase('étudiantes','students','The feminine plural ending agrees with the all-female subject.')]),
  de:sentence([subject('Sie','they'),verb('sind','are','de',1,3,'plural'),phrase('Studentinnen','students','Feminine plural of Studentin, a female university student.')])},'Introducing a study group');
 add('plural-you-students',1,'You (plural, informal; male or mixed group) are university students.',{
  es:sentence([subject('Vosotros','you'),verb('sois','are','es',1,2,'plural'),phrase('estudiantes','students','Student status; the Spain-oriented vosotros form addresses several people informally.')]),
  fr:sentence([subject('Vous','you'),verb('êtes','are','fr',1,2,'plural'),phrase('étudiants','students','Masculine or mixed-group plural; vous addresses more than one person here.')]),
  de:sentence([subject('Ihr','you'),verb('seid','are','de',1,2,'plural'),phrase('Studenten','students','Ihr addresses several people informally; the predicate noun is nominative plural.')])},'Addressing a study group');
 for(const [id,prompt,person,number,esSub,frSub,deSub,esForm,frForm,deForm,personName] of [
  ['my-name','My name is Anna.',1,'singular','', 'Je','Ich','Me llamo','m’appelle','heiße','Anna'],
  ['your-name','Your name is Paul (singular, informal).',2,'singular','', 'Tu','Du','Te llamas','t’appelles','heißt','Paul'],
  ['her-name','Her name is Anna.',3,'singular','Ella','Elle','Sie','se llama','s’appelle','heißt','Anna'],
  ['his-name','His name is Paul.',3,'singular','Él','Il','Er','se llama','s’appelle','heißt','Paul']
 ])add(id,2,prompt,{
  es:sentence([...(esSub?[subject(esSub,person===3?(esSub==='Ella'?'she':'he'):'you')]:[]),verb(esForm,'be called','es',2,person,number),name(personName)],!esSub?[`${person===1?'Yo':'Tú'} ${esForm.toLocaleLowerCase()} ${personName}.`]:[]),
  fr:sentence([subject(frSub,person===1?'I':person===2?'you':frSub==='Elle'?'she':'he'),verb(frForm,'be called','fr',2,person,number),name(personName)]),
  de:sentence([subject(deSub,person===1?'I':person===2?'you':deSub==='Sie'?'she':'he'),verb(deForm,'be called','de',2,person,number),name(personName)])});
 add('formal-name',2,'Your name is Anna (singular, formal).',{
  es:sentence([subject('Usted','you'),verb('se llama','are called','es',2,3),name('Anna')]),
  fr:sentence([subject('Vous','you'),verb('vous appelez','are called','fr',2,2,'plural'),name('Anna')]),
  de:sentence([subject('Sie','you'),verb('heißen','are called','de',2,3,'plural'),name('Anna')])});
 add('i-speak-french',2,'I speak French.',{
  es:sentence([verb('Hablo','(I) speak','es',3),phrase('francés','French','The language name is lowercase in Spanish.')],['Yo hablo francés.']),
  fr:sentence([subject('Je','I'),verb('parle','speak','fr',3),phrase('français','French','The language name after parler appears here without an article.')],['Je parle le français.']),
  de:sentence([subject('Ich','I'),verb('spreche','speak','de',3),phrase('Französisch','French','A language used as a noun is capitalized in German.')])},'Discussing languages');
 add('we-learn-german',2,'We are learning German.',{
  es:sentence([verb('Aprendemos','(we) learn','es',10,1,'plural'),phrase('alemán','German','Language name, lowercase in Spanish.')],['Nosotros aprendemos alemán.','Estamos aprendiendo alemán.']),
  fr:sentence([subject('Nous','we'),verb('apprenons','learn','fr',10,1,'plural'),phrase('l’allemand','German','The language name takes an elided definite article with apprendre.')]),
  de:sentence([subject('Wir','we'),verb('lernen','learn','de',10,1,'plural'),phrase('Deutsch','German','German uses its simple present for this ongoing activity.')])},'Discussing languages');
 add('you-speak-spanish',2,'You (singular, informal) speak Spanish.',{
  es:sentence([verb('Hablas','(you) speak','es',3,2),phrase('español','Spanish','Language name; no article is needed here.')],['Tú hablas español.']),
  fr:sentence([subject('Tu','you'),verb('parles','speak','fr',3,2),phrase('espagnol','Spanish','Language name after parler; an article is also possible.')],['Tu parles l’espagnol.']),
  de:sentence([subject('Du','you'),verb('sprichst','speak','de',3,2),phrase('Spanisch','Spanish','The stem changes from sprech- to sprich- with du.')])},'Discussing languages');
 add('i-understand',3,'I understand.',{
  es:sentence([verb('Entiendo','(I) understand','es',4)],['Yo entiendo.']),
  fr:sentence([subject('Je','I'),verb('comprends','understand','fr',4)]),
  de:sentence([subject('Ich','I'),verb('verstehe','understand','de',4)])},'Checking understanding');
 add('we-understand',3,'We understand.',{
  es:sentence([verb('Entendemos','(we) understand','es',4,1,'plural')],['Nosotros entendemos.']),
  fr:sentence([subject('Nous','we'),verb('comprenons','understand','fr',4,1,'plural')]),
  de:sentence([subject('Wir','we'),verb('verstehen','understand','de',4,1,'plural')])},'Checking understanding');
 add('i-repeat',3,'I repeat the word.',{
  es:sentence([verb('Repito','(I) repeat','es',5),phrase('la palabra','(the) word','Feminine singular direct object.')],['Yo repito la palabra.']),
  fr:sentence([subject('Je','I'),verb('répète','repeat','fr',5),phrase('le mot','(the) word','Masculine singular direct object.')]),
  de:sentence([subject('Ich','I'),verb('wiederhole','repeat','de',5),phrase('das Wort','(the) word','Neuter singular accusative direct object. Wiederholen in this sense is not separable.')])},'Classroom repetition');
 add('you-repeat',3,'You (singular, informal) repeat the sentence.',{
  es:sentence([verb('Repites','(you) repeat','es',5,2),phrase('la frase','(the) sentence','Feminine singular direct object.')],['Tú repites la frase.']),
  fr:sentence([subject('Tu','you'),verb('répètes','repeat','fr',5,2),phrase('la phrase','(the) sentence','Feminine singular direct object.')]),
  de:sentence([subject('Du','you'),verb('wiederholst','repeat','de',5,2),phrase('den Satz','(the) sentence','Masculine accusative changes the article from der to den.')])},'Classroom repetition');
 add('i-spell',3,'I spell the name.',{
  es:sentence([verb('Deletreo','(I) spell','es',6),phrase('el nombre','(the) name','Masculine singular direct object.')],['Yo deletreo el nombre.']),
  fr:sentence([subject('J’','I'),verb('épelle','spell','fr',6),phrase('le nom','(the) name','Masculine singular direct object.')]),
  de:sentence([subject('Ich','I'),verb('buchstabiere','spell','de',6),phrase('den Namen','(the) name','Name takes -n in the accusative singular: den Namen.')])},'Spelling a name');
 add('we-answer',3,'We answer.',{
  es:sentence([verb('Respondemos','(we) answer','es',9,1,'plural')],['Nosotros respondemos.']),
  fr:sentence([subject('Nous','we'),verb('répondons','answer','fr',9,1,'plural')]),
  de:sentence([subject('Wir','we'),verb('antworten','answer','de',9,1,'plural')])},'Classroom exchange');
 add('i-speak-slowly',3,'I speak slowly.',{
  es:sentence([verb('Hablo','(I) speak','es',3),phrase('despacio','slowly','Describes the speed of speaking.')],['Yo hablo despacio.']),
  fr:sentence([subject('Je','I'),verb('parle','speak','fr',3),phrase('lentement','slowly','An adverb describing the action; it does not agree with the subject.')]),
  de:sentence([subject('Ich','I'),verb('spreche','speak','de',3),phrase('langsam','slowly','Used adverbially, without an adjective ending.')])},'Making speech easier to follow');
 add('you-listen',3,'You (plural, informal) listen.',{
  es:sentence([verb('Escucháis','(you) listen','es',7,2,'plural')],['Vosotros escucháis.']),
  fr:sentence([subject('Vous','you'),verb('écoutez','listen','fr',7,2,'plural')]),
  de:sentence([subject('Ihr','you'),verb('hört','listen','de',7,2,'plural'),phrase('zu','part of listen','The separable particle zu completes zuhören at the end of this clause.')])},'Classroom exchange');
}
