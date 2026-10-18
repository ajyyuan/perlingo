import {packs} from '../src/content/catalog.js';
import {validatePack} from '../src/content/model.js';
const release=process.argv.includes('--release');
for(const pack of packs){
 const errors=validatePack(pack,{release});
 if(errors.length){console.error(`${pack.id}: ${errors.length} issues\n${errors.join('\n')}`);process.exitCode=1;}
 else console.log(`${pack.id} v${pack.version}: ${pack.entries.length} meanings / ${pack.entries.length*3} translations; structure valid. ${release?'Release metadata approved.':'Draft; independent review pending.'}`);
}
