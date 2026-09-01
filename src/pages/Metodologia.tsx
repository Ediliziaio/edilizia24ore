import { Link } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { articles } from '@/data/articles';
import { absoluteUrl, articleUrl, breadcrumbLd, publisherOrganizationLd } from '@/lib/seo';

/**
 * Ranking methodology.
 *
 * The comparative rankings are what separates this site from a plain news
 * feed, so the criteria behind them are declared openly — including the
 * limits (desk research, not laboratory testing; indicative price ranges).
 * Stating what the method does NOT cover is part of the point.
 */
const CRITERIA = [
  {
    name: 'Prestazione tecnica dichiarata',
    detail:
      'Il dato di targa pubblicato dal produttore nella scheda tecnica: SCOP e refrigerante per le pompe di calore, conducibilità termica per gli isolanti, trasmittanza per i serramenti, rendimento per i generatori. È il criterio che pesa di più, perché è verificabile da chiunque sul documento del produttore.',
  },
  {
    name: 'Prezzo indicativo di mercato',
    detail:
      'Un intervallo, mai un prezzo secco: raccogliamo listini pubblici, preventivi circolanti e prezzi di rivenditori online al momento della stesura. Gli intervalli comprendono la fornitura e, dove indicato, la posa; variano per zona, sconti e periodo.',
  },
  {
    name: 'Punto di forza',
    detail:
      "La caratteristica per cui quel prodotto viene scelto rispetto agli altri della stessa fascia: efficienza reale, silenziosità, affidabilità, facilità di posa, assistenza sul territorio.",
  },
  {
    name: 'Destinazione d’uso ideale',
    detail:
      'Per chi ha senso: metratura, tipo di edificio, clima, budget. Serve a evitare la trappola del "migliore in assoluto", che in edilizia non esiste: esiste il più adatto a un contesto.',
  },
];

const LIMITS = [
  'Non sono prove di laboratorio. Non misuriamo i prodotti in condizioni controllate: confrontiamo dati dichiarati, documentazione tecnica e prezzi rilevati.',
  'I prezzi sono indicativi e datati. Cambiano per fornitore, zona, sconti e periodo: vanno sempre verificati con un preventivo.',
  "L'ordine non è una graduatoria assoluta. Riflette il peso dei criteri sopra applicati a un contesto d'uso tipico, dichiarato in ogni scheda.",
  'Non sostituiscono il progettista. Per dimensionamento, pratiche edilizie e detrazioni serve un tecnico abilitato.',
];

