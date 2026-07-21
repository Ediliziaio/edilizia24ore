export default function TopBar() {
  const today = new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="border-b border-neutral-200 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] tracking-wide sm:text-xs">
        <time dateTime={new Date().toISOString().slice(0, 10)} className="capitalize text-neutral-300">
          {today}
        </time>
        <p className="hidden text-neutral-400 sm:block">
          Il portale dell'edilizia italiana — news, bonus, normative e guide
        </p>
        <span className="font-semibold text-brand" aria-hidden="true">
          ● IN AGGIORNAMENTO
        </span>
      </div>
    </div>
  );
}
