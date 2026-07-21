import { Link } from 'react-router';
import { articles } from '@/data/articles';
import { articleUrl } from '@/lib/seo';
import { resetConsent } from '@/lib/consent';

export default function Footer() {
  const latest = articles.slice(0, 5);

  return (
    <footer className="mt-16 border-t-4 border-brand bg-ink text-neutral-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <img
            src="/logo.png"
            alt="Edilizia 24 Ore"
            className="mb-4 h-10 w-auto rounded bg-white p-1"
            width={160}
            height={40}
            loading="lazy"
            decoding="async"
          />
          <p className="text-sm leading-relaxed text-neutral-400">
            Edilizia 24 Ore è il magazine online dedicato al mondo delle costruzioni: notizie
            quotidiane su bonus, normative e mercato, classifiche dei migliori prodotti e guide
            pratiche per professionisti e privati.
          </p>
        </div>

        <nav aria-label="Categorie del sito">
          <h2 className="mb-4 font-serif text-lg font-bold text-white">Categorie</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/categoria/news" className="hover:text-brand">
                News — Tutte le notizie
              </Link>
            </li>
            <li>
              <Link to="/categoria/bonus-fisco" className="hover:text-brand">
                Bonus &amp; Fisco
              </Link>
            </li>
            <li>
              <Link to="/categoria/normative" className="hover:text-brand">
                Normative
              </Link>
            </li>
            <li>
              <Link to="/categoria/mercato" className="hover:text-brand">
                Mercato
              </Link>
            </li>
            <li>
              <Link to="/categoria/innovazione" className="hover:text-brand">
                Innovazione
              </Link>
            </li>
            <li>
              <Link to="/categoria/sostenibilita" className="hover:text-brand">
                Sostenibilità
              </Link>
            </li>
            <li>
              <Link to="/guide" className="hover:text-brand">
                Guide e Classifiche
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Ultimi articoli pubblicati">
          <h2 className="mb-4 font-serif text-lg font-bold text-white">Ultimi articoli</h2>
          <ul className="space-y-2 text-sm">
            {latest.map((a) => (
              <li key={a.slug}>
                <Link to={articleUrl(a)} className="line-clamp-2 hover:text-brand">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Informazioni sulla testata">
          <h2 className="mb-4 font-serif text-lg font-bold text-white">La testata</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/chi-siamo" className="hover:text-brand">
                Chi siamo — la redazione
              </Link>
            </li>
            <li>
              <Link to="/contatti" className="hover:text-brand">
                Contatti e ufficio stampa
              </Link>
            </li>
            <li>
              <a href="/sitemap.xml" className="hover:text-brand">
                Mappa del sito
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label="Note legali e privacy">
          <h2 className="mb-4 font-serif text-lg font-bold text-white">Note legali</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/privacy-policy" className="hover:text-brand">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/cookie-policy" className="hover:text-brand">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link to="/termini-e-condizioni" className="hover:text-brand">
                Termini e Condizioni
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={resetConsent}
                className="hover:text-brand"
              >
                Gestione cookie
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-neutral-500 sm:flex-row">
          <p>© 2026 Edilizia 24 Ore — Tutti i diritti riservati.</p>
          <p>Testata giornalistica online. Direttore responsabile: Redazione Edilizia 24 Ore.</p>
        </div>
      </div>
    </footer>
  );
}
