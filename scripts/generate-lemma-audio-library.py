"""Approved $45 eight-voice generation. prepare, submit, collect, finalize.
Key on stdin for network commands. Never automatically repeat synthesis.
"""
import json,pathlib,hashlib,sys,urllib.request,urllib.error,zipfile,shutil
R=pathlib.Path(__file__).resolve().parents[1]; D=R/'audio-generation/lemmas-library';D.mkdir(exist_ok=True)
A=R/'src/audio/azure'; S=R/'audio-generation/lemmas-sample'
def read(p):return json.loads(p.read_text())
def save(p,obj):
 t=p.with_suffix('.tmp');t.write_text(json.dumps(obj,ensure_ascii=False,indent=2));t.replace(p)
def digest(v,t):return hashlib.sha256((v+'\n'+t).encode()).hexdigest()[:24]
cmd=sys.argv[1]; planfile=D/'plan.json'; sample=read(S/'ledger.json'); samplecost=sum(c['characters'] for c in sample['clips'].values())*15/1e6
if cmd=='prepare':
 assert not planfile.exists(),'Plan already frozen'
 inv=read(R/'data/spanish-lemmas/audio/inventory.json');jobs=[];reuse=[]
 for j in inv['jobs']:
  texts=[]
  for t in j['missingTexts']:
   ident=digest(j['voice'],t);c=sample['clips'].get(ident)
   if c and c['status']=='complete':
    assert hashlib.sha256((S/c['file']).read_bytes()).hexdigest()==c['sha256'];reuse.append({**{k:j[k] for k in ['voice','locale','gender']},'text':t,'id':ident,'sha256':c['sha256']})
   else:texts.append(t)
  for start in range(0,len(texts),1000):
   batch=texts[start:start+1000];identity=hashlib.sha256(json.dumps([j['voice'],batch],ensure_ascii=False).encode()).hexdigest()[:20]
   jobs.append({**{k:j[k] for k in ['voice','locale','gender']},'id':'lemma-'+identity,'texts':batch,'characters':sum(map(len,batch))})
 total=sum(j['characters'] for j in jobs)*15/1e6+samplecost
 assert total+2<45
 save(planfile,{'approvedUSD':45,'sampleUSD':samplecost,'estimatedSynthesisUSD':total,'uploadReserveUSD':2,'format':'audio-24khz-48kbitrate-mono-mp3','reusedSamples':reuse,'jobs':jobs})
 print('Frozen',len(jobs),'jobs,',sum(len(j['texts']) for j in jobs),'new clips; synthesis USD',total);sys.exit()
p=read(planfile);assert p['approvedUSD']==45 and p['estimatedSynthesisUSD']+p['uploadReserveUSD']<45
assert {j['voice'] for j in p['jobs']}=={j['voice'] for j in read(S/'plan.json')['jobs']}
key=sys.stdin.read().strip() if cmd in ['submit','collect'] else ''
if cmd in ['submit','collect']:assert len(key)>30
base='https://eastus.api.cognitive.microsoft.com/texttospeech/batchsyntheses/'
def call(j,body=None):
 req=urllib.request.Request(base+j+'?api-version=2024-04-01',data=json.dumps(body,ensure_ascii=False).encode() if body else None,headers={'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/json'},method='PUT' if body else 'GET')
 try:
  with urllib.request.urlopen(req,timeout=60) as r:return json.load(r)
 except urllib.error.HTTPError as e:raise RuntimeError('Azure HTTP '+str(e.code)+'; reserved attempt retained') from None
if cmd=='submit':
 for j in p['jobs']:
  f=D/(j['id']+'.json')
  if f.exists():continue
  record={'id':j['id'],'voice':j['voice'],'characters':j['characters'],'status':'attempted'};save(f,record)
  body={'inputKind':'PlainText','synthesisConfig':{'voice':j['voice']},'inputs':[{'content':t} for t in j['texts']],'properties':{'outputFormat':p['format'],'concatenateResult':False,'wordBoundaryEnabled':False,'sentenceBoundaryEnabled':False}}
  assert len(json.dumps(body).encode())<2000000 and len(j['texts'])<=1000
  result=call(j['id'],body);record['status']=result['status'];save(f,record);print(j['voice'],j['id'],record['status'],flush=True)
