import { useState } from 'react';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { breadcrumbLd } from '@/lib/seo';

/**
 * CONTACT ENDPOINT — punto di integrazione backend (come NewsletterBox).
 * Lascia '' per la sola validazione client (nessun invio reale). Per andare in
 * produzione incolla un endpoint che accetti POST (es. Formspree):
 *   const CONTACT_ENDPOINT = 'https://formspree.io/f/<form-id>';
 */
const CONTACT_ENDPOINT = '';

export default function Contatti() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    // No endpoint configured yet: keep the previous client-only behaviour.
    if (!CONTACT_ENDPOINT) {
      setSent(true);
      return;
    }
    setSending(true);
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.currentTarget),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSent(true);
    } catch {
      setError('Invio non riuscito. Riprova o scrivici a redazione@edilizia24ore.it.');
    } finally {
      setSending(false);
    }
  }

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contatti', path: '/contatti' },
  ];

  return (
    <>
      <SeoHead
        title="Contatti — Edilizia 24 Ore"
        description="Contatta la redazione di Edilizia 24 Ore: segnalazioni, correzioni, ufficio stampa, proposte commerciali e pubblicità sul magazine dell'edilizia."
        canonical={`${SITE_URL}/contatti`}
        jsonLd={[breadcrumbLd(crumbs)]}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs crumbs={crumbs} />

        <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">Contatti</h1>
        <div className="article-body mt-6">
          <p>
            Per segnalazioni, correzioni, comunicati stampa e proposte di collaborazione puoi
            scrivere alla redazione usando il modulo qui sotto. Rispondiamo in genere entro due
            giorni lavorativi. Per la pubblicità e le inserzioni sui formati banner del sito,
            indica nell'oggetto "Pubblicità".
          </p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <section aria-labelledby="redazione-heading" className="rounded-md bg-neutral-50 p-5">
            <h2 id="redazione-heading" className="font-serif text-lg font-bold text-ink">
              Redazione
            </h2>
            <dl className="mt-3 space-y-2 text-sm text-neutral-700">
              <div>
                <dt className="font-semibold">Email redazione</dt>
                <dd>redazione@edilizia24ore.it</dd>
              </div>
              <div>
                <dt className="font-semibold">Ufficio stampa</dt>
                <dd>stampa@edilizia24ore.it</dd>
              </div>
              <div>
                <dt className="font-semibold">Pubblicità</dt>
                <dd>advertising@edilizia24ore.it</dd>
              </div>
              <div>
                <dt className="font-semibold">Editore</dt>
                <dd>Domus Group S.r.l. — P.IVA 13132010961</dd>
              </div>
              <div>
                <dt className="font-semibold">Sede legale</dt>
                <dd>Via Aurelio Saffi 29, 20123 Milano (MI)</dd>
              </div>
              <div>
                <dt className="font-semibold">PEC</dt>
                <dd>domusgroupsrl@legalmail.it</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="modulo-heading">
            <h2 id="modulo-heading" className="font-serif text-lg font-bold text-ink">
              Scrivici
            </h2>
            {sent ? (
              <p className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status">
                Messaggio inviato. La redazione ti risponderà al più presto.
              </p>
            ) : (
              <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="contatto-nome" className="mb-1 block text-sm font-medium text-ink">
                    Nome e cognome
                  </label>
                  <input
                    id="contatto-nome"
                    name="nome"
                    type="text"
                    required
                    autoComplete="name"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="contatto-email" className="mb-1 block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    id="contatto-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="contatto-msg" className="mb-1 block text-sm font-medium text-ink">
                    Messaggio
                  </label>
                  <textarea
                    id="contatto-msg"
                    name="messaggio"
                    required
                    rows={4}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                {error && (
                  <p className="text-sm font-medium text-brand" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-md bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-dark disabled:opacity-60"
                >
                  {sending ? 'Invio…' : 'Invia messaggio'}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
