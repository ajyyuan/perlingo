import {esc} from './html.js';
import {verbGuide} from './verb-guide.js';

export function guideOverview(note,{rare=false}={}){
 const lessons=new Map(verbGuide(note).flatMap(s=>s.lessons).map(l=>[l.id,l]));
 if(!lessons.size)return null;
 const pick=ids=>ids.map(id=>lessons.get(id)).filter(Boolean);
 const nonfinite=lessons.get('nonfinite');
 const participle=(id,title,label)=>({id,title,rows:nonfinite.rows.filter(r=>r.sourceLabel===label),note:id==='participle'?nonfinite.note:undefined});
 return {
  top:pick(['present','imperfect','preterite','perfect','pastPerfect','future','futurePerfect','conditional','conditionalPerfect',...(rare?['pastAnterior']:[])]),
  bottom:[...pick(['subjunctive','pastSubjunctive','perfectSubjunctive','pluperfectSubjunctive',...(rare?['futureSubjunctive','futurePerfectSubjunctive']:[])]),participle('participle','Past participle','Past participle'),participle('gerund','Gerund · -ing','Gerund'),...pick(['commands','negative'])],
  nonfinite
 };
}
export function openVerbGuide(note){
 if(!guideOverview(note))return;
 const anchor=document.activeElement;
 const dialog=document.createElement('dialog');dialog.className='verb-guide';dialog.dataset.layout='columns';dialog.setAttribute('aria-label',note.word+' verb guide');
 dialog.innerHTML=`<header class="vg-header"><div><small>Verb guide · infinitive</small><h2 lang="es">${esc(note.word)}</h2></div><div class="vg-controls"><label><input type="checkbox" data-rare> Rare tenses</label><button class="plain vg-close" type="button" aria-label="Close verb guide">×</button></div></header><div class="vg-overview"></div><footer class="vg-sources"><details><summary>Sources</summary><a href="https://en.wiktionary.org/wiki/${encodeURIComponent(note.word)}#Spanish" target="_blank" rel="noopener">Wiktionary ↗</a> · <a href="https://www.rae.es/diccionario-estudiante/docs/conjugaciones-verbales.pdf" target="_blank" rel="noopener">RAE · conjugation models ↗</a></details></footer>`;
 document.body.append(dialog);
 let overview,lessons,keyboardNavigation=false;
 function hide(){for(const tile of dialog.querySelectorAll('.vg-tile')){tile.classList.remove('is-expanded');}}
 function enlarge(tile,id){
  const lesson=lessons.get(id);if(!lesson)return;
  if(tile.classList.contains('is-expanded'))return;
  hide();
  const slot=tile.parentElement.getBoundingClientRect(),bounds=dialog.getBoundingClientRect();
  const width=Math.min(330,bounds.width-32),height=Math.min(280,bounds.height-100);
  const left=Math.max(bounds.left+16,Math.min(slot.left+(slot.width-width)/2,bounds.right-width-16));
  const top=Math.max(bounds.top+72,Math.min(slot.top+(slot.height-height)/2,bounds.bottom-height-24));
  tile.style.setProperty('--zoom-width',width+'px');tile.style.setProperty('--zoom-height',height+'px');
  tile.style.setProperty('--zoom-x',(left-slot.left)+'px');tile.style.setProperty('--zoom-y',(top-slot.top)+'px');
  tile.classList.add('is-expanded');
 }
 function render(){
  hide();overview=guideOverview(note,{rare:dialog.querySelector('[data-rare]').checked});lessons=new Map([...overview.top,...overview.bottom,overview.nonfinite].map(l=>[l.id,l]));
  const tiles=(list,short=false)=>list.map(l=>`<div class="vg-slot"><button type="button" class="vg-tile ${l.rows.length===6?'vg-six':''} ${l.id==='nonfinite'?'vg-nonfinite':''}" data-lesson="${esc(l.id)}" aria-label="${esc(l.title)}" aria-describedby="vg-forms-${esc(l.id)}"><span class="vg-title">${esc(short?l.title.replace(/ subjunctive/,'').replace(' commands',''):l.title)}</span><span class="vg-full" id="vg-forms-${esc(l.id)}">${(l.rows.length===6?[l.rows[0],l.rows[3],l.rows[1],l.rows[4],l.rows[2],l.rows[5]]:l.rows).map(r=>`<span class="vg-full-row"><span>${esc(r.sourceLabel)}</span><span lang="es">${r.alternatives.map(form=>`<span class="vg-alt">${esc(form)}</span>`).join('')}</span></span>`).join('')}${l.notice?`<span>${esc(l.notice)}</span>`:''}${l.note?`<span class="vg-note">${esc(l.note)}</span>`:''}</span></button></div>`).join('');
  const cluster=(title,list,weight,short=false)=>`<section class="vg-cluster" style="--weight:${weight}"><h3>${title}</h3><div class="vg-strip">${tiles(list,short)}</div></section>`;
  const subj=overview.bottom.slice(0,-4),nonfinite=[overview.nonfinite],commands=overview.bottom.slice(-2);
  dialog.querySelector('.vg-overview').innerHTML=cluster('Indicative',overview.top,9)+`<div class="vg-lower">${cluster('Subjunctive',subj,subj.length,true)}${cluster('Imperative',commands,2,true)}${cluster('Nonfinite forms',nonfinite,1)}</div>`;
 }
 render();
 dialog.addEventListener('pointerover',e=>{if(e.pointerType==='touch'||keyboardNavigation)return;const tile=e.target.closest('[data-lesson]');if(tile)enlarge(tile,tile.dataset.lesson);});
 dialog.addEventListener('pointermove',e=>{if(e.movementX||e.movementY){keyboardNavigation=false;const tile=e.target.closest('[data-lesson]');if(tile)enlarge(tile,tile.dataset.lesson);}});
 dialog.addEventListener('pointerout',e=>{if(keyboardNavigation)return;const tile=e.target.closest('[data-lesson]');if(tile&&!tile.contains(e.relatedTarget)&&document.activeElement!==tile)hide();});
 dialog.addEventListener('focusin',e=>{const tile=e.target.closest('[data-lesson]');if(tile)enlarge(tile,tile.dataset.lesson);else hide();});
 dialog.addEventListener('focusout',hide);
 dialog.addEventListener('click',e=>{
  const tile=e.target.closest('[data-lesson]');if(tile)enlarge(tile,tile.dataset.lesson);
  if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}
 });
 dialog.addEventListener('keydown',e=>{
  const tile=e.target.closest('[data-lesson]');if(!tile||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
  const all=[...dialog.querySelectorAll('[data-lesson]')],i=all.indexOf(tile);
  let next=i;
  if(e.key==='ArrowLeft')next=Math.max(0,i-1);
  if(e.key==='ArrowRight')next=Math.min(all.length-1,i+1);
  if(e.key==='ArrowUp'||e.key==='ArrowDown'){
   const r=tile.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,down=e.key==='ArrowDown';
   const candidates=all.map((node,index)=>{const b=node.getBoundingClientRect();return {index,x:b.left+b.width/2,y:b.top+b.height/2};}).filter(b=>down?b.y>y+10:b.y<y-10).sort((a,b)=>(Math.abs(a.y-y)*3+Math.abs(a.x-x))-(Math.abs(b.y-y)*3+Math.abs(b.x-x)));
   if(candidates.length)next=candidates[0].index;
  }
  if(e.key==='Home')next=0;if(e.key==='End')next=all.length-1;
  e.preventDefault();e.stopPropagation();keyboardNavigation=true;all[next].focus();
 });
 dialog.querySelector('[data-rare]').addEventListener('change',render);
 dialog.querySelector('.vg-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{dialog.remove();if(anchor?.isConnected)anchor.focus();},{once:true});
 dialog.showModal();
}
