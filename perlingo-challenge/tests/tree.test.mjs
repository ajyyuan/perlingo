import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {languages} from '../public/content.js';
import {createTree,initialSelection,roundLanguages} from '../public/tree-model.js';
const data=JSON.parse(readFileSync(new URL('../public/language-tree.json',import.meta.url)));
const tree=createTree(data,languages);
test('full pinned catalog preserves ancestry and maps exactly the original 50',()=>{
 assert.equal(tree.nodes.size,27177);assert.equal(tree.roots.length,429);
 assert.equal(Object.keys(data.playable).length,50);
 assert.equal(new Set(Object.values(data.playable).map(x=>x.node)).size,50);
 assert.deepEqual(new Set(tree.roots.flatMap(id=>tree.nodes.get(id).playable)),new Set(languages.map(l=>l.id)));
 for(const l of languages){const n=tree.nodes.get(data.playable[l.id].node);assert.equal(n.iso,data.playable[l.id].iso);assert.equal(new Set(tree.ancestors(n.id)).size,tree.ancestors(n.id).length);}
});
test('branch selection, partial selection and overlapping branches stay consistent',()=>{
 let chosen=tree.toggle('roma1334',new Set(),true);
 assert.deepEqual([...chosen],['es','fr','pt','it','ro','ca']);assert.equal(tree.state('roma1334',chosen).checked,true);
 chosen=tree.toggle(data.playable.fr.node,chosen,false);assert.equal(chosen.size,5);assert.equal(tree.state('roma1334',chosen).mixed,true);
 chosen=tree.toggle('roma1334',chosen,true);chosen=tree.toggle(data.playable.fr.node,chosen,true);assert.equal(chosen.size,6);
 chosen=tree.toggle('roma1334',chosen,false);assert.equal(chosen.size,0);
 assert.equal(tree.toggle('slav1255',chosen,true).size,9);
});
test('explorable entries cannot introduce unsupported game languages; aliases find mapped varieties',()=>{
 const n=tree.search('Basque').find(n=>n.level==='language');assert(n);assert.equal(tree.state(n.id,new Set()).disabled,true);assert.equal(tree.toggle(n.id,new Set(),true).size,0);
 assert(tree.search('Filipino').some(n=>n.id==='taga1270'));assert(tree.search('Norwegian').some(n=>n.id==='norw1259'));
 assert(tree.search('Croatian',true).some(n=>n.id==='croa1245'));
});
test('legacy settings migrate while explicit choices and script intersections are respected',()=>{
 assert.equal(initialSelection({count:5},languages).length,5);assert.equal(initialSelection({},languages).length,50);
 assert.deepEqual(initialSelection({languageIds:[]},languages),[]);
 assert.deepEqual(initialSelection({languageIds:['fr','bad','fr','en']},languages),['en','fr']);
 assert.equal(roundLanguages(languages,languages.map(l=>l.id),'Latin').length,29);
 assert.deepEqual(roundLanguages(languages,['ar'],'Latin'),[]);
});

test('leaf overview uses major groups and preserves every playable tip',async()=>{
 const {visualChildren}=await import('../public/tree-model.js');
 const roots=visualChildren(tree,null);assert(roots.some(n=>n.id==='indo1319'));
 const children=visualChildren(tree,'indo1319');assert(!children.some(n=>n.id==='clas1257'));for(const id of ['roma1334','germ1287','slav1255'])assert(children.some(n=>n.id===id));
 for(const child of children){assert(tree.ancestors(child.id).includes('indo1319'));for(const skipped of child.skipped)assert.equal(tree.nodes.get(skipped).own.length,0);}
 assert.equal(visualChildren(tree,'indo1319',{detailed:true})[0].id,'clas1257');
 let compressed=0;const visited=new Set();function visit(id){compressed+=visualChildren(tree,id).reduce((n,c)=>n+c.skipped.length,0);visited.add(id);for(const child of visualChildren(tree,id))visit(child.id);}roots.forEach(n=>visit(n.id));
 assert(visualChildren(tree,'roma1334').every(n=>tree.nodes.get(n.id).own.length));assert.equal(visualChildren(tree,'roma1334').length,6);assert(compressed>0);for(const mapping of Object.values(data.playable))assert(visited.has(mapping.node));
});

test('whole forest contains each playable language tip exactly once across its roots',async()=>{
 const {visualChildren}=await import('../public/tree-model.js');const tips=[];
 function visit(id){const children=visualChildren(tree,id);if(!children.length)tips.push(...tree.nodes.get(id).own);else children.forEach(n=>visit(n.id));}
 visualChildren(tree,null).forEach(n=>visit(n.id));assert.equal(tips.length,50);assert.deepEqual(new Set(tips),new Set(languages.map(l=>l.id)));
});

