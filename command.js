document.querySelectorAll('.mobile-nav a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.mobile-nav')?.removeAttribute('open')));
function httpsUrl(value){
 try{const url=new URL(String(value||'').trim());return url.protocol==='https:'?url.href:'';}catch{return '';}
}
function armExternalLink(anchor,href){
 if(!href)return;
 anchor.href=href;
 anchor.target='_blank';
 anchor.rel='noopener noreferrer';
 anchor.removeAttribute('aria-disabled');
 anchor.removeAttribute('title');
 if(anchor.tabIndex<0)anchor.removeAttribute('tabindex');
}
(function applyCheckoutCtas(){
 const configured=httpsUrl(window.__SOVEREIGN_BOOKING_URL__);
 const stripeMap=window.__SOVEREIGN_STRIPE_PAYMENT_URLS__||{};
 document.querySelectorAll('[data-booking-cta]').forEach(anchor=>{
  armExternalLink(anchor,configured||httpsUrl(anchor.getAttribute('href')));
 });
 document.querySelectorAll('[data-stripe-cta]').forEach(anchor=>{
  const tier=anchor.getAttribute('data-tier')||'';
  const stripe=httpsUrl(anchor.getAttribute('data-stripe-payment-url'))||httpsUrl(stripeMap[tier]);
  armExternalLink(anchor,stripe||httpsUrl(anchor.getAttribute('href')));
 });
 document.querySelectorAll('[data-booking-pending-note]').forEach(note=>{note.hidden=true;});
})();
const form=document.getElementById('audit-form');
const tierWorkflow={
 website:'Website — $399 one-time',
 care:'Website + Care — $599 build + $149/mo',
 custom:'Websites, apps, portals, automations — starting at $799 + $149/mo'
};
if(form){
 document.querySelectorAll('[data-offer-link]').forEach(a=>a.addEventListener('click',()=>{
  const label=tierWorkflow[a.getAttribute('data-tier')];
  if(label&&form.elements.workflow)form.elements.workflow.value=label;
 }));
}
if(form&&window.SovereignBrief){
 SovereignBrief.attachLeadForm(form);
 document.getElementById('brief-download').addEventListener('click',()=>{SovereignBrief.download(Object.fromEntries(new FormData(form)));document.getElementById('form-status').textContent='Your branded HTML brief is ready. Open it to print or save as PDF. Nothing has been submitted.';});
}
