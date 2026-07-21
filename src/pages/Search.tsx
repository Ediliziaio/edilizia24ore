import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import SeoHead from '@/components/SeoHead';
import SearchBox from '@/components/SearchBox';
import ArticleCard from '@/components/ArticleCard';
import { articles } from '@/data/articles';
import { SITE_URL, type Article } from '@/data/types';
import { tags, tagUrl } from '@/lib/tags';

const POPULAR_LINKS = [
  { to: '/categoria/bonus-fisco', label: 'Bonus & Fisco' },
  { to: '/categoria/normative', label: 'Normative' },
  { to: '/categoria/mercato', label: 'Mercato' },
  { to: '/categoria/innovazione', label: 'Innovazione' },
  { to: '/categoria/sostenibilita', label: 'Sostenibilità' },
  { to: '/guide', label: 'Guide e classifiche' },
];

/** Accent-insensitive lowercase folding for search matching. */
function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Instant client-side search across all articles.
 * Every query term must match somewhere (AND); ranking prefers title hits,
 * then keywords, then excerpt/subcategory.
 */
export function searchArticles(query: string): Article[] {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored: { article: Article; score: number }[] = [];
  for (const article of articles) {
    const title = fold(article.title);
    const keywords = fold(article.keywords.join(' '));
    const excerpt = fold(article.excerpt);
    const subcategory = fold(article.subcategory ?? '');
    let score = 0;
    let matched = true;
    for (const term of terms) {
      if (title.includes(term)) score += 3;
      else if (keywords.includes(term)) score += 2;
      else if (excerpt.includes(term) || subcategory.includes(term)) score += 1;
      else {
        matched = false;
        break;
      }
    }
    if (matched) scored.push({ article, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.article);
}

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const trimmed = query.trim();

  const results = useMemo(() => searchArticles(trimmed), [trimmed]);

  // Instant search: typing updates the ?q= URL param (replace: no history spam,
  // URL stays shareable at every keystroke).
  const handleQueryChange = (next: string) => {
    setSearchParams(next.trim() ? { q: next } : {}, { replace: true });
  };

  return (
    <>
      <SeoHead
        title="Cerca"
        description="Cerca tra le news, le guide e le classifiche di Edilizia 24 Ore: bonus edilizi, normative, mercato immobiliare, innovazione e sostenibilità."
        canonical={`${SITE_URL}/cerca`}
        robots="noindex, follow"
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-8 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Cerca nel sito
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600 sm:text-base">
            Cerca per titolo, argomento o parola chiave tra tutti gli articoli di Edilizia 24 Ore.
          </p>
          <div className="mt-5">
            <SearchBox
              id="search-page-input"
              size="lg"
              autoFocus
              value={query}
              onValueChange={handleQueryChange}
            />
          </div>
        </header>

        {trimmed ? (
          <section aria-label="Risultati di ricerca">
            <p role="status" className="mb-6 text-sm text-neutral-600">
              {results.length === 0 ? (
                <>
                  Nessun risultato per <strong className="text-ink">«{trimmed}»</strong>
                </>
              ) : (
                <>
                  <strong className="text-ink">
                    {results.length} {results.length === 1 ? 'risultato' : 'risultati'}
                  </strong>{' '}
                  per <strong className="text-ink">«{trimmed}»</strong>
                </>
              )}
            </p>

            {results.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border-2 border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
                <h2 className="font-serif text-xl font-bold text-ink">Nessun risultato</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
                  Prova con parole più generiche (es. «bonus», «fotovoltaico», «cappotto
                  termico») oppure esplora le sezioni più lette del portale.
                </p>
                <nav aria-label="Sezioni popolari" className="mt-6 flex flex-wrap justify-center gap-2">
                  {POPULAR_LINKS.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-brand hover:text-brand"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </section>
        ) : (
          <section aria-label="Suggerimenti di ricerca" className="space-y-10">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                Tag più cercati
              </h2>
              <nav aria-label="Tag popolari" className="mt-3 flex flex-wrap gap-2">
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
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
                Sezioni popolari
              </h2>
              <nav aria-label="Sezioni popolari" className="mt-3 flex flex-wrap gap-2">
                {POPULAR_LINKS.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="rounded-full border border-neutral-300 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-brand hover:text-brand"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
