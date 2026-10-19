import {coursePacks} from '../src/content/course/index.js';
import {lexicalSnapshot} from '../src/content/model.js';
const rows=[];
for(const pack of coursePacks)for(const entry of pack.entries.filter(e=>e.kind==='vocabulary'))for(const [lang,t] of Object.entries(entry.translations))for(const id of t.lexemeIds){
 const l=pack.lexemes[id];if(!l)continue;
 rows.push({...l,packId:pack.id,head:entry.prompt.replace(/^to /,'').replace(/ \(.*/,''),snapshot:lexicalSnapshot(l)});
}
console.log(JSON.stringify(rows));
