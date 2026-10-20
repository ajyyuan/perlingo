"""Resumable batch generator. Key on stdin; fixed plan, no automatic resynthesis.
Usage: python3 scripts/generate-azure-library.py submit|collect < private-key-file
"""
import sys,json,pathlib,urllib.request,urllib.error,hashlib,zipfile,subprocess
root=pathlib.Path(__file__).resolve().parents[1]
feminine='--feminine' in sys.argv
expansion='--expansion' in sys.argv
plan=json.loads((root/('audio-generation/azure-expansion-plan.json' if expansion else 'audio-generation/azure-feminine-plan.json' if feminine else 'audio-generation/azure-plan.json')).read_text())
folder=root/'audio-generation'; output=root/'src/audio/azure';output.mkdir(parents=True,exist_ok=True)
allowed={'es-ES':'es-ES-AlvaroNeural','es-MX':'es-MX-JorgeNeural','fr-FR':'fr-FR-HenriNeural','fr-CA':'fr-CA-JeanNeural','de-DE':'de-DE-ConradNeural','de-AT':'de-AT-JonasNeural'}
if feminine:allowed={'es-ES':'es-ES-ElviraNeural','es-MX':'es-MX-DaliaNeural','fr-FR':'fr-FR-DeniseNeural','fr-CA':'fr-CA-SylvieNeural','de-DE':'de-DE-KatjaNeural','de-AT':'de-AT-IngridNeural'}
expansion_voices={'es-AR-TomasNeural':'masculine','es-CO-GonzaloNeural':'masculine','fr-BE-GerardNeural':'masculine','de-CH-JanNeural':'masculine','es-AR-ElenaNeural':'feminine','es-CO-SalomeNeural':'feminine','fr-BE-CharlineNeural':'feminine','de-CH-LeniNeural':'feminine'}
if expansion:
 assert len(plan['jobs'])==8 and {j['voice'] for j in plan['jobs']}==set(expansion_voices) and all(j['voice'].startswith(j['locale']+'-') for j in plan['jobs']),'Unapproved voice scope'
 allowed={v:v for v in expansion_voices}
else:assert {j['locale']:j['voice'] for j in plan['jobs']}==allowed and len(plan['jobs'])==6,'Unapproved voice scope'
key=sys.stdin.read().strip();assert len(key)>30,'Missing Speech key'
base='https://eastus.api.cognitive.microsoft.com/texttospeech/batchsyntheses/'
headers={'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/json'}
chars=sum(len(c['text']) for j in plan['jobs'] for c in j['clips']);assert chars<=(270000 if expansion else 200000),'Job exceeds approved scope'
# East US Standard Neural: $15 / million, verified 2026-10-20. Includes probe margin.
budget=5 if expansion else 3 if feminine else 5
assert (chars+100)*15/1000000<budget,'Job exceeds approved $5 budget'
def call(job,body=None):
 req=urllib.request.Request(base+job+'?api-version=2024-04-01',data=json.dumps(body,ensure_ascii=False).encode() if body else None,headers=headers,method='PUT' if body else 'GET')
 try:
  with urllib.request.urlopen(req,timeout=60) as r:return json.load(r)
 except urllib.error.HTTPError as e:raise RuntimeError(f'Azure HTTP {e.code}: {e.read().decode()[:400]}') from None
inventory=json.loads(subprocess.check_output(['node','scripts/audio-inventory.mjs','--manifest'],cwd=root))
playable={lang:{t['text'] for t in inventory['targets'] if t['locale'].startswith(lang+'-')} for lang in ['es','fr','de']}
manifests={}
completed=0
for gender,name in [('masculine','manifest.json'),('feminine','manifest-feminine.json')]:
 path=output/name
 manifests[gender]=json.loads(path.read_text()) if path.exists() else {'version':1,'provider':'Azure Speech','format':plan['format'],'regions':{},'clips':{}}
for j in plan['jobs']:
 digest=hashlib.sha256(json.dumps(j,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:16]
 job=f'perlingo-{j["locale"].lower()}-{digest}'; ledger=folder/(job+'.json')
 if sys.argv[1]=='submit':
  if ledger.exists():print(j['locale'],'already recorded; collect before resubmission',flush=True);continue
  reserved=(0 if feminine or expansion else 18)+sum(r.get('characters',0) for p in folder.glob('perlingo-*.json') if '.dns-failed.' not in p.name and (r:=json.loads(p.read_text())).get('voice') in allowed.values())
  assert (reserved+sum(len(c['text']) for c in j['clips']))*15/1000000<budget,'Cumulative generation exceeds approved budget'
  record={'id':job,'locale':j['locale'],'voice':j['voice'],'status':'attempted','count':len(j['clips']),'characters':sum(len(c['text']) for c in j['clips'])};ledger.write_text(json.dumps(record,indent=2))
  body={'inputKind':'PlainText','synthesisConfig':{'voice':j['voice']},'inputs':[{'content':c['text']} for c in j['clips']],'properties':{'outputFormat':plan['format'],'concatenateResult':False,'wordBoundaryEnabled':False,'sentenceBoundaryEnabled':False}}
  assert len(json.dumps(body).encode())<2000000
  d=call(job,body);record['status']=d['status'];ledger.write_text(json.dumps(record,indent=2));print(j['locale'],d['status'],flush=True)
 elif sys.argv[1]=='collect':
  record=json.loads(ledger.read_text());archive=folder/(job+'.zip')
  if not archive.exists():
   d=call(job);record['status']=d['status'];record['properties']=d.get('properties',{});ledger.write_text(json.dumps(record,indent=2));print(j['locale'],d['status'],flush=True)
   if d['status']!='Succeeded':continue
   url=d['outputs']['result'];assert url.startswith('https://') and '.blob.core.windows.net/' in url
   # Signed result URL needs no subscription key. Never print or persist it.
   with urllib.request.urlopen(url,timeout=120) as r:archive.write_bytes(r.read())
  with zipfile.ZipFile(archive) as z:
   summary=json.loads(z.read('summary.json'));results=summary['results'];assert len(results)==len(j['clips'])
   mapping={};proof=[]
   for c,r in zip(j['clips'],results):
    if c['text'] not in playable[j['locale'].split('-')[0]]:continue
    assert r['status']=='Succeeded',r.get('error')
    assert r['contents']==[c['text']], 'Audio/text mapping mismatch'
    raw=z.read(r['audioFileName']);assert len(raw)>100
    path=output/j['locale']/(c['id']+'.mp3');path.parent.mkdir(exist_ok=True);path.write_bytes(raw)
    mapping[c['text']]=f'{j["locale"]}/{c["id"]}.mp3'
    proof.append({'id':c['id'],'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'durationMs':r.get('properties',{}).get('durationInMilliseconds')})
   record.update(status='downloaded',files=proof);ledger.write_text(json.dumps(record,indent=2))
   completed+=1
   gender=expansion_voices[j['voice']] if expansion else 'feminine' if feminine else 'masculine'
   manifest=manifests[gender]
   manifest['regions'][j['locale']]=j['voice'];manifest['clips'][j['locale']]=mapping
if sys.argv[1]=='collect' and completed==len(plan['jobs']):
 for gender,name in [('masculine','manifest.json'),('feminine','manifest-feminine.json')]:
  if expansion or (gender=='feminine')==feminine:
   target=output/name;temporary=target.with_suffix('.tmp');temporary.write_text(json.dumps(manifests[gender],ensure_ascii=False,separators=(',',':')));temporary.replace(target)
 print('Complete manifests:',sum(len(c) for m in manifests.values() for c in m['clips'].values()),'recordings',flush=True)
