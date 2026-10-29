// Small immutable-file lookup shards; only levels needed by the selected card load.
export function createLevelLookup(fetchData=fetch){
 const shards=new Map();
 return async url=>{
  const match=url.match(/\/(?:src\/audio\/azure|api\/pronunciation)\/(es-(?:ES|MX|AR|CO))\/([a-f0-9]{24})\.mp3$/);
  const correction=url.match(/^\/lemmas\/audio-corrections\/([a-f0-9]{24})\.mp3$/);
  if(!match&&!correction)return null;
  const id=match?.[2]||correction[1],file=match?`${match[1]}/${id.slice(0,2)}.json`:'corrections.json';
  if(!shards.has(file)){
   const promise=fetchData('/lemmas/audio-levels/'+file,{signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error('Audio levels unavailable');return r.json();}).catch(()=>{shards.delete(file);return null;});
   shards.set(file,promise);if(shards.size>64)shards.delete(shards.keys().next().value);
  }
  const db=(await shards.get(file))?.[id];return Number.isFinite(db)?db:null;
 };
}
export function playbackUrl(url){
 const match=url.match(/^https:\/\/perlingoaudio\.blob\.core\.windows\.net\/pronunciation\/(es-(?:ES|MX|AR|CO))\/([a-f0-9]{24}\.mp3)$/);
 return match?`/api/pronunciation/${match[1]}/${match[2]}`:url;
}
