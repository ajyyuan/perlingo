"""Reproduce the small observed-form excerpt from the downloaded TUBELEX .tsv.xz."""
import csv
import hashlib
import json
import lzma
from pathlib import Path
import sys

root = Path(__file__).resolve().parent.parent / 'data/spanish-lemmas/tense-examples'
config = json.loads((root / 'frequency-pilot.json').read_text())
source = Path(sys.argv[1])
if hashlib.sha256(source.read_bytes()).hexdigest() != config['source']['sha256']:
    raise ValueError('Source hash differs from the reviewed TUBELEX snapshot')
with lzma.open(source, 'rt', encoding='utf-8') as stream:
    rows = {r['word']: r for r in csv.DictReader(stream, delimiter='\t')}
assert int(rows['[TOTAL]']['count']) == config['source']['totalTokens']
terms = {c['form'] for e in config['entries'].values() for c in e['presentCandidates']} | {'hay', 'he', 'mira', 'mire', 'miren'}
with (root / 'frequency-observations.tsv').open('w', encoding='utf-8') as stream:
    stream.write('word\tcount\tvideos\tchannels\n')
    for term in sorted(terms):
        if term in rows:
            stream.write('\t'.join(rows[term][k] for k in ['word', 'count', 'videos', 'channels']) + '\n')
