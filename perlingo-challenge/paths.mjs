// Shared by the same-origin local preview and the hosted build.
export function challengePaths(text,names){return text.replace(/(["'`])\/(?!\/)([^"'`\s<>]*)/g,(match,quote,rest)=>{
 if(!rest)return quote==='"'?quote+'/challenge/':match;
 const first=rest.split(/[/?#]/)[0];
 return names.has(first)||first==='api'?quote+'/challenge/'+rest:match;
});}
