interface Props {
  /** stable slot identifier, kept as data-ad-slot for future ad-server swaps */
  id: string;
  format: 'leaderboard' | 'sidebar' | 'in-article';
  className?: string;
  sticky?: boolean;
}

/**
 * Ad inventory switch. Flip to false to blank every slot at once (an empty
 * placeholder frame reads as an unfinished site, so slots render nothing
 * rather than a dashed box when there is no campaign to serve).
 */
const AD_INVENTORY_ENABLED = true;

/**
 * House campaign. Links out to an advertiser, so every anchor carries
 * rel="sponsored": paid/promotional links must be declared to Google or they
 * count as a link scheme, which is the last thing this domain needs while it
 * is still fighting for indexation.
 */
const CAMPAIGN = {
  advertiser: 'EdiliziaInCloud',
  href: 'https://www.ediliziaincloud.com/',
  alt: "EdiliziaInCloud, il gestionale con AI per l'edilizia: aumenta margini, utili e guadagni. Prova gratuita di 31 giorni.",
};

/**
 * One creative per placement, sized to the slot's real aspect ratio so nothing
 * is cropped. width/height are the intrinsic pixels: they let the browser
 * reserve the box before load (no CLS).
 */
const CREATIVES = {
  leaderboard: {
    // Wide strip on desktop, taller cut on mobile where 10.78:1 would be unreadable.
    mobile: { src: '/images/ads/eic-leaderboard-mobile.jpg', w: 1200, h: 498 },
    desktop: { src: '/images/ads/eic-leaderboard-wide.jpg', w: 1940, h: 180 },
    maxWidth: 1200,
  },
  sidebar: {
    mobile: { src: '/images/ads/eic-sidebar.jpg', w: 700, h: 583 },
    desktop: null,
    maxWidth: 300,
  },
  'in-article': {
    mobile: { src: '/images/ads/eic-in-article.jpg', w: 900, h: 654 },
    desktop: null,
    maxWidth: 500,
  },
} as const;

export default function AdSlot({ id, format, className = '', sticky = false }: Props) {
  if (!AD_INVENTORY_ENABLED) return null;

  const c = CREATIVES[format];

  return (
    <aside
      className={`${sticky ? 'sticky top-24 ' : ''}${className}`}
      aria-label={`Pubblicità: ${CAMPAIGN.advertiser}`}
      data-ad-slot={id}
      data-ad-format={format}
    >
      <div className="mx-auto" style={{ maxWidth: c.maxWidth }}>
        {/* Advertising must stay visually recognisable as such. */}
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
          Pubblicità
        </span>
        <a
          href={CAMPAIGN.href}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="block overflow-hidden rounded-sm ring-1 ring-neutral-200 transition-opacity hover:opacity-90"
        >
          <picture>
            {c.desktop && (
              <source
                media="(min-width: 768px)"
                srcSet={c.desktop.src}
                width={c.desktop.w}
                height={c.desktop.h}
              />
            )}
            <img
              src={c.mobile.src}
              alt={CAMPAIGN.alt}
              width={c.mobile.w}
              height={c.mobile.h}
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </picture>
        </a>
      </div>
    </aside>
  );
}
