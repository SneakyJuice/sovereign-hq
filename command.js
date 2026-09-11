document.querySelectorAll('.mobile-nav a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.mobile-nav')?.removeAttribute('open')));
const form=document.getElementById('audit-form');
if(form&&window.SovereignBrief){
 SovereignBrief.attachLeadForm(form);
 document.getElementById('brief-download').addEventListener('click',()=>{SovereignBrief.download(Object.fromEntries(new FormData(form)));document.getElementById('form-status').textContent='Your branded HTML brief is ready. Open it to print or save as PDF. Nothing has been submitted.';});
 document.querySelectorAll('[data-offer-link]').forEach(a=>a.addEventListener('click',()=>{form.elements.workflow.value='$350 website design or redesign';}));
}
