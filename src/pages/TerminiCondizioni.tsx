import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import { SITE_URL } from '@/data/types';
import { breadcrumbLd } from '@/lib/seo';

const LAST_UPDATE = '21 luglio 2026';

export default function TerminiCondizioni() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Termini e Condizioni', path: '/termini-e-condizioni' },
  ];

  return (
    <>
      <SeoHead
        title="Termini e Condizioni"
        description="Termini e condizioni d'uso di Edilizia 24 Ore: oggetto del servizio, proprietà intellettuale, limitazione di responsabilità, link esterni e legge applicabile."
        canonical={`${SITE_URL}/termini-e-condizioni`}
        jsonLd={[breadcrumbLd(crumbs)]}
      />

      <div className="mx-auto max-w-3xl px-4 py-10">
        <Breadcrumbs crumbs={crumbs} />

        <article>
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Termini e Condizioni d'uso
          </h1>
          <p className="mt-2 text-sm text-neutral-500">Ultimo aggiornamento: {LAST_UPDATE}</p>

          <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-neutral-800">
            <h2 className="pt-2 font-serif text-xl font-bold text-ink sm:text-2xl">
              1. Oggetto
            </h2>
            <p>
              I presenti termini regolano l'accesso e l'utilizzo del sito Edilizia 24 Ore
              (di seguito «il Sito»), magazine online dedicato a costruzioni, bonus edilizi,
              normative, mercato immobiliare e innovazione di settore, pubblicato da{' '}
              <strong>Domus Group S.r.l.</strong>, P.IVA <strong>13132010961</strong>. Utilizzando il Sito
              l'utente accetta integralmente i presenti termini; in caso contrario è invitato a non
              proseguire nella navigazione.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              2. Proprietà intellettuale
            </h2>
            <p>
              Testi, articoli, classifiche, grafiche, loghi e ogni altro contenuto del Sito sono di
              proprietà del titolare o dei rispettivi autori e sono protetti dalla normativa sul
              diritto d'autore. È consentita la citazione di brevi estratti con indicazione della
              fonte e link all'articolo originale; ogni altra riproduzione, anche parziale, richiede
              preventiva autorizzazione scritta.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              3. Limitazione di responsabilità
            </h2>
            <p>
              I contenuti del Sito hanno scopo esclusivamente informativo e divulgativo. In
              particolare, gli articoli dedicati a bonus edilizi, agevolazioni fiscali, normative
              tecniche e pratiche edilizie{' '}
              <strong>
                non costituiscono consulenza tecnica, fiscale, legale o professionale
              </strong>
              : la normativa cambia con frequenza e l'applicazione al caso concreto dipende dalla
              situazione specifica di ciascun utente.
            </p>
            <p>
              Prima di avviare lavori, richiedere agevolazioni o assumere decisioni con effetti
              economici o fiscali, l'utente è tenuto a verificare le fonti ufficiali e a rivolgersi a
              professionisti abilitati (tecnici, commercialisti, avvocati). Il titolare non risponde
              di eventuali danni diretti o indiretti derivanti dall'uso delle informazioni pubblicate,
              né di errori, omissioni o ritardi di aggiornamento.
            </p>
            <p>
              Le classifiche e le selezioni di prodotti pubblicate sul Sito riflettono criteri
              editoriali dichiarati e possono contenere link commerciali: non costituiscono
              certificazioni tecniche né garanzie sui prodotti o sui servizi citati.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              4. Link esterni
            </h2>
            <p>
              Il Sito può contenere link a siti di terze parti (enti, produttori, servizi esterni).
              Il titolare non controlla e non risponde dei contenuti, delle informative privacy e
              delle pratiche dei siti collegati, ai quali si applicano i rispettivi termini d'uso.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              5. Modifiche al servizio e ai termini
            </h2>
            <p>
              Il titolare può sospendere, modificare o interrompere il Sito, in tutto o in parte, e
              aggiornare i presenti termini in qualsiasi momento. La versione vigente è quella
              pubblicata in questa pagina con la data di ultimo aggiornamento.
            </p>

            <h2 className="pt-4 font-serif text-xl font-bold text-ink sm:text-2xl">
              6. Legge applicabile e foro competente
            </h2>
            <p>
              I presenti termini sono regolati dalla legge italiana. Per ogni controversia relativa
              all'uso del Sito è competente il foro del consumatore, ove applicabile; in tutti gli
              altri casi, il foro di <strong>Milano</strong>, salvo diversa
              previsione inderogabile di legge.
            </p>
          </div>
        </article>
      </div>
    </>
  );
}
