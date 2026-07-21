import { Link } from 'react-router';
import SeoHead from '@/components/SeoHead';
import { SITE_URL } from '@/data/types';

export default function NotFound() {
  return (
    <>
      <SeoHead
        title="Pagina non trovata (404)"
        description="La pagina che stai cercando non esiste o è stata spostata. Torna alla home di Edilizia 24 Ore per le ultime notizie su edilizia e costruzioni."
        canonical={`${SITE_URL}/404`}
        robots="noindex, follow"
      />
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <p className="font-serif text-7xl font-bold text-brand" aria-hidden="true">
          404
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-ink">Pagina non trovata</h1>
        <p className="mt-4 leading-relaxed text-neutral-600">
          L'indirizzo che hai cercato non corrisponde a nessun articolo o pagina di Edilizia 24 Ore.
          Potrebbe essere stato spostato o rimosso.
        </p>
        <nav aria-label="Collegamenti utili" className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-md bg-brand px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-dark"
          >
            Torna alla home
          </Link>
          <Link
            to="/categoria/news"
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-ink hover:border-brand hover:text-brand"
          >
            Ultime news
          </Link>
        </nav>
      </div>
    </>
  );
}
