// Agreed gameplay roster; a product trial, not a measured accuracy ranking.
export const defaultLanguageIds=Object.freeze('en zh hi es ar fr bn pt ru ur id de ja te tr ta ko fa it th pl uk ro nl hu el sv he fil sw ca cs sr'.split(' '));
export const languagePools={33:defaultLanguageIds};
export function poolForSelection(ids){const chosen=new Set(ids);return Object.entries(languagePools).find(([,pool])=>pool.length===chosen.size&&pool.every(id=>chosen.has(id)))?.[0]||'custom';}
