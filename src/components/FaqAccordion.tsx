import { useState } from 'react';
import type { FaqItem } from '@/data/types';

interface Props {
  faq: FaqItem[];
}

export default function FaqAccordion({ faq }: Props) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-heading" className="mt-12">
      <h2 id="faq-heading" className="mb-4 font-serif text-2xl font-bold text-ink">
        Domande frequenti
      </h2>
      <div className="divide-y divide-neutral-200 rounded-md border border-neutral-200">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={i}>
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  id={`faq-button-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left font-semibold text-ink hover:bg-neutral-50 sm:px-5"
                >
                  <span>{item.q}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    aria-hidden="true"
                    className={`shrink-0 text-brand transition-transform ${isOpen ? 'rotate-45' : ''}`}
                  >
                    <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </h3>
              {isOpen && (
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-labelledby={`faq-button-${i}`}
                  className="px-4 pb-5 text-[15px] leading-relaxed text-neutral-700 sm:px-5"
                >
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
