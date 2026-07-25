import { useEffect, useState } from 'react';

const formatDate = (d: Date) =>
  new Intl.DateTimeFormat('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);

export default function TopBar() {
  // The page is statically prerendered, so the build-time date is frozen into
  // the HTML. Update to the visitor's real current date after hydration.
  // suppressHydrationWarning avoids a mismatch when build date !== today.
  const [today, setToday] = useState(() => new Date());
  useEffect(() => {
    setToday(new Date());
  }, []);

  return (
    <div className="border-b border-neutral-200 bg-ink text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 text-[11px] tracking-wide sm:text-xs">
        <time
          dateTime={today.toISOString().slice(0, 10)}
          suppressHydrationWarning
          className="capitalize text-neutral-300"
        >
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
