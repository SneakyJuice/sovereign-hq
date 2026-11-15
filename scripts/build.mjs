import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {injectAnalytics} from '../src/analytics.js';
import {siteConfigScript} from './seo.mjs';
const root=path.resolve(import.meta.dirname,'..');
await build({entryPoints:[path.join(root,'src/experience.js')],outfile:path.join(root,'assets/experience.js'),bundle:true,minify:true,format:'esm',target:'es2022',legalComments:'eof'});
const out=path.join(root,'dist');fs.mkdirSync(out,{recursive:true});
const files=['index.html','website-design.html','website-design.css','pricing.html','command.css','growth.css','workdesk.css','paperwork-motion.css','paperwork-cinema.css','readiness.css','opportunity-brief.css','conversion.css','ai-guide.css','command.js','mark.svg','robots.txt','sitemap.xml'];
for(const file of files){
  const src=path.join(root,file);
  const dest=path.join(out,file);
  if(file.endsWith('.html'))fs.writeFileSync(dest,injectAnalytics(fs.readFileSync(src,'utf8')));
  else fs.copyFileSync(src,dest);
}
for(const dir of ['fonts','assets'])fs.cpSync(path.join(root,dir),path.join(out,dir),{recursive:true});
await build({entryPoints:[path.join(root,'src/analytics-browser.js')],outfile:path.join(out,'assets/analytics.js'),bundle:true,minify:true,format:'iife',target:'es2022',legalComments:'none'});
fs.writeFileSync(path.join(out,'assets/site-config.js'),siteConfigScript(process.env));
console.log(`Built ${files.length} pages/assets, fonts and bundled GSAP experience.`);
