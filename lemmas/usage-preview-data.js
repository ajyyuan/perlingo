// Small content-design trial. Source evidence is recorded in docs/lemma-usage-preview.md.
export const previewWords = [
  {
    word: 'saber', type: 'verb', meaning: 'to know a fact / to know how to', group: 'knowledge',
    uses: [
      ['Use saber que for a fact you know.', 'Sé que viene.', 'I know she’s coming.'],
      ['Use saber + infinitive for knowing how to do something.', 'Sé nadar.', 'I know how to swim.']
    ],
    comparisons: [
      ['conocer', 'For familiarity with a person or place.', 'Conozco a Ana.', 'I know Ana.'],
      ['entender', 'For understanding what something means.', 'Entiendo la explicación.', 'I understand the explanation.']
    ],
    prompt: 'to know how to', cue: 'As in “to know how to swim.”', answers: ['saber']
  },
  {
    word: 'conocer', type: 'verb', meaning: 'to know / to be familiar with / to meet', group: 'knowledge',
    uses: [
      ['For knowing a person or being familiar with a place.', 'Conozco a Ana.', 'I know Ana.'],
      ['Meeting someone for the first time can also use conocer.', 'Conocí a Ana ayer.', 'I met Ana yesterday.']
    ],
    comparisons: [
      ['saber', 'For knowing a fact or knowing how to do something.', 'Sé nadar.', 'I know how to swim.'],
      ['entender', 'For comprehension.', 'Entiendo la explicación.', 'I understand the explanation.']
    ],
    prompt: 'to know someone personally', cue: 'You have met this person and are acquainted with them.', answers: ['conocer']
  },
  {
    word: 'entender', type: 'verb', meaning: 'to understand', group: 'knowledge',
    uses: [
      ['For grasping meaning or an explanation.', 'Entiendo la pregunta.', 'I understand the question.'],
      ['Entender de can express knowledge of a subject.', 'Entiende de música.', 'She knows about music.']
    ],
    comparisons: [
      ['saber', 'Focuses on having knowledge, including knowing how.', 'Sé nadar.', 'I know how to swim.'],
      ['conocer', 'Can express familiarity with a person or place.', 'Conozco Madrid.', 'I know Madrid.'],
      ['comprender', 'Also means understand and fits many of the same explanations and questions.', 'Comprendo la pregunta.', 'I understand the question.']
    ],
    prompt: 'to understand', cue: 'Grasp the meaning of a question.', answers: ['entender', 'comprender']
  },
  {
    word: 'tras', type: 'preposition', meaning: 'after / behind', group: 'sequence',
    uses: [
      ['Place tras directly before an event to mean after.', 'Tras la reunión', 'After the meeting'],
      ['It can also describe a position behind something.', 'Tras la puerta', 'Behind the door']
    ],
    comparisons: [
      ['después', 'Can stand alone. Before an event, use después de.', 'Después de la reunión', 'After the meeting'],
      ['luego', 'Can mean later or afterward. Luego de also introduces an event, with regional variation.', 'Luego de la reunión', 'After the meeting']
    ],
    prompt: 'after', cue: 'Complete with one word', blank: '___ la reunión', answers: ['tras']
  },
  {
    word: 'después', type: 'adverb', meaning: 'afterward / later', group: 'sequence',
    uses: [
      ['Can stand alone when the earlier event is understood.', 'Hablamos después.', 'We’ll talk afterward.'],
      ['Use después de before a noun or an infinitive.', 'Después de comer', 'After eating']
    ],
    comparisons: [
      ['luego', 'Both work for later or afterward here. Their other meanings and constructions differ.', 'Hablamos luego.', 'We’ll talk later.', 'despues-luego'],
      ['tras', 'Takes the event directly.', 'Tras la reunión', 'After the meeting']
    ],
    prompt: 'afterward / later', cue: 'As in “We’ll talk afterward.”', answers: ['después', 'luego']
  },
  {
    word: 'luego', type: 'adverb', meaning: 'later / afterward / then', group: 'sequence',
    uses: [
      ['For something that happens later or next.', 'Hablamos luego.', 'We’ll talk later.'],
      ['Luego de can introduce the earlier event, with regional variation.', 'Luego de la reunión', 'After the meeting']
    ],
    comparisons: [
      ['después', 'Both work for later or afterward here. Their other meanings and constructions differ.', 'Hablamos después.', 'We’ll talk afterward.', 'despues-luego'],
      ['tras', 'Takes the event directly.', 'Tras la reunión', 'After the meeting']
    ],
    prompt: 'later / afterward', cue: 'As in “We’ll talk later.”', answers: ['luego', 'después']
  },
  {
    word: 'empezar', type: 'verb', meaning: 'to begin / to start', group: 'begin',
    uses: [
      ['Use a before an action you begin.', 'Empezó a trabajar.', 'She started working.']
    ],
    comparisons: [
      ['comenzar', 'Shares the meaning begin. Comenzar tends toward formal and written use, while empezar tends toward informal and spoken use. Preferences also vary by region.', 'Comenzó a trabajar.', 'She started working.']
    ],
    prompt: 'to begin / to start', cue: 'As in “to begin working.”', answers: ['empezar', 'comenzar']
  },
  {
    word: 'comenzar', type: 'verb', meaning: 'to begin / to start', group: 'begin',
    uses: [
      ['Use a before an action you begin.', 'Comenzó a trabajar.', 'She started working.']
    ],
    comparisons: [
      ['empezar', 'Shares the meaning begin. Empezar tends toward informal and spoken use, while comenzar tends toward formal and written use. Preferences also vary by region.', 'Empezó a trabajar.', 'She started working.']
    ],
    prompt: 'to begin / to start', cue: 'As in “to start working.”', answers: ['comenzar', 'empezar']
  }
];
