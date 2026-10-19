import {units} from './course/units.js';
// Topics describe exercise targets, not completion of a grammar curriculum.
export const grammarTopics={
 'negation':{label:'Negation',area:'negation'},
 'noun-number':{label:'Plural nouns and articles',area:'articles-gender-number'},
 'possessive-determiners':{label:'Possessive determiners',area:'possession'},
 'question-words':{label:'Question words',area:'questions'},
 'subject-verb-agreement':{label:'Subject–verb agreement',area:'subject-verb-agreement'}
};
for(const unit of units)for(const o of unit.objectives)grammarTopics[`course-${o.id}`]={label:o.title,area:o.id};
export const grammarTopicLabel=item=>item.type==='grammar'?grammarTopics[item.grammarTopic]?.label||'':'';
