import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  GA_MEASUREMENT_ID,
  analyticsHead,
  classifyClick,
  injectAnalytics,
  installAnalytics,
  linkLocation,
  trackEvent,
} from '../src/analytics.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');
const LOADER = `googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;

function mockDocument() {
  const listeners = new Map();
  return {
    addEventListener(type, fn) {
      const list = listeners.get(type) || [];
      list.push(fn);
      listeners.set(type, list);
    },
    fire(type, event) {
      for (const fn of listeners.get(type) || []) fn(event);
    },
  };
}

function region(kind, id = '') {
  return {
    id,
    matches(sel) {
      if (kind === 'footer') return sel === 'footer';
      if (kind === 'header') return sel === 'header';
      if (kind === 'section') return sel === 'section[id]';
      return false;
    },
  };
}

function anchor({href, text = '', booking = false, parents = []}) {
  const el = {
    href,
    textContent: text,
    tagName: 'A',
    getAttribute(name) {
      return name === 'href' ? href : null;
    },
    hasAttribute(name) {
      return name === 'data-booking-cta' && booking;
    },
    closest(sel) {
      if (sel === 'a') return el;
      return parents.find((parent) => parent.matches(sel)) || null;
    },
  };
  return el;
}

test('measurement id is the single GA4 constant and the head tag is direct gtag', () => {
  assert.equal(GA_MEASUREMENT_ID, 'G-B3T60WYGQ4');
  const head = analyticsHead();
  assert.equal(head.split(LOADER).length - 1, 1);
  assert.match(head, new RegExp(`gtag\\('config','${GA_MEASUREMENT_ID}'\\)`));
  assert.doesNotMatch(head, /GTM-|gtm\.js/);
  assert.equal(head.includes(GA_MEASUREMENT_ID), true);
});

test('injectAnalytics adds the tag once and leaves robots markup untouched', () => {
  const source = read('pricing.html');
  const html = injectAnalytics(source);
  assert.equal(html.split(LOADER).length - 1, 1);
  assert.match(html, new RegExp(`gtag\\('config','${GA_MEASUREMENT_ID}'\\)`));
  assert.match(html, /<script src="\/assets\/analytics\.js" defer><\/script>/);
  assert.match(html, /<meta name="robots" content="noindex,\s*follow">/);
  assert.equal(html.includes('GTM-MHKJBNN5'), false);
  assert.equal(html.includes('googletagmanager.com/gtm.js'), false);
  assert.throws(() => injectAnalytics(html), /already has an analytics snippet/);
});

test('source pages have no GA or GTM snippet yet', () => {
  const pages = ['index.html', 'pricing.html', 'website-design.html'].map(read).join('\n');
  assert.equal(pages.includes('googletagmanager.com'), false);
  assert.equal(pages.includes('GTM-'), false);
  assert.equal(pages.includes(GA_MEASUREMENT_ID), false);
});

test('trackEvent does nothing when gtag is missing and uses beacon when it exists', () => {
  assert.equal(trackEvent('click_call', {link_url: 'tel:+1'}), false);
  const calls = [];
  assert.equal(trackEvent('click_email', {link_url: 'mailto:a@b.c'}, (...args) => calls.push(args)), true);
  assert.deepEqual(calls, [['event', 'click_email', {link_url: 'mailto:a@b.c', transport_type: 'beacon'}]]);
});

test('click classification covers tel, mailto, and booking links only', () => {
  assert.equal(classifyClick(anchor({href: 'tel:+18483911819'})), 'click_call');
  assert.equal(classifyClick(anchor({href: 'mailto:Anthony@sovereign-hq.com'})), 'click_email');
  assert.equal(classifyClick(anchor({
    href: 'https://cal.com/zion-sealey-hjalio/discovery',
    text: 'Book a discovery call',
    booking: true,
  })), 'click_book');
  assert.equal(classifyClick(anchor({
    href: 'https://cal.com/example/15',
    text: 'Schedule',
  })), 'click_book');
  assert.equal(classifyClick(anchor({href: '/book', text: 'Book a call'})), 'click_book');
  assert.equal(classifyClick(anchor({href: '#audit', text: 'Let’s talk about your business'})), null);
  assert.equal(classifyClick(anchor({
    href: 'https://buy.stripe.com/cNi8wQ74LcEPe2Ye813oA00',
    text: 'Buy now',
  })), null);
  assert.equal(linkLocation(anchor({
    href: 'tel:+18483911819',
    parents: [region('footer')],
  })), 'footer');
  assert.equal(linkLocation(anchor({
    href: 'https://cal.com/zion-sealey-hjalio/discovery',
    parents: [region('section', 'pricing')],
  })), 'pricing');
});

test('delegated clicks record one beacon event and do not block navigation', () => {
  const doc = mockDocument();
  const calls = [];
  globalThis.gtag = (...args) => calls.push(args);
  try {
    installAnalytics(doc);
    installAnalytics(doc);
    let prevented = false;
    const link = anchor({href: 'tel:+18483911819', text: '848.391.1819', parents: [region('section', 'audit')]});
    doc.fire('click', {
      target: {closest: (sel) => link.closest(sel)},
      preventDefault() { prevented = true; },
      stopPropagation() { prevented = true; },
    });
    doc.fire('click', {target: {closest: () => null}, preventDefault() { prevented = true; }});
    doc.fire('submit', {target: {tagName: 'FORM', id: 'audit-form'}, preventDefault() { prevented = true; }});
    assert.equal(prevented, false);
    assert.equal(calls.length, 1);
    assert.equal(calls[0][1], 'click_call');
    assert.equal(calls[0][2].transport_type, 'beacon');
    assert.equal(calls[0][2].link_url, 'tel:+18483911819');
    assert.equal(calls[0][2].location, 'audit');
  } finally {
    delete globalThis.gtag;
  }
});

test('generate_lead fires only for the successful lead event', () => {
  const doc = mockDocument();
  const calls = [];
  globalThis.gtag = (...args) => calls.push(args);
  try {
    installAnalytics(doc);
    const form = {
      tagName: 'FORM',
      id: 'audit-form',
      closest: () => region('section', 'get-started'),
    };
    doc.fire('submit', {target: form});
    assert.equal(calls.length, 0);
    delete globalThis.gtag;
    doc.fire('sovereign:lead-submitted', {target: form});
    assert.equal(calls.length, 0);
    globalThis.gtag = (...args) => calls.push(args);
    doc.fire('sovereign:lead-submitted', {target: form});
    assert.deepEqual(calls, [[
      'event',
      'generate_lead',
      {form_id: 'audit-form', location: 'get-started', transport_type: 'beacon'},
    ]]);
  } finally {
    delete globalThis.gtag;
  }
});
