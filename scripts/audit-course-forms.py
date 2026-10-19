# Read-only comparisons: writes reports to the chosen cache, never changes course evidence.
import sys
from pathlib import Path
CACHE=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/tmp')
import json,urllib.parse,pathlib
rows=json.load(open(str(CACHE / 'perlingo-form-candidates.json')));out=pathlib.Path(str(CACHE / 'perlingo-source-forms'));issues=[];checks={};counts={}
norm=lambda s:s.replace('’',"'").strip()
for l in rows:
 if l['pos'] not in ['noun','verb','adjective']:continue
 p=out/(l['lang']+'-'+urllib.parse.quote(l['lemma'],safe='')+'.jsonl')
 if not p.exists():continue
 records=[json.loads(s) for s in open(p)];pos={'adjective':'adj'}.get(l['pos'],l['pos']);rs=[r for r in records if r.get('pos')==pos]
 if not rs:issues.append([l['id'],'part of speech',l['lemma']]);continue
 fs=[f for r in rs for f in r.get('forms',[]) if not set(f.get('tags',[])) & {'archaic','obsolete','dated','rare'}];done=[]
 if pos=='noun':
  tags={t for r in rs for s in r.get('senses',[]) for t in s.get('tags',[])}
  if l['gender'] in tags:done.append('grammatical gender listed among this headword’s noun senses')
  else:issues.append([l['id'],'gender',l['gender'],sorted(tags)])
  for f in l['forms']:
   if f.get('number')!='plural':continue
   plurals={norm(x['form']) for x in fs if 'plural' in x.get('tags',[]) and (f.get('case') in x.get('tags',[]) if f.get('case') else not set(x.get('tags',[]))&{'dative','genitive'})}
   if (norm(f['text']) in plurals or ('invariable' in tags and norm(f['text'])==norm(l['lemma']))):done.append('recorded plural spelling occurs as a plural form')
   else:issues.append([l['id'],'plural',f['text'],sorted(plurals)])
 if pos=='verb':
  for f in l['forms']:
   if f.get('verbForm')!='finite':continue
   person=['','first-person','second-person','third-person'][f['person']]
   expected={f['mood'],f['tense'],f['number'],person}
   options={norm(x['form']) for x in fs if expected.issubset(set(x.get('tags',[]))) and 'vos-form' not in x.get('tags',[])}
   if norm(f['text']) in options:done.append(f"{f['tense']} {f['person']}/{f['number']} spelling and tags")
   else:issues.append([l['id'],'verb',f['text'],f['person'],f['number'],sorted(options)])
 if pos=='adj':done.append('headword has an adjective entry in the extracted source')
 if done:checks[l['id']]=done
for i in issues:counts[i[1]]=counts.get(i[1],0)+1
json.dump({'checks':checks,'issues':issues,'counts':counts},open(str(CACHE / 'perlingo-form-audit.json'),'w'),ensure_ascii=False,indent=2)
print('checked records',len(checks),'issues',counts)
for i in issues[:80]:print(i)
