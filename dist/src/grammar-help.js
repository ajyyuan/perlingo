import {openHelp} from './help-overlay.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const grammarTerms={
 'definite article':'An article for something identified or specific, like “the.” Its form may depend on the noun and its role in the sentence.',
 'indefinite article':'An article introducing an unspecified member of a group, like “a” or “an.”',
 'noun':'A word naming a person, thing, place, or idea.',
 'verb':'A word expressing an action, event, or state.',
 'adjective':'A word describing a noun, such as “small” in “a small book.”',
 'adverb':'A word modifying a verb, adjective, or another adverb, such as “slowly.”',
 'pronoun':'A word referring to a person or thing without repeating its noun, such as “she” or “it.”',
 'determiner':'A word accompanying a noun to specify which one or how many, such as “the,” “my,” or “some.”',
 'preposition':'A word expressing a relationship, such as “in,” “with,” or “to.”',
 'article':'A type of determiner, such as “the” or “a.”',
 'present indicative':'Present describes now, habits, or general truths. Indicative presents something as a statement or question about reality. Example: “I read every day.”',
 'indicative':'A verb mood used to state or ask about something presented as real: “She reads.”',
 'subjunctive':'A verb mood often used for wishes, doubts, possibilities, or requirements. Its uses depend on the language.',
 'imperative':'A verb form for an instruction or request: “Read this.”',
 'infinitive':'The basic, unconjugated verb form: “to read.”',
 'present':'A tense commonly used for now, habits, and general truths.',
 'preterite':'A past tense commonly used to present an event as completed.',
 'imperfect':'A past tense commonly used for ongoing situations, background, or habits.',
 'perfect':'A form that looks back on a completed event from a reference time; its exact uses differ by language.',
 'future':'A tense commonly used for events that have not happened yet.',
 'conditional':'A form often used for hypothetical situations or polite requests: “I would read.”',
 'person 1':'First person: the speaker — I or we.',
 'person 2':'Second person: the person addressed — you.',
 'person 3':'Third person: someone or something else — he, she, it, or they.',
 'singular':'One person or thing.', 'plural':'More than one person or thing.',
 'masculine':'A grammatical gender category. For objects, it does not mean biologically male.',
 'feminine':'A grammatical gender category. For objects, it does not mean biologically female.',
 'neuter':'A grammatical gender category, distinct from masculine and feminine.',
 'nominative':'A case commonly used for the subject: who or what performs the action.',
 'accusative':'A case commonly used for a direct object; some prepositions also require it.',
 'dative':'A case often used for a recipient or indirect object; some verbs and prepositions require it.',
 'genitive':'A case commonly used to express possession or an “of” relationship.'
};
const pattern=new RegExp('\\b('+Object.keys(grammarTerms).sort((a,b)=>b.length-a.length).join('|')+')\\b','gi');
export function grammarMarkup(text){
 let last=0,html='';for(const m of String(text).matchAll(pattern)){html+=esc(text.slice(last,m.index))+`<span class="grammar-term"><button type="button" class="grammar-link" data-grammar aria-haspopup="dialog">${esc(m[0])}</button><span class="grammar-definition" hidden>${esc(grammarTerms[m[0].toLowerCase()])}</span></span>`;last=m.index+m[0].length;}return html+esc(text.slice(last));
}
export function bindGrammar(host){host.addEventListener('click',e=>{const button=e.target.closest('[data-grammar]');if(!button)return;openHelp(button.textContent,button.nextElementSibling.innerHTML,button);});}
