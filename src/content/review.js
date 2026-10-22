import {packs} from './catalog.js';
import {grammarTopicLabel} from './grammar-topics.js';
const pack=packs.find(p=>p.id===new URLSearchParams(location.search).get('pack'))||packs[0];
import {validatePack} from './model.js';
const add=(parent,tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;parent.append(node);return node;};
const picker=document.createElement('select');picker.setAttribute('aria-label','Content pack');for(const p of packs){const option=new Option(p.id,p.id,p.id===pack.id,p.id===pack.id);picker.add(option);}picker.addEventListener('change',()=>{location.search='?pack='+encodeURIComponent(picker.value);});document.querySelector('#validation').before(picker);
const issues=validatePack(pack);
document.querySelector('#pack-preview').href=pack.id.startsWith('course-')?'/learning?pack=course':pack.id==='foundation'?'/learning?pack=foundation':'/learning';
document.querySelector('#validation').textContent=issues.length?issues.join('\n'):`${pack.id} v${pack.version} · Structure valid · ${pack.entries.length} meanings / ${pack.entries.reduce((n,e)=>n+Object.keys(e.translations).length,0)} translations · Draft — no independent reviewer`;
document.querySelector('#blockers').textContent=validatePack(pack,{release:true}).join('\n');
const checked=Object.values(pack.lexemes).filter(l=>l.evidence).length;
if(checked){const summary=add(document.querySelector('#validation').parentElement,'p',`${checked}/${Object.keys(pack.lexemes).length} lexical records source-compared. Each record lists the narrower comparison actually performed; a headword match does not verify its intended sense or every form. Sentence naturalness, teaching prose, regional suitability, and reuse review remain pending.`,'status');document.querySelector('#validation').after(summary);}
for(const entry of pack.entries){
 const article=add(document.querySelector('#entries'),'article');if(grammarTopicLabel(entry))add(article,'p',grammarTopicLabel(entry),'muted');add(article,'h2',entry.prompt);add(article,'p',`${entry.id} · ${entry.senseId} · ${entry.definition}`,'muted');
 const grid=add(article,'div',undefined,'grid');
 for(const [lang,t] of Object.entries(entry.translations)){
  const column=add(grid,'section');add(column,'h3',`${lang.toUpperCase()} · ${t.text}`);add(column,'p',`${t.review.status} · Author: ${t.review.author} · Reviewer: ${t.review.reviewer||'Pending'}`,'status');
  const list=add(column,'ul');
  for(const c of t.chunks.filter(c=>c.meaning)){const li=add(list,'li');add(li,'strong',`${c.text} → ${c.meaning}`);add(li,'p',`${c.summary.replace(/[.]$/,'')}. ${c.detail}`);}
  const details=add(column,'details');add(details,'summary','Word forms and grammar references');
  for(const id of t.lexemeIds){const l=pack.lexemes[id];add(details,'p',`${l.lemma} · ${l.pos}${l.gender?' · '+l.gender:''}`);if(l.evidence)add(details,'p',`Source comparison: ${l.evidence.checks.join(', ')} · ${l.evidence.checkedAt} · ${l.evidence.checkedBy}`,'status');const forms=add(details,'ul');for(const form of l.forms)add(forms,'li',`${form.text} — ${Object.entries(form).filter(([key])=>key!=='text').map(([key,value])=>key==='person'?`person ${value}`:value).join(' · ')}`);}
  for(const id of t.grammarIds){const g=pack.grammar[id];add(details,'p',`${id}: ${g.description} (${g.sourceIds.length?'supporting references attached; independent review pending':'draft; evidence pending'})`);}
  if(t.wordDetails){const words=add(column,'details');add(words,'summary','Contextual word notes');for(const [word,detail] of Object.entries(t.wordDetails)){add(words,'h4',`${word} — ${detail.meaning}`);add(words,'p',`${detail.role}. ${detail.note}`);}}
  add(column,'h4','Supporting references');if(!t.sourceIds.length)add(column,'p','Evidence not yet attached. Authored candidate; not independently verified.','status');
  for(const id of t.sourceIds){const source=pack.sources[id],p=add(column,'p'),link=add(p,'a',source.title);link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';add(p,'small',` · ${source.attribution} · accessed ${source.accessedAt}`);add(p,'small',` — ${source.scope} Reuse review pending.`);}
 }
}
