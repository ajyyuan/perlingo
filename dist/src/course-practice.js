import {shuffle} from './engine.js';
// Contrast and transfer examples never appear in the learn-first queue.
export const learningBank=bank=>bank.filter(i=>!['contrast','transfer'].includes(i.mode));
export function practiceItems(bank,unitId,mode){return bank.filter(i=>i.unitId===unitId&&i.mode===mode);}
export function contrastChoices(item){
 if(item.mode!=='contrast'||!Array.isArray(item.contrastOptions)||item.contrastOptions.length!==2||new Set(item.contrastOptions).size!==2||!item.contrastOptions.includes(item.en))throw new Error(`Invalid contrast ${item.id}`);
 return shuffle(item.contrastOptions);
}
