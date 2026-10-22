// Candidates are documented support, not measured winners. See ../SPEECH-RESEARCH.md.
export const speechLocales={en:'en-GB',zh:'zh-CN',hi:'hi-IN',es:'es-ES',ar:'ar-SA',fr:'fr-FR',bn:'bn-IN',pt:'pt-BR',ru:'ru-RU',ur:'ur-IN',id:'id-ID',de:'de-DE',ja:'ja-JP',mr:'mr-IN',te:'te-IN',tr:'tr-TR',ta:'ta-IN',vi:'vi-VN',ko:'ko-KR',fa:'fa-IR',it:'it-IT',th:'th-TH',gu:'gu-IN',pl:'pl-PL',uk:'uk-UA',ml:'ml-IN',kn:'kn-IN',ro:'ro-RO',nl:'nl-NL',hu:'hu-HU',el:'el-GR',cs:'cs-CZ',sv:'sv-SE',he:'he-IL',fi:'fi-FI',da:'da-DK',no:'nb-NO',sk:'sk-SK',bg:'bg-BG',hr:'hr-HR',sr:'sr-RS',ms:'ms-MY',fil:'fil-PH',sw:'sw-TZ',af:'af-ZA',ca:'ca-ES',et:'et-EE',lv:'lv-LV',lt:'lt-LT',sl:'sl-SI'};
export const googleSpeechLocales={ar:'ar-SA',vi:'vi-VN',ta:'ta-IN',te:'te-IN',ml:'ml-IN',da:'da-DK',bn:'bn-BD',no:'no-NO'};
export const indicLanguages=new Set(['hi','bn','ur','mr','te','ta','gu','ml','kn']);
export const speechModels={elevenlabs:'scribe_v2_realtime',soniox:'stt-rt-v5',azure:'locale-specific short-audio API (unversioned)',sarvam:'saaras:v4',munsit:'munsit (Arabic-only, service-managed)',google:'latest_short'};
export const providerLabels={elevenlabs:'ElevenLabs',soniox:'Soniox',azure:'Azure Speech',sarvam:'Sarvam',munsit:'Munsit',google:'Google Speech'};
export function speechCandidates(language){
 if(!Object.hasOwn(speechLocales,language))throw Error('Unsupported language.');
 return [...(language==='ar'?['munsit']:[]),...(Object.hasOwn(googleSpeechLocales,language)?['google']:[]),...(indicLanguages.has(language)?['sarvam']:[]),'azure','elevenlabs','soniox'];
}
// Server-owned explicit selections only; unavailable selections fail visibly, never silently
// send a player's audio to a different provider. No "best" claim without held-out evidence.
export function speechRoutes(overrides={}){
 if(!overrides||Array.isArray(overrides)||typeof overrides!=='object')throw Error('Invalid speech routing.');
 for(const [id,name] of Object.entries(overrides))if(!speechCandidates(id).includes(name))throw Error('Unsupported speech route.');
 return Object.fromEntries(Object.keys(speechLocales).map(id=>[id,overrides[id]||'elevenlabs']));
}
export function pcmWav(pcm){
 const out=new Uint8Array(44+pcm.byteLength),v=new DataView(out.buffer);
 const str=(offset,s)=>[...s].forEach((c,i)=>v.setUint8(offset+i,c.charCodeAt(0)));
 str(0,'RIFF');v.setUint32(4,36+pcm.byteLength,true);str(8,'WAVE');str(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,16000,true);v.setUint32(28,32000,true);v.setUint16(32,2,true);v.setUint16(34,16,true);str(36,'data');v.setUint32(40,pcm.byteLength,true);out.set(new Uint8Array(pcm),44);return out;
}
