import {ipaFor} from '../src/ipa.js';
import {pronunciationRegions} from '../src/pronunciation-control.js';
const samples={es:['la calle','la playa','yo','cinco','la cerveza','el zapato'],fr:['tu','dire','petit'],de:['ich','die Kirche','zwanzig','das Auto']};
const voice=document.querySelector('#voice'),container=document.querySelector('#comparisons'),status=document.querySelector('#status');
const audio=new Audio();audio.hidden=true;audio.preload='none';document.body.append(audio);let active=null,serial=0,manifests;
function stop(){serial++;audio.pause();audio.removeAttribute('src');audio.load();if(active){active.textContent='▶';active.setAttribute('aria-pressed','false');active=null;}status.textContent='';}
async function play(button,text,locale){
 if(active===button){stop();return;}stop();const token=serial;
 const file=manifests[voice.value].clips[locale]?.[text];if(!file){status.textContent='Recording unavailable.';return;}
 active=button;button.textContent='■';button.setAttribute('aria-pressed','true');audio.src='../src/audio/azure/'+file;
 try{await audio.play();}catch{if(token===serial){stop();status.textContent='Could not play this recording. Try again.';}}
}
audio.onended=stop;audio.onerror=()=>{stop();status.textContent='Could not load this recording. Try again.';};
voice.addEventListener('change',stop);window.addEventListener('pagehide',stop);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
function render(){
 for(const [lang,words] of Object.entries(samples)){
  const {name,regions}=pronunciationRegions[lang],section=document.createElement('section'),heading=document.createElement('h2');heading.textContent=name;section.append(heading);
  const scroll=document.createElement('div');scroll.className='scroll';const table=document.createElement('table');table.setAttribute('aria-label',`${name} accent comparison`);
  const head=table.createTHead().insertRow(),empty=document.createElement('th');empty.scope='col';empty.setAttribute('aria-label','Word');head.append(empty);
  for(const [,country] of regions){const th=document.createElement('th');th.scope='col';th.textContent=country;head.append(th);}
  const body=table.createTBody();for(const text of words){const row=body.insertRow(),label=document.createElement('th');label.scope='row';label.lang=lang;label.textContent=text;const ipa=ipaFor(text,lang);if(ipa){const guide=document.createElement('small');guide.className='comparison-ipa';guide.lang=lang+'-fonipa';guide.textContent='['+ipa+']';guide.title='Approximate baseline IPA; regional audio may differ.';label.append(guide);}row.append(label);
   for(const [locale,country] of regions){const cell=row.insertCell(),button=document.createElement('button');button.type='button';button.textContent='▶';button.setAttribute('aria-label',`Play ${text} — ${country}`);button.setAttribute('aria-pressed','false');button.onclick=()=>play(button,text,locale);cell.append(button);}
  }
  scroll.append(table);section.append(scroll);container.append(section);
 }
 container.setAttribute('aria-busy','false');status.textContent='';
}
try{const files=['manifest.json','manifest-feminine.json'];const results=await Promise.all(files.map(async file=>{const r=await fetch('../src/audio/azure/'+file);if(!r.ok)throw Error('manifest');return r.json();}));manifests={masculine:results[0],feminine:results[1]};render();}catch{container.setAttribute('aria-busy','false');status.textContent='Could not load recordings. Reload to try again.';}
