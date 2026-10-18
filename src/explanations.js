import {readingPilot} from './content/reading-pilot.js';
const pilotEntries=new Map(readingPilot.entries.map(entry=>[entry.id,entry]));
// Curated notes for the current lesson bank; no network requests are needed.
const genders={
 es:['feminine','masculine','feminine','masculine','feminine','masculine','masculine','masculine','feminine','feminine','feminine','masculine','feminine','feminine','masculine','masculine'],
 fr:['feminine','masculine','feminine','masculine','feminine','masculine','masculine','masculine','feminine','masculine','feminine','feminine','feminine','feminine','masculine','masculine'],
 de:['neuter','neuter','neuter','neuter','masculine','masculine','masculine','masculine','feminine','feminine','feminine','feminine','feminine','masculine','feminine','masculine']
};
const constructions={
 c24:{es:['Bebo means “I drink.”','Spanish usually leaves out yo (“I”) because the verb ending identifies the speaker. Agua has no article here.'],fr:['Je bois means “I drink.”','De l’eau expresses an unspecified amount of water. Eau is feminine; l’ is used before its vowel sound.'],de:['Ich trinke means “I drink.”','Wasser has no article here because it refers to water in general. Trinke is the ich form of trinken.']},
 c25:{es:['Estoy aprendiendo describes learning in progress.','Estoy is the yo form of estar. Aprendiendo is the gerund of aprender; together they describe an ongoing action.'],fr:['J’apprends can mean “I learn” or “I am learning.”','Je becomes j’ before a vowel. Apprends is the je form of apprendre; French uses the present tense for both meanings.'],de:['Ich lerne can mean “I learn” or “I am learning.”','Lerne is the ich form of lernen. German uses the present tense for both meanings.']},
 c27:{es:['A greeting used throughout the day.','Hola means “hello.” Spanish marks an exclamation with both an opening ¡ and a closing !.'],fr:['A daytime greeting: “hello” or “good day.”','Bonjour is a polite everyday greeting. In the evening, bonsoir is commonly used instead.'],de:['An everyday greeting: “hello.”','Hallo is a common greeting in casual conversation. Guten Tag is a more formal alternative.']},
 c28:{es:['A simple way to say “thank you.”','Gracias is used as a complete expression. Muchas gracias means “thank you very much.”'],fr:['A simple way to say “thank you.”','Merci is used as a complete expression. Merci beaucoup means “thank you very much.”'],de:['A simple way to say “thank you.”','Danke is used as a complete expression. Danke schön adds warmth: “thank you very much.”']},
 c29:{es:['A farewell meaning “see you tomorrow.”','Hasta means “until” and mañana means “tomorrow” here. The expression does not need a verb.'],fr:['A farewell meaning “see you tomorrow.”','À contributes “until” in this farewell; demain means “tomorrow”. Together they mean “see you tomorrow”; no verb is needed.'],de:['A farewell meaning “see you tomorrow.”','Bis means “until” and morgen means “tomorrow” here. Lowercase morgen is the adverb, distinct from the noun Morgen (“morning”).']},
 c30:{es:['No before the verb makes the sentence negative.','Como is the yo form of comer. No como means “I do not eat” or “I am not eating.”'],fr:['Ne … pas surrounds the verb to make it negative.','Mange is the je form of manger. In informal speech, ne is often omitted; this lesson uses the full written form.'],de:['Nicht makes the statement negative.','Esse is the ich form of essen. In this simple sentence, nicht follows the verb.']},
 c31:{es:['Los libros is the plural of el libro.','Both the article and noun change: el → los and libro → libros. The noun remains masculine.'],fr:['Les livres is the plural of le livre.','Les is the plural definite article for both genders. Livre adds a written -s, which is normally silent.'],de:['Die Bücher is the plural of das Buch.','The plural adds an umlaut and -er: Buch → Bücher. Die is the nominative and accusative plural definite article for all genders.']},
 c32:{es:['Mi casa means “my house.”','Mi means “my”; casa means “house”. Mi works with masculine and feminine singular nouns; plural nouns take mis.'],fr:['Ma maison means “my house.”','Ma means “my” and agrees with maison (“house”), a feminine singular noun, not with the person who owns it.'],de:['Mein Haus means “my house.”','Mein means “my” and agrees with Haus (“house”), a neuter singular noun here. Possessive endings depend on gender, number, and case.']},
 c33:{es:['Dónde asks about a location.','The question word dónde has an accent. Spanish questions use both an opening ¿ and a closing ?.'],fr:['Où asks about a location.','The accent distinguishes où (“where”) from ou (“or”).'],de:['Wo asks about a location.','Wo means “where” for a location. Wohin asks “where to?” and woher asks “where from?”.']}
};
export function explain(item,lang){
 const meaning=item.en.includes(': ')?item.en.split(': ').slice(1).join(': '):item.en;
 if(item.type==='noun'){
  const gender=genders[lang][Number(item.id.slice(1))];
  const special=item.id==='c0'&&lang==='es'?'Agua is feminine, but takes el in the singular because its first a is stressed.':lang==='fr'&&item[lang].startsWith('l’')?'L’ replaces le or la before a vowel sound; it does not tell you the noun’s gender.':lang==='de'?'The article shown is the nominative singular form. German articles can change with the noun’s role in a sentence.':'Learn the article together with the noun; grammatical gender does not always match natural gender.';
  const text=item[lang],split=text.includes('’')?text.indexOf('’')+1:text.indexOf(' ');
  const article=text.slice(0,split),noun=text.slice(split).trim();
  return {meaning:`the ${meaning}`,summary:`${gender[0].toUpperCase()+gender.slice(1)} singular noun.`,detail:`${article} is the definite article (“the”); ${noun} means “${meaning}”. ${special}`};
 }
 if(item.type==='verb')return {meaning,summary:'Infinitive — the base form of the verb.',detail:'This form names the action without specifying who does it or when. A sentence uses a conjugated form to match its subject and tense.'};
 const [summary,detail]=constructions[item.id][lang];
 return {meaning,summary,detail};
}

