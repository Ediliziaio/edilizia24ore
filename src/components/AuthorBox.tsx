interface Props {
  name: string;
  role: string;
}

export default function AuthorBox({ name, role }: Props) {
  const initials = name
    .replace(/^(Ing\.|Dott\.|Dott\.ssa|Arch\.|Geom\.|Avv\.)\s*/i, '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <section
      aria-label="Informazioni sull'autore"
      className="mt-12 flex items-start gap-4 rounded-md border border-neutral-200 bg-neutral-50 p-5"
    >
      <div
        aria-hidden="true"
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-lg font-bold text-white"
      >
        {initials}
      </div>
      <div>
        <h2 className="font-serif text-lg font-bold text-ink">{name}</h2>
        <p className="text-sm font-medium text-brand">{role}</p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Giornalista della redazione di Edilizia 24 Ore. Ogni articolo è verificato prima della
          pubblicazione e aggiornato in caso di novità normative o di mercato.
        </p>
      </div>
    </section>
  );
}
