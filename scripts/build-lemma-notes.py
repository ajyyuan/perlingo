"""Build source-backed lexical notes for every card; sentence notes remain a separate authored layer.
Optional --form-source PATH refreshes the pinned evidence subset. Normal builds are offline.
"""
import argparse, csv, hashlib, json, re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]; DATA=ROOT/'data/spanish-lemmas'; OUT=ROOT/'lemmas/data'
cards=json.loads((OUT/'deck.json').read_text()); dictionary=json.loads((DATA/'dictionary-extract.json').read_text())
args=argparse.ArgumentParser();args.add_argument('--form-source');args=args.parse_args()
EXPECTED='f1a32c8afd23134ba971fb3afe692c2bcf9447f4773c4eceddccbfdd4e53cf34'
if args.form_source:
 raw=Path(args.form_source).read_bytes();assert hashlib.sha256(raw).hexdigest()==EXPECTED
 wanted={(c['lemma'],{'N':'n','A':'adj','V':'v'}.get(c['sourceTag'])) for c in cards}
 available=set()
 for row in csv.reader(raw.decode().splitlines()):
  for lemma in row[2:]:
   if (lemma,row[1]) in wanted:available.add((lemma,row[1],row[0]))
else:
 available={tuple(r) for r in json.loads((DATA/'notes-inflection-evidence.json').read_text())['matches']}
used=set();missing=[]
def exists(w,pos,form):
 if (w,pos,form) in available:
  used.add((w,pos,form));return True
 return False
def bare(w):return w.translate(str.maketrans('áéíóú','aeiou'))
def sections(w,pos):return [s for s in dictionary[w].split('pos: ')[1:] if s.splitlines()[0]==pos]
def plural(w,pos,base=None):
 base=base or w
 irregular={'carácter':'caracteres','régimen':'regímenes','espécimen':'especímenes','país':'países','imagen':'imágenes','joven':'jóvenes','orden':'órdenes','origen':'orígenes'}
 if w in irregular:candidates=[irregular[w]]
 elif w in {'crisis','análisis','virus','lunes','martes','miércoles','jueves','viernes'}:candidates=[w]
 elif w[-1] in 'aeiouáéó':candidates=[w+'s']
 elif w[-1] in 'íú':candidates=[w+'es',w+'s']
 elif w.endswith('z'):candidates=[w[:-1]+'ces']
 elif w.endswith(('n','s')) and w[-2:-1] in 'áéíóú':candidates=[bare(w)+'es']
 elif w.endswith('s') and not re.search('[áéíóú]',w):
  # A headword's presence in allforms does not prove an invariant plural.
  # The two monosyllables in this bank take -es (DPD plural 1.6).
  assert w in {'mes','gas'}, f'Unreviewed -s plural: {w}'
  candidates=[w+'es']
 else:candidates=[w+'es',w+'s']
 for form in candidates:
  if exists(base,pos,form):return form
 missing.append([base,pos,'plural']);return None
