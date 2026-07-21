import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
  CONSENT_OPEN_EVENT,
  getConsent,
  saveConsent,
} from '@/lib/consent';

/**
 * Banner consenso cookie (GDPR).
 *
 * - Render SOLO client-side dopo l'hydration (useEffect → mounted): l'HTML
 *   prerenderizzato resta pulito e il banner non causa layout shift (è in
 *   position: fixed, fuori dal flusso del documento).
 * - Scelta salvata in localStorage; ogni scelta emette l'evento `e24:consent`
 *   (vedi src/lib/consent.ts per collegare Google Analytics / AdSense).
 * - Accessibilità: role="dialog", focus sul primo bottone all'apertura,
 *   ESC chiude solo il pannello "Personalizza" (mai il banner senza scelta).
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Client-only: decide visibility after hydration (SSR/prerender renders nothing).
    setVisible(getConsent() === null);

    const reopen = () => {
      const current = getConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setCustomizing(false);
      setVisible(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
  }, []);

  // Focus management: first action button on open, first toggle on customize.
  useEffect(() => {
    if (visible && !customizing) acceptRef.current?.focus();
  }, [visible, customizing]);

  // ESC closes only the customize panel, never the banner without a choice.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCustomizing(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible]);

  const choose = useCallback((prefs: { analytics: boolean; marketing: boolean }) => {
    saveConsent(prefs);
    setVisible(false);
    setCustomizing(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Informativa breve sui cookie"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:max-w-md sm:p-4"
    >
      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-2xl sm:p-5">
        <p className="text-sm leading-relaxed text-neutral-700">
          Usiamo cookie tecnici e, previo consenso, cookie di analytics e di marketing per
          migliorare il sito e mostrarti pubblicità pertinente. Dettagli nella{' '}
          <Link to="/cookie-policy" className="font-medium text-brand underline">
            Cookie Policy
          </Link>
          .
        </p>

        {customizing && (
          <div
            ref={panelRef}
            role="group"
            aria-label="Preferenze cookie"
            className="mt-4 space-y-3 rounded-md border border-neutral-200 bg-neutral-50 p-3"
          >
            <ToggleRow
              id="cookie-necessari"
              label="Necessari"
              description="Tecnici, sempre attivi: navigazione, sicurezza, preferenze base."
              checked
              disabled
            />
            <ToggleRow
              id="cookie-analytics"
              label="Analytics"
              description="Statistiche di utilizzo anonime/aggregate (es. Google Analytics)."
              checked={analytics}
              onChange={setAnalytics}
            />
            <ToggleRow
              id="cookie-marketing"
              label="Marketing"
              description="Pubblicità personalizzata e profilazione (es. Google AdSense)."
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {customizing ? (
            <>
              <button
                type="button"
                onClick={() => choose({ analytics, marketing })}
                className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                Salva preferenze
              </button>
              <button
                type="button"
                onClick={() => setCustomizing(false)}
                className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium text-ink hover:bg-neutral-100 sm:w-auto"
              >
                Indietro
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                ref={acceptRef}
                onClick={() => choose({ analytics: true, marketing: true })}
                className="w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:w-auto"
              >
                Accetta tutti
              </button>
              <button
                type="button"
                onClick={() => choose({ analytics: false, marketing: false })}
                className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm font-medium text-ink hover:bg-neutral-100 sm:w-auto"
              >
                Rifiuta
              </button>
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                className="w-full rounded-md px-4 py-2.5 text-sm font-medium text-neutral-600 underline hover:text-ink sm:w-auto"
              >
                Personalizza
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

function ToggleRow({ id, label, description, checked, disabled, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        <p className="text-xs leading-snug text-neutral-500">{description}</p>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand' : 'bg-neutral-300'
        } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
