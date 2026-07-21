import { Link } from 'react-router';
import type { Article } from '@/data/types';
import { articleUrl, formatDateIT } from '@/lib/seo';
import CategoryBadge from './CategoryBadge';
import ArticleVisual from './ArticleVisual';

interface Props {
  article: Article;
  /** compact = senza excerpt, per sidebar e liste strette */
  variant?: 'default' | 'compact' | 'horizontal';
}

export default function ArticleCard({ article, variant = 'default' }: Props) {
  if (variant === 'compact') {
    return (
      <article className="group border-b border-neutral-200 py-3 last:border-b-0">
        <Link to={articleUrl(article)} className="block">
          <h3 className="font-serif text-[15px] font-bold leading-snug text-ink group-hover:text-brand">
            {article.title}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-neutral-500">
          <time dateTime={article.publishedAt}>{formatDateIT(article.publishedAt)}</time>
          {' · '}
          {article.readingTime} min di lettura
        </p>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4 border-b border-neutral-200 py-5 last:border-b-0">
        <Link
          to={articleUrl(article)}
          className="w-28 shrink-0 overflow-hidden sm:w-40"
          aria-label={`Leggi: ${article.title}`}
          tabIndex={-1}
        >
          <ArticleVisual article={article} className="aspect-[4/3] h-full w-full" />
        </Link>
        <div className="min-w-0">
          <CategoryBadge category={article.category} subcategory={article.subcategory} />
          <Link to={articleUrl(article)} className="mt-2 block">
            <h3 className="font-serif text-lg font-bold leading-snug text-ink group-hover:text-brand sm:text-xl">
              {article.title}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{article.excerpt}</p>
          <p className="mt-2 text-xs text-neutral-500">
            <time dateTime={article.publishedAt}>{formatDateIT(article.publishedAt)}</time>
            {' · '}
            {article.readingTime} min di lettura
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-neutral-200 bg-white transition-shadow hover:shadow-md">
      <Link to={articleUrl(article)} aria-label={`Leggi: ${article.title}`} tabIndex={-1}>
        <ArticleVisual article={article} className="aspect-[16/9] w-full" />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <CategoryBadge category={article.category} subcategory={article.subcategory} />
        <Link to={articleUrl(article)} className="mt-2 block">
          <h3 className="font-serif text-lg font-bold leading-snug text-ink group-hover:text-brand">
            {article.title}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-600">
          {article.excerpt}
        </p>
        <p className="mt-3 border-t border-neutral-100 pt-2 text-xs text-neutral-500">
          <time dateTime={article.publishedAt}>{formatDateIT(article.publishedAt)}</time>
          {' · '}
          {article.readingTime} min di lettura
        </p>
      </div>
    </article>
  );
}
