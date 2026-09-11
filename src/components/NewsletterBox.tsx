import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { CRM_FORM_ID } from '@/data/types';
import { inviaLead } from '@/lib/eicLead';

/**
 * Le iscrizioni vanno al CRM di Edilizia in Cloud (con la campagna di
 * provenienza). localStorage serve solo a ricordare al lettore che è già
 * iscritto: il dato vero sta nel CRM.
 */
const STORAGE_KEY = 'e24-newsletter';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Status = 'idle' | 'loading' | 'success' | 'error';

interface StoredSubscription {
  email: string;
  ts: string;
}

function readStoredSubscription(): StoredSubscription | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSubscription;
    return typeof parsed?.email === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  /** Iscrizione già presente da una visita precedente (null durante SSR/prerender). */
  const [stored, setStored] = useState<StoredSubscription | null>(null);

  // Ripristina l'iscrizione salvata — solo lato client, niente mismatch SSR.
  useEffect(() => {
    setStored(readStoredSubscription());
  }, []);

  const persistSubscription = (value: string) => {
    const record: StoredSubscription = { email: value, ts: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Storage pieno o bloccato: l'iscrizione resta valida per la sessione.
    }
    setStored(record);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();

    if (!EMAIL_RE.test(value)) {
      setError('Inserisci un indirizzo email valido (es. nome@esempio.it).');
      setStatus('error');
      return;
    }

    setError('');
    setStatus('loading');

    try {
      // Il successo si mostra solo quando il CRM ha accettato l'iscrizione.
      await inviaLead(CRM_FORM_ID, { email: value, tipo: 'newsletter' });
      persistSubscription(value);
      setStatus('success');
    } catch {
      // L'email resta nel campo: il lettore può riprovare senza riscriverla.
      setStatus('error');
      setError('Invio non riuscito. Riprova tra poco.');
    }
  };

  const handleUnsubscribe = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setStored(null);
    setStatus('idle');
    setEmail('');
  };

  const subscribed = stored !== null || status === 'success';

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="rounded-md border-2 border-ink bg-white p-6 sm:p-8"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="newsletter-heading" className="font-serif text-2xl font-bold text-ink sm:text-3xl">
          La newsletter dell'edilizia, ogni mattina
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
          Bonus, normative, prezzi dei materiali e le classifiche della settimana: un'email al
          giorno con quello che conta davvero per chi costruisce e ristruttura. Gratuita.
        </p>

        {subscribed ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-5 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {status === 'success' ? (
              <>
                <p className="font-semibold">Iscrizione registrata!</p>
                <p className="mt-1">
                  Grazie: da ora riceverai la newsletter all'indirizzo che hai indicato.
                </p>
              </>
            ) : (
              <>
                <p className="font-semibold">
                  Sei iscritto alla newsletter
                  {stored ? (
                    <>
                      {' '}
                      con <span className="font-normal">{stored.email}</span>
                    </>
                  ) : null}
                  .
                </p>
                <button
                  type="button"
                  onClick={handleUnsubscribe}
                  className="mt-2 text-xs font-semibold underline underline-offset-2 hover:text-emerald-950"
                >
                  Annulla iscrizione
                </button>
              </>
            )}
          </div>
        ) : (
          <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit} noValidate>
            <div className="flex-1 text-left">
              <label htmlFor="newsletter-email" className="sr-only">
                Indirizzo email
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') {
                    setStatus('idle');
                    setError('');
                  }
                }}
                placeholder="La tua email"
                aria-invalid={status === 'error' && !!error}
                aria-describedby={error ? 'newsletter-email-error' : undefined}
                disabled={status === 'loading'}
                className="w-full rounded-md border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-60 aria-[invalid=true]:border-brand aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-brand/20"
              />
              {error && (
                <p id="newsletter-email-error" role="alert" className="mt-1.5 text-xs font-semibold text-brand">
                  {error}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-md bg-brand px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
            >
              {status === 'loading' ? 'Iscrizione…' : 'Iscriviti gratis'}
            </button>
          </form>
        )}

        <p className="mt-3 text-xs text-neutral-400">
          Iscrivendoti accetti la nostra{' '}
          <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-brand">
            informativa privacy
          </Link>
          . Niente spam: puoi cancellarti in qualsiasi momento con un clic.
        </p>
      </div>
    </section>
  );
}
