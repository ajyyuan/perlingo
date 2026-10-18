import {shuffle} from './engine.js';

// Balance small boards so a six-concept lesson becomes two boards of three.
export function makeBoards(items,langs){
 const boards=[];
 for(const lang of shuffle(langs)){
  const pool=shuffle(items),count=Math.ceil(pool.length/5);
  let offset=0;
  for(let i=0;i<count;i++){
   const size=Math.ceil((pool.length-offset)/(count-i));
   const left=pool.slice(offset,offset+size);
   boards.push({lang,left,right:shuffle(left)});offset+=size;
  }
 }
 return boards;
}
export const emptyMatch=()=>({left:null,right:null,matched:[],last:null});
export function selectMatch(state,side,id){
 if(!['left','right'].includes(side)||state.matched.includes(id))return {state,attempt:null};
 const next={...state,[side]:state[side]===id?null:id,last:null};
 if(!next.left||!next.right)return {state:next,attempt:null};
 const attempt={left:next.left,right:next.right,correct:next.left===next.right};
 return {state:{left:null,right:null,matched:attempt.correct?[...next.matched,next.left]:next.matched,last:attempt},attempt};
}
