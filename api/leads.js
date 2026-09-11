const LIMIT=16384;
const bounds={firstname:100,lastname:100,email:254,phone:60,company:200,message:4000,challenge:4000,website:1000,interest:150,workflow:200,contact_website:200,pageUrl:1000,pageUri:1000,referrer:1000,utm_source:150,utm_medium:150,utm_campaign:200,utm_content:200,utm_term:200};
function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)&&!u.username&&!u.password?u:null;}catch{return null;}}
export default async function handler(req,res){
 const send=(status,body)=>{res.setHeader('Cache-Control','no-store');return res.status(status).json(body);};
 const env=process.env,portal=env.HUBSPOT_PORTAL_ID,form=env.HUBSPOT_FORM_ID;
 const allowed=(env.LEAD_ALLOWED_ORIGINS||'').split(',').map(v=>v.trim()).filter(v=>safeUrl(v)?.origin===v);
 const configured=Boolean(portal&&form&&allowed.length),published=env.HUBSPOT_FORM_PUBLISHED==='true';
 if(req.method==='GET')return send(200,{configured,ready:configured&&published,status:!configured?'unconfigured':!published?'awaiting_form_publication':'ready'});
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return send(405,{ok:false,error:'Method not allowed'});}
 if(!configured||!published)return send(503,{ok:false,error:'Enquiries not ready'});
 if(typeof req.headers['content-type']!=='string'||!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type']))return send(415,{ok:false,error:'JSON required'});
 if(typeof req.headers.origin!=='string'||!allowed.includes(req.headers.origin))return send(403,{ok:false,error:'Origin not allowed'});
 const declared=req.headers['content-length'];if(declared&&(!/^\d+$/.test(declared)||Number(declared)>LIMIT))return send(413,{ok:false,error:'Enquiry too large'});
 let data=req.body;try{const raw=typeof data==='string'?data:JSON.stringify(data);if(typeof raw!=='string'||Buffer.byteLength(raw,'utf8')>LIMIT)return send(413,{ok:false,error:'Enquiry too large'});if(typeof data==='string')data=JSON.parse(data);}catch{return send(400,{ok:false,error:'Invalid JSON'});}
 if(!data||typeof data!=='object'||Array.isArray(data))return send(400,{ok:false,error:'Invalid enquiry'});
 for(const [key,value] of Object.entries(data)){if(key==='consent'){if(typeof value!=='boolean')return send(400,{ok:false,error:'Invalid consent'});continue;}if(!Object.hasOwn(bounds,key)||typeof value!=='string'||value.length>bounds[key]||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value))return send(400,{ok:false,error:'Invalid field'});}
 if(data.contact_website?.trim())return send(400,{ok:false,error:'Invalid enquiry'});
 if(!data.firstname?.trim()||!data.email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)||data.consent!==true)return send(400,{ok:false,error:'Name, email and consent required'});
 for(const key of ['website','referrer','pageUrl','pageUri'])if(data[key]?.trim()&&!safeUrl(data[key]))return send(400,{ok:false,error:'Use an http or https website address'});
 const page=safeUrl(data.pageUrl||data.pageUri||req.headers.origin);if(!page||!allowed.includes(page.origin))return send(400,{ok:false,error:'Invalid page context'});
 const fields=['email','firstname','lastname','phone'].filter(k=>data[k]?.trim()).map(name=>({name,value:data[name].trim(),objectTypeId:'0-1'}));
 const labels={company:'Business',interest:'Interest',workflow:'Workflow',website:'Website or inspiration',referrer:'Referrer',utm_source:'UTM source',utm_medium:'UTM medium',utm_campaign:'UTM campaign',utm_content:'UTM content',utm_term:'UTM term'};
 const message=[...Object.entries(labels).filter(([key])=>data[key]?.trim()).map(([key,label])=>`${label}: ${data[key].trim()}`),`Enquiry page: ${page.href}`,data.challenge&&`Opportunity: ${data.challenge}`,data.message&&`Message: ${data.message}`].filter(Boolean).join('\n');fields.push({name:'message',value:message,objectTypeId:'0-1'});
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),10000);
 try{const response=await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${encodeURIComponent(portal)}/${encodeURIComponent(form)}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({fields,context:{pageUri:page.href,pageName:'Sovereign HQ enquiry'},legalConsentOptions:{consent:{consentToProcess:true,text:'I agree that Sovereign HQ may use these details to respond to my enquiry.'}}}),signal:controller.signal});if(!response.ok)return send(502,{ok:false,error:'Enquiry delivery failed'});return send(200,{ok:true});}catch{return send(502,{ok:false,error:'Enquiry delivery failed'});}finally{clearTimeout(timer);}
}
