// URL-scoped only: example choices never change saved study progress.
export const exampleMode=(search=globalThis.location?.search||'')=>new URLSearchParams(search).get('examples')==='frequency'?'frequency':'balanced';
export function exampleNoteHref(id,{set,search=globalThis.location?.search||''}={}){
 const params=new URLSearchParams();
 if(set!==undefined)params.set('set',String(set));

 return '/lemmas/notes.html'+(params.size?'?'+params:'')+'#'+encodeURIComponent(id);
}
