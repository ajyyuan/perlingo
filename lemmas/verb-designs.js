import {verbGuide} from './verb-guide.js';
import {esc} from './html.js';
export const designs=[
 ['Quiet atlas','All forms, grouped into three equal columns.','atlas'],
 ['Horizontal bands','One band per mood; compact tables sit side by side.','bands'],
 ['Conjugation matrix','Subjects share rows; tenses share columns.','matrix'],
 ['Mood tabs','One mood at a time, with room for readable tables.','tabs'],
 ['Reference browser','A quiet tense list beside one generous table.','browser'],
 ['Fixed inspector','Hover a compact tile; a stationary panel shows its details.','inspector'],
 ['Bottom drawer','Select a tense; its table opens in a reserved bottom panel.','drawer'],
 ['Folded families','Expand only the mood you want to explore.','accordion'],
 ['Dictionary ledger','Tenses form a compact list with inline expansion.','ledger'],
 ['Simple + compound','Related simple and compound forms sit beside each other.','pairs'],
 ['Singular / plural','Switch between two clearly labeled sets of persons.','number'],
 ['One person at a time','Compare all tenses for a selected grammatical person.','person'],
 ['Magnifying atlas','Compact tiles magnify on hover without moving the frame.','magnifier'],
 ['Two-table comparison','Choose any two constructions and compare them directly.','compare'],
 ['Index + table','A minimal index opens full tables on demand.','index']
];
let current=-1,sections=[],lessons=[],active='present',mood='Indicative',plural=false,person=0;
const lab=document.querySelector('#lab');
function refreshData(){
 const word=document.querySelector('#verb').value;
 sections=verbGuide({id:`corpes:${word}:V`,word}).filter(s=>document.querySelector('#rare').checked||s.category!=='Literary & legal');
 lessons=sections.flatMap(s=>s.lessons);if(!lessons.some(l=>l.id===active))active='present';
}
function lesson(id){return lessons.find(l=>l.id===id)||lessons[0];}
function rows(l){return l.rows.length===6?[l.rows[0],l.rows[3],l.rows[1],l.rows[4],l.rows[2],l.rows[5]]:l.rows;}
function full(l){return `<h3>${esc(l.title)}</h3>${l.rows.length?`<table><tbody>${l.rows.map(r=>`<tr><th scope="row">${esc(r.sourceLabel)}</th><td lang="es">${r.alternatives.map(esc).join(' / ')}</td></tr>`).join('')}</tbody></table>`:`<p>${esc(l.notice||'Not used for this meaning.')}</p>`}${l.note?`<p class="subtle">${esc(l.note)}</p>`:''}`;}
function preview(l,mode='mini'){
 return `<button class="tile ${mode}" data-id="${esc(l.id)}"><strong>${esc(l.title)}</strong><span class="forms ${l.rows.length===6?'six':''}" lang="es">${rows(l).map(r=>`<span>${esc(r.alternatives[0])}${r.alternatives.length>1?' / …':''}</span>`).join('')||esc(l.notice||'Not used for this meaning.')}</span></button>`;
}
function family(s,body){return `<section class="family"><h3 class="family-title">${esc(s.category)}</h3>${body}</section>`;}
function allTiles(){return sections.map(s=>family(s,`<div class="tiles">${s.lessons.map(l=>preview(l)).join('')}</div>`)).join('');}
const pickOptions=id=>lessons.map(l=>`<option value="${esc(l.id)}" ${l.id===id?'selected':''}>${esc(l.title)}</option>`).join('');
function view(kind){
 const finite=sections.filter(s=>s.category!=='Nonfinite forms');
 if(kind==='atlas'||kind==='magnifier')return `<div class="atlas">${allTiles()}</div>`;
 if(kind==='bands')return `<div class="bands">${allTiles()}</div>`;
 if(kind==='matrix')return `<div class="matrix">${sections.map(s=>family(s,`<div class="table-scroll"><table><thead><tr><th scope="col">Subject / form</th>${s.lessons.map(l=>`<th scope="col"><button data-id="${l.id}">${esc(l.title)}</button></th>`).join('')}</tr></thead><tbody>${[...new Set(s.lessons.flatMap(l=>l.rows.map(r=>r.sourceLabel)))].map(label=>`<tr><th scope="row">${esc(label)}</th>${s.lessons.map(l=>`<td lang="es">${esc(l.rows.find(r=>r.sourceLabel===label)?.alternatives.join(' / ')||'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`)).join('')}</div>`;
 if(kind==='tabs')return `<nav class="mood-tabs" aria-label="Mood">${sections.map(s=>`<button data-mood="${esc(s.category)}" aria-pressed="${s.category===mood}">${esc(s.category)}</button>`).join('')}</nav><div class="readable-grid">${(sections.find(s=>s.category===mood)||sections[0]).lessons.map(l=>`<section>${full(l)}</section>`).join('')}</div>`;
 if(kind==='browser')return `<div class="reference"><nav aria-label="Tense">${sections.map(s=>family(s,s.lessons.map(l=>`<button data-select="${l.id}" aria-pressed="${l.id===active}">${esc(l.title)}</button>`).join(''))).join('')}</nav><article id="inspector">${full(lesson(active))}</article></div>`;
 if(kind==='inspector')return `<div class="inspect-layout"><div class="inspect-index">${allTiles()}</div><article id="inspector" aria-live="polite">${full(lesson(active))}</article></div>`;
 if(kind==='drawer')return `<div class="drawer-index">${sections.map(s=>family(s,`<div class="chips">${s.lessons.map(l=>`<button data-select="${l.id}" aria-pressed="${l.id===active}">${esc(l.title)}</button>`).join('')}</div>`)).join('')}</div><article class="bottom-panel" id="inspector">${full(lesson(active))}</article>`;
 if(kind==='accordion')return `<div class="accordions">${sections.map(s=>`<details ${s.category==='Indicative'?'open':''}><summary>${esc(s.category)} <small>${s.lessons.length} tables</small></summary><div class="tiles">${s.lessons.map(l=>preview(l)).join('')}</div></details>`).join('')}</div>`;
 if(kind==='ledger')return `<div class="ledger">${sections.map(s=>family(s,s.lessons.map(l=>`<details><summary><span>${esc(l.title)}</span><span lang="es">${esc(l.rows[0]?.alternatives[0]||'—')}</span></summary>${full(l)}</details>`).join(''))).join('')}</div>`;
 if(kind==='pairs'){
  const pairs=[['present','perfect'],['imperfect','pastPerfect'],['future','futurePerfect'],['conditional','conditionalPerfect'],['subjunctive','perfectSubjunctive'],['pastSubjunctive','pluperfectSubjunctive']];
  const used=new Set(pairs.flat());
  return `<div class="pair-head"><span>Simple</span><span>Compound</span></div><div class="pairs">${pairs.map(pair=>`<div class="pair">${pair.map(id=>lessons.some(l=>l.id===id)?preview(lesson(id)):'').join('')}</div>`).join('')}</div><section class="family"><h3 class="family-title">Other forms</h3><div class="tiles">${lessons.filter(l=>!used.has(l.id)).map(l=>preview(l)).join('')}</div></section>`;
 }
 if(kind==='number')return `<nav class="mood-tabs" aria-label="Number"><button data-number="singular" aria-pressed="${!plural}">Singular</button><button data-number="plural" aria-pressed="${plural}">Plural</button></nav><div class="number-grid">${finite.map(s=>family(s,`<div class="tiles">${s.lessons.map(l=>{
  const chosen=l.rows.filter(r=>plural?/nosotros|vosotros|ellos|ustedes/.test(r.sourceLabel):!/nosotros|vosotros|ellos|ustedes/.test(r.sourceLabel));
  return `<section>${full({...l,rows:chosen,notice:l.notice||'No forms in this number for the meaning taught.'})}</section>`;
 }).join('')}</div>`)).join('')}${sections.filter(s=>s.category==='Nonfinite forms').map(s=>family(s,s.lessons.map(l=>full(l)).join(''))).join('')}</div>`;
 if(kind==='person')return `<nav class="mood-tabs" aria-label="Person">${['yo','tú','él / ella / usted','nosotros','vosotros','ellos / ustedes'].map((p,i)=>`<button data-person="${i}" aria-pressed="${person===i}">${p}</button>`).join('')}</nav><div class="person-grid">${finite.map(s=>family(s,`<div class="tiles">${s.lessons.map(l=>{
   const labels=[/^yo$/,/^tú$/,/él|^usted$/,/nosotros/,/vosotros/,/ellos|^ustedes$/];const row=l.rows.find(r=>labels[person].test(r.sourceLabel));
   return `<button class="tile person-tile" data-id="${l.id}"><strong>${esc(l.title)}</strong><span lang="es">${esc(row?.alternatives.join(' / ')||'—')}</span></button>`;
  }).join('')}</div>`)).join('')}${sections.filter(s=>s.category==='Nonfinite forms').map(s=>family(s,s.lessons.map(l=>preview(l)).join(''))).join('')}</div>`;
 if(kind==='compare')return `<div class="comparison">${['present','perfect'].map((id,i)=>`<section><select aria-label="${i?'Right':'Left'} construction" data-compare="${i}">${pickOptions(id)}</select><article id="compare-${i}">${full(lesson(id))}</article></section>`).join('')}</div><p class="subtle">Every construction is available in either selector.</p>`;
 return `<div class="minimal-index"><header><span>Construction</span><span>Example form</span></header>${sections.map(s=>family(s,s.lessons.map(l=>`<button data-id="${l.id}"><span>${esc(l.title)}</span><span lang="es">${esc(l.rows[0]?.alternatives[0]||'—')}</span><span>↗</span></button>`).join(''))).join('')}</div>`;
}
function gallery(){
 current=-1;location.hash='';lab.innerHTML=`<div class="intro"><h1>Fifteen ways to explore a verb.</h1><p>Same conjugations. Different layouts and interactions. Choose one to try it at full size.</p></div><div class="gallery">${designs.map(([title,description,kind],i)=>`<article class="design-card" data-design="${i}"><div class="thumbnail" aria-hidden="true" inert><div class="mini-page ${kind}">${view(kind)}</div></div><button class="design-name" data-design="${i}"><small>${String(i+1).padStart(2,'0')}</small>${title}</button><span class="design-description">${description}</span></article>`).join('')}</div>`;
 // Preview markup is inert; the surrounding choice remains the only control.
 for(const inner of lab.querySelectorAll('.thumbnail button,.thumbnail select,.thumbnail summary'))inner.tabIndex=-1;
}
function open(index){
 current=(index+designs.length)%designs.length;location.hash=String(current+1);
 const [title,description,kind]=designs[current];
 lab.innerHTML=`<div class="study-bar"><div><p class="subtle">${String(current+1).padStart(2,'0')} / 15</p><h1>${title}</h1><p>${description}</p></div><div class="study-switch"><button data-prev aria-label="Previous prototype">←</button><select aria-label="Prototype">${designs.map(([title],i)=>`<option value="${i}" ${i===current?'selected':''}>${i+1}. ${title}</option>`).join('')}</select><button data-next aria-label="Next prototype">→</button></div></div><section class="stage ${kind}" aria-label="${esc(title)} prototype"><header class="stage-header"><h2 lang="es">${esc(document.querySelector('#verb').value)}</h2><span>Verb guide</span></header><div class="stage-body">${view(kind)}</div><div class="lens" hidden></div></section><p class="footnote">Local design prototype · No scoring or progress changes · <a href="https://en.wiktionary.org/wiki/${document.querySelector('#verb').value}#Spanish" target="_blank" rel="noopener">Form source ↗</a></p>`;
}
function showTable(id){const dialog=document.querySelector('#detail');dialog.querySelector('div').innerHTML=full(lesson(id));dialog.showModal();}
function inspect(id){active=id;const host=document.querySelector('#inspector');if(host)host.innerHTML=full(lesson(id));for(const b of lab.querySelectorAll('[data-select]'))b.setAttribute('aria-pressed',String(b.dataset.select===id));}
lab.addEventListener('click',e=>{
 const card=e.target.closest('[data-design]');if(card){open(Number(card.dataset.design));return;}
 if(e.target.closest('[data-prev]'))return open(current-1);
 if(e.target.closest('[data-next]'))return open(current+1);
 const moodButton=e.target.closest('[data-mood]');if(moodButton){mood=moodButton.dataset.mood;return open(current);}
 const number=e.target.closest('[data-number]');if(number){plural=number.dataset.number==='plural';return open(current);}
 const personButton=e.target.closest('[data-person]');if(personButton){person=Number(personButton.dataset.person);return open(current);}
 const select=e.target.closest('[data-select]');if(select)return inspect(select.dataset.select);
 const tile=e.target.closest('[data-id]');if(tile){if(designs[current]?.[2]==='inspector')inspect(tile.dataset.id);else showTable(tile.dataset.id);}
});
lab.addEventListener('change',e=>{if(e.target.matches('[aria-label="Prototype"]'))open(Number(e.target.value));if(e.target.hasAttribute('data-compare'))document.querySelector('#compare-'+e.target.dataset.compare).innerHTML=full(lesson(e.target.value));});
function hover(e){if(current<0)return;const tile=e.target.closest('[data-id]');if(!tile)return;
 if(designs[current][2]==='inspector')inspect(tile.dataset.id);
 if(designs[current][2]==='magnifier'){
  const lens=document.querySelector('.lens'),stage=document.querySelector('.stage'),r=tile.getBoundingClientRect(),b=stage.getBoundingClientRect();
  lens.innerHTML=full(lesson(tile.dataset.id));lens.hidden=false;
  lens.style.left=Math.max(12,Math.min(r.left-b.left,b.width-330))+'px';lens.style.top=Math.max(60,Math.min(r.top-b.top,b.height-lens.offsetHeight-12))+'px';
 }
}
lab.addEventListener('pointerover',hover);lab.addEventListener('focusin',hover);
lab.addEventListener('pointerout',e=>{if(!e.target.closest('[data-id]')?.contains(e.relatedTarget)){const lens=document.querySelector('.lens');if(lens)lens.hidden=true;}});
document.querySelector('#gallery-button').onclick=gallery;
document.querySelector('#verb').onchange=document.querySelector('#rare').onchange=()=>{refreshData();current<0?gallery():open(current);};
document.querySelector('#detail .close').onclick=()=>document.querySelector('#detail').close();
refreshData();const initial=Number(location.hash.slice(1));initial>=1&&initial<=15?open(initial-1):gallery();
