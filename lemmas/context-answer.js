export const answerTokens=text=>String(text).normalize('NFC').toLocaleLowerCase('es').match(/[\p{L}\p{M}\p{N}]+/gu)||[];
export function contextSpan(response,context,targetMatches){
 const input=answerTokens(response);if(!input.length)return null;
 const chunks=context.example.chunks;
 const sentence=chunks.flatMap(c=>answerTokens(c.text));
 const target=chunks.slice(0,context.index).reduce((n,c)=>n+answerTokens(c.text).length,0)+answerTokens(chunks[context.index].text.slice(0,context.offset)).length;
 for(let start=Math.max(0,target-input.length+1);start<=target&&start+input.length<=sentence.length;start++){
  if(input.every((word,i)=>start+i===target?targetMatches(word):word===sentence[start+i]))return {input,targetIndex:target-start};
 }
 return null;
}
export function matchesContextAnswer(response,context){
 const accepted=context.answers.map(a=>answerTokens(a).join(' '));
 return Boolean(contextSpan(response,context,word=>accepted.includes(word)));
}
