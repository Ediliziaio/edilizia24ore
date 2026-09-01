import { Link } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { breadcrumbLd } from '@/lib/seo';

// No named personas: articles carry a collective byline, so this page
// describes the process instead of listing people a reader could not verify.
const DESKS = [
  {
    area: 'Bonus e fiscalità',
    detail:
      'Aliquote, massimali, requisiti e adempimenti verso Agenzia delle Entrate ed ENEA, sempre riferiti al provvedimento che li istituisce.',
  },
  {
    area: 'Normative e cantiere',
    detail:
      'Decreti, recepimenti di direttive europee, criteri ambientali minimi e sicurezza sul lavoro, con le scadenze operative.',
  },
  {
    area: 'Impianti ed energia',
    detail:
      'Pompe di calore, caldaie, fotovoltaico e isolamento: dati di targa dichiarati dai costruttori e rendimenti stagionali a confronto.',
  },
  {
    area: 'Materiali e progetto',
    detail:
      'Serramenti, rivestimenti, pavimenti e finiture, con prezzi indicativi di mercato e destinazione d’uso.',
  },
];

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
            <h2 id="team-heading" className="mb-4 font-serif text-2xl font-bold text-ink">
              Chi firma gli articoli
            </h2>
            <div className="article-body">
              <p>
                Gli articoli di Edilizia 24 Ore sono firmati <strong>«Redazione Edilizia 24 Ore»</strong>:
                sono il risultato di un lavoro collettivo di stesura, verifica e aggiornamento, non
                dell’opera di un singolo autore. Preferiamo una firma collettiva verificabile a nomi
                che il lettore non potrebbe controllare.
              </p>
              <p>
                La responsabilità editoriale e legale dei contenuti è di Domus Group S.r.l., i cui
                dati completi sono in fondo a ogni pagina e nella{' '}
                <Link to="/contatti" className="font-medium text-brand underline">
                  pagina contatti
                </Link>
                .
              </p>
            </div>

            <h3 className="mb-4 mt-8 font-serif text-xl font-bold text-ink">Le aree che seguiamo</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              {DESKS.map((d) => (
                <div key={d.area} className="rounded-md border border-neutral-200 p-5">
                  <h4 className="font-serif text-lg font-bold text-ink">{d.area}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">{d.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm text-neutral-600">
              Per le classifiche comparative i criteri, le fonti e i limiti del metodo sono
              dichiarati nella{' '}
              <Link to="/metodologia" className="font-medium text-brand underline">
                pagina metodologia
              </Link>
              .
            </p>
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
