// Top-layer quick meanings stay outside scroll containers; pointer clicks never pin them.
export function bindSentenceInteractions(){
 let active=null,keyboard=false,dismissed=null;
 const wordAt=target=>target instanceof Element?target.closest('.quick-word:has(>.word-sound)'):null;
 function hide(){if(active){const p=active.querySelector('.quick-meaning');if(p.matches(':popover-open'))p.hidePopover();active=null;}}
 function show(word){
  if(!word||word===dismissed)return;if(active!==word)hide();active=word;word.classList.remove('tip-dismissed');
  const p=word.querySelector('.quick-meaning');p.setAttribute('popover','manual');if(!p.matches(':popover-open'))p.showPopover();
  const r=word.getBoundingClientRect(),box=p.getBoundingClientRect(),above=r.top>=box.height+12;
  p.dataset.side=above?'above':'below';p.style.left=`${Math.max(8,Math.min(r.left,innerWidth-box.width-8))}px`;
  p.style.top=`${above?r.top-box.height-4:Math.min(r.bottom+4,innerHeight-box.height-8)}px`;
 }
 document.addEventListener('pointerdown',()=>{keyboard=false;},true);
 document.addEventListener('pointerover',e=>{const word=wordAt(e.target);if(word){if(!word.contains(e.relatedTarget))dismissed=null;show(word);}});
 document.addEventListener('pointerout',e=>{if(active&&wordAt(e.target)===active&&!active.contains(e.relatedTarget)){if(!keyboard||!active.contains(document.activeElement))hide();}});
 document.addEventListener('focusin',e=>{if(active&&!active.contains(e.target))hide();if(keyboard)show(wordAt(e.target));});
 document.addEventListener('focusout',e=>{if(active&&!active.contains(e.relatedTarget)&&!active.matches(':hover'))hide();});
 document.addEventListener('keydown',e=>{
  if(e.key==='Tab'){keyboard=true;dismissed=null;}
  if(e.key==='Escape'&&active){const button=active.querySelector('.word-sound');dismissed=active;hide();e.preventDefault();e.stopPropagation();button?.focus({preventScroll:true});}
 },true);
 window.addEventListener('resize',hide);document.addEventListener('scroll',hide,true);
}
