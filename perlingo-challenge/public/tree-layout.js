import {visualChildren} from './tree-model.js';
// A collection root joins independent families for navigation, not as a linguistic claim.
export function radialLayout(tree,{detailed=false,radius=400,rootId=null}={}){
 const nodes=[],links=[];let leaf=0,maxDepth=1;
 function build(id,parent,depth){const source=id?tree.nodes.get(id):null;const n={id:id||'collection',name:source?.name||'Language collection',parent,depth,children:[],own:source?.own||[]};nodes.push(n);maxDepth=Math.max(maxDepth,depth);
 const children=id&&source.own.length?[]:visualChildren(tree,id,{playableOnly:true,detailed});
 n.children=children.map(c=>build(c.id,n,depth+1));if(!n.children.length){n.start=leaf;n.end=leaf++;}else{n.start=n.children[0].start;n.end=n.children.at(-1).end;}return n;}
 const root=build(rootId,null,0);
 for(const n of nodes){n.angle=((n.start+n.end)/2+.5)/leaf*Math.PI*2-Math.PI/2;n.radius=n===root?0:n.children.length?radius*n.depth/maxDepth:radius;n.x=Math.cos(n.angle)*n.radius;n.y=Math.sin(n.angle)*n.radius;
 if(n.parent){const p=n.parent,mid=(p.radius+n.radius)/2;links.push({source:p,target:n,path:`M ${p.x} ${p.y} C ${Math.cos(p.depth?p.angle:n.angle)*mid} ${Math.sin(p.depth?p.angle:n.angle)*mid}, ${Math.cos(n.angle)*mid} ${Math.sin(n.angle)*mid}, ${n.x} ${n.y}`});}}
 return {nodes,links,leaves:nodes.filter(n=>!n.children.length),root};
}

// Horizontal, collision-free pronunciation tips; topology stays unchanged.
export function pronunciationLayout(tree,options={}){
 const view=radialLayout(tree,options),half=Math.ceil(view.leaves.length/2),right=view.leaves.length-half;
 view.leaves.forEach((n,i)=>{n.side=i<half?-1:1;const index=i<half?i:i-half,count=i<half?half:right;n.x=n.side*260;n.y=(index-(count-1)/2)*96;});
 function place(n){if(!n.children.length)return;for(const c of n.children)place(c);n.y=n.children.reduce((sum,c)=>sum+c.y,0)/n.children.length;n.x=n.children.reduce((sum,c)=>sum+c.x,0)/n.children.length*.52;}
 place(view.root);view.root.x=0;view.root.y=0;
 view.links=view.links.map(l=>{const p=l.source,n=l.target,mid=(p.x+n.x)/2;return {...l,path:`M ${p.x} ${p.y} C ${mid} ${p.y}, ${mid} ${n.y}, ${n.x} ${n.y}`};});
 view.width=1000;view.height=Math.max(400,Math.max(half,right)*96+80);return view;
}

