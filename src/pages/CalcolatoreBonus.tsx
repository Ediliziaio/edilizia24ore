import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { absoluteUrl, breadcrumbLd, publisherOrganizationLd } from '@/lib/seo';

/**
 * Bonus simulator.
 *
 * Aliquote, massimali e regole vengono dall'articolo pubblicato su questo sito
 * ("Bonus edilizi 2026: i 5 incentivi attivi e come usarli"): 50% sull'abitazione
 * principale, 36% sulle altre unità, massimale 96.000 euro per il Bonus
 * ristrutturazioni e l'Ecobonus, 5.000 euro per il Bonus mobili, Conto Termico
 * 3.0 erogato dal GSE e indipendente dalla destinazione d'uso.
 *
 * Il simulatore stima una detrazione: non è una consulenza fiscale, e i casi
 * particolari (condominio, immobili vincolati, capienza IRPEF) restano fuori.
 */

type Intervento =
  | 'ristrutturazione'
  | 'efficientamento'
  | 'antisismico'
  | 'generatore'
  | 'arredi';

interface Esito {
  nome: string;
  aliquota: number | null;
  massimale: number;
  spesaAmmessa: number;
  beneficio: number;
  rate: number;
  nota: string;
  fiscale: boolean;
}

const INTERVENTI: { value: Intervento; label: string }[] = [
  { value: 'ristrutturazione', label: 'Ristrutturazione (opere edili, bagno, impianti)' },
  { value: 'efficientamento', label: 'Efficientamento energetico (cappotto, infissi, serramenti)' },
  { value: 'antisismico', label: 'Interventi antisismici' },
  { value: 'generatore', label: 'Sostituzione del generatore di calore (caldaia, pompa di calore)' },
  { value: 'arredi', label: 'Arredi ed elettrodomestici dopo una ristrutturazione' },
];

const MASSIMALE_ORDINARIO = 96_000;
const MASSIMALE_MOBILI = 5_000;
const RATE_ANNUALI = 10;

const eur = (n: number) =>
  n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: true });

function calcola(intervento: Intervento, principale: boolean, spesa: number): Esito[] {
  const aliquota = principale ? 0.5 : 0.36;
  const esiti: Esito[] = [];

  const detrazioneOrdinaria = (nome: string, massimale: number, nota: string): Esito => {
    const spesaAmmessa = Math.min(spesa, massimale);
    return {
      nome,
      aliquota,
      massimale,
      spesaAmmessa,
      beneficio: spesaAmmessa * aliquota,
      rate: RATE_ANNUALI,
      nota,
      fiscale: true,
    };
  };

  if (intervento === 'ristrutturazione') {
    esiti.push(
      detrazioneOrdinaria(
        'Bonus ristrutturazioni',
        MASSIMALE_ORDINARIO,
        'La misura più ampia: copre le opere edili e gli impianti nell’ambito di una ristrutturazione.',
      ),
    );
  }

  if (intervento === 'efficientamento') {
    esiti.push(
      detrazioneOrdinaria(
        'Ecobonus',
        MASSIMALE_ORDINARIO,
        'Richiede il rispetto dei requisiti tecnici dell’intervento e la trasmissione della pratica ENEA.',
      ),
    );
    esiti.push(
      detrazioneOrdinaria(
        'Bonus ristrutturazioni',
        MASSIMALE_ORDINARIO,
        'Alternativa quando l’intervento rientra in una ristrutturazione più ampia: mai sulla stessa spesa.',
      ),
    );
  }

  if (intervento === 'antisismico') {
    esiti.push(
      detrazioneOrdinaria(
        'Sismabonus',
        MASSIMALE_ORDINARIO,
        'Le aliquote possono variare con la riduzione di classe di rischio certificata da un tecnico abilitato.',
      ),
    );
  }

  if (intervento === 'generatore') {
    esiti.push(
      detrazioneOrdinaria(
        'Ecobonus',
        MASSIMALE_ORDINARIO,
        'Detrazione fiscale in dichiarazione, recuperata in dieci quote annuali.',
      ),
    );
    esiti.push({
      nome: 'Conto Termico 3.0',
      aliquota: null,
      massimale: 0,
      spesaAmmessa: spesa,
      beneficio: 0,
      rate: 0,
      nota:
        'Non è una detrazione ma un contributo erogato dal GSE su domanda, in tempi brevi e indipendentemente dalla destinazione d’uso dell’immobile. L’importo dipende dalle tabelle GSE e dalla taglia dell’impianto: va verificato caso per caso. Spesso è l’alternativa più conveniente a chi ha poca capienza fiscale.',
      fiscale: false,
    });
  }

  if (intervento === 'arredi') {
    esiti.push(
      detrazioneOrdinaria(
        'Bonus mobili ed elettrodomestici',
        MASSIMALE_MOBILI,
        'Spetta solo se collegato a una ristrutturazione agevolata già avviata sullo stesso immobile.',
      ),
    );
  }

  return esiti;
}

