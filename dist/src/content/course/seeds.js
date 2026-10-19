import {foundation} from '../foundation.js';
import {readingPilot} from '../reading-pilot.js';
// Reuse existing IDs, checked facts and references. Course assignments are an overlay,
// so the original foundation preview and its progress remain unchanged.
const destinations={
 mother:'u02',father:'u02',sister:'u02',brother:'u02',family:'u02',
 city:'u06',street:'u06',school:'u03',window:'u02',door:'u02',room:'u02',kitchen:'u02',chair:'u02',bed:'u02',
 car:'u06',train:'u06',station:'u06',ticket:'u06',shop:'u05',market:'u05',restaurant:'u05',meal:'u05',egg:'u05',potato:'u05',tomato:'u05',orange:'u05',
 letter:'u03',newspaper:'u03',pen:'u01',question:'u01',write:'u03',buy:'u05',want:'u05',see:'u03',give:'u11',take:'u06',open:'u03',close:'u03'
};
export function seedCoursePack(pack){
 const copy=JSON.parse(JSON.stringify(pack));
 for(const l of Object.values(copy.lexemes))l.unitId=pack.id==='foundation'?destinations[l.id.slice(3)]:(l.pos==='noun'?'u02':'u03');
 for(const e of copy.entries){
  const vocabulary=['noun','verb'].includes(e.type);e.kind=vocabulary?'vocabulary':'example';
  e.unitId=vocabulary?copy.lexemes[e.translations.es.lexemeIds[0]].unitId:'u03';
  if(!vocabulary){e.objectiveId='u03.1';e.mode='production';e.situation=e.prompt.includes('newspaper')?'Buying a newspaper':'Everyday actions';}
 }
 return copy;
}
export const courseSeeds=[seedCoursePack(readingPilot),seedCoursePack(foundation)];
