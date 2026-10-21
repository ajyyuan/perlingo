import {nounPacks} from './noun-packs.js';
// Authored starter collection. See ../CONTENT.md for source scope and review limits.
const rows = [
// code, name, locale flag, script, bread, reading, broad IPA, water, reading
['en','English','GB','Latin','bread','bread','brɛd','water','water'],
['zh','Mandarin','CN','Han','面包','miànbāo','mjɛn˥˩ pɑʊ˥','水','shuǐ'],
['hi','Hindi','IN','Devanagari','रोटी','roṭī','ɾoːʈiː','पानी','pānī'],
['es','Spanish','ES','Latin','pan','pan','pan','agua','agua'],
['ar','Arabic','SA','Arabic','خبز','khubz','xubz','ماء','māʾ'],
['fr','French','FR','Latin','pain','pain','pɛ̃','eau','eau'],
['bn','Bengali','BD','Bengali','রুটি','ruṭi','ɾuʈi','পানি','pāni'],
['pt','Portuguese','BR','Latin','pão','pão','pɐ̃w̃','água','água'],
['ru','Russian','RU','Cyrillic','хлеб','khleb','xlʲep','вода','vodá'],
['ur','Urdu','PK','Arabic','روٹی','roṭī','ɾoːʈiː','پانی','pānī'],
['id','Indonesian','ID','Latin','roti','roti','roti','air','air'],
['de','German','DE','Latin','Brot','Brot','bʁoːt','Wasser','Wasser'],
['ja','Japanese','JP','Japanese','パン','pan','paɴ','水','mizu'],
['mr','Marathi','IN','Devanagari','पाव','pāv','paːʋ','पाणी','pāṇī'],
['te','Telugu','IN','Telugu','రొట్టె','roṭṭe','roʈːe','నీరు','nīru'],
['tr','Turkish','TR','Latin','ekmek','ekmek','ecˈmec','su','su'],
['ta','Tamil','IN','Tamil','ரொட்டி','roṭṭi','roʈːi','தண்ணீர்','taṇṇīr'],
['vi','Vietnamese','VN','Latin','bánh mì','bánh mì','ɓaɲ˦˥ mi˨˩','nước','nước'],
['ko','Korean','KR','Hangul','빵','ppang','p͈aŋ','물','mul'],
['fa','Persian','IR','Arabic','نان','nān','nɒːn','آب','āb'],
['it','Italian','IT','Latin','pane','pane','ˈpaːne','acqua','acqua'],
['th','Thai','TH','Thai','ขนมปัง','khanǒm pang','kʰa.nǒm paŋ','น้ำ','náam'],
['gu','Gujarati','IN','Gujarati','રોટલી','roṭlī','ɾoʈli','પાણી','pāṇī'],
['pl','Polish','PL','Latin','chleb','chleb','xlɛp','woda','woda'],
['uk','Ukrainian','UA','Cyrillic','хліб','khlib','xlʲib','вода','vodá'],
['ml','Malayalam','IN','Malayalam','റൊട്ടി','roṭṭi','roʈːi','വെള്ളം','veḷḷam'],
['kn','Kannada','IN','Kannada','ರೊಟ್ಟಿ','roṭṭi','roʈːi','ನೀರು','nīru'],
['ro','Romanian','RO','Latin','pâine','pâine','ˈpɨjne','apă','apă'],
['nl','Dutch','NL','Latin','brood','brood','broːt','water','water'],
['hu','Hungarian','HU','Latin','kenyér','kenyér','ˈkɛɲeːr','víz','víz'],
['el','Greek','GR','Greek','ψωμί','psomí','psoˈmi','νερό','neró'],
['cs','Czech','CZ','Latin','chléb','chléb','xlɛːp','voda','voda'],
['sv','Swedish','SE','Latin','bröd','bröd','brøːd','vatten','vatten'],
['he','Hebrew','IL','Hebrew','לחם','léḥem','ˈleχem','מים','máyim'],
['fi','Finnish','FI','Latin','leipä','leipä','ˈlei̯pæ','vesi','vesi'],
['da','Danish','DK','Latin','brød','brød','bʁœðˀ','vand','vand'],
['no','Norwegian','NO','Latin','brød','brød','brøː','vann','vann'],
['sk','Slovak','SK','Latin','chlieb','chlieb','xlɪ̯ep','voda','voda'],
['bg','Bulgarian','BG','Cyrillic','хляб','hlyab','xlʲap','вода','vodá'],
['hr','Croatian','HR','Latin','kruh','kruh','krux','voda','voda'],
['sr','Serbian','RS','Cyrillic','хлеб','hleb','xleb','вода','voda'],
['ms','Malay','MY','Latin','roti','roti','roti','air','air'],
['fil','Filipino','PH','Latin','tinapay','tinapay','tinaˈpaj','tubig','tubig'],
['sw','Swahili','TZ','Latin','mkate','mkate','m̩ˈkate','maji','maji'],
['af','Afrikaans','ZA','Latin','brood','brood','bruət','water','water'],
['ca','Catalan','ES','Latin','pa','pa','pa','aigua','aigua'],
['et','Estonian','EE','Latin','leib','leib','lei̯p','vesi','vesi'],
['lv','Latvian','LV','Latin','maize','maize','mai̯ze','ūdens','ūdens'],
['lt','Lithuanian','LT','Latin','duona','duona','ˈduɔna','vanduo','vanduo'],
['sl','Slovenian','SI','Latin','kruh','kruh','kɾux','voda','voda'],
];
export const languages=rows.map(([id,name,country,script])=>({id,name,script,flag:String.fromCodePoint(...[...country].map(c=>127397+c.charCodeAt(0)))}));
const alternatives={bread:{zh:['麵包'],cs:['chleba'],sr:['hleb'],hi:['ब्रेड'],bn:['পাউরুটি'],ar:['خُبْز']},water:{zh:['水'],bn:['জল'],sr:['voda'],ar:['ماء','مياه'],no:['vatn']}};
export const packs=[{id:'bread',label:'Bread',emoji:'🍞',sense:'Bread as food; some languages use a local bread term.'},{id:'water',label:'Water',emoji:'💧',sense:'Water, the liquid.'}].map(pack=>({...pack,entries:rows.map(row=>{
 const [id,,,,bread,reading,ipa,water,waterReading]=row;
 return {id,word:pack.id==='bread'?bread:water,reading:pack.id==='bread'?reading:waterReading,ipa:pack.id==='bread'?ipa:null,accepted:[pack.id==='bread'?bread:water,...(alternatives[pack.id][id]||[])],source:`https://en.wiktionary.org/wiki/${encodeURIComponent(pack.id==='bread'?bread:water)}`,status:'draft'};
})}));
packs.push(...nounPacks);
export function getEntry(packId,languageId){return packs.find(p=>p.id===packId)?.entries.find(e=>e.id===languageId);}