SUBJECTS=['yo','tú','él / ella / usted','nosotros / nosotras','vosotros / vosotras','ellos / ellas / ustedes']
IRREGULAR={
 'seguir':'sigo sigues sigue seguimos seguís siguen','conseguir':'consigo consigues consigue conseguimos conseguís consiguen','adquirir':'adquiero adquieres adquiere adquirimos adquirís adquieren','ser':'soy eres es somos sois son','estar':'estoy estás está estamos estáis están','ir':'voy vas va vamos vais van','haber':'he has ha hemos habéis han','dar':'doy das da damos dais dan','saber':'sé sabes sabe sabemos sabéis saben','ver':'veo ves ve vemos veis ven','tener':'tengo tienes tiene tenemos tenéis tienen','venir':'vengo vienes viene venimos venís vienen','decir':'digo dices dice decimos decís dicen','hacer':'hago haces hace hacemos hacéis hacen','poner':'pongo pones pone ponemos ponéis ponen','salir':'salgo sales sale salimos salís salen','oír':'oigo oyes oye oímos oís oyen','traer':'traigo traes trae traemos traéis traen','caer':'caigo caes cae caemos caéis caen','valer':'valgo vales vale valemos valéis valen','caber':'quepo cabes cabe cabemos cabéis caben','reír':'río ríes ríe reímos reís ríen','sonreír':'sonrío sonríes sonríe sonreímos sonreís sonríen','prever':'preveo prevés prevé prevemos prevéis prevén',
}
# Prefix families preserve the parent paradigm, except explicitly accented prever.
FAMILIES={'tener':['mantener','detener','obtener','contener','sostener'],'poner':['proponer','suponer','disponer','imponer','componer','exponer'],'venir':['intervenir'],'hacer':['satisfacer'],'decir':['predecir']}
for parent,words in FAMILIES.items():
 for w in words:IRREGULAR[w]=' '.join(w[:-len(parent)]+f for f in IRREGULAR[parent].split())
def present(w):
 if w in IRREGULAR:forms=IRREGULAR[w].split()
 else:
  root,ending=w[:-2],w[-2:]
  if ending not in ['ar','er','ir']:return []
  endings={'ar':['o','as','a','amos','áis','an'],'er':['o','es','e','emos','éis','en'],'ir':['o','es','e','imos','ís','en']}[ending]
  stressed={root}
  # Candidate rules are accepted only when attested for this exact verb in the frozen mapping.
  vowels=list(re.finditer('[eouiu]',root))
  if vowels:
   i=vowels[-1].start();v=root[i]
   for replacement in {'e':['ie','i','é'],'o':['ue'],'u':['ue','ú'],'i':['í']}.get(v,[]):stressed.add(root[:i]+replacement+root[i+1:])
  if root.endswith('u') and ending=='ir':stressed.add(root+'y')
  yo=set(stressed)
  for stem in list(stressed):
   if stem.endswith('c'):yo.add(stem[:-1]+'zc')
   if stem.endswith('g'):yo.add(stem[:-1]+'j')
   if stem.endswith('gu'):yo.add(stem[:-1])
   if stem.endswith('c'):yo.add(stem[:-1]+'z')
  forms=[]
  for i,suffix in enumerate(endings):
   candidates={(stem+suffix) for stem in (yo if i==0 else {root} if i in [3,4] else stressed)}
   matches=sorted(f for f in candidates if (w,'v',f) in available)
   used.update((w,'v',f) for f in matches)
   if len(matches)!=1:
    missing.append([w,'v',SUBJECTS[i],matches]);return []
   forms.append(matches[0])
 if not all(exists(w,'v',f) for f in forms):missing.append([w,'v','unattested paradigm']);return []
 return list(zip(SUBJECTS,forms))
