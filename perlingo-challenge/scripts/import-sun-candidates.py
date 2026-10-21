"""Extract source candidates, not approved teaching entries. No network or publication."""
import json,re,sys,subprocess,hashlib
from datetime import datetime,timezone
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
from source_html import Parser
source=Path(sys.argv[1]).read_bytes();page=source.decode();p=Parser();p.feed(page)
sense='the star around which the Earth revolves'
table=next(t for t in p.root.all('table') if t.attrs.get('data-gloss')==sense)
languages=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {languages} from './public/content.js';console.log(JSON.stringify(languages))"],cwd=ROOT))
revision=re.search(r'"wgRevisionId":(\d+)',page)
revision=revision.group(1) if revision else None
url='https://en.wiktionary.org/wiki/sun/translations'
entries=[]
for language in languages:
 code={'fil':'tl','sr':'sh','hr':'sh','no':'nb','zh':'cmn'}.get(language['id'],language['id'])
 spans=[s for s in table.all('span') if s.attrs.get('lang')==code and 'tr' not in s.attrs.get('class','').split()]
 forms=list(dict.fromkeys(s.text().strip() for s in spans if s.text().strip()))
 if language['id']=='en':forms=['sun'] # English source headword, not a translated span.
 entries.append({'id':language['id'],'language':language['name'],'sourceLanguageCode':code,'sourceForms':forms,'status':'source-candidate' if forms else 'source-gap','taughtForm':None,'reading':None,'accepted':[],'audioStatus':'not-started','reviewNote':'Language/sense/form choice, readings and accepted answers require review. Related variety mappings must be checked explicitly.'})
report={'id':'sun','label':'Sun','sense':sense,'status':'staged-not-playable','source':{'url':url,'revision':revision,'revisionUrl':f'https://en.wiktionary.org/w/index.php?title=sun/translations&oldid={revision}' if revision else url,'sha256':hashlib.sha256(source).hexdigest(),'license':'CC BY-SA 4.0','licenseUrl':'https://creativecommons.org/licenses/by-sa/4.0/','checked':datetime.now(timezone.utc).date().isoformat()},'method':'Extract forms by language-code spans inside the exact celestial-sun translation table. No claim of completed linguistic, reading or audio review. Source forms retain source spelling and marks.','entries':entries}
(ROOT/'data/word-bank/sun.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'languages':len(entries),'withSourceForms':sum(bool(e['sourceForms']) for e in entries),'gaps':[e['language'] for e in entries if not e['sourceForms']]}))
