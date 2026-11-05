// Local full manifests and hosted region shards expose the same playback shape.
export async function loadAudioManifest(url,{fetcher=fetch}={}){
 const read=async path=>{const response=await fetcher(path,{signal:AbortSignal.timeout(15000)});if(!response.ok)throw Error('Audio manifest unavailable');return response.json();};
 const manifest=await read(url);
 if(!manifest.clipShards)return manifest;
 const clips={...manifest.clips};
 await Promise.all(Object.entries(manifest.clipShards).map(async([locale,path])=>{clips[locale]=await read(new URL(path,new URL(url,globalThis.location?.href||'http://localhost/')).href);}));
 return {...manifest,clips};
}
