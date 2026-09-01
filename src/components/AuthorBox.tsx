import { Link } from 'react-router';

interface Props {
  name: string;
}

/**
 * Editorial accountability box.
 *
 * Articles carry a collective byline, so instead of a fabricated author
 * profile this points readers at the two pages that actually answer "who
 * wrote this and how": the newsroom page and the ranking methodology.
 */
export default function AuthorBox({ name }: Props) {
  return (
    <section
      aria-label="Chi ha scritto questo articolo"
      className="mt-12 flex items-start gap-4 rounded-md border border-neutral-200 bg-neutral-50 p-5"
    >
      <div
        aria-hidden="true"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-sm font-bold text-white"
      >
        24
      </div>
      <div>
        <h2 className="font-serif text-lg font-bold text-ink">{name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Gli articoli sono redatti a partire da fonti ufficiali, schede tecniche dei produttori
          e rilevazioni di prezzo, e aggiornati quando cambiano norme o condizioni di mercato.
          Le fonti sono citate nel testo.
        </p>
        <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-brand">
          <Link to="/chi-siamo" className="hover:underline">
            Chi siamo e come lavoriamo →
          </Link>
          <Link to="/metodologia" className="hover:underline">
            Metodologia delle classifiche →
          </Link>
        </p>
      </div>
    </section>
  );
}