export default function CalcolatoreBonus() {
  const [intervento, setIntervento] = useState<Intervento>('ristrutturazione');
  const [principale, setPrincipale] = useState(true);
  const [spesa, setSpesa] = useState(30_000);

  const esiti = useMemo(
    () => (spesa > 0 ? calcola(intervento, principale, spesa) : []),
    [intervento, principale, spesa],
  );

  const url = absoluteUrl('/calcolatore-bonus-edilizi');
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Calcolatore bonus edilizi', path: '/calcolatore-bonus-edilizi' },
  ];

  const appLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: 'Calcolatore bonus edilizi 2026',
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Qualsiasi browser web',
    inLanguage: 'it-IT',
    browserRequirements: 'Richiede JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    publisher: publisherOrganizationLd,
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quanto si detrae con il Bonus ristrutturazioni nel 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Il 50% della spesa sull’abitazione principale e il 36% sulle altre unità immobiliari, entro un massimale di 96.000 euro. La detrazione si recupera in dieci quote annuali di pari importo.',
        },
      },
      {
        '@type': 'Question',
        name: 'Si possono cumulare più bonus sullo stesso immobile?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Sì, ma mai sulla stessa spesa: ogni fattura può essere coperta da un solo incentivo. È possibile applicare bonus diversi a interventi diversi sullo stesso immobile, tenendo separate pratiche e contabilità.',
        },
      },
      {
        '@type': 'Question',
        name: 'Conviene il Conto Termico o la detrazione fiscale?',
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'Il Conto Termico 3.0 è un contributo erogato dal GSE in tempi brevi e non dipende dalla capienza fiscale: conviene a chi ha IRPEF insufficiente per assorbire dieci anni di detrazione. La detrazione conviene su importi elevati e a chi ha capienza.',
        },
      },
    ],
  };

  return (
    <>
      <SeoHead
        title="Calcolatore bonus edilizi 2026: quale ti spetta e quanto recuperi"
        description="Scegli l’intervento e la spesa prevista: scopri quale bonus edilizio 2026 ti spetta, con aliquota, massimale, detrazione totale e rata annua. Gratuito, senza registrazione."
        canonical={url}
        keywords={[
          'calcolatore bonus edilizi 2026',
          'quanto si detrae ristrutturazione',
          'bonus ristrutturazioni 50%',
          'ecobonus 2026',
          'conto termico 3.0',
        ]}
        jsonLd={[appLd, faqLd, breadcrumbLd(crumbs)]}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs crumbs={crumbs} />

        <article>
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Calcolatore bonus edilizi 2026: quale ti spetta e quanto recuperi
          </h1>
          <p className="mt-4 text-lg text-ink/80">
            Indica che lavori farai e quanto prevedi di spendere: lo strumento dice quale incentivo si
            applica, con aliquota, massimale, detrazione totale e rata annua.
          </p>

          <section className="mt-8 rounded-xl border border-ink/10 bg-neutral-50 p-5 sm:p-6">
            <h2 className="font-serif text-xl font-bold text-ink">La tua situazione</h2>

            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="intervento">
              Che lavori farai
            </label>
            <select
              id="intervento"
              className="mt-2 w-full rounded-lg border border-ink/15 bg-white px-3 py-3 text-base"
              value={intervento}
              onChange={(e) => setIntervento(e.target.value as Intervento)}
            >
              {INTERVENTI.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-semibold text-ink" htmlFor="spesa">
              Spesa prevista (€)
            </label>
            <input
              id="spesa"
              type="number"
              min={0}
              step={1000}
              inputMode="numeric"
              className="mt-2 w-full max-w-xs rounded-lg border border-ink/15 bg-white px-3 py-3 text-base"
              value={spesa}
              onChange={(e) => setSpesa(Number(e.target.value))}
            />

            <label className="mt-4 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={principale}
                onChange={(e) => setPrincipale(e.target.checked)}
              />
              È la mia abitazione principale
            </label>

            <div className="mt-6" aria-live="polite">
              {esiti.length === 0 ? (
                <p className="text-sm text-ink/60">Inserisci una spesa per vedere il calcolo.</p>
              ) : (
                <ul className="space-y-4">
                  {esiti.map((e) => (
                    <li key={e.nome} className="rounded-lg border border-ink/10 bg-white p-4">
                      <p className="font-semibold text-ink">
                        {e.nome}
                        {e.aliquota !== null && (
                          <span className="ml-2 text-sm font-normal text-ink/60">
                            aliquota {Math.round(e.aliquota * 100)}%
                          </span>
                        )}
                      </p>
                      {e.fiscale ? (
                        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                          <dt className="text-ink/60">Spesa ammessa</dt>
                          <dd className="text-right tabular-nums">{eur(e.spesaAmmessa)}</dd>
                          <dt className="text-ink/60">Massimale</dt>
                          <dd className="text-right tabular-nums">{eur(e.massimale)}</dd>
                          <dt className="text-ink/60">Detrazione totale</dt>
                          <dd className="text-right font-semibold tabular-nums">{eur(e.beneficio)}</dd>
                          <dt className="text-ink/60">Rata annua ({e.rate} anni)</dt>
                          <dd className="text-right tabular-nums">{eur(e.beneficio / e.rate)}</dd>
                        </dl>
                      ) : null}
                      <p className="mt-3 text-sm text-ink/70">{e.nota}</p>
                      {e.fiscale && spesa > e.massimale && (
                        <p className="mt-2 text-sm text-ink/70">
                          La spesa supera il massimale: l’eccedenza di {eur(spesa - e.massimale)} non
                          genera detrazione.
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <h2 className="mt-10 font-serif text-2xl font-bold text-ink">Le regole che fanno perdere il bonus</h2>
          <p className="mt-3 text-ink/80">
            Per tutte le detrazioni fiscali serve il <strong>bonifico parlante</strong>: causale che richiama
            la norma agevolativa, codice fiscale di chi detrae, partita IVA o codice fiscale di chi riceve il
            pagamento. Pagamenti in contanti o con carta non danno diritto alla detrazione. Il Conto Termico
            3.0 segue invece una procedura diversa, con domanda al GSE e contributo erogato direttamente.
          </p>
          <p className="mt-3 text-ink/80">
            I bonus <strong>non sono cumulabili sulla stessa spesa</strong>: ogni fattura può essere coperta da
            un solo incentivo. È però possibile applicare misure diverse a interventi diversi sullo stesso
            immobile — per esempio Ecobonus per il cappotto e Bonus ristrutturazioni per il bagno — tenendo
            separate pratiche e contabilità.
          </p>
          <p className="mt-3 text-ink/80">
            Le detrazioni ordinarie valgono per i bonifici effettuati entro il <strong>31 dicembre 2026</strong>:
            dal 2027 le aliquote sono previste in riduzione.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-bold text-ink">I limiti di questa stima</h2>
          <p className="mt-3 text-ink/80">
            Il calcolo applica aliquote e massimali ordinari a un caso singolo. Non tiene conto della{' '}
            <strong>capienza IRPEF</strong> — se l’imposta dovuta in un anno è inferiore alla rata, la parte
            eccedente si perde — né dei lavori condominiali, degli immobili vincolati, delle variazioni legate
            alla riduzione di classe sismica o degli importi effettivi del Conto Termico, che dipendono dalle
            tabelle GSE. Per la tua situazione specifica rivolgiti a un commercialista o a un tecnico
            abilitato.
          </p>

          <h2 className="mt-10 font-serif text-2xl font-bold text-ink">Approfondimenti</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-ink/80">
            <li>
              <Link className="text-brand hover:underline" to="/articolo/top-5-bonus-edilizi-2026">
                Bonus edilizi 2026: i 5 incentivi attivi e come usarli
              </Link>
            </li>
            <li>
              <Link className="text-brand hover:underline" to="/articolo/news-bonus-ristrutturazioni-50-2026">
                Bonus ristrutturazioni al 50% nel 2026
              </Link>
            </li>
            <li>
              <Link className="text-brand hover:underline" to="/articolo/news-conto-termico-3-0-incentivi-2026">
                Conto Termico 3.0: come funziona l’incentivo GSE
              </Link>
            </li>
            <li>
              <Link className="text-brand hover:underline" to="/metodologia">
                Come lavoriamo: metodo, fonti e limiti dichiarati
              </Link>
            </li>
          </ul>
        </article>
      </div>
    </>
  );
}
