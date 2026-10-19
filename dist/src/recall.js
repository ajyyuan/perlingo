// Preserve spelling and accents; tolerate typography and sentence punctuation.
export function normalizeAnswer(text){
 return text.normalize('NFC').toLocaleLowerCase().replace(/[’‘ʼ]/gu,"'")
  .replace(/[.!?¡¿,;:…“”"]/gu,'').replace(/\s*'\s*/gu,"'").replace(/\s+/gu,' ').trim();
}
export function checkAnswer(input,expected){
 const normalized=normalizeAnswer(input);
 return normalized.length>0&&(Array.isArray(expected)?expected:[expected]).some(answer=>normalized===normalizeAnswer(answer));
}
export const roundPassed=mistakes=>mistakes===0;
