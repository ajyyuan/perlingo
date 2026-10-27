import {selectedRegion,selectedVoice} from '../src/pronunciation-control.js';
export const voiceSettingsKey='perlingo-lemma-voice-v1';
export function voiceSettings(raw={}){
 return {pronunciationRegions:{es:selectedRegion(raw||{},'es')},pronunciationVoices:{es:selectedVoice(raw||{},'es')}};
}
export function lemmaPronouncer(recorded,getSettings){
 return {stop:()=>recorded.stop(),speak:(text,_locale,_label,report=()=>{})=>{
  const settings=voiceSettings(getSettings());
  recorded.speak(text,settings.pronunciationRegions.es,'Spanish',report,settings.pronunciationVoices.es);
 }};
}
