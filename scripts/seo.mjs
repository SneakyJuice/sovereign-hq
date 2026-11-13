export const DEFAULT_BOOKING_URL = 'https://cal.com/zion-sealey-hjalio/discovery';

/* Stripe payment links. Empty keeps the tier CTA on the booking URL.
   Keys: website (Tier 1), care (Tier 2), custom (Tier 3). */
export const STRIPE_PAYMENT_URLS = {
  website: '',
  care: '',
  custom: '',
};

export function resolveBookingUrl(env = process.env) {
  const raw = String(env.SOVEREIGN_BOOKING_URL || env.BOOKING_URL || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:') return '';
    return url.href;
  } catch {
    return '';
  }
}

export function siteConfigScript(env = process.env) {
  const booking = resolveBookingUrl(env) || DEFAULT_BOOKING_URL;
  return `window.__SOVEREIGN_BOOKING_URL__=${JSON.stringify(booking)};\nwindow.__SOVEREIGN_STRIPE_PAYMENT_URLS__=${JSON.stringify(STRIPE_PAYMENT_URLS)};\n`;
}
