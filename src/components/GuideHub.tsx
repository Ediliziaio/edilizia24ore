import { useMemo } from 'react';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import SectionHeading from '@/components/SectionHeading';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import { getByCategory } from '@/data/articles';
import { GUIDE_DESCRIPTION, GUIDE_H1 } from '@/data/types';
import { absoluteUrl, articleUrl, breadcrumbLd } from '@/lib/seo';

const CRUMBS = [
  { name: 'Home', path: '/' },
  { name: 'Guide e Classifiche', path: '/guide' },
];

/**
 * "Guide e Classifiche" hub: lists all Top 10 and Top 5 articles in two sections.
 * Rendered at /guide and at the legacy /categoria/top-10 and /categoria/top-5
 * URLs (canonical always points to /guide, so old links never 404).
 */
export default function GuideHub() {
  const top10 = useMemo(() => getByCategory('top-10'), []);
  const top5 = useMemo(() => getByCategory('top-5'), []);

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: GUIDE_H1,
        description: GUIDE_DESCRIPTION,
        url: absoluteUrl('/guide'),
        inLanguage: 'it-IT',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: [...top10, ...top5].map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: absoluteUrl(articleUrl(a)),
            name: a.title,
          })),
        },
      },
      breadcrumbLd(CRUMBS),
    ],
    [top10, top5],
  );

  return (
    <>
      <SeoHead
        title={GUIDE_H1}
        description={GUIDE_DESCRIPTION.slice(0, 158)}
        canonical={absoluteUrl('/guide')}
        keywords={['guide edilizia', 'classifiche top 10', 'top 5 edilizia', 'migliori prodotti costruzioni 2026']}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs crumbs={CRUMBS} />

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{GUIDE_H1}</h1>
          <p className="mt-4 leading-relaxed text-neutral-700">{GUIDE_DESCRIPTION}</p>
          <p className="mt-2 text-sm text-neutral-500">
            {top10.length + top5.length} guide pubblicate: {top10.length} classifiche Top 10 e {top5.length}{' '}
            selezioni Top 5
          </p>
        </header>

        <AdSlot id="leaderboard-guide" format="leaderboard" className="mb-10" />

        <section aria-labelledby="guide-top10-heading" className="mb-14">
          <SectionHeading title="Top 10 — Le classifiche complete" as="h2" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top10.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

        <section aria-labelledby="guide-top5-heading">
          <SectionHeading title="Top 5 — Le selezioni rapide" as="h2" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {top5.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
