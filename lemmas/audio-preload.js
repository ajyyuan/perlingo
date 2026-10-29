// Fetch at most three current-card clips at once; never play or activate audio.
export function createCardPreloader({resolve,load,limit=24}){
 let generation=0,controller;
 return {
  cancel(){generation++;controller?.abort();},
  async preload(texts){
   const id=++generation;controller?.abort();controller=new AbortController();const signal=controller.signal;
   try{
    const urls=[...new Set(await resolve([...new Set(texts)].filter(Boolean).slice(0,limit)))].filter(Boolean);
    if(id!==generation)return;
    let next=0;
    await Promise.all(Array.from({length:Math.min(3,urls.length)},async()=>{
     while(id===generation&&next<urls.length){const url=urls[next++];try{await load(url,signal);}catch{/* A failed preload must not block playback or other clips. */}}
    }));
   }catch{/* Playback retains its normal retry/fallback behavior. */}
  }
 };
}
export function cardAudioTexts(root){
 const priority=root.querySelectorAll('h1 [data-speak], [data-sentence-audio], .sentence-audio');
 return [...new Set([...priority,...root.querySelectorAll('[data-speak]')].map(b=>b.dataset.speak).filter(Boolean))];
}
