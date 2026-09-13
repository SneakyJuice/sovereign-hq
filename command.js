document.querySelectorAll('.mobile-nav a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.mobile-nav')?.removeAttribute('open')));
(function applyBookingCtas(){
 const raw=typeof window.__SOVEREIGN_BOOKING_URL__==='string'?window.__SOVEREIGN_BOOKING_URL__.trim():'';
 let ready=false;
 try{ready=Boolean(raw)&&new URL(raw).protocol==='https:';}catch{ready=false;}
 document.querySelectorAll('[data-booking-cta]').forEach(anchor=>{
  if(ready){
   anchor.href=raw;
   anchor.removeAttribute('aria-disabled');
   anchor.removeAttribute('title');
   anchor.target='_blank';
   anchor.rel='noopener noreferrer';
  }else{
   anchor.href='#';
   anchor.setAttribute('aria-disabled','true');
   anchor.title='Booking link pending';
   anchor.addEventListener('click',event=>event.preventDefault());
  }
 });
 document.querySelectorAll('[data-booking-pending-note]').forEach(note=>{note.hidden=ready;});
})();
const form=document.getElementById('audit-form');
if(form&&window.SovereignBrief){
 SovereignBrief.attachLeadForm(form);
 document.getElementById('brief-download').addEventListener('click',()=>{SovereignBrief.download(Object.fromEntries(new FormData(form)));document.getElementById('form-status').textContent='Your branded HTML brief is ready. Open it to print or save as PDF. Nothing has been submitted.';});
 document.querySelectorAll('[data-offer-link]').forEach(a=>a.addEventListener('click',()=>{form.elements.workflow.value='$350 website design or redesign';}));
}
