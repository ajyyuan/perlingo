import {helpLink} from './help-overlay.js';
import {grammarMarkup} from './grammar-help.js';
// Cross-checked against Goethe-Institut's "Artikel und Pronomen" tables.
export const articleForms={
 definite:[['der','die','das','die'],['den','die','das','die'],['dem','der','dem','den'],['des','der','des','der']],
 indefinite:[['ein','eine','ein','—'],['einen','eine','ein','—'],['einem','einer','einem','—'],['eines','einer','eines','—']],
 negative:[['kein','keine','kein','keine'],['keinen','keine','kein','keine'],['keinem','keiner','keinem','keinen'],['keines','keiner','keines','keiner']]
};
export function articleTable(kind='definite'){
 const rows=articleForms[kind]||articleForms.definite;
 return `<table class="article-table"><thead><tr><th scope="col">Case</th>${['Masculine','Feminine','Neuter','Plural'].map(s=>`<th scope="col">${s}</th>`).join('')}</tr></thead><tbody>${['Nominative','Accusative','Dative','Genitive'].map((s,i)=>`<tr><th scope="row">${grammarMarkup(s)}</th>${rows[i].map(v=>`<td lang="de">${v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
export function germanArticleGuide(){return helpLink('Why der, die, das?',`<p>They all mean <strong>“the.”</strong> The form depends on the noun’s gender, singular/plural, and its role in the sentence (case).</p><p>Learn a noun with its starting article: <span lang="de">der Hund · die Katze · das Buch</span>. These are nominative forms; gender usually stays the same when case changes.</p><label class="article-kind">Article <select data-article-kind><option value="definite">the — der / die / das</option><option value="indefinite">a / an — ein / eine</option><option value="negative">no / not a — kein / keine</option></select></label><div data-article-table>${articleTable()}</div><p class="article-example"><span lang="de"><b>Der Hund</b> schläft.</span> — The dog sleeps.<br><span lang="de">Ich sehe <b>den Hund</b>.</span> — I see the dog.<br><span lang="de">Ich helfe <b>dem Hund</b>.</span> — I help the dog.</p><p class="hint">Same dog, same masculine gender; a different case changes the article. Verbs and prepositions can require a case too.</p>${helpLink('ein, mein, im…',`<p><span lang="de">ein</span> has no plural article. Possessives such as <span lang="de">mein</span> (“my”) take the endings shown for <span lang="de">kein</span>, including plural <span lang="de">meine</span>. Contractions include <span lang="de">im = in dem, am = an dem, zum = zu dem, zur = zu der, ins = in das</span>.</p><p>A form alone does not identify its case: <span lang="de">der</span>, for example, also appears with feminine nouns in dative/genitive. Similar forms can be pronouns; this table covers articles before nouns.</p>`)}`); }

export function bindArticleTables(host){host.addEventListener('change',e=>{if(e.target.matches('[data-article-kind]'))e.target.closest('dialog').querySelector('[data-article-table]').innerHTML=articleTable(e.target.value);});}
