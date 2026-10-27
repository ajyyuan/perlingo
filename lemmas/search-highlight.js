import {esc} from './html.js';

// Use the same literal, case-insensitive substring matching as search.
export function highlightMatch(text,query){
 const value=String(text),q=query.trim().toLocaleLowerCase();
 if(!q)return esc(value);
 const lower=value.toLocaleLowerCase();let start=0,html='',index;
 while((index=lower.indexOf(q,start))!==-1){
  html+=esc(value.slice(start,index))+'<strong class="search-match">'+esc(value.slice(index,index+q.length))+'</strong>';
  start=index+q.length;
 }
 return html+esc(value.slice(start));
}