test('radial explorer keeps 50 unique tips, a centered collection root and finite curved paths',async()=>{
 const {radialLayout}=await import('../public/tree-layout.js');
 for(const detailed of [false,true]){const view=radialLayout(tree,{detailed});assert.equal(view.leaves.length,50);assert.equal(new Set(view.leaves.flatMap(n=>n.own)).size,50);assert.equal(view.root.x,0);assert.equal(view.root.y,0);assert.equal(view.links.length,view.nodes.length-1);assert(view.links.every(l=>l.path.includes(' C ')&&!/NaN|Infinity/.test(l.path)));assert(view.leaves.every(n=>Math.abs(Math.hypot(n.x,n.y)-400)<.001));}
 assert(radialLayout(tree,{detailed:true}).nodes.length>radialLayout(tree).nodes.length);
});

test('pronunciation layout retains identities and separates horizontal cards',async()=>{
 const {pronunciationLayout}=await import('../public/tree-layout.js');
 for(const detailed of [false,true])for(const rootId of [null,'roma1334','germ1287']){
  const view=pronunciationLayout(tree,{detailed,rootId});assert.equal(view.leaves.length,rootId==='roma1334'?6:rootId==='germ1287'?7:50);
  assert.equal(new Set(view.leaves.map(n=>n.id)).size,view.leaves.length);
  for(const side of [-1,1]){const leaves=view.leaves.filter(n=>n.side===side).sort((a,b)=>a.y-b.y);for(let i=1;i<leaves.length;i++)assert(leaves[i].y-leaves[i-1].y>=96);}
  assert(view.links.every(l=>!l.path.match(/NaN|Infinity/)));assert.equal(view.root.x,0);assert.equal(view.root.y,0);
 }
});

test('pronunciation forest covers 50 tips with disjoint family panels and no cross-family edges',async()=>{
 const {forestLayout}=await import('../public/tree-layout.js');
 for(const detailed of [false,true]){const view=forestLayout(tree,{detailed});assert.equal(view.root,null);assert.equal(view.families[0].id,'indo1319');assert.equal(view.leaves.length,50);assert.equal(new Set(view.leaves.flatMap(n=>n.own)).size,50);
 assert(view.links.every(l=>l.source.family===l.target.family&&!/NaN|Infinity/.test(l.path)));
 for(let i=0;i<view.families.length;i++)for(let j=i+1;j<view.families.length;j++){const a=view.families[i],b=view.families[j];assert(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y);}
 for(const n of view.leaves){const f=view.families.find(f=>f.id===n.family);assert(n.cardX>=f.x&&n.cardX+208<=f.x+f.width);assert(n.cardY>=f.y&&n.cardY+76<=f.y+f.height);}
 }
});

test('Indo-European forest clusters preserve branch membership and keep cards inside their groups',async()=>{
 const {forestLayout}=await import('../public/tree-layout.js');const view=forestLayout(tree),groups=view.groups;
 for(const [id,count] of [['roma1334',6],['germ1287',7],['slav1255',9],['east2280',2]]){
  const group=groups.find(g=>g.id===id);assert(group);assert.equal(group.count,count);
  const ids=new Set(tree.nodes.get(id).playable);const tips=view.leaves.filter(n=>n.own.some(id=>ids.has(id)));assert.equal(tips.length,count);
  for(const n of tips){assert(n.cardX>=group.x&&n.cardX+208<=group.x+group.width);assert(n.cardY>=group.y&&n.cardY+76<=group.y+group.height);}
 }
 for(let i=1;i<groups.length;i++)assert(groups[i-1].x+groups[i-1].width<=groups[i].x);
});

test('family board renders each selected language once and removes empty branches',async()=>{
 const {familyGroups,renderFamilyBoard}=await import('../public/family-board.js');
 for(const ids of [languages.map(l=>l.id),languages.filter(l=>l.script==='Latin').map(l=>l.id),['fr','es','ja'],[]]){
  const groups=familyGroups(tree,ids),actual=groups.flatMap(g=>g.branches.length?g.branches.flatMap(b=>b.ids):g.ids);
  assert.equal(actual.length,ids.length);assert.deepEqual(new Set(actual),new Set(ids));assert(groups.every(g=>g.ids.length&&g.branches.every(b=>b.ids.length)));
  const rendered=[];renderFamilyBoard(tree,ids,group=>{rendered.push(...group);return '';});assert.deepEqual(new Set(rendered),new Set(ids));assert.equal(rendered.length,ids.length);
 }
});
