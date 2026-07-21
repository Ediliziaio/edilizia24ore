interface Props {
  /** stable slot identifier, used as data-ad-slot for real ad code replacement */
  id: string;
  format: 'leaderboard' | 'sidebar' | 'in-article';
  className?: string;
  sticky?: boolean;
}

const FORMATS = {
  leaderboard: { label: 'Leaderboard', w: 970, h: 250 },
  sidebar: { label: 'Half Page', w: 300, h: 600 },
  'in-article': { label: 'In-Article', w: 336, h: 280 },
} as const;

export default function AdSlot({ id, format, className = '', sticky = false }: Props) {
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
