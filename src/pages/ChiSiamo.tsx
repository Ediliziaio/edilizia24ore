import { Link } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { authors, authorUrl } from '@/data/authors';
import { breadcrumbLd } from '@/lib/seo';

// The roster lives in src/data/authors.ts so that bylines, author pages and
// this page can never drift apart: an article signed by someone missing here
// is unverifiable authorship, a hard E-E-A-T failure on YMYL topics.
const TEAM = authors;

export default function ChiSiamo() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Chi siamo', path: '/chi-siamo' },
  ];

  return (
    <>
      <SeoHead
        title="Chi siamo — la redazione di Edilizia 24 Ore"
        description="Edilizia 24 Ore è una redazione indipendente di giornalisti e tecnici specializzati in costruzioni, bonus edilizi, normative e mercato immobiliare. Scopri chi siamo e come lavoriamo."
        canonical={`${SITE_URL}/chi-siamo`}
        jsonLd={[breadcrumbLd(crumbs)]}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs crumbs={crumbs} />

        <article>
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Chi siamo: la redazione di Edilizia 24 Ore
          </h1>

          <div className="article-body mt-6">
            <p>
              Edilizia 24 Ore è un magazine online indipendente dedicato al mondo delle costruzioni
              in Italia: bonus edilizi e fiscalità, normative tecnica e urbanistica, mercato
              immobiliare, innovazione di prodotto e di cantiere, sostenibilità. Il nostro obiettivo
              è semplice: dare a professionisti e privati informazioni precise, verificabili e
              subito utilizzabili.
            </p>
            <p>
              Ogni articolo nasce da fonti ufficiali — gazzette ufficiali, provvedimenti
              dell'Agenzia delle Entrate, dati Istat e ANCE, schede tecniche dei produttori — e
              viene scritto o revisionato da un tecnico del settore prima della pubblicazione. Le
              classifiche Top 10 e Top 5 seguono criteri dichiarati e aggiornati ogni anno, perché
              la fiducia dei lettori si costruisce con la trasparenza del metodo.
            </p>
            <p>
              Crediamo in un'informazione tecnica che non rinunci alla chiarezza: ogni pezzo apre
              con la risposta che il lettore sta cercando, approfondisce con dati e contesto, e si
              chiude con le domande più frequenti. Niente riempitivi, niente copia-incolla dai
              comunicati stampa.
            </p>
          </div>

          <section aria-labelledby="team-heading" className="mt-12">
            <h2 id="team-heading" className="mb-6 font-serif text-2xl font-bold text-ink">
              La redazione
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {TEAM.map((m) => (
                <div key={m.slug} className="rounded-md border border-neutral-200 p-5">
                  <h3 className="font-serif text-lg font-bold text-ink">
                    <Link to={authorUrl(m)} className="hover:text-brand">
                      {m.name}
                    </Link>
                  </h3>
                  <p className="text-sm font-medium text-brand">
                    {m.role} · {m.credential}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{m.bio}</p>
                  <Link
                    to={authorUrl(m)}
                    className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
                  >
                    Articoli firmati →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="linea-heading" className="mt-12">
            <h2 id="linea-heading" className="mb-4 font-serif text-2xl font-bold text-ink">
              Linea editoriale e correzioni
            </h2>
            <div className="article-body">
              <p>
                Le norme edilizie cambiano in fretta: quando un decreto o una circolare modifica
                quanto scritto, aggiorniamo l'articolo e indichiamo la data di ultimo aggiornamento
                in apertura. Se individui un errore, scrivici dalla pagina contatti: le correzioni
                sostanziali vengono segnalate in calce al pezzo.
              </p>
              <p>
                Edilizia 24 Ore è edito da Domus Group S.r.l. I contenuti hanno finalità informativa
                e non sostituiscono la consulenza di un professionista abilitato.
              </p>
            </div>
          </section>
        </article>
      </div>
    </>
  );
}