// Independent family panels on one canvas; no synthetic edges between roots.
export function forestLayout(tree,{detailed=false,rootId=null}={}){
 const roots=rootId?[rootId]:tree.roots.filter(id=>tree.nodes.get(id).playable.length).sort((a,b)=>(b==='indo1319')-(a==='indo1319')||tree.nodes.get(b).playable.length-tree.nodes.get(a).playable.length||tree.nodes.get(a).name.localeCompare(tree.nodes.get(b).name));
 const width=1792,gap=32,cell=224,nodes=[],links=[],leaves=[],families=[],groups=[];let cursorX=0,cursorY=0,rowHeight=0;
 for(const id of roots){const view=radialLayout(tree,{detailed,rootId:id}),count=view.leaves.length,grouped=!detailed&&count>8&&view.root.children.length>1;
 const order=['roma1334','germ1287','slav1255','east2280','indo1321','iran1269'];
 const clusters=grouped?[...view.root.children].sort((a,b)=>(order.indexOf(a.id)<0?99:order.indexOf(a.id))-(order.indexOf(b.id)<0?99:order.indexOf(b.id))):[];
 const descendants=n=>n.children.length?n.children.flatMap(descendants):[n];
 const columns=grouped?clusters.length:Math.min(8,count),panelWidth=columns*(grouped?256:cell),rows=grouped?Math.max(...clusters.map(n=>descendants(n).length)):Math.ceil(count/columns),header=grouped?150:detailed?150:90,panelHeight=header+rows*94+26;
 if(cursorX&&cursorX+panelWidth>width){cursorX=0;cursorY+=rowHeight+gap;rowHeight=0;}
 const ox=cursorX,oy=cursorY;
 view.leaves.forEach((n,i)=>{n.x=ox+(i%columns)*cell+104;n.y=oy+header+Math.floor(i/columns)*94+38;n.cardX=n.x-104;n.cardY=n.y-38;});
 const maxDepth=Math.max(...view.nodes.map(n=>n.depth));
 function place(n){if(!n.children.length)return;n.children.forEach(place);n.x=n.children.reduce((sum,c)=>sum+c.x,0)/n.children.length;n.y=oy+35+n.depth/Math.max(1,maxDepth)*(header-45);}
 place(view.root);
 if(grouped){view.root.x=ox+panelWidth/2;view.root.y=oy+35;
 clusters.forEach((cluster,i)=>{const gx=ox+i*256,tips=descendants(cluster);groups.push({id:cluster.id,name:cluster.name,count:tips.length,x:gx,y:oy+85,width:240,height:tips.length*94+90});
  tips.forEach((n,j)=>{n.cardX=gx+28;n.cardY=oy+150+j*94;n.x=n.cardX;n.y=n.cardY+38;n.sideEntry=true;});
  function placeCluster(n){if(!n.children.length)return;n.children.forEach(placeCluster);n.x=gx+10;n.y=oy+120;}placeCluster(cluster);
 });}
 for(const n of view.nodes){n.family=id;nodes.push(n);}leaves.push(...view.leaves);
 for(const l of view.links){const p=l.source,n=l.target,endY=n.children.length?n.y:n.cardY,mid=(p.y+endY)/2;links.push({...l,path:`M ${p.x} ${p.y} C ${p.x} ${mid}, ${n.x} ${mid}, ${n.x} ${endY}`});}
 families.push({id,name:tree.nodes.get(id).name,count,x:ox,y:oy,width:panelWidth,height:panelHeight,root:view.root});
 cursorX+=panelWidth+gap;rowHeight=Math.max(rowHeight,panelHeight);
 }
 const height=cursorY+rowHeight;const actualWidth=Math.max(...families.map(f=>f.x+f.width));
 for(const n of nodes){n.x-=actualWidth/2;n.y-=height/2;if(n.cardX!==undefined){n.cardX-=actualWidth/2;n.cardY-=height/2;}}
 for(const f of [...families,...groups]){f.x-=actualWidth/2;f.y-=height/2;}
 // Recompute curves after centering the entire forest.
 for(const l of links){const p=l.source,n=l.target,endY=n.children.length?n.y:n.cardY,mid=(p.y+endY)/2;if(n.sideEntry&&p.depth===0){const tx=n.cardX+104;l.path=`M ${p.x} ${p.y} C ${p.x} ${p.y+35}, ${tx} ${p.y+35}, ${tx} ${n.cardY}`;}else if(n.sideEntry){l.path=`M ${p.x} ${p.y} C ${p.x} ${n.y}, ${p.x} ${n.y}, ${n.x} ${n.y}`;}else if(n.cardX!==undefined){const lane=n.cardX-8,above=endY-10;l.path=`M ${p.x} ${p.y} C ${p.x} ${p.y+12}, ${lane} ${p.y+12}, ${lane} ${p.y+24} L ${lane} ${above-8} Q ${lane} ${above}, ${lane+8} ${above} L ${n.x-8} ${above} Q ${n.x} ${above}, ${n.x} ${endY}`;}else l.path=`M ${p.x} ${p.y} C ${p.x} ${mid}, ${n.x} ${mid}, ${n.x} ${endY}`;}
 return {nodes,links,leaves,families,groups,root:null,width:actualWidth+40,height:height+40};
}
