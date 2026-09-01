import { useEffect, useState } from 'react';

/** Build day (YYYY-MM-DD), injected by Vite — see `define` in vite.config.ts. */
declare const __BUILD_DAY__: string;

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);

export default function TopBar() {
  /**
   * The page is prerendered, so the HTML ships with the build day. To refresh
   * it for the visitor the first client render must produce EXACTLY what the
   * server produced — otherwise React keeps the server text and the effect's
   * update is a no-op against an identical internal value, which is why an
   * earlier attempt using suppressHydrationWarning silently did nothing.
   * Both sides therefore start from the build day; the effect then swaps in
   * the visitor's real date, which is a genuine change and patches the DOM.
   */
  const [today, setToday] = useState(() => new Date(`${__BUILD_DAY__}T12:00:00`));

  useEffect(() => {
    setToday(new Date());
  }, []);

  return (
    <div className="border-b border-neutral-200 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] tracking-wide sm:text-xs">
        <time dateTime={today.toISOString().slice(0, 10)} className="capitalize text-neutral-300">
          {formatDate(today)}
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
