import { authorUrl, getAuthorByName } from '@/data/authors';
import {
  SITE_URL,
  CATEGORY_LABELS,
  NEWS_SUBCATEGORY_SLUG_BY_NAME,
  type Article,
  type NewsSubcategory,
} from '@/data/types';

export function formatDateIT(iso: string): string {
  return new Intl.DateTimeFormat('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

export function categoryUrl(category: Article['category']): string {
  return `/categoria/${category}`;
}

export function newsSubcategoryUrl(subcategory: NewsSubcategory): string {
  return `/categoria/${NEWS_SUBCATEGORY_SLUG_BY_NAME[subcategory]}`;
}

/** Parent section crumb for an article: news subcategory page, /guide for Top-N, /categoria/news as fallback. */
export function articleParentCrumb(
  article: Pick<Article, 'category' | 'subcategory'>,
): { name: string; path: string } {
  if (article.category === 'news') {
    if (article.subcategory) {
      return { name: article.subcategory, path: newsSubcategoryUrl(article.subcategory) };
    }
    return { name: CATEGORY_LABELS.news, path: '/categoria/news' };
  }
  return { name: 'Guide e Classifiche', path: '/guide' };
}

export function articleUrl(article: Pick<Article, 'slug'>): string {
  return `/articolo/${article.slug}`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/** Tronca un testo per meta description (max ~160 char). */
export function metaDescription(text: string, max = 158): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

/** Slug sicuro per ancore TOC da un heading. */
export function headingId(heading: string, index: number): string {
  const base = heading
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${base || 'sezione'}-${index}`;
}

/** Estrae la lista ordinata (1. 2. 3. ...) dal primo paragrafo numerato di un articolo Top-N. */
export function extractRankedList(article: Article): string[] {
  const pattern = /(\d+)\)\s*([^;]+);?/g;
  for (const section of article.sections) {
    for (const p of section.paragraphs) {
      const matches = [...p.matchAll(pattern)];
      if (matches.length >= (article.category === 'top-10' ? 10 : 5)) {
        return matches.map((m) => m[2].trim());
      }
    }
  }
  return [];
}

export const publisherOrganizationLd = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Edilizia 24 Ore',
  url: SITE_URL + '/',
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 640,
    height: 187,
  },
  // Publisher identity: resolves the site to a real, accountable legal entity.
  publishingPrinciples: `${SITE_URL}/chi-siamo`,
  parentOrganization: {
    '@type': 'Organization',
    name: 'Domus Group S.r.l.',
    vatID: 'IT13132010961',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Via Aurelio Saffi 29',
      postalCode: '20123',
      addressLocality: 'Milano',
      addressRegion: 'MI',
      addressCountry: 'IT',
    },
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'editorial',
    email: 'redazione@edilizia24ore.it',
    availableLanguage: ['it'],
  },
};

export function newsArticleLd(article: Article): Record<string, unknown> {
  const url = absoluteUrl(articleUrl(article));
  // Evergreen rankings are not news: NewsArticle only for dated reporting.
  const type = article.category === 'news' ? 'NewsArticle' : 'Article';
  const author = getAuthorByName(article.author.name);
  const image = article.image
    ? [
        {
          '@type': 'ImageObject',
          url: absoluteUrl(article.image.src),
          width: 1200,
          height: 675,
          caption: article.image.alt,
        },
      ]
    : [`${SITE_URL}/logo.png`];
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#article`,
    headline: article.title,
    description: article.excerpt,
    image,
    author: author
      ? {
          '@type': 'Person',
          '@id': `${absoluteUrl(authorUrl(author))}#person`,
          name: author.name,
          url: absoluteUrl(authorUrl(author)),
          jobTitle: author.role,
          knowsAbout: author.expertise,
        }
      : {
          '@type': 'Person',
          name: article.author.name,
          jobTitle: article.author.role,
        },
    publisher: publisherOrganizationLd,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: 'it-IT',
    articleSection: CATEGORY_LABELS[article.category],
    keywords: article.keywords.join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.in-breve', 'article h1'],
    },
  };
}

/**
 * Ranked-list schema for the Top-10 / Top-5 comparisons.
 *
 * Makes the ranking machine-readable: the position, the entry name and, when a
 * comparison table exists, the criteria each entry was judged on. This is the
 * site's own comparative work, so it is declared as an ItemList rather than as
 * Product/Review markup, which would imply first-hand testing we do not claim.
 */
export function itemListLd(article: Article): Record<string, unknown> | null {
  if (article.category !== 'top-10' && article.category !== 'top-5') return null;
  // The comparison table is the reliable source: its first column holds the
  // ranked entries. Fall back to the inline numbered list when there is no
  // table (only a couple of articles use that older format).
  const fromTable = article.table?.rows.map((r) => r[0]).filter(Boolean) ?? [];
  const items = fromTable.length ? fromTable : extractRankedList(article);
  if (!items.length) return null;
  const url = absoluteUrl(articleUrl(article));
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${url}#classifica`,
    name: article.table?.caption ?? article.title,
    description: article.excerpt,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: items.length,
    inLanguage: 'it-IT',
    mainEntityOfPage: { '@id': url },
    ...(article.table ? { about: article.table.columns.slice(1).join(', ') } : {}),
    itemListElement: items.map((name, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
    })),
  };
}

export function faqPageLd(article: Article): Record<string, unknown> | null {
  if (!article.faq?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbLd(crumbs: Crumb[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}
