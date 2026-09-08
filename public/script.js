const menu=document.querySelector('.menu-button');
const nav=document.querySelector('#navigation');
menu?.addEventListener('click',()=>{const next=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(next));nav.classList.toggle('open',next)});
nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu?.setAttribute('aria-expanded','false');nav.classList.remove('open')}));

const tabs=[...document.querySelectorAll('[role="tab"]')];
tabs.forEach(tab=>tab.addEventListener('click',()=>activateTab(tab)));
tabs.forEach((tab,index)=>tab.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();let next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();activateTab(tabs[next])}));
function activateTab(active){tabs.forEach(tab=>{const selected=tab===active;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;document.querySelector('#'+tab.getAttribute('aria-controls')).hidden=!selected})}
document.querySelector('#year').textContent=new Date().getFullYear();


if(tabs.length) activateTab(tabs[0]);
nav?.addEventListener('keydown', event => { if(event.key === 'Escape') { menu?.setAttribute('aria-expanded','false'); nav.classList.remove('open'); menu?.focus(); } });
document.documentElement.classList.add('js');