export default function Metodologia() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Metodologia delle classifiche', path: '/metodologia' },
  ];

  const rankings = articles.filter((a) => a.category === 'top-10' || a.category === 'top-5');
  const withTables = rankings.filter((a) => a.table);
  const url = `${SITE_URL}/metodologia`;

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    name: 'Metodologia delle classifiche di Edilizia 24 Ore',
    description:
      'I criteri con cui Edilizia 24 Ore costruisce le classifiche comparative Top 10 e Top 5: prestazione tecnica dichiarata, prezzo indicativo, punto di forza, destinazione d’uso. Fonti, aggiornamenti e limiti del metodo.',
    inLanguage: 'it-IT',
    publisher: publisherOrganizationLd,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: CRITERIA.map((c) => c.name),
  };

  return (
    <>
      <SeoHead
        title="Metodologia delle classifiche"
        description="Come nascono le classifiche di Edilizia 24 Ore: i quattro criteri di confronto, le fonti usate, ogni quanto aggiorniamo e — soprattutto — che cosa il nostro metodo non è."
        canonical={url}
        keywords={[
          'metodologia classifiche edilizia',
          'come confrontiamo i prodotti',
          'criteri di valutazione',
        ]}
        jsonLd={[howToLd, breadcrumbLd(crumbs)]}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs crumbs={crumbs} />

        <article>
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Come costruiamo le nostre classifiche
          </h1>

          <div className="in-breve mt-6" role="note" aria-label="Risposta in breve">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-brand">In breve</p>
            <p>
              Le {rankings.length} classifiche di Edilizia 24 Ore confrontano i prodotti su quattro
              criteri dichiarati — prestazione tecnica di targa, prezzo indicativo di mercato, punto
              di forza e destinazione d’uso — a partire da schede tecniche dei produttori, listini
              pubblici e fonti ufficiali. {withTables.length} classifiche riportano la tabella di
              confronto completa. Non sono prove di laboratorio e i prezzi sono intervalli
              indicativi.
            </p>
          </div>

          <div className="article-body mt-8">
            <p>
              Una classifica ha valore solo se si capisce come è stata fatta. Per questo pubblichiamo
              i criteri prima dei risultati: chi legge deve poter rifare il ragionamento, non fidarsi
              e basta. Se sei d’accordo con i pesi che diamo ai criteri, la classifica ti sarà utile;
              se il tuo contesto è diverso, saprai esattamente quale colonna guardare per riordinarla
              secondo le tue priorità.
            </p>
          </div>

          <section aria-labelledby="criteri" className="mt-10">
            <h2 id="criteri" className="font-serif text-2xl font-bold text-ink">
              I quattro criteri di confronto
            </h2>
            <ol className="mt-5 space-y-5">
              {CRITERIA.map((c, i) => (
                <li key={c.name} className="rounded-md border border-neutral-200 p-5">
                  <h3 className="font-serif text-lg font-bold text-ink">
                    <span className="mr-2 text-brand">{i + 1}.</span>
                    {c.name}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-neutral-700">{c.detail}</p>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="fonti" className="mt-10">
            <h2 id="fonti" className="font-serif text-2xl font-bold text-ink">
              Quali fonti usiamo
            </h2>
            <div className="article-body">
              <p>
                Schede tecniche e manuali dei produttori per i dati di targa; listini pubblici e
                prezzi di rivenditori per gli intervalli di costo; Gazzetta Ufficiale, provvedimenti
                dell’Agenzia delle Entrate e documentazione ENEA per requisiti e incentivi; rapporti
                ANCE e dati Istat per il quadro di mercato. Quando un dato dipende da una norma,
                citiamo la norma.
              </p>
            </div>
          </section>

          <section aria-labelledby="aggiornamento" className="mt-10">
            <h2 id="aggiornamento" className="font-serif text-2xl font-bold text-ink">
              Ogni quanto aggiorniamo
            </h2>
            <div className="article-body">
              <p>
                Ogni classifica porta l’anno nel titolo e la data di ultimo aggiornamento in
                apertura. Rivediamo una classifica quando esce un modello rilevante, quando i prezzi
                si muovono in modo sensibile o quando cambia una norma che tocca requisiti o
                incentivi. Le correzioni sostanziali vengono segnalate in calce all’articolo.
              </p>
            </div>
          </section>

          <section aria-labelledby="limiti" className="mt-10">
            <h2 id="limiti" className="font-serif text-2xl font-bold text-ink">
              Che cosa questo metodo non è
            </h2>
            <ul className="mt-4 space-y-3">
              {LIMITS.map((l) => (
                <li
                  key={l}
                  className="rounded-md border-l-4 border-brand bg-neutral-50 px-4 py-3 text-[15px] leading-relaxed text-neutral-800"
                >
                  {l}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="pubblicita" className="mt-10">
            <h2 id="pubblicita" className="font-serif text-2xl font-bold text-ink">
              Pubblicità e indipendenza editoriale
            </h2>
            <div className="article-body">
              <p>
                Gli spazi pubblicitari presenti sul sito sono contrassegnati dall’etichetta
                «Pubblicità» e i relativi link sono marcati come sponsorizzati. Sono separati dai
                contenuti editoriali: nessuna posizione in classifica è acquistabile.
              </p>
            </div>
          </section>

          <section aria-labelledby="dove" className="mt-10">
            <h2 id="dove" className="font-serif text-2xl font-bold text-ink">
              Dove vedere il metodo applicato
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {withTables.slice(0, 6).map((a) => (
                <li key={a.slug}>
                  <Link
                    to={articleUrl(a)}
                    className="text-[15px] font-medium text-brand hover:underline"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-neutral-600">
              Tutte le classifiche sono raccolte nell’hub{' '}
              <Link to="/guide" className="font-medium text-brand underline">
                Guide e Classifiche
              </Link>
              . Se trovi un dato che non torna,{' '}
              <Link to="/contatti" className="font-medium text-brand underline">
                segnalacelo
              </Link>
              : le correzioni vengono pubblicate.
            </p>
          </section>
        </article>
      </div>
    </>
  );
}

export const METODOLOGIA_URL = absoluteUrl('/metodologia');
