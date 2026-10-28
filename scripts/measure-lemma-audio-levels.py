"""Offline, deterministic sample. Active-window RMS is not perceptual LUFS."""
import pathlib,json,subprocess,tempfile,wave,array,math,hashlib,concurrent.futures
R=pathlib.Path(__file__).resolve().parents[1]
ms={g:json.loads((R/'src/audio/azure'/f).read_text()) for g,f in [('masculine','manifest.json'),('feminine','manifest-feminine.json')]}
locales=['es-ES','es-MX','es-AR','es-CO']
common=set.intersection(*(set(m['clips'][l]) for m in ms.values() for l in locales))
texts=[('headword',t) for t in ['ser','tener','casa','libro']]+[('form',t) for t in ['soy','eres','somos','tengo']]
texts += [('sentence',t) for t in sorted((t for t in common if len(t.split())>=5 and t.endswith('.')),key=lambda t:hashlib.sha256(t.encode()).hexdigest())[:4]]
assert all(t in common for _,t in texts)
items=[dict(category=c,text=t,locale=l,gender=g,voice=m['regions'][l],file='src/audio/azure/'+m['clips'][l][t]) for g,m in ms.items() for l in locales for c,t in texts]
ledger=json.loads((R/'data/spanish-lemmas/audio/single-letter-corrections.json').read_text())
items += [dict(category='corrected-y',text='y',locale=r['locale'],gender=r['gender'],voice=r['voice'],file='lemmas/audio-corrections/'+r['file']) for r in ledger['clips'] if r['disposition']=='active']
def db(x):return round(20*math.log10(max(x,1e-9)),2)
def measure(item):
 with tempfile.TemporaryDirectory() as d:
  output=pathlib.Path(d)/'audio.wav';subprocess.run(['/usr/bin/afconvert','-f','WAVE','-d','LEI16@24000','-c','1',str(R/item['file']),str(output)],check=True,capture_output=True)
  with wave.open(str(output)) as w:samples=array.array('h',w.readframes(w.getnframes()))
  powers=[sum((x/32768)**2 for x in samples[i:i+480])/len(samples[i:i+480]) for i in range(0,len(samples),480)]
  gate=max(powers)*.0001;active=[p for p in powers if p>gate]
  item.update(peakDBFS=db(max(abs(x) for x in samples)/32768),activeRMSDBFS=db(math.sqrt(sum(active)/len(active))),durationSeconds=round(len(samples)/24000,3),sha256=hashlib.sha256((R/item['file']).read_bytes()).hexdigest())
  return item
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(measure,items))
report={'method':'24 kHz mono PCM; 20 ms windows; activity gate 40 dB below each clip maximum window RMS; unweighted active-window RMS, not LUFS','clips':results}
(R/'data/spanish-lemmas/audio/level-sample.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
for category in ['headword','form','sentence','corrected-y']:
 rows=[r for r in results if r['category']==category];print(category,len(rows),'active RMS range',min(r['activeRMSDBFS'] for r in rows),max(r['activeRMSDBFS'] for r in rows),'peak max',max(r['peakDBFS'] for r in rows))
for _,t in texts:
 rows=[r for r in results if r['text']==t];print(t,'voice spread dB',round(max(r['activeRMSDBFS'] for r in rows)-min(r['activeRMSDBFS'] for r in rows),2))
