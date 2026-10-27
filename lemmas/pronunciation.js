import {createPronouncer} from '../src/speech.js';
import {createRecordedPronouncer} from '../src/recorded-speech.js';
import {createPronunciationControl} from '../src/pronunciation-control.js';
import {voiceSettings,voiceSettingsKey,lemmaPronouncer} from './pronunciation-settings.js';
export function createLemmaVoice({onOpen=()=>{}}={}){
 let settings;try{settings=voiceSettings(JSON.parse(localStorage.getItem(voiceSettingsKey)));}catch{settings=voiceSettings();}
 const load=async name=>{const r=await fetch('/src/audio/azure/'+name,{signal:AbortSignal.timeout(5000)});if(!r.ok)throw Error('Audio manifest unavailable');return r.json();};
 const recorded=createRecordedPronouncer({fallback:createPronouncer(window.speechSynthesis,window.SpeechSynthesisUtterance),loadManifest:()=>load('manifest.json'),loadFeminineManifest:()=>load('manifest-feminine.json'),makeAudio:()=>{const a=new Audio();a.hidden=true;a.dataset.pronunciationAudio='';document.body.append(a);return a;}});
 const voice=lemmaPronouncer(recorded,()=>settings);
 const persist=()=>{try{localStorage.setItem(voiceSettingsKey,JSON.stringify(settings));}catch{/* Keep the choice for this page if storage is unavailable. */}};
 const control=createPronunciationControl({pronouncer:voice,getLanguages:()=>['es'],getSettings:()=>settings,onOpen:()=>{voice.stop();onOpen();},onSelect:(_lang,locale)=>{settings=voiceSettings({...settings,pronunciationRegions:{es:locale}});persist();},onVoiceSelect:(_lang,gender)=>{settings=voiceSettings({...settings,pronunciationVoices:{es:gender}});persist();}});
 const button=document.querySelector('[data-lemma-voice]');button?.addEventListener('click',()=>control.open(button));
 window.addEventListener('storage',event=>{if(event.key!==voiceSettingsKey&&event.key!==null)return;voice.stop();control.close();try{settings=voiceSettings(JSON.parse(event.newValue));}catch{settings=voiceSettings();}});
 window.addEventListener('pagehide',()=>{control.close();voice.stop();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)voice.stop();});
 return voice;
}
