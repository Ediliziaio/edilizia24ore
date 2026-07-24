/**
 * Consent-gated Google Analytics 4 loader.
 *
 * GA4 loads ONLY after the user grants the "analytics" consent category through
 * the cookie banner (see src/lib/consent.ts). Set GA_MEASUREMENT_ID to activate:
 * while it is empty this module is a no-op and NO third-party script is loaded,
 * so the site ships privacy-safe by default.
 */
import { CONSENT_EVENT, getConsent, type Consent } from './consent';

/** Google Analytics 4 measurement id, e.g. 'G-XXXXXXXXXX'. Empty = disabled. */
const GA_MEASUREMENT_ID = '';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

function loadGA4(id: string): void {
  if (loaded) return;
  loaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
}

function apply(consent: Consent | null): void {
  if (!GA_MEASUREMENT_ID) return;
  if (consent?.analytics) loadGA4(GA_MEASUREMENT_ID);
}

/** Wire GA4 to the consent lifecycle. Safe to call once at client startup. */
export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  apply(getConsent());
  window.addEventListener(CONSENT_EVENT, (e) => apply((e as CustomEvent<Consent>).detail));
}
