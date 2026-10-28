import {createPronunciationBoost} from './pronunciation-boost.js';
import {singleLetterAudio} from './single-letter-audio.js';
import {audioBaseUrl} from '../src/audio-host.js';
const names={masculine:'manifest.json',feminine:'manifest-feminine.json'},manifests={};const boost=createPronunciationBoost(window.AudioContext||window.webkitAudioContext);let outputAbort;let audio,releaseOutput=()=>{},generation=0;
const stop=()=>{generation++;outputAbort?.abort();outputAbort=null;audio?.pause();audio=null;releaseOutput();releaseOutput=()=>{};};
try{
 for(const [gender,name] of Object.entries(names)){const response=await fetch('/src/audio/azure/'+name);if(!response.ok)throw Error();manifests[gender]=await response.json();}
 function render(){stop();const text=document.querySelector('#letter').value;document.querySelector('#clips').innerHTML=Object.entries(singleLetterAudio).flatMap(([gender,locales])=>Object.entries(locales).map(([locale,clips])=>`<tr><th scope="row">${manifests[gender].regions[locale]}</th><td><button class="plain" data-audio="${audioBaseUrl+manifests[gender].clips[locale][text]}" aria-label="Original ${text}, ${locale}, ${gender}">▶ Original</button></td><td><button class="plain" data-audio="${clips[text]||audioBaseUrl+manifests[gender].clips[locale][text]}" aria-label="Current ${text}, ${locale}, ${gender}">▶ Current</button></td></tr>`)).join('');}
 document.querySelector('#letter').onchange=render;
 document.querySelector('#clips').onclick=async e=>{const button=e.target.closest('[data-audio]');if(!button)return;stop();const id=generation;try{await boost.unlock();if(id!==generation)return;audio=new Audio();outputAbort=new AbortController();const output=await boost.prepare(audio,button.dataset.audio,{signal:outputAbort.signal});if(id!==generation){output.release();return;}releaseOutput=output.release;audio.src=output.url;audio.onended=()=>{if(id===generation)stop();};document.querySelector('#status').textContent=button.getAttribute('aria-label');await audio.play();}catch{if(id===generation){stop();document.querySelector('#status').textContent='Audio unavailable. Try again.';}}};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);render();
}catch{document.querySelector('#status').textContent='Audio manifests unavailable. Reload to try again.';}
