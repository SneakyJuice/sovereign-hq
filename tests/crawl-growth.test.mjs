import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

test('resolveBookingUrl prefers SOVEREIGN_BOOKING_URL and accepts https only', async () => {
  const {resolveBookingUrl} = await import('../scripts/seo.mjs');
  assert.equal(resolveBookingUrl({}), '');
  assert.equal(resolveBookingUrl({BOOKING_URL: '  https://cal.example.com/sovereign  '}), 'https://cal.example.com/sovereign');
  assert.equal(resolveBookingUrl({
    SOVEREIGN_BOOKING_URL: 'https://cal.example.com/a',
    BOOKING_URL: 'https://cal.example.com/b',
  }), 'https://cal.example.com/a');
  assert.equal(resolveBookingUrl({BOOKING_URL: 'http://insecure.example/book'}), '');
  assert.equal(resolveBookingUrl({BOOKING_URL: 'not-a-url'}), '');
  assert.equal(resolveBookingUrl({BOOKING_URL: 'javascript:alert(1)'}), '');
});

test('robots.txt allows crawlers and points at the apex sitemap', () => {
  const robots = read('robots.txt');
  assert.equal(robots, 'User-agent: *\nAllow: /\n\nSitemap: https://sovereign-hq.com/sitemap.xml\n');
});

test('sitemap.xml lists only indexable apex URLs', () => {
  const xml = read('sitemap.xml');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  assert.deepEqual(locs, ['https://sovereign-hq.com/', 'https://sovereign-hq.com/website-design']);
  assert.doesNotMatch(xml, /pricing|privacy|terms/i);
});

test('vercel.json permanently redirects www host to apex for all paths including root', () => {
  const config = JSON.parse(read('vercel.json'));
  const wwwHost = (rule) =>
    rule.has?.some((condition) => condition.type === 'host' && condition.value === 'www.sovereign-hq.com');
  const permanent = (rule) => rule.statusCode === 301 || rule.permanent === true;
  const root = (config.redirects || []).find((rule) =>
    wwwHost(rule) && permanent(rule) && rule.source === '/' && rule.destination === 'https://sovereign-hq.com/',
  );
  const rest = (config.redirects || []).find((rule) =>
    wwwHost(rule) && permanent(rule) && rule.source === '/:path*' && rule.destination === 'https://sovereign-hq.com/:path*',
  );
  assert.ok(root, 'missing www.sovereign-hq.com / → https://sovereign-hq.com/ 301');
  assert.ok(rest, 'missing www.sovereign-hq.com /:path* → https://sovereign-hq.com/:path* 301');
});

test('index and website-design carry apex self-canonicals', () => {
  assert.match(read('index.html'), /<link rel="canonical" href="https:\/\/sovereign-hq\.com\/">/);
  assert.match(read('website-design.html'), /<link rel="canonical" href="https:\/\/sovereign-hq\.com\/website-design">/);
});

test('pricing is noindex,follow and remains linked from the homepage', () => {
  assert.match(read('pricing.html'), /<meta name="robots" content="noindex,\s*follow">/);
  assert.match(read('index.html'), /href="\/pricing"/);
  assert.doesNotMatch(read('pricing.html'), /BASE_PRICES|plan-card|billing-toggle|\$79(?!\d)|\$249(?!\d)|\$499(?!\d)/);
});

test('home JSON-LD hooks use only safe known fields', () => {
  const html = read('index.html');
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"LocalBusiness"/);
  assert.doesNotMatch(html, /TODO: FAQPage|Anthony\/Virgil approve/);
  assert.doesNotMatch(html, /"@type":\s*"FAQPage"/);
  assert.doesNotMatch(html, /"mainEntity"\s*:\s*\[\]/);
  assert.match(html, /"name":\s*"Sovereign HQ"/);
  assert.match(html, /"url":\s*"https:\/\/sovereign-hq\.com"/);
  assert.doesNotMatch(html, /aggregateRating|reviewRating|"ratingValue"/i);
  assert.doesNotMatch(html, /"streetAddress"|"addressLocality"|"postalCode"/);
  assert.doesNotMatch(html, /"telephone"/);
});

test('website-design includes a safe Organization JSON-LD hook', () => {
  const html = read('website-design.html');
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"name":\s*"Sovereign HQ"/);
  assert.doesNotMatch(html, /aggregateRating|"ratingValue"|"telephone"/i);
});

