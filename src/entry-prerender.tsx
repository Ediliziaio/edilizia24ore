import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App';
import { articles } from '@/data/articles';
import { tags } from '@/lib/tags';
import { takeSsrSeoProps, seoPropsToHeadHtml } from '@/components/SeoHead';

export interface PrerenderResult {
  /** Rendered app markup for #root */
  appHtml: string;
  /** Per-route SEO head tags (title, meta, canonical, OG, Twitter, JSON-LD) */
  headHtml: string;
}

/** All indexable routes of the site (+ /404 for the static 404 page). */
export function getPrerenderRoutes(): string[] {
  return [
    '/',
    '/categoria/news',
    '/categoria/bonus-fisco',
    '/categoria/normative',
    '/categoria/mercato',
    '/categoria/innovazione',
    '/categoria/sostenibilita',
    '/guide',
    // Legacy Top-N category URLs stay live and render the Guide hub.
    '/categoria/top-10',
    '/categoria/top-5',
    ...articles.map((a) => `/articolo/${a.slug}`),
    '/cerca',
    ...tags.map((t) => `/tag/${t.slug}`),
    '/metodologia',
    '/chi-siamo',
    '/contatti',
    '/privacy-policy',
    '/cookie-policy',
    '/termini-e-condizioni',
    '/404',
  ];
}

/** Server-render one route and collect its SeoHead props as static head HTML. */
export function renderRoute(url: string): PrerenderResult {
  const appHtml = renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  );
  const seoProps = takeSsrSeoProps();
  return {
    appHtml,
    headHtml: seoProps ? seoPropsToHeadHtml(seoProps) : '',
  };
}
