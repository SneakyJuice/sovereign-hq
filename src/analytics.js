/** Sole GA4 measurement ID. The build writes it into every page head. */
export const GA_MEASUREMENT_ID = 'G-B3T60WYGQ4';

const LOADER = 'https://www.googletagmanager.com/gtag/js?id=';

export function analyticsHead(id = GA_MEASUREMENT_ID) {
  if (!/^G-[A-Z0-9]+$/.test(id)) throw new Error('Invalid GA4 measurement ID');
  return `<script async src="${LOADER}${id}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${id}');</script>`;
}

/** Insert the direct gtag.js tag once. Refuses pages that already have GA or GTM. */
export function injectAnalytics(html) {
  const existing = html.match(/googletagmanager\.com\/(?:gtag\/js|gtm\.js)|GTM-[A-Z0-9]+/g);
  if (existing) {
    throw new Error(`Page already has an analytics snippet (${existing.join(', ')}); not adding another`);
  }
  const block = `${analyticsHead()}\n<script src="/assets/analytics.js" defer></script>`;
  if (!/<head[^>]*>/i.test(html)) throw new Error('Page is missing <head>');
  return html.replace(/<head[^>]*>/i, (open) => `${open}\n${block}`);
}

export function trackEvent(name, params = {}, gtag = globalThis.gtag) {
  if (typeof gtag !== 'function') return false;
  gtag('event', name, {...params, transport_type: 'beacon'});
  return true;
}

export function classifyClick(anchor) {
  if (!anchor || typeof anchor.getAttribute !== 'function') return null;
  const raw = String(anchor.getAttribute('href') || '');
  const abs = String(anchor.href || raw);
  if (/^tel:/i.test(raw) || /^tel:/i.test(abs)) return 'click_call';
  if (/^mailto:/i.test(raw) || /^mailto:/i.test(abs)) return 'click_email';
  if (anchor.hasAttribute?.('data-booking-cta')) return 'click_book';
  const probe = `${raw} ${abs}`;
  if (/https?:\/\/(?:www\.)?cal\.com\b/i.test(probe)) return 'click_book';
  if (/https?:\/\/(?:www\.)?calendly\.com\b/i.test(probe)) return 'click_book';
  try {
    const url = new URL(abs, 'https://sovereign-hq.com');
    if (/(^|\/)book(?:ing)?(?:\/|$)/i.test(url.pathname)) return 'click_book';
  } catch { /* ignore non-URL hrefs */ }
  const label = String(anchor.textContent || '').replace(/\s+/g, ' ').trim();
  if (/^book a (?:call|discovery(?: call)?)\b/i.test(label)) return 'click_book';
  if (/\b(?:schedule|scheduling) (?:a )?(?:call|meeting|consultation)\b/i.test(label)) return 'click_book';
  return null;
}

export function linkLocation(anchor) {
  if (anchor.closest?.('footer')) return 'footer';
  if (anchor.closest?.('header')) return 'header';
  const section = anchor.closest?.('section[id]');
  if (section?.id) return section.id;
  const form = anchor.closest?.('form[id]');
  if (form?.id) return form.id;
  return 'page';
}

function onClick(event) {
  const anchor = event.target?.closest?.('a');
  if (!anchor) return;
  const name = classifyClick(anchor);
  if (!name) return;
  trackEvent(name, {
    link_url: anchor.href || anchor.getAttribute('href') || '',
    link_text: String(anchor.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 120),
    location: linkLocation(anchor),
  });
}

function onLead(event) {
  const form = event.target;
  if (!form || String(form.tagName || '').toUpperCase() !== 'FORM') return;
  const section = form.closest?.('section[id]');
  trackEvent('generate_lead', {
    form_id: form.id || 'contact',
    location: section?.id || form.id || 'page',
  });
}

const installed = new WeakSet();

export function installAnalytics(doc = globalThis.document) {
  if (!doc || installed.has(doc)) return;
  installed.add(doc);
  doc.addEventListener('click', onClick);
  doc.addEventListener('sovereign:lead-submitted', onLead);
}
