# Read-only comparisons: writes reports to the chosen cache, never changes course evidence.
import sys
from pathlib import Path
CACHE=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/tmp')
import xml.etree.ElementTree as E,json,hashlib
from collections import defaultdict
ns={'t':'http://www.tei-c.org/ns/1.0'}
rows=json.load(open(str(CACHE / 'perlingo-candidates.json')));wanted={r['head'] for r in rows}
results={}; metadata={}
for lang,pair in [('es','eng-spa'),('fr','eng-fra'),('de','eng-deu')]:
 path=str(CACHE / 'perlingo-')+pair+'.tei';index=defaultdict(set)
 for event,e in E.iterparse(path,events=['end']):
  if e.tag.endswith('}entry'):
   h=e.find('t:form/t:orth',ns)
   if h is not None and h.text in wanted:
    # Only direct translation citations; never match examples or unrelated nested text.
    for q in e.findall('t:sense/t:cit[@type="trans"]/t:quote',ns):
     if q.text:index[h.text].add(q.text.strip())
   e.clear()
 matched=0;missing=[]
 for r in [r for r in rows if r['lang']==lang]:
  if r['lemma'] in index[r['head']]:
   matched+=1;results[r['id']]={'headword':r['head'],'translation':r['lemma'],'source':pair,'snapshot':r['snapshot']}
  else:missing.append({k:r[k] for k in ['id','head','lemma']})
 metadata[pair]={'sha256':hashlib.file_digest(open(path,'rb'),'sha256').hexdigest(),'matches':matched,'candidates':matched+len(missing)}
 json.dump(missing,open(str(CACHE / 'perlingo-unmatched-')+lang+'.json','w'),ensure_ascii=False,indent=2)
 print(lang,matched,'matched;',len(missing),'pending',flush=True)
json.dump({'metadata':metadata,'matches':results},open(str(CACHE / 'perlingo-dictionary-matches.json'),'w'),ensure_ascii=False,indent=2)
