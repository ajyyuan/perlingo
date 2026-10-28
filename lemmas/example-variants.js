import {tenseExamples} from './tense-examples-data.js';
import {frequencyPilot,pilotEvidence} from './frequency-pilot-data.js';
import {exampleMode} from './example-mode.js';
export {exampleMode} from './example-mode.js';
export const exampleFor=(id,tense,mode=exampleMode())=>(mode==='frequency'?frequencyPilot[id]?.[tense]:null)||tenseExamples[id]?.[tense];
export const initialExampleTense=(note,mode=exampleMode())=>mode==='frequency'?(pilotEvidence.entries[note.id]?.anchorTense||'present'):'present';
