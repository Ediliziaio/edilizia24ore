interface Props {
  /** stable slot identifier, used as data-ad-slot for real ad code replacement */
  id: string;
  format: 'leaderboard' | 'sidebar' | 'in-article';
  className?: string;
  sticky?: boolean;
}

/**
 * Ad inventory switch.
 *
 * While this is false every slot renders nothing: empty dashed "Pubblicità"
 * frames (3-4 per page) read as an unfinished site to both readers and quality
 * algorithms, which is the last thing a domain still fighting for indexation
 * needs. Set it to true once real creatives or an AdSense unit are wired in —
 * the ten insertion points across the site stay exactly where they are.
 */
const AD_INVENTORY_ENABLED = false;

const FORMATS = {
  leaderboard: { label: 'Leaderboard', w: 970, h: 250 },
  sidebar: { label: 'Half Page', w: 300, h: 600 },
  'in-article': { label: 'In-Article', w: 336, h: 280 },
} as const;

export default function AdSlot({ id, format, className = '', sticky = false }: Props) {
  if (!AD_INVENTORY_ENABLED) return null;

  const f = FORMATS[format];
  return (
    <aside
      className={`${sticky ? 'sticky top-24 ' : ''}${className}`}
      aria-label="Spazio pubblicitario"
    >
      <div
        data-ad-slot={id}
        data-ad-format={format}
        data-ad-width={f.w}
        data-ad-height={f.h}
        className="mx-auto flex items-center justify-center rounded-sm border-2 border-dashed border-neutral-300 bg-neutral-50"
        style={{ maxWidth: f.w, width: '100%', minHeight: Math.min(f.h, 120), aspectRatio: `${f.w} / ${f.h}` }}
      >
        <div className="text-center">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Pubblicità
          </span>
          <span className="mt-1 block text-xs text-neutral-400">
            {f.label} {f.w}×{f.h}
          </span>
        </div>
      </div>
    </aside>
  );
}
