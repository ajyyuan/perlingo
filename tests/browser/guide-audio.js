import {loadAudioManifest} from '/src/audio-manifest.js';
import {createRecordedPronouncer} from '/src/recorded-speech.js';
import {createPronunciationBoost} from '/lemmas/pronunciation-boost.js';
import {createLevelLookup} from '/lemmas/recording-levels.js';
import {guideExample} from '/lemmas/guide-examples.js';
import {verbGuide} from '/lemmas/verb-guide.js';
const button=document.querySelector('#run'),results=document.querySelector('#results'),status=document.querySelector('#status');
const example=(word,tense,row,alternative=0)=>{const note={word,id:'corpes:'+word+':V'};return guideExample(note,verbGuide(note).flatMap(g=>g.lessons).find(l=>l.id===tense),row,alternative).text;};
const samples=[example('tener','pastPerfect',1),example('tener','pluperfectSubjunctive',0,1),example('comer','nonfinite',1)];
button.onclick=async()=>{
 button.disabled=true;results.replaceChildren();let finishCurrent=()=>{},passed=0,failed=0;
 const lookup=createLevelLookup(),boost=createPronunciationBoost(window.AudioContext||window.webkitAudioContext,{getLevel:async url=>{const level=await lookup(url);if(!Number.isFinite(level))throw Error('Missing precomputed volume measurement');return level;}});
 await boost.unlock();
 const load=name=>loadAudioManifest('/src/audio/azure/'+name);
 const voice=createRecordedPronouncer({loadManifest:()=>load('manifest.json'),loadFeminineManifest:()=>load('manifest-feminine.json'),beforeSpeak:()=>boost.unlock(),prepareAudio:(a,url,opts)=>boost.prepare(a,url,opts),makeAudio:()=>{const a=new Audio();a.hidden=true;document.body.append(a);a.addEventListener('ended',()=>finishCurrent(true,'recording completed'),{once:true});a.addEventListener('error',()=>finishCurrent(false,'audio error'),{once:true});return a;},fallback:{stop(){},speak(){finishCurrent(false,'device-voice fallback requested');}}});
 for(const gender of ['masculine','feminine'])for(const locale of ['es-ES','es-MX','es-AR','es-CO'])for(const text of samples){
  status.textContent=`Checking ${locale} ${gender}: ${text}`;
  const result=await new Promise(resolve=>{let done=false;const timer=setTimeout(()=>finishCurrent(false,'playback timeout'),20000);finishCurrent=(ok,detail)=>{if(done)return;done=true;clearTimeout(timer);resolve({ok,detail});};voice.speak(text,locale,'Spanish',()=>{},gender);});
  voice.stop();if(result.ok)passed++;else failed++;
  const item=document.createElement('li');item.className=result.ok?'pass':'fail';item.textContent=`${result.ok?'PASS':'FAIL'} ${locale} ${gender}: ${text} — ${result.detail}`;results.append(item);
 }
 status.textContent=`Complete: ${passed} passed, ${failed} failed`;button.disabled=false;
};
