// Authored draft candidates, not a frequency-ranked or independently reviewed corpus.
// Admission to normal lessons requires approvedEntries(); preview is explicit and isolated.
import {lexicalEvidence} from './foundation-evidence.js';
const langs=['es','fr','de'];
const review=()=>({status:'draft',author:'Codex',reviewer:null,reviewedAt:null,notes:'Authored candidate. Verify meaning, naturalness, inflections, regional usage, explanations, and sources before approval.'});
export const foundation={schemaVersion:1,id:'foundation',version:3,origin:'First authored expansion: 50 candidate concepts. Not an imported frequency list.',sources:{},lexemes:{},grammar:{},entries:[]};
const nounRows=[
 ['mother','madre','madres','f','mère','mères','f','Mutter','Mütter','f'],
 ['father','padre','padres','m','père','pères','m','Vater','Väter','m'],
 ['sister','hermana','hermanas','f','sœur','sœurs','f','Schwester','Schwestern','f'],
 ['brother','hermano','hermanos','m','frère','frères','m','Bruder','Brüder','m'],
 ['family','familia','familias','f','famille','familles','f','Familie','Familien','f'],
 ['city','ciudad','ciudades','f','ville','villes','f','Stadt','Städte','f'],
 ['street','calle','calles','f','rue','rues','f','Straße','Straßen','f'],
 ['school','escuela','escuelas','f','école','écoles','f','Schule','Schulen','f'],
 ['window','ventana','ventanas','f','fenêtre','fenêtres','f','Fenster','Fenster','n'],
 ['door','puerta','puertas','f','porte','portes','f','Tür','Türen','f'],
 ['room','habitación','habitaciones','f','chambre','chambres','f','Zimmer','Zimmer','n'],
 ['kitchen','cocina','cocinas','f','cuisine','cuisines','f','Küche','Küchen','f'],
 ['chair','silla','sillas','f','chaise','chaises','f','Stuhl','Stühle','m'],
 ['bed','cama','camas','f','lit','lits','m','Bett','Betten','n'],
 ['car','coche','coches','m','voiture','voitures','f','Auto','Autos','n'],
 ['train','tren','trenes','m','train','trains','m','Zug','Züge','m'],
 ['station','estación','estaciones','f','gare','gares','f','Bahnhof','Bahnhöfe','m'],
 ['ticket','billete','billetes','m','billet','billets','m','Fahrkarte','Fahrkarten','f'],
 ['shop','tienda','tiendas','f','magasin','magasins','m','Geschäft','Geschäfte','n'],
 ['market','mercado','mercados','m','marché','marchés','m','Markt','Märkte','m'],
 ['restaurant','restaurante','restaurantes','m','restaurant','restaurants','m','Restaurant','Restaurants','n'],
 ['meal','comida','comidas','f','repas','repas','m','Mahlzeit','Mahlzeiten','f'],
 ['egg','huevo','huevos','m','œuf','œufs','m','Ei','Eier','n'],
 ['potato','patata','patatas','f','pomme de terre','pommes de terre','f','Kartoffel','Kartoffeln','f'],
 ['tomato','tomate','tomates','m','tomate','tomates','f','Tomate','Tomaten','f'],
 ['orange','naranja','naranjas','f','orange','oranges','f','Orange','Orangen','f'],
 ['letter','carta','cartas','f','lettre','lettres','f','Brief','Briefe','m'],
 ['newspaper','periódico','periódicos','m','journal','journaux','m','Zeitung','Zeitungen','f'],
 ['pen','bolígrafo','bolígrafos','m','stylo à bille','stylos à bille','m','Kugelschreiber','Kugelschreiber','m'],
 ['question','pregunta','preguntas','f','question','questions','f','Frage','Fragen','f']
];
const genderNames={m:'masculine',f:'feminine',n:'neuter'};
const article=(lang,lemma,g)=>lang==='es'?(g==='f'?'la':'el'):lang==='fr'?(/^[aeiouéèêœ]/i.test(lemma)?'l’':g==='f'?'la':'le'):{m:'der',f:'die',n:'das'}[g];
const join=(a,b)=>a.endsWith('’')?a+b:a+' '+b;
const addEntry=(id,type,prompt,definition)=>{const e={id:`f-${id}`,senseId:`foundation.${id}`,type,prompt,definition,translations:{}};foundation.entries.push(e);return e;};
function translation(text,chunks,wordDetails,lexemeIds=[],grammarIds=[]){return {text,chunks,wordDetails,lexemeIds,grammarIds,sourceIds:[],review:review()};}
const chunk=(text,meaning,summary,detail,lexemeIds=[],grammarIds=[])=>({text,meaning,summary,detail,lexemeIds,grammarIds});
const nounMeaning=en=>en==='pen'?'ballpoint pen':en;
const compoundWords={
 'pomme de terre':{pomme:['apple','Head noun'],de:['of','Preposition'],terre:['earth','Noun in a prepositional modifier']},
 'stylo à bille':{stylo:['pen','Head noun'],à:['with','Preposition'],bille:['ball','Noun in a prepositional modifier']}
};
function nounWords(lemma,id,meaning,summary,note){
 if(compoundWords[lemma])return Object.fromEntries(Object.entries(compoundWords[lemma]).map(([word,[literal,role]])=>[word,{meaning:literal,role,note:`Part of ${lemma}, meaning “${meaning}” as a whole. This component gloss explains the structure, not a separate translation of the expression.`}]));
 return {[lemma]:{lexeme:id,meaning,role:summary,note}};
}
for(const [en,...values] of nounRows){
 const definition={station:'A railway station.',ticket:'A ticket for transport.',room:'A room, especially a bedroom.',letter:'A written message, not an alphabet character.',orange:'The citrus fruit.',meal:'An occasion or portion of food eaten.',pen:'A ballpoint writing instrument.'}[en]||`The everyday noun meaning ${en}.`;
 const meaning=nounMeaning(en),entry=addEntry(en,'noun',meaning,definition);
 langs.forEach((lang,i)=>{
  const [lemma,plural,g]=values.slice(i*3,i*3+3),id=`${lang}-${en}`,a=article(lang,lemma,g),text=join(a,lemma);
  foundation.lexemes[id]={id,lang,lemma,pos:'noun',senseId:entry.senseId,gender:genderNames[g],forms:[{text:lemma,number:'singular'},{text:plural,number:'plural'}],sourceIds:[],review:review()};
  const summary=`${genderNames[g]} singular noun`,detail=`${a} is the definite article; ${lemma} means “${en}” in this entry. Learn the noun with its grammatical gender. ${definition}`;
  const words={};
  if(a==='l’')words[text]={lexeme:id,meaning:`(the) ${meaning}`,role:`Elided article + ${summary}`,note:`l’ is the definite article before this vowel sound; ${detail}`};
  else Object.assign(words,{[a]:{meaning:'the',role:'Definite article',note:`The article agrees with ${lemma}.`}},nounWords(lemma,id,meaning,summary,detail));
  entry.translations[lang]=translation(text,[chunk(text,`(the) ${meaning}`,summary,detail,[id])],words,[id]);
 });
}
const subjects={es:['yo','tú','él / ella / usted','nosotros / nosotras','vosotros / vosotras','ellos / ellas / ustedes','vos'],fr:['je','tu','il / elle / on','nous','vous','ils / elles'],de:['ich','du','er / sie / es','wir','ihr','sie / Sie']};
const verbRows=[
 ['write',['escribir','escribo','escribes','escribe','escribimos','escribís','escriben','escribís'],['écrire','écris','écris','écrit','écrivons','écrivez','écrivent'],['schreiben','schreibe','schreibst','schreibt','schreiben','schreibt','schreiben']],
 ['buy',['comprar','compro','compras','compra','compramos','compráis','compran','comprás'],['acheter','achète','achètes','achète','achetons','achetez','achètent'],['kaufen','kaufe','kaufst','kauft','kaufen','kauft','kaufen']],
 ['want',['querer','quiero','quieres','quiere','queremos','queréis','quieren','querés'],['vouloir','veux','veux','veut','voulons','voulez','veulent'],['wollen','will','willst','will','wollen','wollt','wollen']],
 ['see',['ver','veo','ves','ve','vemos','veis','ven','ves'],['voir','vois','vois','voit','voyons','voyez','voient'],['sehen','sehe','siehst','sieht','sehen','seht','sehen']],
 ['give',['dar','doy','das','da','damos','dais','dan','das'],['donner','donne','donnes','donne','donnons','donnez','donnent'],['geben','gebe','gibst','gibt','geben','gebt','geben']],
 ['take',['tomar','tomo','tomas','toma','tomamos','tomáis','toman','tomás'],['prendre','prends','prends','prend','prenons','prenez','prennent'],['nehmen','nehme','nimmst','nimmt','nehmen','nehmt','nehmen']],
 ['open',['abrir','abro','abres','abre','abrimos','abrís','abren','abrís'],['ouvrir','ouvre','ouvres','ouvre','ouvrons','ouvrez','ouvrent'],['öffnen','öffne','öffnest','öffnet','öffnen','öffnet','öffnen']],
 ['close',['cerrar','cierro','cierras','cierra','cerramos','cerráis','cierran','cerrás'],['fermer','ferme','fermes','ferme','fermons','fermez','ferment'],['schließen','schließe','schließt','schließt','schließen','schließt','schließen']]
];
for(const [en,...values] of verbRows){
 const entry=addEntry(en,'verb',`to ${en}`,en==='take'?'Take or pick up something; not every English sense of “take”.':`The everyday action of ${en==='write'?'producing written text':en+'.'}`);
 langs.forEach((lang,i)=>{
  const [lemma,...forms]=values[i],id=`${lang}-${en}`;
  foundation.lexemes[id]={id,lang,lemma,pos:'verb',senseId:entry.senseId,forms:[{text:lemma,verbForm:'infinitive'},...forms.map((text,j)=>({text,subject:subjects[lang][j],person:j===6?2:j%3+1,number:j===6||j<3?'singular':'plural',verbForm:'finite',tense:'present',mood:'indicative'}))],paradigm:{tense:'present',mood:'indicative',complete:true,note:lang==='es'?'Includes tú and a common vos form. Vosotros is primarily used in Spain; usted and ustedes use third-person forms. Regional voseo varies.':lang==='fr'?'Vous may address one person politely or several people. On takes the third-person singular form.':'Formal Sie uses the same conjugation as plural sie.'},sourceIds:[],review:review()};
  const words={[lemma]:{lexeme:id,meaning:`to ${en}`,role:'Infinitive',note:'This base form names the action without specifying a subject.'}};
  entry.translations[lang]=translation(lemma,[chunk(lemma,`(to) ${en}`,'Infinitive',words[lemma].note,[id])],words,[id]);
 });
}
// Sentence and grammar candidates are hand-selected, not unrestricted substitutions.
const examples=[
 ['write-letter','sentence','I write a letter.','write','letter',1,'singular', ['Escribo','una carta'],['J’','écris','une lettre'],['Ich','schreibe','einen Brief']],
 ['buy-newspaper','sentence','I buy a newspaper.','buy','newspaper',1,'singular',['Compro','un periódico'],['J’','achète','un journal'],['Ich','kaufe','eine Zeitung']],
 ['open-door','sentence','I open the door.','open','door',1,'singular',['Abro','la puerta'],['J’','ouvre','la porte'],['Ich','öffne','die Tür']],
 ['close-window','sentence','I close the window.','close','window',1,'singular',['Cierro','la ventana'],['Je','ferme','la fenêtre'],['Ich','schließe','das Fenster']],
 ['want-pen','sentence','I want a ballpoint pen.','want','pen',1,'singular',['Quiero','un bolígrafo'],['Je','veux','un stylo à bille'],['Ich','will','einen Kugelschreiber']],
 ['see-train','sentence','I see the train.','see','train',1,'singular',['Veo','el tren'],['Je','vois','le train'],['Ich','sehe','den Zug']],
 ['take-ticket','sentence','I take the ticket.','take','ticket',1,'singular',['Tomo','el billete'],['Je','prends','le billet'],['Ich','nehme','die Fahrkarte']],
 ['we-write','sentence','We write a letter.','write','letter',1,'plural',['Escribimos','una carta'],['Nous','écrivons','une lettre'],['Wir','schreiben','einen Brief']],
 ['she-opens','grammar','She opens the door.','open','door',3,'singular',['Ella','abre','la puerta'],['Elle','ouvre','la porte'],['Sie','öffnet','die Tür']],
 ['they-buy','grammar','They (male or mixed group) buy a newspaper.','buy','newspaper',3,'plural',['Ellos','compran','un periódico'],['Ils','achètent','un journal'],['Sie','kaufen','eine Zeitung']],
 ['you-close','grammar','You (singular, informal) close the window.','close','window',2,'singular',['Tú','cierras','la ventana'],['Tu','fermes','la fenêtre'],['Du','schließt','das Fenster']],
 ['we-see','grammar','We see the train.','see','train',1,'plural',['Vemos','el tren'],['Nous','voyons','le train'],['Wir','sehen','den Zug']]
];
const pronounMeaning={J:'I','J’':'I',Je:'I',Ich:'I',Nous:'we',Wir:'we',Ella:'she',Elle:'she',Ellos:'they',Ils:'they',Tú:'you',Tu:'you',Du:'you'};
for(const [id,type,prompt,verb,noun,person,number,...values] of examples){
 const entry=addEntry(id,type,prompt,`Practice ${verb} with ${noun}; ${person} person ${number}.`);
 if(type==='grammar')entry.grammarTopic='subject-verb-agreement';
 langs.forEach((lang,i)=>{
  const pieces=values[i],verbId=`${lang}-${verb}`,nounId=`${lang}-${noun}`,v=foundation.lexemes[verbId],n=foundation.lexemes[nounId],verbIndex=pieces.length-2;
  const grammarId=`${lang}.present-agreement`;
  foundation.grammar[grammarId]||={id:grammarId,lang,description:'The present indicative verb agrees with its subject in grammatical person and number.',sourceIds:[],review:review()};
  const grammarIds=[grammarId],words={},chunks=[];
  pieces.forEach((text,j)=>{
   if(j>0&&!pieces[j-1].endsWith('’'))chunks.push({text:' '});
   if(j===verbIndex){
    const meaning=person===3&&number==='singular'?verb+'s':verb;
    words[text]={lexeme:verbId,meaning,role:`Present indicative · ${['','first','second','third'][person]} person · ${number}`,note:`${text} is a form of ${v.lemma} agreeing with this sentence’s subject.`,features:{person,number,tense:'present',mood:'indicative'}};
    chunks.push(chunk(text,(pieces.length===2?'('+ (number==='plural'?'we':'I')+') ':'')+meaning,words[text].role,words[text].note,[verbId],grammarIds));
   }else if(j===pieces.length-1){
    const indefinite=/^(un |una |une |einen |eine )/.test(text),meaning=`(${indefinite?'a':'the'}) ${nounMeaning(noun)}`;
    const note=`${text} is the direct object of ${pieces[verbIndex]}. ${n.lemma} is ${n.gender}; ${lang==='de'?'the phrase is accusative.':'its article agrees with the noun.'}`;
    chunks.push(chunk(text,meaning,`${n.gender} singular noun phrase`,note,[nounId],grammarIds));
    words[text.split(' ')[0]]={meaning:indefinite?'a':'the',role:`${indefinite?'Indefinite':'Definite'} article`,note};
    Object.assign(words,nounWords(n.lemma,nounId,nounMeaning(noun),`Noun · ${n.gender} singular${lang==='de'?' · accusative':''}`,note));
   }else{
    const meaning=text==='Sie'?(number==='plural'?'they':'she'):pronounMeaning[text];
    const usage=['Ellos','Ils'].includes(text)?' This example uses a masculine or mixed group.':text==='J’'?' J’ is je elided before a vowel sound.':'';
    words[text]={meaning,role:`Subject pronoun · ${['','first','second','third'][person]} person · ${number}`,note:`This pronoun is the subject of ${pieces[verbIndex]}.${usage}`};chunks.push(chunk(text,meaning,words[text].role,words[text].note,[],grammarIds));
   }
  });
  chunks.push({text:'.'});const text=chunks.map(c=>c.text).join('');
  entry.translations[lang]=translation(text,chunks,words,[verbId,nounId],grammarIds);
 });
}
// Reference coverage is not independent approval; prose/naturalness and reuse remain pending.
const languageNames={es:'Spanish',fr:'French',de:'German'};
const addSource=(id,title,url,attribution,scope)=>foundation.sources[id]={title,url,accessedAt:'2026-10-18',attribution,license:'Reuse terms pending review',reuseReviewed:false,scope};
for(const l of Object.values(foundation.lexemes)){
 const evidence=lexicalEvidence[l.id],language=languageNames[l.lang];
 const url=evidence.revision?`https://en.wiktionary.org/w/index.php?oldid=${evidence.revision}#${language}`:`https://en.wiktionary.org/wiki/${encodeURIComponent(l.lemma.replaceAll(' ','_'))}#${language}`;
 addSource(l.id,`Wiktionary: ${l.lemma} (${language})`,url,'Wiktionary contributors',`Checked ${evidence.checks.join(', ')} for this sense only. Does not approve sentence naturalness or teaching prose.`);
 l.sourceIds=[l.id];l.evidence=evidence;
}
// The lemma pages timed out; these consulted alternatives cover meaning/gender and plural.
for(const [id,lemma,plural,revision] of [['es-train','tren','trenes','77555045'],['es-letter','carta','cartas','76942419']]){
 addSource(id,`SpanishDictionary.com: ${lemma}`,`https://www.spanishdict.com/translate/${lemma}`,'SpanishDictionary.com dictionary contributors','Checked intended noun meaning and gender.');
 addSource(`${id}-plural`,`Wiktionary: ${plural} (Spanish)`,`https://en.wiktionary.org/w/index.php?oldid=${revision}#Spanish`,'Wiktionary contributors','Checked plural spelling and gender.');
 foundation.lexemes[id].sourceIds.push(`${id}-plural`);
}
addSource('es-meal-sense','SpanishDictionary.com: comida','https://www.spanishdict.com/translate/comida','SpanishDictionary.com dictionary contributors','Checked meal sense alongside food and regional lunch/dinner senses.');
foundation.lexemes['es-meal'].sourceIds.push('es-meal-sense');
const grammarSources=[
 ['es-agreement','RAE/ASALE: concordancia','https://www.rae.es/dpd/concordancia','RAE and ASALE','Nominal gender/number and subject–verb person/number agreement.'],
 ['es-voseo','RAE/ASALE: voseo','https://www.rae.es/dpd/voseo','RAE and ASALE','Regional variation; common present vos endings. Not an exhaustive regional paradigm.'],
 ['fr-articles','Tex’s French Grammar: definite articles','https://www.laits.utexas.edu/tex/pr/det2.html','University of Texas at Austin','Definite article gender/number and elision of le/la before a vowel sound.'],
 ['fr-pronouns','Tex’s French Grammar: subject pronouns','https://laits.utexas.edu/tex/gr/pro2.html','University of Texas at Austin','Subject person/number, vous, on, and masculine/mixed ils. Conjugated spellings are checked separately.'],
 ['de-agreement','IDS grammis: Kongruenz','https://grammis.ids-mannheim.de/sgt/2274','Leibniz-Institut für Deutsche Sprache','Subject–verb person/number and noun phrase agreement.'],
 ['de-case','IDS grammis: Subjekt','https://grammis.ids-mannheim.de/progr@mm/6875','Leibniz-Institut für Deutsche Sprache','Nominative subjects contrasted with accusative noun phrases; definite article case table. Individual noun declensions also support the displayed object forms.']
];
for(const args of grammarSources)addSource(...args);
for(const lang of langs){
 foundation.grammar[`${lang}.present-agreement`].sourceIds=[{es:'es-agreement',fr:'fr-pronouns',de:'de-agreement'}[lang]];
 const id=`${lang}.noun-articles`;
 foundation.grammar[id]={id,lang,description:lang==='de'?'Articles reflect noun gender, number, and case. The isolated noun entries here use nominative singular.':'Articles reflect the noun’s grammatical gender and number.',sourceIds:[{es:'es-agreement',fr:'fr-articles',de:'de-agreement'}[lang]],review:review()};
}
for(const l of Object.values(foundation.lexemes))if(l.lang==='es'&&l.pos==='verb')l.sourceIds.push('es-voseo');
const usageNotes={
 'es-car':'Coche is common in Spain and some other regions; this pack does not prescribe one word for every region.',
 'es-ticket':'Billete means a transport ticket here, especially in Spain; it can also mean a banknote.',
 'es-potato':'Patata is common in Spain; papa is used in much of Latin America.',
 'fr-room':'Chambre usually means a bedroom or hotel room in a building, not every kind of room.',
 'es-meal':'Comida means a meal here; it also means food and can refer to lunch or the main meal.',
 'es-tomato':'Tomate names the red tomato here; regional usage, including Mexican jitomate, differs.'
};
for(const entry of foundation.entries)for(const lang of langs){
 const t=entry.translations[lang];
 if(entry.type==='noun'||t.lexemeIds.some(id=>foundation.lexemes[id].pos==='noun'))t.grammarIds.push(`${lang}.noun-articles`);
 t.sourceIds=[...new Set([...t.lexemeIds.flatMap(id=>foundation.lexemes[id].sourceIds),...t.grammarIds.flatMap(id=>foundation.grammar[id].sourceIds),...(lang==='de'&&['sentence','grammar'].includes(entry.type)?['de-case']:[])])];
 for(const id of t.lexemeIds)if(usageNotes[id]){
  for(const c of t.chunks)if(c.lexemeIds?.includes(id))c.detail+=' '+usageNotes[id];
  for(const word of Object.values(t.wordDetails))if(word.lexeme===id)word.note+=' '+usageNotes[id];
 }
 t.review.notes='Lexical meanings and forms source-compared by Codex. Grammar references support construction rules; exact sentences, word-note prose, naturalness, regional suitability, and independent review remain pending.';
}
