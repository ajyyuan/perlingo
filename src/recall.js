// Preserve spelling and accents; tolerate typography and sentence punctuation.
export function normalizeAnswer(text){
 return text.normalize('NFC').toLocaleLowerCase().replace(/[’‘ʼ]/gu,"'")
  .replace(/[.!?¡¿,;:…“”"]/gu,'').replace(/\s*'\s*/gu,"'").replace(/\s+/gu,' ').trim();
}
export function checkAnswer(input,expected){
 const normalized=normalizeAnswer(input);
 return normalized.length>0&&normalized===normalizeAnswer(expected);
}
export const roundPassed=mistakes=>mistakes===0;
