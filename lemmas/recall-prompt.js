import {contextSpan,answerTokens} from './context-answer.js';
// Cues identify the requested grammatical use without supplying the Spanish answer.
export function recallCue(card,kind){
 if(kind==='context')return card.context.recallCue||'';
 if(kind==='choice')return card.partOfSpeech;
 return card.context.headwordCue||card.partOfSpeech;
}
export function contextFeedbackAnswer(context,response){
 const accepted=context.answers.map(a=>answerTokens(a).join(' '));
 const span=contextSpan(response,context,word=>accepted.includes(word));
 return span?context.answers[accepted.indexOf(span.input[span.targetIndex])]:context.answers[0];
}
