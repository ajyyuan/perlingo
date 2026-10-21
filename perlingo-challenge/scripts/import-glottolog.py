"""Build the explorer from a pinned official Glottolog download; no runtime network dependency."""
import csv, hashlib, io, json, urllib.request, zipfile
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
URL = 'https://cdstar.eva.mpg.de/bitstreams/EAEA0-608B-9919-A962-0/glottolog_languoid.csv.zip'
SHA256 = '47fcc04c18f3f6bff43198b5be14f1f6954600c90573373df9ecf6fc12622bfb'
cache = ROOT / '.cache/glottolog/glottolog_languoid.csv.zip'
if not cache.exists():
    cache.parent.mkdir(parents=True, exist_ok=True)
    data = urllib.request.urlopen(URL, timeout=60).read()
    if hashlib.sha256(data).hexdigest() != SHA256:
        raise ValueError('Glottolog download changed; review before updating the pinned hash.')
    cache.write_bytes(data)
data = cache.read_bytes()
assert hashlib.sha256(data).hexdigest() == SHA256, 'Cached source hash mismatch'
archive = zipfile.ZipFile(io.BytesIO(data))
rows = list(csv.DictReader(io.StringIO(archive.read('languoid.csv').decode('utf-8-sig'))))
by_id = {r['id']: r for r in rows}
assert len(by_id) == len(rows)
for r in rows:
    seen = {r['id']}
    parent = r['parent_id']
    while parent:
        assert parent in by_id and parent not in seen, 'Broken or cyclic ancestry'
        seen.add(parent)
        parent = by_id[parent]['parent_id']
mappings = json.loads((ROOT / 'data/playable-glottocodes.json').read_text())
assert len(mappings) == 50 and len({m['node'] for m in mappings.values()}) == 50
for m in mappings.values():
    assert by_id[m['node']]['iso639P3code'] == m['iso'], 'Mapping no longer matches its reviewed ISO code'
meta = dict(version='5.3',source=URL,sha256=SHA256,
    citation='Hammarström, Harald & Forkel, Robert & Haspelmath, Martin & Bank, Sebastian. 2026. Glottolog 5.3. Leipzig: Max Planck Institute for Evolutionary Anthropology.',
    doi='https://doi.org/10.5281/zenodo.15525265',license='CC BY 4.0',licenseUrl='https://creativecommons.org/licenses/by/4.0/',
    retrieved='2026-10-21',nodeCount=len(rows),
    modification='Selected catalog fields converted to compact JSON; original names, levels and parent links retained. Playable mappings and UI labels added by Perlingo. Includes catalog groups and bookkeeping records, not only genealogical families.')
output = dict(meta=meta,fields=['id','parent','name','level','iso','bookkeeping'],
    nodes=[[r['id'],r['parent_id'] or None,r['name'],r['level'],r['iso639P3code'] or None,r['bookkeeping']=='True'] for r in rows],playable=mappings)
(ROOT/'public/language-tree.json').write_text(json.dumps(output,ensure_ascii=False,separators=(',',':'))+'\n')
(ROOT/'data/GLOTTOLOG-LICENSE.txt').write_text(archive.read('README.txt').decode()+'\nPerlingo retrieved this pinned archive on 2026-10-21.\nSource: '+URL+'\nSHA-256: '+SHA256+'\n\n'+meta['modification']+'\n')
print(f"Imported {len(rows)} nodes, {sum(not r['parent_id'] for r in rows)} roots; all 50 mappings verified.")
