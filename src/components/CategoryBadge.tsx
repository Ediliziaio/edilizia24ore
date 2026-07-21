import type { ArticleCategory, NewsSubcategory } from '@/data/types';
import { CATEGORY_LABELS } from '@/data/types';

interface Props {
  category: ArticleCategory;
  subcategory?: NewsSubcategory;
  size?: 'sm' | 'md';
}

const CATEGORY_STYLES: Record<ArticleCategory, string> = {
  'top-10': 'bg-brand text-white',
  'top-5': 'bg-ink text-white',
  news: 'bg-neutral-100 text-ink ring-1 ring-inset ring-neutral-300',
};

const SUBCATEGORY_STYLES: Partial<Record<NewsSubcategory, string>> = {
  'Bonus & Fisco': 'bg-emerald-700 text-white',
  Normative: 'bg-slate-700 text-white',
  Mercato: 'bg-blue-800 text-white',
  Innovazione: 'bg-violet-700 text-white',
  Sostenibilità: 'bg-lime-700 text-white',
};

export default function CategoryBadge({ category, subcategory, size = 'sm' }: Props) {
  const base = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';
  const label = CATEGORY_LABELS[category];

  if (category === 'news' && subcategory) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider ${base} ${
          SUBCATEGORY_STYLES[subcategory] ?? CATEGORY_STYLES.news
        }`}
      >
        <span className="opacity-80">{label}</span>
        <span aria-hidden="true">·</span>
        <span>{subcategory}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-semibold uppercase tracking-wider ${base} ${CATEGORY_STYLES[category]}`}>
      {label}
    </span>
  );
}
