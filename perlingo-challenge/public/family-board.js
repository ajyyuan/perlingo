import {visualChildren} from './tree-model.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function familyGroups(tree,ids){const selected=new Set(ids),keep=n=>n.playable.filter(id=>selected.has(id));const priority=['roma1334','germ1287','slav1255','indo1321','east2280','iran1269'];return tree.roots.filter(id=>keep(tree.nodes.get(id)).length).sort((a,b)=>(b==='indo1319')-(a==='indo1319')||tree.nodes.get(b).playable.length-tree.nodes.get(a).playable.length).map(id=>{const n=tree.nodes.get(id);return {id,name:n.name,ids:keep(n),branches:n.playable.length>8?visualChildren(tree,id).map(({id})=>tree.nodes.get(id)).filter(n=>keep(n).length).sort((a,b)=>(priority.indexOf(a.id)<0?99:priority.indexOf(a.id))-(priority.indexOf(b.id)<0?99:priority.indexOf(b.id))).map(n=>({id:n.id,name:n.name,ids:keep(n)})):[]};});}
export function renderFamilyBoard(tree,ids,renderCards){
 return `<div class="family-board">${familyGroups(tree,ids).flatMap(f=>(f.branches.length?f.branches:[f]).map(b=>{
  const cols=b.ids.length===7?4:b.ids.length>=5?3:Math.min(b.ids.length,2);
  return `<section class="family-group" style="--cols:${cols};--rows:${Math.ceil(b.ids.length/cols)};--small-cols:${Math.min(cols,2)};--small-rows:${Math.ceil(b.ids.length/Math.min(cols,2))}" aria-label="${esc(b.name===f.name?f.name:f.name+' · '+b.name)}" title="${esc(f.name)}"><h3>${esc(b.name)}<small>${b.ids.length}</small></h3><div class="cards">${renderCards(b.ids)}</div></section>`;
 })).join('')}</div>`;
}
export function fitFamilyWords(root){for(const word of root.querySelectorAll('.family-board .word,.compact-grid .word')){word.style.fontSize='20px';if(word.scrollWidth>word.clientWidth)word.style.fontSize=Math.max(14,20*word.clientWidth/word.scrollWidth)+'px';}}
