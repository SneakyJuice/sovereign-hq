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

test('vercel.json permanently redirects www host to apex for all paths', () => {
  const config = JSON.parse(read('vercel.json'));
  const match = (config.redirects || []).find((rule) =>
    rule.has?.some((condition) => condition.type === 'host' && condition.value === 'www.sovereign-hq.com')
    && rule.destination === 'https://sovereign-hq.com/:path*'
    && (rule.statusCode === 301 || rule.permanent === true)
    && rule.source === '/:path*',
  );
  assert.ok(match, 'missing www.sovereign-hq.com → https://sovereign-hq.com/:path* permanent redirect');
});

test('index and website-design carry apex self-canonicals', () => {
  assert.match(read('index.html'), /<link rel="canonical" href="https:\/\/sovereign-hq\.com\/">/);
  assert.match(read('website-design.html'), /<link rel="canonical" href="https:\/\/sovereign-hq\.com\/website-design">/);
});

test('pricing is noindex,follow and remains linked from the homepage', () => {
  assert.match(read('pricing.html'), /<meta name="robots" content="noindex,\s*follow">/);
  assert.match(read('index.html'), /href="\/pricing"/);
});

test('home JSON-LD hooks use only safe known fields', () => {
  const html = read('index.html');
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /"@type":\s*"Organization"/);
  assert.match(html, /"@type":\s*"LocalBusiness"/);
  assert.match(html, /<!-- TODO: FAQPage JSON-LD when Anthony\/Virgil approve real Q&A -->/);
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

test('home offer strip and website-design expose stubbed calendar CTAs; enquiry stays', () => {
  const home = read('index.html');
  assert.match(home, /class="website-offer[^"]*"/);
  assert.match(home, /data-booking-cta/);
  assert.match(home, /data-booking-cta[^>]*href="#"/);
  assert.match(home, /data-booking-cta[^>]*aria-disabled="true"/);
  assert.match(home, /id="audit"/);
  assert.match(home, /id="enquire"/);

  const offer = read('website-design.html');
  assert.match(offer, /data-booking-cta/);
  assert.match(offer, /data-booking-cta[^>]*href="#"/);
  assert.match(offer, /data-booking-cta[^>]*aria-disabled="true"/);
  assert.match(offer, /id="get-started"/);
  assert.match(offer, /id="audit-form"/);
});

test('build copies crawl files and bakes an https booking URL into dist', () => {
  const emptyEnv = {...process.env, SOVEREIGN_BOOKING_URL: '', BOOKING_URL: ''};
  execFileSync('node', ['scripts/build.mjs'], {cwd: root, env: emptyEnv});
  assert.equal(readFileSync(join(root, 'dist/robots.txt'), 'utf8'), read('robots.txt'));
  assert.equal(readFileSync(join(root, 'dist/sitemap.xml'), 'utf8'), read('sitemap.xml'));
  assert.match(readFileSync(join(root, 'dist/assets/site-config.js'), 'utf8'), /window\.__SOVEREIGN_BOOKING_URL__=""/);

  execFileSync('node', ['scripts/build.mjs'], {
    cwd: root,
    env: {...emptyEnv, SOVEREIGN_BOOKING_URL: 'https://cal.example.com/sovereign-15'},
  });
  const config = readFileSync(join(root, 'dist/assets/site-config.js'), 'utf8');
  assert.match(config, /https:\/\/cal\.example\.com\/sovereign-15/);
  assert.doesNotMatch(config, /calendly\.com|cal\.com\/daymond/i);

  execFileSync('node', ['scripts/build.mjs'], {cwd: root, env: emptyEnv});
  assert.match(readFileSync(join(root, 'dist/assets/site-config.js'), 'utf8'), /window\.__SOVEREIGN_BOOKING_URL__=""/);
});
