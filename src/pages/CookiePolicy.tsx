import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { breadcrumbLd } from '@/lib/seo';

const LAST_UPDATE = '21 luglio 2026';

export default function CookiePolicy() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Cookie Policy', path: '/cookie-policy' },
  ];

  return (
    <>
      <SeoHead
        title="Cookie Policy"
        description="Cookie Policy di Edilizia 24 Ore: cosa sono i cookie, categorie utilizzate (tecnici, analytics, marketing), terze parti e come gestire o revocare il consenso."
        canonical={`${SITE_URL}/cookie-policy`}
        jsonLd={[breadcrumbLd(crumbs)]}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs crumbs={crumbs} />

        <article>
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">Cookie Policy</h1>
          <p className="mt-2 text-sm text-neutral-500">Ultimo aggiornamento: {LAST_UPDATE}</p>

          <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-neutral-800">
            <h2 className="pt-2 font-serif text-xl font-bold text-ink sm:text-2xl">
              1. Cosa sono i cookie
            </h2>
            <p>
              I cookie sono piccoli file di testo che i siti visitati inviano al dispositivo
              dell'utente, dove vengono memorizzati per essere ritrasmessi agli stessi siti alla
              visita successiva. Possono essere di prima parte (installati da questo sito) o di
              terze parti (installati da domini diversi, ad esempio fornitori di analytics o
              pubblicità).
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              2. Categorie di cookie utilizzati
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-ink">
                    <th className="py-2 pr-3 font-semibold text-ink">Categoria</th>
                    <th className="py-2 pr-3 font-semibold text-ink">Finalità</th>
                    <th className="py-2 pr-3 font-semibold text-ink">Esempi</th>
                    <th className="py-2 font-semibold text-ink">Base giuridica</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-neutral-200 align-top">
                    <td className="py-3 pr-3 font-medium text-ink">Tecnici / necessari</td>
                    <td className="py-3 pr-3">
                      Navigazione, sicurezza, memorizzazione delle preferenze di consenso.
                    </td>
                    <td className="py-3 pr-3">Cookie di sessione, preferenza consenso</td>
                    <td className="py-3">Legittimo interesse — non richiedono consenso</td>
                  </tr>
                  <tr className="border-b border-neutral-200 align-top">
                    <td className="py-3 pr-3 font-medium text-ink">Analytics</td>
                    <td className="py-3 pr-3">
                      Statistiche di utilizzo in forma anonima/aggregata per migliorare contenuti e
                      performance.
                    </td>
                    <td className="py-3 pr-3">Google Analytics (es. _ga, _gid)</td>
                    <td className="py-3">Consenso</td>
                  </tr>
                  <tr className="align-top">
                    <td className="py-3 pr-3 font-medium text-ink">Marketing / profilazione</td>
                    <td className="py-3 pr-3">
                      Pubblicità personalizzata, remarketing e misurazione delle campagne.
                    </td>
                    <td className="py-3 pr-3">Google AdSense (es. IDE, NID)</td>
                    <td className="py-3">Consenso</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              3. Gestione del consenso
            </h2>
            <p>
              Al primo accesso il sito mostra un banner che consente di accettare tutti i cookie,
              rifiutare quelli non necessari o personalizzare le preferenze per categoria. La scelta
              viene memorizzata sul dispositivo e può essere modificata in qualsiasi momento dal link{' '}
              <strong>«Gestione cookie»</strong> presente nel footer di ogni pagina: selezionandolo,
              il consenso precedente viene cancellato e il banner viene mostrato di nuovo.
            </p>
            <p>
              È inoltre possibile gestire o eliminare i cookie dalle impostazioni del browser:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>Chrome: Impostazioni → Privacy e sicurezza → Cookie</li>
              <li>Safari: Preferenze → Privacy → Gestione dati siti web</li>
              <li>Firefox: Impostazioni → Privacy e sicurezza → Cookie e dati dei siti web</li>
              <li>Edge: Impostazioni → Cookie e autorizzazioni del sito</li>
            </ul>
            <p>
              La disattivazione dei cookie tecnici può compromettere alcune funzionalità del sito.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              4. Cookie di terze parti
            </h2>
            <p>
              Previo consenso, il sito può utilizzare servizi di terze parti che installano cookie
              propri:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Google Analytics</strong> (Google Ireland Ltd.): statistiche di utilizzo del
                sito con IP anonimizzato. Privacy policy: policies.google.com/privacy. Opt-out:
                tools.google.com/dlpage/gaoptout.
              </li>
              <li>
                <strong>Google AdSense</strong> (Google Ireland Ltd.): erogazione di annunci
                pubblicitari, eventualmente personalizzati. Gestione delle preferenze:
                adssettings.google.com.
              </li>
            </ul>
            <p>
              Le terze parti agiscono come autonomi titolari o come responsabili del trattamento, a
              seconda del servizio: si rimanda alle rispettive informative per i dettagli.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              5. Aggiornamenti
            </h2>
            <p>
              La presente Cookie Policy può essere aggiornata in seguito a modifiche tecniche o
              normative: la versione vigente è quella pubblicata in questa pagina con la data di
              ultimo aggiornamento. Per maggiori informazioni sul trattamento dei dati personali
              consulta la{' '}
              <a href="/privacy-policy" className="font-medium text-brand underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
