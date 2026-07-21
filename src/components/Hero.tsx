import { Link } from 'react-router';
import type { Article } from '@/data/types';
import { articleUrl, formatDateIT } from '@/lib/seo';
import CategoryBadge from './CategoryBadge';
import ArticleVisual from './ArticleVisual';

interface Props {
  featured: Article;
  secondary: Article[];
}

export default function Hero({ featured, secondary }: Props) {
  return (
    <section aria-label="Articoli in primo piano" className="grid gap-6 lg:grid-cols-5">
      {/* Featured */}
      <article className="group relative overflow-hidden rounded-md lg:col-span-3">
        <Link to={articleUrl(featured)} aria-label={`Leggi l'articolo: ${featured.title}`}>
          <ArticleVisual article={featured} priority className="aspect-[16/9] w-full lg:aspect-auto lg:h-full lg:min-h-[380px]" />
          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 sm:p-7">
            <CategoryBadge category={featured.category} subcategory={featured.subcategory} />
            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {featured.h1 ?? featured.title}
            </h2>
            <p className="mt-2 hidden max-w-2xl text-sm text-neutral-200 sm:line-clamp-2">
              {featured.excerpt}
            </p>
            <p className="mt-3 text-xs text-neutral-300">
              Di {featured.author.name} ·{' '}
              <time dateTime={featured.publishedAt}>{formatDateIT(featured.publishedAt)}</time>
            </p>
          </div>
        </Link>
      </article>

      {/* Secondary stack */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        {secondary.map((a) => (
          <article key={a.slug} className="group flex flex-1 gap-4">
            <Link
              to={articleUrl(a)}
              className="w-32 shrink-0 overflow-hidden rounded sm:w-36"
              aria-label={`Leggi: ${a.title}`}
              tabIndex={-1}
            >
              <ArticleVisual article={a} className="aspect-[4/3] h-full w-full" />
            </Link>
            <div className="min-w-0">
              <CategoryBadge category={a.category} subcategory={a.subcategory} />
              <Link to={articleUrl(a)} className="mt-1.5 block">
                <h3 className="font-serif text-base font-bold leading-snug text-ink group-hover:text-brand sm:text-lg">
                  {a.title}
                </h3>
              </Link>
              <p className="mt-1 text-xs text-neutral-500">
                <time dateTime={a.publishedAt}>{formatDateIT(a.publishedAt)}</time>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
