import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import SectionHeading from '@/components/SectionHeading';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import GuideHub from '@/components/GuideHub';
import { getByCategory } from '@/data/articles';
import {
  CATEGORY_DESCRIPTIONS,
  CATEGORY_LABELS,
  NEWS_SUBCATEGORY_BY_SLUG,
  NEWS_SUBCATEGORY_DESCRIPTIONS,
  NEWS_SUBCATEGORY_H1,
  NEWS_SUBCATEGORY_SLUGS,
  type NewsSubcategory,
  type NewsSubcategorySlug,
} from '@/data/types';
import { absoluteUrl, articleUrl, breadcrumbLd, newsSubcategoryUrl } from '@/lib/seo';

const NEWS_H1 = "News: tutte le notizie dall'edilizia italiana";

const NEWS_SUBCATEGORIES: NewsSubcategory[] = [
  'Bonus & Fisco',
  'Normative',
  'Mercato',
  'Innovazione',
  'Sostenibilità',
];

export default function Category() {
  const { category = '' } = useParams();

  // Legacy Top 10 / Top 5 category URLs keep working: render the Guide hub there
  // (canonical points to /guide).
  if (category === 'top-10' || category === 'top-5') return <GuideHub />;

  if (category === 'news') return <AllNews />;

  if ((NEWS_SUBCATEGORY_SLUGS as string[]).includes(category)) {
    return <NewsSubcategoryPage slug={category as NewsSubcategorySlug} />;
  }

  return <Navigate to="/404" replace />;
}

/* ------------------------------------------------------------------ */
/* /categoria/news — all news, grouped by subcategory                  */
/* ------------------------------------------------------------------ */

function AllNews() {
  const list = useMemo(() => getByCategory('news'), []);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: CATEGORY_LABELS.news, path: '/categoria/news' },
  ];

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: NEWS_H1,
        description: CATEGORY_DESCRIPTIONS.news,
        url: absoluteUrl('/categoria/news'),
        inLanguage: 'it-IT',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: list.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: absoluteUrl(articleUrl(a)),
            name: a.title,
          })),
        },
      },
      breadcrumbLd(crumbs),
    ],
    [list],
  );

  return (
    <>
      <SeoHead
        title={`${NEWS_H1} | Edilizia 24 Ore`}
        description={CATEGORY_DESCRIPTIONS.news.slice(0, 158)}
        canonical={absoluteUrl('/categoria/news')}
        keywords={['news edilizia', 'notizie costruzioni', 'bonus edilizi', 'normative edilizia 2026']}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{NEWS_H1}</h1>
          <p className="mt-4 leading-relaxed text-neutral-700">{CATEGORY_DESCRIPTIONS.news}</p>
          <p className="mt-2 text-sm text-neutral-500">
            {list.length} {list.length === 1 ? 'articolo pubblicato' : 'articoli pubblicati'}
          </p>
        </header>

        <AdSlot id="leaderboard-category-news" format="leaderboard" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {NEWS_SUBCATEGORIES.map((sub) => {
              const subList = list.filter((a) => a.subcategory === sub);
              if (!subList.length) return null;
              return (
                <section key={sub} aria-labelledby={`news-sub-${sub}`} className="mb-12">
                  <SectionHeading
                    title={sub}
                    as="h2"
                    moreLink={newsSubcategoryUrl(sub)}
                    moreLabel={`Tutte le news su ${sub}`}
                  />
                  <div>
                    {subList.map((a) => (
                      <ArticleCard key={a.slug} article={a} variant="horizontal" />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>

          <aside aria-label="Contenuti correlati e pubblicità" className="lg:col-span-1">
            <AdSlot id="sidebar-category-news" format="sidebar" sticky />
          </aside>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* /categoria/<subcategory-slug> — one thematic news section           */
/* ------------------------------------------------------------------ */

function NewsSubcategoryPage({ slug }: { slug: NewsSubcategorySlug }) {
  const sub = NEWS_SUBCATEGORY_BY_SLUG[slug];
  const h1 = NEWS_SUBCATEGORY_H1[slug];
  const description = NEWS_SUBCATEGORY_DESCRIPTIONS[slug];

  const list = useMemo(
    () => getByCategory('news').filter((a) => a.subcategory === sub),
    [sub],
  );

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: CATEGORY_LABELS.news, path: '/categoria/news' },
    { name: sub, path: `/categoria/${slug}` },
  ];

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: h1,
        description,
        url: absoluteUrl(`/categoria/${slug}`),
        inLanguage: 'it-IT',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: list.map((a, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: absoluteUrl(articleUrl(a)),
            name: a.title,
          })),
        },
      },
      breadcrumbLd(crumbs),
    ],
    [h1, description, slug, list],
  );

  return (
    <>
      <SeoHead
        title={h1}
        description={description.slice(0, 158)}
        canonical={absoluteUrl(`/categoria/${slug}`)}
        keywords={[`${sub} edilizia`, 'news edilizia', 'costruzioni 2026']}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{h1}</h1>
          <p className="mt-4 leading-relaxed text-neutral-700">{description}</p>
          <p className="mt-2 text-sm text-neutral-500">
            {list.length} {list.length === 1 ? 'articolo pubblicato' : 'articoli pubblicati'}
          </p>
        </header>

        <AdSlot id={`leaderboard-category-${slug}`} format="leaderboard" className="mb-10" />

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div>
              {list.map((a) => (
                <ArticleCard key={a.slug} article={a} variant="horizontal" />
              ))}
            </div>
          </div>

          <aside aria-label="Contenuti correlati e pubblicità" className="lg:col-span-1">
            <AdSlot id={`sidebar-category-${slug}`} format="sidebar" sticky />
          </aside>
        </div>
      </div>
    </>
  );
}
