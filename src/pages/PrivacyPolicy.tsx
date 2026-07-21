import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { breadcrumbLd } from '@/lib/seo';

const LAST_UPDATE = '21 luglio 2026';

export default function PrivacyPolicy() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ];

  return (
    <>
      <SeoHead
        title="Privacy Policy"
        description="Informativa privacy di Edilizia 24 Ore ai sensi del GDPR: titolare del trattamento, dati raccolti, finalità, basi giuridiche, cookie, newsletter e diritti degli interessati."
        canonical={`${SITE_URL}/privacy-policy`}
        jsonLd={[breadcrumbLd(crumbs)]}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs crumbs={crumbs} />

        <article>
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Ultimo aggiornamento: {LAST_UPDATE}
          </p>

          <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-neutral-800">
            <p>
              La presente informativa descrive le modalità di trattamento dei dati personali degli
              utenti che consultano il sito Edilizia 24 Ore, ai sensi del Regolamento (UE) 2016/679
              («GDPR») e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              1. Titolare del trattamento
            </h2>
            <p>
              Il titolare del trattamento è <strong>[Ragione Sociale]</strong>, P.IVA{' '}
              <strong>[P.IVA]</strong>, con sede legale in <strong>[Indirizzo sede legale]</strong>,
              contattabile all'indirizzo email <strong>[email titolare]</strong>.
            </p>
            <p>
              Responsabile della protezione dei dati (DPO), se nominato:{' '}
              <strong>[Nome DPO / email DPO]</strong>. In assenza di nomina, le richieste possono
              essere inviate direttamente al titolare ai recapiti sopra indicati.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              2. Tipologie di dati raccolti
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Dati di navigazione</strong>: indirizzo IP, tipo di browser, sistema
                operativo, pagine visitate, orari di accesso e altri parametri tecnici trasmessi
                automaticamente durante la navigazione.
              </li>
              <li>
                <strong>Dati forniti volontariamente</strong>: nome, indirizzo email e contenuto dei
                messaggi inviati tramite la pagina contatti; indirizzo email per l'iscrizione alla
                newsletter.
              </li>
              <li>
                <strong>Cookie e strumenti di tracciamento</strong>: per il dettaglio si rinvia alla{' '}
                <a href="/cookie-policy" className="font-medium text-brand underline">
                  Cookie Policy
                </a>
                .
              </li>
            </ul>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              3. Finalità e basi giuridiche del trattamento
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Funzionamento e sicurezza del sito</strong> (basi giuridiche: legittimo
                interesse del titolare, art. 6, par. 1, lett. f GDPR).
              </li>
              <li>
                <strong>Risposta alle richieste inviate tramite i contatti</strong> (esecuzione di
                misure precontrattuali, art. 6, par. 1, lett. b GDPR).
              </li>
              <li>
                <strong>Invio della newsletter</strong>, solo previa iscrizione (consenso, art. 6,
                par. 1, lett. a GDPR), revocabile in qualsiasi momento tramite il link di
                disiscrizione presente in ogni email.
              </li>
              <li>
                <strong>Statistiche di utilizzo e pubblicità</strong>, solo previo consenso espresso
                tramite il banner cookie (art. 6, par. 1, lett. a GDPR).
              </li>
              <li>
                <strong>Adempimento di obblighi di legge</strong> (art. 6, par. 1, lett. c GDPR).
              </li>
            </ul>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              4. Cookie
            </h2>
            <p>
              Il sito utilizza cookie tecnici e, previo consenso, cookie di analytics e di
              marketing. Le categorie, le terze parti coinvolte e le modalità per modificare o
              revocare il consenso sono descritte nella{' '}
              <a href="/cookie-policy" className="font-medium text-brand underline">
                Cookie Policy
              </a>
              .
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              5. Newsletter
            </h2>
            <p>
              L'iscrizione alla newsletter comporta il trattamento dell'indirizzo email esclusivamente
              per l'invio di aggiornamenti editoriali. Il consenso può essere revocato in ogni
              momento tramite il link «disiscriviti» in calce a ogni comunicazione: la revoca non
              pregiudica la liceità del trattamento precedente.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              6. Destinatari e trasferimenti dei dati
            </h2>
            <p>
              I dati possono essere trattati da fornitori di servizi tecnici (hosting, manutenzione,
              invio email, analytics e advertising) nominati, ove applicabile, responsabili del
              trattamento ai sensi dell'art. 28 GDPR. Alcuni fornitori possono trattare dati al di
              fuori dello Spazio Economico Europeo: in tal caso il trasferimento avviene nel rispetto
              degli artt. 44 ss. GDPR (decisioni di adeguatezza o clausole contrattuali standard).
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              7. Tempi di conservazione
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Dati di navigazione</strong>: per il tempo strettamente necessario alle
                finalità tecniche e, comunque, secondo i termini indicati nella Cookie Policy.
              </li>
              <li>
                <strong>Richieste di contatto</strong>: per il tempo necessario a gestire la
                richiesta e, al massimo, per 24 mesi.
              </li>
              <li>
                <strong>Newsletter</strong>: fino alla revoca del consenso (disiscrizione).
              </li>
              <li>
                <strong>Obblighi di legge</strong>: per i termini previsti dalle norme applicabili.
              </li>
            </ul>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              8. Diritti degli interessati (artt. 15–22 GDPR)
            </h2>
            <p>
              In qualità di interessato, hai diritto di: accedere ai tuoi dati (art. 15), ottenerne
              la rettifica (art. 16) o la cancellazione (art. 17), chiedere la limitazione del
              trattamento (art. 18), ricevere i dati in formato portabile (art. 20), opporti al
              trattamento (art. 21) e non essere sottoposto a decisioni automatizzate (art. 22). Puoi
              inoltre revocare il consenso in qualsiasi momento e proporre reclamo al Garante per la
              protezione dei dati personali (www.garanteprivacy.it).
            </p>
            <p>
              Per esercitare i diritti scrivi a <strong>[email titolare]</strong>: risponderemo entro
              un mese dalla richiesta, termine prorogabile nei casi previsti dal GDPR.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              9. Modifiche alla presente informativa
            </h2>
            <p>
              Il titolare può aggiornare questa informativa in qualsiasi momento: la versione vigente
              è quella pubblicata in questa pagina con l'indicazione della data di ultimo
              aggiornamento.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
