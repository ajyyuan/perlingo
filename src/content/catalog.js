import {readingPilot} from './reading-pilot.js';
import {foundation} from './foundation.js';
export const packs=[readingPilot,foundation];
const entries=new Map();
for(const pack of packs)for(const entry of pack.entries){if(entries.has(entry.id))throw new Error(`Duplicate catalog ID ${entry.id}`);entries.set(entry.id,{entry,pack});}
export const contentRecord=id=>entries.get(id);
