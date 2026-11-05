import {mountVerbAccordion} from '/lemmas/verb-accordion.js';
import {loadNotes} from '/lemmas/notes-library.js';
const library=await loadNotes(),host=document.querySelector('#fixture'),results=document.querySelector('#results');
let dispose=()=>{},heard=[],example=null;
// Mirror the app's bubbling pronunciation handler without playing hundreds of sounds.
host.parentElement.addEventListener('click',e=>{const b=e.target.closest('[data-speak]');if(b)heard.push(b.dataset.speak);});
const q=s=>host.querySelector(s),zoom=()=>q('.va-zoom[data-chart]');
const tick=()=>new Promise(r=>setTimeout(r,0));
const key=k=>{(document.activeElement||host).dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));};
const open=id=>q(`.va-grid [data-chart="${id}"] .va-toggle`).click();
function check(name,fn){try{fn();results.insertAdjacentHTML('beforeend',`<li>PASS ${name}</li>`);}catch(e){results.insertAdjacentHTML('beforeend',`<li>FAIL ${name}: ${e.message}</li>`);}}
const equal=(a,b)=>{if(JSON.stringify(a)!==JSON.stringify(b))throw Error(JSON.stringify(a)+' ≠ '+JSON.stringify(b));};
function mount(word='tener'){dispose();host.innerHTML='';heard=[];dispose=mountVerbAccordion(host,library.notes.find(n=>n.word===word&&n.label==='verb'),{voice:{stop(){}},showHeading:true,onExample:e=>{example=e;}});}
document.querySelector('#run').onclick=async()=>{
 results.innerHTML='';mount();await tick();
 check('initial category is indicative; no magnifier',()=>{equal(q('details[open] summary').textContent,'Indicative');equal(!!zoom(),false);});
 q('.va-grid .va-chart').dispatchEvent(new PointerEvent('pointerover',{bubbles:true}));
 check('hover does not expand',()=>equal(!!zoom(),false));
 open('present');
 check('click opens one chart and exposes expanded state',()=>{equal(zoom().dataset.chart,'present');equal(q('.va-grid .va-toggle').getAttribute('aria-expanded'),'true');});
 zoom().querySelector('.va-toggle').click();
 check('reclick closes and restores focus',()=>{equal(!!zoom(),false);equal(document.activeElement,q('.va-grid .va-toggle'));});
 open('present');
 zoom().querySelector('[data-row="1"] .va-zoom-person').click();
 check('cell padding/pronoun dispatches exactly one correct audio',()=>equal(heard,['tienes']));
 check('cell selection updates matching example',()=>equal(example.target,'tienes'));
 const same=zoom();zoom().querySelector('[data-speak="tiene"]').click();
 check('form click retains same overlay node',()=>{equal(zoom()===same,true);equal(heard.at(-1),'tiene');});
 key(' ');check('Space replays current form once',()=>equal(heard.slice(-2),['tiene','tiene']));
 key('=');check('tense jump preserves person and dispatches once',()=>equal(heard.at(-1),'tuvo'));
 check('tense jump updates the sentence',()=>equal(example.target,'tuvo'));
 key('-');check('reverse jump preserves person',()=>equal(heard.at(-1),'tiene'));
 document.querySelector('#outside').click();check('outside click dismisses',()=>equal(!!zoom(),false));
 mount();await tick();q('.va-grid .va-chart').focus();
 const expected=['tienes','tiene','tenemos','tenéis','tienen','tuve','tuviste','tuvo','tuvimos','tuvisteis','tuvieron','tenía'];
 for(const form of expected){key(']');check('rapid next → '+form,()=>{equal(heard.at(-1),form);equal(!!zoom(),true);});}
 check('one audio dispatch per rapid step',()=>equal(heard.length,expected.length));
 key('[');check('reverse across tense boundary',()=>equal(heard.at(-1),'tuvieron'));
 key('Escape');check('Escape dismisses without audio',()=>{equal(!!zoom(),false);equal(heard.length,13);});
 q('details:nth-child(2) summary').click();await new Promise(r=>setTimeout(r,260));
 check('category toggle leaves only one open',()=>equal(host.querySelectorAll('details[open]').length,1));
 const stableHeight=host.getBoundingClientRect().height;
 q('details:nth-child(3) summary').click();await new Promise(r=>setTimeout(r,270));
 check('mood changes preserve panel height',()=>equal(host.getBoundingClientRect().height,stableHeight));
 q('details:nth-child(2) summary').click();await new Promise(r=>setTimeout(r,270));
 open('pastSubjunctive');zoom().querySelector('[data-speak="tuviese"]').click();key(' ');
 check('Space replays explicitly selected -se alternative',()=>equal(heard.slice(-2),['tuviese','tuviese']));
 check('-se sentence and replay retain the selected alternative',()=>{equal(example.target,'tuviese');equal(example.text.includes('tuviese'),true);});
 check('compact hides -se, expanded reveals it',()=>{equal(getComputedStyle(q('.va-grid [data-chart="pastSubjunctive"] .va-expanded-variant')).display,'none');equal(getComputedStyle(zoom().querySelector('.va-expanded-variant')).display!=='none',true);});
 for(let i=0;i<24;i++)key('=');await new Promise(r=>setTimeout(r,270));
 check('rapid category crossings leave one live overlay/category',()=>{equal(host.querySelectorAll('.va-zoom[data-chart]').length,1);equal(host.querySelectorAll('details[open]').length,1);});
 const protectedCount=heard.length;
 const input=document.createElement('input');host.append(input);input.focus();key(']');input.remove();
 q('.va-grid .va-active').focus();document.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:']',ctrlKey:true,bubbles:true,cancelable:true}));
 check('typing and modified shortcuts do not navigate/play',()=>equal(heard.length,protectedCount));
 dispose();const count=heard.length;key(']');check('unmount removes keyboard listeners',()=>equal(heard.length,count));
 for(const word of ['haber','soler','ir']){mount(word);await tick();q('.va-grid .va-chart').focus();for(let i=0;i<30;i++)key(']');check(word+' restricted/irregular traversal dispatches once per step',()=>equal(heard.length,30));}
};
// Real audio smoke check, separate from deterministic dispatch assertions.
const audioButton=document.createElement('button');audioButton.textContent='Check real audio playback';document.querySelector('#run').after(audioButton);
audioButton.onclick=async()=>{
 audioButton.disabled=true;
 const {createLemmaVoice}=await import('/lemmas/pronunciation.js');
 const voice=createLemmaVoice();voice.unlock?.();
 for(const text of ['tengo','tuve','tuviese','hubiese tenido','hubiere tenido']){
  const result=await new Promise(resolve=>{
   let timer,observer,played=false,recording=false;const finish=value=>{clearTimeout(timer);observer.disconnect();resolve(value);};
   observer=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node instanceof HTMLAudioElement){
    recording=true;node.addEventListener('ended',()=>finish('PASS recorded audio ended: '+text),{once:true});
    node.addEventListener('error',()=>finish('FAIL recording error: '+text),{once:true});
   }});
   observer.observe(document.body,{childList:true});timer=setTimeout(()=>finish('UNVERIFIED recording/fallback completion: '+text),12000);
   voice.speak(text,'es-ES','Spanish',({state,message})=>{if(state==='playing')played=true;if(state==='idle'&&played&&!recording)finish('FAIL fallback used instead of recording: '+text);if(state==='error')finish('FAIL playback: '+text+' '+message);});
  });
  results.insertAdjacentHTML('beforeend',`<li>${result}</li>`);
 }
 voice.stop();audioButton.disabled=false;
};
