document.querySelectorAll('.mobile-nav a').forEach(link=>link.addEventListener('click',()=>document.querySelector('.mobile-nav').removeAttribute('open')));
document.getElementById('audit-form').addEventListener('submit',event=>{
  event.preventDefault();
  const challenge=document.getElementById('challenge');
  if(!challenge.value.trim()){challenge.setCustomValidity('Describe the workflow you want to improve.');challenge.reportValidity();return;}
  const text=`SOVEREIGN HQ — OPPORTUNITY BRIEF\n\nWorkflow: ${document.getElementById('workflow').value}\n\nWhere the work gets stuck:\n${challenge.value.trim()}\n\nQuestions to explore:\n- Which tools and people are involved?\n- What context must carry forward?\n- Which actions need your team to approve them?\n- What measurable outcome would make this useful?\n\nPrepared locally. This brief has not been submitted and no meeting has been booked.\n`;
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download='sovereign-audit-brief.txt';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  document.getElementById('form-status').textContent='Your brief is ready. Keep it for your next conversation.';
});
document.getElementById('challenge').addEventListener('input',event=>event.target.setCustomValidity(''));
