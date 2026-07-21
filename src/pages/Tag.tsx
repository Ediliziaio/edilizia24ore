import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleCard from '@/components/ArticleCard';
import {
  getArticlesByTag,
  getRelatedTags,
  getTagBySlug,
  tags,
  tagUrl,
} from '@/lib/tags';
import { absoluteUrl, articleUrl, breadcrumbLd } from '@/lib/seo';

const CATEGORY_LINKS = [
  { to: '/categoria/news', label: 'News' },
  { to: '/categoria/bonus-fisco', label: 'Bonus & Fisco' },
  { to: '/categoria/normative', label: 'Normative' },
  { to: '/categoria/mercato', label: 'Mercato' },
  { to: '/categoria/innovazione', label: 'Innovazione' },
  { to: '/categoria/sostenibilita', label: 'Sostenibilità' },
  { to: '/guide', label: 'Guide' },
];

export default function Tag() {
  const { tag = '' } = useParams();
  const info = getTagBySlug(tag);

  if (!info) return <UnknownTag slug={tag} />;
  return <TagPage slug={tag} />;
}

/* ------------------------------------------------------------------ */
/* Known tag                                                           */
/* ------------------------------------------------------------------ */

function TagPage({ slug }: { slug: string }) {
  const info = getTagBySlug(slug)!;
  const list = useMemo(() => getArticlesByTag(slug), [slug]);
  const related = useMemo(() => getRelatedTags(slug), [slug]);

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Tag', path: '/cerca' },
    { name: info.label, path: tagUrl(info) },
  ];

  const intro = `${list.length} ${
    list.length === 1 ? 'articolo' : 'articoli'
  } su ${info.label}: news, guide e classifiche aggiornate dalla redazione di Edilizia 24 Ore.`;

  const jsonLd = useMemo(
    () => [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Tag: ${info.label}`,
        description: intro,
        url: absoluteUrl(tagUrl(info)),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [info.slug, info.label, intro, list],
  );

  return (
    <>
      <SeoHead
        title={`Tag: ${info.label}`}
        description={`Tutti gli articoli di Edilizia 24 Ore sul tema "${info.label}": news, guide pratiche e classifiche aggiornate per professionisti e privati.`}
        canonical={absoluteUrl(tagUrl(info))}
        keywords={[info.key, 'edilizia', 'costruzioni']}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mb-8 max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-widest text-brand">Tag</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {info.label}
          </h1>
          <p className="mt-3 leading-relaxed text-neutral-700">{intro}</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>

        {related.length > 0 && (
          <nav aria-label="Tag correlati" className="mt-12 border-t border-neutral-200 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink">Tag correlati</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {related.map((t) => (
                <li key={t.slug}>
                  <Link
                    to={tagUrl(t)}
                    className="inline-block rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
                  >
                    {t.label}
                    <span className="ml-1.5 text-neutral-400">({t.count})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Unknown / empty tag — friendly empty state, not a hard 404          */
/* ------------------------------------------------------------------ */

function UnknownTag({ slug }: { slug: string }) {
  return (
    <>
      <SeoHead
        title="Tag non trovato"
        description="Il tag cercato non esiste o non è più disponibile. Esplora i tag e le categorie di Edilizia 24 Ore."
        canonical={absoluteUrl(`/tag/${slug}`)}
        robots="noindex, follow"
      />

      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-serif text-5xl font-bold text-brand" aria-hidden="true">
          #
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-ink">Tag non trovato</h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-neutral-600">
          Il tag <strong className="text-ink">«{slug}»</strong> non corrisponde a nessun
          argomento del portale. Ecco i tag e le sezioni principali per continuare la
          lettura.
        </p>

        {tags.length > 0 && (
          <nav aria-label="Tutti i tag" className="mt-8 flex flex-wrap justify-center gap-2">
            {tags.map((t) => (
              <Link
                key={t.slug}
                to={tagUrl(t)}
                className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
              >
                {t.label}
                <span className="ml-1.5 text-neutral-400">({t.count})</span>
              </Link>
            ))}
          </nav>
        )}

        <nav aria-label="Categorie principali" className="mt-10 flex flex-wrap justify-center gap-3">
          {CATEGORY_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-ink transition-colors hover:border-brand hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
