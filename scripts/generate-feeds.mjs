/**
 * Feed & Google News sitemap generator for EDILIZIA 24 ORE.
 *
 * Runs at the END of `npm run build` (after scripts/prerender.mjs):
 *   1. Reads article metadata from src/data/articles/*.ts using the TypeScript
 *      compiler API (typescript is already a devDependency — no extra deps).
 *   2. Generates public/news-sitemap.xml (Google News spec) and
 *      public/feed.xml (RSS 2.0, Italian).
 *   3. Copies both into dist/ so they ship with the static build.
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

/** Extract a plain JS value from a TS expression node (string literals + nested objects). */
function nodeValue(node) {
  if (!node) return undefined;
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isObjectLiteralExpression(node)) {
    const obj = {};
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name)) {
        obj[prop.name.text] = nodeValue(prop.initializer);
      }
    }
    return obj;
  }
  if (ts.isNumericLiteral(node)) return Number(node.text);
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
/* Google News sitemap                                                  */
/* ------------------------------------------------------------------ */

function buildNewsSitemap(articles, buildTime) {
  const windowMs = 48 * 60 * 60 * 1000;
  const now = buildTime.getTime();
  let selected = articles.filter((a) => {
    const t = new Date(a.publishedAt).getTime();
    return t <= now && now - t <= windowMs;
  });

  let fallbackComment = '';
  if (selected.length === 0) {
    selected = articles.slice(0, 5);
    fallbackComment =
      `  <!-- No articles published within the last 48 hours relative to build time\n` +
      `       (${buildTime.toISOString()}). Including the 5 most recent articles instead\n` +
      `       (demo data: article dates and build time do not align). -->\n`;
  }

  const items = selected
    .map(
      (a) => `  <url>
    <loc>${SITE_URL}/articolo/${escapeXml(a.slug)}/</loc>
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
${fallbackComment}${items}
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
      <link>${SITE_URL}/articolo/${escapeXml(a.slug)}/</link>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${SITE_URL}/articolo/${escapeXml(a.slug)}/</guid>
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
console.log(`Loaded ${articles.length} articles from src/data/articles`);

mkdirSync(publicDir, { recursive: true });
const newsXml = buildNewsSitemap(articles, buildTime);
const rssXml = buildRss(articles, buildTime);

writeFileSync(path.join(publicDir, 'news-sitemap.xml'), newsXml);
writeFileSync(path.join(publicDir, 'feed.xml'), rssXml);
console.log('  ✓ public/news-sitemap.xml');
console.log('  ✓ public/feed.xml');

// Copy into dist/ so the files ship with the static build (script runs AFTER prerender).
if (readdirSyncSafe(distDir)) {
  copyFileSync(path.join(publicDir, 'news-sitemap.xml'), path.join(distDir, 'news-sitemap.xml'));
  copyFileSync(path.join(publicDir, 'feed.xml'), path.join(distDir, 'feed.xml'));
  console.log('  ✓ dist/news-sitemap.xml');
  console.log('  ✓ dist/feed.xml');
} else {
  console.warn('  ! dist/ not found — skipped copying feeds (run after vite build + prerender)');
}

function readdirSyncSafe(dir) {
  try {
    readdirSync(dir);
    return true;
  } catch {
    return false;
  }
}
