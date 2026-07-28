import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import SeoHead from '@/components/SeoHead';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleCard from '@/components/ArticleCard';
import NotFound from '@/pages/NotFound';
import { articles } from '@/data/articles';
import { authorUrl, getAuthorBySlug, type Author } from '@/data/authors';
import { SITE_NAME, SITE_URL } from '@/data/types';
import { absoluteUrl, breadcrumbLd, publisherOrganizationLd } from '@/lib/seo';

export default function Autore() {
  const { slug = '' } = useParams();
  const author = getAuthorBySlug(slug);
  if (!author) return <NotFound />;
  return <AuthorPage author={author} />;
}

function initialsOf(name: string): string {
  return name
    .replace(/^(Ing\.|Dott\.ssa|Dott\.|Arch\.|Geom\.|Avv\.)\s*/i, '')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function AuthorPage({ author }: { author: Author }) {
  const list = useMemo(
    () => articles.filter((a) => a.author.name === author.name),
    [author.name],
  );

  const url = absoluteUrl(authorUrl(author));
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Redazione', path: '/chi-siamo' },
    { name: author.name, path: authorUrl(author) },
  ];

  // Person entity: connects every byline to a verifiable author (E-E-A-T).
  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${url}#person`,
    name: author.name,
    url,
    jobTitle: author.role,
    description: author.bio,
    knowsAbout: author.expertise,
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'professional',
      name: author.credential,
    },
    worksFor: publisherOrganizationLd,
    mainEntityOfPage: { '@type': 'ProfilePage', '@id': url },
  };

  const profileLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': url,
    name: `${author.name} — ${SITE_NAME}`,
    mainEntity: { '@id': `${url}#person` },
    isPartOf: { '@id': `${SITE_URL}/#website` },
  };

  return (
    <>
      <SeoHead
        title={`${author.name} — ${author.role}`}
        description={author.bio}
        canonical={url}
        keywords={author.expertise}
        jsonLd={[personLd, profileLd, breadcrumbLd(crumbs)]}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs crumbs={crumbs} />

        <header className="mt-2 flex flex-col gap-4 border-b border-neutral-200 pb-8 sm:flex-row sm:items-start sm:gap-6">
          <div
            aria-hidden="true"
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-2xl font-bold text-white"
          >
            {initialsOf(author.name)}
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">{author.name}</h1>
            <p className="mt-1 text-sm font-semibold uppercase tracking-wider text-brand">
              {author.role} · {author.credential}
            </p>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-neutral-700">
              {author.bio}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {author.expertise.map((topic) => (
                <li
                  key={topic}
                  className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold text-ink"
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </header>

        <section aria-labelledby="articoli-autore" className="mt-8">
          <h2 id="articoli-autore" className="mb-5 font-serif text-2xl font-bold text-ink">
            Articoli di {author.name}{' '}
            <span className="text-base font-normal text-neutral-500">({list.length})</span>
          </h2>
          {list.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-600">Nessun articolo pubblicato al momento.</p>
          )}
        </section>

        <p className="mt-10 text-sm text-neutral-600">
          Tutti gli articoli sono verificati prima della pubblicazione secondo la{' '}
          <Link to="/chi-siamo" className="font-medium text-brand underline">
            linea editoriale della redazione
          </Link>
          .
        </p>
      </div>
    </>
  );
}
