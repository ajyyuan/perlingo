"""Reproduce the reviewed full-deck choices from a hash-verified TUBELEX snapshot."""
import csv
import hashlib
import json
import lzma
from pathlib import Path
import re
import subprocess
import sys

repo = Path(__file__).resolve().parent.parent
root = repo / 'data/spanish-lemmas/tense-examples'
config = json.loads((root / 'pilot-25.json').read_text())
review = json.loads((root / 'frequency-selection-review.json').read_text())
source = Path(sys.argv[1])
assert hashlib.sha256(source.read_bytes()).hexdigest() == config['source']['sha256'], 'Unreviewed source snapshot'
with lzma.open(source, 'rt', encoding='utf-8') as stream:
    rows = {r['word']: r for r in csv.DictReader(stream, delimiter='\t')}
forms = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', "import {verbForms} from './lemmas/verb-forms-data.js';console.log(JSON.stringify(verbForms));"], cwd=repo, text=True))
balanced = json.loads((root / 'people.json').read_text())
# Fixed lexical subjects from the reviewed baseline: no arbitrary human substitution.
fixed = {'existir':2,'gustar':2,'ocurrir':2,'morir':5,'resultar':2,'caer':5,'suceder':2,'nacer':5,'significar':2,'funcionar':2,'faltar':2,'depender':2,'surgir':2,'valer':2,'sonar':2,'costar':2,'consistir':2,'caber':2,'durar':2,'bastar':2}
slots = {'yo':0,'tú':1,'él':2,'ella':2,'nosotros':3,'nosotras':3,'ellos':5,'ellas':5}
selected = {}; gender = {2:0,5:0}
for id, group in forms.items():
    word = id.split(':')[1]
    if word in config['entries']:
        selected[word] = config['entries'][word]
        continue
    collision = review['excludedFromAutomaticRanking'].get(word,{})
    candidates = []
    for slot, alts in enumerate(group['present']):
        form = alts[0]; row = rows.get(form)
        c = {'form':form,'slot':slot,'count':int(row['count']) if row else None,'channels':int(row['channels']) if row else None}
        if form in collision.get('forms',[]):
            c['excludedFromAutomaticRanking'] = True
        candidates.append(c)
    eligible = sorted((c for c in candidates if c['slot'] != 4 and not c.get('excludedFromAutomaticRanking') and c['count'] is not None),key=lambda c:(-c['count'],-c['channels'],c['slot']))
    assert eligible, word
    top = eligible[0]; chosen = top; rule = 'leading-eligible-form'
    if word in fixed:
        chosen = candidates[fixed[word]]; rule = 'fixed-subject'
        person = 'third'
        reason = 'Keep the reviewed lexical subject and its number; this construction is not reassigned to a person just because another spelling has more tokens.'
    elif word == 'soler':
        chosen = candidates[2]; person = 'ella'; rule = 'defective-verb'
        reason = 'Use third-person suele and preserve the restricted paradigm. Suelo includes floor/ground; the common-usage and rare-perfect notices are retained.'
    else:
        bslot = slots[balanced[word]]
        b = candidates[bslot]
        if not b.get('excludedFromAutomaticRanking') and b['count'] is not None and b['count'] >= top['count']*review['nearLeaderCountRatio'] and b['channels'] >= top['channels']*review['nearLeaderChannelRatio']:
            chosen = b; rule = 'near-leader-variety'
        override = review['personOverrides'].get(word)
        if override:
            person = override['person']; chosen = candidates[slots[person]]; rule = 'editorial-override'; reason = override['reason']
        else:
            slot = chosen['slot']
            if slot == bslot: person = balanced[word]
            elif slot in [2,5]:
                person = ({2:['ella','él'],5:['ellas','ellos']})[slot][gender[slot]%2]; gender[slot]+=1
            else: person = {0:'yo',1:'tú',3:'nosotros'}[slot]
            reason = ('Keep the balanced person because its eligible spelling is close to the leading form in both token count and channel coverage.' if rule == 'near-leader-variety' else 'Use the leading eligible present spelling after the homograph screen; the chosen sentence illustrates the existing taught sense, not a measured most-frequent construction.')
    if collision: reason += ' '+collision['reason']
    if word in review['senseNotes']: reason += ' '+review['senseNotes'][word]
    reason += ' Surface counts do not separate statements from commands or identify the sense in this example.'
    row = rows[chosen['form']]
    selected[word]={'person':person,'anchor':chosen['form'],'anchorTense':'present','reason':reason,'selectionRule':rule,'evidence':{k:int(row[k]) for k in ['count','videos','channels']},'presentCandidates':candidates}
config['entries'] = selected
config['scope'] = {'verbCount':len(selected),'expandedOn':'2026-10-28','selectionReview':'frequency-selection-review.json','originalPilot':'pilot-25.json','notes':'Every verb reviewed; unchanged examples and fixed-subject exceptions are intentional. Present spelling evidence informs the anchor; other tenses are not independently frequency-ranked.'}
config['specialOverrides']={'soler':{
 'present':{'text':'Ella suele leer por la noche.','translation':'She usually reads at night.','target':'suele','slot':2,'wordMeanings':{'ella':'she','suele':'usually does (followed by an infinitive)','por':'at (in por la noche)'}},
 'imperfect':{'text':'Ella solía leer por la noche.','translation':'She used to read at night.','target':'solía','slot':2,'wordMeanings':{'ella':'she','solía':'used to (followed by an infinitive)','por':'at (in por la noche)'}},
 'perfect':{'text':'Ella ha solido leer por la noche.','translation':'She has usually read at night.','target':'ha solido','slot':2,'wordMeanings':{'ella':'she','ha':'has (auxiliary)','solido':'usually done (uncommon compound form)','por':'at (in por la noche)'}},
 'subjunctive':{'text':'Me alegra que ella suela leer.','translation':'I am glad she usually reads.','target':'suela','slot':2,'wordMeanings':{'me':'me (person feeling glad)','alegra':'makes glad','ella':'she','suela':'usually does (subjunctive)'}}}}
(root/'frequency-pilot.json').write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n')
print(f'{len(selected)} reviewed verb decisions')
