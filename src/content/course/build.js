// Compact authoring syntax. No machine translation, inferred word analysis, or network calls.
const langs=['es','fr','de'];
export const draft=()=>({status:'draft',author:'Codex',reviewer:null,reviewedAt:null,notes:'Authored teaching material. Source checks are recorded separately and scoped to the claims checked.'});
export function createCoursePack(id){return {schemaVersion:1,id,version:1,origin:'Authored course content; no claimed frequency rank or independent linguistic approval.',sources:{},lexemes:{},grammar:{},entries:[]};}
export function addLexical(pack,{id,unitId,pos,meaning,definition=meaning,forms,topic='subject-verb-agreement',note='',sourceIds={}}){
 const entry={id:`course-${id}`,unitId,senseId:`course.${id}`,type:pos==='noun'?'noun':pos==='verb'?'verb':'sentence',kind:'vocabulary',prompt:pos==='verb'?`to ${meaning}`:meaning,definition,translations:{}};
 langs.forEach((lang,i)=>{
  const f=forms[i],lexemeId=`${lang}.${id}`,lemma=f.lemma,text=f.text||lemma;
  const lexeme={id:lexemeId,lang,lemma,pos:f.pos||pos,senseId:entry.senseId,unitId,forms:f.forms||[{text:lemma}],...(f.gender?{gender:f.gender}:{}),...(f.paradigm?{paradigm:f.paradigm}:{}),sourceIds:sourceIds[lang]||[],review:draft()};
  pack.lexemes[lexemeId]=lexeme;
  const summary=f.summary||pos,detail=f.note||note||definition;
  entry.translations[lang]={text,acceptedAnswers:f.acceptedAnswers||[],lexemeIds:[lexemeId],grammarIds:[],sourceIds:lexeme.sourceIds,review:draft(),chunks:[{text,meaning:pos==='noun'?`(the) ${meaning}`:pos==='verb'?`(to) ${meaning}`:meaning,summary,detail,lexemeIds:[lexemeId],grammarIds:[]}],wordDetails:f.wordDetails||(!lemma.includes(' ')?{[lemma]:{lexeme:lexemeId,meaning,role:summary,note:detail}}:{})};
 });
 pack.entries.push(entry);return entry;
}
export const noun=(lemma,plural,gender,article)=>({lemma,text:article.endsWith('’')?article+lemma:`${article} ${lemma}`,gender,forms:[{text:lemma,number:'singular'},{text:plural,number:'plural'}],summary:`${gender} singular noun`,note:`Learn ${lemma} with ${article}. The table gives its singular and plural forms.`,wordDetails:{[lemma]:{features:{number:'singular'},meaning:lemma,role:`Noun · ${gender} singular`,note:'The article identifies the grammatical gender; see the phrase gloss for its English meaning.'},...(article==='l’'?{}:{[article]:{meaning:'the',role:'Definite article',note:'The definite article agrees with the noun. German isolated noun entries use nominative case.'}})}});
export function verb(lemma,finite,lang,note=''){
 const subjects={es:['yo','tú','él / ella / usted','nosotros / nosotras','vosotros / vosotras','ellos / ellas / ustedes'],fr:['je','tu','il / elle / on','nous','vous','ils / elles'],de:['ich','du','er / sie / es','wir','ihr','sie / Sie']}[lang];
 return {lemma,forms:[{text:lemma,verbForm:'infinitive'},...finite.map((text,i)=>({text,subject:subjects[i],person:i%3+1,number:i<3?'singular':'plural',verbForm:'finite',mood:'indicative',tense:'present'}))],paradigm:{complete:true,mood:'indicative',tense:'present',note},summary:'Infinitive',note:note||'The base form names an action or state without specifying a subject.'};
}
export function addExample(pack,{id,unitId,objectiveId,prompt,definition,translations,mode='production',situation}){
 const entry={id:`course-${id}`,senseId:`course.${id}`,unitId,objectiveId,kind:'example',mode,situation,type:'grammar',grammarTopic:'subject-verb-agreement',prompt,definition,translations:{}};
 for(const lang of langs){
  const t=translations[lang];entry.translations[lang]={acceptedAnswers:[],lexemeIds:[],grammarIds:[],sourceIds:[],wordDetails:{},review:draft(),...t};
 }
 pack.entries.push(entry);return entry;
}
