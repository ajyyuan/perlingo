import {readFileSync} from 'node:fs';
const exceptions=JSON.parse(readFileSync(new URL('../data/word-bank/audio-exceptions.json',import.meta.url)));
export const audioException=source=>source&&exceptions.find(e=>['pack','language','word','sha256'].every(k=>e[k]===source[k]));
