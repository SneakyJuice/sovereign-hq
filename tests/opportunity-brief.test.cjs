const {test}=require('node:test');const assert=require('node:assert/strict');
test('brief escapes hostile content and contains brand/contact/print',async()=>{await import('../assets/opportunity-brief.js');const html=globalThis.SovereignBrief.generateHtml({company:'<img src=x onerror=alert(1)>',challenge:'</div><script>alert(1)</script>'});assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;img'));assert.ok(html.includes('<svg'));assert.ok(html.includes('window.print()'));assert.ok(html.includes('Anthony@sovereign-hq.com'));});
test('lead API validates, maps verified fields, and reports delivery only',async()=>{
 const {default:handler}=await import('../api/leads.js');const before={...process.env},originalFetch=global.fetch;
 const call=async(body,method='POST',headers={})=>{let status,payload;await handler({method,headers:{'content-type':'application/json',origin:'https://sovereign-hq.com',...headers},body},{setHeader(){},status(v){status=v;return this;},json(v){payload=v;return this;}});return {status,payload};};
 try{
 delete process.env.HUBSPOT_FORM_ID;delete process.env.HUBSPOT_PORTAL_ID;delete process.env.LEAD_ALLOWED_ORIGINS;delete process.env.HUBSPOT_FORM_PUBLISHED;
 const data={firstname:'Test',email:'test@example.com',consent:true};assert.equal((await call(data)).status,503);
 Object.assign(process.env,{HUBSPOT_PORTAL_ID:'245691341',HUBSPOT_FORM_ID:'1dfe3eea-3cea-455f-8810-19ba36fda6b9',LEAD_ALLOWED_ORIGINS:'https://sovereign-hq.com'});
 assert.equal((await call(null,'GET')).payload.status,'awaiting_form_publication');assert.equal((await call(data)).status,503);process.env.HUBSPOT_FORM_PUBLISHED='true';
 for(const invalid of [{},{...data,consent:false},{...data,firstname:{}},{...data,email:[]},{...data,contact_website:'spam'},{...data,website:'javascript:alert(1)'},{...data,pageUrl:'https://evil.example/path'},{...data,referrer:'file:///etc/passwd'},{...data,extra:'not allowed'}])assert.equal((await call(invalid)).status,400);
 assert.equal((await call(data,'POST',{origin:undefined})).status,403);assert.equal((await call(data,'POST',{'content-length':'20000'})).status,413);assert.equal((await call({...data,message:'x'.repeat(20000)})).status,413);
 global.fetch=async()=>({ok:false});assert.equal((await call(data)).status,502);let submitted;global.fetch=async(url,options)=>{submitted=JSON.parse(options.body);return {ok:true};};
 assert.deepEqual(await call({...data,company:'Example Inc',phone:'8483911819',pageUrl:'https://sovereign-hq.com/?utm_source=promo',utm_source:'promo'}),{status:200,payload:{ok:true}});
 assert.ok(!submitted.fields.some(f=>f.name==='company'));assert.ok(submitted.fields.find(f=>f.name==='message').value.includes('Business: Example Inc'));assert.ok(submitted.fields.find(f=>f.name==='message').value.includes('UTM source: promo'));assert.equal(submitted.legalConsentOptions.consent.consentToProcess,true);assert.equal(submitted.legalConsentOptions.consent.communications,undefined);
 delete process.env.LEAD_ALLOWED_ORIGINS;assert.equal((await call(data)).status,503);
 }finally{global.fetch=originalFetch;for(const key of Object.keys(process.env))if(!(key in before))delete process.env[key];Object.assign(process.env,before);}
});
