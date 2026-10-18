import {readingPilot} from '../src/content/reading-pilot.js';
import {validatePack} from '../src/content/model.js';
const release=process.argv.includes('--release');
const errors=validatePack(readingPilot,{release});
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`${readingPilot.id} v${readingPilot.version}: ${readingPilot.entries.length} meanings, 9 translations; structure valid. ${release?'Release metadata approved.':'Draft pilot; independent review remains pending.'}`);
