import {createCoursePack,addLexical,noun,verb} from './build.js';
export const firstExchanges=createCoursePack('course-u01');
const pack=firstExchanges,unitId='u01',langs=['es','fr','de'];
const add=(id,pos,meaning,forms,note='')=>addLexical(pack,{id:`u01-${id}`,unitId,pos,meaning,forms,note});
const genders={m:'masculine',f:'feminine',n:'neuter'};
const nouns=[
 ['person','persona','personas','f','la','personne','personnes','f','la','Person','Personen','f','die'],
 ['man','hombre','hombres','m','el','homme','hommes','m','l’','Mann','Männer','m','der'],
 ['woman','mujer','mujeres','f','la','femme','femmes','f','la','Frau','Frauen','f','die'],
 ['child (boy or unspecified)','niño','niños','m','el','enfant','enfants','m','l’','Kind','Kinder','n','das'],
 ['name','nombre','nombres','m','el','nom','noms','m','le','Name','Namen','m','der'],
 ['first name','nombre de pila','nombres de pila','m','el','prénom','prénoms','m','le','Vorname','Vornamen','m','der'],
 ['surname','apellido','apellidos','m','el','nom de famille','noms de famille','m','le','Nachname','Nachnamen','m','der'],
 ['country','país','países','m','el','pays','pays','m','le','Land','Länder','n','das'],
 ['language','idioma','idiomas','m','el','langue','langues','f','la','Sprache','Sprachen','f','die'],
 ['word','palabra','palabras','f','la','mot','mots','m','le','Wort','Wörter','n','das'],
 ['sentence','frase','frases','f','la','phrase','phrases','f','la','Satz','Sätze','m','der'],
 ['letter (of the alphabet)','letra','letras','f','la','lettre','lettres','f','la','Buchstabe','Buchstaben','m','der'],
 ['number','número','números','m','el','nombre','nombres','m','le','Zahl','Zahlen','f','die'],
 ['answer','respuesta','respuestas','f','la','réponse','réponses','f','la','Antwort','Antworten','f','die'],
 ['question','pregunta','preguntas','f','la','question','questions','f','la','Frage','Fragen','f','die'],
 ['student (male, university)','estudiante','estudiantes','m','el','étudiant','étudiants','m','l’','Student','Studenten','m','der'],
 ['teacher (male)','profesor','profesores','m','el','professeur','professeurs','m','le','Lehrer','Lehrer','m','der'],
 ['friend (male)','amigo','amigos','m','el','ami','amis','m','l’','Freund','Freunde','m','der'],
 ['address (postal)','dirección','direcciones','f','la','adresse','adresses','f','l’','Adresse','Adressen','f','die'],
 ['telephone','teléfono','teléfonos','m','el','téléphone','téléphones','m','le','Telefon','Telefone','n','das']
];
for(const [i,row] of nouns.entries()){
 const [meaning,...values]=row;
 const forms=langs.map((lang,j)=>{const [lemma,plural,g,article]=values.slice(j*4,j*4+4);return noun(lemma,plural,genders[g],article);});
 const entry=add(`noun-${i+1}`,'noun',meaning,forms);
 for(const lang of langs){const t=entry.translations[lang],l=pack.lexemes[t.lexemeIds[0]];for(const [word,detail] of Object.entries(t.wordDetails))if(word===l.lemma){detail.meaning=meaning;detail.lexeme=l.id;}
 if(t.text.startsWith('l’'))t.wordDetails[t.text]={meaning:`(the) ${meaning}`,role:`Elided definite article + ${l.gender} singular noun`,note:`l’ is the article before this vowel sound. The noun is ${l.lemma}.`,lexeme:l.id};}
}
const verbs=[
 ['be (identity)','ser|soy|eres|es|somos|sois|son','être|suis|es|est|sommes|êtes|sont','sein|bin|bist|ist|sind|seid|sind'],
 ['be called (name)','llamarse|me llamo|te llamas|se llama|nos llamamos|os llamáis|se llaman','s’appeler|m’appelle|t’appelles|s’appelle|nous appelons|vous appelez|s’appellent','heißen|heiße|heißt|heißt|heißen|heißt|heißen'],
 ['speak','hablar|hablo|hablas|habla|hablamos|habláis|hablan','parler|parle|parles|parle|parlons|parlez|parlent','sprechen|spreche|sprichst|spricht|sprechen|sprecht|sprechen'],
 ['understand','entender|entiendo|entiendes|entiende|entendemos|entendéis|entienden','comprendre|comprends|comprends|comprend|comprenons|comprenez|comprennent','verstehen|verstehe|verstehst|versteht|verstehen|versteht|verstehen'],
 ['repeat','repetir|repito|repites|repite|repetimos|repetís|repiten','répéter|répète|répètes|répète|répétons|répétez|répètent','wiederholen|wiederhole|wiederholst|wiederholt|wiederholen|wiederholt|wiederholen'],
 ['spell (say the letters)','deletrear|deletreo|deletreas|deletrea|deletreamos|deletreáis|deletrean','épeler|épelle|épelles|épelle|épelons|épelez|épellent','buchstabieren|buchstabiere|buchstabierst|buchstabiert|buchstabieren|buchstabiert|buchstabieren'],
 ['listen','escuchar|escucho|escuchas|escucha|escuchamos|escucháis|escuchan','écouter|écoute|écoutes|écoute|écoutons|écoutez|écoutent','zuhören|höre zu|hörst zu|hört zu|hören zu|hört zu|hören zu'],
 ['ask (a question)','preguntar|pregunto|preguntas|pregunta|preguntamos|preguntáis|preguntan','demander|demande|demandes|demande|demandons|demandez|demandent','fragen|frage|fragst|fragt|fragen|fragt|fragen'],
 ['answer','responder|respondo|respondes|responde|respondemos|respondéis|responden','répondre|réponds|réponds|répond|répondons|répondez|répondent','antworten|antworte|antwortest|antwortet|antworten|antwortet|antworten'],
 ['learn','aprender|aprendo|aprendes|aprende|aprendemos|aprendéis|aprenden','apprendre|apprends|apprends|apprend|apprenons|apprenez|apprennent','lernen|lerne|lernst|lernt|lernen|lernt|lernen']
];
for(const [i,[meaning,...rows]] of verbs.entries())add(`verb-${i+1}`,'verb',meaning,rows.map((row,j)=>{const [lemma,...finite]=row.split('|');return verb(lemma,finite,langs[j],i===1?'The table includes reflexive pronouns in Spanish and French. Add the subject pronoun in French: nous nous appelons, vous vous appelez. German heißen is not reflexive.':i===6&&j===2?'Zuhören is separable: the finite verb and zu surround intervening sentence material. It takes a dative listener complement when one is expressed.':'');}));
const numbers=[
 ['zero','cero','zéro','null'],['one','uno','un','eins'],['two','dos','deux','zwei'],['three','tres','trois','drei'],['four','cuatro','quatre','vier'],['five','cinco','cinq','fünf'],['six','seis','six','sechs'],['seven','siete','sept','sieben'],['eight','ocho','huit','acht'],['nine','nueve','neuf','neun'],['ten','diez','dix','zehn'],['eleven','once','onze','elf'],['twelve','doce','douze','zwölf'],['thirteen','trece','treize','dreizehn'],['fourteen','catorce','quatorze','vierzehn'],['fifteen','quince','quinze','fünfzehn'],['sixteen','dieciséis','seize','sechzehn'],['seventeen','diecisiete','dix-sept','siebzehn'],['eighteen','dieciocho','dix-huit','achtzehn'],['nineteen','diecinueve','dix-neuf','neunzehn'],['twenty','veinte','vingt','zwanzig']
];
for(const [i,[meaning,...words]] of numbers.entries())add(`number-${i}`,'numeral',`${meaning} (counting)`,words.map(lemma=>({lemma})),i===1?'This is the counting form. Spanish uno becomes un before a masculine noun; French uses une with a feminine noun; German eins changes to ein/eine before a noun.':'Cardinal number used when counting. Write the number in words.');
const pronouns=[
 ['I','yo','je','ich'],['you (singular, informal)','tú','tu','du'],['he','él','il','er'],['she','ella','elle','sie'],['we (male or mixed group)','nosotros','nous','wir'],['you (plural, informal)','vosotros','vous','ihr'],['they (male or mixed group)','ellos','ils','sie'],['they (all female)','ellas','elles','sie'],['you (singular, formal)','usted','vous','Sie'],['you (plural, formal)','ustedes','vous','Sie']
];
for(const [i,[meaning,...words]] of pronouns.entries())add(`pronoun-${i+1}`,'pronoun',meaning,words.map(lemma=>({lemma,summary:'Subject pronoun'})),'The prompt specifies the people being addressed or referred to. Spanish usted/ustedes take third-person verbs. French vous uses a plural verb form even when addressing one person. German formal Sie is capitalized.');
const expressions=[
 ['hello','hola','bonjour','hallo'],['good morning','buenos días','bonjour','guten Morgen'],['good evening','buenas tardes','bonsoir','guten Abend'],['good night (farewell)','buenas noches','bonne nuit','gute Nacht'],['goodbye','adiós','au revoir','auf Wiedersehen'],['see you soon','hasta pronto','à bientôt','bis bald'],['see you tomorrow','hasta mañana','à demain','bis morgen'],['thank you','gracias','merci','danke'],['thank you very much','muchas gracias','merci beaucoup','vielen Dank'],['please (formal)','por favor','s’il vous plaît','bitte'],['you’re welcome','de nada','de rien','gern geschehen'],['excuse me (formal)','perdone','excusez-moi','entschuldigen Sie'],['sorry','lo siento','désolé','Entschuldigung'],['yes','sí','oui','ja'],['no','no','non','nein'],['okay','de acuerdo','d’accord','in Ordnung'],['nice to meet you (male speaker)','encantado','enchanté','freut mich'],['how are you? (singular, informal)','¿Cómo estás?','Comment vas-tu ?','Wie geht es dir?'],['very well','muy bien','très bien','sehr gut'],['not bad','no está mal','pas mal','nicht schlecht']
];
for(const [i,[meaning,...words]] of expressions.entries())add(`expression-${i+1}`,'expression',meaning,words.map(lemma=>({lemma,summary:'Conventional expression'})),i===2?'Greeting in the evening. Spanish evening greetings vary with region and time: buenas noches is also used later in the evening.':i===12?'An apology. French désolée is the written feminine form; désolé is the masculine/default form taught here.':'Learn this as a conventional expression in the situation named by the prompt. Its words need not match English word for word.');
const adjectives=[
 ['good (masculine singular)','bueno','bon','gut'],['bad (masculine singular)','malo','mauvais','schlecht'],['new (masculine singular)','nuevo','nouveau','neu'],['old (thing, masculine singular)','viejo','vieux','alt'],['easy','fácil','facile','einfach'],['difficult','difícil','difficile','schwierig'],['correct (masculine singular)','correcto','correct','richtig'],['incorrect (masculine singular)','incorrecto','incorrect','falsch'],['ready (masculine singular)','listo','prêt','bereit'],['important (masculine singular)','importante','important','wichtig']
];
for(const [i,[meaning,...words]] of adjectives.entries())add(`adjective-${i+1}`,'adjective',meaning,words.map(lemma=>({lemma,summary:'Adjective · base form'})),'The standalone form is shown here. Spanish and French adjectives can change with gender and number; German attributive adjectives take endings. This is not a complete agreement table.');
const adverbs=[['here','aquí','ici','hier'],['there (over there)','allí','là-bas','dort'],['now','ahora','maintenant','jetzt'],['today','hoy','aujourd’hui','heute'],['tomorrow','mañana','demain','morgen'],['again','otra vez','encore','noch einmal'],['slowly','despacio','lentement','langsam'],['together','juntos','ensemble','zusammen'],['also','también','aussi','auch']];
for(const [i,[meaning,...words]] of adverbs.entries())add(`adverb-${i+1}`,'adverb',meaning,words.map((lemma,j)=>i===7&&j===0?{lemma:'junto',text:'juntos',pos:'adjective',summary:'Adjective used adverbially · masculine plural',forms:[{text:'junto',number:'singular',gender:'masculine'},{text:'juntos',number:'plural',gender:'masculine'},{text:'junta',number:'singular',gender:'feminine'},{text:'juntas',number:'plural',gender:'feminine'}],wordDetails:{juntos:{meaning:'together',role:'Adjective used adverbially · masculine plural',note:'Agrees with a masculine or mixed-group plural subject.'}}}:{lemma,summary:'Adverbial expression'}),i===7?'Spanish juntos is the masculine or mixed-group plural; juntas is used for an all-female group. French ensemble and German zusammen do not change with gender.':'The meaning is the use named by the English prompt; other senses are outside this entry.');

