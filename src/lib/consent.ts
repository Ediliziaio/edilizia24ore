/**
 * GDPR cookie-consent helpers (client-side only).
 *
 * Storage: localStorage key `e24-consent`, JSON:
 *   { necessary: true, analytics: boolean, marketing: boolean, ts: number, v: 1 }
 *
 * Events (dispatched on window):
 *   - `e24:consent` (CustomEvent<Consent>) — fired every time the user makes a
 *     choice. Hook analytics/ad loaders here:
 *
 *       // ESEMPIO — dove collegare Google Analytics / Google AdSense:
 *       window.addEventListener('e24:consent', (e) => {
 *         const c = (e as CustomEvent).detail;
 *         if (c.analytics) loadGoogleAnalytics('G-XXXXXXX');   // solo dopo consenso
 *         if (c.marketing) loadAdSense('ca-pub-XXXXXXXX');     // solo dopo consenso
 *       });
 *
 *     Oppure, per script caricati dopo il banner, leggere lo stato con
 *     `getConsent()` e caricare gli script solo se la categoria è true.
 *
 *   - `e24:consent-open` (Event) — dispatched by the "Gestione cookie" footer
 *     entry to clear the stored choice and re-open the banner.
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
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
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
