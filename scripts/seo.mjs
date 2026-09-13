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
  return `window.__SOVEREIGN_BOOKING_URL__=${JSON.stringify(resolveBookingUrl(env))};\n`;
}
