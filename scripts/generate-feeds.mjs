/**
 * Feed, Google News sitemap & sitemap.xml generator for EDILIZIA 24 ORE.
 *
 * Runs at the END of `npm run build` (after scripts/prerender.mjs):
 *   1. Reads article metadata from src/data/articles/*.ts using the TypeScript
 *      compiler API (typescript is already a devDependency — no extra deps).
 *   2. Derives tags from article keywords (same rule as src/lib/tags.ts:
 *      keyword used by >= 2 articles, top 20 by frequency).
 *   3. Generates, in public/ and dist/ (so they ship with the static build):
 *        - sitemap.xml       (all indexable routes, with real <lastmod>)
 *        - news-sitemap.xml   (Google News spec)
 *        - feed.xml           (RSS 2.0, Italian)
 *
 * URL policy: article/category/tag/page URLs have NO trailing slash, matching
 * the per-route <link rel="canonical"> tags and vercel.json trailingSlash:false.
 *
 * News sitemap window: articles published in the last 48 hours relative to
 * build time. If none match (build-time dates vs article dates may not align
 * in this demo), the 5 most recent articles are included with an XML comment.
 */
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const articlesDir = path.join(rootDir, 'src', 'data', 'articles');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

const SITE_URL = 'https://www.edilizia24ore.it';
const SITE_NAME = 'Edilizia 24 Ore';
const SITE_DESCRIPTION =
  "Il portale dell'edilizia italiana: news quotidiane su bonus edilizi, normative, mercato immobiliare, innovazione e sostenibilità, più guide e classifiche per professionisti e privati.";

/* ------------------------------------------------------------------ */
/* Article metadata extraction (TypeScript AST, regex-free)            */
/* ------------------------------------------------------------------ */

/** Extract a plain JS value from a TS expression node (strings, numbers, objects, arrays). */
function nodeValue(node) {
  if (!node) return undefined;
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(nodeValue);
  if (ts.isObjectLiteralExpression(node)) {
    const obj = {};
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
        obj[prop.name.text] = nodeValue(prop.initializer);
      }
    }
    return obj;
  }
  return undefined;
}

/** Parse one article module and return its metadata object (the `Article` literal). */
function parseArticleFile(filePath) {
  const source = readFileSync(filePath, 'utf8');
  const sf = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true);
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!decl.initializer || !ts.isObjectLiteralExpression(decl.initializer)) continue;
      const obj = nodeValue(decl.initializer);
      if (obj && typeof obj.slug === 'string') return obj;
    }
  }
  throw new Error(`no Article object literal found in ${filePath}`);
}

function loadArticles() {
  const files = readdirSync(articlesDir)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts')
    .sort();
  const articles = files.map((f) => parseArticleFile(path.join(articlesDir, f)));
  articles.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  return articles;
}

/* ------------------------------------------------------------------ */
/* Tags (mirror of src/lib/tags.ts: keyword used by >= 2 articles, top 20) */
/* ------------------------------------------------------------------ */

const TAG_MIN_ARTICLES = 2;
const TAG_LIMIT = 20;

