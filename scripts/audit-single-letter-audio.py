import pathlib,json,subprocess,tempfile,urllib.request,urllib.error,hashlib,wave,concurrent.futures
import sys
R=pathlib.Path(__file__).resolve().parents[1]
corrected='--corrected' in sys.argv
out=R/'data/spanish-lemmas/audio'/('single-letter-corrected-audit' if corrected else 'single-letter-audit');out.mkdir(exist_ok=True)
key=sys.stdin.read().strip();assert len(key)>30,'Missing Speech key'
region='eastus'
items=[]
for gender,name in [('masculine','manifest.json'),('feminine','manifest-feminine.json')]:
 m=json.loads((R/'src/audio/azure'/name).read_text())
 for locale,clips in m['clips'].items():
  if not locale.startswith('es-'):continue
  for text in ['a','A','e','o','y']:
   items.append(dict(text=text,locale=locale,voice=m['regions'][locale],gender=gender,file=clips[text]))
if corrected:
 items=[dict(text=r['text'],locale=r['locale'],voice=r['voice'],gender=r['gender'],file=r['file']) for r in json.loads((R/'data/spanish-lemmas/audio/single-letter-corrections.json').read_text())['clips'] if r.get('disposition')=='active']
def check(item):
 result=out/(item['voice']+'-'+str(ord(item['text']))+'.json')
 if result.exists():return json.loads(result.read_text())
 p=R/('lemmas/audio-corrections' if corrected else 'src/audio/azure')/item['file'];item['sha256']=hashlib.sha256(p.read_bytes()).hexdigest()
 with tempfile.TemporaryDirectory() as d:
  wav=pathlib.Path(d)/'clip.wav';subprocess.run(['/usr/bin/afconvert','-f','WAVE','-d','LEI16@16000','-c','1',str(p),str(wav)],check=True,capture_output=True)
  with wave.open(str(wav)) as w:item['durationSeconds']=w.getnframes()/w.getframerate()
  req=urllib.request.Request(f'https://{region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language={item["locale"]}&format=detailed',data=wav.read_bytes(),headers={'Ocp-Apim-Subscription-Key':key,'Content-Type':'audio/wav; codecs=audio/pcm; samplerate=16000','Accept':'application/json'})
  try:
   with urllib.request.urlopen(req,timeout=45) as r:item['recognition']=json.load(r)
  except urllib.error.HTTPError as e:item['error']='HTTP '+str(e.code)
 result.write_text(json.dumps(item,ensure_ascii=False,indent=2)+'\n')
 return item
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for r in pool.map(check,items):print(r['voice'],r['text'],round(r['durationSeconds'],2),r.get('recognition',{}).get('NBest',[{}])[0].get('Lexical',r.get('recognition',{}).get('RecognitionStatus',r.get('error'))),flush=True)
