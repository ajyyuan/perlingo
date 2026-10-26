import {readFile, writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

const data = JSON.parse(await readFile(new URL('./quotes.json', import.meta.url), 'utf8'));
const ids = new Set();
for (const entry of data.entries) {
  assert(!ids.has(entry.id), `Duplicate ID: ${entry.id}`);
  ids.add(entry.id);
  for (const key of ['id', 'quote', 'speaker', 'lane', 'format', 'priority', 'translation_effort', 'context', 'performance', 'translation_note', 'evidence_note']) {
    assert(typeof entry[key] === 'string' && entry[key].trim(), `${entry.id}: missing ${key}`);
  }
  assert(['Start here', 'Deep cut', 'Extra'].includes(entry.priority));
  assert(['Easy', 'Medium', 'Hard'].includes(entry.translation_effort));
  assert(['NBA', 'Sports', 'Internet'].includes(entry.lane));
  assert(entry.sources.length > 0, `${entry.id}: missing source`);
  for (const source of entry.sources) assert(new URL(source.url).protocol === 'https:');
  assert.equal(entry.playback_checked, false, 'Update evidence workflow before certifying playback.');
}
const template = await readFile(new URL('./template.html', import.meta.url), 'utf8');
assert.equal(template.split('/* QUOTE_BANK_DATA */').length, 2);
const encoded = JSON.stringify(data).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
const html = template.replace('/* QUOTE_BANK_DATA */', () => encoded);
await writeFile(new URL('./index.html', import.meta.url), html);
console.log(`Built quote bank: ${data.entries.length} entries; IDs, required fields, links and evidence flags passed.`);
