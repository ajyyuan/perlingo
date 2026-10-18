import {readingPilot as pack} from './reading-pilot.js';
import {validatePack} from './model.js';
const add=(parent,tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;parent.append(node);return node;};
const issues=validatePack(pack);
document.querySelector('#validation').textContent=issues.length?issues.join('\n'):`${pack.id} v${pack.version} · Structure valid · ${pack.entries.length} meanings / ${pack.entries.reduce((n,e)=>n+Object.keys(e.translations).length,0)} translations · Draft — no independent reviewer`;
document.querySelector('#blockers').textContent=validatePack(pack,{release:true}).join('\n');
for(const entry of pack.entries){
 const article=add(document.querySelector('#entries'),'article');add(article,'h2',entry.prompt);add(article,'p',`${entry.id} · ${entry.senseId} · ${entry.definition}`,'muted');
 const grid=add(article,'div',undefined,'grid');
 for(const [lang,t] of Object.entries(entry.translations)){
  const column=add(grid,'section');add(column,'h3',`${lang.toUpperCase()} · ${t.text}`);add(column,'p',`${t.review.status} · Author: ${t.review.author} · Reviewer: ${t.review.reviewer||'Pending'}`,'status');
  const list=add(column,'ul');
  for(const c of t.chunks.filter(c=>c.meaning)){const li=add(list,'li');add(li,'strong',`${c.text} → ${c.meaning}`);add(li,'p',`${c.summary.replace(/[.]$/,'')}. ${c.detail}`);}
  const details=add(column,'details');add(details,'summary','Word forms and grammar references');
  for(const id of t.lexemeIds){const l=pack.lexemes[id];add(details,'p',`${l.lemma} · ${l.pos}${l.gender?' · '+l.gender:''}`);const forms=add(details,'ul');for(const form of l.forms)add(forms,'li',`${form.text} — ${Object.entries(form).filter(([key])=>key!=='text').map(([key,value])=>key==='person'?`person ${value}`:value).join(' · ')}`);}
  for(const id of t.grammarIds)add(details,'p',`${id}: ${pack.grammar[id].description} (draft; evidence pending)`);
  add(column,'h4','Lexical references');
  for(const id of t.sourceIds){const source=pack.sources[id],p=add(column,'p'),link=add(p,'a',source.title);link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';add(p,'small',` · ${source.attribution} · accessed ${source.accessedAt}`);}
 }
}
