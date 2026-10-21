"""Recheck authored words against cached, versioned dictionary pages; never auto-correct."""
from pathlib import Path
from source_html import Parser
import json,sys,re,unicodedata,hashlib,subprocess
root=Path(__file__).resolve().parents[1]
cache=Path(sys.argv[1])
batch=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {firstTen} from './data/word-bank/first-ten.js';console.log(JSON.stringify(firstTen))"],cwd=root))
ledger=json.loads((root/'data/word-bank/first-ten-checks.json').read_text())
# These five entries were inspected in the named language section; retain the
# exact supplementary revision instead of calling a whole-page match a review.
supplements={'dog:gu':('Gujarati','dog'),'moon:ml':('Malayalam','moon'),'star:mr':('Marathi','star'),'star:kn':('Kannada','star'),'milk:zh':('Chinese',"cow's milk")}
def norm(s):
 # Source stress/optional marks only. Never use this looser function for scoring.
 s=''.join(chr(ord(c)-96) if 'ァ'<=c<='ヶ' else c for c in s)
 return ''.join(c for c in unicodedata.normalize('NFD',re.sub(r'\([^)]*\)','',s)) if not unicodedata.combining(c)).casefold()
failures=[]
for pack in batch:
 meta=next(x for x in ledger['sources'] if x['pack']==pack['id'])
 filename=pack['id']+('-translations' if meta['url'].endswith('/translations') else '')+'.html'
 raw=(cache/filename).read_bytes();page=raw.decode();p=Parser();p.feed(page)
 table=next(t for t in p.root.all('table') if t.attrs.get('data-gloss')==meta['sense'])
 revision=re.search(r'"wgRevisionId":(\d+)',page).group(1)
 if revision!=meta['revision']:raise ValueError('Source revision changed; review first: '+pack['id'])
 meta['sha256']=hashlib.sha256(raw).hexdigest()
 for e in pack['entries']:
  key=pack['id']+':'+e['id'];row=next(x for x in ledger['entries'] if x['pack']==pack['id'] and x['language']==e['id'])
  code={'fil':'tl','sr':'sh','hr':'sh','no':'nb','zh':'cmn'}.get(e['id'],e['id'])
  forms=[s.text().strip() for s in table.all('span') if s.attrs.get('lang')==code and 'tr' not in s.attrs.get('class','').split()]
  if e['id']=='en':forms=[pack['id']]
  if key in supplements:
   raw=(cache/(key.replace(':','-')+'.html')).read_bytes();supp=raw.decode();language,gloss=supplements[key]
   q=Parser();q.feed(supp);text=q.root.text();a=text.find(language,text.find('From Wiktionary')) if 'From Wiktionary' in text else -1
   # Presence is a reproducibility smoke check; manual language/sense inspection
   # is separately stated in the evidence ledger and not inferred here.
   if e['word'] not in text or language not in text or gloss not in text:failures.append(key)
   revision=re.search(r'"wgRevisionId":(\d+)',supp).group(1)
   if row['sourceRevision']!=revision:raise ValueError('Supplementary revision changed; review first: '+key)
   row['sourceSha256']=hashlib.sha256(raw).hexdigest()
  else:
   for answer in e['accepted']:
    if not any(norm(answer)==norm(form) for form in forms):
     kanaRow=e['id']=='ja' and any(answer in li.text() and any(span.attrs.get('lang')=='ja' and norm(span.text())==norm(e['word']) for span in li.all('span')) for li in table.all('li'))
     if not kanaRow:failures.append(key+':'+answer)
  if e['word']!=row['word'] or e['accepted']!=row['accepted']:failures.append(key+': authored/evidence mismatch')
if failures:raise ValueError(failures)
(root/'data/word-bank/first-ten-checks.json').write_text(json.dumps(ledger,ensure_ascii=False,indent=2)+'\n')
print('500 forms and explicit accepted answers retain scoped source comparisons; readings remain draft.')
