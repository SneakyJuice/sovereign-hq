export const DEFAULT_BOOKING_URL = 'https://cal.com/zion-sealey-hjalio/discovery';

/* Live Stripe Payment Links. Keys match data-tier on each buy button.
   data-stripe-payment-url on the button wins when it is a valid https URL. */
export const STRIPE_PAYMENT_URLS = {
  website: 'https://buy.stripe.com/cNi8wQ74LcEPe2Ye813oA00',
  care: 'https://buy.stripe.com/28E3cwcp57kvbUQaVP3oA01',
  custom: 'https://buy.stripe.com/4gMaEY88PcEP2kg8NH3oA02',
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
