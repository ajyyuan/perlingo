// Stable unit IDs keep content and learner progress independent of display order.
export const units=[
 ['u01','First exchanges','Greetings, names, origins, languages, numbers and clarification.',['Address and subjects','Introducing yourself','Spelling and clarification']],
 ['u02','People and things','Family, everyday objects, descriptions and possession.',['Articles and number','Descriptions','Possession']],
 ['u03','Everyday actions','Work, study, time and routines.',['Present forms','Irregular verbs','Routine and word order']],
 ['u04','Asking and denying','Questions, negatives and frequency.',['Questions','Negation','Frequency']],
 ['u05','Food and purchases','Food, quantities, prices and preferences.',['Quantity','Preferences','Purchases']],
 ['u06','Places and movement','Town, transport, location and directions.',['Location','Prepositions','Movement']],
 ['u07','Plans and requests','Arrangements, dates, abilities and obligations.',['Plans','Modals','Appointments']],
 ['u08','Core integration','Travel, help and everyday exchanges.',['Description contrasts','Reference','Core integration']],
 ['u09','Completed events','Visits, trips and completed actions.',['Past auxiliaries','Participles','Completed events']],
 ['u10','Background and habits','Past habits, circumstances and narratives.',['Past forms','Background','Event contrasts']],
 ['u11','People and objects in context','Messages, gifts and references.',['Direct objects','Indirect objects','Object placement']],
 ['u12','Instructions and problems','Directions, tasks, services and remedies.',['Commands','Requests','Problem solving']],
 ['u13','Comparing and choosing','Clothes, housing, travel options and choices.',['Comparison','Superlatives','Description forms']],
 ['u14','Explaining and connecting','Reasons, sequences and descriptions.',['Coordination','Subordination','Relatives']],
 ['u15','Next steps and conditions','Intentions, predictions and realistic conditions.',['Future','Conditions','Intentions and requests']],
 ['u16','Extension integration','Connected accounts across everyday domains.',['Narrative','Cohesion','Repair and integration']]
].map(([id,title,description,targets],i)=>({id,title,description,order:i+1,prerequisites:i?[`u${String(i).padStart(2,'0')}`]:[],vocabularyTarget:100,exampleTarget:24,objectives:targets.map((title,j)=>({id:`${id}.${j+1}`,title,exampleTarget:8}))}));
export const courseTargets={vocabularyPerLanguage:1600,examplesPerLanguage:384,languages:['es','fr','de']};
export const unitById=id=>units.find(u=>u.id===id);
