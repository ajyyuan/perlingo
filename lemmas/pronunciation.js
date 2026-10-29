import {createCardPreloader,cardAudioTexts} from './audio-preload.js';
import {createLevelLookup,playbackUrl} from './recording-levels.js';
import {audioBaseUrl} from '../src/audio-host.js';
import {normalizeAudioText} from '../src/azure-voices.js';
import {createPronunciationBoost} from './pronunciation-boost.js';
import {singleLetterAudio} from './single-letter-audio.js';
import {createPronouncer} from '../src/speech.js';
import {createRecordedPronouncer} from '../src/recorded-speech.js';
import {createPronunciationControl} from '../src/pronunciation-control.js';
import {voiceSettings,voiceSettingsKey,lemmaPronouncer} from './pronunciation-settings.js';
export function createLemmaVoice({onOpen=()=>{}}={}){
 let settings;try{settings=voiceSettings(JSON.parse(localStorage.getItem(voiceSettingsKey)));}catch{settings=voiceSettings();}
 const manifests=new Map();
 const load=name=>{if(!manifests.has(name))manifests.set(name,fetch('/src/audio/azure/'+name,{signal:AbortSignal.timeout(5000)}).then(r=>{if(!r.ok)throw Error('Audio manifest unavailable');return r.json();}).catch(e=>{manifests.delete(name);throw e;}));return manifests.get(name);};
 const getLevel=createLevelLookup();
 const boost=createPronunciationBoost(window.AudioContext||window.webkitAudioContext,{getLevel});
 const preloader=createCardPreloader({
  resolve:async texts=>{const {pronunciationRegions:{es:locale},pronunciationVoices:{es:gender}}=settings;const manifest=await load(gender==='feminine'?'manifest-feminine.json':'manifest.json');return texts.map(text=>{text=normalizeAudioText(text);const path=manifest.clips[locale]?.[text];return singleLetterAudio[gender]?.[locale]?.[text]||(path?audioBaseUrl+path:null);}).filter(Boolean).map(playbackUrl);},
  load:async(url,signal)=>{await Promise.all([getLevel(url),fetch(url,{cache:'force-cache',signal:AbortSignal.any([signal,AbortSignal.timeout(8000)])}).then(async r=>{if(!r.ok)throw Error('Preload unavailable');await r.arrayBuffer();})]);}
 });
 const cards=[];let signature='',scheduled=false;
 function refresh(force=false){const root=cards.filter(c=>c.root.isConnected).at(-1)?.root;const texts=root?cardAudioTexts(root):[];const next=JSON.stringify([settings,texts]);if(!force&&next===signature)return;signature=next;if(document.hidden||!texts.length){preloader.cancel();return;}void preloader.preload(texts);}
 function schedule(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;refresh();});}
 const recorded=createRecordedPronouncer({beforeSpeak:()=>boost.unlock(),prepareAudio:(audio,url,options)=>boost.prepare(audio,url,options),clipOverrides:singleLetterAudio,fallbackText:text=>text==='y'?'i':text,fallback:createPronouncer(window.speechSynthesis,window.SpeechSynthesisUtterance),loadManifest:()=>load('manifest.json'),loadFeminineManifest:()=>load('manifest-feminine.json'),makeAudio:()=>{const a=new Audio();a.hidden=true;a.dataset.pronunciationAudio='';document.body.append(a);return a;}});
 const voice=lemmaPronouncer(recorded,()=>settings);
 const persist=()=>{schedule();try{localStorage.setItem(voiceSettingsKey,JSON.stringify(settings));}catch{/* Keep the choice for this page if storage is unavailable. */}};
 const control=createPronunciationControl({pronouncer:voice,getLanguages:()=>['es'],getSettings:()=>settings,onOpen:()=>{voice.stop();onOpen();},onSelect:(_lang,locale)=>{settings=voiceSettings({...settings,pronunciationRegions:{es:locale}});persist();},onVoiceSelect:(_lang,gender)=>{settings=voiceSettings({...settings,pronunciationVoices:{es:gender}});persist();}});
 const button=document.querySelector('[data-lemma-voice]');button?.addEventListener('click',()=>control.open(button));
 window.addEventListener('storage',event=>{if(event.key!==voiceSettingsKey&&event.key!==null)return;voice.stop();control.close();try{settings=voiceSettings(JSON.parse(event.newValue));}catch{settings=voiceSettings();}});
 window.addEventListener('pagehide',()=>{control.close();voice.stop();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)voice.stop();});
 voice.watchCard=root=>{const observer=new MutationObserver(schedule),entry={root};cards.push(entry);observer.observe(root,{childList:true,subtree:true});schedule();return ()=>{observer.disconnect();cards.splice(cards.indexOf(entry),1);schedule();};};
 window.addEventListener('focus',()=>refresh(true));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)preloader.cancel();else refresh(true);});
 window.addEventListener('pagehide',()=>preloader.cancel());
 window.addEventListener('storage',event=>{if(event.key===voiceSettingsKey||event.key===null)schedule();});
 voice.unlock=()=>boost.unlock();
 return voice;
}
