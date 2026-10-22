import {createTree,cleanSelection,roundLanguages,visualChildren} from './tree-model.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let catalogPromise;
function catalog(){if(!catalogPromise)catalogPromise=fetch('/language-tree.json').then(r=>{if(!r.ok)throw Error('The language catalog could not load.');return r.json();}).catch(e=>{catalogPromise=null;throw e;});return catalogPromise;}
export async function openTreePicker({languages,selected,script,onApply}){
 const dialog=document.createElement('dialog');dialog.className='tree-picker';dialog.setAttribute('aria-labelledby','tree-title');
 dialog.innerHTML='<button class="close" aria-label="Close language explorer">×</button><h2 id="tree-title">Explore languages</h2><p role="status">Loading the family tree…</p>';
 document.body.append(dialog);dialog.showModal();
 let closed=false,searchTimer;
 dialog.addEventListener('close',()=>{closed=true;clearTimeout(searchTimer);dialog.remove();},{once:true});
 dialog.addEventListener('click',e=>{if(e.target===dialog||e.target.closest('.close'))dialog.close();});
 let tree;try{tree=createTree(await catalog(),languages);}catch{if(!closed){dialog.querySelector('[role=status]').textContent='Could not load the catalog. Close and try again; your selection is unchanged.';}return;}
 if(closed)return;
 let selection=new Set(cleanSelection(selected,languages)),expanded=new Set(),collapsed=new Set(),limits=new Map(),query='',playableOnly=true,detailed=false,zoom=1;
 const pageSize=80,byId=new Map(languages.map(l=>[l.id,l]));
 dialog.innerHTML=`<button class="close" aria-label="Close language explorer">×</button><div class="tree-heading"><p class="eyebrow">A WORLD OF CONNECTIONS</p><h2 id="tree-title">Explore languages</h2><p>Select language tips or branch circles · drag to explore. ${languages.length} are ready to play.</p></div>
 <div class="tree-controls"><input id="tree-search" type="search" aria-label="Search languages or families" placeholder="Search a language or family…" autocomplete="off"><label class="tree-only"><input id="tree-playable" type="checkbox" checked> Playable only</label></div>
 <div class="tree-actions"><label class="tree-only"><input id="tree-detail" type="checkbox"> Full detail</label><span id="tree-result-count" role="status"></span><div><button class="text-button" data-select-all>All ${languages.length}</button><button class="text-button" data-clear>Clear selection</button></div></div>
 <div class="tree-zoom"><button data-home>Show all</button><button data-zoom="out" aria-label="Zoom out">−</button><output id="tree-zoom-value">100%</output><button data-zoom="in" aria-label="Zoom in">+</button><button data-zoom="fit">Fit</button><button data-zoom="reset">Reset</button></div><div id="tree-scroll" class="tree-scroll" aria-label="Language families"><div id="tree-list"></div></div>
 <div class="tree-footer"><div><strong id="tree-selection-count" role="status"></strong><span id="tree-filter-count"></span></div><button class="primary" id="tree-apply">Use selection</button></div>
 <details class="tree-source"><summary>Glottolog ${esc(tree.meta.version)} · source &amp; classification</summary><p>${esc(tree.meta.citation)} <a href="${esc(tree.meta.doi)}" target="_blank" rel="noreferrer">Dataset ↗</a> · <a href="${esc(tree.meta.licenseUrl)}" target="_blank" rel="noreferrer">${esc(tree.meta.license)}</a>.</p><p>Names and parent links follow the downloaded catalog. Perlingo adds playable mappings and familiar display names. The default visual overview flattens intermediate classifications into major groups and language tips; hover a fork for its family name. Full detail restores the source hierarchy. Some nodes are dialects, isolates or administrative catalog groups, not genealogical families. “Explore only” entries have no game audio or recall cards. Classification does not measure language similarity or recognition support.</p></details>`;
 const list=dialog.querySelector('#tree-list'),scroll=dialog.querySelector('#tree-scroll');
 const childrenOf=id=>visualChildren(tree,id,{playableOnly,detailed}).map(n=>n.id);
 scroll.tabIndex=0;scroll.setAttribute('aria-label','Language family tree. Scroll or drag to pan; use zoom controls to resize.');
 function row(id,isSearch=false){
  const n=tree.nodes.get(id),s=tree.state(id,selection),children=childrenOf(id),open=detailed?expanded.has(id):!collapsed.has(id)&&(playableOnly||n.playable.length>0||expanded.has(id)),app=n.own.map(id=>byId.get(id));
  const fork=!detailed&&!isSearch&&children.length>0;
  const label=app.length?app.map(l=>l.name).join(' / '):n.name;
  const ancestry=tree.ancestors(id).map(id=>tree.nodes.get(id).name).join(' › ');
  const path=isSearch?ancestry:'';
  const alias=label!==n.name?'Glottolog: '+n.name:'';
  const note=n.own.map(id=>tree.mappings[id].note).filter(Boolean).join(' ');
  if(fork)return `<li class="tree-node tree-fork" data-node="${id}"><div class="tree-row fork-row" title="${esc(label)} · ${s.total} playable languages. ${esc(ancestry)}">
   <input type="checkbox" data-select="${id}" aria-label="Select ${esc(label)} branch" title="${esc(label)} · select ${s.total} playable languages" ${s.disabled?'disabled':''}>
   <span class="fork-caption">${esc(label)}</span><button class="fork-toggle" data-expand="${id}" aria-label="${open?'Collapse':'Expand'} ${esc(label)}" aria-expanded="${open}" aria-controls="children-${id}" title="${open?'Collapse':'Expand'} ${esc(label)}">${open?'−':'+'}</button>${!open?`<small>${n.playable.length||n.languageCount}</small>`:''}</div><ul id="children-${id}" ${open?'':'hidden'}>${open?branch(children,id):''}</ul></li>`;
  return `<li class="tree-node" data-node="${id}"><div title="${esc(ancestry)}" class="tree-row ${s.disabled?'explore-only':''}">
  ${children.length?`<button class="tree-expand" data-expand="${id}" aria-label="${isSearch?'Show branch':open?'Collapse':'Expand'} ${esc(label)}" aria-expanded="${isSearch?'false':open}" ${isSearch?'':`aria-controls="children-${id}"`}>${!isSearch&&open?'⌄':'›'}</button>`:'<span class="tree-spacer"></span>'}
  <input type="checkbox" data-select="${id}" aria-label="Select ${esc(label)}${n.level==='family'?' branch':''}" ${s.disabled?'disabled':s.checked?'checked':''} title="${s.disabled?'Explore only — not in the playable collection':`Select ${s.total} playable ${s.total===1?'language':'languages'}`}">
  <div class="tree-label">${children.length?`<button class="tree-name" data-expand="${id}">${esc(label)}</button>`:`<label class="tree-name" data-label="${id}">${esc(label)}</label>`}${alias?`<small>${esc(alias)}</small>`:''}${path?`<small class="tree-path" title="${esc(path)}">${esc(path)}</small>`:''}</div>
  <span class="tree-meta" title="${esc(note||n.level)}">${n.playable.length?`${n.playable.length} playable`:n.languageCount?`${n.languageCount.toLocaleString()} ${n.languageCount===1?'language':'languages'}`:'Explore only'}${n.bookkeeping?' · catalog record':''}</span>
  <a class="tree-info" href="https://glottolog.org/resource/languoid/id/${id}" target="_blank" rel="noreferrer" aria-label="About ${esc(n.name)} on Glottolog" title="${esc(note||n.level+' · '+(n.iso||id))}">↗</a></div>
  ${!isSearch&&children.length?`<ul id="children-${id}" ${open?'':'hidden'}>${open?branch(children,id):''}</ul>`:''}</li>`;
 }
 function branch(ids,key){const limit=limits.get(key)||pageSize;return ids.slice(0,limit).map(id=>row(id)).join('')+(ids.length>limit?`<li class="tree-more"><button class="text-button" data-more="${key}">Show more (${ids.length-limit} remaining)</button></li>`:'');}
 function render(focus){
  list.classList.toggle('visual-tree',!query);list.classList.toggle('leaf-tree',!detailed&&!query);list.classList.toggle('forest-canvas',!query);scroll.classList.toggle('searching',!!query);
  if(query){const matches=tree.search(query,playableOnly),limit=limits.get('search')||pageSize;list.innerHTML=matches.length?`<ul class="tree-roots">${matches.slice(0,limit).map(n=>row(n.id,true)).join('')}${matches.length>limit?'<li class="tree-more"><button class="text-button" data-more="search">Show more results</button></li>':''}</ul>`:'<p class="tree-empty">No matching languages or families.</p>';dialog.querySelector('#tree-result-count').textContent=`${matches.length.toLocaleString()} matches`;}
  else{const roots=childrenOf(null);list.innerHTML=`<ul class="tree-roots">${branch(roots,'roots')}</ul>`;dialog.querySelector('#tree-result-count').textContent=playableOnly?`${languages.length} languages · separate family trees`:`${tree.nodes.size.toLocaleString()} catalog entries`;}
  applyZoom();sync();if(focus)dialog.querySelector(focus)?.focus({preventScroll:true});
 }
 function sync(){
  for(const input of list.querySelectorAll('[data-select]')){const s=tree.state(input.dataset.select,selection);input.checked=s.checked;input.indeterminate=s.mixed;}
  dialog.querySelector('#tree-selection-count').textContent=`${selection.size} selected`;
  const matches=roundLanguages(languages,[...selection],script).length;
  dialog.querySelector('#tree-filter-count').textContent=script==='All scripts'?'':`${matches} match your ${script} filter`;
  dialog.querySelector('#tree-apply').disabled=!matches;
 }
 dialog.querySelector('#tree-search').addEventListener('input',e=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>{query=e.target.value.trim();limits.delete('search');render();scroll.scrollTop=0;},120);});
 dialog.querySelector('#tree-detail').addEventListener('change',e=>{detailed=e.target.checked;if(detailed)for(const l of languages){const id=tree.mappings[l.id].node;for(const ancestor of tree.ancestors(id))expanded.add(ancestor);}render();scroll.scrollTo(0,0);});
 dialog.querySelector('#tree-playable').addEventListener('change',e=>{playableOnly=e.target.checked;render();scroll.scrollTop=0;});
 list.addEventListener('change',e=>{if(e.target.matches('[data-select]')){selection=tree.toggle(e.target.dataset.select,selection,e.target.checked);sync();}});
 dialog.addEventListener('click',e=>{
  const expand=e.target.closest('[data-expand]'),more=e.target.closest('[data-more]'),label=e.target.closest('[data-label]');
  if(expand){const id=expand.dataset.expand;if(query){collapsed.clear();query='';dialog.querySelector('#tree-search').value='';clearTimeout(searchTimer);expanded=new Set([...tree.ancestors(id),id]);for(const ancestor of [null,...tree.ancestors(id)]){const siblings=ancestor?tree.nodes.get(ancestor).children:tree.roots;limits.set(ancestor||'roots',siblings.length);}render(`[data-expand="${id}"]`);dialog.querySelector(`[data-node="${id}"]`)?.scrollIntoView({block:'center',inline:'center'});}
   else{if(detailed){expanded.has(id)?expanded.delete(id):expanded.add(id);}else{if(!playableOnly&&!tree.nodes.get(id).playable.length&&!expanded.has(id)){expanded.add(id);collapsed.delete(id);}else{collapsed.has(id)?collapsed.delete(id):collapsed.add(id);}}render(`[data-expand="${id}"]`);dialog.querySelector(`[data-node="${id}"] > .tree-row`)?.scrollIntoView({block:'center',inline:'start'});} }
  else if(more){const key=more.dataset.more;limits.set(key,(limits.get(key)||pageSize)+pageSize);render(`[data-more="${key}"]`);}
  else if(label){const input=list.querySelector(`[data-select="${label.dataset.label}"]`);if(!input.disabled){input.click();input.focus();}}
  else if(e.target.closest('[data-home]')){collapsed.clear();if(detailed)for(const l of languages)for(const ancestor of tree.ancestors(tree.mappings[l.id].node))expanded.add(ancestor);render();fit();}
  else if(e.target.closest('[data-select-all]')){selection=new Set(languages.map(l=>l.id));sync();}
  else if(e.target.closest('[data-clear]')){selection.clear();sync();}
 });
 dialog.querySelector('#tree-apply').onclick=()=>{const ids=cleanSelection([...selection],languages);if(!roundLanguages(languages,ids,script).length)return;dialog.close();onApply(ids);};
 function applyZoom(){list.style.zoom=query?'1':String(zoom);dialog.querySelector('#tree-zoom-value').textContent=Math.round(zoom*100)+'%';}
 function fit(){setZoom(Math.min((scroll.clientWidth-20)/(list.scrollWidth||1),(scroll.clientHeight-20)/(list.scrollHeight||1)));scroll.scrollTo(0,0);}
 function setZoom(value){const previous=zoom;zoom=Math.min(1.6,Math.max(.1,value));const x=scroll.scrollLeft+scroll.clientWidth/2,y=scroll.scrollTop+scroll.clientHeight/2;applyZoom();scroll.scrollLeft=x*zoom/previous-scroll.clientWidth/2;scroll.scrollTop=y*zoom/previous-scroll.clientHeight/2;}
 dialog.querySelector('.tree-zoom').addEventListener('click',e=>{const action=e.target.dataset.zoom;if(!action||query)return;if(action==='fit'){fit();}else if(action==='reset'){setZoom(1);scroll.scrollTo(0,0);}else setZoom(zoom*(action==='in'?1.2:1/1.2));});
 scroll.addEventListener('wheel',e=>{if((e.ctrlKey||e.metaKey)&&!query){e.preventDefault();setZoom(zoom*Math.exp(-e.deltaY*.01));}},{passive:false});
 let drag=null;
 scroll.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0||e.target.closest('button,input,a,label'))return;drag={x:e.clientX,y:e.clientY,left:scroll.scrollLeft,top:scroll.scrollTop};scroll.setPointerCapture(e.pointerId);scroll.classList.add('dragging');});
 scroll.addEventListener('pointermove',e=>{if(drag){scroll.scrollLeft=drag.left+drag.x-e.clientX;scroll.scrollTop=drag.top+drag.y-e.clientY;}});
 const endDrag=()=>{drag=null;scroll.classList.remove('dragging');};scroll.addEventListener('pointerup',endDrag);scroll.addEventListener('pointercancel',endDrag);
 render();fit();dialog.querySelector('#tree-search').focus();
}
