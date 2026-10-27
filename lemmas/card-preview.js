import {bindSentenceInteractions} from './sentence-interactions.js';
import {mountStudyCard} from './study-card.js';
export function bindCardPreview({notes,concepts,voice,onOpen=()=>{}}){
 bindSentenceInteractions();
 const byId=new Map(notes.map(n=>[n.id,n]));let dialog,card,anchor;
 function close(){card?.destroy();card=null;dialog?.remove();dialog=null;if(anchor?.isConnected)anchor.focus({preventScroll:true});}
 document.addEventListener('click',e=>{
  const link=e.target.closest('[data-lemma-card]');if(!link||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const note=byId.get(link.dataset.lemmaCard);if(!note)return;e.preventDefault();
  // A lookup never changes the course's selected set, test, score or saved position.
  if(dialog){card?.destroy();dialog.remove();}else anchor=link.closest('.quick-word')?.querySelector('button')||document.querySelector('[aria-controls="chunk-help"][aria-expanded="true"]')||link;
  onOpen();voice.stop();dialog=document.createElement('dialog');dialog.className='lemma-card-preview';dialog.setAttribute('aria-label',`${note.word} · course card`);
  dialog.innerHTML='<button class="plain preview-close" aria-label="Close course card">×</button><div class="preview-content"></div>';
  document.body.append(dialog);
  card=mountStudyCard(dialog.querySelector('.preview-content'),note,concepts,{voice,heading:'',index:0,reference:true});
  dialog.querySelector('.preview-close').onclick=()=>dialog.close();dialog.addEventListener('close',close);
  dialog.addEventListener('click',event=>{const b=event.target.closest('[data-speak]');if(b&&!b.closest('.word-note'))voice.speak(b.dataset.speak,'es-ES','Spanish',()=>{});if(event.target.closest('[data-action="notes"]'))card.openNotes();});
  dialog.showModal();dialog.querySelector('.preview-close').focus();
 });
}
