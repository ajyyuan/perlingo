// A deliberately small selection of existing note rows, not new lexical content.
export const selection=['corpes:tener:V','corpes:casa:N','corpes:bueno:A'];
const labels={yo:'I',tú:'you · informal','él / ella / usted':'he / she / formal you','nosotros / nosotras':'we','vosotros / vosotras':'you · plural, Spain','ellos / ellas / ustedes':'they / you · plural',singular:'one',plural:'more than one','masculine singular':'masculine · one','feminine singular':'feminine · one','masculine plural':'masculine · plural','feminine plural':'feminine · plural'};
export function prototypeLessons(notes,concepts){
 const whyKeys={'corpes:tener:V':'pilot:irregular','corpes:casa:N':'pilot:plural','corpes:bueno:A':'adjective'};
 return selection.map(id=>{const note=notes.find(n=>n.id===id);if(!note||!note.forms.length)throw Error('Missing source forms: '+id);
  if(!concepts[whyKeys[id]]?.text)throw Error('Missing source explanation: '+id);
  return {...note,why:concepts[whyKeys[id]].text,rows:note.forms.map(([label,form],i)=>({id:id+':form:'+i,word:note.word,meaning:note.meaning,label:labels[label]||label,sourceLabel:label,lemma:form}))};
 });
}
export const freshPrototype=()=>({version:3,phase:'learn',index:0});
export function advanceLesson(state,lessons){
 return {...freshPrototype(),index:Math.min(state.index+1,lessons.length-1)};
}
export function restorePrototype(raw,lessons){
 if(!raw||![2,3].includes(raw.version)||!Number.isInteger(raw.index)||raw.index<0||raw.index>=lessons.length)return freshPrototype();
 // Retain the selected word, but discard any legacy form-quiz state.
 return {...freshPrototype(),index:raw.index};
}
