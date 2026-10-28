// Search is forgiving; assessment spelling remains strict.
export const foldSearch=value=>String(value).normalize('NFD').replace(/\p{M}/gu,'').toLocaleLowerCase();
export function searchCards(deck,query){
 const raw=query.trim().normalize('NFC').toLocaleLowerCase(),q=foldSearch(raw);
 if(!q)return deck;
 const score=c=>{
  const lemma=foldSearch(c.lemma),meaning=foldSearch(c.meaning);
  if(c.lemma.normalize('NFC').toLocaleLowerCase()===raw)return 0;
  if(lemma===q)return 1;
  if(lemma.startsWith(q))return 2;
  if(lemma.includes(q))return 3;
  if(meaning.includes(q))return 4;
  return 5;
 };
 return deck.map((card,index)=>({card,index,score:score(card)})).filter(c=>c.score<5).sort((a,b)=>a.score-b.score||a.index-b.index).map(c=>c.card);
}
