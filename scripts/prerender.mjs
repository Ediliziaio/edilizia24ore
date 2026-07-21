/**
 * Static prerender for EDILIZIA 24 ORE.
 *
 * Runs after `vite build` (client bundle in dist/) and
 * `vite build --ssr src/entry-prerender.tsx --outDir dist-ssr`.
 *
 * For every route it renders the React app with react-dom/server,
 * collects the route's SeoHead props (title/meta/canonical/OG/JSON-LD)
 * and writes a fully-populated static HTML file:
 *   dist/index.html, dist/categoria/<cat>/index.html,
 *   dist/articolo/<slug>/index.html, dist/404.html, ...
 * Client hydration (hydrateRoot in src/main.tsx) keeps SPA behavior.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPrerenderRoutes, renderRoute } from '../dist-ssr/entry-prerender.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');

const template = readFileSync(path.join(distDir, 'index.html'), 'utf8');

/** Remove homepage SEO tags from the template head; per-route tags are injected instead. */
function stripTemplateSeo(html) {
  return html
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*\/>/, '')
    .replace(/\s*<meta name="keywords"[^>]*\/>/, '')
    .replace(/\s*<meta name="robots"[^>]*\/>/, '')
    .replace(/\s*<link rel="canonical"[^>]*\/>/, '')
    .replace(/\s*<meta property="og:[^"]*"[^>]*\/>/g, '')
    .replace(/\s*<meta name="twitter:[^"]*"[^>]*\/>/g, '');
}

/** Route -> { file (relative to dist), depth } */
function routeTarget(route) {
  if (route === '/') return { file: 'index.html', depth: 0 };
  if (route === '/404') return { file: '404.html', depth: 0 };
  const segments = route.replace(/^\//, '').split('/');
  return { file: path.join(...segments, 'index.html'), depth: segments.length };
}

/** Fix relative asset URLs (base './') for pages nested in subdirectories. */
function fixRelativeAssets(html, depth) {
  if (depth === 0) return html;
  const prefix = '../'.repeat(depth);
  return html.replace(/(src|href)="\.\//g, `$1="${prefix}`);
}

const baseTemplate = stripTemplateSeo(template);
const routes = getPrerenderRoutes();
let written = 0;
const failures = [];

for (const route of routes) {
  try {
    const { appHtml, headHtml } = renderRoute(route);
    if (!appHtml || appHtml.length < 200) {
      throw new Error(`suspiciously small render output (${appHtml.length} chars)`);
    }
    if (!headHtml.includes('<title>')) {
      throw new Error('no SeoHead props captured (missing <title>)');
    }

    let html = baseTemplate.replace(
      '<div id="root"></div>',
      () => `<div id="root">${appHtml}</div>`,
    );
    html = html.replace('</head>', () => `    ${headHtml}\n  </head>`);

    const { file, depth } = routeTarget(route);
    html = fixRelativeAssets(html, depth);
    const outPath = path.join(distDir, file);
    mkdirSync(path.dirname(outPath), { recursive: true });
    writeFileSync(outPath, html);
    written++;
    console.log(`  ✓ ${route.padEnd(52)} -> dist/${file}`);
  } catch (err) {
    failures.push({ route, error: err.message });
    console.error(`  ✗ ${route}: ${err.message}`);
  }
}

console.log(`\nPrerendered ${written}/${routes.length} routes.`);
if (failures.length) {
  console.error('Failed routes:', failures.map((f) => f.route).join(', '));
  process.exit(1);
}
