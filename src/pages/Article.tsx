import type { SectionBlock } from '@/data/types';
import { useMemo, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryBadge from '@/components/CategoryBadge';
import ArticleVisual from '@/components/ArticleVisual';
import FaqAccordion from '@/components/FaqAccordion';
import AuthorBox from '@/components/AuthorBox';
import ArticleCard from '@/components/ArticleCard';
import AdSlot from '@/components/AdSlot';
import NewsletterBox from '@/components/NewsletterBox';
import ComparisonTable from '@/components/ComparisonTable';
import { articles, getArticleBySlug, getRelated } from '@/data/articles';
import { CATEGORY_LABELS } from '@/data/types';
import {
  absoluteUrl,
  articleParentCrumb,
  articleUrl,
  breadcrumbLd,
  extractRankedList,
  faqPageLd,
  itemListLd,
  formatDateIT,
  headingId,
  newsArticleLd,
} from '@/lib/seo';

/**
 * Renders paragraph text with a tiny inline syntax:
 * - `[anchor](/internal/path)` → crawlable internal <Link>
 * - `[anchor](https://…)` → external link (rel="noopener")
 * - `[anchor](https://… "sponsored")` → paid link (rel="sponsored noopener")
 * - `**text**` → <strong>
 */
const INLINE_RE = /\[([^\]]+)\]\((\/[^)\s]*|https?:\/\/[^)\s]+)(?:\s+"([^"]*)")?\)|\*\*(.+?)\*\*/g;
const LINK_CLS =
  'font-medium text-brand underline decoration-brand/40 underline-offset-2 transition-colors hover:text-ink hover:decoration-ink';

