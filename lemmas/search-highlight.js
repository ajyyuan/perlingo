import {esc} from './html.js';
import {foldSearch} from './search.js';

// Map folded matches back to original characters, including combining accents.
export function highlightMatch(text,query){
 const value=String(text),q=foldSearch(query.trim());
 if(!q)return esc(value);
 let folded='',starts=[],ends=[];
 for(const match of value.matchAll(/\P{M}\p{M}*|\p{M}+/gu)){
  const part=foldSearch(match[0]);folded+=part;
  for(let i=0;i<part.length;i++){starts.push(match.index);ends.push(match.index+match[0].length);}
 }
 let cursor=0,offset=0,html='',index;
 while((index=folded.indexOf(q,offset))!==-1){
  const start=starts[index],end=ends[index+q.length-1];
  html+=esc(value.slice(cursor,start))+'<strong class="search-match">'+esc(value.slice(start,end))+'</strong>';
  cursor=end;offset=index+q.length;
 }
 return html+esc(value.slice(cursor));
}
