const languages=['es','fr','de'];
const present=value=>typeof value==='string'&&value.trim().length>0;
export function validatePack(pack,{release=false}={}){
 const errors=[];
 const require=(condition,message)=>{if(!condition)errors.push(message);};
 const refs=(ids,collection,label,lang)=>{
  require(Array.isArray(ids),`${label}: reference list required`);
  for(const id of ids||[])require(Boolean(collection?.[id])&&(!lang||collection[id].lang===lang),`${label}: invalid reference ${id}`);
 };
 const review=(record,label)=>{
  const r=record.review;
  require(['draft','in-review','approved'].includes(r?.status)&&present(r?.author),`${label}: invalid review metadata`);
  if(r?.status==='approved')require(present(r.reviewer)&&/^\d{4}-\d{2}-\d{2}$/.test(r.reviewedAt||''),`${label}: approval needs reviewer and date`);
  if(release){require(r?.status==='approved',`${label}: not approved`);require(record.sourceIds?.length>0,`${label}: evidence sources required`);}
 };
 require(pack.schemaVersion===1,'Unsupported schemaVersion');
 require(present(pack.id)&&Number.isInteger(pack.version)&&pack.version>0,'Pack ID and positive version required');
 for(const [id,s] of Object.entries(pack.sources||{})){if(release)require(s.reuseReviewed===true,`Source ${id}: reuse terms not reviewed`);require(present(s.title)&&/^https:\/\//.test(s.url||'')&&present(s.accessedAt)&&present(s.attribution)&&present(s.license)&&present(s.scope),`Source ${id}: incomplete provenance`);}
 for(const [id,l] of Object.entries(pack.lexemes||{})){
  require(l.id===id&&languages.includes(l.lang)&&['noun','verb','pronoun','determiner','adverb','adjective','preposition','conjunction'].includes(l.pos)&&present(l.lemma)&&present(l.senseId),`Lexeme ${id}: invalid identity`);
  require(Array.isArray(l.forms)&&l.forms.length>0&&l.forms.every(f=>present(f.text)),`Lexeme ${id}: forms required`);
  if(l.pos==='noun')require(['masculine','feminine','neuter'].includes(l.gender),`Lexeme ${id}: gender required`);
  refs(l.sourceIds,pack.sources,id);review(l,id);
 }
 for(const [id,g] of Object.entries(pack.grammar||{})){
  require(g.id===id&&languages.includes(g.lang)&&present(g.description),`Grammar ${id}: invalid identity`);refs(g.sourceIds,pack.sources,id);review(g,id);
 }
 const seen=new Set();
 require(Array.isArray(pack.entries)&&pack.entries.length>0,'Entries required');
 for(const e of pack.entries||[]){
  require(present(e.id)&&!seen.has(e.id),`Duplicate or missing entry ID: ${e.id}`);seen.add(e.id);
  require(present(e.senseId)&&present(e.definition)&&present(e.prompt)&&['noun','verb','sentence','grammar'].includes(e.type),`${e.id}: incomplete meaning`);
  for(const lang of languages){
   const t=e.translations?.[lang];require(Boolean(t),`${e.id}: missing ${lang}`);if(!t)continue;
   for(const [word,detail] of Object.entries(t.wordDetails||{})){
    require(t.text.includes(word)&&present(detail.meaning)&&present(detail.role)&&present(detail.note),`${e.id}/${lang}: invalid word detail ${word}`);
    if(detail.lexeme)refs([detail.lexeme],pack.lexemes,`${e.id}/${lang}`,lang);
   }
   const label=`${e.id}/${lang}`;require(present(t.text),`${label}: text required`);review(t,label);
   refs(t.sourceIds,pack.sources,label);refs(t.lexemeIds,pack.lexemes,label,lang);refs(t.grammarIds,pack.grammar,label,lang);
   require(Array.isArray(t.chunks)&&t.chunks.length>0,`${label}: chunks required`);
   require(t.chunks?.map(c=>c.text).join('')===t.text,`${label}: chunks do not reconstruct translation`);
   for(const c of t.chunks||[]){
    require(present(c.text)||/^\s+$/.test(c.text),`${label}: empty chunk`);
    if(c.meaning){require(present(c.summary)&&present(c.detail),`${label}: explanation required`);refs(c.lexemeIds,pack.lexemes,label,lang);refs(c.grammarIds,pack.grammar,label,lang);}
    else require(!/[\p{L}\p{N}]/u.test(c.text),`${label}: unexplained word`);
   }
  }
 }
 return errors;
}
export function assertPack(pack,options){const errors=validatePack(pack,options);if(errors.length)throw new Error(errors.join('\n'));return pack;}
export function lessonEntries(pack){
 assertPack(pack);
 return pack.entries.map(e=>({id:e.id,type:e.type,en:e.prompt,...Object.fromEntries(languages.map(lang=>[lang,e.translations[lang].text]))}));
}
// A future release exporter must use this gate, not the migration adapter above.
export function approvedEntries(pack){assertPack(pack,{release:true});return lessonEntries(pack);}
