import {defaultRegions} from './azure-voices.js';
export const pronunciationRegions={
 es:{name:'Spanish',sample:'Estoy aprendiendo español.',regions:[['es-ES','Spain'],['es-MX','Mexico'],['es-AR','Argentina'],['es-CO','Colombia']]},
 fr:{name:'French',sample:'Je suis en train d’apprendre le français.',regions:[['fr-FR','France'],['fr-CA','Canada'],['fr-BE','Belgium']]},
 de:{name:'German',sample:'Ich lerne gerade Deutsch.',regions:[['de-DE','Germany'],['de-AT','Austria'],['de-CH','Switzerland']]},
};
export function selectedRegion(settings,lang){const value=settings.pronunciationRegions?.[lang];return pronunciationRegions[lang]?.regions.some(([locale])=>locale===value)?value:defaultRegions[lang]||null;}
export const selectedVoice=(settings,lang)=>settings.pronunciationVoices?.[lang]==='feminine'?'feminine':'masculine';
const flags={ES:'🇪🇸',MX:'🇲🇽',FR:'🇫🇷',CA:'🇨🇦',DE:'🇩🇪',AT:'🇦🇹',AR:'🇦🇷',CO:'🇨🇴',BE:'🇧🇪',CH:'🇨🇭'};
export function createPronunciationControl({pronouncer,getLanguages,getSettings,onSelect,onVoiceSelect,onOpen}){
 let dialog,anchor;
 function close(){if(!dialog)return;pronouncer.stop();dialog.close();dialog.remove();dialog=null;anchor?.setAttribute('aria-expanded','false');if(anchor?.isConnected)anchor.focus({preventScroll:true});}
 function open(button){
  close();onOpen();anchor=button;anchor.setAttribute('aria-expanded','true');
  dialog=document.createElement('dialog');dialog.className='accent-panel';dialog.setAttribute('aria-label','Pronunciation preferences');
  for(const lang of getLanguages()){
   const config=pronunciationRegions[lang];if(!config)continue;
   const row=document.createElement('div');row.className='accent-row';
   const code=document.createElement('span');code.textContent=lang.toUpperCase();code.setAttribute('aria-hidden','true');
   const select=document.createElement('select');select.dataset.lang=lang;select.setAttribute('aria-label',`${config.name} pronunciation region`);
   for(const [locale,name] of config.regions){const country=locale.split('-')[1],option=document.createElement('option');option.value=locale;option.dataset.region='';option.textContent=`${flags[country]} ${country}`;option.setAttribute('aria-label',name);select.append(option);}
   select.value=selectedRegion(getSettings(),lang)||'';
   const voice=document.createElement('select');voice.dataset.lang=lang;voice.dataset.voice='';voice.setAttribute('aria-label',`${config.name} voice`);
   for(const value of ['masculine','feminine']){const option=document.createElement('option');option.value=value;option.textContent=value[0].toUpperCase()+value.slice(1);voice.append(option);}
   voice.value=selectedVoice(getSettings(),lang);row.append(code,select,voice);dialog.append(row);
  }
  dialog.addEventListener('change',event=>{const select=event.target;if(!select.matches('select[data-lang]'))return;pronouncer.stop();('voice' in select.dataset?onVoiceSelect:onSelect)(select.dataset.lang,select.value);});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
  dialog.addEventListener('cancel',event=>{event.preventDefault();close();});
  document.body.append(dialog);dialog.showModal();dialog.querySelector('select')?.focus();
 }
 return {open,close};
}
