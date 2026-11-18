/** Persisted consent for the existing banner.
 * The local public/analytics-consent.js adapter forwards the saved choice to
 * the single GTM runtime. No standalone GA4 or ad SDK is loaded here.
 */

export const CONSENT_KEY = 'e24-consent';
export const CONSENT_EVENT = 'e24:consent';
export const CONSENT_OPEN_EVENT = 'e24:consent-open';
export const CONSENT_VERSION = 1;

export interface Consent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
  v: number;
}

export function getConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    if (parsed.v !== CONSENT_VERSION || typeof parsed.analytics !== 'boolean') return null;
    return {
      necessary: true,
      analytics: parsed.analytics,
      marketing: parsed.marketing === true,
      ts: typeof parsed.ts === 'number' ? parsed.ts : Date.now(),
      v: CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function saveConsent(prefs: { analytics: boolean; marketing: boolean }): Consent {
  const consent: Consent = {
    necessary: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    ts: Date.now(),
    v: CONSENT_VERSION,
  };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch {
    // The explicit choice still reaches the adapter for this page.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: consent }));
  return consent;
}

/** Clears the stored consent and asks the banner to re-open (footer "Gestione cookie"). */
export function resetConsent(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
}
