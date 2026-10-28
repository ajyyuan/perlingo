import {singleLetterAudio} from './single-letter-audio.js';
import {audioBaseUrl} from '../src/audio-host.js';
const names={masculine:'manifest.json',feminine:'manifest-feminine.json'},manifests={};let audio;
const stop=()=>{audio?.pause();audio=null;};
try{
 for(const [gender,name] of Object.entries(names)){const response=await fetch('/src/audio/azure/'+name);if(!response.ok)throw Error();manifests[gender]=await response.json();}
 function render(){stop();const text=document.querySelector('#letter').value;document.querySelector('#clips').innerHTML=Object.entries(singleLetterAudio).flatMap(([gender,locales])=>Object.entries(locales).map(([locale,clips])=>`<tr><th scope="row">${manifests[gender].regions[locale]}</th><td><button class="plain" data-audio="${audioBaseUrl+manifests[gender].clips[locale][text]}" aria-label="Original ${text}, ${locale}, ${gender}">▶ Original</button></td><td><button class="plain" data-audio="${clips[text]||audioBaseUrl+manifests[gender].clips[locale][text]}" aria-label="Current ${text}, ${locale}, ${gender}">▶ Current</button></td></tr>`)).join('');}
 document.querySelector('#letter').onchange=render;
 document.querySelector('#clips').onclick=e=>{const button=e.target.closest('[data-audio]');if(!button)return;stop();audio=new Audio(button.dataset.audio);document.querySelector('#status').textContent=button.getAttribute('aria-label');audio.play().catch(()=>{document.querySelector('#status').textContent='Audio unavailable.';});};
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});window.addEventListener('pagehide',stop);render();
}catch{document.querySelector('#status').textContent='Audio manifests unavailable. Reload to try again.';}
