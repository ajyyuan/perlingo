"""Scoped spelling-presence check; this is not a linguistic or IPA review."""
import subprocess,json,urllib.request,unicodedata,re
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[1]
class Text(HTMLParser):
 def __init__(self):super().__init__();self.parts=[];self.skip=0
 def handle_starttag(self,tag,attrs):
  if tag in ('script','style'):self.skip+=1
 def handle_endtag(self,tag):
  if tag in ('script','style'):self.skip=max(0,self.skip-1)
 def handle_data(self,data):
  if not self.skip:self.parts.append(data)
def normalize(s):return ''.join(c for c in unicodedata.normalize('NFD',s) if not unicodedata.combining(c)).casefold()
packs=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {packs} from './public/content.js';console.log(JSON.stringify(packs))"],cwd=ROOT))
report=[];sources=[]
for pack in packs:
 url='https://en.wiktionary.org/wiki/'+('water/translations' if pack['id']=='water' else 'bread')
 req=urllib.request.Request(url,headers={'User-Agent':'PerlingoChallenge/0.1 local source comparison'})
 page=urllib.request.urlopen(req,timeout=30).read().decode();parser=Text();parser.feed(page);text=normalize(' '.join(parser.parts))
 revision=re.search(r'"wgRevisionId":(\d+)',page)
 sources.append({'pack':pack['id'],'url':url,'revision':revision.group(1) if revision else None})
 for e in pack['entries']:report.append({'pack':pack['id'],'language':e['id'],'word':e['word'],'spelling_present':normalize(e['word']) in text})
(ROOT/'source-check.json').write_text(json.dumps({'checked':'2026-10-20','method':'Normalized spelling presence only. Does not verify language attribution, sense, IPA, readings or all accepted alternatives.','sources':sources,'entries':report},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'checked':len(report),'missing':[r for r in report if not r['spelling_present']]},ensure_ascii=False))
