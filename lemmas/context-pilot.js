// Reuses the 50 existing source-compared examples, preserving their authored chunks.
// Each blank targets one Spanish surface word; original chunk boundaries remain available for help.
import {firstSetNotes,firstSetConcepts} from './first-set-notes.js';
// Chunk index and exact surface word to remove. Required forms are taught in feedback.
const rows=[
 [0,'El'],[1,'de'],[2,'y'],[1,'en'],[1,'al'],[1,'un'],[1,'que'],[0,'Somos'],[1,'se'],[1,'que'],
 [2,'suyo'],[1,'con'],[0,'No'],[1,'por'],[1,'para'],[0,'Lo'],[0,'Este'],[0,'Como'],[0,'Estoy'],[0,'Tengo'],
 [0,'Voy'],[0,'Le'],[2,'más'],[1,'me'],[0,'Hago'],[0,'Puedo'],[0,'Ese'],[1,'todos'],[2,'o'],[1,'pero'],
 [0,'Él'],[1,'otro'],[0,'Digo'],[0,'año'],[0,'Hay'],[0,'Si'],[2,'mío'],[0,'Doy'],[0,'Veo'],[2,'sobre'],
 [1,'cuando'],[2,'entre'],[1,'también'],[0,'Ya'],[1,'nos'],[1,'uno'],[1,'sin'],[0,'Te'],[2,'muy'],[2,'desde']
];
export const contextPilot=firstSetNotes.map((n,i)=>{
 const [index,target]=rows[i],example=n.examples[0],chunk=example.chunks[index];
 const offset=chunk.text.indexOf(target);if(offset<0)throw Error('Missing cloze target: '+n.id);
 return {id:n.id,example,index,offset,answers:[target],target,explanation:firstSetConcepts[chunk.concept].text,headword:n.word};
});