function slugifyTag(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildTags(articles) {
  const freq = new Map();
  for (const article of articles) {
    const seen = new Set();
    for (const keyword of article.keywords ?? []) {
      const key = String(keyword).trim().toLowerCase();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      freq.set(key, (freq.get(key) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .filter(([, count]) => count >= TAG_MIN_ARTICLES)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'it'))
    .slice(0, TAG_LIMIT)
    .map(([key]) => slugifyTag(key));
}

/* ------------------------------------------------------------------ */
/* XML helpers                                                          */
/* ------------------------------------------------------------------ */

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const CATEGORY_LABELS = { 'top-10': 'Top 10', 'top-5': 'Top 5', news: 'News' };
const categoryLabel = (a) => a.subcategory || CATEGORY_LABELS[a.category] || a.category;

/* ------------------------------------------------------------------ */
/* sitemap.xml (all indexable routes, with real lastmod)               */
/* ------------------------------------------------------------------ */

/** Editorial roster slugs — must mirror src/data/authors.ts. */
const AUTHOR_SLUGS = ['marco-ferrante', 'elena-riva', 'giulia-bianchi', 'paolo-moretti'];

function buildSitemap(articles, tagSlugs) {
  // Site-wide freshness = most recent article update.
  const latest = articles
    .map((a) => new Date(a.updatedAt || a.publishedAt).getTime())
    .reduce((max, t) => (t > max ? t : max), 0);
  const latestIso = new Date(latest).toISOString();

  const urls = [];
  const push = (loc, { lastmod, changefreq, priority } = {}) =>
    urls.push({ loc, lastmod, changefreq, priority });

  push('/', { lastmod: latestIso, changefreq: 'daily', priority: '1.0' });
  push('/categoria/news', { lastmod: latestIso, changefreq: 'daily', priority: '0.9' });
  for (const slug of ['bonus-fisco', 'normative', 'mercato', 'innovazione', 'sostenibilita']) {
    push(`/categoria/${slug}`, { lastmod: latestIso, changefreq: 'daily', priority: '0.8' });
  }
  push('/guide', { lastmod: latestIso, changefreq: 'weekly', priority: '0.8' });

  for (const a of articles) {
    push(`/articolo/${a.slug}`, {
      lastmod: new Date(a.updatedAt || a.publishedAt).toISOString(),
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  for (const slug of tagSlugs) {
    push(`/tag/${slug}`, { lastmod: latestIso, changefreq: 'weekly', priority: '0.6' });
  }

  for (const slug of AUTHOR_SLUGS) {
    push(`/autore/${slug}`, { lastmod: latestIso, changefreq: 'weekly', priority: '0.5' });
  }

  push('/chi-siamo', { lastmod: latestIso, priority: '0.5' });
  push('/contatti', { priority: '0.4' });
  push('/privacy-policy', { changefreq: 'yearly', priority: '0.3' });
  push('/cookie-policy', { changefreq: 'yearly', priority: '0.3' });
  push('/termini-e-condizioni', { changefreq: 'yearly', priority: '0.3' });

  const body = urls
    .map(({ loc, lastmod, changefreq, priority }) => {
      const parts = [`<loc>${SITE_URL}${escapeXml(loc)}</loc>`];
      if (lastmod) parts.push(`<lastmod>${lastmod}</lastmod>`);
      if (changefreq) parts.push(`<changefreq>${changefreq}</changefreq>`);
      if (priority) parts.push(`<priority>${priority}</priority>`);
      return `  <url>${parts.join('')}</url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

/* ------------------------------------------------------------------ */
/* Google News sitemap                                                  */
/* ------------------------------------------------------------------ */

function buildNewsSitemap(articles, buildTime) {
  // Google News spec: ONLY articles published in the last 48 hours. Padding the
  // file with older posts produces "article too old" errors in Search Console,
  // so when nothing is recent we ship a valid, empty urlset.
  const windowMs = 48 * 60 * 60 * 1000;
  const now = buildTime.getTime();
  const selected = articles.filter((a) => {
    const t = new Date(a.publishedAt).getTime();
    return t <= now && now - t <= windowMs;
  });

  if (selected.length === 0) {
    console.warn('  ! news-sitemap: nessun articolo pubblicato nelle ultime 48h (urlset vuoto)');
  }

  const items = selected
    .map(
      (a) => `  <url>
    <loc>${SITE_URL}/articolo/${escapeXml(a.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(SITE_NAME)}</news:name>
        <news:language>it</news:language>
      </news:publication>
      <news:publication_date>${new Date(a.publishedAt).toISOString()}</news:publication_date>
      <news:title>${escapeXml(a.title)}</news:title>
    </news:news>
  </url>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>
`;
}

/* ------------------------------------------------------------------ */
/* RSS 2.0 feed                                                         */
/* ------------------------------------------------------------------ */

function buildRss(articles, buildTime) {
  const items = articles
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/articolo/${escapeXml(a.slug)}</link>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/articolo/${escapeXml(a.slug)}</guid>
      <category>${escapeXml(categoryLabel(a))}</category>
      <author>${escapeXml(a.author?.name || SITE_NAME)}</author>
    </item>`,
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}/</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>it</language>
    <lastBuildDate>${buildTime.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

/* ------------------------------------------------------------------ */
/* Main                                                                 */
/* ------------------------------------------------------------------ */

const buildTime = new Date();
const articles = loadArticles();
const tagSlugs = buildTags(articles);
console.log(
  `Loaded ${articles.length} articles from src/data/articles (${tagSlugs.length} tags)`,
);

mkdirSync(publicDir, { recursive: true });
const sitemapXml = buildSitemap(articles, tagSlugs);
const newsXml = buildNewsSitemap(articles, buildTime);
const rssXml = buildRss(articles, buildTime);

const outputs = [
  ['sitemap.xml', sitemapXml],
  ['news-sitemap.xml', newsXml],
  ['feed.xml', rssXml],
];

const distExists = readdirSyncSafe(distDir);
for (const [name, xml] of outputs) {
  writeFileSync(path.join(publicDir, name), xml);
  console.log(`  ✓ public/${name}`);
  // Copy into dist/ so the files ship with the static build (script runs AFTER
  // vite build has already copied a now-stale public/ into dist/).
  if (distExists) {
    copyFileSync(path.join(publicDir, name), path.join(distDir, name));
    console.log(`  ✓ dist/${name}`);
  }
}
if (!distExists) {
  console.warn('  ! dist/ not found — skipped copying into dist (run after vite build + prerender)');
}

function readdirSyncSafe(dir) {
  try {
    readdirSync(dir);
    return true;
  } catch {
    return false;
  }
}