// Keep articles with their nouns and fixed expressions together.
// Each segment retains its sentence's grammatical context.
const phrases={
 c24:{es:[['Bebo','(I) drink','Present tense · beber','Bebo is the first-person singular form of beber. The ending supplies “I.”'],['agua','water','Feminine noun','No article is needed for this unspecified amount of water.']],fr:[['Je','I','Subject pronoun','Je identifies the speaker.'],['bois','drink','Present tense · boire','Bois agrees with je in this sentence.'],['de l’eau','(some) water','Partitive · feminine noun','De l’ is the partitive article before a vowel; eau means “water” and is feminine. Together, de l’eau refers to an unspecified amount of water.']],de:[['Ich','I','Subject pronoun','Ich is the subject of trinke.'],['trinke','drink','Present tense · trinken','Trinke is the first-person singular form.'],['Wasser','water','Neuter noun','Wasser is the direct object, used without an article here.']]},
 c25:{es:[['Estoy aprendiendo','(I) am learning','Present progressive · estar + aprender','Estoy is the first-person singular present of estar (“I am”). Aprendiendo is the gerund of aprender (“learning”). Together they describe learning in progress.']],fr:[['J’','I','Subject pronoun · je','Je contracts to j’ before the vowel in apprends.'],['apprends','am learning','Present tense · apprendre','With j’, apprends means “I learn” or “I am learning.”']],de:[['Ich','I','Subject pronoun','Ich is the subject of lerne.'],['lerne','am learning','Present tense · lernen','German uses the present tense for both “learn” and “am learning.”']]},
 c30:{es:[['No','not','Negation','No goes before como to negate it.'],['como','(I) eat','Present tense · comer','Como is the first-person singular form. No como means “I do not eat.”']],fr:[['Je','I','Subject pronoun','Je is the subject of mange.'],['ne','not','Negation · ne … pas','Ne works with pas, on either side of mange.'],['mange','eat','Present tense · manger','Mange agrees with je here.'],['pas','not','Negation · ne … pas','Pas completes the negative construction; ne and pas together mean “not.”']],de:[['Ich','I','Subject pronoun','Ich is the subject of esse.'],['esse','eat','Present tense · essen','Esse is the first-person singular form.'],['nicht','not','Negation','Nicht negates the statement “Ich esse.”']]}
};
// These constructions are intentionally one chunk, not an unreviewed fallback.
const wholeChunks={
 c27:{meaning:'Hello',summary:'Greeting'},
 c28:{meaning:'Thank you',summary:'Expression of thanks'},
 c29:{meaning:'See you tomorrow',summary:'Fixed farewell expression'},
 c31:{meaning:'(the) books',summary:'Plural noun phrase'},
 c32:{meaning:'(my) house',summary:'Possessive noun phrase'},
 c33:{meaning:'Where?',summary:'Question word · location'}
};
export function segments(item,lang){
 const pilot=pilotEntries.get(item.id);if(pilot){if(item[lang]!==pilot.translations[lang].text)throw new Error(`Invalid chunk source: ${item.id}/${lang}`);return pilot.translations[lang].chunks;}
 let parts=phrases[item.id]?.[lang];
 if(!parts){
  const whole=wholeChunks[item.id];
  if(item.type!=='noun'&&item.type!=='verb'&&!whole)throw new Error(`Missing chunk definition: ${item.id}/${lang}`);
  const entry=explain(item,lang);
  // Leave leading/trailing punctuation and whitespace outside the click target.
  const text=item[lang].replace(/^[\s¡¿]+|[\s.!?]+$/gu,'');
  parts=[[text,whole?.meaning||entry.meaning.replace(/^the /,'(the) ').replace(/^to /,'(to) '),whole?.summary||entry.summary,entry.detail]];
 }
 let offset=0;
 const result=[];
 for(const [text,meaning,summary,detail] of parts){
  const start=item[lang].indexOf(text,offset);
  if(!text||start<offset)throw new Error(`Invalid chunk: ${item.id}/${lang}: ${text}`);
  if(start>offset)result.push({text:item[lang].slice(offset,start)});
  result.push({text,meaning,summary,detail});offset=start+text.length;
 }
 if(offset<item[lang].length)result.push({text:item[lang].slice(offset)});
 if(result.some(part=>!part.meaning&&/[\p{L}\p{N}]/u.test(part.text)))throw new Error(`Unexplained text: ${item.id}/${lang}`);
 return result;
}
