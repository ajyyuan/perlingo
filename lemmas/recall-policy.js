import {dayOneRecall} from './recall-policy-data.js';
import {laterRecall} from './later-recall-data.js';
export const recallPolicy=card=>dayOneRecall[card.id]??laterRecall[card.id];
export const typedPrompt=card=>recallPolicy(card)?.prompt??card.meaning;
export const typedAnswers=card=>[card.lemma,...(recallPolicy(card)?.alternatives||[])];
export function typedInstruction(card){
 if(recallPolicy(card)?.cue.includes('___'))return 'One word to fit the blank';
 if(card.partOfSpeech==='verb')return 'One word · infinitive';
 return 'One word · dictionary form unless specified';
}
// Match spelling exactly after the same normalization used by all typed tests.
// No cross-card synonym expansion, fuzzy matching or change to sentence blanks.
export function typedFeedbackAnswer(card,response,normalize){
 return typedAnswers(card).find(a=>normalize(a)===normalize(response))??card.lemma;
}
export function typedAnswerNote(card){
 const policy=recallPolicy(card);
 if(!policy)return '';
 const accepted=policy.alternatives.length?`Accepted here: ${typedAnswers(card).join(' / ')}. `:'';
 return accepted+(policy.note||'');
}
