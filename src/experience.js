import {practiceWorkflows} from './practice-workflows.js';
import './readiness.js';
import {businessWorkflows} from './business-workflows.js';
import {gsap} from 'gsap';
import {createDeskMotion} from './desk-motion.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches,heroVisible=true,flowVisible=false;
const hero=$('#growth-visual'),host=$('#business-desk'),toggle=$('#motion-toggle');
const deskMotion=createDeskMotion(host);
toggle.hidden=false;
function syncMotion(){toggle.textContent=paused?'Resume motion':'Pause motion';toggle.setAttribute('aria-pressed',String(paused));if(paused){gsap.globalTimeline.pause();deskMotion.pause();stopFlow();}else{gsap.globalTimeline.resume();if(heroVisible&&!document.hidden)deskMotion.resume();}document.documentElement.dataset.motion=paused?'paused':'running';}
toggle.addEventListener('click',()=>{paused=!paused;syncMotion();});
reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion();if(!paused)startFlow();});
new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;if(heroVisible&&!paused&&!document.hidden)deskMotion.resume();else deskMotion.pause();},{threshold:.05}).observe(hero);
document.addEventListener('visibilitychange',()=>{if(document.hidden){deskMotion.pause();stopFlow();}else if(!paused&&heroVisible)deskMotion.resume();});
const stories={
 leads:{title:'A new enquiry.\nA clear next step.',description:'A potential customer gets in touch while your team is busy. Capture the details, prepare a helpful reply and put the follow-up on the right person’s list.',before:'An inbox to check. Details to copy. Another reminder to remember.',after:'An organized enquiry and a response ready to review.',app:'YOUR ENQUIRY DESK',steps:[
 ['Enquiry received','Keep the important details','Keep the customer’s name, request and contact details together so your team starts with the full picture.','NEW CUSTOMER ENQUIRY','A quote request,\nwithout the scramble.','“We’re looking for help with our next project. What happens next?”','Details captured'],
 ['Reply prepared','Make the next step clear','Prepare a reply using your services and usual next steps. Your team can check it before it goes out.','DRAFT REPLY','A helpful response.\nAlready started.','Thanks for getting in touch. We can help you explore the right option. Could you share a little more about your project?','Reply ready to review'],
 ['Follow-up assigned','Give someone ownership','Create a follow-up task for the right team member, with the enquiry attached. No separate reminder to remember.','TEAM FOLLOW-UP','The next step\nhas an owner.','Contact the customer about their project. Their original request and draft reply are included.','Follow-up task prepared'],
 ['Ready for review','Your team stays in charge','Review the reply and the next action in one place. Approve or adjust before anything is sent.','READY FOR YOUR TEAM','Less chasing.\nMore conversations.','Customer details organized. Reply drafted. Follow-up prepared. Your team chooses what happens next.','Ready for your review']
 ]},
 onboarding:{title:'A new customer.\nA better first impression.',description:'The deal is agreed. Make the welcome feel organized: prepare the next steps, gather the right details and give your team a clear starting point.',before:'Welcome emails written from scratch. Documents scattered. Details requested twice.',after:'One consistent welcome and a shared checklist for your team.',app:'YOUR CUSTOMER WELCOME',steps:[
 ['Customer confirmed','Start with the agreed details','Bring the customer’s contact details and agreed service into one onboarding record.','NEW CUSTOMER','A great start\nbegins here.','Service agreed. Main contact captured. Your team has the essentials for the next step.','Customer record prepared'],
 ['Welcome prepared','Explain what happens next','Draft a welcome message with the information the customer needs and the details your team still needs to collect.','WELCOME DRAFT','Make the next step\nfeel easy.','Welcome aboard. Here is what to expect, who will help you, and the information we need to get started.','Welcome ready to review'],
 ['Checklist created','Give the team a clear plan','Prepare tasks for setup, missing documents and the kickoff. Assign ownership so the handoff does not get lost.','ONBOARDING CHECKLIST','Everyone knows\nwhat comes next.','Confirm details → collect documents → arrange kickoff → check the customer has what they need.','Team checklist prepared'],
 ['Ready to begin','Check before you launch','Review the welcome and checklist together. Flag missing details before your team starts delivery.','READY FOR REVIEW','A smoother welcome.\nLess back-and-forth.','One customer record. A consistent welcome. A clear team checklist. Review and launch when you are ready.','Ready for your review']
 ]},
 reporting:{title:'The week’s work.\nA clearer picture.',description:'Stop spending Friday piecing together updates. Gather the numbers and open tasks, prepare a readable summary and see what needs your attention.',before:'Multiple tabs. Copy-and-paste totals. A report that eats into the afternoon.',after:'A draft weekly update with source links and open questions.',app:'YOUR WEEKLY BUSINESS UPDATE',steps:[
 ['Updates gathered','Bring the week together','Gather updates from the tools you agree to connect, with links back to the original records.','WEEKLY INPUTS','Less tab-hopping.\nMore visibility.','Sales updates, open work and customer follow-ups brought together for this week’s review.','Source updates gathered'],
 ['Summary drafted','Get to the useful part','Prepare a short summary of what moved forward, what is still open and what changed.','DRAFT WEEKLY SUMMARY','The week,\nwithout the digging.','New enquiries need follow-up. Two project updates need review. The team’s open tasks are linked below.','Summary prepared'],
 ['Questions flagged','Spot what needs a check','Highlight missing information and items needing a person’s decision instead of filling the gaps with guesses.','NEEDS ATTENTION','See the gaps\nbefore the meeting.','Confirm the latest project status and check any missing figures against the source records.','Review questions flagged'],
 ['Ready to review','Lead with a clearer view','Check the source links and approve the summary before sharing it with your team.','READY FOR YOUR MEETING','Less report-building.\nMore decision-making.','A readable summary, linked source records and clear questions. Your weekly review starts with the work already organized.','Ready for your review']
 ]}
};
Object.assign(stories,{
  "invoices": {
    "title": "The job is done.\nSkip the paperwork.",
    "description": "Turn completed work into an invoice draft using the customer details and agreed price already in your systems.",
    "before": "Job notes in one app. Customer details in another. An invoice to type from scratch.",
    "after": "An invoice draft with the supporting job details attached.",
    "app": "YOUR INVOICE DESK",
    "steps": [
      [
        "Job completed",
        "Bring the details together",
        "Collect the completed job, customer record and agreed price from your connected tools.",
        "JOB DETAILS",
        "From finished work\nto the next step.",
        "Example: a completed service visit is ready for billing.",
        "Job details gathered"
      ],
      [
        "Invoice drafted",
        "Cut the retyping",
        "Prepare the invoice in your billing workflow using the agreed details. Flag anything missing.",
        "INVOICE DRAFT",
        "The paperwork,\nalready started.",
        "Customer details, service description and agreed amount brought into one draft.",
        "Draft prepared"
      ],
      [
        "Details checked",
        "Catch missing information",
        "Flag missing billing details or differences from the agreed price for a person to check.",
        "NEEDS A CHECK",
        "Fewer loose ends\nbefore billing.",
        "Confirm the billing contact and payment terms before sending.",
        "Questions flagged"
      ],
      [
        "Ready to send",
        "You approve the invoice",
        "Review the draft and supporting details before it goes to the customer.",
        "READY FOR BILLING",
        "Less invoice admin.\nMore time for customers.",
        "A prepared invoice and a clear list of anything needing your attention.",
        "Ready for your review"
      ]
    ]
  },
  "scheduling": {
    "title": "Less calendar tennis.\nMore confirmed plans.",
    "description": "Help customers find a suitable appointment, gather what your team needs and prepare reminders in the same workflow.",
    "before": "Messages back and forth. Calendars to check. Appointment details to copy.",
    "after": "Suitable times and a booking handoff with the details already gathered.",
    "app": "YOUR APPOINTMENT DESK",
    "steps": [
      [
        "Request received",
        "Understand the appointment",
        "Capture the service, preferred times and contact details from the customer’s request.",
        "BOOKING REQUEST",
        "“When can\nyou fit me in?”",
        "Example: a customer needs a service appointment next week.",
        "Request captured"
      ],
      [
        "Times checked",
        "Use the connected calendar",
        "Check availability against your booking rules and prepare suitable options.",
        "AVAILABLE OPTIONS",
        "Make finding\na time easier.",
        "Suitable appointment options prepared from the connected calendar.",
        "Options prepared"
      ],
      [
        "Booking prepared",
        "Keep the details together",
        "Carry the chosen time and customer details into the booking handoff.",
        "BOOKING DETAILS",
        "One clear\nappointment record.",
        "Service, location, contact details and selected time collected together.",
        "Booking prepared"
      ],
      [
        "Reminder prepared",
        "Reduce last-minute chasing",
        "Prepare the confirmation and reminders using your agreed booking process.",
        "CONFIRMATION DRAFT",
        "An easier booking.\nA better first impression.",
        "Appointment details and reminder messages ready to check before confirmation.",
        "Ready for your review"
      ]
    ]
  },
  "payments": {
    "title": "Less awkward chasing.\nA clearer payment picture.",
    "description": "Track open invoices and prepare polite follow-ups, so your team can spend less time checking balances and writing reminders.",
    "before": "Open the billing app. Check the bank update. Find the email. Write another reminder.",
    "after": "Open invoices and suggested follow-ups brought together.",
    "app": "YOUR PAYMENT FOLLOW-UP",
    "steps": [
      [
        "Invoices checked",
        "Start with the current record",
        "Read open invoices and payment status from the agreed billing source.",
        "OPEN INVOICES",
        "Know what\nstill needs attention.",
        "Example: an invoice is past its due date in the connected billing tool.",
        "Status gathered"
      ],
      [
        "Exceptions flagged",
        "Avoid unnecessary chasing",
        "Flag disputed invoices, recent payments or missing status updates before preparing a follow-up.",
        "STATUS CHECK",
        "Check first.\nFollow up thoughtfully.",
        "A payment may be pending or an invoice may need a correction.",
        "Exceptions flagged"
      ],
      [
        "Reminder drafted",
        "Use a helpful tone",
        "Draft a reminder with the invoice reference and existing payment link where available.",
        "REMINDER DRAFT",
        "“A quick check-in\non your invoice.”",
        "Please let us know if you need another copy or have a question about the invoice.",
        "Reminder prepared"
      ],
      [
        "Ready to follow up",
        "Keep the customer context",
        "Review the latest payment status and reminder before sending.",
        "READY FOR FOLLOW-UP",
        "Less chasing.\nMore clarity.",
        "The invoice, status and proposed reminder in one place for your team.",
        "Ready for your review"
      ]
    ]
  },
  "reimbursements": {
    "title": "Less receipt hunting.\nFewer forgotten claims.",
    "description": "Organize receipts, check for missing information and prepare reimbursement follow-ups so requests do not disappear between inboxes.",
    "before": "Receipts in messages. Forms half finished. No clear view of what is still outstanding.",
    "after": "An organized request, missing-item checklist and follow-up draft.",
    "app": "YOUR REIMBURSEMENT TRACKER",
    "steps": [
      [
        "Receipts gathered",
        "Bring the paperwork together",
        "Collect submitted receipts and request details in the agreed reimbursement workflow.",
        "EXPENSE REQUEST",
        "The receipt\nhas a place to go.",
        "Example: a team member submits a receipt for a work expense.",
        "Documents gathered"
      ],
      [
        "Details checked",
        "Find what is missing",
        "Compare the request with your required fields and flag missing information.",
        "REQUEST CHECKLIST",
        "Spot the gaps\nbefore the handoff.",
        "Date, amount, purpose and supporting receipt are checked for completeness.",
        "Missing items flagged"
      ],
      [
        "Status organized",
        "See who needs to act",
        "Track the recorded status and owner without deciding eligibility or approving the expense.",
        "OUTSTANDING REQUEST",
        "No more guessing\nwho has it.",
        "Request pending review. Assigned owner and last update shown together.",
        "Status prepared"
      ],
      [
        "Follow-up drafted",
        "Keep the request moving",
        "Prepare a message asking for missing details or a status update. Your team approves the next step.",
        "FOLLOW-UP DRAFT",
        "Less paperwork chasing.\nA clearer next step.",
        "Request details, missing items and a follow-up draft ready for the responsible person.",
        "Ready for your review"
      ]
    ]
  },
  "chatbots": {
    "title": "An extra pair of hands.\nFor everyday questions.",
    "description": "Build a chatbot or virtual agent around your business: answer common questions, collect requests and hand the tricky conversations to your team.",
    "before": "The same questions interrupt the day. Customers wait while someone finds the answer.",
    "after": "Useful answers from your approved information, with a clear route to a person.",
    "app": "YOUR VIRTUAL ASSISTANT",
    "steps": [
      [
        "Question received",
        "Meet the customer where they are",
        "Capture a question from your website chat and keep the conversation together.",
        "CUSTOMER CHAT",
        "“What do I need\nbefore my appointment?”",
        "Example: a customer asks how to prepare for their first visit.",
        "Question captured"
      ],
      [
        "Information found",
        "Use your approved answers",
        "Look up the relevant answer in the business information you have approved.",
        "BUSINESS KNOWLEDGE",
        "A useful answer.\nIn your own voice.",
        "Find the preparation checklist and appointment guidance your team maintains.",
        "Source found"
      ],
      [
        "Next step prepared",
        "Help beyond the answer",
        "Prepare a helpful response and a booking link or follow-up task when appropriate.",
        "ASSISTANT RESPONSE",
        "Help them take\nthe next step.",
        "Here is the preparation checklist. Would you like the team to help with anything else?",
        "Response prepared"
      ],
      [
        "Handoff made clear",
        "A person when it matters",
        "Routine answers can follow your agreed rules. Unclear or sensitive requests go to a person with the conversation attached.",
        "TEAM HANDOFF",
        "Fewer interruptions.\nCustomers still feel heard.",
        "A question outside the approved guidance is routed to your team with its context.",
        "Handoff ready for review"
      ]
    ]
  },
  "promotions": {
    "title": "Stay visible.\nWithout starting from scratch.",
    "description": "Turn your offers, business updates and useful advice into social posts and promotional drafts your team can review together.",
    "before": "A blank caption box. An offer to explain. Another week without posting.",
    "after": "A small content plan with draft posts and a clear approval step.",
    "app": "YOUR PROMOTION PLANNER",
    "steps": [
      [
        "Update captured",
        "Start with real business news",
        "Gather the offer or update, intended audience and the details customers need.",
        "BUSINESS UPDATE",
        "Something worth\nsharing this week.",
        "Example: appointment availability or a new service you want customers to know about.",
        "Brief gathered"
      ],
      [
        "Posts drafted",
        "Adapt the message",
        "Prepare channel-specific captions using your business voice and approved offer details.",
        "SOCIAL DRAFT",
        "A first draft.\nOff your to-do list.",
        "A helpful post explaining the service, who it is for and how to enquire.",
        "Copy prepared"
      ],
      [
        "Plan assembled",
        "See the week together",
        "Arrange the drafts into a proposed schedule and flag missing images or links.",
        "CONTENT PLAN",
        "A little consistency\ngoes a long way.",
        "Draft posts, suggested dates and required assets collected in one review queue.",
        "Schedule proposed"
      ],
      [
        "Ready to approve",
        "Check before publishing",
        "Review the wording, images, offer details and timing before anything is scheduled or published.",
        "APPROVAL QUEUE",
        "Less blank-page time.\nMore consistent promotion.",
        "A practical content plan your team can approve, edit and schedule through connected tools.",
        "Ready for your review"
      ]
    ]
  }
});
Object.assign(stories,businessWorkflows,practiceWorkflows);
let active='leads',step=0,flowTimer=null,flowRunning=false,hasStarted=false;const play=$('#workflow-play');play.hidden=false;
function text(el,value){$(el).textContent=value;}
function renderStep(index,animate=true){step=index;const s=stories[active].steps[index];$$('[data-stage]').forEach((b,i)=>{b.setAttribute('aria-pressed',String(i===index));b.classList.toggle('is-done',i<index);});text('#step-count',`0${index+1} / 04`);text('#trace-code',s[0].toUpperCase());text('#trace-text',s[2]);text('#result-kicker',s[3]);text('#result-title',s[4]);text('#result-body',s[5]);$('#result-status').lastChild.textContent=' '+s[6];
 gsap.set('#process-progress',{scaleY:index/3});
 if(animate&&!paused&&!reduced.matches){gsap.killTweensOf('#result-content');gsap.fromTo('#result-content',{opacity:.45,y:9},{opacity:1,y:0,duration:.5,ease:'power2.out'});}else gsap.set('#result-content',{opacity:1,y:0});
 $('#workflow-stage').dataset.step=String(index);$('#workflow-stage').dataset.workflow=active;
}
function stopFlow(){clearTimeout(flowTimer);flowTimer=null;flowRunning=false;play.textContent=step===3?'Replay example ↻':'Play example ▷';play.setAttribute('aria-pressed','false');$('.workflow-caption').setAttribute('aria-live','polite');}
function schedule(){flowTimer=setTimeout(()=>{if(paused||!flowVisible||document.hidden){stopFlow();return;}if(step<3){renderStep(step+1);schedule();}else stopFlow();},3600);}
function startFlow(){if(paused||reduced.matches||!flowVisible)return;stopFlow();flowRunning=true;play.textContent='Pause example Ⅱ';play.setAttribute('aria-pressed','true');$('.workflow-caption').setAttribute('aria-live','off');schedule();}
function selectStory(key){stopFlow();active=key;const s=stories[key];$$('button[data-workflow]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.workflow===key)));text('#workflow-title',s.title);text('#workflow-description',s.description);text('#workflow-before',s.before);text('#workflow-after',s.after);text('#result-app',s.app);$$('[data-stage]').forEach((b,i)=>{b.querySelector('strong').textContent=s.steps[i][0];b.querySelector('small').textContent=s.steps[i][1];});renderStep(0);startFlow();}
$$('button[data-workflow]').forEach(b=>b.addEventListener('click',()=>selectStory(b.dataset.workflow)));
$$('[data-stage]').forEach(b=>b.addEventListener('click',()=>{stopFlow();renderStep(Number(b.dataset.stage));play.textContent=step===3?'Replay example ↻':'Play example ▷';}));
play.addEventListener('click',()=>{if(flowRunning){stopFlow();return;}if(paused||reduced.matches){renderStep((step+1)%4,false);play.textContent='Next step →';return;}if(step===3)renderStep(0);startFlow();});
new IntersectionObserver(([entry])=>{flowVisible=entry.isIntersecting;if(flowVisible&&!hasStarted){hasStarted=true;startFlow();}else if(!flowVisible)stopFlow();},{threshold:.12}).observe($('#workflow-stage'));
renderStep(0,false);syncMotion();