concepts={
 'enumeration':{'title':'Continuing a list','text':'Etcétera stands for further items that are understood from the list. It is usually abbreviated etc.; it does not agree with the listed nouns.'},
 'noun-m':{'title':'Masculine noun','text':'This entry is masculine in the sense shown. Its usual definite article is el; plural nouns use los. Grammatical gender is a property of the noun, not a rule about the thing it names.'},
 'noun-f':{'title':'Feminine noun','text':'This entry is feminine in the sense shown. Its usual definite article is la; plural nouns use las. Learn the gender with the word rather than guessing from its ending.'},
 'noun-mf':{'title':'Gender in context','text':'This noun can be masculine or feminine. The forms and usage note distinguish the relevant meanings or uses; do not choose a gender from the spelling alone.'},
 'infinitive':{'title':'Infinitive','text':'The headword is an infinitive: the dictionary form of a verb. A finite form changes with person and tense. An infinitive can follow another verb or a preposition; the particular construction determines which preposition, if any, is needed.'},
 'adjective':{'title':'Adjective agreement','text':'An adjective describes or classifies a noun and agrees with it in gender and number. Some adjectives have the same masculine and feminine form. The listed forms are not different vocabulary items.'},
 'adverb':{'title':'Adverb','text':'An adverb modifies a verb, adjective, another adverb or a whole statement. In this grammatical use it does not agree with a noun in gender or number.'},
 'preposition':{'title':'Preposition','text':'A preposition introduces a complement and expresses a relation to the rest of the phrase. Its English translation depends on the construction; learn it with the words around it.'},
 'conjunction':{'title':'Conjunction','text':'A conjunction links words, phrases or clauses. Its role and English translation depend on what it connects.'},
 'pronoun':{'title':'Pronoun','text':'A pronoun stands for a person, thing or idea. Subject, object and prepositional forms have different jobs; the usage note identifies the form taught here.'},
 'relative':{'title':'Relative word','text':'A relative word introduces a clause that relates to a noun or other antecedent. Relative forms normally lack the written accent used in corresponding question words.'},
 'question':{'title':'Question or exclamation','text':'This accented form is used in direct and indirect questions or exclamations. Keep the written accent; an unaccented spelling can have a different grammatical role.'},
 'quantifier':{'title':'Quantity','text':'A quantifier expresses an amount, number or extent. Its position and any agreement depend on the particular word and use; do not assume all quantifiers change in the same way.'},
 'possessive':{'title':'Possessive','text':'Possessive forms identify an owner. Forms that vary agree with the thing owned, rather than with the owner. Some have short forms before a noun and longer forms elsewhere.'},
 'demonstrative':{'title':'Demonstrative','text':'A demonstrative points to something in the physical or conversational context. Forms used with a noun agree with it; neuter forms stand on their own.'},
 'number':{'title':'Number word','text':'This card teaches a numerical use. Cardinal numbers count, while ordinals identify a position in a sequence. Agreement depends on the particular number word.'},
 'article':{'title':'Article','text':'An article belongs with a noun. Its form normally agrees with the noun’s gender and number.'}
}
TAG={'N':'noun','V':'infinitive','A':'adjective','R':'adverb','P':'preposition','C':'conjunction','L':'pronoun','H':'relative','W':'question','Q':'quantifier','X':'possessive','D':'demonstrative','M':'number','T':'article'}
# Sense-specific choices and variable genders, checked against the frozen noun sections.
SPECIAL={
 'parte':('f','La parte means a part or portion. El parte is a report, a different sense.'),
 'mano':('f','La mano (the hand) is feminine despite ending in -o.'),
 'presidente':('m','El presidente; the usual feminine counterpart is la presidenta.'),
 'fin':('m','El fin means an end or purpose.'),
 'final':('m','El final is the end. La final is the final round or match of a competition.'),
 'cabeza':('f','La cabeza means the head. El cabeza can name the male head or leader of a group.'),
 'modelo':('m','El modelo names a model or example. For a person modelling, el modelo or la modelo is used.'),
 'policía':('mf','La policía is the police force. El policía or la policía is an individual police officer.'),
 'color':('m','El color is the usual standard form; feminine usage also exists in some varieties and expressions.'),
 'mañana':('f','La mañana means the morning. Adverbial mañana (tomorrow) is a separate card.'),
 'orden':('mf','La orden is a command or instruction. El orden is arrangement or sequence.'),
 'personaje':('m','El personaje is the usual form even for a female fictional character.'),
 'capital':('mf','El capital is money or financial capital. La capital is a capital city.'),
 'médico':('m','El médico; the feminine counterpart is la médica.'),
 'cámara':('f','La cámara means a camera or chamber. A camera operator can be el cámara or la cámara.'),
 'cabo':('m','El cabo names an end, cape or rope. Military ranks have additional uses.'),
 'defensa':('f','La defensa means defense. El defensa can name a male defender in sport.'),
 'par':('m','El par means a pair. A la par is a separate fixed expression.'),
 'ayuda':('f','La ayuda means help. El/la ayuda de cámara names a personal attendant.'),
 'frente':('mf','La frente is the forehead. El frente is a front, such as the front of a building or a battle front.'),
 'marca':('f','La marca means a mark or brand.'),
 'corte':('mf','El corte is a cut. La corte is a court.'),
 'disco':('m','El disco is a disc or record. La disco is an abbreviation of discoteca, a different use.'),
 'contra':('m','El contra means an objection or disadvantage; los pros y los contras means the pros and cons.'),
 'máquina':('f','La máquina means a machine.'),
 'calor':('m','El calor is the usual standard form. La calor occurs in colloquial and regional usage.'),
 'web':('f','La web is the usual gender for the web or a website.'),
 'arte':('mf','El arte is normally masculine in the singular; las artes is normally feminine in the plural.'),
 'mar':('mf','El mar is usual; la mar also occurs, particularly in maritime speech and fixed expressions.'),
 'radio':('mf','A radio receiver can be la radio or el radio, depending on region. Broadcasting is la radio; radius is el radio.'),
 'internet':('mf','Internet is used with either gender and often without an article.'),
}
STRESSED_A={'agua','área','arma','alma'}
# These cards teach senses selected for singular-only tables. Same-POS form
# membership can include other senses, so it cannot establish a useful plural here.
SINGULAR_SENSES={
 'fútbol':'This card teaches the sport, normally used without a plural.',
 'pasado':'This card teaches the past as a general time or idea, normally singular.',
 'izquierda':'This card teaches the left side or direction in a singular expression; plural uses occur elsewhere, including fixed expressions.',
 'música':'This card teaches music as a general idea, not kinds of music or female musicians.',
 'inglés':'This card teaches the language. Los ingleses usually refers to English people, a different noun sense.',
 'personal':'In the staff/personnel sense, personal is a collective noun normally used in the singular.'
}
usage=json.loads((DATA/'notes-usage.json').read_text())
notes=[]
for c in cards:
 w,tag=c['lemma'],c['sourceTag'];key=TAG[tag];forms=[];more='';pattern='';tip='';formsTitle='Word forms'
 if tag=='N':
  sec=sections(w,'n');g=re.search(r'^  g: (.+)',sec[0],re.M)[1]
  gender='mf' if g.startswith('mf') else g[0]
  if w in SPECIAL:gender,more=SPECIAL[w]
  key='noun-'+gender
  if gender in ['m','f']:
   article='el' if gender=='m' or w in STRESSED_A else 'la'
   pattern=article+' '+w
   forms=[['singular',pattern]]
   p=None if w in SINGULAR_SENSES or w=='don' else plural(w,'n')
   if p:forms.append(['plural',('los' if gender=='m' else 'las')+' '+p])
   if w in SINGULAR_SENSES:more=SINGULAR_SENSES[w]
   if w in STRESSED_A:more=(more+' ' if more else '')+'Feminine despite el: the singular article changes immediately before stressed a. The plural article is las.'
  elif w=='arte':pattern='el arte · las artes';forms=[['usual singular','el arte'],['usual plural','las artes']];assert exists(w,'n','artes')
  else:
   pattern='el / la '+w
   forms=[['masculine','el '+w],['feminine','la '+w]]
   p=plural(w,'n')
   if p:forms.append(['plural','los / las '+p])
   if not more:more='The same noun form can refer to a man or a woman; the article and agreeing words indicate the grammatical gender.'
  tip={'m':'Masculine in the meaning shown.','f':'Feminine in the meaning shown.','mf':'Check the gender in context.'}[gender]
 elif tag=='A':
  f=w
  candidates=[w[:-1]+'a'] if w.endswith('o') else [bare(w)+'a'] if w.endswith(('or','án','ín','ón','és','ol')) else []
  for candidate in candidates:
   if exists(w,'adj',candidate):f=candidate;break
  assert not candidates or f!=w or w in {'bueno','mayor','mejor','menor','peor','anterior','superior'}, f'Unresolved adjective gender: {w}'
  # Only claim invariant gender for the ordinary endings represented by this finite bank.
  forms=[['masculine singular',w],['feminine singular',f]]
  if w=='bueno':
   f='buena';forms=[['masculine singular','bueno'],['feminine singular','buena']]
  p=plural(w,'adj') if w!='bueno' else 'buenos';fp=plural(f,'adj',w) if w!='bueno' else 'buenas'
  if p:forms.append(['masculine plural',p])
  if fp:forms.append(['feminine plural',fp])
  pattern=w if f==w else w+' · '+f
  tip='Same singular form for both genders.' if f==w else 'The ending agrees with the noun.'
 elif tag=='V':
  forms=present(w);formsTitle='Auxiliary present forms' if w=='haber' else 'Present-tense forms'
  pattern=w;tip='Dictionary form · infinitive'
  more='The table shows present indicative, not every tense. Tú and vosotros forms are supplied; voseo forms are not included.' if forms else ''
 else:
  pattern=w;tip=c['partOfSpeech'].capitalize()
 if w=='etcétera' and tag=='Q':key='enumeration'
 if c['sourceNote']:more=(more+' ' if more else '')+c['sourceNote']
 if w in ['ocurrir','suceder','consistir'] and tag=='V':
  forms=[['singular subject',forms[2][1]],['plural subject',forms[5][1]]];more='For the meaning taught here, learn the third-person forms. The subject is what happens or what consists of something.'
 if w=='don' and tag=='N':
  forms=[['before a first name','don']];more='This card teaches the title don, used before a first name without an article. Los dones belongs to the separate gift or talent meaning.'
 if w=='gustar' and tag=='V':more='The grammatical subject is the thing or person that pleases, not the person who likes it: me gusta el libro means I like the book. Gusta agrees with one thing; gustan agrees with plural things.'
 override=usage.get(c['sourceLemma']+':'+tag,{})
 pattern=override.get('pattern',pattern);tip=override.get('tip',tip);more=override.get('more',more)
 forms=override.get('forms',forms) # Explicit source-checked paradigms.
 if w in ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'] and tag=='N':
  pattern='en '+w;tip='Month names are lowercase and normally used without an article.'
 notes.append(dict(id=c['id'],word=w,label=c['partOfSpeech'],meaning='; '.join(c['meanings']),pattern=pattern,tip=tip,tags=[key],examples=[],forms=forms,formsTitle=formsTitle,more=more,source=w,level='lexical'))
assert len(notes)==1500 and len({n['id'] for n in notes})==1500
payload={'version':1,'notes':notes,'concepts':concepts}
(OUT/'notes.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
(DATA/'notes-inflection-evidence.json').write_text(json.dumps({'source':'doozan/spanish_data es_allforms.csv','revision':'b8ed076b4faea26a0985ee46ca736771c2e62dc4','sourceSha256':EXPECTED,'scope':'Membership of displayed inflections in the same lemma/POS; grammatical labels supplied by the documented morphology rules and explicit exceptions.','matches':sorted(used)},ensure_ascii=False,indent=2)+'\n')
(DATA/'notes-build-report.json').write_text(json.dumps({'cards':len(notes),'verbTables':sum(n['label']=='verb' and bool(n['forms']) for n in notes),'inflectionMatches':len(used),'omittedForms':missing,'sentenceExamples':'Authored separately in first-set-notes.js; not generated by this builder.'},ensure_ascii=False,indent=2)+'\n')
print(f"Built {len(notes)} lexical notes; {sum(n['label']=='verb' and bool(n['forms']) for n in notes)} present tables; {len(used)} source form matches; {len(missing)} omitted candidates.")
