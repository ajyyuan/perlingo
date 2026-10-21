// UI-independent tree and selection logic. The playable set comes only from local content.
export function cleanSelection(ids,languages){const set=new Set(Array.isArray(ids)?ids:[]);return languages.filter(l=>set.has(l.id)).map(l=>l.id);}
export function roundLanguages(languages,ids,script='All scripts'){const set=new Set(cleanSelection(ids,languages));return languages.filter(l=>set.has(l.id)&&(script==='All scripts'||l.script===script));}
export function initialSelection(settings,languages){return Array.isArray(settings.languageIds)?cleanSelection(settings.languageIds,languages):languages.slice(0,Math.max(1,Math.min(50,Number(settings.count)||50))).map(l=>l.id);}
const fold=s=>String(s).normalize('NFD').replace(/\p{M}/gu,'').toLowerCase();
export function createTree(data,languages){
 const nodes=new Map(data.nodes.map(([id,parent,name,level,iso,bookkeeping])=>[id,{id,parent,name,level,iso,bookkeeping,children:[],own:[],playable:[],languageCount:0}]));
 const roots=[];
 for(const n of nodes.values()){
  if(n.parent){const p=nodes.get(n.parent);if(!p)throw Error('Missing tree parent: '+n.parent);p.children.push(n.id);}else roots.push(n.id);
 }
 for(const l of languages){const mapping=data.playable[l.id],n=nodes.get(mapping?.node);if(!n)throw Error('Missing language mapping: '+l.id);n.own.push(l.id);}
 const visiting=new Set(),visited=new Set();
 function visit(id){if(visiting.has(id))throw Error('Cyclic language tree');if(visited.has(id))return;visiting.add(id);const n=nodes.get(id);const ids=new Set(n.own);n.languageCount=n.level==='language'?1:0;
  for(const child of n.children){visit(child);const c=nodes.get(child);for(const id of c.playable)ids.add(id);n.languageCount+=c.languageCount;}
  n.playable=languages.filter(l=>ids.has(l.id)).map(l=>l.id);visiting.delete(id);visited.add(id);
 }
 roots.forEach(visit);if(visited.size!==nodes.size)throw Error('Disconnected or cyclic catalog');
 const compare=(a,b)=>Number(!!nodes.get(b).playable.length)-Number(!!nodes.get(a).playable.length)||nodes.get(a).name.localeCompare(nodes.get(b).name,'en');
 roots.sort(compare);for(const n of nodes.values()){n.children.sort(compare);n.search=fold([n.name,n.id,n.iso,...n.own.map(id=>languages.find(l=>l.id===id).name)].filter(Boolean).join(' '));}
 function ancestors(id){const out=[];let n=nodes.get(id);while(n?.parent){out.unshift(n.parent);n=nodes.get(n.parent);}return out;}
 function search(query,playableOnly=false){const q=fold(query.trim());return [...nodes.values()].filter(n=>(!playableOnly||n.playable.length)&&n.search.includes(q)).sort((a,b)=>Number(fold(b.name)===q)-Number(fold(a.name)===q)||compare(a.id,b.id));}
 function state(id,selection){const ids=nodes.get(id).playable,count=ids.filter(x=>selection.has(x)).length;return {disabled:!ids.length,checked:!!ids.length&&count===ids.length,mixed:count>0&&count<ids.length,count,total:ids.length};}
 function toggle(id,selection,checked){const next=new Set(selection);for(const x of nodes.get(id).playable){if(checked)next.add(x);else next.delete(x);}return next;}
 return {nodes,roots,ancestors,search,state,toggle,meta:data.meta,mappings:data.playable};
}

// Editorial overview: major groups and language tips, with original ancestry untouched.
const overviewGroups=new Set(['roma1334','germ1287','slav1255','indo1321','iran1269','celt1248','east2280']);
export function visualChildren(tree,id,{playableOnly=true,detailed=false}={}){
 const visible=key=>(key?tree.nodes.get(key).children:tree.roots).filter(k=>!playableOnly||tree.nodes.get(k).playable.length);
 if(detailed||!id)return visible(id).map(id=>({id,skipped:[]}));
 const parent=tree.nodes.get(id);
 // Playable standard varieties take precedence over catalog language/dialect levels.
 const terminal=n=>n.own.length||(n.level==='language'&&!n.playable.length);
 if(terminal(parent))return [];
 const out=[];
 function collect(key,skipped){const n=tree.nodes.get(key);
  if(terminal(n)||(!overviewGroups.has(id)&&overviewGroups.has(key))){out.push({id:key,skipped});return;}
  for(const child of visible(key))collect(child,[...skipped,key]);
 }
 for(const child of visible(id))collect(child,[]);
 return out;
}
