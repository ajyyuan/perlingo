// Stable recorded voice choices; no credentials or live provider calls in the app.
export const azureVoices={
 'es-ES':'es-ES-AlvaroNeural','es-MX':'es-MX-JorgeNeural',
 'fr-FR':'fr-FR-HenriNeural','fr-CA':'fr-CA-JeanNeural',
 'de-DE':'de-DE-ConradNeural','de-AT':'de-AT-JonasNeural',
};
export const defaultRegions={es:'es-ES',fr:'fr-FR',de:'de-DE'};
export const normalizeAudioText=text=>text.normalize('NFC').replace(/[’‘]/g,"'");

export const feminineVoices={'es-ES':'es-ES-ElviraNeural','es-MX':'es-MX-DaliaNeural','fr-FR':'fr-FR-DeniseNeural','fr-CA':'fr-CA-SylvieNeural','de-DE':'de-DE-KatjaNeural','de-AT':'de-AT-IngridNeural'};

export const expansionVoices={masculine:{'es-AR':'es-AR-TomasNeural','es-CO':'es-CO-GonzaloNeural','fr-BE':'fr-BE-GerardNeural','de-CH':'de-CH-JanNeural'},feminine:{'es-AR':'es-AR-ElenaNeural','es-CO':'es-CO-SalomeNeural','fr-BE':'fr-BE-CharlineNeural','de-CH':'de-CH-LeniNeural'}};
Object.assign(azureVoices,expansionVoices.masculine);
Object.assign(feminineVoices,expansionVoices.feminine);
