import { useState } from 'react';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { breadcrumbLd } from '@/lib/seo';

export default function Contatti() {
  const [sent, setSent] = useState(false);

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
            giorni lavorativi. Per la pubblicità e le inserzioni sui formati banner della testata,
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
                <dt className="font-semibold">Sede</dt>
                <dd>Via delle Costruzioni 24, 20121 Milano (MI)</dd>
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
              <form
                className="mt-4 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label htmlFor="contatto-nome" className="mb-1 block text-sm font-medium text-ink">
                    Nome e cognome
                  </label>
                  <input
                    id="contatto-nome"
                    type="text"
                    required
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="contatto-email" className="mb-1 block text-sm font-medium text-ink">
                    Email
                  </label>
                  <input
                    id="contatto-email"
                    type="email"
                    required
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="contatto-msg" className="mb-1 block text-sm font-medium text-ink">
                    Messaggio
                  </label>
                  <textarea
                    id="contatto-msg"
                    required
                    rows={4}
                    className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-dark"
                >
                  Invia messaggio
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
