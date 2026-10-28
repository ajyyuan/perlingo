// Stored in the course payload so its starting examples travel with progress.
export const validExampleSeed=value=>Number.isInteger(value)&&value>=0&&value<=0xffffffff;
export function newExampleSeed(){return globalThis.crypto?.getRandomValues?crypto.getRandomValues(new Uint32Array(1))[0]:Math.floor(Math.random()*0x100000000);}
export function exampleDraw(seed,id){
 let hash=(seed^2166136261)>>>0;
 for(const char of id){hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;}
 hash^=hash>>>16;hash=Math.imul(hash,0x7feb352d);hash^=hash>>>15;hash=Math.imul(hash,0x846ca68b);hash^=hash>>>16;
 return (hash>>>0)/0x100000000;
}
