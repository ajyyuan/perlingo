"""Build small runtime loudness shards from the offline Swift decoder's JSONL output.
Usage: python3 scripts/build-recording-levels.py /tmp/perlingo-level-measurements.jsonl
Recreate input: all Spanish paths from both Azure manifests plus lemmas/audio-corrections/*.mp3.
Compile: swiftc -O scripts/measure-pronunciation-levels.swift -o /tmp/perlingo-measure-levels
Run from repository root with a JSON array of relative input paths and an output JSONL path.
"""
import json,pathlib,sys,hashlib
root=pathlib.Path(__file__).resolve().parents[1];shards={};measured={}
expected=set();manifestHashes={}
for name in ['manifest.json','manifest-feminine.json']:
 p=root/'src/audio/azure'/name;raw=p.read_bytes();manifestHashes[name]=hashlib.sha256(raw).hexdigest()
 for locale,clips in json.loads(raw)['clips'].items():
  if locale.startswith('es-'):expected.update('src/audio/azure/'+p for p in clips.values())
expected.update(str(p.relative_to(root)) for p in (root/'lemmas/audio-corrections').glob('*.mp3'))
if sys.argv[1]=='--inputs':
 pathlib.Path(sys.argv[2]).write_text(json.dumps(sorted(expected)));print(len(expected),'recordings');sys.exit()
for line in pathlib.Path(sys.argv[1]).read_text().splitlines():
 path,db=json.loads(line);measured[path]=round(db,4)
assert expected<=measured.keys(),f'Missing {len(expected-measured.keys())} measurements'
for path in sorted(expected):
 p=pathlib.PurePosixPath(path);ident=p.stem
 shard='corrections.json' if 'audio-corrections' in path else f'{p.parent.name}/{ident[:2]}.json'
 shards.setdefault(shard,{})[ident]=measured[path]
for name,values in shards.items():
 p=root/'lemmas/audio-levels'/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(values,separators=(',',':'))+'\n')
report={'recordings':len(expected),'shards':len(shards),'method':'Native float PCM; 20 ms windows; speech activity gate 40 dB below maximum-window RMS; unweighted active RMS, not LUFS','precisionDB':0.0001,'manifestSHA256':manifestHashes,'runtimeTargetDBFS':-16,'adjustmentCapDB':12}
(root/'data/spanish-lemmas/audio/precomputed-levels.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