import {addFirstExamples} from './u01-examples.js';
addFirstExamples(pack);

import {sources,evidence} from './u01-evidence.js';
Object.assign(pack.sources,sources);
for(const [id,check] of Object.entries(evidence)){pack.lexemes[id].sourceIds=[id];pack.lexemes[id].evidence=check;}
for(const entry of pack.entries)for(const t of Object.values(entry.translations))t.sourceIds=[...new Set(t.lexemeIds.flatMap(id=>pack.lexemes[id].sourceIds))];
// Scoped accepted alternatives. These do not broaden other prompts automatically.
pack.entries.find(e=>e.id==='course-u01-expression-3').translations.es.acceptedAnswers=['buenas noches'];
pack.entries.find(e=>e.id==='course-u01-expression-13').translations.fr.acceptedAnswers=['désolée','je suis désolé','je suis désolée'];
pack.entries.find(e=>e.id==='course-u01-i-spell').translations.fr.acceptedAnswers=['J’épèle le nom.'];

for(const [id,meaning,...words] of [
 ['spanish','Spanish (language)','español','espagnol','Spanisch'],
 ['french','French (language)','francés','français','Französisch'],
 ['german','German (language)','alemán','allemand','Deutsch']
])add(`language-${id}`,'noun',meaning,words.map((lemma,j)=>({lemma,text:j===0?`el ${lemma}`:j===1?(/^[aeiou]/.test(lemma)?`l’${lemma}`:`le ${lemma}`):`das ${lemma}`,gender:j===2?'neuter':'masculine',forms:[{text:lemma,number:'singular'}],summary:'Language name · singular',note:'This entry names the language. No plural is taught here. Article use changes with the sentence construction.'})));