elif cmd=='collect':
 done=sum(1 for j in p['jobs'] if (D/(j['id']+'.json')).exists() and read(D/(j['id']+'.json'))['status']=='downloaded')
 for j in p['jobs']:
  f=D/(j['id']+'.json')
  if not f.exists():continue
  record=read(f)
  if record['status']=='downloaded':continue
  result=call(j['id']);record['status']=result['status'];record['properties']=result.get('properties',{});save(f,record)
  if result['status']!='Succeeded':
   continue
  url=result['outputs']['result'];assert url.startswith('https://') and '.blob.core.windows.net/' in url
  archive=D/(j['id']+'.zip')
  with urllib.request.urlopen(url,timeout=120) as response,archive.open('wb') as out:shutil.copyfileobj(response,out)
  proofs=[]
  with zipfile.ZipFile(archive) as z:
   results=json.loads(z.read('summary.json'))['results'];assert len(results)==len(j['texts'])
   for t,r in zip(j['texts'],results):
    assert r['status']=='Succeeded' and r['contents']==[t],'Text/result mismatch or failed clip'
    raw=z.read(r['audioFileName']);assert len(raw)>100
    ident=digest(j['voice'],t);dest=A/j['locale']/(ident+'.mp3');dest.parent.mkdir(exist_ok=True)
    if dest.exists():assert dest.read_bytes()==raw,'Refusing to overwrite different existing recording'
    else:dest.write_bytes(raw)
    proofs.append({'id':ident,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'durationMs':r.get('properties',{}).get('durationInMilliseconds')})
  record.update(status='downloaded',files=proofs);save(f,record);archive.unlink();done+=1;print('Downloaded',done,'/',len(p['jobs']),j['voice'],flush=True)
 print('Collected',done,'/',len(p['jobs']))
elif cmd=='finalize':
 manifests={g:read(A/n) for g,n in [('masculine','manifest.json'),('feminine','manifest-feminine.json')]};count=0;size=0;billed=0
 for j in p['jobs']:
  rec=read(D/(j['id']+'.json'));assert rec['status']=='downloaded' and len(rec['files'])==len(j['texts'])
  billed+=rec['properties']['billingDetails']['neuralCharacters']
  for t,f in zip(j['texts'],rec['files']):
   ident=digest(j['voice'],t);assert f['id']==ident
   path=A/j['locale']/(ident+'.mp3');raw=path.read_bytes();assert hashlib.sha256(raw).hexdigest()==f['sha256'] and len(raw)>100
   manifests[j['gender']]['clips'][j['locale']][t]=j['locale']+'/'+path.name;count+=1;size+=len(raw)
 for c in p['reusedSamples']:
  raw=(S/(c['id']+'.mp3')).read_bytes();assert hashlib.sha256(raw).hexdigest()==c['sha256'];dest=A/c['locale']/(c['id']+'.mp3')
  if dest.exists():assert dest.read_bytes()==raw
  else:dest.write_bytes(raw)
  manifests[c['gender']]['clips'][c['locale']][c['text']]=c['locale']+'/'+dest.name
 targets=read(R/'data/spanish-lemmas/audio/inventory.json')['targets']
 for j in read(S/'plan.json')['jobs']:
  m=manifests[j['gender']];assert m['regions'][j['locale']]==j['voice']
  for t in targets:assert (A/m['clips'][j['locale']][t['text']]).stat().st_size>100
 for g,n in [('masculine','manifest.json'),('feminine','manifest-feminine.json')]:
  dest=A/n;temp=dest.with_suffix('.tmp');temp.write_text(json.dumps(manifests[g],ensure_ascii=False,separators=(',',':')));temp.replace(dest)
 save(D/'validation.json',{'generatedClips':count,'reusedSampleClips':len(p['reusedSamples']),'generatedBytes':size,'courseTextsPerVoice':len(targets),'voices':8,'estimatedSynthesisUSD':p['estimatedSynthesisUSD'],'hashesVerified':count,'providerReportedBulkCharacters':billed,'providerCharacterCostPlusSampleUSD':billed*15/1e6+p['sampleUSD']})
 print('Complete:',count,'generated clips;',size,'bytes; all 8 voices cover',len(targets),'texts')
else:raise ValueError('Unknown command')
