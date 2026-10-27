"""Check every generated MP3's frames and hash, decode representative clips locally."""
import pathlib,json,hashlib,subprocess
R=pathlib.Path(__file__).resolve().parents[1];D=R/'audio-generation/lemmas-library';p=json.loads((D/'plan.json').read_text());count=0;frames=0;chosen={}
for j in p['jobs']:
 rec=json.loads((D/(j['id']+'.json')).read_text());assert rec['status']=='downloaded'
 for text,f in zip(j['texts'],rec['files']):
  path=R/'src/audio/azure'/j['locale']/(f['id']+'.mp3');raw=path.read_bytes();assert hashlib.sha256(raw).hexdigest()==f['sha256']
  # Batch MP3s include ID3 provenance and an optional higher-bitrate Xing frame.
  pos=10+sum(x<<(7*(3-i)) for i,x in enumerate(raw[6:10])) if raw[:3]==b'ID3' else 0;n=0
  while pos<len(raw):
   assert raw[pos:pos+2]==b'\xff\xf3' and raw[pos+2]&0x0c==0x04,(path,pos,'Unexpected frame format')
   rate=[0,8,16,24,32,40,48,56,64,80,96,112,128,144,160,0][raw[pos+2]>>4]
   assert rate==48 or (n==0 and rate==64),(path,pos,'Unexpected bitrate')
   length=rate*3+((raw[pos+2]>>1)&1);assert pos+length<=len(raw);pos+=length;n+=1
  assert n>1;frames+=n;count+=1
  bucket=chosen.setdefault(j['voice'],[]);bucket.append((len(raw),str(path)))
checks=[]
for voice,files in chosen.items():
 files.sort()
 for size,path in [files[0],files[len(files)//2],files[-1]]:
  output=subprocess.check_output(['/usr/bin/afinfo',path],text=True,stderr=subprocess.STDOUT);assert 'estimated duration:' in output
  checks.append({'voice':voice,'file':path.split('/src/audio/azure/')[1],'bytes':size,'decoded':True})
report={'checkedFiles':count,'validMP3Frames':frames,'estimatedDurationHours':frames*576/24000/3600,'localDecodeSamples':checks}
(D/'mp3-validation.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:v for k,v in report.items() if k!='localDecodeSamples'}));print('Decoded',len(checks),'short/median/long representative clips')
