import type { Article } from '@/data/types';

interface Props {
  article: Article;
  className?: string;
  /**
   * Article-page hero only: load eagerly with high fetch priority (LCP).
   * Everywhere else the image is lazy-loaded.
   */
  priority?: boolean;
}

const CATEGORY_COLORS: Record<Article['category'], { bg: string; accent: string }> = {
  'top-10': { bg: '#E30613', accent: '#8F0410' },
  'top-5': { bg: '#111111', accent: '#3a3a3a' },
  news: { bg: '#2b2b2b', accent: '#E30613' },
};

const CATEGORY_PATTERNS: Record<Article['category'], string> = {
  'top-10': 'M0 20 L20 0 M-5 5 L5 -5 M15 25 L25 15',
  'top-5': 'M0 0 L20 20 M20 0 L0 20',
  news: 'M0 10 H20',
};

/**
 * Editorial hero visual: renders the real article image when available
 * (1200x675, width/height set to avoid CLS), otherwise falls back to a
 * fast CSS/SVG placeholder coloured by category.
 */
export default function ArticleVisual({ article, className = '', priority = false }: Props) {
  if (article.image) {
    return (
      <img
        src={article.image.src}
        alt={article.image.alt}
        width={1200}
        height={675}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchPriority: 'high' as const } : {})}
        decoding={priority ? 'sync' : 'async'}
        className={`object-cover ${className}`}
      />
    );
  }

  const colors = CATEGORY_COLORS[article.category];
  const pattern = CATEGORY_PATTERNS[article.category];
  const id = `pat-${article.slug}`;

  return (
    <svg
      viewBox="0 0 160 90"
      className={className}
      role="img"
      aria-label={`Immagine di categoria: ${article.category === 'news' ? `News — ${article.subcategory ?? ''}` : article.category.toUpperCase().replace('-', ' ')}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d={pattern} stroke={colors.accent} strokeWidth="1.5" fill="none" opacity="0.35" />
        </pattern>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colors.bg} />
          <stop offset="100%" stopColor={colors.accent} />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill={`url(#grad-${id})`} />
      <rect width="160" height="90" fill={`url(#${id})`} />
      <rect x="0" y="78" width="160" height="12" fill="rgba(0,0,0,0.35)" />
      <text
        x="8"
        y="87"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        fontSize="7.5"
        fill="#ffffff"
        letterSpacing="1"
      >
        {article.category === 'news'
          ? (article.subcategory ?? 'NEWS').toUpperCase()
          : article.category.toUpperCase().replace('-', ' ')}
      </text>
      <text x="150" y="87" fontFamily="Georgia, serif" fontWeight="bold" fontSize="7" fill="#E30613" textAnchor="end">
        24
      </text>
    </svg>
  );
}
