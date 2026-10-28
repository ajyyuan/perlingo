// Keep shortcut decisions independent from DOM effects and grading.
export function keyboardCommand(e,{editing=false,overlay=false,notes=false,learning=false,choice=false,mac=false}={}){
 if(e.defaultPrevented||e.isComposing||e.repeat||overlay)return null;
 const primary=mac?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey;
 if(primary&&!e.altKey){if(e.code==='KeyK')return 'search';if(e.shiftKey)return ({KeyM:'dictate',KeyH:'home'})[e.code]||null;}
 if(e.altKey||e.ctrlKey||e.metaKey||editing||notes)return null;
 if(e.key==='?')return 'help';
 if(e.shiftKey)return null;
 if(learning)return ({ArrowUp:'previous',ArrowLeft:'previous',ArrowDown:'forward',ArrowRight:'forward',p:'pronounce',P:'pronounce',n:'notes',N:'notes'})[e.key]||null;
 if(choice&&/^[1-4]$/.test(e.key))return 'choice-'+(Number(e.key)-1);
 return null;
}
export function moveIndex(key,index,length){
 if(!length)return null;
 if(key==='Home')return 0;if(key==='End')return length-1;
 if(['ArrowRight','ArrowDown'].includes(key))return (index+1+length)%length;
 if(['ArrowLeft','ArrowUp'].includes(key))return (index-1+length)%length;
 return null;
}