function renderInlineLinks(text: string): ReactNode {
  INLINE_RE.lastIndex = 0;
  if (!INLINE_RE.test(text)) return text;
  INLINE_RE.lastIndex = 0;

  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[4] !== undefined) {
      parts.push(<strong key={key++}>{m[4]}</strong>);
    } else if (m[2].startsWith('/')) {
      parts.push(
        <Link key={key++} to={m[2]} className={LINK_CLS}>
          {m[1]}
        </Link>,
      );
    } else {
      parts.push(
        <a
          key={key++}
          href={m[2]}
          target="_blank"
          rel={m[3] === 'sponsored' ? 'sponsored noopener' : 'noopener'}
          className={LINK_CLS}
        >
          {m[1]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function renderSectionBlock(b: SectionBlock, j: number): ReactNode {
  switch (b.type) {
    case 'p':
      return <p key={j}>{renderInlineLinks(b.text)}</p>;
    case 'h3':
      return (
        <h3 key={j} className="mb-2 mt-6 font-serif text-xl font-bold text-ink">
          {b.text}
        </h3>
      );
    case 'list': {
      const ListTag = b.ordered ? 'ol' : 'ul';
      return (
        <ListTag key={j} className={`my-4 space-y-1.5 pl-6 ${b.ordered ? 'list-decimal' : 'list-disc'}`}>
          {b.items.map((item, k) => (
            <li key={k}>{renderInlineLinks(item)}</li>
          ))}
        </ListTag>
      );
    }
    case 'table':
      return (
        <div key={j} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-[15px]">
            <thead>
              <tr>
                {b.headers.map((h, k) => (
                  <th key={k} className="border-b-2 border-ink/80 px-3 py-2 text-left align-bottom font-semibold text-ink">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, k) => (
                <tr key={k}>
                  {row.map((cell, c) => (
                    <td key={c} className="border-b border-neutral-200 px-3 py-2 align-top">
                      {renderInlineLinks(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default function Article() {
  const { slug = '' } = useParams();
  const article = getArticleBySlug(slug);

  const related = useMemo(() => (article ? getRelated(article, 4) : []), [article]);
  const piuLetti = useMemo(() => articles.slice(0, 5), []);

  const jsonLd = useMemo(() => {
    if (!article) return [];
    const crumbs = [
      { name: 'Home', path: '/' },
      articleParentCrumb(article),
      { name: article.title, path: articleUrl(article) },
    ];
    return [
      newsArticleLd(article),
      faqPageLd(article),
      itemListLd(article),
      breadcrumbLd(crumbs),
    ].filter(Boolean) as Record<string, unknown>[];
  }, [article]);

  const rankedList = useMemo(
    () => (article && (article.category === 'top-10' || article.category === 'top-5') ? extractRankedList(article) : []),
    [article],
  );

  if (!article) return <Navigate to="/404" replace />;

  const h1 = article.h1 ?? article.title;
  const crumbs = [
    { name: 'Home', path: '/' },
    articleParentCrumb(article),
    { name: article.title, path: articleUrl(article) },
  ];

  return (
    <>
      <SeoHead
        title={article.title}
        description={article.excerpt}
        canonical={absoluteUrl(articleUrl(article))}
        ogType="article"
        {...(article.image
          ? { ogImage: absoluteUrl(article.image.src), ogImageWidth: 1200, ogImageHeight: 675 }
          : {})}
        keywords={article.keywords}
        publishedTime={article.publishedAt}
        modifiedTime={article.updatedAt}
        author={article.author.name}
        section={CATEGORY_LABELS[article.category]}
        jsonLd={jsonLd}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Main column */}
          <div className="lg:col-span-2">
            <Breadcrumbs crumbs={crumbs} />

            <article itemScope itemType="https://schema.org/NewsArticle">
              <header className="mb-6">
                <CategoryBadge category={article.category} subcategory={article.subcategory} size="md" />
                <h1
                  itemProp="headline"
                  className="mt-3 font-serif text-3xl font-bold leading-tight text-ink sm:text-4xl"
                >
                  {h1}
                </h1>
                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-neutral-600">
                  <span>
                    Di{' '}
                    <strong className="text-ink" itemProp="author">
                      {article.author.name}
                    </strong>
                    {article.author.role ? `, ${article.author.role}` : ''}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Pubblicato il{' '}
                    <time dateTime={article.publishedAt} itemProp="datePublished">
                      {formatDateIT(article.publishedAt)}
                    </time>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Aggiornato il{' '}
                    <time dateTime={article.updatedAt} itemProp="dateModified">
                      {formatDateIT(article.updatedAt)}
                    </time>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{article.readingTime} min di lettura</span>
                </p>
              </header>

              <ArticleVisual
                article={article}
                priority
                sizes="(min-width: 1024px) 760px, 100vw"
                className="aspect-[16/9] w-full rounded-md"
              />

              {/* "In breve" answer-first box (AEO/GEO pattern) */}
              <div className="in-breve mt-8" role="note" aria-label="Risposta in breve">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-brand">In breve</p>
                <p itemProp="description">{article.excerpt}</p>
              </div>

              {/* Ranked list early in the page for Top-N articles (GEO: listicle extraction) */}
              {rankedList.length > 0 && (
                <section aria-labelledby="classifica-heading" className="mt-8 rounded-md border border-neutral-200 bg-white p-5">
                  <h2 id="classifica-heading" className="font-serif text-xl font-bold text-ink">
                    La classifica in sintesi
                  </h2>
                  <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] text-neutral-800">
                    {rankedList.map((item, i) => (
                      <li key={i} className="pl-1 marker:font-bold marker:text-brand">
                        {item}
                      </li>
                    ))}
                  </ol>
                </section>
              )}

              {/* Editorial comparison table for Top-N articles (table rich snippets) */}
              {article.table && (
                <section aria-labelledby="tabella-confronto-heading" className="mt-8">
                  <h2 id="tabella-confronto-heading" className="font-serif text-xl font-bold text-ink">
                    La tabella comparativa
                  </h2>
                  <p className="mt-2 text-[15px] text-neutral-700">
                    Per confrontare a colpo d&apos;occhio i protagonisti della classifica, ecco la
                    tabella riepilogativa della redazione con prezzi indicativi, punti di forza e
                    destinazione d&apos;uso ideale di ciascuna voce selezionata.
                  </p>
                  <ComparisonTable table={article.table} className="mt-4" />
                </section>
              )}

              {/* Table of contents */}
              <nav aria-label="Indice dell'articolo" className="mt-8 rounded-md bg-neutral-50 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                  Indice dei contenuti
                </p>
                <ol className="mt-3 space-y-1.5 text-[15px]">
                  {article.sections.map((s, i) => (
                    <li key={i}>
                      <a href={`#${headingId(s.heading, i)}`} className="text-ink underline-offset-2 hover:text-brand hover:underline">
                        {s.heading}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#faq-heading-anchor" className="text-ink underline-offset-2 hover:text-brand hover:underline">
                      Domande frequenti
                    </a>
                  </li>
                </ol>
              </nav>

              {/* Body sections with in-article ads after 2nd and 5th section */}
              <div className="article-body mt-10" itemProp="articleBody">
                {article.intro?.map((p, j) => (
                  <p key={`intro-${j}`}>{renderInlineLinks(p)}</p>
                ))}
                {article.sections.map((s, i) => (
                  <section key={i} aria-labelledby={headingId(s.heading, i)} className="mt-10 first:mt-0">
                    <h2 id={headingId(s.heading, i)} className="mb-4 font-serif text-2xl font-bold text-ink">
                      {s.heading}
                    </h2>
                    {s.blocks
                      ? s.blocks.map(renderSectionBlock)
                      : s.paragraphs.map((p, j) => <p key={j}>{renderInlineLinks(p)}</p>)}
                    {(i === 1 || i === 4) && (
                      <AdSlot id={`in-article-${i === 1 ? '1' : '2'}-${article.slug}`} format="in-article" className="my-8" />
                    )}
                  </section>
                ))}
              </div>

              <span id="faq-heading-anchor" aria-hidden="true" />
              <FaqAccordion faq={article.faq} />

              <AuthorBox name={article.author.name} />
            </article>

            {/* Related articles */}
            {related.length > 0 && (
              <section aria-labelledby="related-heading" className="mt-14">
                <h2 id="related-heading" className="mb-6 border-b-2 border-ink pb-2 font-serif text-2xl font-bold uppercase tracking-tight text-ink">
                  <span className="mr-2 inline-block h-5 w-1.5 bg-brand align-middle" aria-hidden="true" />
                  Articoli correlati
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {related.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12">
              <NewsletterBox />
            </div>
          </div>

          {/* Sidebar */}
          <aside aria-label="Pubblicità e articoli più letti" className="lg:col-span-1">
            <AdSlot id={`sidebar-article-${article.slug}`} format="sidebar" sticky className="mb-10" />
            <section aria-labelledby="piu-letti-heading" className="rounded-md border border-neutral-200 p-5">
              <h2 id="piu-letti-heading" className="mb-2 font-serif text-xl font-bold text-ink">
                Più letti
              </h2>
              <div>
                {piuLetti.map((a) => (
                  <ArticleCard key={a.slug} article={a} variant="compact" />
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
