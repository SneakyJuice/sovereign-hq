/* Offer constants, locked 2026-11-13.
   Booking: discovery & scoping call, 30 min, Google Meet.
   Stripe: replace an empty string to send that tier to checkout.
   Keys match data-tier on each card CTA: website, care, custom.
   An empty string keeps the Cal.com booking link.
   Per-link override: data-stripe-payment-url on the CTA (wins over this map). */
window.__SOVEREIGN_BOOKING_URL__="https://cal.com/zion-sealey-hjalio/discovery";
window.__SOVEREIGN_STRIPE_PAYMENT_URLS__={"website":"","care":"","custom":""};
