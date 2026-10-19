import {essentialNouns} from './essential-nouns.js';
import {referenceForms} from './reference-forms.js';
import {courseSources} from './course-sources.js';
import {addCourseExamples} from './examples.js';
import {createCoursePack,addLexical,noun,verb} from './build.js';
import {nounInventory} from './noun-inventory.js';
import {verbInventory} from './verb-inventory.js';
import {otherInventory} from './other-inventory.js';
import {adjectiveInventory} from './adjective-inventory.js';
const languages=['es','fr','de'];
const genderNames={m:'masculine',f:'feminine',n:'neuter'};
const articles={es:{m:'el',f:'la'},fr:{m:'le',f:'la'},de:{m:'der',f:'die',n:'das'}};
export const inventoryRows=text=>(text||'').trim().split('\n').filter(Boolean).map(line=>line.split('|').map(s=>s.trim()));
export function presentForms(cell,lang){
 const [lemma,explicit]=cell.split(':');
 if(explicit){const forms=explicit.split(',');if(forms.length!==6)throw new Error(`Six forms required: ${lemma}`);return verb(lemma,forms,lang);}
 let stem,endings;
 if(lang==='es'){
  const ending=lemma.slice(-2);stem=lemma.slice(0,-2);
  endings={ar:['o','as','a','amos','áis','an'],er:['o','es','e','emos','éis','en'],ir:['o','es','e','imos','ís','en']}[ending];
 }else if(lang==='fr'&&lemma.endsWith('er')){if(/(?:ger|cer|yer)$/.test(lemma))throw new Error(`Explicit spelling-change forms required: ${lemma}`);stem=lemma.slice(0,-2);endings=['e','es','e','ons','ez','ent'];}
 else if(lang==='de'&&lemma.endsWith('en')){stem=lemma.slice(0,-2);endings=['e','st','t','en','t','en'];}
 if(!endings)throw new Error(`Unspecified present paradigm: ${lang}/${lemma}`);
 return verb(lemma,endings.map(e=>stem+e),lang,'This verb follows a regular present-tense pattern. Its ending changes with the subject.');
}
for(const [unitId,...cells] of inventoryRows(essentialNouns))nounInventory[unitId]+='\n'+cells.join('|');
export const expandedPacks=Object.keys(nounInventory).map(unitId=>{
 const pack=createCoursePack(`course-${unitId}`);
 for(const [key,meaning,...cells] of inventoryRows(nounInventory[unitId])){
  const id=`${unitId}-n-${key}`;
  const forms=cells.map((cell,i)=>{
   const [gender,lemma,plural,override]=cell.split(';'),lang=languages[i];
   if(!genderNames[gender]||!lemma||!plural)throw new Error(`Incomplete noun: ${id}/${lang}`);
   const f=noun(lemma,plural,genderNames[gender],override||articles[lang][gender]);
   if(plural==='-'){f.forms=[{text:lemma,number:'singular'}];f.note=`${meaning}. Only the singular is taught for this sense; absence of a plural here is not a claim that no plural can exist.`;}
   if(['las','los','les'].includes(override)){f.forms=[{text:lemma,number:'plural'}];f.summary=`${genderNames[gender]} plural noun`;f.note=`${meaning}. This sense is conventionally taught in the plural; do not replace it with a singular that has a different meaning.`;}
   // Supply the English contextual gloss, never the foreign lemma as its own definition.
   if(gender==='f'&&override==='el'){f.note+=' Feminine nouns beginning with stressed a use el immediately before the singular noun; the noun remains feminine.';f.wordDetails.el.note='El precedes this feminine noun because its initial a is stressed; adjective agreement remains feminine.';}
   f.wordDetails[lemma]={features:{number:['las','los','les'].includes(override)?'plural':'singular',...(lang==='de'?{case:'nominative'}:{})},lexeme:`${lang}.${id}`,meaning,role:`Noun · ${genderNames[gender]} ${['las','los','les'].includes(override)?'plural':'singular'}`,note:plural==='-'?f.note:`${meaning}. The recorded plural is ${plural}.`};
   return f;
  });
  addLexical(pack,{id,unitId,pos:'noun',meaning,forms});
 }
 for(const [key,meaning,...cells] of inventoryRows(verbInventory[unitId])){
  addLexical(pack,{id:`${unitId}-v-${key}`,unitId,pos:'verb',meaning,forms:cells.map((c,i)=>presentForms(c,languages[i]))});
 }
 for(const [index,[meaning,...cells]] of inventoryRows(adjectiveInventory[unitId]).entries()){
  addLexical(pack,{id:`${unitId}-a-${index+1}`,unitId,pos:'adjective',meaning,forms:cells.map((lemma,i)=>({lemma,summary:i<2?'Adjective · citation form':'Adjective · uninflected base',note:i<2?'The citation form is masculine singular where gender is distinguished. Agreement forms are not yet supplied for this draft record.':'German predicative adjectives use the uninflected base. Attributive endings depend on the determiner, gender, number and case; they are not supplied by this base-form record.'}))});
 }
 for(const [index,[pos,meaning,...cells]] of inventoryRows(otherInventory[unitId]).entries()){
  addLexical(pack,{id:`${unitId}-x-${index+1}`,unitId,pos,meaning,forms:cells.map(lemma=>({lemma,summary:pos==='expression'?'Fixed expression':pos,note:pos==='expression'?'Learn this as a conventional expression for the stated situation. An ellipsis marks a slot to complete; the recorded expression is the recall target.':'This is the listed contextual sense. Clause position and constructions can differ across languages.'}))});
 }
 for(const l of Object.values(pack.lexemes)){
  const extra=referenceForms[l.id];if(!extra)continue;
  const sourceId=`kaikki-${l.lang}`;pack.sources[sourceId]=courseSources[sourceId];l.sourceIds.push(sourceId);
  if(l.pos==='noun'&&l.lang==='de')for(const f of l.forms)f.case='nominative';
  const seen=new Set(l.forms.map(f=>JSON.stringify(f)));
  for(const f of extra)if(!seen.has(JSON.stringify(f))){l.forms.push(f);seen.add(JSON.stringify(f));}
  const entry=pack.entries.find(e=>e.translations[l.lang].lexemeIds.includes(l.id));
  entry.translations[l.lang].sourceIds=[sourceId];
  if(l.pos==='adjective'){entry.translations[l.lang].chunks[0].detail='The table includes recorded agreement forms from the cited dictionary extraction. Which form fits a sentence depends on its noun and construction; only the displayed citation form is the vocabulary recall target.';for(const w of Object.values(entry.translations[l.lang].wordDetails))w.note=entry.translations[l.lang].chunks[0].detail;}
 }
 for(const l of Object.values(pack.lexemes)){if(l.lang==='de'&&['anderer','nächster','letzter'].includes(l.lemma)){const t=pack.entries.find(e=>e.translations.de.lexemeIds.includes(l.id)).translations.de;for(const c of t.chunks){c.summary='Masculine nominative singular attributive form';c.detail='This recorded form has the strong -er ending, as before a masculine noun without an article. Other determiners and cases require different endings.';}for(const w of Object.values(t.wordDetails)){w.role=t.chunks[0].summary;w.note=t.chunks[0].detail;}}}
 addCourseExamples(pack);
 return pack;
});