test('locked service tiers replace the old website offer and SaaS grid', () => {
  const booking = 'https://cal.com/zion-sealey-hjalio/discovery';
  const partial = read('partials/service-tiers.html').trim();
  const pages = ['index.html', 'website-design.html', 'pricing.html'].map(read);
  for (const html of pages) {
    assert.ok(html.includes(partial));
    assert.match(html, /\$399/);
    assert.match(html, /\$599/);
    assert.match(html, /\$149\/mo/);
    assert.match(html, /\$799/);
    assert.match(html, /\$150\/hr/);
    assert.match(html, /2-hour monthly cap/);
    assert.match(html, /No rollover/);
    assert.match(html, /3-month minimum/);
    assert.match(html, /30 days/);
    assert.match(html, /Tier 3 is a starting price/);
    assert.match(html, /data-stripe-payment-url="https:\/\/buy\.stripe\.com\/cNi8wQ74LcEPe2Ye813oA00"/);
    assert.match(html, /data-stripe-payment-url="https:\/\/buy\.stripe\.com\/28E3cwcp57kvbUQaVP3oA01"/);
    assert.match(html, /data-stripe-payment-url="https:\/\/buy\.stripe\.com\/4gMaEY88PcEP2kg8NH3oA02"/);
    assert.match(html, /data-tier="custom"[^>]*>Buy now/);
    assert.match(html, /Book a discovery call/);
    assert.equal(html.split('data-booking-cta').length - 1 >= 3, true);
    assert.equal(html.split('data-stripe-cta').length - 1 >= 3, true);
  }
  const joined = pages.join('\n');
  assert.doesNotMatch(joined, /\$350|\$99\/mo|fiverr|href="#"/i);
  assert.match(joined, new RegExp(booking.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(read('index.html'), /id="audit"/);
  assert.match(read('index.html'), /id="enquire"/);
  assert.match(read('website-design.html'), /id="get-started"/);
  assert.match(read('website-design.html'), /id="audit-form"/);
});

test('siteConfigScript uses the locked booking URL unless an https override is set', async () => {
  const {siteConfigScript, resolveBookingUrl} = await import('../scripts/seo.mjs');
  assert.equal(resolveBookingUrl({}), '');
  assert.match(siteConfigScript({}), /https:\/\/cal\.com\/zion-sealey-hjalio\/discovery/);
  assert.match(siteConfigScript({}), /__SOVEREIGN_STRIPE_PAYMENT_URLS__=\{"website":"https:\/\/buy\.stripe\.com\/cNi8wQ74LcEPe2Ye813oA00","care":"https:\/\/buy\.stripe\.com\/28E3cwcp57kvbUQaVP3oA01","custom":"https:\/\/buy\.stripe\.com\/4gMaEY88PcEP2kg8NH3oA02"\}/);
  assert.match(siteConfigScript({SOVEREIGN_BOOKING_URL: 'https://cal.example.com/a'}), /https:\/\/cal\.example\.com\/a/);
  assert.match(siteConfigScript({BOOKING_URL: 'http://insecure.example/book'}), /https:\/\/cal\.com\/zion-sealey-hjalio\/discovery/);
});

test('build copies crawl files and bakes an https booking URL into dist', () => {
  const emptyEnv = {...process.env, SOVEREIGN_BOOKING_URL: '', BOOKING_URL: ''};
  execFileSync('node', ['scripts/build.mjs'], {cwd: root, env: emptyEnv});
  assert.equal(readFileSync(join(root, 'dist/robots.txt'), 'utf8'), read('robots.txt'));
  assert.equal(readFileSync(join(root, 'dist/sitemap.xml'), 'utf8'), read('sitemap.xml'));
  assert.match(readFileSync(join(root, 'dist/assets/site-config.js'), 'utf8'), /window\.__SOVEREIGN_BOOKING_URL__="https:\/\/cal\.com\/zion-sealey-hjalio\/discovery"/);

  execFileSync('node', ['scripts/build.mjs'], {
    cwd: root,
    env: {...emptyEnv, SOVEREIGN_BOOKING_URL: 'https://cal.example.com/sovereign-15'},
  });
  const config = readFileSync(join(root, 'dist/assets/site-config.js'), 'utf8');
  assert.match(config, /https:\/\/cal\.example\.com\/sovereign-15/);
  assert.doesNotMatch(config, /calendly\.com|cal\.com\/daymond/i);

  execFileSync('node', ['scripts/build.mjs'], {cwd: root, env: emptyEnv});
  assert.match(readFileSync(join(root, 'dist/assets/site-config.js'), 'utf8'), /window\.__SOVEREIGN_BOOKING_URL__="https:\/\/cal\.com\/zion-sealey-hjalio\/discovery"/);
});
