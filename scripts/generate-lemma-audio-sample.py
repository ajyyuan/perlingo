"""Generate only the approved 48-clip audition. Speech key on stdin; never logged.
Resumable completed clips; failed/ambiguous requests require explicit review, not retries.
No course manifests or historical ledgers are changed.
"""
import json,pathlib,sys,hashlib,urllib.request,urllib.error,html
root=pathlib.Path(__file__).resolve().parents[1]
folder=root/'audio-generation/lemmas-sample';plan=json.loads((folder/'plan.json').read_text())
assert len(plan['jobs'])==8 and len(plan['texts'])==6
allowed={'es-ES-AlvaroNeural','es-ES-ElviraNeural','es-MX-JorgeNeural','es-MX-DaliaNeural','es-AR-TomasNeural','es-AR-ElenaNeural','es-CO-GonzaloNeural','es-CO-SalomeNeural'}
assert {j['voice'] for j in plan['jobs']}==allowed
assert sum(len(t) for t in plan['texts'])*8*15/1e6<0.1
key=sys.stdin.read().strip();assert len(key)>30,'Missing Speech key'
ledger=folder/'ledger.json';state=json.loads(ledger.read_text()) if ledger.exists() else {'approvedTotalUSD':45,'sampleLimitUSD':0.1,'ratePerMillion':15,'clips':{}}
def save():
 temp=ledger.with_suffix('.tmp');temp.write_text(json.dumps(state,ensure_ascii=False,indent=2));temp.replace(ledger)
for job in plan['jobs']:
 for text in plan['texts']:
  digest=hashlib.sha256((job['voice']+'\n'+text).encode()).hexdigest()[:24];path=folder/(digest+'.mp3')
  if digest in state['clips']:
   old=state['clips'][digest]
   assert old['status']=='complete' and path.exists() and hashlib.sha256(path.read_bytes()).hexdigest()==old['sha256'],'Existing unresolved attempt; inspect before retrying'
   continue
  chars=len(text);assert (sum(c['characters'] for c in state['clips'].values())+chars)*15/1e6<=0.1
  record={**job,'text':text,'characters':chars,'status':'attempted','file':path.name};state['clips'][digest]=record;save()
  ssml=f'<speak version="1.0" xml:lang="{job["locale"]}"><voice name="{job["voice"]}">{html.escape(text)}</voice></speak>'
  req=urllib.request.Request('https://eastus.tts.speech.microsoft.com/cognitiveservices/v1',data=ssml.encode(),headers={'Ocp-Apim-Subscription-Key':key,'Content-Type':'application/ssml+xml','X-Microsoft-OutputFormat':plan['format'],'User-Agent':'PerlingoLemmaAudition'},method='POST')
  try:
   with urllib.request.urlopen(req,timeout=45) as response:raw=response.read()
  except urllib.error.HTTPError as e:raise RuntimeError('Speech HTTP '+str(e.code)+'; attempt retained, no automatic retry') from None
  assert len(raw)>100,'Empty audio response'
  path.write_bytes(raw);record.update(status='complete',bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest());save()
 print(job['locale'],job['gender'],'6 clips ready',flush=True)
state['estimatedSynthesisUSD']=sum(c['characters'] for c in state['clips'].values())*15/1e6;save()
print('Sample complete; stop for listening approval before bulk generation.',flush=True)
