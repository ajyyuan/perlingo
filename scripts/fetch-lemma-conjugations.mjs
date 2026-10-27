// Explicit network refresh only. Normal builds use frozen evidence offline.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const verbs=JSON.parse(readFileSync('lemmas/data/deck.json')).filter(c=>c.sourceTag==='V');
const records={};let next=0,done=0;
async function worker(){while(next<verbs.length){const c=verbs[next++],w=c.lemma;
 const url=`https://kaikki.org/dictionary/Spanish/meaning/${encodeURIComponent(w.slice(0,1))}/${encodeURIComponent(w.slice(0,2))}/${encodeURIComponent(w)}.jsonl`;
 const r=await fetch(url);if(!r.ok)throw Error(`${w}: HTTP ${r.status}`);const raw=await r.text();const entries=raw.trim().split('\n').map(JSON.parse).filter(e=>e.word===w&&e.pos==='verb'&&e.lang_code==='es');
 if(!entries.length||!entries.some(e=>e.forms?.some(f=>f.source==='conjugation')))throw Error(`Missing conjugation: ${w}`);
 records[w]={word:w,url,retrieved:new Date().toISOString().slice(0,10),sha256:createHash('sha256').update(raw).digest('hex'),entries:entries.map(e=>({forms:e.forms.filter(f=>f.source==='conjugation'&&!f.tags.includes('combined-form')),head_templates:e.head_templates,inflection_templates:e.inflection_templates}))};
 if(++done%50===0)console.log(`${done}/${verbs.length}`);await new Promise(r=>setTimeout(r,150));
}}
await Promise.all([worker(),worker(),worker()]);
// Update extraction/dump metadata only after inspecting the source's current index.
writeFileSync('data/spanish-lemmas/conjugation-evidence.json',JSON.stringify({source:'English Wiktionary contributors via Kaikki/Wiktextract',license:'CC BY-SA 4.0',dumpDate:null,extractionDate:null,scope:'Tagged conjugation forms; combined object-pronoun forms omitted. Hashes identify full retrieved per-word JSONL payloads.',records:Object.fromEntries(Object.entries(records).sort(([a],[b])=>a.localeCompare(b)))})+'\n');
console.log(`Saved evidence for ${done} verbs; review differences and fill verified dump metadata before building.`);
