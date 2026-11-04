import {verbGuide} from './verb-guide.js';
import {esc} from './html.js';
export function stepReferenceForm(lessons,active,row,direction){
 const forms=lessons.flatMap((lesson,index)=>lesson.rows.map((_,slot)=>({active:index,row:slot})));
 if(!forms.length)return {active,row};
 const current=forms.findIndex(f=>f.active===active&&f.row===row);
 if(current<0){
  for(let n=1;n<=lessons.length;n++){const index=(active+direction*n+lessons.length)%lessons.length;
   if(lessons[index].rows.length)return {active:index,row:direction>0?0:lessons[index].rows.length-1};}
 }
 return forms[(current+direction+forms.length)%forms.length];
}
export function stepReferenceChart(lessons,active,row,direction){
 const next=(active+direction+lessons.length)%lessons.length;
 const label=lessons[active].rows[row]?.sourceLabel;
 const match=lessons[next].rows.findIndex(r=>r.sourceLabel===label);
 return {active:next,row:match<0?0:match};
}
export function mountVerbAccordion(host,note,{voice,showHeading=false}={}){
 const groups=verbGuide(note),order=['Indicative','Subjunctive','Commands','Nonfinite forms','Literary & legal'];
 const sections=order.map(title=>groups.find(g=>g.category===title)).filter(Boolean),lessons=sections.flatMap(g=>g.lessons);
 let active=0,row=0,selectedText='';
 host.innerHTML=`${showHeading?'<h2>Forms</h2>':''}<div class="verb-accordion">${sections.map((g,i)=>`<details ${i===0?'open':''}><summary>${esc(g.category==='Commands'?'Imperative':g.category)}</summary><div class="va-grid">${g.lessons.map(l=>`<section class="va-chart" data-chart="${l.id}" tabindex="0" aria-label="${esc(l.title)}"><h3><button class="va-toggle" data-chart-toggle aria-expanded="false">${esc(l.title)}</button></h3><div class="va-rows ${l.rows.length===6?'va-six':''}">${l.rows.map((r,j)=>`<div class="va-row" data-row="${j}" title="${esc(r.sourceLabel)}"><span class="va-zoom-person">${esc(r.sourceLabel)}</span><span>${r.alternatives.map((f,i)=>`<span class="${['pastSubjunctive','pluperfectSubjunctive'].includes(l.id)&&/se(?:s|mos|is|n)?$/.test(f.split(' ')[0].normalize('NFD').replace(/[\u0300-\u036f]/g,''))?'va-expanded-variant':''}">${i?' / ':''}<button data-speak="${esc(f)}" aria-label="${esc(r.sourceLabel+': '+f)}" lang="es">${esc(f)}</button></span>`).join('')}</span></div>`).join('')}</div>${l.notice?`<p>${esc(l.notice)}</p>`:''}${l.note?`<p>${esc(l.note)}</p>`:''}</section>`).join('')}</div></details>`).join('')}<div class="va-navigation"><span><kbd>−</kbd> <kbd>=</kbd> chart &nbsp; <kbd>[</kbd> <kbd>]</kbd> form &nbsp; <kbd>Space</kbd> replay</span><span data-form-label aria-live="polite"></span></div></div>`;
 const abort=new AbortController(),signal=abort.signal;
 let zoom,zoomOrigin,pendingChart;
 const motion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const box=(r,b)=>({left:(r.left-b.left)+'px',top:(r.top-b.top)+'px',width:r.width+'px',height:r.height+'px'});
 function hideZoom(){
  pendingChart=null;
  if(!zoom)return;
  const old=zoom,origin=zoomOrigin,bounds=host.getBoundingClientRect(),current=old.getBoundingClientRect();
  origin?.querySelector('[data-chart-toggle]').setAttribute('aria-expanded','false');
  zoom=null;zoomOrigin=null;
  old.removeAttribute('data-chart');old.style.pointerEvents='none';old.inert=true;
  old.getAnimations().forEach(a=>a.cancel());
  if(motion()&&origin?.isConnected){
   const animation=old.animate([box(current,bounds),box(origin.getBoundingClientRect(),bounds)],{duration:200,easing:'cubic-bezier(.22,.8,.25,1)',fill:'forwards'});
   animation.onfinish=()=>old.remove();
  }else old.remove();
 }
 function enlarge(chart){
  if(chart.classList.contains('va-zoom')||zoom?.dataset.chart===chart.dataset.chart)return;
  hideZoom();
  host.querySelectorAll('.va-zoom').forEach(el=>el.remove());
  const bounds=host.getBoundingClientRect(),rect=chart.getBoundingClientRect(),grid=chart.closest('.va-grid').getBoundingClientRect();
  chart.querySelector('[data-chart-toggle]').setAttribute('aria-expanded','true');
  zoomOrigin=chart;zoom=chart.cloneNode(true);zoom.classList.add('va-zoom');zoom.removeAttribute('tabindex');
  const width=Math.min(285,grid.width);
  zoom.style.width=width+'px';zoom.style.height='auto';zoom.style.visibility='hidden';host.append(zoom);
  const height=Math.min(zoom.getBoundingClientRect().height,grid.height);zoom.style.visibility='';
  const left=Math.max(grid.left,Math.min(rect.left,grid.right-width));
  const top=Math.max(grid.top,Math.min(rect.top,grid.bottom-height));
  const target={left:(left-bounds.left)+'px',top:(top-bounds.top)+'px',width:width+'px',height:height+'px'};
  Object.assign(zoom.style,target);host.append(zoom);
  if(motion())zoom.animate([box(rect,bounds),target],{duration:240,easing:'cubic-bezier(.22,.8,.25,1)'});
 }
 host.classList.add('va-host');
 const studyCard=host.closest('.course-study')||host;
 studyCard.addEventListener('click',e=>{
  if(!zoom||e.target.closest('[data-chart]'))return;
  hideZoom();
 },{signal});
 host.addEventListener('focusin',e=>{if(!e.target.closest('[data-chart]'))hideZoom();},{signal});
 host.addEventListener('keydown',e=>{if(e.key==='Escape'&&zoom){e.preventDefault();e.stopPropagation();hideZoom();}},{signal});
 function select(index,slot=0,{focus=false}={}){
  const next=(index+lessons.length)%lessons.length;
  const keepZoom=zoom?.dataset.chart===lessons[next].id;
  if(!keepZoom)hideZoom();
  active=(index+lessons.length)%lessons.length;const lesson=lessons[active];row=lesson.rows.length?(slot+lesson.rows.length)%lesson.rows.length:0;
  const chart=host.querySelector(`.va-grid [data-chart="${lesson.id}"]`);
  transitionCategory(chart.closest('details'),true);
  host.querySelectorAll('[data-chart]').forEach(c=>{c.classList.toggle('va-active',c.dataset.chart===chart.dataset.chart);c.querySelectorAll('[data-row]').forEach(r=>r.classList.toggle('va-selected',c.dataset.chart===chart.dataset.chart&&Number(r.dataset.row)===row));});
  selectedText=lesson.rows[row]?.alternatives[0]||'';
  host.querySelector('[data-form-label]').textContent=lesson.rows[row]?lesson.rows[row].sourceLabel+' · '+lesson.rows[row].alternatives[0]:'';
  if(focus){
   chart.focus({preventScroll:true});
   if(categoryAnimations.length)pendingChart=chart;
   else {chart.scrollIntoView({block:'nearest',inline:'nearest'});enlarge(chart);}
  }
 }
 let categoryAnimations=[],categoryTimer;
 let targetCategory=host.querySelector('details[open]');
 function settleCategories(){
  clearTimeout(categoryTimer);
  for(const finish of categoryAnimations)finish();categoryAnimations=[];
 }
 function animateCategory(detail,opening){
  const start=detail.getBoundingClientRect().height;
  detail.open=true;
  const end=opening?detail.getBoundingClientRect().height:detail.querySelector('summary').getBoundingClientRect().height+1;
  if(!motion()){detail.open=opening;return;}
  const animation=detail.animate([{height:start+'px'},{height:end+'px'}],{duration:220,easing:'cubic-bezier(.22,.8,.25,1)'});
  detail.style.overflow='hidden';
  let done=false;
  const finish=()=>{if(done)return;done=true;animation.cancel();detail.style.overflow='';detail.open=opening;};
  animation.onfinish=finish;categoryAnimations.push(finish);
 }
 function transitionCategory(detail,opening){
  const target=opening?detail:null;
  if(targetCategory===target)return;
  settleCategories();targetCategory=target;
  for(const d of host.querySelectorAll('details'))if(d===detail||d.open)animateCategory(d,d===target);
  categoryTimer=setTimeout(()=>{
   settleCategories();
   const chart=pendingChart;pendingChart=null;
   if(chart?.isConnected&&chart.closest('details')===targetCategory){chart.scrollIntoView({block:'nearest',inline:'nearest'});enlarge(chart);}
  },motion()?230:0);
 }
 host.addEventListener('click',e=>{
  const summary=e.target.closest('summary');
  if(summary){
   e.preventDefault();hideZoom();
   const detail=summary.parentElement,opening=targetCategory!==detail;
   if(opening){
    active=lessons.findIndex(l=>l.id===detail.querySelector('[data-chart]').dataset.chart);row=0;
    selectedText=lessons[active].rows[0]?.alternatives[0]||'';
    host.querySelectorAll('.va-grid [data-chart]').forEach(c=>{c.classList.toggle('va-active',c.dataset.chart===lessons[active].id);c.querySelectorAll('[data-row]').forEach(r=>r.classList.toggle('va-selected',c.dataset.chart===lessons[active].id&&Number(r.dataset.row)===0));});
    host.querySelector('[data-form-label]').textContent=lessons[active].rows[0]?lessons[active].rows[0].sourceLabel+' · '+selectedText:'';
   }
   transitionCategory(detail,opening);
   return;
  }
  const cell=e.target.closest('[data-row]');
  if(cell&&!e.target.closest('[data-speak]')){
   e.stopPropagation();cell.querySelector('[data-speak]')?.click();return;
  }
  const c=e.target.closest('[data-chart]');
  if(!c){hideZoom();return;}
  if(zoom?.dataset.chart===c.dataset.chart&&!e.target.closest('[data-speak]')){
   const origin=zoomOrigin;hideZoom();origin.querySelector('[data-chart-toggle]').focus({preventScroll:true});return;
  }
  select(lessons.findIndex(l=>l.id===c.dataset.chart),Number(e.target.closest('[data-row]')?.dataset.row||0),{focus:true});
  const spoken=e.target.closest('[data-speak]');
  if(spoken){selectedText=spoken.dataset.speak;host.querySelector('[data-form-label]').textContent=lessons[active].rows[row].sourceLabel+' · '+selectedText;}
 },{signal});
 host.addEventListener('keydown',e=>{
  if(e.target.matches('.va-chart')&&e.key==='Enter'){e.preventDefault();e.target.querySelector('[data-chart-toggle]').click();}
 },{signal});
 document.addEventListener('keydown',e=>{
  const owner=host.closest('dialog'),dialogs=[...document.querySelectorAll('dialog[open]')];
  if((dialogs.length?dialogs.at(-1)!==owner:Boolean(owner))||e.defaultPrevented||e.isComposing||e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target.closest('input,textarea,select,[contenteditable=true]')||!['-','=','[',']',' '].includes(e.key))return;
  if(e.key===' '&&!e.target.matches('.va-chart'))return;
  e.preventDefault();e.stopPropagation();voice?.stop();
  if(e.key==='-'||e.key==='='){
   const next=stepReferenceChart(lessons,active,row,e.key==='='?1:-1);
   select(next.active,next.row,{focus:true});
  }
  else if(e.key!==' '){
   const next=stepReferenceForm(lessons,active,row,e.key===']'?1:-1);
   select(next.active,next.row,{focus:true});
  }
  if(e.key===' '){
   const replay=[...(zoom||host.querySelector(`.va-grid [data-chart="${lessons[active].id}"]`)).querySelectorAll('[data-speak]')].find(b=>b.dataset.speak===selectedText);
   replay?.click();return;
  }
  const selected=zoom?.querySelector(`[data-row="${row}"] [data-speak]`)||host.querySelector(`.va-grid [data-chart="${lessons[active].id}"] [data-row="${row}"] [data-speak]`);
  selected?.click();
 },{capture:true,signal});
 select(0);
 return ()=>{settleCategories();hideZoom();abort.abort();};
}
