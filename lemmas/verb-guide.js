import {formGroups} from './verb-forms.js';
import {verbForms} from './verb-forms-data.js';
import {guideForms} from './verb-guide-data.js';

const titles = {
  present:'Present', preterite:'Preterite', imperfect:'Imperfect', future:'Future', conditional:'Conditional',
  perfect:'Present perfect', subjunctive:'Present subjunctive', commands:'Affirmative commands', negative:'Negative commands'
};
const haber = verbForms['corpes:haber:V'];
const haberExtra = guideForms['corpes:haber:V'];

const compounds = [
  ['pastPerfect','Past perfect','imperfect'],
  ['futurePerfect','Future perfect','future'],
  ['conditionalPerfect','Conditional perfect','conditional'],
  ['perfectSubjunctive','Present perfect subjunctive','subjunctive'],
  ['pluperfectSubjunctive','Past perfect subjunctive','pastSubjunctive'],
  ['pastAnterior','Preterite anterior','preterite'],
  ['futurePerfectSubjunctive','Future perfect subjunctive','futureSubjunctive']
];
const categories = [
  ['Nonfinite forms',['nonfinite']],
  ['Indicative',['present','preterite','imperfect','future','conditional','perfect','pastPerfect','futurePerfect','conditionalPerfect']],
  ['Subjunctive',['subjunctive','pastSubjunctive','perfectSubjunctive','pluperfectSubjunctive']],
  ['Commands',['commands','negative']],
  ['Literary & legal',['pastAnterior','futureSubjunctive','futurePerfectSubjunctive']]
];

export function verbGuide(note) {
  const data = verbForms[note.id], extra = guideForms[note.id];
  if (!data) return [];
  const groups = new Map(formGroups(note).map(group => [group.id, group]));
  const lessons = new Map();
  for (const group of groups.values()) {
    const rows = [...group.rows];
    if (rows.length && ['commands','negative'].includes(group.id)) {
      let alternatives = data.subjunctive[3];
      if (group.id === 'negative') alternatives = alternatives.map(form=>'no '+form);
      else if (note.word === 'ir') alternatives = ['vamos', ...alternatives];
      rows.splice(2,0,{sourceLabel:'nosotros / nosotras',alternatives});
    }
    lessons.set(group.id, {rows, title:titles[group.id], notice:group.notice});
  }
  const pp = data.participle;
  const nonfinite = [
    ['Infinitive',[note.word]], ['Gerund',extra.gerund], ['Past participle',pp]
  ];
  if (note.word !== 'soler') nonfinite.push(['Perfect infinitive',pp.map(form=>'haber '+form)],['Perfect gerund',pp.map(form=>'habiendo '+form)]);
  lessons.set('nonfinite', {
    title:'Infinitive, gerund & participle',
    rows:nonfinite.map(([sourceLabel,alternatives])=>({sourceLabel,alternatives}))
  });
  const subjects = groups.get('subjunctive').rows.filter(row => row.slot < 6);
  const compoundSubjects = note.word === 'haber' ? [{slot:2,sourceLabel:'impersonal'}] : subjects;
  for (const [id,title,aux] of compounds) {
    if (note.word === 'soler') continue;
    const auxiliaries = haber[aux] || haberExtra[aux];
    lessons.set(id,{title,
      rows:compoundSubjects.map(({slot,sourceLabel})=>({sourceLabel,alternatives:auxiliaries[slot].flatMap(a=>pp.map(p=>a+' '+p))}))
    });
  }
  for (const [id,title] of [['pastSubjunctive','Imperfect subjunctive'],['futureSubjunctive','Future subjunctive']]) {
    if (id === 'futureSubjunctive' && note.word === 'soler') continue;
    const rows = subjects.map(({slot,sourceLabel})=>({sourceLabel,alternatives:extra[id][slot]}));
    if (note.word === 'haber') rows.push({sourceLabel:'impersonal',alternatives:extra[id][2]});
    lessons.set(id,{title,rows});
  }
  // Retain the card's sense restrictions and provide context for the regional participle.
  const participleLessons = new Set(['nonfinite','perfect', ...compounds.map(([id])=>id)]);
  if (note.word === 'describir') {
    for (const id of participleLessons) lessons.get(id).note = 'Descripto is also used in the Río de la Plata region.';
  }
  return categories.map(([category,ids])=>({category,lessons:ids.filter(id=>lessons.has(id)).map(id=>({id,...lessons.get(id)}))})).filter(group=>group.lessons.length);
}
