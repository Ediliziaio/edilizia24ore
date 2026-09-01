import { useMemo } from 'react';
import { Link } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import NewsletterBox from '@/components/NewsletterBox';
import { articles, getByCategory } from '@/data/articles';
import {
  SITE_DESCRIPTION,
  SITE_URL,
  type NewsSubcategory,
} from '@/data/types';
import { absoluteUrl, articleUrl, newsSubcategoryUrl } from '@/lib/seo';

const NEWS_SUBCATEGORIES: NewsSubcategory[] = [
  'Bonus & Fisco',
  'Normative',
  'Mercato',
  'Innovazione',
  'Sostenibilità',
];

const HOME_TITLE = "Edilizia 24 Ore — Bonus edilizi, incentivi e fiscalità della casa";

export default function Home() {
  const data = useMemo(() => {
    const news = getByCategory('news');
    return {
      news,
      featured: news[0],
      secondary: news.slice(1, 4),
      feed: news.slice(4, 10),
      top10: getByCategory('top-10').slice(0, 6),
      top5: getByCategory('top-5').slice(0, 6),
    };
  }, []);

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL + '/',
        name: HOME_TITLE,
        description: SITE_DESCRIPTION,
        inLanguage: 'it-IT',
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Ultime notizie di Edilizia 24 Ore',
        itemListElement: articles.slice(0, 10).map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: absoluteUrl(articleUrl(a)),
          name: a.title,
        })),
      },
    ],
    [],
  );

  return (
    <>
      <SeoHead
        title={HOME_TITLE}
        description={SITE_DESCRIPTION}
        canonical={SITE_URL + '/'}
        {...(data.featured.image
          ? { ogImage: absoluteUrl(data.featured.image.src), ogImageWidth: 1200, ogImageHeight: 675 }
          : {})}
        keywords={['edilizia', 'costruzioni', 'bonus edilizi 2026', 'ristrutturazioni', 'normative edilizia']}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-7xl px-4">
        <AdSlot id="leaderboard-home-top" format="leaderboard" className="my-6" />

        <h1 className="sr-only">
          Edilizia 24 Ore: classifiche comparative, guide e news per l'edilizia italiana
        </h1>

        {/* ULTIME NOTIZIE — chronological feed */}
        <section aria-labelledby="ultime-notizie-heading">
          <SectionHeading
            title="Ultime Notizie"
            moreLink="/categoria/news"
            moreLabel="Tutte le news"
          />
          <Hero featured={data.featured} secondary={data.secondary} />
          <div className="mt-8 grid gap-x-8 sm:grid-cols-2">
            {data.feed.map((a) => (
              <ArticleCard key={a.slug} article={a} variant="horizontal" />
            ))}
          </div>
        </section>

        {/* Category blocks: latest news per thematic section */}
        <section aria-label="News per categoria" className="mt-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {NEWS_SUBCATEGORIES.map((sub) => {
              const list = data.news.filter((a) => a.subcategory === sub).slice(0, 3);
              if (!list.length) return null;
              return (
                <section key={sub} aria-label={`News — ${sub}`}>
                  <h2 className="mb-3 border-b-2 border-ink pb-2 text-lg font-extrabold uppercase tracking-tight text-ink">
                    <span className="mr-2 inline-block h-4 w-1.5 bg-brand align-middle" aria-hidden="true" />
                    <Link
                      to={newsSubcategoryUrl(sub)}
                      className="hover:text-brand"
                      aria-label={`Vai alla sezione ${sub}`}
                    >
                      {sub}
                    </Link>
                  </h2>
                  <div>
                    {list.map((a) => (
                      <ArticleCard key={a.slug} article={a} variant="compact" />
                    ))}
                  </div>
                  <Link
                    to={newsSubcategoryUrl(sub)}
                    className="mt-2 inline-block text-sm font-semibold uppercase tracking-wider text-brand hover:underline"
                  >
                    Tutte le news su {sub} →
                  </Link>
                </section>
              );
            })}
          </div>
        </section>

        <AdSlot id="leaderboard-home-mid" format="leaderboard" className="my-12" />

        {/* Guide e Classifiche */}
        <section aria-labelledby="guide-heading" className="mt-4">
          <SectionHeading
            title="Guide e Classifiche"
            moreLink="/guide"
            moreLabel="Tutte le guide"
          />

          <h3 className="mb-4 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Top 10 — Le classifiche complete
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.top10.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>

          <h3 className="mb-4 mt-10 text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
            Top 5 — Le selezioni rapide
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.top5.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>

        <div className="mt-14">
          <NewsletterBox />
        </div>
      </div>
    </>
  );
}
