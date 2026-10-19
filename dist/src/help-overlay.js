const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let nextId=0;
const active=[];
export function helpLink(title,html,label=title){return `<button type="button" class="help-link" data-help data-help-title="${esc(title)}" aria-label="${esc(title)}" aria-haspopup="dialog">${esc(label)}</button><template>${html}</template>`;}
export function openHelp(title,html,anchor){
 const panel=document.createElement('dialog'),id=`help-title-${++nextId}`;
 panel.className=`details-overlay help-overlay ${html.includes('<table')?'help-wide':'help-small'}`;panel.setAttribute('aria-labelledby',id);
 panel.innerHTML=`<header class="details-header"><button type="button" class="plain" data-help-close>← Back</button></header><h2 id="${id}">${esc(title)}</h2><div class="help-body">${html}</div>`;
 const close=()=>{const index=active.indexOf(close);if(index<0)return;active.splice(index,1);panel.close();panel.remove();if(anchor?.isConnected)anchor.focus({preventScroll:true});};
 active.push(close);
 panel.addEventListener('cancel',e=>{e.preventDefault();close();});
 panel.addEventListener('click',e=>{if(e.target.closest('[data-help-close]'))close();else if(e.target===panel){const r=panel.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
 document.body.append(panel);panel.showModal();panel.querySelector('[data-help-close]').focus({preventScroll:true});
}
export function closeHelp(){while(active.length)active.at(-1)();}
export function bindHelp(host){host.addEventListener('click',e=>{const button=e.target.closest('[data-help]');if(button)openHelp(button.dataset.helpTitle,button.nextElementSibling.innerHTML,button);});}
