import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const sha=s=>createHash('sha256').update(s).digest('hex');
// Replay only the documented follow-up corrections backwards, preserving every
// older audit's exact fingerprint rather than replacing it with a new baseline.
export function beforeLaterContextCorrections(){
 const text=read('lemmas/data/context.json'),bank=JSON.parse(text);
 const audit=JSON.parse(read('data/spanish-lemmas/later-context-correction-audit.json'));
 assert.equal(sha(text),audit.afterSha256);
 assert.equal(audit.changes.length,12);
 const changes=new Map(audit.changes.map(c=>[c.id,c]));
 assert.equal(changes.size,12);
 for(let i=0;i<bank.contexts.length;i++){
  const current=bank.contexts[i],change=changes.get(current.id);if(!change)continue;
  assert.deepEqual(current,change.after);
  for(const key of ['id','target','answers'])assert.deepEqual(change.before[key],current[key]);
  bank.contexts[i]=change.before;changes.delete(current.id);
 }
 assert.equal(changes.size,0);
 for(const change of audit.conceptChanges){
  assert.deepEqual(bank.concepts[change.id],change.after);
  bank.concepts[change.id]=change.before;
 }
 const restored=JSON.stringify(bank,null,2)+'\n';
 assert.equal(sha(restored),audit.beforeSha256);
 return {bank,sha256:audit.beforeSha256};
}
